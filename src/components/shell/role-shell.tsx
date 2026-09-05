import {
  BookOpen,
  Building2,
  CalendarCheck,
  CreditCard,
  FileText,
  Globe,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Receipt,
  ScrollText,
  Settings,
  Shield,
  Users,
  Wallet,
  UserCircle,
} from "lucide-react";
import { AppShell, type NavItem } from "@/components/shell/app-shell";
import { ROLE_LABEL, type Role } from "@/lib/constants";
import type { AuthContext } from "@/lib/auth/types";

const ICONS: Record<string, React.ReactNode> = {
  "/admin": <LayoutDashboard className="h-4 w-4" />,
  "/admin/schools": <Building2 className="h-4 w-4" />,
  "/admin/subscriptions": <CreditCard className="h-4 w-4" />,
  "/admin/plans": <ScrollText className="h-4 w-4" />,
  "/admin/payments": <Wallet className="h-4 w-4" />,
  "/admin/sms": <MessageSquare className="h-4 w-4" />,
  "/admin/users": <Users className="h-4 w-4" />,
  "/admin/admissions": <GraduationCap className="h-4 w-4" />,
  "/admin/domains": <Globe className="h-4 w-4" />,
  "/admin/reports": <FileText className="h-4 w-4" />,
  "/admin/audit-logs": <Shield className="h-4 w-4" />,
  "/admin/settings": <Settings className="h-4 w-4" />,
  "/school": <LayoutDashboard className="h-4 w-4" />,
  "/school/students": <GraduationCap className="h-4 w-4" />,
  "/school/teachers": <Users className="h-4 w-4" />,
  "/school/accountants": <Wallet className="h-4 w-4" />,
  "/school/classes": <BookOpen className="h-4 w-4" />,
  "/school/subjects": <ScrollText className="h-4 w-4" />,
  "/school/attendance": <CalendarCheck className="h-4 w-4" />,
  "/school/results": <FileText className="h-4 w-4" />,
  "/school/fees": <CreditCard className="h-4 w-4" />,
  "/school/payments": <Receipt className="h-4 w-4" />,
  "/school/admissions": <GraduationCap className="h-4 w-4" />,
  "/school/notices": <Megaphone className="h-4 w-4" />,
  "/school/documents": <FileText className="h-4 w-4" />,
  "/school/sms": <MessageSquare className="h-4 w-4" />,
  "/school/reports": <FileText className="h-4 w-4" />,
  "/school/website": <Globe className="h-4 w-4" />,
  "/school/settings": <Settings className="h-4 w-4" />,
  "/school/subscription": <CreditCard className="h-4 w-4" />,
};

export function withIcons(items: { href: string; label: string }[]): NavItem[] {
  return items.map((i) => ({
    ...i,
    icon: ICONS[i.href] ?? <LayoutDashboard className="h-4 w-4" />,
  }));
}

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
      items={withIcons(items)}
      title={title}
      userName={ctx.name}
      roleLabel={ROLE_LABEL[ctx.role as Role]}
      impersonating={Boolean(ctx.impersonatedBy)}
    >
      {children}
    </AppShell>
  );
}

export { UserCircle };
