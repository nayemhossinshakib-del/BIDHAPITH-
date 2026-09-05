import { eq } from "drizzle-orm";
import { db } from "@/db";
import { studentFees, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { formatBdt } from "@/lib/utils";

export default async function DuesPage() {
  const ctx = await requireRole(["ACCOUNTANT"]);
  const fees = db
    .select()
    .from(studentFees)
    .where(eq(studentFees.schoolId, ctx.schoolId!))
    .all()
    .filter((f) => f.due > 0);
  const st = db.select().from(students).where(eq(students.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="বকেয়া তালিকা" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>শিক্ষার্থী</TH>
              <TH>শীর্ষক</TH>
              <TH>বকেয়া</TH>
            </TR>
          </THead>
          <TBody>
            {fees.map((f) => (
              <TR key={f.id}>
                <TD>{st.find((s) => s.id === f.studentId)?.nameBn}</TD>
                <TD>{f.title}</TD>
                <TD>{formatBdt(f.due)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
