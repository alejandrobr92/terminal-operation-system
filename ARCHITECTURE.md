# Architecture

## Overview

This repository implements a frontend-only Terminal Operation System platform using a microfrontend architecture. The system is composed of one shell application and three domain microfrontends:

- `shell`: host application and composition root
- `mfe-yard`: yard and container operations
- `mfe-planning`: move planning and job orchestration
- `mfe-analytics`: operational analytics dashboard

The current implementation focuses on delivering a challenge-ready vertical slice on top of a solid architectural foundation:

- real microfrontend separation through Module Federation
- shared typed contracts in a workspace package
- decoupled communication through a typed event bus
- runtime composition controlled by the shell
- shared planning snapshot for current-state recovery across remounts
- deployed shell and remotes on Vercel

## System Diagram

```text
                           +----------------------+
                           |        Shell         |
                           |  routing/navigation  |
                           |  remote composition  |
                           |  shared event view   |
                           +----------+-----------+
                                      |
             ---------------------------------------------------
             |                         |                       |
             v                         v                       v
  +--------------------+   +---------------------+   +----------------------+
  |  MFE Yard          |   |  MFE Planning       |   |  MFE Analytics       |
  |  containers        |   |  jobs / movements   |   |  KPIs / monitoring   |
  |  selection emits   |   |  status emits       |   |  reacts to events    |
  +---------+----------+   +----------+----------+   +----------+-----------+
            \                         |                         /
             \                        |                        /
              ------------------------------------------------
                               |
                               v
                    +------------------------+
                    |   @tos/contracts       |
                    |  shared types          |
                    |  event bus helpers     |
                    |  planning snapshot     |
                    +------------------------+
```

## Domain Boundaries

### Shell

Responsibilities:

- own route state and top-level navigation
- load remotes through Module Federation
- provide a stable application frame
- observe cross-MFE events without directly coupling domains

Non-responsibilities:

- owning yard, planning, or analytics business logic
- sharing domain state through props between MFEs

### Yard Operations

Responsibilities:

- represent yard/container-oriented UI
- emit container selection events
- own filtering, detail view, demo states, and operational container events

### Move Planning

Responsibilities:

- represent job and movement planning UI
- react to yard signals when relevant
- emit job status changes
- publish the latest queue snapshot for analytics and remount recovery

### Analytics

Responsibilities:

- represent operational KPI views
- derive insights from yard and planning signals
- react to shared events and planning snapshots rather than importing other MFEs directly

## Project Structure

```text
apps/
  shell/
  mfe-yard/
  mfe-planning/
  mfe-analytics/
packages/
  contracts/
openspec/
  specs/
  changes/
```

## Integration Strategy

The platform uses `@module-federation/vite` for runtime composition.

- each remote exposes a root module (`./App`)
- the shell consumes remotes through federation manifests
- React and React DOM are configured as shared singletons
- `@tos/contracts` is also shared so all MFEs use the same type and event surface

This creates actual architectural separation between applications instead of a single app split into folders.

## Communication Strategy

Microfrontends communicate through a shared typed event bus in `packages/contracts/event-bus.ts`.

Current event flow:

- `containerSelected`
  - emitted by `mfe-yard`
  - consumed by `shell`, `mfe-planning`, and `mfe-analytics`
- `jobUpdated`
  - emitted by `mfe-planning`
  - consumed by `shell` and `mfe-analytics`

State recovery flow:

- `mfe-planning` republishes the current queue through the shared planning snapshot helper
- `mfe-analytics` rehydrates from that snapshot on mount
- `mfe-planning` also rehydrates from the same snapshot so queue state survives shell remounts

Why this approach:

- avoids direct runtime imports between domain MFEs
- keeps payloads typed through `PlatformEventMap`
- makes cross-MFE behavior explicit and inspectable

Current limitation:

- the event bus is browser-memory based and intended for frontend composition, not distributed synchronization

## Data Strategy

The platform uses structured local mock data inside dedicated domain modules for each MFE. This keeps the solution frontend-only while still separating UI from data access and derivation logic.

Current approach:

- `mfe-yard` owns container records, filter helpers, and yard summary helpers
- `mfe-planning` owns job records, queue mutation helpers, and queue summary helpers
- `mfe-analytics` owns KPI derivation, alerts, and insight aggregation

## Technology Choices

- React 19
- TypeScript
- Vite
- Module Federation via `@module-federation/vite`
- pnpm workspace
- OpenSpec for spec-driven planning and implementation tracking

Notes:

- The challenge allows Material UI or Catalyst as bonus tooling.
- The current implementation does not yet introduce a full design system library.
- Styling is currently custom CSS to keep the bootstrap slice small and focused.

## Trade-offs

### Why Module Federation

Pros:

- true runtime separation between shell and remotes
- demonstrates a defendable microfrontend architecture
- enables independent deployment paths later

Cons:

- more setup complexity than a single SPA
- more moving parts in dev and deployment

### Why a Shared Contracts Package

Pros:

- explicit shared vocabulary
- better type safety across boundaries
- clearer maintainability story

Cons:

- requires discipline to avoid turning shared contracts into a dumping ground

### Why an Event Bus Instead of Shared State

Pros:

- better decoupling between domains
- aligns with independent MFE ownership
- good fit for operational signals

Cons:

- harder to trace than direct props
- can become noisy if event ownership is not kept strict

## Scaling From 3 to 10 Microfrontends

To scale this design:

- keep the shell thin and focused on composition, routing, and shared platform concerns
- preserve domain ownership so each new MFE has a clear bounded responsibility
- version the shared contracts package carefully
- establish event naming conventions and ownership rules
- introduce domain-level data access modules instead of ad hoc mock data
- automate quality gates with CI for build, lint, and tests per app
- consider manifest-driven remote discovery rather than hardcoding all remotes in the shell config

## Risks and Mitigations

### Risk: Remote integration drift

Mitigation:

- use a consistent Vite federation setup across all apps
- keep shared dependencies and contracts centralized

### Risk: Event bus becomes unstructured

Mitigation:

- keep event names typed and limited
- define payloads in `PlatformEventMap`
- use domain ownership for emitted events

### Risk: Shared package churn breaks remotes

Mitigation:

- keep `@tos/contracts` small and intentional
- prefer additive changes and clear type boundaries

### Risk: Shell becomes a god application

Mitigation:

- keep domain logic inside remotes
- allow the shell to orchestrate, not own, domain workflows

### Risk: Delivery gaps beyond architecture

Mitigation:

- architecture is implemented first, but the next work should focus on:
  - real domain behavior
  - tests
  - README
  - deployment

## Current Status

Implemented:

- shell + 3 remotes
- Module Federation runtime composition
- typed shared contracts
- typed event bus
- shell routing and fallback states
- shared planning snapshot for state recovery
- yard workflow with filters, detail panel, and operational events
- planning workflow with assignment, reprioritization, reprogramming, and completion
- analytics workflow with derived KPIs, alerts, and pseudo-real-time refresh
- Vercel deployment across shell and 3 remotes
- focused domain tests and GitHub Actions CI

Remaining optional improvements:

- adopt a formal design system such as Material UI or Catalyst
- deepen dashboard visualization beyond cards and alert panels
- add end-to-end browser automation
