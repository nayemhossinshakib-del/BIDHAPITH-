import { PageHeader } from "@/components/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SupportPage() {
  return (
    <div>
      <PageHeader title="সাপোর্ট" />
      <Card>
        <CardHeader>
          <CardTitle>প্ল্যাটফর্ম সহায়তা</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          ইমেইল support@bidhapith.com · ফোন ০১৭০০০০০০০০ · স্কুল অ্যাডমিন হিসেবে লগইন করে সাপোর্ট দিন।
        </CardContent>
      </Card>
    </div>
  );
}
