import { eq } from "drizzle-orm";
import { db } from "@/db";
import { studentFees, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { formatBdt } from "@/lib/utils";

export default async function StudentFeesPage() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const me = db.select().from(students).where(eq(students.userId, ctx.userId)).get();
  const rows = me ? db.select().from(studentFees).where(eq(studentFees.studentId, me.id)).all() : [];
  return (
    <div>
      <PageHeader title="ফি" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>শীর্ষক</TH>
              <TH>মোট</TH>
              <TH>পরিশোধ</TH>
              <TH>বকেয়া</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((f) => (
              <TR key={f.id}>
                <TD>{f.title}</TD>
                <TD>{formatBdt(f.amount)}</TD>
                <TD>{formatBdt(f.paid)}</TD>
                <TD>{formatBdt(f.due)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
