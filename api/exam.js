/* POST /api/exam { lang, exam, examName, score:{total,max,level}, wrong:[{n,q,box,choices,picked,answer,script}], open:[{n,q,box,max,rubric,model,answer}] }
   → { open:{ n:{ score, comment, better } }, summary, strong:[], weak:[], explain:{ n:text }, next }
   모의시험 AI 채점: 서술·말하기 답을 기준표대로 점수 매기고, 틀린 문제를 학습자 언어로 풀이합니다.
   · 객관식 정답 여부는 화면이 이미 계산합니다(AI가 바꾸지 않음). AI는 서술 점수와 설명만 씁니다.
   · 대회 서버의 Amazon Bedrock(Claude) — api/_ai.js. 답안은 저장하지 않습니다. */
import { ask, aiOn, limited, clean, body, LANG } from './_ai.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!aiOn()) return res.status(501).json({ error: 'off' });
  if (limited(req, 6)) return res.status(429).json({ error: 'rate' });
  const b = body(req);
  const lang = LANG[b.lang] ? b.lang : 'en';
  const wrong = (Array.isArray(b.wrong) ? b.wrong : []).slice(0, 20).map((w) => ({
    n: Number(w.n) || 0, q: clean(w.q, 160), box: clean(w.box, 300).replace(/&lt;|&gt;/g, ''), choices: (w.choices || []).slice(0, 4).map((c) => clean(c, 80)),
    picked: Number(w.picked) || 0, answer: Number(w.answer) || 0, script: clean(w.script, 300)
  }));
  const open = (Array.isArray(b.open) ? b.open : []).slice(0, 4).map((o) => ({
    n: Number(o.n) || 0, q: clean(o.q, 200), box: clean(o.box, 300), max: Math.min(30, Math.max(1, Number(o.max) || 10)),
    rubric: clean(o.rubric, 300), model: clean(o.model, 200), answer: clean(o.answer, 600)
  }));
  const score = { total: Number(b.score && b.score.total) || 0, max: Number(b.score && b.score.max) || 0, level: clean(b.score && b.score.level, 10) };

  const system = [
    `You are a kind but fair Korean language examiner grading a practice ${clean(b.examName, 60) || 'Korean'} test for a foreign worker living in Wonju, Korea.`,
    `Write every comment, explanation and summary in ${LANG[lang]} (Korean words and example sentences stay in Korean).`,
    'For each open item: give score as an integer 0..max following the rubric (empty or off-topic answer = 0; understandable but with errors = partial; natural and complete = full).',
    'comment: max 140 chars, one strength + one fix. better: a corrected or model Korean answer based on what they wrote (max 120 chars).',
    'For each wrong multiple-choice item: explain in max 120 chars why the correct choice is right and why theirs is not.',
    'summary: 1–2 encouraging sentences (max 180 chars) about the overall result. strong and weak: 1–3 short skill tags each (e.g. listening numbers, particles, workplace safety words). next: one concrete study tip (max 120 chars).',
    'Do not change multiple-choice results. Do not state official pass marks or promise results.',
    'Return JSON only: {"open":{"<n>":{"score":0,"comment":"","better":""}},"explain":{"<n>":""},"summary":"","strong":[],"weak":[],"next":""}.'
  ].join(' ');

  try {
    const o = await ask({ system, text: JSON.stringify({ score, wrong, open }), json: true, maxTokens: 2000, temperature: 0.2, timeout: 28000 });
    const outOpen = {};
    open.forEach((it) => {
      const x = (o.open || {})[it.n] || (o.open || {})[String(it.n)];
      if (!x) return;
      const sc = Math.max(0, Math.min(it.max, Math.round(Number(x.score) || 0)));
      outOpen[it.n] = { score: it.answer.trim() ? sc : 0, comment: clean(x.comment, 200), better: clean(x.better, 160) };
    });
    const explain = {};
    wrong.forEach((w) => { const x = (o.explain || {})[w.n] || (o.explain || {})[String(w.n)]; if (x) explain[w.n] = clean(x, 200); });
    const tags = (a) => (Array.isArray(a) ? a : []).slice(0, 3).map((x) => clean(x, 30)).filter(Boolean);
    return res.status(200).json({ open: outOpen, explain, summary: clean(o.summary, 240), strong: tags(o.strong), weak: tags(o.weak), next: clean(o.next, 160) });
  } catch (e) {
    return res.status(e.code === 501 ? 501 : 502).json({ error: e.code === 501 ? 'off' : 'upstream' });
  }
}
