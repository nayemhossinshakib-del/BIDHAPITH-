"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";

export function SendSmsForm() {
  const router = useRouter();
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <form
      className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          const res = await fetch("/api/sms/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              recipient: fd.get("recipient"),
              mobile: fd.get("mobile"),
              message: fd.get("message"),
            }),
          });
          const data = await res.json();
          setMsg(data.message || (res.ok ? "SMS সফলভাবে পাঠানো হয়েছে" : "ব্যর্থ"));
          if (res.ok) router.refresh();
        });
      }}
    >
      <div>
        <Label>প্রাপক</Label>
        <Input name="recipient" className="mt-1" required placeholder="অভিভাবক" />
      </div>
      <div>
        <Label>মোবাইল</Label>
        <Input name="mobile" className="mt-1" required placeholder="01XXXXXXXXX" />
      </div>
      <div className="sm:col-span-2">
        <Label>বার্তা</Label>
        <Textarea name="message" className="mt-1" required />
      </div>
      <Button disabled={pending} type="submit">
        পাঠান
      </Button>
      {msg ? <p className="text-sm text-primary">{msg}</p> : null}
    </form>
  );
}
