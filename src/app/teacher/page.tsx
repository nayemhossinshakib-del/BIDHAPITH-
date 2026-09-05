import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, teacherAssignments, teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function TeacherDashboard() {
  const ctx = await requireRole(["TEACHER"]);
  const teacher = db.select().from(teachers).where(eq(teachers.userId, ctx.userId)).get();
  const assigns = teacher
    ? db.select().from(teacherAssignments).where(eq(teacherAssignments.teacherId, teacher.id)).all()
    : [];
  const classRows = db.select().from(classes).where(eq(classes.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="ড্যাশবোর্ড" description={`${teacher?.nameBn || ctx.name} — শুধু নিজের ক্লাস`} />
      <div className="grid gap-4 sm:grid-cols-2">
        {assigns.map((a) => (
          <Card key={a.id}>
            <CardHeader>
              <CardTitle>{classRows.find((c) => c.id === a.classId)?.nameBn || "ক্লাস"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">অ্যাসাইনমেন্ট সীমাবদ্ধ</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
