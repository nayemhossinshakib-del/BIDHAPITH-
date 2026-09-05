import { MarketingFooter, MarketingNavbar } from "@/components/marketing/navbar";

export const metadata = { title: "আমাদের কথা" };

export default function AboutPage() {
  return (
    <div>
      <MarketingNavbar />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold">বিধাপীঠ সম্পর্কে</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          বিধাপীঠ বাংলাদেশি স্কুলগুলোর জন্য একটি মাল্টি-টেন্যান্ট SaaS প্ল্যাটফর্ম। লক্ষ্য সহজ:
          একটি স্কুল নিবন্ধন করবে, প্ল্যান কিনবে, নিজস্ব ওয়েবসাইট ও অ্যাডমিন প্যানেল পাবে, অনলাইন
          ভর্তি নেবে, ফি আদায় করবে এবং SMS পাঠাবে — সম্পূর্ণ আলাদা টেন্যান্ট হিসেবে।
        </p>
        <p className="mt-4 leading-relaxed text-muted-foreground">
          প্ল্যাটফর্মের মুদ্রা ৳ BDT, সময় অঞ্চল Asia/Dhaka, এবং ইউজার ইন্টারফেস প্রাথমিকভাবে বাংলা।
        </p>
      </main>
      <MarketingFooter />
    </div>
  );
}
