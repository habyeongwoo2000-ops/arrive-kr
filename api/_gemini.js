/* Gemini 호출 공통 (파일 이름이 _ 로 시작하면 Vercel 은 주소로 열지 않습니다)
   · 키는 Vercel 환경변수 GEMINI_API_KEY 에만. 요청 내용·사진은 저장하지 않습니다. */

const hits = new Map();
export function limited(req, perMin = 6) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'x').split(',')[0];
  const now = Date.now();
  const h = (hits.get(ip) || []).filter((t) => now - t < 60000);
  h.push(now); hits.set(ip, h);
  if (hits.size > 5000) hits.delete(hits.keys().next().value);
  return h.length > perMin;
}
export const clean = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').slice(0, n);
export const LANG = { ko: 'Korean', en: 'English', vi: 'Vietnamese', id: 'Indonesian', km: 'Khmer', ne: 'Nepali', th: 'Thai', my: 'Burmese', uz: 'Uzbek', mn: 'Mongolian', si: 'Sinhala', bn: 'Bengali', zh: 'Chinese', fil: 'Filipino', lo: 'Lao', ky: 'Kyrgyz', ur: 'Urdu', tl: 'Filipino' };

export function body(req) {
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  return b || {};
}

/* parts: [{text}|{inlineData:{mimeType,data}}] → JSON 객체 (실패하면 throw) */
export async function gemini(system, parts, { maxTokens = 1500, temperature = 0.3, timeout = 25000 } = {}) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) { const e = new Error('off'); e.code = 501; throw e; }
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { maxOutputTokens: maxTokens, temperature, responseMimeType: 'application/json' }
      })
    });
    if (!r.ok) { console.error('gemini', model, r.status, (await r.text()).slice(0, 300)); const e = new Error('upstream'); e.code = 502; throw e; }
    const d = await r.json();
    const text = (((d.candidates || [])[0] || {}).content || {}).parts?.map((p) => p.text || '').join('') || '{}';
    return JSON.parse(text.replace(/^```(json)?|```$/g, '').trim());
  } finally { clearTimeout(timer); }
}
