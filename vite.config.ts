import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
const hmrConfig = process.env.CF_PAGES_URL
  ? {
      protocol: 'wss',
      host: new URL(process.env.CF_PAGES_URL).hostname,
      clientPort: 443,
    }
  : undefined;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose server on all network interfaces
    hmr: hmrConfig,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    dedupe: ['react', 'react-dom'],
  },
});