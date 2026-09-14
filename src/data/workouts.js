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
// Monday to Friday every training day is the same four-part shape, in this
// order and no other:
//     full-body stretch  →  20-min zone 2 run  →  the main workout  →  rope OR walk
// The run goes BEFORE the main workout, every weekday. The finisher is one of
// two things, never both: jump rope if you want to sweat, the walk if you want
// to come down quietly.
//   • Glute days (3×) — three lifts each, no filler:
//       Mon  Back Squat · Bulgarian Split Squat · RDL
//       Wed  Cable Kickback · Hip Abduction · Sumo Squat
//       Fri  Hip Thrust · RDL · Back Squat
//   • Back, shoulder & core days (2×: Tue · Thu) — stretch and vacuum, run,
//     then ONE shoulder move, ONE back move, ONE core video.
// Weekend (Sat · Sun): NO zone 2 run — the run IS the session. Saturday is an
// easy run, Sunday is the sprint-interval protocol that advances each
// challenge month. Then forearm-stand training and a long stretch. No lifting
// either day.

// Shared warm-up, shared run, shared finisher. Every weekday now runs all
// three; the weekend keeps its own run and its own walk alternative.
const WARMUP = { name: 'Full-Body Stretch Warm-Up', detail: '5–8 min · neck, shoulders, chest, back, hips, hamstrings, calves · loosen every major muscle before you train · dynamic swings then gentle holds' };
// The zone 2 run — Monday to Friday, always before the main workout, never at
// the weekend (Saturday and Sunday already run). Zone 2 is the easy gear: if
// you cannot hold a conversation you have left it, and it stops counting.
const ZONE2_RUN = { name: 'Zone 2 Run — 20 min', detail: '20 min · BEFORE the main workout, Monday to Friday · easy conversational pace, breathe through your nose, roughly 60–70% of your max heart rate · if you are gasping you have left zone 2 — slow to a jog or a fast walk until you can talk again · this is the fat-burning gear, and going harder does not make it work better' };
// Every weekday finishes with ONE of these two — rope if you want to sweat,
// the walk if you want to come down quietly. Not both; pick one.
const JUMP_ROPE = { name: 'Jump Rope', detail: '10–20 min · steady, light on the balls of your feet · pick this OR the walk to finish, not both' };
const ALT_WALK = { name: '20-Minute Walk — instead of the rope', detail: '20 min · the alternative to the rope, not an extra lap after it · flat easy pace, relaxed breathing · take this on the days you want to come down quietly rather than sweat' };

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

// Forearm-stand (elbow stand / Pincha Mayurasana) training — the weekend goal.
// Drills first, then pick one video to follow.
const FOREARM_STAND_DRILLS = [
  { name: 'Dolphin Pose Hold', detail: '4 × 30–45 sec · forearms flat, elbows shoulder-width, walk feet toward your elbows · builds the exact shoulder position of a forearm stand' },
  { name: 'Forearm Plank', detail: '3 × 45–60 sec · elbows under shoulders, ribs down, glutes on · the straight line you need upside down' },
  { name: 'Hollow Body Hold', detail: '3 × 20–30 sec · low back pressed flat, legs and shoulders off the floor · stops the banana back that tips you over' },
  { name: 'Dolphin Wall Walk', detail: '3 × 3–5 walks · from dolphin, walk your feet up the wall until hips stack over shoulders · hold 10–20 sec, walk down slowly' },
  { name: 'Dolphin Pike Hops', detail: '4 × 5–8 hops · from dolphin, hop hips over shoulders and land soft · learn to find balance without kicking hard' },
];

const HANDSTAND_INTERMEDIATE = [
  { name: 'Elbow Stand — Forearm Stand (Calisthenics)',  detail: 'School of Calisthenics · elbow/forearm stand · the "brakes", kick-up, and balance', url: 'https://www.youtube.com/watch?v=6abRwGwQ704' },
  { name: 'Elbow Stand — Pincha Mayurasana Tips',        detail: 'Blessed Yoga · forearm-stand tips & tricks · shoulder alignment and a controlled kick-up', url: 'https://www.youtube.com/watch?v=emCch6a0DV4' },
  { name: 'Elbow Stand — Float into Forearm Stand',      detail: 'Shambhala Yoga · follow-along · float up with control instead of kicking', url: 'https://www.youtube.com/watch?v=DtvzGQj5C6I' },
  { name: 'Handstand — Complete Handstand Guide',        detail: 'Tom Merrick · beginner to intermediate · wall drills, hollow body, and balance', url: 'https://www.youtube.com/watch?v=2-3wv5kLNnw' },
  { name: 'Handstand — Master the Handstand & Press',    detail: 'Bert Wang · step-by-step handstand + press handstand · intermediate control', url: 'https://www.youtube.com/watch?v=KknM6GXJJIs' },
];

const YOGA_BEGINNER = [
  { name: 'Yoga — Complete Beginners (20 min)', detail: 'Yoga With Adriene · gentle intro, build the basics', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
  { name: 'Yoga — Beginners: The Basics',       detail: 'Yoga With Adriene · foundational poses & alignment', url: 'https://www.youtube.com/watch?v=pWobp3phsEU' },
  { name: 'Yoga — Flexible Mind & Body',        detail: 'Yoga With Adriene · flexibility flow toward inversions', url: 'https://www.youtube.com/watch?v=xFEAOzWLx8Y' },
];

// Weekend running. Saturday is the easy one, Sunday runs the interval protocol
// that already advances by itself each challenge month (SPRINT_PROGRESSION at
// the top of this file) — so the session gets harder without you editing it.
const RUN_WARMUP = { name: 'Run Warm-Up', detail: '5 min · brisk walk building to a slow jog · ankle circles, leg swings, 3 × 20 m build-ups · never start a run cold' };
const RUN_EASY = { name: 'Easy Run', detail: '20–30 min · conversational pace — if you cannot talk, slow down · flat route, land soft under your hips, shoulders loose · builds your engine without eating into leg recovery for Monday' };
const RUN_INTERVALS = (() => {
  const sp = getCurrentSprintProtocol();
  return {
    name: `Sprint Intervals — ${sp.reps} rounds`,
    detail: `${sp.reps} rounds · ${sp.sprint} sec hard, ${sp.rest} sec easy walk between · hold form over speed; the moment your form breaks, that round was your last · this protocol steps up on its own every challenge month (${sp.month})`,
  };
})();
const REST_STRETCH = { name: 'Long Full-Body Stretch', detail: '15–25 min · hold each stretch 45–60 sec · hamstrings, hips, chest, shoulders, wrists, calves · this is the work on a rest day' };
const REST_WALK = { name: '20-Minute Walk — instead of the run', detail: '20 min · the alternative to running today, not an extra lap after it · no pace target, sunshine, podcast, whatever you like · take this on any weekend your legs still feel Friday' };
const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · do this FIRST before your core video' };

// ─── ABS ───────────────────────────────────────────────────────────────────
// The waist work, two or three times a week and never more. These five build
// the deep wall and the visible blocks without loading the obliques heavy —
// heavy side bends and weighted twists are what thicken a waist, so they are
// not in this plan and will not be. The stomach vacuum above belongs to the
// same job: it pulls the waist in where crunches only push it out.
const ABS_MAIN = [
  { name: '1. Weighted Crunch', detail: 'ABS 1 of 5 · 3 × 12 reps · one dumbbell or plate held on your chest, curl the ribs down toward the hips, lower for 3 sec · the only weighted ab move in the plan — grow this by adding weight, not by adding reps, and never go past 15 reps' },
  { name: '2. Reverse Crunch', detail: 'ABS 2 of 5 · 3 × 15 reps · flat on your back, knees at 90°, curl the hips off the floor toward your chest and lower slow · this is the lower-stomach move, the part that shows up last and matters most' },
  { name: '3. Lying Leg Raise', detail: 'ABS 3 of 5 · 3 × 12 reps · hands under your hips, legs straight, lower them until just above the floor and lift back · press your low back flat into the mat the whole way — the moment it arches, that rep stopped counting' },
  { name: '4. Dead Bug', detail: 'ABS 4 of 5 · 3 × 10 reps each side · on your back, arms up, knees at 90°, lower the opposite arm and leg slowly, then bring them back · the safest deep-core move there is, and the one that protects your back under the bar' },
  { name: '5. Plank', detail: 'ABS 5 of 5 · 3 × 30–60 sec · elbows under shoulders, ribs pulled down, glutes squeezed, body in one straight line · add 10 sec a week rather than sagging into a longer hold' },
];


// ── JESSICA DIEM ── The weekend videos. These sit alongside the strength work,
// they never replace it: the lifting week stays Thursday, Monday and Wednesday
// for glutes, Friday and Tuesday for abs and upper body.
const JESSICA_DIEM = [
  { name: 'Jessica Diễm — her channel', detail: 'Her page. Everything she posts is here — workouts, clean-eating and the daily vlogs', url: 'https://www.youtube.com/@Jessicadiem1122' },
  { name: 'Jessica Diễm — all her videos, newest first', detail: 'Her programme started Thursday 10 September 2026 · scroll to that day and work forward in order, one video per weekend day, so you follow it the way she laid it out', url: 'https://www.youtube.com/@Jessicadiem1122/videos' },
];

// ── UPPER BODY ── Moderate on purpose. Slim arms, straight shoulders, a back
// that holds you up — none of which needs heavy pressing or big arm work. Light
// weight, slow control, and these numbers stay where they are.
const UPPER_BODY = [
  { name: 'Band Pull-Apart', detail: 'UPPER 1 of 3 · 3 × 20 reps · light band, arms straight at chest height, pull apart and hold the squeeze between your shoulder blades 1 sec, return slow · the single best fix for rounded posture — light enough that you never feel it in your neck' },
  { name: 'Double-Arm Dumbbell Row', detail: 'UPPER 2 of 3 · 3 × 12 reps · a dumbbell in each hand, hinge to about 45°, back flat and chest proud, row both to your ribs and hold 1 sec, lower for 3 sec · both arms together keeps you square — if you feel it in your lower back, hinge less' },
  { name: 'Incline Push-Up', detail: 'UPPER 3 of 3 · 3 × 10 reps · hands on a bench, chair or the kitchen counter, body in one straight line, lower for 3 sec · tones the arms and the chest at the same time · the higher the surface, the easier it is — lower the surface as you get stronger instead of adding weight' },
];

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// One eating window, 8 AM to 2 PM, and it is the same every single day — glute
// day, abs day, weekend, all of it. Three meals, always in this order:
//
//   8:00 AM   fruit, and not much of it. This is also your fuel for training,
//             so it goes in before the run, not after.
//   11:00 AM  apple sticks with Greek yogurt for the sauce. Small on purpose.
//   2:00 PM   THE BIG MEAL. Protein, sweet potato, eggs, veg and a banana.
//             This is the meal the whole day is built around.
//
//   After 2 PM — nothing but water, tea and black coffee. That is the window
//   closing, and the closing is what makes the window work.
//
// No chicken, no beef, no pork — ever. Fish, eggs, tofu and yogurt are all
// fair game on any day.

// ─── THE TWO NUMBERS ───────────────────────────────────────────────────────
// Only two, and they pull against each other, which is the whole difficulty:
//
//   1,000 calories a day  — the ceiling.
//   50 grams of protein   — the floor.
//
// A thousand calories is a small budget, so almost all of it has to do real
// work. That rules out oil, sugar and big piles of rice, and it rules IN the
// foods that carry protein cheaply: white fish, eggs, Greek yogurt, tofu.
//
// The standard day, and what it costs:
//    8:00 AM   banana & berries .................  140 cal ·  2 g
//   11:00 AM   apple sticks & Greek yogurt ......  215 cal · 16 g
//    2:00 PM   fish, sweet potato, eggs & banana   660 cal · 60 g
//                                                 ————————   ————
//                                                 1,015 cal · 78 g
//
// Under the ceiling, well over the floor. Both meters in the app count only
// the meals actually chosen, so an untouched day honestly reads zero.
export const PROTEIN_TARGET = 50;
export const CALORIE_TARGET = 1000;

// The meal times. Tap one in the app to see every meal you can choose for that
// slot, with the ingredients and the step-by-step method. The slot ids have
// not changed, so every meal already saved against a day stays put — only the
// clock times and the sizes moved.
//
// `sunset` is gone: the window now closes at 2 PM, so there is no evening
// meal to choose. Everything that used to live there — the apple sticks, the
// yogurt, the boiled sweet potato and saba — moved to 11 AM, which is where
// those meals belong now. Nothing was thrown away.
const SLOT_DEFS = {
  wake: { id: 'wake', time: '8:00 AM',  emoji: '🍌' },
  noon: { id: 'noon', time: '11:00 AM', emoji: '🍏' },
  post: { id: 'post', time: '2:00 PM',  emoji: '🍠' },
};

// The same three slots every day, in clock order.
export function mealSlots() {
  return [
    { ...SLOT_DEFS.wake, label: 'Fruit — small',        hint: 'Just fruit, and not much of it · this is your fuel for training, so eat it before you run' },
    { ...SLOT_DEFS.noon, label: 'Apple & Greek Yogurt', hint: 'Apple sticks, Greek yogurt for the sauce · small on purpose — the big meal is at 2 PM' },
    { ...SLOT_DEFS.post, label: 'THE BIG MEAL',         hint: 'Protein, sweet potato, eggs, veg and a banana · most of your day\u2019s food and nearly all of its protein' },
  ];
}

// Flat list, only for looking a meal's clock time up by its slot id.
export const MEAL_SLOTS = [SLOT_DEFS.wake, SLOT_DEFS.noon, SLOT_DEFS.post];

// Every meal you can pick, grouped by slot. Oil-free and salt-free by default.
export const RECOMMENDED_MEALS = [
  // ══ THE BIG MEAL · 2:00 PM · every day ═════════════════════════════════
  // The meal the whole day is built around, and the last one before the
  // window shuts. Every plate here is built the same way: a protein, a sweet
  // potato, eggs, something green or fermented, and a banana to finish. They
  // run 530–725 calories and 36–60 g of protein, which is what makes a
  // 1,000-calorie day clear the 50 g floor instead of falling short of it.
  //
  // These are the plates that show first when you open 2 PM. Everything below
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

  // ── SMALLER 2 PM PLATES ────────────────────────────────────────────────
  // The original plates, all still here. They are lighter than the six above,
  // so on a day you pick one the meter will read well under 1,000 — which is
  // fine on a rest day and not enough on a lifting day.
  // Any protein, any day: fish, eggs or tofu. Kimchi on the side, then the
  // cucumber and the banana. Never chicken, beef or pork.
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

  // ── DOUBLE PROTEIN · 2:00 PM ───────────────────────────────────────────
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

  // ── 8:00 AM · fruit, and not much of it ────────────────────────────────
  // Small on purpose, and it is also your fuel for training, so it goes in
  // before the run rather than after it. A banana is genuinely enough. Nothing
  // here costs more than 260 calories, because the 2 PM plate needs the room.
  { emoji: '🍌', slot: 'wake', name: 'Banana & Coffee', cal: 100, pro: 1,
    ingredients: '1 banana · black coffee',
    steps: [
      'Eat the banana first, coffee second — caffeine on a truly empty stomach is what makes you shaky by set three.',
      'Ripe and spotted is better: the starch has turned to sugar, so it reaches your legs faster.',
      'Black, no milk, no sugar.',
      'Give it 20–30 minutes before you start warming up.',
    ] },
  { emoji: '🍌', slot: 'wake', name: 'Two Bananas & Coffee', cal: 190, pro: 3,
    ingredients: '2 bananas · black coffee',
    steps: [
      'For heavy Monday and Friday sessions, or any morning you wake up hungry.',
      'Eat both bananas, then the coffee.',
      'Still nothing else — you eat properly straight after training.',
      'If two feels heavy in the squat, drop back to one.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Overnight Yogurt Bowl', cal: 320, pro: 33,
    ingredients: 'yogurt · 1 scoop protein powder · 1 tsp psyllium husk · 10 blueberries',
    steps: [
      'The night before: stir the protein powder into the yogurt until there are no dry pockets left.',
      'Add the psyllium husk and mix straight away — it thickens fast, so it has to go in moving.',
      'Drop the 10 blueberries on top, cover, and leave it in the fridge overnight.',
      'Eat it cold, either the moment you wake on a glute day or at 12 PM on a core day. Drink a full glass of water with it — psyllium needs the water to work.',
    ] },
  { emoji: '🍠', slot: 'wake', name: 'Sweet Potato & Coffee', cal: 180, pro: 2,
    ingredients: '1 small sweet potato (cooked the night before) · black coffee',
    steps: [
      'Boil or steam it the night before and leave it in the fridge.',
      'Eat it cold or warmed — cold sweet potato is actually gentler on your gut.',
      'Slower carbs than a banana, so give it 45 minutes before you lift.',
      'Good on the mornings a banana leaves you hungry by the second lift.',
    ] },
  { emoji: '🥭', slot: 'wake', name: 'Mango & Banana Plate', cal: 190, pro: 2,
    ingredients: '1 banana · ½ cup mango',
    steps: [
      'Slice both onto a plate — nothing blended, nothing added.',
      'Fast sugar, straight to your legs.',
      'Coffee alongside if you want it.',
      'Eat it 20 minutes before you warm up.',
    ] },

  // ── THE BIG BOWLS · 8:00 AM · instead of BOTH small meals ──────────────
  // A bowl this size is not a small 8 AM meal — it is 8 AM and 11 AM together.
  // Take one and skip the apple and yogurt, or the day runs over 1,000. Good on
  // a morning you would rather eat once and get on with it.
  { emoji: '💪', slot: 'wake', name: 'Protein Bowl · Berries & Banana', cal: 470, pro: 32,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Frozen berries and frozen banana in the blender with the scoop of protein powder and a splash of water.',
      'Blend thick — push the fruit down with a spoon rather than adding more water, or the powder makes it foamy.',
      'Spoon into a bowl and stir the chia through while it is still soft.',
      'Granola over the top and sliced banana across it. This one bowl is about a third of your whole day’s protein.',
    ] },
  { emoji: '💪', slot: 'wake', name: 'Protein Bowl · Mango & Banana', cal: 480, pro: 32,
    ingredients: '1 cup frozen mango · 1 frozen banana · 1 scoop protein powder · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Mango and banana frozen, protein powder in with them, only a splash of water.',
      'Blend until it holds a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola on top, then the berries. Sweeter than the berry one — good on a heavy training day.',
    ] },
  { emoji: '🥛', slot: 'wake', name: 'Protein Bowl · Yogurt & Fruit', cal: 430, pro: 38,
    ingredients: 'a bowl of Greek yogurt · 1 scoop protein powder · 1 frozen banana · ½ cup berries · 3 tbsp granola · 1 tbsp chia',
    steps: [
      'Stir the protein powder into the Greek yogurt first, until there are no dry pockets left.',
      'Blend the frozen banana on its own until creamy, then fold it through the yogurt.',
      'Scatter the berries over and stir the chia in.',
      'Granola last so it stays crunchy. The highest-protein bowl on the list — this one alone is most of your 50 grams.',
    ] },

  // ── SMOOTHIE BOWLS · 8:00 AM · instead of BOTH small meals ─────────────
  // Two or three frozen fruits, never more. Granola and chia stirred through.
  // Same rule as the protein bowls above: one of these replaces BOTH small
  // meals, it does not sit on top of the 11 AM one.
  { emoji: '🥣', slot: 'wake', name: 'Granola Bowl · Mango & Banana', cal: 380, pro: 8,
    ingredients: '1 cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Two or three frozen fruits in the blender, never more — that is what keeps it thick instead of runny, and keeps the sugar sensible.',
      'Blend the mango and banana with only a splash of water. Push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and stir the chia through while it is still soft.',
      'Granola over the top, then berries and sliced banana — or whatever fruit is in the house.',
    ] },
  { emoji: '🥣', slot: 'wake', name: 'Granola Bowl · Berries & Banana', cal: 370, pro: 8,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Frozen berries and frozen banana only — two fruits is enough for this one.',
      'Blend them thick with a splash of water until the colour goes deep purple.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top and sliced banana across it.',
    ] },
  { emoji: '🥣', slot: 'wake', name: 'Granola Bowl · Papaya, Mango & Banana', cal: 390, pro: 8,
    ingredients: '1 cup papaya · ½ cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Three fruits — the ceiling. Freeze the mango and banana the night before; the papaya goes in fresh because it is wet enough.',
      'Blend all three with no water at first, adding a teaspoon at a time only if the blender sticks.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top, berries scattered on. The easiest one on the stomach.',
    ] },
  { emoji: '🥣', slot: 'wake', name: 'Granola Bowl · Dragon Fruit & Banana', cal: 360, pro: 8,
    ingredients: '1 cup frozen dragon fruit · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Freeze the dragon fruit cubes and the banana the night before.',
      'Blend both until deep pink and thick enough to hold a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola, then berries and banana on top.',
    ] },
  { emoji: '🥣', slot: 'wake', name: 'Papaya · Banana · Mango', cal: 250, pro: 4,
    ingredients: '1 cup papaya · 1 frozen banana · ½ cup mango · 1 tbsp chia · splash of water',
    steps: [
      'Freeze the banana and mango the night before — frozen fruit is what makes it thick instead of runny.',
      'Blend all three fruits with only a splash of water.',
      'Stop and push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and top with chia. No milk, no sugar.',
    ] },
  { emoji: '🥭', slot: 'wake', name: 'Mango · Banana · Berries', cal: 260, pro: 4,
    ingredients: '1 cup mango · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Use frozen mango and banana straight from the freezer.',
      'Blend them first until creamy, then add the berries for 5 seconds only — that keeps the colour bright.',
      'Spoon into a bowl.',
      'Top with chia and a few whole berries.',
    ] },
  { emoji: '🍈', slot: 'wake', name: 'Papaya · Pineapple · Banana', cal: 240, pro: 4,
    ingredients: '1 cup papaya · ½ cup pineapple · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Blend with pineapple and frozen banana until thick.',
      'Pour into a bowl.',
      'Top with chia. This is the best one for digestion — papaya and pineapple both carry natural enzymes.',
    ] },
  { emoji: '🍓', slot: 'wake', name: 'Berries · Banana · Kiwi', cal: 230, pro: 4,
    ingredients: '1 cup mixed berries · 1 frozen banana · 1 kiwi · 1 tbsp chia',
    steps: [
      'Blend the frozen berries and banana with a splash of water.',
      'Slice the kiwi into rounds — this one goes on top, not in the blender.',
      'Pour the purple base into a bowl.',
      'Lay the kiwi over it and finish with chia.',
    ] },
  { emoji: '🌴', slot: 'wake', name: 'Mango · Papaya · Pineapple', cal: 250, pro: 4,
    ingredients: '1 cup mango · 1 cup papaya · ½ cup pineapple · 1 tbsp chia',
    steps: [
      'Freeze the mango and pineapple beforehand.',
      'Blend all three together — no water at first, the papaya is wet enough.',
      'Add water only a teaspoon at a time if the blender sticks.',
      'Top with chia. Pure tropical, no banana needed.',
    ] },
  { emoji: '🐉', slot: 'wake', name: 'Dragon Fruit · Banana · Berries', cal: 220, pro: 4,
    ingredients: '1 cup dragon fruit · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Freeze the dragon fruit cubes and the banana.',
      'Blend both until deep pink and thick.',
      'Fold the berries through by hand so they stay whole.',
      'Top with chia.',
    ] },
  { emoji: '🍉', slot: 'wake', name: 'Watermelon · Kiwi · Banana', cal: 200, pro: 4,
    ingredients: '1 cup frozen watermelon · 1 kiwi · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Freeze the watermelon cubes — fresh watermelon makes this too watery to be a bowl.',
      'Blend it with the frozen banana until slushy.',
      'Add the kiwi last and pulse twice only.',
      'Top with chia. The most hydrating one — good on a hot day.',
    ] },
  { emoji: '🍎', slot: 'wake', name: 'Apple · Banana · Berries', cal: 240, pro: 4,
    ingredients: '1 apple · 1 frozen banana · ½ cup berries · 1 tbsp chia · cinnamon',
    steps: [
      'Core and chop the apple — leave the skin on for the fibre.',
      'Blend it with the frozen banana and berries until smooth.',
      'Pour into a bowl.',
      'Top with chia and a pinch of cinnamon.',
    ] },
  { emoji: '🍍', slot: 'wake', name: 'Pineapple · Mango · Kiwi', cal: 235, pro: 4,
    ingredients: '1 cup pineapple · 1 cup mango · 1 kiwi · 1 tbsp chia',
    steps: [
      'Use frozen pineapple and mango.',
      'Blend them thick with a splash of water.',
      'Slice the kiwi for the top.',
      'Finish with chia. Sharp and sweet — the most refreshing bowl of the set.',
    ] },
  { emoji: '🥥', slot: 'wake', name: 'Papaya · Berries · Banana', cal: 230, pro: 4,
    ingredients: '1 cup papaya · ½ cup berries · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Blend the papaya and frozen banana first until creamy.',
      'Add the berries and blend 5 seconds more.',
      'Spoon into a bowl.',
      'Top with chia. Gentle on the stomach — the easiest bowl to digest.',
    ] },
  { emoji: '🥑', slot: 'wake', name: 'Avocado · Banana · Berries', cal: 300, pro: 5,
    ingredients: '¼ avocado · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Blend the avocado and frozen banana until it goes thick like ice cream.',
      'Spoon it into a bowl — this one is too thick to pour.',
      'Scatter the berries over the top.',
      'Finish with chia. The most filling bowl — the avocado adds your fats.',
    ] },

  { emoji: '🍉', slot: 'wake', name: 'Big Fruit Plate', cal: 260, pro: 4,
    ingredients: 'papaya · watermelon · 1 banana · a handful of berries',
    steps: [
      'Nothing blended — just cut it all onto one large plate.',
      'Start with the watermelon while it is coldest; it digests fastest.',
      'This is the whole 12 PM meal on a core day. Eat until you are full.',
      'Water or green tea alongside, nothing sweetened.',
    ] },
  { emoji: '🥝', slot: 'wake', name: 'Papaya, Mango & Kiwi Plate', cal: 230, pro: 2,
    ingredients: '1 cup papaya · ½ cup mango · 1 kiwi',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Slice the mango and kiwi alongside it.',
      'Papaya and kiwi both carry natural enzymes — this is the flattest-stomach plate on the list.',
      'Eat it fresh and alone, no yogurt, no toppings.',
    ] },

  // ── 11:00 AM · apple & Greek yogurt ────────────────────────────────────
  // Greek yogurt is strained, so the same small bowl carries roughly twice the
  // protein of plain. That swap alone is 7 grams for 30 calories, which is the
  // best trade in the whole plan. This is the default 11 AM meal.
  { emoji: '🍏', slot: 'noon', name: 'Apple Sticks & Greek Yogurt', cal: 215, pro: 16,
    ingredients: '1 apple · a small bowl of plain Greek yogurt',
    steps: [
      'Core the apple and cut it into thick sticks, skin on — that is where the fibre is.',
      'Spoon the Greek yogurt into a small bowl. It is thicker than plain, so it clings to the apple better as a sauce.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'The default version of this meal now. Nothing after but tea.',
    ] },
  { emoji: '🥛', slot: 'noon', name: 'Greek Yogurt, Berries & Chia', cal: 230, pro: 18,
    ingredients: 'a bowl of plain Greek yogurt · ½ cup berries · 1 tsp chia · cinnamon',
    steps: [
      'Stir the chia through the yogurt and leave it five minutes to thicken.',
      'Scatter the berries over and add a pinch of cinnamon — that is what makes it taste sweet without a grain of sugar.',
      'Eat it slowly with a teaspoon.',
      'The lightest high-protein close to the day. Nothing after but tea.',
    ] },

  // ── 11:00 AM · the other small options ─────────────────────────────────
  // Plain yogurt instead of Greek, and the two warm options. The sweet potato
  // and the boiled saba are here for a day you want something warm at 11 —
  // take them instead of the apple sticks, not as well as them.
  { emoji: '🍏', slot: 'noon', name: 'Apple Sticks & Yogurt', cal: 180, pro: 9,
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
  { emoji: '🍏', slot: 'noon', name: 'Apple Sticks, Yogurt & Chia', cal: 210, pro: 11,
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
// The one standing rule is the one that never moved: no chicken, no beef, no
// pork.
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
  // than rotating through everything — the 2 PM slot is the only one that has
  // them, and burying the big plates under a small one is how a day ends up
  // hundreds of calories and twenty grams of protein short.
  const featured = list.filter(m => m.main);
  const pool = featured.length >= n ? featured : list;
  const start = (Math.floor(dayIndex / 2) * n) % pool.length;
  return Array.from({ length: n }, (_, i) => pool[(start + i) % pool.length]);
}

// One clock, shared by all seven days. Every day eats the same four meals in
// the same order, so there is nothing per-day left to compute.
export const DAILY_MEALS = {
  clock: '8 AM Â· 11 AM Â· 2 PM â then the window shuts',
  label: '🍽️ The same three meals every day · fruit at 8 AM · apple & Greek yogurt at 11 AM · THE BIG MEAL at 2 PM · nothing after · under 1,000 calories, over 50 g of protein',
  rows: [
    { time: '8:00 AM — Fruit, and not much of it', icon: '🍌', ingredients: [
      { name: 'A banana, and a few berries if you want them', key: 'banana' },
      { name: 'Black coffee alongside — no milk, no sugar', key: null },
      { name: 'This is your fuel for training, so eat it before you run', key: null },
    ]},
    { time: '11:00 AM — Apple sticks & Greek yogurt', icon: '🍏', ingredients: [
      { name: 'Apple cut into sticks, skin on', key: 'apple' },
      { name: 'Greek yogurt as the sauce — twice the protein of plain, same small bowl', key: 'yogurtbowl' },
      { name: 'Small on purpose. The big meal is three hours away', key: null },
    ]},
    { time: '2:00 PM — THE BIG MEAL', icon: '🍠', ingredients: [
      { name: 'Your protein: fish, eggs or tofu — this is where most of your 50 g comes from', key: null, pick: 'protein', slot: 'morning' },
      { name: 'A sweet potato, boiled or baked', key: null },
      { name: 'Two boiled eggs', key: 'egg' },
      { name: 'Kimchi, cucumber and tomato on the side', key: null },
      { name: 'A banana last', key: 'banana' },
    ]},
    { time: 'After 2:00 PM — the window shuts', icon: '🍵', ingredients: [
      { name: 'Water, tea and black coffee — as much as you like', key: null },
      { name: 'No food. The closing is what makes the window work', key: null },
      { name: 'Hungry at night? Tomorrow’s 2 PM plate needs to be bigger, not tonight', key: null },
    ]},
  ],
};

// ─── THE WEEK ──────────────────────────────────────────────────────────────
// Monday to Sunday. The shape of it:
//   3 glute days   — Monday, Wednesday, Friday. Never two in a row, because
//                    glutes grow on the day off, not on the day you train them.
//   2 abs & upper  — Tuesday, Thursday. Abs NEVER land on a glute day: a glute
//                    day is a glute day and nothing else.
//   2 weekend days — Saturday, Sunday. Run, one Jessica Diễm video, stretch.
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
    sub: '~85 min total · stretch → zone 2 run 20 min → main workout → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '🍑 Day one of your week, and the biggest glute day of it. The hip thrust goes first while you are freshest — it is the one lift that loads the glute at the very top of the range, which is exactly where roundness comes from. Then the RDL through the hamstrings and the step-up one leg at a time. Banana and coffee before you start; you never train this on an empty stomach.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout. Easy enough to talk the whole way — this is the fat-burning gear.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the bar — this is where it counts.'),
      { name: 'Glute & Hamstring Activation', detail: '5 min · banded glute bridges × 20 → lateral band walks × 15 each → donkey kicks × 15 each · wakes all three glute muscles so the big lifts land in the glute instead of the lower back' },
      H('🍑 Main Workout', 'Three lifts, three sets of ten. Thrust first, then hinge, then one leg at a time.'),
      { name: '1. Barbell Hip Thrust', detail: 'MAIN 1 of 3 · 3 × 10 reps · shoulders on a bench, chin tucked, drive the hips up to parallel, pause 2 sec at the top and squeeze, lower for 3 sec · GLUTEUS MAXIMUS — the single best builder for size and projection, and the number that should climb fastest of anything in this plan' },
      { name: '2. Romanian Deadlift (RDL)', detail: 'MAIN 2 of 3 · 3 × 10 reps · soft knees, hinge from the hips, lower for 3 sec until you feel the hamstrings stretch, drive the hips forward to stand tall · GLUTEUS MAXIMUS + HAMSTRINGS — this is what builds the shelf underneath · if you feel it in your lower back, your hinge has turned into a squat' },
      { name: '3. Dumbbell Step-Up', detail: 'MAIN 3 of 3 · 3 × 10 reps each leg · a dumbbell in each hand, step onto a bench about knee height, drive through the whole front foot and stand tall, lower for 3 sec · GLUTEUS MAXIMUS + MEDIUS — one leg at a time, so the weaker hip cannot hide behind the stronger one · push through the heel, and do not push off the back foot' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, the walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Overload: write your hip thrust, RDL and step-up weight in every Monday. When all three sets feel controlled, add 2.5 kg to the thrust and RDL, 2 kg to the step-up. If your form breaks, add a rep instead of a kilo. Meals: 8 AM a little fruit before you run · 11 AM apple sticks & Greek yogurt · 2 PM the big meal · nothing after that but tea. Under 1,000 calories, over 50 g of protein.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ TUESDAY ══ Abs & upper body
  {
    emoji: '💪', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Abs & Upper Body', title: 'Abs · Shoulders · Back',
    sub: '~70 min total · stretch & vacuum → zone 2 run 20 min → abs → upper body → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'gold', text: '💪 The first of your two ab days. Thursday is the same session in the same order — that repetition is the point. Stretch, vacuum, run, five ab moves, three light upper-body moves. You will feel the pull-apart and the row get easier week by week, and that is exactly how you know your posture is changing. Your legs get today off so Wednesday has something left in it.' },
    exercises: [
      H('🔥 Warm-Up', 'Both of these, in this order, before you run.'),
      WARMUP,
      VACUUM,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🎯 Main Workout · Abs', 'All five, in order, while you are fresh. This is the first of your two ab days — the other is Thursday. Abs never land on a glute day.'),
      ...ABS_MAIN,
      H('💪 Main Workout · Upper Body', 'Three light moves. Posture and tone, never size.'),
      ...UPPER_BODY,
      H('🌀 Optional · Core Video — Izzy', 'Only if you want more. Pick ONE, never two.', 'core'),
      ...IZZY_ABS,
      H('🧘 Optional · Full Body — Nicole', 'Or one of these instead. Optional means optional.', 'core'),
      ...NICOLE_FULLBODY,
      H('🪢 Finish · Rope OR Walk', 'One or the other, never both.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Grow the weighted crunch by weight. Grow the reverse crunch, the leg raise and the dead bug by reps. Grow the plank by 10 seconds a week. That is the whole progression, and it is the only ab progression you need. Meals: 8 AM a little fruit before you run · 11 AM apple sticks & Greek yogurt · 2 PM the big meal · nothing after that but tea. Under 1,000 calories, over 50 g of protein.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ WEDNESDAY ══ Squat · Bulgarian Split Squat · RDL
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute Strength', title: 'Squat · Split Squat · RDL',
    sub: '~85 min total · stretch → zone 2 run 20 min → main workout → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '🔥 The heaviest day of the week. Stretch, then the 20-minute zone 2 run, then the lifts: the squat for raw strength, the Bulgarian split squat to even out your hips, and the RDL to finish through the hamstrings. Keep the run genuinely easy — it is there to burn fat, not to leave you with nothing for the bar.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the bar — this is where it counts.'),
      { name: 'Glute & Quad Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → bodyweight squats × 15 → hip circles × 10 each · the clamshells wake gluteus medius and minimus, which is what keeps your knees tracking straight under a heavy bar' },
      H('🍑 Main Workout', 'Three lifts, three sets of ten. Squat, split squat, hinge — in that order, always.'),
      { name: '1. Barbell Back Squat', detail: 'MAIN 1 of 3 · 3 × 10 reps · bar on your upper back, chest tall, sit down between your heels to below parallel, drive up through the whole foot · GLUTEUS MAXIMUS + QUADS — depth is what makes this a glute lift rather than a quad lift, so go below parallel or go lighter · a dumbbell or goblet squat works the same way if you have no bar' },
      { name: '2. Bulgarian Split Squat', detail: 'MAIN 2 of 3 · 3 × 10 reps each leg · rear foot on a bench, lower the front thigh to parallel · GLUTEUS MAXIMUS + MEDIUS — lean 10–15° forward to put it in the glute, stay upright to put it in the quad · this is the lift that evens out your hips, and the one that makes the biggest difference to shape' },
      { name: '3. Romanian Deadlift (RDL)', detail: 'MAIN 3 of 3 · 3 × 10 reps · soft knees, hinge from the hips, lower for 3 sec until you feel the hamstrings stretch, drive the hips forward to stand tall · GLUTEUS MAXIMUS + HAMSTRINGS — lighter than Monday, because your hips have already done two lifts · this is about the stretch, not the load' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Overload: write your squat, split squat and RDL weight in every Wednesday. Add 2.5 kg to the squat and RDL, 2 kg to the split squat, only when all three sets felt controlled. Two weeks stuck at the same weight is normal and is not a problem — add a rep instead. Meals: 8 AM a little fruit before you run · 11 AM apple sticks & Greek yogurt · 2 PM the big meal · nothing after that but tea. Under 1,000 calories, over 50 g of protein.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ THURSDAY ══ Abs & upper body
  {
    emoji: '🎯', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Abs & Upper Body', title: 'Abs · Shoulders · Back',
    sub: '~70 min total · stretch & vacuum → zone 2 run 20 min → abs → upper body → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'gold', text: '🎯 Waist day, and the second of your two. Stretch, vacuum, run, then the five ab moves in order while you are fresh — abs come first here, not as an afterthought at the end. Then three light upper-body moves for posture and tone. Light weight and slow control on all three: this is how you keep arms slim and shoulders straight instead of building them bigger.' },
    exercises: [
      H('🔥 Warm-Up', 'Both of these, in this order, before you run. The vacuum is what pulls the waist in — crunches alone only push it out.'),
      WARMUP,
      VACUUM,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🎯 Main Workout · Abs', 'All five, in order, while you are fresh. Twice a week is what builds them, and twice is all you do — glute days stay pure glutes.'),
      ...ABS_MAIN,
      H('💪 Main Workout · Upper Body', 'Three light moves. Posture and tone, never size — these numbers are meant to stay small.'),
      ...UPPER_BODY,
      H('🌀 Optional · Core Video — Izzy', 'Only if you want more. Pick ONE, never two, and only on a day the five moves felt easy.', 'core'),
      ...IZZY_ABS,
      H('🧘 Optional · Full Body — Nicole', 'Or one of these instead. Optional means optional — skipping it costs you nothing.', 'core'),
      ...NICOLE_FULLBODY,
      H('🪢 Finish · Rope OR Walk', 'One or the other, never both.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Two rules for this day. One: the only ab move that gets heavier is the weighted crunch — everything else grows by reps or seconds, because heavy twisting is what thickens a waist. Two: if anything hurts past a 2 out of 10, stop that exercise. Aching muscle is good; sharp or pinching in a joint means drop the weight. No overhead pressing until your shoulder has been pain-free for two to three weeks. Meals: 8 AM a little fruit before you run · 11 AM apple sticks & Greek yogurt · 2 PM the big meal · nothing after that but tea. Under 1,000 calories, over 50 g of protein.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ FRIDAY ══ Hip Abduction · Kickback · Sumo Squat
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glute Shape', title: 'Abduction · Kickback · Sumo',
    sub: '~75 min total · stretch → zone 2 run 20 min → main workout → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '✨ The shaping day, and the last day you lift this week. Monday and Wednesday build the size; today builds the round. The abduction and the kickback go straight at the upper and outer glute — the two muscles that turn a flat shape into a round one — and the sumo squat opens the hips and brings in the inner thigh. Lighter weight, slower reps, hold every squeeze. No abs today — a glute day is a glute day.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the work — this is where it counts.'),
      { name: 'Glute Medius Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each → fire hydrants × 15 each · wakes gluteus medius and minimus, the exact two muscles you are about to isolate' },
      H('🍑 Main Workout', 'Three sets of ten on all three. Outer glute, upper glute, then the wide squat.'),
      { name: '1. Hip Abduction (machine or band)', detail: 'MAIN 1 of 3 · 3 × 10 reps · push the knees apart, hold 2 sec at the widest point, release slow · GLUTEUS MEDIUS + MINIMUS — this is the muscle that gives you the round upper-side shape, and nothing else in the plan reaches it directly · lean forward slightly for the upper glute, sit upright for the side' },
      { name: '2. Cable Kickback', detail: 'MAIN 2 of 3 · 3 × 10 reps each leg · hinge forward slightly, drive the heel back and up, hold 2 sec at the top, lower slow · GLUTEUS MAXIMUS, upper fibres — the cleanest upper-glute isolation there is · if your lower back is doing the work, you are swinging it · a band around your ankle does the same job at home' },
      { name: '3. Sumo Squat', detail: 'MAIN 3 of 3 · 3 × 10 reps · feet wide, toes turned out 45°, dumbbell or kettlebell held between your legs, sit straight down and drive the knees out · GLUTEUS MAXIMUS + INNER THIGH — the wide stance reaches where a normal squat cannot · swap in a dumbbell step-up any week you would rather work one leg at a time' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Overload here is different: add resistance only when you can still hold the full 2-second squeeze on every single rep. On this day the squeeze matters more than the number. That is your lifting week done — the weekend is running and Jessica Diễm. Meals: 8 AM a little fruit before you run · 11 AM apple sticks & Greek yogurt · 2 PM the big meal · nothing after that but tea. Under 1,000 calories, over 50 g of protein.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // ══ SATURDAY ══ Easy run · Jessica Diem · forearm stand
  {
    emoji: '🏃', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Saturday · Run & Jessica Diem', title: 'Easy Run · Jessica Diem · Skill',
    sub: 'Run OR walk → one Jessica Diem video → forearm stand → long stretch',
    cardio: { icon: '🏃', title: 'Easy run OR the 20-minute walk', note: 'pick one — 20–30 min conversational run, or the walk' },
    noteBefore: { type: 'gold', text: '🏃 No lifting today, and no separate zone 2 run — the run IS the session. Run easy, then one Jessica Diem video, then the forearm stand and a long stretch. The video is an extra on top of your strength week, not a swap for it: your glutes are still built on Monday, Wednesday and Friday. Keep the run conversational so your legs are fresh for Monday.' },
    exercises: [
      H('🏃 Run OR Walk — pick one', 'First, while you are fresh. If you run, warm up properly — a cold start is how ankles and shins get hurt. If you would rather walk today, take the walk and skip the run entirely.'),
      RUN_WARMUP,
      RUN_EASY,
      REST_WALK,
      H('💗 Jessica Diem — pick ONE video', 'Your weekend workout. One video, whichever one you feel like. This runs alongside the lifting week, it never replaces it.', 'core'),
      ...JESSICA_DIEM,
      H('🤸 Forearm Stand — Drills', 'Skill work next. Running does not tire your arms, so this is still sharp.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🤍 Stretching', 'Long, slow holds — running tightens hips and calves, this is where you give it back.'),
      REST_STRETCH,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a weekend.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Order matters: run or walk first, then the Jessica Diem video, then skill, then stretch. The run and the walk are alternatives — do one, not both. Meals do not change at the weekend: 8 AM fruit, 11 AM apple and Greek yogurt, 2 PM the big meal, nothing after.' },
    meals: DAILY_MEALS,
  },
  // ══ SUNDAY ══ Sprints · Jessica Diem · forearm stand
  {
    emoji: '⚡', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Sprints & Jessica Diem', title: 'Sprints · Jessica Diem · Skill',
    sub: 'Sprints OR walk → one Jessica Diem video → forearm stand → long stretch',
    cardio: { icon: '⚡', title: 'Sprint intervals OR the 20-minute walk', note: 'pick one — the sprints step up every challenge month' },
    sprintDay: true,
    noteBefore: { type: 'gold', text: '⚡ Sprint day — the one hard run of the week, and the only running you do today. Full effort on the hard rounds, full walk on the rest; the moment your form falls apart, that round was your last. Then one Jessica Diem video, the forearm stand, and a long stretch. Still no lifting. Sprints are the single best cardio for keeping glutes while fat comes off.' },
    exercises: [
      H('⚡ Sprints OR Walk — pick one', 'First, while you are fresh. If you sprint, warm up properly — sprinting cold is the fastest way to pull a hamstring. On a heavy-legged week, take the walk instead and skip the sprints entirely.'),
      RUN_WARMUP,
      RUN_INTERVALS,
      REST_WALK,
      H('💗 Jessica Diem — pick ONE video', 'Your weekend workout. One video, whichever one you feel like. This runs alongside the lifting week, it never replaces it.', 'core'),
      ...JESSICA_DIEM,
      H('🤸 Forearm Stand — Drills', 'Skill work next. Running does not tire your arms, so this is still sharp.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🤍 Stretching', 'Long, slow holds — sprints tighten hamstrings and calves hard, this is where you give it back.'),
      REST_STRETCH,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a weekend.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Hold dolphin longer every week — that is how the forearm stand arrives. If your legs still feel Wednesday and Friday, run the sprints easier or walk them; never sprint on sore hamstrings. Tomorrow is hip thrust day, so make today’s 2 PM plate a big one.' },
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
