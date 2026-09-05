import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolSettings, schools } from "@/db/schema";

export default async function PrincipalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, school.id)).get();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">অধ্যক্ষের বাণী</h1>
      <p className="mt-2 font-medium">{settings?.principalName}</p>
      <p className="mt-4 leading-relaxed text-neutral-700">{settings?.principalMessage}</p>
    </main>
  );
}
