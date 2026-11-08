/* POST /api/tutor { q, lang, country } → { answer }
   EPS-TOPIK(한국어능력시험) 공부를 돕는 짧은 AI 튜터 (Google Gemini).
   · Vercel 환경변수 GEMINI_API_KEY 가 없으면 501 을 돌려주고, 화면은 연습 문제만 보여 줍니다.
   · 질문은 300자까지, IP 당 1분 10번까지 받습니다. 개인정보는 저장하지 않습니다. */

const hits = new Map();
const LANG = { ko: 'Korean', en: 'English', vi: 'Vietnamese', id: 'Indonesian', km: 'Khmer', ne: 'Nepali' };

function limited(ip) {
  const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 60000);
  h.push(now); hits.set(ip, h);
  if (hits.size > 5000) hits.delete(hits.keys().next().value);
  return h.length > 10;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(501).json({ error: 'off' });
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'x').split(',')[0];
  if (limited(ip)) return res.status(429).json({ error: 'rate' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  const q = String((body && body.q) || '').trim().slice(0, 300);
  const lang = LANG[body && body.lang] ? body.lang : 'en';
  const country = String((body && body.country) || '').replace(/[^\p{L} .'-]/gu, '').slice(0, 40);
  if (!q) return res.status(400).json({ error: 'empty' });

  const system = [
    'You are a friendly tutor helping a foreign worker prepare for the EPS-TOPIK Korean language test for Korea\'s Employment Permit System.',
    `Answer in ${LANG[lang]}${country ? `, for a learner from ${country}` : ''}. Keep it under 120 words.`,
    'Give the Korean word or sentence, its pronunciation in Latin letters, the meaning, and one short example from workplace or daily life (safety, factory, farm, hospital, bank).',
    'Only help with Korean language learning and the EPS-TOPIK test. For visa, legal or payment questions, tell them to check their sending agency or call 1345 instead of answering.',
    'Never promise test results or jobs. Warn that brokers asking for money are a scam if the topic comes up.'
  ].join(' ');

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), 15000);
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents: [{ role: 'user', parts: [{ text: q }] }],
        generationConfig: { maxOutputTokens: 400, temperature: 0.4 } })
    });
    clearTimeout(timer);
    if (!r.ok) return res.status(502).json({ error: 'upstream' });
    const d = await r.json();
    const answer = (((d.candidates || [])[0] || {}).content || {}).parts?.map((p) => p.text).join('') || '';
    return res.status(200).json({ answer: answer.trim() });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
