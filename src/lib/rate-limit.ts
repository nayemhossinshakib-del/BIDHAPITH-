type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1 };
  }
  if (current.count >= limit) {
    return { ok: false, remaining: 0, retryAfterMs: current.resetAt - now };
  }
  current.count += 1;
  return { ok: true, remaining: limit - current.count };
}

export function assertRateLimit(key: string, limit: number, windowMs: number) {
  const r = rateLimit(key, limit, windowMs);
  if (!r.ok) {
    const { AppError } = require("@/lib/errors") as typeof import("@/lib/errors");
    throw new AppError("RATE_LIMIT", "অনেকবার চেষ্টা করা হয়েছে, কিছুক্ষণ পর আবার চেষ্টা করুন", 429);
  }
}
