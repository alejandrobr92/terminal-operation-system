import { beforeEach, describe, expect, it } from "vitest";
import {
  getPlanningJobSnapshot,
  setPlanningJobSnapshot,
  subscribeToPlanningJobSnapshot,
} from "./planning-state";
import type { Job } from "./planning";

const seedJobs: Job[] = [
  {
    id: "JOB-1002",
    containerId: "MSCU-442109",
    status: "Queued",
    priority: "High",
    movementId: "MOVE-17",
  },
  {
    id: "JOB-1018",
    containerId: "TRHU-550781",
    status: "Completed",
    priority: "Medium",
    movementId: "MOVE-36",
  },
];

describe("planning-state", () => {
  beforeEach(() => {
    setPlanningJobSnapshot([]);
  });

  it("stores a snapshot and returns cloned jobs", () => {
    setPlanningJobSnapshot(seedJobs);

    const snapshot = getPlanningJobSnapshot();
    snapshot[0]!.status = "Completed";

    expect(getPlanningJobSnapshot()[0]?.status).toBe("Queued");
  });

  it("notifies subscribers when planning publishes a new queue snapshot", () => {
    const events: Job[][] = [];
    const unsubscribe = subscribeToPlanningJobSnapshot((jobs) => {
      events.push(jobs);
    });

    setPlanningJobSnapshot(seedJobs);
    unsubscribe();

    expect(events).toHaveLength(1);
    expect(events[0]?.[1]?.id).toBe("JOB-1018");
  });
});
