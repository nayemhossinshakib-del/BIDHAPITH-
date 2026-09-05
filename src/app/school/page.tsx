import { eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  accountants,
  admissionApplications,
  feePayments,
  notices,
  schools,
  students,
  teachers,
} from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { requireRole } from "@/lib/guard";
import { formatBdt, formatDateBn } from "@/lib/utils";

export default async function SchoolDashboard() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const schoolId = ctx.schoolId!;
  const school = db.select().from(schools).where(eq(schools.id, schoolId)).get();
  const st = db.select({ c: sql<number>`count(*)` }).from(students).where(eq(students.schoolId, schoolId)).get();
  const t = db.select({ c: sql<number>`count(*)` }).from(teachers).where(eq(teachers.schoolId, schoolId)).get();
  const a = db.select({ c: sql<number>`count(*)` }).from(accountants).where(eq(accountants.schoolId, schoolId)).get();
  const pending = db
    .select()
    .from(admissionApplications)
    .where(eq(admissionApplications.schoolId, schoolId))
    .all()
    .filter((x) => x.status === "PENDING").length;
  const payments = db.select().from(feePayments).where(eq(feePayments.schoolId, schoolId)).all();
  const monthly = payments.reduce((s, p) => s + p.amount, 0);
  const n = db.select().from(notices).where(eq(notices.schoolId, schoolId)).all().slice(0, 5);

  return (
    <div>
      <PageHeader title="ড্যাশবোর্ড" description={school?.nameBn || school?.name} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="শিক্ষার্থী" value={Number(st?.c ?? 0)} />
        <StatCard title="শিক্ষক" value={Number(t?.c ?? 0)} />
        <StatCard title="হিসাবরক্ষক" value={Number(a?.c ?? 0)} />
        <StatCard title="অপেক্ষমাণ ভর্তি" value={pending} />
        <StatCard title="মাসিক আদায়" value={formatBdt(monthly)} />
        <StatCard title="SMS ব্যালেন্স" value={school?.smsBalance ?? 0} />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-medium">সাম্প্রতিক নোটিশ</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {n.map((x) => (
            <li key={x.id} className="flex justify-between gap-4">
              <span>{x.title}</span>
              <span className="text-muted-foreground">{formatDateBn(x.publishDate)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
