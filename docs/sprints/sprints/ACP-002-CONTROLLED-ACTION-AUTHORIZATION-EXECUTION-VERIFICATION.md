# ACP-002 — Controlled Action, Authorization, Execution & Verification Boundaries

**Status:** Frozen
**Date:** 2026-09-04
**Type:** Architecture Checkpoint
**Related ADR:** ADR-0007

## Objective

Establish the canonical Aegis architecture for the transition from Recommendation to Controlled Action, Authorization, Execution, and Verification, before any implementation of automated/controlled operational actions begins.

## Inspection Summary

This checkpoint inspected:

- Root guidance: `AGENTS.md`, `SKILLS.md`, `FRAMEWORKS.md`, `README.md`.
- `.ai/` knowledge base: `.ai/README.md`, `.ai/DOMAIN_MODEL.md`, `.ai/COMPONENT_MODEL.md`, `.ai/PROVIDER_MODEL.md`, `.ai/VISION.md`.
- `docs/architecture/` (largely empty placeholders — unchanged, pre-existing gap) and the actively maintained `docs/sprints/architecture/` (`PROVIDER_MODEL.md`, `IMPLEMENTATION_TRACEABILITY.md`).
- ADR-0001 through ADR-0006 (`docs/ADR/` and `docs/sprints/ADR/`).
- Sprint/delivery records: `SPRINT-000.md`, `SPRINT-001.md`, `sprint-template.md`, Slice 5–9 records, ACP-001 records.
- Current implementation (read-only): `src/lib/incidents.ts`, `src/lib/investigations.ts`, `src/lib/investigation-recommendations.ts`, `src/routes/incidents/$incidentId.tsx`.

**Finding:** `FRAMEWORKS.md` §15 (Automation Framework) and §16 (Verification Framework), and `SKILLS.md` §12–13, already describe the target Recommendation → Action → Authorization → Execution → Verification → Audit shape at the product-framework level. `.ai/DOMAIN_MODEL.md` §6.6 already defines an **Automation** domain owning `Workflow, Playbook, Automation Task, Execution, Execution History`, consuming Recommendations. `.ai/PROVIDER_MODEL.md` §4.5 and `docs/sprints/architecture/PROVIDER_MODEL.md` already define an **Automation Provider** contract for executing operational actions. ACP-001's ownership table had already assigned `Automation / Action → Automation` and `Verification → Verification` as distinct owners. No canonical decision existed for: the Controlled Action data shape, where Authorization lives, whether the existing `AutomationProvider` is the "Action Provider" this checkpoint asks about, and the Agent Orchestrator's authorization constraint.

**Repository governance gap (pre-existing, not caused by this checkpoint):** ADR-0006 exists only under `docs/sprints/ADR/`, not `docs/ADR/` (breaking the mirroring pattern of ADR-0001–0005, which are identical in both locations). Two non-identical ACP-001 records exist (`docs/sprints/architecture/reviews/ACP-001.md` and `docs/sprints/sprints/ACP-001-ARCHITECTURE-CHECKPOINT.md`). These are recorded as gaps and not silently resolved by rewriting history; this checkpoint corrects the ADR mirroring gap going forward for ADR-0007 (copied to both locations) but does not retroactively edit the divergent ACP-001 records.

## Canonical Decisions (ADR-0007)

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
| Action Provider / Executor | `AutomationProvider` (existing contract — no new provider type) |
| Verification | Verification (minimal, dedicated capability — confirmed per ACP-001) |
| Auditability of this flow | Activity (existing capability, not a new Audit domain) |
| Agent Orchestrator | Coordinating control component — not a domain owner, cannot bypass Authorization |

## Agent Orchestrator Role

The Orchestrator's `Observe → Recall → Reason → Decide → Act → Observe → Reflect → Update Memory` lifecycle maps as: Observe/Recall/Reason feed Investigation; Decide may propose a Recommendation and/or Controlled Action; **Act must go through Authorization before invoking `AutomationProvider`**; post-Act Observe feeds Verification; Reflect/Update Memory may consume the Verification Result (via a future MemoryProvider, not implemented). This is a hard architectural constraint: the Orchestrator cannot authorize or execute a Controlled Action itself, regardless of which reasoning/AI provider drives it.

## Safety / Environment Model

Environment (SIT/UAT/PROD) is required context evaluated **during Authorization**, per `FRAMEWORKS.md` §24. Production Controlled Actions are expected to require stronger approval than SIT/UAT, but the specific policy engine, approval roles, and deny-condition rules are deferred to a future decision — this checkpoint establishes only that Authorization must be environment-aware.

## Failure Model

```text
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
             ├── failed       → Incident Outcome: not resolved
             └── inconclusive → Incident Outcome: requires manual review
```

`Cancelled` remains available as an operator-initiated terminal state prior to Execution completing.

## Existing Decisions That Remain Valid (Not Rewritten)

- ADR-0006 / ACP-001: Incident → Investigation → Evidence → Finding → Recommendation ownership and provider independence for `InvestigationProvider`.
- `.ai/PROVIDER_MODEL.md` Automation Provider capabilities/constraints ("Must Not — Decide whether remediation should happen").
- `.ai/DOMAIN_MODEL.md` Automation domain ownership of `Workflow, Playbook, Automation Task, Execution, Execution History`.

## Decisions Requiring Clarification (Updated, Not Rewritten)

- `docs/sprints/architecture/PROVIDER_MODEL.md` — added §7 clarifying that `AutomationProvider` is the Controlled Action's Action Provider/Executor, and a note in §5 constraining the Agent Orchestrator.
- `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md` — extended the Domain Flow and Provider Flow diagrams past Recommendation, added the ACP-002 row.

## New Architectural Decision

- **ADR-0007** — Controlled Action, Authorization, Execution and Verification Boundaries. Created under `docs/ADR/` and mirrored to `docs/sprints/ADR/` (correcting the pre-existing ADR-0006 mirroring gap going forward).

## Documentation Consistency Check

Verified no contradictions across Governance → Architecture → ADR → Domain Model → Component Model → Provider Model → Sprint Traceability:

- No duplicate domain ownership introduced (Controlled Action/Execution reuse existing `Automation`; no new "Action" domain).
- No provider leakage (no concrete automation vendor chosen; `AutomationProvider` remains the sole contract).
- Authorization boundary is explicit and precedes Execution.
- Verification boundary is explicit and distinct from Execution success.
- Agent Orchestrator explicitly cannot bypass Authorization (stated in both ADR-0007 and `docs/sprints/architecture/PROVIDER_MODEL.md`).
- Recommendation is not treated as executable; Controlled Action is not treated as a Recommendation.

No unresolved conflicts were found requiring an explicit gap listing beyond the pre-existing repository governance gaps noted above (ADR-0006 mirroring, divergent ACP-001 records), which are pre-existing and outside this checkpoint's scope to silently resolve.

## Source-Code Rule

ACP-002 does not authorize application/source-code changes. It establishes the architecture against which a future implementation slice (Slice 10) must be validated.

## Documentation Changes

- Created `docs/ADR/ADR-0007-Controlled Action Authorization Execution and Verification Boundaries.md`.
- Created `docs/sprints/ADR/ADR-0007-Controlled Action Authorization Execution and Verification Boundaries.md` (mirror).
- Updated `docs/sprints/architecture/PROVIDER_MODEL.md` (§ header, Agent Orchestrator constraint, new §7 Controlled Action / Automation Provider boundary).
- Updated `docs/sprints/architecture/IMPLEMENTATION_TRACEABILITY.md` (ACP-002 row, canonical progression, Domain Flow, Provider Flow, source-of-truth note).
- Created this checkpoint record: `docs/sprints/sprints/ACP-002-CONTROLLED-ACTION-AUTHORIZATION-EXECUTION-VERIFICATION.md`.

## Source-Code Integrity

```text
Source changes: 0
Application implementation changes: 0
```

Confirmed via `git status --short` and `git diff --name-only -- src packages` before and after this checkpoint: no file under `src/` or `packages/` was modified by this checkpoint. (Pre-existing uncommitted Slice 9 changes in `src/` predate this checkpoint and were left untouched.)

## Conflicts / Gaps (Explicitly Unresolved)

- ADR-0006 is not mirrored into `docs/ADR/` (only exists in `docs/sprints/ADR/`) — pre-existing gap, not fixed by this checkpoint (ADR-0007 itself is now mirrored correctly).
- Two non-identical ACP-001 records exist (`docs/sprints/architecture/reviews/ACP-001.md` vs. `docs/sprints/sprints/ACP-001-ARCHITECTURE-CHECKPOINT.md`) — pre-existing drift, not reconciled by this checkpoint.
- `docs/architecture/*.md` (non-sprints path) remain empty/stub placeholders — pre-existing governance gap, previously flagged by ACP-001, still open.

## Freeze Criteria

ACP-002 is frozen: ADR-0007 and the updated architecture documents consistently express the ownership, provider, authorization, and verification boundaries above, with no source-code implementation introduced as part of the checkpoint.
