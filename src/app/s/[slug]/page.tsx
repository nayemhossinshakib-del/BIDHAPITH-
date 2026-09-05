import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notices, schoolSettings, schools, teachers } from "@/db/schema";
import { formatDateBn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  return {
    title: school?.nameBn || "স্কুল",
    description: `${school?.nameBn} — অনলাইন ভর্তি, নোটিশ ও একাডেমিক তথ্য`,
  };
}

export default async function SchoolHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, school.id)).get();
  const n = db.select().from(notices).where(eq(notices.schoolId, school.id)).all().filter((x) => x.isPublic);
  const t = db.select().from(teachers).where(eq(teachers.schoolId, school.id)).all();
  const color = settings?.primaryColor || "#0F766E";

  return (
    <main>
      <section className="bg-[#1f1a14] py-16 text-[#fffdf8]">
        <div className="mx-auto max-w-5xl px-4">
          <p className="text-sm text-amber-200">{school.district} · EIIN {school.eiin}</p>
          <h1 className="mt-2 text-4xl font-bold">{school.nameBn}</h1>
          <p className="mt-3 max-w-xl text-amber-100/80">জ্ঞান, নৈতিকতা ও নেতৃত্ব — অনলাইনে ভর্তি আবেদন করুন।</p>
          <div className="mt-6 flex gap-3">
            <Link href={`/s/${slug}/admission`} className="rounded-full px-5 py-2 text-sm text-white" style={{ background: color }}>
              অনলাইন ভর্তি আবেদন
            </Link>
            <Link href={`/s/${slug}/notices`} className="rounded-full border border-amber-200 px-5 py-2 text-sm">
              সকল নোটিশ দেখুন
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">অধ্যক্ষের বাণী</h2>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{settings?.principalMessage}</p>
          <p className="mt-3 text-sm font-medium">{settings?.principalName}</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold">নোটিশ বোর্ড</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {n.slice(0, 4).map((x) => (
              <li key={x.id} className="flex justify-between gap-3">
                <Link href={`/s/${slug}/notices`} className="hover:underline">
                  {x.title}
                </Link>
                <span className="text-neutral-500">{formatDateBn(x.publishDate)}</span>
              </li>
            ))}
          </ul>
          <Link href={`/s/${slug}/notices`} className="mt-4 inline-block text-sm" style={{ color }}>
            সকল নোটিশ দেখুন
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-12">
        <h2 className="text-xl font-semibold">আমাদের শিক্ষক</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {t.map((x) => (
            <div key={x.id} className="rounded-2xl bg-white p-4 text-sm shadow-sm">
              <p className="font-medium">{x.nameBn || x.name}</p>
              <p className="text-neutral-500">{x.employeeId}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
