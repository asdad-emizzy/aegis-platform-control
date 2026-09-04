# ACP-001 — Investigation, Finding, Recommendation & Investigation Provider Boundaries

**Status:** Frozen
**Date:** 2026-09-04
**Type:** Architecture Checkpoint
**Related ADR:** ADR-0006

## Objective

Resolve the architectural boundaries between Investigation, Evidence, Finding, Recommendation, Root Cause, Investigation Provider, HolmesGPT, Hindsight, and Agent Orchestrator before further implementation.

## Canonical Decisions

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

Ownership:

| Concept | Owner |
|---|---|
| Incident | Incident |
| Investigation | Investigation |
| Evidence | Investigation |
| Hypothesis | Investigation |
| Finding | Investigation |
| Root Cause | Finding classification |
| Recommendation | Recommendations |
| Automation / Action | Automation |
| Verification | Verification |
| Knowledge | Knowledge |

## Provider Boundary

```text
Investigation
      ↓
InvestigationProvider
      ↓
Provider Adapter
      ↓
HolmesGPT / other investigation engine
```

Additional provider boundaries:

```text
MemoryProvider      → Hindsight
ReasoningProvider   → LLM / LCM
TelemetryProvider   → CloudWatch / Prometheus
```

The Agent Orchestrator is a coordinating control component, not a domain owner and not an Investigation Provider.

## Key Architectural Rule

Finding answers:

> What do we believe happened, based on the available evidence?

Recommendation answers:

> What should the operator consider doing?

Root Cause is not a separate domain object; it is a classification of a sufficiently supported Finding.

## Source-Code Rule

ACP-001 does not authorize application/source-code changes. It establishes the architecture against which later implementation slices must be validated.

## Validation

The checkpoint was documentation-only. The existing application implementation was inspected but not redesigned or modified by the checkpoint.

## Conditions / Repository Governance Gaps

The checkpoint identified that the repository archive did not contain the expected `.ai/` governance directory, and several architecture/ADR artifacts were incomplete or placeholders. These are documentation-governance gaps and do not change the canonical ACP-001 decision.

## Freeze Criteria

ACP-001 is frozen when ADR-0006 and the canonical architecture documents consistently express the ownership and provider boundaries above, with no source-code implementation introduced as part of the checkpoint.
