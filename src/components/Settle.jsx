/* 원주 정착 — 지구본에서 내려와 실제 거리 지도(OpenStreetMap) 위에
   원주 → 강원 → 전국 순서로 맞춤 공공지원을 추천합니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import useSheetDrag from '../useSheetDrag.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SHOPS, PHONES, FOODS, PLACES, TOWNS, NEEDS, SCOPE, STATS, SOURCES, WONJU, recommend } from '../data/wonju.js';
import { VISAS, byCode } from '../data/visas.js';
import { LEGS } from '../data/route.js';
import { CheckItem } from './RoutePanel.jsx';
import { ui, fill } from '../i18n/ui.js';
import Plan, { PlanButton } from './Plan.jsx';
import Icon from './Icon.jsx';
import addBase from '../lib/baseMap.js';
import { nav } from '../i18n/nav.js';
import useEsc from '../lib/useEsc.js';
import { uget, uset } from '../lib/store.js';
import HomePicker, { hs } from './HomePicker.jsx';
import { distances, distText, reverse, roadPath } from '../lib/route.js';

import { rm, STAGES, stageOf, levelOf } from '../lib/roadmap.js';
const walkerIcon = () => L.divIcon({ className: 'walker', html: '<span><svg viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="5" r="2.4"/><path d="M10.2 8.6h3.6l1.6 5.2-1.7.5-1-3.1-.6 3.4 2.3 3.6v3.8h-2v-3.2l-1.8-2.6-1 2.9-2.9 2.6-1.4-1.4 2.4-2.3 1.2-5.3-.8.8v2.7h-2V11.2z"/></svg></span>', iconSize: [36, 36], iconAnchor: [18, 18] });
const visitIcon = () => L.divIcon({ className: 'visit', html: '<span><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>', iconSize: [22, 22], iconAnchor: [11, 11] });

/* 집 위치 — 계정별로 이 브라우저에 저장 (예전 판의 공용 저장값도 한 번 읽어 옴) */
const okHome = (h) => (h && isFinite(h.lat) && isFinite(h.lng) ? h : null);
const loadHome = (who) => { const h = okHome(uget(who, 'home')); if (h || who !== 'guest') return h; try { return okHome(JSON.parse(localStorage.getItem('arrive.home'))); } catch (e) { return null; } };
const saveHome = (who, h) => uset(who, 'home', h || null);
const homeIcon = () => L.divIcon({ className: 'poi lf-home', html: `<span class="poi-ic" style="--c:#191f28"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11l8-6.5 8 6.5"/><path d="M6 9.5V20h12V9.5"/></svg></span>`, iconSize: [34, 34], iconAnchor: [17, 17] });

/* 지도 위 장소 아이콘 (Leaflet divIcon 은 HTML 문자열이라 SVG 를 글자로 둡니다) */
const G = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const GLYPH = {
  cart: G('<path d="M3.5 4.5h2.3l2 10.5h10l1.8-7.5H7"/><circle cx="9" cy="19" r="1.2"/><circle cx="17" cy="19" r="1.2"/>'),
  phone: G('<rect x="7" y="3" width="10" height="18" rx="2.2"/><path d="M11 17.5h2"/>'),
  bowl: G('<path d="M4 11h16a8 8 0 0 1-16 0z"/><path d="M9 4.5c0 2 1.5 2 1.5 4M13.5 4.5c0 2 1.5 2 1.5 4"/>'),
  bus: G('<rect x="5" y="3.5" width="14" height="14" rx="2.5"/><path d="M5 11h14M8.5 20.5v-3M15.5 20.5v-3"/>'),
  gov: G('<path d="M4 10l8-5.5 8 5.5M6 10v8M10 10v8M14 10v8M18 10v8M3.5 20h17"/>'),
  health: G('<path d="M12 6v12M6 12h12"/>'),
  star: G('<path d="M12 4l2.3 5 5.2.5-3.9 3.5 1.1 5.2L12 15.6 7.3 18.2l1.1-5.2L4.5 9.5l5.2-.5z"/>')
};
const poi = (cls, color, glyph, label, on) => L.divIcon({
  className: 'poi ' + cls + (on ? ' is-on' : ''),
  html: `<span class="poi-ic" style="--c:${color}">${GLYPH[glyph] || GLYPH.gov}</span>${label ? `<b class="poi-lb" style="--c:${color}">${label}</b>` : ''}`,
  iconSize: [28, 28], iconAnchor: [14, 14]
});

const CAT = { stay: '#1a73e8', work: '#e37400', health: '#d93025', korean: '#9334e6', family: '#c2185b', child: '#c2185b', life: '#188038', safety: '#f9ab00', culture: '#00897b', study: '#5f6368' };

function pinIcon(color, label, on, glyph = 'gov') {
  return poi('lf-pin', color, glyph, label, on);
}

/* 도착 후 할 일 → 지도 핀 (원주에서 그 일을 하는 곳) */
const TODO_PIN = { arc: 'cityhall', bank: 'hana', unlimit: 'hana', remit: 'hana' };
const pinOf = (id) => TODO_PIN[id] || (id.endsWith('-arc') ? 'cityhall' : id.endsWith('-nhis') ? 'nhis' : null);
/* 체크했을 때 걸어갈 곳: 공공기관 핀, 휴대폰 개통은 가까운 선불폰 매장 */
const spotOf = (id, K) => {
  if (id === 'sim' || id === 'phone2' || id.endsWith('-sim')) { const p = PHONES[0]; return p ? { lat: p.lat, lng: p.lng, name: p[K].t } : null; }
  const k = pinOf(id); const pl = k && PLACES[k];
  return pl ? { lat: pl.lat, lng: pl.lng, name: pl[K].split(' (')[0] } : null;
};


export default function Settle({ who = 'guest', lang, visa: visa0, name, onBack, tab, setTab, checks, toggle, entry, country, countryLabel, planGo = 0 }) {
  const t = ui(lang);
  const n = nav(lang);
  const [moreOpen, setMoreOpen] = useState(false);
  const K = lang === 'ko' ? 'ko' : 'en';
  /* 지원 찾기 조건 — 계정별로 기억 (다른 화면에 다녀오거나 새로고침해도 그대로) */
  const saved = uget(who, 'settle', {});
  const wasOpen = useRef(uget(who, 'planOpen', false));   // 지난번에 30일 일정을 보고 있었나
  const [visa, setVisa] = useState(saved.visa || visa0 || 'E-9');
  const [town, setTown] = useState(saved.town || 'wonju');
  const [needs, setNeeds] = useState(saved.needs || ['stay', 'health', 'korean']);
  const [family, setFamily] = useState(saved.family != null ? saved.family : visa0 === 'F-6');
  const rmT = rm(lang);
  const [walkMsg, setWalkMsg] = useState('');
  const [hi, setHi] = useState(null);
  const [plan, setPlan] = useState(0);   // 0 = 닫힘, 숫자 = 새로 만들 때마다 증가 (AI 30일 일정)
  const h = hs(lang);
  const [home, setHomeS] = useState(() => loadHome(who));     // { lat, lng, label }
  const [dist, setDist] = useState({});            // 장소 키 → { m, s, est }
  const [near, setNear] = useState(!!saved.near); // 가까운 순
  const [picking, setPicking] = useState(false);   // 지도에서 집 고르는 중
  const [routeTo, setRouteTo] = useState(null);    // 집 → 이 장소 길 보기
  const pickRef = useRef(null);
  const [planBase, setPlanBase] = useState(saved.planBase || null);  // 30일 일정 출발 기준: 'arrive'(버스터미널) | 'home'(내 집) — 정하지 않으면 집이 있을 때 집
  const [askHome, setAskHome] = useState(false);   // '내 집'을 골랐는데 집 주소가 없을 때 안내
  const base = home && planBase !== 'arrive' ? 'home' : 'arrive';
  const wantHome = () => {
    setAskHome(true); setLow(false);
    if (card.current) card.current.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { const i = document.querySelector('.hp-box input'); if (i) i.focus(); }, 350);
  };
  const homeLayer = useRef(null);
  const setHome = (v) => { setHomeS(v); saveHome(who, v); if (v && askHome) { setAskHome(false); setPlanBase('home'); } };
  const host = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const card = useRef(null);
  const sideEl = useRef(null);
  // 휴대폰: 지도를 누르면(또는 아래로 끌면) 아래 패널을 내려 지도를 넓게
  const { low, setLow, justDragged } = useSheetDrag(sideEl, card, { peek: 72 });
  const shopLayer = useRef(null);
  /* 지도를 조용하게: 가게 핀은 처음엔 꺼 두고, 위 칩을 누르면 켭니다 */
  const [shops, setShops] = useState(false);
  const [phones, setPhones] = useState(false);
  const [foods, setFoods] = useState(false);
  /* 고향 음식점: 지구본에서 고른 나라의 음식점만 */
  const myFoods = country ? FOODS.filter((f) => f.c.includes(country.a2)) : [];
  /* 탭을 바꾸면 새 탭의 맨 위부터 보여 줍니다 */
  useEffect(() => { if (card.current) card.current.scrollTop = 0; }, [tab]);

  const todo = ((visa === 'E-9' ? LEGS : (byCode[visa] || {}).legs) || []).find((l) => l.key === 'arrive');
  const todoItems = todo ? todo.items : [];
  const todoDone = todoItems.filter((i) => checks[i.id]).length;
  const today = new Date();
  const recs = useMemo(() => recommend({ visa, town, needs, family }), [visa, town, needs, family]);
  const far = (r) => (r.p.place && dist[r.p.place] ? dist[r.p.place].m : Infinity);
  const groups = ['wonju', 'near', 'gangwon', 'national'].map((s) => {
    const rows = recs.filter((r) => r.p.scope === s);
    return { s, rows: near && home ? [...rows].sort((a, b) => far(a) - far(b)) : rows };
  }).filter((g) => g.rows.length);

  /* 지도 만들기 */
  useEffect(() => {
    const m = L.map(host.current, { zoomControl: false, attributionControl: true, maxZoom: 18 }).setView([WONJU.lat, WONJU.lng], 12);
    // 바탕 지도: 국내 지도 서비스처럼 밝은 벡터 지도 (안 되면 OpenStreetMap 그림 지도)
    let alive = true;
    addBase(m, () => alive);
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    shopLayer.current = L.layerGroup().addTo(m);
    map.current = m;
    homeLayer.current = L.layerGroup().addTo(m);
    /* 충분히 확대했을 때만 모든 핀에 이름표 (네이버 지도처럼) */
    const near = () => host.current && host.current.classList.toggle('is-near', m.getZoom() >= 15);
    m.on('zoomend', near); near();
    m.on('click', (e) => { if (pickRef.current) { pickRef.current(e.latlng); return; } setLow(true); setMoreOpen(false); }); // 지도 빈 곳을 누르면 패널 내리기 (핀을 누를 땐 그대로)
    const ro = new ResizeObserver(() => m.invalidateSize()); ro.observe(host.current); // 왼쪽 패널을 접고 펼 때 지도 크기 맞추기
    // 지도가 이미 닫혔으면(StrictMode 이중 실행·빠른 뒤로 가기) 움직이지 않습니다.
    const tm = setTimeout(() => { m.invalidateSize(); if (innerWidth <= 760) m.panBy([0, Math.round(innerHeight * 0.27)], { animate: false }); }, 50);
    return () => { alive = false; clearTimeout(tm); ro.disconnect(); m.remove(); };
  }, []);

  /* 집: 지도 표시(끌어서 옮기기) + 모든 장소까지 거리 */
  useEffect(() => {
    const lg = homeLayer.current; if (!lg) return;
    lg.clearLayers(); setRouteTo(null);
    if (!home) { setDist({}); return; }
    const mk = L.marker([home.lat, home.lng], { icon: homeIcon(), draggable: true, zIndexOffset: 1500, title: h.homeL }).addTo(lg);
    mk.bindTooltip(h.homeL, { direction: 'top', offset: [0, -16], className: 'home-tip' });
    mk.on('dragend', async () => { const p = mk.getLatLng(); setHome({ lat: p.lat, lng: p.lng, label: (await reverse(p.lat, p.lng, lang)) || h.picked }); });
    let ok = true;
    distances(home, PLACES).then((d) => { if (ok) setDist(d); });
    return () => { ok = false; };
  }, [home && home.lat, home && home.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 집 → 장소 길 보기 */
  useEffect(() => {
    const lg = homeLayer.current; if (!lg || !home || !routeTo) return;
    const pl = PLACES[routeTo]; if (!pl) return;
    let ok = true; const g = L.layerGroup().addTo(lg);
    roadPath(home, pl).then((path) => {
      if (!ok) return;
      L.polyline(path, { color: '#fff', weight: 9, opacity: 1, interactive: false }).addTo(g);
      L.polyline(path, { color: '#3182f6', weight: 5, opacity: 1, interactive: false }).addTo(g);
      map.current.flyToBounds(L.latLngBounds(path), { ...pad(), maxZoom: 15, duration: 0.8 });
    });
    return () => { ok = false; g.remove(); };
  }, [routeTo]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---------- 정착 로드맵: 체크하면 사람이 지도 위를 걸어갑니다 ----------
     · 출발점은 집 주소(정해 두었으면), 없으면 원주 버스터미널.
     · 다녀온 곳에는 작은 체크 표시가 남습니다. 체크를 풀면 표시도 사라집니다. */
  const walkLayer = useRef(null);
  const walker = useRef(null);
  const walkRun = useRef(0);
  const prevChecks = useRef(checks);
  const startPt = () => (home ? { lat: home.lat, lng: home.lng } : { lat: PLACES.terminal.lat, lng: PLACES.terminal.lng });
  /* 다녀온 곳 표시 + 사람 위치 다시 그리기 */
  const drawVisits = () => {
    const m = map.current; if (!m) return;
    if (!walkLayer.current) walkLayer.current = L.layerGroup().addTo(m);
    const lg = walkLayer.current; lg.clearLayers();
    todoItems.forEach((it) => {
      if (!checks[it.id]) return;
      const sp = spotOf(it.id, K); if (!sp) return;
      L.marker([sp.lat, sp.lng], { icon: visitIcon(), interactive: false, zIndexOffset: 800 }).addTo(lg);
    });
    const s = startPt();
    walker.current = L.marker([s.lat, s.lng], { icon: walkerIcon(), interactive: false, zIndexOffset: 2500 }).addTo(lg);
  };
  useEffect(() => { drawVisits(); }, [home && home.lat, home && home.lng, visa]); // eslint-disable-line react-hooks/exhaustive-deps
  async function walkTo(sp) {
    const m = map.current; if (!m || !walker.current) return;
    const my = ++walkRun.current;
    const from = startPt();
    walker.current.setLatLng([from.lat, from.lng]);
    setWalkMsg(fill(rmT.walking, { p: sp.name }));
    let path;
    try { path = await roadPath(from, sp); } catch (e) { path = null; }
    if (!path || path.length < 2) path = [L.latLng(from.lat, from.lng), L.latLng(sp.lat, sp.lng)];
    if (my !== walkRun.current) return;
    const trail = L.polyline([], { color: '#3182f6', weight: 4, opacity: .85, dashArray: '2 8', lineCap: 'round', interactive: false }).addTo(walkLayer.current);
    m.flyToBounds(L.latLngBounds(path), { ...pad(), maxZoom: 15, duration: 0.7 });
    await new Promise((res) => setTimeout(res, 750));
    const stepN = Math.max(1, Math.ceil(path.length / 60));
    for (let k = 0; k < path.length; k += stepN) {
      if (my !== walkRun.current) return;
      trail.addLatLng(path[k]); walker.current.setLatLng(path[k]);
      await new Promise((res) => setTimeout(res, 22));
    }
    const end = path[path.length - 1];
    trail.addLatLng(end); walker.current.setLatLng(end);
    L.marker(end, { icon: visitIcon(), interactive: false, zIndexOffset: 800 }).addTo(walkLayer.current);
    setTimeout(() => { if (my === walkRun.current) setWalkMsg(''); }, 1600);
  }
  /* 새로 체크한 항목에 갈 곳이 있으면 걸어가기 · 체크를 풀면 표시 정리 */
  useEffect(() => {
    const prev = prevChecks.current; prevChecks.current = checks;
    const newly = todoItems.filter((i) => checks[i.id] && !prev[i.id]);
    const unchecked = todoItems.some((i) => !checks[i.id] && prev[i.id]);
    if (unchecked) drawVisits();
    const sp = newly.map((i) => spotOf(i.id, K)).find(Boolean);
    if (sp && tab === 'todo') walkTo(sp);
  }, [checks]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 지도에서 집 고르기 */
  const startPick = () => {
    setPicking(true); setLow(true);
    pickRef.current = async (ll) => {
      pickRef.current = null; setPicking(false); setLow(false);
      setHome({ lat: ll.lat, lng: ll.lng, label: h.picked });
      const label = await reverse(ll.lat, ll.lng, lang);
      if (label) setHome({ lat: ll.lat, lng: ll.lng, label });
    };
  };
  const cancelPick = () => { pickRef.current = null; setPicking(false); };
  useEsc(cancelPick, picking);
  useEsc(() => setMoreOpen(false), moreOpen);
  const locate = () => {
    if (!navigator.geolocation) { alert(h.locFail); return; }
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const p = { lat: coords.latitude, lng: coords.longitude };
      setHome({ ...p, label: h.here });
      map.current && map.current.flyTo([p.lat, p.lng], 14, { duration: 0.8 });
      const label = await reverse(p.lat, p.lng, lang); if (label) setHome({ ...p, label });
    }, () => alert(h.locFail), { enableHighAccuracy: true, timeout: 10000 });
  };
  const setHomeFly = (v) => { setHome(v); map.current && map.current.flyTo([v.lat, v.lng], 14, { duration: 0.8 }); };

  /* 핀 — 추천된 사업이 있는 장소만 */
  useEffect(() => {
    const lg = layer.current; if (!lg) return;
    lg.clearLayers();
    const at = {};
    recs.forEach((r) => { if (r.p.place) (at[r.p.place] = at[r.p.place] || []).push(r.p); });
    // 도착 지점(버스터미널)은 늘 표시
    const arrive = PLACES.terminal;
    L.marker([arrive.lat, arrive.lng], { icon: pinIcon('#3d3d3d', arrive[K].split(' (')[0], false, 'bus') }).addTo(lg)
      .bindPopup(`<div class="pop"><b class="pop-t">${arrive[K]}</b><span class="pop-c">${t.toWonjuMove || ''}</span><span class="pop-a">${t.approx}</span></div>`);
    Object.entries(at).forEach(([k, ps]) => {
      const pl = PLACES[k]; if (!pl) return;
      const on = hi && ps.some((p) => p.id === hi);
      const color = CAT[ps[0].needs[0]] || '#1a73e8';
      const gl = ps[0].needs[0] === 'health' ? 'health' : 'gov';
      const mk = L.marker([pl.lat, pl.lng], { icon: pinIcon(color, pl[K].split(' (')[0] + (ps.length > 1 ? ' ' + ps.length : ''), on, gl), zIndexOffset: on ? 1000 : 0 }).addTo(lg);
      mk.bindPopup(`<div class="pop"><b class="pop-t">${pl[K]}</b>${pl.exact ? '' : `<span class="pop-a">${t.approx}</span>`}${dist[k] ? `<span class="pop-d">${h.fromHome} ${distText(dist[k], lang)}</span>` : ''}<ul>${ps.map((p) => `<li>${p[K].t}</li>`).join('')}</ul></div>`);
      mk.on('click', () => { setLow(false); setHi(ps[0].id); const el = document.getElementById('pg-' + ps[0].id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    });
  }, [recs, hi, K, dist]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 외국인 식료품점(🛒)·선불폰 매장(📱) 핀 (각각 켜고 끄기) */
  useEffect(() => {
    const lg = shopLayer.current; if (!lg) return;
    lg.clearLayers();
    const list = [...(shops ? SHOPS.map((x) => ({ ...x, g: 'cart', c: '#f08a00', cls: 'lf-shop', note: t.shopNote })) : []),
                  ...(phones ? PHONES.map((x) => ({ ...x, g: 'phone', c: '#4a6cf7', cls: 'lf-shop lf-phone' + (x.foreign ? ' lf-foreign' : ''), note: (x.foreign ? t.phoneForeign + '<br>' : '') + t.phoneNote })) : []),
                  ...(foods ? myFoods.map((x) => ({ ...x, g: 'bowl', c: '#f5403d', cls: 'lf-shop lf-food', note: (x.native ? t.foodNative + '<br>' : '') + t.foodNote })) : [])];
    list.forEach((sh) => {
      const c = sh[K];
      L.marker([sh.lat, sh.lng], { icon: poi(sh.cls, sh.c, sh.g, c.t, false), title: c.t }).addTo(lg)
        .bindPopup(`<div class="pop"><b class="pop-t">${c.t}</b><span class="pop-c">${c.what}</span><span class="pop-a">${c.addr}</span><span class="pop-btns">${sh.tel ? `<a href="tel:${sh.tel.replace(/[^0-9]/g, '')}">${sh.tel}</a>` : ''}<a href="${sh.url}" target="_blank" rel="noopener noreferrer">${t.kakaoMap}</a></span><small>${sh.unsure ? t.shopUnsure + '<br>' : ''}${sh.note}</small></div>`);
    });
  }, [shops, phones, foods, country, K]); // eslint-disable-line react-hooks/exhaustive-deps
  const showShops = () => {
    if (shops) { setShops(false); return; }
    setShops(true);
    map.current && map.current.flyToBounds(L.latLngBounds(SHOPS.filter((x) => x.town === 'wonju').map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showPhonesOn = () => {
    setPhones(true);
    map.current && map.current.flyToBounds(L.latLngBounds(PHONES.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showPhones = () => {
    if (phones) { setPhones(false); return; }
    setPhones(true);
    map.current && map.current.flyToBounds(L.latLngBounds(PHONES.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showFoods = () => {
    if (!myFoods.length) return;
    if (foods) { setFoods(false); return; }
    setFoods(true);
    map.current && map.current.flyToBounds(L.latLngBounds(myFoods.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9, maxZoom: 15 });
  };
  const flyPlace = (k) => { const pl = PLACES[k]; if (pl && map.current) map.current.flyTo([pl.lat, pl.lng], 15, { duration: 0.9 }); };
  const flyTo = (p) => {
    setHi(p.id);
    const pl = p.place && PLACES[p.place]; if (!pl || !map.current) return;
    map.current.flyTo([pl.lat, pl.lng], p.scope === 'wonju' ? 14 : 11, { duration: 0.9 });
  };
  const allGW = () => map.current && map.current.flyToBounds(L.latLngBounds(Object.values(PLACES).map((p) => [p.lat, p.lng])).pad(0.1), { ...pad(), duration: 1 });
  const pad = () => (innerWidth > 760 ? { paddingTopLeft: [40, 80], paddingBottomRight: [60, 30] } : { paddingBottomRight: [0, innerHeight * 0.55] });
  const goWonju = () => map.current && map.current.flyToBounds(L.latLngBounds([[37.30, 127.80], [37.38, 128.0]]), { ...pad(), duration: 0.9 });
  /* 조건·일정 열림 상태 저장 */
  useEffect(() => { uset(who, 'settle', { visa, town, needs, family, near, planBase }); }, [visa, town, needs, family, near, planBase]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { uset(who, 'planOpen', plan > 0); }, [plan]); // eslint-disable-line react-hooks/exhaustive-deps
  /* 일정을 보던 중이었으면 다시 열어 둡니다 (AI 결과는 저장해 둔 것을 바로 보여 줌) */
  useEffect(() => { if (wasOpen.current && !planGo) { const tm = setTimeout(() => { if (map.current) { setLow(true); setPlan(1); } }, 400); return () => clearTimeout(tm); } return undefined; }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 왼쪽 메뉴의 '30일 일정' → 바로 AI 일정 시작 */
  useEffect(() => { if (planGo > 0 && map.current) { setLow(true); setPlan((x) => x + 1); } }, [planGo]); // eslint-disable-line react-hooks/exhaustive-deps
  const tog = (n) => setNeeds((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n]));

  const whyLabel = (w) => {
    if (w === 'wonju') return t.rWonju;
    if (w === 'gangwon') return t.rGangwon;
    if (w === 'town') return t.rTown;
    if (w === 'visa') return fill(t.rVisa, { v: visa });
    if (w === 'fresh') return t.rFresh;
    if (w.startsWith('need:')) { const n = NEEDS.find((x) => x.id === w.slice(5)); return n ? n[K] : ''; }
    return '';
  };

  return (
    <div className={'settle' + (low ? ' is-low' : '') + (plan ? ' is-plan' : '') + (picking ? ' is-pick' : '')}>
      <div className="lf" ref={host} />

      <aside ref={sideEl} className={'side st-side' + (low ? ' is-low' : '')} onClick={() => { if (low && !justDragged.current) setLow(false); }}>
        <span className="st-grip" aria-hidden="true" />
        <div className="card st-card" ref={card}>
          <div className="st-top">
            <button type="button" className="icon" onClick={onBack} aria-label={t.toGlobe} title={t.toGlobe}><Icon n="back" size={20} /></button>
            <div><b>{t.settleT}</b><small>{t.settleSub}</small></div>
          </div>
          {name && <p className="st-hello">✈ {name.toUpperCase()} · {visa}</p>}

          <div className="st-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'todo'} onClick={() => setTab('todo')}>{t.tabTodo}<span>{todoDone}/{todoItems.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === 'find'} onClick={() => setTab('find')}>{t.tabFind}</button>
          </div>

          {tab === 'todo' && (
            <div className="st-todo">
              <p className="st-todo-intro">{t.todoIntro}</p>
              {(() => {
                const ratio = todoItems.length ? todoDone / todoItems.length : 0;
                return (
                  <div className="rm-level">
                    <div className="rm-level-h"><span>{rmT.level}</span><b>{Math.round(ratio * 100)}%</b></div>
                    <p className="rm-level-t">{rmT[levelOf(ratio)]}</p>
                    <div className="st-prog"><i style={{ width: Math.round(ratio * 100) + '%' }} /></div>
                    <p className="rm-home">
                      <Icon n="life" size={15} />
                      {home ? <span><b>{home.label || h.picked}</b> · {rmT.fromHome}</span> : <span>{rmT.noHome}</span>}
                      {!home && <button type="button" onClick={() => setTab('find')}>{rmT.setHome}</button>}
                    </p>
                    {walkMsg && <p className="rm-walk" role="status">{walkMsg}</p>}
                  </div>
                );
              })()}
              <ol className="legs rm">
                {(() => {
                  const groups = STAGES.map((id) => ({ id, items: todoItems.filter((it) => stageOf(it) === id) })).filter((g) => g.items.length);
                  const cur = groups.findIndex((g) => g.items.some((it) => !checks[it.id]));
                  return groups.map((g, gi) => {
                    const d = g.items.filter((it) => checks[it.id]).length;
                    const all = d === g.items.length;
                    return (
                      <li key={g.id} className={'leg rm-stage' + (gi === cur ? ' is-on' : '') + (all ? ' is-done' : '')}>
                        <div className="leg-h">
                          <span className="leg-n">{all ? '✓' : gi + 1}</span>
                          <b>{rmT[g.id]}</b>
                          {gi === cur && <em className="rm-now">{rmT.now}</em>}
                          <small>{d}/{g.items.length}</small>
                        </div>
                        <ul className="items">
                          {g.items.map((it) => {
                            const pk = pinOf(it.id);
                            return (
                              <CheckItem key={it.id} it={it} lang={lang} entry={entry} today={today} checked={!!checks[it.id]} toggle={toggle}
                                         extraBtn={it.id === 'sim' || it.id.endsWith('-sim')
                                           ? <button type="button" className="st-pin" title={t.phonesBtn} onClick={showPhonesOn}><Icon n="mobile" size={14} />{t.onMap}</button>
                                           : pk && PLACES[pk] ? <button type="button" className="st-pin" title={PLACES[pk][K]} onClick={() => flyPlace(pk)}><Icon n="pin" size={14} />{t.onMap}</button> : null} />
                            );
                          })}
                        </ul>
                      </li>
                    );
                  });
                })()}
              </ol>
              {visa === 'E-9' && (country ? (
                <section className="st-country">
                  <h3>{fill(t.ctryMore, { c: countryLabel })}</h3>
                  {(country.ret || country.nps) && (
                    <dl className="rp-meta">
                      {country.ret && <div><dt>{t.retL}</dt><dd>{country.ret[K]}</dd></div>}
                      {country.nps && <div><dt>{t.npsL}</dt><dd>{country.nps[K]}</dd></div>}
                    </dl>
                  )}
                  {country.stay && country.stay[K].length
                    ? <ul className="extra">{country.stay[K].map((x, i) => <li key={i}>{x}</li>)}</ul>
                    : <p className="extra-none">{t.ctryNone}</p>}
                  {country.stayLv === 'summary' && <p className="extra-none">{t.lvNote}</p>}
                </section>
              ) : <p className="st-country-pick"><Icon n="globe" size={16} />{t.ctryPick}</p>)}
              <button type="button" className="st-next" onClick={() => setTab('find')}><span>{t.tabFindGo}</span><Icon n="next" size={18} /></button>
            </div>
          )}

          {tab === 'find' && <>
          <HomePicker lang={lang} home={home} onSet={setHomeFly} onClear={() => setHome(null)} onPickMap={startPick} onLocate={locate} near={near} setNear={setNear} />

          <div className="st-stats">
            {STATS.map((s, i) => <div key={i}><b>{s.n}</b><span>{s[K]}</span></div>)}
          </div>

          <div className="st-form">
            <label><span>{t.myVisa}</span>
              <select value={visa} onChange={(e) => setVisa(e.target.value)}>{VISAS.map((v) => <option key={v.code} value={v.code}>{v.code} · {v.name[K]}</option>)}</select></label>
            <label><span>{t.myTown}</span>
              <select value={town} onChange={(e) => setTown(e.target.value)}>{TOWNS.map((x) => <option key={x.id} value={x.id}>{x[K]}</option>)}</select></label>
            <div className="st-needs"><span>{t.myNeeds}</span>
              <div>{NEEDS.map((n) => <button type="button" key={n.id} className={'chip' + (needs.includes(n.id) ? ' is-on' : '')} aria-pressed={needs.includes(n.id)} onClick={() => tog(n.id)}><Icon n={n.id === 'korean' ? 'ko' : n.id} size={15} />{n[K]}</button>)}</div>
            </div>
            <label className="st-fam"><input type="checkbox" checked={family} onChange={(e) => setFamily(e.target.checked)} /> {t.withFamily}</label>
          </div>

          <div className="pb-base">
            <span>{h.baseL}</span>
            <div className="pb-seg" role="radiogroup" aria-label={h.baseL}>
              <button type="button" role="radio" aria-checked={base === 'arrive'} onClick={() => { setAskHome(false); setPlanBase('arrive'); }}><Icon n="bus" size={15} />{h.baseArrive}</button>
              <button type="button" role="radio" aria-checked={base === 'home'} onClick={() => (home ? setPlanBase('home') : wantHome())}><Icon n="life" size={15} />{h.baseHome}</button>
            </div>
            <small className={askHome && !home ? 'warn' : ''}>{askHome && !home ? h.baseNeed : base === 'home' ? fill(h.baseHomeSub, { home: home.label }) : h.baseArriveSub}</small>
          </div>
          <PlanButton lang={lang} onClick={(e) => { e.stopPropagation(); setLow(true); setPlan((n) => n + 1); }} />

          <p className="st-count">{fill(t.results, { n: recs.length })}</p>
          {!recs.length && <p className="st-none">{t.none}</p>}

          {groups.map((g) => (
            <section key={g.s} className={'st-g sc-' + g.s}>
              <h3>{SCOPE[g.s][K]}<span>{g.rows.length}</span></h3>
              {g.rows.map(({ p, why }) => {
                const c = p[K];
                return (
                  <article key={p.id} id={'pg-' + p.id} className={'pg' + (hi === p.id ? ' is-on' : '')} onClick={() => flyTo(p)}>
                    <div className="pg-h">
                      <b>{c.t}</b>
                      {p.fresh && <em className="pg-new">{t.newB}</em>}
                    </div>
                    <p>{c.what}</p>
                    <dl>
                      <div><dt>{t.whoL}</dt><dd>{c.who}</dd></div>
                      <div><dt>{t.whenL}</dt><dd>{c.when}</dd></div>
                    </dl>
                    {home && p.place && dist[p.place] && (
                      <div className="pg-dist"><Icon n="life" size={14} /><span>{h.fromHome} <b>{distText(dist[p.place], lang)}</b></span>
                        <button type="button" className={routeTo === p.place ? 'is-on' : ''} onClick={(e) => { e.stopPropagation(); setHi(p.id); setRouteTo((x) => (x === p.place ? null : p.place)); }}><Icon n="route" size={14} />{h.route}</button></div>
                    )}
                    <ul className="pg-why">{why.map((w) => whyLabel(w) && <li key={w}>{whyLabel(w)}</li>)}</ul>
                    <div className="pg-act">
                      {p.tel && <a href={'tel:' + p.tel.replace(/[^0-9]/g, '')} onClick={(e) => e.stopPropagation()}><Icon n="call" size={15} />{p.tel}</a>}
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Icon n="link" size={15} />{t.site}</a>}
                      {p.place && <button type="button" onClick={(e) => { e.stopPropagation(); flyTo(p); }}><Icon n="pin" size={15} />{t.onMap}</button>}
                    </div>
                    <small className="pg-src">{p.org} · {t.srcL}: {SOURCES[p.src]}</small>
                  </article>
                );
              })}
            </section>
          ))}
          </>}
          <p className="rp-note">{t.checkedOn}</p>
        </div>
      </aside>

      {plan > 0 && map.current && (
        <Plan key={plan} who={who} map={map.current} lang={lang} visa={visa} needs={needs} family={family} entry={entry || new Date()}
              name={name} country={countryLabel || ''} home={home} dist={dist} base={base}
              onBase={(b) => { if (b === 'home' && !home) { setPlan(0); wantHome(); return; } setPlanBase(b); setPlan((n) => n + 1); }} onClose={() => setPlan(0)} />
      )}

      {picking && (
        <div className="pick-bar" role="status" onClick={(e) => e.stopPropagation()}>
          <Icon n="pin" size={18} /><b>{h.pickT}</b>
          <button type="button" onClick={cancelPick}>{h.cancel}</button>
        </div>
      )}

      {/* 지도 위 카테고리 칩 (네이버 지도처럼 흰 알약 + 색 아이콘, 넘치면 … 더보기) */}
      <div className="cats" onClick={(e) => e.stopPropagation()}>
        <button type="button" className={'cat' + (shops ? ' is-on' : '')} style={{ '--c': '#f08a00' }} aria-pressed={shops} onClick={showShops}><Icon n="cart" size={18} />{t.shopsBtn}</button>
        <button type="button" className={'cat' + (phones ? ' is-on' : '')} style={{ '--c': '#4a6cf7' }} aria-pressed={phones} onClick={showPhones}><Icon n="mobile" size={18} />{t.phonesBtn}</button>
        <button type="button" className={'cat' + (foods && myFoods.length ? ' is-on' : '')} style={{ '--c': '#f5403d' }} aria-pressed={foods && myFoods.length > 0} disabled={!myFoods.length}
                title={!country ? t.foodPick : !myFoods.length ? fill(t.foodNone, { c: countryLabel }) : ''} onClick={showFoods}>
          <Icon n="bowl" size={18} />{myFoods.length ? fill(t.foodOf, { c: countryLabel, n: myFoods.length }) : t.foodBtn.split(' (')[0]}
        </button>
        <div className="cat-more">
          <button type="button" className="cat cat-dots" aria-label={n.more} aria-expanded={moreOpen} onClick={() => setMoreOpen((o) => !o)}><span /><span /><span /></button>
          {moreOpen && (
            <div className="cat-menu" role="menu">
              <button type="button" role="menuitem" onClick={() => { goWonju(); setMoreOpen(false); }}><Icon n="pin" size={18} style={{ color: '#03c75a' }} />{n.wonjuL}</button>
              <button type="button" role="menuitem" onClick={() => { allGW(); setMoreOpen(false); }}><Icon n="globe" size={18} style={{ color: '#2c7ff7' }} />{n.gwL}</button>
              <button type="button" role="menuitem" onClick={() => { flyPlace('terminal'); setMoreOpen(false); }}><Icon n="bus" size={18} style={{ color: '#3d3d3d' }} />{n.terminalL}</button>
              <button type="button" role="menuitem" onClick={() => { flyPlace('cityhall'); setMoreOpen(false); }}><Icon n="culture" size={18} style={{ color: '#1a73e8' }} />{PLACES.cityhall[K]}</button>
              <button type="button" role="menuitem" onClick={() => { flyPlace('nhis'); setMoreOpen(false); }}><Icon n="health" size={18} style={{ color: '#f5403d' }} />{PLACES.nhis[K].split(' (')[0]}</button>
              <button type="button" role="menuitem" onClick={() => { flyPlace('munmak'); setMoreOpen(false); }}><Icon n="work" size={18} style={{ color: '#f08a00' }} />{PLACES.munmak[K]}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

