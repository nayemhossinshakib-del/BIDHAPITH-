import { db } from "@/db";
import { admissionApplications, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";

export default function AdminAdmissionsPage() {
  const rows = db.select().from(admissionApplications).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader title="সকল ভর্তি আবেদন" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>আইডি</TH>
              <TH>স্কুল</TH>
              <TH>শিক্ষার্থী</TH>
              <TH>অভিভাবক</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((a) => (
              <TR key={a.id}>
                <TD>{a.applicationId}</TD>
                <TD>{schoolRows.find((s) => s.id === a.schoolId)?.nameBn}</TD>
                <TD>{a.studentNameBn || a.studentName}</TD>
                <TD>{a.guardianMobile}</TD>
                <TD>
                  <Badge variant={statusBadge(a.status)}>{a.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
