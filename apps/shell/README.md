# Shell

The shell is the host application for the TOS platform.

## Responsibilities

- own top-level navigation
- own route state
- load remote MFEs through Module Federation
- provide the shared application frame
- observe cross-MFE events for platform-level visibility

## Local Run

From the repository root:

```bash
pnpm --filter ./apps/shell dev
```

Default URL:

- `http://127.0.0.1:3000`

## Notes

- The shell depends on the remotes being available during local development.
- Remote loading is configured through federation manifests in `vite.config.ts`.
- The shell is intentionally thin and should not absorb domain-specific business logic.
