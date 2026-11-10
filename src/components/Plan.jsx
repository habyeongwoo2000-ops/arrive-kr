/* 나의 원주 정착 30일 — AI가 일정을 짜는 장면 → 지도 위에 하루씩 동선이 그려지는 재생
   · 일정 뼈대: lib/plan.js 규칙 / 설명: /api/plan (Gemini). AI가 꺼져 있으면 기본 설명으로 똑같이 동작합니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import { buildPlan, fmtDate } from '../lib/plan.js';
import { PLACES } from '../data/wonju.js';
import { ui, fill } from '../i18n/ui.js';
import './plan.css';
import Icon from './Icon.jsx';
import { roadPath, distText } from '../lib/route.js';
const ICON = { '🚌': 'bus', '🎓': 'study', '☎': 'call', '🏢': 'culture', '🌾': 'work', '🚍': 'bus', '가': 'ko', '🏥': 'health', '👪': 'family', '🪪': 'stay', '🦺': 'safety', '🎉': 'culture', '✅': 'check' };

/* 이 기능의 문구 — ui.js 를 건드리지 않도록 여기에 둡니다 (없는 언어는 영어) */
const S = {
  ko: { planBtn: 'AI로 나의 원주 정착 30일 만들기', planBtnSub: '입국일·비자·필요한 것으로 날짜별 동선을 짜 드려요', planT: '나의 원주 정착 30일', planThinkT: 'AI가 원주 정착 일정을 짜고 있어요', planThink1: '체류자격·필요한 것 읽는 중', planThink2: '원주·강원 공공지원 30여 건 비교', planThink3: '관공서 운영일·주말 피해서 날짜 정하기', planThink4: '내 언어로 설명 쓰기', planAi: 'Gemini 맞춤 설명', planBase: '기본 설명 · AI 미연결', planHello: '{name} 님, 원주에 오신 걸 환영해요! 한 달 동안 이 순서로 정착해 보세요.', planHello0: '원주에 오신 걸 환영해요! 한 달 동안 이 순서로 정착해 보세요.', planPause: '멈춤', planReplay: '다시 보기', planNote: '날짜는 입국 예정일 기준 추천입니다. 운영일·대상은 바뀔 수 있으니 방문 전 전화로 확인하세요. AI는 설명만 쓰고 장소·번호는 공식 자료에서 가져옵니다.', close: '닫기', site: '누리집', approx: '대략 위치' },
  en: { planBtn: 'Build my 30-day Wonju plan with AI', planBtnSub: 'A day-by-day route from your entry date, visa and needs', planT: 'My first 30 days in Wonju', planThinkT: 'AI is planning your move to Wonju', planThink1: 'Reading your visa and needs', planThink2: 'Comparing 30+ Wonju & Gangwon programs', planThink3: 'Picking office days, skipping weekends', planThink4: 'Writing it in your language', planAi: 'Gemini-personalized', planBase: 'Standard notes · AI offline', planHello: 'Welcome to Wonju, {name}! Settle in step by step over your first month.', planHello0: 'Welcome to Wonju! Settle in step by step over your first month.', planPause: 'Pause', planReplay: 'Replay', planNote: 'Dates are suggestions based on your entry date. Opening days and eligibility change — call before you visit. AI writes the notes only; places and numbers come from official sources.', close: 'Close', site: 'Website', approx: 'approx. location' }
};
const words = (lang) => ({ ...S.en, ...(lang === 'ko' ? S.ko : {}) });

/* 시작 버튼 (Settle 의 "지원 찾기" 탭에 넣습니다) */
export function PlanButton({ lang, onClick }) {
  const t = words(lang);
  return (
    <button type="button" className="ai-plan" onClick={onClick}>
      <span className="ai-spark" aria-hidden="true"><Icon n="calendar" size={22} /></span>
      <span><b>{t.planBtn}<em className="ai-tag">AI</em></b><small>{t.planBtnSub}</small></span>
      <Icon n="next" size={18} />
    </button>
  );
}

const KIND = { move: '#202124', duty: '#e37400', call: '#9334e6', visit: '#1a73e8', goal: '#188038' };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 아래 일정 패널 높이 — 위쪽 손잡이를 끌어서 바꾸고, 이 기기에 기억합니다 */
const DOCK_KEY = 'ui.dockH';
const dockMax = () => Math.round(innerHeight * (innerWidth > 760 ? 0.72 : 0.8));
const DOCK_MIN = 96;
const loadDock = () => { try { const v = +localStorage.getItem(DOCK_KEY); return v ? Math.min(dockMax(), Math.max(DOCK_MIN, v)) : (innerWidth > 760 ? 228 : 210); } catch (e) { return 228; } };

export default function Plan({ map, lang, visa, needs, family, entry, name, country, home, dist = {}, onClose }) {
  const t = { ...ui(lang), ...words(lang) };
  const K = lang === 'ko' ? 'ko' : 'en';
  const steps = useMemo(() => buildPlan({ visa, needs, family, entry }), [visa, needs, family, entry]);
  const [phase, setPhase] = useState('think');     // think → ready
  const [tick, setTick] = useState(0);             // 생각 단계 체크 수
  const [ai, setAi] = useState(null);              // { intro, tips } | null
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const run = useRef(0);
  const lg = useRef(null);
  const strip = useRef(null);
  const [dockH, setDockH] = useState(loadDock);
  const drag = useRef(null);
  const onGrip = (e) => {
    e.preventDefault();
    drag.current = { y: e.clientY, h: dockH };
    e.currentTarget.setPointerCapture(e.pointerId);
    document.body.classList.add('is-rz-v');
  };
  const onGripMove = (e) => {
    if (!drag.current) return;
    setDockH(Math.min(dockMax(), Math.max(DOCK_MIN, drag.current.h + (drag.current.y - e.clientY))));
  };
  const onGripUp = () => {
    if (!drag.current) return;
    drag.current = null; document.body.classList.remove('is-rz-v');
    setDockH((v) => { try { localStorage.setItem(DOCK_KEY, String(Math.round(v))); } catch (e) { /* 무시 */ } return v; });
  };
  /* 손잡이를 두 번 누르면 접기 ↔ 기본 크기 */
  const toggleDock = () => setDockH((v) => { const n = v > DOCK_MIN + 20 ? DOCK_MIN : 228; try { localStorage.setItem(DOCK_KEY, String(n)); } catch (e) { /* 무시 */ } return n; });

  /* 1) AI에게 설명 받기 + "생각하는 장면" (최소 2.4초) */
  useEffect(() => {
    let alive = true;
    const ticker = setInterval(() => setTick((n) => Math.min(4, n + 1)), 560);
    const call = fetch('/api/plan', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang, visa, country, needs, family, steps: steps.map((s) => ({ id: s.id, day: s.day, t: s.t[K], n: s.n[K] })) })
    }).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    Promise.all([call, sleep(2400)]).then(([res]) => {
      if (!alive) return;
      clearInterval(ticker); setTick(4);
      if (res && res.tips && Object.keys(res.tips).length) setAi(res);
      setTimeout(() => { if (alive) { setPhase('ready'); play(); } }, 350);
    });
    return () => { alive = false; clearInterval(ticker); run.current++; if (lg.current) { lg.current.remove(); lg.current = null; } };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* 2) 지도 위 재생 */
  function dayIcon(label, color, on) {
    return L.divIcon({ className: 'pl-mk' + (on ? ' is-on' : ''), html: `<span style="--c:${color}">${label}</span>`, iconSize: [0, 0], iconAnchor: [0, 0] });
  }
  /* 도크·패널에 가리지 않게 화면 중심을 비켜서 날아가기 */
  function focus(lat, lng, z) {
    const off = innerWidth > 760 ? L.point(0, 150) : L.point(0, Math.round(innerHeight * 0.3));
    const c = map.unproject(map.project([lat, lng], z).add(off), z);
    map.flyTo(c, z, { duration: 0.8 });
  }
  /* 도크에 가리지 않게 지도 여백 */
  const dockPad = () => {
    const d = document.querySelector('.pl-dock'); const h = (d ? d.offsetHeight : 300) + 28;
    return innerWidth > 760 ? { paddingTopLeft: [70, 90], paddingBottomRight: [90, h] } : { paddingTopLeft: [30, 70], paddingBottomRight: [30, h] };
  };
  /* 지도가 다 움직인 뒤에 선을 그려야 선이 밀리지 않습니다 */
  const settled = () => new Promise((res) => { let t = 0; const f = () => { clearTimeout(t); map.off('moveend', f); res(); }; map.on('moveend', f); t = setTimeout(f, 1500); });

  async function play() {
    if (!map) return;
    const my = ++run.current;
    if (lg.current) lg.current.remove();
    const g = L.layerGroup().addTo(map); lg.current = g;
    const casing = L.polyline([], { color: '#ffffff', weight: 10, opacity: 1, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(g);
    const line = L.polyline([], { color: '#2b6ff4', weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(g);
    const me = L.marker([PLACES.terminal.lat, PLACES.terminal.lng], { icon: L.divIcon({ className: 'pl-me', html: '<i></i>', iconSize: [22, 22], iconAnchor: [11, 11] }), zIndexOffset: 2000, interactive: false }).addTo(g);
    const byPlace = {};
    setPlaying(true);

    /* 장소 사이 실제 길을 한꺼번에 받아 둡니다 (실패하면 직선) */
    const pts = steps.map((s) => (s.place && PLACES[s.place] ? L.latLng(PLACES[s.place].lat, PLACES[s.place].lng) : null));
    const segs = {}; const jobs = []; let last = null;
    pts.forEach((p, i) => { if (!p) return; if (last && !last.equals(p)) { const a = last; jobs.push(roadPath(a, p).then((r) => { segs[i] = r; })); } last = p; });
    await Promise.all(jobs);
    if (run.current !== my) return;

    let prev = null;
    for (let i = 0; i < steps.length; i++) {
      if (run.current !== my) return;
      const s = steps[i];
      setActive(i);
      center(i);
      const to = pts[i];
      if (to) {
        if (prev && !prev.equals(to)) {
          const path = segs[i] || [prev, to];
          map.flyToBounds(L.latLngBounds(path), { ...dockPad(), maxZoom: 15, duration: 0.8 });
          await settled();
          const step = Math.max(1, Math.ceil(path.length / 45));       // 길 따라 조금씩 그리기 (약 0.9초)
          for (let k = 1; k < path.length; k += step) {
            if (run.current !== my) return;
            for (let q = Math.max(1, k - step + 1); q <= k; q++) { casing.addLatLng(path[q]); line.addLatLng(path[q]); }
            me.setLatLng(path[k]);
            await sleep(20);
          }
          const end = path[path.length - 1];
          casing.addLatLng(end); line.addLatLng(end); me.setLatLng(end);
        } else {
          if (!prev) { map.flyTo(to, 15, { duration: 0.8 }); await settled(); map.panBy([0, Math.round(dockPad().paddingBottomRight[1] / 2)], { animate: false }); }
          casing.addLatLng(to); line.addLatLng(to); me.setLatLng(to);
        }
        prev = to;
        const lbl = 'D+' + s.day;
        const ex = byPlace[s.place];
        if (ex) { ex.days.push(lbl); ex.m.setIcon(dayIcon(ex.days.join(' · '), KIND[s.kind], true)); }
        else byPlace[s.place] = { days: [lbl], m: L.marker(to, { icon: dayIcon(lbl, KIND[s.kind], true), zIndexOffset: 1000, interactive: false }).addTo(g) };
        await sleep(800);
      } else {
        await sleep(1200);                      // 장소 없는 일(전화·교육)은 카드만 강조
      }
    }
    if (run.current !== my) return;
    setPlaying(false);
    const all = line.getLatLngs();
    if (all.length > 1) map.flyToBounds(L.latLngBounds(all), { ...dockPad(), maxZoom: 15, duration: 1 });
  }
  const stop = () => { run.current++; setPlaying(false); };
  /* 카드 줄을 i번째 카드가 가운데 오도록 부드럽게 밀기 */
  function center(i) {
    const el = strip.current; const card = el && el.children[i]; if (!card) return;
    el.scrollTo({ left: card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' });
  }
  const jump = (i) => {
    stop(); setActive(i); center(i);
    const pl = steps[i].place && PLACES[steps[i].place];
    if (pl && map) focus(pl.lat, pl.lng, 14);
  };

  /* ‹ › 버튼·키보드 화살표 → 앞뒤 일정으로 (지도도 같이 이동) */
  const go = (d) => { const i = Math.min(steps.length - 1, Math.max(0, (active < 0 ? 0 : active + d))); if (i !== active) jump(i); };
  const goRef = useRef(go); goRef.current = go;
  useEffect(() => {
    const onKey = (e) => {
      if (/^(INPUT|TEXTAREA|SELECT)$/.test((e.target && e.target.tagName) || '') || e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); goRef.current(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); goRef.current(-1); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, []);

  const cur = steps[active] || null;
  const curDay = cur ? cur.day : 0;
  const thinking = [t.planThink1, t.planThink2, t.planThink3, t.planThink4];

  if (phase === 'think') {
    return (
      <div className="pl-think" role="status" aria-live="polite">
        <div className="pl-orb" aria-hidden="true"><i /><i /><i /></div>
        <b>{t.planThinkT}</b>
        <ul>{thinking.map((x, i) => <li key={i} className={i < tick ? 'ok' : i === tick ? 'now' : ''}><span>{i < tick ? '✓' : ''}</span>{x}</li>)}</ul>
      </div>
    );
  }

  return (
    <div className={'pl-dock' + (dockH < 150 ? ' is-mini' : '')} style={{ height: dockH }}>
      <div className="pl-grip" role="separator" aria-orientation="horizontal" aria-label="resize" title={lang === 'ko' ? '끌어서 크기 조절 · 두 번 눌러 접기' : 'Drag to resize · double-click to fold'}
           onPointerDown={onGrip} onPointerMove={onGripMove} onPointerUp={onGripUp} onPointerCancel={onGripUp} onDoubleClick={toggleDock}><i /></div>
      <div className="pl-h">
        <div className="pl-ttl">
          <b>{t.planT}</b>
          <span className={'pl-badge' + (ai ? ' ai' : '')}>{ai ? t.planAi : t.planBase}</span>
        </div>
        <div className="pl-ctl">
          <button type="button" onClick={() => (playing ? stop() : play())}>{playing ? <><Icon n="pause" size={14} />{t.planPause}</> : <><Icon n="play" size={14} />{t.planReplay}</>}</button>
          <button type="button" className="x" aria-label={t.close} onClick={onClose}><Icon n="close" size={16} /></button>
        </div>
      </div>
      {(() => { const intro = (ai && ai.intro) || (name ? fill(t.planHello, { name: name.toUpperCase() }) : t.planHello0); return <p className="pl-intro" title={intro}>{intro}</p>; })()}

      {/* 30일 띠 */}
      <div className="pl-rib" aria-hidden="true">
        <div className="pl-rib-bar"><i style={{ width: Math.min(100, (curDay / 30) * 100) + '%' }} /></div>
        {steps.map((s, i) => (
          <button type="button" key={s.id} tabIndex={-1} className={'pl-dot' + (i === active ? ' is-on' : '') + (i < active ? ' done' : '')}
                  style={{ left: Math.min(100, (s.day / 30) * 100) + '%', '--c': KIND[s.kind] }} onClick={() => jump(i)} title={'D+' + s.day} />
        ))}
        <span className="pl-rib-l">D+0</span><span className="pl-rib-r">D+30</span>
      </div>

      <div className="pl-strip">
      <button type="button" className="pl-nav prev" aria-label={lang === 'ko' ? '이전 일정' : 'Previous'} disabled={active <= 0} onClick={() => go(-1)}><Icon n="back" size={20} /></button>
      <button type="button" className="pl-nav next" aria-label={lang === 'ko' ? '다음 일정' : 'Next'} disabled={active >= steps.length - 1} onClick={() => go(1)}><Icon n="next" size={20} /></button>
      <div className="pl-cards" ref={strip}>
        {steps.map((s, i) => {
          const tip = ai && ai.tips && ai.tips[s.id];
          const pl = s.place && PLACES[s.place];
          return (
            <article key={s.id} className={'pl-c' + (i === active ? ' is-on' : '') + (i < active ? ' done' : '')} style={{ '--c': KIND[s.kind] }} onClick={() => jump(i)}>
              <header><b>D+{s.day}</b><span>{fmtDate(s.date, lang)}</span></header>
              <div className="pl-c-t"><i aria-hidden="true"><Icon n={ICON[s.icon] || 'info'} size={16} /></i><h4>{s.t[K]}</h4></div>
              <p>{tip || s.n[K]}</p>
              {tip && <small className="pl-c-fact">{s.n[K]}</small>}
              <footer>
                {pl && <span><Icon n="pin" size={13} />{pl[K].split(' (')[0]}{pl.exact ? '' : ' · ' + t.approx}</span>}
                {home && dist[s.place] && <span className="pl-c-d"><Icon n="life" size={13} />{distText(dist[s.place], lang)}</span>}
                {s.tel && <a href={'tel:' + s.tel.replace(/[^0-9]/g, '')} onClick={(e) => e.stopPropagation()}><Icon n="call" size={13} />{s.tel}</a>}
                {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}><Icon n="link" size={13} />{t.site}</a>}
              </footer>
            </article>
          );
        })}
      </div>
      </div>
      <p className="pl-note" title={t.planNote}>{t.planNote}</p>
    </div>
  );
}
