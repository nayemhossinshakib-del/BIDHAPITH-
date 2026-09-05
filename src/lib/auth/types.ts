import type { Permission, Role } from "@/lib/constants";

export type AuthContext = {
  userId: string;
  email: string;
  name: string;
  role: Role;
  schoolId: string | null;
  permissions: Permission[];
  sessionId: string;
  impersonatedBy: string | null;
};

export type SessionPayload = {
  sub: string;
  sid: string;
  role: Role;
  schoolId: string | null;
  impersonatedBy: string | null;
  email?: string | null;
};
