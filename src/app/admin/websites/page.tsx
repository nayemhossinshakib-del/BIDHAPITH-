import { db } from "@/db";
import { schoolWebsites, schools } from "@/db/schema";
import { PageHeader } from "@/components/empty-state";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import Link from "next/link";

export default function WebsitesPage() {
  const sites = db.select().from(schoolWebsites).all();
  const schoolRows = db.select().from(schools).all();
  return (
    <div>
      <PageHeader title="স্কুল ওয়েবসাইট" />
      <div className="rounded-2xl border border-border bg-card">
        <Table>
          <THead>
            <TR>
              <TH>স্কুল</TH>
              <TH>SEO টাইটেল</TH>
              <TH>থিম</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {sites.map((w) => {
              const s = schoolRows.find((x) => x.id === w.schoolId);
              return (
                <TR key={w.id}>
                  <TD>{s?.nameBn}</TD>
                  <TD>{w.seoTitle}</TD>
                  <TD>{w.theme}</TD>
                  <TD>
                    <Link className="text-primary text-sm" href={`/s/${s?.slug}`}>
                      দেখুন
                    </Link>
                  </TD>
                </TR>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
