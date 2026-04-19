import {
  getLastPlatformEvent,
  subscribeToPlatformEvent,
  type JobStatus,
} from "@tos/contracts";
import { useEffect, useMemo, useState } from "react";
import { deriveAnalyticsSnapshot, getAnalyticsSeedJobs } from "./domain/analytics-data";
import "./App.css";

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    getLastPlatformEvent("containerSelected")?.id ?? null,
  );
  const [lastJobUpdate, setLastJobUpdate] = useState<{ id: string; status: JobStatus } | null>(
    getLastPlatformEvent("jobUpdated") ?? null,
  );
  const [jobSnapshots, setJobSnapshots] = useState(getAnalyticsSeedJobs());
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const unsubscribeContainer = subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setSelectedContainerId(id);
    });

    const unsubscribeJob = subscribeToPlatformEvent("jobUpdated", ({ id, status }) => {
      setLastJobUpdate({ id, status });
      setJobSnapshots((currentJobs) =>
        currentJobs.map((job) =>
          job.id === id
            ? {
                ...job,
                status,
              }
            : job,
        ),
      );
    });

    const intervalId = window.setInterval(() => {
      setRefreshTick((current) => current + 1);
    }, 2000);

    return () => {
      unsubscribeContainer();
      unsubscribeJob();
      window.clearInterval(intervalId);
    };
  }, []);

  const dashboardState = useMemo(
    () =>
      deriveAnalyticsSnapshot({
        containerSelection: selectedContainerId ? { id: selectedContainerId } : null,
        jobs: jobSnapshots,
        lastJobUpdate,
        tick: refreshTick,
      }),
    [jobSnapshots, lastJobUpdate, refreshTick, selectedContainerId],
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
        {dashboardState.metrics.map((metric) => (
          <article key={metric.key} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.unit}</p>
          </article>
        ))}
      </section>

      <section className="insight-panel">
        <div>
          <h2>{dashboardState.insight.title}</h2>
          <p>{dashboardState.insight.detail}</p>
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
