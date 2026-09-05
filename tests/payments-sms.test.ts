import { beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";

process.env.DATABASE_URL ||= "file:./data/bidhapith.db";
process.env.AUTH_SECRET ||= "test-secret";

describe("payment webhook security", () => {
  beforeAll(async () => {
    await import("../src/db");
  });

  it("rejects amount tampering and is idempotent", async () => {
    const { db } = await import("../src/db");
    const { paymentTransactions } = await import("../src/db/schema");
    const { createPaymentRecord, markPaidFromWebhook } = await import("../src/services/payment.service");
    const { schools } = await import("../src/db/schema");
    const school = db.select().from(schools).all()[0];
    if (!school) return;

    const pay = createPaymentRecord({
      schoolId: school.id,
      purpose: "ADMISSION",
      amount: 500,
      idempotencyKey: `test-${Date.now()}`,
    });

    await expect(
      markPaidFromWebhook({
        paymentId: pay.id,
        gatewayRef: "g1",
        amount: 5,
        transactionId: "t1",
      }),
    ).rejects.toThrow();

    const first = await markPaidFromWebhook({
      paymentId: pay.id,
      gatewayRef: "g1",
      amount: 500,
      transactionId: "t1",
    });
    const second = await markPaidFromWebhook({
      paymentId: pay.id,
      gatewayRef: "g1",
      amount: 500,
      transactionId: "t1",
    });
    expect(first.status).toBe("PAID");
    expect(second.status).toBe("PAID");
    const row = db.select().from(paymentTransactions).where(eq(paymentTransactions.id, pay.id)).get();
    expect(row?.status).toBe("PAID");
  });
});

describe("SMS credit deduction", () => {
  it("deducts units and rejects cross-school send", async () => {
    const { db } = await import("../src/db");
    const { schools } = await import("../src/db/schema");
    const { sendSms } = await import("../src/services/sms.service");
    const { permissionsFor } = await import("../src/lib/auth/permissions");
    const all = db.select().from(schools).all();
    if (all.length < 2) return;
    const [a, b] = all;
    const ctxA = {
      userId: "admin",
      email: "a@a.a",
      name: "A",
      role: "SCHOOL_ADMIN" as const,
      schoolId: a.id,
      permissions: permissionsFor("SCHOOL_ADMIN"),
      sessionId: "s",
      impersonatedBy: null,
    };
    const before = a.smsBalance;
    const mobile = `017${String(Date.now()).slice(-8)}`;
    const result = sendSms({
      ctx: ctxA,
      schoolId: a.id,
      recipient: "Test",
      mobile,
      message: `পরীক্ষা ${Date.now()}`,
    });
    expect(result.balance).toBe(before - result.units);
    expect(() =>
      sendSms({
        ctx: ctxA,
        schoolId: b.id,
        recipient: "Hack",
        mobile: "01711111112",
        message: "nope",
      }),
    ).toThrow();
  });
});
