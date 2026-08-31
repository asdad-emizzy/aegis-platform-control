# SKILLS.md

# Aegis Platform Control — Agent Skills

## 1. Purpose

This document defines the skills an AI agent should apply when developing, refactoring, reviewing, or extending Aegis Platform Control.

Skills describe **how the agent should work**.

They do not replace product requirements or architectural decisions.

---

# 2. OCC Product Skill

The agent must understand Aegis as an:

> **Operational Command Center**

The agent should reason in terms of:

```text
Situation
→ Context
→ Investigation
→ Decision
→ Action
→ Verification
```

When evaluating a UI change, ask:

> Does this help an operator understand or act on the operational state?

---

# 3. Existing UI Refactoring Skill

Before creating a new screen or component:

1. Search the existing repository.
2. Identify related routes.
3. Identify reusable components.
4. Identify existing mock data.
5. Determine whether the existing implementation can be enhanced.
6. Refactor only where necessary.

Preferred sequence:

```text
Inspect
→ Reuse
→ Refactor
→ Extend
→ Replace only when justified
```

---

# 4. Information Architecture Skill

The agent should recognize the target OCC structure:

```text
Overview
Incidents
Investigations
Services
Observability
Automations
Knowledge
Activity
```

Do not blindly preserve existing navigation when it conflicts with the OCC model.

Instead, map existing functionality into the new structure.

Example:

```text
Automation Jobs
    ↓
Automations

Recommendations
    ↓
Incidents / Investigations

Grafana
    ↓
Observability

Clusters
    ↓
Services / Infrastructure Context

Compatibility
    ↓
Service / Platform Context
```

---

# 5. Environment Modeling Skill

The agent must use:

```text
SIT
UAT
PROD
```

as the canonical environment model.

Environment should be treated as global operational context.

The agent should avoid duplicating UI flows for each environment.

---

# 6. Incident Modeling Skill

When designing incident functionality, consider:

```text
Detection
Severity
Impact
Environment
Affected Services
Evidence
Investigation
Findings
Recommendations
Actions
Verification
Activity
```

An incident should be a central operational object.

---

# 7. Investigation UX Skill

An investigation should clearly separate:

### Evidence

Observed information from operational systems.

### Finding

An interpretation supported by evidence.

### Hypothesis

A possible explanation that has not yet been confirmed.

### Recommendation

A proposed next step.

### Root Cause

A sufficiently supported explanation of the incident.

Never blur these concepts in the UI.

---

# 8. AI Operations Skill

When exposing AI capabilities, show:

- What the AI is doing
- What evidence it used
- What it concluded
- Confidence where meaningful
- What it recommends
- What remains uncertain

Prefer:

```text
AI Finding
Based on 12 evidence items
Confidence: Medium
```

over:

```text
AI says this is the root cause.
```

---

# 9. HolmesGPT Integration Skill

HolmesGPT should be treated as an investigation provider.

Use an abstraction such as:

```text
InvestigationProvider
```

rather than coupling UI components directly to HolmesGPT-specific APIs.

The UI may identify the active provider when useful:

```text
Investigation Provider
HolmesGPT
```

but the domain should remain provider-independent.

---

# 10. Knowledge Skill

The agent should recognize operational knowledge as a first-class investigation input.

Useful knowledge types include:

```text
Runbook
Architecture
Known Issue
Previous Incident
Service Documentation
Operational Procedure
```

Knowledge should be linked to relevant services, incidents, and investigations where possible.

---

# 11. Observability Skill

The agent should understand:

```text
Aegis = operational context/control
Grafana = observability visualization
```

Do not rebuild Grafana unnecessarily.

When adding an observability feature, determine whether the requirement is:

1. telemetry visualization,
2. operational context,
3. evidence collection,
4. investigation,
5. or action.

Put the capability in the correct layer.

---

# 12. Automation Skill

When designing actions:

```text
Recommendation
→ Approval
→ Execute
→ Observe
→ Verify
```

The agent must distinguish:

```text
Action requested
Action started
Action completed
Remediation verified
```

These are different states.

---

# 13. Verification Skill

Every meaningful remediation should have a verification concept.

For example:

```text
Action:
Scale deployment

Verification:
CPU decreased
Latency recovered
Error rate normalized
Incident resolved
```

Do not use:

```text
Automation succeeded
```

as the only indication of operational recovery.

---

# 14. Domain Modeling Skill

Prefer explicit domain objects.

Recommended starting vocabulary:

```text
Environment
Service
Incident
Investigation
Evidence
Finding
Recommendation
Automation
Verification
Activity
Knowledge
```

Infrastructure objects should be modeled separately:

```text
Cluster
Node
Pod
Deployment
AWS Resource
```

---

# 15. Component Design Skill

Create reusable components for recurring operational patterns.

Examples:

```text
EnvironmentSelector
HealthIndicator
SeverityBadge
IncidentCard
IncidentSummary
InvestigationTimeline
EvidenceItem
FindingCard
RecommendationCard
ActionPanel
VerificationStatus
ActivityTimeline
ServiceHealth
```

Do not duplicate equivalent markup across pages.

---

# 16. Routing Skill

Routes should represent user-facing capabilities.

Prefer:

```text
/incidents
/incidents/:incidentId
/investigations
/investigations/:investigationId
/services
/services/:serviceId
/observability
/automations
/knowledge
/activity
```

Avoid exposing internal provider or infrastructure implementation concepts directly in the primary URL structure unless necessary.

---

# 17. TypeScript Skill

Use strong domain types.

Prefer:

```ts
type Environment = "sit" | "uat" | "prod";
```

over:

```ts
environment: string;
```

Prefer discriminated unions where lifecycle state requires different data.

Avoid `any` unless technically unavoidable.

---

# 18. Mock Data Skill

Mock data should behave like realistic domain data.

Bad:

```ts
const cards = [
  { title: "42", subtitle: "something" }
];
```

Better:

```ts
const incidents = [
  {
    id: "INC-1024",
    environment: "prod",
    severity: "critical",
    status: "investigating",
    affectedServices: ["order-api"],
  },
];
```

The mock model should be replaceable by the future API without redesigning the UI.

---

# 19. Visual Design Skill

Preserve the existing Aegis visual language unless there is a clear reason to change it.

Favor:

- Dense but readable operational layouts
- Clear status hierarchy
- Strong typography
- Consistent spacing
- Minimal decorative UI
- Clear severity signals
- Useful whitespace
- Scannable tables
- Progressive disclosure

Avoid excessive:

- Gradients
- Decorative animations
- Marketing-style hero sections
- Large empty cards
- Dashboard clutter

The OCC is an operational tool.

---

# 20. Accessibility Skill

Operational state must not depend solely on color.

Use:

```text
Icon + Label + Color
```

for severity/status.

Interactive controls must have:

- keyboard support
- accessible labels
- visible focus states
- meaningful error messages

---

# 21. Testing Skill

For every significant feature, consider:

```text
Type checking
Build
Unit tests
Route behavior
Interaction behavior
Loading state
Error state
Empty state
Environment context
```

For critical operational workflows:

```text
Incident
→ Investigation
→ Recommendation
→ Action
→ Verification
```

should be testable as an end-to-end user journey.

---

# 22. Repository Exploration Skill

When entering an unfamiliar area:

```text
Repository
→ Route
→ Components
→ Data Model
→ Utilities
→ Dependencies
→ Tests
```

Do not modify code before understanding its surrounding dependencies.

---

# 23. Refactoring Skill

When refactoring:

### Preserve

Working behavior and reusable components.

### Extract

Shared patterns.

### Rename

Concepts whose names no longer represent the product.

### Reorganize

Routes and components that conflict with the OCC model.

### Delete

Only obsolete functionality that has been explicitly replaced or is demonstrably unnecessary.

---

# 24. Security Skill

Never:

- commit credentials
- expose API keys
- add real AWS account credentials
- place secrets in mock data
- log secrets
- put secrets in screenshots
- introduce `.env` files containing credentials

Treat a public repository as fully public.

---

# 25. Git Skill

Keep changes reviewable.

Prefer commits such as:

```text
refactor: introduce OCC environment context
refactor: reorganize OCC navigation
feat: add incident workspace
feat: add investigation experience
refactor: reposition recommendations
feat: add automation verification
```

Avoid one giant commit containing unrelated architectural changes.

---

# 26. Decision-Making Skill

When multiple options exist, evaluate:

```text
Operational value
Architectural fit
Reusability
Complexity
Future API compatibility
Provider independence
Security
Maintainability
```

Choose the smallest change that moves Aegis toward the OCC target architecture.

---

# 27. Anti-Patterns

Avoid:

```text
Dashboard-first thinking
AI-for-AI's-sake
Grafana duplication
Provider coupling
Environment duplication
Infrastructure-driven navigation
Mock-data-driven architecture
Automatic destructive actions
Unverified remediation
Premature abstraction
Premature microservices
```

---

# 28. Agent North Star

The agent should continuously ask:

> **Does this change make Aegis better at helping an operator see, understand, investigate, decide, act, and verify?**

If not, reconsider the change.
