/* (E9-Bridge 에서 옮김) 사업장 변경 기한 · 출국 정산 · 출국만기보험 계산 — E9-Bridge(assets/app.js)의 규칙을 그대로 옮겼습니다.
   · 사업장 변경 신청: 근로계약이 끝난 날부터 1개월
   · 새 직장 구하기: 변경을 신청한 날(신청 전이면 신청 마감일)부터 3개월
   · 출국예정신고: 출국 예정일 1개월 전 · 보험금 지급 신청: 출국 예정일 7일 전
   · 출국만기보험: 회사가 매달 통상임금의 8.3%(1/12)를 넣음 · 한 사업장 1년 이상 · 법정 퇴직금(1년에 30일분)과 차액은 회사가 지급 */

export const INS_RATE = 1 / 12;
export const INS_MIN_DAYS = 365;

export function addMonths(d, n) {
  const t = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
  t.setDate(Math.min(d.getDate(), last));
  return t;
}
export const midnight = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const today = () => midnight(new Date());
export const diffDays = (a, b) => Math.round((midnight(a) - midnight(b)) / 86400000);
export const fmt = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
export const parse = (v) => (v ? midnight(new Date(v + 'T00:00:00')) : null);

/* 마감일 옆 요일 — 고용센터는 주말에 닫으므로 요일이 중요합니다. 브라우저가 모르는 언어(크메르어·네팔어)는 번역 파일의 요일 이름 */
export function weekday(d, lang, names) {
  let known = true;
  try { known = !Intl.DateTimeFormat.supportedLocalesOf || Intl.DateTimeFormat.supportedLocalesOf([lang]).length > 0; } catch (e) { known = false; }
  if (!known && names && names.length === 7) return names[d.getDay()];
  try { return new Intl.DateTimeFormat(lang, { weekday: 'long' }).format(d); } catch (e) { return ''; }
}
export const fmtDay = (d, lang, names) => { const w = weekday(d, lang, names); return w ? fmt(d) + ' (' + w + ')' : fmt(d); };

/* 기한 계산 */
export function deadline(leaveV, applyV, now = today()) {
  const leave = parse(leaveV);
  if (!leave) return null;
  if (leave > now) return { bad: true };
  const applyDue = addMonths(leave, 1);
  const applied = parse(applyV);
  const jobDue = addMonths(applied || applyDue, 3);
  const applyDays = diffDays(applyDue, now), jobDays = diffDays(jobDue, now);
  const span = diffDays(jobDue, leave) || 1;
  const pos = Math.max(0, Math.min(100, (diffDays(now, leave) / span) * 100));
  return { leave, applyDue, applied, jobDue, applyDays, jobDays, pos };
}

/* 출국 예정일 → 신고·청구 기한 */
export function payout(exitV, now = today()) {
  const exit = parse(exitV);
  if (!exit) return null;
  const reportDue = addMonths(exit, -1);
  const claimDue = new Date(exit.getFullYear(), exit.getMonth(), exit.getDate() - 7);
  return { exit, reportDue, claimDue, reportDays: diffDays(reportDue, now), claimDays: diffDays(claimDue, now) };
}

/* 쌓인 보험료 ≈ 월 통상임금 × 8.3% × 일한 달 수 / 법정 퇴직금 ≈ 30일분 임금 × (재직일수 / 365) */
export function insurance(wage, startV, endV, now = today()) {
  const w = parseFloat(wage);
  const start = parse(startV);
  if (!isFinite(w) || w <= 0 || !start) return null;
  const end = parse(endV) || now;
  if (end <= start) return { bad: true };
  const days = diffDays(end, start);
  const saved = w * INS_RATE * (days / 30.4375);
  const legal = w * (days / 365);
  const years = Math.floor(days / 365);
  const months = Math.floor((days - years * 365) / 30);
  return {
    days, years, months, saved, legal, gap: legal - saved,
    joinDue: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 15),
    eligible: new Date(start.getFullYear() + 1, start.getMonth(), start.getDate()),
    short: days < INS_MIN_DAYS ? INS_MIN_DAYS - days : 0
  };
}

/* 카드 색: 지남·오늘 = stop, 7일 이내 = warn, 그 밖 = ok */
export const tone = (days) => (days <= 0 ? 'is-stop' : days <= 7 ? 'is-warn' : 'is-ok');
