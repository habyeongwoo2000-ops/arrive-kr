/* 휴대폰 아래 패널(바텀 시트)을 손가락으로 끌어서 내리기 · 올리기
   · 올라와 있을 때: 내용이 맨 위까지 스크롤된 상태에서 아래로 끌면 패널이 따라 내려감 (60px 넘게 끌면 내려가 고정)
   · 내려가 있을 때: 위로 끌면 따라 올라옴 (40px 넘게 끌면 올라와 고정)
   · 조금만 끌면 제자리로. 끌기 직후의 클릭은 justDragged 로 걸러 냅니다.
   sheetRef  : 움직일 패널
   scrollRef : 패널 안에서 스크롤되는 요소 (패널 자체여도 됨)
   peek      : 내려갔을 때 보이는 높이(px)
   active    : 패널이 화면에 있는지 (패널이 새로 생기면 다시 연결) */

import { useEffect, useRef, useState } from 'react';

export default function useSheetDrag(sheetRef, scrollRef, { peek = 72, active = true } = {}) {
  const [low, setLow] = useState(false);
  const lowRef = useRef(false); lowRef.current = low;
  const justDragged = useRef(false);

  useEffect(() => {
    const el = sheetRef.current; if (!el || !active) return undefined;
    let y0 = null, dy = 0, dragging = false, fromLow = false;
    const start = (y) => { if (innerWidth > 760) return; y0 = y; dy = 0; dragging = false; fromLow = lowRef.current; };
    const move = (y, e) => {
      if (y0 === null) return;
      dy = y - y0;
      if (!dragging) {
        if (Math.abs(dy) < 6) return;
        const sc = scrollRef.current;
        const top = !sc || sc.scrollTop <= 0;
        if (fromLow ? dy < 0 : dy > 0 && top) { dragging = true; el.classList.add('is-drag'); } else { y0 = null; return; }
      }
      if (e.cancelable) e.preventDefault(); // 끄는 동안 내용 스크롤 막기
      const max = el.offsetHeight - peek;
      el.style.transform = `translateY(${Math.max(0, Math.min(max, (fromLow ? max : 0) + dy))}px)`;
    };
    const end = () => {
      if (y0 === null) return;
      y0 = null;
      if (!dragging) return;
      dragging = false; el.classList.remove('is-drag'); el.style.transform = '';
      justDragged.current = true; setTimeout(() => { justDragged.current = false; }, 50);
      if (!fromLow && dy > 60) setLow(true);
      else if (fromLow && dy < -40) setLow(false);
    };
    const ts = (e) => start(e.touches[0].clientY);
    const tm = (e) => move(e.touches[0].clientY, e);
    const md = (e) => { if (e.button === 0) start(e.clientY); };
    const mm = (e) => move(e.clientY, e);
    el.addEventListener('touchstart', ts, { passive: true });
    el.addEventListener('touchmove', tm, { passive: false });
    el.addEventListener('touchend', end); el.addEventListener('touchcancel', end);
    el.addEventListener('mousedown', md);
    addEventListener('mousemove', mm); addEventListener('mouseup', end);
    return () => {
      el.removeEventListener('touchstart', ts); el.removeEventListener('touchmove', tm);
      el.removeEventListener('touchend', end); el.removeEventListener('touchcancel', end);
      el.removeEventListener('mousedown', md);
      removeEventListener('mousemove', mm); removeEventListener('mouseup', end);
    };
  }, [active, peek]); // eslint-disable-line react-hooks/exhaustive-deps

  return { low, setLow, justDragged };
}
