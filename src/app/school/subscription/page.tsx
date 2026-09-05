import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscriptionPlans } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";
import { formatBdt, formatDateBn } from "@/lib/utils";
import { getActiveSubscription } from "@/services/subscription.service";

export default async function SchoolSubscriptionPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const sub = getActiveSubscription(ctx.schoolId!);
  const plan = sub
    ? db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, sub.planId)).get()
    : null;
  return (
    <div>
      <PageHeader title="সাবস্ক্রিপশন" />
      <Card>
        <CardHeader>
          <CardTitle>{plan?.nameBn}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Badge variant={statusBadge(sub?.status || "")}>{sub?.status}</Badge>
          <p>মেয়াদ শেষ: {formatDateBn(sub?.endsAt)}</p>
          <p>মাসিক: {formatBdt(plan?.priceMonthly ?? 0)}</p>
          <p>সর্বোচ্চ শিক্ষার্থী: {plan?.maxStudents}</p>
        </CardContent>
      </Card>
    </div>
  );
}
