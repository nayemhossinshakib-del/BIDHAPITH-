import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolDomains, schools } from "@/db/schema";
import { TenantIsolationError } from "@/lib/errors";
import type { AuthContext } from "@/lib/auth/types";

const cache = new Map<string, { schoolId: string; expires: number }>();

export function resolveSchoolIdFromHost(host: string | null): string | null {
  if (!host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  const cached = cache.get(hostname);
  if (cached && cached.expires > Date.now()) return cached.schoolId;

  const row = db.select().from(schoolDomains).where(eq(schoolDomains.domain, hostname)).get();
  if (row && (row.status === "ACTIVE" || row.type === "SUBDOMAIN")) {
    cache.set(hostname, { schoolId: row.schoolId, expires: Date.now() + 60_000 });
    return row.schoolId;
  }
  return null;
}

export function requireSchoolId(ctx: AuthContext): string {
  if (ctx.role === "SUPER_ADMIN") {
    throw new TenantIsolationError("সুপার অ্যাডমিনের জন্য স্কুল প্রসঙ্গ প্রয়োজন");
  }
  if (!ctx.schoolId) {
    throw new TenantIsolationError("স্কুল অ্যাকাউন্ট পাওয়া যায়নি");
  }
  return ctx.schoolId;
}

export function assertSameSchool(ctx: AuthContext, schoolId: string | null | undefined) {
  if (ctx.role === "SUPER_ADMIN") return;
  if (!schoolId || ctx.schoolId !== schoolId) {
    throw new TenantIsolationError();
  }
}

export function scopedSchoolId(ctx: AuthContext, requested?: string | null): string {
  if (ctx.role === "SUPER_ADMIN") {
    if (!requested) throw new TenantIsolationError("স্কুল নির্বাচন করুন");
    return requested;
  }
  const sid = requireSchoolId(ctx);
  if (requested && requested !== sid) throw new TenantIsolationError();
  return sid;
}

export function getSchoolBySlug(slug: string) {
  return db.select().from(schools).where(eq(schools.slug, slug)).get() ?? null;
}

export function getSchoolById(id: string) {
  return db.select().from(schools).where(eq(schools.id, id)).get() ?? null;
}
