import { describe, expect, it } from "vitest";
import { deriveAnalyticsSnapshot, getAnalyticsSeedJobs } from "./analytics-data";

describe("analytics-data", () => {
  it("derives pending jobs from the current job snapshot", () => {
    const jobs = getAnalyticsSeedJobs().map((job, index) =>
      index < 2 ? { ...job, status: "Completed" as const } : job,
    );

    const snapshot = deriveAnalyticsSnapshot({
      containerSelection: null,
      jobs,
      lastJobUpdate: { id: "JOB-1005", status: "Completed" },
      tick: 0,
    });

    const pendingJobs = snapshot.metrics.find((metric) => metric.key === "pendingJobs");

    expect(pendingJobs?.value).toBe(2);
    expect(snapshot.alerts[0]?.label).toBe("Completion signal");
  });

  it("surfaces yard selection in insight and occupancy trend", () => {
    const snapshot = deriveAnalyticsSnapshot({
      containerSelection: { id: "TRHU-550781" },
      jobs: getAnalyticsSeedJobs(),
      lastJobUpdate: null,
      tick: 2,
    });

    const yardOccupancy = snapshot.metrics.find((metric) => metric.key === "yardOccupancy");

    expect(snapshot.insight.title).toContain("Yard selection");
    expect(yardOccupancy?.trend).toBe("up");
    expect(snapshot.pulseLabel).toBe("Refreshed on cycle 3");
  });
});
