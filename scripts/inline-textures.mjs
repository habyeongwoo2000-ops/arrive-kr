/* 미리보기 빌드 뒤처리: 지구본 그림(/textures/…)을 index.html 안에 data: 주소로 넣습니다. */
import { readFileSync, writeFileSync } from 'node:fs';
const file = 'dist-preview/index.html';
let html = readFileSync(file, 'utf8');
const mime = { jpg: 'image/jpeg', png: 'image/png' };
for (const name of ['earth-blue-marble.jpg', 'earth-topology.png', 'night-sky.png']) {
  const b64 = readFileSync('public/textures/' + name).toString('base64');
  const uri = 'data:' + mime[name.split('.').pop()] + ';base64,' + b64;
  html = html.split('/textures/' + name).join(uri);
}
html = html.replace('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />', '');
writeFileSync(file, html);
console.log('inlined textures →', file, (html.length / 1048576).toFixed(1) + ' MB');
