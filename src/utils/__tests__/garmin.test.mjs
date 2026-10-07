// Calories burned from her watch.
// Run with:  node src/utils/__tests__/garmin.test.mjs
import { withGarminBurn, mergeGarminBlobs, garminBurnOn } from '../garmin.js';
import { dayKey } from '../../../api/burn.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const one = withGarminBurn('', '2026-10-07', 1820, '2026-10-08T00:05:00.000Z');
ok('a day is recorded', garminBurnOn(JSON.parse(one), '2026-10-07') === 1820);
const two = withGarminBurn(one, '2026-10-07', 1905, '2026-10-08T07:00:00.000Z');
ok('a later reading of the same day replaces it', garminBurnOn(JSON.parse(two), '2026-10-07') === 1905);
const phone = withGarminBurn('', '2026-10-06', 1700, '2026-10-07T00:05:00.000Z');
const m = JSON.parse(mergeGarminBlobs(two, phone));
ok('days from both gadgets are kept', garminBurnOn(m, '2026-10-06') === 1700 && garminBurnOn(m, '2026-10-07') === 1905);
ok('both gadgets get the same answer', mergeGarminBlobs(two, phone) === mergeGarminBlobs(phone, two));
ok('a broken copy cannot wipe a good one', garminBurnOn(JSON.parse(mergeGarminBlobs(two, 'junk')), '2026-10-07') === 1905);
ok('no number, no Garmin burn', garminBurnOn({ burns: {} }, '2026-10-07') === null);
// Cebu dates: 00:30 on 8 Oct in Cebu is still 7 Oct in UTC.
const cebuJustAfterMidnight = new Date('2026-10-07T16:30:00.000Z');
ok('"yesterday" is Cebu yesterday', dayKey(-1, cebuJustAfterMidnight) === '2026-10-07');
ok('"today" is Cebu today', dayKey(0, cebuJustAfterMidnight) === '2026-10-08');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
