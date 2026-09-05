import { describe, expect, it } from "vitest";

process.env.DATABASE_URL ||= "file:./data/bidhapith.db";

describe("student access across tenants", () => {
  it("school A cannot read school B student", async () => {
    const { db } = await import("../src/db");
    const { students, schools } = await import("../src/db/schema");
    const { getStudent } = await import("../src/services/student.service");
    const { permissionsFor } = await import("../src/lib/auth/permissions");
    const schoolRows = db.select().from(schools).all();
    if (schoolRows.length < 2) return;
    const a = schoolRows[0];
    const b = schoolRows[1];
    const studentB = db.select().from(students).all().find((s) => s.schoolId === b.id);
    if (!studentB) return;
    const ctxA = {
      userId: "x",
      email: "x@x.x",
      name: "A",
      role: "SCHOOL_ADMIN" as const,
      schoolId: a.id,
      permissions: permissionsFor("SCHOOL_ADMIN"),
      sessionId: "s",
      impersonatedBy: null,
    };
    expect(() => getStudent(ctxA, studentB.id)).toThrow();
  });

  it("student cannot read another student", async () => {
    const { db } = await import("../src/db");
    const { students } = await import("../src/db/schema");
    const { getStudent } = await import("../src/services/student.service");
    const { permissionsFor } = await import("../src/lib/auth/permissions");
    const rows = db.select().from(students).all().filter((s) => s.userId);
    if (rows.length < 1) return;
    const me = rows[0];
    const other = db.select().from(students).all().find((s) => s.id !== me.id && s.schoolId === me.schoolId);
    if (!other) return;
    const ctx = {
      userId: me.userId!,
      email: "s@s.s",
      name: me.name,
      role: "STUDENT" as const,
      schoolId: me.schoolId,
      permissions: permissionsFor("STUDENT"),
      sessionId: "s",
      impersonatedBy: null,
    };
    expect(() => getStudent(ctx, other.id)).toThrow();
    expect(getStudent(ctx, me.id).id).toBe(me.id);
  });
});
