export interface Events {
  containerSelected: { id: string };
  jobUpdated: { id: string; status: string };
}
