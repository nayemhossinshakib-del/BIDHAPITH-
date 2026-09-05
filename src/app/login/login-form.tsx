"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export function LoginForm({ showDemo = false }: { showDemo?: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(params.get("error"));
  const [pending, start] = useTransition();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  function submit(id = identifier, pass = password) {
    start(async () => {
      setError(null);
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ identifier: id, password: pass }),
        });
        const text = await res.text();
        let data: { message?: string; redirectTo?: string } = {};
        try {
          data = text ? JSON.parse(text) : {};
        } catch {
          setError(text.slice(0, 280) || "লগইন ব্যর্থ");
          return;
        }
        if (!res.ok) {
          setError(data.message || "লগইন ব্যর্থ");
          return;
        }
        const next = params.get("next") || data.redirectTo || "/admin";
        router.push(next);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "নেটওয়ার্ক ত্রুটি");
      }
    });
  }

  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
    >
      <div>
        <Label htmlFor="identifier">ইমেইল / মোবাইল</Label>
        <Input
          id="identifier"
          name="identifier"
          required
          className="mt-1"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
      </Button>
      {showDemo ? (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground">ডেমো এক ক্লিকে (Demo@1234)</p>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <Button
                key={a.email}
                type="button"
                variant="outline"
                className="w-full justify-between text-sm"
                disabled={pending}
                onClick={() => {
                  setIdentifier(a.email);
                  setPassword(a.password);
                  submit(a.email, a.password);
                }}
              >
                <span>{a.label}</span>
                <span className="font-mono text-xs text-muted-foreground">{a.email}</span>
              </Button>
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
}
