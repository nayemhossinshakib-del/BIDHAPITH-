import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { loginAsSchoolAdmin } from "@/services/impersonation.service";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const ctx = await requireAuth();
    const body = (await req.json()) as { schoolId?: string };
    if (!body.schoolId) throw new AppError("VALIDATION", "স্কুল প্রয়োজন", 422);
    const result = await loginAsSchoolAdmin(ctx, body.schoolId);
    return NextResponse.json({ ok: true, ...result, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json(payload, { status });
  }
}
