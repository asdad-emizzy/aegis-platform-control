export type ClusterStatus = "healthy" | "degraded" | "critical" | "unknown";
export type LifecycleStage = "track" | "create" | "upgrade" | "validate" | "migrate" | "retire";

export interface Cluster {
  id: string;
  name: string;
  environment: "production" | "staging" | "dev";
  awsAccount: string;
  region: string;
  k8sVersion: string;
  platformVersion: string;
  nodeCount: number;
  status: ClusterStatus;
  lastScan: string;
  lifecycle: LifecycleStage;
}

export const clusters: Cluster[] = [
  { id: "c1", name: "prod-eks-us-east-1", environment: "production", awsAccount: "482910337201", region: "us-east-1", k8sVersion: "1.29", platformVersion: "2.14.3", nodeCount: 48, status: "healthy", lastScan: "2m ago", lifecycle: "track" },
  { id: "c2", name: "prod-eks-eu-west-1", environment: "production", awsAccount: "482910337201", region: "eu-west-1", k8sVersion: "1.28", platformVersion: "2.14.3", nodeCount: 36, status: "healthy", lastScan: "5m ago", lifecycle: "upgrade" },
  { id: "c3", name: "prod-eks-ap-south-1", environment: "production", awsAccount: "482910337201", region: "ap-south-1", k8sVersion: "1.27", platformVersion: "2.13.8", nodeCount: 24, status: "degraded", lastScan: "8m ago", lifecycle: "upgrade" },
  { id: "c4", name: "staging-eks-us-east-1", environment: "staging", awsAccount: "998271004512", region: "us-east-1", k8sVersion: "1.30", platformVersion: "2.15.0-rc1", nodeCount: 12, status: "healthy", lastScan: "1m ago", lifecycle: "validate" },
  { id: "c5", name: "staging-eks-eu-west-1", environment: "staging", awsAccount: "998271004512", region: "eu-west-1", k8sVersion: "1.29", platformVersion: "2.14.3", nodeCount: 10, status: "healthy", lastScan: "3m ago", lifecycle: "track" },
  { id: "c6", name: "dev-eks-us-west-2", environment: "dev", awsAccount: "710554223089", region: "us-west-2", k8sVersion: "1.30", platformVersion: "2.15.0-rc1", nodeCount: 6, status: "healthy", lastScan: "4m ago", lifecycle: "validate" },
  { id: "c7", name: "dev-eks-experimental", environment: "dev", awsAccount: "710554223089", region: "us-west-2", k8sVersion: "1.26", platformVersion: "2.12.1", nodeCount: 4, status: "critical", lastScan: "22m ago", lifecycle: "retire" },
  { id: "c8", name: "prod-eks-sa-east-1", environment: "production", awsAccount: "482910337201", region: "sa-east-1", k8sVersion: "1.28", platformVersion: "2.14.3", nodeCount: 18, status: "healthy", lastScan: "6m ago", lifecycle: "track" },
  { id: "c9", name: "migration-eks-target", environment: "staging", awsAccount: "998271004512", region: "us-east-2", k8sVersion: "1.30", platformVersion: "2.15.0-rc1", nodeCount: 8, status: "unknown", lastScan: "12m ago", lifecycle: "migrate" },
  { id: "c10", name: "sandbox-eks", environment: "dev", awsAccount: "710554223089", region: "us-east-1", k8sVersion: "1.25", platformVersion: "2.11.4", nodeCount: 3, status: "degraded", lastScan: "35m ago", lifecycle: "retire" },
];

export type JobStatus = "running" | "succeeded" | "failed" | "queued";
export interface AutomationJob {
  id: string;
  name: string;
  target: string;
  status: JobStatus;
  duration: string;
  started: string;
  finished: string;
  triggeredBy: string;
}
export const jobs: AutomationJob[] = [
  { id: "j-8421", name: "Upgrade EKS control plane", target: "prod-eks-eu-west-1", status: "running", duration: "4m 12s", started: "12:41:03", finished: "—", triggeredBy: "a.rossi@aegis" },
  { id: "j-8420", name: "Rotate node group AMIs", target: "prod-eks-us-east-1", status: "succeeded", duration: "18m 44s", started: "11:56:20", finished: "12:15:04", triggeredBy: "scheduler" },
  { id: "j-8419", name: "Validate platform 2.15.0-rc1", target: "staging-eks-us-east-1", status: "succeeded", duration: "6m 02s", started: "11:12:00", finished: "11:18:02", triggeredBy: "ci-pipeline" },
  { id: "j-8418", name: "Drift scan", target: "all clusters", status: "succeeded", duration: "2m 55s", started: "11:00:00", finished: "11:02:55", triggeredBy: "scheduler" },
  { id: "j-8417", name: "Migrate workloads", target: "migration-eks-target", status: "failed", duration: "12m 08s", started: "10:34:11", finished: "10:46:19", triggeredBy: "m.chen@aegis" },
  { id: "j-8416", name: "Retire cluster", target: "sandbox-eks", status: "queued", duration: "—", started: "—", finished: "—", triggeredBy: "j.patel@aegis" },
  { id: "j-8415", name: "Prometheus federation health", target: "all clusters", status: "succeeded", duration: "44s", started: "10:15:00", finished: "10:15:44", triggeredBy: "scheduler" },
];

export interface Recommendation {
  id: string;
  title: string;
  category: "upgrade" | "deprecation" | "drift" | "hygiene" | "capacity";
  severity: "critical" | "high" | "medium" | "low";
  cluster: string;
  detail: string;
  actionLabel: string;
}
export const recommendations: Recommendation[] = [
  { id: "r1", title: "Upgrade Kubernetes 1.27 → 1.29", category: "upgrade", severity: "high", cluster: "prod-eks-ap-south-1", detail: "Version 1.27 leaves standard support in 32 days. Two clusters are affected.", actionLabel: "Plan upgrade" },
  { id: "r2", title: "Deprecated API detected: policy/v1beta1", category: "deprecation", severity: "critical", cluster: "prod-eks-eu-west-1", detail: "PodSecurityPolicy removed in 1.25+. 14 manifests still reference it.", actionLabel: "Review manifests" },
  { id: "r3", title: "Platform version mismatch", category: "drift", severity: "medium", cluster: "sandbox-eks", detail: "Cluster runs Aegis platform 2.11.4 while fleet target is 2.14.3.", actionLabel: "Reconcile" },
  { id: "r4", title: "Missing ownership labels", category: "hygiene", severity: "low", cluster: "dev-eks-experimental", detail: "24 namespaces missing team, cost-center or owner labels.", actionLabel: "Apply labels" },
  { id: "r5", title: "Old node groups (>180 days)", category: "capacity", severity: "medium", cluster: "prod-eks-us-east-1", detail: "3 node groups exceed maximum AMI age policy.", actionLabel: "Rotate" },
  { id: "r6", title: "Prometheus scrape saturation", category: "capacity", severity: "high", cluster: "prod-eks-us-east-1", detail: "Federated Prometheus is at 84% ingestion capacity.", actionLabel: "Scale Prometheus" },
];

export interface PlatformEvent {
  id: string;
  time: string;
  kind: "upgrade" | "scan" | "config" | "incident" | "release";
  message: string;
  cluster?: string;
}
export const events: PlatformEvent[] = [
  { id: "e1", time: "12:41", kind: "upgrade", message: "EKS control plane upgrade started 1.28 → 1.29", cluster: "prod-eks-eu-west-1" },
  { id: "e2", time: "12:15", kind: "scan", message: "Fleet-wide drift scan completed — 3 drifts detected" },
  { id: "e3", time: "11:18", kind: "release", message: "Platform 2.15.0-rc1 validated on staging" },
  { id: "e4", time: "10:46", kind: "incident", message: "Migration job failed on target cluster", cluster: "migration-eks-target" },
  { id: "e5", time: "10:15", kind: "config", message: "Prometheus federation endpoint updated" },
  { id: "e6", time: "09:52", kind: "scan", message: "Compatibility matrix refreshed" },
];

export interface CompatibilityRow {
  component: string;
  current: string;
  target: string;
  minK8s: string;
  maxK8s: string;
  status: "compatible" | "warning" | "incompatible";
  notes: string;
}
export const compatibility: CompatibilityRow[] = [
  { component: "Kubernetes", current: "1.27 – 1.30", target: "1.29", minK8s: "—", maxK8s: "—", status: "compatible", notes: "Fleet spread across 4 minor versions" },
  { component: "EKS Addon: VPC CNI", current: "1.18.1", target: "1.19.0", minK8s: "1.25", maxK8s: "1.30", status: "warning", notes: "Newer patch available" },
  { component: "EKS Addon: CoreDNS", current: "1.11.1", target: "1.11.3", minK8s: "1.26", maxK8s: "1.30", status: "compatible", notes: "" },
  { component: "EKS Addon: kube-proxy", current: "1.29.0", target: "1.29.3", minK8s: "1.29", maxK8s: "1.29", status: "warning", notes: "Behind on 2 clusters" },
  { component: "Grafana OSS", current: "10.4.2", target: "11.1.0", minK8s: "—", maxK8s: "—", status: "compatible", notes: "Dashboards render unchanged" },
  { component: "Prometheus", current: "2.51.2", target: "2.53.0", minK8s: "—", maxK8s: "—", status: "compatible", notes: "Federated topology healthy" },
  { component: "Aegis Platform Chart", current: "2.14.3", target: "2.15.0-rc1", minK8s: "1.28", maxK8s: "1.30", status: "warning", notes: "RC in validation" },
  { component: "cert-manager", current: "1.14.4", target: "1.15.1", minK8s: "1.27", maxK8s: "1.30", status: "compatible", notes: "" },
  { component: "ExternalDNS", current: "0.14.0", target: "0.14.2", minK8s: "1.26", maxK8s: "1.30", status: "compatible", notes: "" },
  { component: "Istio (legacy)", current: "1.19.5", target: "—", minK8s: "1.25", maxK8s: "1.27", status: "incompatible", notes: "Blocks K8s 1.28+ upgrade" },
];

export const platformVersionDistribution = [
  { version: "2.11.4", clusters: 1 },
  { version: "2.12.1", clusters: 1 },
  { version: "2.13.8", clusters: 1 },
  { version: "2.14.3", clusters: 5 },
  { version: "2.15.0-rc1", clusters: 3 },
];
