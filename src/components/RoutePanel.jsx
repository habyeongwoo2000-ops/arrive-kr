/* 왼쪽 경로 패널 — 구글 지도 길찾기처럼 출발 → 구간 → 도착
   구간마다 체크 항목과 "연료"(입국 예정일까지 남은 준비 기간) 게이지를 보여 줍니다. */

import { ui, tx, fill } from '../i18n/ui.js';

const DAY = 86400000;
const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const iso = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export function fuelOf(item, entry, today) {
  if (item.after !== undefined) return { kind: 'after', date: item.after ? iso(new Date(entry.getTime() + item.after * DAY)) : null };
  const due = new Date(entry.getTime() - item.lead * DAY);
  const left = Math.round((midnight(due) - midnight(today)) / DAY);
  const ratio = Math.max(0, Math.min(1, Math.round((midnight(entry) - midnight(today)) / DAY) / item.lead));
  const st = ratio >= 1 ? 'ok' : ratio >= 0.6 ? 'low' : 'out';
  return { kind: 'before', date: iso(due), left, ratio, st };
}

export default function RoutePanel({ lang, country, fromLabel, legs, extra, entry, setEntry, checks, toggle, activeLeg, onLeg, flying, onFly, info, arrive, onArrive }) {
  const t = ui(lang);
  const today = new Date();
  const all = legs.flatMap((l) => l.items);
  const done = all.filter((i) => checks[i.id]).length;
  const pending = all.filter((i) => !checks[i.id] && i.after === undefined).map((i) => fuelOf(i, entry, today));
  const sum = { ok: pending.filter((f) => f.st === 'ok').length, low: pending.filter((f) => f.st === 'low').length, out: pending.filter((f) => f.st === 'out').length };
  const K = lang === 'ko' ? 'ko' : 'en';
  /* 체크 항목에 붙는 나라별 목록: true = 접수 서류(extra), 'check' = 경찰·검진, 'exit' = 출국 허가 */
  const listOf = (k) => (k === true ? extra || [] : country && country[k] ? country[k][K] || [] : []);
  const tank = pending.length ? pending.reduce((a, f) => a + f.ratio, 0) / pending.length : 1;

  return (
    <div className="rp">
      <div className="rp-ends">
        <div className="rp-end"><i className="o" /><div><small>{t.from}</small><b>{fromLabel}</b></div></div>
        <div className="rp-end"><i className="d" /><div><small>{t.to}</small></div></div>
      </div>

      {info && <p className="rp-info">{info}</p>}
      {country && (
        <dl className="rp-meta">
          <div><dt>{t.agency}</dt><dd>{country.site ? <a href={country.site} target="_blank" rel="noopener noreferrer">{country.agency}</a> : country.agency}</dd></div>
          <div><dt>{t.fee}</dt><dd>{country.fee}</dd></div>
          {country.cost && <div><dt>{t.costL}</dt><dd>{country.cost[K]}</dd></div>}
          <div className={'lvl lvl-' + country.level}><dt>{t.source}</dt><dd>{t.lvl[country.level]} · {t.checked}</dd></div>
        </dl>
      )}

      <div className="rp-fuel">
        <label className="rp-date">
          <span>{t.entry}</span>
          <input type="date" value={iso(entry)} onChange={(e) => e.target.value && setEntry(new Date(e.target.value + 'T00:00:00'))} />
        </label>
        <div className="tank" title={t.fuelHelp} aria-label={t.fuel + ' ' + Math.round(tank * 100) + '%'}>
          <span className="tank-ic" aria-hidden="true">⛽</span>
          <div className="tank-bar"><i className={tank >= 1 ? 'ok' : tank >= 0.6 ? 'low' : 'out'} style={{ width: Math.round(tank * 100) + '%' }} /></div>
          <span className="tank-n">{Math.round(tank * 100)}%</span>
        </div>
        <p className="rp-sum"><span className="ok">● {t.fOk} {sum.ok}</span><span className="low">● {t.fLow} {sum.low}</span><span className="out">● {t.fOut} {sum.out}</span><span className="prog">{fill(t.progress, { done, total: all.length })}</span></p>
        <p className="rp-help">{t.fuelHelp}</p>
      </div>

      <button type="button" className="fly" onClick={onFly} disabled={flying}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" /></svg>
        {flying ? t.flying : t.fly}
      </button>

      <ol className="legs">
        {legs.map((l, li) => (
          <li key={l.key} className={'leg' + (li === activeLeg ? ' is-on' : '')} id={'leg-' + li}>
            <button type="button" className="leg-h" onClick={() => onLeg(li)}>
              <span className="leg-n">{li + 1}</span>
              <b>{tx(l.name, lang)}</b>
              <small>{l.items.filter((i) => checks[i.id]).length}/{l.items.length}</small>
            </button>
            <ul className="items">
              {l.items.map((it) => (
                <CheckItem key={it.id} it={it} lang={lang} entry={entry} today={today} checked={!!checks[it.id]} toggle={toggle}
                           list={it.country ? listOf(it.country) : null} country={country} />
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {arrive && (
        <button type="button" className="rp-arrive" onClick={onArrive}>
          <span className="rp-arrive-ic" aria-hidden="true">🛬</span>
          <span><b>{fill(t.arriveBtn, { n: arrive.total })}</b><small>{fill(t.progress, { done: arrive.done, total: arrive.total })} · {t.arriveSub}</small></span>
          <span aria-hidden="true">→</span>
        </button>
      )}
      <p className="rp-note">{t.note}</p>
    </div>
  );
}

/* 체크 항목 하나 — 경로 패널과 원주 정착 "도착 후 할 일" 탭이 함께 씁니다. */
export function CheckItem({ it, lang, entry, today, checked: ok, toggle, list, country, extraBtn }) {
  const t = ui(lang);
  const K = lang === 'ko' ? 'ko' : 'en';
  const f = fuelOf(it, entry, today);
  return (
    <li className={'item' + (ok ? ' is-done' : '')}>
      <label className="item-h">
        <input type="checkbox" checked={ok} onChange={() => toggle(it.id)} />
        <span>
          <b>{tx(it.t, lang)}</b>
          <em>{tx(it.d, lang)}</em>
          {list && (!list.length
            ? <span className="extra-none">{it.country === true ? t.extraNone : t.exitNone}</span>
            : (
              <>
                <ul className="extra">{list.map((x, i) => <li key={i}>{x}</li>)}</ul>
                {it.country === 'exit' && country && country.cost && <span className="extra-cost">💰 {t.costL}: {country.cost[K]}</span>}
                {it.country !== true && country && country.lv === 'summary' && <span className="extra-none">{t.lvNote}</span>}
              </>
            ))}
        </span>
      </label>
      {f.kind === 'before' ? (
        <div className={'gauge ' + (ok ? 'ok' : f.st)}>
          <div className="gauge-bar"><i style={{ width: (ok ? 100 : Math.round(f.ratio * 100)) + '%' }} /></div>
          <span>{ok ? '✓ ' + t.done : fill(t.due, { date: f.date }) + (f.left >= 0 ? ' · ' + fill(t.dleft, { n: f.left }) : ' · ' + t.fOut)}</span>
        </div>
      ) : (
        <div className="gauge after">
          <span>⏱ {it.after ? fill(t.after, { n: it.after }) + (f.date ? ' · ' + f.date : '') : t.afterAny}</span>
          {extraBtn}
        </div>
      )}
    </li>
  );
}
