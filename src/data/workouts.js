// Sprint progression — automatically advances each challenge month (June = Month 0)
export const SPRINT_PROGRESSION = [
  { month: 'June',      sprint: 40, rest: 40, reps: 10 }, // baseline
  { month: 'July',      sprint: 40, rest: 35, reps: 10 },
  { month: 'August',    sprint: 40, rest: 35, reps: 12 },
  { month: 'September', sprint: 45, rest: 35, reps: 12 },
  { month: 'October',   sprint: 45, rest: 30, reps: 14 },
  { month: 'November',  sprint: 50, rest: 30, reps: 14 },
  { month: 'December',  sprint: 50, rest: 25, reps: 15 },
  { month: 'January',   sprint: 55, rest: 25, reps: 15 },
  { month: 'February',  sprint: 55, rest: 20, reps: 16 },
  { month: 'March',     sprint: 60, rest: 20, reps: 16 },
  { month: 'April',     sprint: 60, rest: 15, reps: 18 },
  { month: 'May',       sprint: 65, rest: 15, reps: 20 },
];

// Challenge year starts June — calculate offset from June (0-indexed)
export function getCurrentSprintProtocol() {
  const offset = (new Date().getMonth() - 5 + 12) % 12;
  return SPRINT_PROGRESSION[offset];
}

// ─── WEEKLY ROUTINE ────────────────────────────────────────────────────────
// Every day of the week is the same shape, in this order and no other:
//     warm-up  →  stomach vacuum  →  (glute activation)  →  the main workout
//                                                        →  one-hour walk
// Two things now bookend all seven days and neither is a choice: the vacuum
// before the main workout, the hour walk after it. The vacuum used to be
// Thursday's alone. The rope is an extra on top of the walk for a day you want
// to sweat, never a swap for it.
//   • Glute days (3×) — warm-up, glute activation, then three lifts:
//       Mon  Hip Thrust · RDL · Step-Up
//       Wed  Back Squat · Bulgarian Split Squat · RDL
//       Fri  Hip Abduction · Cable Kickback · Sumo Squat
//   • Tuesday — arms, back and shoulders: eight moves and nothing else. No ab
//     work and no videos of any kind; both belong to Thursday.
//   • Thursday — the core day and the video day. The five ab moves, then ONE
//     video: Izzy's core or Nicole's full body, her pick. No arm, back or
//     shoulder work — that is Tuesday's job.
// Weekend (Sat · Sun): one Jessica Diễm video comes FIRST on both days and is
// the session, because her videos are full-body. Saturday follows it with the
// sprint protocol, the one that advances by itself each challenge month.
// Sunday follows it with the swim and does not run at all. There is no long
// stretch on either day. Both finish with the same hour walk as every other
// day.

// Shared warm-up and shared finisher.
const WARMUP = { name: 'Full-Body Stretch Warm-Up', detail: '5–8 min · neck, shoulders, chest, back, hips, hamstrings, calves · loosen every major muscle before you train · dynamic swings then gentle holds' };
// The walk is on all seven days now, after the main workout, and it is no
// longer a choice against the rope. It was "walk OR rope, pick one" before; it
// is simply what every day ends with.
const WALK_HOUR = { name: 'One-Hour Walk', detail: '60 min · EVERY day, after the main workout · flat easy pace, relaxed breathing, podcast if you like · an hour of easy walking burns fat without touching your recovery, which is the whole reason it is an hour and not a run' };
// Kept as an extra for a day you want to sweat, not as a swap for the walk.
const JUMP_ROPE = { name: 'Jump Rope — extra, if you want it', detail: '10–20 min · steady, light on the balls of your feet · an extra on top of the walk on a day you want to sweat, not a replacement for it · skip it entirely and the day is still complete' };

// ── VIDEOS ── Two channels only.
// PILATES BY IZZY — 4 core workouts + her full CORE WORKOUTS playlist.
const IZZY_ABS = [
  { name: 'Abs (Izzy) — 20 Min Pilates Abs & Deep Core', detail: 'PILATES BY IZZY · deep core sculpt & tone, no equipment', url: 'https://www.youtube.com/watch?v=XmbOXzKIjaU' },
  { name: 'Abs (Izzy) — 20 Min Ab Burn',                 detail: 'PILATES BY IZZY · no-equipment core, abs & waist', url: 'https://www.youtube.com/watch?v=TV1yswlJnIY' },
  { name: 'Abs (Izzy) — 15 Min Deep Core',               detail: 'PILATES BY IZZY · intermediate–advanced deep core, optional equipment', url: 'https://www.youtube.com/watch?v=cPVrEm3C-N4' },
  { name: 'Abs (Izzy) — 15 Min Core Strength',           detail: 'PILATES BY IZZY · 25 Day Challenge S2 Day 2 · intermediate core', url: 'https://www.youtube.com/watch?v=mn8uPZFjycY' },
  { name: 'Abs (Izzy) — CORE WORKOUTS Playlist',         detail: 'PILATES BY IZZY · her whole core playlist · open this to pick any other core session by mood', url: 'https://www.youtube.com/playlist?list=PLefYzZnhersYvg6wIbgePfGmFs_nB6yH7' },
];

// Move With Nicole — 5 short 30-minute full-body workouts.
const NICOLE_FULLBODY = [
  { name: 'Full Body (Nicole) — 30 Min Intermediate Pilates', detail: 'Move With Nicole · 30 min at-home full body, no equipment', url: 'https://www.youtube.com/watch?v=lBCBSy9cNT0' },
  { name: 'Full Body (Nicole) — 30 Min Mat Pilates',          detail: 'Move With Nicole · 30 min intermediate mat pilates, full body', url: 'https://www.youtube.com/watch?v=5lHVGnRt3tY' },
  { name: 'Full Body (Nicole) — 30 Min Power Pilates',        detail: 'Move With Nicole · 30 min intermediate power pilates, no equipment', url: 'https://www.youtube.com/watch?v=zdz8c9a-rDo' },
  { name: 'Full Body (Nicole) — 30 Min With Light Weights',   detail: 'Move With Nicole · 30 min full body, light hand weights optional', url: 'https://www.youtube.com/watch?v=bJZ003o6kEA' },
  { name: 'Full Body (Nicole) — 30 Min Morning Pilates',      detail: 'Move With Nicole · 30 min energising morning full body', url: 'https://www.youtube.com/watch?v=LbG1ovCGp-E' },
];

// Section headings for a day's exercise list. `tone: 'core'` tints the header
// rose so the video sections stand apart from the lifting sections.
const H = (heading, hint, tone) => ({ heading, hint, tone });




// Weekend running, all of it on Saturday now. The interval protocol advances
// by itself each challenge month (SPRINT_PROGRESSION at the top of this file),
// so the session gets harder without you editing it. The easy run stays on
// Saturday too, as the gentler option on a day the legs are not up to sprints.
// Sunday has no run at all any more.
const RUN_WARMUP = { name: 'Run Warm-Up', detail: '5 min · brisk walk building to a slow jog · ankle circles, leg swings, 3 × 20 m build-ups · never start a run cold' };
const RUN_EASY = { name: 'Easy Run', detail: '20–30 min · conversational pace — if you cannot talk, slow down · flat route, land soft under your hips, shoulders loose · builds your engine without eating into leg recovery for Monday' };
const RUN_INTERVALS = (() => {
  const sp = getCurrentSprintProtocol();
  return {
    name: `Sprint Intervals — ${sp.reps} rounds`,
    detail: `${sp.reps} rounds · ${sp.sprint} sec hard, ${sp.rest} sec easy walk between · hold form over speed; the moment your form breaks, that round was your last · this protocol steps up on its own every challenge month (${sp.month})`,
  };
})();
const REST_WALK = { name: '20-Minute Walk — instead of the run', detail: '20 min · the alternative to running today, not an extra lap after it · no pace target, sunshine, podcast, whatever you like · take this on any weekend your legs still feel Friday' };
const SWIM = { name: 'Swimming', detail: '30–45 min · Sunday only, straight after the Jessica Diễm video · easy laps, no racing the clock · water carries your weight, so this adds work without adding anything for your legs to recover from' };
const BIKE = { name: 'Biking — an extra, if you want it', detail: '45–60 min · Sunday only, later in the day · steady easy pace, flat route · an extra on top of the swim, not instead of it · gentle on the legs, and it keeps Monday fresh' };
// There is no long stretch on the weekend any more. The warm-up at the top of
// each weekday still opens with a full-body stretch, so stretching has not
// left the plan — it is just no longer a session of its own. The weekend days
// have no warm-up section either, so the vacuum is the first thing on them.
// On all seven days now, straight after the warm-up and before the main
// workout. It used to be Thursday's alone, tucked inside that day's warm-up.
// It costs about two minutes, needs no equipment and does the one thing the
// rest of the plan cannot: it pulls the waist IN, where crunches push it out.
const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · EVERY day, after the warm-up and before the main workout · this pulls the waist in where crunches push it out, which is why it comes first and not last' };
// Its own section, so it reads the same on every day of the week.
const VACUUM_SEC = [
  H('🫧 Stomach Vacuum', 'Every day, before the main workout.'),
  VACUUM,
];

// ─── ABS ───────────────────────────────────────────────────────────────────
// The waist work, two or three times a week and never more. These five build
// the deep wall and the visible blocks without loading the obliques heavy —
// heavy side bends and weighted twists are what thicken a waist, so they are
// not in this plan and will not be. The stomach vacuum above belongs to the
// same job: it pulls the waist in where crunches only push it out.
const ABS_MAIN = [
  { name: '1. Weighted Crunch', detail: 'ABS 1 of 5 · 3 × 12 · a dumbbell or plate on your chest, curl the ribs toward the hips, lower for 3 sec · the only ab move that gets heavier' },
  { name: '2. Reverse Crunch', detail: 'ABS 2 of 5 · 3 × 15 · on your back, knees at 90°, curl the hips off the floor toward your chest, lower slow · lower stomach' },
  { name: '3. Lying Leg Raise', detail: 'ABS 3 of 5 · 3 × 12 · hands under your hips, legs straight, lower to just above the floor and lift back · keep your low back flat on the mat' },
  { name: '4. Dead Bug', detail: 'ABS 4 of 5 · 3 × 10 each side · on your back, arms up, knees at 90°, lower the opposite arm and leg slowly, then back · deep core' },
  { name: '5. Plank', detail: 'ABS 5 of 5 · 3 × 30–60 sec · elbows under shoulders, ribs down, glutes on, one straight line · add 10 sec a week' },
];


// ── JESSICA DIEM ── The weekend videos, and the first thing done on both
// weekend days now. Her videos are full-body, so one of them IS the session;
// the sprints on Saturday and the swim on Sunday follow it. They never replace
// the weekday work: glutes stay Monday, Wednesday and Friday, arms, back and
// shoulders Tuesday, the core and the other videos Thursday.
const JESSICA_DIEM = [
  { name: 'Jessica Diễm — her channel', detail: 'Her page. Everything she posts is here — workouts, clean-eating and the daily vlogs', url: 'https://www.youtube.com/@Jessicadiem1122' },
  { name: 'Jessica Diễm — all her videos, newest first', detail: 'Her programme started Thursday 10 September 2026 · scroll to that day and work forward in order, one video per weekend day, so you follow it the way she laid it out', url: 'https://www.youtube.com/@Jessicadiem1122/videos' },
];

// ── SHOULDERS ── Tuesday's first half. The shape of a shoulder comes from the
// side and rear heads, not from pressing heavy, so the lateral raise leads and
// the press stays light. Moderate on purpose: straight shoulders, not big ones.
const SHOULDERS = [
  { name: '1. Dumbbell Lateral Raise', detail: 'SHOULDERS 1 of 3 · 3 × 15 · light dumbbells, elbows soft, lift to shoulder height only, lower for 3 sec · SIDE DELT — this is the one that gives a shoulder its shape · if you have to swing it, it is too heavy' },
  { name: '2. Seated Dumbbell Shoulder Press', detail: 'SHOULDERS 2 of 3 · 3 × 12 · seated, back supported, press from chin height to just short of locked, lower for 3 sec · FRONT + SIDE DELT · light: this is for shape, not for a bigger press' },
  { name: '3. Band Pull-Apart', detail: 'SHOULDERS 3 of 3 · 3 × 20 · light band, arms straight at chest height, pull apart, hold the squeeze 1 sec, return slow · REAR DELT — this is what pulls your shoulders back and holds them there · never feel it in your neck' },
];

// ── ARMS ── Tuesday's second half. Two moves for the back of the arm, one for
// the front, all light and all slow. The triceps come first because the back of
// the arm is what she is actually after.
const ARMS = [
  { name: '6. Overhead Triceps Extension', detail: 'ARMS 1 of 3 · 3 × 12 · one dumbbell in both hands overhead, elbows close to your ears, lower behind your head for 3 sec, press back up · TRICEPS, long head — the back of the arm' },
  { name: '7. Dumbbell Kickback', detail: 'ARMS 2 of 3 · 3 × 15 each arm · hinge to 45°, upper arm pinned to your side, straighten the elbow back, hold the squeeze 1 sec · TRICEPS · light — this one is all squeeze, no weight' },
  { name: '8. Dumbbell Bicep Curl', detail: 'ARMS 3 of 3 · 3 × 12 · elbows pinned to your sides, curl without swinging, lower for 3 sec · BICEPS · the slow lower is where the work is' },
];

// ── BACK & CHEST ── Part of Tuesday's main workout, between the shoulders and
// the arms. Tuesday is arms, back and shoulders, so these are not an extra at
// the bottom of the day — they are two of its eight moves.
const BACK_CHEST = [
  { name: '4. Double-Arm Dumbbell Row', detail: 'BACK 1 of 2 · 3 × 12 · hinge to 45°, back flat, row both dumbbells to your ribs, hold 1 sec, lower for 3 sec · UPPER BACK · if you feel your lower back, hinge less' },
  { name: '5. Incline Push-Up', detail: 'BACK 2 of 2 · 3 × 10 · hands on a bench or counter, body in one straight line, lower for 3 sec · CHEST + FRONT DELT · lower the surface as you get stronger' },
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
const SLOT_DEFS = {
  post: { id: 'post', time: '12:00 PM', t24: '12:00', emoji: '🍽️' },
  noon: { id: 'noon', time: '5:00 PM',  t24: '17:00', emoji: '🍏' },
};

// The same two slots every day, in clock order.
export function mealSlots() {
  return [
    { ...SLOT_DEFS.post, label: 'Brunch · Meal A or Meal B', hint: 'ONE of the two · A is the egg plate, B is beef or chicken · this is the meal the day is built around' },
    { ...SLOT_DEFS.noon, label: 'Apple & Yogurt or Smoothie', hint: 'Apple slices with yogurt · or a smoothie: 2–3 fruits with chia, granola on top' },
  ];
}

// Flat list, only for looking a meal's clock time up by its slot id.
export const MEAL_SLOTS = [SLOT_DEFS.post, SLOT_DEFS.noon];

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

  { emoji: '🍳', slot: 'post', main: true, protein: 'egg', name: 'Meal A · Egg Plate', cal: 630, pro: 50,
    ingredients: '2 whole eggs · 3 egg whites · spinach · kimchi · 1 sweet potato · 1 cup papaya · 1 tbsp chia · 1 tbsp pumpkin or sesame seeds · a small bowl of Greek yogurt',
    steps: [
      'Boil or bake the sweet potato first — 20 min boiled, 40 min at 200°C baked, which makes it far sweeter.',
      'Wilt the spinach in a dry non-stick pan for a minute — it lets out its own water, which is all you need.',
      'Pour the 2 whole eggs and 3 egg whites over it and fold slowly on low heat. No oil: low and slow in a non-stick pan is what keeps eggs soft.',
      'Plate the eggs with the split sweet potato, the kimchi and the papaya alongside.',
      'Scatter the chia and the pumpkin or sesame seeds over the top, and put the Greek yogurt in its own small bowl.',
      'This plate on its own is 50 g of protein — your whole daily floor in one meal.',
    ] },
  { emoji: '🍳', slot: 'post', main: true, protein: 'egg', name: 'Meal A · Egg Plate — lighter', cal: 440, pro: 29,
    ingredients: '1 whole egg · 3 egg whites · spinach · kimchi · 1 sweet potato · 1 cup papaya · 1 tbsp chia · 1 tbsp pumpkin or sesame seeds',
    steps: [
      'The same plate with one whole egg instead of two, and no yogurt — the yogurt goes in your other meal instead.',
      'Boil or bake the sweet potato.',
      'Wilt the spinach in a dry non-stick pan, then pour the egg and whites over and fold slowly.',
      'Plate with the kimchi and papaya, and scatter the chia and seeds over.',
      'Take this version on the days you want more room at 5 PM. It saves you 190 calories and costs you 21 g of protein.',
    ] },

  { emoji: '🥩', slot: 'post', main: true, protein: 'beef', name: 'Meal B · Beef Plate', cal: 565, pro: 56,
    ingredients: '100 g lean beef · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · a small bowl of Greek yogurt · 1 tbsp pumpkin seeds or chia',
    steps: [
      'Boil or bake the sweet potato while you get everything else ready.',
      'Slice the beef thin across the grain — across the grain is what makes lean beef tender instead of chewy.',
      'Sear it in a hot dry non-stick pan, one layer, and leave it alone for a full minute before you stir. A properly hot pan needs no oil.',
      'Add the sliced bell pepper and spinach for the last two minutes, just until the spinach wilts.',
      'Plate with the chopped tomato, cucumber and kimchi on the side, the yogurt in its own bowl, and the seeds scattered over.',
      'Lean beef is where your iron and zinc come from, which a 1,000-calorie day otherwise runs short on.',
    ] },
  { emoji: '🍗', slot: 'post', main: true, protein: 'chicken', name: 'Meal B · Chicken Plate', cal: 550, pro: 57,
    ingredients: '100 g chicken breast · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · a small bowl of Greek yogurt · 1 tbsp pumpkin seeds or chia',
    steps: [
      'Boil or bake the sweet potato first.',
      'Pat the chicken dry with kitchen paper — wet chicken steams instead of browning, and that is the whole difference.',
      'Grill or sear it 4–5 min a side in a hot dry pan without moving it, until the juices run clear.',
      'Add the bell pepper and spinach to the pan for the last two minutes.',
      'Plate with the tomato, cucumber and kimchi, the yogurt in its own bowl, and the seeds over the top.',
      'Slightly leaner than the beef and almost the same protein — take the beef when you want the iron, the chicken when you want the calories back.',
    ] },
  { emoji: '🥩', slot: 'post', main: true, protein: 'beef', name: 'Meal B · Beef Plate — lighter', cal: 445, pro: 41,
    ingredients: '100 g lean beef · 1 sweet potato · spinach · 1 bell pepper · 1 tomato · ½ cucumber · kimchi · 1 tbsp pumpkin seeds or chia',
    steps: [
      'The same plate without the Greek yogurt, because the yogurt is already in your egg plate.',
      'Sear the thin-sliced beef in a hot dry pan, one layer, undisturbed for a minute.',
      'Bell pepper and spinach in for the last two minutes.',
      'Plate with the sweet potato, the chopped veg and the kimchi, seeds over the top.',
      'Yogurt in one meal, not two — that single change is 120 calories, and it is the easiest cut in the plan.',
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
      'Put the sweet potato on first — boil it 20 min, or bake it 40 min at 200°C if you have the time, because baking makes it far sweeter.',
      'Boil the eggs 8 min in the same pot, then cool them under cold water so they peel clean.',
      'Steam or bake the fish 8–10 min, until it flakes with a fork.',
      'Plate the fish, the split sweet potato and the halved eggs, with the kimchi and sliced cucumber on the side.',
      'Eat the protein first, the sweet potato next, then the yogurt and the banana last. This is your biggest plate and your highest protein — it is the default for a reason.',
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
      'The quickest big plate there is — about fifteen minutes, and the most protein for the fewest calories on this list.',
    ] },
  { emoji: '🍲', slot: 'post', main: true, protein: 'tofu', name: 'Tofu, Sweet Potato & Eggs', cal: 530, pro: 36,
    ingredients: '150 g firm tofu · 1 medium sweet potato · 2 eggs · kimchi · ½ cucumber · 1 tomato · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top — this is what stops it going soggy.',
      'Boil or bake the sweet potato, and boil the eggs 8 min.',
      'Sear the tofu slices in a dry non-stick pan, 3 min a side, until golden. No oil; a hot dry pan is enough.',
      'Plate everything with the kimchi and the chopped veg, banana last.',
    ] },
  { emoji: '🐟', slot: 'post', main: true, protein: 'fish', name: 'Salmon, Sweet Potato & Greens', cal: 585, pro: 39,
    ingredients: '150 g salmon · 1 medium sweet potato · a big handful of spinach or broccoli · kimchi · 1 banana',
    steps: [
      'Bake the sweet potato and the salmon together at 200°C — potato 40 min, salmon in for the last 12–14 min, skin down.',
      'Steam the spinach or broccoli 3–4 min while they finish.',
      'Plate with the kimchi on the side and squeeze calamansi over the fish.',
      'The fattiest plate here, and the one worth having on a heavy glute day. Salmon fat is the good kind, but it is the reason this one costs more calories than the white fish plate.',
    ] },
  { emoji: '💪', slot: 'post', main: true, protein: 'fish', name: 'The Glute-Day Plate', cal: 725, pro: 60,
    ingredients: '150 g white fish · 1 medium sweet potato · 2 eggs · a small bowl of Greek yogurt · ¼ avocado · kimchi · cucumber · 1 banana',
    steps: [
      'The Fish, Sweet Potato, Eggs & Yogurt plate, with a quarter of an avocado added.',
      'Cook it exactly the same way: sweet potato on first, eggs 8 min, fish steamed 8–10 min.',
      'Slice the avocado on at the end.',
      'Take this on Monday, Wednesday and Friday — the days you lift. It puts your day nearer 1,080 calories than 1,000, and on a lifting day that is the right trade.',
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
      'Spoon the kimchi onto the side of the plate. A small bowl is plenty; it is salty, so it is a condiment, not a serving.',
      'Slice the cucumber into thick rounds.',
      'Eat the fish and kimchi first, then the cucumber, and the banana last. This is the standard after-training plate.',
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
      'Halve the eggs over the top. Protein plus good fat, the perfect post-training plate.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Tomato Scramble', cal: 260, pro: 20,
    ingredients: '2–3 eggs · 2 tomatoes · spring onion',
    steps: [
      'Chop the tomatoes and cook them in a dry non-stick pan until they soften and give up their juice.',
      'Beat the eggs and pour them in over low heat.',
      'Fold slowly with a spatula — low and slow keeps them soft.',
      'Take it off the heat while still slightly wet, top with spring onion. No oil needed, the tomato juice is enough.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg White Omelette & Veggies', cal: 220, pro: 17,
    ingredients: '4 egg whites · bell pepper · tomato · spinach',
    steps: [
      'Chop the bell pepper, tomato, and spinach small.',
      'Soften them in a dry non-stick pan for 2 min.',
      'Pour the egg whites over and cover the pan for 3 min on low.',
      'Fold in half once set. Light protein — pair with avocado if you want more fat.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu & Rice Bowl', cal: 370, pro: 21,
    ingredients: '150 g firm tofu · 1 cup cooked rice · ginger · spring onion',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top to squeeze out the water — this is what stops it going soggy.',
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
      'Squeeze calamansi over everything. Plant protein plus your fats in one plate.',
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
      'Spoon the steaming juices from the plate over the rice — that is all the flavour you need, no oil.',
      'Top with spring onion and calamansi. Glute-day meal.',
    ] },

  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg & Sweet Potato', cal: 320, pro: 15,
    ingredients: '2 eggs · 1 medium sweet potato',
    steps: [
      'Bake the sweet potato at 200°C for 40 min, or boil it 20 min if you are in a hurry — baking makes it far sweeter.',
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
      'The lightest version of your last meal — good on a night you are not very hungry.',
    ] },
  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg, Sweet Potato & Banana', cal: 400, pro: 16,
    ingredients: '2 eggs · 1 small sweet potato · 1 banana',
    steps: [
      'Bake or boil the sweet potato until soft.',
      'Boil the eggs 8 min.',
      'Plate all three together.',
      'The biggest version — take this one after your heaviest glute days.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Mashed Sweet Potato', cal: 330, pro: 15,
    ingredients: '2 eggs · 1 medium sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato 20 min until a fork slides straight through.',
      'Mash it with a fork — no butter, no milk, it is sweet enough on its own.',
      'Boil the eggs 8 min and chop them through the mash.',
      'Add a pinch of cinnamon. Warm and filling for the night.',
    ] },
  { emoji: '🍌', slot: 'post', protein: 'egg', name: 'Egg & Banana Mash', cal: 290, pro: 15,
    ingredients: '2 eggs · 1 ripe banana · ½ small sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato until soft and mash it warm.',
      'Mash a very ripe banana through it — the riper it is, the sweeter this gets.',
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
      'Fish and egg first, then the cucumber, then the banana. This is the biggest protein plate in the plan — take it after Thursday and Monday.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu, Egg & Kimchi', cal: 375, pro: 25,
    ingredients: '150 g firm tofu · 1 egg · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, while the egg boils 8 min.',
      'Kimchi on the side, cucumber sliced alongside.',
      'The no-fish version of the double-protein plate.',
    ] },

  // ── 5:00 PM · her three fruits ─────────────────────────────────────────
  // Banana, berries or papaya — those three, nothing else needed. These used to
  // be the 8 AM plates; there is no 8 AM meal any more, so they live here, at
  // the end of the day, where a small plate belongs now. Tea rather than
  // coffee: caffeine at five is a bad trade against sleep.
  { emoji: '🫐', slot: 'noon', name: 'Berries & Tea', cal: 72, pro: 1,
    ingredients: '1 cup berries · tea',
    steps: [
      'A cup of berries, fresh or thawed from frozen.',
      'Tea alongside — no milk, no sugar. Keep coffee for the morning; at five it will still be in you at bedtime.',
      'The lightest plate on the whole list, at about 70 calories.',
      'The smallest way to close the day. Nothing after it but water.',
    ] },
  { emoji: '🍈', slot: 'noon', name: 'Papaya & Tea', cal: 57, pro: 1,
    ingredients: '1 cup papaya · tea',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Tea alongside.',
      'The gentlest one on your stomach, and the cheapest in calories — about 55.',
      'Good on an evening your brunch was a big one and you only want something in your hands.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Banana, Berries & Papaya', cal: 230, pro: 3,
    ingredients: '1 banana · ½ cup berries · ½ cup papaya · tea',
    steps: [
      'All three of your fruits on one plate — nothing blended, nothing added.',
      'Tea alongside.',
      'The biggest fruit plate at about 230 calories. Take this on an evening you are genuinely hungry rather than just bored.',
      'Eat it slowly. It should take twenty minutes, not five.',
    ] },

  // ── 5:00 PM · fruit, and not much of it ────────────────────────────────
  // Small on purpose. A banana is genuinely enough to close a day. Nothing here
  // costs more than 260 calories, because the 12 PM plate takes most of them.
  { emoji: '🍌', slot: 'noon', name: 'Banana & Tea', cal: 100, pro: 1,
    ingredients: '1 banana · tea',
    steps: [
      'Ripe and spotted is better — the starch has turned to sugar, so it tastes sweeter for the same calories.',
      'Tea alongside, no milk, no sugar.',
      'About 100 calories, which leaves plenty of room under the ceiling.',
      'The simplest close there is.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Two Bananas & Tea', cal: 190, pro: 3,
    ingredients: '2 bananas · tea',
    steps: [
      'For the evenings after a heavy Monday or Friday, or any day you are truly hungry.',
      'Eat both bananas, then the tea.',
      'Still nothing else after — the closing is what makes the window work.',
      'If two feels heavy before bed, drop back to one.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Overnight Yogurt Bowl', cal: 320, pro: 33,
    ingredients: 'yogurt · 1 scoop protein powder · 1 tsp psyllium husk · 10 blueberries',
    steps: [
      'The night before: stir the protein powder into the yogurt until there are no dry pockets left.',
      'Add the psyllium husk and mix straight away — it thickens fast, so it has to go in moving.',
      'Drop the 10 blueberries on top, cover, and leave it in the fridge overnight.',
      'Eat it cold at 5 PM. Drink a full glass of water with it — psyllium needs the water to work.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Sweet Potato & Tea', cal: 180, pro: 2,
    ingredients: '1 small sweet potato (cooked earlier) · tea',
    steps: [
      'Boil or steam it while you cook your brunch and leave it in the fridge.',
      'Eat it cold or warmed — cold sweet potato is actually gentler on your gut.',
      'Slower carbs than a banana, so it holds you through the evening better than fruit does.',
      'Good on the days a banana leaves you hunting the kitchen at nine.',
    ] },
  { emoji: '🥭', slot: 'noon', name: 'Mango & Banana Plate', cal: 190, pro: 2,
    ingredients: '1 banana · ½ cup mango',
    steps: [
      'Slice both onto a plate — nothing blended, nothing added.',
      'The sweetest plate on the list, which is why it works as the last one.',
      'Tea alongside if you want it.',
      'Eat it slowly and let that be the end of the day.',
    ] },

  // ── THE BIG BOWLS · 5:00 PM · the filling end of the day ───────────────
  // These are the biggest 5 PM choices, 360–480 calories. With a full brunch at
  // 12 they will put you close to the ceiling, so take one on an evening you
  // are genuinely hungry and a smaller brunch on the day you plan it.
  { emoji: '💪', slot: 'noon', name: 'Protein Bowl · Berries & Banana', cal: 470, pro: 32,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Frozen berries and frozen banana in the blender with the scoop of protein powder and a splash of water.',
      'Blend thick — push the fruit down with a spoon rather than adding more water, or the powder makes it foamy.',
      'Spoon into a bowl and stir the chia through while it is still soft.',
      'Granola over the top and sliced banana across it. This one bowl is about a third of your whole day’s protein.',
    ] },
  { emoji: '💪', slot: 'noon', name: 'Protein Bowl · Mango & Banana', cal: 480, pro: 32,
    ingredients: '1 cup frozen mango · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Mango and banana frozen, protein powder in with them, only a splash of water.',
      'Blend until it holds a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola on top, then the berries. Sweeter than the berry one — good on a heavy training day.',
    ] },
  { emoji: '🥛', slot: 'noon', name: 'Protein Bowl · Yogurt & Fruit', cal: 430, pro: 38,
    ingredients: 'a bowl of Greek yogurt · 1 scoop protein powder · 1 frozen banana · ½ cup berries · 3 tbsp granola · 1 tbsp chia',
    steps: [
      'Stir the protein powder into the Greek yogurt first, until there are no dry pockets left.',
      'Blend the frozen banana on its own until creamy, then fold it through the yogurt.',
      'Scatter the berries over and stir the chia in.',
      'Granola last so it stays crunchy. The highest-protein bowl on the list — this one alone is most of your 50 grams.',
    ] },

  // ── SMOOTHIE BOWLS · 5:00 PM ───────────────────────────────────────────
  // Two or three frozen fruits, never more. Granola and chia stirred through.
  // These are the biggest 5 PM choices, so pair one with the lighter brunch
  // rather than the full egg plate if you want to stay well under 1,000.
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Mango & Banana', cal: 380, pro: 8,
    ingredients: '1 cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Two or three frozen fruits in the blender, never more — that is what keeps it thick instead of runny, and keeps the sugar sensible.',
      'Blend the mango and banana with only a splash of water. Push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and stir the chia through while it is still soft.',
      'Granola over the top, then berries and sliced banana — or whatever fruit is in the house.',
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
      'Three fruits — the ceiling. Freeze the mango and banana the night before; the papaya goes in fresh because it is wet enough.',
      'Blend all three with no water at first, adding a teaspoon at a time only if the blender sticks.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top, berries scattered on. The easiest one on the stomach.',
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
      'Freeze the banana and mango the night before — frozen fruit is what makes it thick instead of runny.',
      'Blend all three fruits with only a splash of water.',
      'Stop and push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and top with chia. No milk, no sugar.',
    ] },
  { emoji: '🥭', slot: 'noon', main: true, name: 'Mango · Banana · Berries', cal: 260, pro: 4,
    ingredients: '1 cup mango · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Use frozen mango and banana straight from the freezer.',
      'Blend them first until creamy, then add the berries for 5 seconds only — that keeps the colour bright.',
      'Spoon into a bowl.',
      'Top with chia and a few whole berries.',
    ] },
  { emoji: '🍈', slot: 'noon', name: 'Papaya · Pineapple · Banana', cal: 240, pro: 4,
    ingredients: '1 cup papaya · ½ cup pineapple · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Blend with pineapple and frozen banana until thick.',
      'Pour into a bowl.',
      'Top with chia. This is the best one for digestion — papaya and pineapple both carry natural enzymes.',
    ] },
  { emoji: '🍓', slot: 'noon', main: true, name: 'Berries · Banana · Kiwi', cal: 230, pro: 4,
    ingredients: '1 cup mixed berries · 1 frozen banana · 1 kiwi · 1 tbsp chia',
    steps: [
      'Blend the frozen berries and banana with a splash of water.',
      'Slice the kiwi into rounds — this one goes on top, not in the blender.',
      'Pour the purple base into a bowl.',
      'Lay the kiwi over it and finish with chia.',
    ] },
  { emoji: '🌴', slot: 'noon', name: 'Mango · Papaya · Pineapple', cal: 250, pro: 4,
    ingredients: '1 cup mango · 1 cup papaya · ½ cup pineapple · 1 tbsp chia',
    steps: [
      'Freeze the mango and pineapple beforehand.',
      'Blend all three together — no water at first, the papaya is wet enough.',
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
      'Freeze the watermelon cubes — fresh watermelon makes this too watery to be a bowl.',
      'Blend it with the frozen banana until slushy.',
      'Add the kiwi last and pulse twice only.',
      'Top with chia. The most hydrating one — good on a hot day.',
    ] },
  { emoji: '🍎', slot: 'noon', name: 'Apple · Banana · Berries', cal: 240, pro: 4,
    ingredients: '1 apple · 1 frozen banana · ½ cup berries · 1 tbsp chia · cinnamon',
    steps: [
      'Core and chop the apple — leave the skin on for the fibre.',
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
      'Finish with chia. Sharp and sweet — the most refreshing bowl of the set.',
    ] },
  { emoji: '🥥', slot: 'noon', name: 'Papaya · Berries · Banana', cal: 230, pro: 4,
    ingredients: '1 cup papaya · ½ cup berries · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Blend the papaya and frozen banana first until creamy.',
      'Add the berries and blend 5 seconds more.',
      'Spoon into a bowl.',
      'Top with chia. Gentle on the stomach — the easiest bowl to digest.',
    ] },
  { emoji: '🥑', slot: 'noon', name: 'Avocado · Banana · Berries', cal: 300, pro: 5,
    ingredients: '¼ avocado · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Blend the avocado and frozen banana until it goes thick like ice cream.',
      'Spoon it into a bowl — this one is too thick to pour.',
      'Scatter the berries over the top.',
      'Finish with chia. The most filling bowl — the avocado adds your fats.',
    ] },

  { emoji: '🍉', slot: 'noon', name: 'Big Fruit Plate', cal: 260, pro: 4,
    ingredients: 'papaya · watermelon · 1 banana · a handful of berries',
    steps: [
      'Nothing blended — just cut it all onto one large plate.',
      'Start with the watermelon while it is coldest; it digests fastest.',
      'The biggest of the evening plates. Eat until you are full — it is still only 260 calories.',
      'Water or green tea alongside, nothing sweetened.',
    ] },
  { emoji: '🥝', slot: 'noon', name: 'Papaya, Mango & Kiwi Plate', cal: 230, pro: 2,
    ingredients: '1 cup papaya · ½ cup mango · 1 kiwi',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Slice the mango and kiwi alongside it.',
      'Papaya and kiwi both carry natural enzymes — this is the flattest-stomach plate on the list.',
      'Eat it fresh and alone, no yogurt, no toppings.',
    ] },

  // ── 5:00 PM · apple & Greek yogurt ─────────────────────────────────────
  // Greek yogurt is strained, so the same small bowl carries roughly twice the
  // protein of plain. That swap alone is 7 grams for 30 calories, which is the
  // best trade in the whole plan. This is the default 5 PM meal.
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks & Greek Yogurt', cal: 215, pro: 16,
    ingredients: '1 apple · a small bowl of plain Greek yogurt',
    steps: [
      'Core the apple and cut it into thick sticks, skin on — that is where the fibre is.',
      'Spoon the Greek yogurt into a small bowl. It is thicker than plain, so it clings to the apple better as a sauce.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'The default 5 PM meal. Nothing after it but water and tea.',
    ] },
  { emoji: '🥛', slot: 'noon', name: 'Greek Yogurt, Berries & Chia', cal: 230, pro: 18,
    ingredients: 'a bowl of plain Greek yogurt · ½ cup berries · 1 tsp chia · cinnamon',
    steps: [
      'Stir the chia through the yogurt and leave it five minutes to thicken.',
      'Scatter the berries over and add a pinch of cinnamon — that is what makes it taste sweet without a grain of sugar.',
      'Eat it slowly with a teaspoon.',
      'The lightest high-protein close to the day. Nothing after but tea.',
    ] },

  // ── 5:00 PM · the other small options ──────────────────────────────────
  // Plain yogurt instead of Greek, and the two warm options. The sweet potato
  // and the boiled saba are here for an evening you want something warm —
  // take them instead of the apple sticks, not as well as them.
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks & Yogurt', cal: 180, pro: 9,
    ingredients: '1 apple · a small bowl of plain yogurt',
    steps: [
      'Core the apple and cut it into thick sticks — skin on, that is where the fibre is.',
      'Spoon plain unsweetened yogurt into a small bowl. This is the sauce, not a side.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'Nothing after this but tea.',
    ] },
  { emoji: '🍏', slot: 'noon', name: 'Apple Sticks, Yogurt & Cinnamon', cal: 190, pro: 9,
    ingredients: '1 apple · a small bowl of plain yogurt · cinnamon',
    steps: [
      'Cut the apple into sticks, skin on.',
      'Stir a good pinch of cinnamon through the yogurt until it goes pale brown.',
      'Cinnamon is what makes this taste sweet without a grain of sugar in it.',
      'Dip and eat slowly. Nothing after but tea.',
    ] },
  { emoji: '🍏', slot: 'noon', main: true, name: 'Apple Sticks, Yogurt & Chia', cal: 210, pro: 11,
    ingredients: '1 apple · a small bowl of plain yogurt · 1 tsp chia',
    steps: [
      'Stir the chia into the yogurt and leave it five minutes — it thickens the sauce so it clings to the apple.',
      'Cut the apple into sticks while it sits.',
      'Dip and eat slowly.',
      'Drink a full glass of water with it — chia needs the water to work.',
    ] },
  { emoji: '🍌', slot: 'noon', name: 'Boiled Saba Banana', cal: 160, pro: 2,
    ingredients: '1–2 saba bananas',
    steps: [
      'Drop them in boiling water, skin still on, and boil 15–20 min until a fork slides straight through.',
      'The skin peels away easily once they have cooled for a minute.',
      'Eat them warm and plain — no sugar, no butter, they are sweet enough already.',
      'This is a craving option: take it instead of the apple sticks, not as well as them.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Boiled Sweet Potato', cal: 180, pro: 2,
    ingredients: '1 medium sweet potato',
    steps: [
      'Boil it whole 20 min, or bake it at 200°C for 40 min if you have the time — baking makes it far sweeter.',
      'Split it open and eat it straight out of the skin.',
      'No butter, no salt. Slow carbs to close the day.',
      'The other craving option. Instead of the apple sticks, not on top of them.',
    ] },
  { emoji: '🍠', slot: 'noon', name: 'Sweet Potato Sticks & Yogurt', cal: 260, pro: 10,
    ingredients: '1 small sweet potato · a small bowl of plain yogurt · cinnamon',
    steps: [
      'Boil or bake the sweet potato until soft, then let it cool enough to handle.',
      'Cut it into sticks the same way you would the apple.',
      'Dip them in the yogurt with a pinch of cinnamon stirred through.',
      'A craving night and a yogurt night at once. Nothing after but tea.',
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

// One clock, shared by all seven days. Every day eats the same two meals in
// the same order, so there is nothing per-day left to compute.
export const DAILY_MEALS = {
  clock: '12 PM · 5 PM — two meals, and that is all',
  label: '🍽️ The same two meals every day · THE BRUNCH at 12 PM · apple & yogurt or a smoothie at 5 PM · nothing after · under 1,000 calories, over 50 g of protein',
  rows: [
    { time: 'Before 12:00 PM — water, tea & black coffee', icon: '☕', ingredients: [
      { name: 'No food before noon. Train on black coffee — it works, and it is free', key: null },
      { name: 'Water, tea and black coffee, as much as you like', key: null },
      { name: 'This is the half of the day that keeps you under 1,000 calories', key: null },
    ]},
    { time: '12:00 PM — BRUNCH · MEAL A or MEAL B', icon: '🍽️', ingredients: [
      { name: 'ONE of the two, never both. This is the big meal the day is built around', key: null },
      { name: 'A — eggs & whites folded with spinach, kimchi, sweet potato, papaya, seeds, yogurt', key: 'egg' },
      { name: 'B — beef or chicken, sweet potato, spinach, bell pepper, tomato, cucumber, kimchi', key: null, pick: 'protein', slot: 'morning' },
      { name: 'Greek yogurt and a spoon of pumpkin seeds or chia with either one', key: 'yogurtbowl' },
      { name: 'No oil — fold the eggs in a dry non-stick pan, sear the meat in a hot dry one', key: null },
    ]},
    { time: '5:00 PM — Apple & yogurt, or a smoothie', icon: '🍏', ingredients: [
      { name: 'Apple cut into slices, skin on, with yogurt to dip them in', key: 'apple' },
      { name: 'OR a smoothie — two or three fruits blended with chia seeds', key: null, pick: 'fruit', slot: 'lunch' },
      { name: 'Granola over the top of the smoothie', key: 'chia' },
      { name: 'Greek yogurt rather than plain if you have it — twice the protein, same bowl', key: 'yogurtbowl' },
    ]},
    { time: 'After 5:00 PM — the window shuts', icon: '🍵', ingredients: [
      { name: 'Water and tea — as much as you like', key: null },
      { name: 'No food. The closing is what makes the window work', key: null },
      { name: 'Still hungry? Tomorrow’s 12 PM brunch needs to be bigger, not tonight', key: null },
    ]},
  ],
};

// ─── THE WEEK ──────────────────────────────────────────────────────────────
// Monday to Sunday. The shape of it:
//   3 glute days   — Monday, Wednesday, Friday. Never two in a row, because
//                    glutes grow on the day off, not on the day you train them.
//   1 arms day     — Tuesday. Shoulders, back, arms. No core, no videos.
//   1 core day     — Thursday. The five ab moves, then one video, Izzy's or
//                    Nicole's. Core NEVER lands on a glute day: a glute day is
//                    a glute day and nothing else. (The vacuum is not core work
//                    in this sense — it is a two-minute breathing hold, and it
//                    opens every day.)
//   2 weekend days — Jessica Diễm first on both, then sprints on Saturday and
//                    the swim on Sunday. No stretch, and no run on Sunday.
// The one-hour walk closes all seven days, without exception.
//
// The six glute lifts everything is built on, and where each one lives:
//   Hip Thrust ............ Monday        (glute max — size and projection)
//   Romanian Deadlift ..... Monday, Wed   (glute max + hamstrings)
//   Step-Up ............... Monday        (glute max + medius, one leg at a time)
//   Squat ................. Wednesday     (glute max + quads)
//   Bulgarian Split Squat . Wednesday     (glute max + medius, evens the hips)
//   Hip Abduction ......... Friday        (glute medius + minimus — the round side)
export const WORKOUT_DAYS = [
  // ══ MONDAY ══ Day one of the week. Hip Thrust · RDL · Step-Up
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute Power', title: 'Hip Thrust · RDL · Step-Up',
    sub: '~120 min total · warm-up → vacuum → glute activation → main workout → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    noteBefore: { type: 'rose', text: '🍑 Hip thrust first, while you are freshest.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Whole body, first thing.'),
      WARMUP,
      ...VACUUM_SEC,
      H('🍑 Glute Activation', 'After the vacuum, straight into the bar.'),
      { name: 'Glute & Hamstring Activation', detail: '5 min · banded glute bridges × 20 → lateral band walks × 15 each → donkey kicks × 15 each' },
      H('🍑 Main Workout', '3 lifts · 3 × 10 · in this order.'),
      { name: '1. Barbell Hip Thrust', detail: 'MAIN 1 of 3 · 3 × 10 · shoulders on a bench, chin tucked, drive the hips up to parallel, pause 2 sec at the top, lower for 3 sec · GLUTEUS MAXIMUS' },
      { name: '2. Romanian Deadlift (RDL)', detail: 'MAIN 2 of 3 · 3 × 10 · soft knees, hinge from the hips, lower for 3 sec until the hamstrings stretch, drive the hips forward to stand · GLUTEUS MAXIMUS + HAMSTRINGS' },
      { name: '3. Dumbbell Step-Up', detail: 'MAIN 3 of 3 · 3 × 10 each leg · a dumbbell in each hand, step onto a knee-high bench, drive through the whole front foot, lower for 3 sec · GLUTEUS MAXIMUS + MEDIUS · do not push off the back foot' },
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      JUMP_ROPE,
    ],
    noteAfter: { type: 'gold', text: '📋 Write your weights in. Add 2.5 kg when three sets feel easy.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ TUESDAY ══ Arms, back and shoulders. No videos of any kind.
  //
  // This day used to be abs, shoulders and back at once, doubling the core up
  // with Thursday. The core moved out entirely — no vacuum, no ab moves — and
  // so did every video: Izzy's core sessions and Nicole's full-body ones both
  // belong to Thursday now, so there is nothing on this day but the eight
  // moves. Three for the shoulder, two for the back, three for the arm.
  {
    emoji: '💪', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Arms, Back & Shoulders', title: 'Shoulders · Back · Arms',
    sub: '~105 min total · warm-up → vacuum → shoulders → back → arms → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    noteBefore: { type: 'gold', text: '💪 Shoulders, then back, then arms. Light weight, slow lowering.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Whole body, first thing.'),
      WARMUP,
      ...VACUUM_SEC,
      H('🫧 Main Workout · Shoulders', 'Three moves, in order. Keep them light.'),
      ...SHOULDERS,
      H('🏋️ Main Workout · Back', 'Two moves. Back flat on the row.'),
      ...BACK_CHEST,
      H('💪 Main Workout · Arms', 'Three moves, in order. Slow on the way down.'),
      ...ARMS,
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      JUMP_ROPE,
    ],
    noteAfter: { type: 'rose', text: '📋 These grow by reps, not by weight. Swinging means too heavy.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ WEDNESDAY ══ Squat · Bulgarian Split Squat · RDL
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute Strength', title: 'Squat · Split Squat · RDL',
    sub: '~120 min total · warm-up → vacuum → glute activation → main workout → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    noteBefore: { type: 'rose', text: '🔥 The heaviest day. Go below parallel, or go lighter.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Whole body, first thing.'),
      WARMUP,
      ...VACUUM_SEC,
      H('🍑 Glute Activation', 'After the vacuum, straight into the bar.'),
      { name: 'Glute & Quad Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → bodyweight squats × 15 → hip circles × 10 each' },
      H('🍑 Main Workout', '3 lifts · 3 × 10 · in this order.'),
      { name: '1. Barbell Back Squat', detail: 'MAIN 1 of 3 · 3 × 10 · bar on your upper back, chest tall, sit to below parallel, drive up through the whole foot · GLUTEUS MAXIMUS + QUADS · go below parallel or go lighter' },
      { name: '2. Bulgarian Split Squat', detail: 'MAIN 2 of 3 · 3 × 10 each leg · rear foot on a bench, lower the front thigh to parallel · GLUTEUS MAXIMUS + MEDIUS · lean 10–15° forward for the glute, stay upright for the quad' },
      { name: '3. Romanian Deadlift (RDL)', detail: 'MAIN 3 of 3 · 3 × 10 · soft knees, hinge from the hips, lower for 3 sec until the hamstrings stretch, drive the hips forward to stand · GLUTEUS MAXIMUS + HAMSTRINGS · lighter than Monday' },
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      JUMP_ROPE,
    ],
    noteAfter: { type: 'gold', text: '📋 Write your weights in. Stuck two weeks is normal — add a rep.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ THURSDAY ══ The video day, and the only ab day.
  //
  // Every video in the plan lives here: Izzy's core sessions and Nicole's
  // full-body ones, one or the other, her pick. The arms, back and shoulder
  // work is not on this day at all — that is Tuesday's, and nothing is doubled
  // up between the two any more. The five ab moves stay, since they are the
  // work this day is named for. The vacuum is no longer special to it: every
  // day opens with one now.
  {
    emoji: '🎯', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Core & Videos', title: 'Abs · Izzy or Nicole',
    sub: '~95 min total · warm-up → vacuum → abs → one video → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    noteBefore: { type: 'gold', text: '🎯 The five ab moves, then ONE video — Izzy or Nicole, not both.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Whole body, first thing.'),
      WARMUP,
      ...VACUUM_SEC,
      H('🎯 Main Workout · Abs', 'All five, in order.'),
      ...ABS_MAIN,
      H('🌀 Then ONE video · Deep Core — Izzy', 'Izzy or Nicole, not both. Pick one.', 'core'),
      ...IZZY_ABS,
      H('🧘 Or ONE of these · Full Body — Nicole', 'The other choice. Pick one.', 'core'),
      ...NICOLE_FULLBODY,
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      JUMP_ROPE,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Only the weighted crunch gets heavier. Stop anything that hurts past 2 out of 10.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ FRIDAY ══ Hip Abduction · Kickback · Sumo Squat
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glute Shape', title: 'Abduction · Kickback · Sumo',
    sub: '~115 min total · warm-up → vacuum → glute activation → main workout → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    noteBefore: { type: 'rose', text: '✨ Lighter weight, slower reps. Hold every squeeze 2 seconds.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Whole body, first thing.'),
      WARMUP,
      ...VACUUM_SEC,
      H('🍑 Glute Activation', 'After the vacuum, straight into the work.'),
      { name: 'Glute Medius Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each → fire hydrants × 15 each' },
      H('🍑 Main Workout', '3 lifts · 3 × 10 · in this order.'),
      { name: '1. Hip Abduction (machine or band)', detail: 'MAIN 1 of 3 · 3 × 10 · push the knees apart, hold 2 sec at the widest point, release slow · GLUTEUS MEDIUS + MINIMUS · lean forward for the upper glute, sit upright for the side' },
      { name: '2. Cable Kickback', detail: 'MAIN 2 of 3 · 3 × 10 each leg · hinge forward slightly, drive the heel back and up, hold 2 sec, lower slow · GLUTEUS MAXIMUS, upper fibres · a band round your ankle works at home' },
      { name: '3. Sumo Squat', detail: 'MAIN 3 of 3 · 3 × 10 · feet wide, toes out 45°, weight held between your legs, sit straight down and drive the knees out · GLUTEUS MAXIMUS + INNER THIGH' },
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      JUMP_ROPE,
    ],
    noteAfter: { type: 'gold', text: '📋 Add resistance only when you can still hold the squeeze.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ SATURDAY ══ Jessica Diem · sprints · walk
  //
  // The video leads both weekend days now. It used to come second here, after
  // the sprints; the order is the other way round, so the full-body session is
  // the first thing done and the sprints follow it. There is no stretch on
  // either weekend day any more.
  //
  // The easy run stays as the gentler option for legs that still feel Friday.
  {
    emoji: '⚡', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Saturday · Jessica Diem & Sprints', title: 'Jessica Diem · Sprints',
    sub: 'Vacuum → one Jessica Diem video → sprints → 1-hour walk',
    cardio: { icon: '🚶', title: 'One-hour walk after training', note: '60 min · every day, after the main workout' },
    sprintDay: true,
    noteBefore: { type: 'gold', text: '💗 The video first, then the sprints. In that order.' },
    exercises: [
      ...VACUUM_SEC,
      H('💗 1 · Jessica Diem — pick ONE video', 'After the vacuum. Her videos are full body.', 'core'),
      ...JESSICA_DIEM,
      H('⚡ 2 · Sprints', 'After the video. Warm up first — never sprint cold.'),
      RUN_WARMUP,
      RUN_INTERVALS,
      H('🏃 Instead · Easy run or a short walk', 'Only if your legs still feel Friday. Pick one.'),
      RUN_EASY,
      REST_WALK,
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
    ],
    noteAfter: { type: 'rose', text: '💡 Sore hamstrings? Take the easy run instead. The hour walk still stands.' },
    meals: DAILY_MEALS,
  },
  // ══ SUNDAY ══ Jessica Diem · swim · walk
  //
  // No running on this day at all, and no stretch. One Jessica Diễm video is
  // the session — her videos are full-body — and the swim follows it. Biking
  // is kept at the bottom as an extra rather than thrown away.
  {
    emoji: '🏊', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Jessica Diem & Swim', title: 'Jessica Diem · Swim',
    sub: 'Vacuum → one Jessica Diem video → swimming → 1-hour walk',
    cardio: { icon: '🏊', title: 'Swimming after the video', note: '30–45 min easy laps, after the main workout' },
    noteBefore: { type: 'gold', text: '💗 The video first, then the swim. In that order.' },
    exercises: [
      ...VACUUM_SEC,
      H('💗 1 · Jessica Diem — pick ONE video', 'After the vacuum. Her videos are full body.', 'core'),
      ...JESSICA_DIEM,
      H('🏊 2 · Swimming', 'After the video.'),
      SWIM,
      H('🚶 Finish · One-Hour Walk', 'Every day, after the main workout.'),
      WALK_HOUR,
      H('🚲 Extra · Biking', 'Only if you want more. Not part of the day.'),
      BIKE,
    ],
    noteAfter: { type: 'rose', text: '💡 Water carries your weight, so the swim adds work without anything for your legs to recover from.' },
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
