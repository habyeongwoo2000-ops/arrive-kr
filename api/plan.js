/* POST /api/plan { lang, visa, country, needs, steps:[{id, day, t, n}] } → { intro, tips: { id: text } }
   "나의 원주 정착 30일" 일정의 설명을 그 사람의 말과 상황에 맞게 다듬습니다 (Google Gemini).
   · 일정(장소·날짜·전화번호)은 화면의 규칙이 정합니다. AI는 설명 문장만 씁니다 — 새 사업·번호를 지어내지 않게.
   · GEMINI_API_KEY 가 없으면 501 → 화면은 기본 설명을 그대로 보여 줍니다. 개인정보는 저장하지 않습니다. */

const hits = new Map();
const LANG = { ko: 'Korean', en: 'English', vi: 'Vietnamese', id: 'Indonesian', km: 'Khmer', ne: 'Nepali' };
const clean = (v, n) => String(v || '').replace(/[<>]/g, '').slice(0, n);

function limited(ip) {
  const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 60000);
  h.push(now); hits.set(ip, h);
  if (hits.size > 5000) hits.delete(hits.keys().next().value);
  return h.length > 6;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(501).json({ error: 'off' });
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'x').split(',')[0];
  if (limited(ip)) return res.status(429).json({ error: 'rate' });

  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  const lang = LANG[b.lang] ? b.lang : 'en';
  const steps = (Array.isArray(b.steps) ? b.steps : []).slice(0, 16).map((s) => ({ id: clean(s.id, 20), day: Number(s.day) || 0, title: clean(s.t, 120), note: clean(s.n, 300) }));
  if (!steps.length) return res.status(400).json({ error: 'empty' });
  const profile = { visa: clean(b.visa, 8), country: clean(b.country, 40), needs: (b.needs || []).slice(0, 10).map((x) => clean(x, 12)), family: !!b.family };

  const system = [
    'You help a foreign resident who just moved to Wonju, Gangwon, Korea follow a 30-day settling-in plan of public support services.',
    `Write in ${LANG[lang]}. Friendly, plain words, like a kind neighbor.`,
    'You receive the person profile and a fixed list of steps (day offset, title, factual note).',
    'For EACH step id, write one tip of at most 2 short sentences (max 160 characters) explaining why this step matters for THIS person and one practical thing to bring or say.',
    'Do NOT add new programs, places, phone numbers, amounts or dates that are not in the step note. Do not promise eligibility; say "ask" when unsure.',
    'Also write "intro": one warm sentence (max 120 characters) welcoming them to Wonju.',
    'Return JSON only: {"intro": string, "tips": {"<id>": string}}.'
  ].join(' ');

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), 20000);
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: JSON.stringify({ profile, steps }) }] }],
        generationConfig: { maxOutputTokens: 1600, temperature: 0.5, responseMimeType: 'application/json' }
      })
    });
    clearTimeout(timer);
    if (!r.ok) { console.error('gemini', model, r.status, (await r.text()).slice(0, 300)); return res.status(502).json({ error: 'upstream' }); }
    const d = await r.json();
    const text = (((d.candidates || [])[0] || {}).content || {}).parts?.map((p) => p.text).join('') || '{}';
    let out; try { out = JSON.parse(text); } catch (e) { return res.status(502).json({ error: 'parse' }); }
    const ids = new Set(steps.map((s) => s.id));
    const tips = {};
    Object.entries(out.tips || {}).forEach(([k, v]) => { if (ids.has(k)) tips[k] = clean(v, 220); });
    return res.status(200).json({ intro: clean(out.intro, 160), tips });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
