import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolSettings, schools } from "@/db/schema";

export default async function ContactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, school.id)).get();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">যোগাযোগ</h1>
      <div className="mt-6 space-y-2 rounded-2xl bg-white p-6 text-sm shadow-sm">
        <p>ঠিকানা: {school.address}</p>
        <p>ফোন: {settings?.phone}</p>
        <p>ইমেইল: {settings?.email}</p>
      </div>
    </main>
  );
}
