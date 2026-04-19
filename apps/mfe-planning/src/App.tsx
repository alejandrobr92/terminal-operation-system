import {
  emitPlatformEvent,
  getLastPlatformEvent,
  subscribeToPlatformEvent,
} from "@tos/contracts";
import { useEffect, useState } from "react";
import { getNextJobStatus, getPlanningJobs, type PlanningJobRecord } from "./domain/planning-data";
import "./App.css";

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    getLastPlatformEvent("containerSelected")?.id ?? null,
  );
  const [jobItems, setJobItems] = useState<PlanningJobRecord[]>(getPlanningJobs());

  useEffect(() => {
    return subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setSelectedContainerId(id);
    });
  }, []);

  const handleAdvanceJob = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    const nextStatus = getNextJobStatus(targetJob.status);

    setJobItems((currentJobs) =>
      currentJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: nextStatus,
            }
          : job,
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: nextStatus,
    });
  };

  return (
    <main className="planning-shell">
      <section className="planning-hero">
        <div>
          <p className="eyebrow">Remote: Move Planning</p>
          <h1>Dispatch planning is mounted as its own domain workspace.</h1>
        </div>
        <div className="hero-note">
          <span>Queue health</span>
          <strong>{jobItems.length} active jobs</strong>
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

      {selectedContainerId ? (
        <section className="selection-banner">
          <span>Cross-MFE signal</span>
          <strong>{selectedContainerId}</strong>
          <p>The planning queue is reacting to a container selection from yard operations.</p>
        </section>
      ) : null}

      <section className="queue-panel">
        <div className="queue-header">
          <h2>Bootstrap queue</h2>
          <p>These records are typed through the shared planning contract package.</p>
        </div>

        <ul className="job-list">
          {jobItems.map((job) => (
            <li
              key={job.id}
              className={selectedContainerId === job.containerId ? "job-item active" : "job-item"}
            >
              <div>
                <p className="job-id">{job.id}</p>
                <p className="job-meta">
                  {job.containerId} · {job.movementId}
                </p>
              </div>
              <div className="job-state">
                <span>{job.status}</span>
                <strong>{job.priority}</strong>
                <button className="job-action" onClick={() => handleAdvanceJob(job.id)} type="button">
                  Advance status
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
