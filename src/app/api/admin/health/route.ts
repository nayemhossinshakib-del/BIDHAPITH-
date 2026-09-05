import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "bidhapith",
    time: new Date().toISOString(),
    tz: "Asia/Dhaka",
  });
}
