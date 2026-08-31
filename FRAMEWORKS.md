# FRAMEWORKS.md

# Aegis Platform Control — Product, Architecture & Engineering Frameworks

## 1. Purpose

This document defines the product, architectural, domain, AI, observability, automation, and engineering frameworks governing **Aegis Platform Control**.

Aegis Platform Control is the Web App experience for the:

> **Aegis Operational Command Center (OCC)**

This document defines **what Aegis is being built toward**.

It does not define agent behavior or agent skills.

Those responsibilities belong to:

- `AGENTS.md` — agent operating instructions
- `SKILLS.md` — agent capabilities and working skills

---

# 2. Product Framework

## 2.1 Aegis Operational Command Center

Aegis is an operational command center for infrastructure and service operations.

The OCC should help an operator move through:

```text
See
 ↓
Understand
 ↓
Investigate
 ↓
Decide
 ↓
Act
 ↓
Verify
```

The product should therefore prioritize **operational outcomes** over simply displaying telemetry.

---

## 2.2 Product Positioning

Aegis is not intended to replace specialized operational systems.

The intended relationship is:

```text
┌───────────────────────────────────────┐
│             AEGIS OCC                 │
│                                       │
│ Operational context                   │
│ Incident management                   │
│ Investigation                         │
│ Decision support                      │
│ Controlled actions                    │
│ Verification                          │
└──────────────────┬────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
    Grafana    CloudWatch  Kubernetes
```

Aegis provides the **operational control and decision experience**.

Specialized systems continue to provide their native capabilities.

---

# 3. Environment Framework

Aegis operates one OCC across three environments:

```text
SIT
UAT
PROD
```

## 3.1 SIT

SIT is the initial integration and POC environment.

It is the starting operational environment for Aegis.

## 3.2 UAT

UAT is a permanent managed environment.

It represents the operational pre-production environment.

## 3.3 PROD

PROD is a permanent managed production environment.

It represents production operational state and potentially customer-impacting incidents.

---

## 3.4 Environment as Context

Environment is a global operational context.

It is not a separate application.

```text
                    AEGIS OCC
                       │
              Environment Context
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
         SIT          UAT          PROD
```

The selected environment should influence:

- Overview
- Incidents
- Investigations
- Services
- Observability
- Automations
- Knowledge
- Activity

Do not create separate OCC applications for SIT, UAT, and PROD.

---

# 4. OCC Information Architecture

The primary OCC capabilities are:

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

Settings remains a supporting administrative capability.

---

## 4.1 Overview

The Overview provides the current operational situation.

It should answer:

> **What is happening right now?**

The Overview should prioritize:

- Environment health
- Active incidents
- Service health
- Infrastructure health
- Recent operational activity
- Significant recommendations
- Investigation activity
- Automation activity

It should not become a generic collection of unrelated dashboards.

---

# 5. Incident Framework

An Incident is a first-class operational domain object.

An incident represents an operational condition requiring attention.

```text
Incident
├── Identity
├── Environment
├── Severity
├── Impact
├── Detection
├── Affected Services
├── Evidence
├── Investigation
├── Findings
├── Recommendations
├── Actions
├── Verification
└── Activity
```

---

## 5.1 Incident Lifecycle

The canonical lifecycle is:

```text
Detected
   ↓
Triaged
   ↓
Investigating
   ↓
Decision
   ↓
Action
   ↓
Verifying
   ↓
Resolved
```

The implementation may introduce additional states where necessary, but the operational progression should remain understandable.

---

# 6. Investigation Framework

Investigation is an evidence-driven capability.

The investigation workflow is:

```text
Question
   ↓
Observe
   ↓
Collect Evidence
   ↓
Correlate
   ↓
Recall Knowledge
   ↓
Reason
   ↓
Generate Findings
   ↓
Recommend
```

---

## 6.1 Investigation Evidence

Potential evidence includes:

```text
Metrics
Logs
Events
Traces
Deployments
Configuration Changes
Kubernetes State
AWS State
Service Dependencies
Previous Incidents
Runbooks
Operational Knowledge
```

Evidence should remain traceable.

---

## 6.2 Evidence vs Interpretation

Aegis must distinguish:

### Evidence

An observed fact.

### Finding

An interpretation supported by evidence.

### Hypothesis

A possible explanation that has not been confirmed.

### Recommendation

A proposed action or next step.

### Root Cause

A sufficiently supported explanation of the incident.

These concepts should not be collapsed into a single AI-generated statement.

---

# 7. Service Framework

Services represent operationally meaningful workloads or capabilities.

A service may be associated with:

```text
Service
├── Environment
├── Infrastructure
├── Dependencies
├── Health
├── Observability
├── Incidents
├── Investigations
├── Deployments
└── Actions
```

Infrastructure resources provide context for the service.

---

# 8. Infrastructure Framework

Infrastructure resources are supporting operational entities.

Examples include:

```text
EKS Cluster
Node
Pod
Deployment
AWS Resource
Load Balancer
Database
Prometheus
Grafana
CloudWatch Resource
```

Infrastructure should not automatically dictate the primary OCC information architecture.

The operator's operational problem should determine the primary experience.

---

# 9. Observability Framework

Observability provides operational evidence.

Potential sources include:

```text
CloudWatch
Prometheus
Grafana
Logs
Metrics
Traces
Events
```

The conceptual relationship is:

```text
Telemetry Sources
       ↓
Observability Systems
       ↓
Aegis Operational Context
       ↓
Investigation
       ↓
Decision
```

---

## 9.1 Grafana Relationship

Grafana remains a specialized observability visualization system.

Aegis should not attempt to recreate Grafana.

The preferred relationship is:

```text
Grafana
    │
    └── Visualization / Exploration

Aegis
    │
    └── Operational Context / Investigation / Action
```

Aegis may embed, link, or contextualize Grafana views where appropriate.

---

# 10. AI Operations Framework

AI capabilities are supporting capabilities of Aegis.

AI should improve:

- Investigation
- Correlation
- Knowledge retrieval
- Reasoning
- Recommendation
- Operational decision support

AI should not become the product's identity by itself.

---

# 11. Agent Orchestration Framework

Aegis may use an explicit Agent Orchestrator to manage operational reasoning and action loops.

The conceptual lifecycle is:

```text
Observe
   ↓
Recall
   ↓
Reason
   ↓
Decide
   ↓
Act
   ↓
Observe
   ↓
Reflect
   ↓
Update Memory
```

The Agent Orchestrator owns the agent lifecycle/state machine.

It should coordinate capabilities rather than permanently own every underlying AI implementation.

---

# 12. Provider Framework

Aegis uses provider-based architecture for replaceable capabilities.

The conceptual model is:

```text
Capability
     ↓
Provider Interface
     ↓
Provider Implementation
```

Known capabilities may include:

```text
Investigation
    └── HolmesGPT

Memory
    └── Hindsight

Knowledge
    └── Knowledge Service

Reasoning
    └── LLM / LCM
```

Providers should remain replaceable.

The Aegis domain should depend on capability contracts rather than implementation-specific behavior.

---

# 13. Knowledge Framework

Knowledge is a first-class operational capability.

Knowledge may include:

```text
Runbooks
Architecture Documentation
Service Documentation
Known Issues
Previous Incidents
Operational Procedures
Platform Standards
```

Knowledge should be retrievable as investigation context.

```text
Incident
   ↓
Investigation
   ↓
Knowledge Retrieval
   ↓
Context
   ↓
Reasoning
```

---

# 14. Recommendation Framework

A recommendation represents a proposed operational decision.

A recommendation should contain enough context for an operator to understand:

```text
What is wrong?
Why does it matter?
What evidence supports it?
What should be done?
What is the expected impact?
What is the risk?
```

A recommendation is not automatically an action.

---

# 15. Automation Framework

Automation represents controlled execution of an operational action.

The preferred lifecycle is:

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

Automation must have explicit execution state.

---

## 15.1 Action State

At minimum, distinguish:

```text
Proposed
Approved
Running
Succeeded
Failed
Cancelled
Unknown
```

Successful execution does not necessarily mean successful remediation.

---

# 16. Verification Framework

Verification determines whether an operational action achieved its intended outcome.

```text
Baseline
   ↓
Action
   ↓
Observe
   ↓
Compare
   ↓
Evaluate
   ↓
Outcome
```

Example:

```text
Action:
Scale API deployment

Verification:
CPU decreased
Latency recovered
Error rate normalized
Service recovered
Incident resolved
```

The automation engine reporting `Succeeded` is not sufficient to declare the incident resolved.

---

# 17. Activity and Audit Framework

Aegis must maintain an operational history.

Example:

```text
14:32  Incident detected
14:33  Incident triaged
14:35  Investigation started
14:37  Evidence collected
14:39  Recommendation generated
14:40  Action approved
14:40  Automation started
14:42  Automation completed
14:43  Verification completed
14:44  Incident resolved
```

Activity should provide enough context to understand:

- What happened
- When it happened
- Who or what initiated it
- What changed
- What the result was

---

# 18. Domain Framework

The core Aegis operational domain is:

```text
Environment
     │
     ├── Service
     │      │
     │      └── Observability
     │
     ├── Incident
     │      │
     │      └── Investigation
     │              │
     │              ├── Evidence
     │              ├── Knowledge
     │              └── Findings
     │
     ├── Recommendation
     │      │
     │      └── Automation
     │
     └── Activity
```

This domain model should guide the Web App's information architecture.

---

# 19. UI Architecture Framework

The Web App should use layered UI architecture.

```text
Routes
  ↓
Experience / Page
  ↓
Feature Components
  ↓
Domain Components
  ↓
Shared UI Components
```

Example:

```text
Incident Route
      ↓
Incident Workspace
      ↓
┌────────────────────────────┐
│ Incident Summary           │
│ Investigation              │
│ Evidence                   │
│ Findings                   │
│ Recommendations            │
│ Actions                    │
│ Verification               │
│ Activity                   │
└────────────────────────────┘
```

---

# 20. API Boundary Framework

The Web App should ultimately communicate through the Aegis Platform API.

```text
┌─────────────────────┐
│     Aegis Web App   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Aegis Platform API │
└──────────┬──────────┘
           │
    ┌──────┼───────────────┐
    ▼      ▼               ▼
 Incident Investigation Automation
 Service  Knowledge       Providers
```

The Web App should not become the platform orchestration layer.

---

# 21. Existing Web App Refactoring Framework

The existing Aegis Web App is the implementation baseline.

The refactoring strategy is:

```text
Existing Implementation
        ↓
Assess
        ↓
Keep
Enhance
Refactor
Add
Remove / Defer
        ↓
OCC v1
```

The project should favor evolutionary refactoring over rewriting working functionality.

---

## 21.1 Existing Capability Mapping

Existing capabilities should be repositioned where appropriate.

```text
Dashboard
    ↓
OCC Overview

Automation Jobs
    ↓
Automations

Recommendations
    ↓
Incidents / Investigations / Decision Support

Grafana
    ↓
Observability

Clusters
    ↓
Services / Infrastructure Context

Inventory
    ↓
Services / Infrastructure Context

Compatibility
    ↓
Service / Platform Context

Platform Lifecycle
    ↓
Platform Administration / Supporting Capability
```

This is a conceptual mapping, not necessarily a one-to-one route rename.

---

# 22. Information Hierarchy Framework

The OCC should prioritize information in this order:

```text
1. Operational Impact
2. Severity
3. Environment
4. Affected Services
5. Current State
6. Evidence
7. Investigation
8. Recommendation
9. Action
10. Verification
```

This hierarchy should guide screen design.

---

# 23. Dashboard Framework

The OCC Overview should answer:

> **Do I need to do something right now?**

The Overview should therefore prioritize:

```text
Active Incidents
        ↓
Service Health
        ↓
Environment Health
        ↓
Investigation Activity
        ↓
Recommendations
        ↓
Automation Activity
```

Fleet statistics should support this story rather than dominate it.

---

# 24. Environment Safety Framework

Environment context must be visually and functionally clear.

For every operational action, the operator should know:

```text
Environment
Service
Resource
Action
Risk
```

Example:

```text
PROD
Order API
Deployment/order-api
Scale replicas
Medium Risk
```

Do not allow ambiguous environment context for potentially impactful actions.

---

# 25. Security Framework

Aegis must treat credentials and secrets as external configuration.

Never store:

```text
AWS Credentials
API Keys
Tokens
Passwords
Private Keys
Secrets
```

in application source code or mock data.

The repository may be public.

Therefore:

> **Assume everything committed to the repository is publicly visible.**

---

# 26. Mock Data Framework

Mock data is permitted during the POC.

However:

> Mock data must model the intended operational domain rather than merely produce attractive dashboard visuals.

Preferred mock domain:

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

Mock data should be structured so that it can later be replaced by API responses without requiring a major UI redesign.

---

# 27. Engineering Framework

Aegis development follows:

```text
Inspect
   ↓
Model
   ↓
Implement
   ↓
Validate
   ↓
Review
   ↓
Commit
```

Changes should remain incremental and reviewable.

---

# 28. Change Classification Framework

Every significant change should be considered as one of:

```text
Feature
Refactor
Architecture
Bug Fix
UX Enhancement
Data Model Change
Integration
```

Avoid mixing unrelated changes into a single implementation slice.

---

# 29. Definition of Done

A feature or refactor is complete when:

- The intended user flow works.
- Routes are valid.
- Types are consistent.
- Existing reusable components are preserved where appropriate.
- Environment context is correct.
- Loading states are handled.
- Empty states are handled.
- Error states are handled.
- Mock data reflects the intended domain.
- No secrets are introduced.
- Tests/build validation passes where available.
- The change aligns with the OCC framework.

---

# 30. Architectural Principles

Aegis follows these principles:

## Operational over informational

The system should help operators act.

## Context over dashboards

Telemetry should be presented in operational context.

## Evidence over speculation

AI conclusions should be traceable to evidence.

## Controlled action over uncontrolled automation

Actions require explicit operational semantics.

## Verification over assumption

A successful command does not automatically mean successful remediation.

## Provider independence

AI and infrastructure providers should remain replaceable.

## Domain over technology

The product model should not be dictated by infrastructure tools.

## Evolution over rewrite

The existing Web App should be improved rather than unnecessarily replaced.

---

# 31. Aegis OCC North Star

The complete operational model is:

```text
                         AEGIS OCC
                             │
                  Environment Context
                    SIT / UAT / PROD
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
         Incidents        Services       Observability
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                       Investigation
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
           Evidence       Knowledge      AI Findings
              └──────────────┼──────────────┘
                             ▼
                       Recommendation
                             │
                             ▼
                         Automation
                             │
                             ▼
                         Verification
                             │
                             ▼
                          Activity
```

The ultimate goal is:

> **Aegis turns operational signals and knowledge into understanding, decisions, controlled actions, and verified outcomes.**
