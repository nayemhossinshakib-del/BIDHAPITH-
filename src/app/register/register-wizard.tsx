"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { DIVISIONS, SCHOOL_TYPES } from "@/lib/constants";
import { formatBdt } from "@/lib/utils";

type Plan = {
  slug: string;
  nameBn: string;
  priceMonthly: number;
  priceYearly: number;
};

const empty = {
  schoolName: "",
  schoolCode: "",
  eiin: "",
  schoolType: "private",
  address: "",
  division: "dhaka",
  district: "ঢাকা",
  mobile: "",
  email: "",
  slug: "",
  adminName: "",
  adminEmail: "",
  adminMobile: "",
  password: "",
  confirm: "",
  planSlug: "trial",
  billingCycle: "MONTHLY" as "MONTHLY" | "YEARLY",
};

export function RegisterWizard({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ ...empty, planSlug: sp.get("plan") || "trial" });
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const planList = plans.length
    ? plans
    : [
        { slug: "trial", nameBn: "ফ্রি ট্রায়াল", priceMonthly: 0, priceYearly: 0 },
        { slug: "basic", nameBn: "বেসিক", priceMonthly: 1499, priceYearly: 14990 },
        { slug: "professional", nameBn: "প্রফেশনাল", priceMonthly: 3499, priceYearly: 34990 },
      ];

  const selected = useMemo(
    () => planList.find((p) => p.slug === form.planSlug) ?? planList[0],
    [form.planSlug, planList],
  );

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6">
      <div className="mb-6 flex gap-2 text-sm">
        {["স্কুল", "অ্যাডমিন", "প্ল্যান", "পেমেন্ট"].map((l, i) => (
          <span
            key={l}
            className={`rounded-full px-3 py-1 ${step === i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}
          >
            {i + 1}. {l}
          </span>
        ))}
      </div>

      {step === 1 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="স্কুলের নাম" value={form.schoolName} onChange={(v) => set("schoolName", v)} />
          <Field label="স্কুল কোড" value={form.schoolCode} onChange={(v) => set("schoolCode", v)} />
          <Field label="EIIN (ঐচ্ছিক)" value={form.eiin} onChange={(v) => set("eiin", v)} />
          <div>
            <Label>স্কুলের ধরন</Label>
            <select
              className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
              value={form.schoolType}
              onChange={(e) => set("schoolType", e.target.value)}
            >
              {SCHOOL_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>বিভাগ</Label>
            <select
              className="mt-1 h-10 w-full rounded-lg border border-input bg-card px-3 text-sm"
              value={form.division}
              onChange={(e) => set("division", e.target.value)}
            >
              {DIVISIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <Field label="জেলা" value={form.district} onChange={(v) => set("district", v)} />
          <Field label="মোবাইল" value={form.mobile} onChange={(v) => set("mobile", v)} />
          <Field label="ইমেইল" value={form.email} onChange={(v) => set("email", v)} />
          <Field label="ঠিকানা" value={form.address} onChange={(v) => set("address", v)} />
          <Field label="ওয়েবসাইট স্লাগ" value={form.slug} onChange={(v) => set("slug", v)} />
        </div>
      ) : null}

      {step === 2 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="অ্যাডমিনের নাম" value={form.adminName} onChange={(v) => set("adminName", v)} />
          <Field label="অ্যাডমিন ইমেইল" value={form.adminEmail} onChange={(v) => set("adminEmail", v)} />
          <Field label="অ্যাডমিন মোবাইল" value={form.adminMobile} onChange={(v) => set("adminMobile", v)} />
          <Field label="পাসওয়ার্ড" value={form.password} onChange={(v) => set("password", v)} type="password" />
          <Field label="পাসওয়ার্ড নিশ্চিত" value={form.confirm} onChange={(v) => set("confirm", v)} type="password" />
        </div>
      ) : null}

      {step === 3 ? (
        <div className="grid gap-3">
          {planList.map((p) => (
            <label
              key={p.slug}
              className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 ${form.planSlug === p.slug ? "border-primary bg-secondary/50" : "border-border"}`}
            >
              <div>
                <input
                  type="radio"
                  name="plan"
                  className="mr-2"
                  checked={form.planSlug === p.slug}
                  onChange={() => set("planSlug", p.slug)}
                />
                {p.nameBn}
              </div>
              <span>{p.priceMonthly ? formatBdt(p.priceMonthly) : "ফ্রি"}</span>
            </label>
          ))}
          <div className="flex gap-2 text-sm">
            <button
              type="button"
              className={form.billingCycle === "MONTHLY" ? "font-semibold" : "text-muted-foreground"}
              onClick={() => set("billingCycle", "MONTHLY")}
            >
              মাসিক
            </button>
            <button
              type="button"
              className={form.billingCycle === "YEARLY" ? "font-semibold" : "text-muted-foreground"}
              onClick={() => set("billingCycle", "YEARLY")}
            >
              বাৎসরিক
            </button>
          </div>
        </div>
      ) : null}

      {step === 4 ? (
        <div className="space-y-3 text-sm">
          <p>
            স্কুল: <strong>{form.schoolName}</strong>
          </p>
          <p>
            প্ল্যান: <strong>{selected?.nameBn}</strong> ({form.billingCycle === "YEARLY" ? "বাৎসরিক" : "মাসিক"})
          </p>
          <p>ডেমো মোডে পেমেন্ট স্বয়ংক্রিয়ভাবে যাচাই হবে (bKash / Nagad / SSLCommerz ইন্টারফেস প্রস্তুত)।</p>
        </div>
      ) : null}

      {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

      <div className="mt-6 flex justify-between">
        <Button type="button" variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>
          পেছনে
        </Button>
        {step < 4 ? (
          <Button type="button" onClick={() => setStep((s) => s + 1)}>
            পরবর্তী
          </Button>
        ) : (
          <Button
            disabled={pending}
            onClick={() => {
              if (form.password !== form.confirm) {
                setError("পাসওয়ার্ড মিলছে না");
                return;
              }
              start(async () => {
                setError(null);
                const res = await fetch("/api/schools/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(form),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.message || "নিবন্ধন ব্যর্থ");
                  return;
                }
                router.push(`/login?registered=${data.slug}`);
              });
            }}
          >
            {pending ? "তৈরি হচ্ছে..." : "পেমেন্ট সম্পন্ন ও স্কুল তৈরি"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1" type={type} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
