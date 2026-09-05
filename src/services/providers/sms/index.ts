import { DemoSmsProvider } from "./demo";
import { GenericHttpSmsProvider } from "./generic-http";
import type { SmsProvider } from "./types";

export function getSmsProvider(): SmsProvider {
  const kind = process.env.SMS_PROVIDER || "demo";
  if (kind === "generic_http" && process.env.SMS_PROVIDER_URL && process.env.SMS_API_KEY) {
    return new GenericHttpSmsProvider({
      apiUrl: process.env.SMS_PROVIDER_URL,
      apiKey: process.env.SMS_API_KEY,
      senderId: process.env.SMS_SENDER_ID || "BIDHAPITH",
      username: process.env.SMS_USERNAME,
      password: process.env.SMS_PASSWORD,
    });
  }
  return new DemoSmsProvider();
}

export type { SmsProvider } from "./types";
