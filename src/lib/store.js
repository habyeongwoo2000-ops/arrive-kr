/* 이 브라우저에만 남기는 값. 개인정보 보호 모드 등에서 막히면 조용히 넘어갑니다. */
const P = 'arrive.';
export function get(k, d = null) { try { const v = localStorage.getItem(P + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
export function set(k, v) { try { localStorage.setItem(P + k, JSON.stringify(v)); } catch (e) { /* 막힌 저장소 */ } }
export function del(k) { try { localStorage.removeItem(P + k); } catch (e) { /* 막힌 저장소 */ } }

/* 사용자별 값 (로그인 안 하면 guest) — 화면을 옮기거나 새로고침·다른 앱에 다녀와도 그대로 */
export const uget = (who, k, d = null) => get('u.' + (who || 'guest') + '.' + k, d);
export const uset = (who, k, v) => set('u.' + (who || 'guest') + '.' + k, v);

/* 로그인 전에 해 둔 작업(guest)을 처음 로그인한 계정으로 옮겨 줍니다 (계정에 이미 있는 값은 그대로) */
export function adoptGuest(id) {
  if (!id || id === 'guest') return;
  try {
    const from = P + 'u.guest.', to = P + 'u.' + id + '.';
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith(from)) keys.push(k); }
    keys.forEach((k) => { const nk = to + k.slice(from.length); if (localStorage.getItem(nk) === null) localStorage.setItem(nk, localStorage.getItem(k)); });
  } catch (e) { /* 막힌 저장소 */ }
}
