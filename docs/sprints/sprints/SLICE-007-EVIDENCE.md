# Slice 7 — Investigation Context / Evidence

**Status:** Frozen
**Capability:** Investigation Context / Evidence
**Related ADR:** ADR-0005

## Objective

Represent the operational information examined by an Investigation without coupling the Investigation domain to a telemetry or AI provider.

## Implemented

`Evidence` is represented with:

```text
id
investigationId
kind
summary
detail
observedAt?
```

Supported evidence categories:

```text
metric
log
event
config
note
```

The repository provides deterministic mock Evidence and an `investigationId` lookup.

The Incident Workspace displays an Investigation Context card containing Evidence items and an empty state when no evidence exists.

## Domain Boundary

```text
Incident
   ↓
Investigation
   ↓
Investigation Context
   ↓
Evidence
```

Evidence is contextual operational information, not an investigative conclusion.

Evidence is distinct from Observability's `Observation` and remains provider-independent.

## Traceability Rules

- Evidence belongs to Investigation.
- Evidence references its Investigation by `investigationId`.
- Evidence does not contain Finding or Recommendation semantics.
- Provider-specific payloads must not enter the Evidence domain model.
- `observedAt` is optional and must not be fabricated for mock data.

## Validation

Validated through the Slice 7 completion checks:

- TypeScript validation passed.
- Build passed.
- Investigation Context renders for `INC-1024`.
- Evidence empty state renders for incidents without evidence.
- Existing Investigation, Incident, lifecycle, and service sections remain intact.
- Invalid incident handling remains intact.
- Global environment selection remains isolated from incident environment display.

## Architecture / ADR

ADR-0005 is the authoritative decision for Evidence ownership and the Investigation Context boundary.

## Out of Scope

- Finding
- Recommendation
- Real telemetry collection
- HolmesGPT
- Hindsight
- Agent Orchestrator
- Backend/API integration

## Freeze Criteria

The Evidence model and Investigation Context presentation are frozen. Future findings must reference Evidence rather than duplicate its contents.
