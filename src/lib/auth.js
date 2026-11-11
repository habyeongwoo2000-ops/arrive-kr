/* 간단 로그인 (데모) — 서버 없이 이 브라우저에만 계정을 만듭니다.
   비밀번호는 그대로 저장하지 않고 PBKDF2(SHA-256, 120,000회) + 무작위 소금으로 바꿔 저장합니다.
   실제 운영에서는 Supabase Auth 같은 서버 로그인으로 바꾸세요(README 참고). */

import { get, set, del, stashGuest } from './store.js';

const ID_RE = /^[A-Za-z0-9_]{4,20}$/;
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function hash(pw, saltHex) {
  const enc = new TextEncoder();
  const salt = new Uint8Array(saltHex.match(/../g).map((h) => parseInt(h, 16)));
  const key = await crypto.subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 120000 }, key, 256);
  return hex(bits);
}

export function current() { return get('session', null); }

export async function signUp(id, pw, pw2) {
  if (!ID_RE.test(id)) return { error: 'eId' };
  if (String(pw).length < 8) return { error: 'ePw' };
  if (pw !== pw2) return { error: 'eMatch' };
  const users = get('users', {});
  if (users[id.toLowerCase()]) return { error: 'eExists' };
  const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
  users[id.toLowerCase()] = { id, salt, hash: await hash(pw, salt), at: new Date().toISOString() };
  set('users', users);
  set('session', id);
  return { id };
}

export async function signIn(id, pw) {
  const u = get('users', {})[String(id).toLowerCase()];
  if (!u || (await hash(pw, u.salt)) !== u.hash) return { error: 'eWrong' };
  set('session', u.id);
  return { id: u.id };
}

export function signOut() { del('session'); }

/* ── 간편 로그인 (구글 · 카카오) ──
   · 키·비밀값은 서버(.env.server)에만 있고, 서버(/api/auth)가 구글·카카오에 직접 확인한 뒤 아이디와 이름만 돌려줍니다.
   · 로그인한 뒤의 체크 기록·일정은 지금처럼 이 브라우저에 계정별로 저장됩니다. */
const post = (body) => fetch('/api/auth', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  .then((r) => r.json().then((j) => (r.ok ? j : { error: j.error || 'fail' }))).catch(() => ({ error: 'net' }));

let cfg = null;
export async function authConfig() { if (!cfg) cfg = await post({ action: 'config' }); return cfg; }

function socialDone(r) {
  if (!r || !r.id) return { error: r && r.error ? r.error : 'fail' };
  const users = get('users', {});
  users[r.id.toLowerCase()] = { id: r.id, social: r.id.split(':')[0], at: new Date().toISOString() };
  set('users', users);
  set('u.' + r.id + '.nick', r.name || r.id.split(':')[0]);
  set('session', r.id);
  return { id: r.id };
}

/* 구글: 화면의 구글 버튼이 준 확인증(credential)을 서버가 검증 */
export async function googleSignIn(credential) { return socialDone(await post({ action: 'google', credential })); }

/* 카카오: 카카오 로그인 화면으로 갔다가 돌아오면(?code=…) App 이 finishKakao 를 부릅니다 */
export async function startKakao() {
  const state = Math.random().toString(36).slice(2) + Date.now().toString(36);
  try { sessionStorage.setItem('arrive.kakaoState', state); } catch (e) { /* 무시 */ }
  const r = await post({ action: 'kakaoUrl', redirectUri: location.origin + '/', state });
  if (r.url) { stashGuest(); location.href = r.url; }   // 로그인 전 작업을 잠깐 맡겨 둠
  return r;
}
export async function finishKakao(code, state) {
  let ok = false; try { ok = sessionStorage.getItem('arrive.kakaoState') === state; sessionStorage.removeItem('arrive.kakaoState'); } catch (e) { /* 무시 */ }
  if (!ok) return { error: 'state' };
  return socialDone(await post({ action: 'kakao', code, redirectUri: location.origin + '/' }));
}

/* 화면에 보일 이름 (간편 로그인은 받은 이름) */
export function nickOf(id) { return id ? get('u.' + id + '.nick', id) : ''; }
