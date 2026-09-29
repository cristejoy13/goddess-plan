// Saturday run and Sunday bike minutes. Run with:
//   node src/utils/__tests__/cardioLog.test.mjs
import { setMinutes, cardioStats, dateFor, mergeCardioBlobs } from '../cardioLog.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const empty = () => ({ run: {}, bike: {} });

let log = empty();
ok('nothing logged, no last or best', cardioStats(log, 'run').best === null);
log = setMinutes(log, 'run', '2026-09-19', 30, '2026-09-19T10:00:00Z');
log = setMinutes(log, 'run', '2026-09-26', 28, '2026-09-26T10:00:00Z');
let s = cardioStats(log, 'run');
ok('last is the newest day', s.last.min === 28);
ok('best is the longest', s.best.min === 30);
log = setMinutes(log, 'run', '2026-10-03', 33, '2026-10-03T10:00:00Z');
ok('beating it moves the best', cardioStats(log, 'run').best.min === 33);
log = setMinutes(log, 'run', '2026-10-03', 31, '2026-10-03T10:05:00Z');
ok('changing a day changes it', cardioStats(log, 'run').best.min === 31);
log = setMinutes(log, 'run', '2026-10-03', '', '2026-10-03T10:06:00Z');
ok('clearing a day removes it from the numbers', cardioStats(log, 'run').last.min === 28);
ok('run and bike are kept apart', cardioStats(log, 'bike').best === null);
ok('minutes are whole numbers', setMinutes(empty(), 'bike', '2026-09-27', 45.6).bike['2026-09-27'].min === 46);

// Wednesday 30 Sep 2026: Saturday's page logs to Sat 26 Sep; today logs today.
const wed = new Date(2026, 8, 30);
ok('Saturday page on a Wednesday → last Saturday', dateFor(5, wed) === '2026-09-26');
ok('today page → today', dateFor(2, wed) === '2026-09-30');

const phone = JSON.stringify(setMinutes(empty(), 'run', '2026-09-26', 30, '2026-09-26T10:00:00Z'));
const ipad = JSON.stringify(setMinutes(empty(), 'bike', '2026-09-27', 50, '2026-09-27T10:00:00Z'));
const m = JSON.parse(mergeCardioBlobs(phone, ipad));
ok('merge keeps both gadgets', m.run['2026-09-26'].min === 30 && m.bike['2026-09-27'].min === 50);
ok('merge is the same both ways', mergeCardioBlobs(phone, ipad) === mergeCardioBlobs(ipad, phone));
const newer = JSON.stringify(setMinutes(JSON.parse(phone), 'run', '2026-09-26', 35, '2026-09-26T11:00:00Z'));
ok('newer edit wins', JSON.parse(mergeCardioBlobs(phone, newer)).run['2026-09-26'].min === 35);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
