import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notices, schools } from "@/db/schema";
import { formatDateBn } from "@/lib/utils";

export default async function PublicNotices({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const rows = db
    .select()
    .from(notices)
    .where(eq(notices.schoolId, school.id))
    .all()
    .filter((n) => n.isPublic);
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">নোটিশ</h1>
      <div className="mt-6 space-y-4">
        {rows.map((n) => (
          <article key={n.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-xs text-neutral-500">{formatDateBn(n.publishDate)}</p>
            <h2 className="mt-1 font-medium">{n.title}</h2>
            <p className="mt-2 text-sm text-neutral-700">{n.content}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
