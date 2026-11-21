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

/* ── Google Gemini (generateContent) ──
   · 모델: AI_MODEL → gemini-flash-latest → gemini-2.5-flash → gemini-flash-lite-latest → gemini-2.5-flash-lite 순서로,
     없는 모델(404)·한도 0 인 모델은 다음 모델로 넘어갑니다.
   · "생각 단계": 끌 수 있으면 끄고(빠름), 모델이 거부하면 가장 짧게 → 기본값 순서로 다시 시도. 된 설정은 기억해 둡니다.
   · 전체 시간은 함수 제한(30초) 안에서 끝나도록 남은 시간만 씁니다. */
const THINK = [{ thinkingBudget: 0 }, { thinkingLevel: 'minimal' }, { thinkingLevel: 'low' }, null];
const thinkOk = new Map();          // 모델 → THINK 몇 번째가 통했나
const modelRest = new Map();        // 모델 → 이 시각까지 건너뛰기 (없는 모델)
let lastGeminiError = null;
export const geminiLastError = () => lastGeminiError;
const geminiModels = () => [...new Set([env('AI_MODEL'), ...String(process.env.GEMINI_MODELS || '').split(','), 'gemini-flash-latest', 'gemini-3.6-flash', 'gemini-flash-lite-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'].map((x) => String(x || '').trim()).filter(Boolean))];

async function gemini({ system, text, image, maxTokens, temperature, timeout, kind, json }) {
  const deadline = Date.now() + Math.min(timeout, 26000);
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: image.mime || 'image/jpeg', data: image.data } });
  parts.push({ text });
  const all = geminiKeys();
  const docModel = kind === 'doc' && env('AI_MODEL_DOC');
  const models = docModel ? [docModel, ...geminiModels()] : geminiModels();
  let lastStatus = 502;
  for (const model of models) {
    if (modelRest.get(model) > Date.now()) continue;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
    const ready = all.filter((k) => !(keyRest.get(model + '|' + k) > Date.now()) && !(keyRest.get(k) > Date.now()));
    let nextModel = false;
    for (const key of (ready.length ? ready : all)) {
      let ti = thinkOk.has(model) ? thinkOk.get(model) : 0;
      for (;;) {
        const left = deadline - Date.now();
        if (left < 1500) { lastGeminiError = lastGeminiError || { status: 504, msg: 'timeout' }; throw fail(502, 'timeout'); }
        const think = THINK[ti];
        const payload = {
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts }],
          generationConfig: {
            maxOutputTokens: Math.max(64, maxTokens) + (think && 'thinkingBudget' in think ? 0 : 2048),   // 생각 단계가 켜질 수 있으면 그 몫을 더 줌
            temperature, ...(json ? { responseMimeType: 'application/json' } : {}), ...(think ? { thinkingConfig: think } : {})
          }
        };
        const r = await post(url, { 'x-goog-api-key': key }, payload, left);
        const n = all.indexOf(key) + 1;
        if (r.ok) {
          const d = await r.json();
          const c = (d.candidates || [])[0] || {};
          const out = ((c.content || {}).parts || []).filter((x) => !x.thought).map((x) => x.text || '').join('');
          if (out.trim()) { thinkOk.set(model, ti); lastGeminiError = null; return out; }
          lastGeminiError = { model, key: n, status: 200, msg: 'empty answer · ' + (c.finishReason || (d.promptFeedback && d.promptFeedback.blockReason) || '') };
          if (c.finishReason === 'MAX_TOKENS' && ti < THINK.length - 1) { ti = THINK.length - 1; continue; }
          lastStatus = 502; break;
        }
        const msg = (await r.text()).slice(0, 500);
        lastStatus = r.status;
        lastGeminiError = { model, key: n, status: r.status, msg: msg.replace(/\s+/g, ' ').slice(0, 300) };
        console.error('gemini', model, 'key#' + n, r.status, msg.slice(0, 200));
        const badKey = r.status === 400 && /API_KEY_INVALID|API key not valid|API key expired/i.test(msg);
        // 400 "invalid argument" — 새 모델은 생각 단계 설정을 이유 없이 거부하기도 해서, 다음 설정(마지막은 설정 없이)으로 다시
        if (r.status === 400 && !badKey && ti < THINK.length - 1) { ti++; continue; }
        if (r.status === 404) { modelRest.set(model, Date.now() + 3600e3); nextModel = true; break; }      // 없는 모델
        if (r.status === 429) {
          if (/limit: 0\b/.test(msg)) keyRest.set(model + '|' + key, Date.now() + 3600e3);              // 이 키로는 이 모델을 못 씀
          else keyRest.set(key, Date.now() + (/PerDay|per day/i.test(msg) ? 3600e3 : 60e3));           // 하루/분당 한도
          break;
        }
        if (r.status === 401 || r.status === 403 || badKey) { keyRest.set(key, Date.now() + 3600e3); break; }
        if (r.status >= 500) break;                                                                         // 구글이 바쁨 → 다음 키
        break;                                                                                              // 그 밖의 400 → 다음 키, 키를 다 써 보면 다음 모델
      }
      if (nextModel) break;
    }
  }
  throw fail(lastStatus === 429 ? 429 : 502, 'upstream');
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

/* /api/health?all=1 — 모델 × 키 × 생각 설정을 하나씩 짧게 시도해 무엇이 되는지 표로 (키 값은 보여 주지 않음) */
export async function geminiProbe(budgetMs = 24000) {
  const end = Date.now() + budgetMs;
  const keys = geminiKeys();
  const rows = [];
  for (const model of geminiModels()) {
    for (let k = 0; k < keys.length; k++) {
      for (let ti = 0; ti < THINK.length; ti++) {
        if (Date.now() > end - 1500) { rows.push({ model, key: k + 1, skipped: 'time' }); return rows; }
        const think = THINK[ti];
        const payload = { contents: [{ role: 'user', parts: [{ text: 'Say hi in Korean, 3 words.' }] }], generationConfig: { maxOutputTokens: 2200, temperature: 0.2, ...(think ? { thinkingConfig: think } : {}) } };
        let r, msg = '';
        try { r = await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { 'x-goog-api-key': keys[k] }, payload, Math.min(8000, end - Date.now())); }
        catch (e) { rows.push({ model, key: k + 1, think: think ? JSON.stringify(think) : 'none', status: 'timeout' }); continue; }
        if (r.ok) { const d = await r.json(); msg = (((d.candidates || [])[0] || {}).content || {}).parts ? 'OK: ' + d.candidates[0].content.parts.map((x) => x.text || '').join('').slice(0, 40) : 'OK(empty)'; }
        else msg = (await r.text()).replace(/\s+/g, ' ').slice(0, 160);
        rows.push({ model, key: k + 1, think: think ? JSON.stringify(think) : 'none', status: r.status, msg });
        if (r.ok || r.status === 404 || r.status === 429 || r.status === 403) break;   // 이 키는 결과가 나왔음 → 다음 키
      }
    }
  }
  return rows;
}
