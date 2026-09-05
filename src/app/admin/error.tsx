"use client";

import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-xl font-semibold">সুপার অ্যাডমিন ড্যাশবোর্ড খোলা যায়নি</h1>
      <p className="max-w-lg text-center text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={() => reset()}>আবার চেষ্টা করুন</Button>
    </div>
  );
}
