/* POST /api/tutor { q, lang, country } → { answer }
   EPS-TOPIK(한국어능력시험) 공부를 돕는 짧은 AI 튜터 (대회 서버의 Amazon Bedrock · Claude — api/_ai.js).
   · AI가 꺼져 있으면 501 을 돌려주고, 화면은 연습 문제만 보여 줍니다.
   · 질문은 300자까지, IP 당 1분 10번까지 받습니다. 개인정보는 저장하지 않습니다. */

import { ask, aiOn, limited, body as readBody, LANG } from './_ai.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!aiOn()) return res.status(501).json({ error: 'off' });
  if (limited(req, 10)) return res.status(429).json({ error: 'rate' });
  const body = readBody(req);
  const q = String((body && body.q) || '').trim().slice(0, 300);
  const lang = LANG[body && body.lang] ? body.lang : 'en';
  const country = String((body && body.country) || '').replace(/[^\p{L} .'-]/gu, '').slice(0, 40);
  if (!q) return res.status(400).json({ error: 'empty' });

  const system = [
    'You are a friendly tutor helping a foreign worker prepare for the EPS-TOPIK Korean language test for Korea\'s Employment Permit System.',
    `Answer in ${LANG[lang]}${country ? `, for a learner from ${country}` : ''}. Keep it under 120 words.`,
    'Give the Korean word or sentence, its pronunciation in Latin letters, the meaning, and one short example from workplace or daily life (safety, factory, farm, hospital, bank).',
    'Only help with Korean language learning and the EPS-TOPIK test. For visa, legal or payment questions, tell them to check their sending agency or call 1345 instead of answering.',
    'Never promise test results or jobs. Warn that brokers asking for money are a scam if the topic comes up.',
    'Write plain text for a chat bubble: no markdown, no #, no ** or * symbols. Use short lines.'
  ].join(' ');

  try {
    const raw = await ask({ system, text: q, maxTokens: 400, temperature: 0.4, timeout: 15000 });
    /* 혹시 붙은 마크다운 기호 지우기 (말풍선은 글자 그대로 보여 줌) */
    const answer = raw.replace(/^#{1,6}\s*/gm, '').replace(/\*\*(.+?)\*\*/g, '$1').replace(/__(.+?)__/g, '$1').replace(/^\s*[-*]\s+/gm, '• ').replace(/\n{3,}/g, '\n\n').trim();
    return res.status(200).json({ answer });
  } catch (e) {
    return res.status(502).json({ error: 'upstream' });
  }
}
