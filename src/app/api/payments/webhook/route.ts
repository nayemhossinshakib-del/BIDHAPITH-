import { NextResponse } from "next/server";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { markPaidFromWebhook } from "@/services/payment.service";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const body = (await req.json()) as {
      paymentId?: string;
      gatewayRef?: string;
      amount?: number;
      transactionId?: string;
    };
    if (!body.paymentId || !body.transactionId || typeof body.amount !== "number") {
      throw new AppError("VALIDATION", "ওয়েবহুক তথ্য অসম্পূর্ণ", 422);
    }
    const row = await markPaidFromWebhook({
      paymentId: body.paymentId,
      gatewayRef: body.gatewayRef || body.transactionId,
      amount: body.amount,
      transactionId: body.transactionId,
    });
    return NextResponse.json({ ok: true, status: row.status, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json(payload, { status });
  }
}
