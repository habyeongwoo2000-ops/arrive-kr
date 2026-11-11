/* POST /api/replan { lang, text, entry:'YYYY-MM-DD', prev:{off,offDates,time,move,shift} }
   → { rules:{ off:[0-6], offDates:['YYYY-MM-DD'], time, move, shift }, reply }
   "화·목은 야간근무예요, 차 없어요" 같은 말을 일정 조건으로 바꿉니다.
   · AI는 조건만 알아듣고, 날짜를 옮기는 건 화면의 규칙(lib/replan.js)이 합니다 — 관공서 휴일·마감을 어기지 않게. */
import { ask, aiOn, limited, clean, body, LANG } from './_ai.js';

const TIME = ['morning', 'afternoon', 'lunch', 'evening'];
const MOVE = ['bus', 'walk', 'bike', 'car'];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!aiOn()) return res.status(501).json({ error: 'off' });
  if (limited(req, 40)) return res.status(429).json({ error: 'rate' });
  const b = body(req);
  const lang = LANG[b.lang] ? b.lang : 'en';
  const text = clean(b.text, 300);
  if (!text.trim()) return res.status(400).json({ error: 'empty' });
  const entry = /^\d{4}-\d{2}-\d{2}$/.test(b.entry) ? b.entry : '';
  const prev = b.prev && typeof b.prev === 'object' ? b.prev : {};

  const system = [
    'You turn what a foreign worker in Wonju, Korea says about their schedule into constraints for a 30-day settling-in plan.',
    'Their plan starts on entryDate. Merge with the previous constraints unless they clearly change or remove them.',
    'Output: off = weekdays they CANNOT visit offices (0=Sun..6=Sat), offDates = specific dates they cannot (YYYY-MM-DD, on/after entryDate),',
    'time = best time of day to visit offices (morning | afternoon | lunch | evening | null), move = how they travel (bus | walk | bike | car | null), shift = night | day | null.',
    'Think about what helps: e.g. a night-shift worker sleeps in the morning, so afternoon; a 9-to-6 day worker can only go at lunch or must take leave.',
    `Also reply: one short friendly sentence in ${LANG[lang]} (max 120 chars) saying what you will change. Do not promise anything about office rules.`,
    'Return JSON only: {"off":[],"offDates":[],"time":null,"move":null,"shift":null,"reply":""}.'
  ].join(' ');

  try {
    const o = await ask({ system, text: JSON.stringify({ entryDate: entry, previous: prev, said: text }), json: true, maxTokens: 400, temperature: 0.2, timeout: 15000 });
    const rules = {
      off: [...new Set((Array.isArray(o.off) ? o.off : []).map(Number).filter((n) => n >= 0 && n <= 6))],
      offDates: [...new Set((Array.isArray(o.offDates) ? o.offDates : []).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)))].slice(0, 20),
      time: TIME.includes(o.time) ? o.time : null,
      move: MOVE.includes(o.move) ? o.move : null,
      shift: o.shift === 'night' || o.shift === 'day' ? o.shift : null
    };
    return res.status(200).json({ rules, reply: clean(o.reply, 160) });
  } catch (e) {
    return res.status(e.code === 501 ? 501 : 502).json({ error: e.code === 501 ? 'off' : 'upstream' });
  }
}
