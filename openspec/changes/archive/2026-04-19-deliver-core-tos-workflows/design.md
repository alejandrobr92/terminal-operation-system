## Context

The platform already has a working microfrontend foundation: shell composition, remote loading, shared contracts, and a typed event bus. What is missing is enough domain behavior to make the project evaluable as a Terminal Operation System frontend rather than only an architecture demo. With roughly 36 hours remaining, this change must prioritize the minimum complete challenge scope over ideal completeness.

Constraints:
- The platform must remain frontend-only.
- Mock data is acceptable, but UI must not own raw mock structures directly.
- The current shell/remote/event-bus architecture should be preserved rather than replaced.
- The implementation should add visible domain value quickly while keeping builds stable and documentation honest.

## Goals / Non-Goals

**Goals:**
- Implement concrete yard, planning, and analytics behaviors aligned to the challenge requirements.
- Move domain data into lightweight access layers so components consume structured APIs rather than inline arrays.
- Ensure analytics reflects state derived from yard and planning rather than only placeholder values.
- Add a small but meaningful automated test baseline.
- Preserve the current microfrontend architecture and avoid destabilizing the foundation.

**Non-Goals:**
- Introduce backend services, authentication, or persistence.
- Build a comprehensive design system from scratch.
- Reach exhaustive domain parity with a real production TOS.
- Add every optional bonus item before core challenge functionality is done.

## Decisions

### Use per-domain local data modules

Each remote will own a lightweight mock data layer under its application boundary. Components will consume normalized data and simple domain actions from those modules rather than embedding mock records in component files.

Alternative considered:
- Introduce a shared mock server or JSON server immediately. This was rejected because it adds setup and deployment overhead under deadline pressure without being necessary for the challenge.

### Keep cross-MFE coordination event-driven

The event bus introduced in the bootstrap change will remain the integration mechanism between domains. Analytics should continue to derive updates from yard/planning signals and shared domain data rather than coupling directly to internal component state.

Alternative considered:
- Replace event-driven coordination with lifted shell state. This was rejected because it would weaken domain boundaries and reduce architectural clarity.

### Favor complete workflows over advanced polish

The next implementation should focus on making the required workflows real and testable: filtering containers, viewing details, updating jobs, and reflecting analytics. Visual polish should support clarity, but not block functional completeness.

Alternative considered:
- Spend the next phase on deeper design polish or design-system migration. This was rejected because the challenge weights functional completeness, architecture, and maintainability more heavily.

### Add targeted tests for important flows

Testing should cover the most valuable behaviors:
- domain rendering from structured data
- key interactions in yard and planning
- analytics updates based on shared signals

Alternative considered:
- postpone testing until the end. This was rejected because the challenge explicitly evaluates testing, and some test scaffolding is easier to add while implementing features.

## Risks / Trade-offs

- [Scope grows beyond the deadline] -> Keep this change focused on the minimum complete product and defer optional polish.
- [Domain mock data remains too component-coupled] -> Introduce explicit data-access modules even if they remain local and in-memory.
- [Analytics becomes misleading or too fake] -> Derive KPI changes from yard/planning state transitions where possible and document simplifications clearly.
- [Testing effort steals too much implementation time] -> Add a narrow set of high-signal tests instead of broad coverage.

## Migration Plan

1. Add structured domain data modules for yard, planning, and analytics inputs.
2. Replace placeholder domain screens with real interactions and UI states.
3. Update analytics to react to domain state and event-driven changes.
4. Add focused automated tests for the most important behaviors.
5. Update README and delivery-facing documentation as needed.

Rollback remains straightforward because the system is frontend-only and isolated within the workspace.

## Open Questions

- Whether analytics should use a chart library or remain card/panel based for the deadline version.
- Whether the data-access layer should live per app or partially in a shared workspace package.
- How much time remains for optional extras like Material UI adoption or CI/CD after the core flows are complete.
