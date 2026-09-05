import type { Metadata } from "next";
import { Noto_Sans_Bengali, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

const bengali = Noto_Sans_Bengali({
  subsets: ["bengali"],
  variable: "--font-bengali",
  weight: ["400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: {
    default: "বিধাপীঠ — বাংলাদেশের স্কুল ব্যবস্থাপনা SaaS",
    template: "%s · বিধাপীঠ",
  },
  description:
    "স্কুল ওয়েবসাইট, অনলাইন ভর্তি, ফি ব্যবস্থাপনা, SMS এবং স্কুল অ্যাডমিন—সবকিছু এক প্ল্যাটফর্মে।",
  manifest: "/manifest.webmanifest",
  applicationName: "বিধাপীঠ",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${jakarta.variable} ${bengali.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
