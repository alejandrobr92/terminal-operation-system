import type { Job } from "@tos/contracts";
import "./App.css";

const jobs: Job[] = [
  {
    id: "JOB-1002",
    containerId: "MSCU-442109",
    status: "Queued",
    priority: "High",
    movementId: "MOVE-17",
  },
  {
    id: "JOB-1005",
    containerId: "OOLU-770341",
    status: "Assigned",
    priority: "Medium",
    movementId: "MOVE-22",
  },
  {
    id: "JOB-1014",
    containerId: "TGHU-192880",
    status: "InProgress",
    priority: "Low",
    movementId: "MOVE-31",
  },
];

function App() {
  return (
    <main className="planning-shell">
      <section className="planning-hero">
        <div>
          <p className="eyebrow">Remote: Move Planning</p>
          <h1>Dispatch planning is mounted as its own domain workspace.</h1>
        </div>
        <div className="hero-note">
          <span>Queue health</span>
          <strong>{jobs.length} active jobs</strong>
        </div>
      </section>

      <section className="planning-strip">
        <article>
          <span>Assignments ready</span>
          <strong>2</strong>
        </article>
        <article>
          <span>Priority escalations</span>
          <strong>1</strong>
        </article>
        <article>
          <span>Next shell milestone</span>
          <strong>Remote routing</strong>
        </article>
      </section>

      <section className="queue-panel">
        <div className="queue-header">
          <h2>Bootstrap queue</h2>
          <p>These records are typed through the shared planning contract package.</p>
        </div>

        <ul className="job-list">
          {jobs.map((job) => (
            <li key={job.id}>
              <div>
                <p className="job-id">{job.id}</p>
                <p className="job-meta">
                  {job.containerId} · {job.movementId}
                </p>
              </div>
              <div className="job-state">
                <span>{job.status}</span>
                <strong>{job.priority}</strong>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
