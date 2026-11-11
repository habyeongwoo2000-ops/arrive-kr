/* 대회 서버(AWS)용 웹 서버 — 덧붙일 프로그램 없이 Node 만으로 돌아갑니다.
   · dist/ (npm run build 결과) 를 보여 주고, /api/plan·tutor·doc·replan 은 api/ 폴더의 같은 코드를 실행합니다.
   · Vercel 에서는 이 파일을 쓰지 않습니다 (Vercel 은 api/ 를 스스로 실행).
   실행: PORT=3000 AI_PROVIDER=bedrock node server.mjs */

import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';          // 바깥에는 Caddy(https)가 대신 열어 줍니다
const APIS = new Set(['plan', 'tutor', 'doc', 'replan', 'exam', 'auth']);
const MAX_BODY = 6 * 1024 * 1024;

const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8', '.wasm': 'application/wasm' };

const handlers = {};
async function api(name) {
  if (!handlers[name]) handlers[name] = (await import(join(ROOT, 'api', name + '.js'))).default;
  return handlers[name];
}

/* Vercel 함수와 같은 모양(res.status().json())으로 맞춰 줍니다 */
function wrap(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { if (!res.headersSent) res.setHeader('content-type', 'application/json; charset=utf-8'); res.end(JSON.stringify(o)); return res; };
  return res;
}
function readJson(req) {
  return new Promise((ok, no) => {
    let n = 0; const chunks = [];
    req.on('data', (c) => { n += c.length; if (n > MAX_BODY) { no(Object.assign(new Error('big'), { code: 413 })); req.destroy(); } else chunks.push(c); });
    req.on('end', () => { try { ok(chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {}); } catch (e) { ok({}); } });
    req.on('error', no);
  });
}

async function sendFile(res, file, cache) {
  const data = await readFile(file);
  res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': cache, 'x-content-type-options': 'nosniff' });
  res.end(data);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = decodeURIComponent(url.pathname);
  try {
    /* AI 주소 */
    const m = /^\/api\/([a-z]+)\/?$/.exec(path);
    if (m) {
      if (!APIS.has(m[1])) { res.writeHead(404).end(); return; }
      wrap(res);
      if (req.method === 'POST') req.body = await readJson(req);
      await (await api(m[1]))(req, res);
      return;
    }
    if (path === '/healthz') { res.writeHead(200, { 'content-type': 'text/plain' }).end('ok'); return; }

    /* 화면 파일 (없는 주소는 index.html — 한 페이지 앱) */
    const file = normalize(join(DIST, path));
    if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
    let isFile = false;
    try { isFile = (await stat(file)).isFile(); } catch (e) { /* 없음 */ }
    if (isFile) {
      const cache = path.startsWith('/static/') ? 'public, max-age=31536000, immutable' : path.startsWith('/textures/') ? 'public, max-age=604800' : 'no-cache';
      await sendFile(res, file, cache);
    } else if (path.startsWith('/static/') || path.startsWith('/textures/') || extname(path)) {
      res.writeHead(404).end();
    } else {
      await sendFile(res, join(DIST, 'index.html'), 'no-cache');
    }
  } catch (e) {
    console.error(req.method, path, e.code || '', e.message);
    if (!res.headersSent) res.writeHead(e.code === 413 ? 413 : 500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ error: e.code === 413 ? 'big' : 'server' }));
  }
});

server.listen(PORT, HOST, () => console.log(`ArriveKR · http://${HOST}:${PORT} · AI=${(process.env.AI_PROVIDER || 'bedrock')}`));
