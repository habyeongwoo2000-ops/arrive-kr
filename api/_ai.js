/* AI 호출 공통 — 파일 이름이 _ 로 시작하면 주소로 열리지 않습니다.
   대회 AWS 서버가 끝나서, 이제 어디서 돌든 같은 코드로 아래 셋 중 하나를 씁니다.

     · Google Gemini   — 환경변수 GEMINI_API_KEY (Vercel 무료 운영 추천. E9-Bridge 와 같은 키를 써도 됩니다)
     · Anthropic Claude — 환경변수 ANTHROPIC_API_KEY
     · Amazon Bedrock  — AWS 서버 권한 (AI_PROVIDER=bedrock, 예전 대회 서버 방식)

   고르는 순서: AI_PROVIDER 가 있으면 그것 → GEMINI_API_KEY → ANTHROPIC_API_KEY → (Vercel 이 아니면) bedrock.
   아무 키도 없으면 AI 가 "꺼짐"(501) 이 되고, 화면은 AI 없이 기본 설명·규칙 계산으로 계속 동작합니다.

   · 키는 Vercel 환경변수(또는 서버의 .env.server)에만 둡니다. 코드·GitHub 에 넣지 마세요.
   · 그 밖의 환경변수: AI_MODEL (모델 이름) · AI_MODEL_DOC (서류 읽기용, 없으면 AI_MODEL) · AWS_REGION · AI_PROVIDER=off 로 끄기
   · 요청 내용·사진은 저장하지 않습니다. */

const env = (k) => String(process.env[k] || '').trim();

/* Gemini 키 여러 개 — GEMINI_API_KEY, GEMINI_API_KEY_2, GEMINI_API_KEY_3 … (또는 GEMINI_API_KEYS=키1,키2)
   앞 키의 한도를 다 쓰면(429) 다음 키로 넘어갑니다. 다 쓴 키는 잠시 쉬게 해 두고 건너뜁니다. */
export function geminiKeys() {
  const out = [];
  const add = (v) => String(v || '').split(',').map((x) => x.trim()).filter(Boolean).forEach((k) => { if (!out.includes(k)) out.push(k); });
  add(process.env.GEMINI_API_KEY);
  for (let i = 2; i <= 20; i++) add(process.env['GEMINI_API_KEY_' + i]);
  add(process.env.GEMINI_API_KEYS);
  return out;
}
const keyRest = new Map();   // 키 → 이 시각까지 쉬기 (같은 서버 함수가 살아 있는 동안만 기억)

export function provider() {
  const p = env('AI_PROVIDER').toLowerCase();
  if (p) return p;
  if (geminiKeys().length) return 'gemini';
  if (env('ANTHROPIC_API_KEY')) return 'anthropic';
  if (process.env.VERCEL) return 'off';           // Vercel 에는 AWS 권한이 없습니다
  return 'bedrock';
}
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
  if (a >= 0 && b > a) { try { return JSON.parse(s.slice(a, b + 1)); } catch (e) { /* 아래 */ } }
  throw fail(502, 'parse');
}

/* ask({ system, text, image?:{ data(base64), mime }, maxTokens, temperature, json, timeout, kind }) → 글자 또는 JSON */
export async function ask({ system, text, image = null, maxTokens = 1200, temperature = 0.3, json = false, timeout = 25000, kind = 'text' }) {
  const p = provider();
  if (p === 'off') throw fail(501, 'off');
  const sys = system + (json ? ' Reply with one JSON object only — no markdown, no extra words.' : '');
  const run = p === 'gemini' ? gemini : p === 'anthropic' ? anthropic : bedrock;
  const out = await run({ system: sys, text, image, maxTokens, temperature, timeout, kind, json });
  return json ? pickJSON(out) : String(out || '').trim();
}

const modelOf = (kind, def) => (kind === 'doc' && env('AI_MODEL_DOC')) || env('AI_MODEL') || def;

/* 시간 제한이 있는 fetch */
async function post(url, headers, payload, timeout) {
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), timeout);
  try {
    return await fetch(url, { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(payload) });
  } catch (e) {
    throw fail(502, e.name === 'AbortError' ? 'timeout' : 'upstream');
  } finally { clearTimeout(timer); }
}

/* ── Google Gemini (generateContent) ── */
async function gemini({ system, text, image, maxTokens, temperature, timeout, kind, json }) {
  const model = modelOf(kind, 'gemini-flash-latest');
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: image.mime || 'image/jpeg', data: image.data } });
  parts.push({ text });
  const base = {
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: 'user', parts }],
    generationConfig: { maxOutputTokens: Math.max(64, maxTokens), temperature, ...(json ? { responseMimeType: 'application/json' } : {}) }
  };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  const fast = { ...base, generationConfig: { ...base.generationConfig, thinkingConfig: { thinkingBudget: 0 } } };
  const now = Date.now();
  const all = geminiKeys();
  const ready = all.filter((k) => !(keyRest.get(k) > now));
  const order = ready.length ? ready : all;            // 모두 쉬는 중이면 그래도 한 번씩 다시 시도
  let r = null, lastStatus = 502;
  for (const key of order) {
    const headers = { 'x-goog-api-key': key };
    // 빠른 답을 위해 "생각 단계"를 끕니다. 그 설정을 모르는 모델이면 빼고 한 번 더.
    r = await post(url, headers, fast, timeout);
    if (r.status === 400) r = await post(url, headers, base, timeout);
    if (r.ok) break;
    lastStatus = r.status;
    const msg = (await r.text()).slice(0, 400);
    const n = all.indexOf(key) + 1;
    console.error('gemini', model, 'key#' + n, r.status, msg.slice(0, 200));
    if (r.status === 429) {
      // 하루 한도(PerDay)면 1시간, 분당 한도면 1분 동안 이 키를 건너뜁니다
      keyRest.set(key, Date.now() + (/PerDay|per day/i.test(msg) ? 3600e3 : 60e3));
      continue;
    }
    if (r.status === 401 || r.status === 403 || (r.status === 400 && /API_KEY_INVALID|API key not valid|API key expired/i.test(msg))) { keyRest.set(key, Date.now() + 3600e3); continue; }   // 잘못된·막힌 키
    if (r.status >= 500) continue;                    // 구글 쪽이 바쁨 → 다음 키로 한 번 더
    break;
  }
  if (!r || !r.ok) throw fail(lastStatus === 429 ? 429 : 502, 'upstream');
  const d = await r.json();
  return ((((d.candidates || [])[0] || {}).content || {}).parts || []).map((x) => x.text || '').join('');
}

/* ── Anthropic Claude (Messages API) ── */
async function anthropic({ system, text, image, maxTokens, temperature, timeout, kind }) {
  const model = modelOf(kind, 'claude-haiku-4-5');
  const content = [];
  if (image) content.push({ type: 'image', source: { type: 'base64', media_type: /png/.test(image.mime) ? 'image/png' : /webp/.test(image.mime) ? 'image/webp' : 'image/jpeg', data: image.data } });
  content.push({ type: 'text', text });
  const r = await post('https://api.anthropic.com/v1/messages',
    { 'x-api-key': env('ANTHROPIC_API_KEY'), 'anthropic-version': '2023-06-01' },
    { model, system, max_tokens: Math.max(64, maxTokens), temperature, messages: [{ role: 'user', content }] }, timeout);
  if (!r.ok) { console.error('anthropic', model, r.status, (await r.text()).slice(0, 300)); throw fail(r.status === 429 ? 429 : 502, 'upstream'); }
  const d = await r.json();
  return (d.content || []).map((c) => c.text || '').join('');
}

/* ── Amazon Bedrock (Converse API) — AWS 서버 권한으로 호출 ── */
let client = null;
async function bedrock({ system, text, image, maxTokens, temperature, timeout, kind }) {
  let sdk;
  try { sdk = await import('@aws-sdk/client-bedrock-runtime'); } catch (e) { throw fail(501, 'off'); }
  if (!client) client = new sdk.BedrockRuntimeClient({ region: env('AWS_REGION') || env('AWS_DEFAULT_REGION') || 'ap-southeast-2' });
  const modelId = modelOf(kind, 'global.anthropic.claude-haiku-4-5-20251001-v1:0');
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
