// POST /api/scan-meal  { text?: string, image?: { data: base64, type: 'image/jpeg' } }
//   → { items: [{ name, amount, grams, kcal, source: 'usda'|'ai', usdaName? }], total }
//
// Runs on Vercel, so the Gemini and USDA keys never reach the phone. Only her
// own gadgets may use it: they send the app's sync code, which must match
// SCAN_CODE. Without that, anyone who found the address could use up her free
// Gemini allowance.
//
// Settings (Vercel → Project → Settings → Environment Variables):
//   GEMINI_API_KEY   free key from Google AI Studio
//   USDA_API_KEY     free key from api.data.gov (DEMO_KEY works, slowly)
//   SCAN_CODE        her sync code, e.g. GP-XXXXXXXXXXXX
//   GEMINI_MODEL     optional; tried before the built-in GEMINI_MODELS list

import { GEMINI_MODELS, buildPrompt, parseItems, settleItem } from './_scan.js';

const MAX_TEXT = 1000;
const MAX_IMAGE_CHARS = 3_000_000; // ~2.2 MB of photo; the app sends far less

async function askModel(model, key, parts) {
  return fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    },
  );
}

async function askGemini({ text, image }) {
  const key = String(process.env.GEMINI_API_KEY || '').trim();
  const models = [...new Set([process.env.GEMINI_MODEL, ...GEMINI_MODELS].filter(Boolean))];
  const parts = [{ text: buildPrompt(text) }];
  if (image) parts.push({ inline_data: { mime_type: image.type, data: image.data } });
  let busy = false;
  for (const model of models) {
    const r = await askModel(model, key, parts);
    // A bad key fails the same way on every model; say so straight away.
    if (r.status === 400 || r.status === 401) {
      const j = await r.json().catch(() => ({}));
      if (/api key/i.test(j.error?.message || '')) throw Object.assign(new Error('key'), { code: 'key' });
    }
    if (r.status === 429) { busy = true; continue; }
    if (r.status === 403 || r.status === 404 || r.status >= 500) continue;
    if (!r.ok) throw Object.assign(new Error(`gemini ${r.status}`), { code: 'ai' });
    const j = await r.json();
    const out = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    return parseItems(out);
  }
  throw Object.assign(new Error('no model'), { code: busy ? 'busy' : 'ai' });
}

async function findUsda(query) {
  const own = String(process.env.USDA_API_KEY || '').trim();
  const urlFor = key => `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(key)}`
    + `&query=${encodeURIComponent(query)}&dataType=${encodeURIComponent('Foundation,SR Legacy,Survey (FNDDS)')}&pageSize=3`;
  // Her key first; if it is refused, the shared DEMO_KEY (slower, but the
  // same food list). One retry each: the USDA service now and then drops one.
  const keys = own ? [own, own, 'DEMO_KEY'] : ['DEMO_KEY', 'DEMO_KEY'];
  for (const key of keys) {
    try {
      const r = await fetch(urlFor(key));
      if (r.ok) {
        const j = await r.json();
        return Array.isArray(j.foods) && j.foods.length ? j.foods[0] : null;
      }
    } catch { /* try again */ }
  }
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Use POST.' });
  if (!process.env.GEMINI_API_KEY || !process.env.SCAN_CODE) {
    return res.status(503).json({ error: 'The scanner is not set up yet.', code: 'setup' });
  }
  // Spaces or a lowercase letter pasted into Vercel must not lock her out.
  const norm = v => String(v || '').trim().toUpperCase();
  if (!norm(req.headers['x-gp-code']) || norm(req.headers['x-gp-code']) !== norm(process.env.SCAN_CODE)) {
    return res.status(403).json({ error: 'This gadget is not linked to your account.', code: 'code' });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const text = String(body.text || '').trim().slice(0, MAX_TEXT);
  const image = body.image && typeof body.image.data === 'string'
    && /^image\/(jpeg|png|webp|heic|heif)$/.test(body.image.type || '')
    && body.image.data.length <= MAX_IMAGE_CHARS
    ? { data: body.image.data, type: body.image.type }
    : null;
  if (!text && !image) return res.status(400).json({ error: 'Say, type or snap your meal first.' });

  let items;
  try {
    items = await askGemini({ text, image });
  } catch (e) {
    const msg = e.code === 'busy'
      ? 'The free AI is busy. Try again in a minute.'
      : e.code === 'key'
        ? 'The Gemini key in Vercel is not right. Check GEMINI_API_KEY.'
        : 'The AI could not read that. Try again.';
    return res.status(502).json({ error: msg, code: e.code || 'ai' });
  }
  if (!items.length) return res.status(422).json({ error: 'No food found. Add a few words about what it is.' });

  const foods = await Promise.all(items.map(it => findUsda(it.usda)));
  const settled = items.map((it, i) => settleItem(it, foods[i])).filter(Boolean);
  const total = settled.reduce((s, it) => s + it.kcal, 0);
  return res.status(200).json({ items: settled, total });
}
