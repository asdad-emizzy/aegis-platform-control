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
| Slice 8 | Finding / InvestigationProvider | `src/lib/investigations.ts`, Incident Workspace Findings UI (reported) | ADR-0006 | Pass with conditions |

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
Controlled Action
   ↓
Verification
```

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

## Governance Rule

Every implementation slice must be traceable to the architecture and relevant ADRs. When implementation reveals a genuine architectural change, the ADR must be updated before continuing.

## Source-of-Truth Note

The repository archive used for this documentation pass contains the Slice 5–7 implementation and ACP-001 documentation. Slice 8 is recorded from its reported completion state and requires reconciliation against the committed Slice 8 source repository before it can be treated as independently verified.
