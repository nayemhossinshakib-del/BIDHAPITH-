import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolDocuments, schools } from "@/db/schema";

export default async function PublicDocuments({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const rows = db
    .select()
    .from(schoolDocuments)
    .where(eq(schoolDocuments.schoolId, school.id))
    .all()
    .filter((d) => d.visibility === "PUBLIC");
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">ডাউনলোড সেন্টার</h1>
      <ul className="mt-6 space-y-3">
        {rows.map((d) => (
          <li key={d.id} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="font-medium">{d.title}</p>
            <p className="text-sm text-neutral-500">{d.category}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
