import { db } from "@/db";
import { paymentTransactions, schools, smsMessages } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { formatBdt } from "@/lib/utils";

export default function AdminReportsPage() {
  const schoolsN = db.select().from(schools).all().length;
  const paid = db
    .select()
    .from(paymentTransactions)
    .all()
    .filter((p) => p.status === "PAID");
  const sms = db.select().from(smsMessages).all().length;
  const mrr = paid.filter((p) => p.purpose === "SUBSCRIPTION").reduce((s, p) => s + p.amount, 0);
  return (
    <div>
      <PageHeader title="রিপোর্ট" description="MRR / ARR, স্কুল বৃদ্ধি, SMS ব্যবহার" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="সক্রিয় টেন্যান্ট" value={schoolsN} />
        <StatCard title="সাবস্ক্রিপশন রাজস্ব" value={formatBdt(mrr)} hint="MRR/ARR ট্র্যাকিং" />
        <StatCard title="মোট পেমেন্ট" value={paid.length} />
        <StatCard title="SMS পাঠানো" value={sms} />
      </div>
    </div>
  );
}
