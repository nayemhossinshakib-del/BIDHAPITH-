import { eq } from "drizzle-orm";
import { db, sqlite } from "@/db";
import { paymentTransactions } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId } from "@/lib/id";
import { getPaymentProvider } from "@/services/providers/payment";

export function createPaymentRecord(opts: {
  schoolId?: string | null;
  userId?: string | null;
  purpose: "SUBSCRIPTION" | "ADMISSION" | "FEE" | "SMS_PACKAGE";
  amount: number;
  provider?: string;
  idempotencyKey?: string;
  metadata?: Record<string, unknown>;
}) {
  if (opts.amount <= 0) throw new AppError("INVALID_AMOUNT", "পরিমাণ সঠিক নয়", 422);
  if (opts.idempotencyKey) {
    const existing = db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.idempotencyKey, opts.idempotencyKey))
      .get();
    if (existing) return existing;
  }
  const id = createId();
  db.insert(paymentTransactions)
    .values({
      id,
      schoolId: opts.schoolId ?? null,
      userId: opts.userId ?? null,
      purpose: opts.purpose,
      amount: opts.amount,
      currency: "BDT",
      provider: opts.provider ?? process.env.PAYMENT_PROVIDER ?? "demo",
      status: "PENDING",
      idempotencyKey: opts.idempotencyKey ?? id,
      metadata: opts.metadata ? JSON.stringify(opts.metadata) : null,
    })
    .run();
  return db.select().from(paymentTransactions).where(eq(paymentTransactions.id, id)).get()!;
}

export async function markPaidFromWebhook(opts: {
  paymentId: string;
  gatewayRef: string;
  amount: number;
  transactionId: string;
}) {
  return sqlite.transaction(() => {
    const row = db
      .select()
      .from(paymentTransactions)
      .where(eq(paymentTransactions.id, opts.paymentId))
      .get();
    if (!row) throw new AppError("NOT_FOUND", "পেমেন্ট পাওয়া যায়নি", 404);
    if (row.status === "PAID") return row;
    if (Number(row.amount) !== Number(opts.amount)) {
      throw new AppError("AMOUNT_MISMATCH", "পেমেন্ট পরিমাণ মিলছে না", 400);
    }
    db.update(paymentTransactions)
      .set({
        status: "PAID",
        gatewayRef: opts.gatewayRef,
        transactionId: opts.transactionId,
        paidAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(paymentTransactions.id, row.id))
      .run();
    writeAudit({
      schoolId: row.schoolId,
      action: "PAYMENT_PAID",
      module: "payments",
      resource: "payment_transaction",
      resourceId: row.id,
      after: { amount: opts.amount, transactionId: opts.transactionId },
    });
    return db.select().from(paymentTransactions).where(eq(paymentTransactions.id, row.id)).get()!;
  })();
}

export async function completeDemoPayment(paymentId: string, ctx?: AuthContext | null) {
  const row = db.select().from(paymentTransactions).where(eq(paymentTransactions.id, paymentId)).get();
  if (!row) throw new AppError("NOT_FOUND", "পেমেন্ট পাওয়া যায়নি", 404);
  const provider = getPaymentProvider();
  const verified = await provider.verifyPayment(row.transactionId || row.id);
  if (!verified.ok || verified.status !== "PAID") {
    throw new AppError("VERIFY_FAILED", "পেমেন্ট যাচাই করা যায়নি", 400);
  }
  return markPaidFromWebhook({
    paymentId: row.id,
    gatewayRef: verified.gatewayRef ?? verified.transactionId,
    amount: row.amount,
    transactionId: verified.transactionId,
  });
}
