/* Esc 키로 닫기 — 창이 여러 개 겹쳐 있으면 맨 위 창 하나만 닫습니다. */
import { useEffect, useRef } from 'react';

const stack = [];
let bound = false;
function onKey(e) {
  if (e.key !== 'Escape' || !stack.length) return;
  e.preventDefault();
  stack[stack.length - 1].current();
}

export default function useEsc(onClose, on = true) {
  const fn = useRef(onClose);
  fn.current = onClose;
  useEffect(() => {
    if (!on) return undefined;
    if (!bound) { addEventListener('keydown', onKey); bound = true; }
    const me = { get current() { return fn.current; } };
    stack.push(me);
    return () => { const i = stack.indexOf(me); if (i >= 0) stack.splice(i, 1); };
  }, [on]);
}
