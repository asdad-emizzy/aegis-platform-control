# SCRUM_GUIDE.md

# Enterprise Operations Control Plane
## Scrum Delivery Guide

---

# Purpose

This project follows an Architecture-Driven Scrum methodology.

Unlike traditional Scrum, architecture and engineering governance are considered first-class deliverables alongside working software.

Every Sprint must contribute toward the long-term vision of building an Enterprise Operations Control Plane.

---

# Scrum Principles

This project follows these principles:

- Deliver incremental business value.
- Architecture before implementation.
- Documentation evolves with the product.
- Every Sprint produces demonstrable outcomes.
- Engineering quality is more important than feature quantity.
- AI-assisted development follows the same engineering standards as human contributors.

---

# Product Backlog

The Product Backlog is organized by **Business Capabilities**, not by technical components.

Capabilities evolve into Epics.

Epics evolve into User Stories.

Stories evolve into Tasks.

---

# Product Backlog Hierarchy

Purpose

↓

Scrum Principles

↓

Product Backlog

↓

Product Backlog Hierarchy

↓

Epic Lifecycle    ← HERE

↓

Capability Catalog

↓

Epic Naming Convention

↓

Story Naming Convention

↓

Task Naming Convention

↓

Sprint Planning

↓

Purpose

↓

Scrum Principles

↓

Product Backlog

↓

Product Backlog Hierarchy

↓

Epic Lifecycle
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
| **Idea** | New concept, opportunity, or problem to solve. |
| **Capability** | High-level business capability aligned with the product vision. |
| **Epic** | Large body of work implementing part of a capability. |
| **Sprint Planning** | Break the Epic into Stories and Tasks. |
| **Sprint** | Implement the planned Stories. |
| **Sprint Review** | Validate deliverables and gather stakeholder feedback. |
| **Release** | Publish the completed functionality. |
| **Production** | Capability becomes available to users. |
| **Operational Feedback** | Collect telemetry, incidents, user feedback, and performance data. |
| **Knowledge Base** | Convert operational learnings into ADRs, runbooks, AI knowledge, and documentation. |
| **Product Backlog** | Feed improvements and new ideas back into future planning. |

### Guiding Principle

Every completed capability should generate operational knowledge that improves future capabilities.

↓

Capability Catalog

↓

Epic Naming Convention

↓

Story Naming Convention

↓

Task Naming Convention

↓

Sprint Planning

↓

Sprint Goal

↓

Sprint Stories

↓

Daily Stand-up

↓

Sprint Review

↓

Sprint Retrospective

↓

Definition of Done

↓

Architecture Review

↓

Milestones

↓

Daily Engineering Journal

---

# Capability Catalog

The following capabilities define the long-term product roadmap.

| Capability | Description |
|------------|-------------|
| Platform Foundation | Core platform services and API |
| Observability | Enterprise observability platform |
| Inventory | Infrastructure inventory and discovery |
| Lifecycle | Platform lifecycle management |
| Recommendations | Operational recommendations |
| Automation | Workflow orchestration |
| AI Investigation | HolmesGPT integration |
| FinOps | Cost optimization |
| Governance | Compliance and policy management |
| Knowledge | Operational knowledge base |

---

# Epic Naming Convention

Format

EPIC-XXX

Example

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

---

# Story Naming Convention

Stories describe business outcomes.

Example

STORY-001

Register a Cloud Provider

STORY-002

Register a Kubernetes Cluster

STORY-003

Display Cluster Health

Avoid technical stories such as

"Create API endpoint"

Instead describe user value.

---

# Task Naming Convention

Tasks are implementation activities.

Example

TASK-001

Create Provider Interface

TASK-002

Implement AWS Provider

TASK-003

Create Cluster Repository

TASK-004

Create Health API

---

# Sprint Planning

Every Sprint begins with planning.

Planning should answer:

## Sprint Goal

Why does this Sprint exist?

What business value will it deliver?

---

## Sprint Scope

What is included?

What is excluded?

---

## Stories

List all Stories planned for the Sprint.

---

## Architecture Impact

Which architecture layers are affected?

Presentation

Platform API

Observability

Telemetry

Infrastructure

---

## ADR Impact

Does this Sprint require new Architecture Decision Records?

If yes

List them.

---

## Risks

What risks could prevent completion?

---

## Dependencies

Cloud

Infrastructure

External teams

Third-party services

---

## Definition of Ready

A Story is ready when:

- Business value is understood.
- Architecture is clear.
- Dependencies identified.
- Acceptance Criteria defined.
- No unresolved architectural questions.

---

# Sprint Goal Template

Sprint Goal

Business Objective

Expected Outcome

Business Value

Success Criteria

---

# Sprint Stories Template

| Story | Description | Status |
|--------|-------------|--------|
| STORY-001 | Register Cloud Provider | Planned |
| STORY-002 | Health Endpoint | Planned |
| STORY-003 | Provider Framework | Planned |

---

# Daily Engineering Stand-up

Every development day answers three questions.

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

At the end of every Sprint perform a review.

## Sprint Goal

Was it achieved?

---

## Completed Stories

List completed Stories.

---

## Deliverables

Code

Documentation

Architecture

ADRs

Tests

---

## Demonstration

What can be demonstrated?

---

## Architecture Changes

What changed?

---

## Technical Debt

What remains?

---

## Next Sprint

Recommended focus.

---

# Sprint Retrospective

Every Sprint ends with a retrospective.

## Keep

Practices that worked well.

---

## Improve

Practices needing improvement.

---

## Learn

New technical or architectural insights.

---

## Next

Actions to apply in the following Sprint.

---

# Definition of Done

A Story is complete when:

- Code implemented.
- Tests completed.
- Documentation updated.
- Architecture remains consistent.
- ADR updated if required.
- No critical technical debt introduced.
- Code reviewed.
- Ready for demonstration.

---

# Architecture Review

Every Sprint must answer:

Does this align with Vision?

Does this violate Principles?

Does it require an ADR?

Does it preserve provider abstraction?

Does it introduce vendor lock-in?

Does it improve operator experience?

---

# Milestones

Milestones represent major product achievements.

| Milestone | Description |
|------------|-------------|
| M0 | Foundation |
| M1 | Platform Foundation |
| M2 | Observability Foundation |
| M3 | Inventory |
| M4 | Unified Dashboard |
| M5 | Recommendation Engine |
| M6 | HolmesGPT Integration |
| M7 | Automation Framework |
| M8 | FinOps |
| M9 | Enterprise MVP |

---

# Daily Engineering Journal

At the end of every working day, create a journal entry.

Include:

- Executive Summary
- Discussions
- Decisions
- Architecture Changes
- Open Questions
- Next Actions

These journals become the engineering history of the project.

---

# Guiding Principle

Every Sprint must move the platform closer to its vision.

Architecture defines implementation.

Business value defines priorities.

Engineering excellence defines quality.