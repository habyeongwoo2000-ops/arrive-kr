/* ArriveKR — 지구본에서 나라를 누르면 한국까지 경로가 그려지고,
   경로 위 구간마다 준비할 서류·기한(연료)을, 위험한 곳은 난기류로 보여 줍니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { feature } from 'topojson-client';
import { geoCentroid, geoInterpolate, geoDistance } from 'd3-geo';
import world from 'world-atlas/countries-110m.json';
import GlobeView from './components/GlobeView.jsx';
import RoutePanel from './components/RoutePanel.jsx';
import Tutor from './components/Tutor.jsx';
import AuthDialog from './components/AuthDialog.jsx';
import BoardingPass, { a2Of } from './components/BoardingPass.jsx';
import ViewToggle from './components/ViewToggle.jsx';
import useSheetDrag from './useSheetDrag.js';
import Settle from './components/Settle.jsx';
import { byCode } from './data/visas.js';
import { WONJU } from './data/wonju.js';
import { COUNTRIES, KOREA, byIso } from './data/countries.js';
import { LEGS, TURBULENCE, GENERAL } from './data/route.js';
import { LANGS, LANG_NAMES, ui, tx, countryName } from './i18n/ui.js';
import { get, set } from './lib/store.js';
import { current, signOut } from './lib/auth.js';

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
  const [mode, setMode] = useState('sat');
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
  const [view, setView] = useState('globe');      // globe | settle
  const [settleTab, setSettleTab] = useState('todo'); // todo | find
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
    const c = get('u.' + who + '.country'); if (c) { const f = FEATURES.find((x) => x.id === c); if (f) choose(f, false); }
  }, [who]); // eslint-disable-line react-hooks/exhaustive-deps
  const [visa, setVisaS] = useState(() => { const q = QS.get('visa'); return byCode[q] ? q : get('u.' + who + '.visa', 'E-9'); });
  const [pax, setPax] = useState(() => get('u.' + who + '.name', ''));
  const [ticket, setTicket] = useState(() => !QS.get('skip'));
  const setVisa = (v) => { setVisaS(v); set('u.' + who + '.visa', v); };
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
    const c = byIso[f.id];
    const s = c ? c.city : (([lng, lat]) => [lat, lng])(geoCentroid(f));
    const mid = geoInterpolate([s[1], s[0]], [KOREA.city[1], KOREA.city[0]])(0.5);
    const d = geoDistance([s[1], s[0]], [KOREA.city[1], KOREA.city[0]]);
    setFocus({ lat: mid[1], lng: mid[0], altitude: Math.min(3.2, 0.9 + d * 1.5) });
  }

  /* ---------- 비행 ---------- */
  function stopFlight() {
    if (flight.current) cancelAnimationFrame(flight.current.raf);
    flight.current = null; setFlying(false); setShake(false);
    api.current && api.current.setPlane(null);
  }
  function fly() {
    const { route, legs, turbs } = live.current;
    if (!route) return;
    stopFlight();
    setFlying(true); setTurb(null); setLanded(false);
    const DUR = 16000;
    const st = { t: 0, last: performance.now(), pauseUntil: 0, nextTurb: 0, leg: -1, raf: 0 };
    flight.current = st;
    const step = (now) => {
      if (!flight.current) return;
      const dt = now - st.last; st.last = now;
      if (now < st.pauseUntil) {
        const p = route.at(st.t); api.current.setPlane({ ...p, heading: st.hd + Math.sin(now / 40) * 9, alt: p.alt + Math.sin(now / 55) * 0.004 });
      } else {
        st.t = Math.min(1, st.t + dt / DUR);
        const p = route.at(st.t), q = route.at(Math.min(1, st.t + 0.01));
        st.hd = bearing(p, q);
        api.current.setPlane({ ...p, heading: st.hd });
        api.current.look({ lat: p.lat, lng: p.lng, altitude: 1.35 }, 0);
        const li = legs.reduce((a, l, i) => (st.t >= l.at - 0.04 ? i : a), -1);
        if (li !== st.leg) { st.leg = li; setActiveLeg(li); const el = document.getElementById('leg-' + li); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
        const tb = turbs[st.nextTurb];
        if (tb && st.t >= tb.at) {
          st.nextTurb++; st.pauseUntil = now + 2600 + tb.sev * 300;
          setTurb(tb); setShake(true);
          clearTimeout(shakeTimer.current);
          shakeTimer.current = setTimeout(() => setShake(false), 2600 + tb.sev * 300);
        }
      }
      if (st.t >= 1) {
        setFlying(false); flight.current = null;
        setTimeout(() => { if (!api.current) return; api.current.setPlane(null); setTurb(null); setShake(false); api.current.look({ lat: WONJU.lat - 0.25, lng: WONJU.lng - 0.3, altitude: 0.22 }, 2200); setLanded(true); }, 900);
        return;
      }
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
  }

  /* 탑승권 → 비행 */
  function onBoard({ name, from, visa: v, entry: en }) {
    setTicket(false); setPax(name); set('u.' + who + '.name', name);
    setVisa(v); setEntry(en);
    choose(from);
    setTimeout(() => fly(), 2100);
  }
  function openSettle(tab = 'todo') { stopFlight(); setLanded(false); setSettleTab(tab); setView('settle'); markBack('settle'); api.current && api.current.pause(); }
  function doCloseSettle() { setView('globe'); api.current && api.current.resume(); }
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
      if (selRef.current && !ak) clearSel();
    };
    addEventListener('popstate', onPop);
    return () => removeEventListener('popstate', onPop);
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

  const live = useRef({}); live.current = { route, legs, turbs };
  const hintLang = country && LANGS.includes(country.lang) ? (lang === 'ko' || lang === 'en' ? country.lang : lang) : lang;

  return (
    <div className={'app mode-' + mode + ' view-' + view}>
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
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20z" /></svg>
            </button>
          ) : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14" /></svg>}
          <input value={sel && !openList ? labelOf(sel) : query} placeholder={t.search} aria-label={t.search}
                 onFocus={() => { setOpenList(true); setQuery(''); }} onChange={(e) => { setQuery(e.target.value); setOpenList(true); }}
                 onBlur={() => setTimeout(() => setOpenList(false), 180)} />
          {sel && <button type="button" className="icon" aria-label={t.close} onClick={closeSel}>✕</button>}
          {openList && (
            <ul className="sugg" role="listbox">
              {results.length ? results.map((r) => (
                <li key={r.f.id}><button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => choose(r.f)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7m0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5" /></svg>
                  <span>{r.name}{r.send && <em>EPS</em>}</span>
                </button></li>
              )) : <li className="none">{t.noResult}</li>}
            </ul>
          )}
        </div>

        {!sel && <div className="card hint-card"><b>{t.app}</b><span>{t.tag}</span><p>{t.hint}</p></div>}
        {isKorea && <div className="card hint-card"><p>{t.korea}</p></div>}
        {sel && !isKorea && (
          <div ref={panelEl} className={'card panel' + (sheet.low ? ' is-low' : '')} onClick={() => { if (sheet.low && !sheet.justDragged.current) sheet.setLow(false); }}>
            <span className="st-grip" aria-hidden="true" />
            <div className="rp-visa" style={{ '--vc': vObj.color }}>
              <b>{visa}</b><span>{tx(vObj.name, lang)}</span>
              <button type="button" className="btn-t" onClick={() => setTicket(true)}>🎫 {t.ticket}</button>
            </div>
            <RoutePanel lang={lang} country={eps ? country : null} fromLabel={labelOf(sel)} legs={legs} extra={extra}
                        info={!eps ? (vObj.inKorea ? t.inKorea : '') : !country ? t.notE9 : country.newly ? t.newCountry : ''}
                        entry={entry} setEntry={setEntry} checks={checks} toggle={toggle}
                        activeLeg={activeLeg} onLeg={(i) => { setActiveLeg(i); const l = legs[i]; const p = route.at(l.at); setFocus({ lat: p.lat, lng: p.lng, altitude: 1.2 }); }}
                        flying={flying} onFly={fly}
                        arrive={arriveSum}
                        onArrive={() => openSettle('todo')} />
          </div>
        )}
      </aside>

      {/* 오른쪽 위: 원주 정착 · 언어 · 계정 */}
      <div className="top-r">
        {view === 'globe' && arriveSum && (
          <button type="button" className="wj-chip todo-chip" onClick={() => openSettle('todo')} aria-label={t.todoBtn} title={t.todoBtn}>
            <svg className="chip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 11.5l2 2 4-4.5M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0" /></svg><span className="chip-t">{t.todoBtn}</span><span className="chip-s">{t.todoShort}</span><em style={{ '--p': (arriveSum.total ? arriveSum.done / arriveSum.total * 100 : 0) + '%' }}>{arriveSum.done}/{arriveSum.total}</em>
          </button>
        )}
        {view === 'globe' && <button type="button" className="wj-chip settle-chip" onClick={() => openSettle('find')}><svg className="chip-ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></svg><span className="chip-t">{t.settleBtn}</span></button>}
        <select className="lang" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
          {LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
        </select>
        {user ? (
          <button type="button" className="avatar" title={user} onClick={() => { if (window.confirm(t.signOut + '?')) { signOut(); setUser(null); } }}>{user.slice(0, 1).toUpperCase()}</button>
        ) : (
          <button type="button" className="signin" onClick={() => setAuthOpen(true)}>{t.signIn}</button>
        )}
      </div>

      {/* 왼쪽 아래: 레이어 */}
      <button type="button" className={'layer ' + (mode === 'sat' ? 'to-map' : 'to-sat')} onClick={() => setMode(mode === 'sat' ? 'map' : 'sat')}>
        <span className="layer-th" aria-hidden="true" /><span>{mode === 'sat' ? t.map : t.sat}</span>
      </button>

      {/* 오른쪽 아래: 확대 · 축소 · 튜터 */}
      <div className="ctrl">
        <ViewToggle lang={lang} />
        <button type="button" className="tutor-fab" onClick={() => setTutorOpen((o) => !o)} aria-label={t.tutor}><span aria-hidden="true">가</span><em>{t.tutor}</em></button>
        <div className="zoom">
          <button type="button" aria-label="Zoom in" onClick={() => api.current && api.current.zoom(0.75)}>+</button>
          <button type="button" aria-label="Zoom out" onClick={() => api.current && api.current.zoom(1.33)}>−</button>
        </div>
      </div>

      {/* 난기류 알림 */}
      {turb && (
        <div className={'turb-card sev' + turb.sev} role="alert">
          <span className="turb-ic" aria-hidden="true">⚠</span>
          <div><small>{t.turb}</small><b>{tx(turb.t, lang)}</b><p>{tx(turb.d, lang)}</p></div>
          <button type="button" className="btn-t" onClick={endTurb}>{t.turbOk}</button>
        </div>
      )}

      {/* 인천 도착 → 원주 */}
      {landed && view === 'globe' && (
        <div className="land-card" role="status">
          <span className="land-ic" aria-hidden="true">🛬</span>
          <div><b>{t.landed}</b><p>ICN → WJU · {t.toWonjuMove}</p></div>
          <button type="button" className="btn-p" onClick={() => openSettle('todo')}>{t.startSettle} →</button>
          <button type="button" className="icon" aria-label={t.close} onClick={() => setLanded(false)}>✕</button>
        </div>
      )}

      {view === 'settle' && <Settle lang={lang} visa={visa} name={pax} onBack={closeSettle} tab={settleTab} setTab={setSettleTab}
                                        checks={checks} toggle={toggle} entry={entry}
                                        country={country} countryLabel={sel && !isKorea ? labelOf(sel) : ''} />}
      {ticket && (
        <BoardingPass lang={lang} features={FEATURES} labelOf={labelOf}
                      init={{ name: pax, from: sel && !isKorea ? sel : null, visa, entry }}
                      onBoard={onBoard} onSkip={() => setTicket(false)} />
      )}

      {tutorOpen && <Tutor lang={lang} hintLang={hintLang} countryLabel={sel && !isKorea ? labelOf(sel) : ''} onClose={() => setTutorOpen(false)} />}
      {authOpen && <AuthDialog lang={lang} onClose={() => setAuthOpen(false)} onDone={(id) => { setUser(id); setAuthOpen(false); setToast(ui(lang).saved); setTimeout(() => setToast(''), 2600); }} />}
      {toast && <div className="snack">{toast}</div>}
      <p className="attrib">Imagery: NASA Blue Marble · Borders: Natural Earth</p>
    </div>
  );
}
