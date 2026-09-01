import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Server,
  Activity,
  GitBranch,
  Layers,
  ArrowUpRight,
  CircleDot,
  Sparkles,
  Workflow,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  clusters,
  jobs,
  recommendations,
  events,
  platformVersionDistribution,
} from "@/lib/mock-data";
import { ActiveIncidents } from "@/components/active-incidents";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Aegis" },
      {
        name: "description",
        content: "Fleet-wide overview of clusters, lifecycle, versions and platform activity.",
      },
      { property: "og:title", content: "Dashboard · Aegis" },
      {
        property: "og:description",
        content: "Fleet-wide overview of clusters, lifecycle, versions and platform activity.",
      },
    ],
  }),
  component: Dashboard,
});

function KpiCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint: string;
  tone?: "primary" | "success" | "warning" | "info";
}) {
  const toneMap = {
    primary: "text-primary",
    success: "text-[color:var(--color-success)]",
    warning: "text-[color:var(--color-warning)]",
    info: "text-[color:var(--color-info)]",
  } as const;
  return (
    <div className="group rounded-lg border border-border/70 bg-card/60 p-4 transition hover:border-border hover:bg-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${toneMap[tone]}`} />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tabular-nums tracking-tight">{value}</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function Dashboard() {
  const total = clusters.length;
  const healthy = clusters.filter((c) => c.status === "healthy").length;
  const upgrade = clusters.filter((c) => c.lifecycle === "upgrade").length;
  const versions = new Set(clusters.map((c) => c.platformVersion)).size;
  const maxVersion = Math.max(...platformVersionDistribution.map((v) => v.clusters));

  return (
    <>
      <PageHeader
        kicker="Operational Command Center"
        title="OCC Overview"
        description="Environment health, active issues, and recent operational activity."
        actions={
          <>
            <Button variant="outline" size="sm">
              Last 24 hours
            </Button>
            <Button size="sm" asChild>
              <Link to="/inventory">
                Open inventory <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard
            icon={Server}
            label="Total clusters"
            value={String(total)}
            hint="Across 3 AWS accounts"
          />
          <KpiCard
            icon={Activity}
            label="Healthy"
            value={`${healthy} / ${total}`}
            hint={`${Math.round((healthy / total) * 100)}% availability`}
            tone="success"
          />
          <KpiCard
            icon={GitBranch}
            label="Awaiting upgrade"
            value={String(upgrade)}
            hint="Blocked by compatibility drift"
            tone="warning"
          />
          <KpiCard
            icon={Layers}
            label="Platform versions"
            value={String(versions)}
            hint="Target 2.14.3 fleet-wide"
            tone="info"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Platform version distribution */}
          <div className="rounded-lg border border-border/70 bg-card/60 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold">Platform version distribution</h3>
                <p className="text-xs text-muted-foreground">Clusters per Aegis platform chart</p>
              </div>
              <StatusBadge tone="info">fleet target 2.14.3</StatusBadge>
            </div>
            <div className="p-4 space-y-3">
              {platformVersionDistribution.map((v) => (
                <div
                  key={v.version}
                  className="grid grid-cols-[9rem_1fr_2.5rem] items-center gap-3"
                >
                  <div className="font-mono text-xs text-muted-foreground">{v.version}</div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary/70 to-primary"
                      style={{ width: `${(v.clusters / maxVersion) * 100}%` }}
                    />
                  </div>
                  <div className="text-right text-xs tabular-nums text-foreground">
                    {v.clusters}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lifecycle status */}
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Lifecycle status</h3>
              <p className="text-xs text-muted-foreground">Current stage per cluster</p>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4">
              {(["track", "create", "upgrade", "validate", "migrate", "retire"] as const).map(
                (stage) => {
                  const count = clusters.filter((c) => c.lifecycle === stage).length;
                  return (
                    <div
                      key={stage}
                      className="rounded-md border border-border/60 bg-background/40 px-3 py-2"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {stage}
                      </div>
                      <div className="mt-1 text-lg font-semibold tabular-nums">{count}</div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <ActiveIncidents />
          {/* Recommendations */}
          <div className="rounded-lg border border-border/70 bg-card/60 lg:col-span-2">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold">Latest recommendations</h3>
              </div>
              <Link
                to="/recommendations"
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                View all →
              </Link>
            </div>
            <ul className="divide-y divide-border/60">
              {recommendations.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                  <StatusBadge
                    tone={
                      r.severity === "critical"
                        ? "danger"
                        : r.severity === "high"
                          ? "warning"
                          : r.severity === "medium"
                            ? "info"
                            : "muted"
                    }
                  >
                    {r.severity}
                  </StatusBadge>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{r.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {r.cluster} · {r.detail}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Events */}
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div className="flex items-center gap-2">
                <CircleDot className="h-4 w-4 text-[color:var(--color-info)]" />
                <h3 className="text-sm font-semibold">Recent operational activity</h3>
              </div>
            </div>
            <ol className="relative px-4 py-3">
              <span className="absolute bottom-4 left-[1.15rem] top-4 w-px bg-border/60" />
              {events.slice(0, 6).map((e) => (
                <li key={e.id} className="relative flex gap-3 py-1.5">
                  <div className="relative z-10 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary ring-4 ring-card" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                        {e.time}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {e.kind}
                      </span>
                    </div>
                    <div className="truncate text-xs text-foreground">{e.message}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Automation jobs */}
        <div className="rounded-lg border border-border/70 bg-card/60">
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">Automation activity</h3>
            </div>
            <Link to="/jobs" className="text-xs text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">Job</th>
                  <th className="px-4 py-2 text-left font-medium">Target</th>
                  <th className="px-4 py-2 text-left font-medium">Status</th>
                  <th className="px-4 py-2 text-left font-medium">Duration</th>
                  <th className="px-4 py-2 text-left font-medium">Triggered by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.slice(0, 5).map((j) => (
                  <tr key={j.id} className="hover:bg-background/40">
                    <td className="px-4 py-2">
                      <div className="font-medium">{j.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{j.id}</div>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {j.target}
                    </td>
                    <td className="px-4 py-2">
                      <StatusBadge tone={statusTone(j.status)}>{j.status}</StatusBadge>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs tabular-nums">{j.duration}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{j.triggeredBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
