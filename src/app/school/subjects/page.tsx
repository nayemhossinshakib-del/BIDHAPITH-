import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subjects } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function SubjectsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = db.select().from(subjects).where(eq(subjects.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="বিষয়" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>কোড</TH>
              <TH>বিষয়</TH>
              <TH>ইংরেজি</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((s) => (
              <TR key={s.id}>
                <TD>{s.code}</TD>
                <TD>{s.nameBn}</TD>
                <TD>{s.name}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
