import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { schools } from "@/db/schema";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { submitApplication } from "@/services/admission.service";
import { completeDemoPayment } from "@/services/payment.service";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const body = await req.json();
    const school = db.select().from(schools).where(eq(schools.id, body.schoolId)).get();
    if (!school) throw new AppError("NOT_FOUND", "স্কুল পাওয়া যায়নি", 404);
    if (body.slug && body.slug !== school.slug) {
      throw new AppError("TENANT_ISOLATION", "স্কুল মিলছে না", 403);
    }
    if (!body.studentName) throw new AppError("VALIDATION", "শিক্ষার্থীর নাম প্রয়োজন", 422);
    const result = submitApplication({
      schoolId: school.id,
      studentName: body.studentName,
      studentNameBn: body.studentNameBn,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      birthCertificateNo: body.birthCertificateNo,
      bloodGroup: body.bloodGroup,
      previousSchool: body.previousSchool,
      fatherName: body.fatherName,
      motherName: body.motherName,
      guardianName: body.guardianName,
      guardianMobile: body.guardianMobile,
      guardianEmail: body.guardianEmail,
      address: body.address,
      classId: body.classId,
    });
    await completeDemoPayment(result.paymentId);
    return NextResponse.json({ ok: true, ...result, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    return NextResponse.json(payload, { status: err instanceof AppError ? err.status : 400 });
  }
}
