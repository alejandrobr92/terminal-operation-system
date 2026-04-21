# MFE Yard

`mfe-yard` owns the Yard & Container Operations domain.

## Responsibilities

- represent yard-oriented container views
- emit container selection events
- own container filters, detail views, demo states, and operational event handling

## Local Run

From the repository root:

```bash
pnpm --filter ./apps/mfe-yard dev
```

Default URL:

- `http://127.0.0.1:3001`

## Integration Notes

- Exposes `./App` through Module Federation.
- Uses shared types from `@tos/contracts`.
- Emits `containerSelected` through the shared event bus.
- Publishes a focused yard context so planning and analytics can react without direct imports.
