// The 1,000-workout goal.
//
// One record per DAY, not per exercise: the whole planned session — main
// workout, the jump rope after it, the evening walk — counts as one workout.
// Keying by date makes that impossible to get wrong, since a day cannot be
// logged twice. Only the main workout marks a day; the walk tick on Today's
// Plan never touches this record.
//
// The workout number is not stored. It is the day's place in date order, so
// adding a forgotten day or removing a mistaken one renumbers everything after
// it and the numbers never skip or repeat.
//
// Shape of gp_workouts:
//   { days:    { 'YYYY-MM-DD': { type, duration, notes, createdAt, updatedAt } },
//     deleted: { 'YYYY-MM-DD': iso } }
// It is a collection under one key, so it syncs by merging (see
// mergeWorkoutBlobs) rather than newest-wins, which would drop whichever
// gadget logged second.

export const WORKOUT_KEY = 'gp_workouts';
export const WORKOUT_GOAL = 1000;
export const MILESTONES = [10, 25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];
export const WORKOUT_TOMBSTONE_TTL_MS = 60 * 24 * 60 * 60 * 1000;
export const WORKOUTS_CHANGED = 'gp-workouts-changed';

const pad = n => String(n).padStart(2, '0');
export const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const str = v => (typeof v === 'string' ? v : '');

function empty() { return { days: {}, deleted: {} }; }

function clean(v) {
  const out = empty();
  if (!v || typeof v !== 'object') return out;
  for (const [k, x] of Object.entries(v.days || {})) {
    if (DATE_RE.test(k) && x && typeof x === 'object') out.days[k] = x;
  }
  for (const [k, at] of Object.entries(v.deleted || {})) {
    if (DATE_RE.test(k) && typeof at === 'string') out.deleted[k] = at;
  }
  return out;
}

function parse(raw) {
  if (typeof raw !== 'string') return empty();
  try { return clean(JSON.parse(raw)); } catch { return empty(); }
}

// Sorted keys, so two gadgets holding the same record write the same bytes —
// sync compares the strings to decide whether anything changed.
function sortObj(o) { return Object.fromEntries(Object.keys(o).sort().map(k => [k, o[k]])); }
function serialize(log) {
  const days = {};
  for (const [k, x] of Object.entries(log.days)) {
    days[k] = sortObj({
      type: str(x.type), duration: Number.isFinite(x.duration) ? x.duration : null,
      notes: str(x.notes), createdAt: str(x.createdAt), updatedAt: str(x.updatedAt),
    });
  }
  return JSON.stringify({ days: sortObj(days), deleted: sortObj(log.deleted) });
}

export function loadWorkouts() {
  try { return parse(localStorage.getItem(WORKOUT_KEY)); } catch { return empty(); }
}

export function saveWorkouts(log) {
  try { localStorage.setItem(WORKOUT_KEY, serialize(log)); } catch { /* quota */ }
  try { window.dispatchEvent(new CustomEvent(WORKOUTS_CHANGED)); } catch { /* no window */ }
}

export function logWorkout(log, key, type, now = new Date().toISOString()) {
  if (log.days[key]) return log;
  const deleted = { ...log.deleted };
  delete deleted[key];
  return { days: { ...log.days, [key]: { type, duration: null, notes: '', createdAt: now, updatedAt: now } }, deleted };
}

export function removeWorkout(log, key, now = new Date().toISOString()) {
  if (!log.days[key]) return log;
  const days = { ...log.days };
  delete days[key];
  return { days, deleted: { ...log.deleted, [key]: now } };
}

export function editWorkout(log, key, patch, now = new Date().toISOString()) {
  const x = log.days[key];
  if (!x) return log;
  return { ...log, days: { ...log.days, [key]: { ...x, ...patch, updatedAt: now } } };
}

// Every workout, oldest first, carrying its number.
export function numbered(log) {
  return Object.keys(log.days).sort().map((date, i) => ({ date, n: i + 1, ...log.days[date] }));
}

export function numberOf(log, key) {
  if (!log.days[key]) return null;
  return Object.keys(log.days).filter(k => k <= key).length;
}

function addDays(key, n) { const d = parseDay(key); d.setDate(d.getDate() + n); return dayKey(d); }

// A streak is days in a row. Today not done yet does not break it — the day
// is not over — so the current streak counts back from yesterday until today
// is ticked.
export function workoutStats(log, today = dayKey()) {
  const dates = Object.keys(log.days).sort();
  const total = dates.length;
  let longest = 0, run = 0, prev = null;
  for (const d of dates) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let current = 0;
  let cursor = log.days[today] ? today : addDays(today, -1);
  while (log.days[cursor]) { current++; cursor = addDays(cursor, -1); }
  const done = Math.min(total, WORKOUT_GOAL);
  return {
    total,
    remaining: Math.max(0, WORKOUT_GOAL - total),
    pct: Math.round((done / WORKOUT_GOAL) * 1000) / 10,
    current,
    longest,
    doneToday: !!log.days[today],
    next: MILESTONES.find(m => m > total) || null,
  };
}

// ── merge ────────────────────────────────────────────────────────────────
// Per day: the newest entry and the newest deletion are compared, and
// whichever happened last wins. Logging a day again after removing it beats
// the old tombstone; removing it beats the old entry.
const stampOf = x => str(x.updatedAt) || str(x.createdAt);
function pickNewer(a, b) {
  if (!a) return b;
  if (!b) return a;
  const ta = stampOf(a), tb = stampOf(b);
  if (ta !== tb) return ta > tb ? a : b;
  return JSON.stringify(a) >= JSON.stringify(b) ? a : b;
}

export function mergeWorkoutBlobs(localRaw, remoteRaw, now = Date.now()) {
  const a = parse(localRaw), b = parse(remoteRaw);
  const out = empty();
  const keys = new Set([...Object.keys(a.days), ...Object.keys(b.days), ...Object.keys(a.deleted), ...Object.keys(b.deleted)]);
  for (const k of keys) {
    const entry = pickNewer(a.days[k], b.days[k]);
    const da = a.deleted[k] || '', db = b.deleted[k] || '';
    const tomb = da > db ? da : db;
    if (entry && stampOf(entry) > tomb) out.days[k] = entry;
    else if (tomb && now - Date.parse(tomb) < WORKOUT_TOMBSTONE_TTL_MS) out.deleted[k] = tomb;
  }
  return serialize(out);
}

// ── graph ────────────────────────────────────────────────────────────────
// The running total across a date range: where it stood when the range
// opened, and a step up on each workout inside it.
export function cumulativeIn(log, fromKey, toKey) {
  const dates = Object.keys(log.days).sort();
  const before = dates.filter(d => d < fromKey).length;
  const points = [];
  let total = before;
  for (const d of dates) {
    if (d < fromKey || d > toKey) continue;
    total++;
    points.push({ date: d, total });
  }
  return { before, points };
}
