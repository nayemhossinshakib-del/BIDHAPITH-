import { desc, eq } from "drizzle-orm";
import { db, sqlite } from "@/db";
import { schools, smsCreditTransactions, smsMessages, smsQueue } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId } from "@/lib/id";
import { assertRateLimit } from "@/lib/rate-limit";
import { smsUnits } from "@/lib/utils";
import { assertSameSchool } from "@/lib/tenant";
import type { SmsProvider } from "@/services/providers/sms/types";
import { getSmsProvider } from "@/services/providers/sms";

export function getBalance(schoolId: string) {
  const school = db.select().from(schools).where(eq(schools.id, schoolId)).get();
  return school?.smsBalance ?? 0;
}

export function addCredits(opts: {
  ctx: AuthContext;
  schoolId: string;
  credits: number;
  type: "CREDIT" | "DEBIT" | "PURCHASE" | "ALLOCATION";
  description: string;
}) {
  if (opts.ctx.role !== "SUPER_ADMIN" && opts.ctx.schoolId !== opts.schoolId) {
    throw new AppError("FORBIDDEN", "এসএমএস ক্রেডিট পরিবর্তনের অনুমতি নেই", 403);
  }
  return sqlite.transaction(() => {
    const school = db.select().from(schools).where(eq(schools.id, opts.schoolId)).get();
    if (!school) throw new AppError("NOT_FOUND", "স্কুল পাওয়া যায়নি", 404);
    const next = school.smsBalance + opts.credits;
    if (next < 0) throw new AppError("INSUFFICIENT_SMS", "পর্যাপ্ত এসএমএস ব্যালেন্স নেই", 400);
    db.update(schools)
      .set({ smsBalance: next, updatedAt: new Date() })
      .where(eq(schools.id, opts.schoolId))
      .run();
    db.insert(smsCreditTransactions)
      .values({
        id: createId(),
        schoolId: opts.schoolId,
        type: opts.type,
        credits: opts.credits,
        balanceBefore: school.smsBalance,
        balanceAfter: next,
        description: opts.description,
        createdBy: opts.ctx.userId,
      })
      .run();
    writeAudit({
      ctx: opts.ctx,
      schoolId: opts.schoolId,
      action: "SMS_CREDIT_CHANGE",
      module: "sms",
      after: { credits: opts.credits, balance: next },
    });
    return next;
  })();
}

export function sendSms(opts: {
  ctx: AuthContext;
  schoolId: string;
  recipient: string;
  mobile: string;
  message: string;
  provider?: SmsProvider;
}) {
  assertSameSchool(opts.ctx, opts.schoolId);
  assertRateLimit(`sms:${opts.schoolId}`, 60, 60_000);
  const units = smsUnits(opts.message);
  const mobile = opts.mobile.replace(/[\s-]/g, "");
  if (!/^01[3-9]\d{8}$/.test(mobile)) {
    throw new AppError("INVALID_MOBILE", "মোবাইল নম্বর সঠিক নয় (01XXXXXXXXX)", 422);
  }

  return sqlite.transaction(() => {
    const school = db.select().from(schools).where(eq(schools.id, opts.schoolId)).get();
    if (!school) throw new AppError("NOT_FOUND", "স্কুল পাওয়া যায়নি", 404);
    if (school.smsBalance < units) {
      throw new AppError("INSUFFICIENT_SMS", "পর্যাপ্ত এসএমএস ব্যালেন্স নেই", 400);
    }
    const recent = db
      .select()
      .from(smsMessages)
      .where(eq(smsMessages.schoolId, opts.schoolId))
      .orderBy(desc(smsMessages.createdAt))
      .limit(20)
      .all();
    const dup = recent.find(
      (m) =>
        m.mobile === mobile &&
        m.message === opts.message &&
        Date.now() - m.createdAt.getTime() < 2 * 60 * 1000,
    );
    if (dup) throw new AppError("DUPLICATE_SMS", "একই এসএমএস সম্প্রতি পাঠানো হয়েছে", 409);

    const next = school.smsBalance - units;
    db.update(schools)
      .set({ smsBalance: next, updatedAt: new Date() })
      .where(eq(schools.id, opts.schoolId))
      .run();
    db.insert(smsCreditTransactions)
      .values({
        id: createId(),
        schoolId: opts.schoolId,
        type: "DEBIT",
        credits: -units,
        balanceBefore: school.smsBalance,
        balanceAfter: next,
        description: `SMS to ${mobile}`,
        createdBy: opts.ctx.userId,
      })
      .run();
    const messageId = createId();
    db.insert(smsMessages)
      .values({
        id: messageId,
        schoolId: opts.schoolId,
        recipient: opts.recipient,
        mobile,
        message: opts.message,
        characterCount: opts.message.length,
        smsCount: units,
        status: "QUEUED",
        sentBy: opts.ctx.userId,
      })
      .run();
    db.insert(smsQueue)
      .values({
        id: createId(),
        schoolId: opts.schoolId,
        messageId,
        nextRunAt: new Date(),
      })
      .run();
    writeAudit({
      ctx: opts.ctx,
      schoolId: opts.schoolId,
      action: "SMS_QUEUED",
      module: "sms",
      resource: "sms_message",
      resourceId: messageId,
    });
    return { messageId, units, balance: next };
  })();
}

export async function processQueue(limit = 25, provider?: SmsProvider) {
  const sms = provider ?? getSmsProvider();
  const jobs = db.select().from(smsQueue).orderBy(smsQueue.nextRunAt).limit(limit).all();
  for (const job of jobs) {
    const msg = db.select().from(smsMessages).where(eq(smsMessages.id, job.messageId)).get();
    if (!msg) {
      db.delete(smsQueue).where(eq(smsQueue.id, job.id)).run();
      continue;
    }
    try {
      const res = await sms.sendSms({ to: msg.mobile, message: msg.message });
      db.update(smsMessages)
        .set({
          status: res.ok ? "SENT" : "FAILED",
          providerRef: res.providerRef ?? null,
          sentAt: new Date(),
        })
        .where(eq(smsMessages.id, msg.id))
        .run();
      db.delete(smsQueue).where(eq(smsQueue.id, job.id)).run();
    } catch {
      db.update(smsQueue)
        .set({ attempts: job.attempts + 1, nextRunAt: new Date(Date.now() + 60_000) })
        .where(eq(smsQueue.id, job.id))
        .run();
      if (job.attempts + 1 >= 5) {
        db.update(smsMessages)
          .set({ status: "FAILED" })
          .where(eq(smsMessages.id, msg.id))
          .run();
        db.delete(smsQueue).where(eq(smsQueue.id, job.id)).run();
      }
    }
  }
}

export function listSms(schoolId: string, page = 1, pageSize = 20) {
  const rows = db
    .select()
    .from(smsMessages)
    .where(eq(smsMessages.schoolId, schoolId))
    .orderBy(desc(smsMessages.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .all();
  return rows;
}
