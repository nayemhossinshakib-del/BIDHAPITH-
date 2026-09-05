import { customAlphabet } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
export const createId = customAlphabet(alphabet, 21);

export function publicCode(prefix: string, length = 8): string {
  return `${prefix}-${customAlphabet("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ", length)()}`;
}
