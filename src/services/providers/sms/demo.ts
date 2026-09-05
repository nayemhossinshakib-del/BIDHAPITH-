import { createId } from "@/lib/id";
import type { SmsProvider, SmsSendInput, SmsSendResult } from "./types";

export class DemoSmsProvider implements SmsProvider {
  name = "demo";
  async sendSms(input: SmsSendInput): Promise<SmsSendResult> {
    if (!input.to || !input.message) return { ok: false, error: "missing fields" };
    return { ok: true, providerRef: `demo_${createId()}` };
  }
  async sendBulkSms(inputs: SmsSendInput[]): Promise<SmsSendResult[]> {
    return Promise.all(inputs.map((i) => this.sendSms(i)));
  }
  async checkBalance() {
    return 999999;
  }
  async getDeliveryStatus() {
    return "DELIVERED" as const;
  }
}
