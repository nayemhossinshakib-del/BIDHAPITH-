import { AppShell } from "@/components/shell/app-shell";
import { ROLE_LABEL, type Role } from "@/lib/constants";
import type { AuthContext } from "@/lib/auth/types";

export function RoleShell({
  ctx,
  items,
  title,
  children,
}: {
  ctx: AuthContext;
  items: { href: string; label: string }[];
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AppShell
      items={items}
      title={title}
      userName={ctx.name}
      roleLabel={ROLE_LABEL[ctx.role as Role] || ctx.role}
      impersonating={Boolean(ctx.impersonatedBy)}
    >
      {children}
    </AppShell>
  );
}
