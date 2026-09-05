"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(params.get("error"));
  const [pending, start] = useTransition();

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        start(async () => {
          setError(null);
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: fd.get("identifier"),
              password: fd.get("password"),
            }),
          });
          const data = await res.json();
          if (!res.ok) {
            setError(data.message || "লগইন ব্যর্থ");
            return;
          }
          router.push(data.redirectTo || "/");
          router.refresh();
        });
      }}
    >
      <div>
        <Label htmlFor="identifier">ইমেইল / মোবাইল</Label>
        <Input id="identifier" name="identifier" required className="mt-1" autoComplete="username" />
      </div>
      <div>
        <Label htmlFor="password">পাসওয়ার্ড</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1"
          autoComplete="current-password"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
      </Button>
    </form>
  );
}
