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
// Strength training 5 days a week:
//   • Glute days (3×): Mon glutes & quads · Wed glute isolation ·
//     Fri glutes & hamstrings — each finishes with the cool-down walk
//   • Upper body days (2×: Tue · Thu) — back, shoulders & core, then jump
//     rope, then the cool-down walk
// Rest days (Sat · Sun): stretching, forearm-stand training, and the same
// 20-minute cool-down walk.

// Shared warm-up. The cool-down is ALWAYS a 20-minute walk, every day. Upper-body days add jump rope before the walk.
const WARMUP = { name: 'Full-Body Stretch Warm-Up', detail: '5–8 min · neck, shoulders, chest, back, hips, hamstrings, calves · loosen every major muscle before you train · dynamic swings then gentle holds' };
const WALK = { name: '20-Minute Walk', detail: '20 min · every single day, always the last thing you do · flat easy pace, relaxed breathing · burns fat and brings your heart rate down without eating into recovery' };
// The same finisher closes every glute day. Keeping it identical is the point:
// one bodyweight burnout you repeat three times a week is the clearest way to
// feel yourself getting stronger, with no equipment and nothing to decide.
const GLUTE_FINISHER = { name: 'Glute Bridge Burnout', detail: 'FINISHER · 2 × 25 reps · bodyweight, feet flat and hip-width, drive the hips up and squeeze hard at the top, lower without touching down · fast but controlled — same finisher on all three glute days' };
const JUMP_ROPE = { name: 'Jump Rope Finisher', detail: '10–20 min · steady, light on the balls of your feet · rope first on back, shoulder & core days — then walk to cool down' };

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

// ── SHOULDER HEALING ──
// The upper-body days are strength-and-rehab days, not size days. Everything
// here is light load, high rep, slow tempo: it builds the small stabilisers
// (rotator cuff, lower trap, serratus) that hold the shoulder in its socket.
// Those muscles get strong and enduring, not big — bulk needs heavy load,
// low reps, and a calorie surplus, none of which is in this plan.
// Mobility prep and stretches are not "main exercises" — they are the warm-up
// and cool-down that make the three main lifts safe on a sore shoulder.
const SHOULDER_MOBILITY = [
  { name: 'Cat-Cow', detail: '10 slow reps · round the spine on the exhale, open the chest on the inhale · wakes up a stiff travel-back before you load it' },
  { name: 'Thread the Needle', detail: '8 reps each side · from all fours, slide one arm under your chest and rest on the shoulder · frees the upper back so your shoulder stops compensating' },
  { name: 'Open Book (T-Spine Rotation)', detail: '8 reps each side · lie on your side, knees bent, open the top arm to the floor behind you and breathe · restores the rotation that sitting on planes takes away' },
  { name: 'Shoulder Dislocates (broomstick or band)', detail: '2 × 10 reps · wide grip, arms straight, take the stick slowly over your head and behind you · gentle, pain-free range only' },
  { name: 'Wall Angel (Wall Slide)', detail: '2 × 12 reps · back, head, and both wrists on the wall, slide arms up and down slowly · teaches your shoulder blades to move before your shoulder joint does' },
  { name: 'Scapular Push-Up', detail: '2 × 15 reps · high plank or on knees, arms locked, only your shoulder blades move · wakes the serratus so reaching overhead stops pinching' },
];

// Section headings for a day's exercise list. `tone: 'core'` tints the header
// rose so the video sections stand apart from the lifting sections.
const H = (heading, hint, tone) => ({ heading, hint, tone });

const CORE_VIDEO_HEADS = [
  H('🪷 Core Videos · Pilates by Izzy', 'Pick ONE. Four core workouts plus her full CORE WORKOUTS playlist.', 'core'),
];

const FULLBODY_VIDEO_HEADS = [
  H('🧘 Full-Body Videos · Move With Nicole', 'Or pick ONE of these instead — five short 30-minute full-body classes.', 'core'),
];

const UPPER_STRETCH = [
  { name: 'Doorway Chest Stretch', detail: '3 × 30 sec each side · forearm on the door frame at shoulder height, step through gently · a tight chest is what pulls your shoulder forward and makes it ache' },
  { name: 'Child\'s Pose with Lat Reach', detail: '2 × 45 sec · sit back on your heels, walk both hands to one side · releases the lats that round your shoulders' },
  { name: 'Upper Trap & Neck Release', detail: '30 sec each side · ear toward shoulder, hand resting on your head, breathe · the neck tightness that comes with shoulder pain' },
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

const REST_STRETCH = { name: 'Long Full-Body Stretch', detail: '15–25 min · hold each stretch 45–60 sec · hamstrings, hips, chest, shoulders, wrists, calves · this is the work on a rest day' };
const REST_WALK = { name: '20-Minute Walk', detail: '20 min · no pace target · you walk every day, rest days included · sunshine, podcast, whatever you like' };
const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · do this FIRST before your core video' };

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// Three meals, same clock every day:
//   10:00 AM — protein and fats  (fish · tofu · eggs only)
//    2:00 PM — smoothie bowl     (3 fruits blended thick + chia)
//    5:00 PM — last meal, sunset (egg with sweet potato or banana)
// No chicken, no beef, no pork — ever.

// The three meal times. Tap one in the app to see every meal you can choose
// for that slot, with the ingredients and the step-by-step method.
export const MEAL_SLOTS = [
  { id: 'am',     time: '10:00 AM', label: 'Protein & Fats',    emoji: '🥑', hint: 'Fish, tofu or eggs + a good fat' },
  { id: 'pm',     time: '2:00 PM',  label: 'Smoothie Bowl',     emoji: '🥣', hint: '3 fruits blended thick + chia on top' },
  { id: 'sunset', time: '5:00 PM',  label: 'Last Meal · Sunset', emoji: '🍠', hint: 'Egg with sweet potato or banana' },
];

// Every meal you can pick, grouped by slot. Oil-free and salt-free by default.
export const RECOMMENDED_MEALS = [
  // ── 10:00 AM · Protein & fats · fish · tofu · eggs ──────────────────────
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Salmon & Avocado', cal: 400,
    ingredients: '1 salmon fillet (150 g) · ¼ avocado · 1 tomato · calamansi',
    steps: [
      'Pat the salmon dry and let it sit 10 min out of the fridge.',
      'Steam or bake it at 200°C for 12–14 min, skin down, until it flakes with a fork.',
      'Slice the avocado and tomato onto the plate while it cooks.',
      'Squeeze calamansi over the fish. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Sardines & Rice', cal: 330,
    ingredients: '1 tin sardines (in water) · 1 cup cooked rice · calamansi',
    steps: [
      'Cook the rice and keep it warm.',
      'Drain the sardines fully — pour off all the liquid.',
      'Flake them over the rice and break the big pieces up with a fork.',
      'Finish with calamansi. Eat the fish first, then the rice.',
    ] },
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Sardines, Rice & Tomato', cal: 350,
    ingredients: '1 tin sardines · 1 cup cooked rice · 1 tomato · calamansi',
    steps: [
      'Cook the rice.',
      'Chop the tomato small so it releases its juice.',
      'Drain the sardines and mash them lightly with the tomato.',
      'Spoon over the rice and finish with calamansi. No oil, no salt.',
    ] },
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Steamed Fish & Sweet Potato', cal: 380,
    ingredients: '1 white fish fillet (150 g) · 1 small sweet potato · ginger · calamansi',
    steps: [
      'Boil or steam the sweet potato 20 min until a fork goes through easily.',
      'Lay the fish on a plate with sliced ginger on top.',
      'Steam it 8–10 min — it is done the moment it turns opaque.',
      'Serve together with calamansi squeezed over the fish.',
    ] },
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Tuna & Egg Bowl', cal: 360,
    ingredients: '1 tin tuna in water · 2 eggs · 1 tomato · cucumber',
    steps: [
      'Boil the eggs 8 min, then cool them under cold water and peel.',
      'Drain the tuna completely and flake it into a bowl.',
      'Halve the eggs and add them with chopped tomato and cucumber.',
      'Toss gently. High protein, no oil, no salt.',
    ] },
  { emoji: '🥚', slot: 'am', protein: 'egg', name: 'Boiled Eggs & Avocado', cal: 300,
    ingredients: '2 eggs · ¼ avocado · 1 tomato',
    steps: [
      'Lower the eggs into boiling water and cook 8 min for firm yolks.',
      'Cool them under cold water — that makes them peel cleanly.',
      'Slice the avocado and tomato onto the plate.',
      'Halve the eggs over the top. Protein plus good fat, the perfect 10 AM meal.',
    ] },
  { emoji: '🥚', slot: 'am', protein: 'egg', name: 'Egg & Tomato Scramble', cal: 260,
    ingredients: '2–3 eggs · 2 tomatoes · spring onion',
    steps: [
      'Chop the tomatoes and cook them in a dry non-stick pan until they soften and give up their juice.',
      'Beat the eggs and pour them in over low heat.',
      'Fold slowly with a spatula — low and slow keeps them soft.',
      'Take it off the heat while still slightly wet, top with spring onion. No oil needed, the tomato juice is enough.',
    ] },
  { emoji: '🥚', slot: 'am', protein: 'egg', name: 'Egg White Omelette & Veggies', cal: 220,
    ingredients: '4 egg whites · bell pepper · tomato · spinach',
    steps: [
      'Chop the bell pepper, tomato, and spinach small.',
      'Soften them in a dry non-stick pan for 2 min.',
      'Pour the egg whites over and cover the pan for 3 min on low.',
      'Fold in half once set. Light protein — pair with avocado if you want more fat.',
    ] },
  { emoji: '🍲', slot: 'am', protein: 'tofu', name: 'Tofu & Rice Bowl', cal: 370,
    ingredients: '150 g firm tofu · 1 cup cooked rice · ginger · spring onion',
    steps: [
      'Press the tofu 10 min between two plates with a weight on top to squeeze out the water — this is what stops it going soggy.',
      'Cut into cubes and sear in a dry non-stick pan until golden on two sides.',
      'Cook the rice and spoon the tofu over it.',
      'Top with grated ginger and spring onion.',
    ] },
  { emoji: '🍲', slot: 'am', protein: 'tofu', name: 'Steamed Tofu & Tomato Salad', cal: 280,
    ingredients: '150 g silken tofu · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Steam the silken tofu 5 min so it is warm all the way through.',
      'Chop the tomato and cucumber while it steams.',
      'Slide the tofu onto the plate and spoon the salad around it.',
      'Finish with calamansi and grated ginger. Cooling, very light.',
    ] },
  { emoji: '🍲', slot: 'am', protein: 'tofu', name: 'Tofu Scramble & Bell Pepper', cal: 290,
    ingredients: '150 g firm tofu · bell pepper · tomato · turmeric · spring onion',
    steps: [
      'Press the tofu 10 min, then crumble it with your hands into egg-sized pieces.',
      'Soften the chopped bell pepper and tomato in a dry non-stick pan.',
      'Add the tofu and a pinch of turmeric — that is what gives it the egg colour.',
      'Cook 5 min, stirring, and finish with spring onion.',
    ] },
  { emoji: '🥑', slot: 'am', protein: 'tofu', name: 'Tofu & Avocado Plate', cal: 340,
    ingredients: '150 g firm tofu · ½ avocado · cucumber · calamansi',
    steps: [
      'Press the tofu 10 min, then slice it thick.',
      'Sear the slices in a dry non-stick pan, 3 min a side, until golden.',
      'Fan the avocado and cucumber alongside.',
      'Squeeze calamansi over everything. Plant protein plus your fats in one plate.',
    ] },

  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Grilled Tilapia & Tomato Salad', cal: 340,
    ingredients: '1 whole tilapia or 150 g fillet · 2 tomatoes · cucumber · calamansi · ginger',
    steps: [
      'Score the fish twice on each side so it cooks evenly, and stuff the cuts with ginger.',
      'Grill or bake 6–7 min a side — the flesh should lift off the bone cleanly.',
      'Chop the tomato and cucumber into a salad while it cooks.',
      'Squeeze calamansi over the fish. Glute-day meal.',
    ] },
  { emoji: '🐟', slot: 'am', protein: 'fish', name: 'Ginger Fish & Rice', cal: 390,
    ingredients: '150 g white fish · 1 cup cooked rice · ginger · spring onion · calamansi',
    steps: [
      'Cook the rice.',
      'Lay the fish on a plate, cover it with plenty of sliced ginger, and steam 8–10 min.',
      'Spoon the steaming juices from the plate over the rice — that is all the flavour you need, no oil.',
      'Top with spring onion and calamansi. Glute-day meal.',
    ] },

  // ── 2:00 PM · Smoothie bowls · always 3 fruits + chia ───────────────────
  { emoji: '🥣', slot: 'pm', name: 'Papaya · Banana · Mango', cal: 250,
    ingredients: '1 cup papaya · 1 frozen banana · ½ cup mango · 1 tbsp chia · splash of water',
    steps: [
      'Freeze the banana and mango the night before — frozen fruit is what makes it thick instead of runny.',
      'Blend all three fruits with only a splash of water.',
      'Stop and push the fruit down with a spoon rather than adding more water.',
      'Pour into a bowl and top with chia. No milk, no sugar.',
    ] },
  { emoji: '🥭', slot: 'pm', name: 'Mango · Banana · Berries', cal: 260,
    ingredients: '1 cup mango · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Use frozen mango and banana straight from the freezer.',
      'Blend them first until creamy, then add the berries for 5 seconds only — that keeps the colour bright.',
      'Spoon into a bowl.',
      'Top with chia and a few whole berries.',
    ] },
  { emoji: '🍈', slot: 'pm', name: 'Papaya · Pineapple · Banana', cal: 240,
    ingredients: '1 cup papaya · ½ cup pineapple · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Scoop the papaya, discarding the seeds.',
      'Blend with pineapple and frozen banana until thick.',
      'Pour into a bowl.',
      'Top with chia. This is the best one for digestion — papaya and pineapple both carry natural enzymes.',
    ] },
  { emoji: '🍓', slot: 'pm', name: 'Berries · Banana · Kiwi', cal: 230,
    ingredients: '1 cup mixed berries · 1 frozen banana · 1 kiwi · 1 tbsp chia',
    steps: [
      'Blend the frozen berries and banana with a splash of water.',
      'Slice the kiwi into rounds — this one goes on top, not in the blender.',
      'Pour the purple base into a bowl.',
      'Lay the kiwi over it and finish with chia.',
    ] },
  { emoji: '🌴', slot: 'pm', name: 'Mango · Papaya · Pineapple', cal: 250,
    ingredients: '1 cup mango · 1 cup papaya · ½ cup pineapple · 1 tbsp chia',
    steps: [
      'Freeze the mango and pineapple beforehand.',
      'Blend all three together — no water at first, the papaya is wet enough.',
      'Add water only a teaspoon at a time if the blender sticks.',
      'Top with chia. Pure tropical, no banana needed.',
    ] },
  { emoji: '🐉', slot: 'pm', name: 'Dragon Fruit · Banana · Berries', cal: 220,
    ingredients: '1 cup dragon fruit · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Freeze the dragon fruit cubes and the banana.',
      'Blend both until deep pink and thick.',
      'Fold the berries through by hand so they stay whole.',
      'Top with chia.',
    ] },
  { emoji: '🍉', slot: 'pm', name: 'Watermelon · Kiwi · Banana', cal: 200,
    ingredients: '1 cup frozen watermelon · 1 kiwi · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Freeze the watermelon cubes — fresh watermelon makes this too watery to be a bowl.',
      'Blend it with the frozen banana until slushy.',
      'Add the kiwi last and pulse twice only.',
      'Top with chia. The most hydrating one — good on a hot day.',
    ] },
  { emoji: '🍎', slot: 'pm', name: 'Apple · Banana · Berries', cal: 240,
    ingredients: '1 apple · 1 frozen banana · ½ cup berries · 1 tbsp chia · cinnamon',
    steps: [
      'Core and chop the apple — leave the skin on for the fibre.',
      'Blend it with the frozen banana and berries until smooth.',
      'Pour into a bowl.',
      'Top with chia and a pinch of cinnamon.',
    ] },
  { emoji: '🍍', slot: 'pm', name: 'Pineapple · Mango · Kiwi', cal: 235,
    ingredients: '1 cup pineapple · 1 cup mango · 1 kiwi · 1 tbsp chia',
    steps: [
      'Use frozen pineapple and mango.',
      'Blend them thick with a splash of water.',
      'Slice the kiwi for the top.',
      'Finish with chia. Sharp and sweet — the most refreshing bowl of the set.',
    ] },
  { emoji: '🥥', slot: 'pm', name: 'Papaya · Berries · Banana', cal: 230,
    ingredients: '1 cup papaya · ½ cup berries · 1 frozen banana · 1 tbsp chia',
    steps: [
      'Blend the papaya and frozen banana first until creamy.',
      'Add the berries and blend 5 seconds more.',
      'Spoon into a bowl.',
      'Top with chia. Gentle on the stomach — the easiest bowl to digest.',
    ] },
  { emoji: '🥑', slot: 'pm', name: 'Avocado · Banana · Berries', cal: 300,
    ingredients: '¼ avocado · 1 frozen banana · ½ cup berries · 1 tbsp chia',
    steps: [
      'Blend the avocado and frozen banana until it goes thick like ice cream.',
      'Spoon it into a bowl — this one is too thick to pour.',
      'Scatter the berries over the top.',
      'Finish with chia. The most filling bowl — the avocado adds your fats.',
    ] },

  // ── 5:00 PM · Last meal · sunset · egg with sweet potato or banana ──────
  { emoji: '🍠', slot: 'sunset', name: 'Egg & Sweet Potato', cal: 320,
    ingredients: '2 eggs · 1 medium sweet potato',
    steps: [
      'Bake the sweet potato at 200°C for 40 min, or boil it 20 min if you are in a hurry — baking makes it far sweeter.',
      'Boil the eggs 8 min alongside.',
      'Split the sweet potato open and halve the eggs over it.',
      'Eat it slowly at sunset. Nothing after this but tea.',
    ] },
  { emoji: '🍌', slot: 'sunset', name: 'Egg & Banana', cal: 260,
    ingredients: '2 eggs · 1 banana',
    steps: [
      'Boil the eggs 8 min and cool them under cold water.',
      'Peel and halve them.',
      'Eat with the banana alongside.',
      'The lightest version of your last meal — good on a night you are not very hungry.',
    ] },
  { emoji: '🍠', slot: 'sunset', name: 'Egg, Sweet Potato & Banana', cal: 400,
    ingredients: '2 eggs · 1 small sweet potato · 1 banana',
    steps: [
      'Bake or boil the sweet potato until soft.',
      'Boil the eggs 8 min.',
      'Plate all three together.',
      'The biggest version — take this one after your heaviest glute days.',
    ] },
  { emoji: '🥚', slot: 'sunset', name: 'Egg & Mashed Sweet Potato', cal: 330,
    ingredients: '2 eggs · 1 medium sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato 20 min until a fork slides straight through.',
      'Mash it with a fork — no butter, no milk, it is sweet enough on its own.',
      'Boil the eggs 8 min and chop them through the mash.',
      'Add a pinch of cinnamon. Warm and filling for the night.',
    ] },
  { emoji: '🍌', slot: 'sunset', name: 'Egg & Banana Mash', cal: 290,
    ingredients: '2 eggs · 1 ripe banana · ½ small sweet potato · cinnamon',
    steps: [
      'Boil the sweet potato until soft and mash it warm.',
      'Mash a very ripe banana through it — the riper it is, the sweeter this gets.',
      'Boil the eggs 8 min and eat them alongside.',
      'Cinnamon on top. Nothing after sunset but tea.',
    ] },
];


// Fish is a GLUTE-DAY food only (Mon · Wed · Fri). Every other day the 10 AM
// protein comes from tofu or eggs.
export function slotMeals(slotId, mealMode) {
  return RECOMMENDED_MEALS.filter(m => {
    if (m.slot !== slotId) return false;
    if (slotId !== 'am') return true;
    return mealMode === 'glute' ? m.protein === 'fish' : m.protein !== 'fish';
  });
}

// Today's suggestions — a few picks per slot, rotated by the day of the week so
// the same meals never land two days in a row. Everything else stays one tap
// away behind "more choices".
export function suggestMeals(slotId, mealMode, dayIndex = 0, n = 3) {
  const list = slotMeals(slotId, mealMode);
  if (list.length <= n) return list;
  const start = (Math.floor(dayIndex / 2) * n) % list.length;
  return Array.from({ length: n }, (_, i) => list[(start + i) % list.length]);
}

// Same three meal times every day. Only the 10 AM protein changes: fish on
// glute days, tofu or eggs on every other day.
function dailyMeals(mealMode) {
  const glute = mealMode === 'glute';
  return {
    mealMode,
    label: glute
      ? '🐟 Glute day · 10 AM fish & fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana'
      : '🌱 Non-glute day · 10 AM tofu or eggs & fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana',
    rows: [
      { time: '10:00 AM — Protein & fats', ingredients: [
        { name: glute ? 'Fish — glute days only' : 'Tofu or eggs — no fish today', key: null, pick: 'protein', slot: 'morning' },
        { name: 'Good fats: avocado or chia', key: 'avocado' },
        { name: 'Veggies on the side', key: null, pick: 'veggie', slot: 'morning' },
      ]},
      { time: '2:00 PM — Smoothie bowl', ingredients: [
        { name: 'Three fruits, blended thick', key: 'banana', pick: 'fruit', slot: 'lunch' },
        { name: 'Chia seeds on top', key: 'chia' },
        { name: 'Water only — no milk, no sugar', key: null },
      ]},
      { time: '5:00 PM — Last meal · sunset', ingredients: [
        { name: 'Egg', key: null },
        { name: 'Sweet potato or banana', key: 'banana' },
        { name: 'Nothing after sunset — tea only', key: null },
      ]},
    ],
  };
}

const GLUTE_MEALS = dailyMeals('glute');
const LIGHT_MEALS = dailyMeals('light');

export const WORKOUT_DAYS = [
  // MONDAY — Glutes & quads
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glutes & Quads', title: 'Glutes & Quads — Compound Power',
    sub: '3 main lifts + stretch & 20-min walk · ~75 min total',
    cardio: { icon: '🚶', title: '20-minute walk after training', note: 'every day, always last' },
    noteBefore: { type: 'rose', text: '🍑 Heaviest day of the week — glutes and quads together, three main lifts only. Squat and split squat drive the quads, the hip thrust finishes the glutes. Go heavy, slow, and full range, then cool down with a 20-minute walk. Fuel it: protein and fats at 10 AM.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute & Quad Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → bodyweight squats × 15 → hip circles × 10 each · wake the glutes and warm the knees before you load a squat' },
      H('🍑 Glutes & Quads — 3 Main Lifts', 'Three sets of ten on all three. Two squat patterns for the quads, then the hip thrust for the glutes. Slow, full range.'),
      { name: '1. Barbell Back Squat', detail: 'MAIN 1 of 3 · 3 × 10 reps · bar on your upper back, chest tall, sit down between your heels to below parallel, drive up through the whole foot · the main quad builder — dumbbell or goblet squat works the same way if you have no bar' },
      { name: '2. Bulgarian Split Squat', detail: 'MAIN 2 of 3 · 3 × 10 reps each leg · rear foot on bench, torso upright for quads (lean 10–15° forward to shift it to glutes), lower the front thigh to parallel · quads plus even hips' },
      { name: '3. Barbell Hip Thrust', detail: 'MAIN 3 of 3 · 3 × 10 reps · shoulders on bench, drive hips to parallel, pause 2 sec, lower for 3 sec · the main glute builder, and the right place for it after squatting' },
      GLUTE_FINISHER,
      H('🚶 Cool-Down · Walk', 'Always the last thing — 20 minutes, every day.'),
      WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track squat and hip thrust weight every Monday. Add 1–2 kg when all 4 sets feel controlled. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days only
    meals: GLUTE_MEALS,
  },
  // TUESDAY — Upper Body A · back + shoulders + core
  {
    emoji: '💪', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Upper Body A', title: 'Back, Shoulders & Core',
    sub: '3 back + 3 shoulder exercises + core video + jump rope + walk · ~85 min',
    cardio: { icon: '🪢', title: 'Jump rope, then 20-minute walk', note: '10–20 min rope · then 20 min walking' },
    noteBefore: { type: 'gold', text: '💪 Back, shoulders, and core — all three, every upper-body day. Three main exercises for the back, three for the shoulders. Light weight, high reps, slow control: that builds the small stabilisers that stop the pain, and it will not make you bulky.' },
    exercises: [
      H('🔥 Warm-Up & Mobility', 'Always first. Loosens the tight chest and stiff upper back before anything gets loaded.'),
      WARMUP,
      ...SHOULDER_MOBILITY,
      H('🎯 Back — 3 Main Exercises', 'Rowing pattern today. Light weight, hold the squeeze, feel it in the back and not the neck.'),
      { name: '1. Seated Row (light, paused)', detail: 'BACK 1 of 3 · 3 × 15 reps · cable or band, chest tall, pull to the ribs and hold 2 sec, release slow · full-range back strength with no joint strain' },
      { name: '2. Single-Arm Dumbbell Row', detail: 'BACK 2 of 3 · 3 × 15 reps each side · light dumbbell, flat back, row to your hip, lower 3 sec · fixes the side-to-side imbalance that comes from carrying bags while travelling' },
      { name: '3. Straight-Arm Lat Pullover', detail: 'BACK 3 of 3 · 3 × 15 reps · band or cable, arms long, pull down to your thighs · lengthens the tight lats that pull your shoulder forward' },
      H('💪 Shoulders — 3 Main Exercises', 'Pure healing work: rear delt, rotator cuff, lower trap. Tiny weights on purpose.'),
      { name: '1. Band Pull-Apart', detail: 'SHOULDER 1 of 3 · 3 × 20 reps · light band, arms straight at chest height, pull apart and squeeze between your shoulder blades 1 sec · the single best fix for rounded travel posture' },
      { name: '2. Banded External Rotation', detail: 'SHOULDER 2 of 3 · 3 × 15 reps each arm · elbow pinned to your side at 90°, rotate the forearm outward slowly · the rotator-cuff work that actually heals the joint · light band only' },
      { name: '3. Prone Y Raise (lower trap)', detail: 'SHOULDER 3 of 3 · 3 × 12 reps · face down, thumbs up, arms in a Y, lift only 10–15 cm and hold 2 sec · NO weight or 0.5–1 kg max · weak lower traps are the usual reason shoulders ache' },
      H('🤍 Stretch & Cool-Down', 'Release what is tight — this is what stops the pain coming back.'),
      ...UPPER_STRETCH,
      H('🌀 Core', 'Vacuum first, then ONE video from the two sections below.', 'core'),
      VACUUM,
      ...CORE_VIDEO_HEADS,
      ...IZZY_ABS,
      ...FULLBODY_VIDEO_HEADS,
      ...NICOLE_FULLBODY,
      H('🪢 Finish · Rope, then Walk', 'Jump rope first, then cool down with the walk.'),
      JUMP_ROPE,
      WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Rule for every set: if it hurts past a 2 out of 10, stop that exercise. Aching muscle = good. Sharp or pinching in the joint = drop the weight or skip it. Never train through shoulder pain. Then pick ONE video: an Izzy core workout (or open her core playlist), or one of Nicole\'s 30-min full-body classes. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    meals: LIGHT_MEALS,
  },
  // WEDNESDAY — Glute isolation
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute Isolation', title: 'Glutes — Pure Isolation',
    sub: '3 main lifts + stretch & 20-min walk · ~70 min total',
    cardio: { icon: '🚶', title: '20-minute walk after training', note: 'every day, always last' },
    noteBefore: { type: 'rose', text: '🔥 Isolation day — no squatting, no hinging, nothing that lets another muscle take over. Three movements that hit the glute directly: upper, outer, and the squeeze at the top. Lighter weight, slower reps, then cool down with a 20-minute walk. Fuel it: protein and fats at 10 AM.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · wake gluteus medius' },
      H('🍑 Glute Isolation — 3 Main Movements', 'Three sets of ten on all three. Upper glute, outer glute, and constant tension — if you feel your back or quads, drop the weight.'),
      { name: '1. Cable Kickback', detail: 'MAIN 1 of 3 · 3 × 10 reps each leg · hinge forward slightly, drive the heel back and up, hold 2 sec at the top, lower slow · the cleanest upper-glute isolation there is' },
      { name: '2. Hip Abduction (band or machine)', detail: 'MAIN 2 of 3 · 3 × 10 reps · push the knees apart, hold 2 sec at the widest point, release slow · builds the outer glute that gives you the round shape' },
      { name: '3. Kas Glute Bridge', detail: 'MAIN 3 of 3 · 3 × 10 reps · short range at the top only, hold 2 sec every rep, never let the hips drop all the way down · constant tension, the best glute pump there is' },
      GLUTE_FINISHER,
      H('🚶 Cool-Down · Walk', 'Always the last thing — 20 minutes, every day.'),
      WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track cable kickback and abduction resistance each Wednesday. Add resistance only when you can still hold the 2-second squeeze on every rep — on isolation day the squeeze matters more than the load. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days only
    meals: GLUTE_MEALS,
  },
  // THURSDAY — Upper Body B · back + shoulders + core, different angles
  {
    emoji: '⚡', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Upper Body B', title: 'Back, Shoulders & Core',
    sub: '3 back + 3 shoulder exercises + core video + jump rope + walk · ~85 min',
    cardio: { icon: '🪢', title: 'Jump rope, then 20-minute walk', note: '10–20 min rope · then 20 min walking' },
    noteBefore: { type: 'gold', text: '⚡ Same three groups as Tuesday — back, shoulders, core — worked from different angles. Three main exercises each. Still light weight and high reps: this makes you upright and pain-free, not bulky.' },
    exercises: [
      H('🔥 Warm-Up & Mobility', 'Always first — same prep as Tuesday, so the back does the work and the shoulder joint does not.'),
      WARMUP,
      ...SHOULDER_MOBILITY,
      H('🎯 Back — 3 Main Exercises', 'Pulling-down and rear-back patterns today, to balance Tuesday\'s rows.'),
      { name: '1. Lat Pulldown (light, high rep)', detail: 'BACK 1 of 3 · 3 × 15 reps · light setting, pull the bar to your collarbone with elbows down to your ribs, 3 sec release · stop if it pinches overhead and use a band instead' },
      { name: '2. Face Pull (band or cable)', detail: 'BACK 2 of 3 · 3 × 20 reps · light resistance, pull to your forehead with elbows high, squeeze 2 sec · rebuilds the mid-back that travelling and phone posture switch off' },
      { name: '3. Prone T & W Raise', detail: 'BACK 3 of 3 · 3 × 12 reps each shape · face down, lift into a T then into a W, hold 2 sec · bodyweight or 0.5–1 kg · mid-back endurance so you can hold posture all day' },
      H('💪 Shoulders — 3 Main Exercises', 'Cuff, serratus, and safe overhead range. Still tiny weights.'),
      { name: '1. Side-Lying External Rotation', detail: 'SHOULDER 1 of 3 · 3 × 15 reps each arm · lie on your side, elbow at your waist, rotate a light dumbbell up to the ceiling, lower 3 sec · direct rotator-cuff healing work' },
      { name: '2. Scaption Raise', detail: 'SHOULDER 2 of 3 · 3 × 12 reps · thumbs up, raise arms at a 45° angle (between front and side) to shoulder height only, lower slow · 0.5–2 kg max · the safest way to reload a sore shoulder' },
      { name: '3. Serratus Wall Push', detail: 'SHOULDER 3 of 3 · 3 × 12 reps · forearms on the wall, push the wall away so your shoulder blades slide apart, hold 2 sec · the muscle that lets your arm go overhead pain-free' },
      H('🤍 Stretch & Cool-Down', 'Open the chest and lats so your shoulders sit back where they belong.'),
      ...UPPER_STRETCH,
      H('🌀 Core', 'Vacuum first, then ONE video from the two sections below.', 'core'),
      VACUUM,
      ...CORE_VIDEO_HEADS,
      ...IZZY_ABS,
      ...FULLBODY_VIDEO_HEADS,
      ...NICOLE_FULLBODY,
      H('🪢 Finish · Rope, then Walk', 'Jump rope first, then cool down with the walk.'),
      JUMP_ROPE,
      WALK,
    ],
    noteAfter: { type: 'rose', text: '⚠️ No overhead pressing on either upper day until your shoulder has been pain-free for 2–3 weeks. When it is, add ONE light overhead press (3 × 12) here and keep it light. Pick ONE video: an Izzy core workout (or her core playlist), or one of Nicole\'s 30-min full-body classes. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    meals: LIGHT_MEALS,
  },
  // FRIDAY — Glutes & hamstrings
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glutes & Hamstrings', title: 'Glutes & Hamstrings — The Hinge',
    sub: '3 main lifts + stretch & 20-min walk · ~70 min total',
    cardio: { icon: '🚶', title: '20-minute walk after training', note: 'every day, always last' },
    noteBefore: { type: 'rose', text: '✨ Hinge day — glutes and hamstrings together, three main lifts. Everything today is a hip hinge or a knee curl, so keep your back flat and let the hamstrings stretch. Then cool down with a 20-minute walk.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute & Hamstring Activation', detail: '5 min · banded glute bridges × 20 → bodyweight good mornings × 15 → donkey kicks × 15 each · get blood into the glutes and lengthen the hamstrings before you hinge' },
      H('🍑 Glutes & Hamstrings — 3 Main Lifts', 'Three sets of ten on all three. Every movement is a hinge or a curl — slow on the way down, that is where hamstrings grow.'),
      { name: '1. Romanian Deadlift (RDL)', detail: 'MAIN 1 of 3 · 3 × 10 reps · soft knees, hinge from the hips, lower 3 sec until you feel the hamstrings stretch, drive the hips forward to stand · the single best glute-and-hamstring lift' },
      { name: '2. Hamstring Curl (machine or band)', detail: 'MAIN 2 of 3 · 3 × 10 reps · curl your heels to your glutes, squeeze 1 sec, lower for 3 sec · the only movement that trains the hamstring at the knee, which the RDL cannot do' },
      { name: '3. Cable Pull-Through', detail: 'MAIN 3 of 3 · 3 × 10 reps · face away from a low cable, rope between your legs, hinge back until you feel the hamstrings, then squeeze the glutes to stand tall · all the glute work of a hinge with none of the load on your spine — the perfect third lift after heavy RDLs' },
      GLUTE_FINISHER,
      H('🚶 Cool-Down · Walk', 'Always the last thing — 20 minutes, every day.'),
      WALK,
    ],
    noteAfter: { type: 'gold', text: '📋 Track RDL weight every Friday. If you feel it in your hamstrings and glutes and not your lower back, your hinge is right. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    trackLifts: true,   // sets/reps/weight are editable on the glute days only
    meals: GLUTE_MEALS,
  },
  // SATURDAY — Rest
  {
    emoji: '🧘', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Saturday · Rest', title: 'Stretch, Walk & Forearm Stand',
    sub: 'Stretching + 20-min walk + forearm-stand training',
    cardio: { icon: '🚶', title: '20-minute walk', note: 'every day, rest days included' },
    noteBefore: { type: 'gold', text: '🧘 Rest day. No lifting. Stretch long and slow, walk your 20 minutes, and train toward your forearm stand. Keep it playful — stop before you feel tired.' },
    exercises: [
      H('🤍 Stretching', 'The main event on a rest day. Long, slow holds.'),
      REST_STRETCH,
      H('🚶 Cool-Down Walk', '20 minutes, any pace. Every day, no exceptions.'),
      REST_WALK,
      H('🤸 Forearm Stand — Drills', 'Do these first, every rest day. This is how the skill is built.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a rest day.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Forearm stand: drills first, then one video. The Nicole full-body pilates classes are optional — only if you feel like moving. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    meals: LIGHT_MEALS,
  },
  // SUNDAY — Rest
  {
    emoji: '🤸', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Rest', title: 'Stretch, Walk & Forearm Stand',
    sub: 'Stretching + 20-min walk + forearm-stand training',
    cardio: { icon: '🚶', title: '20-minute walk', note: 'every day, rest days included' },
    noteBefore: { type: 'gold', text: '🤸 Second rest day. Same freedom: stretch, walk your 20 minutes, and practise the forearm stand. Two rest days is what makes five strength days possible.' },
    exercises: [
      H('🤍 Stretching', 'The main event on a rest day. Long, slow holds.'),
      REST_STRETCH,
      H('🚶 Cool-Down Walk', '20 minutes, any pace. Every day, no exceptions.'),
      REST_WALK,
      H('🤸 Forearm Stand — Drills', 'Do these first, every rest day. This is how the skill is built.'),
      ...FOREARM_STAND_DRILLS,
      H('▶ Forearm Stand — Videos', 'Then pick ONE to follow along with.', 'core'),
      ...HANDSTAND_INTERMEDIATE,
      H('🪷 Optional · Gentle Yoga', 'Only if you want more. Never mandatory on a rest day.', 'core'),
      ...YOGA_BEGINNER,
      H('🧘 Optional · Full Body · Move With Nicole', 'Only if you feel like moving — five short 30-minute classes.', 'core'),
      ...NICOLE_FULLBODY,
    ],
    noteAfter: { type: 'rose', text: '💡 Hold dolphin longer every week — that is how the forearm stand arrives. Meals: 10 AM fish, tofu or eggs + fats · 2 PM smoothie bowl · 5 PM egg with sweet potato or banana.' },
    meals: LIGHT_MEALS,
  },
];
