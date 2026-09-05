import { RoleShell } from "@/components/shell/role-shell";
import { requireRole } from "@/lib/guard";
import { studentNav } from "@/lib/nav";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireRole(["STUDENT", "GUARDIAN"]);
  return (
    <RoleShell ctx={ctx} items={studentNav} title="শিক্ষার্থী পোর্টাল">
      {children}
    </RoleShell>
  );
}
