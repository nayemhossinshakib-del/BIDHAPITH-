import { PageHeader } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettingsPage() {
  return (
    <div>
      <PageHeader title="সিস্টেম সেটিংস" />
      <div className="grid gap-4 md:grid-cols-2">
        {[
          ["প্ল্যাটফর্ম", "নাম বিধাপীঠ · ভাষা বাংলা · ৳ BDT · Asia/Dhaka"],
          ["পেমেন্ট", "bKash, Nagad, SSLCommerz, Card — ক্রেডেনশিয়াল এনভ থেকে"],
          ["SMS", "প্রোভাইডার URL, API Key, Sender ID, রেট"],
          ["ডোমেইন", "BASE_DOMAIN, CNAME টার্গেট, SSL"],
          ["ইমেইল", "SMTP হোস্ট/পোর্ট"],
          ["নিরাপত্তা", "সেশন ৭ দিন, লগইন রেট লিমিট, পাসওয়ার্ড নীতি"],
        ].map(([t, d]) => (
          <Card key={t}>
            <CardHeader>
              <CardTitle>{t}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{d}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
