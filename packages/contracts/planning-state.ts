import type { Job } from "./planning";

type PlanningSnapshotListener = (jobs: Job[]) => void;

// This snapshot complements the event bus: analytics and planning need current truth, not just the latest event.
let planningSnapshot: Job[] = [];
const listeners = new Set<PlanningSnapshotListener>();

export function getPlanningJobSnapshot() {
  // We clone on read so consumers cannot accidentally mutate the shared in-memory snapshot.
  return planningSnapshot.map((job) => ({ ...job }));
}

export function setPlanningJobSnapshot(jobs: Job[]) {
  planningSnapshot = jobs.map((job) => ({ ...job }));
  const nextSnapshot = getPlanningJobSnapshot();

  // Any mounted consumer can react immediately when planning publishes a new queue state.
  listeners.forEach((listener) => {
    listener(nextSnapshot);
  });
}

export function subscribeToPlanningJobSnapshot(listener: PlanningSnapshotListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}
