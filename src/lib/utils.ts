import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBdt(amount: number | string | null | undefined): string {
  const n = Number(amount ?? 0);
  return `৳${n.toLocaleString("bn-BD", { maximumFractionDigits: 0 })}`;
}

export function formatDateBn(input: Date | string | number | null | undefined): string {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTimeBn(input: Date | string | number | null | undefined): string {
  if (!input) return "—";
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("bn-BD", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function bnNumber(n: number | string | null | undefined): string {
  const s = String(n ?? 0);
  const map: Record<string, string> = {
    "0": "০",
    "1": "১",
    "2": "২",
    "3": "৩",
    "4": "৪",
    "5": "৫",
    "6": "৬",
    "7": "৭",
    "8": "৮",
    "9": "৯",
  };
  return s.replace(/[0-9]/g, (d) => map[d] ?? d);
}

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

export function isBdMobile(value: string): boolean {
  return /^01[3-9]\d{8}$/.test(value.replace(/[\s-]/g, ""));
}

export function normalizeMobile(value: string): string {
  return value.replace(/[\s-]/g, "");
}

export function smsUnits(message: string): number {
  const isUnicode = /[^\u0000-\u007f]/.test(message);
  if (isUnicode) {
    if (message.length <= 70) return 1;
    return Math.ceil(message.length / 67);
  }
  if (message.length <= 160) return 1;
  return Math.ceil(message.length / 153);
}

export function requestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
