import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const remotePublicUrl =
    process.env.VITE_REMOTE_PUBLIC_URL ?? env.VITE_REMOTE_PUBLIC_URL ?? "http://127.0.0.1:3003";

  if (mode !== "development" && !process.env.VITE_REMOTE_PUBLIC_URL) {
    throw new Error("Production analytics builds require VITE_REMOTE_PUBLIC_URL.");
  }

  return {
    base: mode === "development" ? "/" : `${remotePublicUrl}/`,
    plugins: [
      react(),
      federation({
        name: 'mfe_analytics',
        filename: 'remoteEntry.js',
        manifest: true,
        dts: false,
        getPublicPath: `function() { return "${remotePublicUrl}/"; }`,
        exposes: {
          './App': './src/App.tsx',
        },
        shared: {
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
      origin: 'http://127.0.0.1:3003',
      port: 3003,
    },
    preview: {
      host: '127.0.0.1',
      port: 3003,
    },
    build: {
      target: 'chrome89',
    },
  }
})
