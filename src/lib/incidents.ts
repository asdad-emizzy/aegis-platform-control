import type { Environment } from "./environment";

export type IncidentSeverity = "critical" | "high" | "medium" | "low";
export type IncidentStatus = "detected" | "triaged" | "investigating" | "resolved";

export interface Service {
  id: string;
  name: string;
  environment: Environment;
  status: "healthy" | "degraded" | "down";
  criticality: "critical" | "high" | "standard";
}

export interface Incident {
  id: string;
  title: string;
  environment: Environment;
  severity: IncidentSeverity;
  status: IncidentStatus;
  impact: string;
  affectedServices: string[];
  detectedAt: string;
}
export const services: Service[] = [
  { id: "s1", name: "Order API", environment: "prod", status: "degraded", criticality: "critical" },
  { id: "s2", name: "Payments", environment: "prod", status: "degraded", criticality: "critical" },
  { id: "s3", name: "Identity", environment: "prod", status: "healthy", criticality: "high" },
  { id: "s4", name: "Notifications", environment: "uat", status: "healthy", criticality: "standard" },
];
export const incidents: Incident[] = [
  { id: "INC-1024", title: "Order API latency spike", environment: "prod", severity: "critical", status: "investigating", impact: "Elevated P99 latency on checkout path", affectedServices: ["s1"], detectedAt: "08:42" },
  { id: "INC-1021", title: "Payments batch failure", environment: "prod", severity: "high", status: "triaged", impact: "Settlement batch behind schedule", affectedServices: ["s2"], detectedAt: "07:15" },
  { id: "INC-1018", title: "Notifications degraded in UAT", environment: "uat", severity: "medium", status: "detected", impact: "Notification delivery delayed", affectedServices: ["s4"], detectedAt: "Yesterday 18:20" },
];
