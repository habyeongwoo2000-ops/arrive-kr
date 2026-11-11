/* 내 정보 — 저장해 둔 것을 한곳에 모으고, 궁금한 메뉴를 바로 찾게 합니다.
   ------------------------------------------------------------------
   구성 (토스 '전체' 탭의 메뉴 검색, 정부24 '마이 정부24'의 진행 현황,
         당근 '나의 당근'의 프로필 + 묶음 메뉴를 참고)
     1. 프로필 — 이름, 체류자격, 나라, 로그인 상태
     2. 메뉴 찾기 — "기한", "집", "언어", "전화"처럼 치면 해당 섹션이나 화면으로 바로 갑니다
     3. 한눈에 보기 — 입국까지 D-day, 입국 준비, 정착도
     4. 섹션 바로가기 → 내 여정 / 정착 / 내 집 / 맞춤 지원 / 설정 / 도움받기
   저장 위치는 그대로입니다(이 기기 localStorage, 로그인하면 계정별로 나뉨). 이 화면은 읽어서 보여 주기만 합니다.
   ------------------------------------------------------------------ */

import { useMemo, useState } from 'react';
import Icon from './Icon.jsx';
import { my } from '../i18n/my.js';
import { fill, LANGS, LANG_NAMES } from '../i18n/ui.js';
import { rm, STAGES, stageOf, levelOf } from '../lib/roadmap.js';
import { NEEDS, TOWNS } from '../data/wonju.js';

const DAY = 86400000;
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const ddayOf = (entry) => {
  if (!entry) return null;
  const a = new Date(); a.setHours(0, 0, 0, 0);
  const n = Math.round((new Date(entry).setHours(0, 0, 0, 0) - a) / DAY);
  return n > 0 ? 'D-' + n : n === 0 ? 'D-DAY' : 'D+' + -n;
};

/* 첫 화면(탑승권 위 · 처음 패널)에 띄우는 "다시 오셨네요" 요약 — 저장한 것이 없으면 그리지 않습니다 */
export function MySummary({ lang, me, onContinue, onMore, dark = false }) {
  const s = my(lang);
  if (!me || !me.has) return null;
  const ratio = me.arrive && me.arrive.total ? me.arrive.done / me.arrive.total : 0;
  const chips = [
    me.visa && { k: 'visa', v: me.visa + (me.countryLabel ? ' · ' + me.countryLabel : '') },
    me.entry && { k: 'dd', l: s.tEntry, v: ddayOf(me.entry) },
    me.pre && me.pre.total > 0 && { k: 'pre', l: s.tPre, v: me.pre.done + '/' + me.pre.total },
    me.arrive && me.arrive.done > 0 && { k: 'set', l: s.tSettle, v: Math.round(ratio * 100) + '%' },
    me.home && { k: 'home', v: me.home.label, icon: true }
  ].filter(Boolean);
  return (
    <section className={'mysum' + (dark ? ' is-dark' : '')} aria-label={s.title}>
      <b className="mysum-h">{me.name ? fill(s.back, { name: me.name }) : s.backGuest}</b>
      <ul className="mysum-chips">
        {chips.map((c) => (
          <li key={c.k}>{c.icon && <Icon n="life" size={14} />}{c.l && <span>{c.l}</span>}<b>{c.v}</b></li>
        ))}
      </ul>
      <div className="mysum-act">
        {onContinue && <button type="button" className="mysum-go" onClick={onContinue}>{s.cont}</button>}
        {onMore && <button type="button" className="mysum-more" onClick={onMore}>{s.more}</button>}
      </div>
    </section>
  );
}

export default function MyPage({ lang, setLang, me, arriveItems, checks, setEntry, onGo, onClose, onLogin, onLogout, onClear }) {
  const s = my(lang);
  const R = rm(lang);
  const K = lang === 'ko' ? 'ko' : 'en';
  const [q, setQ] = useState('');

  const ratio = arriveItems.length ? arriveItems.filter((i) => checks[i.id]).length / arriveItems.length : 0;
  const stages = STAGES.map((id) => {
    const items = arriveItems.filter((it) => stageOf(it) === id);
    return { id, total: items.length, done: items.filter((it) => checks[it.id]).length };
  }).filter((g) => g.total);
  const preRatio = me.pre && me.pre.total ? me.pre.done / me.pre.total : 0;

  /* 메뉴 찾기: 제목 + 찾는 말(한국어·영어) → 이 화면의 섹션(#) 또는 다른 화면(action) */
  const entries = useMemo(() => [
    { t: s.tabs.trip, k: '여정 출발 나라 경로 기한 입국 날짜 trip route deadline entry date country', to: '#me-trip' },
    { t: s.visa, k: '비자 체류자격 visa', to: '#me-trip' },
    { t: s.goTicket, k: '탑승권 boarding pass ticket', go: 'ticket' },
    { t: s.tabs.settle, k: '정착 할 일 로드맵 체크 도착 settle todo roadmap check arrival', to: '#me-settle' },
    { t: s.goPlan, k: '30일 일정 AI 계획 plan 30 days', go: 'plan' },
    { t: s.tabs.home, k: '집 주소 거주지 home address', to: '#me-home' },
    { t: s.tabs.reco, k: '지원 혜택 필요 가족 support benefit needs family', to: '#me-reco' },
    { t: s.lang, k: '언어 language ngôn ngữ bahasa', to: '#me-set' },
    { t: s.account, k: '로그인 로그아웃 계정 account login sign', to: '#me-set' },
    { t: s.clear, k: '삭제 지우기 초기화 delete reset clear', to: '#me-set' },
    { t: s.h1345, k: '전화 상담 비자 call visa 1345', to: '#me-help' },
    { t: s.h0644, k: '전화 상담 일자리 사업장 call job workplace', to: '#me-help' },
    { t: s.hTutor, k: '한국어 시험 토픽 korean topik tutor', go: 'tutor' }
  ], [s]);
  const term = q.trim().toLowerCase();
  const hits = term ? entries.filter((e) => (e.t + ' ' + e.k).toLowerCase().includes(term)).slice(0, 6) : [];
  const jump = (e) => {
    setQ('');
    if (e.go) { onGo(e.go); return; }
    const el = document.getElementById(e.to.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const scrollTo = (id) => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const needNames = (me.needs || []).map((id) => { const n = NEEDS.find((x) => x.id === id); return n ? n[K] : null; }).filter(Boolean);
  const townName = (TOWNS.find((x) => x.id === me.town) || {})[K] || '';

  return (
    <aside className="me-panel" aria-label={s.title}>
      <div className="me-scroll">
        <div className="me-top">
          <button type="button" className="icon" onClick={onClose} aria-label={s.title}><Icon n="back" size={20} /></button>
          <b>{s.title}</b>
        </div>

        {/* 1. 프로필 */}
        <header className="me-card me-head">
          <span className="me-av" aria-hidden="true">{(me.name || '?').slice(0, 1).toUpperCase()}</span>
          <div className="me-who">
            <h2>{me.name ? fill(s.hello, { name: me.name }) : s.helloGuest}</h2>
            <p>{[me.visa, me.countryLabel].filter(Boolean).join(' · ') || s.traveler}</p>
          </div>
          {me.user
            ? <button type="button" className="me-btn" onClick={onLogout}>{s.logout}</button>
            : <button type="button" className="me-btn is-p" onClick={onLogin}>{s.login}</button>}
          {!me.user && <p className="me-note">{s.guest}</p>}
        </header>

        {/* 2. 메뉴 찾기 */}
        <div className="me-search" role="search">
          <Icon n="search" size={18} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={s.searchPh} aria-label={s.searchPh} />
          {term && (
            <ul className="me-hits">
              {hits.length ? hits.map((h) => <li key={h.t}><button type="button" onClick={() => jump(h)}>{h.t}</button></li>)
                : <li className="me-none">{s.searchNone}</li>}
            </ul>
          )}
        </div>

        {/* 3. 한눈에 보기 */}
        <div className="me-glance">
          <button type="button" onClick={() => scrollTo('me-trip')}><span>{s.tEntry}</span><b>{ddayOf(me.entry) || s.noEntry}</b></button>
          <button type="button" onClick={() => scrollTo('me-trip')}><span>{s.tPre}</span><b>{me.pre ? me.pre.done + '/' + me.pre.total : '-'}</b></button>
          <button type="button" onClick={() => scrollTo('me-settle')}><span>{s.tSettle}</span><b>{Math.round(ratio * 100)}%</b></button>
        </div>

        {/* 4. 섹션 바로가기 */}
        <nav className="me-tabs">
          {Object.entries({ trip: 'me-trip', settle: 'me-settle', home: 'me-home', reco: 'me-reco', set: 'me-set', help: 'me-help' })
            .map(([k, id]) => <button type="button" key={k} onClick={() => scrollTo(id)}>{s.tabs[k]}</button>)}
        </nav>

        <section className="me-card" id="me-trip">
          <h3>{s.tabs.trip}</h3>
          <dl className="me-dl">
            <div><dt>{s.from}</dt><dd>{me.countryLabel || s.noCountry}</dd></div>
            <div><dt>{s.visa}</dt><dd>{me.visa}{me.visaName ? ' · ' + me.visaName : ''}</dd></div>
            <div><dt>{s.entry}</dt><dd><input type="date" value={me.entry ? iso(me.entry) : ''} onChange={(e) => e.target.value && setEntry(new Date(e.target.value + 'T00:00:00'))} /></dd></div>
          </dl>
          <div className="me-bar"><i style={{ width: Math.round(preRatio * 100) + '%' }} /></div>
          <p className="me-sub">{s.tPre} {me.pre ? me.pre.done + '/' + me.pre.total : '-'}</p>
          <div className="me-act">
            <button type="button" className="me-btn is-p" onClick={() => onGo('route')}><Icon n="route" size={16} />{s.goRoute}</button>
            <button type="button" className="me-btn" onClick={() => onGo('ticket')}><Icon n="ticket" size={16} />{s.goTicket}</button>
          </div>
        </section>

        <section className="me-card" id="me-settle">
          <h3>{s.tabs.settle}</h3>
          <p className="me-level"><b>{R[levelOf(ratio)]}</b><span>{Math.round(ratio * 100)}%</span></p>
          <div className="me-bar"><i style={{ width: Math.round(ratio * 100) + '%' }} /></div>
          <ul className="me-stages">
            {stages.map((g) => (
              <li key={g.id} className={g.done === g.total ? 'is-done' : ''}><span>{R[g.id]}</span><b>{g.done}/{g.total}</b></li>
            ))}
          </ul>
          <div className="me-act">
            <button type="button" className="me-btn is-p" onClick={() => onGo('todo')}><Icon n="todo" size={16} />{s.goTodo}</button>
            <button type="button" className="me-btn" onClick={() => onGo('plan')}><Icon n="calendar" size={16} />{s.goPlan}</button>
          </div>
        </section>

        <section className="me-card" id="me-home">
          <h3>{s.tabs.home}</h3>
          {me.home ? <p className="me-home"><Icon n="life" size={16} /><b>{me.home.label}</b></p> : <p className="me-sub">{s.homeNone}</p>}
          <div className="me-act"><button type="button" className="me-btn" onClick={() => onGo('find')}><Icon n="pin" size={16} />{me.home ? s.goHomeEdit : s.goHome}</button></div>
        </section>

        <section className="me-card" id="me-reco">
          <h3>{s.tabs.reco}</h3>
          <dl className="me-dl">
            <div><dt>{s.town}</dt><dd>{townName || '-'}</dd></div>
            <div><dt>{s.needs}</dt><dd>{needNames.join(', ') || '-'}</dd></div>
            <div><dt>{s.family}</dt><dd>{me.family ? s.yes : s.no}</dd></div>
          </dl>
          <div className="me-act"><button type="button" className="me-btn" onClick={() => onGo('find')}><Icon n="sparkle" size={16} />{s.goFind}</button></div>
        </section>

        <section className="me-card" id="me-set">
          <h3>{s.tabs.set}</h3>
          <label className="me-field"><span>{s.lang}</span>
            <select value={lang} onChange={(e) => setLang(e.target.value)}>{LANGS.map((l) => <option key={l} value={l}>{LANG_NAMES[l]}</option>)}</select>
          </label>
          <div className="me-row"><span>{s.account}</span>
            {me.user ? <button type="button" className="me-btn" onClick={onLogout}>{s.logout} ({me.user})</button>
              : <button type="button" className="me-btn" onClick={onLogin}>{s.login}</button>}
          </div>
          <div className="me-clear">
            <b>{s.clear}</b><p className="me-sub">{s.clearLead}</p>
            <button type="button" className="me-btn" onClick={() => { if (window.confirm(s.clearAsk)) onClear(); }}>{s.clear}</button>
          </div>
        </section>

        <section className="me-card" id="me-help">
          <h3>{s.tabs.help}</h3>
          <ul className="me-help">
            <li><a href="tel:1345"><Icon n="call" size={18} /><span><b>{s.h1345}</b><small>{s.h1345s}</small></span></a></li>
            <li><a href="tel:16440644"><Icon n="call" size={18} /><span><b>{s.h0644}</b><small>{s.h0644s}</small></span></a></li>
            <li><button type="button" onClick={() => onGo('tutor')}><Icon n="ko" size={18} /><span><b>{s.hTutor}</b><small>{s.hTutorS}</small></span></button></li>
          </ul>
        </section>
      </div>
    </aside>
  );
}
