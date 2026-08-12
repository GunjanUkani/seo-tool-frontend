import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const BACKEND_PORT = process.env.VITE_BACKEND_PORT || '5001';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/audit': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true
      },
      '/health': {
        target: `http://localhost:${BACKEND_PORT}`,
        changeOrigin: true
      }
    }
  }
});
