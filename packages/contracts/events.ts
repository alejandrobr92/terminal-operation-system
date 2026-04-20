import type { ContainerSelection } from "./container";
import type { JobIdentifier, JobStatus } from "./planning";

// This map is the single source of truth for cross-MFE event names and payload shapes.
export interface PlatformEventMap {
  containerSelected: ContainerSelection;
  jobUpdated: {
    id: JobIdentifier;
    status: JobStatus;
  };
}

export type PlatformEventName = keyof PlatformEventMap;
