import type { KpiMetric } from "@tos/contracts";
import "./App.css";

const metrics: KpiMetric[] = [
  { key: "throughput", label: "Throughput", value: 184, unit: "moves/day" },
  { key: "movesPerHour", label: "Moves per hour", value: 27, unit: "mph" },
  { key: "yardOccupancy", label: "Yard occupancy", value: 76, unit: "%" },
  { key: "pendingJobs", label: "Pending jobs", value: 14, unit: "jobs" },
];

function App() {
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
        {metrics.map((metric) => (
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
            The next platform milestone will let this remote subscribe to yard and
            planning events instead of relying on local mock metrics.
          </p>
        </div>
        <div className="insight-chip">Awaiting shared event bus hookup</div>
      </section>
    </main>
  );
}

export default App;
