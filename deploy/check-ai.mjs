/* 서버에서 Bedrock 이 되는지 한 번 물어봅니다:  AI_PROVIDER=bedrock node deploy/check-ai.mjs */
import { ask } from '../api/_ai.js';
const t0 = Date.now();
const a = await ask({ system: 'Answer in Korean in one short sentence.', text: '원주를 한 문장으로 소개해줘', maxTokens: 120 });
console.log('AI 답:', a, `(${Date.now() - t0}ms)`);
