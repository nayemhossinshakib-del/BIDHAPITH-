import { NextResponse } from "next/server";
import { AppError, toErrorPayload } from "@/lib/errors";
import { SESSION_COOKIE } from "@/lib/constants";
import { sessionCookieOptions } from "@/lib/auth/session";
import { requestId as makeId } from "@/lib/utils";
import { loginWithPassword } from "@/services/auth.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function originOf(req: Request) {
  const url = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") || url.protocol.replace(":", "") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || url.host;
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  const requestId = makeId();
  const contentType = req.headers.get("content-type") || "";
  const isForm = contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data");

  try {
    let identifier = "";
    let password = "";
    let next = "";
    if (isForm) {
      const fd = await req.formData();
      identifier = String(fd.get("identifier") || "");
      password = String(fd.get("password") || "");
      next = String(fd.get("next") || "");
    } else {
      const body = (await req.json()) as { identifier?: string; password?: string; next?: string };
      identifier = body.identifier || "";
      password = body.password || "";
      next = body.next || "";
    }

    if (!identifier || !password) {
      if (isForm) {
        return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent("ইমেইল ও পাসওয়ার্ড প্রয়োজন"), originOf(req)), 303);
      }
      return NextResponse.json(
        { ok: false, code: "VALIDATION", message: "ইমেইল ও পাসওয়ার্ড প্রয়োজন", requestId },
        { status: 422 },
      );
    }

    const result = await loginWithPassword({
      identifier,
      password,
      ip: req.headers.get("x-forwarded-for"),
      userAgent: req.headers.get("user-agent"),
    });
    const dest = next.startsWith("/") && !next.startsWith("//") ? next : result.redirectTo || "/admin";

    if (isForm) {
      const res = NextResponse.redirect(new URL(dest, originOf(req)), 303);
      if (result.jwt && result.expiresAt) {
        res.cookies.set(SESSION_COOKIE, result.jwt, sessionCookieOptions(result.expiresAt));
      }
      return res;
    }

    const { jwt, expiresAt, ...publicResult } = result;
    const res = NextResponse.json({ ok: true, ...publicResult, requestId });
    if (jwt && expiresAt) {
      res.cookies.set(SESSION_COOKIE, jwt, sessionCookieOptions(expiresAt));
    }
    return res;
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    if (!(err instanceof AppError) && process.env.VERCEL) {
      payload.message = err instanceof Error ? err.message : payload.message;
    }
    if (isForm) {
      return NextResponse.redirect(new URL("/login?error=" + encodeURIComponent(payload.message), originOf(req)), 303);
    }
    const status = err instanceof AppError ? err.status : 500;
    return NextResponse.json(payload, { status });
  }
}
