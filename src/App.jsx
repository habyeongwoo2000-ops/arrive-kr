/* ArriveKR — 지구본에서 나라를 누르면 한국까지 경로가 그려지고,
   경로 위 구간마다 준비할 서류·기한(연료)을, 위험한 곳은 난기류로 보여 줍니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import { geoCentroid, geoInterpolate, geoDistance, geoBounds } from 'd3-geo';
import world from 'world-atlas/countries-110m.json';
import GlobeView from './components/GlobeView.jsx';
import RoutePanel from './components/RoutePanel.jsx';
import Tutor from './components/Tutor.jsx';
import AuthDialog from './components/AuthDialog.jsx';
import BoardingPass, { a2Of } from './components/BoardingPass.jsx';
import ViewToggle from './components/ViewToggle.jsx';
import useSheetDrag from './useSheetDrag.js';
import Settle from './components/Settle.jsx';
import Icon from './components/Icon.jsx';
import MyPage, { MySummary } from './components/MyPage.jsx';
import { nav } from './i18n/nav.js';
import { byCode } from './data/visas.js';
import { WONJU } from './data/wonju.js';
import { COUNTRIES, KOREA, byIso } from './data/countries.js';
import { LEGS, TURBULENCE, GENERAL } from './data/route.js';
import { LANGS, LANG_NAMES, ui, tx, fill, countryName } from './i18n/ui.js';
import { get, set, del, uget, uset, adoptGuest } from './lib/store.js';
import { current, signOut, nickOf, finishKakao } from './lib/auth.js';

const FEATURES = feature(world, world.objects.countries).features.filter((f) => f.id !== '010'); // 남극 제외
const SENDING = new Set(COUNTRIES.map((c) => c.iso));
const DAY = 86400000;
const QS = new URLSearchParams(location.search);
const GROUND = (() => { // 인천 → 원주 (땅 위 길)
  const ip = geoInterpolate([KOREA.city[1], KOREA.city[0]], [WONJU.lng, WONJU.lat]);
  return Array.from({ length: 21 }, (_, k) => { const [lng, lat] = ip(k / 20); return [lat, lng, 0.002]; });
})();

function pickLang() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  const s = get('lang'); if (LANGS.includes(s)) return s;
  const n = (navigator.language || 'en').slice(0, 2);
  return LANGS.includes(n) ? n : 'en';
}

/* 출발지 → 인천 경로 점들 [위도, 경도, 고도] */
function buildPath(from) {
  const a = [from[1], from[0]], b = [KOREA.city[1], KOREA.city[0]];
  const ip = geoInterpolate(a, b);
  const dist = geoDistance(a, b);
  const top = Math.min(0.5, Math.max(0.07, dist * 0.32));
  const pts = [];
  for (let k = 0; k <= 160; k++) { const tt = k / 160; const [lng, lat] = ip(tt); pts.push([lat, lng, top * Math.sin(Math.PI * tt) + 0.004]); }
  return { pts, at: (tt) => { const [lng, lat] = ip(Math.max(0, Math.min(1, tt))); return { lat, lng, alt: top * Math.sin(Math.PI * tt) + 0.004 }; }, dist };
}
const bearing = (p, q) => {
  const r = Math.PI / 180, y = Math.sin((q.lng - p.lng) * r) * Math.cos(q.lat * r);
  const x = Math.cos(p.lat * r) * Math.sin(q.lat * r) - Math.sin(p.lat * r) * Math.cos(q.lat * r) * Math.cos((q.lng - p.lng) * r);
  return (Math.atan2(y, x) / r + 360) % 360;
};

export default function App() {
  const [lang, setLangS] = useState(pickLang);
  const t = ui(lang);
  const n = nav(lang);
  const [fold, setFold] = useState(false);          // PC: 왼쪽 패널 접기
  /* PC: 왼쪽 패널 너비 — 오른쪽 가장자리를 끌어서 조절 (300~560px, 이 기기에 기억) */
  const PW_MIN = 300, PW_MAX = 560, PW_DEF = 360;
  const [panelW, setPanelW] = useState(() => { try { const v = +localStorage.getItem('ui.panelW'); return v ? Math.min(PW_MAX, Math.max(PW_MIN, v)) : PW_DEF; } catch (e) { return PW_DEF; } });
  const rz = useRef(null);
  const savePW = (v) => { try { localStorage.setItem('ui.panelW', String(Math.round(v))); } catch (e) { /* 무시 */ } };
  const rzDown = (e) => { e.preventDefault(); rz.current = { x: e.clientX, w: panelW }; e.currentTarget.setPointerCapture(e.pointerId); document.body.classList.add('is-rz'); };
  const rzMove = (e) => { if (rz.current) setPanelW(Math.min(PW_MAX, Math.max(PW_MIN, rz.current.w + e.clientX - rz.current.x))); };
  const rzUp = () => { if (!rz.current) return; rz.current = null; document.body.classList.remove('is-rz'); setPanelW((v) => { savePW(v); return v; }); };
  const [planGo, setPlanGo] = useState(0);         // 메뉴 '30일 일정' → 정착 화면에서 바로 AI 일정 시작
  const [mode, setModeS] = useState(() => uget(current(), 'mode', 'sat'));
  const [sel, setSel] = useState(null);           // world-atlas feature
  const [query, setQuery] = useState('');
  const [openList, setOpenList] = useState(false);
  const [user, setUser] = useState(current);
  const [authOpen, setAuthOpen] = useState(false);
  const [tutorOpen, setTutorOpen] = useState(false);
  const [activeLeg, setActiveLeg] = useState(-1);
  const [flying, setFlying] = useState(false);
  const [turb, setTurb] = useState(null);
  const [shake, setShake] = useState(false);
  const [focus, setFocus] = useState(null);
  const [toast, setToast] = useState('');
  const [view, setView] = useState(() => (QS.get('settle') ? 'settle' : 'globe'));      // globe | settle | me  (새로고침해도 마지막 화면으로 — 아래 복원 · ?settle=todo|find 는 모바일 미리보기용)
  const [settleTab, setSettleTabS] = useState(() => (QS.get('settle') ? (QS.get('settle') === 'find' ? 'find' : 'todo') : uget(current(), 'settleTab', 'todo'))); // todo | find
  const [landed, setLanded] = useState(false);
  const api = useRef(null);
  const flight = useRef(null);
  const shakeTimer = useRef(0);
  /* "알겠어요" — 흔들림과 멈춤을 바로 끝내고 비행을 이어 갑니다 */
  function endTurb() {
    clearTimeout(shakeTimer.current);
    setTurb(null); setShake(false);
    if (flight.current) flight.current.pauseUntil = 0;
  }

  const setLang = (l) => { setLangS(l); set('lang', l); };
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  /* 사용자별 저장 (로그인 안 하면 guest) */
  const who = user || 'guest';
  const [checks, setChecks] = useState(() => get('u.' + who + '.checks', {}));
  const [entry, setEntryS] = useState(() => { const v = get('u.' + who + '.entry'); return v ? new Date(v + 'T00:00:00') : new Date(new Date().setHours(0, 0, 0, 0) + 365 * DAY); });
  useEffect(() => {
    setChecks(get('u.' + who + '.checks', {}));
    const v = get('u.' + who + '.entry'); if (v) setEntryS(new Date(v + 'T00:00:00'));
    setVisaS(get('u.' + who + '.visa', 'E-9')); setPax(get('u.' + who + '.name', ''));
    setModeS(uget(who, 'mode', 'sat')); setSettleTabS(uget(who, 'settleTab', 'todo'));
    const c = get('u.' + who + '.country'); if (c) { const f = FEATURES.find((x) => x.id === c); if (f) choose(f, false); }
  }, [who]); // eslint-disable-line react-hooks/exhaustive-deps
  const [visa, setVisaS] = useState(() => { const q = QS.get('visa'); return byCode[q] ? q : get('u.' + who + '.visa', 'E-9'); });
  const [pax, setPax] = useState(() => get('u.' + who + '.name', ''));
  const [ticket, setTicket] = useState(() => !QS.get('skip') && !uget(current(), 'boarded', false));
  // 처음 탑승권은 비자를 고르지 않은 상태 · 탑승한 뒤 다시 열면 그 비자 그대로
  const [ticketVisa, setTicketVisa] = useState(() => (uget(current(), 'boarded', false) ? visa : null));
  const setVisa = (v) => { setVisaS(v); set('u.' + who + '.visa', v); };
  const setMode = (m) => { setModeS(m); uset(who, 'mode', m); };
  const setSettleTab = (x) => { setSettleTabS(x); uset(who, 'settleTab', x); };
  const boarded = () => uset(who, 'boarded', true);
  /* 지금 화면(지구본/정착)을 기억 → 새로고침·다른 앱에 다녀와도 그 화면으로 */
  const lastView = useRef(uget(current(), 'view', 'globe'));   // 지난번 화면 (저장하기 전에 읽어 둠)
  useEffect(() => { if (lastView.current === 'settle' && !QS.get('from')) setTimeout(() => openSettle(uget(who, 'settleTab', 'todo')), 300); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { uset(who, 'view', view); }, [view]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = (id) => setChecks((c) => { const n = { ...c, [id]: !c[id] }; set('u.' + who + '.checks', n); return n; });
  const setEntry = (d) => { setEntryS(d); set('u.' + who + '.entry', d.toISOString().slice(0, 10)); };

  /* 지금 고른 나라 */
  const country = sel ? byIso[sel.id] : null;
  const isKorea = sel && sel.id === KOREA.iso;
  /* 휴대폰: 나라를 고르면 뜨는 경로 패널도 끌어서 내리기 · 올리기 (내려가면 비자 줄만 보임) */
  const panelEl = useRef(null);
  const sheet = useSheetDrag(panelEl, panelEl, { peek: 54, active: !!(sel && !isKorea) });
  useEffect(() => { sheet.setLow(false); }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  // 지구본의 모든 나라 이름을 사용자가 고른 언어로 (코드가 없는 지역은 직접 번역한 이름)
  const labelOf = (f) => countryName(a2Of(f), lang, f.properties.name);
  FEATURES.forEach((f) => { f.properties.label = labelOf(f); });
  const vObj = byCode[visa] || byCode['E-9'];
  const eps = visa === 'E-9';
  const allLegs = eps ? (country ? LEGS : GENERAL) : vObj.legs;
  /* "한국 도착 후"는 지구본 경로가 아니라 원주 정착 화면의 "도착 후 할 일" 탭에서 봅니다 */
  const legs = useMemo(() => allLegs.filter((l) => l.key !== 'arrive'), [allLegs]);
  /* 원주 정착 화면과 같은 기준: E-9는 상세 목록, 다른 비자는 그 비자의 도착 후 목록 */
  const arriveLeg = (eps ? LEGS : vObj.legs).find((l) => l.key === 'arrive');
  const arriveSum = arriveLeg ? { total: arriveLeg.items.length, done: arriveLeg.items.filter((i) => checks[i.id]).length } : null;
  /* 내 정보 · 첫 화면 요약에 쓰는 "내가 저장해 둔 것" */
  const preItems = legs.flatMap((l) => l.items);
  const savedHome = uget(who, 'home') || (who === 'guest' ? get('home', null) : null);   // Settle 와 같은 규칙
  const savedSettle = uget(who, 'settle', {});
  const meData = {
    user: user ? nickOf(user) : null, name: pax || (user ? nickOf(user) : ''), visa, visaName: tx(vObj.name, lang),
    countryLabel: sel && !isKorea ? labelOf(sel) : '', entry,
    pre: sel && !isKorea ? { done: preItems.filter((i) => checks[i.id]).length, total: preItems.length } : null,
    arrive: arriveSum, home: savedHome && isFinite(savedHome.lat) ? savedHome : null,
    needs: savedSettle.needs || null, family: !!savedSettle.family, town: savedSettle.town || 'wonju'
  };
  meData.has = !!(pax || (sel && !isKorea) || Object.values(checks).some(Boolean) || meData.home);

  const extra = eps && country ? (country.extra[lang === 'ko' ? 'ko' : 'en'] || []) : [];
  const start = sel && !isKorea ? (country ? country.city : (([lng, lat]) => [lat, lng])(geoCentroid(sel))) : null;
  const route = useMemo(() => (start ? buildPath(start) : null), [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  const turbs = useMemo(() => {
    if (!sel || isKorea) return [];
    const base = country && eps ? TURBULENCE : TURBULENCE.filter((_, k) => k === 0 || k === 4 || k === 5);
    const own = country && eps ? country.turb.map((x, k) => ({ at: 0.27 + k * 0.04, sev: 2, t: { ko: x.ko, en: x.en }, d: { ko: x.ko, en: x.en }, own: true })) : [];
    return [...base, ...own].sort((a, b) => a.at - b.at);
  }, [sel, visa]); // eslint-disable-line react-hooks/exhaustive-deps

  const paths = useMemo(() => (route ? [{ pts: route.pts }, { pts: GROUND, kind: 'ground' }] : []), [route]);
  const marks = useMemo(() => {
    const wj = { kind: 'wonju', lat: WONJU.lat, lng: WONJU.lng, alt: 0.012, label: lang === 'ko' ? '원주 WONJU' : 'WONJU 원주' };
    if (!route) return [wj];
    const m = [wj, { kind: 'start', ...route.at(0), alt: 0.01, label: labelOf(sel) }, { kind: 'end', ...route.at(1), alt: 0.01, label: 'ICN' }];
    legs.forEach((l, i) => m.push({ kind: 'leg', ...route.at(l.at), n: i + 1, idx: i, label: tx(l.name, lang), active: i === activeLeg, done: l.items.every((it) => checks[it.id]) }));
    turbs.forEach((x, i) => m.push({ kind: 'turb', ...route.at(x.at), idx: i, label: tx(x.t, lang) }));
    return m;
  }, [route, legs, turbs, lang, activeLeg, checks, visa]); // eslint-disable-line react-hooks/exhaustive-deps

  function choose(f, save = true) {
    stopFlight();
    setSel(f); setActiveLeg(-1); setTurb(null); setOpenList(false); setQuery(''); setLanded(false);
    markBack('sel'); // 뒤로가기 → 나라 선택 해제
    if (save) set('u.' + who + '.country', f.id);
    if (f.id === KOREA.iso) { setFocus({ lat: KOREA.city[0], lng: KOREA.city[1], altitude: 1.6 }); return; }
    // 고른 나라로 확대: 나라 가운데로 가고, 나라 크기에 맞춰 높이를 정합니다(작은 나라는 가까이, 큰 나라는 멀리)
    const [[w0, s0], [e0, n0]] = geoBounds(f);
    const ctr = geoCentroid(f);
    const dLng = ((e0 - w0) + 360) % 360 || 360;                   // 날짜변경선을 넘는 나라(러시아 등)도 계산
    const span = Math.max(n0 - s0, dLng * Math.cos((ctr[1] * Math.PI) / 180));
    const phone = innerWidth <= 760;
    // 휴대폰은 화면이 좁아 더 멀리서 보고, 아래 패널이 화면 아래쪽을 가리므로 나라가 위쪽에 오게 카메라를 조금 남쪽으로
    // 작은 나라도 너무 붙지 않게 최소 높이를 넉넉히(주변 나라·바다가 조금 보이도록)
    const alt = Math.max(phone ? 1.0 : 0.7, Math.min(2.6, (span / 38 + 0.4) * (phone ? 1.6 : 1)));
    const down = phone ? alt * 11 : 0;
    setFocus({ lat: Math.max(-80, ctr[1] - down), lng: ctr[0], altitude: alt });
  }

  /* ---------- 비행: 체크할 때마다 앞으로 ----------
     "비행 시작"을 누르면 비행기가 지금까지 끝낸 만큼의 자리에 나타나고, 그다음부터는
     체크 항목을 하나 끝낼 때마다 그만큼 앞으로 날아갑니다(체크를 풀면 뒤로).
     구간 하나를 다 끝내면 그 구간 표시에 닿고, 모두 끝내면 인천에 내려 원주로 갑니다.
     가는 길에 난기류 지점을 지나면 예전처럼 흔들리며 경고 카드가 뜹니다. */
  const [flightOn, setFlightOn] = useState(false);
  const progressOf = (lg, ck) => {
    const items = lg.flatMap((l) => l.items);
    const total = items.length;
    const done = items.filter((i) => ck[i.id]).length;
    if (!total) return 0;
    if (done >= total) return 1;
    let before = 0;
    for (let j = 0; j < lg.length; j++) {
      const n = lg[j].items.length;
      const a = j === 0 ? 0 : lg[j - 1].at, b = lg[j].at;
      if (done < before + n || j === lg.length - 1) return a + (b - a) * Math.min(1, (done - before) / (n || 1));
      before += n;
    }
    return 0;
  };
  function stopFlight() {
    if (flight.current) cancelAnimationFrame(flight.current.raf);
    flight.current = null; setFlying(false); setShake(false); setFlightOn(false);
    api.current && api.current.setPlane(null);
  }
  /* 비행기를 from → to 로 옮깁니다 (지나는 난기류에서 잠깐 멈추고 흔들림) */
  function moveTo(to, opts = {}) {
    const { route, legs, turbs } = live.current;
    if (!route || !api.current) return;
    const prev = flight.current;
    if (prev) cancelAnimationFrame(prev.raf);
    const from = prev ? prev.t : to;
    const st = { t: from, from, to, start: performance.now(), pauseUntil: 0, raf: 0, hd: prev ? prev.hd : 0 };
    flight.current = st;
    const span = Math.abs(to - from);
    const DUR = opts.instant || span < 1e-4 ? 0 : Math.min(3600, 900 + span * 9000);
    const fwd = to > from;
    const passing = fwd ? turbs.filter((x) => x.at > from && x.at <= to) : [];
    let k = 0;
    setFlying(DUR > 0);
    const step = (now) => {
      if (flight.current !== st) return;
      if (now < st.pauseUntil) {
        const p = route.at(st.t); api.current.setPlane({ ...p, heading: st.hd + Math.sin(now / 40) * 9, alt: p.alt + Math.sin(now / 55) * 0.004 });
        st.start += 16; st.raf = requestAnimationFrame(step); return;
      }
      const r = DUR ? Math.min(1, (now - st.start) / DUR) : 1;
      const e = r < 0.5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2;
      st.t = from + (to - from) * e;
      const p = route.at(st.t), q = route.at(Math.min(1, st.t + (fwd ? 0.01 : -0.01)));
      if (Math.abs(q.lat - p.lat) + Math.abs(q.lng - p.lng) > 1e-6) st.hd = fwd ? bearing(p, q) : bearing(q, p);
      api.current.setPlane({ ...p, heading: st.hd });
      if (DUR) api.current.look({ lat: p.lat, lng: p.lng, altitude: 1.35 }, 0);
      const li = legs.reduce((a, l, i) => (st.t >= l.at - 0.04 ? i : a), -1);
      setActiveLeg(li);
      const tb = passing[k];
      if (tb && st.t >= tb.at) {
        k++; st.pauseUntil = now + 2600 + tb.sev * 300;
        setTurb(tb); setShake(true);
        clearTimeout(shakeTimer.current);
        shakeTimer.current = setTimeout(() => setShake(false), 2600 + tb.sev * 300);
      }
      if (r < 1) { st.raf = requestAnimationFrame(step); return; }
      setFlying(false);
      if (to >= 1) {   // 모두 끝냄 → 인천 착륙 → 원주
        setTimeout(() => { if (!api.current || flight.current !== st) return; api.current.setPlane(null); setTurb(null); setShake(false); setFlightOn(false); flight.current = null; api.current.look({ lat: WONJU.lat - 0.25, lng: WONJU.lng - 0.3, altitude: 0.22 }, 2200); setLanded(true); }, 900);
      }
    };
    st.raf = requestAnimationFrame(step);
  }
  /* "비행 시작" — 지금까지 한 만큼의 자리에 비행기를 띄웁니다 */
  function fly() {
    const { route, legs } = live.current;
    if (!route) return;
    setTurb(null); setLanded(false); setFlightOn(true);
    if (flight.current) cancelAnimationFrame(flight.current.raf);
    flight.current = null;
    const t0 = progressOf(legs, live.current.checks || {});
    moveTo(t0, { instant: true });
    const p = route.at(Math.min(t0, 0.999));
    api.current && api.current.look({ lat: p.lat, lng: p.lng, altitude: 1.6 }, 1200);
    if (t0 >= 1) moveTo(1);
  }
  /* 체크가 바뀌면 그만큼 날아가기 */
  useEffect(() => {
    if (!flightOn || !route) return;
    const to = progressOf(legs, checks);
    if (!flight.current || Math.abs(flight.current.to - to) > 1e-6) moveTo(to);
  }, [checks, flightOn]); // eslint-disable-line react-hooks/exhaustive-deps
  const flightPct = route ? Math.round(progressOf(legs, checks) * 100) : 0;

  /* 탑승권 → 비행 */
  function onBoard({ name, from, visa: v, entry: en }) {
    setTicketVisa(v);
    setTicket(false); boarded(); setPax(name); set('u.' + who + '.name', name);
    setVisa(v); setEntry(en);
    choose(from);
    setTimeout(() => fly(), 2100);   // 출발 자리에 비행기를 띄우고, 이후는 체크할 때마다 앞으로
  }
  function openSettle(tab = 'todo') { setFold(false); stopFlight(); setLanded(false); setSettleTab(tab); setView('settle'); markBack('settle'); api.current && api.current.pause(); }
  function doCloseSettle() { setView('globe'); api.current && api.current.resume(); }
  /* 내 정보 화면 */
  function openMe() { setFold(false); setTicket(false); setView('me'); markBack('me'); }
  function closeMe() { if (history.state && history.state.ak === 'me') history.back(); else setView('globe'); }
  function goFromMe(a) {
    if (a === 'ticket') { setTicket(true); return; }
    if (a === 'tutor') { setTutorOpen(true); return; }
    if (a === 'todo' || a === 'find') { openSettle(a); return; }
    if (a === 'plan') { openSettle('find'); setPlanGo((x) => x + 1); return; }
    setView('globe');                                   // route
    if (!sel) { const c = get('u.' + who + '.country'); const f = c && FEATURES.find((x) => x.id === c); if (f) choose(f, false); }
  }
  function clearMine() {
    ['checks', 'entry', 'visa', 'name', 'country', 'home', 'settle', 'planOpen', 'boarded', 'view', 'settleTab'].forEach((k) => del('u.' + who + '.' + k));
    if (who === 'guest') del('home');
    location.reload();
  }
  function clearSel() { stopFlight(); setSel(null); setFocus({ lat: 22, lng: 110, altitude: 2.4 }); set('u.' + who + '.country', null); }

  /* 뒤로가기 (브라우저 버튼 · 휴대폰 뒤로 제스처)
     나라를 고르거나 정착 지원 화면을 열 때 기록을 하나 쌓고, 뒤로가기를 누르면 한 단계씩 닫습니다.
     [처음] → [나라 선택] → [정착 지원] 순서 — 화면 안의 닫기 버튼도 같은 길로 돌아갑니다. */
  function markBack(kind) { if (!history.state || history.state.ak !== kind) history.pushState({ ak: kind }, ''); }
  function closeSettle() { if (history.state && history.state.ak === 'settle') history.back(); else doCloseSettle(); }
  function closeSel() { if (history.state && history.state.ak === 'sel') history.back(); else clearSel(); }
  const viewRef = useRef(view); viewRef.current = view;
  const selRef = useRef(sel); selRef.current = sel;
  useEffect(() => {
    const onPop = (e) => {
      const ak = e.state && e.state.ak;
      if (viewRef.current === 'settle' && ak !== 'settle') doCloseSettle();
      if (viewRef.current === 'me' && ak !== 'me') setView('globe');
      if (selRef.current && !ak) clearSel();
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  /* 로그인 끝 → 로그인 전에 해 둔 작업을 계정으로 옮기고 그 계정의 작업을 불러옵니다 */
  function loggedIn(id) {
    adoptGuest(id); setUser(id); setAuthOpen(false);
    setToast(ui(lang).saved); setTimeout(() => setToast(''), 2600);
  }
  /* 카카오 로그인에서 돌아왔을 때 (?code=…&state=…) */
  useEffect(() => {
    if (!QS.get('code') || !QS.get('state')) return;
    finishKakao(QS.get('code'), QS.get('state')).then((r) => {
      history.replaceState(history.state, '', location.pathname + (QS.get('lang') ? '?lang=' + QS.get('lang') : ''));
      if (r && r.id) loggedIn(r.id); else { setToast(lang === 'ko' ? '카카오 로그인에 실패했어요' : 'Kakao login failed'); setTimeout(() => setToast(''), 3000); }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* QR로 들어오면 그 나라를 골라 둡니다 */
  useEffect(() => {
    const a2 = QS.get('from'); if (!a2) return;
    const f = FEATURES.find((x) => a2Of(x) === a2.toUpperCase()); if (f) choose(f, false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 검색 */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = FEATURES.map((f) => ({ f, name: labelOf(f), en: f.properties.name, send: SENDING.has(f.id) }));
    return rows.filter((r) => !q || r.name.toLowerCase().includes(q) || r.en.toLowerCase().includes(q))
      .sort((a, b) => (b.send - a.send) || a.name.localeCompare(b.name)).slice(0, q ? 12 : 18);
  }, [query, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  const live = useRef({}); live.current = { route, legs, turbs, checks };
  /* 첫 화면 목록: 송출국 (지도에 있는 나라만) */
  const epsList = useMemo(() => COUNTRIES.map((c) => ({ c, f: FEATURES.find((x) => x.id === c.iso) })).filter((r) => r.f)
    .sort((a, b) => labelOf(a.f).localeCompare(labelOf(b.f))), [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const goRoute = () => { setFold(false); if (view === 'settle') closeSettle(); };
  const railOn = view === 'settle' ? (settleTab === 'todo' ? 'todo' : 'settle') : view === 'me' ? 'me' : 'route';
  const hintLang = country && LANGS.includes(country.lang) ? (lang === 'ko' || lang === 'en' ? country.lang : lang) : lang;

  return (
    <div className={'app mode-' + mode + ' view-' + view + (fold ? ' is-fold' : '')} style={{ '--pw': panelW + 'px' }}>
      {/* 맨 왼쪽 메뉴 (네이버 지도식 세로 메뉴) */}
      <nav className="rail" aria-label="Menu">
        <button type="button" className="rail-logo" onClick={goRoute} aria-label="ArriveKR"><Icon n="globe" size={22} /><b>ArriveKR</b></button>
        <button type="button" className={'rail-i' + (railOn === 'route' ? ' is-on' : '')} onClick={goRoute}><Icon n="route" size={22} /><span>{n.route}</span></button>
        <button type="button" className={'rail-i' + (railOn === 'todo' ? ' is-on' : '')} onClick={() => openSettle('todo')}><Icon n="todo" size={22} /><span>{n.todo}</span>{arriveSum && <em>{arriveSum.done}/{arriveSum.total}</em>}</button>
        <button type="button" className={'rail-i' + (railOn === 'settle' ? ' is-on' : '')} onClick={() => openSettle('find')}><Icon n="pin" size={22} /><span>{n.settle}</span></button>
        <button type="button" className="rail-i" onClick={() => { openSettle('find'); setPlanGo((x) => x + 1); }}><Icon n="calendar" size={22} /><span>{n.plan}</span><i className="rail-ai">{n.aiBadge}</i></button>
        <button type="button" className={'rail-i' + (tutorOpen ? ' is-on' : '')} onClick={() => setTutorOpen((o) => !o)}><Icon n="ko" size={22} /><span>{n.korean}</span></button>
        <button type="button" className="rail-i" onClick={() => setTicket(true)}><Icon n="ticket" size={22} /><span>{n.ticket}</span></button>
        <button type="button" className={'rail-i' + (railOn === 'me' ? ' is-on' : '')} onClick={openMe}><Icon n="user" size={22} /><span>{n.myInfo}</span></button>
        <div className="rail-foot">
          <label className="rail-lang" title={n.lang}>
            <Icon n="globe" size={20} />
            <select value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
              {LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
            </select>
            <span>{LANG_NAMES[lang]}</span>
          </label>
          {user ? (
            <button type="button" className="rail-i rail-me" title={nickOf(user)} onClick={openMe}><b className={'avatar' + (/^kakao:/.test(user) ? ' kakao' : /^google:/.test(user) ? ' google' : '')}>{nickOf(user).slice(0, 1).toUpperCase()}</b><span>{n.me}</span></button>
          ) : (
            <button type="button" className="rail-i" onClick={() => setAuthOpen(true)}><Icon n="user" size={22} /><span>{n.login}</span></button>
          )}
        </div>
      </nav>
      <div className="side-rz" role="separator" aria-orientation="vertical" aria-valuemin={PW_MIN} aria-valuemax={PW_MAX} aria-valuenow={panelW}
           title={lang === 'ko' ? '끌어서 너비 조절 · 두 번 누르면 기본 크기' : 'Drag to resize · double-click to reset'}
           onPointerDown={rzDown} onPointerMove={rzMove} onPointerUp={rzUp} onPointerCancel={rzUp}
           onDoubleClick={() => { setPanelW(PW_DEF); savePW(PW_DEF); }} />
      <button type="button" className="fold" onClick={() => setFold((f) => !f)} aria-label={fold ? n.unfold : n.fold} title={fold ? n.unfold : n.fold}>
        <Icon n={fold ? 'next' : 'back'} size={16} />
      </button>

      <div className={'globe-wrap' + (shake ? ' shake sev' + (turb ? turb.sev : 1) : '')}>
        <GlobeView features={FEATURES} selected={sel && sel.id} hoverable={SENDING} mode={mode}
                   paths={paths} marks={marks} focus={focus} apiRef={api}
                   onPick={choose}
                   onEmpty={() => { if (selRef.current) closeSel(); }}
                   onMark={(m) => { if (m.kind === 'leg') { setActiveLeg(m.idx); const el = document.getElementById('leg-' + m.idx); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } if (m.kind === 'turb') { setTurb(turbs[m.idx]); } }} />
      </div>

      {/* 왼쪽: 검색 + 경로 패널 */}
      <aside className="side">
        <div className="search">
          {sel && !openList ? (
            <button type="button" className="icon search-back" aria-label={t.back} title={t.back} onClick={closeSel}>
              <Icon n="back" size={20} />
            </button>
          ) : null}
          <input value={sel && !openList ? labelOf(sel) : query} placeholder={t.search} aria-label={t.search}
                 onFocus={() => { setOpenList(true); setQuery(''); }} onChange={(e) => { setQuery(e.target.value); setOpenList(true); }}
                 onBlur={() => setTimeout(() => setOpenList(false), 180)} />
          {sel ? <button type="button" className="icon" aria-label={t.close} onClick={closeSel}><Icon n="close" size={18} /></button>
               : <span className="search-go" aria-hidden="true"><Icon n="search" size={20} /></span>}
          {openList && (
            <ul className="sugg" role="listbox">
              {results.length ? results.map((r) => (
                <li key={r.f.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r.f)}>
                  <Icon n="pin" size={18} />
                  <span>{r.name}{r.send && <em>EPS</em>}</span>
                </button></li>
              )) : <li className="none">{t.noResult}</li>}
            </ul>
          )}
        </div>

        {!sel && (
          <div className="card home">
            <MySummary lang={lang} me={meData} onContinue={meData.arrive && meData.arrive.done ? () => openSettle('todo') : null} onMore={openMe} />
            <div className="home-h"><b>{n.homeT}</b><p>{n.homeSub}</p></div>
            <div className="band" />
            <h3 className="sec-h">{n.epsT}<span>{fill(n.epsN, { n: epsList.length })}</span></h3>
            <ul className="plist">
              {epsList.map(({ c, f }) => (
                <li key={c.iso}><button type="button" onClick={() => choose(f)}>
                  <span className="plist-t"><b>{labelOf(f)}</b>{c.newly && <em className="tag-new">{n.newL}</em>}</span>
                  <span className="plist-s">{c.agency.split(' (')[0]}</span>
                  <span className="plist-m">{n.feeL} {c.fee}</span>
                  <Icon n="next" size={16} className="plist-go" />
                </button></li>
              ))}
            </ul>
            <div className="band" />
            <div className="home-other"><Icon n="globe" size={18} /><span><b>{n.otherT}</b><small>{n.otherSub}</small></span></div>
            <p className="rp-note home-note">{n.homeNote}</p>
          </div>
        )}
        {isKorea && <div className="card home"><div className="home-h"><p>{t.korea}</p></div></div>}
        {sel && !isKorea && (
          <div ref={panelEl} className={'card panel' + (sheet.low ? ' is-low' : '')} onClick={() => { if (sheet.low && !sheet.justDragged.current) sheet.setLow(false); }}>
            <span className="st-grip" aria-hidden="true" />
            <div className="rp-visa" style={{ '--vc': vObj.color }}>
              <b>{visa}</b><span>{tx(vObj.name, lang)}</span>
              <button type="button" className="btn-o sm" onClick={() => setTicket(true)}><Icon n="ticket" size={16} />{t.ticket}</button>
            </div>
            <RoutePanel lang={lang} country={eps ? country : null} fromLabel={labelOf(sel)} legs={legs} extra={extra}
                        info={!eps ? (vObj.note ? tx(vObj.note, lang) : vObj.inKorea ? t.inKorea : '') : !country ? t.notE9 : country.newly ? t.newCountry : ''}
                        entry={entry} setEntry={setEntry} checks={checks} toggle={toggle}
                        activeLeg={activeLeg} onLeg={(i) => { setActiveLeg(i); const l = legs[i]; const p = route.at(l.at); setFocus({ lat: p.lat, lng: p.lng, altitude: 1.2 }); }}
                        flying={flying} onFly={fly} flightOn={flightOn} flightPct={flightPct}
                        arrive={arriveSum}
                        onArrive={() => openSettle('todo')} />
          </div>
        )}
      </aside>

      {/* 지도 오른쪽 위 도구 (지도 유형 · 모바일 보기) */}
      <div className="mtools">
        <div className="mtool-g">
          <button type="button" className="mtool" onClick={() => setMode(mode === 'sat' ? 'map' : 'sat')} title={n.layer}>
            <Icon n="layers" size={20} /><span>{mode === 'sat' ? n.map : n.sat}</span>
          </button>
          <ViewToggle lang={lang} />
        </div>
      </div>
      {/* 오른쪽 아래: 확대 · 축소 */}
      <div className="zoom">
        <button type="button" aria-label="Zoom in" onClick={() => api.current && api.current.zoom(0.75)}><Icon n="plus" size={18} /></button>
        <button type="button" aria-label="Zoom out" onClick={() => api.current && api.current.zoom(1.33)}><Icon n="minus" size={18} /></button>
      </div>

      {/* 난기류 알림 */}
      {turb && (
        <div className={'turb-card sev' + turb.sev} role="alert">
          <span className="turb-ic" aria-hidden="true"><Icon n="alert" size={20} /></span>
          <div><small>{t.turb}</small><b>{tx(turb.t, lang)}</b><p>{tx(turb.d, lang)}</p></div>
          <button type="button" className="btn-t" onClick={endTurb}>{t.turbOk}</button>
          <button type="button" className="icon" aria-label={t.close} title={t.close} onClick={endTurb}><Icon n="close" size={18} /></button>
        </div>
      )}

      {/* 인천 도착 → 원주 */}
      {landed && view === 'globe' && (
        <div className="land-card" role="status">
          <span className="land-ic" aria-hidden="true"><Icon n="land" size={24} /></span>
          <div><b>{t.landed}</b><p>ICN → WJU · {t.toWonjuMove}</p></div>
          <button type="button" className="btn-p" onClick={() => openSettle('todo')}>{t.startSettle} →</button>
          <button type="button" className="icon" aria-label={t.close} onClick={() => setLanded(false)}><Icon n="close" size={18} /></button>
        </div>
      )}

      {view === 'settle' && <Settle key={who} who={who} lang={lang} visa={visa} name={pax} onBack={closeSettle} tab={settleTab} setTab={setSettleTab}
                                        checks={checks} toggle={toggle} entry={entry}
                                        country={country} countryLabel={sel && !isKorea ? labelOf(sel) : ''} planGo={planGo} />}
      {view === 'me' && (
        <MyPage lang={lang} setLang={setLang} me={meData} arriveItems={arriveLeg ? arriveLeg.items : []} checks={checks} setEntry={setEntry}
                onGo={goFromMe} onClose={closeMe} onLogin={() => setAuthOpen(true)}
                onLogout={() => { if (window.confirm(t.signOut + '?')) { signOut(); location.replace(location.pathname); } }} onClear={clearMine} />
      )}
      {ticket && (
        <BoardingPass lang={lang} features={FEATURES} labelOf={labelOf}
                      top={<MySummary lang={lang} me={meData} dark onContinue={() => setTicket(false)} onMore={openMe} />}
                      init={{ name: pax, from: sel && !isKorea ? sel : null, visa: ticketVisa, entry }}
                      onBoard={onBoard} onSkip={() => { setTicket(false); boarded(); }} />
      )}

      {tutorOpen && <Tutor key={who} who={who} lang={lang} hintLang={hintLang} countryLabel={sel && !isKorea ? labelOf(sel) : ''} name={pax} onClose={() => setTutorOpen(false)} />}
      {authOpen && <AuthDialog lang={lang} onClose={() => setAuthOpen(false)} onDone={loggedIn} />}
      {toast && <div className="snack">{toast}</div>}
      <p className="attrib">Imagery: NASA Blue Marble · Borders: Natural Earth</p>
    </div>
  );
}
