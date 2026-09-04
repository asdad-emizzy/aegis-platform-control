# Slice 8 — Finding & Investigation Provider Contract

**Status:** PASS WITH CONDITIONS
**Capability:** Finding / Investigation Provider Contract
**Related ADR:** ADR-0006

## Objective

Implement the minimum domain and provider contracts required to extend the Investigation flow from Evidence to Finding while proving provider independence.

## Implementation Record

The Slice 8 completion report states that the following were implemented:

```text
Incident
   ↓
Investigation
   ↓
Evidence
   ↓
Finding
```

and:

```text
Investigation
   ↓
InvestigationProvider
   ↓
Mock Investigation Provider
```

The reported implementation includes:

- `FindingClassification`: `root-cause | contributing-factor | observation`.
- `Finding` with Investigation ownership and Evidence ID references.
- Deterministic mock Finding data.
- `getFindingsForInvestigation()` lookup.
- Aegis-owned `InvestigationRequest` / `InvestigationResult` / `InvestigationProvider` contract.
- Deterministic `MockInvestigationProvider` with no network or LLM dependency.
- Incident Workspace Findings presentation and empty state.

## Important Repository-State Condition

The ACP-001 repository archive used for this documentation pass predates the reported Slice 8 implementation. Therefore the Slice 8 implementation details above are recorded from the Slice 8 completion report and are **not independently verified against the currently uploaded ACP-001 archive**.

The implementation should be considered frozen only after the Slice 8 implementation repository is committed and its source state is available for repository-level verification.

## Domain Rules

- Finding belongs to Investigation.
- Finding references Evidence by stable IDs only.
- Evidence content is not duplicated inside Finding.
- Root Cause is represented as a Finding classification.
- Recommendation is not implemented in this slice.
- The provider contract contains only Aegis concepts and no HolmesGPT-specific payloads.

## Validation Reported

- TypeScript: PASS
- Build: PASS
- Tests: not applicable; no test framework/script reported
- UI: PASS for finding and empty-state scenarios
- Regression: PASS for Slices 5–7 behavior
- Architecture/ADR: consistent with ADR-0006

## Out of Scope

HolmesGPT, Hindsight, Agent Orchestrator, Recommendation, real telemetry/provider integration, automated action, remediation, verification workflow, backend APIs, persistence, and authentication.

## Freeze Criteria

Slice 8 is frozen after the reported source changes are committed and independently reconciled with the canonical architecture and ADR-0006.

## Verification Update (Slice 9)

As part of Slice 9 regression validation, the Slice 8 implementation was confirmed present and functioning directly against the committed `main` branch (TypeScript, build, and UI validation, including the Findings card and empty state on `INC-1024` / `INC-1018`). Slice 8 is now independently verified; the repository-state condition above is resolved.
