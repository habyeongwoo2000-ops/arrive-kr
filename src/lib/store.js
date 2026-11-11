/* 이 브라우저에만 남기는 값. 개인정보 보호 모드 등에서 막히면 조용히 넘어갑니다.
   로그인한 사람의 작업(u.<아이디>.…)만 기기에 저장합니다.
   로그인하지 않은 사람(guest)의 작업은 메모리에만 두어, 새로고침하면 처음 화면(탑승권)부터 다시 시작합니다. */
const P = 'arrive.';
const GUEST = 'u.guest.';
const STASH = P + 'guestStash';
const mem = new Map();                                     // guest 작업 (새로고침하면 사라짐)
const isGuest = (k) => k.startsWith(GUEST) || k === 'home';  // 'home' = 계정별 저장 전에 쓰던 집 주소

/* 예전 버전이 기기에 남긴 guest 작업은 지웁니다 */
try {
  const old = [];
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && (k.startsWith(P + GUEST) || k === P + 'home')) old.push(k); }
  ['plan.extras.v1', 'plan.rules.v1'].forEach((k) => old.push(k));
  old.forEach((k) => localStorage.removeItem(k));
} catch (e) { /* 막힌 저장소 */ }

/* 카카오 로그인은 다른 사이트에 다녀오므로, 가기 직전 guest 작업을 잠깐 맡겨 두었다가 돌아오면 되찾습니다 */
try {
  const s = sessionStorage.getItem(STASH);
  sessionStorage.removeItem(STASH);
  const q = new URLSearchParams(location.search);
  if (s && q.get('code') && q.get('state')) Object.entries(JSON.parse(s)).forEach(([k, v]) => mem.set(k, v));
} catch (e) { /* 무시 */ }
export function stashGuest() {
  try { sessionStorage.setItem(STASH, JSON.stringify(Object.fromEntries(mem))); } catch (e) { /* 무시 */ }
}

export function get(k, d = null) {
  if (isGuest(k)) return mem.has(k) ? JSON.parse(mem.get(k)) : d;
  try { const v = localStorage.getItem(P + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
}
export function set(k, v) {
  if (isGuest(k)) { mem.set(k, JSON.stringify(v)); return; }
  try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* 막힌 저장소 */ }
}
export function del(k) {
  if (isGuest(k)) { mem.delete(k); return; }
  try { localStorage.removeItem(P + k); } catch (e) { /* 막힌 저장소 */ }
}

/* 사용자별 값 — 로그인하면 화면을 옮기거나 새로고침·다른 앱에 다녀와도 그대로 (guest 는 이번 방문 동안만) */
export const uget = (who, k, d = null) => get('u.' + (who || 'guest') + '.' + k, d);
export const uset = (who, k, v) => set('u.' + (who || 'guest') + '.' + k, v);

/* 로그인 전에 해 둔 작업(guest)을 로그인한 계정으로 옮겨 줍니다 (계정에 이미 있는 값은 그대로).
   옮긴 뒤 guest 작업은 비워서, 로그아웃하면 깨끗한 처음 상태가 됩니다. */
export function adoptGuest(id) {
  if (!id || id === 'guest') return;
  const to = 'u.' + id + '.';
  mem.forEach((v, k) => {
    if (!k.startsWith(GUEST)) return;
    const nk = to + k.slice(GUEST.length);
    try { if (localStorage.getItem(P + nk) === null) localStorage.setItem(P + nk, v); } catch (e) { /* 막힌 저장소 */ }
  });
  mem.clear();
}
