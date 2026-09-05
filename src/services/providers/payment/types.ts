export type CreatePaymentInput = {
  amount: number;
  currency: string;
  purpose: string;
  schoolId?: string | null;
  successUrl: string;
  failUrl: string;
  customer: { name?: string; email?: string; mobile?: string };
  metadata?: Record<string, unknown>;
};

export type PaymentResult = {
  ok: boolean;
  provider: string;
  redirectUrl?: string;
  transactionId: string;
  gatewayRef?: string;
  amount: number;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
};

export interface PaymentProvider {
  name: string;
  createPayment(input: CreatePaymentInput): Promise<PaymentResult>;
  verifyPayment(transactionId: string): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount?: number): Promise<PaymentResult>;
  getPaymentStatus(transactionId: string): Promise<PaymentResult["status"]>;
}
