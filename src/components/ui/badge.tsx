import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/10 text-primary",
        success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
        warning: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
        outline: "border border-border text-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export function statusBadge(status: string) {
  const map: Record<string, "success" | "warning" | "danger" | "default" | "muted"> = {
    ACTIVE: "success",
    PAID: "success",
    APPROVED: "success",
    DELIVERED: "success",
    SENT: "success",
    TRIAL: "warning",
    PENDING: "warning",
    PAST_DUE: "warning",
    QUEUED: "warning",
    EXPIRED: "danger",
    SUSPENDED: "danger",
    FAILED: "danger",
    REJECTED: "danger",
    CANCELLED: "muted",
    INACTIVE: "muted",
  };
  return map[status] ?? "muted";
}
