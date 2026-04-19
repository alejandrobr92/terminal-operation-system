## Context

The repository already contains four frontend applications and a shared contracts package, but each app is still using the default Vite starter implementation. The current OpenSpec files describe the intended microfrontend platform at a high level, yet they do not capture the bootstrap decisions needed to turn the workspace into a working, locally runnable system. This change establishes the first implementation slice across the shell and remote applications without trying to complete domain-specific behavior.

Constraints:
- The platform must remain frontend-only and rely on mock data.
- The solution must use React, TypeScript, Vite, and Module Federation.
- Shared dependencies should be reused across remotes to avoid duplicate React runtimes.
- The result should create a stable base for later domain changes in yard operations, planning, and analytics.

## Goals / Non-Goals

**Goals:**
- Create a working shell-to-remote integration pattern for all four applications.
- Define how routes, remote mounting, shared contracts, and event propagation work together.
- Replace starter screens with minimal domain placeholders so the platform is visibly connected end to end.
- Keep the implementation simple enough to support local development and follow-on feature work.

**Non-Goals:**
- Implement full yard operations workflows, planning interactions, or analytics calculations.
- Introduce backend services, persistence, authentication, or production deployment concerns.
- Finalize a long-term design system beyond the minimum shared layout and navigation needed for bootstrap.

## Decisions

### Use the shell as the composition root

The shell will own top-level routing, navigation, and platform wiring. Each remote will expose a root React component that the shell loads and renders for its route.

Alternative considered:
- Allow each remote to own routing independently. This was rejected for the bootstrap phase because it adds coordination overhead and weakens the shell's role as the platform entry point.

### Use Module Federation for runtime integration in every app

Each remote application will expose a single entry module, and the shell will consume those remotes through Module Federation. Shared dependencies such as `react` and `react-dom` will be configured as shared singletons to prevent duplicate runtimes.

Alternative considered:
- Import local packages directly during the first milestone. This was rejected because it would bypass the runtime integration model the project is specifically meant to demonstrate.

### Keep contracts centralized in `packages/contracts`

Shared domain types and event payloads will live in `packages/contracts` and be imported by shell and remotes. This keeps cross-MFE communication typed while avoiding direct runtime coupling between domain applications.

Alternative considered:
- Duplicate types in each app and align them manually. This was rejected because the project goals explicitly emphasize typed contracts and maintainability.

### Use a lightweight browser-based event bus abstraction

The bootstrap platform will use a minimal publish/subscribe abstraction suitable for a frontend-only demo. It should support emitting typed events from remotes and subscribing from the shell or other remotes without introducing backend infrastructure.

Alternative considered:
- Use direct prop callbacks between shell and remotes. This was rejected because it creates tighter coupling and does not demonstrate the decoupled communication model described in the architecture spec.

### Start with placeholder domain screens

Each remote will initially render a domain-specific placeholder view that proves routing, loading, and composition work. Real domain behavior will arrive in later changes that implement each domain spec in depth.

Alternative considered:
- Build the full yard, planning, and analytics UIs in the same change. This was rejected because it would mix foundational platform work with domain behavior and make the first change too large to validate cleanly.

## Risks / Trade-offs

- [Federation config drift across apps] -> Use one bootstrap change to wire all applications together and keep the initial remote contract intentionally small.
- [Shared dependency mismatch] -> Configure `react` and `react-dom` as shared singletons and validate local startup for all applications together.
- [Over-specifying domain behavior too early] -> Limit this change to placeholder rendering and platform integration, leaving richer domain workflows to later changes.
- [Event bus becomes an unstructured catch-all] -> Keep the initial event surface narrow and typed through `packages/contracts`.

## Migration Plan

1. Add Module Federation configuration to shell and remote applications.
2. Expose one remote entry from each domain application and consume them from shell routes.
3. Introduce shared contracts and the initial event bus implementation pattern.
4. Replace starter-template screens with minimal platform placeholders.
5. Validate that the shell can navigate to and render each remote locally.

Rollback is straightforward because the change is isolated to the frontend workspace. Reverting the bootstrap wiring restores the repo to independent starter apps.

## Open Questions

- Whether the event bus should use DOM events, a tiny in-memory emitter, or a shared package wrapper around one of those patterns.
- Whether route ownership should remain entirely in the shell once domain screens become more complex.
- How much shared visual styling belongs in this change versus a later design-system-oriented change.
