import { eq } from "drizzle-orm";
import { db } from "@/db";
import { exams, results, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function TeacherResultsPage() {
  const ctx = await requireRole(["TEACHER"]);
  const examRows = db.select().from(exams).where(eq(exams.schoolId, ctx.schoolId!)).all();
  const res = db.select().from(results).where(eq(results.schoolId, ctx.schoolId!)).all();
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="নম্বর এন্ট্রি" />
      {examRows.map((e) => (
        <div key={e.id} className="mb-6 rounded-2xl border border-border bg-card">
          <div className="border-b px-5 py-3 font-medium">{e.nameBn}</div>
          <Table>
            <THead>
              <TR>
                <TH>শিক্ষার্থী</TH>
                <TH>নম্বর</TH>
                <TH>গ্রেড</TH>
              </TR>
            </THead>
            <TBody>
              {res
                .filter((r) => r.examId === e.id)
                .slice(0, 20)
                .map((r) => (
                  <TR key={r.id}>
                    <TD>{st.find((s) => s.id === r.studentId)?.nameBn}</TD>
                    <TD>{r.marks}</TD>
                    <TD>{r.grade}</TD>
                  </TR>
                ))}
            </TBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
