/* AI 호출 공통 — 어느 AI를 쓸지 환경변수 하나로 고릅니다 (파일 이름이 _ 로 시작하면 주소로 열리지 않습니다)
   · AI_PROVIDER=bedrock : 대회 서버(AWS)의 Amazon Bedrock — 서버에 붙은 권한으로 호출, 키 없음
       AI_MODEL (기본 Claude Haiku 4.5) · AI_MODEL_DOC (서류 읽기용, 없으면 AI_MODEL) · AWS_REGION
   · 그 밖 : GEMINI_API_KEY 가 있으면 Google Gemini (Vercel 판), 없으면 AI 꺼짐(501)
   · 요청 내용·사진은 저장하지 않습니다. */

export const provider = () => (process.env.AI_PROVIDER || (process.env.GEMINI_API_KEY ? 'gemini' : 'off')).toLowerCase();
export const aiOn = () => provider() !== 'off';

const hits = new Map();
export function limited(req, perMin = 6) {
  const ip = String(req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || 'x').split(',')[0].trim();
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

const fail = (code, msg) => { const e = new Error(msg); e.code = code; return e; };

/* 답 글자에서 JSON 꺼내기 (```json … ``` 이나 앞뒤 말이 붙어도) */
export function pickJSON(text) {
  const s = String(text || '').replace(/```(?:json)?/g, '').trim();
  try { return JSON.parse(s); } catch (e) { /* 아래에서 */ }
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b > a) return JSON.parse(s.slice(a, b + 1));
  throw fail(502, 'parse');
}

/* ask({ system, text, image?:{ data(base64), mime }, maxTokens, temperature, json, timeout, kind }) → 글자 또는 JSON */
export async function ask({ system, text, image = null, maxTokens = 1200, temperature = 0.3, json = false, timeout = 25000, kind = 'text' }) {
  const p = provider();
  if (p === 'off') throw fail(501, 'off');
  const out = p === 'bedrock'
    ? await bedrock({ system: system + (json ? ' Reply with one JSON object only — no markdown, no extra words.' : ''), text, image, maxTokens, temperature, timeout, kind })
    : await gemini({ system, text, image, maxTokens, temperature, json, timeout });
  return json ? pickJSON(out) : String(out || '').trim();
}

/* ── Amazon Bedrock (Converse API) ── */
let client = null;
async function bedrock({ system, text, image, maxTokens, temperature, timeout, kind }) {
  const sdk = await import('@aws-sdk/client-bedrock-runtime');
  if (!client) client = new sdk.BedrockRuntimeClient({ region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || 'ap-southeast-2' });
  const modelId = (kind === 'doc' && process.env.AI_MODEL_DOC) || process.env.AI_MODEL || 'global.anthropic.claude-haiku-4-5-20251001-v1:0';
  const content = [];
  if (image) content.push({ image: { format: /png/.test(image.mime) ? 'png' : /webp/.test(image.mime) ? 'webp' : 'jpeg', source: { bytes: Buffer.from(image.data, 'base64') } } });
  content.push({ text });
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await client.send(new sdk.ConverseCommand({
      modelId, system: [{ text: system }], messages: [{ role: 'user', content }],
      inferenceConfig: { maxTokens: Math.max(16, maxTokens), temperature }
    }), { abortSignal: ac.signal });
    return (((r.output || {}).message || {}).content || []).map((c) => c.text || '').join('');
  } catch (e) {
    console.error('bedrock', modelId, e.name, String(e.message).slice(0, 300));
    throw fail(502, 'upstream');
  } finally { clearTimeout(timer); }
}

/* ── Google Gemini (Vercel 판) ── */
async function gemini({ system, text, image, maxTokens, temperature, json, timeout }) {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw fail(501, 'off');
  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
  const parts = image ? [{ inlineData: { mimeType: image.mime, data: image.data } }, { text }] : [{ text }];
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), timeout);
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST', signal: ac.signal,
      headers: { 'content-type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts }],
        generationConfig: { maxOutputTokens: maxTokens, temperature, ...(json ? { responseMimeType: 'application/json' } : {}) }
      })
    });
    if (!r.ok) { console.error('gemini', model, r.status, (await r.text()).slice(0, 300)); throw fail(502, 'upstream'); }
    const d = await r.json();
    return (((d.candidates || [])[0] || {}).content || {}).parts?.map((x) => x.text || '').join('') || '';
  } catch (e) {
    if (e.code) throw e;
    throw fail(502, 'upstream');
  } finally { clearTimeout(timer); }
}
