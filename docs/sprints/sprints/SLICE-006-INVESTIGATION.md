# Slice 6 — Investigation Foundation

**Status:** Frozen
**Capability:** Investigation
**Related ADR:** ADR-0005, ADR-0006

## Objective

Establish Investigation as a distinct operational concept from Incident and provide a read-only Investigation section inside the Incident Workspace.

## Implemented

The Investigation model contains:

```text
id
incidentId
status
summary
startedAt?
```

Supported mock lifecycle states:

```text
pending
active
completed
```

The repository provides one deterministic mock Investigation per current mock Incident and a lookup by `incidentId`.

The Incident Workspace displays:

- Investigation ID
- Investigation status
- Related Incident ID
- Started time when available
- Investigation summary
- Empty state when no investigation exists

## Domain Boundary

```text
Incident
   ↓
Investigation
```

Incident answers what operational problem exists. Investigation answers what is being examined to understand the incident.

Investigation is provider-independent and contains no HolmesGPT-specific job IDs, SDK types, or provider payloads.

## Validation

Subsequent regression validation confirmed:

- Investigation card renders for incidents with investigations.
- Pending/active status presentation remains functional.
- Existing Incident Workspace behavior remains intact.
- Invalid incident handling remains intact.

## Out of Scope

- Evidence collection from real providers
- Findings
- Recommendations
- HolmesGPT
- Hindsight
- Agent Orchestrator
- LLM/LCM
- Backend persistence

## Architecture / ADR

ADR-0005 records the Investigation Context / Evidence extension introduced by Slice 7. ADR-0006 records the later Investigation/Finding/Recommendation/provider boundaries.

## Freeze Criteria

The Investigation boundary and read-only workspace representation are frozen and may be extended only through a new implementation slice or an explicit architecture decision.
