import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfe_yard',
      filename: 'remoteEntry.js',
      manifest: true,
      dts: false,
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
    origin: 'http://127.0.0.1:3001',
    port: 3001,
  },
  preview: {
    host: '127.0.0.1',
    port: 3001,
  },
  build: {
    target: 'chrome89',
  },
})
