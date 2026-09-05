import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, schools } from "@/db/schema";
import { AdmissionForm } from "./form";

export default async function AdmissionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const cs = db.select().from(classes).where(eq(classes.schoolId, school.id)).all();
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">অনলাইন ভর্তি আবেদন</h1>
      <p className="mt-2 text-sm text-neutral-600">আবেদন ফি ৳৫০০ · {school.nameBn} — স্কুল নিজে থেকে বেছে নিতে হবে না।</p>
      <AdmissionForm
        slug={slug}
        schoolId={school.id}
        classes={cs.map((c) => ({ id: c.id, name: c.nameBn || c.name }))}
      />
    </main>
  );
}
