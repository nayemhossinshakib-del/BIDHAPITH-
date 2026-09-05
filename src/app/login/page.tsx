import Link from "next/link";
import { Suspense } from "react";
import { Brand } from "@/components/brand";
import { LoginForm } from "./login-form";
import { DEMO_ACCOUNTS } from "@/lib/constants";

export const metadata = { title: "লগইন" };

export default function LoginPage() {
  const demo = process.env.DEMO_MODE !== "false";
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-white lg:flex">
        <Brand className="text-white" />
        <div>
          <h1 className="text-3xl font-semibold">আপনার স্কুলের নিরাপদ পোর্টাল</h1>
          <p className="mt-3 max-w-sm text-white/70">
            রোল অনুযায়ী ড্যাশবোর্ডে প্রবেশ করুন। অন্য স্কুলের তথ্যে প্রবেশ সম্পূর্ণ নিষিদ্ধ।
          </p>
        </div>
        <p className="text-sm text-white/50">Asia/Dhaka · ৳ BDT</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Brand />
          </div>
          <h2 className="text-2xl font-semibold">লগইন</h2>
          <p className="mt-1 text-sm text-muted-foreground">ইমেইল বা মোবাইল এবং পাসওয়ার্ড দিন</p>
          <Suspense>
            <LoginForm showDemo={demo} />
          </Suspense>
          <p className="mt-4 text-sm text-muted-foreground">
            নতুন স্কুল?{" "}
            <Link href="/register" className="text-primary">
              নিবন্ধন করুন
            </Link>
            {" · "}
            <Link href="/forgot-password" className="text-primary">
              পাসওয়ার্ড ভুলে গেছেন?
            </Link>
          </p>
          {demo ? (
            <div className="mt-8 rounded-2xl border border-dashed border-border p-4 text-sm">
              <p className="font-medium">ডেমো অ্যাকাউন্ট (Demo@1234)</p>
              <ul className="mt-2 space-y-1 text-muted-foreground">
                {DEMO_ACCOUNTS.map((a) => (
                  <li key={a.email}>
                    {a.label}: {a.email}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
