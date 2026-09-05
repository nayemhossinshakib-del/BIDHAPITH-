import { desc } from "drizzle-orm";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDateTimeBn } from "@/lib/utils";

export default function AuditLogsPage() {
  const rows = db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(100).all();
  const userRows = db.select().from(users).all();
  return (
    <div>
      <PageHeader title="অডিট লগ" description="আর্থিক ও প্রশাসনিক কাজ মুছে ফেলা হয় না" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>সময়</TH>
              <TH>ইউজার</TH>
              <TH>অ্যাকশন</TH>
              <TH>মডিউল</TH>
              <TH>রিসোর্স</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((l) => (
              <TR key={l.id}>
                <TD>{formatDateTimeBn(l.createdAt)}</TD>
                <TD>{userRows.find((u) => u.id === l.userId)?.email ?? "—"}</TD>
                <TD>{l.action}</TD>
                <TD>{l.module}</TD>
                <TD>
                  {l.resource} {l.resourceId}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
