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
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
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
  });
  return { jwt, sessionId, expiresAt };
}

export async function setSessionCookie(jwt: string, expiresAt: Date) {
  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
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

  const session = db.select().from(sessions).where(eq(sessions.id, payload.sid)).get();
  if (!session || session.revokedAt || session.expiresAt.getTime() < Date.now()) return null;

  const user = db.select().from(users).where(eq(users.id, payload.sub)).get();
  if (!user || user.status !== "ACTIVE") return null;

  return {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
    schoolId: user.schoolId,
    permissions: permissionsFor(user.role as Role),
    sessionId: session.id,
    impersonatedBy: session.impersonatedBy,
  };
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
