// Diary writing with formatting (2026-10-25): bold, italic, underline, caps,
// bullets, numbers, text colours and highlights. A note is kept as a small
// piece of HTML in the same `note` / `notes` fields as before. Older notes are
// plain text; they are shown as they were (line breaks kept) and only become
// HTML once she edits them.

// Text colours. Each has a bright shade for dark mode and a deeper one for
// light mode (the shades live in index.css under [data-c]), so both stay
// readable. `mark` is a near-black stand-in the browser paints first; it is
// swapped for the named colour straight after.
export const TEXT_COLORS = [
  { id: 'pink', label: 'Pink', swatch: '#ff5c9d', mark: '#0a0001' },
  { id: 'purple', label: 'Purple', swatch: '#9b6bff', mark: '#0a0002' },
  { id: 'blue', label: 'Blue', swatch: '#3d8bfd', mark: '#0a0003' },
  { id: 'green', label: 'Green', swatch: '#2fb36b', mark: '#0a0004' },
  { id: 'orange', label: 'Orange', swatch: '#f08a24', mark: '#0a0005' },
  { id: 'red', label: 'Red', swatch: '#e5484d', mark: '#0a0006' },
];
export const TEXT_COLOR_CLEAR = '#0a0007';

export const HIGHLIGHTS = [
  { id: 'yellow', label: 'Yellow', swatch: '#ffd60a', mark: '#0b0001' },
  { id: 'pink', label: 'Pink', swatch: '#ff5c9d', mark: '#0b0002' },
  { id: 'green', label: 'Green', swatch: '#34c778', mark: '#0b0003' },
  { id: 'blue', label: 'Blue', swatch: '#5096ff', mark: '#0b0004' },
  { id: 'purple', label: 'Purple', swatch: '#a06eff', mark: '#0b0005' },
];
export const HIGHLIGHT_CLEAR = '#0b0006';

const TAG_RE = /<\/?[a-z][^>]*>/i;

export function isRichNote(value) {
  return TAG_RE.test(String(value || ''));
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function plainToHtml(text) {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

// The words alone, for "is this page empty?" and for talking into a box.
export function noteText(value) {
  const v = String(value || '');
  if (!isRichNote(v)) return v;
  return v
    .replace(/<(br|\/div|\/p|\/li)[^>]*>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

const KEEP = new Set(['B', 'STRONG', 'I', 'EM', 'U', 'S', 'SPAN', 'DIV', 'P', 'BR', 'UL', 'OL', 'LI']);
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'NOSCRIPT', 'TITLE', 'TEXTAREA', 'SVG', 'MATH', 'LINK', 'META']);
const STYLE_KEEP = ['font-weight', 'font-style', 'text-decoration', 'text-decoration-line'];
// 'none' marks words taken back to plain inside a coloured run.
const COLOR_IDS = new Set([...TEXT_COLORS.map(c => c.id), 'none']);
const HIGHLIGHT_IDS = new Set([...HIGHLIGHTS.map(h => h.id), 'none']);

function cleanNode(node) {
  for (const child of [...node.childNodes]) {
    if (child.nodeType === 3) continue;
    if (child.nodeType !== 1) { child.remove(); continue; }
    const tag = child.tagName.toUpperCase();
    if (DROP.has(tag)) { child.remove(); continue; }
    cleanNode(child);
    if (!KEEP.has(tag)) {
      child.replaceWith(...child.childNodes);
      continue;
    }
    for (const attr of [...child.attributes]) {
      const name = attr.name.toLowerCase();
      if (name === 'data-c' && COLOR_IDS.has(attr.value)) continue;
      if (name === 'data-h' && HIGHLIGHT_IDS.has(attr.value)) continue;
      if (name === 'style') {
        const kept = STYLE_KEEP
          .map(p => [p, child.style.getPropertyValue(p)])
          .filter(([, v]) => v && !/url|expression/i.test(v));
        child.removeAttribute('style');
        kept.forEach(([p, v]) => child.style.setProperty(p, v));
        if (!kept.length) child.removeAttribute('style');
        continue;
      }
      child.removeAttribute(attr.name);
    }
  }
}

// What goes into the writing box: old plain notes keep their line breaks,
// and anything that came through sync is cleaned to the few tags we use.
export function noteToHtml(value) {
  const v = String(value || '');
  if (!v) return '';
  if (!isRichNote(v)) return plainToHtml(v);
  if (typeof document === 'undefined') return v;
  const box = document.createElement('template');
  box.innerHTML = v;
  cleanNode(box.content);
  const out = document.createElement('div');
  out.append(box.content);
  return out.innerHTML;
}

// Add spoken words after what is already written, keeping its formatting.
export function appendSpeech(baseHtml, joinedText, baseText) {
  const base = String(baseHtml || '');
  const before = String(baseText || '');
  if (!before.trim()) return plainToHtml(joinedText);
  const added = joinedText.startsWith(before) ? joinedText.slice(before.length) : ` ${joinedText}`;
  const html = isRichNote(base) ? base : plainToHtml(base);
  return `${html}${plainToHtml(added)}`;
}

function toRgb(color) {
  const probe = document.createElement('span');
  probe.style.color = color;
  return probe.style.color;
}

function unwrap(el) {
  el.replaceWith(...el.childNodes);
}

// The browser paints a picked colour as a stand-in shade. Swap each stand-in
// for a named colour (or remove it for "no colour"), and strip older colours
// inside it so the newest pick wins.
export function settleColors(editor) {
  const textByRgb = new Map(TEXT_COLORS.map(c => [toRgb(c.mark), c.id]));
  const textClear = toRgb(TEXT_COLOR_CLEAR);
  const hiByRgb = new Map(HIGHLIGHTS.map(h => [toRgb(h.mark), h.id]));
  const hiClear = toRgb(HIGHLIGHT_CLEAR);

  editor.querySelectorAll('font[color], [style*="color"]').forEach(el => {
    const fg = el.tagName === 'FONT' ? toRgb(el.getAttribute('color')) : el.style.color;
    const bg = el.style.backgroundColor;
    if (fg && (textByRgb.has(fg) || fg === textClear)) {
      el.querySelectorAll('[data-c]').forEach(inner => inner.removeAttribute('data-c'));
      const span = document.createElement('span');
      span.setAttribute('data-c', textByRgb.get(fg) || 'none');
      span.append(...el.childNodes);
      el.replaceWith(span);
      return;
    }
    if (bg && (hiByRgb.has(bg) || bg === hiClear)) {
      el.querySelectorAll('[data-h]').forEach(inner => inner.removeAttribute('data-h'));
      el.style.removeProperty('background-color');
      el.setAttribute('data-h', hiByRgb.get(bg) || 'none');
      if (!el.getAttribute('style')) el.removeAttribute('style');
    }
  });
  editor.querySelectorAll('span:not([data-c]):not([data-h]):not([style])').forEach(unwrap);
}

// While she talks, the cursor sits after the newest words.
export function showRichCursorAtEnd(el, talking) {
  if (!el) return;
  try {
    if (talking) {
      el.inputMode = 'none';
      if (document.activeElement !== el) el.focus({ preventScroll: true });
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      el.scrollTop = el.scrollHeight;
    } else {
      el.inputMode = '';
    }
  } catch { /* the words still arrive; only the cursor is a bonus */ }
}
