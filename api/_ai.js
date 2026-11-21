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

/* 시간 제한이 있는 fetch (stop 신호가 오면 바로 멈춤) */
async function post(url, headers, payload, timeout, stop) {
  const ac = new AbortController(); const timer = setTimeout(() => ac.abort(), timeout);
  const onStop = () => ac.abort();
  if (stop) { if (stop.aborted) ac.abort(); else stop.addEventListener('abort', onStop); }
  try {
    return await fetch(url, { method: 'POST', signal: ac.signal, headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(payload) });
  } catch (e) {
    throw fail(502, e.name === 'AbortError' ? 'timeout' : 'upstream');
  } finally { clearTimeout(timer); if (stop) stop.removeEventListener('abort', onStop); }
}

/* ── Google Gemini (generateContent) ──
   구글 모델은 때때로 10초 넘게 답이 없습니다(붐빔). 한 모델만 기다리면 함수 제한(30초)에 걸리므로
   · 첫 요청을 보내고, 3.5초 안에 답이 없으면 다음 모델·다음 키로도 같이 보내 먼저 온 답을 씁니다(최대 3개 동시).
   · 한 번 요청은 12초까지만 기다리고, 전체는 함수 제한 안에서 끝냅니다.
   · 2.5 모델은 "생각 단계"를 꺼서 빠르게, 그 밖(3.x·latest)은 설정 없이 보냅니다. 설정을 거부하면(400) 빼고 다시.
   · 없는 모델(404)·한도(429)·잘못된 키는 잠시 건너뜁니다. */
const modelRest = new Map();        // 모델 → 이 시각까지 건너뛰기
let lastGeminiError = null;
export const geminiLastError = () => lastGeminiError;
const geminiModels = () => [...new Set([env('AI_MODEL'), ...String(process.env.GEMINI_MODELS || '').split(','),
  'gemini-flash-lite-latest', 'gemini-flash-latest', 'gemini-3.6-flash'].map((x) => String(x || '').trim()).filter(Boolean))];
const thinkFor = (model) => (/2\.5/.test(model) ? { thinkingBudget: 0 } : null);
const CALL_MS = 12000, HEDGE_MS = 3500, MAX_PAR = 3;

/* 한 모델·한 키로 한 번 요청 → 글자 (실패하면 throw) */
async function geminiOnce({ model, key, keyNo, system, parts, maxTokens, temperature, json, deadline, stop }) {
  let think = thinkFor(model);
  for (let round = 0; round < 2; round++) {
    const left = Math.min(CALL_MS, deadline - Date.now());
    if (left < 1200) throw fail(502, 'timeout');
    const payload = {
      contents: [{ role: 'user', parts }],
      generationConfig: { maxOutputTokens: Math.max(64, maxTokens) + (think ? 0 : 2048), temperature, ...(json ? { responseMimeType: 'application/json' } : {}), ...(think ? { thinkingConfig: think } : {}) }
    };
    if (system) payload.systemInstruction = { parts: [{ text: system }] };
    let r;
    try { r = await post(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { 'x-goog-api-key': key }, payload, left, stop); }
    catch (e) { if (!(stop && stop.aborted)) lastGeminiError = { model, key: keyNo, status: e.message === 'timeout' ? 'no answer in ' + Math.round(left / 1000) + 's' : 'network' }; throw e; }
    if (r.ok) {
      const d = await r.json();
      const c = (d.candidates || [])[0] || {};
      const out = ((c.content || {}).parts || []).filter((x) => !x.thought).map((x) => x.text || '').join('');
      if (out.trim()) return out;
      lastGeminiError = { model, key: keyNo, status: 200, msg: 'empty · ' + (c.finishReason || (d.promptFeedback && d.promptFeedback.blockReason) || '') };
      throw fail(502, 'empty');
    }
    const msg = (await r.text()).replace(/\s+/g, ' ').slice(0, 400);
    lastGeminiError = { model, key: keyNo, status: r.status, msg: msg.slice(0, 300) };
    console.error('gemini', model, 'key#' + keyNo, r.status, msg.slice(0, 200));
    const badKey = /API_KEY_INVALID|API key not valid|API key expired/i.test(msg);
    if (r.status === 400 && think && !badKey) { think = null; continue; }                       // 생각 설정 거부 → 빼고 한 번 더
    if (r.status === 404) modelRest.set(model, Date.now() + 3600e3);
    else if (r.status === 429) {
      if (/limit: 0\b/.test(msg)) keyRest.set(model + '|' + key, Date.now() + 3600e3);
      else keyRest.set(key, Date.now() + (/PerDay|per day/i.test(msg) ? 3600e3 : 60e3));
    } else if (r.status === 401 || r.status === 403 || badKey) keyRest.set(key, Date.now() + 3600e3);
    const e = fail(r.status === 429 ? 429 : 502, 'upstream'); e.busy = r.status === 503 || r.status >= 500; throw e;
  }
  throw fail(502, 'upstream');
}

async function gemini({ system, text, image, maxTokens, temperature, timeout, json }) {
  const deadline = Date.now() + Math.min(timeout, 26000);
  const parts = [];
  if (image) parts.push({ inlineData: { mimeType: image.mime || 'image/jpeg', data: image.data } });
  parts.push({ text });
  const keys = geminiKeys();
  const now = Date.now();
  const models = geminiModels().filter((m) => !(modelRest.get(m) > now));
  /* 후보: 모델마다 키를 번갈아 (모델1·키1, 모델2·키2, 모델3·키1 …) 뒤에 나머지 조합 */
  const first = [], rest = [];
  models.forEach((m, i) => keys.forEach((k, j) => ((j === i % keys.length) ? first : rest).push({ model: m, key: k, keyNo: j + 1 })));
  const cands = [...first, ...rest].filter((c) => !(keyRest.get(c.key) > now) && !(keyRest.get(c.model + '|' + c.key) > now));
  if (!cands.length) cands.push(...first);
  const stop = new AbortController();
  return await new Promise((resolve, reject) => {
    let idx = 0, running = 0, done = false, lastErr = fail(502, 'upstream'), rounds = 0, busy = false;
    const finish = (ok, v) => { if (done) return; done = true; clearInterval(hedge); clearTimeout(end); stop.abort(); ok ? resolve(v) : reject(v); };
    const launch = () => {
      if (done) return;
      if (idx >= cands.length) {
        if (running) return;
        /* 모두 "붐빔(503)·무응답"이었으면 잠깐 쉬었다가 처음부터 한 바퀴 더 (시간이 남는 동안, 최대 3바퀴) */
        if (busy && rounds < 3 && deadline - Date.now() > 4000) { rounds++; busy = false; idx = 0; setTimeout(launch, 1200); return; }
        finish(false, lastErr); return;
      }
      const c = cands[idx++]; running++;
      geminiOnce({ ...c, system, parts, maxTokens, temperature, json, deadline, stop: stop.signal })
        .then((out) => finish(true, out))
        .catch((e) => { lastErr = e; if (e.busy || e.message === 'timeout') busy = true; running--; if (!done) launch(); });
    };
    const hedge = setInterval(() => { if (running < MAX_PAR) launch(); }, HEDGE_MS);   // 답이 늦으면 다음 후보도 같이
    const end = setTimeout(() => finish(false, fail(502, 'timeout')), Math.max(1000, deadline - Date.now()));
    launch();
  });
}

/* /api/health?all=1 — 모델 × 키를 한꺼번에 짧게 시도해 무엇이 되는지 표로 (키 값은 보여 주지 않음) */
export async function geminiProbe() {
  const keys = geminiKeys();
  const jobs = [];
  /* 이 키로 쓸 수 있는 flash 계열 모델 이름 (AI_MODEL / GEMINI_MODELS 로 고를 때 참고) */
  jobs.push((async () => {
    try {
      const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', { headers: { 'x-goog-api-key': keys[0] } });
      const d = await r.json();
      return { available: (d.models || []).filter((m) => (m.supportedGenerationMethods || []).includes('generateContent')).map((m) => m.name.replace('models/', '')).filter((n) => /flash|pro/.test(n)) };
    } catch (e) { return { available: 'error ' + e.message }; }
  })());
  geminiModels().forEach((model) => keys.forEach((key, j) => jobs.push((async () => {
    const t0 = Date.now();
    try {
      const out = await geminiOnce({ model, key, keyNo: j + 1, system: '', parts: [{ text: 'Say hi in Korean, 3 words.' }], maxTokens: 60, temperature: 0.2, json: false, deadline: Date.now() + 15000 });
      return { model, key: j + 1, ok: true, ms: Date.now() - t0, say: out.slice(0, 30) };
    } catch (e) { return { model, key: j + 1, ok: false, ms: Date.now() - t0, last: lastGeminiError && lastGeminiError.model === model ? lastGeminiError : e.message }; }
  })())));
  return Promise.all(jobs);
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

