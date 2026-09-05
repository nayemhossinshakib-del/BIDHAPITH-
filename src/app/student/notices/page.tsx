import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notices } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { requireRole } from "@/lib/guard";

export default async function StudentNotices() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const rows = db.select().from(notices).where(eq(notices.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="নোটিশ" />
      <div className="space-y-3">
        {rows.map((n) => (
          <article key={n.id} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-medium">{n.title}</h2>
            <p className="mt-2 text-sm">{n.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
