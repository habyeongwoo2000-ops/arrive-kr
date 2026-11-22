/* 왼쪽 메뉴 "E9-Bridge" — 팀이 처음 만든 E9-Bridge 를 ArriveKR 안의 한 화면으로.
   · page 'home': 인터뷰 사진 · 주요 서비스(누르면 ArriveKR 의 그 기능으로) · 인터뷰 미리보기 · 공식 창구
   · page 'itv' : 인터뷰 전체
   · 사업장 변경 기한 · 출국만기보험은 정착 지원(지도) 화면의 옆 서랍으로 엽니다 (WorkPanel). */

import { useEffect, useRef, useState } from 'react';
import './e9home.css';
import Icon from './Icon.jsx';
import { hub } from '../i18n/hub.js';
import { e9home } from '../i18n/e9home.js';
import { INTERVIEWS } from '../data/e9.js';

const HERO = [['itv-sohee', '40%'], ['itv-owner', '45%'], ['itv-asad', '30%'], ['itv-boss', '30%'], ['itv-tilo', '35%']];
const HERO_MS = 6000;
const IG = 'https://www.instagram.com/e9_bridge/';
const FB = 'https://www.facebook.com/profile.php?id=61591144925891';
const GITHUB = 'https://github.com/habyeongwoo2000-ops/arrive-kr';

const byKey = (k) => INTERVIEWS.find((x) => x.key === k);
const nameOf = (it, lang) => (lang !== 'ko' && it.aliasL && it.aliasL[lang]) || it.alias || '';
const bodyOf = (it, lang) => it[lang] || it.en || it.ko;
const reduced = () => { try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } };

/* 주요 서비스 아이콘 — ArriveKR 선 아이콘과 같은 굵기 */
const SVC_IC = {
  todo: <><rect x="10" y="8" width="28" height="34" rx="4" /><path d="M18 8V5.5h12V8M17 18h14M17 25h14M17 32h7" /><path className="ac" d="M29 33l3 3 6-6" /></>,
  find: <><path d="M24 42s-12-11.2-12-21a12 12 0 0 1 24 0c0 9.8-12 21-12 21z" /><circle className="ac" cx="24" cy="21" r="4.5" /></>,
  plan: <><rect x="7" y="10" width="34" height="31" rx="4" /><path d="M7 19h34M16 6v8M32 6v8" /><path className="ac" d="M15 27h4M22 27h4M29 27h4M15 34h4M22 34h4" /></>,
  deadline: <><rect x="7" y="10" width="34" height="31" rx="4" /><path d="M7 19h34M16 6v8M32 6v8" /><circle className="ac" cx="30" cy="31" r="6" /><path className="ac" d="M30 28v3.5l2.2 1.6" /></>,
  ins: <><path d="M8 15h28a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4z" /><path d="M8 15 30 8l2 7" /><rect className="ac" x="29" y="23" width="13" height="9" rx="2" /></>,
  itv: <><circle cx="17" cy="17" r="6" /><path d="M6 38c0-6.6 4.9-11 11-11s11 4.4 11 11" /><path className="ac" d="M29 10h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-6l-5 4v-4h-1a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z" /></>,
  korean: <><path d="M9 11h28a3 3 0 0 1 3 3v15a3 3 0 0 1-3 3H21l-9 7v-7H9a3 3 0 0 1-3-3V14a3 3 0 0 1 3-3z" /><path className="ac" d="M15 17h7c0 4-2.6 7-7 8M27 15v12M27 21h4" /></>,
  route: <><circle cx="24" cy="24" r="17" /><path d="M7 24h34M24 7c4.6 4.7 6.9 10.3 6.9 17S28.6 36.3 24 41c-4.6-4.7-6.9-10.3-6.9-17S19.4 11.7 24 7z" /><path className="ac" d="M33 9l6 1-1 6" /></>
};

export default function E9Home({ lang, page = 'home', setPage, onSettle, onWork, onPlan, onTutor, onRoute }) {
  const T = hub(lang);
  const E = e9home(lang);
  const box = useRef(null);
  useEffect(() => { if (box.current) box.current.scrollTop = 0; }, [page]);
  return (
    <div className="eh" ref={box}>
      <div className="eh-in">
        {page === 'itv'
          ? <Interviews T={T} E={E} lang={lang} onBack={() => setPage('home')} />
          : <Home T={T} E={E} lang={lang} setPage={setPage} onSettle={onSettle} onWork={onWork} onPlan={onPlan} onTutor={onTutor} onRoute={onRoute} />}
      </div>
    </div>
  );
}

function Home({ T, E, lang, setPage, onSettle, onWork, onPlan, onTutor, onRoute }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(reduced);
  const [run, setRun] = useState(0);
  useEffect(() => {
    setRun((r) => r + 1);
    if (paused) return undefined;
    const tm = setTimeout(() => setI((x) => (x + 1) % HERO.length), HERO_MS);
    return () => clearTimeout(tm);
  }, [i, paused]);
  const cur = byKey(HERO[i][0]);

  /* E9-Bridge 에서 하던 일 → 지금 ArriveKR 에서 그 일을 하는 곳 */
  const SVC = [
    ['deadline', T.svcDeadline, () => onWork('deadline')],
    ['ins', T.svcIns, () => onWork('ins')],
    ['itv', T.svcItv, () => setPage('itv')],
    ['todo', T.svcTodo, () => onSettle('todo')],
    ['find', T.svcFind, () => onWork('reco')],
    ['plan', T.svcPlan, onPlan],
    ['korean', T.svcKorean, onTutor],
    ['route', T.svcRoute, onRoute]
  ];
  const peek = INTERVIEWS.filter((it) => bodyOf(it, lang)).slice(0, 3);

  return (
    <>
      <header className="eh-top">
        <img src="/e9/logo-mark.svg" alt="" width="40" height="40" />
        <div><h1>E9-Bridge</h1><p>{E.sub}</p></div>
      </header>

      {/* 인터뷰 사진 — 실제로 만난 분들 */}
      <section className="eh-hero" aria-roledescription="carousel" aria-label="E9-Bridge">
        {HERO.map(([k, pos], n) => (
          <div key={k} className={'eh-slide' + (n === i ? ' is-on' : '')} style={{ backgroundImage: `url('${(byKey(k) || {}).photo || ''}')`, backgroundPosition: `center ${pos}` }} aria-hidden={n !== i} />
        ))}
        <div className="eh-shade" aria-hidden="true" />
        <div className="eh-copy">
          <h2>{E.heroT}</h2>
          <p>{E.heroL}</p>
        </div>
        <div className="eh-ctrl">
          <span className="eh-cap">{cur ? T.navInterview + ' · ' + nameOf(cur, lang) : ''}</span>
          <button type="button" aria-label={T.carPrev} onClick={() => setI((x) => (x + HERO.length - 1) % HERO.length)}><Icon n="back" size={16} /></button>
          <button type="button" aria-label={paused ? T.hvPlay : T.hvPause} onClick={() => setPaused((p) => !p)}><Icon n={paused ? 'play' : 'pause'} size={16} /></button>
          <button type="button" aria-label={T.carNext} onClick={() => setI((x) => (x + 1) % HERO.length)}><Icon n="next" size={16} /></button>
        </div>
        <div className="eh-bar" aria-hidden="true"><i key={run} className={paused ? '' : 'is-run'} /></div>
      </section>

      {/* 주요 서비스 */}
      <section className="eh-sec" aria-labelledby="eh-svc">
        <h2 id="eh-svc">{T.svcTitle}</h2>
        <ul className="eh-svc">
          {SVC.map(([k, label, on]) => (
            <li key={k}>
              <button type="button" onClick={on}>
                <svg className="eh-ic" viewBox="0 0 48 48" aria-hidden="true">{SVC_IC[k]}</svg>
                <span>{label}</span>
                <Icon n="next" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* 인터뷰 미리보기 */}
      <section className="eh-sec" aria-labelledby="eh-itv">
        <div className="eh-sec-h">
          <h2 id="eh-itv">{T.itvTitle}</h2>
          <button type="button" className="eh-more" onClick={() => setPage('itv')}>{E.seeAll}<Icon n="next" size={14} /></button>
        </div>
        <p className="eh-lead">{T.itvLead}</p>
        <ul className="eh-peek">
          {peek.map((it) => {
            const b = bodyOf(it, lang);
            return (
              <li key={it.key}>
                <button type="button" onClick={() => setPage('itv')}>
                  {it.photo && <img src={it.photo} alt="" loading="lazy" />}
                  <b>{(T.itvAlias || '{n}').replace('{n}', nameOf(it, lang))}</b>
                  <p>{b.useQuote || b.intro}</p>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Official T={T} />
    </>
  );
}

/* 공식 창구 · 하지 않는 것 · 소식 */
function Official({ T }) {
  return (
    <section className="eh-sec" aria-labelledby="eh-of">
      <h2 id="eh-of">{T.ofTitle}</h2>
      <p className="eh-lead">{T.ofLead}</p>
      <ul className="eh-of">
        <li><a href="tel:1345"><b>1345</b><span>{T.of1345}</span></a></li>
        <li><a href="tel:1350"><b>1350</b><span>{T.of1350}</span></a></li>
        <li><a href="https://www.eps.go.kr" target="_blank" rel="noopener noreferrer"><b>eps.go.kr</b><span>{T.ofEps}</span></a></li>
        <li><a href="https://www.hikorea.go.kr" target="_blank" rel="noopener noreferrer"><b>hikorea.go.kr</b><span>{T.ofHi}</span></a></li>
      </ul>
      <div className="eh-not">
        <h3>{T.ndTitle}</h3>
        <ul><li>{T.nd1}</li><li>{T.nd2}</li><li>{T.nd3}</li></ul>
      </div>
      <footer className="eh-foot">
        <p>{T.disclaimer}</p>
        <p className="eh-links">
          <a href={IG} target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href={FB} target="_blank" rel="noopener noreferrer">Facebook</a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer">{T.github}</a>
        </p>
      </footer>
    </section>
  );
}

/* ───────── 인터뷰 전체 ───────── */
function Interviews({ T, E, lang, onBack }) {
  const list = [...INTERVIEWS].sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  return (
    <>
      <header className="eh-top eh-top-sub">
        <button type="button" className="eh-back" onClick={onBack} aria-label={E.back} title={E.back}><Icon n="back" size={20} /></button>
        <div><h1>{T.itvTitle}</h1><p>{T.itvLead}</p></div>
      </header>
      <div className="eh-itv">
        {list.map((it) => {
          const b = bodyOf(it, lang); if (!b) return null;
          const facts = [it.country && T.itvCountries ? T.itvCountries[it.country] || it.country : '', it.age ? T.itvAge.replace('{a}', it.age) : '',
            it.years ? T.itvYears.replace('{y}', it.years) : '', it.field && T.itvFields ? T.itvFields[it.field] || it.field : ''].filter(Boolean);
          return (
            <article key={it.key}>
              {it.photo && <img src={it.photo} alt={(lang !== 'ko' && it.photoAltL && it.photoAltL[lang]) || it.photoAlt || ''} loading="lazy" />}
              <div className="eh-itv-b">
                <h2>{(T.itvAlias || '{n}').replace('{n}', nameOf(it, lang))}</h2>
                {facts.length > 0 && <p className="eh-facts">{facts.join(' · ')}</p>}
                {b.intro && <p className="eh-intro">{b.intro}</p>}
                {(b.qa || []).map((q, n) => <div className="eh-qa" key={n}><b>{q.q}</b><p>{q.a}</p></div>)}
                {b.useQuote && <blockquote><span>{T.itvUseQuoteLabel}</span><p>{b.useQuote}</p></blockquote>}
                {it.date && <p className="eh-date">{it.date}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
