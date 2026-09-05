import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { processQueue, sendSms } from "@/services/sms.service";
import { requireSchoolId } from "@/lib/tenant";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const ctx = await requireAuth();
    const schoolId = requireSchoolId(ctx);
    const body = (await req.json()) as { recipient?: string; mobile?: string; message?: string };
    if (!body.mobile || !body.message) throw new AppError("VALIDATION", "নম্বর ও বার্তা প্রয়োজন", 422);
    const result = sendSms({
      ctx,
      schoolId,
      recipient: body.recipient || body.mobile,
      mobile: body.mobile,
      message: body.message,
    });
    await processQueue(10);
    return NextResponse.json({ ok: true, ...result, message: "SMS সফলভাবে পাঠানো হয়েছে", requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    return NextResponse.json(payload, { status: err instanceof AppError ? err.status : 400 });
  }
}
