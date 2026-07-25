import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { compatibility } from "@/lib/mock-data";

export const Route = createFileRoute("/compatibility")({
  head: () => ({
    meta: [
      { title: "Compatibility · Aegis" },
      { name: "description", content: "Compatibility matrix across Kubernetes, EKS addons, Prometheus, Grafana and platform components." },
      { property: "og:title", content: "Compatibility · Aegis" },
      { property: "og:description", content: "Compatibility matrix across Kubernetes, EKS addons, Prometheus, Grafana and platform components." },
    ],
  }),
  component: Compatibility,
});

function Compatibility() {
  return (
    <>
      <PageHeader
        kicker="Governance"
        title="Compatibility Matrix"
        description="Component versions, supported Kubernetes range, and drift against fleet target."
      />
      <div className="p-6">
        <div className="overflow-hidden rounded-lg border border-border/70 bg-card/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Component</th>
                  <th className="px-4 py-2.5 text-left font-medium">Current</th>
                  <th className="px-4 py-2.5 text-left font-medium">Target</th>
                  <th className="px-4 py-2.5 text-left font-medium">Min K8s</th>
                  <th className="px-4 py-2.5 text-left font-medium">Max K8s</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {compatibility.map((row) => (
                  <tr key={row.component} className="hover:bg-background/40">
                    <td className="px-4 py-2.5 font-medium">{row.component}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.current}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{row.target}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.minK8s}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{row.maxK8s}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={statusTone(row.status)}>{row.status}</StatusBadge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{row.notes || "—"}</td>
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
