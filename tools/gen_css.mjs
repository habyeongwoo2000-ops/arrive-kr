import fs from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const postcss = require('postcss');
const src = fs.readFileSync(process.argv[2] || '../E9-Bridge-main/assets/style.css', 'utf8').split('\n');
const R = [[11,80],[85,205],[271,288],[290,310],[312,357],[359,456],[458,530],[588,612],[631,658],[716,784],[972,1008],[1056,1106],[1185,1194],[1214,1238],[1277,1290]];
let css = R.map(([a,b]) => src.slice(a-1,b).join('\n')).join('\n');
css = css.replace(/#langSelect/g, '.lang-select').replace(/html\[data-lang-pending\][^\n]*\n/, '');
const root = postcss.parse(css);
const pre = (s) => {
  s = s.trim();
  if (s === ':root' || s === 'html' || s === 'body') return '.hub';
  if (s === '*' ) return '.hub *';
  if (s.startsWith('*::')) return '.hub ' + s;
  let m;
  if ((m = /^html(\[lang="(km|ne)"\]) body$/.exec(s))) return `html${m[1]} .hub`;
  if ((m = /^html(\[lang="(km|ne)"\]) (.+)$/.exec(s))) return `html${m[1]} .hub ${m[3]}`;
  if ((m = /^body\.([a-z-]+)(\.[a-z-]+)?(.*)$/.exec(s))) return `.hub.${m[1]}${m[2]||''}${m[3]}`;
  if (s.startsWith('.hub')) return s;
  return '.hub ' + s;
};
root.walkRules((r) => {
  if (r.parent && r.parent.type === 'atrule' && /keyframes/.test(r.parent.name)) return;
  r.selectors = r.selectors.map(pre);
});
let out = root.toString();
fs.writeFileSync('src/components/hub/e9base.css', '/* E9-Bridge(eum-six) style.css 에서 가져온 디자인 — .hub 안에서만 적용되도록 앞에 .hub 를 붙였습니다 (tools/gen_css.mjs). */\n' + out + '\n');
console.log(out.length);
