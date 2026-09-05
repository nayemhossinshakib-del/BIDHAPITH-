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

  const byEmail = db.select().from(users).where(eq(users.email, identifier)).get();
  const byMobile = db.select().from(users).where(eq(users.mobile, opts.identifier.trim())).get();
  const account = byEmail ?? byMobile;

  const recordFailedLogin = () => {
    db.insert(loginAttempts)
      .values({
        id: createId(),
        identifier,
        ip: opts.ip ?? null,
        success: false,
      })
      .run();
  };

  if (account == null) {
    recordFailedLogin();
    throw new UnauthorizedError("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
  }

  const user = account;

  const lockedMs =
    user.lockedUntil instanceof Date
      ? user.lockedUntil.getTime()
      : user.lockedUntil
        ? Number(user.lockedUntil)
        : 0;
  if (lockedMs && lockedMs > Date.now()) {
    recordFailedLogin();
    throw new UnauthorizedError("অ্যাকাউন্ট সাময়িকভাবে লক করা হয়েছে");
  }

  if (user.status !== "ACTIVE") {
    recordFailedLogin();
    throw new UnauthorizedError("এই অ্যাকাউন্টটি নিষ্ক্রিয়");
  }

  const ok = await verifyPassword(opts.password, user.passwordHash);
  if (!ok) {
    const failed = user.failedLogins + 1;
    const lockedUntil = failed >= 8 ? new Date(Date.now() + 15 * 60 * 1000) : null;
    db.update(users)
      .set({ failedLogins: failed, lockedUntil, updatedAt: new Date() })
      .where(eq(users.id, user.id))
      .run();
    recordFailedLogin();
    throw new UnauthorizedError("ইমেইল বা পাসওয়ার্ড সঠিক নয়");
  }

  try {
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
  } catch {
    /* demo /tmp sqlite may be ephemeral */
  }

  let session: { jwt: string; sessionId: string; expiresAt: Date };
  try {
    session = await createUserSession({
      userId: user.id,
      role: user.role as Role,
      schoolId: user.schoolId,
      ip: opts.ip,
      userAgent: opts.userAgent,
    });
  } catch {
    const { signSession } = await import("@/lib/auth/session");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const jwt = await signSession({
      sub: user.id,
      sid: user.id,
      role: user.role as Role,
      schoolId: user.schoolId,
      impersonatedBy: null,
    });
    session = { jwt, sessionId: user.id, expiresAt };
  }
  await setSessionCookie(session.jwt, session.expiresAt);
  try {
    writeAudit({
      schoolId: user.schoolId,
      action: "LOGIN",
      module: "auth",
      resource: "user",
      resourceId: user.id,
      ip: opts.ip,
      userAgent: opts.userAgent,
    });
  } catch {
    /* audit is optional on ephemeral demo db */
  }

  return {
    redirectTo: ROLE_HOME[user.role as Role],
    role: user.role as Role,
    jwt: session.jwt,
    expiresAt: session.expiresAt,
  };
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
