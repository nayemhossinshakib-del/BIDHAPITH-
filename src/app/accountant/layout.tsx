import { RoleShell } from "@/components/shell/role-shell";
import { requireRole } from "@/lib/guard";
import { accountantNav } from "@/lib/nav";

export default async function AccountantLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireRole(["ACCOUNTANT"]);
  return (
    <RoleShell ctx={ctx} items={accountantNav} title="হিসাবরক্ষক">
      {children}
    </RoleShell>
  );
}
