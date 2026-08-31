# Enterprise Operations Control Plane

# Deployment Architecture

Version: 1.0

Status: Draft

Owner: Platform Architecture

Architecture Phase: Architecture Design

Methodology: ASSF

---

# 1. Purpose

This document defines the deployment architecture for the Enterprise Operations Control Plane.

The deployment architecture focuses on the Minimum Viable Platform (MVP) while ensuring future evolution toward a full enterprise platform.

This document intentionally separates logical architecture from deployment topology.

---

# 2. Deployment Principles

## Principle 1

Keep the MVP operationally simple.

---

## Principle 2

Reuse existing enterprise observability investments whenever possible.

---

## Principle 3

Cloud providers are replaceable.

---

## Principle 4

Platform API remains cloud-neutral.

---

## Principle 5

Grafana remains the visualization platform.

---

## Principle 6

Telemetry remains outside the Platform API.

---

## Principle 7

The Platform API owns operational intelligence—not telemetry storage.

---

# 3. MVP Deployment

                 Users

                   │

                   ▼

             Platform UI

                   │

                   ▼

             Platform API

                   │

          PostgreSQL Database

                   │

────────────────────────────────────

             Grafana OSS

                   │

────────────────────────────────────

Telemetry Providers

AWS CloudWatch

Existing Prometheus

Future Grafana Alloy

────────────────────────────────────

Infrastructure

AWS

EKS

ECS

RDS (Future)

---

# 4. MVP Components

## Platform UI

Deployment

Container

Runtime

Node.js

Purpose

Administrative interface.

---

## Platform API

Deployment

Container

Runtime

Node.js

Responsibilities

- Inventory
- Recommendations
- Provider Management
- Configuration
- Operational Intelligence

Does NOT store telemetry.

---

## PostgreSQL

Purpose

Application database.

Stores

- Inventory
- Recommendations
- Knowledge
- Provider Configuration
- User Settings
- Audit Records

Does NOT store metrics, logs, or traces.

---

## Grafana OSS

Purpose

Visualization platform.

Responsibilities

- Dashboards
- Datasources
- Alerts
- Operational Views

---

# 5. Telemetry Sources

The Platform does not own telemetry collection.

Telemetry is retrieved from provider implementations.

Supported MVP telemetry providers

- AWS CloudWatch
- Existing Prometheus
- Existing Kubernetes Metrics

Future

- Grafana Alloy
- Azure Monitor
- Alibaba CloudMonitor
- Google Cloud Monitoring

---

# 6. Deployment Topology

Users

↓

Platform UI

↓

Platform API

↓

PostgreSQL

↓

Grafana

↓

CloudWatch

↓

AWS

↓

EKS

---

# 7. AWS MVP

Platform UI

Amazon ECS

Platform API

Amazon ECS

PostgreSQL

Container (POC)

Future

Amazon RDS PostgreSQL

Grafana OSS

Amazon ECS

Telemetry

AWS CloudWatch

Existing Prometheus

---

# 8. EKS Integration

The Platform does not deploy inside every EKS cluster.

Primary telemetry sources

CloudWatch

Existing Prometheus

Future

Grafana Alloy DaemonSet

Purpose

Additional Kubernetes telemetry.

---

# 9. Provider Deployment

Cloud Provider

AWS

Telemetry Provider

CloudWatch

Visualization Provider

Grafana OSS

Storage Provider

PostgreSQL

Identity Provider

Platform Authentication

Future

Azure

Alibaba

Google Cloud

HolmesGPT

---

# 10. Phase Evolution

Phase 1

Platform API

Grafana OSS

PostgreSQL

CloudWatch

Existing Prometheus

AWS

---

Phase 2

Grafana Alloy

Knowledge

Automation

---

Phase 3

HolmesGPT

AI Investigation

---

Phase 4

Azure

Alibaba

GCP

---

Phase 5

Enterprise Federation

---

# 11. Deployment Rules

Rule 1

Platform API never stores telemetry.

---

Rule 2

Grafana remains the visualization platform.

---

Rule 3

Cloud providers communicate through Provider Contracts.

---

Rule 4

Telemetry providers remain external.

---

Rule 5

Business domains remain independent from infrastructure.

---

Rule 6

Deployment architecture may evolve without changing business domains.

---

# 12. Non-Goals (MVP)

The following capabilities are intentionally excluded from the MVP:

- Grafana Mimir
- Loki
- Tempo
- Pyroscope
- Distributed tracing platform
- Long-term metrics storage
- Multi-region federation
- Cross-cloud synchronization
- AI investigation
- Automated remediation
- FinOps analytics

These capabilities remain part of the long-term roadmap but are not required to validate the MVP.

---

# 13. Future Target Architecture

                 Platform UI

                      │

                 Platform API

                      │

               Provider Framework

      ┌────────────┬────────────┬────────────┐

      ▼            ▼            ▼

AWS Provider   Azure Provider   Alibaba Provider

      ▼            ▼            ▼

Telemetry Providers

CloudWatch

Azure Monitor

CloudMonitor

Prometheus

Grafana Alloy

      ▼

Grafana OSS

      ▼

HolmesGPT

      ▼

Automation

---

# References

- DOMAIN_MODEL.md
- PROVIDER_MODEL.md
- COMPONENT_MODEL.md
- ARCHITECTURE_STRATEGY.md
- ASR-001