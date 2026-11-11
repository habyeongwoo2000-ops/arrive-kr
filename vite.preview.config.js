/* 미리보기용 빌드 — 모든 파일을 index.html 하나에 담습니다 (claude.ai 공유 링크용).
   npm run build:preview → dist-preview/index.html
   · 공유 링크에서는 외부 지도 서버에 접속할 수 없어서 원주 지도 바탕(도로·지명)은 그리지 않고,
     핀·동선·걷는 사람만 보여 줍니다(VITE_PREVIEW). 실제 배포(npm run build)는 그대로입니다. */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: { 'import.meta.env.VITE_PREVIEW': JSON.stringify('1') },
  resolve: { alias: [{ find: /^maplibre-gl$/, replacement: 'maplibre-gl/dist/maplibre-gl-csp.js' }] },
  build: { outDir: 'dist-preview', chunkSizeWarningLimit: 9000, assetsInlineLimit: 100000000 }
});
