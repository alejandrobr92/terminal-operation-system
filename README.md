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
Validation details are documented in [VALIDATION.md](./VALIDATION.md).

## Current Status

Implemented so far:

- shell + 3 remotes wired through Module Federation
- shared contracts package
- typed event bus
- shell navigation and fallback loading states
- yard workflow with filters, detail, and state handling
- planning workflow with assignment, reprioritization, reprogramming, and completion actions
- analytics dashboard with derived KPIs, alerts, and pseudo-real-time refresh
- working cross-MFE event flow and shared planning snapshot synchronization

Still planned:

- Vercel deployment configuration
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
pnpm test
pnpm dev:shell
pnpm dev:yard
pnpm dev:planning
pnpm dev:analytics
```

## Vercel Deployment

This workspace is intended to be deployed as four separate Vercel projects, one per app:

- `apps/shell`
- `apps/mfe-yard`
- `apps/mfe-planning`
- `apps/mfe-analytics`

The shell reads remote manifest URLs from environment variables at build time:

```bash
VITE_YARD_REMOTE_URL=https://your-yard-app.vercel.app
VITE_PLANNING_REMOTE_URL=https://your-planning-app.vercel.app
VITE_ANALYTICS_REMOTE_URL=https://your-analytics-app.vercel.app
```

Deployment instructions are documented in [DEPLOYMENT.md](./DEPLOYMENT.md).

## Manual Verification Flow

Once all four apps are running:

1. Open the shell.
2. Navigate to `/yard`.
3. Filter or select a container in `/yard`.
4. Navigate to `/planning` and confirm the matching job is highlighted.
5. Run planning actions such as `Assign move`, `Reprogram`, `Reprioritize`, and `Complete`.
6. Navigate to `/analytics` and confirm the KPI, alert, and insight areas reflect the update.
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
- completed foundation work is archived under `openspec/changes/archive/`
- the current delivery change lives under `openspec/changes/deliver-core-tos-workflows`

This gives traceability from requirements to implementation work.

## OpenSpec Workflow

The main active change is:

- `deliver-core-tos-workflows`

Key artifact:

- [openspec/changes/deliver-core-tos-workflows/tasks.md](./openspec/changes/deliver-core-tos-workflows/tasks.md)

This tracks the implementation slices for:

- domain data layers
- yard workflows
- planning workflows
- analytics workflows
- testing and delivery readiness

## Build and Quality

Current quality baseline:

- reproducible workspace builds
- typed contracts
- typed event communication
- lint scripts configured per app
- focused domain-level tests via Vitest

Testing currently focuses on high-signal domain behaviors:

- yard filtering and selection helpers
- planning assignment, reprioritization, sorting, and summary logic
- analytics KPI derivation and alert behavior

## Known Gaps

The repository is not yet at final challenge scope. The main remaining work is:

- finalize delivery validation notes
- prepare Vercel deployment
- add CI/CD
- optional design-system adoption if time allows

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
