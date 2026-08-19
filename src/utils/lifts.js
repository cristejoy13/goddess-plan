// ─── LIFT LOG ──────────────────────────────────────────────────────────────
// What you are lifting right now, and what you are lifting next. One
// localStorage key holds every exercise so the whole log rides the normal
// device sync, and nothing is ever written for an exercise you have not
// touched — an untouched lift falls back to the sets and reps printed in the
// plan, so the app never pretends to know a weight you never entered.

const STORE_KEY = 'gp_lifts';

export function liftKey(name) {
  // "2. Bulgarian Split Squat" and "Bulgarian Split Squat" are the same lift —
  // the ordering prefix belongs to the day's layout, not to the exercise.
  return name.replace(/^\s*\d+\.\s*/, '').trim();
}

// The plan already prints "4 × 10–12 reps"; that is the starting point until
// you change it, so there is nothing to type in on day one.
export function parsePlanned(detail = '') {
  const m = detail.match(/(\d+)\s*×\s*([\d]+(?:\s*[–-]\s*\d+)?)/);
  if (!m) return { sets: null, reps: null };
  return { sets: Number(m[1]), reps: m[2].replace(/\s+/g, '') };
}

// Anything prescribed as sets × reps gets a log — every training day, not just
// the glute days. That means the main lifts, the finisher, all the back and
// shoulder work, and the loaded mobility drills. Held stretches, timed holds,
// and the forearm-stand drills are prescribed in seconds, walks, or hops, so
// they fall out naturally: there is no weight to record on a 45-second hold.
// Videos and the walk are excluded outright.
const REP_SCHEME = /\d+\s*×\s*\d+(\s*[–-]\s*\d+)?\s*reps/i;

export function isTrackable(ex) {
  if (!ex || ex.heading || ex.url) return false;
  return REP_SCHEME.test(ex.detail || '');
}

// How much to add when a lift starts feeling easy. Barbell lifts move in plate
// jumps, dumbbells in pairs, and the small shoulder work in the tiniest step
// there is — adding 2.5 kg to a prone Y raise is how shoulders get hurt.
export function stepFor(name) {
  const n = name.toLowerCase();
  if (/(y raise|t & w|external rotation|scaption|pull-apart|serratus|face pull)/.test(n)) return 0.5;
  if (/(barbell|squat|deadlift|rdl|hip thrust|hyperextension)/.test(n)) return 2.5;
  if (/(dumbbell|split squat|step-up|row|pullover)/.test(n)) return 2;
  return 1;
}

function round(n) {
  return Math.round(n * 100) / 100;
}

export function suggestNext(current, name) {
  const cur = Number(current);
  if (!Number.isFinite(cur) || cur <= 0) return null;
  return round(cur + stepFor(name));
}

export function loadLifts() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function saveLift(name, patch) {
  const all = loadLifts();
  const key = liftKey(name);
  const next = { ...all[key], ...patch, updatedAt: new Date().toISOString() };
  // An empty entry is deleted rather than stored, so clearing a lift really
  // does return it to the printed plan instead of leaving a hollow record.
  const meaningful = ['sets', 'reps', 'kg', 'nextKg'].some(k => {
    const v = next[k];
    return v !== null && v !== undefined && v !== '';
  });
  const all2 = { ...all };
  if (meaningful) all2[key] = next;
  else delete all2[key];
  try { localStorage.setItem(STORE_KEY, JSON.stringify(all2)); } catch { /* storage full or blocked */ }
  return all2;
}

export function clearLift(name) {
  const all = loadLifts();
  const all2 = { ...all };
  delete all2[liftKey(name)];
  try { localStorage.setItem(STORE_KEY, JSON.stringify(all2)); } catch { /* storage full or blocked */ }
  return all2;
}
