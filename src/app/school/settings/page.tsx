import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolSettings, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function SchoolSettingsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const school = db.select().from(schools).where(eq(schools.id, ctx.schoolId!)).get();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, ctx.schoolId!)).get();
  return (
    <div>
      <PageHeader title="সেটিংস" description="গ্লোবাল প্ল্যাটফর্ম সেটিংস পরিবর্তন করা যাবে না" />
      <Card>
        <CardHeader>
          <CardTitle>{school?.nameBn}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>ফোন: {settings?.phone}</p>
          <p>ইমেইল: {settings?.email}</p>
          <p>জেলা: {school?.district}</p>
          <p>বিভাগ: {school?.division}</p>
          <p>মুদ্রা: ৳ BDT · সময়: Asia/Dhaka</p>
        </CardContent>
      </Card>
    </div>
  );
}
