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

const CORE_VIDEO_HEADS = [
  H('🌀 Core · Pilates by Izzy', 'Core comes first now, straight off the run. Pick ONE video — from here or from Nicole below, never both.', 'core'),
];

const FULLBODY_VIDEO_HEADS = [
  H('🧘 Core · Or Move With Nicole', 'Or pick ONE of these instead — five short 30-minute full-body classes. One video total, then on to the shoulder.', 'core'),
];

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

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// One clock now, and it is the same every single day — glute day, back and
// core day, weekend, all of it. Four meals, always in this order:
//
//   Before workout — banana + black coffee. You never train on empty.
//   After workout  — any protein + kimchi, then cucumber and a banana.
//   3:00 PM        — a smoothie bowl: 2–3 frozen fruits blended, granola and
//                    chia stirred through, berries and banana on top (or
//                    whatever fruit you have).
//   5:00 PM        — apple sticks with yogurt for the sauce. This is also the
//                    slot for a craving: sweet potato or boiled saba banana,
//                    if you want one.
//
// No chicken, no beef, no pork — ever. Fish, eggs and tofu are all fair game
// on any day now; the old fish-on-glute-days-only rule is gone with the old
// two-clock plan.

// The meal times. Tap one in the app to see every meal you can choose for that
// slot, with the ingredients and the step-by-step method. The ids are the same
// four they have always been so every saved meal still lands in the right
// place — only the clock times moved.
const SLOT_DEFS = {
  wake:   { id: 'wake',   time: 'Before workout', emoji: '☕' },
  post:   { id: 'post',   time: 'After workout',  emoji: '💪' },
  noon:   { id: 'noon',   time: '3:00 PM',        emoji: '🥤' },
  sunset: { id: 'sunset', time: '5:00 PM',        emoji: '🍏' },
};

// The same four slots every day — there is no longer a second clock to switch
// to, so this takes no arguments.
export function mealSlots() {
  return [
    { ...SLOT_DEFS.wake,   label: 'Coffee & Banana',       hint: 'Banana and black coffee before you run — never train on an empty tank' },
    { ...SLOT_DEFS.post,   label: 'Protein & Kimchi',      hint: 'Any protein with kimchi, then cucumber and a banana' },
    { ...SLOT_DEFS.noon,   label: 'Smoothie & Granola',    hint: '2–3 frozen fruits blended · granola, chia, berries and banana on top' },
    { ...SLOT_DEFS.sunset, label: 'Apple Sticks & Yogurt', hint: 'Apple sticks, yogurt for the sauce — sweet potato or boiled saba if you crave it' },
  ];
}

// Flat list, only for looking a meal's clock time up by its slot id.
export const MEAL_SLOTS = [SLOT_DEFS.wake, SLOT_DEFS.post, SLOT_DEFS.noon, SLOT_DEFS.sunset];

// Every meal you can pick, grouped by slot. Oil-free and salt-free by default.
export const RECOMMENDED_MEALS = [
  // ── PROTEIN · after training · every day ───────────────────────────────
  // Any protein, any day: fish, eggs or tofu. Kimchi on the side, then the
  // cucumber and the banana. Never chicken, beef or pork.
  { emoji: '🥬', slot: 'post', protein: 'fish', name: 'Fish, Kimchi & Cucumber', cal: 360,
    ingredients: '150 g fish (any) · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Steam or bake the fish until it flakes — 8–10 min steamed, 12–14 min at 200°C.',
      'Spoon the kimchi onto the side of the plate. A small bowl is plenty; it is salty, so it is a condiment, not a serving.',
      'Slice the cucumber into thick rounds.',
      'Eat the fish and kimchi first, then the cucumber, and the banana last. This is the standard after-training plate.',
    ] },
  { emoji: '🥬', slot: 'post', protein: 'egg', name: 'Eggs, Kimchi & Cucumber', cal: 300,
    ingredients: '2–3 eggs · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Boil the eggs 8 min, then cool them under cold water so they peel clean.',
      'Spoon the kimchi onto the side — a small bowl, no more.',
      'Slice the cucumber into thick rounds.',
      'Eggs and kimchi first, then cucumber, then the banana. The quickest version of this meal.',
    ] },
  { emoji: '🥬', slot: 'post', protein: 'tofu', name: 'Tofu, Kimchi & Cucumber', cal: 310,
    ingredients: '150 g firm tofu · a small bowl of kimchi · ½ cucumber · 1 banana',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, until golden.',
      'Kimchi on the side, cucumber sliced alongside.',
      'Tofu and kimchi first, then cucumber, then the banana.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Salmon & Avocado', cal: 400,
    ingredients: '1 salmon fillet (150 g) · ¼ avocado · 1 tomato · calamansi',
    steps: [
      'Pat the salmon dry and let it sit 10 min out of the fridge.',
      'Steam or bake it at 200°C for 12–14 min, skin down, until it flakes with a fork.',
      'Slice the avocado and tomato onto the plate while it cooks.',
      'Squeeze calamansi over the fish. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Sardines & Rice', cal: 330,
    ingredients: '1 tin sardines (in water) · 1 cup cooked rice · calamansi',
    steps: [
      'Cook the rice and keep it warm.',
      'Drain the sardines fully — pour off all the liquid.',
      'Flake them over the rice and break the big pieces up with a fork.',
      'Finish with calamansi. Eat the fish first, then the rice.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Sardines, Rice & Tomato', cal: 350,
    ingredients: '1 tin sardines · 1 cup cooked rice · 1 tomato · calamansi',
    steps: [
      'Cook the rice.',
      'Chop the tomato small so it releases its juice.',
      'Drain the sardines and mash them lightly with the tomato.',
      'Spoon over the rice and finish with calamansi. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Steamed Fish & Sweet Potato', cal: 380,
    ingredients: '1 white fish fillet (150 g) · 1 small sweet potato · ginger · calamansi',
    steps: [
      'Boil or steam the sweet potato 20 min until a fork goes through easily.',
      'Lay the fish on a plate with sliced ginger on top.',
      'Steam it 8–10 min — it is done the moment it turns opaque.',
      'Serve together with calamansi squeezed over the fish.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Tuna & Egg Bowl', cal: 360,
    ingredients: '1 tin tuna in water · 2 eggs · 1 tomato · cucumber',
    steps: [
      'Boil the eggs 8 min, then cool them under cold water and peel.',
      'Drain the tuna completely and flake it into a bowl.',
      'Halve the eggs and add them with chopped tomato and cucumber.',
      'Toss gently. High protein, no oil, no salt.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Boiled Eggs & Avocado', cal: 300,
    ingredients: '2 eggs · ¼ avocado · 1 tomato',
    steps: [
      'Lower the eggs into boiling water and cook 8 min for firm yolks.',
      'Cool them under cold water — that makes them peel cleanly.',
      'Slice the avocado and tomato onto the plate.',
      'Halve the eggs over the top. Protein plus good fat, the perfect post-training plate.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Tomato Scramble', cal: 260,
    ingredients: '2–3 eggs · 2 tomatoes · spring onion',
    steps: [
      'Chop the tomatoes and cook them in a dry non-stick pan until they soften and give up their juice.',
      'Beat the eggs and pour them in over low heat.',
      'Fold slowly with a spatula — low and slow keeps them soft.',
      'Take it off the heat while still slightly wet, top with spring onion. No oil needed, the tomato juice is enough.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg White Omelette & Veggies', cal: 220,
    ingredients: '4 egg whites · bell pepper · tomato · spinach',
    steps: [
      'Chop the bell pepper, tomato, and spinach small.',
      'Soften them in a dry non-stick pan for 2 min.',
      'Pour the egg whites over and cover the pan for 3 min on low.',
      'Fold in half once set. Light protein — pair with avocado if you want more fat.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu & Rice Bowl', cal: 370,
    ingredients: '150 g firm tofu · 1 cup cooked rice · ginger · spring onion',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top to squeeze out the water — this is what stops it going soggy.',
      'Cut into cubes and sear in a dry non-stick pan until golden on two sides.',
      'Cook the rice and spoon the tofu over it.',
      'Top with grated ginger and spring onion.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Steamed Tofu & Tomato Salad', cal: 280,
    ingredients: '150 g silken tofu · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Steam the silken tofu 5 min so it is warm all the way through.',
      'Chop the tomato and cucumber while it steams.',
      'Slide the tofu onto the plate and spoon the salad around it.',
      'Finish with calamansi and grated ginger. Cooling, very light.',
    ] },
  { emoji: '🍲', slot: 'post', protein: 'tofu', name: 'Tofu Scramble & Bell Pepper', cal: 290,
    ingredients: '150 g firm tofu · bell pepper · tomato · turmeric · spring onion',
    steps: [
      'Press the tofu 10 min, then crumble it with your hands into egg-sized pieces.',
      'Soften the chopped bell pepper and tomato in a dry non-stick pan.',
      'Add the tofu and a pinch of turmeric — that is what gives it the egg colour.',
      'Cook 5 min, stirring, and finish with spring onion.',
    ] },
  { emoji: '🥑', slot: 'post', protein: 'tofu', name: 'Tofu & Avocado Plate', cal: 340,
    ingredients: '150 g firm tofu · ½ avocado · cucumber · calamansi',
    steps: [
      'Press the tofu 10 min, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, until golden.',
      'Fan the avocado and cucumber alongside.',
      'Squeeze calamansi over everything. Plant protein plus your fats in one plate.',
    ] },

  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Grilled Tilapia & Tomato Salad', cal: 340,
    ingredients: '1 whole tilapia or 150 g fillet · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Score the fish twice on each side so it cooks evenly, and stuff the cuts with ginger.',
      'Grill or bake 6–7 min a side — the flesh should lift off the bone cleanly.',
      'Chop the tomato and cucumber into a salad while it cooks.',
      'Squeeze calamansi over the fish. Glute-day meal.',
    ] },
  { emoji: '🐟', slot: 'post', protein: 'fish', name: 'Ginger Fish & Rice', cal: 390,
    ingredients: '150 g white fish · 1 cup cooked rice · ginger · spring onion · calamansi',
    steps: [
      'Cook the rice.',
      'Lay the fish on a plate, cover it with plenty of sliced ginger, and steam 8–10 min.',
      'Spoon the steaming juices from the plate over the rice — that is all the flavour you need, no oil.',
      'Top with spring onion and calamansi. Glute-day meal.',
    ] },

  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg & Sweet Potato', cal: 320,
    ingredients: '2 eggs · 1 medium sweet potato',
    steps: [
      'Bake the sweet potato at 200°C for 40 min, or boil it 20 min if you are in a hurry — baking makes it far sweeter.',
      'Boil the eggs 8 min alongside.',
      'Split the sweet potato open and halve the eggs over it.',
      'Eat it slowly at sunset. Nothing after this but tea.',
    ] },
  { emoji: '🍌', slot: 'post', protein: 'egg', name: 'Egg & Banana', cal: 260,
    ingredients: '2 eggs · 1 banana',
    steps: [
      'Boil the eggs 8 min and cool them under cold water.',
      'Peel and halve them.',
      'Eat with the banana alongside.',
      'The lightest version of your last meal — good on a night you are not very hungry.',
    ] },
  { emoji: '🍠', slot: 'post', protein: 'egg', name: 'Egg, Sweet Potato & Banana', cal: 400,
    ingredients: '2 eggs · 1 small sweet potato · 1 banana',
    steps: [
      'Bake or boil the sweet potato until soft.',
      'Boil the eggs 8 min.',
      'Plate all three together.',
      'The biggest version — take this one after your heaviest glute days.',
    ] },
  { emoji: '🥚', slot: 'post', protein: 'egg', name: 'Egg & Mashed Sweet Potato', cal: 330,
    ingredients: '2 eggs · 1 medium sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato 20 min until a fork slides straight through.',
      'Mash it with a fork — no butter, no milk, it is sweet enough on its own.',
      'Boil the eggs 8 min and chop them through the mash.',
      'Add a pinch of cinnamon. Warm and filling for the night.',
    ] },
  { emoji: '🍌', slot: 'post', protein: 'egg', name: 'Egg & Banana Mash', cal: 290,
    ingredients: '2 eggs · 1 ripe banana · ½ small sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato until soft and mash it warm.',
      'Mash a very ripe banana through it — the riper it is, the sweeter this gets.',
      'Boil the eggs 8 min and eat them alongside.',
      'Cinnamon on top. Nothing after sunset but tea.',
    ] },

  // ── BEFORE WORKOUT · every day · carbs before you run and lift ─────────
  // The rule is simple: never train on an empty tank. A banana is enough, and
  // it goes in before the zone 2 run, not after it.
  { emoji: '🍌', slot: 'wake', name: 'Banana & Coffee', cal: 100,
    ingredients: '1 banana · black coffee',
    steps: [
      'Eat the banana first, coffee second — caffeine on a truly empty stomach is what makes you shaky by set three.',
      'Ripe and spotted is better: the starch has turned to sugar, so it reaches your legs faster.',
      'Black, no milk, no sugar.',
      'Give it 20–30 minutes before you start warming up.',
    ] },
  { emoji: '🍌', slot: 'wake', name: 'Two Bananas & Coffee', cal: 190,
    ingredients: '2 bananas · black coffee',
    steps: [
      'For heavy Monday and Friday sessions, or any morning you wake up hungry.',
      'Eat both bananas, then the coffee.',
      'Still nothing else — you eat properly straight after training.',
      'If two feels heavy in the squat, drop back to one.',
    ] },
  { emoji: '🥣', slot: 'wake', slots: ['wake', 'noon'], name: 'Overnight Yogurt Bowl', cal: 320,
    ingredients: 'yogurt · 1 scoop protein powder · 1 tsp psyllium husk · 10 blueberries',
    steps: [
      'The night before: stir the protein powder into the yogurt until there are no dry pockets left.',
      'Add the psyllium husk and mix straight away — it thickens fast, so it has to go in moving.',
      'Drop the 10 blueberries on top, cover, and leave it in the fridge overnight.',
      'Eat it cold, either the moment you wake on a glute day or at 12 PM on a core day. Drink a full glass of water with it — psyllium needs the water to work.',
    ] },
  { emoji: '🍠', slot: 'wake', name: 'Sweet Potato & Coffee', cal: 180,
    ingredients: '1 small sweet potato (cooked the night before) · black coffee',
    steps: [
      'Boil or steam it the night before and leave it in the fridge.',
      'Eat it cold or warmed — cold sweet potato is actually gentler on your gut.',
      'Slower carbs than a banana, so give it 45 minutes before you lift.',
      'Good on the mornings a banana leaves you hungry by the second lift.',
    ] },
  { emoji: '🥭', slot: 'wake', name: 'Mango & Banana Plate', cal: 190,
    ingredients: '1 banana · ½ cup mango',
    steps: [
      'Slice both onto a plate — nothing blended, nothing added.',
      'Fast sugar, straight to your legs.',
      'Coffee alongside if you want it.',
      'Eat it 20 minutes before you warm up.',
    ] },

  // ── SMOOTHIE BOWLS · 3:00 PM · every day ───────────────────────────────
  // Two or three frozen fruits, never more. Granola and chia stirred through,
  // berries and banana on top — or whatever fruit is in the house.
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Mango & Banana', cal: 380,
    ingredients: '1 cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Two or three frozen fruits in the blender, never more — that is what keeps it thick instead of runny, and keeps the sugar sensible.',
      'Blend the mango and banana with only a splash of water. Push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and stir the chia through while it is still soft.',
      'Granola over the top, then berries and sliced banana — or whatever fruit is in the house.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Berries & Banana', cal: 370,
    ingredients: '1 cup frozen mixed berries · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · banana to top',
    steps: [
      'Frozen berries and frozen banana only — two fruits is enough for this one.',
      'Blend them thick with a splash of water until the colour goes deep purple.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top and sliced banana across it.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Papaya, Mango & Banana', cal: 390,
    ingredients: '1 cup papaya · ½ cup frozen mango · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries to top',
    steps: [
      'Three fruits — the ceiling. Freeze the mango and banana the night before; the papaya goes in fresh because it is wet enough.',
      'Blend all three with no water at first, adding a teaspoon at a time only if the blender sticks.',
      'Spoon into a bowl and stir the chia through.',
      'Granola over the top, berries scattered on. The easiest one on the stomach.',
    ] },
  { emoji: '🥣', slot: 'noon', name: 'Granola Bowl · Dragon Fruit & Banana', cal: 360,
    ingredients: '1 cup frozen dragon fruit · 1 frozen banana · 3 tbsp granola · 1 tbsp chia · berries & banana to top',
    steps: [
      'Freeze the dragon fruit cubes and the banana the night before.',
      'Blend both until deep pink and thick enough to hold a spoon upright.',
      'Spoon into a bowl and stir the chia through.',
      'Granola, then berries and banana on top.',
    ] },
  { emoji: '🥣', slot: 'noon', slots: ['noon', 'wake'], name: 'Papaya · Banana · Mango', cal: 250,
    ingredients: '1 cup papaya · 1 frozen banana · ½ cup mango · 1 tbsp chia · splash of water',
    steps: [
      'Freeze the banana and mango the night before — frozen fruit is what makes it thick instead of runny.',
      'Blend all three fruits with only a splash of water.',
      'Stop and push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and top with chia. No milk, no sugar.',
    ] },
  { emoji: '🥭', slot: 'noon', slots: ['noon', 'wake'], name: 'Mango · Banana · Berries', cal: 260,
    ingredients: '1 cup mango · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Use frozen mango and banana straight from the freezer.',
      'Blend them first until creamy, then add the berries for 5 seconds only — that keeps the colour bright.',
      'Spoon into a bowl.',
      'Top with chia and a few whole berries.',
    ] },
  { emoji: '🍈', slot: 'noon', slots: ['noon', 'wake'], name: 'Papaya · Pineapple · Banana', cal: 240,
    ingredients: '1 cup papaya · ½ cup pineapple · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Blend with pineapple and frozen banana until thick.',
      'Pour into a bowl.',
      'Top with chia. This is the best one for digestion — papaya and pineapple both carry natural enzymes.',
    ] },
  { emoji: '🍓', slot: 'noon', slots: ['noon', 'wake'], name: 'Berries · Banana · Kiwi', cal: 230,
    ingredients: '1 cup mixed berries · 1 frozen banana · 1 kiwi · 1 tbsp chia',
    steps: [
      'Blend the frozen berries and banana with a splash of water.',
      'Slice the kiwi into rounds — this one goes on top, not in the blender.',
      'Pour the purple base into a bowl.',
      'Lay the kiwi over it and finish with chia.',
    ] },
  { emoji: '🌴', slot: 'noon', slots: ['noon', 'wake'], name: 'Mango · Papaya · Pineapple', cal: 250,
    ingredients: '1 cup mango · 1 cup papaya · ½ cup pineapple · 1 tbsp chia',
    steps: [
      'Freeze the mango and pineapple beforehand.',
      'Blend all three together — no water at first, the papaya is wet enough.',
      'Add water only a teaspoon at a time if the blender sticks.',
      'Top with chia. Pure tropical, no banana needed.',
    ] },
  { emoji: '🐉', slot: 'noon', slots: ['noon', 'wake'], name: 'Dragon Fruit · Banana · Berries', cal: 220,
    ingredients: '1 cup dragon fruit · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Freeze the dragon fruit cubes and the banana.',
      'Blend both until deep pink and thick.',
      'Fold the berries through by hand so they stay whole.',
      'Top with chia.',
    ] },
  { emoji: '🍉', slot: 'noon', slots: ['noon', 'wake'], name: 'Watermelon · Kiwi · Banana', cal: 200,
    ingredients: '1 cup frozen watermelon · 1 kiwi · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Freeze the watermelon cubes — fresh watermelon makes this too watery to be a bowl.',
      'Blend it with the frozen banana until slushy.',
      'Add the kiwi last and pulse twice only.',
      'Top with chia. The most hydrating one — good on a hot day.',
    ] },
  { emoji: '🍎', slot: 'noon', slots: ['noon', 'wake'], name: 'Apple · Banana · Berries', cal: 240,
    ingredients: '1 apple · 1 frozen banana · ½ cup berries · 1 tbsp chia · cinnamon',
    steps: [
      'Core and chop the apple — leave the skin on for the fibre.',
      'Blend it with the frozen banana and berries until smooth.',
      'Pour into a bowl.',
      'Top with chia and a pinch of cinnamon.',
    ] },
  { emoji: '🍍', slot: 'noon', slots: ['noon', 'wake'], name: 'Pineapple · Mango · Kiwi', cal: 235,
    ingredients: '1 cup pineapple · 1 cup mango · 1 kiwi · 1 tbsp chia',
    steps: [
      'Use frozen pineapple and mango.',
      'Blend them thick with a splash of water.',
      'Slice the kiwi for the top.',
      'Finish with chia. Sharp and sweet — the most refreshing bowl of the set.',
    ] },
  { emoji: '🥥', slot: 'noon', slots: ['noon', 'wake'], name: 'Papaya · Berries · Banana', cal: 230,
    ingredients: '1 cup papaya · ½ cup berries · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Blend the papaya and frozen banana first until creamy.',
      'Add the berries and blend 5 seconds more.',
      'Spoon into a bowl.',
      'Top with chia. Gentle on the stomach — the easiest bowl to digest.',
    ] },
  { emoji: '🥑', slot: 'noon', slots: ['noon', 'wake'], name: 'Avocado · Banana · Berries', cal: 300,
    ingredients: '¼ avocado · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Blend the avocado and frozen banana until it goes thick like ice cream.',
      'Spoon it into a bowl — this one is too thick to pour.',
      'Scatter the berries over the top.',
      'Finish with chia. The most filling bowl — the avocado adds your fats.',
    ] },

  { emoji: '🍉', slot: 'noon', name: 'Big Fruit Plate', cal: 260,
    ingredients: 'papaya · watermelon · 1 banana · a handful of berries',
    steps: [
      'Nothing blended — just cut it all onto one large plate.',
      'Start with the watermelon while it is coldest; it digests fastest.',
      'This is the whole 12 PM meal on a core day. Eat until you are full.',
      'Water or green tea alongside, nothing sweetened.',
    ] },
  { emoji: '🥝', slot: 'noon', name: 'Papaya, Mango & Kiwi Plate', cal: 230,
    ingredients: '1 cup papaya · ½ cup mango · 1 kiwi',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Slice the mango and kiwi alongside it.',
      'Papaya and kiwi both carry natural enzymes — this is the flattest-stomach plate on the list.',
      'Eat it fresh and alone, no yogurt, no toppings.',
    ] },

  // ── 5:00 PM · Last meal · every day ────────────────────────────────────
  // Apple sticks with yogurt for the sauce. That is the meal. The sweet potato
  // and the boiled saba are here for the nights you crave one — take them
  // instead of the apple, not on top of it.
  { emoji: '🍏', slot: 'sunset', name: 'Apple Sticks & Yogurt', cal: 180,
    ingredients: '1 apple · a small bowl of plain yogurt',
    steps: [
      'Core the apple and cut it into thick sticks — skin on, that is where the fibre is.',
      'Spoon plain unsweetened yogurt into a small bowl. This is the sauce, not a side.',
      'Dip and eat slowly. It should take you twenty minutes, not five.',
      'Nothing after this but tea.',
    ] },
  { emoji: '🍏', slot: 'sunset', name: 'Apple Sticks, Yogurt & Cinnamon', cal: 190,
    ingredients: '1 apple · a small bowl of plain yogurt · cinnamon',
    steps: [
      'Cut the apple into sticks, skin on.',
      'Stir a good pinch of cinnamon through the yogurt until it goes pale brown.',
      'Cinnamon is what makes this taste sweet without a grain of sugar in it.',
      'Dip and eat slowly. Nothing after but tea.',
    ] },
  { emoji: '🍏', slot: 'sunset', name: 'Apple Sticks, Yogurt & Chia', cal: 210,
    ingredients: '1 apple · a small bowl of plain yogurt · 1 tsp chia',
    steps: [
      'Stir the chia into the yogurt and leave it five minutes — it thickens the sauce so it clings to the apple.',
      'Cut the apple into sticks while it sits.',
      'Dip and eat slowly.',
      'Drink a full glass of water with it — chia needs the water to work.',
    ] },
  { emoji: '🍌', slot: 'sunset', name: 'Boiled Saba Banana', cal: 160,
    ingredients: '1–2 saba bananas',
    steps: [
      'Drop them in boiling water, skin still on, and boil 15–20 min until a fork slides straight through.',
      'The skin peels away easily once they have cooled for a minute.',
      'Eat them warm and plain — no sugar, no butter, they are sweet enough already.',
      'This is a craving option: take it instead of the apple sticks, not as well as them.',
    ] },
  { emoji: '🍠', slot: 'sunset', name: 'Boiled Sweet Potato', cal: 180,
    ingredients: '1 medium sweet potato',
    steps: [
      'Boil it whole 20 min, or bake it at 200°C for 40 min if you have the time — baking makes it far sweeter.',
      'Split it open and eat it straight out of the skin.',
      'No butter, no salt. Slow carbs to close the day.',
      'The other craving option. Instead of the apple sticks, not on top of them.',
    ] },
  { emoji: '🍠', slot: 'sunset', name: 'Sweet Potato Sticks & Yogurt', cal: 260,
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
  const start = (Math.floor(dayIndex / 2) * n) % list.length;
  return Array.from({ length: n }, (_, i) => list[(start + i) % list.length]);
}

// One clock, shared by all seven days. Every day eats the same four meals in
// the same order, so there is nothing per-day left to compute.
export const DAILY_MEALS = {
  clock: 'Before & after training · 3 PM · 5 PM',
  label: '🍽️ The same four meals every day · coffee & banana before you train · protein & kimchi after · smoothie bowl at 3 PM · apple sticks & yogurt at 5 PM',
  rows: [
    { time: 'Before workout — Coffee & banana', icon: '☕', ingredients: [
      { name: 'A banana — before every session, no exceptions', key: 'banana' },
      { name: 'Black coffee, no milk, no sugar', key: null },
      { name: 'Nothing else yet — you eat properly straight after', key: null },
    ]},
    { time: 'After workout — Protein, kimchi, cucumber & banana', icon: '💪', ingredients: [
      { name: 'Any protein: fish, eggs or tofu', key: null, pick: 'protein', slot: 'morning' },
      { name: 'Kimchi on the side — a small bowl, it is salty', key: null },
      { name: 'Then cucumber, and a banana last', key: 'banana' },
    ]},
    { time: '3:00 PM — Smoothie & granola bowl', icon: '🥤', ingredients: [
      { name: 'Smoothie — 2 or 3 frozen fruits only, never more', key: null, pick: 'fruit', slot: 'lunch' },
      { name: 'Granola and chia seeds stirred through', key: 'chia' },
      { name: 'Berries and banana on top, or any fruit you have', key: 'berries' },
    ]},
    { time: '5:00 PM — Apple sticks & yogurt', icon: '🍏', ingredients: [
      { name: 'Apple cut into sticks, skin on', key: 'apple' },
      { name: 'Plain yogurt as the sauce to dip them in', key: 'yogurtbowl' },
      { name: 'Craving? Sweet potato or boiled saba banana instead', key: null },
    ]},
  ],
};

export const WORKOUT_DAYS = [
  // MONDAY — Squat · Bulgarian split squat · RDL
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glutes & Quads', title: 'Squat · Split Squat · RDL',
    sub: '~85 min total · stretch → zone 2 run 20 min → 3 lifts → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '🍑 The heaviest day of the week. Stretch, then the 20-minute zone 2 run, then the lifts: two squat patterns for the quads and glutes, and the RDL to finish through the hamstrings. Keep the run genuinely easy — it is there to burn fat, not to leave you with nothing for the bar. Banana and coffee before you start; you never train this on an empty stomach.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout, Monday to Friday. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the bar — this is where it counts.'),
      { name: 'Glute & Quad Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → bodyweight squats × 15 → hip circles × 10 each · wake the glutes and warm the knees before you load a squat' },
      H('🍑 The Three Lifts', 'Three sets of ten on all three. Squat, split squat, hinge — in that order, always.'),
      { name: '1. Barbell Back Squat', detail: 'MAIN 1 of 3 · 3 × 10 reps · bar on your upper back, chest tall, sit down between your heels to below parallel, drive up through the whole foot · the lift everything else is built on — dumbbell or goblet squat works the same way if you have no bar' },
      { name: '2. Bulgarian Split Squat', detail: 'MAIN 2 of 3 · 3 × 10 reps each leg · rear foot on a bench, lower the front thigh to parallel · lean 10–15° forward to put it in the glute, stay upright to put it in the quad · this is the lift that evens out your hips' },
      { name: '3. Romanian Deadlift (RDL)', detail: 'MAIN 3 of 3 · 3 × 10 reps · soft knees, hinge from the hips, lower for 3 sec until you feel the hamstrings stretch, drive the hips forward to stand tall · the best glute-and-hamstring lift there is, and the right way to finish after squatting' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, the walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track your squat and RDL weight every Monday. Add 1–2 kg when all three sets feel controlled. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days
    meals: DAILY_MEALS,
  },
  // TUESDAY — Back, shoulders & core
  {
    emoji: '💪', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Back, Shoulders & Core', title: 'Back, Shoulders & Core',
    sub: '~70 min total · stretch & vacuum → zone 2 run 20 min → one core video → shoulder → back → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'gold', text: '💪 Short and simple. Stretch, vacuum, the 20-minute zone 2 run, then your core video — core comes first now, while you still have something left for it. Then one shoulder movement, one back movement, and rope or walk to finish. Light weight and slow control on both lifts: this builds posture and stability, not bulk.' },
    exercises: [
      H('🔥 Warm-Up', 'Both of these, in this order, before you run.'),
      WARMUP,
      VACUUM,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout, Monday to Friday. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      ...CORE_VIDEO_HEADS,
      ...IZZY_ABS,
      ...FULLBODY_VIDEO_HEADS,
      ...NICOLE_FULLBODY,
      H('💪 Shoulder', 'After the core. One movement — light band, slow, squeeze between the shoulder blades.'),
      { name: 'Band Pull-Apart', detail: 'SHOULDER · 3 × 20 reps · light band, arms straight at chest height, pull apart and hold the squeeze between your shoulder blades for 1 sec, return slow · the single best fix for rounded posture — keep the weight light enough that you never feel it in your neck' },
      H('🎯 Back', 'Last lift of the day. One movement — both arms, flat back, row to the ribs.'),
      { name: 'Double-Arm Dumbbell Row', detail: 'BACK · 3 × 12 reps · a dumbbell in each hand, hinge forward to about 45°, back flat and chest proud, row both dumbbells to your ribs and hold 1 sec, lower for 3 sec · both arms together keeps you square — if you feel it in your lower back, hinge less' },
      H('🪢 Finish · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Rule for every set: if it hurts past a 2 out of 10, stop that exercise. Aching muscle is good; sharp or pinching in the joint means drop the weight. Pick just ONE core video — an Izzy workout, or one of Nicole’s 30-minute full-body classes. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // WEDNESDAY — Cable kickback · hip abduction · sumo squat
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute Isolation', title: 'Kickback · Abduction · Sumo Squat',
    sub: '~80 min total · stretch → zone 2 run 20 min → 3 lifts → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '🔥 The shaping day. Stretch, the 20-minute zone 2 run, then two pure isolation moves that hit the upper and outer glute directly, and the sumo squat to open the hips and bring in the inner thigh. Lighter weight, slower reps, and hold every squeeze. Banana and coffee first.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout, Monday to Friday. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the bar — this is where it counts.'),
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · wake gluteus medius, the outer glute you are about to isolate' },
      H('🍑 The Three Lifts', 'Three sets of ten on all three. Upper glute, outer glute, then the wide squat.'),
      { name: '1. Cable Kickback', detail: 'MAIN 1 of 3 · 3 × 10 reps each leg · hinge forward slightly, drive the heel back and up, hold 2 sec at the top, lower slow · the cleanest upper-glute isolation there is — if your lower back is doing the work, you are swinging it' },
      { name: '2. Hip Abduction (machine or band)', detail: 'MAIN 2 of 3 · 3 × 10 reps · push the knees apart, hold 2 sec at the widest point, release slow · builds the outer glute that gives you the round shape — lean forward slightly for the upper glute, sit upright for the side' },
      { name: '3. Sumo Squat', detail: 'MAIN 3 of 3 · 3 × 10 reps · feet wide, toes turned out 45°, dumbbell or kettlebell held between your legs, sit straight down and drive the knees out · the wide stance shifts the work into the glutes and inner thighs where a normal squat cannot reach' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, the walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track kickback and abduction resistance each Wednesday. Add resistance only when you can still hold the 2-second squeeze on every single rep — on this day the squeeze matters more than the load. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days
    meals: DAILY_MEALS,
  },
  // THURSDAY — Back, shoulders & core (same four things as Tuesday)
  {
    emoji: '⚡', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Back, Shoulders & Core', title: 'Back, Shoulders & Core',
    sub: '~70 min total · stretch & vacuum → zone 2 run 20 min → one core video → shoulder → back → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'gold', text: '⚡ Same shape as Tuesday, in the same order — that repetition is the point. Stretch, vacuum, the zone 2 run, then the core video, then shoulder and back. You will feel the pull-apart and the row get easier week by week, which is exactly how you know your posture is changing.' },
    exercises: [
      H('🔥 Warm-Up', 'Both of these, in this order, before you run.'),
      WARMUP,
      VACUUM,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout, Monday to Friday. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      ...CORE_VIDEO_HEADS,
      ...IZZY_ABS,
      ...FULLBODY_VIDEO_HEADS,
      ...NICOLE_FULLBODY,
      H('💪 Shoulder', 'After the core. One movement — light band, slow, squeeze between the shoulder blades.'),
      { name: 'Band Pull-Apart', detail: 'SHOULDER · 3 × 20 reps · light band, arms straight at chest height, pull apart and hold the squeeze between your shoulder blades for 1 sec, return slow · the single best fix for rounded posture — keep the weight light enough that you never feel it in your neck' },
      H('🎯 Back', 'Last lift of the day. One movement — both arms, flat back, row to the ribs.'),
      { name: 'Double-Arm Dumbbell Row', detail: 'BACK · 3 × 12 reps · a dumbbell in each hand, hinge forward to about 45°, back flat and chest proud, row both dumbbells to your ribs and hold 1 sec, lower for 3 sec · both arms together keeps you square — if you feel it in your lower back, hinge less' },
      H('🪢 Finish · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ No overhead pressing until your shoulder has been pain-free for two to three weeks. When it is, add ONE light overhead press (3 × 12) here and keep it light. Pick just ONE core video. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    trackLifts: true,
    meals: DAILY_MEALS,
  },
  // FRIDAY — Hip thrust · RDL · squat
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glutes & Hamstrings', title: 'Hip Thrust · RDL · Squat',
    sub: '~85 min total · stretch → zone 2 run 20 min → 3 lifts → rope or walk',
    cardioBefore: { icon: '🏃', title: 'Zone 2 run · 20 min before training', note: 'easy conversational pace — before the main workout' },
    cardio: { icon: '🪢', title: 'Rope or walk to finish', note: 'pick one — 10–20 min rope, or the 20-min walk' },
    noteBefore: { type: 'rose', text: '✨ The glute-builder day. Stretch and run first, then the hip thrust while you are still freshest — it is the one lift that loads the glute at the top of the range where nothing else can. Then the RDL through the hamstrings, and the squat to finish. Banana and coffee before any of it.' },
    exercises: [
      H('🔥 Warm-Up · Full-Body Stretch', 'Stretch the whole body first, before you run a single step.'),
      WARMUP,
      H('🏃 Zone 2 Run · 20 min', 'Before the main workout, Monday to Friday. Easy enough to talk the whole way.'),
      ZONE2_RUN,
      H('🍑 Glute Activation', 'Straight off the run and straight before the bar — this is where it counts.'),
      { name: 'Glute & Hamstring Activation', detail: '5 min · banded glute bridges × 20 → bodyweight good mornings × 15 → donkey kicks × 15 each · get blood into the glutes and lengthen the hamstrings before you hinge' },
      H('🍑 The Three Lifts', 'Three sets of ten on all three. Thrust first while you are fresh, then hinge, then squat.'),
      { name: '1. Barbell Hip Thrust', detail: 'MAIN 1 of 3 · 3 × 10 reps · shoulders on a bench, chin tucked, drive the hips up to parallel, pause 2 sec at the top and squeeze, lower for 3 sec · the single best glute builder — it goes first today so it gets your best effort' },
      { name: '2. Romanian Deadlift (RDL)', detail: 'MAIN 2 of 3 · 3 × 10 reps · soft knees, hinge from the hips, lower for 3 sec until you feel the hamstrings stretch, drive the hips forward to stand · if you feel it in your lower back instead of your hamstrings, your hinge has turned into a squat' },
      { name: '3. Barbell Back Squat', detail: 'MAIN 3 of 3 · 3 × 10 reps · bar on your upper back, chest tall, sit to below parallel, drive up through the whole foot · lighter than Monday — your hips have already done two lifts, so this one is about depth and control, not load' },
      H('🪢 Cool-Down · Rope OR Walk', 'One or the other, never both. Rope if you want to sweat, the walk if you want to come down quietly.'),
      JUMP_ROPE,
      ALT_WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track hip thrust and RDL weight every Friday. The hip thrust is the number that should climb fastest of anything in this plan. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days
    meals: DAILY_MEALS,
  },
  // SATURDAY — Rest
  {
    emoji: '🏃', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Saturday · Run & Skill', title: 'Run, Stretch & Forearm Stand',
    sub: 'Run OR walk + forearm-stand training + long stretch',
    cardio: { icon: '🏃', title: 'Easy run OR the 20-minute walk', note: 'pick one — 20–30 min conversational run, or the walk' },
    noteBefore: { type: 'gold', text: '🏃 No lifting today, and no separate zone 2 run either — the run IS the session. Run, train the forearm stand, and stretch long. Keep it conversational: this is meant to leave your legs fresh for Monday, not tire them out. Stop before you feel tired.' },
    exercises: [
      H('🏃 Run OR Walk — pick one', 'First, while you are fresh. If you run, warm up properly — a cold start is how ankles and shins get hurt. If you would rather walk today, take the walk instead and skip the run entirely.'),
      RUN_WARMUP,
      RUN_EASY,
      REST_WALK,
      H('🤸 Forearm Stand — Drills', 'Skill work next. Running does not tire your arms, so this is still sharp.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🤍 Stretching', 'Long, slow holds — running tightens hips and calves, this is where you give it back.'),
      REST_STRETCH,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a rest day.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Order matters: run or walk first, then skill, then stretch. The run and the walk are alternatives — do one, not both. The yoga and Nicole classes are optional, only if you still feel like moving. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    meals: DAILY_MEALS,
  },
  // SUNDAY — Rest
  {
    emoji: '⚡', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Sprints & Skill', title: 'Sprints, Stretch & Forearm Stand',
    sub: 'Sprints OR walk + forearm-stand training + long stretch',
    cardio: { icon: '⚡', title: 'Sprint intervals OR the 20-minute walk', note: 'pick one — the sprints step up every challenge month' },
    sprintDay: true,
    noteBefore: { type: 'gold', text: '⚡ Sprint day — the one hard run of the week, and the only running you do today; there is no zone 2 run on top of it. Full effort on the hard rounds, full walk on the rest; if your form falls apart, that round was your last. Then the forearm stand and a long stretch. Still no lifting.' },
    exercises: [
      H('⚡ Sprints OR Walk — pick one', 'First, while you are fresh. If you sprint, warm up properly — sprinting cold is the fastest way to pull a hamstring. On a heavy-legged week, take the walk instead and skip the sprints entirely.'),
      RUN_WARMUP,
      RUN_INTERVALS,
      REST_WALK,
      H('🤸 Forearm Stand — Drills', 'Skill work next. Running does not tire your arms, so this is still sharp.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🤍 Stretching', 'Long, slow holds — sprints tighten hamstrings and calves hard, this is where you give it back.'),
      REST_STRETCH,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a rest day.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Hold dolphin longer every week — that is how the forearm stand arrives. If your legs still feel Friday, run the sprints easier or walk them; never sprint on sore hamstrings. Meals: coffee and banana before you train · protein, kimchi, cucumber and banana after · smoothie and granola bowl at 3 PM · apple sticks and yogurt at 5 PM.' },
    meals: DAILY_MEALS,
  },
];
