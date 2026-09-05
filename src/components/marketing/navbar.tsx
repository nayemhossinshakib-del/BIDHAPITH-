import Link from "next/link";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/features", label: "ফিচার" },
  { href: "/pricing", label: "মূল্য" },
  { href: "/about", label: "আমাদের কথা" },
  { href: "/contact", label: "যোগাযোগ" },
];

export function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Brand />
        <nav className="hidden items-center gap-6 text-sm md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-muted-foreground hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost">
            <Link href="/login">লগইন</Link>
          </Button>
          <Button asChild>
            <Link href="/register">স্কুল শুরু করুন</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-4">
        <div className="sm:col-span-2">
          <Brand />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            বাংলাদেশি স্কুলগুলোর জন্য মাল্টি-টেন্যান্ট সাস প্ল্যাটফর্ম — ওয়েবসাইট, অনলাইন ভর্তি, ফি,
            এসএমএস ও অ্যাডমিন এক জায়গায়।
          </p>
        </div>
        <div>
          <p className="font-medium">প্ল্যাটফর্ম</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/features">ফিচার</Link>
            <Link href="/pricing">মূল্য তালিকা</Link>
            <Link href="/s/abc">ডেমো স্কুল ওয়েবসাইট</Link>
          </div>
        </div>
        <div>
          <p className="font-medium">আইনগত</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="/terms">শর্তাবলি</Link>
            <Link href="/privacy">গোপনীয়তা</Link>
            <Link href="/contact">যোগাযোগ</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} বিধাপীঠ · Asia/Dhaka · ৳ BDT
      </div>
    </footer>
  );
}
