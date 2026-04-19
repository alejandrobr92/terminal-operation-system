# MFE Analytics

`mfe-analytics` owns the operational analytics domain.

## Responsibilities

- represent KPI and monitoring views
- react to shared platform events
- evolve toward derived metrics and operational alerts

## Local Run

From the repository root:

```bash
pnpm --filter ./apps/mfe-analytics dev
```

Default URL:

- `http://127.0.0.1:3003`

## Integration Notes

- Exposes `./App` through Module Federation.
- Uses shared types from `@tos/contracts`.
- Reacts to `containerSelected` and `jobUpdated` from the shared event bus.
