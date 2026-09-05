import type { SmsProvider, SmsSendInput, SmsSendResult } from "./types";

export class GenericHttpSmsProvider implements SmsProvider {
  name = "generic_http";
  constructor(
    private config: {
      apiUrl: string;
      apiKey: string;
      senderId: string;
      username?: string;
      password?: string;
    },
  ) {}

  async sendSms(input: SmsSendInput): Promise<SmsSendResult> {
    const res = await fetch(this.config.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        to: input.to,
        message: input.message,
        sender: input.senderId ?? this.config.senderId,
        username: this.config.username,
        password: this.config.password,
      }),
    });
    if (!res.ok) return { ok: false, error: `http_${res.status}` };
    const data = (await res.json().catch(() => ({}))) as { id?: string };
    return { ok: true, providerRef: data.id };
  }

  async sendBulkSms(inputs: SmsSendInput[]) {
    const out: SmsSendResult[] = [];
    for (const i of inputs) out.push(await this.sendSms(i));
    return out;
  }

  async checkBalance() {
    return null;
  }

  async getDeliveryStatus() {
    return "SENT" as const;
  }
}
