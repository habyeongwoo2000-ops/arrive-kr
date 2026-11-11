/* 체류자격 여권 — 남색 여권 표지를 누르면 책처럼 펼쳐지고,
   안쪽 "사증 VISAS" 면에 비자 8종이 도장(스탬프)처럼 찍혀 있습니다.
   ※ 실제 여권과 헷갈리지 않도록 나라문장 대신 ArriveKR 엠블럼을 쓰고 "안내용" 표시를 넣었습니다. */

import { useEffect, useState } from 'react';
import { VISAS } from '../data/visas.js';
import { ui, tx } from '../i18n/ui.js';
import useEsc from '../lib/useEsc.js';

const TILT = [-4, 3, 2, -3, 3, -2, -3, 4];

function useMobile() {
  const q = '(max-width: 760px)';
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => { const mq = matchMedia(q); const f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, []);
  return m;
}

function Stamp({ v, i, on, lang, onPick }) {
  const L = lang === 'ko' ? 'ko' : 'en';
  return (
    <button type="button" role="radio" aria-checked={on} className={'pp-st' + (on ? ' is-on' : '')}
            style={{ '--vc': v.color, '--tilt': TILT[i] + 'deg' }} onClick={(e) => { e.stopPropagation(); onPick(v.code); }}>
      <span className="pp-st-in">
        <small>KOREA · 체류자격</small>
        <b>{v.code}</b>
        <span className="pp-st-n">{tx(v.name, lang)}</span>
        <em>{v.stay[L]}</em>
        <i>✈ ICN · ENTRY</i>
      </span>
      {on && <span className="pp-seal" aria-hidden="true">✓</span>}
    </button>
  );
}

function Page({ list, start, no, visa, lang, onPick, label }) {
  return (
    <div className="pp-page">
      <div className="pp-ph"><span>사증 · VISAS</span><b>{String(no).padStart(2, '0')}</b></div>
      <div className="pp-grid" role="radiogroup" aria-label={label}>
        {list.map((v, k) => <Stamp key={v.code} v={v} i={start + k} on={visa === v.code} lang={lang} onPick={onPick} />)}
      </div>
      <p className="pp-mrz" aria-hidden="true">{('V<KOR' + list.map((v) => v.code.replace(/-/g, '')).join('<') + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44)}</p>
    </div>
  );
}

export default function Passport({ lang, visa, onPick }) {
  const t = ui(lang);
  const L = lang === 'ko' ? 'ko' : 'en';
  const mobile = useMobile();
  const [open, setOpen] = useState(false);
  useEsc(() => setOpen(false), open);
  const a = VISAS.slice(0, 4), b = VISAS.slice(4);
  const sel = VISAS.find((v) => v.code === visa) || null; // 아직 안 골랐으면 null
  // 펼친 면: 컴퓨터는 왼쪽(표지 뒷면)=1~4, 오른쪽=5~8 / 휴대폰은 위=1~4, 아래(표지 뒷면)=5~8
  const back = mobile ? b : a, base = mobile ? a : b;

  return (
    <div className="pp-wrap">
      <p className="vs-h">{t.pickVisa}</p>
      <div className={'pp' + (open ? ' is-open' : '')}>
        <div className="pp-book">
          <div className="pp-base"><Page list={base} start={mobile ? 0 : 4} no={mobile ? 4 : 5} visa={visa} lang={lang} onPick={onPick} label={t.pickVisa} /></div>
          <div className="pp-cover" onClick={() => !open && setOpen(true)} role={open ? undefined : 'button'} tabIndex={open ? -1 : 0}
               aria-label={open ? undefined : t.openPassport} onKeyDown={(e) => { if (!open && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setOpen(true); } }}>
            <div className="pp-front">
              <span className="pp-emboss" aria-hidden="true" />
              <svg className="pp-emblem" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="29" /><circle cx="32" cy="32" r="22" />
                <path d="M10 32h44M32 10c7 6 7 38 0 44M32 10c-7 6-7 38 0 44" />
                <path className="pl" transform="translate(23 22) scale(.75) rotate(45 12 12)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
                <text x="32" y="62" textAnchor="middle">ARRIVEKR</text>
              </svg>
              <div className="pp-title">
                <b>체류자격 여권</b>
                <span>KOREA VISA</span>
                <span>PASSPORT</span>
              </div>
              <svg className="pp-chip" viewBox="0 0 40 26" aria-hidden="true"><rect x="1" y="1" width="38" height="24" rx="2" /><path d="M1 13h10M29 13h10" /><circle cx="20" cy="13" r="6" /><path d="M14 13h12" /></svg>
              <span className="pp-tap">{t.openPassport}</span>
            </div>
            <div className="pp-back"><Page list={back} start={mobile ? 4 : 0} no={mobile ? 5 : 4} visa={visa} lang={lang} onPick={onPick} label={t.pickVisa} /></div>
          </div>
        </div>
      </div>

      {/* 비자를 고르면 그 비자 설명이 나타남 · 고르기 전에는 안내 줄 없이 (여권이 펼쳐져 있으면 닫기 버튼만) */}
      {sel ? (
        <div className="pp-info" style={{ '--vc': sel.color }}>
          <b>{sel.code}</b>
          <div><span>{tx(sel.name, lang)}</span><em>{sel.who[L]}</em><small>{t.stayL} · {sel.stay[L]}{sel.inKorea ? ' · ' + t.inKoreaV : ''}</small></div>
          {open && <button type="button" className="pp-close" onClick={() => setOpen(false)}>{t.closePassport}</button>}
        </div>
      ) : open && (
        <button type="button" className="pp-close pp-close-solo" onClick={() => setOpen(false)}>{t.closePassport}</button>
      )}
      <p className="pp-note">{t.ppNote}</p>
    </div>
  );
}
