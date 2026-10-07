// The app's side of the meal scanner: shrink the photo, send it with her
// words to /api/scan-meal, and bring back the list for her to check. Nothing
// is saved here — she sees the numbers first and saves them herself.

const MAX_SIDE = 1024;

// A phone photo is several megabytes. The AI reads a 1024-pixel JPEG just as
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

export async function scanMeal({ text, image }) {
  let code = '';
  try { code = localStorage.getItem('gp_sync_code') || ''; } catch { /* no storage */ }
  let r;
  try {
    r = await fetch('/api/scan-meal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-GP-Code': code },
      body: JSON.stringify({ text, image: image ? { data: image.data, type: image.type } : undefined }),
    });
  } catch {
    throw new Error('No internet. Try again when you are online.');
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
