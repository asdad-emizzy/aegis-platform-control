import type { Environment } from "./environment";

/**
 * Controlled Action & Authorization State (Slice 10). See ADR-0007 / ACP-002.
 *
 * A Controlled Action is the Aegis-owned representation of "an explicitly
 * approved operation that may produce a side effect." It is owned by the
 * Automation domain (ADR-0007 §1) — the same concept `.ai/DOMAIN_MODEL.md`
 * calls "Automation Task", named "Controlled Action" in product/UI language.
 *
 * Authorization is NOT a separate domain (ADR-0007 §2). It is a decision
 * state on the Controlled Action itself:
 *
 *   proposed
 *      ↓
 *   authorized | authorization-denied
 *
 * Execution and Verification are explicitly OUT OF SCOPE for this slice
 * (ADR-0007 §3/§4; ACP-002). This module never invokes `AutomationProvider`,
 * never causes an external side effect, and contains no `executed`,
 * `execution-failed`, or verification states — those belong to a future
 * slice once Execution is authorized for implementation.
 *
 * A Controlled Action references its Recommendation, Investigation, and
 * Incident by stable ID only — it never duplicates their content.
 */

export type ControlledActionStatus = "proposed" | "authorized" | "authorization-denied";

export interface ControlledAction {
  id: string;
  /** Optional — not every Controlled Action must originate from a Recommendation. */
  recommendationId?: string;
  investigationId: string;
  incidentId: string;
  /** The environment authorization was (or must be) evaluated against. */
  environment: Environment;
  /** What will happen, where — e.g. "Roll back deployment". */
  actionType: string;
  /** The specific resource the action targets — e.g. "order-api (replicas 2, 4, 5)". */
  targetResource: string;
  status: ControlledActionStatus;
  /**
   * Minimum authorization decision record (ADR-0007 §2): who/what decided,
   * and when. Only present once a decision has been made — absent while
   * `status` is still `proposed`. Never fabricated.
   */
  authorizedBy?: string;
  decidedAt?: string;
  /** Only present when a decision denied authorization. */
  denialReason?: string;
  createdAt: string;
}

export const controlledActions: ControlledAction[] = [
  {
    id: "CACT-6001",
    recommendationId: "REC-5001",
    investigationId: "INV-2001",
    incidentId: "INC-1024",
    environment: "prod",
    actionType: "Roll back deployment",
    targetResource: "Order API (replicas 2, 4, 5)",
    status: "authorized",
    authorizedBy: "a.rossi@aegis",
    decidedAt: "09:05",
    createdAt: "09:02",
  },
];

export function getControlledActionsForInvestigation(investigationId: string): ControlledAction[] {
  return controlledActions.filter((a) => a.investigationId === investigationId);
}
