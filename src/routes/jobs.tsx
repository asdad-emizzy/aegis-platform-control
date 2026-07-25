import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { RotateCw } from "lucide-react";
import { jobs } from "@/lib/mock-data";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Automation Jobs · Aegis" },
      { name: "description", content: "Run history and live status of platform automation jobs." },
      { property: "og:title", content: "Automation Jobs · Aegis" },
      { property: "og:description", content: "Run history and live status of platform automation jobs." },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  return (
    <>
      <PageHeader
        kicker="Automation"
        title="Jobs"
        description="Every platform action — scheduled, CI-triggered or human-initiated."
        actions={
          <Button variant="outline" size="sm">
            <RotateCw className="mr-1 h-3.5 w-3.5" /> Refresh
          </Button>
        }
      />
      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-border/70 bg-card/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Job</th>
                  <th className="px-4 py-2.5 text-left font-medium">Target</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Duration</th>
                  <th className="px-4 py-2.5 text-left font-medium">Started</th>
                  <th className="px-4 py-2.5 text-left font-medium">Finished</th>
                  <th className="px-4 py-2.5 text-left font-medium">Triggered by</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-background/40">
                    <td className="px-4 py-2.5">
                      <div className="font-medium">{j.name}</div>
                      <div className="font-mono text-[11px] text-muted-foreground">{j.id}</div>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{j.target}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={statusTone(j.status)}>{j.status}</StatusBadge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs tabular-nums">{j.duration}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{j.started}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{j.finished}</td>
                    <td className="px-4 py-2.5 text-xs">{j.triggeredBy}</td>
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
