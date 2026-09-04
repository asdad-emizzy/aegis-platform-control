/**
 * Investigation Foundation (Slice 6).
 *
 * Investigation is a distinct operational concept from Incident:
 * an Incident describes the problem, an Investigation describes what is
 * being examined to understand it. This module is intentionally minimal
 * and provider-independent — it must not encode any AI/provider-specific
 * fields (e.g. HolmesGPT job ids). See .ai/DOMAIN_MODEL.md (AI Investigation)
 * and .ai/PROVIDER_MODEL.md (AI Provider) for the target architecture.
 */

export type InvestigationStatus = "pending" | "active" | "completed";

export interface Investigation {
  id: string;
  incidentId: string;
  status: InvestigationStatus;
  summary: string;
  /** Only present when investigation work has actually started. Never fabricated. */
  startedAt?: string;
}

export const investigations: Investigation[] = [
  {
    id: "INV-2001",
    incidentId: "INC-1024",
    status: "active",
    summary: "Reviewing checkout path latency across Order API replicas.",
    startedAt: "08:50",
  },
  {
    id: "INV-2002",
    incidentId: "INC-1021",
    status: "pending",
    summary: "Awaiting triage confirmation before investigation begins.",
  },
  {
    id: "INV-2003",
    incidentId: "INC-1018",
    status: "pending",
    summary: "Awaiting triage confirmation before investigation begins.",
  },
];

export function getInvestigationForIncident(incidentId: string): Investigation | undefined {
  return investigations.find((inv) => inv.incidentId === incidentId);
}

/**
 * Investigation Context / Evidence Foundation (Slice 7). See ADR-0005.
 *
 * Evidence is a raw/contextual operational signal referenced by an
 * Investigation — it is NOT a conclusion (that is a future "Finding",
 * owned by the Recommendations domain per DOMAIN_MODEL.md) and it is NOT
 * a replacement for Observability's "Observation". Evidence is
 * provider-independent: `kind` describes the category of signal, not a
 * specific telemetry/AI provider payload shape.
 */
export type EvidenceKind = "metric" | "log" | "event" | "config" | "note";

export interface Evidence {
  id: string;
  investigationId: string;
  kind: EvidenceKind;
  summary: string;
  detail: string;
  /** Only present when the mock record represents an actual observed moment. Never fabricated. */
  observedAt?: string;
}

export const evidence: Evidence[] = [
  {
    id: "EVD-3001",
    investigationId: "INV-2001",
    kind: "metric",
    summary: "P99 latency elevated on checkout path",
    detail: "Order API P99 latency exceeded 2.4s across 3 of 6 replicas.",
    observedAt: "08:45",
  },
  {
    id: "EVD-3002",
    investigationId: "INV-2001",
    kind: "event",
    summary: "Recent deployment on affected replicas",
    detail: "Order API replicas 2, 4, and 5 were redeployed shortly before the latency spike.",
    observedAt: "08:38",
  },
  {
    id: "EVD-3003",
    investigationId: "INV-2001",
    kind: "config",
    summary: "Connection pool size unchanged",
    detail: "Database connection pool configuration matches the last known-good baseline.",
  },
];

export function getEvidenceForInvestigation(investigationId: string): Evidence[] {
  return evidence.filter((e) => e.investigationId === investigationId);
}
