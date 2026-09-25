// The record of what she actually ate, keyed by date. Two screens write to it
// now — the Meal calendar, where she types a line by hand, and the meal plan in
// Workouts, where choosing a meal for today files it here on its own — so the
// shape and the rules live in one place rather than being re-implemented on
// each side and drifting apart.
//
// Shape:
//   { days: { 'YYYY-MM-DD': [ entry, ... ] }, weights: { 'YYYY-MM-DD': weight },
//     goals: { 'YYYY-MM-DD': goal }, burns: { 'YYYY-MM-DD': burn },
//     deleted: { id: iso }, updatedAt }
//   entry  = { id, time: 'HH:MM', text, cal: number|null, createdAt, updatedAt,
//              fromPlan?: '<meal name>' }
//   weight = { kg: number|null, updatedAt: iso }
//   goal   = { cal: number|null, updatedAt: iso }   ← keyed by that week's MONDAY
//   burn   = { cal: number|null, updatedAt: iso }   ← calories burned that day
//
// The goal is how many calories she means to eat on each day of ONE week, and
// it is keyed by the Monday of that week rather than by each day. She sets a
// different number most weeks, so a goal stored per day would have to be typed
// seven times and could drift out of step with itself; a goal stored per week
// is typed once and cannot disagree with itself.
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

// The Monday of the week a date falls in. Monday-first, because the calendar
// grid is Monday-first and the week she means is the row she is looking at.
// Built with a real Date so it rolls back into the previous month, and the
// previous year, on its own.
export function weekStartKeyOf(d = new Date()) {
  const back = (d.getDay() + 6) % 7;
  return dateKeyOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() - back));
}

export function weekStartKey(y, monthIdx, day) {
  return weekStartKeyOf(new Date(y, monthIdx, day));
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

// Calories burned on a day — optional, typed by her, never estimated. Whole
// numbers, and only a figure a day could plausibly burn, for the same reason
// the weight refuses a typo: a wrong number here flips "deficit" into "gained".
export const MIN_BURN = 1;
export const MAX_BURN = 10000;

export function parseBurn(v) {
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  const r = Math.round(n);
  return r >= MIN_BURN && r <= MAX_BURN ? r : null;
}

export function burnOn(state, key) {
  const b = state.burns?.[key];
  return typeof b?.cal === 'number' ? b.cal : null;
}

// Writing null clears the day, stamp kept — the same rule as the weight.
export function setBurn(state, key, cal) {
  const now = new Date().toISOString();
  return {
    ...state,
    burns: { ...(state.burns || {}), [key]: { cal: cal ?? null, updatedAt: now } },
    updatedAt: now,
  };
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

// A day's ceiling in calories. Whole numbers only, and only a figure a day of
// eating could plausibly be held to — a goal of 5 or of 50,000 is a typo, and
// a typo here would make every "left" number on the calendar wrong for a week.
export const MIN_GOAL = 100;
export const MAX_GOAL = 20000;

export function parseGoal(v) {
  const n = Number(String(v).trim());
  if (!Number.isFinite(n) || n <= 0) return null;
  const r = Math.round(n);
  return r >= MIN_GOAL && r <= MAX_GOAL ? r : null;
}

// The goal in force on a date — read through that date's Monday, so one number
// answers for all seven days of its week and no other.
export function goalOn(state, key) {
  const g = state.goals?.[weekStartKeyOf(new Date(`${key}T12:00:00`))];
  return typeof g?.cal === 'number' ? g.cal : null;
}

export function goalForWeek(state, mondayKey) {
  const g = state.goals?.[mondayKey];
  return typeof g?.cal === 'number' ? g.cal : null;
}

// Writing null clears the week's goal. The stamp is kept either way, for the
// same reason a cleared weight keeps one: without it another gadget's older
// copy would put the old goal straight back.
export function setGoal(state, mondayKey, cal) {
  const now = new Date().toISOString();
  return {
    ...state,
    goals: { ...(state.goals || {}), [mondayKey]: { cal: cal ?? null, updatedAt: now } },
    updatedAt: now,
  };
}

// What is left of a day's goal after what she has written down.
//
// Returns null when that week has no goal — there is no "left" without a
// ceiling to be left of, and showing the eaten total in its place under the
// same colour would be two different facts wearing one face.
//
// A day she has not eaten on yet reads as the whole goal, which is what she
// asked for: set 1,000 on Monday and every day of that week starts at 1,000.
// Eating past the goal goes NEGATIVE rather than stopping at zero, because
// "0 left" and "300 over" are things she would act on differently.
export function calsLeft(state, key) {
  const goal = goalOn(state, key);
  if (goal == null) return null;
  return goal - calTotals(state.days?.[key] || []).total;
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
        goals: (raw.goals && typeof raw.goals === 'object') ? raw.goals : {},
        burns: (raw.burns && typeof raw.burns === 'object') ? raw.burns : {},
        deleted: raw.deleted || {},
        updatedAt: raw.updatedAt || '',
      };
    }
  } catch { /* fall through to an empty log */ }
  return { days: {}, weights: {}, goals: {}, burns: {}, deleted: {}, updatedAt: '' };
}

// Returns whether the write actually landed. A meal she watched disappear is
// the one failure this record cannot afford, so a full or blocked store has to
// be reportable rather than swallowed.
export function saveLog(state) {
  try {
    localStorage.setItem(MEAL_LOG_KEY, JSON.stringify(state));
    // A new weight may have just reached a goal; the goals watcher listens.
    try { window.dispatchEvent(new Event('gp-goals-changed')); } catch { /* no window in tests */ }
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
