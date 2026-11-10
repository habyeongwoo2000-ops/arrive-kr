/* 내 집 주소 — 길찾기의 '출발' 칸처럼. 주소 검색 · 지도에서 고르기 · 현재 위치
   · 집 위치는 이 기기(브라우저)에만 저장합니다. */
import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import { geocode } from '../lib/route.js';

export const HS = {
  ko: { homeL: '내 집', homeP: '집 주소 (예: 원주시 단구로 170)', find: '검색', onMap: '지도에서 고르기', here: '현재 위치', change: '변경', clear: '지우기', near: '가까운 순',
        none: '주소를 못 찾았어요. 동 이름·길 이름으로 다시 찾거나 지도에서 골라 주세요.', nearOnly: '번지까지는 못 찾아 길 위치로 보여 드려요', saved: '집 위치는 이 기기에만 저장돼요 · 주소 검색은 OpenStreetMap을 써요',
        fromHome: '집에서', pickT: '지도를 눌러 집 위치를 고르세요', cancel: '취소', picked: '고른 위치', route: '길 보기', locFail: '현재 위치를 가져오지 못했어요', est: '거리는 자동차 길 기준 어림값이에요', searching: '찾는 중…',
        baseL: '30일 일정 출발 기준', baseArrive: '버스터미널(도착)', baseHome: '내 집', baseArriveSub: '공항버스로 도착한 곳에서 시작해 장소를 차례로 이어요', baseHomeSub: '{home}에서 날마다 출발하는 동선 · 방문 날 출발 시간까지', baseNeed: '위 칸에 집 주소를 넣거나 지도에서 골라 주세요 — 넣으면 바로 내 집 기준이 돼요' },
  en: { homeL: 'Home', homeP: 'Home address (e.g. 원주시 단구로 170)', find: 'Search', onMap: 'Pick on map', here: 'My location', change: 'Change', clear: 'Clear', near: 'Nearest first',
        none: 'Address not found. Try the dong or street name, or pick it on the map.', nearOnly: 'House number not found — showing the street', saved: 'Your home stays on this device only · search uses OpenStreetMap',
        fromHome: 'From home', pickT: 'Tap the map where you live', cancel: 'Cancel', picked: 'Picked spot', route: 'Route', locFail: 'Could not get your location', est: 'Distances are estimates along car roads', searching: 'Searching…',
        baseL: '30-day plan starts from', baseArrive: 'Bus terminal (arrival)', baseHome: 'My home', baseArriveSub: 'Starts where the airport bus arrives and links places in order', baseHomeSub: 'Daily trips from {home}, with a leave time on visit days', baseNeed: 'Enter your address above or pick it on the map — then it switches to your home' }
};
export const hs = (lang) => (lang === 'ko' ? HS.ko : HS.en);

export default function HomePicker({ lang, home, onSet, onClear, onPickMap, onLocate, near, setNear }) {
  const t = hs(lang);
  const [q, setQ] = useState('');
  const [res, setRes] = useState(null);     // null = 검색 전, [] = 결과 없음
  const [busy, setBusy] = useState(false);
  const [edit, setEdit] = useState(!home);
  useEffect(() => { if (home) setEdit(false); }, [home && home.lat, home && home.lng]); // eslint-disable-line react-hooks/exhaustive-deps

  const search = async (e) => {
    e.preventDefault();
    const text = q.trim(); if (text.length < 2 || busy) return;
    setBusy(true);
    try { setRes(await geocode(text, lang)); } catch (err) { setRes([]); }
    setBusy(false);
  };
  const pick = (r) => { onSet({ lat: r.lat, lng: r.lng, label: r.label, near: !!r.near }); setRes(null); setQ(''); setEdit(false); };

  if (home && !edit) {
    return (
      <div className="hp hp-set">
        <span className="hp-ic"><Icon n="life" size={18} /></span>
        <div className="hp-txt"><small>{t.homeL}</small><b title={home.label}>{home.label || t.picked}</b>{home.near && <em>{t.nearOnly}</em>}</div>
        <button type="button" className="btn-t" onClick={() => setEdit(true)}>{t.change}</button>
        <button type="button" className="hp-x" aria-label={t.clear} title={t.clear} onClick={() => { onClear(); setEdit(true); }}><Icon n="close" size={16} /></button>
        <label className="hp-near"><input type="checkbox" checked={near} onChange={(e) => setNear(e.target.checked)} />{t.near}</label>
      </div>
    );
  }

  return (
    <div className="hp">
      <form className="hp-box" onSubmit={search}>
        <span className="hp-dot" aria-hidden="true" />
        <input value={q} onChange={(e) => { setQ(e.target.value); setRes(null); }} placeholder={t.homeP} aria-label={t.homeP} enterKeyHint="search" />
        {home && <button type="button" className="hp-x" aria-label={t.cancel} onClick={() => { setEdit(false); setRes(null); }}><Icon n="close" size={16} /></button>}
        <button type="submit" className="hp-go" aria-label={t.find} disabled={busy}><Icon n="search" size={19} /></button>
      </form>
      {res && (
        <ul className="hp-res">
          {busy && <li className="hp-none">{t.searching}</li>}
          {!res.length && <li className="hp-none">{t.none}</li>}
          {res.map((r, i) => (
            <li key={i}><button type="button" onClick={() => pick(r)}><Icon n="pin" size={16} /><span><b>{r.label}</b><small>{r.full}</small></span></button></li>
          ))}
        </ul>
      )}
      <div className="hp-alt">
        <button type="button" onClick={() => { setRes(null); onPickMap(); }}><Icon n="pin" size={15} />{t.onMap}</button>
        <button type="button" onClick={() => { setRes(null); onLocate(); }}><Icon n="globe" size={15} />{t.here}</button>
      </div>
      <p className="hp-note">{t.saved}</p>
    </div>
  );
}
