import { createFileRoute } from "@tanstack/react-router";
import { Database, BarChart3, Activity, Shield, Palette, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Aegis" },
      { name: "description", content: "Configure Grafana, Prometheus, database, authentication and provider integrations." },
      { property: "og:title", content: "Settings · Aegis" },
      { property: "og:description", content: "Configure Grafana, Prometheus, database, authentication and provider integrations." },
    ],
  }),
  component: Settings,
});

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border/70 bg-card/60">
      <div className="flex items-start gap-3 border-b border-border/60 px-5 py-4">
        <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary ring-1 ring-primary/25">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  hint,
  mono = false,
}: {
  label: string;
  value: string;
  hint?: string;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input defaultValue={value} className={mono ? "font-mono text-xs" : ""} />
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Settings() {
  return (
    <>
      <PageHeader
        kicker="Workspace"
        title="Settings"
        description="Wire Aegis to your existing infrastructure. All integrations use the Provider interface."
        actions={<Button size="sm">Save changes</Button>}
      />

      <div className="p-6 space-y-4">
        <Section
          icon={BarChart3}
          title="Grafana"
          description="Aegis reuses your existing Grafana OSS. Provide the base URL and SSO details."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Grafana URL" value="https://grafana.internal.aegis.io" mono />
            <Field label="Default org ID" value="1" mono />
            <Field label="Embed mode" value="iframe" />
            <Field label="SSO provider" value="oidc://sso.aegis.io" mono />
          </div>
        </Section>

        <Section
          icon={Activity}
          title="Prometheus endpoints"
          description="Existing Prometheus instances (one per EKS cluster). No Loki, Tempo, Alloy or Mimir in Phase 1."
        >
          <div className="overflow-hidden rounded-md border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-background/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">Cluster</th>
                  <th className="px-3 py-2 text-left font-medium">URL</th>
                  <th className="px-3 py-2 text-left font-medium">Auth</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  ["prod-eks-us-east-1", "https://prom-use1.aegis.io", "mTLS"],
                  ["prod-eks-eu-west-1", "https://prom-euw1.aegis.io", "mTLS"],
                  ["prod-eks-ap-south-1", "https://prom-aps1.aegis.io", "mTLS"],
                  ["staging-eks-us-east-1", "https://prom-stg-use1.aegis.io", "bearer"],
                ].map(([name, url, auth]) => (
                  <tr key={name}>
                    <td className="px-3 py-2 font-medium">{name}</td>
                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{url}</td>
                    <td className="px-3 py-2 text-xs">{auth}</td>
                    <td className="px-3 py-2">
                      <StatusBadge tone="success">connected</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        <Section
          icon={Database}
          title="Database"
          description="One PostgreSQL instance hosting the aegis and grafana databases."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Host" value="pg-aegis.internal:5432" mono />
            <Field label="SSL mode" value="require" />
            <Field label="Database A" value="aegis" hint="Inventory, lifecycle, compatibility, jobs, events, recommendations" mono />
            <Field label="Database B" value="grafana" hint="Grafana metadata only" mono />
          </div>
        </Section>

        <Section
          icon={Shield}
          title="Authentication"
          description="Single sign-on via your identity provider."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Provider" value="OIDC" />
            <Field label="Issuer" value="https://sso.aegis.io" mono />
            <Field label="Client ID" value="aegis-control-plane" mono />
            <div className="space-y-1.5">
              <Label className="text-xs">Client secret</Label>
              <div className="flex items-center gap-2">
                <Input type="password" defaultValue="•••••••••••••••" className="font-mono text-xs" />
                <Button size="icon" variant="outline">
                  <KeyRound className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </Section>

        <Section
          icon={Palette}
          title="Theme"
          description="Aegis defaults to a dark blue enterprise theme. Additional themes ship in a future phase."
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/15 ring-1 ring-primary/30">
              <div className="h-4 w-4 rounded-sm bg-gradient-to-br from-primary to-chart-4" />
            </div>
            <div>
              <div className="text-sm font-medium">Deep Blue (default)</div>
              <div className="text-xs text-muted-foreground">Optimized for control-room displays.</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Provider registry
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Every external system is wired through a Provider interface — business logic is never
              coupled to a specific implementation.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                ["Prometheus", "enabled"],
                ["Grafana", "enabled"],
                ["AWS", "enabled"],
                ["Kubernetes", "enabled"],
                ["HolmesGPT", "planned"],
                ["ArgoCD", "planned"],
                ["Terraform", "planned"],
                ["Crossplane", "planned"],
                ["GitHub", "planned"],
                ["OpenTofu", "planned"],
              ].map(([name, state]) => (
                <StatusBadge key={name} tone={state === "enabled" ? "success" : "muted"} dot>
                  {name} · {state}
                </StatusBadge>
              ))}
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
