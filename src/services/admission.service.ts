import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { admissionApplications, admissionPayments, classes } from "@/db/schema";
import { writeAudit } from "@/lib/audit";
import { assertPermission } from "@/lib/auth/permissions";
import type { AuthContext } from "@/lib/auth/types";
import { AppError } from "@/lib/errors";
import { createId, publicCode } from "@/lib/id";
import { assertRateLimit } from "@/lib/rate-limit";
import { scopedSchoolId } from "@/lib/tenant";
import { createStudent } from "@/services/student.service";
import { createPaymentRecord } from "@/services/payment.service";

export function listApplications(ctx: AuthContext, status?: string) {
  assertPermission(ctx, "admission.view");
  const schoolId = scopedSchoolId(ctx, ctx.schoolId);
  const rows = db
    .select()
    .from(admissionApplications)
    .where(eq(admissionApplications.schoolId, schoolId))
    .orderBy(desc(admissionApplications.createdAt))
    .all();
  return status ? rows.filter((r) => r.status === status) : rows;
}

export function submitApplication(input: {
  schoolId: string;
  studentName: string;
  studentNameBn?: string;
  dateOfBirth?: string;
  gender?: string;
  birthCertificateNo?: string;
  bloodGroup?: string;
  previousSchool?: string;
  fatherName?: string;
  motherName?: string;
  guardianName?: string;
  guardianMobile?: string;
  guardianEmail?: string;
  address?: string;
  classId?: string;
  academicYearId?: string;
  sectionPreference?: string;
}) {
  assertRateLimit(`admission:${input.schoolId}`, 20, 60 * 60 * 1000);
  const applicationId = publicCode("APP", 8);
  const id = createId();
  db.insert(admissionApplications)
    .values({
      id,
      schoolId: input.schoolId,
      applicationId,
      studentName: input.studentName,
      studentNameBn: input.studentNameBn ?? null,
      dateOfBirth: input.dateOfBirth ?? null,
      gender: input.gender ?? null,
      birthCertificateNo: input.birthCertificateNo ?? null,
      bloodGroup: input.bloodGroup ?? null,
      previousSchool: input.previousSchool ?? null,
      fatherName: input.fatherName ?? null,
      motherName: input.motherName ?? null,
      guardianName: input.guardianName ?? null,
      guardianMobile: input.guardianMobile ?? null,
      guardianEmail: input.guardianEmail ?? null,
      address: input.address ?? null,
      classId: input.classId ?? null,
      academicYearId: input.academicYearId ?? null,
      sectionPreference: input.sectionPreference ?? null,
      status: "PENDING",
    })
    .run();

  const payment = createPaymentRecord({
    schoolId: input.schoolId,
    purpose: "ADMISSION",
    amount: 500,
    metadata: { applicationId: id },
  });
  db.insert(admissionPayments)
    .values({
      id: createId(),
      schoolId: input.schoolId,
      applicationId: id,
      paymentTransactionId: payment.id,
      amount: 500,
      status: "PENDING",
    })
    .run();

  return { id, applicationId, paymentId: payment.id, amount: 500 };
}

export function decideApplication(ctx: AuthContext, id: string, decision: "APPROVED" | "REJECTED" | "WAITING") {
  if (decision === "APPROVED") assertPermission(ctx, "admission.approve");
  else assertPermission(ctx, "admission.reject");
  const row = db.select().from(admissionApplications).where(eq(admissionApplications.id, id)).get();
  if (!row) throw new AppError("NOT_FOUND", "আবেদন পাওয়া যায়নি", 404);
  const schoolId = scopedSchoolId(ctx, ctx.schoolId);
  if (row.schoolId !== schoolId) throw new AppError("FORBIDDEN", "অন্য স্কুলের আবেদন", 403);
  db.update(admissionApplications)
    .set({ status: decision, updatedAt: new Date() })
    .where(eq(admissionApplications.id, id))
    .run();
  if (decision === "APPROVED") {
    createStudent(ctx, {
      name: row.studentName,
      nameBn: row.studentNameBn ?? undefined,
      gender: row.gender ?? undefined,
      dateOfBirth: row.dateOfBirth ?? undefined,
      classId: row.classId ?? undefined,
      mobile: row.guardianMobile ?? undefined,
      address: row.address ?? undefined,
      bloodGroup: row.bloodGroup ?? undefined,
      academicYearId: row.academicYearId ?? undefined,
    });
  }
  writeAudit({
    ctx,
    schoolId,
    action: `ADMISSION_${decision}`,
    module: "admissions",
    resource: "admission_application",
    resourceId: id,
  });
  return decision;
}

export function classOptions(schoolId: string) {
  return db.select().from(classes).where(eq(classes.schoolId, schoolId)).all();
}
