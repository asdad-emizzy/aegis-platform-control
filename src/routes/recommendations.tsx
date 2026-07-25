import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ArrowUpCircle, AlertTriangle, GitCompare, Tag, Server } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { recommendations, type Recommendation } from "@/lib/mock-data";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Recommendations · Aegis" },
      { name: "description", content: "AI-ready recommendations for upgrades, deprecations, drift and hygiene." },
      { property: "og:title", content: "Recommendations · Aegis" },
      { property: "og:description", content: "AI-ready recommendations for upgrades, deprecations, drift and hygiene." },
    ],
  }),
  component: Recommendations,
});

const catIcon: Record<Recommendation["category"], React.ComponentType<{ className?: string }>> = {
  upgrade: ArrowUpCircle,
  deprecation: AlertTriangle,
  drift: GitCompare,
  hygiene: Tag,
  capacity: Server,
};

const sevTone = {
  critical: "danger",
  high: "warning",
  medium: "info",
  low: "muted",
} as const;

function Recommendations() {
  return (
    <>
      <PageHeader
        kicker="Insights"
        title="Recommendations"
        description="Prioritized actions surfaced from inventory, compatibility and drift signals."
        actions={
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Provider-agnostic · HolmesGPT ready</span>
          </div>
        }
      />
      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((r) => {
            const Icon = catIcon[r.category];
            return (
              <div
                key={r.id}
                className="group flex flex-col rounded-lg border border-border/70 bg-card/60 p-4 transition hover:border-primary/50"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
                    <Icon className="h-4 w-4" />
                  </div>
                  <StatusBadge tone={sevTone[r.severity]}>{r.severity}</StatusBadge>
                </div>
                <h3 className="mt-3 text-sm font-semibold">{r.title}</h3>
                <div className="mt-1 font-mono text-[11px] text-muted-foreground">{r.cluster}</div>
                <p className="mt-2 text-xs text-muted-foreground">{r.detail}</p>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {r.category}
                  </span>
                  <Button size="sm" variant="secondary">
                    {r.actionLabel}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
