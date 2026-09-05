import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schools, teachers } from "@/db/schema";

export default async function PublicTeachers({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const rows = db.select().from(teachers).where(eq(teachers.schoolId, school.id)).all();
  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold">শিক্ষকবৃন্দ</h1>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {rows.map((t) => (
          <div key={t.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="font-medium">{t.nameBn || t.name}</p>
            <p className="text-sm text-neutral-500">{t.employeeId}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
