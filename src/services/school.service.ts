import { desc, eq } from "drizzle-orm";
import { db, sqlite } from "@/db";
import {
  schoolDomains,
  schoolSettings,
  schoolWebsites,
  schools,
  users,
} from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import { hashPassword, passwordStrength } from "@/lib/auth/password";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId, publicCode } from "@/lib/id";
import { slugify } from "@/lib/utils";
import { createSubscription, listPlans } from "@/services/subscription.service";

export function listSchools(opts: { page?: number; pageSize?: number; q?: string; status?: string } = {}) {
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const rows = db.select().from(schools).orderBy(desc(schools.createdAt)).all();
  const filtered = rows.filter((s) => {
    if (opts.status && s.status !== opts.status) return false;
    if (opts.q) {
      const q = opts.q.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return true;
  });
  const start = (page - 1) * pageSize;
  return { rows: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize };
}

export async function registerSchool(input: {
  schoolName: string;
  schoolCode?: string;
  eiin?: string;
  schoolType: string;
  address?: string;
  district?: string;
  division?: string;
  mobile: string;
  email: string;
  slug?: string;
  adminName: string;
  adminEmail: string;
  adminMobile: string;
  password: string;
  planSlug: string;
  billingCycle: "MONTHLY" | "YEARLY";
}) {
  const strength = passwordStrength(input.password);
  if (strength) throw new AppError("WEAK_PASSWORD", strength, 422);

  const slug = slugify(input.slug || input.schoolName);
  if (!slug) throw new AppError("INVALID_SLUG", "ওয়েবসাইট স্লাগ সঠিক নয়", 422);

  const existingSlug = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (existingSlug) throw new AppError("SLUG_TAKEN", "এই ওয়েবসাইট নামটি ইতিমধ্যে ব্যবহৃত", 409);

  const existingEmail = db.select().from(users).where(eq(users.email, input.adminEmail.toLowerCase())).get();
  if (existingEmail) throw new AppError("EMAIL_TAKEN", "এই ইমেইল ইতিমধ্যে ব্যবহৃত", 409);

  const plans = listPlans(false);
  const plan = plans.find((p) => p.slug === input.planSlug);
  if (!plan || !plan.isActive) throw new AppError("PLAN", "প্ল্যান পাওয়া যায়নি", 404);

  const isTrial = plan.slug === "trial" || plan.priceMonthly === 0;
  const passwordHash = await hashPassword(input.password);

  return sqlite.transaction(() => {
    const schoolId = createId();
    const code = input.schoolCode?.trim() || publicCode("SCH", 5);
    db.insert(schools)
      .values({
        id: schoolId,
        name: input.schoolName,
        nameBn: input.schoolName,
        code,
        eiin: input.eiin ?? null,
        type: input.schoolType,
        slug,
        email: input.email.toLowerCase(),
        mobile: input.mobile,
        address: input.address ?? null,
        district: input.district ?? null,
        division: input.division ?? null,
        status: isTrial ? "TRIAL" : "ACTIVE",
        smsBalance: plan.smsAllocation,
      })
      .run();

    db.insert(schoolSettings)
      .values({
        id: createId(),
        schoolId,
        phone: input.mobile,
        email: input.email.toLowerCase(),
      })
      .run();

    db.insert(schoolWebsites)
      .values({
        id: createId(),
        schoolId,
        seoTitle: input.schoolName,
        seoDescription: `${input.schoolName} — অনলাইন ভর্তি ও স্কুল তথ্য`,
        heroTitle: input.schoolName,
        heroSubtitle: "জ্ঞানই আলো",
        footerText: `© ${new Date().getFullYear()} ${input.schoolName}`,
      })
      .run();

    const base = process.env.BASE_DOMAIN || "localhost:3000";
    db.insert(schoolDomains)
      .values({
        id: createId(),
        schoolId,
        domain: `${slug}.${base.split(":")[0]}`,
        type: "SUBDOMAIN",
        status: "ACTIVE",
        sslStatus: "ACTIVE",
        verifiedAt: new Date(),
      })
      .run();

    const adminId = createId();
    db.insert(users)
      .values({
        id: adminId,
        email: input.adminEmail.toLowerCase(),
        mobile: input.adminMobile,
        passwordHash,
        name: input.adminName,
        role: "SCHOOL_ADMIN",
        status: "ACTIVE",
        schoolId,
      })
      .run();

    createSubscription({
      schoolId,
      planId: plan.id,
      billingCycle: input.billingCycle,
      status: isTrial ? "TRIAL" : "ACTIVE",
    });

    writeAudit({
      schoolId,
      action: "SCHOOL_REGISTERED",
      module: "schools",
      resource: "school",
      resourceId: schoolId,
      after: { slug, plan: plan.slug },
    });

    return { schoolId, slug, adminId, isTrial, plan };
  })();
}

export function setSchoolStatus(ctx: AuthContext, schoolId: string, status: string) {
  if (ctx.role !== "SUPER_ADMIN") throw new AppError("FORBIDDEN", "অনুমতি নেই", 403);
  const school = db.select().from(schools).where(eq(schools.id, schoolId)).get();
  if (!school) throw new AppError("NOT_FOUND", "স্কুল পাওয়া যায়নি", 404);
  db.update(schools)
    .set({ status, updatedAt: new Date() })
    .where(eq(schools.id, schoolId))
    .run();
  writeAudit({
    ctx,
    schoolId,
    action: "SCHOOL_STATUS",
    module: "schools",
    resource: "school",
    resourceId: schoolId,
    before: { status: school.status },
    after: { status },
  });
}

export function schoolCounts() {
  const all = db.select().from(schools).all();
  return {
    total: all.length,
    active: all.filter((s) => s.status === "ACTIVE").length,
    trial: all.filter((s) => s.status === "TRIAL").length,
    expired: all.filter((s) => s.status === "EXPIRED").length,
    suspended: all.filter((s) => s.status === "SUSPENDED").length,
  };
}
