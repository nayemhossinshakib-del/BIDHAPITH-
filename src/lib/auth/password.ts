import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function passwordStrength(password: string): string | null {
  if (password.length < 8) return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে";
  if (!/[A-Z]/.test(password)) return "পাসওয়ার্ডে একটি বড় হাতের অক্ষর থাকতে হবে";
  if (!/[a-z]/.test(password)) return "পাসওয়ার্ডে একটি ছোট হাতের অক্ষর থাকতে হবে";
  if (!/[0-9]/.test(password)) return "পাসওয়ার্ডে একটি সংখ্যা থাকতে হবে";
  return null;
}
