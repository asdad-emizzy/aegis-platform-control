import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, FileText, Gauge, ScrollText, Settings2 } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatusBadge, statusTone } from "@/components/status-badge";
import {
  getIncidentById,
  getServicesForIncident,
  type IncidentStatus,
} from "@/lib/incidents";
import {
  getEvidenceForInvestigation,
  getFindingsForInvestigation,
  getInvestigationForIncident,
  type EvidenceKind,
  type Finding,
  type FindingClassification,
} from "@/lib/investigations";
import {
  getRecommendationsForInvestigation,
  type Recommendation,
  type RecommendationPriority,
} from "@/lib/investigation-recommendations";
import {
  getControlledActionsForInvestigation,
  type ControlledAction,
  type ControlledActionStatus,
} from "@/lib/controlled-actions";

const EVIDENCE_ICONS: Record<EvidenceKind, React.ComponentType<{ className?: string }>> = {
  metric: Gauge,
  log: ScrollText,
  event: FileText,
  config: Settings2,
  note: FileText,
};

const FINDING_CLASSIFICATION_TONE: Record<FindingClassification, "danger" | "warning" | "info"> = {
  "root-cause": "danger",
  "contributing-factor": "warning",
  observation: "info",
};

const RECOMMENDATION_PRIORITY_TONE: Record<RecommendationPriority, "danger" | "warning" | "info"> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

const CONTROLLED_ACTION_STATUS_TONE: Record<ControlledActionStatus, "warning" | "success" | "danger"> = {
  proposed: "warning",
  authorized: "success",
  "authorization-denied": "danger",
};

const LIFECYCLE_STAGES: IncidentStatus[] = ["detected", "triaged", "investigating", "resolved"];
const LIFECYCLE_ORDER: Record<IncidentStatus, number> = {
  detected: 0,
  triaged: 1,
  investigating: 2,
  resolved: 3,
};

export const Route = createFileRoute("/incidents/$incidentId")({
  loader: ({ params }) => {
    const incident = getIncidentById(params.incidentId);
    if (!incident) {
      throw notFound();
    }
    return { incident };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.incident.id ?? "Incident"} · Aegis` },
      {
        name: "description",
        content: "Operational incident workspace with lifecycle and impact context.",
      },
    ],
  }),
  component: IncidentWorkspace,
  notFoundComponent: IncidentNotFound,
});

function IncidentNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Incident not found
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This incident does not exist in the current operational record.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Back to Overview
          </Link>
        </div>
      </div>
    </div>
  );
}

function IncidentWorkspace() {
  const { incident } = Route.useLoaderData();
  const affectedServices = getServicesForIncident(incident);
  const currentStageIndex = LIFECYCLE_ORDER[incident.status];
  const investigation = getInvestigationForIncident(incident.id);
  const investigationEvidence = investigation
    ? getEvidenceForInvestigation(investigation.id)
    : [];
  const investigationFindings = investigation
    ? getFindingsForInvestigation(investigation.id)
    : [];
  const investigationRecommendations = investigation
    ? getRecommendationsForInvestigation(investigation.id)
    : [];
  const investigationControlledActions = investigation
    ? getControlledActionsForInvestigation(investigation.id)
    : [];

  return (
    <>
      <PageHeader
        kicker="Incident Workspace"
        title={`${incident.id} — ${incident.title}`}
        description={incident.impact}
        actions={
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-card hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Overview
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <DetailCard label="Environment" value={incident.environment.toUpperCase()} />
          <DetailCard
            label="Severity"
            value={<StatusBadge tone={statusTone(incident.severity)}>{incident.severity}</StatusBadge>}
          />
          <DetailCard label="Status" value={<span className="capitalize">{incident.status}</span>} />
          <DetailCard label="Detected" value={incident.detectedAt} />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-border/70 bg-card/60 lg:col-span-2">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Lifecycle</h3>
              <p className="text-xs text-muted-foreground">Current operational state</p>
            </div>
            <ol className="flex items-center gap-2 p-4">
              {LIFECYCLE_STAGES.map((stage, index) => {
                const isCurrent = stage === incident.status;
                const isPast = index < currentStageIndex;
                return (
                  <li key={stage} className="flex flex-1 items-center gap-2">
                    <div className="flex flex-col items-center gap-1.5 text-center">
                      {isPast || isCurrent ? (
                        <CheckCircle2
                          className={`h-4 w-4 ${isCurrent ? "text-primary" : "text-muted-foreground"}`}
                        />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground/40" />
                      )}
                      <span
                        className={`text-[10px] font-semibold uppercase tracking-wide ${
                          isCurrent ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {stage}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-muted-foreground">{incident.detectedAt}</span>
                      )}
                    </div>
                    {index < LIFECYCLE_STAGES.length - 1 && (
                      <span className="mb-4 h-px flex-1 bg-border/60" />
                    )}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Affected Services</h3>
            </div>
            <ul className="divide-y divide-border/60">
              {affectedServices.length === 0 && (
                <li className="px-4 py-3 text-xs text-muted-foreground">No services recorded.</li>
              )}
              {affectedServices.map((svc) => (
                <li key={svc.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="truncate text-sm font-medium">{svc.name}</span>
                  <StatusBadge tone={statusTone(svc.status)}>{svc.status}</StatusBadge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="rounded-lg border border-border/70 bg-card/60">
          <div className="border-b border-border/60 px-4 py-3">
            <h3 className="text-sm font-semibold">Investigation</h3>
            <p className="text-xs text-muted-foreground">
              What we are examining to understand this incident
            </p>
          </div>
          <div className="p-4">
            {investigation ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <DetailCard label="Investigation" value={investigation.id} />
                <DetailCard
                  label="Status"
                  value={
                    <StatusBadge tone={statusTone(investigation.status)}>
                      {investigation.status}
                    </StatusBadge>
                  }
                />
                <DetailCard label="Incident" value={investigation.incidentId} />
                <DetailCard label="Started" value={investigation.startedAt ?? "Not started"} />
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No investigation has been opened for this incident.
              </p>
            )}
            {investigation && (
              <p className="mt-4 text-sm text-muted-foreground">{investigation.summary}</p>
            )}
          </div>
        </div>

        {investigation && (
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Investigation Context</h3>
              <p className="text-xs text-muted-foreground">
                Evidence referenced by this investigation — not a conclusion
              </p>
            </div>
            <ul className="divide-y divide-border/60">
              {investigationEvidence.length === 0 && (
                <li className="px-4 py-3 text-xs text-muted-foreground">
                  No evidence recorded for this investigation.
                </li>
              )}
              {investigationEvidence.map((item) => {
                const Icon = EVIDENCE_ICONS[item.kind];
                return (
                  <li key={item.id} className="flex items-start gap-3 px-4 py-3">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{item.summary}</span>
                        <StatusBadge tone="muted" dot={false}>
                          {item.kind}
                        </StatusBadge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">{item.detail}</p>
                    </div>
                    {item.observedAt && (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {item.observedAt}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {investigation && (
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Findings</h3>
              <p className="text-xs text-muted-foreground">
                Investigative conclusions supported by evidence
              </p>
            </div>
            {investigationFindings.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted-foreground">
                No findings have been produced for this investigation yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {investigationFindings.map((finding) => (
                  <FindingItem key={finding.id} finding={finding} evidence={investigationEvidence} />
                ))}
              </ul>
            )}
          </div>
        )}

        {investigation && (
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Recommendations</h3>
              <p className="text-xs text-muted-foreground">
                Proposed operational decisions based on the findings above
              </p>
            </div>
            {investigationRecommendations.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted-foreground">
                No recommendations have been produced for this investigation yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {investigationRecommendations.map((rec) => (
                  <RecommendationItem
                    key={rec.id}
                    recommendation={rec}
                    findings={investigationFindings}
                  />
                ))}
              </ul>
            )}
          </div>
        )}

        {investigation && (
          <div className="rounded-lg border border-border/70 bg-card/60">
            <div className="border-b border-border/60 px-4 py-3">
              <h3 className="text-sm font-semibold">Controlled Actions</h3>
              <p className="text-xs text-muted-foreground">
                Proposed operations and their authorization state — read-only
              </p>
            </div>
            {investigationControlledActions.length === 0 ? (
              <p className="px-4 py-3 text-xs text-muted-foreground">
                No controlled actions have been proposed for this investigation yet.
              </p>
            ) : (
              <ul className="divide-y divide-border/60">
                {investigationControlledActions.map((action) => (
                  <ControlledActionItem key={action.id} action={action} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
}

function ControlledActionItem({ action }: { action: ControlledAction }) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-2">
        <StatusBadge tone={CONTROLLED_ACTION_STATUS_TONE[action.status]}>{action.status}</StatusBadge>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          {action.environment}
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium">
        {action.actionType} — {action.targetResource}
      </p>
      <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
        {action.recommendationId && (
          <>
            <span>From:</span>
            <span className="rounded-full border border-border/70 bg-background/40 px-1.5 py-0.5">
              {action.recommendationId}
            </span>
          </>
        )}
        {action.status === "authorized" && action.authorizedBy && (
          <span>
            Authorized by {action.authorizedBy}
            {action.decidedAt ? ` at ${action.decidedAt}` : ""}
          </span>
        )}
        {action.status === "authorization-denied" && (
          <span>
            Denied{action.authorizedBy ? ` by ${action.authorizedBy}` : ""}
            {action.decidedAt ? ` at ${action.decidedAt}` : ""}
            {action.denialReason ? ` — ${action.denialReason}` : ""}
          </span>
        )}
      </div>
    </li>
  );
}

function RecommendationItem({
  recommendation,
  findings,
}: {
  recommendation: Recommendation;
  findings: { id: string }[];
}) {
  const relatedFindingIds = recommendation.findingIds.filter((id) =>
    findings.some((f) => f.id === id),
  );

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-2">
        <StatusBadge tone={RECOMMENDATION_PRIORITY_TONE[recommendation.priority]}>
          {recommendation.priority} priority
        </StatusBadge>
        <StatusBadge tone="muted" dot={false}>
          {recommendation.status}
        </StatusBadge>
      </div>
      <p className="mt-1.5 text-sm font-medium">{recommendation.statement}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{recommendation.rationale}</p>
      {relatedFindingIds.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Based on:</span>
          {relatedFindingIds.map((id) => (
            <span
              key={id}
              className="rounded-full border border-border/70 bg-background/40 px-1.5 py-0.5"
            >
              {id}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

function FindingItem({
  finding,
  evidence,
}: {
  finding: Finding;
  evidence: { id: string; summary: string }[];
}) {
  const supportingEvidence = finding.supportingEvidenceIds
    .map((id) => evidence.find((e) => e.id === id))
    .filter((e): e is { id: string; summary: string } => Boolean(e));

  return (
    <li className="px-4 py-3">
      <div className="flex items-center gap-2">
        <StatusBadge tone={FINDING_CLASSIFICATION_TONE[finding.classification]}>
          {finding.classification}
        </StatusBadge>
        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
          Confidence {Math.round(finding.confidence * 100)}%
        </span>
      </div>
      <p className="mt-1.5 text-sm font-medium">{finding.statement}</p>
      {supportingEvidence.length > 0 && (
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Supported by:</span>
          {supportingEvidence.map((e) => (
            <span
              key={e.id}
              className="rounded-full border border-border/70 bg-background/40 px-1.5 py-0.5"
              title={e.summary}
            >
              {e.id}
            </span>
          ))}
        </div>
      )}
    </li>
  );
}

function DetailCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border/70 bg-card/60 p-4">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="mt-2 text-lg font-semibold tracking-tight">{value}</div>
    </div>
  );
}
