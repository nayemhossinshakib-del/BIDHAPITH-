import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feePayments, studentFees } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { requireRole } from "@/lib/guard";
import { formatBdt } from "@/lib/utils";

export default async function AccountantDashboard() {
  const ctx = await requireRole(["ACCOUNTANT"]);
  const pays = db.select().from(feePayments).where(eq(feePayments.schoolId, ctx.schoolId!)).all();
  const dues = db
    .select()
    .from(studentFees)
    .where(eq(studentFees.schoolId, ctx.schoolId!))
    .all()
    .filter((f) => f.due > 0);
  return (
    <div>
      <PageHeader title="ড্যাশবোর্ড" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="মোট আদায়" value={formatBdt(pays.reduce((s, p) => s + p.amount, 0))} />
        <StatCard title="লেনদেন" value={pays.length} />
        <StatCard title="বকেয়া রেকর্ড" value={dues.length} />
      </div>
    </div>
  );
}
