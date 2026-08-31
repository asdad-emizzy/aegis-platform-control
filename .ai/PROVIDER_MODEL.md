# Enterprise Operations Control Plane

# Provider Model

Version: 1.0

Status: Draft

Owner: Platform Architecture

Architecture Phase: Architecture Design

Methodology: ASSF

---

# 1. Purpose

The Provider Model defines the abstraction layer between the Enterprise Operations Control Plane and external systems.

The platform never integrates directly with cloud vendors, monitoring products, AI engines, or automation tools.

Instead, every external integration is represented as a Provider Contract.

This enables:

- Multi-cloud support
- Vendor neutrality
- Extensibility
- Testability
- Long-term maintainability

---

# 2. Design Principles

## Principle 1

Business Domains must never depend directly on vendor implementations.

---

## Principle 2

Every external integration must implement a Provider Contract.

---

## Principle 3

Providers are replaceable.

Replacing AWS with Azure or Grafana with another visualization platform must not require changes to business domains.

---

## Principle 4

Provider implementations must never contain business rules.

Business rules belong to business domains.

---

## Principle 5

Providers may evolve independently.

---

# 3. Provider Architecture

                Platform API

                      │

──────────────────────────────────────────

Business Domains

Inventory

Observability

Recommendations

Knowledge

Automation

FinOps

──────────────────────────────────────────

Provider Contracts

Cloud Provider

Telemetry Provider

Visualization Provider

AI Provider

Automation Provider

Notification Provider

Identity Provider

Storage Provider

──────────────────────────────────────────

Provider Implementations

AWS

Azure

Alibaba Cloud

Google Cloud

CloudWatch

Azure Monitor

Alibaba CloudMonitor

Prometheus

Grafana

HolmesGPT

OpenAI

Ansible

AWS Systems Manager

Slack

Microsoft Teams

Email

OIDC

PostgreSQL

---

# 4. Provider Categories

## 4.1 Cloud Provider

Purpose

Provides infrastructure discovery.

Responsibilities

- Cloud Accounts
- Regions
- Networking
- Compute
- Managed Services
- Kubernetes Discovery

Examples

AWS

Azure

Alibaba Cloud

Google Cloud Platform

---

## 4.2 Telemetry Provider

Purpose

Retrieves telemetry from infrastructure.

Responsibilities

- Metrics
- Logs
- Traces
- Events

Examples

CloudWatch

Azure Monitor

Alibaba CloudMonitor

Prometheus

Grafana Alloy

OpenTelemetry Collector

---

## 4.3 Visualization Provider

Purpose

Provides operational visualization.

Responsibilities

- Dashboards
- Panels
- Datasources
- Alerts

Examples

Grafana OSS

Grafana Enterprise

AWS Managed Grafana

---

## 4.4 AI Provider

Purpose

Provides AI-assisted analysis.

Responsibilities

- Root Cause Analysis
- Recommendation Generation
- Operational Insights
- Incident Investigation

Examples

HolmesGPT

OpenAI

Azure OpenAI

Claude

Gemini

---

## 4.5 Automation Provider

Purpose

Executes operational actions.

Responsibilities

- Runbooks
- Workflows
- Remediation
- Scheduling

Examples

AWS Systems Manager

Ansible

Argo Workflows

GitHub Actions

Jenkins

---

## 4.6 Notification Provider

Purpose

Sends operational notifications.

Responsibilities

- Alerts
- Email
- ChatOps
- Incident Updates

Examples

Slack

Microsoft Teams

Email

PagerDuty

Opsgenie

---

## 4.7 Identity Provider

Purpose

Provides authentication and identity federation.

Examples

Keycloak

Azure AD

AWS IAM Identity Center

Okta

Auth0

---

## 4.8 Storage Provider

Purpose

Provides platform persistence.

Examples

PostgreSQL

Amazon RDS

Azure Database

Cloud SQL

---

# 5. Provider Ownership

| Provider | Owning Domain |
|------------|---------------|
| Cloud Provider | Inventory |
| Telemetry Provider | Observability |
| Visualization Provider | Observability |
| AI Provider | AI Investigation |
| Automation Provider | Automation |
| Notification Provider | Platform Foundation |
| Identity Provider | Platform Foundation |
| Storage Provider | Platform Foundation |

---

# 6. Provider Contracts

## Cloud Provider

Capabilities

- Discover Accounts
- Discover Clusters
- Discover Resources
- Retrieve Metadata

Must Not

- Perform business logic
- Generate recommendations
- Execute automation

---

## Telemetry Provider

Capabilities

- Retrieve Metrics
- Retrieve Logs
- Retrieve Traces
- Retrieve Events

Must Not

- Store recommendations
- Execute alerts
- Own dashboards

---

## Visualization Provider

Capabilities

- Render dashboards
- Manage datasources
- Render panels

Must Not

- Discover infrastructure
- Store business entities

---

## AI Provider

Capabilities

- Analyze context
- Generate recommendations
- Explain findings

Must Not

- Execute remediation
- Modify platform state

---

## Automation Provider

Capabilities

- Execute workflows
- Run scripts
- Perform remediation

Must Not

- Decide whether remediation should happen

---

# 7. Dependency Rules

Business Domains

↓

Provider Contracts

↓

Provider Implementations

Never

Business Domains

↓

Vendor SDK

This dependency is prohibited.

---

# 8. MVP Provider Matrix

| Category | Phase 1 Provider |
|-----------|------------------|
| Cloud Provider | AWS |
| Telemetry Provider | CloudWatch |
| Visualization Provider | Grafana OSS |
| Storage Provider | PostgreSQL |
| Identity Provider | Local Authentication |
| AI Provider | None |
| Automation Provider | None |

Future

Azure

Alibaba

GCP

HolmesGPT

AWS Systems Manager

Ansible

---

# 9. Future Evolution

Phase 1

AWS

CloudWatch

Grafana

PostgreSQL

↓

Phase 2

Grafana Alloy

Prometheus

Knowledge

Automation

↓

Phase 3

HolmesGPT

↓

Phase 4

Azure

Alibaba

GCP

↓

Phase 5

Multi-cloud Federation

---

# 10. Architecture Rules

Rule 1

Every provider implements exactly one Provider Contract.

Rule 2

Providers never communicate directly with each other.

Rule 3

Providers expose capabilities through interfaces.

Rule 4

Business Domains never depend on vendor SDKs.

Rule 5

Provider implementations are replaceable.

Rule 6

Provider registration must support runtime extensibility.

Rule 7

Every provider must expose a health endpoint.

Rule 8

Provider failures must never crash business domains.

---

# 11. References

- DOMAIN_MODEL.md
- ARCHITECTURE_STRATEGY.md
- ASR-001
