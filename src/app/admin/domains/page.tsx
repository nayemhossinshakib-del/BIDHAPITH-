import { db } from "@/db";
import { schoolDomains, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export default function DomainsPage() {
  const rows = db.select().from(schoolDomains).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader
        title="ডোমেইন"
        description="CNAME www → schools.bidhapith.com · যাচাই ছাড়া ACTIVE হয় না"
      />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>ডোমেইন</TH>
              <TH>স্কুল</TH>
              <TH>ধরন</TH>
              <TH>স্ট্যাটাস</TH>
              <TH>SSL</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((d) => (
              <TR key={d.id}>
                <TD>{d.domain}</TD>
                <TD>{schoolRows.find((s) => s.id === d.schoolId)?.nameBn}</TD>
                <TD>{d.type}</TD>
                <TD>
                  <Badge variant={statusBadge(d.status)}>{d.status}</Badge>
                </TD>
                <TD>{d.sslStatus}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
