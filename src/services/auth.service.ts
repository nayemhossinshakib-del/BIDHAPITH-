import { and, eq, gte } from "drizzle-orm";
import { db } from "@/db";
import { loginAttempts, users } from "@/db/schema";
import { ROLE_HOME, type Role } from "@/lib/constants";
import { AppError, UnauthorizedError } from "@/lib/errors";
import { createId } from "@/lib/id";
import { writeAudit } from "@/lib/audit";
import { hashPassword, passwordStrength, verifyPassword } from "@/lib/auth/password";
import {
  clearSessionCookie,
  createUserSession,
  requireAuth,
  revokeAllUserSessions,
  revokeSession,
  setSessionCookie,
} from "@/lib/auth/session";
import { assertRateLimit } from "@/lib/rate-limit";

export async function loginWithPassword(opts: {
  identifier: string;
  password: string;
  ip?: string | null;
  userAgent?: string | null;
}) {
  const identifier = opts.identifier.trim().toLowerCase();
  assertRateLimit(`login:${identifier}`, 8, 15 * 60 * 1000);
  assertRateLimit(`login-ip:${opts.ip ?? "unknown"}`, 30, 15 * 60 * 1000);

  const user =
    db.select().from(users).where(eq(users.email, identifier)).get() ??
    db.select().from(users).where(eq(users.mobile, opts.identifier.trim())).get();

  const fail = (reason: string): never => {
    db.insert(loginAttempts)
      .values({
        id: createId(),
        identifier,
        ip: opts.ip ?? null,
        success: false,
      })
      .run();
    throw new UnauthorizedError(reason);
  };

  if (!user) fail("ইমেইল বা পাসওয়ার্ড সঠিক নয়");

  if (user.lockedUntil && user.lockedUntil.getTime() > Date.now()) {
    fail("অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে");
  }

  if (user.status !== "ACTIVE") {
    fail("এই অ্যাকাউন্টটি নিষ্ক্রিয়");
  }

  const ok = await verifyPassword(opts.password, user.passwordHash);
  if (!ok) {
    const failed = user.failedLogins + 1;
    const lockedUntil = failed >= 8 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    db.update(users)
      .set({ failedLogins: failed, lockedUntil, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .run();
    fail("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
  }

  db.update(users)
    .set({ failedLogins: 0, lockedUntil: null, lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id))
    .run();

  db.insert(loginAttempts)
    .values({
      id: createId(),
      identifier,
      ip: opts.ip ?? null,
      success: true,
    })
    .run();

  const session = await createUserSession({
    userId: user.id,
    role: user.role as Role,
    schoolId: user.schoolId,
    ip: opts.ip,
    userAgent: opts.userAgent,
  });
  await setSessionCookie(session.jwt, session.expiresAt);
  writeAudit({
    schoolId: user.schoolId,
    action: "LOGIN",
    module: "auth",
    resource: "user",
    resourceId: user.id,
    ip: opts.ip,
    userAgent: opts.userAgent,
  });

  return { redirectTo: ROLE_HOME[user.role as Role], role: user.role as Role };
}

export async function logout() {
  try {
    const ctx = await requireAuth();
    revokeSession(ctx.sessionId);
  } catch {
    // ignore
  }
  await clearSessionCookie();
}

export async function changePassword(current: string, next: string) {
  const ctx = await requireAuth();
  const err = passwordStrength(next);
  if (err) throw new AppError("WEAK_PASSWORD", err, 422);
  const user = db.select().from(users).where(eq(users.id, ctx.userId)).get();
  if (!user) throw new UnauthorizedError();
  if (!(await verifyPassword(current, user.passwordHash))) {
    throw new UnauthorizedError("বর্তমান পাসওয়ার্ড সঠিক নয়");
  }
  db.update(users)
    .set({
      passwordHash: await hashPassword(next),
      mustChangePassword: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id))
    .run();
  revokeAllUserSessions(user.id);
}

export function recentFailedLogins(identifier: string, minutes = 15) {
  const since = new Date(Date.now() - minutes * 60 * 1000);
  return db
    .select()
    .from(loginAttempts)
    .where(
      and(
        eq(loginAttempts.identifier, identifier.toLowerCase()),
        eq(loginAttempts.success, false),
        gte(loginAttempts.createdAt, since),
      ),
    )
    .all();
}
