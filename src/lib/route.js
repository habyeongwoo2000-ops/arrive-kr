/* 길·거리·주소 찾기 — 모두 키 없는 공개 서버 (OpenStreetMap 기반)
   · 주소 → 좌표: Nominatim (자동완성 금지 규칙이라 '검색' 버튼을 눌렀을 때만 요청)
   · 거리·시간: OSRM 공개 서버 (자동차 기준). 실패하면 직선거리 × 1.35 로 어림잡습니다. */
import L from 'leaflet';

const NOMI = 'https://nominatim.openstreetmap.org';
const OSRM = 'https://router.project-osrm.org';
const BOX = '127.55,37.75,128.45,36.95';   // 원주 둘레(강원 남부) 를 먼저 찾기

const timed = async (url, ms = 6000) => {
  const ac = new AbortController(); const tm = setTimeout(() => ac.abort(), ms);
  try { const r = await fetch(url, { signal: ac.signal }); if (!r.ok) throw new Error(r.status); return await r.json(); }
  finally { clearTimeout(tm); }
};

/* Nominatim 주소를 짧게: "단구로 170, 명륜동" */
function shortName(a, fallback) {
  if (!a) return fallback;
  const road = [a.road, a.house_number].filter(Boolean).join(' ');
  const area = a.quarter || a.suburb || a.neighbourhood || a.village || a.town || a.city_district || '';
  const first = a.amenity || a.building || a.shop || a.office || road;
  return [first, area].filter(Boolean).filter((x, i, arr) => arr.indexOf(x) === i).join(', ') || fallback;
}

export async function geocode(q, lang = 'ko') {
  const one = async (text) => {
    const j = await timed(`${NOMI}/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=kr&accept-language=${lang === 'ko' ? 'ko' : 'ko,en'}&viewbox=${BOX}&q=${encodeURIComponent(text)}`);
    return j.map((x) => ({ lat: +x.lat, lng: +x.lon, label: shortName(x.address, x.name || x.display_name.split(',')[0]), full: x.display_name.split(', ').slice(0, -2).join(', ') }));
  };
  let r = await one(q);
  // 건물 번호까지는 지도 자료에 없을 때가 많아요 → 번호를 빼고 길 이름으로 한 번 더
  if (!r.length && /\d/.test(q)) { const q2 = q.replace(/\s*[\d-]+(번지|호)?\s*$/, '').trim(); if (q2 && q2 !== q) r = (await one(q2)).map((x) => ({ ...x, near: true })); }
  return r;
}

export async function reverse(lat, lng, lang = 'ko') {
  try {
    const j = await timed(`${NOMI}/reverse?format=jsonv2&zoom=18&addressdetails=1&accept-language=${lang === 'ko' ? 'ko' : 'ko,en'}&lat=${lat}&lon=${lng}`);
    return shortName(j.address, j.name || '');
  } catch (e) { return ''; }
}

/* 직선거리 (m) */
export function haversine(a, b) {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLng = (b.lng - a.lng) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/* 집 → 여러 장소 거리·시간 한 번에 { key: { m, s, est } } */
export async function distances(home, places) {
  const keys = Object.keys(places);
  const guess = () => Object.fromEntries(keys.map((k) => { const m = haversine(home, places[k]) * 1.35; return [k, { m, s: m / (m > 15000 ? 22 : 9), est: true }]; }));
  try {
    const pts = [home, ...keys.map((k) => places[k])].map((p) => `${p.lng.toFixed(5)},${p.lat.toFixed(5)}`).join(';');
    const j = await timed(`${OSRM}/table/v1/driving/${pts}?sources=0&annotations=distance,duration`, 6000);
    if (j.code !== 'Ok') throw new Error(j.code);
    const g = guess();
    return Object.fromEntries(keys.map((k, i) => {
      const m = j.distances[0][i + 1], s = j.durations[0][i + 1];
      return [k, m == null ? g[k] : { m, s, est: false }];
    }));
  } catch (e) { return guess(); }
}

/* 두 곳 사이 실제 길 (못 받으면 직선) */
const ROUTES = {};
export async function roadPath(a, b) {
  const key = [a.lat, a.lng, b.lat, b.lng].map((v) => (+v).toFixed(5)).join(',');
  if (ROUTES[key]) return ROUTES[key];
  try {
    const d = await timed(`${OSRM}/route/v1/driving/${a.lng},${a.lat};${b.lng},${b.lat}?overview=full&geometries=geojson`, 4000);
    const c = d.routes[0].geometry.coordinates.map(([x, y]) => L.latLng(y, x));
    if (c.length < 2) throw new Error('short');
    ROUTES[key] = [L.latLng(a), ...c, L.latLng(b)];
  } catch (e) { ROUTES[key] = [L.latLng(a), L.latLng(b)]; }
  return ROUTES[key];
}

/* "3.3km · 차 6분 · 걸어서 45분" */
export function distText(d, lang = 'ko') {
  if (!d) return '';
  const ko = lang === 'ko';
  const km = d.m < 1000 ? Math.round(d.m / 10) * 10 + 'm' : (d.m / 1000).toFixed(d.m < 10000 ? 1 : 0) + 'km';
  const car = Math.max(1, Math.round(d.s / 60));
  const walk = Math.round(d.m / 70);           // 걸음 약 70m/분 (차 길 기준이라 어림)
  const hm = (min) => (min < 60 ? min + (ko ? '분' : ' min') : Math.floor(min / 60) + (ko ? '시간 ' : ' h ') + (min % 60 ? (min % 60) + (ko ? '분' : ' min') : ''));
  const parts = [(d.est ? (ko ? '약 ' : '~') : '') + km, (ko ? '차 ' : 'car ') + hm(car)];
  if (d.m <= 4000) parts.push((ko ? '걸어서 ' : 'walk ') + hm(walk));
  return parts.join(' · ');
}
