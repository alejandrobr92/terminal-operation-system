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
];

export function getAnalyticsSeedJobs() {
  return analyticsSeedJobs;
}

export function deriveAnalyticsSnapshot(input: AnalyticsInput) {
  const activeJobs = input.jobs.filter((job) => job.status !== "Completed").length;
  const completedJobs = input.jobs.length - activeJobs;
  const tickOffset = input.tick % 3;

  const metrics = baseMetrics.map((metric) => {
    if (metric.key === "pendingJobs") {
      return { ...metric, value: activeJobs };
    }

    if (metric.key === "throughput") {
      return { ...metric, value: metric.value + completedJobs * 6 + tickOffset };
    }

    if (metric.key === "movesPerHour") {
      return { ...metric, value: metric.value + completedJobs + tickOffset };
    }

    if (metric.key === "yardOccupancy") {
      const occupancyDelta = input.containerSelection ? 2 : 0;
      return { ...metric, value: Math.min(92, metric.value + occupancyDelta) };
    }

    return metric;
  });

  const insight = deriveAnalyticsInsight(input, activeJobs);

  return { metrics, insight };
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
