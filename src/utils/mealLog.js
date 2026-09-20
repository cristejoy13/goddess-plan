// The record of what she actually ate, keyed by date. Two screens write to it
// now — the Meal calendar, where she types a line by hand, and the meal plan in
// Workouts, where choosing a meal for today files it here on its own — so the
// shape and the rules live in one place rather than being re-implemented on
// each side and drifting apart.
//
// Shape:
//   { days: { 'YYYY-MM-DD': [ entry, ... ] }, weights: { 'YYYY-MM-DD': weight },
//     deleted: { id: iso }, updatedAt }
//   entry  = { id, time: 'HH:MM', text, cal: number|null, createdAt, updatedAt,
//              fromPlan?: '<meal name>' }
//   weight = { kg: number|null, updatedAt: iso }
//
// The scale reading lives here rather than under a key of its own because it
// is the same question as the meals — what happened on this date — and one
// date-keyed record means one merge to get right instead of two. A cleared
// weight is stored as kg: null with a fresh stamp, NOT deleted: that is what
// stops another gadget's older copy putting the old number back.
//
// `fromPlan` marks a line that arrived by choosing a meal in the plan rather
// than by typing. It is what lets un-choosing that meal take the line away
// again — and it is cleared the moment she edits the line by hand, because
// from then on the line is hers and the plan has no business removing it.

export const MEAL_LOG_KEY = 'gp_meal_log';

const pad = n => String(n).padStart(2, '0');

// Local date, never toISOString: in Cebu a UTC date string files an evening
// meal under the following day.
export function dateKeyOf(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function dateKey(y, monthIdx, day) {
  return `${y}-${pad(monthIdx + 1)}-${pad(day)}`;
}

export function newEntryId() {
  return `ml_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// Optional on purpose — she will not always know the number, and a box that
// must be filled would push her into guessing. Anything that is not a real
// quantity becomes null rather than being stored as junk.
export function parseCal(v) {
  const n = Number(String(v).trim());
  return Number.isFinite(n) && n > 0 ? Math.round(n) : null;
}

// Kilos, to one decimal place, and only a figure a human scale could produce.
// A typo like 655 is refused rather than stored, because a wrong weight would
// drag a whole week's average with it and she would have no way to see why.
export const MIN_KG = 20;
export const MAX_KG = 400;

export function parseKg(v) {
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  const r = Math.round(n * 10) / 10;
  return r >= MIN_KG && r <= MAX_KG ? r : null;
}

// 62 reads as "62", 62.5 as "62.5". A trailing ".0" on a calendar square is a
// character of noise in a space that has none to spare.
export function formatKg(kg) {
  if (typeof kg !== 'number' || !Number.isFinite(kg)) return '';
  return Number.isInteger(kg) ? String(kg) : kg.toFixed(1);
}

export function weightOn(state, key) {
  const w = state.weights?.[key];
  return typeof w?.kg === 'number' ? w.kg : null;
}

// Writing null clears the day. The stamp is kept either way — see the note on
// the shape above for why a cleared weight is not simply removed.
export function setWeight(state, key, kg) {
  const now = new Date().toISOString();
  return {
    ...state,
    weights: { ...(state.weights || {}), [key]: { kg: kg ?? null, updatedAt: now } },
    updatedAt: now,
  };
}

// The average of every weighing in the seven days ending on a given date.
//
// Real dates walked backwards, exactly as the week calorie total does, so a
// week that starts in the previous month still counts its Monday. Days with no
// weighing are skipped rather than counted as zero — an average dragged down
// by a day she never stood on the scale would be a made-up number.
export function weekWeightAvg(state, year, monthIdx, day) {
  let sum = 0;
  let counted = 0;
  for (let back = 6; back >= 0; back--) {
    const kg = weightOn(state, dateKeyOf(new Date(year, monthIdx, day - back)));
    if (kg != null) { sum += kg; counted += 1; }
  }
  return { avg: counted ? Math.round((sum / counted) * 10) / 10 : null, counted };
}

// Only meals that actually carry a number are counted, and the caller is told
// how many were skipped. A partial figure presented as a whole day would be
// worse than no figure, because it would be acted on.
export function calTotals(entries = []) {
  const withCal = entries.filter(e => typeof e.cal === 'number' && e.cal > 0);
  return {
    total: withCal.reduce((sum, e) => sum + e.cal, 0),
    counted: withCal.length,
    missing: entries.length - withCal.length,
  };
}

export const byTime = (a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0);

// A missing or unreadable log starts empty. It is NEVER seeded with example
// meals: an invented line here would be indistinguishable from something she
// really ate.
export function loadLog() {
  try {
    const raw = JSON.parse(localStorage.getItem(MEAL_LOG_KEY) || 'null');
    if (raw && typeof raw === 'object' && raw.days && typeof raw.days === 'object') {
      return {
        days: raw.days,
        weights: (raw.weights && typeof raw.weights === 'object') ? raw.weights : {},
        deleted: raw.deleted || {},
        updatedAt: raw.updatedAt || '',
      };
    }
  } catch { /* fall through to an empty log */ }
  return { days: {}, weights: {}, deleted: {}, updatedAt: '' };
}

// Returns whether the write actually landed. A meal she watched disappear is
// the one failure this record cannot afford, so a full or blocked store has to
// be reportable rather than swallowed.
export function saveLog(state) {
  try {
    localStorage.setItem(MEAL_LOG_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// ── Writes shared with the plan ───────────────────────────────────────────

// File a planned meal against a date. Idempotent: choosing the same meal twice
// does not produce two lines, and a line she has already written by hand for
// the same meal is left exactly as it is.
export function addPlannedMeal(state, key, { name, time, cal }) {
  const existing = state.days[key] || [];
  if (existing.some(e => e.fromPlan === name)) return state;
  const now = new Date().toISOString();
  return {
    ...state,
    days: {
      ...state.days,
      [key]: [...existing, {
        id: newEntryId(), time, text: name, cal: cal ?? null,
        fromPlan: name, createdAt: now, updatedAt: now,
      }].sort(byTime),
    },
    updatedAt: now,
  };
}

// Un-choosing a meal takes its line away again — but only a line that is still
// the plan's. Once she has edited it, `fromPlan` is gone and the line stays.
// The removal leaves a tombstone so another gadget's copy cannot restore it.
export function removePlannedMeal(state, key, name) {
  const existing = state.days[key] || [];
  const doomed = existing.filter(e => e.fromPlan === name);
  if (doomed.length === 0) return state;
  const left = existing.filter(e => e.fromPlan !== name);
  const days = { ...state.days };
  if (left.length) days[key] = left; else delete days[key];
  const now = new Date().toISOString();
  return {
    ...state,
    days,
    deleted: { ...state.deleted, ...Object.fromEntries(doomed.map(e => [e.id, now])) },
    updatedAt: now,
  };
}

// Read back which planned meals are already filed for a date, so the plan can
// tell at a glance what it has and has not written.
export function plannedNamesOn(state, key) {
  return new Set((state.days[key] || []).filter(e => e.fromPlan).map(e => e.fromPlan));
}
