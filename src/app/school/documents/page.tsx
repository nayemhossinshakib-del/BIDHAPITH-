import { eq } from "drizzle-orm";
import { db } from "@/db";
import { schoolDocuments } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { requireRole } from "@/lib/guard";

export default async function DocumentsPage() {
  const ctx = await requireRole(["SCHOOL_ADMIN", "STAFF"]);
  const rows = db.select().from(schoolDocuments).where(eq(schoolDocuments.schoolId, ctx.schoolId!)).all();
  return (
    <div>
      <PageHeader title="ডকুমেন্ট" description="JPG, PNG, PDF, WEBP · পাবলিক/প্রাইভেট" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>শিরোনাম</TH>
              <TH>ক্যাটাগরি</TH>
              <TH>দৃশ্যমানতা</TH>
              <TH>ফাইল</TH>
            </TR>
          </THead>
          <TBody>
            {rows.map((d) => (
              <TR key={d.id}>
                <TD>{d.title}</TD>
                <TD>{d.category}</TD>
                <TD>{d.visibility}</TD>
                <TD>{d.fileName}</TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
