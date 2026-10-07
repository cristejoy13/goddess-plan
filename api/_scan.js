// The working parts of the meal scanner, kept apart from the request handler
// so they can be tested without a network.
//
// How a scan works:
//   1. Gemini reads her words and/or her photo and lists each food with how
//      many grams were eaten, a short USDA search phrase, and its own calorie
//      estimate.
//   2. Each food is looked up in the USDA FoodData Central list, which gives
//      real calories per 100 g. grams × that = the calories shown.
//   3. If the USDA match looks wrong (wildly off from what the food should
//      be), or nothing matched, Gemini's own estimate is used instead and the
//      line is marked as an AI guess, so she knows which numbers to trust.

// Tried in order. Google keeps the 2.5 models for accounts that already used
// them, so a new key needs the 3.x line (checked 2026-10-07, all free tier).
// If one is busy or not offered to this key, the next is tried.
// On her key (checked live 2026-10-07) 3.5 Flash answers in under 2 s while
// 3.8 Flash did not answer within 20 s, so 3.5 Flash goes first.
export const GEMINI_MODELS = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'];

export function buildPrompt(text) {
  return [
    'You are a nutrition assistant. List every food and drink in this meal.',
    text
      ? `Her own description (treat its amounts as correct): "${text}"`
      : 'There is no description; work only from the photo.',
    'Use the photo, if there is one, for anything the description leaves out.',
    'For each item give:',
    '- name: short plain English, e.g. "Fried egg"',
    '- amount: what she said or what you see, e.g. "3 medium", "100 g", "1 tsp"',
    '- grams: the edible weight eaten, as a number. Convert units (1 tsp oil = 4.5 g, 1 tbsp oil = 13.5 g, 1 medium egg = 44 g, 1 large egg = 50 g, 1 cup cooked rice = 158 g, 100 ml milk = 103 g).',
    '- usda: a short search phrase for the USDA FoodData Central database, e.g. "egg whole cooked fried", "milk whole", "oil olive".',
    '- kcal: your own best calorie estimate for that amount, as a number.',
    'Cooking fat she mentions (oil, butter) is its own item.',
    'Reply with JSON only: {"items":[{"name":"","amount":"","grams":0,"usda":"","kcal":0}]}',
  ].join('\n');
}

// Gemini's reply → a clean list. Anything unusable is dropped, never invented.
export function parseItems(raw) {
  let data = raw;
  if (typeof raw === 'string') {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return [];
    try { data = JSON.parse(m[0]); } catch { return []; }
  }
  const items = Array.isArray(data?.items) ? data.items : [];
  return items
    .map(it => ({
      name: String(it?.name || '').trim().slice(0, 80),
      amount: String(it?.amount || '').trim().slice(0, 40),
      grams: Number(it?.grams),
      usda: String(it?.usda || it?.name || '').trim().slice(0, 80),
      kcal: Number(it?.kcal),
    }))
    .filter(it => it.name && ((Number.isFinite(it.grams) && it.grams > 0) || (Number.isFinite(it.kcal) && it.kcal >= 0)));
}

// Calories per 100 g from one USDA search result, or null.
export function kcalPer100g(food) {
  const ns = Array.isArray(food?.foodNutrients) ? food.foodNutrients : [];
  const kcal = n => String(n.unitName || '').toUpperCase() === 'KCAL';
  const pick = ns.find(n => n.nutrientId === 1008 && kcal(n))
    || ns.find(n => (n.nutrientId === 2047 || n.nutrientId === 2048) && kcal(n))
    || ns.find(n => /energy/i.test(n.nutrientName || '') && kcal(n));
  const v = Number(pick?.value);
  return Number.isFinite(v) && v >= 0 ? v : null;
}

// Decide one line's calories from the USDA match and the AI's estimate.
export function settleItem(item, usdaFood) {
  const per100 = usdaFood ? kcalPer100g(usdaFood) : null;
  const ai = Number.isFinite(item.kcal) && item.kcal >= 0 ? Math.round(item.kcal) : null;
  const hasGrams = Number.isFinite(item.grams) && item.grams > 0;
  if (per100 != null && hasGrams) {
    const usda = Math.round((per100 * item.grams) / 100);
    // A USDA match far from the AI's figure is more likely the wrong food
    // ("milk" matching dried milk powder) than a wrong estimate.
    const plausible = ai == null || ai === 0 || usda === 0
      ? Math.abs(usda - (ai || 0)) <= 60
      : usda / ai <= 2.5 && usda / ai >= 0.4;
    if (plausible) {
      return { ...base(item), kcal: usda, source: 'usda', usdaName: usdaFood.description || '' };
    }
  }
  if (ai != null) return { ...base(item), kcal: ai, source: 'ai' };
  return null;
}

function base(item) {
  return {
    name: item.name,
    amount: item.amount,
    grams: Number.isFinite(item.grams) && item.grams > 0 ? Math.round(item.grams) : null,
  };
}
