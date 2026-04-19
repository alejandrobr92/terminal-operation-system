# TOS Microfrontend Platform

A frontend-only Terminal Operation System platform built with React, TypeScript, Vite, and Module Federation.

The platform is composed of:

- `shell`: host application and composition root
- `mfe-yard`: yard and container operations
- `mfe-planning`: move planning and operational jobs
- `mfe-analytics`: operational KPI and monitoring dashboard

This repository follows a spec-driven workflow with OpenSpec and currently prioritizes architectural clarity, typed contracts, and real microfrontend separation.

## Goals

- demonstrate clear domain boundaries
- use real runtime microfrontend composition
- enforce typed contracts across app boundaries
- keep communication decoupled through a shared event model
- provide a maintainable base for domain-specific TOS workflows

## Tech Stack

- React 19
- TypeScript
- Vite
- `@module-federation/vite`
- pnpm workspace
- OpenSpec

## Repository Structure

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
ARCHITECTURE.md
README.md
```

## Microfrontend Approach

This is not a single app split into folders. Each domain lives in its own application under `apps/` and is integrated into the shell at runtime through Module Federation.

Current architectural rules:

- the shell owns routing, navigation, and remote composition
- each remote owns its own domain UI
- `@tos/contracts` defines shared types and event contracts
- cross-MFE communication happens through a typed event bus, not direct imports between domain remotes

More detail is documented in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Current Status

Implemented so far:

- shell + 3 remotes wired through Module Federation
- shared contracts package
- typed event bus
- shell navigation and fallback loading states
- remote placeholder UIs for yard, planning, and analytics
- working cross-MFE event flow:
  - yard emits `containerSelected`
  - planning reacts and emits `jobUpdated`
  - analytics reacts to both
  - shell reflects the latest shared event

Still planned:

- richer domain functionality
- dedicated mock data access layer per domain
- tests
- deployment configuration
- CI/CD

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install

```bash
pnpm install
```

### Run Locally

Start each app in a separate terminal:

```bash
pnpm --filter ./apps/mfe-yard dev
pnpm --filter ./apps/mfe-planning dev
pnpm --filter ./apps/mfe-analytics dev
pnpm --filter ./apps/shell dev
```

Then open:

- shell: `http://127.0.0.1:3000`
- yard: `http://127.0.0.1:3001`
- planning: `http://127.0.0.1:3002`
- analytics: `http://127.0.0.1:3003`

## Useful Scripts

From the repository root:

```bash
pnpm build
pnpm lint
pnpm dev:shell
pnpm dev:yard
pnpm dev:planning
pnpm dev:analytics
```

## Manual Verification Flow

Once all four apps are running:

1. Open the shell.
2. Navigate to `/yard`.
3. Click `Broadcast selection` on a container.
4. Navigate to `/planning` and confirm the matching job is highlighted.
5. Click `Advance status`.
6. Navigate to `/analytics` and confirm the insight/KPI area reflects the update.
7. Confirm the shell banner shows the latest shared event.

## Technical Decisions

### Why Module Federation

The challenge explicitly values real separation between microfrontends. Module Federation gives runtime composition and keeps the architecture defensible as a true microfrontend solution.

### Why a Shared Contracts Package

Shared types live in `packages/contracts` so the shell and remotes use the same vocabulary for:

- domain models
- platform routes
- event payloads

This improves maintainability and reduces drift across boundaries.

### Why an Event Bus

The platform uses a typed browser event bus for cross-MFE communication. This keeps remotes decoupled while still allowing real interactions across domains.

### Why OpenSpec

OpenSpec is used to define and implement the platform incrementally:

- baseline product and domain specs live under `openspec/specs`
- the active foundation change lives under `openspec/changes/bootstrap-mfe-platform`

This gives traceability from requirements to implementation work.

## OpenSpec Workflow

The main active change is:

- `bootstrap-mfe-platform`

Key artifact:

- [openspec/changes/bootstrap-mfe-platform/tasks.md](./openspec/changes/bootstrap-mfe-platform/tasks.md)

This tracks the implementation slices for:

- workspace foundation
- remote exposure
- shell composition
- shared communication
- validation

## Build and Quality

Current quality baseline:

- reproducible workspace builds
- typed contracts
- typed event communication
- lint scripts configured per app

Testing is still pending and should be added before final delivery.

## Known Gaps

The repository is not yet at final challenge scope. The main remaining work is:

- implement real yard operations workflows
- implement richer planning actions and queue behavior
- derive analytics from shared data/events more fully
- add tests
- prepare Vercel deployment
- add CI/CD

## Challenge Constraints

Handled:

- React + TypeScript + Vite
- no Next.js
- real shell + 3 MFEs
- OpenSpec included

Not yet added:

- Material UI or Catalyst
- GitHub Actions
- deployed Vercel URLs

## Notes for Evaluation

This repository intentionally builds architecture first so the domain features can be added on top of a stable foundation. The current implementation already demonstrates:

- real microfrontend composition
- domain separation
- typed contracts
- cross-MFE communication
- maintainable workspace structure
