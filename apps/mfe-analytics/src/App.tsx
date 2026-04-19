import {
  getLastPlatformEvent,
  subscribeToPlatformEvent,
  type KpiMetric,
  type JobStatus,
} from "@tos/contracts";
import { useEffect, useMemo, useState } from "react";
import "./App.css";

const metrics: KpiMetric[] = [
  { key: "throughput", label: "Throughput", value: 184, unit: "moves/day" },
  { key: "movesPerHour", label: "Moves per hour", value: 27, unit: "mph" },
  { key: "yardOccupancy", label: "Yard occupancy", value: 76, unit: "%" },
  { key: "pendingJobs", label: "Pending jobs", value: 14, unit: "jobs" },
];

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    getLastPlatformEvent("containerSelected")?.id ?? null,
  );
  const [lastJobUpdate, setLastJobUpdate] = useState<{ id: string; status: JobStatus } | null>(
    getLastPlatformEvent("jobUpdated") ?? null,
  );
  const [pendingJobs, setPendingJobs] = useState<number>(
    metrics.find((metric) => metric.key === "pendingJobs")?.value ?? 0,
  );

  useEffect(() => {
    const unsubscribeContainer = subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setSelectedContainerId(id);
    });

    const unsubscribeJob = subscribeToPlatformEvent("jobUpdated", ({ id, status }) => {
      setLastJobUpdate({ id, status });
      setPendingJobs((current) => {
        if (status === "Completed") {
          return Math.max(0, current - 1);
        }

        return current;
      });
    });

    return () => {
      unsubscribeContainer();
      unsubscribeJob();
    };
  }, []);

  const dashboardMetrics = useMemo(
    () =>
      metrics.map((metric) =>
        metric.key === "pendingJobs" ? { ...metric, value: pendingJobs } : metric,
      ),
    [pendingJobs],
  );

  return (
    <main className="analytics-shell">
      <section className="analytics-hero">
        <div>
          <p className="eyebrow">Remote: Analytics</p>
          <h1>Operational signals are ready to aggregate in a dedicated dashboard.</h1>
        </div>
        <p className="hero-copy">
          This remote is intentionally lightweight for now, but it already speaks
          the same KPI contract surface the rest of the platform will consume.
        </p>
      </section>

      <section className="metric-grid">
        {dashboardMetrics.map((metric) => (
          <article key={metric.key} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.unit}</p>
          </article>
        ))}
      </section>

      <section className="insight-panel">
        <div>
          <h2>Bootstrap insight lane</h2>
          <p>
            {selectedContainerId
              ? `Container ${selectedContainerId} was selected in yard operations.`
              : "Waiting for a container selection from yard operations."}
          </p>
        </div>
        <div className="insight-chip">
          {lastJobUpdate
            ? `${lastJobUpdate.id} -> ${lastJobUpdate.status}`
            : "Awaiting planning status updates"}
        </div>
      </section>
    </main>
  );
}

export default App;
