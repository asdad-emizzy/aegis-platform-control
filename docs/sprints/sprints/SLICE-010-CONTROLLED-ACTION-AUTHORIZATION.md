# Slice 10 — Controlled Action & Authorization State

**Status:** PASS
**Capability:** Controlled Action / Authorization (Automation domain)
**Related ADR:** ADR-0007

## Objective

Implement the minimum Controlled Action and Authorization model required to establish:

```text
Incident → Investigation → Finding → Recommendation → Controlled Action → Authorization
```

A Controlled Action is a proposed operational action, optionally derived from a Recommendation. Authorization determines whether it may proceed. This slice is read-only from the UI perspective and causes no operational side effects.

## Scope

In scope: Controlled Action data model, authorization decision state (`proposed | authorized | authorization-denied`), deterministic mock data, accessor, read-only Incident Workspace display, empty state.

Explicitly out of scope: Execution, Execution state, `AutomationProvider` adapters/invocation, Verification, Agent Orchestrator, real authorization/policy services, approval workflows, HolmesGPT/Hindsight/LLM, any infrastructure mutation.

## Architecture References

- ACP-002 — Controlled Action, Authorization, Execution & Verification Boundaries (canonical architecture)
- ADR-0007 — Controlled Action, Authorization, Execution and Verification Boundaries (authoritative)
- `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md`

## Implementation

- `src/lib/controlled-actions.ts` (new):
  - `ControlledActionStatus` (`proposed | authorized | authorization-denied`) — deliberately excludes `executed`, `execution-failed`, and any verification states, per ADR-0007 §3/§4 and this slice's explicit non-goals.
  - `ControlledAction` interface: `id`, optional `recommendationId`, `investigationId`, `incidentId`, `environment` (reuses the existing `Environment` type from `src/lib/environment.tsx` — no new environment subsystem), `actionType`, `targetResource`, `status`, optional `authorizedBy`/`decidedAt`/`denialReason`, `createdAt`.
  - Deterministic mock data: `CACT-6001`, referencing existing `REC-5001` (Slice 9 Recommendation), `INV-2001`, and `INC-1024`; status `authorized` with `authorizedBy`/`decidedAt` populated — no fabricated data for fields that would otherwise be absent.
  - `getControlledActionsForInvestigation(investigationId)` accessor, consistent with `getFindingsForInvestigation` / `getRecommendationsForInvestigation` conventions.
- `src/routes/incidents/$incidentId.tsx`:
  - New "Controlled Actions" card rendered under "Recommendations", showing status badge, environment, action type + target resource, related Recommendation ID reference, and authorization details (`authorized by … at …` or denial reason when present).
  - Empty state: "No controlled actions have been proposed for this investigation yet."
  - `ControlledActionItem` component. No Execute/Apply/Approve/Deny/Remediate controls anywhere.

## Domain

```text
Recommendation
      ↓
Controlled Action
      ↓
Authorization State
```

`ControlledAction.recommendationId` (optional), `.investigationId`, `.incidentId` are stable ID references only — no Recommendation, Finding, Evidence, or Incident content is duplicated. Authorization is represented as the `status` field plus `authorizedBy`/`decidedAt`/`denialReason` directly on `ControlledAction` — **no separate Authorization domain, table, or type was introduced**, per ADR-0007 §2.

## Lifecycle

```text
proposed
   ↓
authorized      (authorizedBy + decidedAt recorded)
```

```text
proposed
   ↓
authorization-denied   (terminal; authorizedBy/decidedAt/denialReason recorded when present)
```

No execution occurs in either path. The mock data demonstrates the `authorized` branch (`CACT-6001`); the `authorization-denied` branch and `proposed` (undecided) branch are supported by the type/UI but have no populated mock instance in this slice, consistent with using only the existing Slice 9 Recommendation (`REC-5001`) rather than inventing unrelated scenarios.

## Provider Boundary

```text
Controlled Action
      ↓
Authorization
      ↓
AutomationProvider   ← NOT invoked, NOT modified, NOT implemented in this slice
```

Confirmed: `src/lib/controlled-actions.ts` contains no import, invocation, or coupling to `AutomationProvider`, any cloud SDK, or any infrastructure system. The only reference to `AutomationProvider` in the new code is a documentation comment stating that it is intentionally not invoked.

## Files Changed

- `src/lib/controlled-actions.ts` (new)
- `src/routes/incidents/$incidentId.tsx` (extended)
- `docs/sprints/sprints/SLICE-010-CONTROLLED-ACTION-AUTHORIZATION.md` (new, this record)
- `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md` (updated)

## Validation

- TypeScript (`tsc --noEmit`): PASS
- Build (`bun run build`): PASS
- Tests: NOT APPLICABLE — no test script/framework exists in `package.json`
- UI validation: PASS
  - INC-1024: Controlled Actions card shows `CACT-6001` — status `authorized`, environment `PROD`, "Roll back deployment — Order API (replicas 2, 4, 5)", `From: REC-5001`, "Authorized by a.rossi@aegis at 09:05"; existing Evidence, Findings, and Recommendations sections unchanged.
  - INC-1018: Controlled Actions empty state renders; Evidence/Findings/Recommendations empty states unchanged.
  - Confirmed via DOM inspection: no Execute/Apply/Approve/Deny/Remediate buttons exist anywhere on the page — only pre-existing global chrome controls (sidebar toggle, search).
  - Invalid incident (`/incidents/does-not-exist`): existing not-found behavior unchanged.
  - Environment isolation: global environment forced to `sit`; incident/Controlled Action correctly displayed against `PROD` while the global selector remained `sit`.
- Regression validation: PASS — Slice 5 (Incident Workspace, lifecycle, services, invalid-incident handling), Slice 6 (Investigation card), Slice 7 (Evidence card/empty state), Slice 8 (Findings card/empty state), and Slice 9 (Recommendations card/empty state) all verified intact.
- Source-code safety: confirmed no invocation of `AutomationProvider`, no network calls, no external dependencies, no infrastructure mutation possible from this slice's code.

## Architecture / ADR Impact

- No architecture or ADR documents required modification beyond `IMPLEMENTATION_TRACEABILITY.md` (a delivery-tracking record, not an architecture decision).
- ADR-0007 remains authoritative; the implementation matches its Controlled Action / Authorization boundary exactly (no separate Authorization domain, no new Action Provider, Recommendation ownership unchanged, `AutomationProvider` untouched).
- No architectural deviation was discovered during implementation.

## Out of Scope (Confirmed Not Implemented)

Execution, Execution status, `AutomationProvider` adapters, AWS SSM, Ansible, Kubernetes/ECS/EKS execution, real authorization service, policy engine, approval workflow, production approval infrastructure, Verification, Verification Result, Agent Orchestrator, HolmesGPT, Hindsight, LLM/LCM, autonomous remediation, automated actions, real infrastructure mutation, backend APIs, persistence, authentication.

## Known Limitations

- Read-only; mock-data driven.
- Only one Controlled Action currently exists (`CACT-6001`, `authorized`), mirroring the existing single-Recommendation mock scope from Slice 9 — this is intentional, not a defect.
- The `authorization-denied` path is supported by the type/UI but has no populated mock example in this slice.

## Definition of Done

- [x] Controlled Action model implemented
- [x] Controlled Action belongs to Automation (per ADR-0007 ownership)
- [x] Controlled Action references Recommendation by ID
- [x] Investigation/Incident references are stable IDs
- [x] Authorization represented as state/decision on Controlled Action
- [x] `proposed` supported
- [x] `authorized` supported
- [x] `authorization-denied` supported
- [x] No separate Authorization domain introduced
- [x] Deterministic mock Controlled Action created
- [x] Accessor implemented
- [x] Incident Workspace displays Controlled Actions
- [x] Authorization state displayed
- [x] Empty state works
- [x] No Execute/Apply/Approve/Deny/Remediate controls added
- [x] `AutomationProvider` not modified
- [x] `AutomationProvider` not invoked
- [x] No external side effects possible
- [x] Slices 5–9 remain intact (regression verified)
- [x] TypeScript/build validation passes
- [x] Tests: not applicable (documented)
- [x] Architecture remains consistent with ACP-002 / ADR-0007
- [x] No unnecessary ADR changes introduced
- [x] Slice 10 sprint record created
- [x] Implementation traceability updated
- [x] No unrelated files modified
- [x] `git status` reviewed

## Freeze Criteria

Slice 10 is frozen. The Controlled Action model, its Authorization state, and the read-only Incident Workspace presentation may only be extended through a new implementation slice that implements Execution — strictly behind the existing `AutomationProvider` contract — or an explicit architecture decision.
