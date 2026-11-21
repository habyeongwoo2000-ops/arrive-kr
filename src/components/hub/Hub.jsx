/* 정착 지원 홈 — E9-Bridge(eum-six.vercel.app) 첫 화면 디자인을 그대로 옮긴 화면.
   ─────────────────────────────────────────────────────────────
   page: 'home'     사진 슬라이드 · 주요 서비스 · 기한/보험 바로가기 · 인터뷰 · 숫자 · 커뮤니티
         'deadline' 사업장 변경 기한 계산
         'ins'      출국만기보험 · 출국 정산(신고·청구 기한, 떠나기 전 다섯 가지)
         'itv'      인터뷰 전체
   계산 규칙은 E9-Bridge 와 같습니다(./calc.js). 입력값은 이 기기에만(로그인하지 않으면 이번 방문 동안만) 남습니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import './e9base.css';
import './hub.css';
import { hub } from '../../i18n/hub.js';
import { LANGS, LANG_NAMES } from '../../i18n/ui.js';
import { INTERVIEWS, PAY_SRC, PAY_CHECKED } from '../../data/e9.js';
import { uget, uset } from '../../lib/store.js';
import { ViewLinks } from '../ViewToggle.jsx';
import * as C from './calc.js';

const HERO = [['itv-sohee', '40%'], ['itv-owner', '45%'], ['itv-asad', '30%'], ['itv-boss', '30%'], ['itv-tilo', '35%']];
const HERO_MS = 6000;
const IG = 'https://www.instagram.com/e9_bridge/';
const FB = 'https://www.facebook.com/profile.php?id=61591144925891';
const MAIL = 'habyeongwoo2000@gmail.com';
const GITHUB = 'https://github.com/habyeongwoo2000-ops/arrive-kr';

/* 글꼴 — E9-Bridge 와 같은 Pretendard, 크메르어·네팔어 글자는 Noto Sans (이 화면을 처음 열 때 한 번만 받음) */
const FONTS = ['https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;600;700&family=Noto+Sans+Devanagari:wght@400;600;700&display=swap'];
function loadFonts() {
  FONTS.forEach((href) => {
    if (document.querySelector('link[href="' + href + '"]')) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  });
}

const byKey = (k) => INTERVIEWS.find((x) => x.key === k);
const nameOf = (it, lang) => (lang !== 'ko' && it.aliasL && it.aliasL[lang]) || it.alias || '';
const bodyOf = (it, lang) => it[lang] || it.en || it.ko;

/* 아이콘 — E9-Bridge 주요 서비스와 같은 선 굵기(48 격자, 선 1.7, 강조선 파랑) */
const SVC_IC = {
  todo: <svg viewBox="0 0 48 48"><rect x="10" y="8" width="28" height="34" rx="3" /><path d="M18 8V5.5h12V8" /><path d="M17 18h14M17 25h14M17 32h8" /><path className="ac" d="M29 33l3 3 6-6" /></svg>,
  find: <svg viewBox="0 0 48 48"><path d="M24 42s-12-11.2-12-21a12 12 0 0 1 24 0c0 9.8-12 21-12 21z" /><circle className="ac" cx="24" cy="21" r="4.5" /></svg>,
  plan: <svg viewBox="0 0 48 48"><rect x="7" y="10" width="34" height="31" rx="3" /><path d="M7 19h34M16 6v8M32 6v8" /><path className="ac" d="M15 27h4M22 27h4M29 27h4M15 34h4M22 34h4" /></svg>,
  deadline: <svg viewBox="0 0 48 48"><rect x="7" y="10" width="34" height="31" rx="3" /><path d="M7 19h34M16 6v8M32 6v8" /><circle className="ac" cx="30" cy="31" r="6" /><path className="ac" d="M30 28v3.5l2.2 1.6" /></svg>,
  ins: <svg viewBox="0 0 48 48"><path d="M8 15h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" /><path d="M8 15 30 8l2 7" /><rect className="ac" x="29" y="23" width="13" height="9" rx="2" /><circle className="ac" cx="34" cy="27.5" r="1.2" /></svg>,
  itv: <svg viewBox="0 0 48 48"><circle cx="17" cy="17" r="6" /><path d="M6 38c0-6.6 4.9-11 11-11s11 4.4 11 11" /><path className="ac" d="M29 10h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4h-1a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" /></svg>,
  korean: <svg viewBox="0 0 48 48"><path d="M9 11h28a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H21l-9 7v-7H9a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3z" /><path className="ac" d="M15 17h7c0 4-2.6 7-7 8M27 15v12M27 21h4" /></svg>,
  route: <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="17" /><path d="M7 24h34M24 7c4.6 4.7 6.9 10.3 6.9 17S28.6 36.3 24 41c-4.6-4.7-6.9-10.3-6.9-17S19.4 11.7 24 7z" /><path className="ac" d="M33 9l6 1-1 6" /></svg>
};

const Chev = ({ d }) => <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d={d === 'l' ? 'M12.5 4 6.5 10l6 6' : 'M7.5 4l6 6-6 6'} /></svg>;

/* "삼성화재 1600-0266 · 1350" 같은 글의 전화번호를 누르면 걸리게 */
function TelText({ text }) {
  const parts = String(text || '').split(/(\b\d{4}-\d{4}\b|\b1\d{3}\b(?!-))/g);
  return <>{parts.map((p, i) => (/^(\d{4}-\d{4}|1\d{3})$/.test(p) ? <a key={i} className="pay-tel" href={'tel:' + p.replace(/-/g, '')}>{p}</a> : p))}</>;
}

export default function Hub({ lang, setLang, who = 'guest', userName = '', page = 'home', setPage, onLogin, onMe, onSettle, onPlan, onTutor, onRoute, mapEl = null, mapGo = 0 }) {
  const T = hub(lang);
  const box = useRef(null);
  const [solid, setSolid] = useState(page !== 'home');
  const [menu, setMenu] = useState(false);
  const [topOn, setTopOn] = useState(false);
  const isHome = page === 'home';
  /* 지도: 평소에는 페이지 안의 그림처럼(스크롤하면 그냥 지나감), 누르면 화면 가득 열리고 그 안에서 움직일 수 있음 */
  const [mapFull, setMapFull] = useState(false);
  useEffect(() => { if (page !== 'home') setMapFull(false); }, [page]);
  useEffect(() => {
    if (!mapFull) return undefined;
    const esc = (e) => { if (e.key === 'Escape' && !document.querySelector('.pl-dock:focus-within')) setMapFull(false); };
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
  }, [mapFull]);
  useEffect(loadFonts, []);
  /* 도착 후 할 일 · 지원 찾기 · 30일 일정 → 주요 서비스 아래 지도까지 내려 줍니다 */
  useEffect(() => {
    if (!mapGo) return undefined;
    const tm = setTimeout(() => {
      const el = document.getElementById('hub-map');
      if (el && box.current) box.current.scrollTo({ top: el.offsetTop - (parseInt(getComputedStyle(box.current).getPropertyValue('--hh'), 10) || 84) });
      setMapFull(true);
    }, 120);
    return () => clearTimeout(tm);
  }, [mapGo]);

  useEffect(() => { if (box.current) box.current.scrollTop = 0; setMenu(false); setSolid(page !== 'home'); setTopOn(false); }, [page]);
  const onScroll = () => {
    const y = box.current ? box.current.scrollTop : 0;
    setSolid(!isHome || y > 40); setTopOn(y > 600);
  };
  useEffect(() => {
    if (!menu) return undefined;
    const esc = (e) => { if (e.key === 'Escape') setMenu(false); };
    addEventListener('keydown', esc); return () => removeEventListener('keydown', esc);
  }, [menu]);

  const go = (p) => { setMenu(false); setPage(p); };
  const MENU = [
    { k: 'home', t: T.home, on: () => go('home') },
    { k: 'todo', t: T.svcTodo, on: () => onSettle('todo') },
    { k: 'find', t: T.svcFind, on: () => onSettle('find') },
    { k: 'plan', t: T.svcPlan, on: onPlan },
    { k: 'deadline', t: T.svcDeadline, on: () => go('deadline') },
    { k: 'ins', t: T.svcIns, on: () => go('ins') },
    { k: 'itv', t: T.svcItv, on: () => go('itv') },
    { k: 'korean', t: T.svcKorean, on: onTutor },
    { k: 'route', t: T.svcRoute, on: onRoute }
  ];

  return (
    <div className={'hub' + (isHome ? ' is-home' : ' is-sub') + (menu ? ' menu-open' : '') + (mapFull && isHome ? ' map-full' : '')} ref={box} onScroll={onScroll}>
      <a className="skip" href="#hub-main">{lang === 'ko' ? '본문으로 건너뛰기' : 'Skip to content'}</a>

      {/* ▼ 머리말 — 첫 화면에서는 사진 위에 투명하게, 내리면 흰 바탕 */}
      <header className={'topbar' + (solid || menu ? ' is-solid' : '')}>
        <div className="wrap topbar-in">
          {/* ArriveKR 탑승권 로고 — 누르면 지구본 첫 화면으로 */}
          <button type="button" className="brand hub-brand" onClick={onRoute} aria-label="ArriveKR" title={T.svcRoute}>
            <img className="hub-logo" src="/arrivekr-logo.png" alt="ArriveKR" width="147" height="44" />
            <span className="brand-text"><em>{T.brandSub}</em></span>
          </button>
          <div className="util">
            <div className="lang">
              <span className="lang-label" aria-hidden="true">{T.lang}</span>
              <select className="lang-select" value={lang} onChange={(e) => setLang(e.target.value)} aria-label="Language">
                {LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}
              </select>
            </div>
            {userName
              ? <button type="button" className="auth-btn" onClick={onMe} title={T.me}>{userName}</button>
              : <button type="button" className="auth-btn" onClick={onLogin}>{T.login}</button>}
            <button type="button" className="menu-btn" aria-expanded={menu} aria-label={menu ? T.menuClose : T.menuOpen} onClick={() => setMenu((m) => !m)}>
              <span className="menu-ic" aria-hidden="true"><i /></span><span className="menu-txt" aria-hidden="true">{T.menu}</span>
            </button>
          </div>
        </div>
      </header>

      {/* ▼ 전체 메뉴 (E9-Bridge 와 같은 남색 덮개) */}
      <nav className={'hub-menu' + (menu ? ' is-open' : '')} aria-hidden={!menu} aria-label="Menu">
        <div className="hub-menu-in">
          {MENU.map((m) => (
            <button type="button" key={m.k} tabIndex={menu ? 0 : -1} className={page === m.k ? 'is-on' : ''} onClick={() => { setMenu(false); m.on(); }}>{m.t}</button>
          ))}
        </div>
        <div className="secnav-util hub-menu-util">
          <a href="tel:1345" tabIndex={menu ? 0 : -1}><b>1345</b><span>{T.of1345}</span></a>
          <a href="tel:1350" tabIndex={menu ? 0 : -1}><b>1350</b><span>{T.of1350}</span></a>
        </div>
      </nav>

      <main id="hub-main">
        {page === 'home' && <Home T={T} lang={lang} setPage={go} onSettle={onSettle} onPlan={onPlan} onTutor={onTutor} onRoute={onRoute} scroller={box} mapEl={mapEl} mapFull={mapFull} setMapFull={setMapFull} />}
        {page === 'deadline' && <Deadline T={T} lang={lang} who={who} setPage={go} />}
        {page === 'ins' && <Insurance T={T} lang={lang} who={who} setPage={go} />}
        {page === 'itv' && <Interviews T={T} lang={lang} setPage={go} />}
      </main>

      <Footer T={T} lang={lang} page={page} />

      <button type="button" className={'to-top' + (topOn ? ' is-on' : '')} aria-label={T.toTop || 'Top'} onClick={() => box.current && box.current.scrollTo({ top: 0, behavior: 'smooth' })}>{T.top}</button>
    </div>
  );
}

/* ───────── 첫 화면 ───────── */
function Home({ T, lang, setPage, onSettle, onPlan, onTutor, onRoute, scroller, mapEl, mapFull, setMapFull }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(() => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } });
  const [run, setRun] = useState(0);            // 진행 막대를 처음부터 다시 그리기
  useEffect(() => {
    setRun((r) => r + 1);
    if (paused) return undefined;
    const tm = setTimeout(() => setI((x) => (x + 1) % HERO.length), HERO_MS);
    return () => clearTimeout(tm);
  }, [i, paused]);
  const cur = byKey(HERO[i][0]);

  const SVC = [
    ['todo', T.svcTodo, () => onSettle('todo')], ['find', T.svcFind, () => onSettle('find')], ['plan', T.svcPlan, onPlan],
    ['deadline', T.svcDeadline, () => setPage('deadline')], ['ins', T.svcIns, () => setPage('ins')], ['itv', T.svcItv, () => setPage('itv')],
    ['korean', T.svcKorean, onTutor], ['route', T.svcRoute, onRoute]
  ];
  const toSvc = (e) => { e.preventDefault(); const el = document.getElementById('hub-svc'); if (el && scroller.current) scroller.current.scrollTo({ top: el.offsetTop - 60, behavior: 'smooth' }); };

  return (
    <>
      <section className="hv" aria-roledescription="carousel" aria-label="ArriveKR">
        {HERO.map(([k, pos], n) => (
          <div key={k} className={'hv-slide' + (n === i ? ' is-on' : '')} style={{ backgroundImage: `url('/e9/${k}.jpg')`, backgroundPosition: `center ${pos}` }} />
        ))}
        <div className="hv-shade" aria-hidden="true" />
        <div className="wrap hv-in">
          <p className="hv-eyebrow" aria-hidden="true">{T.eyebrow}</p>
          <h1 className="hero-title">{T.heroTitle}</h1>
          <p className="hero-lead">{T.heroLead}</p>
        </div>
        <div className="hv-ctrl">
          <div className="wrap">
            <p className="hv-cap">{cur ? T.navInterview + ' · ' + nameOf(cur, lang) : ''}</p>
            <div className="hv-nav">
              <span className="hv-count" aria-hidden="true"><b>{String(i + 1).padStart(2, '0')}</b><i>/</i><span>{String(HERO.length).padStart(2, '0')}</span></span>
              <button type="button" className="hv-btn" aria-label={T.carPrev} onClick={() => setI((x) => (x + HERO.length - 1) % HERO.length)}><Chev d="l" /></button>
              <button type="button" className="hv-btn" aria-label={paused ? T.hvPlay : T.hvPause} onClick={() => setPaused((p) => !p)}>
                {paused ? <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4l10 6-10 6z" /></svg>
                        : <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><rect x="5" y="4" width="3" height="12" rx="1" /><rect x="12" y="4" width="3" height="12" rx="1" /></svg>}
              </button>
              <button type="button" className="hv-btn" aria-label={T.carNext} onClick={() => setI((x) => (x + 1) % HERO.length)}><Chev d="r" /></button>
            </div>
          </div>
        </div>
        <a className="hv-scroll" href="#hub-svc" aria-hidden="true" tabIndex={-1} onClick={toSvc}>SCROLL</a>
        <div className="hv-bar" aria-hidden="true"><i key={run} className={paused ? '' : 'is-run'} /></div>
      </section>

      <section className="band" id="hub-svc">
        <div className="wrap">
          <div className="sec-head">
            <p className="sec-eyebrow" aria-hidden="true">ArriveKR Service</p>
            <h2 className="sec-title">{T.svcTitle}</h2>
          </div>
          <ul className="svc-list">
            {SVC.map(([k, label, on]) => (
              <li key={k}><button type="button" onClick={on}><span className="svc-ic" aria-hidden="true">{SVC_IC[k]}</span><span className="svc-name">{label}</span></button></li>
            ))}
          </ul>
        </div>
      </section>

      {/* ▼ 지도 — 예전 정착 화면(도착 후 할 일 · 지원 찾기 · 30일 일정) 그대로 */}
      {mapEl && (
        <section className={'hub-map' + (mapFull ? ' is-full' : '')} id="hub-map" aria-label={T.svcFind}>
          {mapEl}
          {!mapFull && (
            <button type="button" className="hub-map-cover" onClick={() => setMapFull(true)} aria-label={T.mapOpen}>
              <span><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" /></svg>{T.mapOpen}</span>
            </button>
          )}
          {mapFull && (
            <button type="button" className="hub-map-close" onClick={() => setMapFull(false)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7" /></svg>{T.mapClose}
            </button>
          )}
        </section>
      )}

      <section className="comm" aria-labelledby="hub-comm-t">
        <div className="wrap">
          <div className="sec-head">
            <p className="sec-eyebrow" aria-hidden="true">Community</p>
            <h2 className="sec-title" id="hub-comm-t">{T.commTitle}</h2>
            <p className="comm-lead"><span>{T.commLead1}</span><br /><span>{T.commLead2}</span></p>
          </div>
          <ul className="comm-list">
            <li><a className="comm-ic comm-ig" href={IG} target="_blank" rel="noopener noreferrer" aria-label={T.commIg}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" /></svg>
            </a><span className="comm-name" aria-hidden="true">Instagram</span></li>
            <li><a className="comm-ic comm-fb" href={FB} target="_blank" rel="noopener noreferrer" aria-label={T.commFb}>
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.9v3h2.6V21h3.1z" /></svg>
            </a><span className="comm-name" aria-hidden="true">Facebook</span></li>
          </ul>
        </div>
      </section>
    </>
  );
}

/* 하위 쪽 머리 — 남색 띠 + 이동 경로 + 큰 제목 */
function SubHead({ T, title, en, setPage }) {
  return (
    <>
      <div className="subvis">
        <div className="wrap">
          <nav className="crumb" aria-label="breadcrumb">
            <button type="button" className="crumb-home" aria-label={T.home} onClick={() => setPage('home')}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 10.5 12 4l8.5 6.5V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" /></svg></button>
            <span className="crumb-sep" aria-hidden="true" /><span>{title}</span>
          </nav>
          <p className="subvis-en" aria-hidden="true">{en}</p>
        </div>
      </div>
      <div className="wrap page-head"><h1>{title}</h1></div>
    </>
  );
}

/* 결과 카드 하나 (남은 날 · 날짜 · 규칙) */
function DCard({ T, k, days, date, rule }) {
  const cls = days < 0 ? 'is-stop' : days === 0 ? 'is-stop' : days <= 7 ? 'is-warn' : 'is-ok';
  return (
    <article className={'dcard ' + cls}>
      <p className="dcard-k">{k}</p>
      <p className="dcard-n"><span className="num">{days < 0 ? Math.abs(days) : days}</span><span className="unit">{days < 0 ? T.daysOver : days === 0 ? T.dueToday : T.daysUnit}</span></p>
      <p className="dcard-d">{date}</p>
      <p className="dcard-r">{rule}</p>
    </article>
  );
}

/* ───────── 사업장 변경 기한 ───────── */
function Deadline({ T, lang, who, setPage }) {
  const [leave, setLeave] = useState(() => uget(who, 'e9.leave', ''));
  const [apply, setApply] = useState(() => uget(who, 'e9.apply', ''));
  const [shown, setShown] = useState(() => !!uget(who, 'e9.leave', ''));
  const r = shown ? C.deadline(leave, apply) : null;
  const day = (d) => C.fmtDay(d, lang, T.weekdays);
  const submit = (e) => { e.preventDefault(); if (!leave) return; uset(who, 'e9.leave', leave); uset(who, 'e9.apply', apply || ''); setShown(true); };
  const reset = () => { setLeave(''); setApply(''); setShown(false); uset(who, 'e9.leave', ''); uset(who, 'e9.apply', ''); };
  let msg = null;
  if (r && !r.bad) {
    const lines = [];
    let cls = 'callout';
    if (r.applyDays < 0) { cls = 'callout is-stop'; lines.push(T.msgOver); } else if (r.applyDays <= 7) { cls = 'callout is-warn'; lines.push(T.msgWarn); } else lines.push(T.msgOk);
    if (r.jobDays < 0) lines.push(T.msgJobOver); else if (r.jobDays <= 14) lines.push(T.msgJobWarn);
    if (!apply) lines.push(T.msgEstimate);
    msg = <p className={cls}>{lines.join(' ')}</p>;
  }
  return (
    <>
      <SubHead T={T} title={T.svcDeadline} en={T.enDeadline} setPage={setPage} />
      <section className="band">
        <div className="wrap">
          <p className="sec-lead">{T.dlLead}</p>
          <div className="calc-card">
            <h2>{T.dlTitle}</h2>
            <form className="form" autoComplete="off" onSubmit={submit}>
              <div className="field">
                <label htmlFor="hub-leave">{T.dlLeaveDate}</label>
                <input type="date" id="hub-leave" required value={leave} onChange={(e) => setLeave(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="hub-apply">{T.dlApplyDate.replace(/\s*\(.*\)\s*$/, '')} <span className="opt">{T.optional}</span></label>
                <input type="date" id="hub-apply" value={apply} onChange={(e) => setApply(e.target.value)} />
                {T.dlApplyHint && <p className="hint">{T.dlApplyHint}</p>}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-go">{T.dlCalc}</button>
                <button type="button" className="btn btn-ghost" onClick={reset}>{T.reset}</button>
              </div>
            </form>
            {r && r.bad && <div className="dday"><p className="callout is-stop">{T.dlBadDate}</p></div>}
            {r && !r.bad && (
              <div className="dday">
                <div className="dday-cards">
                  <DCard T={T} k={T.dlCardApply} days={r.applyDays} date={day(r.applyDue)} rule={T.dlRuleApply} />
                  <DCard T={T} k={T.dlCardJob} days={r.jobDays} date={day(r.jobDue)} rule={T.dlRuleJob} />
                </div>
                <div className="live">
                  <div className="live-track">
                    <span className="live-fill" style={{ width: r.pos + '%' }} />
                    <span className="live-pin" style={{ left: r.pos + '%' }}><b>{T.tlToday}</b></span>
                  </div>
                  <div className="live-labels"><span>{C.fmt(r.leave)}</span><span>{C.fmt(r.applied || r.applyDue)}</span><span>{C.fmt(r.jobDue)}</span></div>
                </div>
                {msg}
              </div>
            )}
          </div>
          <p className="callout hub-note">{T.disclaimer}</p>
        </div>
      </section>
    </>
  );
}

/* ───────── 출국만기보험 · 출국 정산 ───────── */
function Insurance({ T, lang, who, setPage }) {
  const day = (d) => C.fmtDay(d, lang, T.weekdays);
  const won = (n) => { const v = Math.round(n); try { return v.toLocaleString('ko-KR') + (T.wonUnit || '원'); } catch (e) { return v + (T.wonUnit || '원'); } };
  /* 출국 예정일 → 신고·청구 기한 */
  const [exit, setExit] = useState(() => uget(who, 'e9.exit', ''));
  const [exitOn, setExitOn] = useState(() => !!uget(who, 'e9.exit', ''));
  const p = exitOn ? C.payout(exit) : null;
  /* 보험금 어림 */
  const [wage, setWage] = useState(() => uget(who, 'e9.wage', ''));
  const [start, setStart] = useState(() => uget(who, 'e9.start', ''));
  const [end, setEnd] = useState(() => uget(who, 'e9.end', ''));
  const [insOn, setInsOn] = useState(() => !!(uget(who, 'e9.wage', '') && uget(who, 'e9.start', '')));
  const r = insOn ? C.insurance(wage, start, end) : null;

  let pmsg = null;
  if (p) pmsg = p.claimDays < 0 ? ['callout is-stop', T.pyMsgOver] : p.claimDays <= 7 || p.reportDays < 0 ? ['callout is-warn', T.pyMsgWarn] : ['callout', T.pyMsgOk];

  return (
    <>
      <SubHead T={T} title={T.svcIns} en={T.enIns} setPage={setPage} />
      <section className="band">
        <div className="wrap">
          <p className="sec-lead">{T.pyLead}</p>

          {/* 출국만기보험 얼마나 쌓였을까 */}
          <div className="calc-card pay-form-card">
            <h3>{T.insTitle}</h3>
            <p className="sec-lead">{T.insLead}</p>
            <form className="form" autoComplete="off" onSubmit={(e) => { e.preventDefault(); uset(who, 'e9.wage', wage); uset(who, 'e9.start', start); uset(who, 'e9.end', end); setInsOn(true); }}>
              <div className="field">
                <label htmlFor="hub-wage">{T.insWageLabel}</label>
                <input type="number" id="hub-wage" min="0" step="any" inputMode="numeric" placeholder="2096270" required value={wage} onChange={(e) => setWage(e.target.value)} />
                <p className="hint">{T.insWageHint}</p>
              </div>
              <div className="field">
                <label htmlFor="hub-start">{T.insStartLabel}</label>
                <input type="date" id="hub-start" required value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="hub-end">{T.insEndLabel}</label>
                <input type="date" id="hub-end" value={end} onChange={(e) => setEnd(e.target.value)} />
                <p className="hint">{T.insEndHint}</p>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-go">{T.insCalc}</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setWage(''); setStart(''); setEnd(''); setInsOn(false); ['wage', 'start', 'end'].forEach((k) => uset(who, 'e9.' + k, '')); }}>{T.reset}</button>
              </div>
            </form>
            {r && (
              <div>
                <div className="ins-grid">
                  <article className="ins-box"><p className="ins-k">{T.insWorked}</p>
                    <p className="ins-v">{r.bad ? '–' : (r.years > 0 ? r.years + (T.yearUnit || '년') + ' ' : '') + r.months + (T.monthUnit || '개월') + ' (' + r.days + (T.dayUnitPlain || '일') + ')'}</p></article>
                  <article className="ins-box"><p className="ins-k">{T.insFrom}</p><p className="ins-v">{r.bad ? '–' : day(r.joinDue) + ' ' + (T.insFromTail || '')}</p><p className="ins-r">{T.insFromRule}</p></article>
                  <article className={'ins-box' + (r.bad ? '' : r.short ? ' is-warn' : ' is-go')}><p className="ins-k">{T.insElig}</p><p className="ins-v">{r.bad ? '–' : day(r.eligible)}</p><p className="ins-r">{T.insEligRule}</p></article>
                </div>
                {!r.bad && (
                  <div className="ins-money">
                    <div className="ins-money-row"><span>{T.insSaved}</span><b>{won(r.saved)}</b></div>
                    <div className="ins-money-row"><span>{T.insLegal}</span><b>{won(r.legal)}</b></div>
                    {r.gap > 10000 && <div className="ins-money-row is-gap"><span>{T.insGap}</span><b>{won(r.gap)}</b></div>}
                  </div>
                )}
                <p className={'callout' + (r.bad ? ' is-stop' : r.short ? ' is-warn' : '')}>{r.bad ? T.insErrOrder : r.short ? T.insMsgShort.replace('{d}', String(r.short)) : T.insMsgOk}</p>
              </div>
            )}
            <p className="callout is-warn">{T.insWarn}</p>
          </div>

          {/* 출국 예정일 → 신고·청구 기한 */}
          <div className="calc-card pay-form-card hub-gap">
            <h3>{T.pyDateLabel}</h3>
            <form className="form form-inline" autoComplete="off" onSubmit={(e) => { e.preventDefault(); if (!exit) return; uset(who, 'e9.exit', exit); setExitOn(true); }}>
              <div className="field"><label htmlFor="hub-exit" className="sr">{T.pyDateLabel}</label>
                <input type="date" id="hub-exit" required value={exit} onChange={(e) => setExit(e.target.value)} /></div>
              <div className="form-actions">
                <button type="submit" className="btn btn-go">{T.pyCalc}</button>
                <button type="button" className="btn btn-ghost" onClick={() => { setExit(''); setExitOn(false); uset(who, 'e9.exit', ''); }}>{T.reset}</button>
              </div>
            </form>
            {p && (
              <div className="dday">
                <div className="dday-cards">
                  <DCard T={T} k={T.pyCardReport} days={p.reportDays} date={day(p.reportDue)} rule={T.pyRuleReport} />
                  <DCard T={T} k={T.pyCardClaim} days={p.claimDays} date={day(p.claimDue)} rule={T.pyRuleClaim} />
                </div>
                <p className={pmsg[0]}>{pmsg[1]}</p>
              </div>
            )}
            <p className="callout is-warn">{T.pyLimit}</p>
            <p className="src">{T.askSourceLabel}: {PAY_SRC} · {T.ntCheckedLabel} {PAY_CHECKED}</p>
          </div>

          {/* 떠나기 전에 확인할 다섯 가지 */}
          <div className="pay-hero">
            <h3 className="sub-h">{T.pyListTitle || T.payHero}</h3>
            <p className="pay-hero-lead">{T.pyHeroLead}</p>
            <div className="pay-list">
              {(T.pyItems || []).map((x, n) => (
                <div className="pay-item" key={n}>
                  <span className="pay-num">{n + 1}</span>
                  <h4><span>{x.t}</span></h4>
                  <p>{x.w}</p>
                  <p className="pay-where"><TelText text={x.r} /></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────── 인터뷰 ───────── */
function Interviews({ T, lang, setPage }) {
  const list = [...INTERVIEWS].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return (
    <>
      <SubHead T={T} title={T.svcItv} en={T.enItv} setPage={setPage} />
      <section className="band">
        <div className="wrap">
          <h2>{T.itvTitle}</h2>
          <p className="sec-lead">{T.itvLead}</p>
          <div className="itv-list">
            {list.map((it) => {
              const b = bodyOf(it, lang); if (!b) return null;
              const facts = [it.country && T.itvCountries ? T.itvCountries[it.country] || it.country : '', it.age ? T.itvAge.replace('{a}', it.age) : '',
                it.years ? T.itvYears.replace('{y}', it.years) : '', it.field && T.itvFields ? T.itvFields[it.field] || it.field : ''].filter(Boolean);
              return (
                <article className="itv-card" key={it.key}>
                  <div className="itv-who"><span className="itv-alias">{(T.itvAlias || '{n}').replace('{n}', nameOf(it, lang))}</span>{facts.length > 0 && <span className="itv-facts">{facts.join(' · ')}</span>}</div>
                  {it.photo && <figure className="itv-photo"><img src={it.photo} alt={(lang !== 'ko' && it.photoAltL && it.photoAltL[lang]) || it.photoAlt || ''} loading="lazy" /></figure>}
                  {b.intro && <p className="itv-intro">{b.intro}</p>}
                  {(b.qa || []).map((q, n) => <div className="itv-qa" key={n}><p className="itv-q">{q.q}</p><p className="itv-a">{q.a}</p></div>)}
                  {b.useQuote && <div className="itv-usequote">{T.itvUseQuoteLabel && <p className="itv-usequote-label">{T.itvUseQuoteLabel}</p>}<blockquote className="itv-quote"><p>{b.useQuote}</p></blockquote></div>}
                  {it.date && <p className="itv-date">{it.date}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

/* ───────── 바닥글 (E9-Bridge 와 같은 어두운 띠) ───────── */
function Footer({ T, lang, page }) {
  return (
    <footer className="band-ink">
      <div className="wrap">
        <div className="ft-brand">
          <img className="hub-logo" src="/arrivekr-logo.png" alt="ArriveKR" width="134" height="40" />
          <div><em>{T.brandSub}</em></div>
        </div>
        <h2>{T.ofTitle}</h2>
        <p className="sec-lead">{T.ofLead}</p>
        <ul className="official">
          <li><b><a href="tel:1345">1345</a></b><span>{T.of1345}</span></li>
          <li><b><a href="tel:1350">1350</a></b><span>{T.of1350}</span></li>
          <li><b><a href="https://www.eps.go.kr" target="_blank" rel="noopener noreferrer">eps.go.kr</a></b><span>{T.ofEps}</span></li>
          <li><b><a href="https://www.hikorea.go.kr" target="_blank" rel="noopener noreferrer">hikorea.go.kr</a></b><span>{T.ofHi}</span></li>
        </ul>
        <div className="official-notdo">
          <p className="official-notdo-h">{T.ndTitle}</p>
          <p>· <span>{T.nd1}</span></p>
          <p>· <span>{T.nd2}</span></p>
          <p>· <span>{T.nd3}</span></p>
        </div>
        <div className="ft-contact">
          <a className="ft-mail" href={'mailto:' + MAIL}><span>{T.ftMail}</span><span className="ft-mail-addr">{MAIL}</span></a>
          <div className="ft-social">
            <a href={IG} target="_blank" rel="noopener noreferrer" className="ft-sns" aria-label={T.ftInstagram || 'Instagram'}>
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
                <defs><radialGradient id="hubIg" cx="30%" cy="107%" r="150%"><stop offset="0" stopColor="#fdf497" /><stop offset=".05" stopColor="#fdf497" /><stop offset=".45" stopColor="#fd5949" /><stop offset=".6" stopColor="#d6249f" /><stop offset=".9" stopColor="#285AEB" /></radialGradient></defs>
                <rect x="1.5" y="1.5" width="21" height="21" rx="6" fill="url(#hubIg)" />
                <rect x="4.6" y="4.6" width="14.8" height="14.8" rx="4.2" fill="none" stroke="#fff" strokeWidth="1.7" />
                <circle cx="12" cy="12" r="3.7" fill="none" stroke="#fff" strokeWidth="1.7" />
                <circle cx="17.2" cy="6.9" r="1.15" fill="#fff" />
              </svg>
            </a>
            <a href={FB} target="_blank" rel="noopener noreferrer" className="ft-sns" aria-label={T.ftFacebook || 'Facebook'}>
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
                <circle cx="12" cy="12" r="10.5" fill="#1877F2" />
                <path fill="#fff" d="M15.1 12.6l.42-3.030h-2.9V7.6c0-.83.28-1.56 1.5-1.56h1.52V3.32c-.27-.04-.84-.12-1.92-.12-2.26 0-3.82 1.38-3.82 3.9v2.47H7.98v3.03h2.92v7.83c.58.09 1.17.13 1.77.13s1.19-.04 1.77-.13v-7.83z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="official-foot">
          <p>{T.disclaimer}</p>
          <p>{T.ftLine}</p>
          <p><a className="foot-privacy" href={GITHUB} target="_blank" rel="noopener noreferrer">{T.github}</a></p>
          <ViewLinks lang={lang} hub={page} pc={T.pcView} mobile={T.mobileView} />
        </div>
      </div>
    </footer>
  );
}
