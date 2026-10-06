// The 40 kg plan and the calories burned. Run with:
//   node src/utils/__tests__/goals.test.mjs
import { goalTargetOf, isGoalHidden, setGoalHidden, kgPlan, achievedGoals, setReward, claimReward, rewardText, KG_GOAL_ID, WORKOUT_GOAL_ID, goalTarget, goalTotal, addProgress, removeProgress } from '../goals.js';
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

// ── rewards ──
const g0 = { items: [{ id: 'a', text: 'Run', done: '2026-09-20T00:00:00Z' }], rewards: {} };
const g1 = setReward(setReward(g0, 'a', '  New shoes '), KG_GOAL_ID, 'Spa day');
ok('a reward is saved, trimmed', rewardText(g1, 'a') === 'New shoes');
ok('the 40 kg goal has its own reward', rewardText(g1, KG_GOAL_ID) === 'Spa day');
ok('an achieved goal carries its reward', achievedGoals(log({}), g1)[0].reward === 'New shoes');
ok('claiming marks it claimed', Boolean(claimReward(g1, 'a', true).rewards.a.claimed));
ok('unclaiming clears it', claimReward(claimReward(g1, 'a', true), 'a', false).rewards.a.claimed === null);
ok('an empty reward removes it', rewardText(setReward(g1, 'a', ''), 'a') === null);
ok('claiming a goal with no reward does nothing', claimReward(g0, 'a', true) === g0);

// Goals with a number.
ok('the first number is the target', goalTarget('Run 50 km') === 50);
ok('commas are read', goalTarget('Save 10,000 pesos') === 10000);
ok('no number, no target', goalTarget('Be kind') === null);
let ng = { items: [{ id: 'r', text: 'Run 50 km', done: null }], rewards: {} };
ng = addProgress(ng, 'r', 20, '2026-09-20');
ok('progress adds up', goalTotal(ng.items[0]) === 20 && !ng.items[0].done);
ok('zero or words add nothing', addProgress(ng, 'r', 0) === ng && addProgress(ng, 'r', 'x') === ng);
ng = addProgress(ng, 'r', 30.5, '2026-09-21');
ok('reaching the target ticks it', !!ng.items[0].done);
ok('a ticked number goal counts as achieved', achievedGoals(log({}), ng).some(a => a.id === 'r'));
ng = removeProgress(ng, 'r', ng.items[0].progress[1].id);
ok('dropping under the target unticks it', ng.items[0].done === null && goalTotal(ng.items[0]) === 20);
ok('1,000 workouts is achieved on its date', achievedGoals(log({}), none, '2029-01-01')[0].id === WORKOUT_GOAL_ID);
ok('no 1,000 yet, no workout goal', !achievedGoals(log({}), none, null).some(a => a.id === WORKOUT_GOAL_ID));

// Checklist or chart, chosen when the goal is made.
ok('a checklist goal has no bar, even with a number', goalTargetOf({ kind: 'check', text: 'Read 12 books' }) === null);
ok('a chart goal uses the number she typed', goalTargetOf({ kind: 'chart', text: 'Save up', target: 5000 }) === 5000);
ok('a chart goal falls back to the number in its words', goalTargetOf({ kind: 'chart', text: 'Run 50 km' }) === 50);
ok('an older goal keeps the old rule', goalTargetOf({ text: 'Run 50 km' }) === 50);
const chart = { items: [{ id: 'c', kind: 'chart', text: 'Save up', target: 10, done: null }], rewards: {} };
ok('a chart goal ticks itself at its target', addProgress(chart, 'c', 10).items[0].done);
// Deleting a built-in goal hides it from G; nothing behind it is lost.
const hid = setGoalHidden(none, WORKOUT_GOAL_ID, true);
ok('a built-in goal can be deleted from G', isGoalHidden(hid, WORKOUT_GOAL_ID));
ok('a deleted built-in goal is not counted as achieved', !achievedGoals(log({}), hid, '2029-01-01').some(a => a.id === WORKOUT_GOAL_ID));
ok('and it can be brought back', !isGoalHidden(setGoalHidden(hid, WORKOUT_GOAL_ID, false), WORKOUT_GOAL_ID));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
