import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, ExternalLink, Lock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/grafana")({
  head: () => ({
    meta: [
      { title: "Grafana · Aegis" },
      { name: "description", content: "Launch embedded Grafana OSS dashboards from your existing Prometheus instances." },
      { property: "og:title", content: "Grafana · Aegis" },
      { property: "og:description", content: "Launch embedded Grafana OSS dashboards from your existing Prometheus instances." },
    ],
  }),
  component: Grafana,
});

const boards = [
  { title: "Cluster Health Overview", folder: "Platform / Fleet", uid: "aegis-fleet-health" },
  { title: "Kubernetes API Server", folder: "Kubernetes", uid: "k8s-apiserver" },
  { title: "Node Exporter — Full", folder: "Nodes", uid: "node-exporter-full" },
  { title: "Prometheus Federation", folder: "Platform / Prometheus", uid: "prom-federation" },
  { title: "EKS Control Plane Logs", folder: "AWS / EKS", uid: "eks-control-plane" },
  { title: "Aegis Platform SLOs", folder: "Platform / SLO", uid: "aegis-slos" },
];

function Grafana() {
  return (
    <>
      <PageHeader
        kicker="Observability"
        title="Grafana"
        description="Aegis reuses your existing Grafana OSS. Dashboards live in Grafana — Aegis launches them via SSO."
        actions={
          <Button size="sm" variant="outline" asChild>
            <a href="https://grafana.example.com" target="_blank" rel="noreferrer">
              Open Grafana <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="rounded-lg border border-border/70 bg-card/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Embedded dashboard</h3>
            </div>
            <StatusBadge tone="success">
              <Lock className="mr-0.5 h-3 w-3" /> SSO connected
            </StatusBadge>
          </div>
          <div className="relative aspect-[16/7] w-full overflow-hidden rounded-b-lg">
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 gap-2 p-4">
              {[...Array(18)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-md border border-border/40 bg-gradient-to-br from-primary/5 via-background/40 to-chart-4/5"
                >
                  <div className="flex h-full w-full items-end p-2">
                    <div
                      className="w-full rounded bg-gradient-to-t from-primary/40 to-primary/10"
                      style={{ height: `${20 + ((i * 37) % 70)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary ring-1 ring-primary/30">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <p className="mt-3 text-sm font-medium">Grafana iframe placeholder</p>
                <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                  Configure the Grafana URL in Settings to embed live dashboards here via SSO.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Curated dashboards
          </h3>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {boards.map((b) => (
              <a
                key={b.uid}
                href={`#${b.uid}`}
                className="group flex items-center justify-between rounded-lg border border-border/70 bg-card/60 p-4 transition hover:border-primary/50 hover:bg-card"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{b.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{b.folder}</div>
                  <div className="mt-2 font-mono text-[10px] text-muted-foreground">
                    uid: {b.uid}
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
