import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { clusters } from "@/lib/mock-data";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory · Aegis" },
      { name: "description", content: "Complete inventory of managed EKS clusters, versions and lifecycle state." },
      { property: "og:title", content: "Inventory · Aegis" },
      { property: "og:description", content: "Complete inventory of managed EKS clusters, versions and lifecycle state." },
    ],
  }),
  component: Inventory,
});

function Inventory() {
  const [query, setQuery] = useState("");
  const filtered = clusters.filter((c) =>
    [c.name, c.environment, c.region, c.awsAccount].some((v) =>
      v.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <>
      <PageHeader
        kicker="Fleet"
        title="Inventory"
        description={`${clusters.length} clusters across production, staging and dev environments.`}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-1 h-3.5 w-3.5" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-3.5 w-3.5" /> Export
            </Button>
          </>
        }
      />

      <div className="p-6 space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clusters, regions, accounts…"
            className="h-9 pl-8"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-border/70 bg-card/60">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Cluster</th>
                  <th className="px-4 py-2.5 text-left font-medium">Environment</th>
                  <th className="px-4 py-2.5 text-left font-medium">AWS Account</th>
                  <th className="px-4 py-2.5 text-left font-medium">Region</th>
                  <th className="px-4 py-2.5 text-left font-medium">K8s</th>
                  <th className="px-4 py-2.5 text-left font-medium">Platform</th>
                  <th className="px-4 py-2.5 text-right font-medium">Nodes</th>
                  <th className="px-4 py-2.5 text-left font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Last scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-background/40">
                    <td className="px-4 py-2.5 font-medium">{c.name}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge
                        tone={c.environment === "production" ? "primary" : c.environment === "staging" ? "info" : "muted"}
                        dot={false}
                      >
                        {c.environment}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{c.awsAccount}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{c.region}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{c.k8sVersion}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{c.platformVersion}</td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{c.nodeCount}</td>
                    <td className="px-4 py-2.5">
                      <StatusBadge tone={statusTone(c.status)}>{c.status}</StatusBadge>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{c.lastScan}</td>
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
