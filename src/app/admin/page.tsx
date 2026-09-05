import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  admissionApplications,
  paymentTransactions,
  schools,
  students,
  teachers,
  users,
} from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { StatCard } from "@/components/stat-card";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatBdt, formatDateBn } from "@/lib/utils";
import { schoolCounts } from "@/services/school.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminDashboard() {
  try {
    const counts = schoolCounts();
    const studentCount = Number(db.select({ c: sql<number>`count(*)` }).from(students).get()?.c ?? 0);
    const teacherCount = Number(db.select({ c: sql<number>`count(*)` }).from(teachers).get()?.c ?? 0);
    const userCount = Number(db.select({ c: sql<number>`count(*)` }).from(users).get()?.c ?? 0);
    const payments = db.select().from(paymentTransactions).all();
    const revenue = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + Number(p.amount || 0), 0);
    const pendingPay = payments.filter((p) => p.status === "PENDING").length;
    const admissions = Number(db.select({ c: sql<number>`count(*)` }).from(admissionApplications).get()?.c ?? 0);
    const recent = db.select().from(schools).all().slice(0, 8);

    return (
      <div>
        <PageHeader title="ড্যাশবোর্ড" description="প্ল্যাটফর্ম নিয়ন্ত্রণ কেন্দ্র" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard title="মোট স্কুল" value={counts.total} hint={`সক্রিয় ${counts.active}`} />
          <StatCard title="ট্রায়াল" value={counts.trial} hint={`মেয়াদোত্তীর্ণ ${counts.expired}`} />
          <StatCard title="শিক্ষার্থী" value={studentCount} />
          <StatCard title="শিক্ষক" value={teacherCount} />
          <StatCard title="মোট রাজস্ব" value={formatBdt(revenue)} />
          <StatCard title="অপেক্ষমাণ পেমেন্ট" value={pendingPay} />
          <StatCard title="ভর্তি আবেদন" value={admissions} />
          <StatCard title="ইউজার" value={userCount} />
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4 font-medium">সাম্প্রতিক স্কুল</div>
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground">এখনও কোনো স্কুল নেই।</p>
          ) : (
            <Table>
              <THead>
                <TR>
                  <TH>স্কুল</TH>
                  <TH>কোড</TH>
                  <TH>স্ট্যাটাস</TH>
                  <TH>জেলা</TH>
                  <TH>তারিখ</TH>
                </TR>
              </THead>
              <TBody>
                {recent.map((s) => (
                  <TR key={s.id}>
                    <TD className="font-medium">{s.nameBn || s.name}</TD>
                    <TD>{s.code}</TD>
                    <TD>
                      <Badge variant={statusBadge(s.status)}>{s.status}</Badge>
                    </TD>
                    <TD>{s.district}</TD>
                    <TD>{formatDateBn(s.createdAt)}</TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </div>
      </div>
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return (
      <div style={{ padding: 24, color: "#12201c" }}>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>সুপার অ্যাডমিন ড্যাশবোর্ড</h1>
        <p style={{ marginTop: 8 }}>লগইন সফল, কিন্তু ডেটা লোড করা যায়নি।</p>
        <pre
          style={{
            marginTop: 16,
            whiteSpace: "pre-wrap",
            background: "#fff",
            border: "1px solid #dbe4e0",
            borderRadius: 12,
            padding: 16,
            fontSize: 13,
          }}
        >
          {message}
        </pre>
      </div>
    );
  }
}
