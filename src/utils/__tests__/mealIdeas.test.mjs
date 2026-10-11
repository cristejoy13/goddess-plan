// Her rule (2026-10-11): any 1 breakfast + 1 lunch + 1 dinner + 1 snack must
// come to 1,000–1,200 calories. Checks every mix, so a changed recipe that
// breaks it is caught here.
// Run with:  node src/utils/__tests__/mealIdeas.test.mjs
import { MEAL_IDEAS, DAY_RANGE } from '../../data/mealIdeas.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const by = t => MEAL_IDEAS.filter(i => i.time === t);
ok('five of each', ['breakfast', 'lunch', 'dinner', 'snacks'].every(t => by(t).length === 5));
let lo = Infinity, hi = 0, n = 0;
for (const b of by('breakfast')) for (const l of by('lunch')) for (const d of by('dinner')) for (const s of by('snacks')) {
  const k = b.kcal + l.kcal + d.kcal + s.kcal;
  lo = Math.min(lo, k); hi = Math.max(hi, k); n++;
}
ok(`all ${n} mixes are 1,000–1,200 cal (${lo}–${hi})`, lo >= 1000 && hi <= 1200);
ok('the range shown in the app is the real one', DAY_RANGE.kcalLow === lo && DAY_RANGE.kcalHigh === hi);
ok('every meal has a picture, ingredients and steps', MEAL_IDEAS.every(i => i.image && i.ingredients.length && i.steps.length));
ok('every ingredient has its grams or a pinch', MEAL_IDEAS.every(i => i.ingredients.every(x => /\d\s*g\b|pinch/.test(x))));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
