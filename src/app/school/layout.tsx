import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schools } from "@/db/schema";
import { RoleShell } from "@/components/shell/role-shell";
import { requireRole } from "@/lib/guard";
import { schoolNav } from "@/lib/nav";

export default async function SchoolLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const school = ctx.schoolId
    ? db.select().from(schools).where(eq(schools.id, ctx.schoolId)).get()
    : null;
  if (school && (school.status === "SUSPENDED" || school.status === "CANCELLED")) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <h1 className="text-xl font-semibold">আপনার স্কুল অ্যাকাউন্ট সাময়িকভাবে স্থগিত করা হয়েছে।</h1>
          <p className="mt-2 text-sm text-muted-foreground">সাপোর্ট: support@bidhapith.com · ০১৭০০০০০০০০</p>
        </div>
      </div>
    );
  }
  return (
    <RoleShell ctx={ctx} items={schoolNav} title={school?.nameBn || "স্কুল অ্যাডমিন"}>
      {children}
    </RoleShell>
  );
}
