/* 원주 지도의 바탕 깔기
   · WebGL 이 되면: 벡터 지도(mapStyle.js — 국내 지도 서비스와 비슷한 밝은 색) — 필요할 때만 불러옵니다.
   · 안 되거나 지도 서버가 응답하지 않으면: OpenStreetMap 기본 그림 지도를 색을 낮춰서 대신 깝니다. */

import L from 'leaflet';
import mapStyle, { KO_FONT } from './mapStyle.js';

const ATTR = '© OpenStreetMap contributors · OpenMapTiles · OpenFreeMap';
const osm = () => L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors', className: 'osm-soft' });

function glOk() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

export default async function addBase(map, alive) {
  /* 미리보기(공유 링크) 빌드: 외부 지도 서버에 접속할 수 없어 바탕을 그리지 않습니다 */
  if (import.meta.env.VITE_PREVIEW) { map.getContainer().dataset.base = 'preview'; return; }
  const fallback = (why) => { if (!alive()) return; osm().addTo(map); map.getContainer().dataset.base = 'osm-' + why; };
  if (!glOk()) { fallback('nogl'); return; }
  try {
    await import('maplibre-gl/dist/maplibre-gl.css');
    const ml = await import('maplibre-gl');
    const { default: workerUrl } = await import('maplibre-gl/dist/maplibre-gl-csp-worker.js?url');
    (ml.setWorkerUrl || ml.default.setWorkerUrl)(workerUrl);   // 지도 일꾼 파일 위치 알려 주기
    await import('@maplibre/maplibre-gl-leaflet');
  } catch (e) { console.warn('[map] load', e); fallback('load'); return; }
  if (!alive()) return;
  const gl = L.maplibreGL({ style: mapStyle(), localIdeographFontFamily: KO_FONT, attributionControl: { customAttribution: ATTR }, fadeDuration: 150 }).addTo(map);
  const glMap = gl.getMaplibreMap();
  const box = map.getContainer(); box.dataset.base = 'loading';
  /* 벡터 지도가 늦거나 막히면 그림 지도를 '잠깐' 위에 깔고, 벡터 지도가 다 뜨면 걷어 냅니다.
     (탭이 뒤에 있으면 그리기가 멈춰서 늦게 뜰 수 있어요 — 그래서 벡터 지도를 버리지 않습니다) */
  let raster = null, done = false;
  const cover = () => { if (done || raster || !alive()) return; raster = osm().addTo(map); box.dataset.base = 'osm'; };
  const timer = setTimeout(cover, 8000);
  glMap.on('load', () => {
    done = true; clearTimeout(timer); box.dataset.base = 'gl';
    if (raster) { map.removeLayer(raster); raster = null; }
  });
  glMap.on('error', (e) => { if (!done) { console.warn('[map] vector style', e && e.error && e.error.message); cover(); } });
}
