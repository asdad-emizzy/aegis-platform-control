# Slice 5 — Incident Workspace

**Status:** Frozen
**Capability:** Incident Workspace
**Architecture:** Incident → Incident Workspace

## Objective

Introduce the first read-only Incident Workspace so an operator can move from the Active Incidents view into a specific incident and inspect its operational context.

## Implemented

- Incident detail route at `/incidents/:incidentId`.
- Incident identity, title, environment, severity, status, impact, and detected time display.
- Incident lifecycle display.
- Affected Services display.
- Invalid incident handling through a scoped not-found state.
- Active Incident IDs link to the Incident Workspace.
- Environment context remains global and is not mutated by incident navigation.

## Domain Boundary

```text
Incident
   ↓
Incident Workspace
```

An Incident represents an operational problem. A Service remains a separate operational workload/capability and is not converted into an Incident.

## Data Boundary

The workspace consumes the existing mock Incident and Service domain data. No backend or telemetry integration is introduced by this slice.

## Validation

Validated through the subsequent Slice 6/7 regression checks:

- Incident navigation remains functional.
- Valid incident renders correctly.
- Invalid incident renders the Incident not-found state.
- Lifecycle and affected-service sections remain intact.

## Out of Scope

- Investigation
- Evidence
- Findings
- Recommendations
- AI providers
- Real telemetry
- Backend persistence
- Automated actions

## Architecture / ADR

This slice established the Incident Workspace foundation. Later slices and ADR-0005/ADR-0006 extend the workspace without changing the Incident boundary.

## Freeze Criteria

The slice is considered frozen when the Incident Workspace route, incident navigation, lifecycle, service context, and invalid-incident handling remain intact under later slice regression validation.
