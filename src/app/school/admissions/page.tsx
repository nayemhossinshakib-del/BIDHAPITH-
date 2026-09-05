import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { listApplications } from "@/services/admission.service";
import { AdmissionActions } from "./actions";

export default async function AdmissionsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = listApplications(ctx);
  return (
    <div>
      <PageHeader title="ভর্তি আবেদন" description="নতুন, অপেক্ষমাণ, অনুমোদিত, প্রত্যাখ্যাত" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>আবেদন আইডি</TH>
              <TH>শিক্ষার্থী</TH>
              <TH>অভিভাবক</TH>
              <TH>মোবাইল</TH>
              <TH>স্ট্যাটাস</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((a) => (
              <TR key={a.id}>
                <TD>{a.applicationId}</TD>
                <TD>{a.studentNameBn || a.studentName}</TD>
                <TD>{a.guardianName}</TD>
                <TD>{a.guardianMobile}</TD>
                <TD>
                  <Badge variant={statusBadge(a.status)}>{a.status}</Badge>
                </TD>
                <TD>
                  {a.status === "PENDING" ? <AdmissionActions id={a.id} /> : null}
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
