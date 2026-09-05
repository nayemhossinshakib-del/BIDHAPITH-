import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { AppError, toErrorPayload } from "@/lib/errors";
import { requestId as makeId } from "@/lib/utils";
import { createStudent, listStudents } from "@/services/student.service";

export async function GET(req: Request) {
  const requestId = makeId();
  try {
    const ctx = await requireAuth();
    const url = new URL(req.url);
    const data = listStudents(ctx, {
      page: Number(url.searchParams.get("page") || 1),
      q: url.searchParams.get("q") || undefined,
      classId: url.searchParams.get("classId") || undefined,
    });
    return NextResponse.json({ ok: true, ...data, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    return NextResponse.json(payload, { status: err instanceof AppError ? err.status : 400 });
  }
}

export async function POST(req: Request) {
  const requestId = makeId();
  try {
    const ctx = await requireAuth();
    const body = await req.json();
    if (!body.name) throw new AppError("VALIDATION", "নাম প্রয়োজন", 422);
    const row = createStudent(ctx, body);
    return NextResponse.json({ ok: true, student: row, requestId });
  } catch (err) {
    const payload = toErrorPayload(err, requestId);
    return NextResponse.json(payload, { status: err instanceof AppError ? err.status : 400 });
  }
}
