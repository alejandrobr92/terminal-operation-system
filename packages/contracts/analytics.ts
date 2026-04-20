// Shared KPI contracts keep shell and analytics aligned on the same metric vocabulary.
export type KpiKey =
  | "throughput"
  | "movesPerHour"
  | "yardOccupancy"
  | "pendingJobs";

export interface KpiMetric {
  key: KpiKey;
  label: string;
  value: number;
  unit: string;
}
