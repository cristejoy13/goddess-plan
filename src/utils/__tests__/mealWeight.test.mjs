// The daily weigh-in: what counts as a weight, how a week's average is taken,
// and what happens when two gadgets hold different answers for the same day.
// Run with:  node src/utils/__tests__/mealWeight.test.mjs
import { mergeMealLogBlobs } from '../mergeMealLog.js';
import { parseKg, formatKg, setWeight, weightOn, weekWeightAvg } from '../mealLog.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const empty = () => ({ days: {}, weights: {}, deleted: {}, updatedAt: '' });
const P = s => JSON.parse(s);
const blob = weights => JSON.stringify({ days: {}, weights, deleted: {}, updatedAt: '' });

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

// A log written before the scale existed must not lose its meals to the merge.
const beforeWeights = JSON.stringify({
  days: { '2026-09-20': [{ id: 'a', time: '08:00', text: 'rice', cal: 200 }] },
  deleted: {}, updatedAt: '',
});
const mixed = P(mergeMealLogBlobs(beforeWeights, L));
ok('an older log keeps its meals', mixed.days['2026-09-20'].length === 1);
ok('and gains the weight from the other gadget', mixed.weights['2026-09-20'].kg === 62);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
