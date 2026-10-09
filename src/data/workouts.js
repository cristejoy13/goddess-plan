// ─── THE WEEK ──────────────────────────────────────────────────────────────
// Her plan of 2026-10-10, Monday to Sunday:
//   Mon  Glutes A — hip thrust, RDL, Bulgarian split squat · abs finisher
//   Tue  Pilates or yoga (Jessica Diễm or Nicole) · jump rope or Zone 2
//   Wed  Upper body & core — Pilates by Izzy · jump rope or Zone 2
//   Thu  Glutes B — cable kickback, hip abduction, step-up · abs finisher
//   Fri  Pilates or yoga, same as Tue · jump rope or Zone 2
//   Sat  Glutes C — dumbbell squat, side squat, reverse lunge · abs finisher
//   Sun  Biking, then swimming at 5 PM
// An easy walk every day. Three main lifts on each glute day, never shared;
// the abs finisher is her own ABS video. They progress by reps first, then a
// little weight — never by adding exercises.
//
// Lift names match the old plan where the lift is the same, because the lift
// log is keyed by name — renaming "Barbell Hip Thrust" would orphan her logged
// weights.

// ── VIDEOS ── Kept exactly as they were; only the days moved.
// PILATES BY IZZY — 4 core workouts + her full CORE WORKOUTS playlist.
const IZZY_ABS = [
  { name: 'Abs (Izzy) — 20 Min Pilates Abs & Deep Core', detail: 'PILATES BY IZZY · deep core sculpt & tone, no equipment', url: 'https://www.youtube.com/watch?v=XmbOXzKIjaU' },
  { name: 'Abs (Izzy) — 20 Min Ab Burn',                 detail: 'PILATES BY IZZY · no-equipment core, abs & waist', url: 'https://www.youtube.com/watch?v=TV1yswlJnIY' },
  { name: 'Abs (Izzy) — 15 Min Deep Core',               detail: 'PILATES BY IZZY · intermediate–advanced deep core, optional equipment', url: 'https://www.youtube.com/watch?v=cPVrEm3C-N4' },
  { name: 'Abs (Izzy) — 15 Min Core Strength',           detail: 'PILATES BY IZZY · 25 Day Challenge S2 Day 2 · intermediate core', url: 'https://www.youtube.com/watch?v=mn8uPZFjycY' },
  { name: 'Abs (Izzy) — CORE WORKOUTS Playlist',         detail: 'PILATES BY IZZY · whole core playlist · pick by mood', url: 'https://www.youtube.com/playlist?list=PLefYzZnhersYvg6wIbgePfGmFs_nB6yH7' },
];

// Move With Nicole — 5 short 30-minute full-body workouts.
const NICOLE_FULLBODY = [
  { name: 'Full Body (Nicole) — 30 Min Intermediate Pilates', detail: 'Move With Nicole · 30 min at-home full body, no equipment', url: 'https://www.youtube.com/watch?v=lBCBSy9cNT0' },
  { name: 'Full Body (Nicole) — 30 Min Mat Pilates',          detail: 'Move With Nicole · 30 min intermediate mat pilates, full body', url: 'https://www.youtube.com/watch?v=5lHVGnRt3tY' },
  { name: 'Full Body (Nicole) — 30 Min Power Pilates',        detail: 'Move With Nicole · 30 min intermediate power pilates, no equipment', url: 'https://www.youtube.com/watch?v=zdz8c9a-rDo' },
  { name: 'Full Body (Nicole) — 30 Min With Light Weights',   detail: 'Move With Nicole · 30 min full body, light hand weights optional', url: 'https://www.youtube.com/watch?v=bJZ003o6kEA' },
  { name: 'Full Body (Nicole) — 30 Min Morning Pilates',      detail: 'Move With Nicole · 30 min energising morning full body', url: 'https://www.youtube.com/watch?v=LbG1ovCGp-E' },
];

// Jessica Diễm — her channel, newest first.
const JESSICA_DIEM = [
  { name: 'Jessica Diễm — her channel', detail: 'Her workouts, clean-eating videos, and daily vlogs.', url: 'https://www.youtube.com/@Jessicadiem1122' },
  { name: 'Jessica Diễm — all her videos, newest first', detail: 'Move forward one video each time', url: 'https://www.youtube.com/@Jessicadiem1122/videos' },
];


// Section headings for a day's exercise list. `tone: 'core'` tints the header
// rose so the video sections stand apart from the lifting sections.
const H = (heading, hint, tone) => ({ heading, hint, tone });

const walk = (min) => [
  H('🌙 Evening · Easy Walk', 'Every evening.'),
  { name: 'Easy Walk', detail: `${min} min · easy pace` },
];


const PILATES_OR_YOGA = [
  H('💗 Pick ONE video · Jessica Diễm', 'Pilates or yoga · 20–40 min.', 'core'),
  ...JESSICA_DIEM,
  H('🧘 Or ONE video · Move With Nicole', 'Pilates or yoga · 20–40 min.', 'core'),
  ...NICOLE_FULLBODY,
];

const cardio = (title, note) => ({ icon: '🚶', title, note });
// One abs move closes each glute day (her call, 2026-10-10: one exercise, a
// different one each day). Each is among the hardest-working abs moves in the
// research — loaded or hanging, not endless floor crunches — and each hits the
// abs a different way: weighted curl (Mon), lower abs (Thu), anti-extension (Sat).
const absFinisher = (name, detail) => [
  H('🔥 After · Abs Finisher', 'One move · straight after the lifts.', 'core'),
  { name, detail },
];
// After the main workout on the video days (Tue, Wed, Fri): one or the other.
const ROPE_OR_ZONE2 = [
  H('🪢 After · Jump Rope or Zone 2', 'Pick ONE · only after the main workout.'),
  { name: 'Jump Rope', detail: '5–15 min · moderate · 1 min jumping, 30–60 sec rest, repeat' },
  { name: 'Zone 2 Run', log: 'run', detail: '20–30 min · easy — you can talk in short sentences' },
];

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// Two meals a day, and it is the same two every single day — glute day, abs
// day, weekend, all of it. She gets hungry at night, so the food has been moved
// later: nothing in the morning, the big plate in the middle of the day, and
// something small at five.
//
//   12:00 PM   BRUNCH — the big meal, and the meal the whole day is built
//              around. MEAL A or MEAL B, one of the two, never both:
//                A — the egg plate: whole eggs and whites folded with spinach
//                    in a dry pan, kimchi, sweet potato, papaya, chia, pumpkin
//                    or sesame seeds, Greek yogurt.
//                B — beef or chicken with sweet potato, spinach, bell pepper,
//                    tomato, cucumber, kimchi, Greek yogurt and seeds.
//    5:00 PM   Apple slices with yogurt, OR a smoothie — two or three fruits
//              blended with chia seeds, granola over the top. That is it.
//
//   Before 12 PM — water, tea and black coffee. Train on that; a glute session
//   runs perfectly well on coffee, and it is what keeps the day under 1,000.
//   After 5 PM — water and tea only. The five o'clock plate is deliberately the
//   later one, because the hunger she actually has is at night, not at dawn.
//
// Beef and chicken are in the plan; pork is not. No oil: the eggs are folded in
// a dry non-stick pan and the meat is seared in a hot dry one.

// ─── THE TWO NUMBERS ───────────────────────────────────────────────────────
// Only two, and they pull against each other:
//
//   1,000 calories a day  — the ceiling.
//   50 grams of protein   — the floor.
//
// With only two meals there is far more room than before, so both 12 PM plates
// fit at full size with the yogurt kept in each. The two standard days:
//
//   12:00 PM   MEAL A, the egg plate ...........  630 cal · 50 g
//    5:00 PM   apple slices & Greek yogurt .....  215 cal · 16 g
//                                                 ————————   ————
//                                                   845 cal · 66 g
//
//   12:00 PM   MEAL B, the beef plate .......... (565 cal · 56 g) → 780 · 72 g
//
// A smoothie at 5 instead of the apple costs about 30 more calories; a granola
// bowl costs about 160 more, which still lands under 1,000. Both meters in the
// app count only the meals actually chosen, so an untouched day honestly reads
// zero.
export const PROTEIN_TARGET = 50;
export const CALORIE_TARGET = 1000;

// The meal times. Tap one in the app to see every meal you can choose for that
// slot, with the ingredients and the step-by-step method. The two slot ids have
// not changed, so every meal already saved against a day stays put — only the
// clock times moved: `post` is now the 12 PM brunch and `noon` is the 5 PM
// plate.
//
// `wake` is gone: there is no morning meal any more, so there is nothing to
// choose at 8 AM. Every fruit plate that used to live there moved to 5 PM,
// where a small plate belongs now. Nothing was thrown away — the coffee in
// those plates became tea, because coffee at five is a bad trade against sleep.
//
// 2026-10-01 — she swapped the two times. The small plate (apple & yogurt)
// is now the 12 PM snack and the real meal is at 5 PM. The ids still did not
// change: `noon` is the 12 PM snack and `post` is the 5 PM plate, so every
// meal already saved stays in its list.
const SLOT_DEFS = {
  noon: { id: 'noon', time: '12:00 PM', t24: '12:00', emoji: '🍏' },
  post: { id: 'post', time: '5:00 PM',  t24: '17:00', emoji: '🍽️' },
};

// Her default 5 PM plate: chicken on the two butt days, eggs on the rest.
// The 12 PM snack is apple and yogurt every day. Every other plate stays one
// tap away as an alternative.
export const GLUTE_DAYS = [0, 4];
export const DEFAULT_SNACK = 'Apple Sticks & Greek Yogurt';
export const CHICKEN_DEFAULT = 'Chicken, Sweet Potato & Veggies';
export const EGG_DEFAULT = '1 Egg, 2 Egg Whites & Sweet Potato';
export function defaultMeal(slotId, dayIndex = 0) {
  if (slotId === 'noon') return DEFAULT_SNACK;
  return GLUTE_DAYS.includes(dayIndex) ? CHICKEN_DEFAULT : EGG_DEFAULT;
}

// The same two slots every day, in clock order.
export function mealSlots(dayIndex = 0) {
  return [
    { ...SLOT_DEFS.noon, label: 'Snack · Apple & Yogurt', hint: 'Apple slices with yogurt · or a smoothie' },
    { ...SLOT_DEFS.post, label: defaultMeal('post', dayIndex), hint: 'Or pick another plate below' },
  ];
}

// Flat list, only for looking a meal's clock time up by its slot id.
export const MEAL_SLOTS = [SLOT_DEFS.noon, SLOT_DEFS.post];

// Every meal you can pick, grouped by slot. Oil-free and salt-free by default.
export const RECOMMENDED_MEALS = [
  // ══ JOY'S TWO PLATES ═══════════════════════════════════════════════════
  // The two meals she actually wants, written exactly as she asked for them.
  // Both are brunch plates. One or the other at 12 PM, never both — the eggs
  // on the day you want more food, the meat on the day you want more protein.
  //
  // Two rules changed to make these possible, and they changed because she
  // asked, not by accident:
  //   • Beef and chicken are back. The old "no chicken, beef or pork, ever"
  //     rule is gone. Pork is still not in the plan.
  //   • No oil, still. The egg plate is folded in a dry non-stick pan and the
  //     meat is seared in a hot dry one — a properly hot pan needs nothing.
  //
  // Both plates at full size, plus fruit, come to about 1,290 calories. That
  // is over the 1,000 ceiling, so the lighter versions below exist: keep the
  // Greek yogurt in ONE meal instead of both, and take one whole egg instead
  // of two. That lands the day near 980 with about 81 g of protein.

  // ══ HER DEFAULT 5 PM PLATES (2026-10-01) ══════════════════════════════
  { emoji: '🍗', slot: 'post', main: true, protein: 'chicken', name: 'Chicken, Sweet Potato & Veggies', cal: 335, pro: 36,
    ingredients: '100 g chicken breast · 1 medium sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber',
    steps: [
      'Boil or bake the sweet potato until a fork slides straight through.',
      'Pat the chicken dry with kitchen paper.',
      'Sear it 4–5 min a side in a hot dry pan, until the juices run clear.',
      'Add the bell pepper and spinach to the pan for the last two minutes.',
      'Plate with the sliced tomato and cucumber.',
      'Butt-day default. Nothing after but water and tea.',
    ] },
  { emoji: '🥚', slot: 'post', main: true, protein: 'egg', name: '1 Egg, 2 Egg Whites & Sweet Potato', cal: 220, pro: 15,
    ingredients: '1 whole egg · 2 egg whites · 1 medium sweet potato',
    steps: [
      'Boil or bake the sweet potato until a fork slides straight through.',
      'Whisk the whole egg with the two whites.',
      'Fold them gently in a dry non-stick pan over low heat.',
      'Plate the eggs beside the sweet potato.',
      'Everyday default. Nothing after but water and tea.',
    ] },

  { emoji: '🍳', slot: 'post', main: true, protein: 'egg', name: 'Meal A · Egg Plate', cal: 630, pro: 50,
    ingredients: '2 whole eggs · 3 egg whites · spinach · kimchi · 1 sweet potato · 1 cup papaya · 1 tbsp chia · 1 tbsp pumpkin or sesame seeds · a small bowl of Greek yogurt',
    steps: [
      'Boil or bake the sweet potato first — 20 min boiled, 40 min at 200°C baked.',
      'Wilt the spinach in a dry non-stick pan for a minute.',
      'Pour the 2 whole eggs and 3 egg whites over it. Fold slowly on low heat, no oil.',
      'Plate the eggs with the split sweet potato, the kimchi and the papaya alongside.',
      'Scatter chia and pumpkin or sesame seeds over the top. Keep yogurt separate.',
      'This plate gives 50 g of protein.',
    ] },
  { emoji: '🍳', slot: 'post', main: true, protein: 'egg', name: 'Meal A · Egg Plate — lighter', cal: 440, pro: 29,
    ingredients: '1 whole egg · 3 egg whites · spinach · kimchi · 1 sweet potato · 1 cup papaya · 1 tbsp chia · 1 tbsp pumpkin or sesame seeds',
    steps: [
      'Same plate, with one whole egg instead of two. No yogurt here.',
      'Boil or bake the sweet potato.',
      'Wilt the spinach, then fold in the egg and whites.',
      'Plate with the kimchi and papaya, and scatter the chia and seeds over.',
      'The lighter plate. Saves 190 calories; costs 21 g of protein.',
    ] },

  { emoji: '🥩', slot: 'post', main: true, protein: 'beef', name: 'Meal B · Beef Plate', cal: 565, pro: 56,
    ingredients: '100 g lean beef · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · a small bowl of Greek yogurt · 1 tbsp pumpkin seeds or chia',
    steps: [
      'Boil or bake the sweet potato while you get everything else ready.',
      'Slice the beef thin across the grain.',
      'Sear in one layer in a hot dry non-stick pan. Leave it for a full minute.',
      'Add the sliced bell pepper and spinach for the last two minutes.',
      'Plate with tomato, cucumber, kimchi, yogurt, and seeds.',
      'Lean beef adds iron and zinc to a 1,000-calorie day.',
    ] },
  { emoji: '🍗', slot: 'post', main: true, protein: 'chicken', name: 'Meal B · Chicken Plate', cal: 550, pro: 57,
    ingredients: '100 g chicken breast · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · a small bowl of Greek yogurt · 1 tbsp pumpkin seeds or chia',
    steps: [
      'Boil or bake the sweet potato first.',
      'Pat the chicken dry with kitchen paper.',
      'Grill or sear it 4–5 min a side in a hot dry pan, until juices run clear.',
      'Add the bell pepper and spinach to the pan for the last two minutes.',
      'Plate with tomato, cucumber, kimchi, yogurt, and seeds.',
      'Chicken is leaner; beef gives more iron.',
    ] },
  { emoji: '🥩', slot: 'post', main: true, protein: 'beef', name: 'Meal B · Beef Plate — lighter', cal: 445, pro: 41,
    ingredients: '100 g lean beef · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · 1 tbsp pumpkin seeds or chia',
    steps: [
      'The same plate without the Greek yogurt, because the yogurt is already in your egg plate.',
      'Sear the thin-sliced beef in a hot dry pan, one layer, undisturbed for a minute.',
      'Bell pepper and spinach in for the last two minutes.',
      'Plate with the sweet potato, the chopped veg and the kimchi, seeds over the top.',
      'Yogurt in one meal, not two. That saves 120 calories.',
    ] },
  { emoji: '🍗', slot: 'post', main: true, protein: 'chicken', name: 'Meal B · Chicken Plate — lighter', cal: 430, pro: 42,
    ingredients: '100 g chicken breast · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · 1 tbsp pumpkin seeds or chia',
    steps: [
      'The same plate without the Greek yogurt — keep the yogurt for your egg plate.',
      'Pat the chicken dry, then grill or sear it 4–5 min a side in a hot dry pan.',
      'Bell pepper and spinach in for the last two minutes.',
      'Plate with the sweet potato, the chopped veg and the kimchi, seeds scattered over.',
      'The lightest of the four meat plates, and still 42 g of protein.',
    ] },

  // ══ THE BRUNCH · 12:00 PM · every day ══════════════════════════════════
  // The meal the whole day is built around, and the last one before the
  // window shuts. Every plate here is built the same way: a protein, a sweet
  // potato, eggs, something green or fermented, and a banana to finish. They
  // run 530–725 calories and 36–60 g of protein, which is what makes a
  // 1,000-calorie day clear the 50 g floor instead of falling short of it.
  //
  // These are the plates that show first when you open 12 PM. Everything below
  // them is smaller and still there — the meter will show you what it costs.
  { emoji: '🍠', slot: 'post', main: true, protein: 'fish', name: 'Fish, Sweet Potato, Eggs & Yogurt', cal: 645, pro: 59,
    ingredients: '150 g white fish · 1 medium sweet potato · 2 eggs · a small bowl of Greek yogurt · kimchi · ½ cucumber · 1 banana',
    steps: [
      'Put the sweet potato on first — boil it 20 min, or bake it 40 min at 200°C.',
      'Boil the eggs 8 min in the same pot, then cool them under cold water so they peel clean.',
      'Steam or bake the fish 8–10 min, until it flakes with a fork.',
      'Plate the fish, sweet potato, eggs, kimchi, and cucumber.',
      'Eat protein first, sweet potato next, then yogurt and banana. Biggest plate, highest protein.',
    ] },
  { emoji: '🥚', slot: 'post', main: true, protein: 'egg', name: 'Eggs, Sweet Potato & Yogurt', cal: 600, pro: 40,
    ingredients: '3 eggs · 1 medium sweet potato · a small bowl of Greek yogurt · kimchi · ½ cucumber · 1 tomato · 1 banana',
    steps: [
      'Boil or bake the sweet potato until a fork slides straight through.',
      'Boil the eggs 8 min and cool them under cold water.',
      'Chop the cucumber and tomato while they cook.',
      'Plate it all together with the kimchi on the side and the yogurt in its own small bowl.',
      'The no-fish version. Banana last, and nothing after it but tea.',
    ] },
  { emoji: '🐟', slot: 'post', main: true, protein: 'fish', name: 'Tuna, Egg & Sweet Potato Bowl', cal: 525, pro: 48,
    ingredients: '1 tin tuna in water · 2 eggs · 1 medium sweet potato · 1 tomato · ½ cucumber · 1 banana',
    steps: [
      'Boil the sweet potato 20 min and the eggs 8 min in the same pot.',
      'Drain the tuna completely — pour off every drop, that liquid is most of the salt.',
      'Flake the tuna into a bowl with the chopped tomato and cucumber.',
      'Add the halved eggs and the sweet potato cut into chunks, and toss gently.',
      'Quickest big plate — about fifteen minutes, with high protein.',
    ] },
  { emoji: '🍲', slot: 'post', main: true, protein: 'tofu', name: 'Tofu, Sweet Potato & Eggs', cal: 530, pro: 36,
    ingredients: '150 g firm tofu · 1 medium sweet potato · 2 eggs · kimchi · ½ cucumber · 1 tomato · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top.',
      'Boil or bake the sweet potato, and boil the eggs 8 min.',
      'Sear tofu in a dry non-stick pan, 3 min a side, until golden.',
      'Plate everything with the kimchi and the chopped veg, banana last.',
    ] },
  { emoji: '🐟', slot: 'post', main: true, protein: 'fish', name: 'Salmon, Sweet Potato & Greens', cal: 585, pro: 39,
    ingredients: '150 g salmon · 1 medium sweet potato · a big handful of spinach or broccoli · kimchi · 1 banana',
    steps: [
      'Bake at 200°C — potato 40 min, salmon for the last 12–14 min, skin down.',
      'Steam the spinach or broccoli 3–4 min while they finish.',
      'Plate with the kimchi on the side and squeeze calamansi over the fish.',
      'Fattiest plate here. Best for a heavy glute day.',
    ] },
  { emoji: '💪', slot: 'post', main: true, protein: 'fish', name: 'The Glute-Day Plate', cal: 725, pro: 60,
    ingredients: '150 g white fish · 1 medium sweet potato · 2 eggs · a small bowl of Greek yogurt · ¼ avocado · kimchi · cucumber · 1 banana',
    steps: [
      'The Fish, Sweet Potato, Eggs & Yogurt plate, with a quarter of an avocado added.',
      'Cook it exactly the same way: sweet potato on first, eggs 8 min, fish steamed 8–10 min.',
      'Slice the avocado on at the end.',
      'Take this on Monday, Wednesday and Friday. It puts your day near 1,080 calories, not 1,000.',
    ] },

  // ── SMALLER BRUNCH PLATES ──────────────────────────────────────────────
  // The original plates, all still here. They are lighter than the six above,
  // so on a day you pick one the meter will read well under 1,000 — which is
  // fine on a rest day and not enough on a lifting day.
  // Any protein, any day: fish, eggs or tofu. Kimchi on the side, then the
  // cucumber and the banana.
  { emoji: '🥬', slot: 'post', protein: 'fish', name: 'Fish, Kimchi & Cucumber', cal: 360, pro: 32,
    ingredients: '150 g fish (any) · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Steam or bake the fish until it flakes — 8–10 min steamed, 12–14 min at 200°C.',
      'Spoon kimchi on the side. A small bowl is plenty.',
      'Slice the cucumber into thick rounds.',
      'Eat fish and kimchi first, then cucumber, then banana.',
    ] },
  { emoji: '🥬', slot: 'post', protein: 'egg', name: 'Eggs, Kimchi & Cucumber', cal: 300, pro: 21,
    ingredients: '2–3 eggs · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Boil the eggs 8 min, then cool them under cold water so they peel clean.',
      'Spoon the kimchi onto the side — a small bowl, no more.',
      'Slice the cucumber into thick rounds.',
      'Eggs and kimchi first, then cucumber, then the banana. The quickest version of this meal.',
    ] },
  { emoji: '🥬', slot: 'post', protein: 'tofu', name: 'Tofu, Kimchi & Cucumber', cal: 310, pro: 19,
    ingredients: '150 g firm tofu · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, until golden.',
      'Kimchi on the side, cucumber sliced alongside.',
      'Tofu and kimchi first, then cucumber, then the banana.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Salmon & Avocado', cal: 400, pro: 33,
    ingredients: '1 salmon fillet (150 g) · ¼ avocado · 1 tomato · calamansi',
    steps: [
      'Pat the salmon dry and let it sit 10 min out of the fridge.',
      'Steam or bake it at 200°C for 12–14 min, skin down, until it flakes with a fork.',
      'Slice the avocado and tomato onto the plate while it cooks.',
      'Squeeze calamansi over the fish. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Sardines & Rice', cal: 330, pro: 26,
    ingredients: '1 tin sardines (in water) · 1 cup cooked rice · calamansi',
    steps: [
      'Cook the rice and keep it warm.',
      'Drain the sardines fully — pour off all the liquid.',
      'Flake them over the rice and break the big pieces up with a fork.',
      'Finish with calamansi. Eat the fish first, then the rice.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Sardines, Rice & Tomato', cal: 350, pro: 27,
    ingredients: '1 tin sardines · 1 cup cooked rice · 1 tomato · calamansi',
    steps: [
      'Cook the rice.',
      'Chop the tomato small so it releases its juice.',
      'Drain the sardines and mash them lightly with the tomato.',
      'Spoon over the rice and finish with calamansi. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Steamed Fish & Sweet Potato', cal: 380, pro: 33,
    ingredients: '1 white fish fillet (150 g) · 1 small sweet potato · ginger · calamansi',
    steps: [
      'Boil or steam the sweet potato 20 min until a fork goes through easily.',
      'Lay the fish on a plate with sliced ginger on top.',
      'Steam it 8–10 min — it is done the moment it turns opaque.',
      'Serve together with calamansi squeezed over the fish.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Tuna & Egg Bowl', cal: 360, pro: 43,
    ingredients: '1 tin tuna in water · 2 eggs · 1 tomato · cucumber',
    steps: [
      'Boil the eggs 8 min, then cool them under cold water and peel.',
      'Drain the tuna completely and flake it into a bowl.',
      'Halve the eggs and add them with chopped tomato and cucumber.',
      'Toss gently. High protein, no oil, no salt.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Boiled Eggs & Avocado', cal: 300, pro: 15,
    ingredients: '2 eggs · ¼ avocado · 1 tomato',
    steps: [
      'Lower the eggs into boiling water and cook 8 min for firm yolks.',
      'Cool them under cold water — that makes them peel cleanly.',
      'Slice the avocado and tomato onto the plate.',
      'Halve the eggs over the top. Protein plus good fat.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Tomato Scramble', cal: 260, pro: 20,
    ingredients: '2–3 eggs · 2 tomatoes · spring onion',
    steps: [
      'Chop the tomatoes and cook them in a dry non-stick pan until soft.',
      'Beat the eggs and pour them in over low heat.',
      'Fold slowly with a spatula.',
      'Take it off the heat slightly wet. Top with spring onion. No oil.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg White Omelette & Veggies', cal: 220, pro: 17,
    ingredients: '4 egg whites · bell pepper · tomato · spinach',
    steps: [
      'Chop the bell pepper, tomato, and spinach small.',
      'Soften them in a dry non-stick pan for 2 min.',
      'Pour the egg whites over and cover the pan for 3 min on low.',
      'Fold in half once set. Add avocado if you want more fat.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu & Rice Bowl', cal: 370, pro: 21,
    ingredients: '150 g firm tofu · 1 cup cooked rice · ginger · spring onion',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top.',
      'Cut into cubes and sear in a dry non-stick pan until golden on two sides.',
      'Cook the rice and spoon the tofu over it.',
      'Top with grated ginger and spring onion.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Steamed Tofu & Tomato Salad', cal: 280, pro: 10,
    ingredients: '150 g silken tofu · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Steam the silken tofu 5 min so it is warm all the way through.',
      'Chop the tomato and cucumber while it steams.',
      'Slide the tofu onto the plate and spoon the salad around it.',
      'Finish with calamansi and grated ginger. Cooling, very light.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu Scramble & Bell Pepper', cal: 290, pro: 19,
    ingredients: '150 g firm tofu · bell pepper · tomato · turmeric · spring onion',
    steps: [
      'Press the tofu 10 min, then crumble it with your hands into egg-sized pieces.',
      'Soften the chopped bell pepper and tomato in a dry non-stick pan.',
      'Add the tofu and a pinch of turmeric — that is what gives it the egg colour.',
      'Cook 5 min, stirring, and finish with spring onion.',
    ] },
  { emoji: '🥑', slot: 'post', protein: 'tofu', name: 'Tofu & Avocado Plate', cal: 340, pro: 19,
    ingredients: '150 g firm tofu · ½ avocado · cucumber · calamansi',
    steps: [
      'Press the tofu 10 min, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, until golden.',
      'Fan the avocado and cucumber alongside.',
      'Squeeze calamansi over everything.',
    ] },

  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Grilled Tilapia & Tomato Salad', cal: 340, pro: 33,
    ingredients: '1 whole tilapia or 150 g fillet · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Score the fish twice on each side so it cooks evenly, and stuff the cuts with ginger.',
      'Grill or bake 6–7 min a side — the flesh should lift off the bone cleanly.',
      'Chop the tomato and cucumber into a salad while it cooks.',
      'Squeeze calamansi over the fish. Glute-day meal.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Ginger Fish & Rice', cal: 390, pro: 34,
    ingredients: '150 g white fish · 1 cup cooked rice · ginger · spring onion · calamansi',
    steps: [
      'Cook the rice.',
      'Lay the fish on a plate, cover it with plenty of sliced ginger, and steam 8–10 min.',
      'Spoon the steaming juices over the rice. No oil.',
      'Top with spring onion and calamansi. Glute-day meal.',
    ] },

  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg & Sweet Potato', cal: 320, pro: 15,
    ingredients: '2 eggs · 1 medium sweet potato',
    steps: [
      'Bake the sweet potato at 200°C for 40 min, or boil it 20 min if you are in a hurry.',
      'Boil the eggs 8 min alongside.',
      'Split the sweet potato open and halve the eggs over it.',
      'Eat it slowly at sunset. Nothing after this but tea.',
    ] },
  { emoji: '🍌', slot: 'post', protein: 'egg', name: 'Egg & Banana', cal: 260, pro: 14,
    ingredients: '2 eggs · 1 banana',
    steps: [
      'Boil the eggs 8 min and cool them under cold water.',
      'Peel and halve them.',
      'Eat with the banana alongside.',
      'Lightest version for a less-hungry night.',
    ] },
  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg, Sweet Potato & Banana', cal: 400, pro: 16,
    ingredients: '2 eggs · 1 small sweet potato · 1 banana',
    steps: [
      'Bake or boil the sweet potato until soft.',
      'Boil the eggs 8 min.',
      'Plate all three together.',
      'Biggest version. Use after heavy glute days.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Mashed Sweet Potato', cal: 330, pro: 15,
    ingredients: '2 eggs · 1 medium sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato 20 min until a fork slides straight through.',
      'Mash it with a fork — no butter, no milk.',
      'Boil the eggs 8 min and chop them through the mash.',
      'Add a pinch of cinnamon.',
    ] },
  { emoji: '🍌', slot: 'post', protein: 'egg', name: 'Egg & Banana Mash', cal: 290, pro: 15,
    ingredients: '2 eggs · 1 ripe banana · ½ small sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato until soft and mash it warm.',
      'Mash a very ripe banana through it.',
      'Boil the eggs 8 min and eat them alongside.',
      'Cinnamon on top. Nothing after sunset but tea.',
    ] },

  // ── DOUBLE PROTEIN · 12:00 PM ──────────────────────────────────────────
  // The plate to reach for on a glute day, or any day the number looks short.
  // Two proteins on one plate is the simplest way there is to add 15 grams.
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Fish, Egg & Kimchi', cal: 425, pro: 38,
    ingredients: '150 g fish (any) · 1 egg · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Boil the egg 8 min while the fish steams or bakes — they finish at about the same time.',
      'Steam or bake the fish until it flakes, 8–10 min steamed or 12–14 min at 200°C.',
      'Kimchi on the side, cucumber sliced thick alongside.',
      'Fish and egg first, then cucumber, then banana. Biggest protein plate in the plan.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu, Egg & Kimchi', cal: 375, pro: 25,
    ingredients: '150 g firm tofu · 1 egg · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, while the egg boils 8 min.',
      'Kimchi on the side, cucumber sliced alongside.',
      'The no-fish version of the double-protein plate.',
    ] },

  // ── 12:00 PM snack · her three fruits ─────────────────────────────────────────
  // Banana, berries or papaya — those three, nothing else needed. These used to
  // be the 8 AM plates; there is no 8 AM meal any more, so they live here, at
  // the end of the day, where a small plate belongs now. Tea rather than
  // coffee: caffeine at five is a bad trade against sleep.
  { emoji: '🫐', slot: 'noon', name: 'Berries & Tea', cal: 72, pro: 1,
    ingredients: '1 cup berries · tea',
    steps: [
      'A cup of berries, fresh or thawed from frozen.',
      'Tea alongside — no milk, no sugar. Keep coffee for morning.',
      'Lightest plate, at about 70 calories.',
      'The smallest snack.',
    ] },
  { emoji: '🍈', slot: 'noon', name: 'Papaya & Tea', cal: 57, pro: 1,
    ingredients: '1 cup papaya · tea',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Tea alongside.',
      'Gentle on your stomach, about 55 calories.',
      'A light snack.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Banana, Berries & Papaya', cal: 230, pro: 3,
    ingredients: '1 banana · ½ cup berries · ½ cup papaya · tea',
    steps: [
      'All three fruits on one plate — nothing blended, nothing added.',
      'Tea alongside.',
      'Biggest fruit plate, about 230 calories. Use when truly hungry.',
      'Eat slowly. Twenty minutes, not five.',
    ] },

  // ── 12:00 PM snack · fruit, and not much of it ────────────────────────────────
  // Small on purpose. A banana is genuinely enough to close a day. Nothing here
  // costs more than 260 calories, because the 12 PM plate takes most of them.
  { emoji: '🍌', slot: 'noon', name: 'Banana & Tea', cal: 100, pro: 1,
    ingredients: '1 banana · tea',
    steps: [
      'Ripe and spotted tastes sweeter for the same calories.',
      'Tea alongside, no milk, no sugar.',
      'About 100 calories.',
      'The simplest snack.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Two Bananas & Tea', cal: 190, pro: 3,
    ingredients: '2 bananas · tea',
    steps: [
      'For after heavy Monday or Friday, or any truly hungry day.',
      'Eat both bananas, then the tea.',
      'Still nothing else after.',
      'If two feels heavy before bed, drop back to one.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Overnight Yogurt Bowl', cal: 320, pro: 33,
    ingredients: 'yogurt · 1 scoop protein powder · 1 tsp psyllium husk · 10 blueberries',
    steps: [
      'The night before: stir protein powder into the yogurt until smooth.',
      'Add the psyllium husk and mix straight away.',
      'Drop the 10 blueberries on top, cover, and leave it in the fridge overnight.',
      'Eat it cold at 12 PM. Drink a full glass of water with it.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Sweet Potato & Tea', cal: 180, pro: 2,
    ingredients: '1 small sweet potato (cooked earlier) · tea',
    steps: [
      'Boil or steam it the night before and leave it in the fridge.',
      'Eat it cold or warmed.',
      'Slower carbs than a banana.',
      'Good when fruit is not enough.',
    ] },
  { emoji: '🥭', slot: 'noon', name: 'Mango & Banana Plate', cal: 190, pro: 2,
    ingredients: '1 banana · ½ cup mango',
    steps: [
      'Slice both onto a plate — nothing blended, nothing added.',
      'Sweetest plate on the list.',
      'Tea alongside if you want it.',
      'Eat it slowly. End there.',
    ] },

  // ── THE BIG BOWLS · 12:00 PM snack · the filling ones ───────────────
  // These are the biggest 5 PM choices, 360–480 calories. With a full brunch at
  // 12 they will put you close to the ceiling, so take one on an evening you
  // are genuinely hungry and a smaller brunch on the day you plan it.
  { emoji: '💪', slot: 'noon', name: 'Protein Bowl · Berries & Banana', cal: 470, pro: 32,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Blend frozen berries, frozen banana, protein powder, and a splash of water.',
      'Blend thick — push fruit down instead of adding more water.',
      'Spoon into a bowl and stir the chia through while it is still soft.',
      'Granola over the top and sliced banana across it.',
    ] },
  { emoji: '💪', slot: 'noon', name: 'Protein Bowl · Mango & Banana', cal: 480, pro: 32,
    ingredients: '1 cup frozen mango · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Mango and banana frozen, protein powder in with them, only a splash of water.',
      'Blend until it holds a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola on top, then berries. Good on a heavy training day.',
    ] },
  { emoji: '🥛', slot: 'noon', name: 'Protein Bowl · Yogurt & Fruit', cal: 430, pro: 38,
    ingredients: 'a bowl of Greek yogurt · 1 scoop protein powder · 1 frozen banana · ½ cup berries · 3 tbsp granola · 1 tbsp chia',
    steps: [
      'Stir protein powder into the Greek yogurt until smooth.',
      'Blend the frozen banana on its own until creamy, then fold it through the yogurt.',
      'Scatter the berries over and stir the chia in.',
      'Granola last so it stays crunchy. Highest-protein bowl on the list.',
    ] },

  // ── SMOOTHIE BOWLS · 5:00 PM ───────────────────────────────────────────
  // Two or three frozen fruits, never more. Granola and chia stirred through.
  // These are the biggest 5 PM choices, so pair one with the lighter brunch
  // rather than the full egg plate if you want to stay well under 1,000.
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Mango & Banana', cal: 380, pro: 8,
    ingredients: '1 cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Two or three frozen fruits in the blender, never more.',
      'Blend mango and banana with a splash of water. Push fruit down.',
      'Pour into a bowl and stir the chia through while it is still soft.',
      'Granola over the top, then berries and sliced banana.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Berries & Banana', cal: 370, pro: 8,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Frozen berries and frozen banana only — two fruits is enough for this one.',
      'Blend them thick with a splash of water until the colour goes deep purple.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top and sliced banana across it.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Papaya, Mango & Banana', cal: 390, pro: 8,
    ingredients: '1 cup papaya · ½ cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Three fruits — the ceiling. Freeze the mango and banana the night before.',
      'Blend all three with no water first. Add a teaspoon only if stuck.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top, berries scattered on.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Dragon Fruit & Banana', cal: 360, pro: 8,
    ingredients: '1 cup frozen dragon fruit · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Freeze the dragon fruit cubes and the banana the night before.',
      'Blend both until deep pink and thick enough to hold a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola, then berries and banana on top.',
    ] },
  { emoji: '🥣', slot: 'noon', main: true, name: 'Papaya · Banana · Mango', cal: 250, pro: 4,
    ingredients: '1 cup papaya · 1 frozen banana · ½ cup mango · 1 tbsp chia · splash of water',
    steps: [
      'Freeze the banana and mango the night before.',
      'Blend all three fruits with only a splash of water.',
      'Stop and push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and top with chia. No milk, no sugar.',
    ] },
  { emoji: '🥭', slot: 'noon', main: true, name: 'Mango · Banana · Berries', cal: 260, pro: 4,
    ingredients: '1 cup mango · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Use frozen mango and banana straight from the freezer.',
      'Blend them first until creamy, then add berries for 5 seconds only.',
      'Spoon into a bowl.',
      'Top with chia and a few whole berries.',
    ] },
  { emoji: '🍈', slot: 'noon', name: 'Papaya · Pineapple · Banana', cal: 240, pro: 4,
    ingredients: '1 cup papaya · ½ cup pineapple · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Blend with pineapple and frozen banana until thick.',
      'Pour into a bowl.',
      'Top with chia. Papaya and pineapple help digestion.',
    ] },
  { emoji: '🍓', slot: 'noon', main: true, name: 'Berries · Banana · Kiwi', cal: 230, pro: 4,
    ingredients: '1 cup mixed berries · 1 frozen banana · 1 kiwi · 1 tbsp chia',
    steps: [
      'Blend the frozen berries and banana with a splash of water.',
      'Slice the kiwi into rounds for the top.',
      'Pour the purple base into a bowl.',
      'Lay the kiwi over it and finish with chia.',
    ] },
  { emoji: '🌴', slot: 'noon', name: 'Mango · Papaya · Pineapple', cal: 250, pro: 4,
    ingredients: '1 cup mango · 1 cup papaya · ½ cup pineapple · 1 tbsp chia',
    steps: [
      'Freeze the mango and pineapple beforehand.',
      'Blend all three together — no water at first.',
      'Add water only a teaspoon at a time if the blender sticks.',
      'Top with chia. Pure tropical, no banana needed.',
    ] },
  { emoji: '🐉', slot: 'noon', name: 'Dragon Fruit · Banana · Berries', cal: 220, pro: 4,
    ingredients: '1 cup dragon fruit · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Freeze the dragon fruit cubes and the banana.',
      'Blend both until deep pink and thick.',
      'Fold the berries through by hand so they stay whole.',
      'Top with chia.',
    ] },
  { emoji: '🍉', slot: 'noon', name: 'Watermelon · Kiwi · Banana', cal: 200, pro: 4,
    ingredients: '1 cup frozen watermelon · 1 kiwi · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Freeze the watermelon cubes first.',
      'Blend it with the frozen banana until slushy.',
      'Add the kiwi last and pulse twice only.',
      'Top with chia. Good on a hot day.',
    ] },
  { emoji: '🍎', slot: 'noon', name: 'Apple · Banana · Berries', cal: 240, pro: 4,
    ingredients: '1 apple · 1 frozen banana · ½ cup berries · 1 tbsp chia · cinnamon',
    steps: [
      'Core and chop the apple, skin on.',
      'Blend it with the frozen banana and berries until smooth.',
      'Pour into a bowl.',
      'Top with chia and a pinch of cinnamon.',
    ] },
  { emoji: '🍍', slot: 'noon', name: 'Pineapple · Mango · Kiwi', cal: 235, pro: 4,
    ingredients: '1 cup pineapple · 1 cup mango · 1 kiwi · 1 tbsp chia',
    steps: [
      'Use frozen pineapple and mango.',
      'Blend them thick with a splash of water.',
      'Slice the kiwi for the top.',
      'Finish with chia. Sharp and sweet.',
    ] },
  { emoji: '🥥', slot: 'noon', name: 'Papaya · Berries · Banana', cal: 230, pro: 4,
    ingredients: '1 cup papaya · ½ cup berries · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Blend the papaya and frozen banana first until creamy.',
      'Add the berries and blend 5 seconds more.',
      'Spoon into a bowl.',
      'Top with chia. Gentle on the stomach.',
    ] },
  { emoji: '🥑', slot: 'noon', name: 'Avocado · Banana · Berries', cal: 300, pro: 5,
    ingredients: '¼ avocado · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Blend the avocado and frozen banana until it goes thick like ice cream.',
      'Spoon it into a bowl.',
      'Scatter the berries over the top.',
      'Finish with chia. Most filling bowl.',
    ] },

  { emoji: '🍉', slot: 'noon', name: 'Big Fruit Plate', cal: 260, pro: 4,
    ingredients: 'papaya · watermelon · 1 banana · a handful of berries',
    steps: [
      'Nothing blended — just cut it all onto one large plate.',
      'Start with the watermelon while it is coldest; it digests fastest.',
      'The biggest snack plate. Eat until full — still only 260 calories.',
      'Water or green tea alongside, nothing sweetened.',
    ] },
  { emoji: '🥝', slot: 'noon', name: 'Papaya, Mango & Kiwi Plate', cal: 230, pro: 2,
    ingredients: '1 cup papaya · ½ cup mango · 1 kiwi',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Slice the mango and kiwi alongside it.',
      'Papaya and kiwi carry natural enzymes.',
      'Eat it fresh and alone, no yogurt, no toppings.',
    ] },

  // ── 12:00 PM snack · apple & Greek yogurt ─────────────────────────────────────
  // Greek yogurt is strained, so the same small bowl carries roughly twice the
  // protein of plain. That swap alone is 7 grams for 30 calories, which is the
  // best trade in the whole plan. This is the default 5 PM meal.
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks & Greek Yogurt', cal: 215, pro: 16,
    ingredients: '1 apple · a small bowl of plain Greek yogurt',
    steps: [
      'Core the apple and cut it into thick sticks, skin on.',
      'Spoon the Greek yogurt into a small bowl.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'Default 12 PM snack.',
    ] },
  { emoji: '🥛', slot: 'noon', name: 'Greek Yogurt, Berries & Chia', cal: 230, pro: 18,
    ingredients: 'a bowl of plain Greek yogurt · ½ cup berries · 1 tsp chia · cinnamon',
    steps: [
      'Stir the chia through the yogurt and leave it five minutes to thicken.',
      'Scatter berries over and add a pinch of cinnamon.',
      'Eat it slowly with a teaspoon.',
      'Light, high-protein snack.',
    ] },

  // ── 12:00 PM snack · the other small options ──────────────────────────────────
  // Plain yogurt instead of Greek, and the two warm options. The sweet potato
  // and the boiled saba are here for an evening you want something warm —
  // take them instead of the apple sticks, not as well as them.
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks & Yogurt', cal: 180, pro: 9,
    ingredients: '1 apple · a small bowl of plain yogurt',
    steps: [
      'Core the apple and cut it into thick sticks, skin on.',
      'Spoon plain unsweetened yogurt into a small bowl.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'A light snack.',
    ] },
  { emoji: '🍏', slot: 'noon', name: 'Apple Sticks, Yogurt & Cinnamon', cal: 190, pro: 9,
    ingredients: '1 apple · a small bowl of plain yogurt · cinnamon',
    steps: [
      'Cut the apple into sticks, skin on.',
      'Stir a good pinch of cinnamon through the yogurt until it goes pale brown.',
      'Cinnamon makes it taste sweet.',
      'Dip and eat slowly.',
    ] },
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks, Yogurt & Chia', cal: 210, pro: 11,
    ingredients: '1 apple · a small bowl of plain yogurt · 1 tsp chia',
    steps: [
      'Stir chia into the yogurt and leave it five minutes.',
      'Cut the apple into sticks while it sits.',
      'Dip and eat slowly.',
      'Drink a full glass of water with it.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Boiled Saba Banana', cal: 160, pro: 2,
    ingredients: '1–2 saba bananas',
    steps: [
      'Drop them in boiling water, skin on, and boil 15–20 min until soft.',
      'The skin peels away after they cool for a minute.',
      'Eat them warm and plain — no sugar, no butter.',
      'This is a craving option: take it instead of the apple sticks, not as well as them.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Boiled Sweet Potato', cal: 180, pro: 2,
    ingredients: '1 medium sweet potato',
    steps: [
      'Boil it whole 20 min, or bake it at 200°C for 40 min if you have the time.',
      'Split it open and eat it straight out of the skin.',
      'No butter, no salt. Slow carbs to carry you to 5 PM.',
      'Craving option. Instead of apple sticks, not on top.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Sweet Potato Sticks & Yogurt', cal: 260, pro: 10,
    ingredients: '1 small sweet potato · a small bowl of plain yogurt · cinnamon',
    steps: [
      'Boil or bake the sweet potato until soft, then let it cool enough to handle.',
      'Cut it into sticks the same way you would the apple.',
      'Dip them in the yogurt with a pinch of cinnamon stirred through.',
      'Sweet potato plus yogurt.',
    ] },
];


// A meal can serve more than one moment — a plate of fish is what you eat
// straight after training and again at 5 PM — so membership is a list when it
// needs to be, and the single `slot` stays the one used for display.
const inSlot = (m, slotId) => (m.slots ? m.slots.includes(slotId) : m.slot === slotId);

// Every protein is fair game on every day now — fish, eggs and tofu alike.
// Beef and chicken are both in the plan now. Pork is not.
export function slotMeals(slotId) {
  return RECOMMENDED_MEALS.filter(m => inSlot(m, slotId));
}

// Today's suggestions — a few picks per slot, rotated by the day of the week so
// the same meals never land two days in a row. Everything else stays one tap
// away behind "more choices".
export function suggestMeals(slotId, dayIndex = 0, n = 3) {
  // Her default for the day always comes first.
  const first = RECOMMENDED_MEALS.find(m => m.name === defaultMeal(slotId, dayIndex));
  const rest = rotateMeals(slotId, dayIndex, n + 1).filter(m => m !== first);
  return first ? [first, ...rest].slice(0, n) : rest.slice(0, n);
}

function rotateMeals(slotId, dayIndex, n) {
  const list = slotMeals(slotId);
  if (list.length <= n) return list;
  // A slot with featured plates shows those, rotated among themselves, rather
  // than rotating through everything — the 12 PM slot is the only one that has
  // them, and burying the big plates under a small one is how a day ends up
  // hundreds of calories and twenty grams of protein short.
  const featured = list.filter(m => m.main);
  const homeFirst = [...featured].sort((a, b) => (a.slot === slotId ? 0 : 1) - (b.slot === slotId ? 0 : 1));
  const pool = homeFirst.length >= n ? homeFirst : list;
  const start = (Math.floor(dayIndex / 2) * n) % pool.length;
  return Array.from({ length: n }, (_, i) => pool[(start + i) % pool.length]);
}

// The clock. The same times every day; only the 5 PM plate changes, chicken on
// the two butt days and eggs on the rest.
function dailyMeals(glute) {
  const plate = glute
    ? { title: 'Chicken, sweet potato & veggies', lines: [
        { name: '100 g chicken breast, seared in a hot dry pan', key: 'chicken' },
        { name: 'A sweet potato, boiled or baked', key: null },
        { name: 'Spinach, bell pepper, tomato, cucumber', key: 'salad' },
      ] }
    : { title: '1 egg, 2 egg whites & sweet potato', lines: [
        { name: '1 whole egg and 2 egg whites, folded in a dry pan', key: 'egg' },
        { name: 'A sweet potato, boiled or baked', key: null },
        { name: 'Or pick another plate from the list', key: null },
      ] };
  return {
    clock: '12 PM snack · 5 PM meal',
    rows: [
      { time: 'Before 12:00 PM — water, tea & black coffee', icon: '☕', ingredients: [
        { name: 'No food before noon. Train on black coffee', key: null },
        { name: 'Water, tea and black coffee, as much as you like', key: null },
      ]},
      { time: '12:00 PM — Snack · apple & yogurt', icon: '🍏', ingredients: [
        { name: 'Apple cut into slices, skin on, with yogurt to dip them in', key: 'apple' },
        { name: 'OR a smoothie — two or three fruits blended with chia seeds', key: null, pick: 'fruit', slot: 'lunch' },
        { name: 'Greek yogurt rather than plain — twice the protein, same bowl', key: 'yogurtbowl' },
      ]},
      { time: `5:00 PM — ${plate.title}`, icon: '🍽️', ingredients: plate.lines },
      { time: 'After 5:00 PM — the window shuts', icon: '🍵', ingredients: [
        { name: 'Water and tea — as much as you like', key: null },
        { name: 'No food. The closing is what makes the window work', key: null },
        { name: 'Still hungry? Make tomorrow’s 5 PM plate bigger, not tonight', key: null },
      ]},
    ],
  };
}
const GLUTE_MEALS = dailyMeals(true);
const DAILY_MEALS = dailyMeals(false);

export const WORKOUT_DAYS = [
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glutes A', title: 'Hip Thrust · RDL · Bulgarian · Abs',
    sub: '30–40 min strength · abs finisher · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    exercises: [
      H('🍑 Main Workout', '3 lifts · in order.'),
      { name: '1. Barbell Hip Thrust', detail: '4 × 8–12 reps · barbell or dumbbell · rest 90–120 sec · full hip extension, squeeze at the top' },
      { name: '2. Romanian Deadlift (RDL)', detail: '3 × 8–12 reps · rest 90 sec · slow stretch through glutes and hamstrings' },
      { name: '3. Bulgarian Split Squat', detail: '3 × 8–10 reps each leg · rest 60–90 sec · lean slightly forward for the glutes' },
      ...absFinisher('Cable Crunch', '3 × 12–15 reps · kneel at the cable, rope by your head · curl your ribs down to your hips · hips stay still'),
      ...walk('30–60'),
    ],
    trackLifts: true,
    meals: GLUTE_MEALS,
  },
  {
    emoji: '🧘', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Pilates or Yoga', title: 'One video · Rope or Zone 2',
    sub: '20–40 min video · jump rope or Zone 2 · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    exercises: [
      ...PILATES_OR_YOGA,
      ...ROPE_OR_ZONE2,
      ...walk('30–60'),
    ],
    meals: DAILY_MEALS,
  },
  {
    emoji: '💪', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Upper Body & Core', title: 'Pilates by Izzy · Rope or Zone 2',
    sub: '20–35 min video · jump rope or Zone 2 · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    noteBefore: { type: 'rose', text: '💪 Keep shoulders moderate. Slim and toned, not big.' },
    exercises: [
      H('💪 Pick ONE video · Pilates by Izzy', 'Upper body & core · 20–35 min.', 'core'),
      ...IZZY_ABS,
      ...ROPE_OR_ZONE2,
      ...walk('30–60'),
    ],
    meals: DAILY_MEALS,
  },
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Thursday · Glutes B', title: 'Kickback · Abduction · Step-Up · Abs',
    sub: '25–35 min strength · abs finisher · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    exercises: [
      H('🍑 Main Workout', '3 lifts · in order.'),
      { name: '1. Cable Kickback', detail: '3 × 10 reps each leg · hinge forward slightly, drive the heel back and up, hold 2 sec · a band round the ankle works at home' },
      { name: '2. Hip Abduction (machine or band)', detail: '3 × 15–25 reps · machine, band or cable · rest 45–60 sec' },
      { name: '3. Dumbbell Step-Up', detail: '3 × 8–12 reps each leg · rest 60–90 sec · drive through the working leg' },
      ...absFinisher('Hanging Knee Raise', '3 × 10–12 reps · hang from a bar · curl your hips up, not just your knees · no swinging'),
      ...walk('30–60'),
    ],
    trackLifts: true,
    meals: GLUTE_MEALS,
  },
  {
    emoji: '🧘', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Friday · Pilates or Yoga', title: 'One video · Rope or Zone 2',
    sub: '20–40 min video · jump rope or Zone 2 · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    exercises: [
      ...PILATES_OR_YOGA,
      ...ROPE_OR_ZONE2,
      ...walk('30–60'),
    ],
    meals: DAILY_MEALS,
  },
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Saturday · Glutes C', title: 'Squat · Side Squat · Lunge · Abs',
    sub: '30–40 min strength · abs finisher · evening walk',
    cardio: cardio('Easy evening walk', '30–60 min'),
    exercises: [
      H('🍑 Main Workout', '3 lifts · in order.'),
      { name: '1. Dumbbell Squat', detail: '3 × 10–12 reps · dumbbells at your shoulders or one held at your chest · rest 60–90 sec · sit back, full depth' },
      { name: '2. Side Squat (Lateral Squat)', detail: '3 × 8–10 reps each side · step wide, sit into one hip, keep the other leg straight · a light dumbbell when easy' },
      { name: '3. Dumbbell Reverse Lunge', detail: '3 × 8–10 reps each leg · rest 60–90 sec · step back, front heel planted, lean slightly forward for the glutes' },
      ...absFinisher('Ab Wheel Rollout (from knees)', '3 × 8–10 reps · roll out only as far as your lower back stays flat · pull back with your abs'),
      ...walk('30–60'),
    ],
    trackLifts: true,
    meals: GLUTE_MEALS,
  },
  {
    emoji: '🚲', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Biking & Swim', title: 'Bike · Swim at 5 PM',
    sub: '45–60 min bike · 30–45 min swim at 5 PM · evening walk',
    cardio: cardio('Easy evening walk', '20–40 min'),
    exercises: [
      H('🚲 Main Workout · Biking', 'Steady and easy.'),
      { name: 'Biking', log: 'bike', detail: '45–60 min · steady easy pace' },
      H('🏊 5 PM · Swimming', 'After the bike. Enjoyable, mostly moderate.'),
      { name: 'Warm-Up Swim', detail: '5–10 min · easy' },
      { name: 'Main Swim', detail: '15–25 min · comfortable · mix strokes, rest when needed' },
      { name: 'Cool-Down Swim', detail: '5 min · very easy' },
      ...walk('20–40'),
    ],
    meals: DAILY_MEALS,
  },
];

// Add a day's chosen meals up. Only meals she has actually picked count — the
// app never guesses a number for a meal she has not chosen.
export function proteinTotal(chosenNames = []) {
  return sumChosen(chosenNames, 'pro');
}

// Calories are counted the same way. She named 1,000 as the ceiling, so the app
// shows it — but it stays the second number, under the protein floor.
export function calorieTotal(chosenNames = []) {
  return sumChosen(chosenNames, 'cal');
}

function sumChosen(chosenNames, field) {
  const seen = new Set(chosenNames);
  return RECOMMENDED_MEALS
    .filter(m => seen.has(m.name))
    .reduce((sum, m) => sum + (m[field] || 0), 0);
}
