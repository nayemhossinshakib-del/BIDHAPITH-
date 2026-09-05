import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { students } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import { assertPermission } from "@/lib/auth/permissions";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId, publicCode } from "@/lib/id";
import { scopedSchoolId } from "@/lib/tenant";

export function listStudents(
  ctx: AuthContext,
  opts: { page?: number; pageSize?: number; q?: string; classId?: string; schoolId?: string } = {},
) {
  assertPermission(ctx, "student.view");
  const schoolId = scopedSchoolId(ctx, opts.schoolId ?? ctx.schoolId);
  const page = opts.page ?? 1;
  const pageSize = opts.pageSize ?? 20;
  const filters = [eq(students.schoolId, schoolId)];
  if (opts.classId) filters.push(eq(students.classId, opts.classId));
  if (opts.q) {
    const q = `%${opts.q}%`;
    filters.push(
      or(like(students.name, q), like(students.nameBn, q), like(students.studentId, q), like(students.mobile, q))!,
    );
  }
  const rows = db
    .select()
    .from(students)
    .where(and(...filters))
    .orderBy(desc(students.createdAt))
    .limit(pageSize)
    .offset((page - 1) * pageSize)
    .all();
  const countRow = db
    .select({ c: sql<number>`count(*)` })
    .from(students)
    .where(and(...filters))
    .get();
  return { rows, total: Number(countRow?.c ?? 0), page, pageSize };
}

export function getStudent(ctx: AuthContext, id: string) {
  const row = db.select().from(students).where(eq(students.id, id)).get();
  if (!row) throw new AppError("NOT_FOUND", "শিক্ষার্থী পাওয়া যায়নি", 404);
  if (ctx.role === "STUDENT" || ctx.role === "GUARDIAN") {
    if (row.userId !== ctx.userId) {
      throw new AppError("FORBIDDEN", "অন্য শিক্ষার্থীর তথ্য দেখা যাবে না", 403);
    }
    return row;
  }
  assertPermission(ctx, "student.view");
  if (ctx.role !== "SUPER_ADMIN" && row.schoolId !== ctx.schoolId) {
    throw new AppError("FORBIDDEN", "অন্য স্কুলের তথ্য দেখা যাবে না", 403);
  }
  return row;
}

export function createStudent(
  ctx: AuthContext,
  input: {
    name: string;
    nameBn?: string;
    gender?: string;
    dateOfBirth?: string;
    classId?: string;
    sectionId?: string;
    roll?: number;
    mobile?: string;
    address?: string;
    bloodGroup?: string;
    academicYearId?: string;
  },
) {
  assertPermission(ctx, "student.create");
  const schoolId = scopedSchoolId(ctx, ctx.schoolId);
  const id = createId();
  const studentId = publicCode("ST", 6);
  const admissionNumber = publicCode("ADM", 6);
  db.insert(students)
    .values({
      id,
      schoolId,
      studentId,
      admissionNumber,
      name: input.name,
      nameBn: input.nameBn ?? null,
      gender: input.gender ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      classId: input.classId ?? null,
      sectionId: input.sectionId ?? null,
      roll: input.roll ?? null,
      mobile: input.mobile ?? null,
      address: input.address ?? null,
      bloodGroup: input.bloodGroup ?? null,
      academicYearId: input.academicYearId ?? null,
      status: "ACTIVE",
    })
    .run();
  writeAudit({
    ctx,
    schoolId,
    action: "STUDENT_CREATED",
    module: "students",
    resource: "student",
    resourceId: id,
    after: input,
  });
  return db.select().from(students).where(eq(students.id, id)).get()!;
}

export function updateStudent(
  ctx: AuthContext,
  id: string,
  input: Partial<{
    name: string;
    nameBn: string;
    status: string;
    classId: string;
    sectionId: string;
    roll: number;
    mobile: string;
    address: string;
  }>,
) {
  assertPermission(ctx, "student.update");
  const current = getStudent(ctx, id);
  db.update(students)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(students.id, current.id))
    .run();
  writeAudit({
    ctx,
    schoolId: current.schoolId,
    action: "STUDENT_UPDATED",
    module: "students",
    resource: "student",
    resourceId: id,
    before: current,
    after: input,
  });
  return db.select().from(students).where(eq(students.id, id)).get()!;
}
