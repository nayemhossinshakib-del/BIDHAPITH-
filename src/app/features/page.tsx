import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";

export const metadata = { title: "ফিচার" };

const groups = [
  {
    title: "সুপার অ্যাডমিন",
    items: ["স্কুল ব্যবস্থাপনা", "সাবস্ক্রিপশন ও প্ল্যান", "রেভিনিউ", "কেন্দ্রীয় SMS", "ডোমেইন", "অডিট লগ"],
  },
  {
    title: "স্কুল অ্যাডমিন",
    items: ["শিক্ষার্থী/শিক্ষক/হিসাবরক্ষক", "ক্লাস-সেকশন-বিষয়", "ফি ও পেমেন্ট", "ভর্তি", "ওয়েবসাইট", "রিপোর্ট"],
  },
  {
    title: "শিক্ষক",
    items: ["নিজ ক্লাস", "উপস্থিতি", "নম্বর এন্ট্রি", "নোটিশ", "প্রোফাইল"],
  },
  {
    title: "হিসাবরক্ষক",
    items: ["ফি আদায়", "রসিদ", "বকেয়া তালিকা", "দৈনিক/মাসিক কালেকশন"],
  },
  {
    title: "শিক্ষার্থী/অভিভাবক",
    items: ["উপস্থিতি", "ফলাফল", "ফি ইতিহাস", "নোটিশ", "সিলেবাস ডাউনলোড"],
  },
  {
    title: "পাবলিক ওয়েবসাইট",
    items: ["হোম, পরিচিতি, অধ্যক্ষের বাণী", "শিক্ষক, নোটিশ", "অনলাইন ভর্তি", "ডাউনলোড সেন্টার"],
  },
];

export default function FeaturesPage() {
  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-6xl px-4 py-16">
        <h1 className="text-4xl font-bold">ফিচার</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          লাইব্রেরি, হোস্টেল, পরিবহন বা বিশ্ববিদ্যালয় মডিউল নেই — শুধু স্কুল SaaS।
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g) => (
            <div key={g.title} className="rounded-2xl border border-border bg-card p-5">
              <h2 className="font-semibold">{g.title}</h2>
              <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                {g.items.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
