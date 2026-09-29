// Minutes logged for the Saturday Zone 2 run and the Sunday bike.
//
// Her goal is to hold her time or beat it, so the page shows the last time
// and the best, and the best moves up by itself the moment she beats it.
//
// Shape of gp_cardio (synced):
//   { run:  { 'YYYY-MM-DD': { min: number|null, updatedAt } },
//     bike: { ... } }
// A cleared day keeps its entry with min: null, so the clearing wins over the
// other gadget's older number when the two copies merge.

export const CARDIO_KEY = 'gp_cardio';
export const CARDIO_CHANGED = 'gp-cardio-changed';
export const KINDS = ['run', 'bike'];

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const pad = n => String(n).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function clean(v) {
  const out = { run: {}, bike: {} };
  if (!v || typeof v !== 'object') return out;
  for (const kind of KINDS) {
    for (const [date, e] of Object.entries(v[kind] || {})) {
      if (!DATE_RE.test(date) || !e || typeof e !== 'object') continue;
      const min = Number.isFinite(e.min) && e.min > 0 ? e.min : null;
      out[kind][date] = { min, updatedAt: typeof e.updatedAt === 'string' ? e.updatedAt : '' };
    }
  }
  return out;
}
const parse = raw => { try { return clean(JSON.parse(raw)); } catch { return clean(null); } };
const sortObj = o => Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]]));
const serialize = log => JSON.stringify({ bike: sortObj(log.bike), run: sortObj(log.run) });

export function loadCardio() {
  try { return parse(localStorage.getItem(CARDIO_KEY)); } catch { return clean(null); }
}
export function saveCardio(log) {
  try { localStorage.setItem(CARDIO_KEY, serialize(log)); } catch { /* quota */ }
  try { window.dispatchEvent(new CustomEvent(CARDIO_CHANGED)); } catch { /* no window */ }
}

export function setMinutes(log, kind, date, min, now = new Date().toISOString()) {
  const n = Number(min);
  const value = Number.isFinite(n) && n > 0 ? Math.round(n) : null;
  return { ...log, [kind]: { ...log[kind], [date]: { min: value, updatedAt: now } } };
}

// Last logged time, and the best ever, for one kind.
export function cardioStats(log, kind) {
  const days = Object.entries(log[kind] || {}).filter(([, e]) => e.min).sort(([a], [b]) => (a < b ? -1 : 1));
  if (!days.length) return { last: null, best: null };
  const [lastDate, lastE] = days[days.length - 1];
  const best = days.reduce((m, [date, e]) => (e.min > m.min ? { date, min: e.min } : m), { date: '', min: 0 });
  return { last: { date: lastDate, min: lastE.min }, best };
}

// The date a log on this day's page belongs to: today when the page is
// today's, otherwise the most recent day of that weekday.
export function dateFor(dayIndex, now = new Date()) {
  const js = now.getDay();
  const today = js === 0 ? 6 : js - 1;
  const back = (today - dayIndex + 7) % 7;
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - back);
  return dayKey(d);
}

// Two gadgets' copies: per kind, per day, the newer edit wins.
export function mergeCardioBlobs(localRaw, remoteRaw) {
  const a = parse(localRaw), b = parse(remoteRaw);
  const out = { run: {}, bike: {} };
  for (const kind of KINDS) {
    for (const date of new Set([...Object.keys(a[kind]), ...Object.keys(b[kind])])) {
      const x = a[kind][date], y = b[kind][date];
      if (!x || !y) { out[kind][date] = x || y; continue; }
      if (x.updatedAt !== y.updatedAt) out[kind][date] = x.updatedAt > y.updatedAt ? x : y;
      else out[kind][date] = JSON.stringify(x) >= JSON.stringify(y) ? x : y;
    }
  }
  return serialize(out);
}
