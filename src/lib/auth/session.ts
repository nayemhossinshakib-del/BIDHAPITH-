import { createHash } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { sessions, users } from "@/db/schema";
import { SESSION_COOKIE, type Role } from "@/lib/constants";
import { createId } from "@/lib/id";
import { permissionsFor } from "./permissions";
import type { AuthContext, SessionPayload } from "./types";

function secret() {
  const s = process.env.AUTH_SECRET || "dev-only-change-me";
  return new TextEncoder().encode(s);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function signSession(payload: SessionPayload, expiresIn = "7d") {
  return new SignJWT({
    sid: payload.sid,
    role: payload.role,
    schoolId: payload.schoolId,
    impersonatedBy: payload.impersonatedBy ?? null,
    email: payload.email ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function createUserSession(opts: {
  userId: string;
  role: Role;
  schoolId: string | null;
  email?: string | null;
  ip?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}) {
  const sessionId = createId();
  const raw = createId() + createId();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  db.insert(sessions)
    .values({
      id: sessionId,
      userId: opts.userId,
      tokenHash,
      expiresAt,
      ip: opts.ip ?? null,
      userAgent: opts.userAgent ?? null,
      impersonatedBy: opts.impersonatedBy ?? null,
    })
    .run();

  const jwt = await signSession({
    sub: opts.userId,
    sid: sessionId,
    role: opts.role,
    schoolId: opts.schoolId,
    impersonatedBy: opts.impersonatedBy ?? null,
    email: opts.email ?? null,
  });
  return { jwt, sessionId, expiresAt };
}

export function sessionCookieOptions(expiresAt: Date) {
  const maxAge = Math.max(60, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
    path: "/",
    maxAge,
  };
}

export async function setSessionCookie(jwt: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, sessionCookieOptions(expiresAt));
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function getAuthContext(): Promise<AuthContext | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;

  let session:
    | { id: string; revokedAt: Date | null; expiresAt: Date; impersonatedBy: string | null }
    | undefined;
  try {
    session = db.select().from(sessions).where(eq(sessions.id, payload.sid)).get();
  } catch {
    session = undefined;
  }
  if (session?.revokedAt) return null;
  if (session && epochMs(session.expiresAt) > 0 && epochMs(session.expiresAt) < Date.now()) return null;

  let user = db.select().from(users).where(eq(users.id, payload.sub)).get();
  if (!user && payload.email) {
    user = db.select().from(users).where(eq(users.email, payload.email)).get();
  }
  if (!user || user.status !== "ACTIVE") return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    schoolId: user.schoolId,
    permissions: permissionsFor(user.role as Role),
    sessionId: session?.id ?? payload.sid,
    impersonatedBy: session?.impersonatedBy ?? payload.impersonatedBy ?? null,
  };
}

function epochMs(value: Date | number | string | null | undefined) {
  if (value == null) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  const n = Number(value);
  if (Number.isFinite(n) && n > 0) return n < 1e12 ? n * 1000 : n;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function requireAuth(): Promise<AuthContext> {
  const ctx = await getAuthContext();
  if (!ctx) {
    const { UnauthorizedError } = await import("@/lib/errors");
    throw new UnauthorizedError();
  }
  return ctx;
}

export function revokeSession(sessionId: string) {
  db.update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, sessionId))
    .run();
}

export function revokeAllUserSessions(userId: string) {
  db.update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.userId, userId))
    .run();
}
