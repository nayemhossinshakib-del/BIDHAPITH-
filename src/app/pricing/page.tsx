import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import { formatBdt } from "@/lib/utils";
import { listPlans } from "@/services/subscription.service";

export const metadata = { title: "মূল্য তালিকা" };

export default function PricingPage() {
  let plans: ReturnType<typeof listPlans> = [];
  try {
    plans = listPlans();
  } catch {
    plans = [];
  }

  const fallback = [
    { nameBn: "ফ্রি ট্রায়াল", slug: "trial", priceMonthly: 0, maxStudents: 50, smsAllocation: 50, customDomain: false },
    { nameBn: "বেসিক", slug: "basic", priceMonthly: 1499, maxStudents: 200, smsAllocation: 200, customDomain: false },
    { nameBn: "প্রফেশনাল", slug: "professional", priceMonthly: 3499, maxStudents: 800, smsAllocation: 1000, customDomain: true },
    { nameBn: "প্রিমিয়াম", slug: "premium", priceMonthly: 6999, maxStudents: 2000, smsAllocation: 3000, customDomain: true },
    { nameBn: "এন্টারপ্রাইজ", slug: "enterprise", priceMonthly: 12999, maxStudents: 10000, smsAllocation: 10000, customDomain: true },
  ];
  const data = plans.length ? plans : fallback;

  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold">প্ল্যান ও মূল্য</h1>
        <p className="mt-2 text-muted-foreground">সব মূল্য বাংলাদেশি টাকায় (৳)। বার্ষিক প্ল্যানে সাশ্রয়।</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((p) => (
            <div key={p.slug} className="flex flex-col rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">{p.nameBn}</p>
              <p className="mt-2 text-3xl font-semibold">
                {p.priceMonthly === 0 ? "ফ্রি" : formatBdt(p.priceMonthly)}
                {p.priceMonthly ? <span className="text-sm font-normal text-muted-foreground">/মাস</span> : null}
              </p>
              <ul className="mt-4 flex-1 space-y-2 text-sm">
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary" /> সর্বোচ্চ {p.maxStudents} শিক্ষার্থী
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary" /> {p.smsAllocation} SMS
                </li>
                <li className="flex gap-2">
                  <Check className="h-4 w-4 text-primary" /> স্কুল ওয়েবসাইট ও অনলাইন ভর্তি
                </li>
                {p.customDomain ? (
                  <li className="flex gap-2">
                    <Check className="h-4 w-4 text-primary" /> কাস্টম ডোমেইন
                  </li>
                ) : null}
              </ul>
              <Button asChild className="mt-6">
                <Link href={`/register?plan=${p.slug}`}>এই প্ল্যান নিন</Link>
              </Button>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
