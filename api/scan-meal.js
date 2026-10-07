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

import { GEMINI_MODELS, buildPrompt, parseItems, settleItem, buildScalePrompt, parseScale } from './_scan.js';

const MAX_TEXT = 1000;
const MAX_IMAGE_CHARS = 3_000_000; // ~2.2 MB of photo; the app sends far less

// Nothing may hang: a slow service is cut off.
async function fetchWithin(ms, url, opts = {}, outer) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  const stop = () => ctrl.abort();
  outer?.addEventListener('abort', stop);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(t);
    outer?.removeEventListener('abort', stop);
  }
}

async function askModel(model, key, parts, outer, ms = 20000) {
  return fetchWithin(ms,
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 },
      }),
    },
    outer,
  );
}

const fail = (code, why) => Object.assign(new Error(why || code), { code });

// One Gemini model, answered or refused.
async function tryGemini(model, prompt, image, read, outer) {
  const key = String(process.env.GEMINI_API_KEY || '').trim();
  const parts = [{ text: prompt }];
  if (image) parts.push({ inline_data: { mime_type: image.type, data: image.data } });
  let r;
  try { r = await askModel(model, key, parts, outer, 15000); } catch { throw fail('busy'); }
  if (r.status === 400 || r.status === 401) {
    const j = await r.json().catch(() => ({}));
    if (/api key/i.test(j.error?.message || '')) throw fail('key');
  }
  if (r.status === 429 || r.status === 503) throw fail('busy');
  if (!r.ok) throw fail('ai', `gemini ${model} ${r.status}`);
  const j = await r.json();
  const out = (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
  return read(out);
}

// Groq (with a q — not Musk's Grok): free and usually under a second. Used
// only when GROQ_API_KEY is set. Its model may think out loud first; that
// part is cut off before the answer is read.
export const GROQ_MODEL = 'qwen/qwen3.8-27b';
async function tryGroq(prompt, image, read, outer) {
  const key = String(process.env.GROQ_API_KEY || '').trim();
  const content = [{ type: 'text', text: prompt }];
  if (image) content.push({ type: 'image_url', image_url: { url: `data:${image.type};base64,${image.data}` } });
  let r;
  try {
    r = await fetchWithin(15000, 'https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || GROQ_MODEL,
        messages: [{ role: 'user', content }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    }, outer);
  } catch { throw fail('busy'); }
  if (r.status === 401) throw fail('groqkey');
  if (r.status === 429 || r.status === 503) throw fail('busy');
  if (!r.ok) throw fail('ai', `groq ${r.status}`);
  const j = await r.json();
  const out = String(j.choices?.[0]?.message?.content || '').replace(/<think>[\s\S]*?<\/think>/g, '');
  return read(out);
}

// Ask every fast AI at once and take the first good answer; the others are
// stopped. Google's free plan swings between half a second and fifteen, so
// racing two or three keeps the wait near the fastest one.
// Set when Groq refuses the key (expired or wrong), so the app can tell her.
let groqRefused = false;

async function askAI({ text, image, prompt, read = parseItems }) {
  const p = prompt || buildPrompt(text);
  const outer = new AbortController();
  const good = v => (Array.isArray(v) ? v.length > 0 : v != null);
  const runners = [];
  if (process.env.GROQ_API_KEY) {
    runners.push(() => tryGroq(p, image, read, outer.signal).catch(e => {
      if (e.code === 'groqkey') groqRefused = true;
      throw e;
    }));
  }
  const gemini = [...new Set([process.env.GEMINI_MODEL, ...GEMINI_MODELS].filter(Boolean))];
  // The two quick Gemini models race; the slow one is only a last resort.
  for (const model of gemini.slice(0, 2)) runners.push(() => tryGemini(model, p, image, read, outer.signal));
  const attempt = list => Promise.any(list.map(run => run().then(v => (good(v) ? v : Promise.reject(fail('empty'))))));
  try {
    const v = await attempt(runners);
    outer.abort();
    return v;
  } catch (all) {
    const codes = (all.errors || []).map(e => e.code);
    if (codes.length && codes.every(c => c === 'key' || c === 'groqkey') && codes.includes('key')) throw fail('key');
    if (codes.every(c => c === 'empty')) return read('');
    for (const model of gemini.slice(2)) {
      try {
        const v = await tryGemini(model, p, image, read);
        if (good(v)) return v;
      } catch { /* last resort failed too */ }
    }
    throw fail(codes.includes('busy') ? 'busy' : 'ai');
  }
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
      const r = await fetchWithin(8000, urlFor(key));
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
  groqRefused = false;
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

  // { check: true } — tells whether each key works, without showing any key.
  if (body.check === true) {
    const result = {};
    const key = String(process.env.GEMINI_API_KEY || '').trim();
    for (const model of [...new Set([process.env.GEMINI_MODEL, ...GEMINI_MODELS].filter(Boolean))]) {
      const t0 = Date.now();
      try {
        const r = await askModel(model, key, [{ text: 'Reply with JSON {"ok":true}' }]);
        const j = await r.json().catch(() => ({}));
        result[model] = `${r.status} in ${Date.now() - t0} ms${r.ok ? '' : ` — ${String(j.error?.message || '').slice(0, 120)}`}`;
      } catch (e) {
        result[model] = `no answer after ${Date.now() - t0} ms (${e.name})`;
      }
    }
    if (process.env.GROQ_API_KEY) {
      const t0 = Date.now();
      try {
        const v = await tryGroq('Reply with JSON {"value": 1, "unit": "kg"}', null, parseScale);
        result.groq = `${v === 1 ? 'ok' : 'odd answer'} in ${Date.now() - t0} ms`;
      } catch (e) {
        result.groq = `${e.code === 'groqkey' ? 'key refused' : e.code} after ${Date.now() - t0} ms`;
      }
    } else {
      result.groq = 'no GROQ_API_KEY set';
    }
    const own = String(process.env.USDA_API_KEY || '').trim();
    const t1 = Date.now();
    try {
      const r = await fetchWithin(8000, `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${encodeURIComponent(own)}&query=banana&pageSize=1`);
      result.usda = `${r.status} in ${Date.now() - t1} ms`;
    } catch (e) {
      result.usda = `no answer after ${Date.now() - t1} ms (${e.name})`;
    }
    return res.status(200).json(result);
  }

  const text = String(body.text || '').trim().slice(0, MAX_TEXT);
  const image = body.image && typeof body.image.data === 'string'
    && /^image\/(jpeg|png|webp|heic|heif)$/.test(body.image.type || '')
    && body.image.data.length <= MAX_IMAGE_CHARS
    ? { data: body.image.data, type: body.image.type }
    : null;
  // { kind: 'scale', image } — read the weight off a photo of the scale.
  if (body.kind === 'scale') {
    if (!image) return res.status(400).json({ error: 'Take a photo of your scale first.' });
    let kg;
    try {
      kg = await askAI({ image, prompt: buildScalePrompt(), read: parseScale });
    } catch (e) {
      return res.status(502).json({ error: e.code === 'busy' ? 'The free AI is busy. Try again in a minute.' : 'The AI could not read that. Try again.' });
    }
    if (kg == null) return res.status(422).json({ error: 'Could not read the number. Try a closer, sharper photo of the display.' });
    return res.status(200).json({ kg, ...(groqRefused && { groqKeyRefused: true }) });
  }

  if (!text && !image) return res.status(400).json({ error: 'Say, type or snap your meal first.' });

  let items;
  try {
    items = await askAI({ text, image });
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
  return res.status(200).json({ items: settled, total, ...(groqRefused && { groqKeyRefused: true }) });
}
