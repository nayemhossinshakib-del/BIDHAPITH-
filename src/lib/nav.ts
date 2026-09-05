import type { NavItem } from "@/components/shell/app-shell";

export const adminNav: Omit<NavItem, "icon">[] = [
  { href: "/admin", label: "ড্যাশবোর্ড" },
  { href: "/admin/schools", label: "স্কুল" },
  { href: "/admin/subscriptions", label: "সাবস্ক্রিপশন" },
  { href: "/admin/plans", label: "প্ল্যান" },
  { href: "/admin/payments", label: "পেমেন্ট" },
  { href: "/admin/sms", label: "এসএমএস" },
  { href: "/admin/users", label: "ইউজার" },
  { href: "/admin/admissions", label: "ভর্তি" },
  { href: "/admin/domains", label: "ডোমেইন" },
  { href: "/admin/reports", label: "রিপোর্ট" },
  { href: "/admin/audit-logs", label: "অডিট লগ" },
  { href: "/admin/settings", label: "সেটিংস" },
];

export const schoolNav: Omit<NavItem, "icon">[] = [
  { href: "/school", label: "ড্যাশবোর্ড" },
  { href: "/school/students", label: "শিক্ষার্থী" },
  { href: "/school/teachers", label: "শিক্ষক" },
  { href: "/school/accountants", label: "হিসাবরক্ষক" },
  { href: "/school/classes", label: "ক্লাস" },
  { href: "/school/subjects", label: "বিষয়" },
  { href: "/school/attendance", label: "উপস্থিতি" },
  { href: "/school/results", label: "ফলাফল" },
  { href: "/school/fees", label: "ফি" },
  { href: "/school/payments", label: "পেমেন্ট" },
  { href: "/school/admissions", label: "ভর্তি আবেদন" },
  { href: "/school/notices", label: "নোটিশ" },
  { href: "/school/documents", label: "ডকুমেন্ট" },
  { href: "/school/sms", label: "এসএমএস" },
  { href: "/school/reports", label: "রিপোর্ট" },
  { href: "/school/website", label: "ওয়েবসাইট" },
  { href: "/school/settings", label: "সেটিংস" },
  { href: "/school/subscription", label: "সাবস্ক্রিপশন" },
];

export const teacherNav: Omit<NavItem, "icon">[] = [
  { href: "/teacher", label: "ড্যাশবোর্ড" },
  { href: "/teacher/classes", label: "আমার ক্লাস" },
  { href: "/teacher/students", label: "শিক্ষার্থী" },
  { href: "/teacher/attendance", label: "উপস্থিতি" },
  { href: "/teacher/results", label: "নম্বর" },
  { href: "/teacher/notices", label: "নোটিশ" },
  { href: "/teacher/profile", label: "প্রোফাইল" },
];

export const accountantNav: Omit<NavItem, "icon">[] = [
  { href: "/accountant", label: "ড্যাশবোর্ড" },
  { href: "/accountant/fees", label: "ফি" },
  { href: "/accountant/payments", label: "পেমেন্ট" },
  { href: "/accountant/receipts", label: "রসিদ" },
  { href: "/accountant/dues", label: "বকেয়া" },
  { href: "/accountant/reports", label: "রিপোর্ট" },
  { href: "/accountant/profile", label: "প্রোফাইল" },
];

export const studentNav: Omit<NavItem, "icon">[] = [
  { href: "/student", label: "ড্যাশবোর্ড" },
  { href: "/student/profile", label: "প্রোফাইল" },
  { href: "/student/attendance", label: "উপস্থিতি" },
  { href: "/student/results", label: "ফলাফল" },
  { href: "/student/fees", label: "ফি" },
  { href: "/student/payments", label: "পেমেন্ট" },
  { href: "/student/notices", label: "নোটিশ" },
  { href: "/student/documents", label: "ডকুমেন্ট" },
];
