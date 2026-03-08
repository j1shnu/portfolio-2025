import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
