import type {
  ContainerSelection,
  Job,
  JobStatus,
  KpiMetric,
} from "@tos/contracts";

export interface AnalyticsInsight {
  title: string;
  tone: "neutral" | "attention" | "positive";
  detail: string;
}

export interface AnalyticsAlert {
  label: string;
  severity: "stable" | "watch" | "critical";
  detail: string;
}

export interface TrendMetric extends KpiMetric {
  delta: string;
  trend: "up" | "down" | "stable";
}

export interface AnalyticsSnapshot {
  alerts: AnalyticsAlert[];
  insight: AnalyticsInsight;
  metrics: TrendMetric[];
  pulseLabel: string;
}

export interface AnalyticsInput {
  containerSelection: ContainerSelection | null;
  jobs: Job[];
  lastJobUpdate: { id: string; status: JobStatus } | null;
  tick: number;
}

const baseMetrics: KpiMetric[] = [
  { key: "throughput", label: "Throughput", value: 184, unit: "moves/day" },
  { key: "movesPerHour", label: "Moves per hour", value: 27, unit: "mph" },
  { key: "yardOccupancy", label: "Yard occupancy", value: 76, unit: "%" },
  { key: "pendingJobs", label: "Pending jobs", value: 0, unit: "jobs" },
];

const analyticsSeedJobs: Job[] = [
  {
    id: "JOB-1002",
    containerId: "MSCU-442109",
    status: "Queued",
    priority: "High",
    movementId: "MOVE-17",
  },
  {
    id: "JOB-1005",
    containerId: "OOLU-770341",
    status: "Assigned",
    priority: "Medium",
    movementId: "MOVE-22",
  },
  {
    id: "JOB-1014",
    containerId: "TGHU-192880",
    status: "InProgress",
    priority: "Low",
    movementId: "MOVE-31",
  },
  {
    id: "JOB-1018",
    containerId: "TRHU-550781",
    status: "Queued",
    priority: "Medium",
    movementId: "MOVE-36",
  },
];

export function getAnalyticsSeedJobs() {
  return analyticsSeedJobs;
}

export function deriveAnalyticsSnapshot(input: AnalyticsInput): AnalyticsSnapshot {
  const activeJobs = input.jobs.filter((job) => job.status !== "Completed").length;
  const completedJobs = input.jobs.length - activeJobs;
  const assignedJobs = input.jobs.filter((job) => job.status === "Assigned").length;
  const inProgressJobs = input.jobs.filter((job) => job.status === "InProgress").length;
  const tickOffset = input.tick % 3;

  const metrics: TrendMetric[] = baseMetrics.map((metric) => {
    if (metric.key === "pendingJobs") {
      return {
        ...metric,
        value: activeJobs,
        delta: completedJobs > 0 ? `-${completedJobs} today` : "No completions yet",
        trend: completedJobs > 0 ? ("down" as const) : ("stable" as const),
      };
    }

    if (metric.key === "throughput") {
      return {
        ...metric,
        value: metric.value + completedJobs * 6 + assignedJobs + tickOffset,
        delta: `+${completedJobs * 6 + assignedJobs} vs base`,
        trend: "up" as const,
      };
    }

    if (metric.key === "movesPerHour") {
      return {
        ...metric,
        value: metric.value + inProgressJobs + tickOffset,
        delta: `${inProgressJobs} active lifts`,
        trend: inProgressJobs > 0 ? ("up" as const) : ("stable" as const),
      };
    }

    if (metric.key === "yardOccupancy") {
      const occupancyDelta = input.containerSelection ? 2 : 0;
      const value = Math.min(92, metric.value + occupancyDelta + activeJobs);
      return {
        ...metric,
        value,
        delta: input.containerSelection ? "Selection focus applied" : "Base occupancy",
        trend: value > metric.value ? ("up" as const) : ("stable" as const),
      };
    }

    return {
      ...metric,
      delta: "No change",
      trend: "stable" as const,
    };
  });

  const insight = deriveAnalyticsInsight(input, activeJobs);
  const alerts = deriveAnalyticsAlerts(input, activeJobs, inProgressJobs);
  const pulseLabel = `Refreshed on cycle ${input.tick + 1}`;

  return { alerts, insight, metrics, pulseLabel };
}

function deriveAnalyticsInsight(input: AnalyticsInput, activeJobs: number): AnalyticsInsight {
  if (input.lastJobUpdate?.status === "Completed") {
    return {
      title: "Planning completion detected",
      tone: "positive",
      detail: `${input.lastJobUpdate.id} completed. Pending workload is now ${activeJobs} jobs.`,
    };
  }

  if (input.containerSelection) {
    return {
      title: "Yard selection influencing attention",
      tone: "attention",
      detail: `Container ${input.containerSelection.id} is now the active shared context across domains.`,
    };
  }

  return {
    title: "Monitoring ready",
    tone: "neutral",
    detail: "Analytics is prepared to derive KPIs from yard and planning workflows as they become richer.",
  };
}

function deriveAnalyticsAlerts(
  input: AnalyticsInput,
  activeJobs: number,
  inProgressJobs: number,
): AnalyticsAlert[] {
  const alerts: AnalyticsAlert[] = [
    {
      label: "Queue pressure",
      severity: activeJobs >= 4 ? "watch" : "stable",
      detail: `${activeJobs} jobs remain active across planning queues.`,
    },
    {
      label: "Execution lane",
      severity: inProgressJobs >= 2 ? "watch" : "stable",
      detail: `${inProgressJobs} jobs are currently in progress.`,
    },
  ];

  if (input.lastJobUpdate?.status === "Completed") {
    alerts.unshift({
      label: "Completion signal",
      severity: "stable",
      detail: `${input.lastJobUpdate.id} completed and released capacity back to the queue.`,
    });
  } else if (input.lastJobUpdate) {
    alerts.unshift({
      label: "Planning change",
      severity: "watch",
      detail: `${input.lastJobUpdate.id} moved into ${input.lastJobUpdate.status}.`,
    });
  }

  if (input.containerSelection) {
    alerts.push({
      label: "Yard focus",
      severity: "critical",
      detail: `Container ${input.containerSelection.id} is the latest operational selection.`,
    });
  }

  return alerts.slice(0, 3);
}
