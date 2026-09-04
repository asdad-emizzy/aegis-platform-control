import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "muted" | "primary";

const toneStyles: Record<Tone, string> = {
  success: "bg-[color-mix(in_oklab,var(--color-success)_18%,transparent)] text-[color:var(--color-success)] ring-[color-mix(in_oklab,var(--color-success)_35%,transparent)]",
  warning: "bg-[color-mix(in_oklab,var(--color-warning)_18%,transparent)] text-[color:var(--color-warning)] ring-[color-mix(in_oklab,var(--color-warning)_35%,transparent)]",
  danger: "bg-[color-mix(in_oklab,var(--color-destructive)_20%,transparent)] text-[color:var(--color-destructive)] ring-[color-mix(in_oklab,var(--color-destructive)_40%,transparent)]",
  info: "bg-[color-mix(in_oklab,var(--color-info)_18%,transparent)] text-[color:var(--color-info)] ring-[color-mix(in_oklab,var(--color-info)_35%,transparent)]",
  primary: "bg-[color-mix(in_oklab,var(--color-primary)_18%,transparent)] text-[color:var(--color-primary)] ring-[color-mix(in_oklab,var(--color-primary)_35%,transparent)]",
  muted: "bg-muted/50 text-muted-foreground ring-border",
};

export function StatusBadge({
  tone = "muted",
  children,
  dot = true,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        toneStyles[tone],
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function statusTone(s: string): Tone {
  switch (s) {
    case "healthy":
    case "succeeded":
    case "compatible":
      return "success";
    case "degraded":
    case "warning":
    case "queued":
      return "warning";
    case "critical":
    case "failed":
    case "incompatible":
      return "danger";
    case "running":
    case "active":
      return "info";
    case "completed":
      return "success";
    default:
      return "muted";
  }
}
