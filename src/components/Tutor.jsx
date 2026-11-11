/* 한국어 시험(EPS-TOPIK) 도우미 — 연습 문제 + AI 질문
   힌트는 고른 나라의 언어(지원하는 6개 언어일 때)와 화면 언어로 보여 줍니다. */

import { useMemo, useState } from 'react';
import { QUIZ } from '../data/korean.js';
import { ui, fill, tx } from '../i18n/ui.js';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';

/* 정답이 늘 첫 번째에 있지 않게 문제마다 고정된 순서로 섞습니다. */
function order(i, n) {
  const a = [...Array(n).keys()];
  let s = (i + 7) * 9301;
  for (let k = n - 1; k > 0; k--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}

export default function Tutor({ lang, hintLang, countryLabel, onClose }) {
  const t = ui(lang);
  useEsc(onClose);
  const [tab, setTab] = useState('quiz');
  const [i, setI] = useState(0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [q, setQ] = useState('');
  const [chat, setChat] = useState([]);
  const [busy, setBusy] = useState(false);
  const item = QUIZ[i % QUIZ.length];
  const ord = useMemo(() => order(i, item.c.length), [i, item.c.length]);
  const finished = i >= QUIZ.length;

  const choose = (k) => { if (pick !== null) return; setPick(k); if (k === item.a) setScore((s) => s + 1); };
  const next = () => { setI((x) => x + 1); setPick(null); setShowHint(false); };
  const restart = () => { setI(0); setPick(null); setScore(0); setShowHint(false); };

  const ask = async (e) => {
    e.preventDefault();
    const text = q.trim(); if (!text || busy) return;
    setChat((c) => [...c, { me: true, text }]); setQ(''); setBusy(true);
    try {
      const r = await fetch('/api/tutor', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ q: text, lang: hintLang, country: countryLabel }) });
      const d = await r.json().catch(() => ({}));
      setChat((c) => [...c, { text: r.status === 501 || r.status === 404 ? t.aiOff : r.ok && d.answer ? d.answer : t.aiErr }]);
    } catch (err) {
      setChat((c) => [...c, { text: t.aiOff }]);
    }
    setBusy(false);
  };

  return (
    <section className="tutor" aria-label={t.tutor}>
      <header className="tu-h">
        <span className="tu-logo" aria-hidden="true">가</span>
        <div><b>{t.tutor}</b>{countryLabel && <small>{fill(t.tutorFor, { country: countryLabel })}</small>}</div>
        <button type="button" className="icon" onClick={onClose} aria-label={t.close}><Icon n="close" size={18} /></button>
      </header>
      <div className="tu-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>{t.practice}</button>
        <button type="button" role="tab" aria-selected={tab === 'ai'} onClick={() => setTab('ai')}>{t.askAi}</button>
      </div>

      {tab === 'quiz' && (
        <div className="tu-body">
          {finished ? (
            <div className="tu-end"><b>{fill(t.score, { n: score, t: QUIZ.length })}</b><button type="button" className="btn-p" onClick={restart}>{t.again}</button></div>
          ) : (
            <>
              <p className="tu-n">{i + 1} / {QUIZ.length}</p>
              <p className="tu-q" lang="ko">{item.q}</p>
              <div className="tu-c">
                {ord.map((k) => (
                  <button key={k} type="button" lang="ko"
                          className={pick === null ? '' : k === item.a ? 'right' : k === pick ? 'wrong' : 'dim'}
                          onClick={() => choose(k)}>{item.c[k]}</button>
                ))}
              </div>
              {pick === null && <button type="button" className="tu-hint-btn" onClick={() => setShowHint((s) => !s)}>💡 {t.hintL}</button>}
              {(showHint || pick !== null) && (
                <p className="tu-hint">
                  {pick !== null && <b className={pick === item.a ? 'r' : 'w'}>{pick === item.a ? t.right : t.wrong} </b>}
                  <span>{tx(item.h, hintLang)}</span>
                  {hintLang !== lang && <span className="tu-hint2">{tx(item.h, lang)}</span>}
                </p>
              )}
              {pick !== null && <button type="button" className="btn-p" onClick={next}>{t.next} →</button>}
            </>
          )}
        </div>
      )}

      {tab === 'ai' && (
        <div className="tu-body tu-ai">
          <div className="tu-chat" aria-live="polite">
            {chat.map((m, k) => <p key={k} className={m.me ? 'me' : 'ai'}>{m.text}</p>)}
            {busy && <p className="ai busy">{t.thinking}</p>}
          </div>
          <form onSubmit={ask} className="tu-form">
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.askPh} maxLength={300} />
            <button type="submit" className="btn-p" disabled={busy}>{t.send}</button>
          </form>
        </div>
      )}
    </section>
  );
}
