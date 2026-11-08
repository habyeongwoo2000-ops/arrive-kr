/* 간단 로그인 (데모) — 서버 없이 이 브라우저에만 계정을 만듭니다.
   비밀번호는 그대로 저장하지 않고 PBKDF2(SHA-256, 120,000회) + 무작위 소금으로 바꿔 저장합니다.
   실제 운영에서는 Supabase Auth 같은 서버 로그인으로 바꾸세요(README 참고). */

import { get, set, del } from './store.js';

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
