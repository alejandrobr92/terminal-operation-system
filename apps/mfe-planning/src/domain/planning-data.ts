import type { Job, JobPriority, JobStatus } from "@tos/contracts";

// This module is the planning remote's local domain layer: queue mutations and sorting rules live here.
export interface PlanningJobRecord extends Job {
  assignmentZone: string;
  assignedEquipment: string;
  scheduledWindow: string;
}

export interface MovementAssignment {
  movementId: string;
  equipment: string;
  zone: string;
}

export interface PlanningSummary {
  assignedCount: number;
  escalationCount: number;
  completedCount: number;
}

const planningJobs: PlanningJobRecord[] = [
  {
    id: "JOB-1002",
    containerId: "MSCU-442109",
    status: "Queued",
    priority: "High",
    movementId: "MOVE-17",
    assignmentZone: "Yard A",
    assignedEquipment: "RTG-04",
    scheduledWindow: "09:30",
  },
  {
    id: "JOB-1005",
    containerId: "OOLU-770341",
    status: "Assigned",
    priority: "Medium",
    movementId: "MOVE-22",
    assignmentZone: "Berth 2",
    assignedEquipment: "SH-02",
    scheduledWindow: "10:10",
  },
  {
    id: "JOB-1014",
    containerId: "TGHU-192880",
    status: "InProgress",
    priority: "Low",
    movementId: "MOVE-31",
    assignmentZone: "Customs Hold",
    assignedEquipment: "TT-11",
    scheduledWindow: "09:05",
  },
  {
    id: "JOB-1018",
    containerId: "TRHU-550781",
    status: "Queued",
    priority: "Medium",
    movementId: "MOVE-36",
    assignmentZone: "Depot Transfer",
    assignedEquipment: "TT-07",
    scheduledWindow: "10:45",
  },
];

const statusCycle: JobStatus[] = ["Queued", "Assigned", "InProgress", "Completed"];
const priorityCycle: JobPriority[] = ["Low", "Medium", "High"];

export function getPlanningJobs() {
  return planningJobs;
}

export function getMovementAssignments(): MovementAssignment[] {
  return planningJobs.map((job) => ({
    movementId: job.movementId ?? "UNASSIGNED",
    equipment: job.assignedEquipment,
    zone: job.assignmentZone,
  }));
}

export function getNextJobStatus(status: JobStatus) {
  const currentIndex = statusCycle.indexOf(status);
  return statusCycle[(currentIndex + 1) % statusCycle.length];
}

export function getNextJobPriority(priority: JobPriority) {
  const currentIndex = priorityCycle.indexOf(priority);
  return priorityCycle[(currentIndex + 1) % priorityCycle.length];
}

export function getPriorityWeight(priority: JobPriority) {
  // A simple numeric weight keeps queue ordering easy to reason about and test.
  if (priority === "High") {
    return 3;
  }

  if (priority === "Medium") {
    return 2;
  }

  return 1;
}

export function sortPlanningJobs(jobs: PlanningJobRecord[]) {
  // Priority wins first; scheduled window breaks ties to keep the queue deterministic.
  return [...jobs].sort((left, right) => {
    const priorityDelta = getPriorityWeight(right.priority) - getPriorityWeight(left.priority);
    if (priorityDelta !== 0) {
      return priorityDelta;
    }

    return left.scheduledWindow.localeCompare(right.scheduledWindow);
  });
}

export function completePlanningJob(job: PlanningJobRecord) {
  return {
    ...job,
    status: "Completed" as const,
  };
}

export function assignPlanningMovement(job: PlanningJobRecord, assignment: MovementAssignment) {
  // Assignment also advances the job into an "Assigned" state because the queue should reflect that immediately.
  return {
    ...job,
    status: "Assigned" as const,
    movementId: assignment.movementId,
    assignedEquipment: assignment.equipment,
    assignmentZone: assignment.zone,
  };
}

export function reprogramPlanningJob(job: PlanningJobRecord, scheduledWindow: string) {
  return {
    ...job,
    scheduledWindow,
  };
}

export function reprioritizePlanningJob(job: PlanningJobRecord) {
  return {
    ...job,
    priority: getNextJobPriority(job.priority),
  };
}

export function getPlanningSummary(jobs: PlanningJobRecord[]): PlanningSummary {
  // Summary cards are derived here so the UI stays mostly declarative.
  return {
    assignedCount: jobs.filter((job) => job.status === "Assigned").length,
    escalationCount: jobs.filter((job) => job.priority === "High").length,
    completedCount: jobs.filter((job) => job.status === "Completed").length,
  };
}
