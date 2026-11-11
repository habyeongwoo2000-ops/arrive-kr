/* 로그인 / 계정 만들기 (구글 계정 화면처럼 단정하게) */

import { useEffect, useRef, useState } from 'react';
import { signIn, signUp, authConfig, googleSignIn, startKakao } from '../lib/auth.js';
import { ui } from '../i18n/ui.js';
import Icon from './Icon.jsx';
import useEsc from '../lib/useEsc.js';

export default function AuthDialog({ lang, onDone, onClose }) {
  const t = ui(lang);
  const [mode, setMode] = useState('in');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  useEsc(onClose);
  /* 간편 로그인 (구글 · 카카오) — 서버에 키가 설정된 것만 켜집니다 */
  const ko = lang === 'ko';
  const S = ko ? { easy: '간편 로그인', or: '또는 아이디로', kakao: '카카오로 시작하기', google: 'Google로 시작하기', off: '관리자 설정 전이에요', fail: '로그인하지 못했어요. 다시 해 주세요.', wait: '로그인 중…' }
               : { easy: 'Quick sign-in', or: 'or with an ID', kakao: 'Continue with Kakao', google: 'Continue with Google', off: 'Not set up yet', fail: 'Sign-in failed. Please try again.', wait: 'Signing in…' };
  const [conf, setConf] = useState(null);
  const gBox = useRef(null);
  useEffect(() => { authConfig().then(setConf); }, []);
  useEffect(() => {
    if (!conf || !conf.google || !gBox.current) return;
    const draw = () => {
      const g = window.google && window.google.accounts && window.google.accounts.id; if (!g) return;
      g.initialize({ client_id: conf.google, callback: async ({ credential }) => {
        setBusy(true); setErr('');
        const r = await googleSignIn(credential); setBusy(false);
        if (r.id) onDone(r.id); else setErr(S.fail);
      } });
      gBox.current.innerHTML = '';
      g.renderButton(gBox.current, { theme: 'outline', size: 'large', shape: 'rectangular', text: 'continue_with', width: Math.min(336, gBox.current.offsetWidth || 336), locale: ko ? 'ko' : 'en' });
    };
    if (window.google && window.google.accounts) { draw(); return; }
    let sc = document.getElementById('gsi-js');
    if (!sc) { sc = document.createElement('script'); sc.id = 'gsi-js'; sc.src = 'https://accounts.google.com/gsi/client'; sc.async = true; document.head.appendChild(sc); }
    sc.addEventListener('load', draw);
    return () => sc.removeEventListener('load', draw);
  }, [conf]); // eslint-disable-line react-hooks/exhaustive-deps
  const kakao = async () => { setBusy(true); setErr(''); const r = await startKakao(); if (!r.url) { setBusy(false); setErr(S.fail); } };

  const submit = async (e) => {
    e.preventDefault(); if (busy) return;
    setBusy(true); setErr('');
    const out = mode === 'in' ? await signIn(id.trim(), pw) : await signUp(id.trim(), pw, pw2);
    setBusy(false);
    if (out.error) { setErr(t[out.error]); return; }
    onDone(out.id);
  };

  return (
    <div className="dlg-back" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <form className="dlg" onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="dlgT">
        <button type="button" className="x-close" onClick={onClose} aria-label={t.close} title={t.close}><Icon n="close" size={20} /></button>
        <div className="dlg-logo" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" /><path d="M5 16h22M16 3c4 4 4 22 0 26M16 3c-4 4-4 22 0 26" /></svg></div>
        <h2 id="dlgT">{mode === 'in' ? t.signIn : t.signUp}</h2>
        <p className="dlg-sub">ArriveKR</p>
        <div className="sso">
          <small>{S.easy}</small>
          <button type="button" className="sso-kakao" onClick={kakao} disabled={busy || !conf || !conf.kakao}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.3 0 .7.1 1 .1 5 0 9-3.1 9-7s-4-7.3-9-7.3z" /></svg>
            {S.kakao}
          </button>
          {conf && conf.google ? <div className="sso-google" ref={gBox}><button type="button" className="sso-gfake" disabled>{S.google}</button></div> : <button type="button" className="sso-gfake" disabled>{S.google}</button>}
          {conf && (!conf.kakao || !conf.google) && <p className="sso-off">{(!conf.kakao && !conf.google ? 'Kakao · Google' : !conf.kakao ? 'Kakao' : 'Google')} — {S.off}</p>}
          <div className="sso-or"><span>{S.or}</span></div>
        </div>
        <label className="fld"><input value={id} onChange={(e) => setId(e.target.value)} autoComplete="username" required placeholder=" " /><span>{t.uid}</span></label>
        <label className="fld"><input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete={mode === 'in' ? 'current-password' : 'new-password'} required placeholder=" " /><span>{t.pw}</span></label>
        {mode === 'up' && <label className="fld"><input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required placeholder=" " /><span>{t.pw2}</span></label>}
        {err && <p className="dlg-err" role="alert">{err}</p>}
        <p className="dlg-note">{t.localNote}</p>
        <div className="dlg-act">
          <button type="button" className="btn-t" onClick={() => { setMode(mode === 'in' ? 'up' : 'in'); setErr(''); }}>{mode === 'in' ? t.noAcc : t.haveAcc}</button>
          <button type="submit" className="btn-p" disabled={busy}>{mode === 'in' ? t.signIn : t.signUp}</button>
        </div>
      </form>
    </div>
  );
}
