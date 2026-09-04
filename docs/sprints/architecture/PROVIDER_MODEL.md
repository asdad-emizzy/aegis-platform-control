# Aegis Provider Model

**Status:** Canonical
**Updated:** 2026-09-04
**Architecture Checkpoint:** ACP-001, ACP-002

## 1. Provider Rule

Aegis external integrations follow:

```text
Capability
   ↓
Provider Contract / Port
   ↓
Provider Adapter
   ↓
External System
```

Provider contracts are Aegis-owned boundaries. Adapters translate vendor-specific schemas and behavior.

## 2. Investigation Provider

`InvestigationProvider` is the provider contract for an investigation engine.

```text
Investigation
     ↓
InvestigationProvider
     ↓
HolmesGPTAdapter
     ↓
HolmesGPT
```

The provider may return provider-neutral investigation artifacts such as Evidence references, Hypotheses, Findings, and execution metadata. Vendor payloads do not cross the adapter boundary.

## 3. Other Provider Contracts

| Contract | Purpose | Example implementation |
|---|---|---|
| InvestigationProvider | Execute/support investigation | HolmesGPT |
| MemoryProvider | Persistent memory and retrieval | Hindsight |
| ReasoningProvider | Reasoning/representation | LLM / LCM |
| TelemetryProvider | Query operational telemetry | CloudWatch / Prometheus |
| VisualizationProvider | Visualization/exploration | Grafana |
| AutomationProvider | Execute controlled actions | Future automation systems |

## 4. Provider vs Domain

Providers are implementations of capabilities. They are not domain owners.

```text
HolmesGPT       ≠ Investigation domain
Hindsight       ≠ Investigation domain
LLM / LCM       ≠ Finding domain
Grafana         ≠ Observability domain
```

The domain remains stable if a provider changes.

## 5. Agent Orchestrator

The Agent Orchestrator may invoke multiple provider contracts during an operational loop. It is not itself a provider contract and must not expose vendor-specific behavior as the domain model.

Per ACP-002 / ADR-0007, the Orchestrator's "Act" step must never invoke `AutomationProvider` for a Controlled Action that has not reached the `authorized` state. The Orchestrator may propose a Controlled Action; it cannot authorize or execute one itself.

## 6. Implementation Constraint

Slice 8 implements the Aegis-owned TypeScript `InvestigationProvider` contract and a deterministic mock provider. Concrete external adapters, including HolmesGPT, remain separate future implementations.

## 7. Controlled Action / Automation Provider Boundary (ACP-002 / ADR-0007)

`AutomationProvider` (row 3, above) is the Action Provider/Executor referenced by the Controlled Action flow established in ADR-0007 — no separate "Action Provider" contract exists.

```text
Controlled Action (authorized)
      ↓
AutomationProvider
      ↓
Provider Adapter
      ↓
AWS Systems Manager / Ansible / Argo Workflows / Kubernetes / other external system
```

`AutomationProvider` executes only Controlled Actions that have already passed Authorization. It must never decide whether an action should be authorized — this rule already existed in `.ai/PROVIDER_MODEL.md` ("Automation Provider — Must Not: Decide whether remediation should happen") and is carried over unchanged, not newly introduced by ACP-002.

No concrete `AutomationProvider` adapter is implemented by ACP-002. The MVP Provider Matrix entry (`Automation Provider | None`) remains unchanged.
