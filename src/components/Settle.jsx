/* 원주 정착 — 지구본에서 내려와 실제 거리 지도(OpenStreetMap) 위에
   원주 → 강원 → 전국 순서로 맞춤 공공지원을 추천합니다. */

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { SHOPS, PHONES, FOODS, PLACES, TOWNS, NEEDS, SCOPE, STATS, SOURCES, WONJU, recommend } from '../data/wonju.js';
import { VISAS, byCode } from '../data/visas.js';
import { LEGS } from '../data/route.js';
import { CheckItem } from './RoutePanel.jsx';
import { ui, fill } from '../i18n/ui.js';

const CAT = { stay: '#1a73e8', work: '#e37400', health: '#d93025', korean: '#9334e6', family: '#c2185b', child: '#c2185b', life: '#188038', safety: '#f9ab00', culture: '#00897b', study: '#5f6368' };

function pinIcon(color, label, on) {
  return L.divIcon({
    className: 'lf-pin' + (on ? ' is-on' : ''),
    html: `<svg viewBox="0 0 28 40" aria-hidden="true"><path d="M14 0C6.3 0 0 6.2 0 13.9 0 24.3 14 40 14 40s14-15.7 14-26.1C28 6.2 21.7 0 14 0z" fill="${color}"/><circle cx="14" cy="14" r="5.2" fill="#fff"/></svg><span>${label}</span>`,
    iconSize: [28, 40], iconAnchor: [14, 40]
  });
}

/* 도착 후 할 일 → 지도 핀 (원주에서 그 일을 하는 곳) */
const TODO_PIN = { arc: 'cityhall', bank: 'hana', unlimit: 'hana', remit: 'hana' };
const pinOf = (id) => TODO_PIN[id] || (id.endsWith('-arc') ? 'cityhall' : null);

const flagOf = (a2) => (a2 ? String.fromCodePoint(...[...a2.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0))) : '');

export default function Settle({ lang, visa: visa0, name, onBack, tab, setTab, checks, toggle, entry, country, countryLabel }) {
  const t = ui(lang);
  const K = lang === 'ko' ? 'ko' : 'en';
  const [visa, setVisa] = useState(visa0 || 'E-9');
  const [town, setTown] = useState('wonju');
  const [needs, setNeeds] = useState(['stay', 'health', 'korean']);
  const [family, setFamily] = useState(visa0 === 'F-6');
  const [hi, setHi] = useState(null);
  const host = useRef(null);
  const map = useRef(null);
  const layer = useRef(null);
  const card = useRef(null);
  const shopLayer = useRef(null);
  const [shops, setShops] = useState(true);
  const [phones, setPhones] = useState(true);
  const [foods, setFoods] = useState(true);
  /* 고향 음식점: 지구본에서 고른 나라의 음식점만 */
  const myFoods = country ? FOODS.filter((f) => f.c.includes(country.a2)) : [];
  /* 탭을 바꾸면 새 탭의 맨 위부터 보여 줍니다 */
  useEffect(() => { if (card.current) card.current.scrollTop = 0; }, [tab]);

  const todo = ((visa === 'E-9' ? LEGS : (byCode[visa] || {}).legs) || []).find((l) => l.key === 'arrive');
  const todoItems = todo ? todo.items : [];
  const todoDone = todoItems.filter((i) => checks[i.id]).length;
  const today = new Date();
  const recs = useMemo(() => recommend({ visa, town, needs, family }), [visa, town, needs, family]);
  const groups = ['wonju', 'near', 'gangwon', 'national'].map((s) => ({ s, rows: recs.filter((r) => r.p.scope === s) })).filter((g) => g.rows.length);

  /* 지도 만들기 */
  useEffect(() => {
    const m = L.map(host.current, { zoomControl: false, attributionControl: true }).setView([WONJU.lat, WONJU.lng], 12);
    // OpenStreetMap 기본 타일 (API 키 필요 없음)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap contributors' }).addTo(m);
    L.control.zoom({ position: 'bottomright' }).addTo(m);
    layer.current = L.layerGroup().addTo(m);
    shopLayer.current = L.layerGroup().addTo(m);
    map.current = m;
    // 지도가 이미 닫혔으면(StrictMode 이중 실행·빠른 뒤로 가기) 움직이지 않습니다.
    const tm = setTimeout(() => { m.invalidateSize(); m.panBy(innerWidth > 760 ? [-200, 0] : [0, Math.round(innerHeight * 0.27)], { animate: false }); }, 50);
    return () => { clearTimeout(tm); m.remove(); };
  }, []);

  /* 핀 — 추천된 사업이 있는 장소만 */
  useEffect(() => {
    const lg = layer.current; if (!lg) return;
    lg.clearLayers();
    const at = {};
    recs.forEach((r) => { if (r.p.place) (at[r.p.place] = at[r.p.place] || []).push(r.p); });
    // 도착 지점(버스터미널)은 늘 표시
    const arrive = PLACES.terminal;
    L.marker([arrive.lat, arrive.lng], { icon: pinIcon('#202124', '🚌 ' + arrive[K].split(' (')[0], false) }).addTo(lg)
      .bindPopup(`<b>${arrive[K]}</b><br>${t.toWonjuMove || ''}<br><small>${t.approx}</small>`);
    Object.entries(at).forEach(([k, ps]) => {
      const pl = PLACES[k]; if (!pl) return;
      const on = hi && ps.some((p) => p.id === hi);
      const color = CAT[ps[0].needs[0]] || '#1a73e8';
      const mk = L.marker([pl.lat, pl.lng], { icon: pinIcon(color, pl[K].split(' (')[0] + (ps.length > 1 ? ' · ' + ps.length : ''), on), zIndexOffset: on ? 1000 : 0 }).addTo(lg);
      mk.bindPopup(`<b>${pl[K]}</b>${pl.exact ? '' : ` <small>(${t.approx})</small>`}<ul>${ps.map((p) => `<li>${p[K].t}</li>`).join('')}</ul>`);
      mk.on('click', () => { setHi(ps[0].id); const el = document.getElementById('pg-' + ps[0].id); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); });
    });
  }, [recs, hi, K]); // eslint-disable-line react-hooks/exhaustive-deps

  /* 외국인 식료품점(🛒)·선불폰 매장(📱) 핀 (각각 켜고 끄기) */
  useEffect(() => {
    const lg = shopLayer.current; if (!lg) return;
    lg.clearLayers();
    const list = [...(shops ? SHOPS.map((x) => ({ ...x, ic: '🛒', cls: 'lf-shop', note: t.shopNote })) : []),
                  ...(phones ? PHONES.map((x) => ({ ...x, ic: '📱', cls: 'lf-shop lf-phone' + (x.foreign ? ' lf-foreign' : ''), note: (x.foreign ? '🌏 ' + t.phoneForeign + '<br>' : '') + t.phoneNote })) : []),
                  ...(foods ? myFoods.map((x) => ({ ...x, ic: '🍜', cls: 'lf-shop lf-food', note: (x.native ? '🏠 ' + t.foodNative + '<br>' : '') + t.foodNote })) : [])];
    list.forEach((sh) => {
      const c = sh[K];
      L.marker([sh.lat, sh.lng], { icon: L.divIcon({ className: sh.cls, html: '<span>' + sh.ic + '</span>', iconSize: [30, 30], iconAnchor: [15, 15] }), title: c.t }).addTo(lg)
        .bindPopup(`<b>${sh.ic} ${c.t}</b><br>${c.what}<br><small>${c.addr}</small><br>${sh.tel ? `<a href="tel:${sh.tel.replace(/[^0-9]/g, '')}">☎ ${sh.tel}</a> · ` : ''}<a href="${sh.url}" target="_blank" rel="noopener noreferrer">${t.kakaoMap} ↗</a><br><small>${sh.unsure ? '⚠ ' + t.shopUnsure + '<br>' : ''}${sh.note}</small>`);
    });
  }, [shops, phones, foods, country, K]); // eslint-disable-line react-hooks/exhaustive-deps
  const showShops = () => {
    if (shops) { setShops(false); return; }
    setShops(true);
    map.current && map.current.flyToBounds(L.latLngBounds(SHOPS.filter((x) => x.town === 'wonju').map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showPhonesOn = () => {
    setPhones(true);
    map.current && map.current.flyToBounds(L.latLngBounds(PHONES.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showPhones = () => {
    if (phones) { setPhones(false); return; }
    setPhones(true);
    map.current && map.current.flyToBounds(L.latLngBounds(PHONES.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9 });
  };
  const showFoods = () => {
    if (!myFoods.length) return;
    if (foods) { setFoods(false); return; }
    setFoods(true);
    map.current && map.current.flyToBounds(L.latLngBounds(myFoods.map((x) => [x.lat, x.lng])).pad(0.3), { ...pad(), duration: 0.9, maxZoom: 15 });
  };
  const flyPlace = (k) => { const pl = PLACES[k]; if (pl && map.current) map.current.flyTo([pl.lat, pl.lng], 15, { duration: 0.9 }); };
  const flyTo = (p) => {
    setHi(p.id);
    const pl = p.place && PLACES[p.place]; if (!pl || !map.current) return;
    map.current.flyTo([pl.lat, pl.lng], p.scope === 'wonju' ? 14 : 11, { duration: 0.9 });
  };
  const allGW = () => map.current && map.current.flyToBounds(L.latLngBounds(Object.values(PLACES).map((p) => [p.lat, p.lng])).pad(0.1), { ...pad(), duration: 1 });
  const pad = () => (innerWidth > 760 ? { paddingTopLeft: [430, 20], paddingBottomRight: [20, 20] } : { paddingBottomRight: [0, innerHeight * 0.55] });
  const home = () => map.current && map.current.flyToBounds(L.latLngBounds([[37.30, 127.80], [37.38, 128.0]]), { ...pad(), duration: 0.9 });
  const tog = (n) => setNeeds((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n]));

  const whyLabel = (w) => {
    if (w === 'wonju') return t.rWonju;
    if (w === 'gangwon') return t.rGangwon;
    if (w === 'town') return t.rTown;
    if (w === 'visa') return fill(t.rVisa, { v: visa });
    if (w === 'fresh') return t.rFresh;
    if (w.startsWith('need:')) { const n = NEEDS.find((x) => x.id === w.slice(5)); return n ? n[K] : ''; }
    return '';
  };

  return (
    <div className="settle">
      <div className="lf" ref={host} />

      <aside className="side st-side">
        <div className="card st-card" ref={card}>
          <div className="st-top">
            <button type="button" className="icon" onClick={onBack} aria-label={t.toGlobe} title={t.toGlobe}>←</button>
            <div><b>{t.settleT}</b><small>{t.settleSub}</small></div>
          </div>
          {name && <p className="st-hello">✈ {name.toUpperCase()} · {visa}</p>}

          <div className="st-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'todo'} onClick={() => setTab('todo')}>✅ {t.tabTodo}<span>{todoDone}/{todoItems.length}</span></button>
            <button type="button" role="tab" aria-selected={tab === 'find'} onClick={() => setTab('find')}>📍 {t.tabFind}</button>
          </div>

          {tab === 'todo' && (
            <div className="st-todo">
              <p className="st-todo-intro">{t.todoIntro}</p>
              <div className="st-prog"><i style={{ width: (todoItems.length ? Math.round((todoDone / todoItems.length) * 100) : 0) + '%' }} /></div>
              <ul className="items">
                {todoItems.map((it) => {
                  const pk = pinOf(it.id);
                  return (
                    <CheckItem key={it.id} it={it} lang={lang} entry={entry} today={today} checked={!!checks[it.id]} toggle={toggle}
                               extraBtn={it.id === 'sim' || it.id.endsWith('-sim')
                                 ? <button type="button" className="st-pin" title={t.phonesBtn} onClick={showPhonesOn}>📱 {t.onMap}</button>
                                 : pk && PLACES[pk] ? <button type="button" className="st-pin" title={PLACES[pk][K]} onClick={() => flyPlace(pk)}>📍 {t.onMap}</button> : null} />
                  );
                })}
              </ul>
              {visa === 'E-9' && (country ? (
                <section className="st-country">
                  <h3>{flagOf(country.a2)} {fill(t.ctryMore, { c: countryLabel })}</h3>
                  {(country.ret || country.nps) && (
                    <dl className="rp-meta">
                      {country.ret && <div><dt>{t.retL}</dt><dd>{country.ret[K]}</dd></div>}
                      {country.nps && <div><dt>{t.npsL}</dt><dd>{country.nps[K]}</dd></div>}
                    </dl>
                  )}
                  {country.stay && country.stay[K].length
                    ? <ul className="extra">{country.stay[K].map((x, i) => <li key={i}>{x}</li>)}</ul>
                    : <p className="extra-none">{t.ctryNone}</p>}
                  {country.stayLv === 'summary' && <p className="extra-none">{t.lvNote}</p>}
                </section>
              ) : <p className="st-country-pick">🌏 {t.ctryPick}</p>)}
              <button type="button" className="st-next" onClick={() => setTab('find')}>📍 {t.tabFindGo} →</button>
            </div>
          )}

          {tab === 'find' && <>
          <div className="st-stats">
            {STATS.map((s, i) => <div key={i}><b>{s.n}</b><span>{s[K]}</span></div>)}
          </div>

          <div className="st-form">
            <label><span>{t.myVisa}</span>
              <select value={visa} onChange={(e) => setVisa(e.target.value)}>{VISAS.map((v) => <option key={v.code} value={v.code}>{v.code} · {v.name[K]}</option>)}</select></label>
            <label><span>{t.myTown}</span>
              <select value={town} onChange={(e) => setTown(e.target.value)}>{TOWNS.map((x) => <option key={x.id} value={x.id}>{x[K]}</option>)}</select></label>
            <div className="st-needs"><span>{t.myNeeds}</span>
              <div>{NEEDS.map((n) => <button type="button" key={n.id} className={'chip' + (needs.includes(n.id) ? ' is-on' : '')} aria-pressed={needs.includes(n.id)} onClick={() => tog(n.id)}><i aria-hidden="true">{n.ic}</i>{n[K]}</button>)}</div>
            </div>
            <label className="st-fam"><input type="checkbox" checked={family} onChange={(e) => setFamily(e.target.checked)} /> {t.withFamily}</label>
          </div>

          <p className="st-count">{fill(t.results, { n: recs.length })}</p>
          {!recs.length && <p className="st-none">{t.none}</p>}

          {groups.map((g) => (
            <section key={g.s} className={'st-g sc-' + g.s}>
              <h3>{SCOPE[g.s][K]}<span>{g.rows.length}</span></h3>
              {g.rows.map(({ p, why }) => {
                const c = p[K];
                return (
                  <article key={p.id} id={'pg-' + p.id} className={'pg' + (hi === p.id ? ' is-on' : '')} onClick={() => flyTo(p)}>
                    <div className="pg-h">
                      <b>{c.t}</b>
                      {p.fresh && <em className="pg-new">{t.newB}</em>}
                    </div>
                    <p>{c.what}</p>
                    <dl>
                      <div><dt>{t.whoL}</dt><dd>{c.who}</dd></div>
                      <div><dt>{t.whenL}</dt><dd>{c.when}</dd></div>
                    </dl>
                    <ul className="pg-why">{why.map((w) => whyLabel(w) && <li key={w}>✓ {whyLabel(w)}</li>)}</ul>
                    <div className="pg-act">
                      {p.tel && <a href={'tel:' + p.tel.replace(/[^0-9]/g, '')} onClick={(e) => e.stopPropagation()}>☎ {p.tel}</a>}
                      {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>↗ {t.site}</a>}
                      {p.place && <button type="button" onClick={(e) => { e.stopPropagation(); flyTo(p); }}>📍 {t.onMap}</button>}
                    </div>
                    <small className="pg-src">{p.org} · {t.srcL}: {SOURCES[p.src]}</small>
                  </article>
                );
              })}
            </section>
          ))}
          </>}
          <p className="rp-note">{t.checkedOn}</p>
        </div>
      </aside>

      <div className="st-tools">
        <button type="button" onClick={home}>📍 {t.toWonju}</button>
        <button type="button" className={'st-shop' + (shops ? ' is-on' : '')} aria-pressed={shops} onClick={showShops}>🛒 {t.shopsBtn}</button>
        <button type="button" className={'st-shop st-phone' + (phones ? ' is-on' : '')} aria-pressed={phones} onClick={showPhones}>📱 {t.phonesBtn}</button>
        <button type="button" className={'st-shop st-food' + (foods && myFoods.length ? ' is-on' : '')} aria-pressed={foods && myFoods.length > 0} disabled={!myFoods.length}
                title={!country ? t.foodPick : !myFoods.length ? fill(t.foodNone, { c: countryLabel }) : ''} onClick={showFoods}>
          🍜 {!country ? t.foodBtn : myFoods.length ? fill(t.foodOf, { c: countryLabel, n: myFoods.length }) : fill(t.foodNone, { c: countryLabel })}
        </button>
        <button type="button" onClick={allGW}>🗺 {t.allGW}</button>
      </div>
    </div>
  );
}

