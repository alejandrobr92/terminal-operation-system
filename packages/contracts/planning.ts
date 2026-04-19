export type JobStatus = "Queued" | "Assigned" | "InProgress" | "Completed";

export type JobPriority = "Low" | "Medium" | "High";

export type JobIdentifier = string;

export interface Job {
  id: JobIdentifier;
  containerId: string;
  status: JobStatus;
  priority: JobPriority;
  movementId?: string;
}
