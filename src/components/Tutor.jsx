/* 한국어 시험(EPS-TOPIK) 도우미 — 연습 문제 + AI 질문
   힌트는 고른 나라의 언어(지원하는 6개 언어일 때)와 화면 언어로 보여 줍니다. */

import { useEffect, useMemo, useState } from 'react';
import { uget, uset } from '../lib/store.js';
import { QUIZ } from '../data/korean.js';
import { ui, fill, tx } from '../i18n/ui.js';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';
import ExamMode from './ExamMode.jsx';
import { EXAMS, EXAM_LIST } from '../data/exams.js';

const XT = {
  ko: { last: '최근 점수', exam: '모의시험', examIntro: '실제 시험지처럼 큰 화면에서 풀고, 끝나면 AI가 채점해 점수까지 알려 줘요.', go: '시험 보기', mins: '{n}분 · {q}문항', when: { eps: '입국 전', kiip: '입국 후 · 정착', topik: '유학·취업' } },
  en: { last: 'Last score', exam: 'Mock test', examIntro: 'Take it full screen like a real paper — AI grades it and gives your score.', go: 'Start', mins: '{n} min · {q} items', when: { eps: 'Before entry', kiip: 'After arrival', topik: 'Study & jobs' } }
};

/* 정답이 늘 첫 번째에 있지 않게 문제마다 고정된 순서로 섞습니다. */
function order(i, n) {
  const a = [...Array(n).keys()];
  let s = (i + 7) * 9301;
  for (let k = n - 1; k > 0; k--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (k + 1)); [a[k], a[j]] = [a[j], a[k]]; }
  return a;
}

export default function Tutor({ who = 'guest', lang, hintLang, countryLabel, name = '', onClose }) {
  const t = ui(lang);
  const x = lang === 'ko' ? XT.ko : XT.en;
  const XL = lang === 'ko' ? 'ko' : 'en';
  const [exam, setExam] = useState(null);
  useEsc(onClose, !exam);
  /* 탭·연습 진도·AI 대화·최근 시험 점수 — 계정별로 기억 */
  const mem = uget(who, 'tutor', {});
  const [tab, setTab] = useState(mem.tab || 'exam');
  const [i, setI] = useState(mem.i || 0);
  const [pick, setPick] = useState(null);
  const [score, setScore] = useState(mem.score || 0);
  const [recent, setRecent] = useState(() => uget(who, 'exams', {}));
  const [showHint, setShowHint] = useState(false);
  const [q, setQ] = useState('');
  const [chat, setChat] = useState(mem.chat || []);
  useEffect(() => { uset(who, 'tutor', { tab, i, score, chat: chat.slice(-30) }); }, [tab, i, score, chat]); // eslint-disable-line react-hooks/exhaustive-deps
  const examDone = (id, sc) => {
    const rec = { id, total: sc.total, max: sc.max, level: sc.level, at: Date.now() };
    setRecent((r) => { const n = { ...r, [id]: rec }; uset(who, 'exams', n); return n; });
    uset(who, 'examHist', [rec, ...uget(who, 'examHist', [])].slice(0, 20));   // 마이페이지 시험 기록
  };
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
        <button type="button" role="tab" aria-selected={tab === 'exam'} onClick={() => setTab('exam')}>{x.exam}</button>
        <button type="button" role="tab" aria-selected={tab === 'quiz'} onClick={() => setTab('quiz')}>{t.practice}</button>
        <button type="button" role="tab" aria-selected={tab === 'ai'} onClick={() => setTab('ai')}>{t.askAi}</button>
      </div>

      {tab === 'exam' && (
        <div className="tu-body tu-exams">
          <p className="tu-ex-intro">{x.examIntro}</p>
          {EXAM_LIST.map((k) => {
            const e = EXAMS[k]; const n = e.sections.reduce((a, s) => a + s.items.length, 0);
            return (
              <button key={k} type="button" className="tu-ex" style={{ '--ec': e.color }} onClick={() => setExam(k)}>
                <span className="tu-ex-b"><b>{e.short}</b><em>{x.when[k]}</em></span>
                <span className="tu-ex-t"><b>{e.name[XL]}</b><small>{e.who[XL]}</small><small className="tu-ex-m">{x.mins.replace('{n}', e.minutes).replace('{q}', n)} · {e.session[XL]}</small>
                  {recent[k] && <small className="tu-ex-last">{x.last} {recent[k].total}/{recent[k].max}{recent[k].level ? ' · ' + (k === 'kiip' ? recent[k].level + (XL === 'ko' ? '단계' : '') : recent[k].level) : ''}</small>}</span>
                <span className="tu-ex-go">{x.go}<Icon n="next" size={15} /></span>
              </button>
            );
          })}
        </div>
      )}
      {exam && <ExamMode id={exam} who={who} lang={lang} hintLang={hintLang} name0={name} onResult={(sc) => examDone(exam, sc)} onClose={() => setExam(null)} />}

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
