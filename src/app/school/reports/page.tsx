import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feePayments, students, teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { requireRole } from "@/lib/guard";
import { formatBdt } from "@/lib/utils";

export default async function SchoolReportsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  const t = db.select().from(teachers).where(eq(teachers.schoolId, ctx.schoolId!)).all();
  const pay = db.select().from(feePayments).where(eq(feePayments.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="রিপোর্ট" description="CSV/PDF এক্সপোর্ট স্কুলের নিজস্ব ডেটাতে সীমাবদ্ধ" />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="শিক্ষার্থী" value={st.length} />
        <StatCard title="শিক্ষক" value={t.length} />
        <StatCard title="আদায়" value={formatBdt(pay.reduce((s, p) => s + p.amount, 0))} />
      </div>
    </div>
  );
}
