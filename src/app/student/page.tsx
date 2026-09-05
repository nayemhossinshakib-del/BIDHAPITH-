import { eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function StudentDashboard() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const me = db.select().from(students).where(eq(students.userId, ctx.userId)).get();
  const cls = me?.classId
    ? db.select().from(classes).where(eq(classes.id, me.classId)).get()
    : null;
  return (
    <div>
      <PageHeader title="ড্যাশবোর্ড" description={me?.nameBn || ctx.name} />
      <Card>
        <CardContent className="grid gap-2 p-5 text-sm sm:grid-cols-2">
          <p>শিক্ষার্থী আইডি: {me?.studentId}</p>
          <p>ক্লাস: {cls?.nameBn}</p>
          <p>রোল: {me?.roll}</p>
          <p>স্ট্যাটাস: {me?.status}</p>
        </CardContent>
      </Card>
    </div>
  );
}
