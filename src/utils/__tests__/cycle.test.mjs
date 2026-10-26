// Cycle maths: day, phase, next period.
// Run with:  node src/utils/__tests__/cycle.test.mjs
import { today, cycleLength, periodLength, phaseBounds } from '../cycle.js';
let pass = 0, fail = 0;
const t = (name, got, want) => { const ok = JSON.stringify(got) === JSON.stringify(want); ok ? pass++ : fail++; console.log((ok ? '  ok   ' : '  FAIL ') + name + (ok ? '' : `  → ${JSON.stringify(got)}`)); };
const empty = { starts: [], ends: {}, cycleLen: null, periodLen: null };
t('nothing entered: no day', today(empty, '2026-10-26'), null);
const one = { ...empty, starts: ['2026-10-01'] };
t('one start: 28-day cycle', cycleLength(one), { days: 28, from: 'usual' });
t('day 1 is period', today(one, '2026-10-01').phase, 'period');
t('day 26 counts from the first day', today(one, '2026-10-26').day, 26);
t('day 26 of 28 is luteal', today(one, '2026-10-26').phase, 'luteal');
t('day 14 of 28 is ovulation', today(one, '2026-10-14').phase, 'ovulation');
t('day 8 of 28 is follicular', today(one, '2026-10-08').phase, 'follicular');
t('next period in 28 days', today(one, '2026-10-26').next, '2026-10-29');
t('typed length used', cycleLength({ ...one, cycleLen: 31 }), { days: 31, from: 'typed' });
const two = { ...empty, starts: ['2026-09-01', '2026-09-31'.replace('09-31', '10-01')] };
t('gap between periods wins', cycleLength(two), { days: 30, from: 'yours' });
t('logged end sets period length', periodLength({ ...one, ends: { '2026-10-01': '2026-10-04' } }), 4);
t('after a logged end: follicular', today({ ...one, ends: { '2026-10-01': '2026-10-03' } }, '2026-10-04').phase, 'follicular');
t('late: still luteal', today(one, '2026-11-02').late, true);
t('phases of 28/5', phaseBounds(28, 5).map(p => [p.from, p.to]), [[1, 5], [6, 12], [13, 15], [16, 28]]);
console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
