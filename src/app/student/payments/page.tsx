import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feePayments, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { formatBdt, formatDateTimeBn } from "@/lib/utils";

export default async function StudentPayments() {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  const me = db.select().from(students).where(eq(students.userId, ctx.userId)).get();
  const rows = me ? db.select().from(feePayments).where(eq(feePayments.studentId, me.id)).all() : [];
  return (
    <div>
      <PageHeader title="পেমেন্ট ইতিহাস" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>পরিমাণ</TH>
              <TH>মাধ্যম</TH>
              <TH>তারিখ</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((p) => (
              <TR key={p.id}>
                <TD>{formatBdt(p.amount)}</TD>
                <TD>{p.method}</TD>
                <TD>{formatDateTimeBn(p.paidAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
