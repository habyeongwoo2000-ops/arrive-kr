/* GET /api/health — AI 가 되는지 한 번 물어보고 결과를 보여 줍니다 (키는 보여 주지 않음).
   배포 뒤 https://arrive-kr.vercel.app/api/health 를 열어 "ok": true 인지 확인하세요. */
import { ask, provider, geminiKeys, geminiLastError, limited } from './_ai.js';

export const config = { maxDuration: 30 };

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (limited(req, 6)) return res.status(429).json({ error: 'rate' });
  const p = provider();
  const info = { provider: p, geminiKeys: geminiKeys().length, anthropicKey: !!process.env.ANTHROPIC_API_KEY, model: process.env.AI_MODEL || null };
  if (p === 'off') return res.status(200).json({ ...info, ok: false, why: 'AI 키가 없습니다 (Vercel 환경변수 GEMINI_API_KEY)' });
  const t0 = Date.now();
  try {
    const a = await ask({ system: 'Answer in Korean, one short sentence.', text: '원주를 한 문장으로 소개해 줘', maxTokens: 120, timeout: 20000 });
    return res.status(200).json({ ...info, ok: true, ms: Date.now() - t0, answer: a.slice(0, 120) });
  } catch (e) {
    return res.status(200).json({ ...info, ok: false, ms: Date.now() - t0, error: e.message, last: p === 'gemini' ? geminiLastError() : null });
  }
}
