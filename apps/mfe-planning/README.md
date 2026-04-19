# MFE Planning

`mfe-planning` owns the Move Planning domain.

## Responsibilities

- represent jobs and movement-oriented workflows
- react to yard signals when relevant
- emit planning/job status changes

## Local Run

From the repository root:

```bash
pnpm --filter ./apps/mfe-planning dev
```

Default URL:

- `http://127.0.0.1:3002`

## Integration Notes

- Exposes `./App` through Module Federation.
- Uses shared types from `@tos/contracts`.
- Consumes `containerSelected` and emits `jobUpdated`.
