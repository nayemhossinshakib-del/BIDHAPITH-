import { PageHeader } from "@/components/empty-state";
import { requireRole } from "@/lib/guard";

const steps = [
  "স্কুল প্রোফাইল",
  "শিক্ষাবর্ষ",
  "ক্লাস",
  "সেকশন",
  "বিষয়",
  "শিক্ষক",
  "ফি",
  "ওয়েবসাইট",
  "এসএমএস",
  "সম্পন্ন",
];

export default async function OnboardingPage() {
  await requireRole(["SCHOOL_ADMIN"]);
  return (
    <div>
      <PageHeader title="অনবোর্ডিং" description="প্রয়োজনীয় নয় এমন ধাপ বাদ দেওয়া যাবে" />
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s} className="rounded-xl border border-border bg-card px-4 py-3">
            {i + 1}. {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
