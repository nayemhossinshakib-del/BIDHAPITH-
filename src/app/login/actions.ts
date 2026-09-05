"use server";

import { redirect } from "next/navigation";
import { AppError } from "@/lib/errors";
import { loginWithPassword } from "@/services/auth.service";

function isNextRedirect(err: unknown) {
  return typeof err === "object" && err !== null && "digest" in err && String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT");
}

export async function loginAction(formData: FormData) {
  const identifier = String(formData.get("identifier") || "").trim();
  const password = String(formData.get("password") || "");
  const nextRaw = String(formData.get("next") || "");
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "";

  if (!identifier || !password) {
    redirect("/login?error=" + encodeURIComponent("ইমেইল ও পাসওয়ার্ড প্রয়োজন"));
  }

  try {
    const result = await loginWithPassword({ identifier, password });
    redirect(next || result.redirectTo || "/admin");
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    const message =
      err instanceof AppError ? err.message : err instanceof Error ? err.message : "লগইন ব্যর্থ";
    redirect("/login?error=" + encodeURIComponent(message));
  }
}
