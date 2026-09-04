# ADR-0007 — Controlled Action, Authorization, Execution and Verification Boundaries

**Status:** Accepted

**Date:** 2026-09-04

**Decision Makers:** Platform Architecture Team

**Methodology:** Adaptive Solution Strategy Framework (ASSF)

**Related Documents**

* ADR-0001 — Architecture Style
* ADR-0005 — Investigation Context and Evidence Boundary
* ADR-0006 — Investigation, Finding, Recommendation and Investigation Provider Boundaries
* ACP-001 — Investigation, Finding, Recommendation & Investigation Provider Boundaries
* `.ai/DOMAIN_MODEL.md`
* `.ai/PROVIDER_MODEL.md`
* `docs/sprints/architecture/PROVIDER_MODEL.md`
* `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md`
* `FRAMEWORKS.md` (Automation Framework §15, Verification Framework §16, Activity and Audit Framework §17, Agent Orchestration Framework §11, Environment Safety Framework §24)
* `SKILLS.md` (Automation Skill §12, Verification Skill §13)

---

# Context

ADR-0006 / ACP-001 froze the Incident → Investigation → Evidence → Finding → Recommendation flow and established that a Recommendation is a proposed operational decision, not an executable action.

`FRAMEWORKS.md` already describes, at the product-framework level, what happens after a Recommendation:

```text
Recommendation
      ↓
Action Proposal
      ↓
Risk Assessment
      ↓
Authorization / Approval
      ↓
Execution
      ↓
Observation
      ↓
Verification
      ↓
Audit
```

and a minimal Action State vocabulary: `Proposed, Approved, Running, Succeeded, Failed, Cancelled, Unknown`. `SKILLS.md` independently describes the same shape (`Recommendation → Approval → Execute → Observe → Verify`) and explicitly warns that "Automation succeeded" must never be treated as the only indication of operational recovery.

The existing `.ai/DOMAIN_MODEL.md` already defines an **Automation** domain that "Consumes Recommendations" and owns `Workflow, Playbook, Automation Task, Execution, Execution History`. `.ai/PROVIDER_MODEL.md` and `docs/sprints/architecture/PROVIDER_MODEL.md` already define an **Automation Provider** (`AutomationProvider`) responsible for executing operational actions/remediation via replaceable implementations (AWS Systems Manager, Ansible, Argo Workflows, etc.), explicitly forbidden from deciding *whether* remediation should happen.

No canonical decision existed for: what object represents an approved-but-not-yet-executed action; where the authorization/approval step lives; whether Verification is part of Automation or a distinct capability; and how the Agent Orchestrator relates to authorization. This ADR resolves those gaps using the existing domain/provider vocabulary rather than inventing new ones.

---

# Problem Statement

Without an explicit decision, future implementation could:

- treat a Recommendation as automatically executable, removing the approval boundary;
- invent a new "Action" domain duplicating what `.ai/DOMAIN_MODEL.md` already calls `Automation Task`;
- create a separate "Authorization" domain/table when the product framework only requires an explicit state/decision;
- conflate Execution ("the action was attempted") with Verification ("the intended outcome occurred"), contradicting `FRAMEWORKS.md` §16 and `SKILLS.md` §13;
- let the Agent Orchestrator invoke `AutomationProvider` directly, bypassing authorization;
- couple the domain to a specific automation vendor (AWS Systems Manager, Ansible, Kubernetes, Terraform) instead of the existing `AutomationProvider` contract.

---

# Decision

## 1. Controlled Action Is the Automation Domain's Action-Proposal Object

A **Controlled Action** is the Aegis-owned representation of "an explicitly approved operation that may produce a side effect." It is owned by the existing **Automation** domain (`.ai/DOMAIN_MODEL.md` §6.6) — it is the same concept `.ai/DOMAIN_MODEL.md` already calls `Automation Task`, named `Controlled Action` in product/UI language to align with `FRAMEWORKS.md`/`SKILLS.md`. **No new domain is introduced.**

A Controlled Action:

- may reference a Recommendation by ID (optional — not every Controlled Action must originate from a Recommendation, and not every Recommendation becomes a Controlled Action);
- references the originating Incident and Investigation by ID for operational context;
- carries a target resource and action type description sufficient for an operator to understand "what will happen, where";
- never duplicates Recommendation, Finding, Evidence, or Incident content — references only.

## 2. Authorization Is a Decision State on Controlled Action, Not a Separate Domain

Authorization is **not** a separate domain object. It is a required decision/state transition recorded on the Controlled Action's lifecycle (mirroring how ADR-0006 makes Root Cause a Finding *classification* rather than a domain). The canonical lifecycle is:

```text
Recommendation (optional origin)
      ↓
Controlled Action — proposed
      ↓
Authorization decision
      ├── approved   → Controlled Action — authorized
      └── denied     → Controlled Action — authorization-denied (terminal)
      ↓
Execution (only if authorized)
      ↓
Verification
```

This satisfies `FRAMEWORKS.md`'s explicit `Authorization / Approval` step without creating a new domain purely for a named concept, consistent with this ADR's instruction to use the smallest number of domain boundaries necessary. Authorization must record: who/what approved or denied, when, and the environment context evaluated (SIT/UAT/PROD) — this record belongs to the Controlled Action's own audit trail (see §6), not a separate Authorization domain.

## 3. Execution Is Owned by Automation, via the Existing Automation Provider Contract

Execution remains owned by **Automation** (`.ai/DOMAIN_MODEL.md` §6.6 already owns `Execution`, `Execution History`). Execution is performed through the **existing** `AutomationProvider` contract (`.ai/PROVIDER_MODEL.md` §4.5, `docs/sprints/architecture/PROVIDER_MODEL.md` §3) — no new "Action Provider" type is introduced; `AutomationProvider` **is** the Action Provider/Executor referenced by this checkpoint's hypothesis flow.

```text
Controlled Action (authorized)
      ↓
AutomationProvider (existing contract)
      ↓
Provider Adapter
      ↓
AWS Systems Manager / Ansible / Argo Workflows / Kubernetes / other external system
```

Per the existing Provider Model rule (`.ai/PROVIDER_MODEL.md` §6, Automation Provider "Must Not — Decide whether remediation should happen"), `AutomationProvider` executes only what has already been authorized. It never makes the authorization decision itself.

## 4. Verification Is a Minimal, Distinct Capability — Not Part of Automation

ACP-001's ownership table already assigned `Verification` its own owner, distinct from `Automation`. This ADR formalizes that decision rather than reopening it: **Verification is a minimal, dedicated capability**, not folded into Automation, because `FRAMEWORKS.md` §16 and `SKILLS.md` §13 explicitly require that a successful Execution outcome (`Succeeded`) must not be conflated with a verified operational outcome. Execution answers "was the operation attempted/performed?"; Verification answers "does evidence confirm the intended outcome occurred?".

Verification:

- is triggered after Execution completes (regardless of Execution's own success/failure, since even a failed execution may warrant verification of blast radius);
- consumes the same Evidence-oriented sources already established for Investigation (metrics, logs, events) — it does not introduce a new telemetry integration; it reuses whatever Observability/Evidence access already exists at implementation time;
- produces a **Verification Result**: `success | failed | inconclusive` (per this checkpoint's hypothesis and `FRAMEWORKS.md` §16 example: CPU decreased, latency recovered, error rate normalized → success);
- references the Controlled Action (and transitively the Incident) by ID — it does not own or duplicate Controlled Action/Execution data.

No verification provider integration (CloudWatch, Prometheus, Kubernetes) is authorized by this ADR; Verification remains provider-independent, consistent with §7.

## 5. Auditability Belongs to Activity, Not a New Audit Domain

`FRAMEWORKS.md` §17 already defines an **Activity** capability (the per-incident operational timeline: "14:32 Incident detected … 14:44 Incident resolved") and `.ai/DOMAIN_MODEL.md`'s domain framework already lists `Activity` as a first-class sibling of Incident/Recommendation. Auditability for Recommendation → Authorization decision → Controlled Action → Execution → Verification is satisfied by recording each transition as an Activity entry.

This is distinct from the **Governance (Future)** domain's `Audit Record` (`.ai/DOMAIN_MODEL.md` §6.9), which concerns enterprise compliance/policy audit, not the per-incident operational trail. No new Audit domain is introduced by this ADR; Governance's future Audit Record remains a separate, later concern.

## 6. Agent Orchestrator Cannot Bypass Authorization

The Agent Orchestrator (`FRAMEWORKS.md` §11, `docs/sprints/architecture/PROVIDER_MODEL.md` §5) remains a coordinating control component, not a domain owner and not a provider contract. Its lifecycle (`Observe → Recall → Reason → Decide → Act → Observe → Reflect → Update Memory`) maps onto this ADR's boundaries as follows:

```text
Observe / Recall / Reason   → informs Investigation (Evidence, Finding)
Decide                      → may propose a Recommendation and/or a Controlled Action
Act                         → MUST go through Authorization before invoking AutomationProvider
Observe (post-Act)          → feeds Verification
Reflect / Update Memory     → may consume Verification Result (via a future MemoryProvider; not implemented here)
```

The Orchestrator's "Act" step is constrained: it may propose a Controlled Action, but it **must not** invoke `AutomationProvider` (directly or transitively) for a Controlled Action that has not reached the `authorized` state. This is a hard architectural constraint, not an implementation detail — it applies regardless of which reasoning/AI provider drives the Orchestrator.

## 7. Provider Independence Is Preserved

No concrete Action Provider is chosen by this ADR. `AutomationProvider` remains an Aegis-owned contract; AWS Systems Manager, Ansible, Kubernetes, Terraform, or any other execution system are adapters behind it, exactly as `.ai/PROVIDER_MODEL.md`'s MVP Provider Matrix already records (`Automation Provider | None` for Phase 1). This ADR does not change that MVP matrix — it only defines the domain-side contract shape that a future adapter must satisfy.

## 8. Failure Lifecycle (Minimum)

```text
Recommendation
   ↓ (optional)
Controlled Action — proposed
   ↓
Authorization
   ├── denied  → Controlled Action — authorization-denied (terminal)
   └── approved → Controlled Action — authorized
        ↓
     Execution
        ├── failed    → Controlled Action — execution-failed
        └── succeeded → Controlled Action — executed
             ↓
          Verification
             ├── success      → Incident Outcome: verified
             ├── failed       → Incident Outcome: not resolved (re-investigate / new Recommendation)
             └── inconclusive → Incident Outcome: requires manual review
```

`Cancelled` remains available as an operator-initiated terminal state at any point prior to Execution completing, matching `FRAMEWORKS.md`'s Action State list. No additional states are introduced.

## 9. Environment Safety Is Authorization Context, Not a New Boundary

`FRAMEWORKS.md` §24 already requires that Environment, Service, Resource, Action, and Risk be explicit for any potentially impactful action. This ADR treats environment (SIT/UAT/PROD) as **required context evaluated during Authorization**, not a separate architectural boundary. Production Controlled Actions are expected to require stronger approval (e.g. explicit human approval vs. policy-based approval), but the specific policy engine, approval roles, and deny-condition rules are **deferred** — this ADR establishes only that Authorization must be environment-aware; it does not design the policy mechanism.

---

# Canonical Architecture

```text
Incident
   ↓
Investigation
   ↓
Evidence
   ↓
Finding
   ↓
Recommendation
   ↓
Controlled Action ── proposed
   ↓
Authorization ── approved | denied
   ↓ (only if approved)
AutomationProvider (existing contract)
   ↓
Execution ── succeeded | failed
   ↓
Verification ── success | failed | inconclusive
   ↓
Incident Outcome
```

Ownership:

| Concept | Owner |
|---|---|
| Controlled Action | Automation |
| Authorization | Decision state on Controlled Action (Automation) — not a separate domain |
| Execution | Automation |
| AutomationProvider (Action Provider/Executor) | Automation (existing contract; no new provider type) |
| Verification | Verification (minimal, dedicated capability — confirmed per ACP-001) |
| Auditability of this flow | Activity (existing capability) |
| Agent Orchestrator | Coordinating control component — not a domain owner, cannot bypass Authorization |

---

# Alternatives Considered

## Authorization as a separate domain/table

**Rejected.** The product framework requires an explicit approval step, not a standalone bounded domain. Modeling it as a Controlled Action state (with an audit trail via Activity) satisfies the requirement with the smallest number of boundaries, consistent with ADR-0006's precedent for Root Cause.

## New "Action Provider" contract distinct from AutomationProvider

**Rejected.** `.ai/PROVIDER_MODEL.md` and `docs/sprints/architecture/PROVIDER_MODEL.md` already define `AutomationProvider` for exactly this responsibility ("Execute controlled actions" / "Execute workflows, Run scripts, Perform remediation"). Introducing a second contract would duplicate an existing boundary.

## Verification folded into Automation

**Rejected.** `FRAMEWORKS.md` §16 and `SKILLS.md` §13 explicitly require that Execution success and Verification success remain distinguishable. Folding Verification into Automation risks a future implementation treating `Succeeded` execution status as sufficient evidence of remediation, which the product framework explicitly forbids.

## Agent Orchestrator executes Controlled Actions directly

**Rejected.** This would let AI-driven reasoning bypass the Authorization boundary, directly contradicting this checkpoint's mandatory constraint and `FRAMEWORKS.md`'s "Controlled action over uncontrolled automation" principle (§30).

## New Audit domain

**Rejected.** `Activity` already exists as the per-incident operational trail. A dedicated compliance-grade Audit Record remains a distinct, later concern owned by the existing (Future) Governance domain — introducing a second, competing Audit concept now would create duplicate ownership.

## Verification owned by Investigation

**Rejected.** Verification evaluates the outcome of a Controlled Action, not an investigative conclusion. Placing it inside Investigation would blur "what happened" (Finding) with "did our action work" (Verification), which are different questions per this checkpoint's own framing.

---

# Consequences

## Positive

- Reuses all existing domain/provider vocabulary (`Automation`, `Automation Task`, `AutomationProvider`) — no domain proliferation.
- Preserves the Recommendation → Controlled Action boundary: a Recommendation never auto-executes.
- Makes the Agent Orchestrator's authorization constraint an explicit, checkable architectural rule rather than an implementation convention.
- Keeps Verification distinguishable from Execution, closing the "successful command ≠ successful remediation" gap called out in `FRAMEWORKS.md`/`SKILLS.md`.
- Environment (SIT/UAT/PROD) safety is explicitly tied to Authorization context without inventing a new environment-specific architecture layer.

## Trade-offs

- Authorization, being a state rather than a domain, requires the eventual Controlled Action data model to carry enough audit detail (approver, timestamp, environment evaluated) inline/via Activity rather than in a dedicated table — acceptable at this architecture stage, revisit if compliance requirements grow.
- Verification as a "minimal, dedicated capability" is intentionally under-specified (no concrete data model yet) — deferred to the implementation slice that introduces it.
- No concrete AutomationProvider adapter exists yet; this ADR only confirms the contract boundary, not an implementation.

---

# Implementation Constraints

This ADR does **not** authorize implementation of:

- Controlled Action code/data model
- Authorization logic or UI
- Execution / AutomationProvider adapter (including any concrete automation system)
- Verification code/data model
- Agent Orchestrator implementation
- Activity/audit trail implementation for this flow
- Any action/execute/remediate/approve UI controls

Those require a later implementation slice, scoped explicitly to this ADR's boundaries.

No application/source code is changed by this checkpoint.

---

# Decision Summary

```text
Automation
  owns → Controlled Action, Execution, AutomationProvider (existing contract)

Authorization
  is → a decision state on Controlled Action (not a domain)

Verification
  is → a minimal, dedicated capability (confirmed per ACP-001), distinct from Automation

Activity
  owns → auditability of this flow (existing capability, not a new Audit domain)

Agent Orchestrator
  coordinates → capabilities/providers; cannot bypass Authorization
```

**Decision:** Accepted.
