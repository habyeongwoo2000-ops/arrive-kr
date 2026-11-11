/* PC로 보기 / 모바일로 보기
   · 휴대폰에서 "PC로 보기" → 화면 폭을 1280px로 넓혀 PC 화면 그대로 보여 줍니다 (선택은 기억).
   · PC에서 "모바일로 보기" → 휴대폰 크기 틀 안에 같은 페이지를 띄워 모바일 화면을 보여 줍니다.
   · 휴대폰 틀 안(?frame=1)에서는 이 버튼을 숨깁니다. */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ui } from '../i18n/ui.js';

const KEY = 'view.pc';
const PC_WIDTH = 1280;
export const IN_FRAME = new URLSearchParams(location.search).get('frame') === '1';
// 실제 기기가 휴대폰인지 (화면 폭을 바꿔도 변하지 않는 screen 크기로 판단)
const IS_PHONE = Math.min(screen.width, screen.height) < 760;

function setViewport(pc) {
  const m = document.querySelector('meta[name="viewport"]');
  if (m) m.setAttribute('content', pc ? `width=${PC_WIDTH}` : 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/* 첫 화면 그리기 전에 호출 — 휴대폰에서 PC 보기를 골라 두었다면 바로 적용 */
export function applySavedView() {
  try { if (IS_PHONE && !IN_FRAME && localStorage.getItem(KEY) === '1') setViewport(true); } catch (e) { /* 저장소 없음 */ }
}

const IcPc = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H4zM2 4v12a1 1 0 0 0 1 1h7v2H7v2h10v-2h-3v-2h7a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1" /></svg>;
const IcPhone = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2m0 3v13h8V5zm4 14.2a.9.9 0 1 0 0 1.8.9.9 0 0 0 0-1.8" /></svg>;

export default function ViewToggle({ lang }) {
  const t = ui(lang);
  const [pc, setPc] = useState(() => { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } });
  const [frame, setFrame] = useState(false);

  useEffect(() => {
    if (!frame) return undefined;
    const esc = (e) => { if (e.key === 'Escape') setFrame(false); };
    addEventListener('keydown', esc);
    return () => removeEventListener('keydown', esc);
  }, [frame]);

  if (IN_FRAME) return null;

  /* 휴대폰: 화면 폭 바꾸기 */
  if (IS_PHONE) {
    const flip = () => {
      const next = !pc; setPc(next); setViewport(next);
      try { localStorage.setItem(KEY, next ? '1' : '0'); } catch (e) { /* 저장소 없음 */ }
    };
    const label = pc ? t.viewMobile : t.viewPc;
    return (
      <button type="button" className="view-fab" onClick={flip} aria-label={label} title={label}>
        {pc ? <IcPhone /> : <IcPc />}<em>{label}</em>
      </button>
    );
  }

  /* PC: 휴대폰 틀 미리보기 */
  const qs = new URLSearchParams(location.search); qs.set('frame', '1'); qs.set('lang', lang); qs.set('skip', '1'); // 지금 보고 있는 지구본 화면부터
  return (
    <>
      <button type="button" className="view-fab" onClick={() => setFrame(true)} aria-label={t.viewMobile} title={t.viewMobile}>
        <IcPhone /><em>{t.viewMobile}</em>
      </button>
      {frame && createPortal(
        <div className="phone-back" role="dialog" aria-modal="true" aria-label={t.viewMobile} onClick={(e) => { if (e.target === e.currentTarget) setFrame(false); }}>
          <button type="button" className="x-close on-dark phone-x" onClick={() => setFrame(false)} aria-label={t.viewPc} title={t.viewPc}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
          <div className="phone">
            <iframe src={location.pathname + '?' + qs} title={t.viewMobile} />
          </div>
          <button type="button" className="phone-close" onClick={() => setFrame(false)}><IcPc />{t.viewPc}</button>
        </div>,
        document.body,
      )}
    </>
  );
}
