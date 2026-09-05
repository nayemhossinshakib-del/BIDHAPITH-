import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function TeacherProfile() {
  const ctx = await requireRole(["TEACHER"]);
  const t = db.select().from(teachers).where(eq(teachers.userId, ctx.userId)).get();
  return (
    <div>
      <PageHeader title="প্রোফাইল" />
      <Card>
        <CardContent className="space-y-1 p-5 text-sm">
          <p>{t?.nameBn}</p>
          <p>{t?.employeeId}</p>
          <p>{t?.phone}</p>
          <p>{t?.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
