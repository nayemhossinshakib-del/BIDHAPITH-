import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

const ROLE_PREFIX: Record<string, string> = {
  SUPER_ADMIN: "/admin",
  SCHOOL_ADMIN: "/school",
  TEACHER: "/teacher",
  ACCOUNTANT: "/accountant",
  STUDENT: "/student",
  GUARDIAN: "/student",
  STAFF: "/school",
};

function decodeRole(token: string | undefined): string | null {
  if (!token) return null;
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const role = decodeRole(token);

  const protectedPrefixes = ["/admin", "/school", "/teacher", "/accountant", "/student"];
  const matched = protectedPrefixes.find((p) => pathname === p || pathname.startsWith(p + "/"));
  if (matched) {
    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
    const home = ROLE_PREFIX[role];
    if (home && matched !== home) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  const response = NextResponse.next();
  const host = request.headers.get("host") || "";
  response.headers.set("x-bidhapith-host", host);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
