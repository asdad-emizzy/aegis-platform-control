# SCRUM_GUIDE.md

# Enterprise Operations Control Plane
## Architecture-Driven Scrum Delivery Guide
**Version:** 1.0

**Status:** Active

**Effective Date:** 2026-08-06

**Last Updated:** 2026-08-06

**Owner:** Platform Architecture

---

# Purpose

This project follows an **Architecture-Driven Scrum** methodology.

Unlike traditional Scrum, architecture, engineering governance, and operational excellence are considered first-class deliverables alongside working software.

Every Sprint must contribute toward the long-term vision of building the **Enterprise Operations Control Plane**.

---

# Scrum Principles

This project follows these engineering principles:

- Deliver incremental business value.
- Architecture before implementation.
- Documentation evolves with the product.
- Every Sprint produces demonstrable outcomes.
- Engineering quality is more important than feature quantity.
- AI-assisted development follows the same engineering standards as human contributors.

---

# Product Backlog

The Product Backlog is organized by **Business Capabilities**, not technical components.

Business Capabilities evolve into Epics.

Epics evolve into Stories.

Stories evolve into Tasks.

Tasks become implementation.

---

# Product Backlog Hierarchy

```text
Vision

↓

Roadmap

↓

Capability

↓

Epic

↓

Story

↓

Task

↓

Implementation
```

---

# Epic Lifecycle

Every capability delivered by the platform follows a standard engineering lifecycle.

```text
Idea
    │
    ▼
Capability
    │
    ▼
Epic
    │
    ▼
Sprint Planning
    │
    ▼
Architecture Strategy Review (ASR)
    │
    ▼
Architecture Design
    │
    ▼
Implementation
    │
    ▼
Sprint
    │
    ▼
Sprint Review
    │
    ▼
Release
    │
    ▼
Production
    │
    ▼
Operational Feedback
    │
    ▼
Knowledge Base
    │
    ▼
Product Backlog
```

## Lifecycle Description

| Stage | Purpose |
|--------|---------|
| Idea | Initial concept, opportunity, or problem to solve. |
| Capability | High-level business capability aligned with the product vision. |
| Epic | Large body of work implementing a capability. |
| Sprint Planning | Break the Epic into Stories and Tasks. |
| Sprint | Implement planned Stories. |
| Sprint Review | Validate Sprint Goal and completed deliverables. |
| Release | Package completed functionality into a versioned release. |
| Production | Capability becomes available to users. |
| Operational Feedback | Collect incidents, telemetry, user feedback, and operational observations. |
| Knowledge Base | Capture learnings in ADRs, AI Knowledge Base, Runbooks, and Documentation. |
| Product Backlog | Feed improvements into future planning. |

### Guiding Principle

Every completed capability should generate operational knowledge that improves future capabilities.

---

# Capability Catalog

The following capabilities define the long-term roadmap.

| Capability | Description |
|------------|-------------|
| Platform Foundation | Core platform services |
| Observability | Enterprise observability platform |
| Inventory | Infrastructure discovery and inventory |
| Lifecycle | Platform lifecycle management |
| Recommendations | Operational recommendation engine |
| Automation | Workflow automation |
| AI Investigation | HolmesGPT integration |
| FinOps | Cost optimization |
| Governance | Policies and compliance |
| Knowledge | Operational knowledge platform |

---

# Epic Naming Convention

Format

```text
EPIC-XXX
```

Examples

```text
EPIC-001 Platform Foundation

EPIC-002 Observability Foundation

EPIC-003 Inventory Engine

EPIC-004 Grafana Integration

EPIC-005 Recommendation Engine

EPIC-006 Automation Framework

EPIC-007 HolmesGPT Integration

EPIC-008 FinOps

EPIC-009 Governance

EPIC-010 Knowledge Platform
```

---

# Story Naming Convention

Stories represent business outcomes.

Examples

```text
STORY-001 Register Cloud Provider

STORY-002 Register Kubernetes Cluster

STORY-003 Display Cluster Health

STORY-004 Display Platform Dashboard
```

Avoid implementation-focused story names.

---

# Task Naming Convention

Tasks represent implementation activities.

Examples

```text
TASK-001 Create Provider Interface

TASK-002 Implement AWS Provider

TASK-003 Create Cluster Repository

TASK-004 Create Health Endpoint

TASK-005 Create Grafana Datasource Provider
```

---

# Sprint Planning

Every Sprint begins with planning.

Planning must answer the following.

---

## Sprint Goal

Why does this Sprint exist?

What business value does it deliver?

---

## Sprint Scope

### Included

Features included in this Sprint.

### Excluded

Features intentionally deferred.

---

## Stories

List Stories planned for the Sprint.

Example

| Story | Description | Status |
|--------|-------------|--------|
| STORY-001 | Register Cloud Provider | Planned |
| STORY-002 | Health Endpoint | Planned |
| STORY-003 | Provider Framework | Planned |

---

## Architecture Impact

Identify affected architecture layers.

- Presentation
- Platform API
- Observability
- Telemetry
- Infrastructure

---

## ADR Impact

Does this Sprint require new Architecture Decision Records?

List affected ADRs.

---

## Risks

List technical or business risks.

---

## Dependencies

Examples

- AWS
- Kubernetes
- Grafana
- PostgreSQL
- External Teams

---

# Definition of Ready

A Story is ready when:

- Business value is understood.
- Architecture is clear.
- Acceptance Criteria defined.
- Dependencies identified.
- No unresolved architectural questions remain.

---

# Daily Engineering Stand-up

Every working day answers three questions.

## Yesterday

What was accomplished?

---

## Today

What will be implemented?

---

## Blockers

What prevents progress?

---

# Sprint Review

Every Sprint concludes with a review.

## Sprint Goal

Was the goal achieved?

---

## Completed Stories

List completed Stories.

---

## Deliverables

- Code
- Documentation
- Tests
- Architecture
- ADRs

---

## Demonstration

What can be demonstrated?

---

## Architecture Changes

Describe architectural changes.

---

## Technical Debt

Identify remaining technical debt.

---

## Recommendation

Should the Sprint be accepted?

---

# Sprint Retrospective

Every Sprint concludes with a retrospective.

---

## Keep

Practices that worked well.

---

## Improve

Practices needing improvement.

---

## Learn

New technical, architectural, or operational insights.

---

## Next

Actions to apply in the next Sprint.

---

# Definition of Done

A Story is complete when:

- Implementation finished.
- Tests completed.
- Documentation updated.
- Architecture remains consistent.
- ADR updated (if required).
- Code reviewed.
- No critical technical debt introduced.
- Ready for demonstration.

---

# Architecture Review

Before implementation begins, answer:

- Does this align with the Vision?
- Does this follow the Principles?
- Does this require a new ADR?
- Does it preserve provider abstraction?
- Does it introduce vendor lock-in?
- Does it improve operator experience?

---

# Milestones

| Milestone | Description |
|------------|-------------|
| M0 | Foundation |
| M1 | Platform Foundation |
| M2 | Observability Foundation |
| M3 | Inventory Engine |
| M4 | Unified Dashboard |
| M5 | Recommendation Engine |
| M6 | HolmesGPT Integration |
| M7 | Automation Framework |
| M8 | FinOps |
| M9 | Enterprise MVP |

---

# Daily Engineering Journal

At the end of every working day create a journal entry.

Include:

- Executive Summary
- Major Discussions
- Decisions Made
- Architecture Changes
- ADRs Created or Updated
- Open Questions
- Risks
- Next Actions

These journals become the engineering history of the project.

---

# Sprint Completion Checklist

Before closing a Sprint, verify:

- Sprint Goal achieved
- All committed Stories completed
- Documentation updated
- ADRs updated (if applicable)
- Architecture remains consistent
- Technical debt recorded
- Sprint Review completed
- Sprint Retrospective completed
- Project roadmap updated
- Next Sprint planned

---

# Guiding Principle

Every Sprint must move the platform closer to its vision.

Business value determines priorities.

Architecture defines implementation.

Operational feedback drives continuous improvement.

Engineering excellence defines quality.