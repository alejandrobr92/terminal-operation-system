import {
  emitPlatformEvent,
  getLastPlatformEvent,
  setPlanningJobSnapshot,
  subscribeToPlatformEvent,
} from "@tos/contracts";
import { useEffect, useMemo, useState } from "react";
import {
  assignPlanningMovement,
  completePlanningJob,
  getMovementAssignments,
  getNextJobStatus,
  getPlanningJobs,
  getPlanningSummary,
  reprogramPlanningJob,
  reprioritizePlanningJob,
  sortPlanningJobs,
  type PlanningJobRecord,
} from "./domain/planning-data";
import "./App.css";

function App() {
  const [selectedContainerId, setSelectedContainerId] = useState<string | null>(
    getLastPlatformEvent("containerSelected")?.id ?? null,
  );
  const [jobItems, setJobItems] = useState<PlanningJobRecord[]>(sortPlanningJobs(getPlanningJobs()));
  const movementAssignments = useMemo(() => getMovementAssignments(), []);
  const summary = useMemo(() => getPlanningSummary(jobItems), [jobItems]);

  useEffect(() => {
    return subscribeToPlatformEvent("containerSelected", ({ id }) => {
      setSelectedContainerId(id);
    });
  }, []);

  useEffect(() => {
    setPlanningJobSnapshot(jobItems);
  }, [jobItems]);

  const handleAdvanceJob = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    const nextStatus = getNextJobStatus(targetJob.status);

    setJobItems((currentJobs) =>
      sortPlanningJobs(
        currentJobs.map((job) =>
          job.id === jobId
            ? {
                ...job,
                status: nextStatus,
              }
            : job,
        ),
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: nextStatus,
    });
  };

  const handleCompleteJob = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    setJobItems((currentJobs) =>
      sortPlanningJobs(
        currentJobs.map((job) => (job.id === jobId ? completePlanningJob(job) : job)),
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: "Completed",
    });
  };

  const handleReprioritizeJob = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    const nextJob = reprioritizePlanningJob(targetJob);

    setJobItems((currentJobs) =>
      sortPlanningJobs(
        currentJobs.map((job) => (job.id === jobId ? nextJob : job)),
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: nextJob.status,
    });
  };

  const handleAssignMovement = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    const assignmentIndex = movementAssignments.findIndex(
      (assignment) => assignment.movementId === targetJob.movementId,
    );
    const nextAssignment =
      movementAssignments[(assignmentIndex + 1 + movementAssignments.length) % movementAssignments.length];
    const nextJob = assignPlanningMovement(targetJob, nextAssignment);

    setJobItems((currentJobs) =>
      sortPlanningJobs(
        currentJobs.map((job) => (job.id === jobId ? nextJob : job)),
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: nextJob.status,
    });
  };

  const handleReprogramJob = (jobId: string) => {
    const targetJob = jobItems.find((job) => job.id === jobId);
    if (!targetJob) {
      return;
    }

    const [hours, minutes] = targetJob.scheduledWindow.split(":").map(Number);
    const nextMinutes = (hours * 60 + minutes + 20) % (24 * 60);
    const nextHour = String(Math.floor(nextMinutes / 60)).padStart(2, "0");
    const nextMinute = String(nextMinutes % 60).padStart(2, "0");
    const nextJob = reprogramPlanningJob(targetJob, `${nextHour}:${nextMinute}`);

    setJobItems((currentJobs) =>
      sortPlanningJobs(
        currentJobs.map((job) => (job.id === jobId ? nextJob : job)),
      ),
    );

    emitPlatformEvent("jobUpdated", {
      id: targetJob.id,
      status: nextJob.status,
    });
  };

  return (
    <main className="planning-shell">
      <section className="planning-hero">
        <div>
          <p className="eyebrow">Remote: Move Planning</p>
          <h1>Coordinate queue assignments, movement plans, and task completion.</h1>
        </div>
        <div className="hero-note">
          <span>Queue health</span>
          <strong>{jobItems.filter((job) => job.status !== "Completed").length} active jobs</strong>
        </div>
      </section>

      <section className="planning-strip">
        <article>
          <span>Assignments ready</span>
          <strong>{summary.assignedCount}</strong>
        </article>
        <article>
          <span>Priority escalations</span>
          <strong>{summary.escalationCount}</strong>
        </article>
        <article>
          <span>Completed tasks</span>
          <strong>{summary.completedCount}</strong>
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
          <h2>Operational queue</h2>
          <p>Each job is now driven by the planning data layer and can be assigned, reprogrammed, reprioritized, or completed.</p>
        </div>

        <ul className="job-list">
          {jobItems.map((job) => (
            <li
              key={job.id}
              className={selectedContainerId === job.containerId ? "job-item active" : "job-item"}
            >
              <div className="job-copy">
                <div className="job-heading">
                  <p className="job-id">{job.id}</p>
                  <span className="job-priority">{job.priority}</span>
                </div>
                <p className="job-meta">
                  {job.containerId} · {job.movementId} · {job.assignmentZone}
                </p>
                <p className="job-detail">
                  {job.assignedEquipment} · Window {job.scheduledWindow}
                </p>
              </div>
              <div className="job-state">
                <span>{job.status}</span>
                <div className="job-actions">
                  <button className="job-action" onClick={() => handleAssignMovement(job.id)} type="button">
                    Assign move
                  </button>
                  <button className="job-action subtle" onClick={() => handleAdvanceJob(job.id)} type="button">
                    Advance
                  </button>
                  <button className="job-action subtle" onClick={() => handleReprogramJob(job.id)} type="button">
                    Reprogram
                  </button>
                  <button className="job-action subtle" onClick={() => handleReprioritizeJob(job.id)} type="button">
                    Reprioritize
                  </button>
                  <button className="job-action complete" onClick={() => handleCompleteJob(job.id)} type="button">
                    Complete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;
