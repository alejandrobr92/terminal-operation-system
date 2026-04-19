export type ContainerStatus =
  | "INBOUND"
  | "OUTBOUND"
  | "HOLD"
  | "LOADED"
  | "EMPTY";

export interface Container {
  id: string;
  status: ContainerStatus;
  location: string;
  priority: number;
}

export interface ContainerSelection {
  id: Container["id"];
}
