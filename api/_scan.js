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
// Fastest first. Measured live on her key (2026-10-07): 3.5 Flash-Lite
// ~0.4 s, 3.5 Flash ~1.2 s, 3.8 Flash no answer in 20 s. The AI only names
// the foods and their grams — the calories come from USDA — so the light
// model is enough, and she asked for an answer in one to three seconds.
export const GEMINI_MODELS = ['gemini-3.5-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash'];

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
    '- protein, carbs, fat: your own best estimate in grams for that amount, as numbers.',
    'Cooking fat she mentions (oil, butter) is its own item.',
    'Reply with JSON only: {"items":[{"name":"","amount":"","grams":0,"usda":"","kcal":0,"protein":0,"carbs":0,"fat":0}]}',
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
      protein: Number(it?.protein),
      carbs: Number(it?.carbs),
      fat: Number(it?.fat),
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

// Protein, carbs and fat per 100 g from one USDA search result (2026-10-10).
// Each is null when USDA does not list it, never guessed.
const MACRO_IDS = { protein: 1003, fat: 1004, carbs: 1005 };
export function macrosPer100g(food) {
  const ns = Array.isArray(food?.foodNutrients) ? food.foodNutrients : [];
  const out = {};
  for (const [k, id] of Object.entries(MACRO_IDS)) {
    const n = ns.find(x => x.nutrientId === id);
    const v = Number(n?.value);
    out[k] = Number.isFinite(v) && v >= 0 ? v : null;
  }
  return out;
}

const grams1 = v => Math.round(v * 10) / 10;
// The AI's own protein/carbs/fat, only where it gave a real number.
function aiMacros(item) {
  const out = {};
  for (const k of ['protein', 'carbs', 'fat']) {
    if (Number.isFinite(item[k]) && item[k] >= 0) out[k] = grams1(item[k]);
  }
  return out;
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
      const per = macrosPer100g(usdaFood);
      const macros = { ...aiMacros(item) };
      for (const k of ['protein', 'carbs', 'fat']) if (per[k] != null) macros[k] = grams1((per[k] * item.grams) / 100);
      return { ...base(item), kcal: usda, ...macros, source: 'usda', usdaName: usdaFood.description || '' };
    }
  }
  if (ai != null) return { ...base(item), kcal: ai, ...aiMacros(item), source: 'ai' };
  return null;
}

function base(item) {
  return {
    name: item.name,
    amount: item.amount,
    grams: Number.isFinite(item.grams) && item.grams > 0 ? Math.round(item.grams) : null,
  };
}

// ── the scale ────────────────────────────────────────────────────────────
export function buildScalePrompt() {
  return [
    'This is a photo of a bathroom scale display.',
    'Read the weight number shown on the display exactly as shown, including any decimal.',
    'Say which unit the display shows: "kg", "lb" or "st" (stone). If no unit is visible, use "kg".',
    'If you cannot clearly read a number, use null. Never guess a number you cannot see.',
    'Reply with JSON only: {"value": 0.0, "unit": "kg"}',
  ].join('\n');
}

// Gemini's reply → kilos, rounded to 0.1, or null. Pounds and stone are
// converted, because the app keeps every weight in kilos.
export function parseScale(raw) {
  let data = raw;
  if (typeof raw === 'string') {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { data = JSON.parse(m[0]); } catch { return null; }
  }
  const v = Number(data?.value);
  if (!Number.isFinite(v) || v <= 0) return null;
  const unit = String(data?.unit || 'kg').toLowerCase();
  const kg = unit.startsWith('lb') ? v * 0.45359237 : unit.startsWith('st') ? v * 6.35029318 : v;
  return Math.round(kg * 10) / 10;
}

// ── A whole typical day, for sign-up ─────────────────────────────────────
export function buildDayPrompt(text) {
  return [
    'Someone describes what they usually eat in a day:',
    `"${text}"`,
    'Estimate the total for one typical day.',
    'Reply with JSON only: {"calories": 0, "protein": 0, "summary": ""}',
    '- calories and protein (grams) as whole numbers for the whole day.',
    '- summary: one short, kind sentence in plain words naming the main foods, no advice.',
    'If the text does not describe food, use calories 0.',
  ].join('\n');
}

export function parseDay(raw) {
  let data = raw;
  if (typeof raw === 'string') {
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { data = JSON.parse(m[0]); } catch { return null; }
  }
  const calories = Math.round(Number(data?.calories));
  const protein = Math.round(Number(data?.protein));
  if (!(calories > 0 && calories < 15000)) return null;
  return { calories, protein: protein > 0 ? protein : null, summary: String(data?.summary || '').slice(0, 200) };
}

// Any real app code may use the scanner (2026-10-10: everyone who signs up
// gets it). Codes look like GP- and twelve letters/digits from this alphabet.
export const CODE_RE = /^GP-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{12}$/;
export const okCode = v => CODE_RE.test(String(v || '').trim().toUpperCase());
