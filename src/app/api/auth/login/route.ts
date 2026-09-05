import { NextResponse } from "next/server";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { loginWithPassword } from "@/services/auth.service";

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
    return NextResponse.json({ ok: true, ...result, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json(payload, { status });
  }
}
