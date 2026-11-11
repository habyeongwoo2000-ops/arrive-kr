/* POST /api/plan { lang, visa, country, needs, steps:[{id, day, t, n}] } → { intro, tips: { id: text } }
   "나의 원주 정착 30일" 일정의 설명을 그 사람의 말과 상황에 맞게 다듬습니다 (대회 서버의 Amazon Bedrock · Claude — api/_ai.js).
   · 일정(장소·날짜·전화번호)은 화면의 규칙이 정합니다. AI는 설명 문장만 씁니다 — 새 사업·번호를 지어내지 않게.
   · AI가 꺼져 있으면 501 → 화면은 기본 설명을 그대로 보여 줍니다. 개인정보는 저장하지 않습니다. */

import { ask, aiOn, limited, clean, body as readBody, LANG } from './_ai.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!aiOn()) return res.status(501).json({ error: 'off' });
  if (limited(req, 6)) return res.status(429).json({ error: 'rate' });
  const b = readBody(req);
  const lang = LANG[b.lang] ? b.lang : 'en';
  const steps = (Array.isArray(b.steps) ? b.steps : []).slice(0, 16).map((s) => ({ id: clean(s.id, 20), day: Number(s.day) || 0, title: clean(s.t, 120), note: clean(s.n, 300), travel: clean(s.d, 60) }));
  if (!steps.length) return res.status(400).json({ error: 'empty' });
  const profile = { visa: clean(b.visa, 8), country: clean(b.country, 40), needs: (b.needs || []).slice(0, 10).map((x) => clean(x, 12)), family: !!b.family, homeArea: clean(b.homeArea, 40) };

  const system = [
    'You help a foreign resident who just moved to Wonju, Gangwon, Korea follow a 30-day settling-in plan of public support services.',
    `Write in ${LANG[lang]}. Friendly, plain words, like a kind neighbor.`,
    'You receive the person profile and a fixed list of steps (day offset, title, factual note).',
    'For EACH step id, write one tip of at most 2 short sentences (max 160 characters) explaining why this step matters for THIS person and one practical thing to bring or say.',
    'Do NOT add new programs, places, phone numbers, amounts or dates that are not in the step note. Do not promise eligibility; say "ask" when unsure.',
    'If profile.homeArea is set, the person lives there and goes to each step from home; you may use the given "travel" text (distance/time from home) to give a practical tip, but never invent other times or distances.',
    'Also write "intro": one warm sentence (max 120 characters) welcoming them to Wonju.',
    'Return JSON only: {"intro": string, "tips": {"<id>": string}}.'
  ].join(' ');

  try {
    let out;
    try { out = await ask({ system, text: JSON.stringify({ profile, steps }), json: true, maxTokens: 1600, temperature: 0.5, timeout: 20000 }); }
    catch (e) { return res.status(502).json({ error: e.message === 'parse' ? 'parse' : 'upstream' }); }
    const ids = new Set(steps.map((s) => s.id));
    const tips = {};
    Object.entries(out.tips || {}).forEach(([k, v]) => { if (ids.has(k)) tips[k] = clean(v, 220); });
    return res.status(200).json({ intro: clean(out.intro, 160), tips });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
