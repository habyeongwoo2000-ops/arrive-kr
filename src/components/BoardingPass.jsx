/* 시작 화면 — 실제 종이 탑승권처럼
   · 본권(승객·출발/도착·편명·날짜·게이트·좌석·CLASS=비자) + 절취선 + 보관용 쪽지(QR)
   · 마우스를 따라 살짝 기울고(3D), 홀로그램 박이 반짝입니다.
   · "탑승하기" → 도장 쾅 → 쪽지가 찢겨 나가고 → 탑승권이 날아가며 비행 시작 */

import { useEffect, useMemo, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { byCode, IATA, NUM2A2 } from '../data/visas.js';
import { byIso } from '../data/countries.js';
import { ui } from '../i18n/ui.js';
import Passport from './Passport.jsx';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';

const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const hash = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const fmt = (d) => String(d.getDate()).padStart(2, '0') + MON[d.getMonth()] + String(d.getFullYear()).slice(2);
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export function a2Of(f) { const c = byIso[f.id]; return c ? c.a2 : NUM2A2[f.id] || NUM2A2[f.properties.name] || ''; }
export function iataOf(f) {
  const a2 = a2Of(f);
  if (a2 && IATA[a2]) return IATA[a2];
  return (f.properties.name || 'XXX').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase();
}

/* 장식용 1차원 바코드 (승객 정보로 굵기를 정해 매번 같은 모양) */
function Bars({ seed, h = 54 }) {
  const bars = useMemo(() => {
    let x = 0, r = hash(seed) || 1; const out = [];
    for (let i = 0; i < 78; i++) {
      r = Math.imul(r ^ (r >>> 15), 2246822507) >>> 0;
      const w = 1 + (r % 3), gap = 1 + ((r >>> 4) % 2);
      out.push([x, w]); x += w + gap;
    }
    return { out, w: x };
  }, [seed]);
  return (
    <svg className="bp-bars" viewBox={`0 0 ${bars.w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {bars.out.map(([x, w], i) => <rect key={i} x={x} y="0" width={w} height={h} />)}
    </svg>
  );
}

export default function BoardingPass({ lang, features, labelOf, init, onBoard, onSkip }) {
  const t = ui(lang);
  const [name, setName] = useState(init.name || '');
  const [from, setFrom] = useState(init.from || null);   // feature
  const [visa, setVisa] = useState(init.visa || 'E-9');
  const [entry, setEntry] = useState(init.entry);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState(null);
  const pickBtn = useRef(null);
  const openPick = () => { const r = pickBtn.current.getBoundingClientRect(); setPos({ left: Math.min(r.left, innerWidth - 316), top: r.bottom + 8 }); setOpen(true); };
  const [phase, setPhase] = useState('idle');            // idle → stamp → tear → fly
  const [qr, setQr] = useState('');
  const [warn, setWarn] = useState('');
  const card = useRef(null);
  useEsc(onSkip, phase === 'idle');                       // Esc: 탑승권 닫기
  useEsc(() => { setOpen(false); setQ(''); }, open);        // Esc: 나라 목록만 닫기 (먼저)
  /* 나라 목록 바깥을 누르면 닫기 */
  useEffect(() => {
    if (!open) return undefined;
    const off = (e) => { if (!e.target.closest('.bp-drop') && !(pickBtn.current && pickBtn.current.contains(e.target))) { setOpen(false); setQ(''); } };
    document.addEventListener('pointerdown', off);
    return () => document.removeEventListener('pointerdown', off);
  }, [open]);
  const lb = (loc, eng) => (lang === 'en' ? eng : loc + ' · ' + eng);
  useEffect(() => { if (init.from && !from) setFrom(init.from); }, [init.from]); // eslint-disable-line react-hooks/exhaustive-deps

  const v = byCode[visa];
  const code = from ? iataOf(from) : '———';
  const city = from ? (labelOf(from) || '').toUpperCase() : t.pickCountry;
  const h = hash((name || 'GUEST') + code + visa);
  const flightNo = 'AK ' + String(100 + (h % 900));
  const seat = (12 + (h % 30)) + 'ABCDEFGHJK'[(h >>> 5) % 10];
  const gate = String(1 + ((h >>> 9) % 49));
  const bh = 6 + ((h >>> 3) % 14), bm = ((h >>> 7) % 12) * 5;
  const board = String(bh).padStart(2, '0') + ':' + String(bm).padStart(2, '0');
  const pnr = (h.toString(36).toUpperCase() + 'KRWJ').slice(0, 6);
  const tkt = '180 ' + String(h).padStart(10, '0').slice(0, 10);
  const pax = (name.trim() || 'GUEST').toUpperCase();

  /* QR — 실제로 찍으면 같은 조건으로 이 사이트가 열립니다 */
  useEffect(() => {
    const a2 = from ? a2Of(from) : '';
    const url = `${location.origin}/?visa=${encodeURIComponent(visa)}${a2 ? '&from=' + a2 : ''}&lang=${lang}`;
    QRCode.toString(url, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#202124', light: '#0000' } })
      .then(setQr).catch(() => setQr(''));
  }, [from, visa, lang]);

  /* 검색 목록 — 송출국 먼저 */
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return features.map((f) => ({ f, n: labelOf(f), en: f.properties.name, send: !!byIso[f.id] }))
      .filter((r) => r.f.id !== '410' && (!s || r.n.toLowerCase().includes(s) || r.en.toLowerCase().includes(s)))
      .sort((a, b) => (b.send - a.send) || a.n.localeCompare(b.n)).slice(0, s ? 10 : 18);
  }, [q, features, lang]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 3D 기울기 */
  const tilt = (e) => {
    const el = card.current; if (!el || phase !== 'idle' || matchMedia('(hover: none)').matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg');
    el.style.setProperty('--rx', (-y * 7).toFixed(2) + 'deg');
    el.style.setProperty('--gx', ((x + 0.5) * 100).toFixed(1) + '%');
    el.style.setProperty('--gy', ((y + 0.5) * 100).toFixed(1) + '%');
  };
  const untilt = () => { const el = card.current; if (el) { el.style.setProperty('--ry', '0deg'); el.style.setProperty('--rx', '0deg'); } };

  const go = () => {
    if (!from) { setWarn(t.needFrom); setOpen(true); return; }
    untilt(); setPhase('stamp');
    setTimeout(() => setPhase('tear'), 900);
    setTimeout(() => setPhase('fly'), 1800);
    setTimeout(() => onBoard({ name: name.trim(), from, visa, entry }), 2500);
  };

  return (
    <div className={'bp-back ph-' + phase} role="dialog" aria-modal="true" aria-label={t.bpTitle}>
      {phase === 'idle' && <button type="button" className="x-close on-dark bp-x" onClick={onSkip} aria-label={t.close} title={t.close}><Icon n="close" size={22} /></button>}
      <div className="bp-stage">
        <div className="bp-tilt" ref={card} onMouseMove={tilt} onMouseLeave={untilt}>
          <article className="bp" aria-label={t.bpTitle}>
            {/* ───── 본권 ───── */}
            <section className="bp-main">
              <header className="bp-head">
                <div className="bp-brand">
                  <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" /><path d="M3 16h26M16 3c4.5 4 4.5 22 0 26M16 3c-4.5 4-4.5 22 0 26" /></svg>
                  <b>ArriveKR</b><span>AIR</span>
                </div>
                <div className="bp-kind"><b>BOARDING PASS</b>{lang !== 'en' && <span>{t.bpTitle}</span>}</div>
                <div className="bp-class-tag" style={{ background: v.color }}>{visa}</div>
              </header>

              <div className="bp-body">
                <label className="bp-f bp-name">
                  <small>{lb(t.passenger, 'NAME OF PASSENGER')}</small>
                  <span className="bp-in">
                    <input value={name} onChange={(e) => setName(e.target.value.slice(0, 26))} placeholder={t.namePh} aria-label={t.passenger} />
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4" /></svg>
                  </span>
                </label>

                <div className="bp-route">
                  <div className="bp-port bp-from">
                    <small>{lb(t.fromL, 'FROM')}</small>
                    {/* 출발 국가 고르기 — 고르기 전에는 "출발 국가 검색" 상자, 고른 뒤에는 공항 코드 + ▾ */}
                    <button type="button" ref={pickBtn} className={'bp-pick' + (from ? ' bp-code' : ' is-empty')} onClick={() => { if (open) setOpen(false); else openPick(); setWarn(''); }} aria-haspopup="listbox" aria-label={from ? city : t.pickCountry}>
                      {from ? code : <><svg className="bp-pick-ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15.5 0 18M12 3c-2.5 2.5-2.5 15.5 0 18" /></svg><span>{t.pickCountry}</span></>}
                      <svg className="bp-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5" /></svg>
                    </button>
                    {from && <em>{city}</em>}
                  </div>
                  <div className="bp-path" aria-hidden="true">
                    <span className="bp-dots" />
                    <svg viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>
                    <span className="bp-dots" />
                  </div>
                  <div className="bp-port">
                    <small>{lb(t.toL, 'TO')}</small>
                    <span className="bp-code">ICN</span>
                    <em>SEOUL / INCHEON</em>
                  </div>
                  <div className="bp-final">
                    <small>{t.finalDest}</small>
                    <b>WJU</b>
                    <em>WONJU · 원주</em>
                  </div>
                </div>

                <div className="bp-grid">
                  <div className="bp-f"><small>{lb(t.flight, 'FLIGHT')}</small><b>{flightNo}</b></div>
                  <label className="bp-f bp-date"><small>{lb(t.date, 'DATE')}</small><b>{fmt(entry)}</b>
                    <input type="date" value={iso(entry)} onChange={(e) => e.target.value && setEntry(new Date(e.target.value + 'T00:00:00'))} aria-label={t.date} /></label>
                  <div className="bp-f"><small>{lb(t.boarding, 'BOARDING')}</small><b>{board}</b></div>
                  <div className="bp-f"><small>{lb(t.gate, 'GATE')}</small><b>{gate}</b></div>
                  <div className="bp-f"><small>{lb(t.seat, 'SEAT')}</small><b>{seat}</b></div>
                  <div className="bp-f bp-cls"><small>{lb(t.klass, 'CLASS')}</small><b style={{ color: v.color }}>{visa}</b></div>
                </div>

                <div className="bp-foot">
                  <Bars seed={pax + code + visa + flightNo} />
                  <div className="bp-tk"><span>E-TKT {tkt}</span><span>PNR {pnr}</span><span>SEQ {String(1 + (h % 280)).padStart(3, '0')}</span></div>
                </div>
              </div>
              <p className="bp-fine">{t.bpNote}</p>
              <div className="bp-stamp" aria-hidden="true"><b>BOARDED</b><span>{t.boarded} · {fmt(entry)}</span><i>ICN ✈ WJU</i></div>
            </section>

            {/* ───── 절취선 ───── */}
            <div className="bp-perf" aria-hidden="true" />

            {/* ───── 보관용 쪽지 ───── */}
            <aside className="bp-stub">
              <div className="bp-stub-h"><b>ArriveKR</b><span>{visa}</span></div>
              <div className="bp-f"><small>NAME</small><b className="sm">{pax}</b></div>
              <div className="bp-stub-r"><b>{code}</b><span>✈</span><b>ICN</b></div>
              <div className="bp-stub-g">
                <div className="bp-f"><small>FLIGHT</small><b className="sm">{flightNo}</b></div>
                <div className="bp-f"><small>SEAT</small><b className="sm">{seat}</b></div>
              </div>
              <div className="bp-qr" aria-label="QR" dangerouslySetInnerHTML={{ __html: qr }} />
              <div className="bp-holo" aria-hidden="true"><span>KR</span></div>
            </aside>
          </article>
        </div>

        {open && pos && (
          <div className="bp-drop" role="listbox" style={{ position: 'fixed', left: pos.left, top: pos.top }}>
            <div className="bp-drop-h">
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.pickCountry} aria-label={t.pickCountry} />
              <button type="button" className="x-close sm" onClick={() => { setOpen(false); setQ(''); }} aria-label={t.close}><Icon n="close" size={16} /></button>
            </div>
            <ul>
              {list.map((r) => (
                <li key={r.f.id}><button type="button" onClick={() => { setFrom(r.f); setOpen(false); setQ(''); setWarn(''); }}>
                  <b>{iataOf(r.f)}</b><span>{r.n}</span>{r.send && <i>EPS</i>}
                </button></li>
              ))}
            </ul>
          </div>
        )}

        {/* ───── 비자 고르기: 여권 ───── */}
        <Passport lang={lang} visa={visa} onPick={setVisa} />

        <div className="bp-act">
          {warn && <p className="bp-warn" role="alert">{warn}</p>}
          <button type="button" className="bp-go" onClick={go} disabled={phase !== 'idle'}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>
            {t.board}
          </button>
          <button type="button" className="bp-skip" onClick={onSkip}>{t.skip}</button>
        </div>
      </div>
    </div>
  );
}
