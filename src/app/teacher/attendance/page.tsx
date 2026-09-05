import { eq } from "drizzle-orm";
import { db } from "@/db";
import { attendanceRecords, attendanceSessions, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function TeacherAttendancePage() {
  const ctx = await requireRole(["TEACHER"]);
  const sessions = db
    .select()
    .from(attendanceSessions)
    .where(eq(attendanceSessions.schoolId, ctx.schoolId!))
    .all();
  const recs = db
    .select()
    .from(attendanceRecords)
    .where(eq(attendanceRecords.schoolId, ctx.schoolId!))
    .all();
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="উপস্থিতি" />
      {sessions.map((s) => (
        <div key={s.id} className="mb-6 rounded-2xl border border-border bg-card">
          <div className="border-b px-5 py-3 text-sm">{s.date}</div>
          <Table>
            <THead>
              <TR>
                <TH>শিক্ষার্থী</TH>
                <TH>স্ট্যাটাস</TH>
              </TR>
            </THead>
            <TBody>
              {recs
                .filter((r) => r.sessionId === s.id)
                .map((r) => (
                  <TR key={r.id}>
                    <TD>{st.find((x) => x.id === r.studentId)?.nameBn}</TD>
                    <TD>
                      <Badge>{r.status}</Badge>
                    </TD>
                  </TR>
                ))}
            </TBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
