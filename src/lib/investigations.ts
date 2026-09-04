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
 * Investigation Context / Evidence Foundation (Slice 7). See ADR-0005
 * (as corrected by ADR-0006).
 *
 * Evidence is a raw/contextual operational signal referenced by an
 * Investigation — it is NOT a conclusion (that is "Finding", owned by
 * the Investigation domain itself per ADR-0006) and it is NOT a
 * replacement for Observability's "Observation". Evidence is
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

/**
 * Finding Foundation (Slice 8). See ADR-0006.
 *
 * A Finding is an investigative conclusion — "what do we believe
 * happened, based on the available evidence?". Finding belongs to the
 * Investigation domain (NOT Recommendations — ADR-0006 corrects the
 * earlier ADR-0005 language). A Finding references Evidence by stable
 * ID; it never duplicates Evidence content. Root Cause is not a
 * separate domain/type — it is the "root-cause" classification below.
 * Finding is NOT a Recommendation: it describes a conclusion, never a
 * proposed operational action.
 */
export type FindingClassification = "root-cause" | "contributing-factor" | "observation";

export interface Finding {
  id: string;
  investigationId: string;
  classification: FindingClassification;
  statement: string;
  /** 0–1 confidence that the statement is correct, given the referenced evidence. */
  confidence: number;
  /** Evidence IDs that support this finding. References only — never duplicated. */
  supportingEvidenceIds: string[];
  createdAt: string;
}

export const findings: Finding[] = [
  {
    id: "FND-4001",
    investigationId: "INV-2001",
    classification: "root-cause",
    statement:
      "The latency spike was introduced by the recent deployment to Order API replicas 2, 4, and 5; configuration was not a factor.",
    confidence: 0.82,
    supportingEvidenceIds: ["EVD-3002", "EVD-3001", "EVD-3003"],
    createdAt: "08:55",
  },
];

export function getFindingsForInvestigation(investigationId: string): Finding[] {
  return findings.filter((f) => f.investigationId === investigationId);
}

/**
 * Investigation Provider Contract (Slice 8). See ADR-0006 / PROVIDER_MODEL.md.
 *
 * InvestigationProvider is an Aegis-owned outbound port for investigation
 * execution. It is provider-independent by design: the request/result
 * shapes below use only Aegis Evidence/Finding concepts and must never
 * expose vendor-specific payloads, job IDs, or SDK types (e.g. HolmesGPT).
 * A concrete adapter (e.g. a future HolmesGPT adapter) would translate
 * its vendor schema into this shape — no such adapter exists in this slice.
 */
export interface InvestigationRequest {
  investigationId: string;
  incidentId: string;
  evidence: Evidence[];
}

export interface InvestigationResult {
  investigationId: string;
  findings: Finding[];
}

export interface InvestigationProvider {
  investigate(request: InvestigationRequest): Promise<InvestigationResult>;
}

/**
 * Deterministic mock implementation of InvestigationProvider.
 *
 * Exists only to prove the contract is implementable without coupling to
 * any external system: no network calls, no LLM calls, no vendor SDKs.
 * It looks up existing Slice 7/8 mock Findings for the given investigation
 * rather than fabricating new data.
 */
export class MockInvestigationProvider implements InvestigationProvider {
  async investigate(request: InvestigationRequest): Promise<InvestigationResult> {
    return {
      investigationId: request.investigationId,
      findings: getFindingsForInvestigation(request.investigationId),
    };
  }
}
