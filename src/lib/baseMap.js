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
  const fallback = () => { if (alive()) osm().addTo(map); };
  if (!glOk()) { fallback(); return; }
  try {
    await import('maplibre-gl/dist/maplibre-gl.css');
    const ml = await import('maplibre-gl');
    const { default: workerUrl } = await import('maplibre-gl/dist/maplibre-gl-csp-worker.js?url');
    (ml.setWorkerUrl || ml.default.setWorkerUrl)(workerUrl);   // 지도 일꾼 파일 위치 알려 주기
    await import('@maplibre/maplibre-gl-leaflet');
  } catch (e) { fallback(); return; }
  if (!alive()) return;
  const gl = L.maplibreGL({ style: mapStyle(), localIdeographFontFamily: KO_FONT, attributionControl: { customAttribution: ATTR }, fadeDuration: 150 }).addTo(map);
  const glMap = gl.getMaplibreMap();
  let done = false;
  const swap = () => { if (done || !alive()) return; done = true; map.removeLayer(gl); fallback(); };
  const timer = setTimeout(() => { if (!glMap.isStyleLoaded()) swap(); }, 12000);   // 바탕 설정을 12초 안에 못 받으면 그림 지도로
  glMap.on('load', () => { done = true; clearTimeout(timer); });
  glMap.on('error', () => { if (!glMap.isStyleLoaded()) swap(); });          // 바탕 설정을 못 받았을 때만
}
