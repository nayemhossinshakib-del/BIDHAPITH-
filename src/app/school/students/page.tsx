import { eq } from "drizzle-orm";
import { db } from "@/db";
import { classes, students } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Badge, statusBadge } from "@/components/ui/badge";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";
import { CreateStudentForm } from "./create-form";

export default async function StudentsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const schoolId = ctx.schoolId!;
  const rows = db.select().from(students).where(eq(students.schoolId, schoolId)).all();
  const classRows = db.select().from(classes).where(eq(classes.schoolId, schoolId)).all();
  return (
    <div>
      <PageHeader title="শিক্ষার্থী" description="সার্চ, ফিল্টার, ক্লাসভিত্তিক তালিকা" />
      <CreateStudentForm classes={classRows.map((c) => ({ id: c.id, name: c.nameBn || c.name }))} />
      <div className="mt-6 rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>আইডি</TH>
              <TH>নাম</TH>
              <TH>ক্লাস</TH>
              <TH>রোল</TH>
              <TH>মোবাইল</TH>
              <TH>স্ট্যাটাস</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((s) => (
              <TR key={s.id}>
                <TD>{s.studentId}</TD>
                <TD>
                  {s.nameBn || s.name}
                  <div className="text-xs text-muted-foreground">{s.admissionNumber}</div>
                </TD>
                <TD>{classRows.find((c) => c.id === s.classId)?.nameBn ?? "—"}</TD>
                <TD>{s.roll ?? "—"}</TD>
                <TD>{s.mobile}</TD>
                <TD>
                  <Badge variant={statusBadge(s.status)}>{s.status}</Badge>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
