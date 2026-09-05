import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schools, subscriptionPlans, subscriptions } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId } from "@/lib/id";

export function listPlans(activeOnly = true) {
  const rows = db.select().from(subscriptionPlans).all();
  return activeOnly ? rows.filter((p) => p.isActive).sort((a, b) => a.sortOrder - b.sortOrder) : rows;
}

export function getActiveSubscription(schoolId: string) {
  return (
    db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.schoolId, schoolId))
      .all()
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0] ?? null
  );
}

export function expireOverdueSubscriptions() {
  const now = Date.now();
  const rows = db.select().from(subscriptions).all();
  for (const row of rows) {
    if (["ACTIVE", "TRIAL"].includes(row.status) && row.endsAt.getTime() < now) {
      db.update(subscriptions)
        .set({ status: "EXPIRED", updatedAt: new Date() })
        .where(eq(subscriptions.id, row.id))
        .run();
      db.update(schools)
        .set({ status: "EXPIRED", updatedAt: new Date() })
        .where(eq(schools.id, row.schoolId))
        .run();
    }
  }
}

export function extendSubscription(ctx: AuthContext, schoolId: string, days: number) {
  if (ctx.role !== "SUPER_ADMIN") throw new AppError("FORBIDDEN", "অনুমতি নেই", 403);
  const sub = getActiveSubscription(schoolId);
  if (!sub) throw new AppError("NOT_FOUND", "সাবস্ক্রিপশন পাওয়া যায়নি", 404);
  const endsAt = new Date(Math.max(sub.endsAt.getTime(), Date.now()) + days * 86400000);
  db.update(subscriptions)
    .set({ endsAt, status: "ACTIVE", updatedAt: new Date() })
    .where(eq(subscriptions.id, sub.id))
    .run();
  db.update(schools)
    .set({ status: "ACTIVE", updatedAt: new Date() })
    .where(eq(schools.id, schoolId))
    .run();
  writeAudit({
    ctx,
    schoolId,
    action: "SUBSCRIPTION_EXTENDED",
    module: "subscriptions",
    resource: "subscription",
    resourceId: sub.id,
    after: { days, endsAt },
  });
}

export function createSubscription(opts: {
  schoolId: string;
  planId: string;
  billingCycle: "MONTHLY" | "YEARLY";
  status?: string;
}) {
  const plan = db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, opts.planId)).get();
  if (!plan) throw new AppError("NOT_FOUND", "প্ল্যান পাওয়া যায়নি", 404);
  const startsAt = new Date();
  const days = opts.status === "TRIAL" ? 14 : opts.billingCycle === "YEARLY" ? 365 : 30;
  const endsAt = new Date(startsAt.getTime() + days * 86400000);
  const id = createId();
  db.insert(subscriptions)
    .values({
      id,
      schoolId: opts.schoolId,
      planId: opts.planId,
      status: opts.status ?? "ACTIVE",
      billingCycle: opts.billingCycle,
      startsAt,
      endsAt,
      trialEndsAt: opts.status === "TRIAL" ? endsAt : null,
    })
    .run();
  return db.select().from(subscriptions).where(eq(subscriptions.id, id)).get()!;
}
