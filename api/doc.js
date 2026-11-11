/* POST /api/doc { lang, image(base64), mime, entry:'YYYY-MM-DD', places:[{key,name}] }
   → { docType, summary, items:[{ title, titleKo, what, whatKo, due, kind, place:{key,name,address}, bring[], tel }] }
   한국어 서류 사진을 읽고 "언제까지 · 어디서 · 무엇을 들고" 해야 하는지 뽑아 30일 일정에 넣을 수 있게 돌려줍니다.
   · 사진은 Gemini에 한 번 보내고 버립니다(저장 안 함). 사진에 없는 날짜·번호는 만들지 않게 합니다. */
import { gemini, limited, clean, body, LANG } from './_gemini.js';

export const config = { maxDuration: 30 };   // 사진 읽기는 10초를 넘길 수 있어요

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  if (!process.env.GEMINI_API_KEY) return res.status(501).json({ error: 'off' });
  if (limited(req, 5)) return res.status(429).json({ error: 'rate' });
  const b = body(req);
  const lang = LANG[b.lang] ? b.lang : 'en';
  const mime = /^image\/(jpeg|png|webp)$/.test(b.mime) ? b.mime : 'image/jpeg';
  const image = String(b.image || '').replace(/^data:[^,]+,/, '');
  if (image.length < 100 || image.length > 4_000_000) return res.status(400).json({ error: 'image' });
  const entry = /^\d{4}-\d{2}-\d{2}$/.test(b.entry) ? b.entry : '';
  const places = (Array.isArray(b.places) ? b.places : []).slice(0, 30).map((p) => ({ key: clean(p.key, 20), name: clean(p.name, 60) }));

  const system = [
    'You read a photo of a Korean document (letter, notice, bill, contract, form) for a foreign resident who just moved to Wonju, Gangwon, Korea.',
    'Find the concrete things the person must DO because of this document: visits, payments, calls, online submissions.',
    'For each, give: title (English, max 40 chars), titleKo (Korean, max 30 chars), what (one plain sentence in ' + LANG[lang] + ', max 140 chars), whatKo (Korean, max 120 chars),',
    'due (YYYY-MM-DD only if a deadline or appointment date is printed; if the year is missing assume the next such date on or after ' + (entry || 'today') + '; else null),',
    'kind (visit | pay | call | online), place {key, name, address}: key MUST be one of the given place keys when the document clearly refers to that office, else null; name and address exactly as printed (or empty),',
    'bring (up to 4 short items printed or clearly required, in ' + LANG[lang] + '), tel (phone number exactly as printed or empty).',
    'Also docType (short, in ' + LANG[lang] + ') and summary (one sentence in ' + LANG[lang] + ', max 140 chars, what this document is and the most urgent action).',
    'NEVER invent dates, amounts, phone numbers or addresses that are not printed. If the image is not a document or unreadable, return items: [] and say so in summary.',
    'At most 4 items, most urgent first. Return JSON only: {"docType":"","summary":"","items":[...]}.'
  ].join(' ');

  try {
    const out = await gemini(system, [
      { inlineData: { mimeType: mime, data: image } },
      { text: JSON.stringify({ knownPlaces: places, entryDate: entry }) }
    ], { maxTokens: 1800, temperature: 0.1, timeout: 28000 });
    const keys = new Set(places.map((p) => p.key));
    const items = (Array.isArray(out.items) ? out.items : []).slice(0, 4).map((x, i) => ({
      id: 'doc-' + Date.now().toString(36) + i,
      title: clean(x.title, 60), titleKo: clean(x.titleKo, 50), what: clean(x.what, 200), whatKo: clean(x.whatKo, 180),
      due: /^\d{4}-\d{2}-\d{2}$/.test(x.due) ? x.due : null,
      kind: ['visit', 'pay', 'call', 'online'].includes(x.kind) ? x.kind : 'visit',
      place: x.place ? { key: keys.has(x.place.key) ? x.place.key : null, name: clean(x.place.name, 60), address: clean(x.place.address, 120) } : null,
      bring: (Array.isArray(x.bring) ? x.bring : []).slice(0, 4).map((y) => clean(y, 40)).filter(Boolean),
      tel: clean(x.tel, 20)
    })).filter((x) => x.title || x.titleKo);
    return res.status(200).json({ docType: clean(out.docType, 40), summary: clean(out.summary, 200), items });
  } catch (e) {
    return res.status(e.code === 501 ? 501 : 502).json({ error: e.code === 501 ? 'off' : 'upstream' });
  }
}
