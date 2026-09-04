# ADR-0006 — Investigation, Finding, Recommendation and Investigation Provider Boundaries

**Status:** Accepted

**Date:** 2026-09-04

**Decision Makers:** Platform Architecture Team

**Methodology:** Adaptive Solution Strategy Framework (ASSF)

**Related Documents**

* ADR-0001 — Architecture Style
* ADR-0005 — Investigation Context and Evidence Boundary
* docs/architecture/DOMAIN_MODEL.md
* docs/architecture/COMPONENT_MODEL.md
* docs/architecture/CONTEXT_MAP.md
* docs/architecture/ARCHITECTURE.md
* FRAMEWORKS.md
* SKILLS.md

---

# Context

Aegis has established an Incident → Investigation → Evidence foundation. The product framework already distinguishes Evidence, Finding, Hypothesis, Recommendation, and Root Cause, while the provider framework identifies HolmesGPT, Hindsight, and reasoning systems as separate replaceable capabilities.

The repository, however, contains incomplete/empty canonical architecture artifacts and conflicting ownership language. In particular, the existing ADR-0005 states that Finding is owned by Recommendations, while the product and investigation frameworks describe Finding as an investigative interpretation. The distinction must be resolved before implementation of findings, recommendations, or provider integration proceeds.

---

# Problem Statement

Without an explicit boundary, future implementation could:

- put investigative conclusions inside Recommendations;
- merge Finding and Recommendation into one model;
- treat Root Cause as a separate provider/domain object;
- couple Investigation directly to HolmesGPT;
- make Hindsight part of Investigation rather than a memory provider;
- make Agent Orchestrator responsible for domain models instead of coordination;
- expose provider-specific payloads to the domain.

---

# Decision

## 1. Investigation Owns Findings

The Investigation domain owns:

```text
Investigation
Evidence / Context
Hypothesis
Finding
Root Cause classification of a Finding
```

A Finding answers:

> What do we believe happened, based on the available evidence?

A Finding is an investigative conclusion, not a proposed action.

## 2. Recommendation Owns Recommendations

The Recommendations domain owns:

```text
Recommendation
```

A Recommendation answers:

> What should the operator consider doing?

Recommendations consume supported Findings and relevant operational context. They do not own the investigative conclusion that produced them.

## 3. Root Cause Is a Finding Classification

Root Cause is not a separate domain or provider.

It is a sufficiently supported Finding that is classified as the incident's root cause.

This avoids creating a parallel domain object solely for terminology.

## 4. InvestigationProvider Is a Capability Contract

`InvestigationProvider` is an outbound port for investigation execution.

Conceptually:

```text
Investigation
      ↓
InvestigationProvider
      ↓
Provider Adapter
      ↓
HolmesGPT / other investigation engine
```

The domain depends on the contract, not HolmesGPT.

The contract must use provider-neutral Aegis concepts. HolmesGPT-specific job IDs, tool calls, payloads, and SDK types remain inside the adapter.

## 5. HolmesGPT Is a Provider Implementation

HolmesGPT is an implementation of `InvestigationProvider`.

It is not:

- the Investigation domain;
- the Recommendation Engine;
- the Agent Orchestrator;
- the persistent memory layer.

## 6. Hindsight Is a Memory Provider

Hindsight implements a separate `MemoryProvider` capability.

```text
Investigation / Agent Orchestrator
          ↓
    MemoryProvider
          ↓
       Hindsight
```

Hindsight may supply recalled context to investigation reasoning, but it does not own Investigation.

## 7. Agent Orchestrator Is a Control Component

The Agent Orchestrator coordinates the lifecycle:

```text
Observe
 → Recall
 → Reason
 → Decide
 → Act
 → Observe
 → Reflect
 → Update Memory
```

It coordinates domain capabilities and providers. It does not become the owner of Evidence, Finding, Recommendation, or provider-specific models.

## 8. Evidence Remains Distinct from Observation

ADR-0005 remains valid on the Evidence boundary. Evidence is investigation context; Observation remains Observability-owned telemetry-derived visibility.

---

# Canonical Architecture

```text
                         Incident
                            │
                            ▼
                      Investigation
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
           Evidence     Knowledge     Hypothesis
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                         Finding
                            │
                            ▼
                     Recommendation
                            │
                            ▼
                     Controlled Action
                            │
                            ▼
                       Verification
```

Provider boundary:

```text
Investigation
      │
      ▼
InvestigationProvider
      │
      ▼
Provider Adapter
      │
      ├── HolmesGPT
      └── Future investigation providers
```

Supporting providers:

```text
MemoryProvider       → Hindsight
ReasoningProvider    → LLM / LCM
TelemetryProvider    → CloudWatch / Prometheus / other telemetry systems
```

---

# Alternatives Considered

## Finding owned by Recommendations

**Rejected.**

This makes the investigative conclusion part of the decision-support domain and contradicts the product framework's explicit distinction between Finding and Recommendation. It also makes the Investigation boundary unable to represent its own conclusions cleanly.

## Merge Finding and Recommendation

**Rejected.**

This collapses "what happened" and "what should we do" and weakens auditability, explainability, and future action controls.

## Root Cause as a separate domain

**Rejected.**

Root Cause is a classification of a sufficiently supported Finding. A separate domain is unnecessary at this stage.

## HolmesGPT as the Investigation domain

**Rejected.**

This violates provider independence and makes the business model vendor-dependent.

## Hindsight as part of Investigation

**Rejected.**

Memory is a separate capability and provider contract. Investigation may consume memory without owning the memory implementation.

## Agent Orchestrator owns all investigation artifacts

**Rejected.**

The orchestrator is a lifecycle/control mechanism. Domain ownership must remain with the appropriate capabilities.

---

# Consequences

## Positive

- Clear distinction between investigative conclusion and operational decision.
- Investigation can mature independently from Recommendation.
- HolmesGPT can be replaced without redesigning the domain.
- Hindsight can be replaced without changing Investigation.
- Agent Orchestrator can evolve without absorbing domain ownership.
- Root Cause remains simple and explainable.
- Future AI outputs can remain traceable to evidence.

## Trade-offs

- Findings and Recommendations require separate models and lifecycle semantics.
- Provider adapters require translation between external and Aegis contracts.
- A later implementation slice must define the concrete InvestigationProvider contract.
- Existing architecture documentation required correction to remove the Finding ownership conflict.

---

# Implementation Constraints

This ADR does **not** authorize implementation of:

- InvestigationProvider code
- HolmesGPT integration
- Hindsight integration
- Agent Orchestrator implementation
- Finding UI
- Recommendation redesign
- Action execution

Those require later implementation slices after this architecture checkpoint is frozen.

No application/source code is changed by this checkpoint.

---

# Decision Summary

```text
Investigation
  owns → Evidence, Hypothesis, Finding, Root Cause classification

Recommendations
  owns → Recommendation

InvestigationProvider
  contracts → investigation engines

HolmesGPT
  implements → InvestigationProvider

Hindsight
  implements → MemoryProvider

Agent Orchestrator
  coordinates → capabilities/providers and lifecycle
```

**Decision:** Accepted.
