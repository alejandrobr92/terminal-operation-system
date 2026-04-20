import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

function getRemoteDefinition(remoteName: string, remoteUrl: string) {
  // The shell consumes the remote manifest, not the remoteEntry directly.
  return `${remoteName}@${remoteUrl}/mf-manifest.json`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Vercel exposes env vars through process.env during build; loadEnv keeps local .env support.
  const yardRemoteUrl =
    process.env.VITE_YARD_REMOTE_URL ?? env.VITE_YARD_REMOTE_URL ?? "http://127.0.0.1:3001";
  const planningRemoteUrl =
    process.env.VITE_PLANNING_REMOTE_URL ?? env.VITE_PLANNING_REMOTE_URL ?? "http://127.0.0.1:3002";
  const analyticsRemoteUrl =
    process.env.VITE_ANALYTICS_REMOTE_URL ?? env.VITE_ANALYTICS_REMOTE_URL ?? "http://127.0.0.1:3003";

  if (
    mode !== "development" &&
    (
      !process.env.VITE_YARD_REMOTE_URL ||
      !process.env.VITE_PLANNING_REMOTE_URL ||
      !process.env.VITE_ANALYTICS_REMOTE_URL
    )
  ) {
    // Failing hard here is safer than silently shipping a shell that points to localhost in production.
    throw new Error(
      "Production shell builds require VITE_YARD_REMOTE_URL, VITE_PLANNING_REMOTE_URL, and VITE_ANALYTICS_REMOTE_URL.",
    );
  }

  return {
    plugins: [
      react(),
      federation({
        name: 'shell',
        dts: false,
        remotes: {
          // The host only knows remote base URLs; each remote tells federation where its assets live.
          yard: getRemoteDefinition('mfe_yard', yardRemoteUrl),
          planning: getRemoteDefinition('mfe_planning', planningRemoteUrl),
          analytics: getRemoteDefinition('mfe_analytics', analyticsRemoteUrl),
        },
        shared: {
          // These are shared as singletons so all apps run against one React runtime and one contracts package.
          '@tos/contracts': {
            singleton: true,
          },
          react: {
            singleton: true,
          },
          'react-dom': {
            singleton: true,
          },
        },
      }),
    ],
    server: {
      host: '127.0.0.1',
      origin: 'http://127.0.0.1:3000',
      port: 3000,
    },
    preview: {
      host: '127.0.0.1',
      port: 3000,
    },
    build: {
      target: 'chrome89',
    },
  }
})
