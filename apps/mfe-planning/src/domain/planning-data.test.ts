import { describe, expect, it } from "vitest";
import {
  assignPlanningMovement,
  completePlanningJob,
  getMovementAssignments,
  getPlanningJobs,
  getPlanningSummary,
  reprioritizePlanningJob,
  sortPlanningJobs,
} from "./planning-data";

describe("planning-data", () => {
  it("sorts jobs by priority and scheduled window", () => {
    const sorted = sortPlanningJobs(getPlanningJobs());

    expect(sorted[0]?.priority).toBe("High");
    expect(sorted[0]?.id).toBe("JOB-1002");
  });

  it("reassigns movement metadata for a job", () => {
    const job = getPlanningJobs()[0];
    const nextAssignment = getMovementAssignments()[1];
    const updated = assignPlanningMovement(job, nextAssignment);

    expect(updated.movementId).toBe(nextAssignment.movementId);
    expect(updated.assignmentZone).toBe(nextAssignment.zone);
    expect(updated.status).toBe("Assigned");
  });

  it("updates summary counts after reprioritize and completion", () => {
    const jobs = getPlanningJobs();
    const updated = [
      reprioritizePlanningJob(jobs[3]),
      completePlanningJob(jobs[0]),
      jobs[1],
      jobs[2],
    ];
    const summary = getPlanningSummary(updated);

    expect(summary.completedCount).toBe(1);
    expect(summary.escalationCount).toBe(2);
  });
});
