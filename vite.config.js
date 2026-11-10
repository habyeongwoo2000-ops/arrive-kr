import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  /* 지도(MapLibre)는 번들러와 잘 맞는 CSP 판을 쓰고, 일꾼(worker) 파일은 따로 둡니다 — 그냥 묶으면 지도가 멈춰 있습니다 */
  resolve: { alias: [{ find: /^maplibre-gl$/, replacement: 'maplibre-gl/dist/maplibre-gl-csp.js' }] },
  build: { outDir: 'dist', assetsDir: 'static', chunkSizeWarningLimit: 2000,
    rollupOptions: { output: { manualChunks: { globe: ['globe.gl'] } } } }
});
