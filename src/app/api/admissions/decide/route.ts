import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { decideApplication } from "@/services/admission.service";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const ctx = await requireAuth();
    const body = (await req.json()) as { id?: string; decision?: "APPROVED" | "REJECTED" | "WAITING" };
    if (!body.id || !body.decision) throw new AppError("VALIDATION", "তথ্য অসম্পূর্ণ", 422);
    const decision = decideApplication(ctx, body.id, body.decision);
    return NextResponse.json({ ok: true, decision, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    return NextResponse.json(payload, { status: err instanceof AppError ? err.status : 400 });
  }
}
