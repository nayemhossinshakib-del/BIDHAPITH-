import { RoleShell } from "@/components/shell/role-shell";
import { requireRole } from "@/lib/guard";
import { teacherNav } from "@/lib/nav";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requireRole(["TEACHER"]);
  return (
    <RoleShell ctx={ctx} items={teacherNav} title="শিক্ষক প্যানেল">
      {children}
    </RoleShell>
  );
}
