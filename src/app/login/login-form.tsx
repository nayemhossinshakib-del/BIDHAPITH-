"use client";

import { useSearchParams } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { DEMO_ACCOUNTS } from "@/lib/constants";
import { loginAction } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "যাচাই হচ্ছে..." : "প্রবেশ করুন"}
    </Button>
  );
}

export function LoginForm({ showDemo = false }: { showDemo?: boolean }) {
  const params = useSearchParams();
  const error = params.get("error");
  const next = params.get("next") || "";

  return (
    <div className="mt-6 space-y-4">
      <form action={loginAction} className="space-y-4">
        {next ? <input type="hidden" name="next" value={next} /> : null}
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
        <SubmitButton />
      </form>
      {showDemo ? (
        <div className="space-y-2 pt-2">
          <p className="text-xs text-muted-foreground">ডেমো এক ক্লিকে (Demo@1234)</p>
          <div className="grid gap-2">
            {DEMO_ACCOUNTS.map((a) => (
              <form action={loginAction} key={a.email}>
                {next ? <input type="hidden" name="next" value={next} /> : null}
                <input type="hidden" name="identifier" value={a.email} />
                <input type="hidden" name="password" value={a.password} />
                <Button type="submit" variant="outline" className="w-full justify-between text-sm">
                  <span>{a.label}</span>
                  <span className="font-mono text-xs text-muted-foreground">{a.email}</span>
                </Button>
              </form>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
