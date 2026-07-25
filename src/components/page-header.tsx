import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
  kicker,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  kicker?: string;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border/60 bg-card/30 px-6 py-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {kicker && (
          <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {kicker}
          </div>
        )}
        <h1 className="truncate text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
