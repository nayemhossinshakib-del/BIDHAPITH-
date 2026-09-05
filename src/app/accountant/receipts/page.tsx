import { eq } from "drizzle-orm";
import { db } from "@/db";
import { receipts, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function ReceiptsPage() {
  const ctx = await requireRole(["ACCOUNTANT"]);
  const rows = db.select().from(receipts).where(eq(receipts.schoolId, ctx.schoolId!)).all();
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="রসিদ" description="বাংলা রসিদ · স্কুল লোগো, শিক্ষার্থী, ফি, ট্রানজেকশন" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>রসিদ নং</TH>
              <TH>শিক্ষার্থী</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((r) => (
              <TR key={r.id}>
                <TD>{r.receiptNumber}</TD>
                <TD>{st.find((s) => s.id === r.studentId)?.nameBn}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
