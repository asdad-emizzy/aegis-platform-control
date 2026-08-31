# Contributing

Thank you for contributing to the Enterprise Operations Control Plane.

This project is designed as a long-term enterprise platform focused on Platform Engineering, Observability, Lifecycle Management, and Automation.

Before submitting code, please read:

- .ai/VISION.md
- .ai/PRINCIPLES.md
- .ai/ARCHITECTURE.md
- .ai/DO_NOT_BREAK.md

These documents define the architectural direction of the platform.

# AI Contribution Rules

All AI agents contributing to this repository must:

- Read `.ai/README.md` before generating code.
- Follow `.ai/VISION.md` and `.ai/PRINCIPLES.md`.
- Respect existing Architecture Decision Records (ADRs).
- Never introduce a new architectural pattern without an ADR.
- Prefer extending existing modules over creating parallel implementations.
- Keep provider integrations behind interfaces.


---

# Engineering Principles

Every contribution should follow these principles.

## 1. Architecture before Implementation

Do not implement features that conflict with the architecture.

If an implementation requires changing an architectural principle, create an ADR (Architecture Decision Record) before implementation.

---

## 2. Platform API is NOT a Telemetry Database

Platform API is responsible for:

- Inventory
- Lifecycle
- Metadata
- Operational Intelligence
- Recommendations
- Automation

Platform API must not become another Prometheus.

---

## 3. Grafana is the Visualization Layer

Do not recreate Grafana functionality inside the platform.

Use Grafana for:

- Dashboards
- Panels
- Visualization
- Alert presentation

The platform provides intelligence, not dashboards.

---

## 4. Provider Pattern

External integrations must always use providers.

Good

TelemetryProvider

InventoryProvider

CloudProvider

NotificationProvider

Avoid

AwsCloudWatchService used directly across the application.

---

## 5. Cloud Agnostic

Avoid business logic tied directly to AWS.

Provider implementations may be AWS-specific.

Business modules must remain provider-independent.

---

# Development Workflow

1. Create an Issue
2. Discuss Architecture (if required)
3. Create Feature Branch
4. Implement
5. Test
6. Update Documentation
7. Submit Pull Request

---

# Pull Request Checklist

Before opening a Pull Request:

- [ ] Builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No architectural principles violated
- [ ] Provider pattern followed
- [ ] No hardcoded cloud dependencies
- [ ] No duplicate functionality
- [ ] Code reviewed

---

# Coding Standards

## TypeScript

- Strict mode enabled
- No `any`
- Prefer interfaces
- Prefer composition over inheritance

## API

REST-first

Versioned endpoints

Consistent response models

No breaking API changes without discussion.

---

# Repository Structure

src/

modules/

providers/

shared/

packages/

docs/

.ai/

Keep business logic inside modules.

Shared utilities belong in shared/.

Cloud implementations belong in providers/.

---

# Documentation

Every major feature should include:

- Architecture notes
- API documentation
- Configuration
- Operational considerations

---

# Architecture Decisions

Significant architectural changes require an ADR.

Examples:

- New telemetry backend
- New cloud provider
- Storage changes
- Platform API responsibilities

---

# Commit Convention

feat:

fix:

refactor:

docs:

test:

chore:

ci:

---

# AI-Assisted Development

AI-generated code is welcome.

However:

- Review generated code.
- Ensure it follows project principles.
- Do not merge AI output without validation.
- Architecture takes precedence over generated implementation.

---

# Goal

Every contribution should move the platform closer to becoming the enterprise operations control plane for observability, platform lifecycle, automation, and AI-assisted operations.

