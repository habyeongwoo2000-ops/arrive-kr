/* 살아있는 30일 일정 — 사용자의 조건(근무 요일·시간·교통)과 서류에서 찾은 할 일을 반영해 날짜를 다시 맞춥니다.
   · AI는 "조건이 무엇인지"만 알아듣고(JSON), 날짜를 옮기는 건 이 규칙이 합니다 → 관공서 휴일·마감일을 어기지 않게.
   · AI가 꺼져 있으면 parseRules() 가 간단한 문장을 직접 알아듣습니다. */
import { nextMobileDay } from './plan.js';

const DAY = 86400000;
const addDays = (d, n) => new Date(d.getTime() + n * DAY);
const diff = (a, b) => Math.round((a - b) / DAY);
export const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseYmd = (s) => { const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };

export const EMPTY = { off: [], offDates: [], time: null, move: null, shift: null };

/* 날짜를 옮기면 안 되는 일: 도착·집 이동·취업교육(회사가 정함)·전화 */
const FIXED = new Set(['arrive', 'home', 'edu']);
const movable = (s) => !FIXED.has(s.id) && s.kind !== 'call' && s.kind !== 'move';
const office = (s) => s.kind === 'visit' || s.kind === 'duty';

export function applyRules(steps, rules, entry) {
  const r = { ...EMPTY, ...(rules || {}) };
  const off = new Set(r.off || []); const offD = new Set(r.offDates || []);
  const ok = (d, s) => !(office(s) && (d.getDay() === 0 || d.getDay() === 6)) && !off.has(d.getDay()) && !offD.has(ymd(d));
  const out = steps.map((s) => {
    const base = { ...s, moved: null, conflict: false };
    if (!movable(s) || !s.date || ok(s.date, s)) return base;
    let d = null;
    if (s.id === 'arc') {
      let x = s.date;
      for (let k = 0; k < 8; k++) { x = nextMobileDay(addDays(x, 1)); if (ok(x, s)) { d = x; break; } }
    } else {
      for (let k = 1; k <= 14; k++) { const x = addDays(s.date, k); if (ok(x, s)) { d = x; break; } }
    }
    /* 마감일을 넘기면 앞쪽(입국일 이후)에서 찾기 */
    if (s.due && (!d || d > s.due)) {
      d = null;
      for (let x = addDays(s.due, 0); x >= entry; x = addDays(x, -1)) { if (ok(x, s)) { d = x; break; } }
    }
    if (!d) return { ...base, conflict: true };
    return { ...base, date: d, day: diff(d, entry), moved: s.day };
  });
  return out.sort((a, b) => a.date - b.date || (a.id === 'arrive' ? -1 : 0));
}

/* 서류에서 찾은 할 일 → 일정 한 칸 (마감 3일 전, 입국일보다 앞이면 입국 다음 날) */
export function docStep(item, i, entry) {
  const due = parseYmd(item.due);
  let date = due ? addDays(due, -3) : addDays(entry, 6 + i);
  if (date < addDays(entry, 1)) date = addDays(entry, 1);
  const kind = item.kind === 'call' ? 'call' : item.kind === 'online' ? 'goal' : 'visit';
  return {
    id: item.id, src: 'doc', date, day: diff(date, entry), due, icon: 'doc', kind,
    place: item.placeKey || (item.ll ? item.id : null), tel: item.tel || '', bring: item.bring || [], late: !!(due && due < entry), placeName: item.place && item.place.name,
    t: { ko: item.titleKo || item.title, en: item.title || item.titleKo },
    n: { ko: item.whatKo || item.what || '', en: item.what || item.whatKo || '' }
  };
}

/* ── AI 없이도 알아듣는 간단한 조건 문장 ── */
const WD_KO = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
const WD_EN = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
export function parseRules(text, prev = EMPTY, entry = new Date()) {
  const s = String(text || '');
  const r = { ...EMPTY, ...prev, off: [...(prev.off || [])], offDates: [...(prev.offDates || [])] };
  const add = (n) => { if (!r.off.includes(n)) r.off.push(n); };
  // "화·목", "화요일", "월수금" (숫자·글자 뒤의 '일'은 날짜·단어라서 빼요: 20일, 평일)
  for (const m of s.matchAll(/(?<![0-9가-힣])([월화수목금토일](?:[\s·,/와과및]*[월화수목금토일])*)(?=요일|\s*(?:은|는|엔|에|만|마다)?\s*(?:근무|야간|주간|안|못|바빠|출근|일해|일하))/g)) {
    for (const c of m[1].replace(/[^월화수목금토일]/g, '')) add(WD_KO[c]);
  }
  (s.toLowerCase().match(/\b(sun|mon|tue|wed|thu|fri|sat)[a-z]*/g) || []).forEach((w) => add(WD_EN[w.slice(0, 3)]));
  if (/주말(?!\s*(?:엔|에|은|는)?\s*(?:쉬|휴무|놀))|weekend(?!s?\s*(?:off|free))/i.test(s)) { add(0); add(6); }
  // "11월 20일", "11/20"
  for (const m of s.matchAll(/(\d{1,2})\s*(월|\/)\s*(\d{1,2})\s*일?/g)) {
    const mo = +m[1], da = +m[3]; if (mo < 1 || mo > 12 || da < 1 || da > 31) continue;
    let d = new Date(entry.getFullYear(), mo - 1, da); if (d < addDays(entry, -7)) d = new Date(entry.getFullYear() + 1, mo - 1, da);
    const k = ymd(d); if (!r.offDates.includes(k)) r.offDates.push(k);
  }
  if (/야간|밤|night/i.test(s)) { r.shift = 'night'; r.time = r.time || 'afternoon'; }
  else if (/주간|낮\s*근무|day\s*shift|9\s*시.*6\s*시|9-6/i.test(s)) { r.shift = 'day'; r.time = r.time || 'lunch'; }
  if (/오전|아침|morning/i.test(s)) r.time = 'morning';
  if (/오후|afternoon/i.test(s)) r.time = 'afternoon';
  if (/점심|lunch/i.test(s)) r.time = 'lunch';
  if (/차\s*(가\s*)?없|버스|대중교통|no car|by bus|bus/i.test(s)) r.move = 'bus';
  else if (/걸어|도보|walk/i.test(s)) r.move = 'walk';
  else if (/자전거|bike|bicycle/i.test(s)) r.move = 'bike';
  else if (/차\s*(가\s*)?있|운전|자가용|by car|drive/i.test(s)) r.move = 'car';
  return r;
}

/* 조건 → 짧은 칩 글자 */
const WK = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] };
export function ruleChips(r, lang) {
  const ko = lang === 'ko'; const L = ko ? WK.ko : WK.en; const c = [];
  if (r.off && r.off.length) c.push({ k: 'off', t: (ko ? '못 가는 날 ' : 'Busy ') + [...r.off].sort().map((x) => L[x]).join('·') });
  if (r.offDates && r.offDates.length) c.push({ k: 'offDates', t: (ko ? '빼는 날 ' : 'Skip ') + r.offDates.map((x) => x.slice(5).replace('-', '/')).join(', ') });
  if (r.shift) c.push({ k: 'shift', t: ko ? (r.shift === 'night' ? '야간 근무' : '주간 근무') : (r.shift === 'night' ? 'Night shift' : 'Day shift') });
  if (r.time) c.push({ k: 'time', t: ko ? { morning: '오전에 방문', afternoon: '오후에 방문', lunch: '점심시간 방문', evening: '저녁 이후' }[r.time] : { morning: 'Visit mornings', afternoon: 'Visit afternoons', lunch: 'Lunch-hour visits', evening: 'After evening' }[r.time] });
  if (r.move) c.push({ k: 'move', t: ko ? { bus: '버스로 이동', walk: '걸어서', bike: '자전거', car: '차로 이동' }[r.move] : { bus: 'By bus', walk: 'On foot', bike: 'By bike', car: 'By car' }[r.move] });
  return c;
}
export const hasRules = (r) => !!(r && ((r.off && r.off.length) || (r.offDates && r.offDates.length) || r.time || r.move || r.shift));

/* 방문 시각: 조건에 맞춰 도착 목표 시간 (분) */
export const targetMin = (r) => (r && r.time === 'afternoon' ? 14 * 60 : r && r.time === 'lunch' ? 12 * 60 + 10 : r && r.time === 'evening' ? 17 * 60 : 9 * 60);
/* 이동 시간(분): 차 시간 기준으로 교통수단별 어림 */
export function travelMin(d, move) {
  if (!d) return 0;
  const car = d.s / 60;
  if (move === 'car') return Math.round(car + 5);
  if (move === 'walk') return Math.round(d.m / 70);
  if (move === 'bike') return Math.round(d.m / 230);
  return Math.round(car * 1.6 + 10);          // 버스(기본)
}
