import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolDomains } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId } from "@/lib/id";
import { scopedSchoolId } from "@/lib/tenant";

export function addDomain(ctx: AuthContext, domain: string) {
  const schoolId = scopedSchoolId(ctx, ctx.schoolId);
  const host = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!host || host.includes(" ")) throw new AppError("VALIDATION", "ডোমেইন সঠিক নয়", 422);
  const existing = db.select().from(schoolDomains).where(eq(schoolDomains.domain, host)).get();
  if (existing) throw new AppError("TAKEN", "ডোমেইন ইতিমধ্যে ব্যবহৃত", 409);
  const token = `bidhapith-verify=${createId()}`;
  const id = createId();
  db.insert(schoolDomains)
    .values({
      id,
      schoolId,
      domain: host,
      type: "CUSTOM",
      status: "PENDING",
      verificationToken: token,
      sslStatus: "PENDING",
    })
    .run();
  writeAudit({
    ctx,
    schoolId,
    action: "DOMAIN_ADDED",
    module: "domains",
    resource: "school_domain",
    resourceId: id,
    after: { domain: host },
  });
  return {
    id,
    domain: host,
    status: "PENDING",
    instructions: {
      cname: { host: "www", target: process.env.DNS_CNAME_TARGET || "schools.bidhapith.com" },
      txt: { host: "_bidhapith", value: token },
    },
  };
}

export function verifyDomain(ctx: AuthContext, id: string, force = false) {
  const row = db.select().from(schoolDomains).where(eq(schoolDomains.id, id)).get();
  if (!row) throw new AppError("NOT_FOUND", "ডোমেইন পাওয়া যায়নি", 404);
  if (ctx.role !== "SUPER_ADMIN") scopedSchoolId(ctx, row.schoolId);
  if (!force && ctx.role !== "SUPER_ADMIN") {
    db.update(schoolDomains)
      .set({ status: "VERIFYING", updatedAt: new Date() })
      .where(eq(schoolDomains.id, id))
      .run();
  }
  db.update(schoolDomains)
    .set({
      status: "ACTIVE",
      sslStatus: "ACTIVE",
      verifiedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(schoolDomains.id, id))
    .run();
  writeAudit({
    ctx,
    schoolId: row.schoolId,
    action: "DOMAIN_VERIFIED",
    module: "domains",
    resource: "school_domain",
    resourceId: id,
  });
}
