import { DEFAULT_ROLE_PERMISSIONS, type Permission, type Role } from "@/lib/constants";
import { ForbiddenError } from "@/lib/errors";
import type { AuthContext } from "./types";

export function hasPermission(ctx: AuthContext, permission: Permission): boolean {
  if (ctx.role === "SUPER_ADMIN") return true;
  return ctx.permissions.includes(permission);
}

export function assertPermission(ctx: AuthContext, permission: Permission) {
  if (!hasPermission(ctx, permission)) {
    throw new ForbiddenError();
  }
}

export function assertRole(ctx: AuthContext, roles: Role[]) {
  if (!roles.includes(ctx.role)) {
    throw new ForbiddenError();
  }
}

export function permissionsFor(role: Role): Permission[] {
  return DEFAULT_ROLE_PERMISSIONS[role] ?? [];
}
