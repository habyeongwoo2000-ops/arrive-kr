/* 문장마다 줄바꿈 — 화면의 글에서 문장이 끝나는 곳(. ! ?) 뒤 띄어쓰기를 줄바꿈으로 바꿉니다.
   · React 가 만든 글자 노드의 내용(nodeValue)만 바꾸고, 그 글을 감싼 요소에 data-sb 표시를 달아
     CSS(white-space: pre-line)로 줄바꿈이 보이게 합니다. React 가 글을 다시 그리면 다시 처리합니다.
   · 시험지 지문(.ex-box)·듣기 대본, 입력칸, 지도 타일, 코드 등은 건드리지 않습니다.
   · 숫자(1.5), 약어(e.g.)처럼 문장 끝이 아닌 마침표는 그대로 둡니다. */

// 문장 끝: 한글·닫는 괄호/따옴표·낱말(3글자 이상, 베트남어 악센트·데바나가리·크메르 문자 포함) 뒤의 . ! ? । ។ 와 그 뒤 띄어쓰기
const END = /([가-힣)\]"'’”]|[\p{L}\p{M}]{3,})([.!?])[  ]+(?=[^\s\d·—–-])/gu;
// 네팔어 । · 크메르어 ។ 는 문장 끝에만 쓰므로 앞 글자 수와 상관없이
const END2 = /([\p{L}\p{M}])([।។])[  ]+(?=\S)/gu;
const SKIP = 'script, style, textarea, input, select, option, code, pre, svg, [contenteditable], .ex-box, .ex-script, .ex-ch, .leaflet-tile-pane, .leaflet-control-attribution, [data-sb-off]';

function fix(node) {
  const v = node.nodeValue;
  if (!v || v.length < 8 || !/[.!?।។][  ]/.test(v)) return;
  const el = node.parentElement;
  if (!el || el.closest(SKIP)) return;
  const nv = v.replace(END, '$1$2\n').replace(END2, '$1$2\n');
  if (nv === v) return;
  // 한 줄로 두어야 하는 곳(nowrap·말줄임)은 건드리지 않음
  const ws = getComputedStyle(el).whiteSpace;
  if (ws !== 'normal' && ws !== 'pre-line') return;
  // HTML 원문의 들여쓰기 줄바꿈이 섞인 곳(지도 말풍선 등)은 pre-line 이면 빈 줄이 생기므로 건너뜀
  if (!el.hasAttribute('data-sb') && [...el.childNodes].some((c) => c.nodeType === 3 && /\n/.test(c.nodeValue))) return;
  node.nodeValue = nv;
  if (!el.hasAttribute('data-sb')) el.setAttribute('data-sb', '');
}

function walk(root) {
  if (root.nodeType === 3) { fix(root); return; }
  if (root.nodeType !== 1) return;
  const it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let n = it.nextNode(); n; n = it.nextNode()) fix(n);
}

export function startSentenceBreak() {
  if (typeof MutationObserver === 'undefined') return;
  let queue = new Set(), raf = 0;
  const flush = () => { raf = 0; const q = queue; queue = new Set(); q.forEach((n) => n.isConnected && walk(n)); };
  const add = (n) => { queue.add(n); if (!raf) raf = requestAnimationFrame(flush); };
  new MutationObserver((ms) => {
    for (const m of ms) {
      if (m.type === 'characterData') add(m.target);
      else m.addedNodes.forEach(add);
    }
  }).observe(document.body, { subtree: true, childList: true, characterData: true });
  add(document.body);
}
