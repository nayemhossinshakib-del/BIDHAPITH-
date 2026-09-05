import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { createId } from "@/lib/id";
import type { AuthContext } from "@/lib/auth/types";

export function writeAudit(opts: {
  ctx?: AuthContext | null;
  schoolId?: string | null;
  action: string;
  module: string;
  resource?: string;
  resourceId?: string;
  ip?: string | null;
  userAgent?: string | null;
  before?: unknown;
  after?: unknown;
}) {
  db.insert(auditLogs)
    .values({
      id: createId(),
      schoolId: opts.schoolId ?? opts.ctx?.schoolId ?? null,
      userId: opts.ctx?.userId ?? null,
      action: opts.action,
      module: opts.module,
      resource: opts.resource ?? null,
      resourceId: opts.resourceId ?? null,
      ip: opts.ip ?? null,
      userAgent: opts.userAgent ?? null,
      beforeJson: opts.before ? JSON.stringify(opts.before) : null,
      afterJson: opts.after ? JSON.stringify(opts.after) : null,
    })
    .run();
}
