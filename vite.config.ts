import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Main GitHub Pages site
  
  // Production build optimizations
  build: {
    // Enable minification
    // Note: 'esbuild' is faster, but 'terser' allows removing console.logs
    // Switch to 'terser' and add terserOptions if you need console.log removal
    minify: 'esbuild',
    
    // Code splitting configuration
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          // React vendor chunk
          'react-vendor': ['react', 'react-dom'],
          // Icons chunk (lucide-react can be large)
          'icons': ['lucide-react'],
        },
      },
    },
    
    // Chunk size warning limit (in KB)
    chunkSizeWarningLimit: 1000,
    
    // Source maps for production (set to false for smaller builds)
    sourcemap: false,
    
    // Target modern browsers for smaller bundle size
    target: 'es2015',
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Generate manifest for better caching
    manifest: true,
  },
  
  // Dependency optimization
  optimizeDeps: {
    // Include dependencies that should be pre-bundled
    include: ['react', 'react-dom'],
    // Exclude lucide-react from pre-bundling (it's tree-shakeable)
    exclude: ['lucide-react'],
  },
});
