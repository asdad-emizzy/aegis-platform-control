# AI Knowledge Base

Welcome to the Enterprise Operations Control Plane AI Knowledge Base.

This directory contains the canonical engineering knowledge used by AI agents and human contributors when designing, implementing, reviewing, or modifying the platform.

Every AI assistant must treat the documents in this directory as the primary source of architectural truth before generating code.

This project is designed, governed, and evolved using the Adaptive Solution Strategy Framework (ASSF). Architectural decisions, sprint planning, and engineering governance follow ASSF principles and are continuously validated through real-world implementation.


---

# Purpose

The goal of this repository is to build an Enterprise Operations Control Plane focused on:

- Platform Engineering
- Observability
- Lifecycle Management
- Operational Intelligence
- Automation
- AI-Assisted Operations
- FinOps

This repository is architecture-driven.

Implementation must always follow the architecture—not the other way around.

---

# Reading Order

Every AI assistant should read these documents in order:

1. VISION.md
2. PRINCIPLES.md
3. ARCHITECTURE.md
4. DOMAIN_MODEL.md
5. TECH_STACK.md
6. DO_NOT_BREAK.md

Only after understanding these documents should implementation begin.

---

# Development Workflow

When implementing new functionality:

1. Understand the Vision.
2. Verify the Architecture.
3. Check existing ADRs.
4. Follow the Domain Model.
5. Implement.
6. Update documentation if architecture changes.

---

# Architecture Decisions

The canonical Architecture Decision Records (ADRs) are maintained under:

docs/ADR/

Every architectural decision should reference an accepted ADR.

If implementation conflicts with an ADR:

- do not ignore the ADR
- propose a new ADR
- update the documentation
- then modify the implementation

Architecture always takes precedence over implementation.

---

# Reference Documents

This directory contains:

- VISION.md
- PRINCIPLES.md
- ARCHITECTURE.md
- DOMAIN_MODEL.md
- TECH_STACK.md
- DO_NOT_BREAK.md

Engineering documentation is maintained under:

docs/

Architecture Decisions are maintained under:

docs/ADR/

---

# Golden Rule

The architecture defines the implementation.

The implementation must never redefine the architecture.

## AI Compatibility

This repository is designed to be consumed by multiple AI coding assistants.

Every AI should:

- Read the AI Knowledge Base before generating code.
- Follow accepted Architecture Decision Records (ADRs).
- Preserve architectural consistency.
- Avoid introducing alternative architectural patterns without an approved ADR.