import { eq } from "drizzle-orm";
import { db } from "@/db";
import { feeTypes, studentFees, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { formatBdt } from "@/lib/utils";

export default async function FeesPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const types = db.select().from(feeTypes).where(eq(feeTypes.schoolId, ctx.schoolId!)).all();
  const fees = db.select().from(studentFees).where(eq(studentFees.schoolId, ctx.schoolId!)).all();
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="ফি" description={`ধরন: ${types.map((t) => t.nameBn).join(", ")}`} />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>শিক্ষার্থী</TH>
              <TH>শীর্ষক</TH>
              <TH>মোট</TH>
              <TH>পরিশোধ</TH>
              <TH>বকেয়া</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {fees.map((f) => (
              <TR key={f.id}>
                <TD>{st.find((s) => s.id === f.studentId)?.nameBn}</TD>
                <TD>{f.title}</TD>
                <TD>{formatBdt(f.amount)}</TD>
                <TD>{formatBdt(f.paid)}</TD>
                <TD>{formatBdt(f.due)}</TD>
                <TD>
                  <Badge variant={statusBadge(f.status)}>{f.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
