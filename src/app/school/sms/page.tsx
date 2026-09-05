import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { listSms } from "@/services/sms.service";
import { SendSmsForm } from "./send-form";

export default async function SchoolSmsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const school = db.select().from(schools).where(eq(schools.id, ctx.schoolId!)).get();
  const rows = listSms(ctx.schoolId!);
  return (
    <div>
      <PageHeader title="এসএমএস" description={`ব্যালেন্স: ${school?.smsBalance ?? 0} ক্রেডিট`} />
      <SendSmsForm />
      <div className="mt-6 rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>প্রাপক</TH>
              <TH>নম্বর</TH>
              <TH>বার্তা</TH>
              <TH>অক্ষর</TH>
              <TH>ইউনিট</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((m) => (
              <TR key={m.id}>
                <TD>{m.recipient}</TD>
                <TD>{m.mobile}</TD>
                <TD className="max-w-xs truncate">{m.message}</TD>
                <TD>{m.characterCount}</TD>
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
