// Her meal ideas (replaced 2026-10-22 with her 10 new meals: lunch, dinner
// and snacks; breakfast empty for now). Any 1 of each meal time that has
// ideas must stay at or under 1,200 calories, and the range the app shows
// must be the real one.
// Run with:  node src/utils/__tests__/mealIdeas.test.mjs
import { MEAL_IDEAS, DAY_RANGE } from '../../data/mealIdeas.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const by = t => MEAL_IDEAS.filter(i => i.time === t);
const times = ['breakfast', 'lunch', 'dinner', 'snacks'].filter(t => by(t).length);
let lo = Infinity, hi = 0, n = 0;
const walk = (k, sum) => {
  if (k === times.length) { lo = Math.min(lo, sum); hi = Math.max(hi, sum); n++; return; }
  for (const m of by(times[k])) walk(k + 1, sum + m.kcal);
};
walk(0, 0);
ok(`all ${n} mixes stay at or under 1,200 cal (${lo}–${hi})`, hi <= 1200);
ok('the range shown in the app is the real one', DAY_RANGE.kcalLow === lo && DAY_RANGE.kcalHigh === hi);
ok('every meal has a picture, ingredients and steps', MEAL_IDEAS.every(i => i.image && i.ingredients.length && i.steps.length));
ok('every meal has calories, protein, carbs, fats and iron', MEAL_IDEAS.every(i => ['kcal', 'protein', 'carbs', 'fat', 'iron'].every(k => typeof i[k] === 'number')));
ok('every id is new, so an old hearted meal never matches', MEAL_IDEAS.every(i => i.id.startsWith('n-')) && new Set(MEAL_IDEAS.map(i => i.id)).size === MEAL_IDEAS.length);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
