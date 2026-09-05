import { eq } from "drizzle-orm";
import { db } from "@/db";
import { teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function TeachersPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = db.select().from(teachers).where(eq(teachers.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="শিক্ষক" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>কর্মচারী আইডি</TH>
              <TH>নাম</TH>
              <TH>ফোন</TH>
              <TH>ইমেইল</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((t) => (
              <TR key={t.id}>
                <TD>{t.employeeId}</TD>
                <TD>{t.nameBn || t.name}</TD>
                <TD>{t.phone}</TD>
                <TD>{t.email}</TD>
                <TD>
                  <Badge variant={statusBadge(t.status)}>{t.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
