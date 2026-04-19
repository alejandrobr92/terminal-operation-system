# Validation

## Scope

This document captures the validation performed for the `bootstrap-mfe-platform` OpenSpec change.

It focuses on:

- local runtime verification
- reproducible builds
- shared runtime behavior
- documented follow-up gaps

## Local Runtime Verification

The platform was validated locally with all four applications running:

- shell: `http://127.0.0.1:3000`
- yard: `http://127.0.0.1:3001`
- planning: `http://127.0.0.1:3002`
- analytics: `http://127.0.0.1:3003`

Verified flow:

1. Open the shell.
2. Navigate to `/yard`.
3. Select a container with `Broadcast selection`.
4. Navigate to `/planning` and verify the related job is highlighted.
5. Click `Advance status` in planning.
6. Navigate to `/analytics` and verify the insight/KPI panel reacts.
7. Confirm the shell banner shows the latest cross-MFE event.

Outcome:

- shell navigation works
- remotes load correctly inside the shell
- fallback composition path works
- cross-MFE event flow works end to end

## Build Verification

Successful workspace build:

```bash
pnpm build
```

This currently builds:

- `apps/shell`
- `apps/mfe-yard`
- `apps/mfe-planning`
- `apps/mfe-analytics`

Each remote emits:

- `remoteEntry.js`
- `mf-manifest.json`

The shell builds successfully against the remote manifest configuration.

## Shared Runtime Verification

The current federation setup is configured to share these singletons across apps:

- `react`
- `react-dom`
- `@tos/contracts`

Verification evidence:

- all applications declare these packages as shared in their federation config
- remote manifests include shared entries for those packages
- the shell and remotes build successfully with federation-aware shared import maps

This does not prove runtime singleton behavior with deep instrumentation, but it does validate that the current setup is aligned with the intended shared-runtime strategy and is working in local integration.

## Known Warnings

Current non-blocking warning during builds:

- `resolve.alias` contains an alias with `customResolver` option. This is emitted by the federation plugin and references a future Vite 9 deprecation path.

Current interpretation:

- does not block development
- does not block production build
- should be revisited before upgrading to Vite 9

## Follow-up Gaps

The bootstrap change is complete as a foundation, but the following work remains for full challenge delivery:

### Yard

- real container list/data access layer
- filtering by status, type, block, location, and priority
- container detail view
- explicit loading, empty, and error states
- richer operational event modeling

### Planning

- richer operational queue behavior
- assign/reprogram actions with clearer state transitions
- better movement/job abstraction
- persistent mock data layer instead of local component-only arrays

### Analytics

- derived KPIs from domain data instead of mostly local placeholders
- charts/panels beyond summary cards
- operational alerts and average timing metrics

### Platform

- automated tests
- root README refinement as delivery nears
- Vercel deployment configuration
- CI/CD with GitHub Actions
- optional design system adoption if time allows

## Recommendation

The architecture foundation is validated enough to move forward. The next priority should be domain depth and testing rather than more platform refactoring.
