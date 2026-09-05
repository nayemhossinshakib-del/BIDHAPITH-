import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, schools, sections } from "@/db/schema";

export default async function PublicClasses({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const cs = db.select().from(classes).where(eq(classes.schoolId, school.id)).all();
  const ss = db.select().from(sections).where(eq(sections.schoolId, school.id)).all();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">ক্লাস</h1>
      <ul className="mt-6 space-y-3">
        {cs.map((c) => (
          <li key={c.id} className="rounded-2xl bg-white p-4 shadow-sm">
            {c.nameBn} — সেকশন {ss.filter((s) => s.classId === c.id).map((s) => s.name).join(", ")}
          </li>
        ))}
      </ul>
    </main>
  );
}
