import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatBdt } from "@/lib/utils";
import { listPlans } from "@/services/subscription.service";

export default function PlansPage() {
  const plans = listPlans(false);
  return (
    <div>
      <PageHeader title="সাবস্ক্রিপশন প্ল্যান" description="সুপার অ্যাডমিন প্ল্যান তৈরি/সম্পাদনা করতে পারেন" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>প্ল্যান</TH>
              <TH>মাসিক</TH>
              <TH>বাৎসরিক</TH>
              <TH>শিক্ষার্থী</TH>
              <TH>SMS</TH>
              <TH>ডোমেইন</TH>
              <TH>সক্রিয়</TH>
            </TR>
          </THead>
          <TBody>
            {plans.map((p) => (
              <TR key={p.id}>
                <TD className="font-medium">{p.nameBn}</TD>
                <TD>{formatBdt(p.priceMonthly)}</TD>
                <TD>{formatBdt(p.priceYearly)}</TD>
                <TD>{p.maxStudents}</TD>
                <TD>{p.smsAllocation}</TD>
                <TD>{p.customDomain ? "হ্যাঁ" : "না"}</TD>
                <TD>{p.isActive ? "সক্রিয়" : "নিষ্ক্রিয়"}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
