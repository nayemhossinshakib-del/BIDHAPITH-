"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 p-8">
      <h1 className="text-xl font-semibold">একটি ত্রুটি ঘটেছে</h1>
      <Button onClick={() => reset()}>আবার চেষ্টা করুন</Button>
    </div>
  );
}
