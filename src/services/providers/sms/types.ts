export type SmsSendInput = { to: string; message: string; senderId?: string };
export type SmsSendResult = { ok: boolean; providerRef?: string; error?: string };

export interface SmsProvider {
  name: string;
  sendSms(input: SmsSendInput): Promise<SmsSendResult>;
  sendBulkSms(inputs: SmsSendInput[]): Promise<SmsSendResult[]>;
  checkBalance(): Promise<number | null>;
  getDeliveryStatus(ref: string): Promise<"QUEUED" | "SENT" | "DELIVERED" | "FAILED">;
}
