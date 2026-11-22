/* 정착 지원 지도 위 옆 서랍 — 사업장 변경 기한 · 출국만기보험 (E9-Bridge 계산 규칙 그대로, 모양은 ArriveKR)
   · 왼쪽 정착 패널의 "변경 기한 ›" · "만기보험 ›" 탭을 누르면 패널 바로 옆에 떠서 열립니다.
   · 입력값은 이 기기에만(로그인하지 않으면 이번 방문 동안만) 남습니다 — 예전 정착 지원 홈과 같은 저장 이름(e9.*). */

import { useState } from 'react';
import './work.css';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';
import { hub } from '../i18n/hub.js';
import { e9home } from '../i18n/e9home.js';
import { PAY_SRC, PAY_CHECKED } from '../data/e9.js';
import { uget, uset } from '../lib/store.js';
import * as C from '../lib/e9calc.js';

/* "삼성화재 1600-0266 · 1350" 같은 글의 전화번호를 누르면 걸리게 */
function TelText({ text }) {
  const parts = String(text || '').split(/(\b\d{4}-\d{4}\b|\b1\d{3}\b(?!-))/g);
  return <>{parts.map((p, i) => (/^(\d{4}-\d{4}|1\d{3})$/.test(p) ? <a key={i} href={'tel:' + p.replace(/-/g, '')}>{p}</a> : p))}</>;
}

/* 남은 날 칸 하나 */
function Due({ T, k, days, date, rule }) {
  const tone = days <= 0 ? 'is-stop' : days <= 7 ? 'is-warn' : 'is-ok';
  return (
    <div className={'wk-d ' + tone}>
      <p className="wk-d-k">{k}</p>
      <p className="wk-d-n">{days < 0 ? Math.abs(days) : days === 0 ? '' : days}<small>{days < 0 ? T.daysOver : days === 0 ? T.dueToday : T.daysUnit}</small></p>
      <p className="wk-d-date">{date}</p>
      <p className="wk-d-rule">{rule}</p>
    </div>
  );
}

const Field = ({ id, label, opt, hint, ...p }) => (
  <label className="wk-f" htmlFor={id}>
    <span>{label}{opt && <em className="wk-opt"> {opt}</em>}</span>
    <input id={id} {...p} />
    {hint && <small>{hint}</small>}
  </label>
);

export default function WorkPanel({ kind, lang, who, onClose }) {
  const T = hub(lang);
  const E = e9home(lang);
  useEsc(onClose);
  const isDl = kind === 'deadline';
  return (
    <section className="wk" role="dialog" aria-modal="false" aria-labelledby="wk-title" onClick={(e) => e.stopPropagation()}>
      <header className="wk-head">
        <div>
          <h2 id="wk-title">{isDl ? T.svcDeadline : T.svcIns}</h2>
          <p>{isDl ? T.dlLead : T.pyLead}</p>
        </div>
        <button type="button" className="wk-x" onClick={onClose} aria-label={E.close} title={E.close}><Icon n="close" size={18} /></button>
      </header>
      <div className="wk-body">
        {isDl ? <Deadline T={T} lang={lang} who={who} /> : <Insurance T={T} lang={lang} who={who} />}
        <p className="wk-legal">{T.disclaimer}</p>
      </div>
    </section>
  );
}

/* ───────── 사업장 변경 기한 ───────── */
function Deadline({ T, lang, who }) {
  const [leave, setLeave] = useState(() => uget(who, 'e9.leave', ''));
  const [apply, setApply] = useState(() => uget(who, 'e9.apply', ''));
  const [shown, setShown] = useState(() => !!uget(who, 'e9.leave', ''));
  const r = shown ? C.deadline(leave, apply) : null;
  const day = (d) => C.fmtDay(d, lang, T.weekdays);
  const submit = (e) => { e.preventDefault(); if (!leave) return; uset(who, 'e9.leave', leave); uset(who, 'e9.apply', apply || ''); setShown(true); };
  const reset = () => { setLeave(''); setApply(''); setShown(false); uset(who, 'e9.leave', ''); uset(who, 'e9.apply', ''); };
  let note = null;
  if (r && !r.bad) {
    const lines = [];
    let cls = 'wk-note';
    if (r.applyDays < 0) { cls += ' is-stop'; lines.push(T.msgOver); } else if (r.applyDays <= 7) { cls += ' is-warn'; lines.push(T.msgWarn); } else lines.push(T.msgOk);
    if (r.jobDays < 0) lines.push(T.msgJobOver); else if (r.jobDays <= 14) lines.push(T.msgJobWarn);
    if (!apply) lines.push(T.msgEstimate);
    note = <p className={cls}>{lines.join(' ')}</p>;
  }
  return (
    <div className="wk-card">
      <form onSubmit={submit} autoComplete="off">
        <Field id="wk-leave" type="date" required label={T.dlLeaveDate} value={leave} onChange={(e) => setLeave(e.target.value)} />
        <Field id="wk-apply" type="date" label={T.dlApplyDate.replace(/\s*\(.*\)\s*$/, '')} opt={T.optional} hint={T.dlApplyHint} value={apply} onChange={(e) => setApply(e.target.value)} />
        <div className="wk-btns">
          <button type="submit" className="wk-go">{T.dlCalc}</button>
          {shown && <button type="button" className="wk-ghost" onClick={reset}>{T.reset}</button>}
        </div>
      </form>
      {r && r.bad && <p className="wk-note is-stop wk-res">{T.dlBadDate}</p>}
      {r && !r.bad && (
        <div className="wk-res">
          <div className="wk-dd">
            <Due T={T} k={T.dlCardApply} days={r.applyDays} date={day(r.applyDue)} rule={T.dlRuleApply} />
            <Due T={T} k={T.dlCardJob} days={r.jobDays} date={day(r.jobDue)} rule={T.dlRuleJob} />
          </div>
          <div className="wk-line" aria-hidden="true">
            <div className="wk-track"><i style={{ width: r.pos + '%' }} /><b style={{ left: r.pos + '%' }}>{T.tlToday}</b></div>
            <div className="wk-ticks"><span>{C.fmt(r.leave)}</span><span>{C.fmt(r.applied || r.applyDue)}</span><span>{C.fmt(r.jobDue)}</span></div>
          </div>
          {note}
        </div>
      )}
    </div>
  );
}

/* ───────── 출국만기보험 · 출국 정산 ───────── */
function Insurance({ T, lang, who }) {
  const day = (d) => C.fmtDay(d, lang, T.weekdays);
  const won = (n) => { const v = Math.round(n); try { return v.toLocaleString('ko-KR') + (T.wonUnit || '원'); } catch (e) { return v + (T.wonUnit || '원'); } };
  const [exit, setExit] = useState(() => uget(who, 'e9.exit', ''));
  const [exitOn, setExitOn] = useState(() => !!uget(who, 'e9.exit', ''));
  const p = exitOn ? C.payout(exit) : null;
  const [wage, setWage] = useState(() => uget(who, 'e9.wage', ''));
  const [start, setStart] = useState(() => uget(who, 'e9.start', ''));
  const [end, setEnd] = useState(() => uget(who, 'e9.end', ''));
  const [insOn, setInsOn] = useState(() => !!(uget(who, 'e9.wage', '') && uget(who, 'e9.start', '')));
  const r = insOn ? C.insurance(wage, start, end) : null;
  let pnote = null;
  if (p) pnote = p.claimDays < 0 ? ['wk-note is-stop', T.pyMsgOver] : p.claimDays <= 7 || p.reportDays < 0 ? ['wk-note is-warn', T.pyMsgWarn] : ['wk-note', T.pyMsgOk];

  return (
    <>
      {/* 쌓인 보험금 어림 */}
      <div className="wk-card">
        <h3>{T.insTitle}</h3>
        <p className="wk-lead">{T.insLead}</p>
        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); uset(who, 'e9.wage', wage); uset(who, 'e9.start', start); uset(who, 'e9.end', end); setInsOn(true); }}>
          <Field id="wk-wage" type="number" min="0" step="any" inputMode="numeric" placeholder="2,096,270" required label={T.insWageLabel} hint={T.insWageHint} value={wage} onChange={(e) => setWage(e.target.value)} />
          <Field id="wk-start" type="date" required label={T.insStartLabel} value={start} onChange={(e) => setStart(e.target.value)} />
          <Field id="wk-end" type="date" label={T.insEndLabel} hint={T.insEndHint} value={end} onChange={(e) => setEnd(e.target.value)} />
          <div className="wk-btns">
            <button type="submit" className="wk-go">{T.insCalc}</button>
            {insOn && <button type="button" className="wk-ghost" onClick={() => { setWage(''); setStart(''); setEnd(''); setInsOn(false); ['wage', 'start', 'end'].forEach((k) => uset(who, 'e9.' + k, '')); }}>{T.reset}</button>}
          </div>
        </form>
        {r && (
          <div className="wk-res">
            <dl className="wk-rows">
              <div><dt>{T.insWorked}</dt><dd>{r.bad ? '–' : (r.years > 0 ? r.years + (T.yearUnit || '년') + ' ' : '') + r.months + (T.monthUnit || '개월') + ' (' + r.days + (T.dayUnitPlain || '일') + ')'}</dd></div>
              <div><dt>{T.insFrom}<small>{T.insFromRule}</small></dt><dd>{r.bad ? '–' : day(r.joinDue)}</dd></div>
              <div className={r.bad ? '' : r.short ? 'is-warn' : 'is-ok'}><dt>{T.insElig}<small>{T.insEligRule}</small></dt><dd>{r.bad ? '–' : day(r.eligible)}</dd></div>
            </dl>
            {!r.bad && (
              <dl className="wk-rows wk-money">
                <div><dt>{T.insSaved}</dt><dd>{won(r.saved)}</dd></div>
                <div><dt>{T.insLegal}</dt><dd>{won(r.legal)}</dd></div>
                {r.gap > 10000 && <div className="is-gap"><dt>{T.insGap}</dt><dd>{won(r.gap)}</dd></div>}
              </dl>
            )}
            <p className={'wk-note' + (r.bad ? ' is-stop' : r.short ? ' is-warn' : '')}>{r.bad ? T.insErrOrder : r.short ? T.insMsgShort.replace('{d}', String(r.short)) : T.insMsgOk}</p>
          </div>
        )}
        <p className="wk-fine">{T.insWarn}</p>
      </div>

      {/* 출국 예정일 → 신고 · 청구 기한 */}
      <div className="wk-card">
        <h3>{T.pyDateLabel}</h3>
        <form autoComplete="off" onSubmit={(e) => { e.preventDefault(); if (!exit) return; uset(who, 'e9.exit', exit); setExitOn(true); }}>
          <Field id="wk-exit" type="date" required label={T.pyDateLabel} value={exit} onChange={(e) => setExit(e.target.value)} />
          <div className="wk-btns">
            <button type="submit" className="wk-go">{T.pyCalc}</button>
            {exitOn && <button type="button" className="wk-ghost" onClick={() => { setExit(''); setExitOn(false); uset(who, 'e9.exit', ''); }}>{T.reset}</button>}
          </div>
        </form>
        {p && (
          <div className="wk-res">
            <div className="wk-dd">
              <Due T={T} k={T.pyCardReport} days={p.reportDays} date={day(p.reportDue)} rule={T.pyRuleReport} />
              <Due T={T} k={T.pyCardClaim} days={p.claimDays} date={day(p.claimDue)} rule={T.pyRuleClaim} />
            </div>
            <p className={pnote[0]}>{pnote[1]}</p>
          </div>
        )}
        <p className="wk-fine">{T.pyLimit}</p>
        <p className="wk-src">{T.askSourceLabel}: {PAY_SRC} · {T.ntCheckedLabel} {PAY_CHECKED}</p>
      </div>

      {/* 떠나기 전에 확인할 것 */}
      <div className="wk-card">
        <h3>{T.pyListTitle || T.payHero}</h3>
        <p className="wk-lead">{T.pyHeroLead}</p>
        <ul className="wk-list">
          {(T.pyItems || []).map((x, n) => (
            <li key={n}>
              <b>{x.t}</b>
              <p>{x.w}</p>
              <p className="wk-where"><Icon n="call" size={14} /><span><TelText text={x.r} /></span></p>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
