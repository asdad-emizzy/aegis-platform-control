# ADR-0005 — Investigation Context and Evidence Boundary

**Status:** Accepted

**Date:** 2026-09-04

**Decision Makers:** Platform Architecture Team

**Methodology:** Adaptive Solution Strategy Framework (ASSF)

**Related Documents**

* DOMAIN_MODEL.md
* COMPONENT_MODEL.md
* PROVIDER_MODEL.md
* ADR-0001 — Architecture Style
* Slice 6 — Investigation Foundation

---

# Context

Slice 6 introduced a minimal `Investigation` boundary (`src/lib/investigations.ts`) belonging to the future **AI Investigation** domain defined in `DOMAIN_MODEL.md`. An `Investigation` answers *"what are we examining to understand this incident?"*.

Slice 7 requires representing the operational information an Investigation examines, without performing real evidence collection and without coupling the domain to any specific telemetry or AI provider.

`DOMAIN_MODEL.md` already reserves distinct terms across domains:

* `Observation` — owned by **Observability**. An Observation is telemetry-derived operational visibility (dashboards, alerts, health) produced by consuming Telemetry Providers.
* `Evidence` — owned by the future **AI Investigation** domain, alongside `Investigation`, `Root Cause`, and `AI Recommendation`.
* `Finding` — owned by **Recommendations**, not Investigation. A Finding is a conclusion produced by the Recommendation Engine after analyzing Observations.

This existing ownership matrix (`DOMAIN_MODEL.md` §8) already answers the "what is Evidence in Aegis?" question raised by Slice 7: Evidence belongs to Investigation, is distinct from Observability's Observation, and is distinct from Recommendations' Finding.

---

# Problem Statement

Without an explicit record, future contributors (human or AI) could:

* Collapse `Evidence` into `Observation`, incorrectly making Investigation depend on/duplicate Observability's model.
* Prematurely couple `Evidence` to a specific telemetry or AI provider (e.g. a Prometheus query shape or a HolmesGPT payload).
* Implement `Finding`/`Recommendation` inside the Investigation boundary, violating the Recommendations domain's ownership of `Finding`.

An explicit decision is required before introducing `Evidence` into code.

---

# Decision

Introduce **Investigation Context** as the read-only surface of an `Investigation`, composed of zero or more **Evidence** items.

```text
Incident
   ↓
Investigation
   ↓
Investigation Context (Evidence[])
   ↓
Finding            (future — owned by Recommendations, not implemented here)
   ↓
Recommendation      (future — not implemented here)
   ↓
Controlled Action   (future — not implemented here)
   ↓
Verification        (future — not implemented here)
```

## Domain rules

1. **Evidence belongs to the Investigation boundary**, not to Observability. Evidence is *referenced/curated within* an Investigation; it is not a replacement for Observability's `Observation`, which remains the canonical telemetry-derived visibility owned by the Observability domain.
2. **Evidence is a raw/contextual operational signal**, not a conclusion. It never contains an interpretation, root cause, or recommended action.
3. **Finding and Recommendation remain out of scope** for Investigation and are not implemented in this slice. When implemented, they remain owned by the Recommendations domain per the existing Ownership Matrix, and may consume Evidence as an input, mirroring how Recommendations already consumes Observations.
4. **Evidence is provider-independent.** The shape of Evidence must describe *what kind of operational signal it represents* (e.g. `metric`, `log`, `event`, `config`, `note`) and carry a plain-text `detail`, without embedding provider-specific payloads (no raw PromQL results, no CloudWatch response shapes, no HolmesGPT tool-call output). Provider adapters, when introduced, are responsible for translating provider data into this shape — that translation is out of scope for this slice.
5. **Investigation Context is 1:many with Evidence**, referenced by `investigationId`, mirroring how `Investigation` already references `Incident` via `incidentId` (Slice 6). Evidence never duplicates Investigation or Incident identity fields.
6. **This slice is read-only and mock-data driven.** No telemetry provider, AI provider, or backend integration is implemented. No Finding or Recommendation is implemented.

## Minimal shape

```ts
type EvidenceKind = "metric" | "log" | "event" | "config" | "note";

interface Evidence {
  id: string;
  investigationId: string;
  kind: EvidenceKind;
  summary: string;
  detail: string;
  observedAt?: string; // only when real mock data exists; never fabricated
}
```

---

# Alternatives Considered

## Reuse Observability's `Observation` for Investigation context

### Advantages

* Fewer new types.

### Disadvantages

* Violates `DOMAIN_MODEL.md` domain ownership (Observation is owned by Observability, not Investigation).
* Couples Investigation's future evolution to Observability's schema.

Decision: Rejected.

## Merge Evidence and Finding into one object

### Advantages

* Simpler MVP data shape.

### Disadvantages

* Violates `DOMAIN_MODEL.md` Ownership Matrix (`Finding` → Recommendations).
* Mixes raw operational signal with conclusions, making future audit/explainability harder.

Decision: Rejected.

## Couple Evidence directly to a telemetry/AI provider payload shape

### Advantages

* Less translation code when providers are eventually integrated.

### Disadvantages

* Violates ADR-0001 Principle 3/4 (external systems communicate only through Provider Contracts; business domains must never depend on vendor SDKs).

Decision: Rejected.

---

# Consequences

## Positive

* Preserves domain ownership boundaries already defined in `DOMAIN_MODEL.md`.
* Keeps Investigation provider-independent, consistent with Slice 6.
* Establishes a clear, minimal seam (`kind` + `summary`/`detail`) for future provider adapters to populate without redesign.
* Keeps Finding/Recommendation entirely out of this slice, avoiding scope creep into the Recommendations domain.

## Trade-offs

* `EvidenceKind` is intentionally coarse-grained; future provider integrations may require richer typing, which should be introduced incrementally rather than speculatively.

---

# Status

Accepted for Slice 7 — Investigation Context / Evidence Foundation.
