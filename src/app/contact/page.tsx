import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export const metadata = { title: "যোগাযোগ" };

export default function ContactPage() {
  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-xl px-4 py-16">
        <h1 className="text-4xl font-bold">যোগাযোগ</h1>
        <p className="mt-2 text-muted-foreground">ইমেইল: support@bidhapith.com · ফোন: ০১৭০০০০০০০০</p>
        <form className="mt-8 space-y-4 rounded-2xl border border-border bg-card p-6">
          <div>
            <Label htmlFor="name">নাম</Label>
            <Input id="name" name="name" className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" name="email" type="email" className="mt-1" required />
          </div>
          <div>
            <Label htmlFor="message">বার্তা</Label>
            <Textarea id="message" name="message" className="mt-1" required />
          </div>
          <Button type="submit">পাঠান</Button>
        </form>
      </main>
      <MarketingFooter />
    </div>
  );
}
