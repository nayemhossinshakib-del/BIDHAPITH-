import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export const metadata = { title: "পাসওয়ার্ড রিসেট" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <Brand />
      <h1 className="mt-8 text-2xl font-semibold">পাসওয়ার্ড রিসেট</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        ইমেইল দিন। প্রোডাকশনে SMTP দিয়ে লিংক যাবে। ডেমোতে অ্যাডমিন পাসওয়ার্ড রিসেট করতে পারেন।
      </p>
      <form className="mt-6 space-y-4">
        <div>
          <Label htmlFor="email">ইমেইল</Label>
          <Input id="email" name="email" type="email" className="mt-1" required />
        </div>
        <Button type="submit" className="w-full">
          লিংক পাঠান
        </Button>
      </form>
      <Link href="/login" className="mt-4 text-sm text-primary">
        লগইনে ফিরে যান
      </Link>
    </div>
  );
}
