import { describe, expect, it } from "vitest";
import { TenantIsolationError } from "@/lib/errors";
import { assertSameSchool, scopedSchoolId } from "@/lib/tenant";
import { smsUnits } from "@/lib/utils";
import { passwordStrength } from "@/lib/auth/password";
import { permissionsFor, hasPermission } from "@/lib/auth/permissions";
import type { AuthContext } from "@/lib/auth/types";

function ctx(role: AuthContext["role"], schoolId: string | null): AuthContext {
  return {
    userId: "u1",
    email: "a@b.c",
    name: "Test",
    role,
    schoolId,
    permissions: permissionsFor(role),
    sessionId: "s1",
    impersonatedBy: null,
  };
}

describe("tenant isolation", () => {
  it("blocks school A from school B", () => {
    expect(() => assertSameSchool(ctx("SCHOOL_ADMIN", "school-a"), "school-b")).toThrow(
      TenantIsolationError,
    );
  });

  it("allows same school", () => {
    expect(() => assertSameSchool(ctx("SCHOOL_ADMIN", "school-a"), "school-a")).not.toThrow();
  });

  it("super admin can target a school explicitly", () => {
    expect(scopedSchoolId(ctx("SUPER_ADMIN", null), "school-b")).toBe("school-b");
  });

  it("teacher cannot request another schoolId", () => {
    expect(() => scopedSchoolId(ctx("TEACHER", "school-a"), "school-b")).toThrow(TenantIsolationError);
  });
});

describe("RBAC", () => {
  it("teacher cannot manage subscription", () => {
    expect(hasPermission(ctx("TEACHER", "s"), "subscription.manage")).toBe(false);
  });

  it("accountant cannot create students", () => {
    expect(hasPermission(ctx("ACCOUNTANT", "s"), "student.create")).toBe(false);
  });

  it("school admin can approve admission", () => {
    expect(hasPermission(ctx("SCHOOL_ADMIN", "s"), "admission.approve")).toBe(true);
  });

  it("normal user is not super admin", () => {
    expect(hasPermission(ctx("STUDENT", "s"), "school.manage")).toBe(false);
  });
});

describe("SMS units", () => {
  it("counts unicode bangla as 70-char pages", () => {
    expect(smsUnits("আ")).toBe(1);
    expect(smsUnits("অ".repeat(71))).toBe(2);
  });
});

describe("password policy", () => {
  it("rejects weak passwords", () => {
    expect(passwordStrength("short")).toBeTruthy();
    expect(passwordStrength("Demo@1234")).toBeNull();
  });
});
