// Cycle (2026-10-26): her period dates, and from them the day of her cycle,
// the phase she is in and when the next period is likely. Saved in gp_cycle
// and synced. It starts empty: nothing is assumed until she enters a date.
//
//   { starts: ['2026-10-01', ...],      first day of each period
//     ends: { '2026-10-01': '2026-10-05' },  last day, by start
//     cycleLen: 29 | null,               her usual cycle, if she typed one
//     periodLen: 5 | null,               her usual period, if she typed one
//     method: 'natural' | 'combined' | …  her birth control (METHODS)
//     noBreak: false,                    combined, taken without a break week
//     pillTick: false,                   show the optional daily pill tick
//     pills: { '2026-10-27': true } }    days the pill was ticked
//
// On the combined pill, starts are the first day of each pack instead.

import { PHASES, METHODS, METHOD_PHASES } from '../data/cyclePhases.js';

export const CYCLE_KEY = 'gp_cycle';
const DAY = 24 * 60 * 60 * 1000;

export function loadCycle() {
  try {
    const v = JSON.parse(localStorage.getItem(CYCLE_KEY) || 'null');
    if (v && typeof v === 'object') {
      return {
        starts: Array.isArray(v.starts) ? [...new Set(v.starts.filter(isKey))].sort() : [],
        ends: v.ends && typeof v.ends === 'object' ? v.ends : {},
        cycleLen: okLen(v.cycleLen, 21, 45),
        periodLen: okLen(v.periodLen, 2, 10),
        method: METHODS[v.method] ? v.method : 'natural',
        noBreak: Boolean(v.noBreak),
        pillTick: Boolean(v.pillTick),
        pills: v.pills && typeof v.pills === 'object' ? v.pills : {},
      };
    }
  } catch { /* start empty */ }
  return { starts: [], ends: {}, cycleLen: null, periodLen: null, method: 'natural', noBreak: false, pillTick: false, pills: {} };
}

export const methodOf = c => METHODS[c?.method] || METHODS.natural;
export const PACK = 28, ACTIVE = 21;

export function saveCycle(v) {
  try { localStorage.setItem(CYCLE_KEY, JSON.stringify(v)); } catch { /* kept for this visit */ }
}

function isKey(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
function okLen(n, lo, hi) { const v = Math.round(Number(n)); return Number.isFinite(v) && v >= lo && v <= hi ? v : null; }

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function fromKey(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export const daysBetween = (a, b) => Math.round((fromKey(b) - fromKey(a)) / DAY);
export const addDays = (k, n) => dayKey(new Date(fromKey(k).getTime() + n * DAY));

// Her own average from the gaps between her last few periods; her typed
// number if there are not enough yet; 28 if neither.
export function cycleLength(c) {
  const gaps = [];
  for (let i = c.starts.length - 1; i > 0 && gaps.length < 6; i--) {
    const g = daysBetween(c.starts[i - 1], c.starts[i]);
    if (g >= 21 && g <= 45) gaps.push(g);
  }
  if (gaps.length) return { days: Math.round(gaps.reduce((s, g) => s + g, 0) / gaps.length), from: 'yours' };
  if (c.cycleLen) return { days: c.cycleLen, from: 'typed' };
  return { days: 28, from: 'usual' };
}

export function periodLength(c) {
  const lens = c.starts.filter(s => c.ends[s]).map(s => daysBetween(s, c.ends[s]) + 1).filter(n => n >= 1 && n <= 10);
  if (lens.length) return Math.round(lens.slice(-6).reduce((s, n) => s + n, 0) / Math.min(lens.length, 6));
  return c.periodLen || 5;
}

// The four phases for a cycle of `len` days with periods of `plen` days.
// Ovulation is about 14 days before the next period.
export function phaseBounds(len, plen) {
  const ovu = Math.max(plen + 3, len - 14);
  return [
    { id: 'period', from: 1, to: plen },
    { id: 'follicular', from: plen + 1, to: ovu - 2 },
    { id: 'ovulation', from: ovu - 1, to: ovu + 1 },
    { id: 'luteal', from: ovu + 2, to: len },
  ];
}

export function phaseOf(day, len, plen) {
  const b = phaseBounds(len, plen);
  return (b.find(p => day >= p.from && day <= p.to) || b[b.length - 1]).id;
}

// Where she is today, or null when nothing has been entered yet. The kind
// of birth control decides the answer (see METHODS).
export function today(c, now = dayKey()) {
  const kind = methodOf(c).kind;
  const last = [...c.starts].filter(s => s <= now).pop();
  if (kind === 'steady') {
    // No phases: just how long since the last bleed, if one was logged.
    const day = last ? daysBetween(last, now) + 1 : null;
    const endDay = last && c.ends[last] ? daysBetween(last, c.ends[last]) + 1 : periodLength(c);
    return { kind, last, day, phase: 'steady', bleeding: Boolean(last) && day <= endDay, ended: Boolean(last && c.ends[last]) };
  }
  if (!last) return null;
  if (kind === 'pack') {
    // Packs follow on every 28 days, even when a new one isn't logged.
    const day = (daysBetween(last, now) % PACK) + 1;
    const inBreak = !c.noBreak && day > ACTIVE;
    return {
      kind, last, day, len: PACK, phase: inBreak ? 'break' : 'active', bleeding: inBreak, ended: true,
      breakIn: c.noBreak || inBreak ? null : ACTIVE + 1 - day,
      packIn: PACK + 1 - day,
    };
  }
  const len = cycleLength(c);
  const plen = periodLength(c);
  const day = daysBetween(last, now) + 1;
  // Her logged end day wins; until she logs one, her usual period length.
  const endDay = c.ends[last] ? daysBetween(last, c.ends[last]) + 1 : plen;
  const bleeding = day <= endDay;
  const next = addDays(last, len.days);
  const late = day > len.days;
  const phase = bleeding ? 'period' : late ? 'luteal' : phaseOf(day, len.days, plen) === 'period' ? 'follicular' : phaseOf(day, len.days, plen);
  return { kind, maybe: kind === 'maybe', last, day, len: len.days, lenFrom: len.from, plen, phase, next, inDays: daysBetween(now, next), late, bleeding, ended: Boolean(c.ends[last]) };
}

export const phaseInfo = id => PHASES[id] || METHOD_PHASES[id];

// For Home: where she is today, worded for her kind of birth control, or
// null before anything is entered.
export function cycleToday() {
  const c = loadCycle();
  const now = today(c);
  if (!now) return null;
  const p = phaseInfo(now.phase);
  const label = now.kind === 'steady' ? methodOf(c).label
    : now.kind === 'pack' ? p.name
    : `${p.name} phase${now.maybe ? ' · maybe' : ''}`;
  const sub = now.kind === 'steady' ? 'Steady' : now.kind === 'pack' ? `Pill day ${now.day}` : `Day ${now.day}`;
  return { ...now, name: p.name, color: p.color, label, sub };
}
