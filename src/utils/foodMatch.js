// Working out a meal's calories from her words alone, against the USDA list
// kept on the gadget — no internet, no AI. Used when the phone is offline.
//
//   "100g of milk, 3 medium whole eggs fried in 1 teaspoon of olive oil"
//     → milk 100 g, eggs 3 × medium, olive oil 1 tsp → calories each.
//
// It understands plain amounts (100g, 2 cups, 1 tbsp, 3 medium, half, a) and
// matches the food by its words. Anything it cannot place is listed as not
// found rather than guessed, so she can type that one herself.

const NUMBER_WORDS = {
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, half: 0.5, quarter: 0.25, dozen: 12,
};

// Units straight to grams (millilitres taken as grams: close enough for
// drinks, and the USDA portions are used instead where they exist).
const MASS = { g: 1, gram: 1, grams: 1, gr: 1, kg: 1000, kilo: 1000, kilos: 1000, ml: 1, l: 1000, liter: 1000, litre: 1000, oz: 28.35, ounce: 28.35, ounces: 28.35, lb: 453.6, lbs: 453.6, pound: 453.6, pounds: 453.6 };

// Household measures, matched against the USDA portion names.
const MEASURES = {
  cup: ['cup'], cups: ['cup'],
  tbsp: ['tbsp', 'tablespoon'], tablespoon: ['tbsp', 'tablespoon'], tablespoons: ['tbsp', 'tablespoon'],
  tsp: ['tsp', 'teaspoon'], teaspoon: ['tsp', 'teaspoon'], teaspoons: ['tsp', 'teaspoon'],
  slice: ['slice'], slices: ['slice'], piece: ['piece', 'serving'], pieces: ['piece', 'serving'],
  serving: ['serving'], servings: ['serving'], scoop: ['scoop', 'serving'],
};
// Spoons have a standard size when the food lists none.
const SPOON_GRAMS = { tsp: 4.9, tbsp: 14.8, cup: 237 };

const SIZES = ['extra large', 'small', 'medium', 'large', 'jumbo'];
// When the food only lists one size, others are scaled from it.
const SIZE_SCALE = { small: 0.8, medium: 0.9, large: 1, 'extra large': 1.12, jumbo: 1.25 };

const FILLER = new Set(['of', 'the', 'some', 'my', 'with', 'and', 'in', 'about', 'around', 'approx', 'approximately', 'x', 'pc', 'pcs']);
const COOKING = ['fried', 'boiled', 'scrambled', 'poached', 'baked', 'roasted', 'grilled', 'steamed', 'cooked', 'raw', 'toasted', 'dried', 'canned'];

// Everyday foods pinned to their plain USDA entry, so "milk" is whole milk
// and not buttermilk, and "olive oil" is olive oil and not a blend. Keyed by
// the food words (singular, no cooking word) — then '|cooking word'. Each value
// is the start of the USDA description.
const EVERYDAY = {
  'milk': 'Milk, whole, 3.25% milkfat', 'whole milk': 'Milk, whole, 3.25% milkfat',
  'skim milk': 'Milk, nonfat, fluid, with added vitamin A and vitamin D (fat free or skim)',
  'nonfat milk': 'Milk, nonfat, fluid, with added vitamin A and vitamin D (fat free or skim)',
  'low fat milk': 'Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D',
  '2% milk': 'Milk, reduced fat, fluid, 2% milkfat, with added vitamin A and vitamin D',
  'egg': 'Egg, whole, raw, fresh', 'whole egg': 'Egg, whole, raw, fresh',
  'egg|fried': 'Egg, whole, cooked, fried', 'egg|boiled': 'Egg, whole, cooked, hard-boiled',
  'egg|scrambled': 'Egg, whole, cooked, scrambled', 'egg|poached': 'Egg, whole, cooked, poached',
  'egg white': 'Egg, white, raw, fresh',
  'olive oil': 'Oil, olive, salad or cooking', 'coconut oil': 'Oil, coconut', 'butter': 'Butter, salted',
  'rice': 'Rice, white, long-grain, regular, enriched, cooked', 'white rice': 'Rice, white, long-grain, regular, enriched, cooked',
  'brown rice': 'Rice, brown, long-grain, cooked',
  'chicken breast': 'Chicken, broilers or fryers, breast, meat only, cooked, roasted',
  'chicken': 'Chicken, broilers or fryers, breast, meat only, cooked, roasted',
  'salmon': 'Fish, salmon, Atlantic, farmed, cooked, dry heat',
  'tuna': 'Fish, tuna, light, canned in water, drained solids',
  'bread': 'Bread, white, commercially prepared', 'white bread': 'Bread, white, commercially prepared',
  'wheat bread': 'Bread, whole-wheat, commercially prepared', 'whole wheat bread': 'Bread, whole-wheat, commercially prepared',
  'sugar': 'Sugars, granulated', 'brown sugar': 'Sugars, brown', 'honey': 'Honey',
  'coffee': 'Beverages, coffee, brewed, prepared with tap water',
  'tea': 'Beverages, tea, black, brewed, prepared with tap water',
  'oat': 'Oats', 'oatmeal': 'Oats', 'rolled oat': 'Oats',
  'apple': 'Apples, raw, with skin', 'banana': 'Bananas, raw', 'orange': 'Oranges, raw, all commercial varieties',
  'orange juice': 'Orange juice, raw', 'greek yogurt': 'Yogurt, Greek, plain, whole milk', 'yogurt': 'Yogurt, plain, whole milk',
  'peanut butter': 'Peanut butter, smooth style, with salt', 'avocado': 'Avocados, raw, all commercial varieties',
  'mango': 'Mangos, raw', 'papaya': 'Papayas, raw', 'pineapple': 'Pineapple, raw, all varieties',
  'spinach': 'Spinach, raw', 'broccoli': 'Broccoli, raw', 'carrot': 'Carrots, raw',
  'tomato': 'Tomatoes, red, ripe, raw, year round average', 'cucumber': 'Cucumber, with peel, raw',
  'potato': 'Potatoes, boiled, cooked in skin, flesh, without salt',
  'sweet potato': 'Sweet potato, cooked, baked in skin, flesh, without salt',
  'pasta': 'Pasta, cooked, enriched, without added salt', 'spaghetti': 'Pasta, cooked, enriched, without added salt',
  'tofu': 'Tofu, raw, firm, prepared with calcium sulfate',
  'ground beef': 'Beef, ground, 85% lean meat / 15% fat, patty, cooked, broiled',
  'cheese': 'Cheese, cheddar', 'cheddar': 'Cheese, cheddar',
};

const stem = w => w
  .replace(/ies$/, 'y')
  .replace(/(ches|shes|sses|xes|oes)$/, m => m.slice(0, -2))
  .replace(/([^s])s$/, '$1');

const words = text => String(text).toLowerCase().replace(/[^a-z0-9./ ]+/g, ' ').split(/\s+/).filter(Boolean);

// "fried in 1 tsp oil", "with 2 slices of bread" start a new item.
export function splitMeal(text) {
  return String(text)
    .toLowerCase()
    .replace(/\b(in|with|plus|and)\s+(?=(\d|a |an |one |two |three |half ))/g, ',')
    .split(/[,;\n+]|\band\b|\bplus\b/)
    .map(s => s.trim())
    .filter(Boolean);
}

function readNumber(token) {
  if (token == null) return null;
  if (/^\d+(\.\d+)?$/.test(token)) return Number(token);
  if (/^\d+\/\d+$/.test(token)) { const [a, b] = token.split('/').map(Number); return b ? a / b : null; }
  if (token in NUMBER_WORDS) return NUMBER_WORDS[token];
  return null;
}

// "100g milk" / "3 medium eggs fried" / "1 tsp olive oil" → parts.
export function parseChunk(chunk) {
  let ws = words(chunk.replace(/(\d)([a-z])/g, '$1 $2'));
  let qty = null, unit = null, size = null;
  const n = readNumber(ws[0]);
  if (n != null) { qty = n; ws = ws.slice(1); }
  if (ws[0] === 'and' && readNumber(ws[1]) === 0.5 && qty != null) { qty += 0.5; ws = ws.slice(2); }
  if (ws[0] in MASS || ws[0] in MEASURES) { unit = ws[0]; ws = ws.slice(1); }
  for (const s of SIZES) {
    const parts = s.split(' ');
    const at = ws.findIndex((w, i) => parts.every((p, j) => ws[i + j] === p));
    if (at >= 0) { size = s; ws.splice(at, parts.length); break; }
  }
  const food = ws.filter(w => !FILLER.has(w) && readNumber(w) == null);
  return { qty: qty ?? 1, hadQty: qty != null, unit, size, food };
}

// Prepared once per list: each food's words, its first phrase, its length.
let indexed = null;
let indexedFor = null;
function index(foods) {
  if (indexedFor === foods) return indexed;
  indexed = foods.map(([desc, kcal, portions, macros]) => {
    const parts = desc.toLowerCase().replace(/\(includes[^)]*\)/g, '').split(',').map(p => words(p.replace(/-/g, ' ')).map(stem));
    return { desc, kcal, portions, macros: macros || [], all: new Set(parts.flat()), head: new Set(parts[0] || []), size: parts.flat().length };
  });
  indexedFor = foods;
  return indexed;
}

// Words that describe a food without changing which food it is.
const PLAIN_WORDS = new Set(['whole', 'fresh', 'plain', 'organic', 'regular', 'homemade']);

function everyday(foods, q) {
  const cook = q.find(w => COOKING.includes(w) && w !== 'raw' && w !== 'cooked');
  const plain = q.filter(w => !COOKING.includes(w));
  const bare = plain.filter(w => !PLAIN_WORDS.has(w));
  const keys = [plain.join(' '), bare.join(' ')];
  const want = keys.map(k => cook && EVERYDAY[`${k}|${cook}`]).find(Boolean) || keys.map(k => EVERYDAY[k]).find(Boolean);
  if (!want) return null;
  const all = index(foods);
  const hit = all.find(f => f.desc === want) || all.find(f => f.desc.startsWith(`${want} (`)) || all.find(f => f.desc.startsWith(want));
  return hit ? { ...hit, score: 99 } : null;
}

// The best USDA food for her words, or null when nothing fits well enough.
export function bestFood(foods, foodWords) {
  const q = foodWords.map(stem);
  if (!q.length) return null;
  const known = everyday(foods, q);
  if (known) return known;
  const cooking = q.filter(w => COOKING.includes(w));
  let best = null;
  for (const f of index(foods)) {
    let score = 0, hits = 0;
    for (const w of q) {
      if (f.head.has(w)) { score += 3; hits += 1; }
      else if (f.all.has(w)) { score += 1.5; hits += 1; }
      else score -= COOKING.includes(w) ? 0.5 : 2;
    }
    if (!hits || !q.some(w => !COOKING.includes(w) && f.all.has(w))) continue;
    // Extra words in the food's own name ("BUTTERmilk", "salmon NUGGETS")
    // usually mean a different food; extra details later on matter less.
    const qs = new Set(q);
    for (const w of f.head) if (!qs.has(w)) score -= 1.2;
    score -= f.size * 0.1;
    if (/breaded|nuggets|tenders|frozen|babyfood|infant|candies|candy/i.test(f.desc)) score -= 2;
    // With no cooking word given, the plain raw or whole food is the usual one.
    if (!cooking.length && (f.all.has('raw') || f.all.has('whole'))) score += 0.6;
    if (/[A-Z]{2,}|®|™/.test(f.desc)) score -= 2; // brand names last
    if (!best || score > best.score) best = { ...f, score };
  }
  return best && best.score > 0 ? best : null;
}

// Grams for ONE of a measure. A portion listed as "2 tbsp = 32 g" is 16 g
// per tablespoon.
function perOne([label, grams]) {
  const n = Number((label.match(/^(\d+(?:\.\d+)?)\s/) || [])[1]);
  return n > 0 ? grams / n : grams;
}

function portionGrams(food, wants) {
  const ps = food.portions || [];
  const hit = ps.find(([label]) => wants.some(w => new RegExp(`^\\d+(\\.\\d+)? ${w}\\b`).test(label)))
    ?? ps.find(([label]) => wants.some(w => new RegExp(`\\b${w}\\b`).test(label)));
  return hit ? perOne(hit) : null;
}

// How many grams she ate, or null when it cannot be told.
export function gramsFor(food, { qty, unit, size }) {
  if (unit && unit in MASS) return qty * MASS[unit];
  if (unit && unit in MEASURES) {
    const g = portionGrams(food, MEASURES[unit]);
    if (g) return qty * g;
    const std = SPOON_GRAMS[MEASURES[unit][0]];
    return std ? qty * std : null;
  }
  if (size) {
    const g = portionGrams(food, [size]);
    if (g) return qty * g;
    const any = SIZES.map(s => [s, portionGrams(food, [s])]).find(([, grams]) => grams);
    if (any) return qty * any[1] * (SIZE_SCALE[size] / SIZE_SCALE[any[0]]);
  }
  // A bare count ("2 eggs", "1 banana"): the medium one, else the food's own
  // first count-like portion.
  const g = portionGrams(food, ['medium']) ?? portionGrams(food, ['large'])
    ?? (() => {
      const p = (food.portions || []).find(([label]) => !/\b(cup|cups|tbsp|tablespoon|tsp|teaspoon|oz|fl oz|lb|g|quart|pint|serving)\b/.test(label));
      return p ? perOne(p) : null;
    })();
  return g ? qty * g : null;
}

/**
 * estimateMeal(foods, text) → { items, total, missing }
 *   items:   [{ name, amount, grams, kcal, protein?, carbs?, fat?, source: 'offline', usdaName }]
 *   missing: the parts of her words it could not work out
 */
export function estimateMeal(foods, text) {
  const items = [];
  const missing = [];
  for (const chunk of splitMeal(text)) {
    const parsed = parseChunk(chunk);
    const food = bestFood(foods, parsed.food);
    const grams = food ? gramsFor(food, parsed) : null;
    if (!food || !grams) { missing.push(chunk); continue; }
    const name = parsed.food.join(' ');
    items.push({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: [parsed.hadQty ? String(parsed.qty) : '', parsed.unit || parsed.size || ''].filter(Boolean).join(' '),
      grams: Math.round(grams),
      kcal: Math.round((food.kcal * grams) / 100),
      // Protein, carbs and fat from the same USDA line, where it lists them.
      ...Object.fromEntries(['protein', 'carbs', 'fat']
        .map((k, i) => [k, food.macros[i]])
        .filter(([, v]) => v != null)
        .map(([k, v]) => [k, Math.round((v * grams) / 10) / 10])),
      source: 'offline',
      usdaName: food.desc,
    });
  }
  return { items, total: items.reduce((s, it) => s + it.kcal, 0), missing };
}
