import { createFileRoute } from "@tanstack/react-router";
import { GitBranch, Plus, ArrowUpCircle, ShieldCheck, MoveRight, Archive, Eye } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { clusters, type LifecycleStage } from "@/lib/mock-data";

export const Route = createFileRoute("/lifecycle")({
  head: () => ({
    meta: [
      { title: "Platform Lifecycle · Aegis" },
      { name: "description", content: "Track, create, upgrade, validate, migrate and retire clusters across the fleet." },
      { property: "og:title", content: "Platform Lifecycle · Aegis" },
      { property: "og:description", content: "Track, create, upgrade, validate, migrate and retire clusters across the fleet." },
    ],
  }),
  component: Lifecycle,
});

const stages: {
  key: LifecycleStage;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  hint: string;
}[] = [
  { key: "track", title: "Track", icon: Eye, hint: "Steady-state monitoring" },
  { key: "create", title: "Create", icon: Plus, hint: "Provision new clusters" },
  { key: "upgrade", title: "Upgrade", icon: ArrowUpCircle, hint: "Kubernetes and platform" },
  { key: "validate", title: "Validate", icon: ShieldCheck, hint: "Pre-production checks" },
  { key: "migrate", title: "Migrate", icon: MoveRight, hint: "Workload relocation" },
  { key: "retire", title: "Retire", icon: Archive, hint: "Decommission gracefully" },
];

function Lifecycle() {
  return (
    <>
      <PageHeader
        kicker="Control Plane"
        title="Platform Lifecycle"
        description="Six-stage lifecycle spanning every managed cluster."
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="h-3.5 w-3.5" />
            <span>Stateful workflow</span>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {stages.map((s) => {
            const items = clusters.filter((c) => c.lifecycle === s.key);
            const Icon = s.icon;
            return (
              <div
                key={s.key}
                className="flex min-h-[16rem] flex-col rounded-lg border border-border/70 bg-card/40"
              >
                <div className="flex items-center justify-between border-b border-border/60 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{s.title}</div>
                      <div className="text-[10px] text-muted-foreground">{s.hint}</div>
                    </div>
                  </div>
                  <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[10px] font-medium tabular-nums">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2 p-2">
                  {items.length === 0 && (
                    <div className="rounded-md border border-dashed border-border/60 p-4 text-center text-[11px] text-muted-foreground">
                      No clusters
                    </div>
                  )}
                  {items.map((c) => (
                    <div
                      key={c.id}
                      className="rounded-md border border-border/60 bg-background/40 p-2.5 text-xs"
                    >
                      <div className="truncate font-medium">{c.name}</div>
                      <div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                        {c.region} · k8s {c.k8sVersion}
                      </div>
                      <div className="mt-2">
                        <StatusBadge
                          tone={
                            c.status === "healthy"
                              ? "success"
                              : c.status === "degraded"
                              ? "warning"
                              : c.status === "critical"
                              ? "danger"
                              : "muted"
                          }
                        >
                          {c.status}
                        </StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
