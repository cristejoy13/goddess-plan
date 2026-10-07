// The app's side of the meal scanner: shrink the photo, send it with her
// words to /api/scan-meal, and bring back the list for her to check. Nothing
// is saved here — she sees the numbers first and saves them herself.

const MAX_SIDE = 800;

// A phone photo is several megabytes. The AI reads an 800-pixel JPEG just as
// well, and it sends in a moment on a slow connection.
export async function shrinkPhoto(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = reject;
      el.src = url;
    });
    const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * scale);
    canvas.height = Math.round(img.naturalHeight * scale);
    canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    return { data: dataUrl.split(',')[1], type: 'image/jpeg', preview: dataUrl };
  } finally {
    URL.revokeObjectURL(url);
  }
}

// Meals she has already scanned by words alone, remembered on this gadget so
// the same meal comes back at once, even offline. Photos are not remembered:
// two photos are never the same meal.
const MEMORY_KEY = 'gp_scan_memory';
const MEMORY_MAX = 150;
const memKey = text => text.toLowerCase().replace(/[^a-z0-9.]+/g, ' ').trim();

function recall(text) {
  try {
    const all = JSON.parse(localStorage.getItem(MEMORY_KEY) || '{}');
    return all[memKey(text)]?.result || null;
  } catch {
    return null;
  }
}

function remember(text, result) {
  try {
    const all = JSON.parse(localStorage.getItem(MEMORY_KEY) || '{}');
    all[memKey(text)] = { result, at: Date.now() };
    const keys = Object.keys(all);
    if (keys.length > MEMORY_MAX) {
      keys.sort((x, y) => all[x].at - all[y].at).slice(0, keys.length - MEMORY_MAX).forEach(k => delete all[k]);
    }
    localStorage.setItem(MEMORY_KEY, JSON.stringify(all));
  } catch { /* memory is a bonus */ }
}

export async function scanMeal({ text, image }) {
  if (!image && text) {
    const known = recall(text);
    if (known) return known;
  }
  const result = await post({ text, image: image ? { data: image.data, type: image.type } : undefined });
  if (!image && text) remember(text, result);
  return result;
}

// A photo of the scale → { kg }. She checks the number and saves it herself.
export async function scanScale(image) {
  return post({ kind: 'scale', image: { data: image.data, type: image.type } });
}

const wait = ms => new Promise(r => setTimeout(r, ms));

// One click must be enough. A phone often drops its connection for a moment
// (most of all just after the camera closes), which made the first try fail
// with "No internet" and the second one work. So a failed connection is
// quietly tried again before anything is said, and "No internet" is only
// said when the phone itself reports being offline.
async function post(payload) {
  let code = '';
  try { code = localStorage.getItem('gp_sync_code') || ''; } catch { /* no storage */ }
  let r = null;
  for (let attempt = 0; attempt < 3 && !r; attempt += 1) {
    if (attempt) await wait(attempt * 700);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 30000);
    try {
      r = await fetch('/api/scan-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-GP-Code': code },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
    } catch {
      r = null;
    } finally {
      clearTimeout(timer);
    }
  }
  if (!r) {
    throw new Error(navigator.onLine === false
      ? 'No internet. Try again when you are online.'
      : 'Could not reach the scanner. Try again.');
  }
  let j = {};
  try { j = await r.json(); } catch { /* not JSON */ }
  if (!r.ok) {
    if (j.code === 'code') throw new Error('This gadget is not linked yet. Link it in Settings first.');
    if (j.code === 'setup') throw new Error('The scanner is not switched on yet.');
    throw new Error(j.error || 'Could not work it out. Try again.');
  }
  return j;
}

// When she only sent a photo, the meal is written down as the list of foods.
export function describeItems(items) {
  return items.map(it => (it.amount ? `${it.name} (${it.amount})` : it.name)).join(', ');
}
