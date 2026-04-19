import type { Job } from "./planning";

type PlanningSnapshotListener = (jobs: Job[]) => void;

let planningSnapshot: Job[] = [];
const listeners = new Set<PlanningSnapshotListener>();

export function getPlanningJobSnapshot() {
  return planningSnapshot.map((job) => ({ ...job }));
}

export function setPlanningJobSnapshot(jobs: Job[]) {
  planningSnapshot = jobs.map((job) => ({ ...job }));
  const nextSnapshot = getPlanningJobSnapshot();

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
