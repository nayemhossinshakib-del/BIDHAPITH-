import { NextResponse } from "next/server";
import { AppError, toErrorPayload } from "@/lib/errors";
import { SESSION_COOKIE } from "@/lib/constants";
import { sessionCookieOptions } from "@/lib/auth/session";
import { requestId as makeId } from "@/lib/utils";
import { loginWithPassword } from "@/services/auth.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const body = (await req.json()) as { identifier?: string; password?: string };
    if (!body.identifier || !body.password) {
      return NextResponse.json(
        { ok: false, code: "VALIDATION", message: "ইমেইল ও পাসওয়ার্ড প্রয়োজন", requestId },
        { status: 422 },
      );
    }
    const result = await loginWithPassword({
      identifier: body.identifier,
      password: body.password,
      ip: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });
    const res = NextResponse.json({ ok: true, ...result, requestId });
    if ("jwt" in result && result.jwt && result.expiresAt) {
      res.cookies.set(SESSION_COOKIE, result.jwt as string, sessionCookieOptions(result.expiresAt as Date));
    }
    return res;
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    if (!(err instanceof AppError) && process.env.VERCEL) {
      payload.message = err instanceof Error ? err.message : payload.message;
    }
    const status = err instanceof AppError ? err.status : 500;
    return NextResponse.json(payload, { status });
  }
}
