import type { ContainerSelection } from "./container";
import type { JobIdentifier, JobStatus } from "./planning";

export interface PlatformEventMap {
  containerSelected: ContainerSelection;
  jobUpdated: {
    id: JobIdentifier;
    status: JobStatus;
  };
}

export type PlatformEventName = keyof PlatformEventMap;
