/* 마이페이지 — 프로필을 누르면 열립니다. 이 계정으로 해 둔 것을 한눈에:
   입국 준비 · 원주 정착 조건과 추천 지원 · 30일 정착 일정(다가오는 일) · 모의시험 기록 · 한국어 연습
   · 모든 기록은 이 브라우저에 계정별로 저장된 값을 읽어 보여 줍니다(서버로 보내지 않음). */
import { useMemo } from 'react';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';
import { get, uget, del } from '../lib/store.js';
import { nickOf } from '../lib/auth.js';
import { NEEDS, TOWNS, PLACES, recommend } from '../data/wonju.js';
import { EXAMS } from '../data/exams.js';
import { buildPlan, fmtDate } from '../lib/plan.js';
import { applyRules, docStep, ruleChips, EMPTY } from '../lib/replan.js';
import './mypage.css';

const W = {
  ko: { title: '마이페이지', joined: '가입 {d}', via: { kakao: '카카오 계정', google: 'Google 계정', id: '아이디 계정', guest: '로그인 전' }, logout: '로그아웃', sure: '로그아웃할까요? 기록은 이 기기에 그대로 남아요.',
    prep: '입국 준비', visa: '체류자격', entry: '입국 예정일', from: '출발 나라', none: '아직 없어요', todo: '도착 후 할 일', dday: 'D-{n}', dpast: '입국 {n}일째', today: '오늘 입국',
    settle: '원주 정착 지원', home: '내 집', needs: '필요한 것', town: '사는 곳', recs: '나에게 맞는 지원 {n}건', seeAll: '지원 찾기 열기',
    plan: '원주 정착 30일', planNone: '아직 일정을 만들지 않았어요', planMake: 'AI로 30일 일정 만들기', planOpen: '30일 일정 열기', next: '다가오는 일정', docs: '서류에서 넣은 일정 {n}건', rules: '내 조건', aiOn: 'AI 맞춤 설명 있음',
    exams: '모의시험 기록', examNone: '아직 본 시험이 없어요', examGo: '모의시험 보러 가기', best: '최고', last: '최근', level: { kiip: '{l}단계', topik: '{l}', eps: '' },
    korean: '한국어 연습', quiz: '연습 문제 {i}문제째 · 맞힌 수 {s}', chat: 'AI에게 물어본 것 {n}개',
    store: '기록은 이 기기의 브라우저에만 저장돼요. 다른 기기에서는 이어지지 않아요.', wipe: '이 계정의 기록 지우기', wipeSure: '이 계정의 체크·일정·시험 기록을 이 기기에서 모두 지울까요? 되돌릴 수 없어요.' },
  en: { title: 'My page', joined: 'Joined {d}', via: { kakao: 'Kakao account', google: 'Google account', id: 'ID account', guest: 'Not signed in' }, logout: 'Sign out', sure: 'Sign out? Your records stay on this device.',
    prep: 'Before arrival', visa: 'Visa', entry: 'Entry date', from: 'From', none: 'Not set', todo: 'After-arrival to-dos', dday: 'D-{n}', dpast: 'Day {n} in Korea', today: 'Arriving today',
    settle: 'Wonju settlement support', home: 'Home', needs: 'Needs', town: 'Lives in', recs: '{n} programs for you', seeAll: 'Open support finder',
    plan: 'My 30 days in Wonju', planNone: 'No plan yet', planMake: 'Build my 30-day plan with AI', planOpen: 'Open my 30-day plan', next: 'Coming up', docs: '{n} added from letters', rules: 'My conditions', aiOn: 'AI notes saved',
    exams: 'Mock test history', examNone: 'No tests taken yet', examGo: 'Take a mock test', best: 'Best', last: 'Last', level: { kiip: 'Level {l}', topik: '{l}', eps: '' },
    korean: 'Korean practice', quiz: 'Practice question {i} · {s} correct', chat: '{n} questions asked to AI',
    store: 'Records are saved only in this browser on this device.', wipe: 'Clear this account’s records', wipeSure: 'Delete all checks, plans and test records for this account on this device? This cannot be undone.' }
};
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const DAY = 86400000;

export default function MyPage({ who, user, lang, visa, entry, pax, countryLabel, checks, arriveSum, onClose, onLogout, onPlan, onSettle, onTutor }) {
  const t = lang === 'ko' ? W.ko : W.en;
  const K = lang === 'ko' ? 'ko' : 'en';
  useEsc(onClose);
  const provider = !user ? 'guest' : /^kakao:/.test(user) ? 'kakao' : /^google:/.test(user) ? 'google' : 'id';
  const name = user ? nickOf(user) : (pax || 'Guest');
  const acc = user ? get('users', {})[user.toLowerCase()] : null;

  /* 저장해 둔 값들 */
  const st = uget(who, 'settle', {});
  const home = uget(who, 'home');
  const extras = uget(who, 'plan.extras', []);
  const rules = { ...EMPTY, ...uget(who, 'plan.rules', {}) };
  const ai = uget(who, 'plan.ai');
  const exams = uget(who, 'exams', {});
  const hist = uget(who, 'examHist', []);
  const tutor = uget(who, 'tutor', {});
  const sv = st.visa || visa;
  const needs = st.needs || ['stay', 'health', 'korean'];
  const recs = useMemo(() => recommend({ visa: sv, town: st.town || 'wonju', needs, family: !!st.family }), [sv]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 30일 일정 (저장된 조건으로 다시 계산 — 화면의 일정과 같은 규칙) */
  const planMade = !!ai || extras.length > 0;
  const steps = useMemo(() => {
    try { return applyRules([...buildPlan({ visa: sv, needs, family: !!st.family, entry }), ...extras.map((x, i) => docStep(x, i, entry))], rules, entry); }
    catch (e) { return []; }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const today = new Date(new Date().setHours(0, 0, 0, 0));
  const upcoming = steps.filter((s) => s.date >= today).slice(0, 4);
  const showSteps = upcoming.length ? upcoming : steps.slice(0, 4);
  const dn = Math.round((new Date(entry).setHours(0, 0, 0, 0) - today) / DAY);
  const dText = dn > 0 ? fill(t.dday, { n: dn }) : dn === 0 ? t.today : fill(t.dpast, { n: -dn + 1 });

  const bestOf = (id) => hist.filter((h) => h.id === id).reduce((a, h) => (!a || h.total / h.max > a.total / a.max ? h : a), null);
  const lvText = (id, l) => (l ? fill(t.level[id] || '{l}', { l }) : '');
  const wipe = () => {
    if (!window.confirm(t.wipeSure)) return;
    try {
      const pre = 'arrive.u.' + (who || 'guest') + '.'; const ks = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(pre) && !k.endsWith('.nick')) ks.push(k); }
      ks.forEach((k) => localStorage.removeItem(k));
    } catch (e) { /* 무시 */ }
    del('u.' + who + '.view'); location.reload();
  };

  return (
    <div className="mp-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="mp" role="dialog" aria-modal="true" aria-label={t.title}>
        <header className="mp-h">
          <b>{t.title}</b>
          <button type="button" className="x-close" onClick={onClose} aria-label="close"><Icon n="close" size={20} /></button>
        </header>
        <div className="mp-body">
          {/* 프로필 */}
          <div className={'mp-prof ' + provider}>
            <span className="mp-av">{String(name).slice(0, 1).toUpperCase()}</span>
            <div>
              <b>{name}</b>
              <small><em>{t.via[provider]}</em>{acc && acc.at ? ' · ' + fill(t.joined, { d: fmtDate(new Date(acc.at), lang) }) : ''}</small>
            </div>
            {user && <button type="button" className="btn-o sm" onClick={() => { if (window.confirm(t.sure)) onLogout(); }}>{t.logout}</button>}
          </div>

          {/* 입국 준비 */}
          <section className="mp-card">
            <h3><Icon n="plane" size={18} />{t.prep}<span className="mp-dday">{dText}</span></h3>
            <dl className="mp-kv">
              <div><dt>{t.visa}</dt><dd>{visa}</dd></div>
              <div><dt>{t.entry}</dt><dd>{fmtDate(new Date(entry), lang)}</dd></div>
              <div><dt>{t.from}</dt><dd>{countryLabel || t.none}</dd></div>
            </dl>
            {arriveSum && (
              <div className="mp-prog"><span>{t.todo}</span><i><b style={{ width: Math.round((arriveSum.done / Math.max(1, arriveSum.total)) * 100) + '%' }} /></i><em>{arriveSum.done}/{arriveSum.total}</em></div>
            )}
          </section>

          {/* 원주 정착 지원 */}
          <section className="mp-card">
            <h3><Icon n="pin" size={18} />{t.settle}</h3>
            <dl className="mp-kv">
              <div><dt>{t.home}</dt><dd>{home ? home.label : t.none}</dd></div>
              <div><dt>{t.town}</dt><dd>{(TOWNS.find((x) => x.id === (st.town || 'wonju')) || TOWNS[0])[K]}</dd></div>
              <div><dt>{t.needs}</dt><dd className="mp-chips">{needs.map((n) => { const x = NEEDS.find((y) => y.id === n); return x ? <span key={n}>{x[K]}</span> : null; })}</dd></div>
            </dl>
            <p className="mp-sub">{fill(t.recs, { n: recs.length })}</p>
            <ul className="mp-list">{recs.slice(0, 3).map(({ p }) => <li key={p.id}><b>{p[K].t}</b><small>{p.org}</small></li>)}</ul>
            <button type="button" className="mp-go" onClick={onSettle}>{t.seeAll}<Icon n="next" size={16} /></button>
          </section>

          {/* 30일 정착 일정 */}
          <section className="mp-card">
            <h3><Icon n="calendar" size={18} />{t.plan}{ai && ai.ai && <em className="mp-ai">{t.aiOn}</em>}</h3>
            {!planMade && <p className="mp-empty">{t.planNone}</p>}
            {showSteps.length > 0 && <>
              <p className="mp-sub">{t.next}</p>
              <ul className="mp-steps">
                {showSteps.map((s) => {
                  const pl = s.place && (PLACES[s.place] || (s.placeName ? { [K]: s.placeName } : null));
                  return (
                    <li key={s.id} className={s.src === 'doc' ? 'doc' : ''}>
                      <span className="mp-d">D+{s.day}<small>{fmtDate(s.date, lang)}</small></span>
                      <span><b>{s.t[K]}</b>{pl && <small><Icon n="pin" size={12} />{String(pl[K] || '').split(' (')[0]}</small>}</span>
                    </li>
                  );
                })}
              </ul>
            </>}
            {(extras.length > 0 || ruleChips(rules, lang).length > 0) && (
              <p className="mp-tags">
                {extras.length > 0 && <span className="doc"><Icon n="doc" size={12} />{fill(t.docs, { n: extras.length })}</span>}
                {ruleChips(rules, lang).map((c) => <span key={c.k}>{c.t}</span>)}
              </p>
            )}
            <button type="button" className="mp-go" onClick={onPlan}>{planMade ? t.planOpen : t.planMake}<Icon n="next" size={16} /></button>
          </section>

          {/* 모의시험 기록 */}
          <section className="mp-card">
            <h3><Icon n="study" size={18} />{t.exams}</h3>
            {!Object.keys(exams).length && <p className="mp-empty">{t.examNone}</p>}
            <div className="mp-exams">
              {['eps', 'kiip', 'topik'].filter((id) => exams[id]).map((id) => {
                const e = EXAMS[id], last = exams[id], best = bestOf(id) || last;
                return (
                  <div key={id} className="mp-ex" style={{ '--ec': e.color }}>
                    <b>{e.short}</b>
                    <span className="mp-sc"><strong>{last.total}</strong>/{last.max}</span>
                    <small>{t.last} · {fmtDate(new Date(last.at), lang)}{last.level ? ' · ' + lvText(id, last.level) : ''}</small>
                    {best.total / best.max > last.total / last.max && <small>{t.best} {best.total}/{best.max}</small>}
                    <i><b style={{ width: Math.round((last.total / last.max) * 100) + '%' }} /></i>
                  </div>
                );
              })}
            </div>
            {hist.length > 1 && (
              <ul className="mp-hist">{hist.slice(0, 6).map((h, k) => <li key={k}><span>{EXAMS[h.id] ? EXAMS[h.id].short : h.id}</span><span>{h.total}/{h.max}{h.level ? ' · ' + lvText(h.id, h.level) : ''}</span><small>{fmtDate(new Date(h.at), lang)}</small></li>)}</ul>
            )}
            <button type="button" className="mp-go" onClick={onTutor}>{t.examGo}<Icon n="next" size={16} /></button>
          </section>

          {/* 한국어 연습 */}
          {(tutor.i || (tutor.chat && tutor.chat.length)) ? (
            <section className="mp-card">
              <h3><Icon n="ko" size={18} />{t.korean}</h3>
              <p className="mp-sub">{fill(t.quiz, { i: (tutor.i || 0) + 1, s: tutor.score || 0 })}</p>
              {tutor.chat && tutor.chat.length > 0 && <p className="mp-sub">{fill(t.chat, { n: tutor.chat.filter((m) => m.me).length })}</p>}
            </section>
          ) : null}

          <p className="mp-note"><Icon n="info" size={14} />{t.store}</p>
          <button type="button" className="mp-wipe" onClick={wipe}>{t.wipe}</button>
        </div>
      </section>
    </div>
  );
}
