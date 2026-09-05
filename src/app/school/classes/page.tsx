import { eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, sections } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function ClassesPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const cs = db.select().from(classes).where(eq(classes.schoolId, ctx.schoolId!)).all();
  const ss = db.select().from(sections).where(eq(sections.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="ক্লাস ও সেকশন" description="শিক্ষাবর্ষ → ক্লাস → সেকশন" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cs.map((c) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle>{c.nameBn || c.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              সেকশন: {ss.filter((s) => s.classId === c.id).map((s) => s.name).join(", ") || "—"}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
