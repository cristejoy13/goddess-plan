// The meal scanner's sums, without a network.
// Run with:  node src/utils/__tests__/scanMeal.test.mjs
import { parseItems, kcalPer100g, settleItem, parseScale } from '../../../api/_scan.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const egg = { description: 'Egg, whole, cooked, fried', foodNutrients: [{ nutrientId: 1062, unitName: 'kJ', value: 821 }, { nutrientId: 1008, unitName: 'KCAL', value: 196 }] };
const milkPowder = { description: 'Milk, dry, whole', foodNutrients: [{ nutrientId: 1008, unitName: 'KCAL', value: 496 }] };

ok('kcal per 100 g is read, not kJ', kcalPer100g(egg) === 196);
ok('no energy, no number', kcalPer100g({ foodNutrients: [] }) === null);

const parsed = parseItems('```json\n{"items":[{"name":"Fried egg","amount":"3 medium","grams":132,"usda":"egg fried","kcal":240},{"name":"","grams":5}]}\n```');
ok('the AI reply is read even when wrapped', parsed.length === 1 && parsed[0].grams === 132);
ok('an unreadable reply gives nothing, not made-up food', parseItems('sorry').length === 0);

const e = settleItem(parsed[0], egg);
ok('USDA calories = grams × per 100 g', e.kcal === 259 && e.source === 'usda');
const m = settleItem({ name: 'Milk', amount: '100 g', grams: 100, usda: 'milk', kcal: 61 }, milkPowder);
ok('a wrong USDA match (milk powder) falls back to the AI guess', m.kcal === 61 && m.source === 'ai');
const n = settleItem({ name: 'Mystery', amount: '', grams: 50, usda: 'x', kcal: 120 }, null);
ok('no USDA match shows the AI guess, marked', n.kcal === 120 && n.source === 'ai');
ok('nothing to go on gives no line', settleItem({ name: 'X', grams: NaN, kcal: NaN }, null) === null);

// The scale.
ok('kilos are read as shown', parseScale('{"value": 52.4, "unit": "kg"}') === 52.4);
ok('pounds become kilos', parseScale({ value: 115.5, unit: 'lb' }) === 52.4);
ok('stone becomes kilos', parseScale({ value: 8.25, unit: 'st' }) === 52.4);
ok('no unit means kilos', parseScale({ value: 60 }) === 60);
ok('an unreadable display gives no number, not a guess', parseScale({ value: null, unit: 'kg' }) === null);
ok('nonsense gives no number', parseScale('cannot see') === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
