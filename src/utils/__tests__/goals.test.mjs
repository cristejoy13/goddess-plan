// The 40 kg plan and the calories burned. Run with:
//   node src/utils/__tests__/goals.test.mjs
import { kgPlan, achievedGoals } from '../goals.js';
import { parseBurn, setBurn, burnOn } from '../mealLog.js';
import { mergeMealLogBlobs } from '../mergeMealLog.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const w = (kg, at = '2026-01-01T00:00:00Z') => ({ kg, updatedAt: at });
const log = weights => ({ days: {}, weights, goals: {}, burns: {}, deleted: {} });
const none = { items: [] };

ok('no weigh-in, no plan', kgPlan(log({}), '2026-09-25') === null);
const p = kgPlan(log({ '2026-09-18': w(46), '2026-09-25': w(45.4) }), '2026-09-25');
ok('first weigh-in is the start', p.start.kg === 46);
ok('latest weigh-in is now', p.now.kg === 45.4);
ok('a week later is week 2', p.week === 2);
ok('week 2 aims a kilo under the start', p.aim === 45);
ok('5.4 kg to go', p.toGo === 5.4);
ok('above the aim is not on track', p.onTrack === false);
ok('12 weeks from 46 to 40', p.finish.getMonth() === 11 && p.finish.getDate() === 11);
ok('the aim never goes under 40', kgPlan(log({ '2026-01-01': w(41) }), '2026-09-25').aim === 40);
ok('a cleared day is not a weigh-in', kgPlan(log({ '2026-09-18': { kg: null }, '2026-09-20': w(45) }), '2026-09-25').start.kg === 45);
ok('not reached above 40', achievedGoals(log({ '2026-09-18': w(46) }), none).length === 0);
const won = achievedGoals(log({ '2026-09-18': w(46), '2026-09-25': w(40) }), { items: [{ id: 'a', text: 'Run', done: '2026-09-20T00:00:00Z' }] });
ok('40 kg counts as reached', won.some(g => g.id === 'kg-goal'));
ok('newest achievement first', won[0].id === 'kg-goal' && won[1].id === 'a');

ok('burned is a whole number', parseBurn('612.6') === 613);
ok('words are not burned', parseBurn('abc') === null && parseBurn('') === null);
ok('a typo of 50,000 is refused', parseBurn('50000') === null);
const b = setBurn(log({}), '2026-09-25', 700);
ok('burned is stored for the day', burnOn(b, '2026-09-25') === 700);
const A = JSON.stringify({ ...log({}), burns: { '2026-09-25': { cal: 700, updatedAt: '2026-09-25T02:00:00Z' } } });
const B = JSON.stringify({ ...log({}), burns: { '2026-09-25': { cal: 500, updatedAt: '2026-09-25T01:00:00Z' } } });
ok('the newer burned number wins a sync', JSON.parse(mergeMealLogBlobs(A, B)).burns['2026-09-25'].cal === 700);
ok('and the merge agrees both ways', mergeMealLogBlobs(A, B) === mergeMealLogBlobs(B, A));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
