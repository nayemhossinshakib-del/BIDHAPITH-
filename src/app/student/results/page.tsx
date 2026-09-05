import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exams, results, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function StudentResults() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const me = db.select().from(students).where(eq(students.userId, ctx.userId)).get();
  const rows = me ? db.select().from(results).where(eq(results.studentId, me.id)).all() : [];
  const examRows = db.select().from(exams).where(eq(exams.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="ফলাফল" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>পরীক্ষা</TH>
              <TH>নম্বর</TH>
              <TH>গ্রেড</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD>{examRows.find((e) => e.id === r.examId)?.nameBn}</TD>
                <TD>{r.marks}</TD>
                <TD>{r.grade}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
