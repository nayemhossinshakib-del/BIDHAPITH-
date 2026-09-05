import { db } from "@/db";
import { schools, smsCreditTransactions, smsMessages, smsPackages } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { formatBdt, formatDateTimeBn } from "@/lib/utils";

export default function AdminSmsPage() {
  const messages = db.select().from(smsMessages).all();
  const credits = db.select().from(smsCreditTransactions).all();
  const packs = db.select().from(smsPackages).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader title="কেন্দ্রীয় এসএমএস পোর্টাল" description="প্রোভাইডার অ্যাবস্ট্রাকশন · ক্রেডিট · কিউ" />
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {packs.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {p.credits} ক্রেডিট · {formatBdt(p.price)}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b px-5 py-3 font-medium">ক্রেডিট লেনদেন</div>
        <Table>
          <THead>
            <TR>
              <TH>স্কুল</TH>
              <TH>ধরন</TH>
              <TH>ক্রেডিট</TH>
              <TH>আগে</TH>
              <TH>পরে</TH>
              <TH>তারিখ</TH>
            </TR>
          </THead>
          <TBody>
            {credits.map((c) => (
              <TR key={c.id}>
                <TD>{schoolRows.find((s) => s.id === c.schoolId)?.nameBn}</TD>
                <TD>{c.type}</TD>
                <TD>{c.credits}</TD>
                <TD>{c.balanceBefore}</TD>
                <TD>{c.balanceAfter}</TD>
                <TD>{formatDateTimeBn(c.createdAt)}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
      <div className="mt-6 rounded-2xl border border-border bg-card">
        <div className="border-b px-5 py-3 font-medium">বার্তা</div>
        <Table>
          <THead>
            <TR>
              <TH>প্রাপক</TH>
              <TH>নম্বর</TH>
              <TH>বার্তা</TH>
              <TH>ইউনিট</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {messages.map((m) => (
              <TR key={m.id}>
                <TD>{m.recipient}</TD>
                <TD>{m.mobile}</TD>
                <TD className="max-w-xs truncate">{m.message}</TD>
                <TD>{m.smsCount}</TD>
                <TD>
                  <Badge variant={statusBadge(m.status)}>{m.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
