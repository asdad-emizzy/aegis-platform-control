import { StatusBadge, statusTone } from "@/components/status-badge";
import { incidents, services } from "@/lib/incidents";

const SEV_ORDER = { critical: 0, high: 1, medium: 2, low: 3 } as const;
export function ActiveIncidents() {
  const active = incidents.filter((i) => i.status !== "resolved");
  const sorted = [...active].sort(
    (a, b) =>
      SEV_ORDER[a.severity] - SEV_ORDER[b.severity] || a.detectedAt.localeCompare(b.detectedAt),
  );
  if (sorted.length === 0)
    return <p className="text-sm text-muted-foreground">No active incidents.</p>;
  return (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold">Active Incidents</h3>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2">Incident</th>
              <th className="px-3 py-2">Environment</th>
              <th className="px-3 py-2">Severity</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Affected Service</th>
              <th className="px-3 py-2">Detected</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((inc) => {
              const svc = services.find((s) => s.id === inc.affectedServices[0]);
              return (
                <tr key={inc.id} className="border-b last:border-0">
                  <td className="px-3 py-2 font-medium">{inc.id}</td>
                  <td className="px-3 py-2 uppercase">{inc.environment}</td>
                  <td className="px-3 py-2">
                    <StatusBadge tone={statusTone(inc.severity)}>{inc.severity}</StatusBadge>
                  </td>
                  <td className="px-3 py-2 capitalize">{inc.status}</td>
                  <td className="px-3 py-2">{svc?.name ?? "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{inc.detectedAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
