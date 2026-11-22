/* 맞춤 지원 찾기 — E9-Bridge 의 화면 틀(내 조건 · 지역별 지원 지도 · 알림 · 추천 목록)을 그대로,
   모양은 ArriveKR 로. 정착 지원 지도 위에 떠서 열립니다.
   점수는 lib/e9reco.js 의 규칙으로만 계산합니다(AI 아님). 고른 조건 · 진행 상황은 이 기기에만 남습니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import KOREA from '@svg-maps/south-korea';
import './reco.css';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';
import { recoLabels, fill, regionNames } from '../i18n/e9reco.js';
import {
  SIDO, CITIES, CITY_COUNT, INDUSTRIES, STAYS, SITUATIONS, CATS, PROGRAMS, STATUSES,
  recommend, countBySido, alertsOf, markSeen, loadTrack, saveTrack, nearestSido, mapSearchUrl,
  checklistOf, cleanProfile, loadProfile, saveProfile
} from '../lib/e9reco.js';

const PAGE = 8;
/* ArriveKR 은 원주에서 시작하니, 처음 열면 강원 · 원주시로 골라 둡니다 */
const START = { sido: 'gangwon', city: '원주시' };
const Ext = ({ href, children, ...p }) => <a href={href} target="_blank" rel="noopener noreferrer" {...p}>{children}</a>;

function useProfile() {
  const [profile, setP] = useState(() => { const p = loadProfile(); return p.sido ? p : cleanProfile({ ...p, ...START }); });
  const update = (v) => setP((cur) => { const next = cleanProfile({ ...cur, ...v }); saveProfile(next); return next; });
  const reset = () => { const next = cleanProfile(START); saveProfile(next); setP(next); };
  return { profile, update, reset };
}

function Chips({ legend, opts, keys, value, multi, onChange }) {
  const on = (k) => (multi ? value.indexOf(k) !== -1 : value === k);
  const flip = (k) => (multi ? onChange(on(k) ? value.filter((x) => x !== k) : [...value, k]) : onChange(value === k ? '' : k));
  return (
    <fieldset className="rk-field">
      <legend>{legend}</legend>
      <div className="rk-chips">
        {keys.map((k) => <button key={k} type="button" className={'chip' + (on(k) ? ' is-on' : '')} aria-pressed={on(k)} onClick={() => flip(k)}>{opts[k]}</button>)}
      </div>
    </fieldset>
  );
}

/* ───────── 시·도 지도 (svg-maps, CC BY 4.0) ───────── */
const ID_TO_SIDO = {
  'north-chungcheong': 'chungbuk', 'south-chungcheong': 'chungnam', 'north-jeolla': 'jeonbuk',
  'south-jeolla': 'jeonnamgwangju', gwangju: 'jeonnamgwangju', 'north-gyeongsang': 'gyeongbuk', 'south-gyeongsang': 'gyeongnam'
};
const sidoOf = (id) => ID_TO_SIDO[id] || id;
/* ArriveKR 파랑 단계: 아주 연한 파랑 → 짙은 파랑 */
function shade(x) {
  const a = [232, 243, 255], b = [18, 64, 160];
  return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * x)).join(',') + ')';
}
function KoreaMap({ t, R, counts, value, onPick }) {
  const max = Math.max(1, ...Object.values(counts));
  return (
    <div className="rk-km">
      <svg className="rk-km-map" viewBox={KOREA.viewBox} role="group" aria-label={t.mapTitle}>
        {KOREA.locations.map((loc) => {
          const s = sidoOf(loc.id); const n = counts[s] || 0; const on = value === s;
          return (
            <path key={loc.id} d={loc.path} className={'rk-km-a' + (on ? ' is-on' : '')} style={{ fill: on ? 'var(--green)' : shade(n / max) }}
                  role="button" tabIndex={0} aria-pressed={on} aria-label={(R[s] || s) + ' ' + fill(t.mapCount, { n })}
                  onClick={() => onPick(s)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(s); } }}>
              <title>{(R[s] || s) + ' · ' + fill(t.mapCount, { n })}</title>
            </path>
          );
        })}
      </svg>
      <ol className="rk-km-list">
        {Object.keys(counts).sort((a, b) => counts[b] - counts[a]).map((s) => (
          <li key={s}>
            <button type="button" className={value === s ? 'is-on' : ''} aria-pressed={value === s} onClick={() => onPick(s)}>
              <i style={{ background: shade(counts[s] / max) }} aria-hidden="true" /><span>{R[s] || s}</span><b>{counts[s]}</b>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ───────── 추천 카드 ───────── */
function reasonText(r, t, R) {
  const v = r.v || {};
  const list = (arr, opts) => (arr || []).map((x) => opts[x] || x).join(', ');
  return fill(t[r.k], { sido: R[v.sido] || v.sido, city: v.city, days: v.days, until: v.until,
    cats: list(v.cats, t.catOpts), sits: list(v.sits, t.sitOpts), ind: list(v.ind, t.indOpts) });
}
const MARK = { ok: 'check', warn: 'alert', no: 'close' };

function Card({ r, rank, t, R, lang, track, onTrack }) {
  const [open, setOpen] = useState(false);
  const { p } = r;
  const body = p.n[lang] || p.n.en;
  const mine = track[p.key] || {};
  const list = checklistOf(p);
  const checks = mine.c || [];
  const all = [...list.steps, ...list.docs];
  const done = all.filter((k) => checks.indexOf(k) !== -1).length;
  const toggle = (k) => onTrack(p.key, { ...mine, c: checks.indexOf(k) === -1 ? [...checks, k] : checks.filter((x) => x !== k) });
  return (
    <li id={'rk-' + p.key} className={'rk-card' + (r.fit ? '' : ' is-weak')}>
      <div className="rk-card-top">
        <span className="rk-rank" aria-hidden="true">{rank}</span>
        <div className="rk-card-h">
          <p className="rk-where">
            <span>{p.region ? R[p.region] || p.region : t.rsNation}</span>
            {p.cities.length > 0 && <span lang="ko">{p.cities.join('·')}</span>}
            {p.cats.slice(0, 3).map((c) => <span key={c} className="rk-cat">{t.catOpts[c]}</span>)}
          </p>
          <h3>{body.title}</h3>
          {lang !== 'ko' && <p className="rk-ko">{t.koTitle} <b lang="ko">{p.n.ko.title}</b></p>}
        </div>
        <div className="rk-score" aria-label={t.match + ' ' + r.score + '%'}>
          <b>{r.score}<small>%</small></b>
          <i aria-hidden="true"><u style={{ width: r.score + '%' }} /></i>
        </div>
      </div>
      <ul className="rk-why">
        {r.reasons.map((x, i) => <li key={i} className={'is-' + x.t}><Icon n={MARK[x.t]} size={14} />{reasonText(x, t, R)}</li>)}
      </ul>
      {!r.fit && <p className="rk-weak">{t.notFit}</p>}
      <div className="rk-act">
        <button type="button" className="rk-go" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? t.close : t.prepare}{done > 0 && !open ? ' · ' + fill(t.progress, { done, total: all.length }) : ''}
        </button>
        <Ext className="rk-btn" href={p.n.url}><Icon n="link" size={15} />{t.original}</Ext>
        {p.region && <Ext className="rk-btn" href={mapSearchUrl(p)}><Icon n="pin" size={15} />{t.map}</Ext>}
        {p.phones.slice(0, 1).map((ph) => <a key={ph} className="rk-btn" href={'tel:' + ph.replace(/-/g, '')}><Icon n="call" size={15} />{ph}</a>)}
        <label className="rk-status">
          <span>{t.statusLabel}</span>
          <select value={mine.s || ''} onChange={(e) => onTrack(p.key, { ...mine, s: e.target.value })}>
            {STATUSES.map((s) => <option key={s} value={s}>{t.statusOpts[s]}</option>)}
          </select>
        </label>
      </div>
      {open && (
        <div className="rk-prep">
          {(body.points || []).length > 0 && <ul className="rk-points">{body.points.map((x, i) => <li key={i}>{x}</li>)}</ul>}
          <div className="rk-prep-grid">
            <fieldset>
              <legend>{t.stepsTitle}</legend>
              {list.steps.map((k, i) => (
                <label key={k} className="rk-check">
                  <input type="checkbox" checked={checks.indexOf(k) !== -1} onChange={() => toggle(k)} />
                  <span><b>{i + 1}</b>{t[k]}{k === 'stCall' && p.phones.length > 0 ? ' · ' + p.phones.join(', ') : ''}</span>
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>{t.docsTitle}</legend>
              {list.docs.map((k) => (
                <label key={k} className="rk-check"><input type="checkbox" checked={checks.indexOf(k) !== -1} onChange={() => toggle(k)} /><span>{t[k]}</span></label>
              ))}
              <p className="rk-fine">{t.docsNote}</p>
            </fieldset>
          </div>
          <div className="rk-meter"><i><u style={{ width: (done / all.length * 100) + '%' }} /></i><span>{done === all.length ? t.ready : fill(t.progress, { done, total: all.length })}</span></div>
          <p className="rk-src" lang="ko">{p.n.source} · {p.n.checked}</p>
        </div>
      )}
    </li>
  );
}

export default function RecoPanel({ lang, onClose }) {
  const t = recoLabels(lang);
  const R = regionNames(lang);
  useEsc(onClose);
  const { profile, update, reset } = useProfile();
  const [page, setPage] = useState(1);
  const [track, setTrack] = useState(loadTrack);
  const [loc, setLoc] = useState('idle');
  const body = useRef(null);
  const resRef = useRef(null);

  const list = useMemo(() => recommend(profile), [profile]);
  const counts = useMemo(() => countBySido(profile), [profile]);
  const alerts = useMemo(() => alertsOf(list), [list]);
  const listRef = useRef(list); listRef.current = list;
  useEffect(() => () => markSeen(listRef.current), []);
  useEffect(() => { setPage(1); }, [profile]);

  const pages = Math.max(1, Math.ceil(list.length / PAGE));
  const cur = Math.min(page, pages);
  const from = (cur - 1) * PAGE + 1;
  const to = Math.min(cur * PAGE, list.length);
  const toRes = () => { if (resRef.current && body.current) body.current.scrollTo({ top: resRef.current.offsetTop - 12, behavior: 'smooth' }); };
  const goPage = (n) => { setPage(n); toRes(); };
  const onTrack = (key, v) => setTrack((c) => { const next = { ...c, [key]: v }; saveTrack(next); return next; });
  const tracking = list.filter((r) => track[r.p.key] && (track[r.p.key].s === 'want' || track[r.p.key].s === 'applied'));
  const pickSido = (s) => update({ sido: s, city: '' });
  const locate = () => {
    if (!navigator.geolocation) { setLoc('failed'); return; }
    setLoc('loading');
    navigator.geolocation.getCurrentPosition((pos) => { pickSido(nearestSido(pos.coords.latitude, pos.coords.longitude)); setLoc('idle'); },
      () => setLoc('failed'), { timeout: 8000, maximumAge: 600000 });
  };
  const agencies = profile.sido ? PROGRAMS.filter((p) => p.region === profile.sido && /센터|쉼터|진료소|상담소|복지회/.test(p.n.ko.title)).slice(0, 8) : [];
  const jump = (key) => {
    const i = list.findIndex((r) => r.p.key === key);
    if (i >= 0) setPage(Math.floor(i / PAGE) + 1);
    setTimeout(() => { const el = document.getElementById('rk-' + key); if (el && body.current) body.current.scrollTo({ top: el.offsetTop - 12, behavior: 'smooth' }); }, 80);
  };
  const title = (r) => (r.p.n[lang] || r.p.n.en).title;

  return (
    <section className="rk" role="dialog" aria-modal="false" aria-labelledby="rk-title" onClick={(e) => e.stopPropagation()}>
      <header className="rk-head">
        <div>
          <h2 id="rk-title">{t.title}</h2>
          <p>{t.lead}</p>
        </div>
        <button type="button" className="rk-x" onClick={onClose} aria-label={t.close} title={t.close}><Icon n="close" size={18} /></button>
      </header>

      <div className="rk-body" ref={body}>
        <div className="rk-grid">
          {/* 내 조건 */}
          <section className="rk-box" aria-labelledby="rk-me">
            <div className="rk-box-h">
              <h3 id="rk-me">{t.profileTitle}</h3>
              <button type="button" className="rk-text" onClick={reset}>{t.reset}</button>
            </div>
            <div className="rk-selects">
              <label><span>{t.sido}</span>
                <select value={profile.sido} onChange={(e) => pickSido(e.target.value)}>
                  <option value="">{t.sidoPick}</option>
                  {SIDO.map((s) => <option key={s} value={s}>{R[s] || s}</option>)}
                </select>
              </label>
              <label><span>{t.city}</span>
                <select value={profile.city} disabled={!profile.sido || !(CITIES[profile.sido] || []).length} onChange={(e) => update({ city: e.target.value })}>
                  <option value="">{t.cityAny}</option>
                  {(CITIES[profile.sido] || []).map((c) => { const n = (CITY_COUNT[profile.sido] || {})[c]; return <option key={c} value={c} lang="ko">{c}{n ? ' · ' + n : ''}</option>; })}
                </select>
              </label>
            </div>
            <Chips legend={t.ind} opts={t.indOpts} keys={INDUSTRIES} value={profile.ind} onChange={(v) => update({ ind: v })} />
            <Chips legend={t.stay} opts={t.stayOpts} keys={STAYS} value={profile.stay} onChange={(v) => update({ stay: v })} />
            <Chips legend={t.sits} opts={t.sitOpts} keys={SITUATIONS} value={profile.sits} multi onChange={(v) => update({ sits: v })} />
            <Chips legend={t.needs} opts={t.catOpts} keys={CATS} value={profile.needs} multi onChange={(v) => update({ needs: v })} />
          </section>

          {/* 지역별 지원 */}
          <section className="rk-box" aria-labelledby="rk-map">
            <div className="rk-box-h">
              <h3 id="rk-map">{t.mapTitle}</h3>
              <button type="button" className="rk-btn" onClick={locate} disabled={loc === 'loading'}><Icon n="pin" size={15} />{loc === 'loading' ? t.locating : t.locate}</button>
            </div>
            <p className="rk-fine">{t.mapLead}</p>
            {loc === 'failed' && <p className="rk-fine is-warn">{t.locFail}</p>}
            <KoreaMap t={t} R={R} counts={counts} value={profile.sido} onPick={pickSido} />
            <p className="rk-credit">{t.mapCredit}</p>
            {profile.sido && (
              <div className="rk-ag">
                <h4>{fill(t.agTitle, { sido: R[profile.sido] || profile.sido })}</h4>
                {agencies.length ? (
                  <ul>
                    {agencies.map((p) => (
                      <li key={p.key}>
                        <Ext href={mapSearchUrl(p)}><span lang="ko">{p.n.ko.title}</span></Ext>
                        {p.phones[0] && <a className="rk-tel" href={'tel:' + p.phones[0].replace(/-/g, '')}>{p.phones[0]}</a>}
                      </li>
                    ))}
                  </ul>
                ) : <p className="rk-fine">{t.agNone}</p>}
              </div>
            )}
          </section>
        </div>

        {/* 알림 */}
        <section className="rk-alerts" aria-label={t.alSoon + ' · ' + t.alNew}>
          {[['is-soon', alerts.soon, t.alSoon, (r) => title(r) + ' · ' + r.p.n.until],
            ['is-new', alerts.fresh, t.alNew, title],
            ['is-track', tracking, t.alTrack, (r) => title(r) + ' · ' + t.statusOpts[track[r.p.key].s]]].map(([cls, arr, label, txt]) => (
            <div key={cls} className={'rk-al ' + cls}>
              <p><b>{arr.length}</b><span>{label}</span></p>
              {arr.slice(0, 3).map((r) => <button key={r.p.key} type="button" onClick={() => jump(r.p.key)}>{txt(r)}</button>)}
            </div>
          ))}
        </section>

        {/* 추천 목록 */}
        <section className="rk-res" ref={resRef} aria-labelledby="rk-res">
          <h3 id="rk-res">{fill(t.resTitle, { n: list.filter((r) => r.fit).length })}</h3>
          {!profile.sido && <p className="rk-fine">{t.resNeedSido}</p>}
          {!list.length && <p className="rk-fine">{t.resEmpty}</p>}
          <ol className="rk-list">
            {list.slice(from - 1, to).map((r, i) => <Card key={r.p.key} r={r} rank={from + i} t={t} R={R} lang={lang} track={track} onTrack={onTrack} />)}
          </ol>
          {pages > 1 && (
            <nav className="rk-pages" aria-label="pages">
              <p aria-live="polite">{fill(cur < pages ? t.pageInfo : t.pageInfoLast, { from, to, total: list.length, left: list.length - to, pages: pages - cur })}</p>
              <div>
                <button type="button" disabled={cur === 1} onClick={() => goPage(cur - 1)} aria-label="prev"><Icon n="back" size={16} /></button>
                {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                  <button key={n} type="button" className={n === cur ? 'is-on' : ''} aria-current={n === cur ? 'page' : undefined} onClick={() => goPage(n)}>{n}</button>
                ))}
                <button type="button" disabled={cur === pages} onClick={() => goPage(cur + 1)} aria-label="next"><Icon n="next" size={16} /></button>
              </div>
            </nav>
          )}
        </section>
        <p className="rk-note">{t.dataNote}</p>
      </div>
    </section>
  );
}
