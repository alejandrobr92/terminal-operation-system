## Why

The project already defines the target platform in OpenSpec, but the codebase is still at the starter-template stage and there is no active change driving implementation. A dedicated foundation change is needed now so the first build step establishes the shell, runtime integration, and communication model that every domain microfrontend depends on.

## What Changes

- Configure the shell and remote applications to integrate through Module Federation.
- Replace starter-template UIs with minimal platform-aligned placeholder screens for shell, yard, planning, and analytics.
- Add shell routing and navigation for switching between remote microfrontends.
- Establish shared frontend contracts for cross-microfrontend data exchange and events.
- Introduce an event bus implementation pattern that allows yard, planning, and analytics to communicate in a decoupled way.
- Define the initial bootstrap behavior needed to run the platform locally as a connected microfrontend system.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `architechture`: clarify the required bootstrap integration behavior for Module Federation, shared contracts, and event bus communication.
- `shell`: define the shell responsibilities for routing, remote mounting, and shared platform wiring.

## Impact

- Affects `apps/shell`, `apps/mfe-yard`, `apps/mfe-planning`, `apps/mfe-analytics`, and `packages/contracts`.
- Adds Module Federation and shared-runtime wiring across the workspace.
- Establishes the baseline integration pattern that later domain changes will build on.
