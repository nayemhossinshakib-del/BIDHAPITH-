import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolSettings, schools } from "@/db/schema";

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, school.id)).get();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">পরিচিতি</h1>
      <p className="mt-4 leading-relaxed text-neutral-700">{settings?.about}</p>
      <p className="mt-4 text-sm text-neutral-500">প্রতিষ্ঠাকাল: {settings?.establishedYear}</p>
    </main>
  );
}
