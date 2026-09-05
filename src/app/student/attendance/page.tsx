import { eq } from "drizzle-orm";
import { db } from "@/db";
import { attendanceRecords, attendanceSessions, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function StudentAttendance() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const me = db.select().from(students).where(eq(students.userId, ctx.userId)).get();
  const recs = me
    ? db.select().from(attendanceRecords).where(eq(attendanceRecords.studentId, me.id)).all()
    : [];
  const sessions = db
    .select()
    .from(attendanceSessions)
    .where(eq(attendanceSessions.schoolId, ctx.schoolId!))
    .all();
  return (
    <div>
      <PageHeader title="উপস্থিতি" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>তারিখ</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {recs.map((r) => (
              <TR key={r.id}>
                <TD>{sessions.find((s) => s.id === r.sessionId)?.date}</TD>
                <TD>{r.status}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
