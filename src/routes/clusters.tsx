import { createFileRoute, Link } from "@tanstack/react-router";
import { Server, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { clusters } from "@/lib/mock-data";

export const Route = createFileRoute("/clusters")({
  head: () => ({
    meta: [
      { title: "Clusters · Aegis" },
      { name: "description", content: "Detail view of every managed cluster, grouped by environment." },
      { property: "og:title", content: "Clusters · Aegis" },
      { property: "og:description", content: "Detail view of every managed cluster, grouped by environment." },
    ],
  }),
  component: Clusters,
});

function Clusters() {
  const groups = ["production", "staging", "dev"] as const;

  return (
    <>
      <PageHeader
        kicker="Fleet"
        title="Clusters"
        description="Grouped by environment. Click any cluster for lifecycle actions."
      />

      <div className="p-6 space-y-6">
        {groups.map((env) => {
          const items = clusters.filter((c) => c.environment === env);
          return (
            <section key={env}>
              <div className="mb-2 flex items-center gap-2">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {env}
                </h2>
                <span className="text-xs text-muted-foreground">· {items.length} clusters</span>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                {items.map((c) => (
                  <Link
                    key={c.id}
                    to="/inventory"
                    className="group rounded-lg border border-border/70 bg-card/60 p-4 transition hover:border-primary/50 hover:bg-card"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                          <Server className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-medium">{c.name}</div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {c.region} · {c.awsAccount}
                          </div>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:opacity-100" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">K8s</div>
                        <div className="font-mono">{c.k8sVersion}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Platform</div>
                        <div className="font-mono">{c.platformVersion}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Nodes</div>
                        <div className="font-mono tabular-nums">{c.nodeCount}</div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {c.lifecycle}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
