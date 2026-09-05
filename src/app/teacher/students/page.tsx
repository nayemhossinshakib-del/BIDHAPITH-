import { eq } from "drizzle-orm";
import { db } from "@/db";
import { students, teacherAssignments, teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function TeacherStudentsPage() {
  const ctx = await requireRole(["TEACHER"]);
  const teacher = db.select().from(teachers).where(eq(teachers.userId, ctx.userId)).get();
  const assigns = teacher
    ? db.select().from(teacherAssignments).where(eq(teacherAssignments.teacherId, teacher.id)).all()
    : [];
  const classIds = new Set(assigns.map((a) => a.classId));
  const rows = db
    .select()
    .from(students)
    .where(eq(students.schoolId, ctx.schoolId!))
    .all()
    .filter((s) => !s.classId || classIds.has(s.classId));
  return (
    <div>
      <PageHeader title="শিক্ষার্থী" description="শুধু অ্যাসাইন করা ক্লাস" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>আইডি</TH>
              <TH>নাম</TH>
              <TH>রোল</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((s) => (
              <TR key={s.id}>
                <TD>{s.studentId}</TD>
                <TD>{s.nameBn || s.name}</TD>
                <TD>{s.roll}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
