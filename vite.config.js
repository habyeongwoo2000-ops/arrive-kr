import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist', assetsDir: 'static', chunkSizeWarningLimit: 2000,
    rollupOptions: { output: { manualChunks: { globe: ['globe.gl'] } } } }
});
