import { db } from "@/db";
import { paymentTransactions, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatBdt, formatDateTimeBn } from "@/lib/utils";

export default function AdminPaymentsPage() {
  const rows = db.select().from(paymentTransactions).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader title="পেমেন্ট" description="সাবস্ক্রিপশন, ভর্তি, ফি, SMS প্যাকেজ" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>স্কুল</TH>
              <TH>উদ্দেশ্য</TH>
              <TH>পরিমাণ</TH>
              <TH>গেটওয়ে</TH>
              <TH>স্ট্যাটাস</TH>
              <TH>তারিখ</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((p) => (
              <TR key={p.id}>
                <TD>{schoolRows.find((s) => s.id === p.schoolId)?.nameBn ?? "—"}</TD>
                <TD>{p.purpose}</TD>
                <TD>{formatBdt(p.amount)}</TD>
                <TD>{p.provider}</TD>
                <TD>
                  <Badge variant={statusBadge(p.status)}>{p.status}</Badge>
                </TD>
                <TD>{formatDateTimeBn(p.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
