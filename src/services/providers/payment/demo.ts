import { createId } from "@/lib/id";
import type { CreatePaymentInput, PaymentProvider, PaymentResult } from "./types";

const store = new Map<string, PaymentResult>();

export class DemoPaymentProvider implements PaymentProvider {
  name = "demo";

  async createPayment(input: CreatePaymentInput): Promise<PaymentResult> {
    const transactionId = `demo_${createId()}`;
    const result: PaymentResult = {
      ok: true,
      provider: this.name,
      transactionId,
      amount: input.amount,
      status: "PENDING",
      redirectUrl: `/pay/demo/${transactionId}`,
    };
    store.set(transactionId, result);
    return result;
  }

  async verifyPayment(transactionId: string): Promise<PaymentResult> {
    const current = store.get(transactionId);
    if (!current) {
      return {
        ok: false,
        provider: this.name,
        transactionId,
        amount: 0,
        status: "FAILED",
      };
    }
    const paid: PaymentResult = { ...current, status: "PAID", ok: true };
    store.set(transactionId, paid);
    return paid;
  }

  async refundPayment(transactionId: string): Promise<PaymentResult> {
    const current = store.get(transactionId);
    if (!current) {
      return { ok: false, provider: this.name, transactionId, amount: 0, status: "FAILED" };
    }
    const refunded = { ...current, status: "REFUNDED" as const };
    store.set(transactionId, refunded);
    return refunded;
  }

  async getPaymentStatus(transactionId: string) {
    return store.get(transactionId)?.status ?? "FAILED";
  }
}

export const demoPaymentStore = store;
