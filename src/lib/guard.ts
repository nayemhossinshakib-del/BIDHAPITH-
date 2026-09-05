import { redirect } from "next/navigation";
import { getAuthContext } from "@/lib/auth/session";
import type { Role } from "@/lib/constants";
import { ROLE_HOME } from "@/lib/constants";

export async function requireRole(roles: Role[]) {
  const ctx = await getAuthContext();
  if (!ctx) redirect("/login");
  if (!roles.includes(ctx.role)) redirect(ROLE_HOME[ctx.role] || "/login");
  return ctx;
}

export async function requireSchoolAccess() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  if (!ctx.schoolId) redirect("/login");
  return ctx;
}
