import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@stay-safe/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }

          if (
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('react-router') ||
            id.includes('@remix-run/router') ||
            id.includes('/history/') ||
            id.includes('/scheduler/') ||
            id.includes('use-sync-external-store') ||
            id.includes('/react/')
          ) {
            return 'vendor-react';
          }

          if (id.includes('framer-motion') || id.includes('lenis')) {
            return 'vendor-motion';
          }

          if (
            id.includes('react-markdown') ||
            id.includes('remark-gfm') ||
            id.includes('rehype-raw')
          ) {
            return 'vendor-markdown';
          }

          if (id.includes('recharts') || id.includes('d3-')) {
            return 'vendor-charts';
          }

          if (id.includes('lucide-react') || id.includes('@radix-ui')) {
            return 'vendor-ui';
          }

          return 'vendor-misc';
        },
      },
    },
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
