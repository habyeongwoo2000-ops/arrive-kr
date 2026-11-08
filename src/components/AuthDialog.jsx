/* 로그인 / 계정 만들기 (구글 계정 화면처럼 단정하게) */

import { useState } from 'react';
import { signIn, signUp } from '../lib/auth.js';
import { ui } from '../i18n/ui.js';

export default function AuthDialog({ lang, onDone, onClose }) {
  const t = ui(lang);
  const [mode, setMode] = useState('in');
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

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
      <form className="dlg" onSubmit={submit} aria-labelledby="dlgT">
        <div className="dlg-logo" aria-hidden="true"><svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" /><path d="M5 16h22M16 3c4 4 4 22 0 26M16 3c-4 4-4 22 0 26" /></svg></div>
        <h2 id="dlgT">{mode === 'in' ? t.signIn : t.signUp}</h2>
        <p className="dlg-sub">ArriveKR</p>
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
