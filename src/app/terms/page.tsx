import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";

export const metadata = { title: "শর্তাবলি" };

export default function TermsPage() {
  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold">ব্যবহারের শর্তাবলি</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          বিধাপীঠ একটি সাবস্ক্রিপশনভিত্তিক সেবা। প্রতিটি স্কুল নিজস্ব তথ্যের দায়িত্বে থাকবে। অন্য
          টেন্যান্টের ডেটায় প্রবেশ নিষিদ্ধ। পেমেন্ট যাচাই সার্ভার-সাইডে সম্পন্ন হয়। এসএমএস ক্রেডিট
          ফেরতযোগ্য নয় যদি না সুপার অ্যাডমিন অন্যথা নির্ধারণ করেন।
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
