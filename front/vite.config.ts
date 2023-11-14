import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    strictPort: true,
    port: 8080,
    proxy: {
      '^/(api|uploads)': {
        target: 'http://api:3000',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'ws://api:3000',
        ws: true,
      },
    },
  },
  resolve: {
    alias: [{ find: '@/', replacement: fileURLToPath(new URL('./src/', import.meta.url)) }],
  },
});
