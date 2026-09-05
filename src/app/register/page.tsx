import { Suspense } from "react";
import { Brand } from "@/components/brand";
import { RegisterWizard } from "./register-wizard";
import { listPlans } from "@/services/subscription.service";

export const metadata = { title: "স্কুল নিবন্ধন" };

export default function RegisterPage() {
  let plans: ReturnType<typeof listPlans> = [];
  try {
    plans = listPlans();
  } catch {
    plans = [];
  }
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Brand />
        <h1 className="mt-8 text-3xl font-semibold">স্কুল নিবন্ধন</h1>
        <p className="mt-2 text-muted-foreground">চার ধাপে আপনার স্কুল টেন্যান্ট তৈরি করুন।</p>
        <Suspense>
          <RegisterWizard plans={plans} />
        </Suspense>
      </div>
    </div>
  );
}
