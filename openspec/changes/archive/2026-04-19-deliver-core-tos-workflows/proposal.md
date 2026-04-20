## Why

The platform foundation is complete, but the current product still behaves like an architectural prototype rather than a challenge-ready TOS frontend. This change is needed now to deliver the minimum complete user-facing workflows, validation, and supporting quality signals required for evaluation within the remaining timeline.

## What Changes

- Implement real yard operations workflows using structured mock data instead of placeholder-only views.
- Implement planning queue interactions that support operational status changes, assignment, reprioritization, and visible job management behavior.
- Implement analytics views that derive KPI values from yard and planning state/events rather than static placeholder metrics.
- Introduce lightweight data-access modules so UI rendering is decoupled from raw mock data definitions.
- Add focused automated tests for the most important cross-MFE and domain-level behaviors.
- Tighten delivery documentation so the repository presents a coherent, evaluable product.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `yard-operations`: expand the current requirements to include real filtering, detail views, domain states, and operational event representation.
- `planning`: expand the planning requirements to cover actionable job operations and visible operational state changes.
- `analytics`: expand analytics requirements to cover derived KPIs, richer monitoring views, and operational indicators sourced from shared domain behavior.

## Impact

- Affects `apps/mfe-yard`, `apps/mfe-planning`, `apps/mfe-analytics`, `apps/shell`, and `packages/contracts`.
- Adds domain-level data access modules, stronger UI behavior, and automated test coverage.
- Improves challenge readiness across functionality, maintainability, testing, and presentation.
