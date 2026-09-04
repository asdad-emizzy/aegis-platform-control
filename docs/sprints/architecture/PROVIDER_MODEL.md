# Aegis Provider Model

**Status:** Canonical
**Updated:** 2026-09-04
**Architecture Checkpoint:** ACP-001

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

## 6. Implementation Constraint

Slice 8 implements the Aegis-owned TypeScript `InvestigationProvider` contract and a deterministic mock provider. Concrete external adapters, including HolmesGPT, remain separate future implementations.
