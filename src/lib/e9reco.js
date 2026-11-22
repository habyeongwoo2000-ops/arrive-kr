/* 맞춤 지원 추천 엔진 (규칙 기반) — E9-Bridge lib/reco.js 를 그대로 옮김
   ------------------------------------------------------------------
   · 데이터는 최신 제도(data/notices.js) 179건을 그대로 씁니다. 항목을 따로 적지 않고
     제목·내용(한국어)에서 분야·시군구·업종·전화번호를 읽어 냅니다.
     → 팀원이 notices.js 에 새 지원사업을 넣으면 추천에도 바로 나옵니다.
   · AI 가 아니라 정해진 규칙으로 점수를 매기고, 왜 그런 점수인지(근거)를 함께 돌려줍니다.
     (PRD 1.3: 판정은 규칙 엔진, AI 는 읽고 정리만)
   · 조례 제정·고용 한도 같은 "정책 소식"은 사람이 신청하는 사업이 아니라서 추천에서 뺍니다.
   ------------------------------------------------------------------ */

import NOTICES from '../data/e9notices.js';
import { SIGUNGU } from '../data/sigungu.js';
import { fmt, today, parse as asDay, diffDays } from './e9calc.js';

/* 이 기기에만 남기는 값 (E9-Bridge 와 같은 이름에 ak. 를 붙임) */
const load = (k) => { try { return localStorage.getItem('ak.e9.' + k); } catch (e) { return null; } };
const save = (k, v) => { try { localStorage.setItem('ak.e9.' + k, v); } catch (e) { /* 막힌 저장소 */ } };

/* ---------- 프로필에서 고를 수 있는 값 ---------- */
export const SIDO = ['seoul', 'busan', 'daegu', 'incheon', 'daejeon', 'ulsan', 'sejong',
  'gyeonggi', 'gangwon', 'chungbuk', 'chungnam', 'jeonbuk', 'jeonnamgwangju', 'gyeongbuk', 'gyeongnam', 'jeju'];
export const INDUSTRIES = ['manu', 'agri', 'fish', 'build', 'service'];
export const STAYS = ['lt1', 'y1to4', 'y4plus'];
export const SITUATIONS = ['change', 'wage', 'hurt', 'housing', 'stay', 'return'];
export const CATS = ['counsel', 'korean', 'medical', 'shelter', 'emergency', 'visa', 'job', 'safety', 'life'];

/* ---------- 분야 읽어 내기 (한국어 제목 + 내용) ---------- */
const CAT_RULES = [
  ['counsel', /상담|노무|법률|고충|통번역|통역|콜센터|상담전화|민원/],
  ['korean', /한국어|한글|TOPIK|사회통합프로그램|KIIP|마을학당/],
  ['medical', /진료|의료|건강검진|결핵|병원|진료비/],
  ['shelter', /쉼터|숙소|기숙사|임대주택|숙식|주거/],
  ['emergency', /긴급|구호|생계비|장제비/],
  ['visa', /E-7-4|E74|비자|숙련기능/],
  ['job', /직무|기술교육|자격증|용접|운전면허|정비|취업역량|직업능력|정보화/],
  ['safety', /안전|보험|산재|119|작업중지/],
  ['life', /생활|가이드북|커뮤니티|문화|급식|사랑방|정착|웹사이트|챗봇|앱/]
];

/* 업종이 정해진 사업 (그 업종이 아니면 맞지 않음) */
const IND_RULES = [
  ['build', /건설/],
  ['fish', /어선|어업|어선원/],
  ['agri', /농축|농업|곡물|농축어업/],
  ['manu', /뿌리산업|조선|제조업/]
];

/* 사람이 신청하는 사업이 아닌 소식 */
const POLICY_ONLY = /조례|설치 근거|운영 기관 선정|캠페인|개소$/;
/* 아직 시행되지 않은 제도(개선 추진·예정·논의 중·입법예고)는 추천하지 않습니다. */
const NOT_YET = /추진|예정|논의|입법예고|개정안|검토/;

/* 전국 제도 가운데 근로자가 직접 쓸 수 있는 것만 골라 둡니다(나머지는 정책 소식).
   cats·sit·ind 는 위 규칙으로 못 읽는 부분을 손으로 보탭니다.
   from: 시행일 — 그날이 되기 전에는 추천하지 않고, 지나면 저절로 추천에 나옵니다.
   planned: 시행일이 정해지지 않은 개선 추진안 — 추천하지 않습니다. */
const NATIONAL = {
  'n-no-report-2025': { cats: ['counsel'], sit: ['wage'] },
  'n-wage-guarantee-2026': { cats: ['counsel'], sit: ['wage'] },
  'n-osh-workstop-2026': { cats: ['safety'], sit: ['hurt'], from: '2027-01-28' },
  'n-safety-edu-2026': { cats: ['safety'], from: '2027-01-08' },
  'n-housing-law-2026': { cats: ['shelter'], sit: ['housing'], from: '2026-12-10' },
  'n-annual-leave-2026': { cats: ['counsel'], from: '2027-06-10' },
  'n-kiip-decree-2026': { cats: ['korean', 'visa'], sit: ['stay'] },
  'n-e74-reform-2026': { cats: ['visa'], sit: ['stay'], planned: true },
  'n-e74-farm-2026': { cats: ['visa'], sit: ['stay'], ind: ['agri', 'fish'] },
  'n-construction-2026': { cats: ['counsel'], sit: ['change'], ind: ['build'] }
};

/* 제목만으로 시·군·구를 못 읽는 항목 */
const CITY_EXTRA = {
  'l-chungnam-shelter-2026': ['천안시', '당진시'],
  'l-jg-girc-2026': ['광산구'],
  'l-daegu-e74r-2026': ['서구', '남구'],
  'l-daegu-center-2026': ['달성군']
};
/* 제목 첫 낱말이 시·군 이름에서 "시/군"이 빠진 경우 */
const CITY_STEM = { 구미: '구미시', 경산: '경산시', 경주: '경주시', 칠곡: '칠곡군', 포항: '포항시', 성주: '성주군',
  김해: '김해시', 함안: '함안군', 거제: '거제시', 밀양: '밀양시', 속초: '속초시', 광주: '광주' };
/* 데이터의 이름 → 시·군·구 목록(data/sigungu.js)의 이름.
   '광주'는 광주의 구 전체(광주 동구·서구·남구·북구·광산구)를 뜻합니다. */
const CITY_CANON = { jeonnamgwangju: { 광산구: '광주 광산구' } };
const canonCity = (region, c) => (CITY_CANON[region] && CITY_CANON[region][c]) || c;
/* 사업이 열리는 곳(c)이 내가 고른 시·군·구(mine)에 해당하는지 */
export const cityHits = (c, mine) => c === mine || mine.indexOf(c + ' ') === 0;
const SIDO_KO = ['서울', '부산', '대구', '인천', '광주', '대전', '울산', '세종', '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'];
const SIGUNGU_RE = /^[가-힣]+(시|군|구)$/;

function citiesOf(n) {
  if (CITY_EXTRA[n.key]) return CITY_EXTRA[n.key];
  if (!n.region) return [];
  const t = n.ko.title.split(/\s+/);
  if (SIGUNGU_RE.test(t[0]) && SIDO_KO.indexOf(t[0]) === -1) return [t[0]];
  if (SIDO_KO.indexOf(t[0]) !== -1 && SIGUNGU_RE.test(t[1] || '')) return [t[1]];
  if (CITY_STEM[t[0]] && !(t[0] === '광주' && n.region !== 'jeonnamgwangju')) return [CITY_STEM[t[0]]];
  return [];
}

const PHONE = /(?:^|[^\d])(1\d{3}-\d{4}|0\d{1,2}-\d{3,4}-\d{4}|13[45]\d)(?![\d-])/g;

function metaOf(n, nowStr) {
  const text = n.ko.title + ' ' + (n.ko.points || []).join(' ');
  const nat = NATIONAL[n.key];
  if (!n.region && !nat) return null;                         // 전국 정책 소식
  if (nat && (nat.planned || (nat.from && nat.from > nowStr))) return null;   // 아직 시행 전
  if (NOT_YET.test(n.ko.title)) return null;                  // 제목에 추진·예정·논의 중
  if (n.region && POLICY_ONLY.test(n.ko.title)) return null;   // 조례·개소 소식
  const cats = new Set(nat ? nat.cats : []);
  /* 제목에서 먼저 읽고, 제목만으로 모르면 내용까지 봅니다(내용은 곁가지 설명이 많아 분야가 부풀기 쉽습니다). */
  for (const [c, re] of CAT_RULES) if (re.test(n.ko.title)) cats.add(c);
  if (!cats.size && !nat) for (const [c, re] of CAT_RULES) if (re.test(text)) cats.add(c);
  if (!cats.size) cats.add('life');
  const ind = new Set(nat && nat.ind ? nat.ind : []);
  if (!nat) for (const [c, re] of IND_RULES) if (re.test(n.ko.title)) ind.add(c);
  const phones = [];
  let m;
  PHONE.lastIndex = 0;
  while ((m = PHONE.exec(text))) if (phones.indexOf(m[1]) === -1) phones.push(m[1]);
  return {
    n, key: n.key, region: n.region || '', cities: citiesOf(n).map((c) => canonCity(n.region, c)),
    cats: [...cats], ind: [...ind], sit: (nat && nat.sit) || [], phones
  };
}

/* 프로그램 목록은 한 번만 만듭니다. */
const TODAY = fmt(today());
export const PROGRAMS = NOTICES.map((n) => metaOf(n, TODAY)).filter(Boolean);

/* 프로필 고르기 상자용: 시·도마다 시·군·구 전체(가나다순). 광주의 구는 앞에 모아 둡니다. */
export const CITIES = Object.fromEntries(Object.entries(SIGUNGU).map(([k, list]) => [k,
  list.slice().sort((a, b) => (b.indexOf('광주 ') === 0) - (a.indexOf('광주 ') === 0) || a.localeCompare(b, 'ko'))]));
/* 시·군·구마다 그곳에서 열리는 사업 수 (고르기 상자에 함께 보여 줍니다) */
export const CITY_COUNT = PROGRAMS.reduce((acc, p) => {
  if (!p.region) return acc;
  const m = acc[p.region] || (acc[p.region] = {});
  for (const name of CITIES[p.region] || []) if (p.cities.some((c) => cityHits(c, name))) m[name] = (m[name] || 0) + 1;
  return acc;
}, {});

/* ---------- 상황 → 더 챙길 분야 ---------- */
const SIT_CATS = {
  change: ['counsel', 'shelter', 'job'],
  wage: ['counsel', 'emergency'],
  hurt: ['medical', 'emergency', 'safety'],
  housing: ['shelter'],
  stay: ['visa', 'korean'],
  return: ['counsel', 'job']
};

/* ---------- 점수와 근거 ----------
   reasons: [{ t:'ok'|'warn'|'no', k:'문장 키', v:{…} }] — 화면이 언어에 맞게 문장을 만듭니다. */
export function scoreProgram(p, profile, now = today()) {
  const pr = profile || {};
  const reasons = [];
  let score = 10;

  // 1) 지역 — 다른 시·도 사업은 아예 뺍니다.
  if (p.region) {
    if (!pr.sido) reasons.push({ t: 'warn', k: 'rsRegionUnknown', v: { sido: p.region } });
    else if (pr.sido !== p.region) return null;
    else if (!p.cities.length) { score += 20; reasons.push({ t: 'ok', k: 'rsSido', v: { sido: p.region } }); }
    else if (pr.city && p.cities.some((c) => cityHits(c, pr.city))) {
      score += 40; reasons.push({ t: 'ok', k: 'rsCity', v: { city: pr.city } });
    } else {
      score -= 10; reasons.push({ t: 'warn', k: 'rsOtherCity', v: { city: p.cities.join('·') } });
    }
  } else {
    score += 10; reasons.push({ t: 'ok', k: 'rsNation', v: {} });
  }

  // 2) 관심 분야
  const needs = pr.needs || [];
  const hitNeeds = p.cats.filter((c) => needs.indexOf(c) !== -1);
  if (hitNeeds.length) { score += 30; reasons.push({ t: 'ok', k: 'rsNeed', v: { cats: hitNeeds } }); }

  // 3) 지금 상황
  const sits = pr.sits || [];
  const hitSit = sits.filter((s) => p.sit.indexOf(s) !== -1 || SIT_CATS[s].some((c) => p.cats.indexOf(c) !== -1));
  if (hitSit.length) { score += 25; reasons.push({ t: 'ok', k: 'rsSit', v: { sits: hitSit } }); }

  // 4) 업종
  if (p.ind.length) {
    if (!pr.ind) reasons.push({ t: 'warn', k: 'rsIndUnknown', v: { ind: p.ind } });
    else if (p.ind.indexOf(pr.ind) !== -1) { score += 15; reasons.push({ t: 'ok', k: 'rsInd', v: { ind: [pr.ind] } }); }
    else { score -= 40; reasons.push({ t: 'no', k: 'rsIndNo', v: { ind: p.ind } }); }
  }

  // 5) 체류 기간 — 숙련기능인력(E-7-4) 전환은 보통 E-9 등으로 4년 이상 일한 사람이 대상입니다.
  if (p.cats.indexOf('visa') !== -1) {
    if (pr.stay === 'y4plus') { score += 10; reasons.push({ t: 'ok', k: 'rsStayOk', v: {} }); }
    else if (pr.stay) { score -= 30; reasons.push({ t: 'no', k: 'rsStayNo', v: {} }); }
    else reasons.push({ t: 'warn', k: 'rsStayUnknown', v: {} });
  }

  // 6) 마감·새 소식
  const nowStr = fmt(now);
  if (p.n.until) {
    if (p.n.until < nowStr) return null;
    const left = diffDays(asDay(p.n.until), now);
    if (left <= 14) { score += 10; reasons.push({ t: 'warn', k: 'rsDeadline', v: { days: left, until: p.n.until } }); }
  }
  if (p.n.date && diffDays(now, asDay(p.n.date)) <= 30) score += 5;

  return { p, score: Math.max(0, Math.min(100, score)), reasons, fit: !reasons.some((r) => r.t === 'no') };
}

/* 추천 목록 — 맞는 것 먼저, 그다음 점수, 그다음 최신 */
export function recommend(profile, now = today()) {
  return PROGRAMS.map((p) => scoreProgram(p, profile, now)).filter(Boolean)
    .sort((a, b) => (b.fit - a.fit) || (b.score - a.score) || String(b.p.n.date).localeCompare(String(a.p.n.date)));
}

/* 지도용: 시·도마다 (지역 조건을 빼고) 내 조건에 맞는 사업 수 */
export function countBySido(profile) {
  const out = {};
  for (const sido of SIDO) {
    const pr = Object.assign({}, profile, { sido, city: '' });
    out[sido] = PROGRAMS.filter((p) => p.region === sido)
      .map((p) => scoreProgram(p, pr)).filter((r) => r && r.fit).length;
  }
  return out;
}

/* ---------- 프로필 저장 (이 기기) ---------- */
export function cleanProfile(v) {
  const o = v && typeof v === 'object' ? v : {};
  const one = (x, list) => (list.indexOf(x) !== -1 ? x : '');
  const many = (x, list) => (Array.isArray(x) ? x.filter((y) => list.indexOf(y) !== -1) : []);
  const sido = one(o.sido, SIDO);
  const city = sido && typeof o.city === 'string' && (CITIES[sido] || []).indexOf(o.city) !== -1 ? o.city : '';
  return { sido, city, ind: one(o.ind, INDUSTRIES), stay: one(o.stay, STAYS),
    sits: many(o.sits, SITUATIONS), needs: many(o.needs, CATS) };
}
export function loadProfile() {
  try { return cleanProfile(JSON.parse(load('recoProfile') || 'null')); } catch (e) { return cleanProfile(null); }
}
export function saveProfile(p) { save('recoProfile', JSON.stringify(cleanProfile(p))); }
export function profileFilled(p) { return !!(p && p.sido); }

/* ---------- 알림: 마감 임박 · 새로 생긴 사업 ----------
   "새로 생김" = 지난번에 이 화면을 열었을 때 목록에 없던 사업(처음이면 30일 안에 발표된 것). */
export function alertsOf(list, now = today()) {
  let seen = null;
  try { seen = JSON.parse(load('recoSeen') || 'null'); } catch (e) { seen = null; }
  const nowStr = fmt(now);
  const soon = list.filter((r) => r.fit && r.p.n.until && r.p.n.until >= nowStr && diffDays(asDay(r.p.n.until), now) <= 14);
  const fresh = list.filter((r) => r.fit && (Array.isArray(seen)
    ? seen.indexOf(r.p.key) === -1
    : r.p.n.date && diffDays(now, asDay(r.p.n.date)) <= 30));
  return { soon, fresh };
}
export function markSeen(list) { save('recoSeen', JSON.stringify(list.map((r) => r.p.key))); }

/* ---------- 신청 준비 체크리스트 ----------
   서류는 "가져가면 좋은 것"입니다. 사업마다 꼭 필요한 서류는 원문 공고나 전화로 확인하게 안내합니다. */
const DOCS_BY_CAT = {
  counsel: ['docContract', 'docPayslip', 'docTime'],
  medical: ['docInsurance'],
  emergency: ['docProof', 'docBank'],
  visa: ['docTopik', 'docCareer'],
  shelter: ['docChange'],
  job: [],
  korean: [],
  safety: [],
  life: []
};
export function checklistOf(p) {
  const docs = ['docArc', 'docPassport'];
  for (const c of p.cats) for (const d of DOCS_BY_CAT[c] || []) if (docs.indexOf(d) === -1) docs.push(d);
  return { docs, steps: ['stCall', 'stDocs', 'stVisit', 'stRecord'] };
}

/* 신청 현황(관심 → 신청함 → 받음)과 체크한 서류 — 이 기기에만 남깁니다. */
export const STATUSES = ['', 'want', 'applied', 'got'];
export function loadTrack() {
  try { const v = JSON.parse(load('recoTrack') || '{}'); return v && typeof v === 'object' ? v : {}; } catch (e) { return {}; }
}
export function saveTrack(t) { save('recoTrack', JSON.stringify(t)); }

/* 지도에서 찾기 — 한국어 이름으로 네이버 지도 검색을 엽니다(좌표를 직접 갖고 있지 않습니다). */
export function mapSearchUrl(p) {
  const q = (p.cities[0] && p.n.ko.title.indexOf(p.cities[0]) === -1 ? p.cities[0] + ' ' : '') + p.n.ko.title.replace(/\(.*?\)/g, '').trim();
  return 'https://map.naver.com/p/search/' + encodeURIComponent(q);
}

/* 내 위치 → 가장 가까운 시·도 (대략적인 중심 좌표) */
const SIDO_CENTER = {
  seoul: [37.56, 126.98], busan: [35.18, 129.07], daegu: [35.87, 128.60], incheon: [37.46, 126.70],
  daejeon: [36.35, 127.38], ulsan: [35.54, 129.31], sejong: [36.48, 127.29], gyeonggi: [37.40, 127.20],
  gangwon: [37.75, 128.25], chungbuk: [36.80, 127.70], chungnam: [36.55, 126.85], jeonbuk: [35.75, 127.10],
  jeonnamgwangju: [34.90, 126.90], gyeongbuk: [36.40, 128.75], gyeongnam: [35.30, 128.30], jeju: [33.40, 126.55]
};
export function nearestSido(lat, lng) {
  let best = '', d = Infinity;
  for (const [k, [a, b]] of Object.entries(SIDO_CENTER)) {
    const x = (a - lat) ** 2 + ((b - lng) * Math.cos(lat * Math.PI / 180)) ** 2;
    if (x < d) { d = x; best = k; }
  }
  return best;
}
