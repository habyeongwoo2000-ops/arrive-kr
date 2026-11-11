/* 살아있는 30일 일정 — AI 비서
   ① 서류 사진 한 장 → AI가 읽고 "언제까지·어디서·무엇을 들고"를 뽑아 일정에 끼워 넣기 (사람이 확인 후 넣음)
   ② 말 한마디 → AI가 조건(근무 요일·시간·교통)을 알아듣고, 규칙이 날짜를 다시 맞춤 */
import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';

export const AS = {
  ko: {
    ph: '말로 일정 바꾸기 — 예: 화·목은 야간근무, 차 없어요', send: '보내기', mic: '말로 하기', listening: '듣는 중… 말씀하세요',
    cam: '서류 찍기', camSub: '고지서·안내문을 찍으면 일정에 넣어 드려요', sample: '예시 서류로 해보기',
    readT: 'AI가 서류를 읽고 있어요', read1: '글자 읽기', read2: '날짜·장소·준비물 찾기', read3: '내 일정과 겹치는지 보기',
    foundT: '서류에서 찾은 할 일', none: '이 사진에서는 할 일을 찾지 못했어요. 서류 전체가 잘 보이게 다시 찍어 주세요.',
    due: '마감', bring: '준비물', add: '일정에 넣기', cancel: '닫기', retake: '다시 찍기',
    privacy: '사진은 AI가 읽는 데만 쓰고 저장하지 않아요. 날짜·장소는 원본을 꼭 다시 확인하세요.',
    demo: '예시 결과 · AI 미연결', aiErr: 'AI가 지금 서류를 읽지 못했어요. 잠시 뒤 다시 해 주세요.', offErr: 'AI가 연결되지 않아 실제 사진은 읽을 수 없어요. "예시 서류로 해보기"로 흐름을 볼 수 있어요.',
    docBadge: '서류', movedFrom: 'D+{d}에서 옮김', conflict: '마감 전에 갈 수 있는 날이 없어요 — 직접 조정해 주세요', late: '마감일이 입국일보다 앞이에요 — 원본을 확인하세요',
    remove: '이 일정 빼기', saidOk: '말씀대로 바꿨어요', saidNone: '알아들은 조건이 없어요. 예: "화·목은 야간근무예요", "11월 20일은 안 돼요", "차 없어요"',
    ruleLocal: 'AI 미연결 · 간단한 문장만 알아들어요', moved: '{n}개 일정을 옮겼어요', noMove: '옮길 일정은 없었어요', addedN: '서류에서 {n}개 일정을 넣었어요',
    arrive: '{t} 도착하려면 {l} 출발', mv: { bus: '버스 기준 어림', walk: '걸어서 어림', bike: '자전거 어림', car: '차 기준 어림' }, when: { morning: '오전 방문 추천', afternoon: '오후 방문 추천', lunch: '점심시간 방문 추천', evening: '저녁 이후' }
  },
  en: {
    ph: 'Change the plan by talking — e.g. night shifts Tue & Thu, no car', send: 'Send', mic: 'Speak', listening: 'Listening… go ahead',
    cam: 'Snap a letter', camSub: 'Photograph a bill or notice and it goes into your plan', sample: 'Try a sample letter',
    readT: 'AI is reading your document', read1: 'Reading the text', read2: 'Finding dates, places, things to bring', read3: 'Checking against your plan',
    foundT: 'To-dos found in the document', none: 'No to-dos found in this photo. Retake it with the whole page visible.',
    due: 'Due', bring: 'Bring', add: 'Add to my plan', cancel: 'Close', retake: 'Retake',
    privacy: 'The photo is only used for reading and is not stored. Always double-check dates and places on the original.',
    demo: 'Sample result · AI offline', aiErr: 'AI could not read it right now. Please try again shortly.', offErr: 'AI is not connected, so real photos can’t be read. Try the sample letter to see the flow.',
    docBadge: 'Letter', movedFrom: 'moved from D+{d}', conflict: 'No free day before the deadline — please adjust', late: 'Deadline is before your entry date — check the original',
    remove: 'Remove', saidOk: 'Updated as you said', saidNone: 'I didn’t catch a condition. Try: "night shifts Tue and Thu", "not on Nov 20", "no car"',
    ruleLocal: 'AI offline · understands simple sentences', moved: 'Moved {n} visits', noMove: 'Nothing needed to move', addedN: 'Added {n} to-dos from the letter',
    arrive: 'Leave {l} to arrive {t}', mv: { bus: 'rough bus time', walk: 'walking estimate', bike: 'bike estimate', car: 'by car' }, when: { morning: 'Best in the morning', afternoon: 'Best in the afternoon', lunch: 'Go at lunch time', evening: 'After evening' }
  }
};
export const aw = (lang) => (lang === 'ko' ? AS.ko : AS.en);

const SR = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
const BCP = { ko: 'ko-KR', en: 'en-US', vi: 'vi-VN', id: 'id-ID', th: 'th-TH', km: 'km-KH', ne: 'ne-NP', my: 'my-MM', uz: 'uz-UZ', mn: 'mn-MN', zh: 'zh-CN', bn: 'bn-BD', si: 'si-LK', fil: 'fil-PH', tl: 'fil-PH' };

/* 일정 패널 안의 입력줄: [서류 찍기] [말로 바꾸기 ……] [마이크] [보내기] */
export function AgentBar({ lang, busy, onSay, onPhoto, onSample, chips, onChipX }) {
  const t = aw(lang);
  const [text, setText] = useState('');
  const [listen, setListen] = useState(false);
  const file = useRef(null);
  const rec = useRef(null);
  useEffect(() => () => { try { rec.current && rec.current.abort(); } catch (e) { /* 무시 */ } }, []);

  const submit = (e) => { e && e.preventDefault(); const v = text.trim(); if (!v || busy) return; onSay(v); setText(''); };
  const mic = () => {
    if (!SR) return;
    if (listen) { try { rec.current.stop(); } catch (e) { /* 무시 */ } return; }
    const r = new SR(); rec.current = r;
    r.lang = BCP[lang] || 'en-US'; r.interimResults = true; r.maxAlternatives = 1;
    let final = '';
    r.onresult = (ev) => { let s = ''; for (const x of ev.results) { s += x[0].transcript; if (x.isFinal) final = s; } setText(s); };
    r.onend = () => { setListen(false); if (final.trim()) { onSay(final.trim()); setText(''); } };
    r.onerror = () => setListen(false);
    setListen(true); r.start();
  };

  return (
    <div className="ag">
      <form className={'ag-bar' + (listen ? ' is-listen' : '')} onSubmit={submit}>
        <button type="button" className="ag-cam" onClick={() => file.current && file.current.click()} title={t.camSub} disabled={busy}>
          <Icon n="camera" size={18} /><span>{t.cam}</span>
        </button>
        <input ref={file} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { const f = e.target.files && e.target.files[0]; e.target.value = ''; if (f) onPhoto(f); }} />
        <span className="ag-spark" aria-hidden="true"><Icon n="sparkle" size={16} /></span>
        <input className="ag-in" value={text} onChange={(e) => setText(e.target.value)} placeholder={listen ? t.listening : t.ph} aria-label={t.ph} disabled={busy} enterKeyHint="send" />
        {SR && <button type="button" className={'ag-ic' + (listen ? ' is-on' : '')} onClick={mic} aria-label={t.mic} title={t.mic} disabled={busy}><Icon n="mic" size={18} /></button>}
        <button type="submit" className="ag-ic ag-go" aria-label={t.send} title={t.send} disabled={busy || !text.trim()}>{busy ? <i className="ag-spin" /> : <Icon n="send" size={17} />}</button>
      </form>
      {(chips.length > 0 || onSample) && (
        <div className="ag-chips">
          {chips.map((c) => <span key={c.k} className="ag-chip">{c.t}<button type="button" aria-label="x" onClick={() => onChipX(c.k)}><Icon n="close" size={12} /></button></span>)}
          {onSample && <button type="button" className="ag-sample" onClick={onSample} disabled={busy}><Icon n="doc" size={13} />{t.sample}</button>}
        </div>
      )}
    </div>
  );
}

/* 서류 읽기 → 찾은 할 일 확인 → 일정에 넣기 */
export function DocReview({ lang, doc, onPick, onAdd, onClose, onRetake, fmt }) {
  const t = aw(lang);
  const K = lang === 'ko' ? 'ko' : 'en';
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (doc.phase !== 'read') return undefined;
    setTick(0); const iv = setInterval(() => setTick((n) => Math.min(2, n + 1)), 1400);
    return () => clearInterval(iv);
  }, [doc.phase]);
  const items = (doc.res && doc.res.items) || [];
  return (
    <div className="dr" role="dialog" aria-modal="false" aria-label={t.foundT}>
      <button type="button" className="x-close" onClick={onClose} aria-label={t.cancel} title={t.cancel}><Icon n="close" size={18} /></button>
      <div className={'dr-img' + (doc.phase === 'read' ? ' is-scan' : '')}>
        <img src={doc.img} alt="" />
        {doc.phase === 'read' && <i className="dr-beam" aria-hidden="true" />}
      </div>
      <div className="dr-body">
        {doc.phase === 'read' && <>
          <b className="dr-t">{t.readT}</b>
          <ul className="dr-steps">{[t.read1, t.read2, t.read3].map((x, i) => <li key={i} className={i < tick ? 'ok' : i === tick ? 'now' : ''}><span>{i < tick ? '✓' : ''}</span>{x}</li>)}</ul>
        </>}
        {doc.phase === 'err' && <>
          <b className="dr-t">{t.foundT}</b>
          <p className="dr-err">{doc.msg}</p>
          <div className="dr-act"><button type="button" className="btn-o" onClick={onRetake}><Icon n="camera" size={15} />{t.retake}</button></div>
        </>}
        {doc.phase === 'done' && <>
          <div className="dr-h">
            <b className="dr-t">{t.foundT}</b>
            {doc.res.demo ? <em className="dr-demo">{t.demo}</em> : <em className="dr-ai">Gemini</em>}
          </div>
          {doc.res.docType && <p className="dr-type"><Icon n="doc" size={14} />{doc.res.docType}</p>}
          {doc.res.summary && <p className="dr-sum">{doc.res.summary}</p>}
          {!items.length && <p className="dr-err">{t.none}</p>}
          <ul className="dr-list">
            {items.map((x) => (
              <li key={x.id}>
                <label>
                  <input type="checkbox" checked={doc.pick.includes(x.id)} onChange={() => onPick(x.id)} />
                  <span>
                    <b>{K === 'ko' ? (x.titleKo || x.title) : (x.title || x.titleKo)}</b>
                    <small>{K === 'ko' ? (x.whatKo || x.what) : (x.what || x.whatKo)}</small>
                    <span className="dr-meta">
                      {x.due && <em className="dr-due">{t.due} {fmt(x.due)}</em>}
                      {x.place && (x.place.name || x.place.address) && <em><Icon n="pin" size={12} />{x.place.name || x.place.address}{!x.placeKey && !x.ll ? ' ?' : ''}</em>}
                      {x.tel && <em><Icon n="call" size={12} />{x.tel}</em>}
                    </span>
                    {x.bring && x.bring.length > 0 && <span className="dr-bring">{t.bring}: {x.bring.join(', ')}</span>}
                  </span>
                </label>
              </li>
            ))}
          </ul>
          <div className="dr-act">
            <button type="button" className="btn-o" onClick={onRetake}><Icon n="camera" size={15} />{t.retake}</button>
            <button type="button" className="btn-p" disabled={!doc.pick.length} onClick={onAdd}>{t.add}</button>
          </div>
        </>}
        <p className="dr-note">{t.privacy}</p>
      </div>
    </div>
  );
}

/* 사진 → 가로세로 최대 1400px JPEG (보내는 양 줄이기) */
export async function shrink(blob, max = 1400) {
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = url; });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL('image/jpeg', 0.82);
  } finally { URL.revokeObjectURL(url); }
}
