import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { schools, subscriptions, users } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateBn } from "@/lib/utils";

export default async function SchoolDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const school = db.select().from(schools).where(eq(schools.id, id)).get();
  if (!school) notFound();
  const admins = db.select().from(users).where(eq(users.schoolId, id)).all();
  const subs = db.select().from(subscriptions).where(eq(subscriptions.schoolId, id)).all();
  return (
    <div>
      <PageHeader title={school.nameBn || school.name} description={`${school.code} · ${school.email}`} />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>স্ট্যাটাস</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={statusBadge(school.status)}>{school.status}</Badge>
            <p className="mt-2 text-sm text-muted-foreground">SMS ব্যালেন্স: {school.smsBalance}</p>
            <p className="text-sm text-muted-foreground">তৈরি: {formatDateBn(school.createdAt)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>অ্যাডমিন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {admins.map((u) => (
              <div key={u.id}>
                {u.name} · {u.role} · {u.email}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>সাবস্ক্রিপশন</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {subs.map((s) => (
              <div key={s.id}>
                {s.status} · {s.billingCycle} · শেষ {formatDateBn(s.endsAt)}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
