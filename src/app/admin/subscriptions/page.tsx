import { db } from "@/db";
import { schools, subscriptionPlans, subscriptions } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDateBn } from "@/lib/utils";

export default function SubscriptionsPage() {
  const rows = db.select().from(subscriptions).all();
  const schoolRows = db.select().from(schools).all();
  const plans = db.select().from(subscriptionPlans).all();
  return (
    <div>
      <PageHeader title="সাবস্ক্রিপশন" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>স্কুল</TH>
              <TH>প্ল্যান</TH>
              <TH>স্ট্যাটাস</TH>
              <TH>সাইকেল</TH>
              <TH>মেয়াদ শেষ</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((s) => (
              <TR key={s.id}>
                <TD>{schoolRows.find((x) => x.id === s.schoolId)?.nameBn}</TD>
                <TD>{plans.find((p) => p.id === s.planId)?.nameBn}</TD>
                <TD>
                  <Badge variant={statusBadge(s.status)}>{s.status}</Badge>
                </TD>
                <TD>{s.billingCycle}</TD>
                <TD>{formatDateBn(s.endsAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
