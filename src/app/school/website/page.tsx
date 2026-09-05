import { eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { schoolSettings, schoolWebsites, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function WebsiteSettingsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const school = db.select().from(schools).where(eq(schools.id, ctx.schoolId!)).get();
  const site = db.select().from(schoolWebsites).where(eq(schoolWebsites.schoolId, ctx.schoolId!)).get();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, ctx.schoolId!)).get();
  return (
    <div>
      <PageHeader
        title="স্কুল ওয়েবসাইট"
        description="লোগো, রং, অধ্যক্ষের বাণী, নোটিশ ও ভর্তি CTA — ড্র্যাগ-ড্রপ বিল্ডার নয়"
        actions={
          <Button asChild>
            <Link href={`/s/${school?.slug}`}>প্রিভিউ</Link>
          </Button>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>টাইটেল: {site?.seoTitle}</p>
            <p>বর্ণনা: {site?.seoDescription}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>থিম</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            প্রাথমিক রং: {settings?.primaryColor}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
