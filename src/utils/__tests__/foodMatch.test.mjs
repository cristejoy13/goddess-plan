// Offline calories from her words, against the real USDA list.
// Run with:  node src/utils/__tests__/foodMatch.test.mjs
import foods from '../../../api/_foods.js';
import { estimateMeal, splitMeal } from '../foodMatch.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const meal = t => estimateMeal(foods, t);

ok('a cooking oil after "in" is its own item', splitMeal('3 eggs fried in 1 tsp olive oil').length === 2);
const b = meal('100g of milk, 3 medium whole eggs fried in 1 teaspoon of olive oil');
ok('milk is whole milk, not buttermilk', b.items[0].usdaName.startsWith('Milk, whole, 3.25%') && b.items[0].kcal === 61);
ok('fried eggs are fried, medium sized from large', b.items[1].usdaName === 'Egg, whole, cooked, fried' && b.items[1].grams === 124);
ok('olive oil is olive oil, 1 tsp', b.items[2].usdaName === 'Oil, olive, salad or cooking' && b.items[2].kcal === 40);
ok('1 tbsp is one tablespoon, not the 2 tbsp portion', meal('1 tbsp peanut butter').items[0].grams === 16);
ok('coffee is regular, not decaf', meal('1 cup coffee').items[0].usdaName === 'Beverages, coffee, brewed, prepared with tap water');
ok('half an avocado', meal('half avocado').items[0].grams === 101);
ok('a bare count uses the medium one', meal('1 banana').items[0].grams === 118);
ok('grams are taken as said', meal('150g salmon').items[0].grams === 150);
ok('something unknown is listed as not found, not guessed', meal('2 blorps').missing.length === 1 && meal('2 blorps').items.length === 0);
ok('nothing typed, nothing found', meal('').items.length === 0);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
