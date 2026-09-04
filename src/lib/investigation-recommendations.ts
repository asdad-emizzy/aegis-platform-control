/**
 * Investigation Recommendation Boundary (Slice 9). See ADR-0006 / ACP-001.
 *
 * ADR-0006 draws a clear line between two different questions:
 *
 *   Finding        → "What do we believe happened, based on the evidence?"
 *   Recommendation  → "What should the operator consider doing?"
 *
 * Ownership (per ADR-0006 / ACP-001 canonical architecture):
 *
 *   Investigation domain owns: Investigation, Evidence, Finding
 *   Recommendations domain owns: Recommendation
 *
 * A Recommendation may reference an Investigation and one or more
 * Findings by stable ID. It must never duplicate their content, and it
 * must never execute, remediate, or automate anything — it is a
 * read-only, proposed operational decision.
 *
 * NOTE: `src/lib/mock-data.ts` already exports an unrelated `Recommendation`
 * type used by the existing fleet/cluster "Decision Support" route
 * (upgrade/deprecation/drift/hygiene/capacity recommendations). That is a
 * different, pre-existing bounded context and is intentionally left
 * unchanged by this slice. This module's `Recommendation` is scoped to the
 * Incident → Investigation → Evidence → Finding → Recommendation flow only.
 *
 * This module is provider-independent: it must never be coupled to
 * HolmesGPT, Hindsight, LLM/LCM, or any specific telemetry/AI provider.
 */

export type RecommendationPriority = "low" | "medium" | "high";
export type RecommendationStatus = "proposed" | "acknowledged" | "dismissed";

export interface Recommendation {
  id: string;
  investigationId: string;
  /** Finding IDs this recommendation is based on. References only — never duplicated. */
  findingIds: string[];
  statement: string;
  rationale: string;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  createdAt: string;
}

export const investigationRecommendations: Recommendation[] = [
  {
    id: "REC-5001",
    investigationId: "INV-2001",
    findingIds: ["FND-4001"],
    statement: "Roll back the Order API deployment on replicas 2, 4, and 5.",
    rationale:
      "The root-cause finding attributes the latency spike to the recent deployment on these replicas, with configuration ruled out as a factor.",
    priority: "high",
    status: "proposed",
    createdAt: "08:58",
  },
];

export function getRecommendationsForInvestigation(investigationId: string): Recommendation[] {
  return investigationRecommendations.filter((r) => r.investigationId === investigationId);
}
