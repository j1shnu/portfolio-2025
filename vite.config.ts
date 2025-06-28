import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Main GitHub Pages site
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
