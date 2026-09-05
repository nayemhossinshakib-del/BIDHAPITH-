import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import type { Role } from "@/lib/constants";
import { createUserSession, setSessionCookie } from "@/lib/auth/session";

export async function loginAsSchoolAdmin(ctx: AuthContext, schoolId: string) {
  if (ctx.role !== "SUPER_ADMIN") throw new AppError("FORBIDDEN", "অনুমতি নেই", 403);
  const admin = db
    .select()
    .from(users)
    .where(eq(users.schoolId, schoolId))
    .all()
    .find((u) => u.role === "SCHOOL_ADMIN" && u.status === "ACTIVE");
  if (!admin) throw new AppError("NOT_FOUND", "স্কুল অ্যাডমিন পাওয়া যায়নি", 404);
  const session = await createUserSession({
    userId: admin.id,
    role: admin.role as Role,
    schoolId: admin.schoolId,
    impersonatedBy: ctx.userId,
  });
  await setSessionCookie(session.jwt, session.expiresAt);
  writeAudit({
    ctx,
    schoolId,
    action: "IMPERSONATE_START",
    module: "auth",
    resource: "user",
    resourceId: admin.id,
  });
  return { redirectTo: "/school" };
}
