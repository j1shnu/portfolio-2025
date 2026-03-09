import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cloudflare()],
  base: '/', // Main GitHub Pages site

  // Production build optimizations
  build: {
    minify: 'esbuild',

    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },

    chunkSizeWarningLimit: 500,
    sourcemap: false,
    target: 'es2020',
    cssCodeSplit: true,
  },

  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
});