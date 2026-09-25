// Her goals: one built in — reach 40 kg, losing half a kilo a week — and any
// others she writes herself.
//
// The kilo goal is never typed. It is read from the weigh-ins in the meal
// calendar: the FIRST weigh-in is the start, the LATEST is where she is now.
// Until she has stood on the scale once there is no plan to show, and the card
// says so rather than guessing a start from the profile.
//
// Shape of gp_goals (synced):
//   { items: [ { id, text, done: iso|null, createdAt, updatedAt } ], updatedAt }
//
// Which goals have already had their confetti is kept per device, under
// gp_goals_celebrated, NOT synced: reaching a goal on the phone should still
// throw confetti the first time she opens the laptop.

import { dateKeyOf } from './mealLog.js';

export const GOALS_KEY = 'gp_goals';
export const CELEBRATED_KEY = 'gp_goals_celebrated';
export const KG_GOAL_ID = 'kg-goal';
export const TARGET_KG = 40;
export const KG_PER_WEEK = 0.5;

const round1 = n => Math.round(n * 10) / 10;
const DAY_MS = 24 * 60 * 60 * 1000;

function dayDiff(fromKey, toKey) {
  const a = new Date(`${fromKey}T12:00:00`);
  const b = new Date(`${toKey}T12:00:00`);
  return Math.round((b - a) / DAY_MS);
}

// Every weigh-in, oldest first. Cleared days (kg: null) are skipped.
function weighIns(log) {
  return Object.entries(log?.weights || {})
    .filter(([, w]) => typeof w?.kg === 'number' && Number.isFinite(w.kg))
    .map(([date, w]) => ({ date, kg: w.kg }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}

/**
 * The 40 kg plan, worked out from real weigh-ins. Null until there is one.
 *
 * Week 1 starts on the day of the first weigh-in and its aim is half a kilo
 * under the start; every week after takes another half kilo off, never going
 * below the target.
 */
export function kgPlan(log, todayKey = dateKeyOf()) {
  const all = weighIns(log);
  if (!all.length) return null;
  const start = all[0];
  const now = all[all.length - 1];
  const days = Math.max(0, dayDiff(start.date, todayKey));
  const week = Math.floor(days / 7) + 1;
  const aim = Math.max(TARGET_KG, round1(start.kg - KG_PER_WEEK * week));
  const totalWeeks = Math.max(0, Math.ceil(round1(start.kg - TARGET_KG) / KG_PER_WEEK));
  const finish = new Date(`${start.date}T12:00:00`);
  finish.setDate(finish.getDate() + totalWeeks * 7);
  const span = start.kg - TARGET_KG;
  const progress = span > 0 ? Math.min(1, Math.max(0, (start.kg - now.kg) / span)) : 1;
  const reachedAt = all.find(w => w.date >= start.date && w.kg <= TARGET_KG);
  return {
    start, now, week, aim,
    toGo: Math.max(0, round1(now.kg - TARGET_KG)),
    lost: round1(start.kg - now.kg),
    onTrack: now.kg <= aim,
    finish,
    progress,
    reached: now.kg <= TARGET_KG,
    reachedOn: now.kg <= TARGET_KG ? (reachedAt?.date || now.date) : null,
  };
}

export function loadGoals() {
  try {
    const raw = JSON.parse(localStorage.getItem(GOALS_KEY) || 'null');
    if (raw && Array.isArray(raw.items)) return { items: raw.items, updatedAt: raw.updatedAt || '' };
  } catch { /* start empty */ }
  return { items: [], updatedAt: '' };
}

export function saveGoals(goals) {
  try {
    localStorage.setItem(GOALS_KEY, JSON.stringify({ ...goals, updatedAt: new Date().toISOString() }));
    window.dispatchEvent(new Event('gp-goals-changed'));
    return true;
  } catch {
    return false;
  }
}

export function newGoalId() {
  return `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Everything achieved so far, newest first: the kilo goal once the latest
 * weigh-in is at or under 40, and every goal she has ticked.
 */
export function achievedGoals(log, goals) {
  const out = [];
  const plan = kgPlan(log);
  if (plan?.reached) {
    out.push({ id: KG_GOAL_ID, text: `Reached ${TARGET_KG} kg`, at: plan.reachedOn });
  }
  for (const g of goals.items) {
    if (g.done) out.push({ id: g.id, text: g.text, at: g.done.slice(0, 10) });
  }
  return out.sort((a, b) => (a.at < b.at ? 1 : a.at > b.at ? -1 : 0));
}

export function loadCelebrated() {
  try {
    const raw = JSON.parse(localStorage.getItem(CELEBRATED_KEY) || 'null');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

export function saveCelebrated(map) {
  try { localStorage.setItem(CELEBRATED_KEY, JSON.stringify(map)); } catch { /* confetti may repeat */ }
}
