import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feePayments, receipts, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { formatBdt, formatDateTimeBn } from "@/lib/utils";

export default async function SchoolPaymentsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const pays = db.select().from(feePayments).where(eq(feePayments.schoolId, ctx.schoolId!)).all();
  const rec = db.select().from(receipts).where(eq(receipts.schoolId, ctx.schoolId!)).all();
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="পেমেন্ট ও রসিদ" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>শিক্ষার্থী</TH>
              <TH>পরিমাণ</TH>
              <TH>মাধ্যম</TH>
              <TH>রসিদ</TH>
              <TH>তারিখ</TH>
            </TR>
          </THead>
          <TBody>
            {pays.map((p) => (
              <TR key={p.id}>
                <TD>{st.find((s) => s.id === p.studentId)?.nameBn}</TD>
                <TD>{formatBdt(p.amount)}</TD>
                <TD>{p.method}</TD>
                <TD>{rec.find((r) => r.feePaymentId === p.id)?.receiptNumber}</TD>
                <TD>{formatDateTimeBn(p.paidAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
