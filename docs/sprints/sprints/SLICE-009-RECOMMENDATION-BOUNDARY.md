# Slice 9 — Recommendation Boundary

**Status:** PASS
**Capability:** Recommendation (Investigation flow)
**Related ADR:** ADR-0006

## Objective

Implement the minimum Recommendation domain required to extend the Investigation flow from Finding to Recommendation, establishing a clear separation between an investigative conclusion ("what do we believe happened?") and a proposed operational decision ("what should we do?").

## Scope

```text
Incident
   ↓
Investigation
   ↓
Evidence
   ↓
Finding
   ↓
Recommendation
```

Recommendation is read-only in this slice. No action execution, remediation, automation, or provider integration is introduced.

## Architecture References

- ACP-001 — Investigation, Finding, Recommendation & Investigation Provider Boundaries (canonical architecture)
- ADR-0006 — Investigation, Finding, Recommendation and Investigation Provider Boundaries (authoritative)
- `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md`

## Implementation

- `src/lib/investigation-recommendations.ts` (new):
  - `RecommendationPriority` (`low | medium | high`), `RecommendationStatus` (`proposed | acknowledged | dismissed`).
  - `Recommendation` interface: `id`, `investigationId`, `findingIds`, `statement`, `rationale`, `priority`, `status`, `createdAt`.
  - Deterministic mock data: `REC-5001`, referencing `INV-2001` and `FND-4001` (existing Slice 8 Finding) — no new incidents/infrastructure invented.
  - `getRecommendationsForInvestigation(investigationId)` accessor, consistent with existing `getFindingsForInvestigation` / `getEvidenceForInvestigation` conventions.
  - Explicit module-level note distinguishing this `Recommendation` type from the pre-existing, unrelated `Recommendation` type in `src/lib/mock-data.ts` (fleet/cluster "Decision Support" recommendations) to avoid ownership confusion.
- `src/routes/incidents/$incidentId.tsx`:
  - New "Recommendations" card rendered under "Findings", showing statement, rationale, priority badge, status badge, and related Finding ID references (no Finding content duplicated).
  - Empty state: "No recommendations have been produced for this investigation yet."
  - No apply/execute/remediate/automation controls added.

## Domain Ownership

```text
Investigation
  owns → Investigation, Evidence, Finding

Recommendations
  owns → Recommendation
```

`Recommendation.investigationId` references Investigation by ID. `Recommendation.findingIds` reference Finding by ID only — Finding content (statement, confidence, evidence refs) is never duplicated inside Recommendation. The `InvestigationProvider` contract from Slice 8 was not modified; Recommendation is downstream of Investigation and has no provider boundary in this slice.

## Files Changed

- `src/lib/investigation-recommendations.ts` (new)
- `src/routes/incidents/$incidentId.tsx` (extended)
- `docs/sprints/sprints/SLICE-009-RECOMMENDATION-BOUNDARY.md` (new, this record)
- `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md` (updated)

## Validation

- TypeScript (`tsc --noEmit`): PASS
- Build (`bun run build`): PASS
- Tests: NOT APPLICABLE — no test script/framework exists in `package.json`
- UI validation: PASS
  - INC-1024 (Findings + Recommendations): Finding `FND-4001` and Recommendation `REC-5001` both render; Recommendation shows `high priority`, `proposed`, statement, rationale, and `Based on: FND-4001`.
  - INC-1018 (no Findings, no Recommendations): Evidence, Findings, and Recommendations all show their respective empty states; existing Investigation card unchanged.
  - Invalid incident (`/incidents/does-not-exist`): existing not-found behavior unchanged.
  - Environment isolation: global environment forced to `sit`; incident workspace and Recommendation content correctly displayed against `PROD` while the global selector remained `sit`.
- Regression validation: PASS — Slice 5 (Incident Workspace, lifecycle, services, invalid-incident handling), Slice 6 (Investigation card), Slice 7 (Evidence card and empty state), and Slice 8 (Findings card and empty state) all verified intact.

## Architecture / ADR Impact

- No architecture or ADR documents required modification. ADR-0006 already establishes Recommendation ownership by the Recommendations domain, Finding ownership by Investigation, and the reference-only relationship between them — the implementation matches this decision exactly.
- ADR-0006 remains authoritative.
- No architectural deviation was discovered during implementation.

## Out of Scope

HolmesGPT, Hindsight, Agent Orchestrator, Recommendation Provider, real AI-generated recommendations, automated actions, remediation, action execution, verification workflows, CloudWatch/Prometheus/Kubernetes integration, backend APIs, persistence/database integration, authentication.

## Known Limitations

- Read-only; mock-data driven.
- Recommendation status (`proposed | acknowledged | dismissed`) represents the recommendation's own lifecycle only — it is not an action-execution status.
- Only one investigation (`INV-2001`) currently has a Recommendation; this is intentional (mirrors the existing Finding mock scope) and not a defect.

## Definition of Done

- [x] Recommendation model implemented
- [x] Recommendation belongs to Recommendations capability/domain
- [x] Recommendation references Investigation by ID
- [x] Recommendation references Finding IDs (no duplication)
- [x] Deterministic mock Recommendations implemented
- [x] `getRecommendationsForInvestigation` accessor implemented
- [x] Incident Workspace displays Recommendations
- [x] Recommendation empty state works
- [x] No execution/automation/action controls added
- [x] Slices 5–8 remain intact (regression verified)
- [x] TypeScript/build validation passes
- [x] Tests: not applicable (documented)
- [x] Architecture remains consistent with ACP-001 / ADR-0006
- [x] No unnecessary ADR changes introduced
- [x] Slice 9 sprint record created
- [x] Implementation traceability updated
- [x] No unrelated files modified
- [x] `git status` reviewed

## Freeze Criteria

Slice 9 is frozen. The Recommendation model, its Investigation/Finding references, and the read-only Incident Workspace presentation may only be extended through a new implementation slice or an explicit architecture decision (e.g. a future Recommendation Provider or Controlled Action boundary).
