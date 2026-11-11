/* "나의 원주 정착 30일" — 입국일·비자·필요한 것으로 날짜별 일정을 만듭니다.
   · 일정의 뼈대(어디에, 언제)는 이 규칙이 정하고, AI(Claude · Amazon Bedrock)는 각 일정의 설명만 그 사람 말로 다듬습니다.
     → AI가 없는 사업이나 틀린 전화번호를 지어내지 않게 하려는 것입니다.
   · 관공서 방문은 주말이면 다음 월요일로 옮깁니다. */

const DAY = 86400000;
const B = (ko, en) => ({ ko, en });
const addDays = (d, n) => new Date(d.getTime() + n * DAY);
const weekday = (d) => d.getDay();
const toWeekday = (d) => (weekday(d) === 6 ? addDays(d, 2) : weekday(d) === 0 ? addDays(d, 1) : d);
const diff = (a, b) => Math.round((a - b) / DAY);

/* 그달의 n번째 목요일 */
function nthThursday(y, m, n) { const f = new Date(y, m, 1); const off = (4 - f.getDay() + 7) % 7; return new Date(y, m, 1 + off + (n - 1) * 7); }
/* from 이후 첫 "둘째·넷째 목요일" (원주 이동출입국 운영일 안내 기준) */
export function nextMobileDay(from) {
  for (let k = 0; k < 4; k++) {
    const y = from.getFullYear(), m = from.getMonth() + k;
    for (const n of [2, 4]) { const d = nthThursday(y, m, n); if (d >= from) return d; }
  }
  return toWeekday(from);
}

export function buildPlan({ visa, needs = [], family, entry }) {
  const want = new Set(needs); if (family || visa === 'F-6') want.add('family');
  const s = [];
  const at = (off, office) => { const d = addDays(entry, off); return office ? toWeekday(d) : d; };
  const push = (o) => s.push(o);

  push({ id: 'arrive', date: at(0), icon: '🚌', place: 'terminal', kind: 'move',
    t: B('원주 도착 — 공항버스', 'Arrive in Wonju by airport bus'),
    n: B('인천공항 → 원주종합버스터미널, 약 2시간. 여권·사증·숙소 주소를 손에 들고 타세요.', 'Incheon Airport → Wonju Bus Terminal, about 2 hours. Keep your passport, visa and address at hand.') });

  if (visa === 'E-9' || visa === 'H-2') push({ id: 'edu', date: at(1), icon: '🎓', place: null, kind: 'duty',
    t: B('취업교육 16시간 + 건강진단', '16-hour employment training + health check'),
    n: B('입국 후 15일 안에 받습니다(E-9 비용은 사업주). 끝나면 회사로 이동합니다.', 'Within 15 days of entry (employer pays for E-9). You move to your workplace afterwards.') });

  push({ id: 'sos', date: at(2), icon: '☎', place: null, kind: 'call', tel: '1345',
    t: B('휴대폰에 도움 번호 저장', 'Save help numbers in your phone'),
    n: B('외국인종합안내 1345 · 외국인력상담 1644-0644 · 응급 119 · 경찰 112', 'Immigration 1345 · Worker help 1644-0644 · Emergency 119 · Police 112') });

  push({ id: 'center', date: at(3, true), icon: '🏢', place: 'cityhall', prog: 'w-center', kind: 'visit', tel: '033-737-2294',
    t: B('외국인주민지원센터 첫 상담', 'First visit: Foreign Residents Support Center'),
    n: B('노동·체류·생활 상담과 통역을 한곳에서. 한국어 수업 시간표도 받아 오세요.', 'Labor, visa and daily-life help with interpreters. Pick up the Korean class schedule.') });

  if (visa === 'E-8') push({ id: 'season', date: at(4, true), icon: '🌾', place: 'cityhall', prog: 'w-season', kind: 'call', tel: '033-737-4123',
    t: B('계절근로자 교통비·보험료 지원 확인', 'Check seasonal-worker travel & insurance support'),
    n: B('원주시 농업정책과에 고용 농가와 함께 확인합니다.', 'Confirm with the Wonju agriculture office together with your farm.') });

  if ((want.has('work') || want.has('life')) && ['E-9', 'H-2', 'E-7', 'E-7-4', 'F-6'].includes(visa)) push({ id: 'bus', date: at(5, true), icon: '🚍', place: 'munmak', prog: 'w-bus', kind: 'visit', tel: '033-743-2991',
    t: B('문막 상생 통근버스 노선 확인', 'Check the Munmak commuter bus'),
    n: B('차가 없어도 문막 산업단지로 출퇴근할 수 있어요. 쉼터 번호(070-7521-8097)도 함께 저장.', 'Get to the Munmak industrial complex without a car. Save the shelter number too (070-7521-8097).') });

  if (want.has('korean')) push({ id: 'korean', date: at(7, true), icon: '가', place: 'cityhall', prog: 'k-kiip', kind: 'visit',
    t: B('생활 한국어 · 사회통합프로그램 신청', 'Sign up for Korean classes & KIIP'),
    n: B('주중 야간·주말 반이 있어요. KIIP를 마치면 체류 심사에 도움이 됩니다.', 'Evening and weekend classes. Finishing KIIP helps in future visa reviews.') });

  if (visa === 'D-2' || visa === 'D-10' || want.has('study')) push({ id: 'campus', date: at(8, true), icon: '🎓', place: 'sangji', prog: 'g-student', kind: 'call', tel: '033-249-3717',
    t: B('유학생 취업·비자 상담 예약', 'Book student career & visa counseling'),
    n: B('강원도가 대학으로 찾아가 상담합니다. 시간제 취업 허가도 함께 물어보세요.', 'Gangwon counsels on campus. Ask about part-time work permission too.') });

  if (want.has('health')) push({ id: 'nhis', date: at(10, true), icon: '🏥', place: 'nhis', prog: 'w-nhis', kind: 'call', tel: '033-811-2000',
    t: B('건강보험 가입 확인', 'Check your health insurance'),
    n: B('회사 직장가입인지, 지역가입 대상인지 확인합니다. 보험이 안 되면 강원 의료비 90% 지원(033-249-3931).', 'Check whether your employer enrolled you. If uninsured, ask about Gangwon’s 90% medical support (033-249-3931).') });

  if (want.has('family') || want.has('child')) push({ id: 'family', date: at(12, true), icon: '👪', place: null, prog: 'w-family', kind: 'visit', url: 'https://wonju.familynet.or.kr',
    t: B('원주시가족센터 등록', 'Register at the Wonju Family Center'),
    n: B('통번역·방문교육·한국어 수업. 결혼이민자 멘토링은 1~2월에 모집합니다.', 'Interpreting, home-visit lessons, Korean classes. Peer mentoring recruits in Jan–Feb.') });

  const arcDay = nextMobileDay(at(14));
  push({ id: 'arc', date: arcDay, icon: '🪪', place: 'cityhall', prog: 'w-immig', kind: 'visit', tel: '1345',
    t: B('외국인등록 — 원주 이동출입국', 'Alien registration — mobile office in Wonju'),
    n: B('시청 1층, 둘째·넷째 목요일 안내 기준(운영일은 꼭 확인). 못 가면 춘천출입국·외국인사무소. 입국 90일 안이 기한입니다.', 'City Hall 1F, 2nd & 4th Thursdays as announced (confirm dates). Otherwise Chuncheon Immigration Office. Deadline: 90 days from entry.') });

  if (want.has('safety')) push({ id: 'safety', date: at(20, true), icon: '🦺', place: null, prog: 'g-safety', kind: 'call', tel: '033-249-3717',
    t: B('강원 외국인 안전교육 · 커뮤니티 신청', 'Gangwon safety training & community groups'),
    n: B('교통법규·산불·폭우·응급 대처. 2026년 새로 생긴 사업이에요.', 'Traffic rules, wildfires, heavy rain, emergencies. New in 2026.') });

  if (want.has('culture')) push({ id: 'culture', date: at(24), icon: '🎉', place: 'cityhall', prog: 'w-fest', kind: 'visit', tel: '033-737-2743',
    t: B('이웃 만나기 — 나라별 모임 · 세계문화축제', 'Meet neighbors — communities & the culture festival'),
    n: B('원주 세계문화축제는 매년 가을(9월)에 열립니다. 그 전에는 센터의 문화체험에 참여해 보세요.', 'The Wonju World Culture Festival is every autumn (September). Until then, join the center’s cultural programs.') });

  push({ id: 'check', date: at(30), icon: '✅', place: 'cityhall', kind: 'goal',
    t: B('정착 한 달 점검', 'One-month check'),
    n: B('외국인등록·보험·한국어 수업을 다시 확인하고, 다음 달 할 일을 정합니다.', 'Re-check registration, insurance and classes, and plan the next month.') });

  return s.sort((a, b) => a.date - b.date).map((x) => ({ ...x, day: diff(x.date, entry) }));
}

export const fmtDate = (d, lang) => {
  try { return new Intl.DateTimeFormat(lang === 'ko' ? 'ko-KR' : lang, { month: 'short', day: 'numeric', weekday: 'short' }).format(d); }
  catch (e) { return d.toDateString(); }
};
