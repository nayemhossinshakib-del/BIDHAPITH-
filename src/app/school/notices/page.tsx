import { eq } from "drizzle-orm";
import { db } from "@/db";
import { notices } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { requireRole } from "@/lib/guard";
import { formatDateBn } from "@/lib/utils";

export default async function NoticesPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = db.select().from(notices).where(eq(notices.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="নোটিশ" />
      <div className="space-y-3">
        {rows.map((n) => (
          <article key={n.id} className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-medium">{n.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{formatDateBn(n.publishDate)} · {n.audience}</p>
            <p className="mt-2 text-sm">{n.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
