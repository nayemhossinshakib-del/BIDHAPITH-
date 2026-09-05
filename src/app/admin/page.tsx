import { Building2, GraduationCap, MessageSquare, Wallet } from "lucide-react";
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

export default async function AdminDashboard() {
  const counts = schoolCounts();
  const studentCount = db.select({ c: sql<number>`count(*)` }).from(students).get()?.c ?? 0;
  const teacherCount = db.select({ c: sql<number>`count(*)` }).from(teachers).get()?.c ?? 0;
  const userCount = db.select({ c: sql<number>`count(*)` }).from(users).get()?.c ?? 0;
  const payments = db.select().from(paymentTransactions).all();
  const revenue = payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0);
  const pendingPay = payments.filter((p) => p.status === "PENDING").length;
  const admissions = db.select({ c: sql<number>`count(*)` }).from(admissionApplications).get()?.c ?? 0;
  const recent = db.select().from(schools).all().slice(0, 8);

  return (
    <div>
      <PageHeader title="ড্যাশবোর্ড" description="প্ল্যাটফর্ম নিয়ন্ত্রণ কেন্দ্র" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="মোট স্কুল" value={counts.total} hint={`সক্রিয় ${counts.active}`} icon={<Building2 className="h-5 w-5" />} />
        <StatCard title="ট্রায়াল" value={counts.trial} hint={`মেয়াদোত্তীর্ণ ${counts.expired}`} />
        <StatCard title="শিক্ষার্থী" value={Number(studentCount)} icon={<GraduationCap className="h-5 w-5" />} />
        <StatCard title="শিক্ষক" value={Number(teacherCount)} />
        <StatCard title="মোট রাজস্ব" value={formatBdt(revenue)} icon={<Wallet className="h-5 w-5" />} />
        <StatCard title="অপেক্ষমাণ পেমেন্ট" value={pendingPay} />
        <StatCard title="ভর্তি আবেদন" value={Number(admissions)} />
        <StatCard title="ইউজার" value={Number(userCount)} icon={<MessageSquare className="h-5 w-5" />} />
      </div>
      <div className="mt-8 rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4 font-medium">সাম্প্রতিক স্কুল</div>
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
      </div>
    </div>
  );
}
