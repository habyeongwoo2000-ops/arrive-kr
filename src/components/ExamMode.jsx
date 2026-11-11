/* 모의시험 — 실제 시험지처럼 큰 화면(전체 화면)으로 풀고, 끝나면 AI가 채점해 점수·단계·풀이까지
   표지 → 시험(시험지 + OMR 답안지 + 남은 시간) → 채점(빨간 펜 표시) → 결과(점수 도장 · AI 총평 · 오답 풀이) */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { EXAMS, scoreExam } from '../data/exams.js';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';
import './exam.css';

const W = {
  ko: { practice: '연습용', notReal: '실제 시험이 아닌 연습용 모의시험입니다 · 문제는 ArriveKR 자체 제작', start: '시험 시작', no: '수험번호', name: '성명', namePh: '이름을 쓰세요', time: '시험 시간', count: '문항 수', minutes: '{n}분', items: '{n}문항',
    rules: ['문항 번호와 지시문은 실제 시험의 번호·유형을 따릅니다 (유형별 대표 문항만 수록).', '시작 버튼을 누르면 남은 시간이 줄어듭니다. 시간이 끝나면 자동으로 제출됩니다.', '답은 시험지에서 고르거나 오른쪽 답안지(OMR)에 칠하면 됩니다.', '듣기 문제는 ▶ 버튼을 눌러 들으세요. 두 번까지 들을 수 있습니다.', '서술·말하기 문제는 글로 쓰거나 🎤 버튼으로 말하면 됩니다. AI가 채점합니다.'],
    left: '남은 시간', submit: '답안 제출', sure: '아직 {n}문항을 풀지 않았어요. 제출할까요?', omr: '답안지', openNote: '서술형 — 시험지에 작성', answered: '{a}/{t} 답함',
    listen: '듣기', again: '다시 듣기', played: '들은 횟수 {n}/2', noVoice: '이 브라우저는 한국어 음성이 없어요. 대본을 보여 드려요.', script: '대본', write: '여기에 답을 쓰세요', speak: '말로 답하기', stop: '그만 말하기',
    grading: 'AI가 채점하고 있어요', g1: '객관식 답안 확인', g2: '서술·말하기 답 채점', g3: '틀린 문제 풀이 쓰기', score: '점수', of: '{m}점 만점', level: '예상 결과', kiipLv: '예상 시작 단계 {l}단계', topikLv: '{l} 예상', topikNo: '급수 미달 (80점부터 1급)', epsNote: '합격선은 나라·회차마다 달라요',
    aiBy: 'Claude AI 채점', basic: '기본 채점 · AI 미연결', summary: 'AI 총평', strong: '잘한 점', weak: '더 연습할 점', next: '다음 공부', wrongT: '틀린 문제 풀이', openT: '서술·말하기 채점', yours: '내 답', better: '이렇게 쓰면 더 좋아요', none: '(답 없음)', allRight: '모두 맞혔어요!',
    review: '채점된 시험지 보기', retry: '다시 풀기', close: '나가기', extra: '점수에 넣지 않는 맛보기', right: '정답', mine: '내가 고른 답', basicOpen: 'AI 없이 글자 수로만 간단히 채점했어요', full: '전체 화면', official: '공식 누리집', moreReal: '공식 기출문제로 더 연습하기', moreRealSub: '실제 기출과 시험 안내는 시행기관 누리집에서 볼 수 있어요 (공개 범위는 기관마다 달라요)' },
  en: { practice: 'Practice', notReal: 'A practice mock test, not the real exam · questions written by ArriveKR', start: 'Start test', no: 'Candidate no.', name: 'Name', namePh: 'Write your name', time: 'Time', count: 'Questions', minutes: '{n} min', items: '{n} items',
    rules: ['Question numbers and instructions follow the real test (one sample per type).', 'The timer starts when you press Start. It submits automatically when time runs out.', 'Pick answers on the paper or fill the answer sheet (OMR) on the right.', 'Press ▶ to hear listening questions. You can listen twice.', 'For writing/speaking items, type or press 🎤 and speak. AI grades them.'],
    left: 'Time left', submit: 'Submit', sure: '{n} questions are unanswered. Submit anyway?', omr: 'Answer sheet', openNote: 'Written — answer on the paper', answered: '{a}/{t} answered',
    listen: 'Listen', again: 'Listen again', played: 'Played {n}/2', noVoice: 'No Korean voice in this browser — showing the script.', script: 'Script', write: 'Write your answer here', speak: 'Answer by voice', stop: 'Stop',
    grading: 'AI is grading your test', g1: 'Checking multiple choice', g2: 'Grading writing & speaking', g3: 'Writing explanations', score: 'Score', of: 'out of {m}', level: 'Estimate', kiipLv: 'Estimated starting level {l}', topikLv: '{l} expected', topikNo: 'Below Level 1 (80 needed)', epsNote: 'Pass marks differ by country and round',
    aiBy: 'Graded by Claude AI', basic: 'Basic grading · AI offline', summary: 'AI summary', strong: 'Strengths', weak: 'Practice more', next: 'Next step', wrongT: 'Explanations for wrong answers', openT: 'Writing & speaking', yours: 'Your answer', better: 'A better answer', none: '(no answer)', allRight: 'All correct!',
    review: 'See graded paper', retry: 'Try again', close: 'Exit', extra: 'Taste only — not in the score', right: 'Answer', mine: 'Your pick', basicOpen: 'Scored roughly by length without AI', full: 'Full screen', official: 'Official sites', moreReal: 'Practice with official past papers', moreRealSub: 'Past papers and test info are on the official sites (what is published differs by agency)' }
};
const NUM = ['①', '②', '③', '④'];
const fill = (s, v) => String(s).replace(/\{(\w+)\}/g, (m, k) => (v[k] != null ? v[k] : m));
const mmss = (s) => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* 그림 문제 (선 그림) */
const PIC = {
  helmet: <svg viewBox="0 0 120 90"><path d="M20 62c0-24 18-42 40-42s40 18 40 42" fill="#ffd54a" stroke="#222" strokeWidth="3" /><path d="M10 62h100v10H10z" fill="#ffc107" stroke="#222" strokeWidth="3" /><path d="M60 20v42M44 24l4 38M76 24l-4 38" stroke="#222" strokeWidth="2.5" fill="none" /></svg>,
  nosmoke: <svg viewBox="0 0 120 90"><circle cx="60" cy="45" r="38" fill="#fff" stroke="#d32f2f" strokeWidth="7" /><rect x="28" y="40" width="50" height="11" fill="#fff" stroke="#222" strokeWidth="3" /><rect x="78" y="40" width="12" height="11" fill="#e57373" stroke="#222" strokeWidth="3" /><path d="M86 34c0-6 6-6 6-12" stroke="#777" strokeWidth="3" fill="none" /><path d="M33 18l54 54" stroke="#d32f2f" strokeWidth="7" /></svg>,
  extinguisher: <svg viewBox="0 0 120 90"><rect x="44" y="26" width="32" height="58" rx="8" fill="#e53935" stroke="#222" strokeWidth="3" /><path d="M52 26v-8h16v8M68 14h18l8 10" stroke="#222" strokeWidth="3" fill="none" /><path d="M94 24c4 10 4 22-2 30" stroke="#222" strokeWidth="3" fill="none" /><rect x="50" y="44" width="20" height="18" fill="#fff" stroke="#222" strokeWidth="2" /></svg>
};

/* 듣기: 브라우저 한국어 음성으로 읽기 (여:/남: 은 목소리 높낮이를 바꿔서) */
function speak(lines) {
  return new Promise((done) => {
    const ss = window.speechSynthesis; if (!ss) { done(false); return; }
    const voices = ss.getVoices(); const ko = voices.find((v) => /^ko/i.test(v.lang));
    if (!ko && voices.length) { done(false); return; }
    ss.cancel();
    let k = 0;
    const next = () => {
      if (k >= lines.length) { done(true); return; }
      const raw = lines[k++]; const who = /^여:/.test(raw) ? 'f' : /^남:/.test(raw) ? 'm' : '';
      const u = new SpeechSynthesisUtterance(raw.replace(/^(여|남):\s*/, ''));
      u.lang = 'ko-KR'; if (ko) u.voice = ko; u.rate = 0.88; u.pitch = who === 'f' ? 1.25 : who === 'm' ? 0.75 : 1;
      u.onend = () => setTimeout(next, 450); u.onerror = () => done(false);
      ss.speak(u);
    };
    next();
  });
}

function Listen({ lines, t }) {
  const [n, setN] = useState(0);
  const [on, setOn] = useState(false);
  const [noVoice, setNoVoice] = useState(false);
  const play = async () => {
    if (on || n >= 2) return;
    setOn(true); const ok = await speak(lines); setOn(false);
    if (!ok) setNoVoice(true); else setN((x) => x + 1);
  };
  return (
    <div className="ex-listen">
      <button type="button" className={'ex-play' + (on ? ' is-on' : '')} onClick={play} disabled={on || n >= 2}>
        {on ? <span className="ex-wave"><i /><i /><i /><i /></span> : <Icon n="play" size={16} />}{n ? t.again : t.listen}
      </button>
      <small>{fill(t.played, { n })}</small>
      {noVoice && <p className="ex-script"><b>{t.noVoice}</b>{lines.map((l, i) => <span key={i}>{l}</span>)}</p>}
    </div>
  );
}

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
function OpenAnswer({ value, onChange, t, disabled }) {
  const [rec, setRec] = useState(null);
  const toggle = () => {
    if (rec) { rec.stop(); return; }
    const r = new SR(); r.lang = 'ko-KR'; r.interimResults = true; r.continuous = true;
    const base = value ? value + ' ' : '';
    r.onresult = (e) => { let s = ''; for (const x of e.results) s += x[0].transcript; onChange(base + s); };
    r.onend = () => setRec(null); r.onerror = () => setRec(null);
    setRec(r); r.start();
  };
  return (
    <div className="ex-open">
      <textarea value={value || ''} onChange={(e) => onChange(e.target.value.slice(0, 400))} placeholder={t.write} rows={3} disabled={disabled} lang="ko" />
      {SR && !disabled && <button type="button" className={'ex-mic' + (rec ? ' is-on' : '')} onClick={toggle}><Icon n="mic" size={16} />{rec ? t.stop : t.speak}</button>}
    </div>
  );
}

export default function ExamMode({ id, lang, hintLang, name0 = '', onClose }) {
  const ex = EXAMS[id];
  const t = lang === 'ko' ? W.ko : W.en;
  const L = lang === 'ko' ? 'ko' : 'en';
  const all = useMemo(() => ex.sections.flatMap((s) => s.items.map((it) => ({ ...it, sec: s }))), [ex]);
  const mcItems = all.filter((x) => !x.sec.open);
  const openItems = all.filter((x) => x.sec.open);
  const [phase, setPhase] = useState('cover');      // cover → test → grading → result → review
  const [name, setName] = useState(name0);
  const [ans, setAns] = useState({});
  const [open, setOpen] = useState({});
  const [left, setLeft] = useState(ex.minutes * 60);
  const [mark, setMark] = useState(0);               // 채점 표시가 몇 번 문항까지 왔나
  const [gstep, setGstep] = useState(0);
  const [res, setRes] = useState(null);              // { score, ai, aiOn }
  const paper = useRef(null);
  const examNo = useMemo(() => `${ex.short.replace(/\W/g, '').slice(0, 4).toUpperCase()}-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`, [ex]);
  useEsc(() => { if (phase !== 'test' && phase !== 'grading') close(); });

  /* 시험 중엔 뒤쪽 페이지 스크롤 막기 */
  useEffect(() => { const o = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = o; try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* 무시 */ } }; }, []);
  /* 남은 시간 */
  useEffect(() => {
    if (phase !== 'test') return undefined;
    const iv = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(iv);
  }, [phase]);
  const leftRef = useRef(left); leftRef.current = left;
  useEffect(() => { if (phase === 'test' && left === 0) grade(); }, [left]); // eslint-disable-line react-hooks/exhaustive-deps

  const start = () => {
    setPhase('test');
    try { const el = document.documentElement; if (!document.fullscreenElement && el.requestFullscreen) el.requestFullscreen().catch(() => {}); } catch (e) { /* 무시 */ }
  };
  function close() {
    try { if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {}); } catch (e) { /* 무시 */ }
    onClose();
  }
  const answered = mcItems.filter((x) => ans[x.n]).length + openItems.filter((x) => (open[x.n] || '').trim()).length;
  const submit = () => {
    const miss = all.length - answered;
    if (miss > 0 && !window.confirm(fill(t.sure, { n: miss }))) return;
    grade();
  };

  async function grade() {
    if (phase === 'grading' || phase === 'result') return;
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) { /* 무시 */ }
    setPhase('grading'); setMark(0); setGstep(0);
    if (paper.current) paper.current.scrollTo({ top: 0 });
    const wrong = mcItems.filter((x) => ans[x.n] !== x.a).map((x) => ({ n: x.n, q: x.q, box: (x.box || '').replace(/<[^>]+>/g, ' '), choices: x.c, picked: ans[x.n] || 0, answer: x.a, pickedText: ans[x.n] ? x.c[ans[x.n] - 1] : '', answerText: x.c[x.a - 1], script: (x.s || []).join(' / ') }));
    const openReq = openItems.map((x) => ({ n: x.n, q: x.q, box: (x.box || '').replace(/<[^>]+>/g, ' '), max: x.max, rubric: x.rubric, model: x.model, answer: open[x.n] || '' }));
    const pre = scoreExam(ex, ans, {});
    const call = fetch('/api/exam', { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ lang: hintLang || lang, exam: ex.id, examName: ex.name.en, score: { total: pre.total, max: pre.max, level: pre.level }, wrong, open: openReq }) })
      .then((r) => (r.ok ? r.json() : null)).catch(() => null);
    /* 빨간 펜으로 하나씩 채점하는 장면 */
    for (let i = 1; i <= all.length; i++) { setMark(i); await sleep(170); if (i === mcItems.length) setGstep(1); }
    setGstep(2);
    const ai = await call;
    let openScores = {};
    if (ai && ai.open) Object.entries(ai.open).forEach(([k, v]) => { openScores[k] = v.score; });
    else openItems.forEach((x) => { const len = (open[x.n] || '').replace(/[^가-힣]/g, '').length; openScores[x.n] = Math.min(x.max, Math.round(x.max * Math.min(1, len / 30))); });
    setGstep(3); await sleep(500);
    setRes({ score: scoreExam(ex, ans, openScores), ai, openScores });
    setPhase('result');
  }
  const retry = () => { setAns({}); setOpen({}); setLeft(ex.minutes * 60); setRes(null); setMark(0); setPhase('cover'); };

  const graded = phase === 'grading' || phase === 'result' || phase === 'review';
  const markOf = (it, idx) => {
    if (!graded || idx >= mark) return '';
    if (it.sec.open) return 'mk-open';
    return ans[it.n] === it.a ? 'mk-ok' : 'mk-no';
  };

  /* ── 화면 ── */
  const head = (
    <header className="ex-top" style={{ '--ec': ex.color }}>
      <div className="ex-brand"><b>{ex.short}</b><span>{ex.name[L]}</span><em>{t.practice}</em></div>
      {phase !== 'cover' && <>
        <div className="ex-who"><small>{t.no}</small><b>{examNo}</b></div>
        <div className="ex-who"><small>{t.name}</small><b>{name || '—'}</b></div>
        <div className="ex-prog"><i style={{ width: Math.round((answered / all.length) * 100) + '%' }} /><b>{fill(t.answered, { a: answered, t: all.length })}</b></div>
        {phase === 'test' && <div className={'ex-timer' + (left <= 60 ? ' is-low' : '')}><small>{t.left}</small><b>{mmss(left)}</b></div>}
        {phase === 'test' && <button type="button" className="ex-submit" onClick={submit}>{t.submit}</button>}
      </>}
      {phase !== 'test' && phase !== 'grading' && <button type="button" className="ex-x" onClick={close} aria-label={t.close} title={t.close}><Icon n="close" size={22} /></button>}
    </header>
  );

  if (phase === 'cover') {
    return createPortal(
      <div className="ex" role="dialog" aria-modal="true" aria-label={ex.name[L]}>
        {head}
        <div className="ex-desk">
          <article className="ex-cover" style={{ '--ec': ex.color }}>
            <div className="ex-cv-band"><span>{new Date().getFullYear()}</span><b>{ex.name.ko}</b><span>{ex.session.ko}</span></div>
            <h1>{ex.short}<small>{ex.name[L]}</small></h1>
            <p className="ex-cv-who">{ex.who[L]}</p>
            <table className="ex-cv-tb"><tbody>
              <tr><th>{t.no}</th><td className="mono">{examNo}</td><th>{t.name}</th><td><input value={name} onChange={(e) => setName(e.target.value.slice(0, 24))} placeholder={t.namePh} /></td></tr>
              <tr><th>{t.time}</th><td>{fill(t.minutes, { n: ex.minutes })}</td><th>{t.count}</th><td>{fill(t.items, { n: all.length })} · {ex.session[L]}</td></tr>
            </tbody></table>
            <ol className="ex-cv-rules">{t.rules.filter((r, i) => (i !== 3 || all.some((x) => x.s)) && (i !== 4 || openItems.length > 0)).map((r, i) => <li key={i}>{r}</li>)}</ol>
            <p className="ex-cv-note">{ex.note[L]}</p>
            {ex.links && <p className="ex-links"><b>{t.official}</b>{ex.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"><Icon n="link" size={13} />{l[L]}</a>)}</p>}
            <button type="button" className="ex-go" onClick={start}><Icon n="play" size={18} />{t.start}</button>
            <p className="ex-cv-fake">{t.notReal}</p>
          </article>
        </div>
      </div>, document.body);
  }

  const sc = res && res.score;
  const ai = res && res.ai;
  const lvText = sc ? (ex.scoring === 'kiip' ? fill(t.kiipLv, { l: sc.level }) : ex.scoring === 'topik' ? (sc.level ? fill(t.topikLv, { l: lang === 'ko' ? 'TOPIK ' + sc.level : 'TOPIK Level ' + sc.level.replace('급', '') }) : t.topikNo) : t.epsNote) : '';

  return createPortal(
    <div className={'ex is-' + phase} role="dialog" aria-modal="true" aria-label={ex.name[L]}>
      {head}
      <div className="ex-desk">
        {/* 시험지 */}
        <article className="ex-paper" ref={paper} style={{ '--ec': ex.color }}>
          <div className="ex-ph">
            <span>{ex.name.ko}</span><b>{ex.session.ko}</b><span className="mono">{examNo}</span>
          </div>
          {ex.sections.map((s) => (
            <section key={s.id} className={'ex-sec' + (s.open ? ' is-open' : '')}>
              <h2><span>{s.ko}</span>{L !== 'ko' && <small>{s.en}</small>}{s.extra && <em>{t.extra}</em>}</h2>
              <div className="ex-cols">
                {s.items.map((it) => {
                  const idx = all.findIndex((x) => x.n === it.n);
                  const mk = markOf({ ...it, sec: s }, idx);
                  return (
                    <div key={it.n} className={'ex-q ' + mk + (it.g ? ' has-g' : '')} id={'exq-' + it.n}>
                      {it.g && <p className="ex-g">※ {it.g}</p>}
                      <p className="ex-qt"><b>{it.n}.</b> {ex.grouped && !/㉠/.test(it.q) ? '' : it.q}</p>
                      {it.pic && <div className="ex-pic">{PIC[it.pic]}</div>}
                      {it.s && phase === 'test' && <Listen lines={it.s} t={t} />}
                      {it.s && phase !== 'test' && <p className="ex-script rev"><b>{t.script}</b>{it.s.map((l, i) => <span key={i}>{l}</span>)}</p>}
                      {it.box && <div className="ex-box" dangerouslySetInnerHTML={{ __html: it.box }} />}
                      {it.c && (
                        <ol className="ex-ch">
                          {it.c.map((c, k) => {
                            const v = k + 1; const picked = ans[it.n] === v;
                            const cls = (picked ? ' is-pick' : '') + (graded && mk && v === it.a ? ' is-right' : '') + (graded && mk && picked && v !== it.a ? ' is-wrong' : '');
                            return <li key={k}><button type="button" className={cls} disabled={phase !== 'test'} onClick={() => setAns((a) => ({ ...a, [it.n]: v }))}><i>{NUM[k]}</i><span>{c}</span></button></li>;
                          })}
                        </ol>
                      )}
                      {s.open && <OpenAnswer value={open[it.n]} onChange={(v) => setOpen((o) => ({ ...o, [it.n]: v }))} t={t} disabled={phase !== 'test'} />}
                      {mk && <span className="ex-mk" aria-hidden="true" />}
                      {s.open && mk && res && <span className="ex-pts">{res.openScores[it.n] ?? 0}/{it.max}</span>}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <p className="ex-foot">{t.notReal}</p>
        </article>

        {/* 답안지(OMR) */}
        <aside className="ex-omr" style={{ '--ec': ex.color }}>
          <div className="ex-omr-h"><b>{t.omr}</b><span>OMR</span></div>
          <div className="ex-omr-id"><small>{t.no}</small><span className="mono">{examNo}</span><small>{t.name}</small><span>{name || '—'}</span></div>
          <ol className="ex-omr-rows">
            {all.map((it, idx) => {
              const mk = markOf(it, idx);
              return (
                <li key={it.n} className={mk}>
                  <button type="button" className="ex-omr-n" onClick={() => { const el = document.getElementById('exq-' + it.n); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}>{it.n}</button>
                  {it.sec.open
                    ? <span className="ex-omr-open">{(open[it.n] || '').trim() ? '✎' : '—'} <small>{t.openNote}</small></span>
                    : [1, 2, 3, 4].map((v) => (
                      <button type="button" key={v} disabled={phase !== 'test'} aria-label={it.n + '-' + v}
                              className={'ex-bub' + (ans[it.n] === v ? ' is-on' : '') + (graded && mk && v === it.a && ans[it.n] !== v ? ' is-ans' : '')}
                              onClick={() => setAns((a) => ({ ...a, [it.n]: v }))}>{v}</button>
                    ))}
                </li>
              );
            })}
          </ol>
        </aside>
      </div>

      {/* 채점 중 */}
      {phase === 'grading' && (
        <div className="ex-grading" role="status" aria-live="polite">
          <div className="ex-pen" aria-hidden="true"><i /></div>
          <b>{t.grading}</b>
          <ul>{[t.g1, t.g2, t.g3].map((x, i) => <li key={i} className={i < gstep ? 'ok' : i === gstep ? 'now' : ''}><span>{i < gstep ? '✓' : ''}</span>{x}</li>)}</ul>
        </div>
      )}

      {/* 결과 */}
      {phase === 'result' && sc && (
        <div className="ex-result" style={{ '--ec': ex.color }}>
          <div className="ex-rs-card">
            <button type="button" className="x-close" onClick={() => setPhase('review')} aria-label={t.review}><Icon n="close" size={18} /></button>
            <div className="ex-rs-top">
              <div className="ex-stamp"><small>{t.score}</small><b>{sc.total}</b><span>{fill(t.of, { m: sc.max })}</span></div>
              <div className="ex-rs-lv">
                <small>{t.level}</small>
                <b className={ex.scoring === 'topik' && !sc.level ? 'no' : ''}>{lvText}</b>
                <em className={ai ? 'ai' : 'basic'}>{ai ? t.aiBy : t.basic}</em>
              </div>
            </div>
            <div className="ex-bars">
              {sc.secs.map((x) => {
                const s = ex.sections.find((y) => y.id === x.id);
                return (
                  <div key={x.id} className={'ex-bar' + (x.extra ? ' extra' : '')}>
                    <span>{s[L] || s.ko}{x.extra ? ' · ' + t.extra : ''}</span>
                    <i><b style={{ width: Math.round((x.got / x.max) * 100) + '%' }} /></i>
                    <em>{x.got}/{x.max}{x.right != null ? ` (${x.right}/${x.total})` : ''}</em>
                  </div>
                );
              })}
            </div>
            {ai && ai.summary && <div className="ex-ai"><b><Icon n="sparkle" size={15} />{t.summary}</b><p>{ai.summary}</p>
              {(ai.strong || []).length > 0 && <p className="ex-tags"><small>{t.strong}</small>{ai.strong.map((x) => <span key={x} className="ok">{x}</span>)}</p>}
              {(ai.weak || []).length > 0 && <p className="ex-tags"><small>{t.weak}</small>{ai.weak.map((x) => <span key={x}>{x}</span>)}</p>}
              {ai.next && <p className="ex-next"><small>{t.next}</small>{ai.next}</p>}
            </div>}

            {openItems.length > 0 && (
              <div className="ex-rs-sec">
                <h3>{t.openT}</h3>
                {!ai && <p className="ex-basic">{t.basicOpen}</p>}
                {openItems.map((x) => {
                  const o = ai && ai.open && ai.open[x.n];
                  return (
                    <div key={x.n} className="ex-oi">
                      <p className="ex-oi-q"><b>{x.n}.</b> {x.q} <em>{res.openScores[x.n] ?? 0}/{x.max}</em></p>
                      <p className="ex-oi-a"><small>{t.yours}</small>{(open[x.n] || '').trim() || t.none}</p>
                      {o && o.comment && <p className="ex-oi-c">{o.comment}</p>}
                      <p className="ex-oi-b"><small>{t.better}</small>{(o && o.better) || x.model}</p>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="ex-rs-sec">
              <h3>{t.wrongT}</h3>
              {mcItems.every((x) => ans[x.n] === x.a) && <p className="ex-allok">{t.allRight}</p>}
              {mcItems.filter((x) => ans[x.n] !== x.a).map((x) => (
                <div key={x.n} className="ex-wi">
                  <p><b>{x.n}.</b> {x.q}</p>
                  <p className="ex-wi-ab"><span className="w">{t.mine}: {ans[x.n] ? NUM[ans[x.n] - 1] + ' ' + x.c[ans[x.n] - 1] : t.none}</span><span className="r">{t.right}: {NUM[x.a - 1]} {x.c[x.a - 1]}</span></p>
                  <p className="ex-wi-e">{(ai && ai.explain && ai.explain[x.n]) || x.exp}</p>
                </div>
              ))}
            </div>
            <p className="ex-rs-note">{ex.note[L]}</p>
            {ex.links && <div className="ex-rs-links"><b>{t.moreReal}</b><small>{t.moreRealSub}</small>{ex.links.map((l) => <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer"><Icon n="link" size={14} />{l[L]}<Icon n="next" size={14} /></a>)}</div>}
            <div className="ex-rs-act">
              <button type="button" className="btn-o" onClick={() => setPhase('review')}><Icon n="doc" size={15} />{t.review}</button>
              <button type="button" className="btn-o" onClick={retry}><Icon n="play" size={15} />{t.retry}</button>
              <button type="button" className="btn-p" onClick={close}>{t.close}</button>
            </div>
          </div>
        </div>
      )}
      {phase === 'review' && sc && (
        <button type="button" className="ex-backres" onClick={() => setPhase('result')} style={{ '--ec': ex.color }}>
          <b>{sc.total}</b><span>{fill(t.of, { m: sc.max })}</span><Icon n="next" size={16} />
        </button>
      )}
    </div>, document.body);
}
