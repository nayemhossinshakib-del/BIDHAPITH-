import { eq } from "drizzle-orm";
import { db } from "@/db";
import { accountants } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function AccountantsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = db.select().from(accountants).where(eq(accountants.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="হিসাবরক্ষক" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>আইডি</TH>
              <TH>নাম</TH>
              <TH>ফোন</TH>
              <TH>ইমেইল</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((a) => (
              <TR key={a.id}>
                <TD>{a.employeeId}</TD>
                <TD>{a.name}</TD>
                <TD>{a.phone}</TD>
                <TD>{a.email}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
