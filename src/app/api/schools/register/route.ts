import { NextResponse } from "next/server";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { registerSchool } from "@/services/school.service";
import { assertRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    assertRateLimit(`register:${req.headers.get("x-forwarded-for") ?? "ip"}`, 8, 60 * 60 * 1000);
    const body = await req.json();
    if (!body.schoolName || !body.adminEmail || !body.password) {
      throw new AppError("VALIDATION", "আবশ্যক তথ্য অনুপস্থিত", 422);
    }
    const result = await registerSchool({
      schoolName: body.schoolName,
      schoolCode: body.schoolCode,
      eiin: body.eiin,
      schoolType: body.schoolType || "private",
      address: body.address,
      district: body.district,
      division: body.division,
      mobile: body.mobile,
      email: body.email || body.adminEmail,
      slug: body.slug,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      adminMobile: body.adminMobile || body.mobile,
      password: body.password,
      planSlug: body.planSlug || "trial",
      billingCycle: body.billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY",
    });
    return NextResponse.json({ ok: true, slug: result.slug, schoolId: result.schoolId, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    const status = err instanceof AppError ? err.status : 400;
    return NextResponse.json(payload, { status });
  }
}
