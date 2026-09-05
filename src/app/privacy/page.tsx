import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";

export const metadata = { title: "গোপনীয়তা" };

export default function PrivacyPage() {
  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold">গোপনীয়তা নীতি</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          শিক্ষার্থী, অভিভাবক ও পেমেন্ট তথ্য শুধু সংশ্লিষ্ট স্কুল ও প্ল্যাটফর্ম পরিচালনার জন্য ব্যবহৃত
          হয়। পাসওয়ার্ড হ্যাশ করে রাখা হয়। অডিট লগে গুরুত্বপূর্ণ কার্যক্রম নথিভুক্ত হয়।
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
