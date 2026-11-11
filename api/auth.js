/* POST /api/auth — 구글 · 카카오 간편 로그인 확인 (대회 서버)
   { action:'config' }                         → { google: '클라이언트 ID' | null, kakao: true|false }
   { action:'google', credential }             → { id:'google:…', name }   (구글 확인증을 구글 서버에서 검증)
   { action:'kakaoUrl', redirectUri, state }   → { url }                    (카카오 로그인 화면 주소)
   { action:'kakao', code, redirectUri }       → { id:'kakao:…', name }     (받은 code 로 카카오에 확인)
   · 키는 서버의 .env.server 에만: GOOGLE_CLIENT_ID · KAKAO_REST_KEY · (선택) KAKAO_CLIENT_SECRET
   · 이메일·전화번호 같은 개인정보는 받지도 저장하지도 않습니다 (아이디 번호와 이름만). */
import { limited, clean, body } from './_ai.js';

const okRedirect = (u) => /^https:\/\/[a-z0-9.-]+\/$/i.test(u || '') || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/$/.test(u || '');
const json = async (r) => { try { return await r.json(); } catch (e) { return {}; } };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (limited(req, 30)) return res.status(429).json({ error: 'rate' });
  const b = body(req);
  const G = process.env.GOOGLE_CLIENT_ID || '', K = process.env.KAKAO_REST_KEY || '', KS = process.env.KAKAO_CLIENT_SECRET || '';

  try {
    if (b.action === 'config') return res.status(200).json({ google: G || null, kakao: !!K });

    if (b.action === 'google') {
      if (!G) return res.status(501).json({ error: 'off' });
      const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(String(b.credential || '').slice(0, 4000)));
      const t = await json(r);
      if (!r.ok || t.aud !== G || !t.sub || !/accounts\.google\.com$/.test(t.iss || '')) return res.status(401).json({ error: 'google' });
      return res.status(200).json({ id: 'google:' + clean(t.sub, 40), name: clean(t.name || t.given_name || 'Google', 30) });
    }

    if (b.action === 'kakaoUrl') {
      if (!K) return res.status(501).json({ error: 'off' });
      if (!okRedirect(b.redirectUri)) return res.status(400).json({ error: 'redirect' });
      const q = new URLSearchParams({ client_id: K, redirect_uri: b.redirectUri, response_type: 'code', state: clean(b.state, 64) });
      return res.status(200).json({ url: 'https://kauth.kakao.com/oauth/authorize?' + q });
    }

    if (b.action === 'kakao') {
      if (!K) return res.status(501).json({ error: 'off' });
      if (!okRedirect(b.redirectUri)) return res.status(400).json({ error: 'redirect' });
      const form = new URLSearchParams({ grant_type: 'authorization_code', client_id: K, redirect_uri: b.redirectUri, code: clean(b.code, 600) });
      if (KS) form.set('client_secret', KS);
      const tr = await fetch('https://kauth.kakao.com/oauth/token', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' }, body: form });
      const tk = await json(tr);
      if (!tr.ok || !tk.access_token) { console.error('kakao token', tr.status, JSON.stringify(tk).slice(0, 200)); return res.status(401).json({ error: 'kakao' }); }
      const ur = await fetch('https://kapi.kakao.com/v2/user/me', { headers: { authorization: 'Bearer ' + tk.access_token } });
      const u = await json(ur);
      if (!ur.ok || !u.id) return res.status(401).json({ error: 'kakao' });
      const nick = (u.kakao_account && u.kakao_account.profile && u.kakao_account.profile.nickname) || (u.properties && u.properties.nickname) || 'Kakao';
      return res.status(200).json({ id: 'kakao:' + clean(u.id, 30), name: clean(nick, 30) });
    }
    return res.status(400).json({ error: 'action' });
  } catch (e) {
    console.error('auth', e.message);
    return res.status(502).json({ error: 'upstream' });
  }
}
