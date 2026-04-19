import type { Container, ContainerStatus } from "@tos/contracts";

export type YardEventType =
  | "Inbound"
  | "Outbound"
  | "Hold"
  | "CustomsRelease"
  | "Loading"
  | "Unloading";

export type ContainerKind = "Dry" | "Reefer" | "Hazmat" | "Empty";

export interface YardEventRecord {
  type: YardEventType;
  timestamp: string;
  note: string;
}

export interface YardContainerRecord extends Container {
  block: string;
  type: ContainerKind;
  isEmpty: boolean;
  eventSummary: string;
  events: YardEventRecord[];
}

export interface YardFilterState {
  type: ContainerKind | "All";
  status: ContainerStatus | "All";
  block: string | "All";
  location: string | "All";
  priority: number | "All";
}

const yardContainers: YardContainerRecord[] = [
  {
    id: "MSCU-442109",
    status: "INBOUND",
    location: "A1-04",
    block: "A1",
    priority: 1,
    type: "Dry",
    isEmpty: false,
    eventSummary: "Inbound gate cleared 12 min ago",
    events: [
      { type: "Inbound", timestamp: "08:12", note: "Arrived through gate north" },
      { type: "CustomsRelease", timestamp: "08:26", note: "Release confirmed for stacking" },
    ],
  },
  {
    id: "TGHU-192880",
    status: "HOLD",
    location: "B3-11",
    block: "B3",
    priority: 3,
    type: "Hazmat",
    isEmpty: false,
    eventSummary: "Hold active pending customs inspection",
    events: [
      { type: "Hold", timestamp: "07:48", note: "Inspection flag raised by customs" },
      { type: "Unloading", timestamp: "07:15", note: "Offloaded from feeder vessel" },
    ],
  },
  {
    id: "OOLU-770341",
    status: "OUTBOUND",
    location: "C2-07",
    block: "C2",
    priority: 2,
    type: "Reefer",
    isEmpty: false,
    eventSummary: "Outbound move staged for vessel loading",
    events: [
      { type: "Outbound", timestamp: "09:05", note: "Assigned to vessel outbound window" },
      { type: "Loading", timestamp: "09:22", note: "Loading slot reserved" },
    ],
  },
  {
    id: "TRHU-550781",
    status: "EMPTY",
    location: "A2-02",
    block: "A2",
    priority: 2,
    type: "Empty",
    isEmpty: true,
    eventSummary: "Empty unit waiting for repositioning",
    events: [
      { type: "Inbound", timestamp: "06:40", note: "Returned empty from truck gate" },
      { type: "CustomsRelease", timestamp: "06:55", note: "Cleared for depot repositioning" },
    ],
  },
];

export const defaultYardFilters: YardFilterState = {
  type: "All",
  status: "All",
  block: "All",
  location: "All",
  priority: "All",
};

export function getYardContainers() {
  return yardContainers;
}

export function getYardFilterOptions() {
  return {
    blocks: [...new Set(yardContainers.map((container) => container.block))],
    locations: [...new Set(yardContainers.map((container) => container.location))],
    priorities: [...new Set(yardContainers.map((container) => container.priority))].sort((a, b) => a - b),
    statuses: [...new Set(yardContainers.map((container) => container.status))],
    types: [...new Set(yardContainers.map((container) => container.type))],
  };
}

export function applyYardFilters(
  containers: YardContainerRecord[],
  filters: YardFilterState,
) {
  return containers.filter((container) => {
    return (
      (filters.type === "All" || container.type === filters.type) &&
      (filters.status === "All" || container.status === filters.status) &&
      (filters.block === "All" || container.block === filters.block) &&
      (filters.location === "All" || container.location === filters.location) &&
      (filters.priority === "All" || container.priority === filters.priority)
    );
  });
}
