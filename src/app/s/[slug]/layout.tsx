import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolSettings, schools } from "@/db/schema";

export default async function SchoolSiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const school = db.select().from(schools).where(eq(schools.slug, slug)).get();
  if (!school) notFound();
  const settings = db.select().from(schoolSettings).where(eq(schoolSettings.schoolId, school.id)).get();
  const name = school.nameBn || school.name;
  const links = [
    ["", "হোম"],
    ["about", "পরিচিতি"],
    ["teachers", "শিক্ষক"],
    ["admission", "ভর্তি"],
    ["notices", "নোটিশ"],
    ["documents", "ডাউনলোড"],
    ["contact", "যোগাযোগ"],
  ] as const;

  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#1f1a14]">
      <header className="border-b border-amber-200/80 bg-[#fffdf8]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <Link href={`/s/${slug}`} className="flex items-center gap-2 font-semibold">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: settings?.primaryColor || "#0F766E" }}
            >
              {name.slice(0, 1)}
            </span>
            {name}
          </Link>
          <nav className="hidden gap-4 text-sm md:flex">
            {links.map(([p, l]) => (
              <Link key={p} href={`/s/${slug}${p ? `/${p}` : ""}`} className="hover:underline">
                {l}
              </Link>
            ))}
          </nav>
          <Link
            href={`/s/${slug}/admission`}
            className="rounded-full px-4 py-2 text-sm text-white"
            style={{ background: settings?.primaryColor || "#0F766E" }}
          >
            অনলাইন ভর্তি আবেদন
          </Link>
        </div>
      </header>
      {children}
      <footer className="mt-12 border-t border-amber-200 bg-[#1f1a14] py-8 text-center text-sm text-amber-100">
        © {new Date().getFullYear()} {name} · {school.district}, বাংলাদেশ
      </footer>
    </div>
  );
}
