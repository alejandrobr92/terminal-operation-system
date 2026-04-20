# Deployment

## Vercel Plan

Deploy the workspace as four separate Vercel projects:

- `shell`
- `mfe-yard`
- `mfe-planning`
- `mfe-analytics`

Each project should use its application directory as the Vercel root.

## Project Settings

For each project:

- Framework preset: `Vite`
- Install command: `pnpm install --frozen-lockfile`
- Build command: `pnpm build`
- Output directory: `dist`

Recommended Vercel root directories:

- shell: `apps/shell`
- yard: `apps/mfe-yard`
- planning: `apps/mfe-planning`
- analytics: `apps/mfe-analytics`

## Shell Environment Variables

The shell resolves remote manifests through environment variables at build time.

Set these in the shell Vercel project:

```bash
VITE_YARD_REMOTE_URL=https://your-yard-app.vercel.app
VITE_PLANNING_REMOTE_URL=https://your-planning-app.vercel.app
VITE_ANALYTICS_REMOTE_URL=https://your-analytics-app.vercel.app
```

The shell defaults back to localhost values for local development.

## Remote Environment Variables

Each remote also needs its own public deployment URL during production builds so the generated Module Federation manifest publishes absolute asset paths.

Set this in each remote Vercel project:

```bash
VITE_REMOTE_PUBLIC_URL=https://your-remote-app.vercel.app
```

Examples:

- yard: `https://terminal-operation-system-mfe-yard.vercel.app`
- planning: `https://terminal-operation-system-mfe-plann.vercel.app`
- analytics: `https://terminal-operation-system-mfe-analy.vercel.app`

## Deployment Order

1. Set `VITE_REMOTE_PUBLIC_URL` in `mfe-yard`, `mfe-planning`, and `mfe-analytics`
2. Deploy `mfe-yard`
3. Deploy `mfe-planning`
4. Deploy `mfe-analytics`
5. Copy those three production URLs into the shell environment variables
6. Deploy `shell`

## Verification

After deployment:

1. Open the shell production URL.
2. Navigate to `/yard`, `/planning`, and `/analytics`.
3. Confirm the remotes load inside the shell without localhost references.
4. Select a container in yard and confirm planning highlights the related job.
5. Run planning actions and confirm analytics updates.

## Notes

- Each app includes a `vercel.json` rewrite so browser refreshes resolve back to `index.html`.
- If a remote URL changes, redeploy the shell so the manifest URLs are rebuilt into the host.
