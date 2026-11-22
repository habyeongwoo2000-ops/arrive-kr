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
/* E9-Bridge 화면 사진·로고, 서류 예시 사진도 함께 (공유 링크에서는 /e9/… 주소를 못 읽음) */
const svg = 'image/svg+xml';
for (const name of ['e9/itv-asad.jpg', 'e9/itv-boss.jpg', 'e9/itv-owner.jpg', 'e9/itv-sohee.jpg', 'e9/itv-tilo.jpg', 'e9/logo-mark.svg', 'e9/logo-mark-white.svg', 'arrivekr-logo.png', 'sample-notice.jpg']) {
  const ext = name.split('.').pop();
  const uri = 'data:' + (ext === 'svg' ? svg : mime[ext]) + ';base64,' + readFileSync('public/' + name).toString('base64');
  html = html.split('"/' + name + '"').join('"' + uri + '"').split("'/" + name + "'").join("'" + uri + "'");
}
html = html.replace('<link rel="icon" href="/favicon.svg" type="image/svg+xml" />', '');
writeFileSync(file, html);
console.log('inlined textures →', file, (html.length / 1048576).toFixed(1) + ' MB');
