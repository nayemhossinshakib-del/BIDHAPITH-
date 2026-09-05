import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Check,
  Globe2,
  GraduationCap,
  MessageSquare,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";
import { formatBdt } from "@/lib/utils";

const features = [
  {
    icon: Globe2,
    title: "স্কুল ওয়েবসাইট",
    text: "প্রতিটি স্কুল পায় নিজস্ব ওয়েবসাইট, সাবডোমেইন ও কাস্টম ডোমেইন সাপোর্ট।",
  },
  {
    icon: GraduationCap,
    title: "অনলাইন ভর্তি",
    text: "আবেদন, ডকুমেন্ট আপলোড, ভর্তি ফি পেমেন্ট ও আবেদন ট্র্যাকিং।",
  },
  {
    icon: Wallet,
    title: "ফি ও রসিদ",
    text: "মাসিক ফি, বকেয়া, ছাড়, জরিমানা এবং বাংলা রসিদ — সব হিসাব নিরাপদ।",
  },
  {
    icon: MessageSquare,
    title: "কেন্দ্রীয় SMS",
    text: "সুপার অ্যাডমিন গেটওয়ে, স্কুলভিত্তিক ক্রেডিট ও কিউ থেকে বাল্ক SMS।",
  },
  {
    icon: ShieldCheck,
    title: "টেন্যান্ট আইসোলেশন",
    text: "প্রতিটি স্কুল সম্পূর্ণ আলাদা। অন্য স্কুলের ডেটা কখনোই দেখা যায় না।",
  },
  {
    icon: Bell,
    title: "নোটিশ ও ডকুমেন্ট",
    text: "পাবলিক নোটিশ বোর্ড, সিলেবাস, রুটিন ও শিক্ষার্থী পোর্টাল ডাউনলোড।",
  },
];

const steps = [
  { n: "১", t: "স্কুল নিবন্ধন", d: "তথ্য দিন, অ্যাডমিন তৈরি করুন, প্ল্যান বাছুন।" },
  { n: "২", t: "পেমেন্ট", d: "bKash, Nagad, SSLCommerz বা ব্যাংক — যাচাই সার্ভারে।" },
  { n: "৩", t: "ওয়েবসাইট ও প্যানেল", d: "সাবডোমেইন, রোল, ক্লাস ও ওয়েবসাইট অটো তৈরি।" },
  { n: "৪", t: "দৈনন্দিন পরিচালনা", d: "শিক্ষার্থী, ফি, উপস্থিতি, ফলাফল ও SMS চালু করুন।" },
];

const faqs = [
  {
    q: "একাধিক স্কুল কি এক প্ল্যাটফর্মে চলবে?",
    a: "হ্যাঁ। বিধাপীঠ মাল্টি-টেন্যান্ট SaaS। প্রতিটি স্কুল আলাদা টেন্যান্ট, ইউজার ও SMS ব্যালেন্স পায়।",
  },
  {
    q: "কাস্টম ডোমেইন কিভাবে যুক্ত হয়?",
    a: "স্কুল অ্যাডমিন ডোমেইন দেন, DNS নির্দেশনা পান, যাচাইয়ের পর SSL ও ACTIVE স্ট্যাটাস হয়।",
  },
  {
    q: "পেমেন্ট কি নিরাপদ?",
    a: "ক্লায়েন্টের সফলতার উপর নির্ভর করা হয় না। ওয়েবহুক ও গেটওয়ে API দিয়ে সার্ভারে যাচাই হয়।",
  },
  {
    q: "ডেমো কিভাবে দেখব?",
    a: "লগইন পেজে ডেমো অ্যাকাউন্ট দেওয়া আছে — সুপার অ্যাডমিন, স্কুল, শিক্ষক, হিসাবরক্ষক ও শিক্ষার্থী।",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNavbar />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,118,110,0.16),transparent_45%)]" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              বাংলাদেশের স্কুলগুলোর জন্য তৈরি
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              বাংলাদেশের স্কুল ব্যবস্থাপনা এখন আরও সহজ
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">
              স্কুল ওয়েবসাইট, অনলাইন ভর্তি, ফি ব্যবস্থাপনা, SMS এবং স্কুল অ্যাডমিন—সবকিছু এক
              প্ল্যাটফর্মে।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/register">
                  স্কুল শুরু করুন <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">প্ল্যান দেখুন</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
              <span>৳ বাংলাদেশি টাকা</span>
              <span>Asia/Dhaka</span>
              <span>RBAC ও টেন্যান্ট নিরাপত্তা</span>
            </div>
          </div>
          <DashboardPreview />
        </div>
      </section>

      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:grid-cols-3">
          {[
            ["শত শত স্কুল", "মাল্টি-টেন্যান্ট স্কেলে চালানোর জন্য তৈরি"],
            ["বাংলা ইউআই", "ড্যাশবোর্ড থেকে রসিদ পর্যন্ত বাংলাদেশি পরিভাষা"],
            ["কেন্দ্রীয় নিয়ন্ত্রণ", "সাবস্ক্রিপশন, পেমেন্ট, SMS ও ডোমেইন"],
          ].map(([t, d]) => (
            <div key={t}>
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-semibold">এক প্ল্যাটফর্মে স্কুল পরিচালনা</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          লাইব্রেরি, হোস্টেল বা পরিবহন নয় — শুধু বাংলাদেশি স্কুলের প্রয়োজনীয় মডিউল।
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <f.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sidebar text-sidebar-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-semibold text-white">কিভাবে কাজ করে</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-white/5 p-5">
                <p className="text-2xl font-bold text-teal-300">{s.n}</p>
                <p className="mt-2 font-medium text-white">{s.t}</p>
                <p className="mt-1 text-sm text-white/70">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold">স্বচ্ছ মূল্য</h2>
            <p className="text-muted-foreground">মাসিক বা বাৎসরিক। সুপার অ্যাডমিন প্ল্যান সম্পাদনা করতে পারেন।</p>
          </div>
          <Link href="/pricing" className="text-sm text-primary">
            সব প্ল্যান →
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["বেসিক", 1499, ["২০০ শিক্ষার্থী", "স্কুল ওয়েবসাইট", "২০০ SMS"]],
            ["প্রফেশনাল", 3499, ["৮০০ শিক্ষার্থী", "কাস্টম ডোমেইন", "১০০০ SMS"]],
            ["প্রিমিয়াম", 6999, ["২০০০ শিক্ষার্থী", "অগ্রাধিকার সাপোর্ট", "৩০০০ SMS"]],
          ].map(([name, price, items]) => (
            <div key={String(name)} className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm text-muted-foreground">{name as string}</p>
              <p className="mt-2 text-3xl font-semibold">
                {formatBdt(price as number)}
                <span className="text-sm font-normal text-muted-foreground">/মাস</span>
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {(items as string[]).map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-3xl font-semibold">স্কুলগুলো যা বলছে</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["আদর্শ উচ্চ বিদ্যালয়", "ঢাকা", "অনলাইন ভর্তি ও ফি আদায় এখন অনেক সহজ। অভিভাবকরা এসএমএস পান।"],
            ["নূরানী মডেল স্কুল", "চট্টগ্রাম", "নিজস্ব ওয়েবসাইট পেয়ে অভিভাবক যোগাযোগ বেড়েছে।"],
            ["গ্রিন ভ্যালি স্কুল", "সিলেট", "হিসাবরক্ষক প্যানেল থেকে রসিদ ও বকেয়া রিপোর্ট পাই।"],
          ].map(([school, city, quote]) => (
            <blockquote key={school} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm leading-relaxed">“{quote}”</p>
              <footer className="mt-4 text-sm text-muted-foreground">
                {school} · {city}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-16">
        <h2 className="text-3xl font-semibold">প্রশ্নোত্তর</h2>
        <div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card">
          {faqs.map((f) => (
            <details key={f.q} className="px-5 py-4">
              <summary className="cursor-pointer font-medium">{f.q}</summary>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-secondary/50">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold">আজই আপনার স্কুল যুক্ত করুন</h2>
            <p className="text-muted-foreground">ফ্রি ট্রায়াল দিয়ে শুরু করুন, পরে প্ল্যান আপগ্রেড করুন।</p>
          </div>
          <Button asChild size="lg">
            <Link href="/register">স্কুল শুরু করুন</Link>
          </Button>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-xl">
      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>স্কুল অ্যাডমিন · আদর্শ উচ্চ বিদ্যালয়</span>
        <span>এসএমএস ৯৮০</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          ["শিক্ষার্থী", "১২৪"],
          ["শিক্ষক", "১৮"],
          ["আজকের আদায়", "৳২৪,৫০০"],
          ["অপেক্ষমাণ ভর্তি", "৭"],
        ].map(([k, v]) => (
          <div key={k} className="rounded-xl bg-muted/70 p-3">
            <p className="text-xs text-muted-foreground">{k}</p>
            <p className="text-xl font-semibold">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-xl bg-sidebar p-4 text-white">
        <p className="text-xs text-white/70">অনলাইন ভর্তি আবেদন</p>
        <p className="mt-1 text-sm">নাবিলা তাসনিম · ষষ্ঠ শ্রেণি · ফি ৳৫০০ পরিশোধিত</p>
      </div>
    </div>
  );
}
