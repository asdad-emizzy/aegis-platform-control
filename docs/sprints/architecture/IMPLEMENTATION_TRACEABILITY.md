# Aegis Implementation Traceability — Incident Investigation Flow

**Status:** Canonical
**Updated:** 2026-09-04

## Purpose

This document records the relationship between the implemented Incident Investigation slices, their architectural decisions, and their validation/freeze state.

## Traceability Matrix

| Milestone | Capability | Primary implementation | Architecture / ADR | Status |
|---|---|---|---|---|
| Slice 5 | Incident Workspace | `src/routes/incidents/$incidentId.tsx`, Incident navigation/helpers | Incident boundary; later reflected in architecture docs | Frozen |
| Slice 6 | Investigation | `src/lib/investigations.ts`, Incident Workspace Investigation section | ADR-0005, ADR-0006 | Frozen |
| Slice 7 | Evidence | `src/lib/investigations.ts`, Investigation Context UI | ADR-0005 | Frozen |
| ACP-001 | Architecture boundaries | Documentation only | ADR-0006 | Frozen |
| Slice 8 | Finding / InvestigationProvider | `src/lib/investigations.ts`, Incident Workspace Findings UI | ADR-0006 | Frozen |
| Slice 9 | Recommendation | `src/lib/investigation-recommendations.ts`, Incident Workspace Recommendations UI | ADR-0006 | Frozen |
| ACP-002 | Controlled Action / Authorization / Execution / Verification boundaries | Documentation only | ADR-0007 | Frozen |
| Slice 10 | Controlled Action / Authorization State | `src/lib/controlled-actions.ts`, Incident Workspace Controlled Actions UI | ADR-0007 | Frozen |

## Canonical Progression

```text
Slice 5
Incident Workspace
      ↓
Slice 6
Investigation
      ↓
Slice 7
Evidence
      ↓
ACP-001
Architecture boundaries frozen
      ↓
Slice 8
Finding + InvestigationProvider
      ↓
Slice 9
Recommendation
      ↓
ACP-002
Controlled Action / Authorization / Execution / Verification boundaries frozen
      ↓
Slice 10
Controlled Action + Authorization state
      ↓
Slice 11 (not yet implemented)
Execution, behind the existing AutomationProvider contract
```

## Domain Flow

```text
Incident
   ↓
Investigation
   ↓
Evidence / Knowledge Context
   ↓
Finding / Hypothesis
   ↓
Recommendation
   ↓
Controlled Action (proposed)
   ↓
Authorization (approved | denied)
   ↓ (only if approved)
Execution (succeeded | failed)
   ↓
Verification (success | failed | inconclusive)
   ↓
Incident Outcome
```

Ownership through Recommendation is frozen per ADR-0006. Ownership from Controlled Action onward is frozen per ADR-0007: Controlled Action and Execution belong to Automation; Authorization is a decision state on Controlled Action (not a separate domain); Verification is its own minimal capability; auditability of this flow belongs to the existing Activity capability.

## Provider Flow

```text
Investigation
      ↓
InvestigationProvider
      ↓
Provider Adapter
      ↓
HolmesGPT / future investigation engine
```

```text
Controlled Action (authorized)
      ↓
AutomationProvider
      ↓
Provider Adapter
      ↓
AWS Systems Manager / Ansible / Kubernetes / other external system
```

`AutomationProvider` is the existing Action Provider/Executor contract (`.ai/PROVIDER_MODEL.md`, `docs/sprints/architecture/PROVIDER_MODEL.md`) — ADR-0007 does not introduce a second contract.

## Governance Rule

Every implementation slice must be traceable to the architecture and relevant ADRs. When implementation reveals a genuine architectural change, the ADR must be updated before continuing.

## Source-of-Truth Note

Slices 5–9 are now committed to the repository and independently verified against source: TypeScript validation, build validation, and UI validation (including regression across Slices 5–8) were performed directly against the committed `main` branch as part of Slice 9. Slice 8 is no longer "pass with conditions" — its implementation is confirmed present and consistent with ADR-0006.

ACP-002 (Controlled Action / Authorization / Execution / Verification boundaries) is documentation-only: no application/source code was inspected for modification, and none was changed as part of that checkpoint.

Slice 10 implements the Controlled Action and Authorization portion of ADR-0007 only (`src/lib/controlled-actions.ts`, Incident Workspace Controlled Actions UI), validated directly against the committed `main` branch (TypeScript, build, UI, and regression across Slices 5–9). Execution, `AutomationProvider` invocation/adapters, Verification, and the Agent Orchestrator remain unimplemented and are explicitly out of scope for Slice 10.
