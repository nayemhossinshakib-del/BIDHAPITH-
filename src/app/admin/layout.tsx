import { RoleShell } from "@/components/shell/role-shell";
import { requireRole } from "@/lib/guard";
import { adminNav } from "@/lib/nav";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireRole(["SUPER_ADMIN"]);
  return (
    <RoleShell ctx={ctx} items={adminNav} title="সুপার অ্যাডমিন">
      {children}
    </RoleShell>
  );
}
