import Link from "next/link";
import { db } from "@/db";
import { schools, students, teachers } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatDateBn } from "@/lib/utils";
import { ImpersonateButton } from "./impersonate-button";

export default async function SchoolsPage() {
  const rows = db.select().from(schools).all();
  const studentRows = db.select().from(students).all();
  const teacherRows = db.select().from(teachers).all();
  return (
    <div>
      <PageHeader title="স্কুল ব্যবস্থাপনা" description="সকল টেন্যান্ট" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>স্কুল</TH>
              <TH>কোড</TH>
              <TH>প্ল্যান/স্ট্যাটাস</TH>
              <TH>শিক্ষার্থী</TH>
              <TH>শিক্ষক</TH>
              <TH>SMS</TH>
              <TH>ডোমেইন</TH>
              <TH>তারিখ</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((s) => (
              <TR key={s.id}>
                <TD>
                  <Link href={`/admin/schools/${s.id}`} className="font-medium hover:underline">
                    {s.nameBn || s.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">{s.email}</div>
                </TD>
                <TD>{s.code}</TD>
                <TD>
                  <Badge variant={statusBadge(s.status)}>{s.status}</Badge>
                </TD>
                <TD>{studentRows.filter((x) => x.schoolId === s.id).length}</TD>
                <TD>{teacherRows.filter((x) => x.schoolId === s.id).length}</TD>
                <TD>{s.smsBalance}</TD>
                <TD>{s.slug}.bidhapith.com</TD>
                <TD>{formatDateBn(s.createdAt)}</TD>
                <TD className="space-x-2">
                  <Button asChild size="sm" variant="outline">
                    <Link href={`/s/${s.slug}`}>ওয়েবসাইট</Link>
                  </Button>
                  <ImpersonateButton schoolId={s.id} />
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
