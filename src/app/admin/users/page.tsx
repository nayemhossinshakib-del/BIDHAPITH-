import { db } from "@/db";
import { schools, users } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ROLE_LABEL, type Role } from "@/lib/constants";

export default function UsersPage() {
  const rows = db.select().from(users).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader title="ইউজার" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>নাম</TH>
              <TH>ইমেইল</TH>
              <TH>রোল</TH>
              <TH>স্কুল</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((u) => (
              <TR key={u.id}>
                <TD>{u.nameBn || u.name}</TD>
                <TD>{u.email}</TD>
                <TD>{ROLE_LABEL[u.role as Role] ?? u.role}</TD>
                <TD>{schoolRows.find((s) => s.id === u.schoolId)?.nameBn ?? "—"}</TD>
                <TD>
                  <Badge variant={statusBadge(u.status)}>{u.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
