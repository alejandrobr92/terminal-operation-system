import {
  getPlanningJobSnapshot,
  getLastPlatformEvent,
  subscribeToPlanningJobSnapshot,
  subscribeToPlatformEvent,
  type JobStatus,
} from "@tos/contracts";
import { useEffect, useMemo, useState } from "react";
import { deriveAnalyticsSnapshot, getAnalyticsSeedJobs } from "./domain/analytics-data";
import "./App.css";

function App() {
  const initialPlanningSnapshot = getPlanningJobSnapshot();
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    getLastPlatformEvent("containerSelected")?.id ?? null,
  );
  const [lastJobUpdate, setLastJobUpdate] = useState<{ id: string; status: JobStatus } | null>(
    getLastPlatformEvent("jobUpdated") ?? null,
  );
  const [jobSnapshots, setJobSnapshots] = useState(
    initialPlanningSnapshot.length > 0 ? initialPlanningSnapshot : getAnalyticsSeedJobs(),
  );
  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    const unsubscribeContainer = subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setSelectedContainerId(id);
    });

    const unsubscribePlanningSnapshot = subscribeToPlanningJobSnapshot((jobs) => {
      setJobSnapshots(jobs);
    });

    const unsubscribeJob = subscribeToPlatformEvent("jobUpdated", ({ id, status }) => {
      setLastJobUpdate({ id, status });
    });

    const intervalId = window.setInterval(() => {
      setRefreshTick((current) => current + 1);
    }, 2000);

    return () => {
      unsubscribeContainer();
      unsubscribePlanningSnapshot();
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
          <h1>Monitor operational throughput, queue pressure, and yard-driven signals.</h1>
        </div>
        <p className="hero-copy">
          The dashboard now derives KPI behavior from planning and yard inputs, then
          refreshes every two seconds to simulate a live operational pulse.
        </p>
        <div className="hero-pulse">{dashboardState.pulseLabel}</div>
      </section>

      <section className="metric-grid">
        {dashboardState.metrics.map((metric) => (
          <article key={metric.key} className="metric-card">
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.unit}</p>
            <div className={`metric-delta ${metric.trend}`}>{metric.delta}</div>
          </article>
        ))}
      </section>

      <section className="alert-grid">
        {dashboardState.alerts.map((alert) => (
          <article key={alert.label} className={`alert-card ${alert.severity}`}>
            <span>{alert.label}</span>
            <strong>{alert.detail}</strong>
          </article>
        ))}
      </section>

      <section className="insight-panel">
        <div className="insight-copy">
          <h2>{dashboardState.insight.title}</h2>
          <p>{dashboardState.insight.detail}</p>
        </div>
        <div className="insight-rail">
          <div className="insight-chip">
            {lastJobUpdate
              ? `${lastJobUpdate.id} -> ${lastJobUpdate.status}`
              : "Awaiting planning status updates"}
          </div>
          <div className="insight-chip subtle">
            {selectedContainerId ? `Focused container ${selectedContainerId}` : "No active yard selection"}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
