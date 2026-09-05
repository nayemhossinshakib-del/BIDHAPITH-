import { PageHeader } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/guard";

export default async function AccProfile() {
  const ctx = await requireRole(["ACCOUNTANT"]);
  return (
    <div>
      <PageHeader title="প্রোফাইল" />
      <Card>
        <CardContent className="p-5 text-sm">
          <p>{ctx.name}</p>
          <p>{ctx.email}</p>
        </CardContent>
      </Card>
    </div>
  );
}
