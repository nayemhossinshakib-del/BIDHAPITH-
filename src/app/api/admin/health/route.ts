import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const { db, dbPath, sqlite } = await import("@/db");
    const { users, schools } = await import("@/db/schema");
    const userCount = db.select().from(users).all().length;
    const schoolCount = db.select().from(schools).all().length;
    const tables = sqlite
      .prepare("select count(*) as c from sqlite_master where type='table'")
      .get() as { c: number };
    return NextResponse.json({
      ok: true,
      service: "bidhapith",
      dbPath,
      tables: tables?.c ?? 0,
      users: userCount,
      schools: schoolCount,
      vercel: Boolean(process.env.VERCEL),
      time: new Date().toISOString(),
      tz: "Asia/Dhaka",
    });
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        service: "bidhapith",
        error: err instanceof Error ? err.message : String(err),
        vercel: Boolean(process.env.VERCEL),
        cwd: process.cwd(),
        time: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
