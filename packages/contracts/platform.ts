export type RemoteAppId = "yard" | "planning" | "analytics";

export type PlatformRoute = "/" | "/yard" | "/planning" | "/analytics";

export interface RemoteDefinition {
  id: RemoteAppId;
  displayName: string;
  route: PlatformRoute;
  module: string;
}
