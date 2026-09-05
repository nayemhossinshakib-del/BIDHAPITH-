import { DemoPaymentProvider } from "./demo";
import type { PaymentProvider } from "./types";

export function getPaymentProvider(): PaymentProvider {
  return new DemoPaymentProvider();
}

export type { PaymentProvider } from "./types";
