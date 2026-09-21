// The two numbers the meal calendar carries besides the meals themselves: the
// daily weigh-in and the week's calorie goal. What counts as each, how a week
// is worked out from them, and what happens when two gadgets disagree.
// Run with:  node src/utils/__tests__/mealWeight.test.mjs
import { mergeMealLogBlobs } from '../mergeMealLog.js';
import {
  parseKg, formatKg, setWeight, weightOn, weekWeightAvg,
  parseGoal, setGoal, goalOn, goalForWeek, calsLeft, weekStartKey,
} from '../mealLog.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const empty = () => ({ days: {}, weights: {}, goals: {}, deleted: {}, updatedAt: '' });
const meal = cal => [{ id: 'm' + cal, time: '08:00', text: 'x', cal, createdAt: '', updatedAt: '' }];
const P = s => JSON.parse(s);
const blob = weights => JSON.stringify({ days: {}, weights, deleted: {}, updatedAt: '' });
const gblob = goals => JSON.stringify({ days: {}, weights: {}, goals, deleted: {}, updatedAt: '' });

// ── what counts as a weight ───────────────────────────────────────────────
// A wrong number here drags a whole week's average with it and she has no way
// to see why, so anything a real scale could not produce is refused outright.
ok('a decimal is kept to one place', parseKg('62.53') === 62.5);
ok('a whole number is a weight too', parseKg('62') === 62);
ok('words are not a weight', parseKg('abc') === null);
ok('an empty box is not a weight', parseKg('') === null);
ok('20 kg is too light to be real', parseKg('5') === null);
ok('655 kg is a typo, not a weight', parseKg('655') === null);
ok('a negative is refused', parseKg('-62') === null);
ok('a whole number loses its .0', formatKg(62) === '62' && formatKg(62.5) === '62.5');

// ── writing and clearing ──────────────────────────────────────────────────
let st = setWeight(empty(), '2026-09-21', 62.5);
ok('what is written is what reads back', weightOn(st, '2026-09-21') === 62.5);
st = setWeight(st, '2026-09-21', null);
ok('a cleared day reads as nothing', weightOn(st, '2026-09-21') === null);
ok('a cleared day keeps its stamp', typeof st.weights['2026-09-21'].updatedAt === 'string');

// ── the week's average ────────────────────────────────────────────────────
let w = empty();
w = setWeight(w, '2026-09-14', 60);   // Monday
w = setWeight(w, '2026-09-16', 61);
w = setWeight(w, '2026-09-20', 62);   // Sunday
const a = weekWeightAvg(w, 2026, 8, 20);
ok('the average is of the days she weighed', a.avg === 61);
ok('a day she skipped is left out, not counted as zero', a.counted === 3);

// Sunday 4 October 2026 — the week runs back into September.
let m = empty();
m = setWeight(m, '2026-09-28', 60);
m = setWeight(m, '2026-10-04', 62);
const b = weekWeightAvg(m, 2026, 9, 4);
ok('a week that starts in the previous month still counts it', b.counted === 2 && b.avg === 61);
ok('a week with nothing on the scale has no average', weekWeightAvg(empty(), 2026, 8, 20).avg === null);

// ── two gadgets ───────────────────────────────────────────────────────────
const L = blob({ '2026-09-20': { kg: 62, updatedAt: '2026-09-20T01:00:00.000Z' } });
const R = blob({ '2026-09-21': { kg: 63, updatedAt: '2026-09-21T01:00:00.000Z' } });
const M = P(mergeMealLogBlobs(L, R));
ok('a weight from each gadget survives', M.weights['2026-09-20'].kg === 62 && M.weights['2026-09-21'].kg === 63);
ok('both gadgets reach the same answer', mergeMealLogBlobs(L, R) === mergeMealLogBlobs(R, L));

const older = blob({ d: { kg: 62, updatedAt: '2026-09-20T01:00:00.000Z' } });
const newer = blob({ d: { kg: 64, updatedAt: '2026-09-20T09:00:00.000Z' } });
ok('the later weighing wins', P(mergeMealLogBlobs(older, newer)).weights.d.kg === 64);
ok('and wins whichever side it arrives on', P(mergeMealLogBlobs(newer, older)).weights.d.kg === 64);

// A clear must behave like a deletion: the other gadget cannot undo it.
const cleared = blob({ d: { kg: null, updatedAt: '2026-09-20T09:00:00.000Z' } });
ok('a weight she removed stays removed', P(mergeMealLogBlobs(older, cleared)).weights.d.kg === null);
ok('and stays removed the other way round', P(mergeMealLogBlobs(cleared, older)).weights.d.kg === null);

const ancient = blob({ d: { kg: null, updatedAt: '2020-01-01T00:00:00.000Z' } });
ok('an old clear is forgotten once every gadget has seen it', P(mergeMealLogBlobs(ancient, ancient)).weights.d === undefined);

// ── the week's calorie goal ───────────────────────────────────────────────
// A typo here would make every "left" number on the calendar wrong for a whole
// week, so the range is checked before anything is stored.
ok('1,000 is a goal', parseGoal('1000') === 1000);
ok('a decimal goal rounds to a whole one', parseGoal('1000.6') === 1001);
ok('50 calories a day is a typo', parseGoal('50') === null);
ok('50,000 calories a day is a typo', parseGoal('50000') === null);
ok('words are not a goal', parseGoal('abc') === null);

// The goal belongs to a WEEK, found through that week's Monday.
// September 2026: the 14th is a Monday, the 20th a Sunday.
ok('a Monday is its own week start', weekStartKey(2026, 8, 14) === '2026-09-14');
ok('a Sunday belongs to the Monday before it', weekStartKey(2026, 8, 20) === '2026-09-14');
ok('the next Monday starts a new week', weekStartKey(2026, 8, 21) === '2026-09-21');
// 1 Oct 2026 is a Thursday, so its week began 28 September.
ok('a week crossing the month finds its Monday', weekStartKey(2026, 9, 1) === '2026-09-28');
// 1 Jan 2027 is a Friday, so its week began 28 December 2026.
ok('a week crossing the year finds its Monday', weekStartKey(2027, 0, 1) === '2026-12-28');

// Her own example: a goal of 1,000 set for the week of 14–20 September.
let g = setGoal(empty(), '2026-09-14', 1000);
ok('the goal reads back off its Monday', goalForWeek(g, '2026-09-14') === 1000);
ok('every day of that week sees it', ['14', '15', '16', '17', '18', '19', '20']
  .every(d => goalOn(g, `2026-09-${d}`) === 1000));
ok('and every day of it starts at 1,000 left', ['14', '15', '16', '17', '18', '19', '20']
  .every(d => calsLeft(g, `2026-09-${d}`) === 1000));
ok('the week before does not see it', goalOn(g, '2026-09-13') === null);
ok('the week after does not see it', goalOn(g, '2026-09-21') === null);
ok('a week with no goal has no number to show', calsLeft(g, '2026-09-21') === null);

// Eat 300 of the 1,000 and 700 is left. Her words exactly.
g = { ...g, days: { ...g.days, '2026-09-14': meal(300) } };
ok('eat 300 of 1,000 and 700 is left', calsLeft(g, '2026-09-14') === 700);
ok('the rest of the week is untouched', calsLeft(g, '2026-09-15') === 1000);

// Eating past the goal goes negative. "0 left" and "300 over" are things she
// would do different things about, so they must not read the same.
g = { ...g, days: { ...g.days, '2026-09-16': meal(1200) } };
ok('eating past the goal goes negative', calsLeft(g, '2026-09-16') === -200);

// A meal she has not put a number on must not count as zero against the goal.
let nc = setGoal(empty(), '2026-09-14', 1000);
nc = { ...nc, days: { '2026-09-14': [{ id: 'a', time: '08:00', text: 'rice', cal: null }] } };
ok('a meal with no calories does not eat into the goal', calsLeft(nc, '2026-09-14') === 1000);

// Each week keeps its own number — that is the whole point of a weekly goal.
g = setGoal(g, '2026-09-21', 1500);
ok('the new week has its own goal', calsLeft(g, '2026-09-21') === 1500);
ok('the old week kept its own', calsLeft(g, '2026-09-14') === 700);
g = setGoal(g, '2026-09-21', null);
ok('a cleared goal reads as nothing', goalForWeek(g, '2026-09-21') === null);
ok('and its days go back to showing nothing', calsLeft(g, '2026-09-21') === null);

// Two gadgets, same rules as the weight.
const GA = gblob({ '2026-09-14': { cal: 1000, updatedAt: '2026-09-14T01:00:00.000Z' } });
const GB = gblob({ '2026-09-21': { cal: 1500, updatedAt: '2026-09-21T01:00:00.000Z' } });
const GM = P(mergeMealLogBlobs(GA, GB));
ok('a goal from each gadget survives', GM.goals['2026-09-14'].cal === 1000 && GM.goals['2026-09-21'].cal === 1500);
ok('both gadgets reach the same answer', mergeMealLogBlobs(GA, GB) === mergeMealLogBlobs(GB, GA));
const G1 = gblob({ w: { cal: 1000, updatedAt: '2026-09-14T01:00:00.000Z' } });
const G2 = gblob({ w: { cal: 1200, updatedAt: '2026-09-14T09:00:00.000Z' } });
ok('the later goal wins', P(mergeMealLogBlobs(G1, G2)).goals.w.cal === 1200);
ok('and wins whichever side it arrives on', P(mergeMealLogBlobs(G2, G1)).goals.w.cal === 1200);
const GC = gblob({ w: { cal: null, updatedAt: '2026-09-14T09:00:00.000Z' } });
ok('a goal she removed stays removed', P(mergeMealLogBlobs(G1, GC)).goals.w.cal === null);

// A log written before the scale existed must not lose its meals to the merge.
const beforeWeights = JSON.stringify({
  days: { '2026-09-20': [{ id: 'a', time: '08:00', text: 'rice', cal: 200 }] },
  deleted: {}, updatedAt: '',
});
const mixed = P(mergeMealLogBlobs(beforeWeights, L));
ok('an older log keeps its meals', mixed.days['2026-09-20'].length === 1);
ok('and gains the weight from the other gadget', mixed.weights['2026-09-20'].kg === 62);

// And a log written before goals existed must keep both of the others.
const beforeGoals = JSON.stringify({
  days: { '2026-09-20': [{ id: 'a', time: '08:00', text: 'rice', cal: 200 }] },
  weights: { '2026-09-20': { kg: 62, updatedAt: '2026-09-20T01:00:00.000Z' } },
  deleted: {}, updatedAt: '',
});
const three = P(mergeMealLogBlobs(beforeGoals, GA));
ok('a log from before goals keeps its meals', three.days['2026-09-20'].length === 1);
ok('and its weight', three.weights['2026-09-20'].kg === 62);
ok('and gains the goal', three.goals['2026-09-14'].cal === 1000);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
