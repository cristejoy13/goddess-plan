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
//   • Glute days (3×: Mon · Wed · Fri) — followed by a 30-minute walk
//   • Upper body days (2×: Tue · Thu) — back, shoulders & core, followed by
//     jump rope
// Rest days (Sat · Sun): stretching, light walking (as much as you want), and
// forearm-stand training.

// Shared warm-up. Cool-down differs by day type: glute days finish with a
// 30-minute walk, upper-body days finish with jump rope.
const WARMUP = { name: 'Full-Body Stretch Warm-Up', detail: '5–8 min · neck, shoulders, chest, back, hips, hamstrings, calves · loosen every major muscle before you train · dynamic swings then gentle holds' };
const WALK_30 = { name: '30-Minute Walk', detail: '30 min easy walk straight after your glute session · flat pace, relaxed breathing · burns fat without eating into recovery' };
const JUMP_ROPE = { name: 'Jump Rope Finisher', detail: '10–20 min · steady, light on the balls of your feet · finish every upper-body day with the rope' };

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
const REST_WALK = { name: 'Light Walk — as long as you want', detail: 'no target, no pace · walk as long as it feels good · sunshine, podcast, whatever you like' };
const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · do this FIRST before your core video' };

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// Three meals, same clock every day:
//   10:00 AM — protein and fats
//    2:00 PM — smoothie bowl
//    5:00 PM — sweet potato and banana (last meal, at sunset) to carry you
//              through the night
// Meat is for GLUTE DAYS ONLY (Mon · Wed · Fri). On the other four days the
// 10 AM meal is meat-free — smoothie bowls and fruit instead.

// Recommended meals — simple, oil-free, no-salt, and built ONLY from the
// ingredients the user eats. Grouped by meal slot so the plan reads clean.
export const MEAL_TAGS = ['All', 'Protein & fats', 'Smoothie bowls', 'Fruit', 'Sunset'];

export const RECOMMENDED_MEALS = [
  // ── 10 AM · Protein & fats (meat only on glute days: Mon · Wed · Fri) ──
  { emoji: '🍗', name: 'Chicken & Avocado', tag: 'Protein & fats', cal: 380,
    ingredients: 'Chicken · ¼–½ avocado · tomatoes',
    steps: 'Boil or bake the chicken until cooked through. Slice avocado and tomato alongside. No oil, no salt. Glute-day meal.' },
  { emoji: '🐟', name: 'Sardines & Rice', tag: 'Protein & fats', cal: 330,
    ingredients: 'Sardines · rice',
    steps: 'Cook the rice. Drain the sardines and serve over the rice. No oil, no salt. Glute-day meal.' },
  { emoji: '🐟', name: 'Sardines, Rice & Tomato', tag: 'Protein & fats', cal: 350,
    ingredients: 'Sardines · rice · tomatoes',
    steps: 'Cook the rice. Drain the sardines, add chopped tomato, and serve over the rice. No oil, no salt. Glute-day meal.' },
  { emoji: '🍗', name: 'Chicken & Sweet Potato', tag: 'Protein & fats', cal: 360,
    ingredients: 'Chicken · sweet potato · tomatoes',
    steps: 'Boil the chicken. Boil or steam the sweet potato. Serve with chopped tomato. No oil, no salt. Glute-day meal.' },
  { emoji: '🍗', name: 'Chicken & Bell Pepper Bowl', tag: 'Protein & fats', cal: 280,
    ingredients: 'Chicken · bell pepper · tomatoes · cucumber',
    steps: 'Boil the chicken and slice. Add bell pepper, tomato, and cucumber. Fresh and light. No oil, no salt. Glute-day meal.' },
  { emoji: '🥚', name: 'Boiled Eggs & Avocado', tag: 'Protein & fats', cal: 300,
    ingredients: '2 eggs · ¼ avocado · tomatoes',
    steps: 'Boil the eggs 7–10 min. Slice avocado and tomato alongside. Protein plus good fat — perfect 10 AM meal.' },
  { emoji: '🥚', name: 'Egg Whites & Avocado', tag: 'Protein & fats', cal: 220,
    ingredients: '3 egg whites · ¼ avocado · tomatoes',
    steps: 'Boil or poach the egg whites. Add sliced avocado and tomato. Light protein with good fat. No oil, no salt.' },
  { emoji: '🥣', name: 'Greek Yogurt, Chia & Berries', tag: 'Protein & fats', cal: 250,
    ingredients: 'Greek yogurt · berries · chia seeds',
    steps: 'Top the yogurt with berries and a spoon of chia. No sugar. A meat-free 10 AM option for non-glute days.' },

  // ── 2 PM · Smoothie bowls (every day) ──
  { emoji: '🥣', name: 'Banana Berry Smoothie Bowl', tag: 'Smoothie bowls', cal: 240,
    ingredients: 'Banana · berries · chia seeds · water',
    steps: 'Blend frozen banana and berries with a splash of water until thick. Pour into a bowl and top with chia. No milk, no sugar.' },
  { emoji: '🥭', name: 'Mango Banana Bowl', tag: 'Smoothie bowls', cal: 260,
    ingredients: 'Mango · banana · chia seeds · water',
    steps: 'Blend mango and banana thick with a little water. Top with chia seeds. Naturally sweet, no sugar.' },
  { emoji: '🍈', name: 'Papaya Chia Bowl', tag: 'Smoothie bowls', cal: 210,
    ingredients: 'Papaya · banana · chia seeds',
    steps: 'Blend papaya with half a banana. Top with chia. Gentle on the gut, great for digestion.' },
  { emoji: '🥑', name: 'Avocado Banana Bowl', tag: 'Smoothie bowls', cal: 290,
    ingredients: '¼ avocado · banana · berries · water',
    steps: 'Blend avocado and banana until creamy, top with berries. The avocado adds the fats — a full meal in a bowl.' },
  { emoji: '🍍', name: 'Pineapple Berry Bowl', tag: 'Smoothie bowls', cal: 220,
    ingredients: 'Pineapple · berries · banana · chia seeds',
    steps: 'Blend pineapple, berries, and banana thick. Top with chia seeds. Fresh and fibre-rich.' },
  { emoji: '🐉', name: 'Dragon Fruit Bowl', tag: 'Smoothie bowls', cal: 200,
    ingredients: 'Dragon fruit · banana · kiwi · chia seeds',
    steps: 'Blend dragon fruit and banana, top with sliced kiwi and chia. Bright, light, no sugar.' },

  // ── Fruit (non-glute days, alongside your bowls) ──
  { emoji: '🥗', name: 'Fruit Salad', tag: 'Fruit', cal: 200,
    ingredients: 'Apple · kiwi · dragon fruit · chia seeds',
    steps: 'Chop the fruit and toss with chia seeds. Fresh, no cooking.' },
  { emoji: '🍓', name: 'Papaya & Chia', tag: 'Fruit', cal: 180,
    ingredients: 'Papaya · chia seeds',
    steps: 'Scoop the papaya and top with chia seeds. Gentle on the gut.' },
  { emoji: '🍍', name: 'Pineapple & Berry Chia', tag: 'Fruit', cal: 190,
    ingredients: 'Pineapple · berries · chia seeds',
    steps: 'Chop pineapple, add berries and chia seeds. Fresh and fibre-rich.' },
  { emoji: '🍉', name: 'Watermelon & Kiwi', tag: 'Fruit', cal: 150,
    ingredients: 'Watermelon · kiwi',
    steps: 'Chop and eat cold. Hydrating and light — good between meals.' },

  // ── 5 PM · Sunset · sweet potato & banana (last meal, every day) ──
  { emoji: '🍠', name: 'Sweet Potato & Banana', tag: 'Sunset', cal: 300,
    ingredients: 'Sweet potato · banana',
    steps: 'Boil, steam, or bake the sweet potato. Eat with a banana at sunset. Slow carbs to carry you through the night. No oil, no salt.' },
  { emoji: '🍠', name: 'Sweet Potato, Banana & Chia', tag: 'Sunset', cal: 330,
    ingredients: 'Sweet potato · banana · chia seeds',
    steps: 'Bake the sweet potato. Mash the banana over it and sprinkle chia. Extra fibre so you stay full all night.' },
  { emoji: '🍠', name: 'Baked Sweet Potato & Banana Mash', tag: 'Sunset', cal: 310,
    ingredients: 'Sweet potato · banana',
    steps: 'Bake the sweet potato until soft and sweet, then mash a ripe banana through it. Warm, filling, nothing added.' },
  { emoji: '🍠', name: 'Sweet Potato, Banana & Berries', tag: 'Sunset', cal: 320,
    ingredients: 'Sweet potato · banana · berries',
    steps: 'Steam the sweet potato, slice the banana on top, add a handful of berries. Your last meal — eat it slowly.' },
];

// Glute days (Mon · Wed · Fri) — the only days you eat meat.
const GLUTE_MEALS = {
  label: '🍑 Glute day (meat day) · 10 AM protein & fats · 2 PM smoothie bowl · 5 PM sweet potato & banana',
  rows: [
    { time: '10:00 AM — Protein & fats', ingredients: [
      { name: 'Meat today: chicken, fish or eggs', key: null, pick: 'protein', slot: 'morning' },
      { name: 'Good fats: avocado, chia or nuts', key: 'avocado' },
      { name: 'Veggies on the side', key: null, pick: 'veggie', slot: 'morning' },
    ]},
    { time: '2:00 PM — Smoothie bowl', ingredients: [
      { name: 'Banana, berries or mango — blended thick', key: 'banana', pick: 'fruit', slot: 'lunch' },
      { name: 'Chia seeds on top', key: 'chia' },
      { name: 'Water only — no milk, no sugar', key: null },
    ]},
    { time: '5:00 PM — Last meal · sunset', ingredients: [
      { name: 'Sweet potato', key: null },
      { name: 'Banana', key: 'banana' },
      { name: 'Nothing after sunset — tea only', key: null },
    ]},
  ],
};

// Upper-body and rest days (Tue · Thu · Sat · Sun) — no meat, smoothie bowls
// and fruit instead.
const LIGHT_MEALS = {
  label: '🍓 No-meat day · 10 AM smoothie bowl & fats · 2 PM smoothie bowl or fruit · 5 PM sweet potato & banana',
  rows: [
    { time: '10:00 AM — Smoothie bowl & fats', ingredients: [
      { name: 'Smoothie bowl: banana, berries or mango', key: 'banana', pick: 'fruit', slot: 'morning' },
      { name: 'Fats: avocado, chia or nut butter', key: 'avocado' },
      { name: 'No meat today', key: null },
    ]},
    { time: '2:00 PM — Smoothie bowl or fruit', ingredients: [
      { name: 'Papaya, pineapple, kiwi or berries', key: 'papaya', pick: 'fruit', slot: 'lunch' },
      { name: 'Chia seeds for fibre', key: 'chia' },
      { name: 'Water or tea alongside', key: null },
    ]},
    { time: '5:00 PM — Last meal · sunset', ingredients: [
      { name: 'Sweet potato', key: null },
      { name: 'Banana', key: 'banana' },
      { name: 'Nothing after sunset — tea only', key: null },
    ]},
  ],
};

export const WORKOUT_DAYS = [
  // MONDAY — Glute A
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute A', title: 'Glutes — Compound Power',
    sub: '3 main lifts + stretch & 30-min walk · ~75 min total',
    cardio: { icon: '🚶', title: '30-minute walk after training', note: 'straight after your glute session' },
    noteBefore: { type: 'rose', text: '🍑 Heaviest glute day — three main lifts only. Go heavy, slow, and full range on all three, then walk 30 minutes. Meat day — protein and fats at 10 AM.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → hip circles × 10 each · wake glutes before loading' },
      H('🍑 Glutes — 3 Main Lifts', 'The whole glute workout. Heavy, slow, full range.'),
      { name: '1. Barbell Hip Thrust', detail: 'MAIN 1 of 3 · 4 × 10–12 reps · shoulders on bench, drive hips to parallel, pause 2 sec, lower for 3 sec · main glute builder' },
      { name: '2. Romanian Deadlift (RDL)', detail: 'MAIN 2 of 3 · 4 × 10–12 reps · soft knees, hinge, lower 3 sec to hamstring stretch, drive hips forward · load the full glute stretch' },
      { name: '3. Bulgarian Split Squat', detail: 'MAIN 3 of 3 · 3 × 10 reps each leg · rear foot on bench, torso 10–15° forward, lower front thigh to parallel · build even glutes' },
      { name: 'Glute Bridge Burnout', detail: 'FINISHER (bodyweight, not a main lift) · 2 × 25 reps · feet flat, drive hips up, squeeze hard · fast controlled reps' },
      H('🚶 Finish', 'Walk 30 minutes straight after every glute day.'),
      WALK_30,
    ],
    noteAfter: { type: 'gold', text: '📋 Track hip thrust weight every Monday. Add 1–2 kg when all 4 sets feel controlled. Meals: 10 AM protein & fats (meat today) · 2 PM smoothie bowl · 5 PM sweet potato & banana.' },
    meals: GLUTE_MEALS,
  },
  // TUESDAY — Upper Body A · back + shoulders + core
  {
    emoji: '💪', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Upper Body A', title: 'Back, Shoulders & Core',
    sub: '3 back + 3 shoulder exercises + core video + jump rope · ~65 min',
    cardio: { icon: '🪢', title: 'Jump rope after training', note: '10–20 min to finish the day' },
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
      H('🪢 Finish', 'End every upper-body day with the rope.'),
      JUMP_ROPE,
    ],
    noteAfter: { type: 'rose', text: '⚠️ Rule for every set: if it hurts past a 2 out of 10, stop that exercise. Aching muscle = good. Sharp or pinching in the joint = drop the weight or skip it. Never train through shoulder pain. Then pick ONE video: an Izzy core workout (or open her core playlist), or one of Nicole\'s 30-min full-body classes. Meals: 10 AM smoothie bowl & fats · 2 PM smoothie bowl or fruit · 5 PM sweet potato & banana. No meat today.' },
    meals: LIGHT_MEALS,
  },
  // WEDNESDAY — Glute B
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute B', title: 'Glutes — Shape & Round',
    sub: '3 main lifts + stretch & 30-min walk · ~70 min total',
    cardio: { icon: '🚶', title: '30-minute walk after training', note: 'straight after your glute session' },
    noteBefore: { type: 'rose', text: '🔥 Second glute day — three main lifts only. Lower glutes, upper glutes, and outer shape, then walk 30 minutes. Meat day — protein and fats at 10 AM.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · wake gluteus medius' },
      H('🍑 Glutes — 3 Main Lifts', 'The whole glute workout. Lower, upper, and outer glute.'),
      { name: '1. Sumo Squat', detail: 'MAIN 1 of 3 · 4 × 12–15 reps · wide stance, toes 45°, sit deep below parallel, pause 1 sec · build lower glute and inner thigh' },
      { name: '2. Cable Kickback', detail: 'MAIN 2 of 3 · 3 × 15 reps each leg · hinge forward, drive heel back and up, hold 2 sec, lower slow · isolate upper glute' },
      { name: '3. Hip Abduction (band or machine)', detail: 'MAIN 3 of 3 · 3 × 20 reps · push knees apart, hold 2 sec at widest point · build round outer glutes' },
      { name: 'Single-Leg Glute Bridge', detail: 'FINISHER (bodyweight, not a main lift) · 2 × 15 reps each leg · drive hips through the working heel and squeeze · controlled' },
      H('🚶 Finish', 'Walk 30 minutes straight after every glute day.'),
      WALK_30,
    ],
    noteAfter: { type: 'gold', text: '📋 Track cable kickback and sumo squat weights each Wednesday. Add resistance when reps feel easy. Meals: 10 AM protein & fats (meat today) · 2 PM smoothie bowl · 5 PM sweet potato & banana.' },
    meals: GLUTE_MEALS,
  },
  // THURSDAY — Upper Body B · back + shoulders + core, different angles
  {
    emoji: '⚡', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Upper Body B', title: 'Back, Shoulders & Core',
    sub: '3 back + 3 shoulder exercises + core video + jump rope · ~65 min',
    cardio: { icon: '🪢', title: 'Jump rope after training', note: '10–20 min to finish the day' },
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
      H('🪢 Finish', 'End every upper-body day with the rope.'),
      JUMP_ROPE,
    ],
    noteAfter: { type: 'rose', text: '⚠️ No overhead pressing on either upper day until your shoulder has been pain-free for 2–3 weeks. When it is, add ONE light overhead press (3 × 12) here and keep it light. Pick ONE video: an Izzy core workout (or her core playlist), or one of Nicole\'s 30-min full-body classes. Meals: 10 AM smoothie bowl & fats · 2 PM smoothie bowl or fruit · 5 PM sweet potato & banana. No meat today.' },
    meals: LIGHT_MEALS,
  },
  // FRIDAY — Glute C
  {
    emoji: '✨', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glute C', title: 'Glutes — Volume & Squeeze',
    sub: '3 main lifts + stretch & 30-min walk · ~70 min total',
    cardio: { icon: '🚶', title: '30-minute walk after training', note: 'straight after your glute session' },
    noteBefore: { type: 'rose', text: '✨ Third glute day — three main lifts, lighter weight, higher reps, maximum squeeze. Chase the burn, not the load, then walk 30 minutes. Meat day.' },
    exercises: [
      H('🔥 Warm-Up & Glute Activation', 'Never load a cold glute — stretch, then wake them up.'),
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · banded glute bridges × 20 → fire hydrants × 15 each → donkey kicks × 15 each · get blood into the glutes' },
      H('🍑 Glutes — 3 Main Lifts', 'The whole glute workout. Lighter, higher reps, maximum squeeze.'),
      { name: '1. Kas Glute Bridge', detail: 'MAIN 1 of 3 · 4 × 15–20 reps · short range at the top only, hold 2 sec every rep · constant tension, the best glute pump there is' },
      { name: '2. Dumbbell Step-Up', detail: 'MAIN 2 of 3 · 3 × 12 reps each leg · knee-height box, drive through the whole foot, lower 3 sec · upper glute and shape' },
      { name: '3. Reverse Hyperextension or Back Extension', detail: 'MAIN 3 of 3 · 3 × 15 reps · squeeze glutes to lift, stop at a straight line, no over-arching · glutes plus lower-back health' },
      { name: 'Frog Pump Finisher', detail: 'FINISHER (bodyweight, not a main lift) · 2 × 30 reps · heels together, knees wide, pump hips up fast and squeeze · burn it out to end the week' },
      H('🚶 Finish', 'Walk 30 minutes straight after every glute day.'),
      WALK_30,
    ],
    noteAfter: { type: 'gold', text: '📋 Friday is the pump day — if you feel your glutes and not your back, it worked. Meals: 10 AM protein & fats (meat today) · 2 PM smoothie bowl · 5 PM sweet potato & banana.' },
    meals: GLUTE_MEALS,
  },
  // SATURDAY — Rest
  {
    emoji: '🧘', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Saturday · Rest', title: 'Stretch, Walk & Forearm Stand',
    sub: 'Stretching + light walking + forearm-stand training · as long as you like',
    cardio: { icon: '🚶', title: 'Light walk — whatever you want', note: 'no target, no pace' },
    noteBefore: { type: 'gold', text: '🧘 Rest day. No lifting. Stretch long and slow, walk as much as you want, and train toward your forearm stand. Keep it playful — stop before you feel tired.' },
    exercises: [
      H('🤍 Stretching', 'The main event on a rest day. Long, slow holds.'),
      REST_STRETCH,
      H('🚶 Light Walking', 'As long as you want, at any pace you want.'),
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
    noteAfter: { type: 'rose', text: '💡 Forearm stand: drills first, then one video. The Nicole full-body pilates classes are optional — only if you feel like moving. No meat today: 10 AM smoothie bowl & fats · 2 PM fruit · 5 PM sweet potato & banana.' },
    meals: LIGHT_MEALS,
  },
  // SUNDAY — Rest
  {
    emoji: '🤸', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Rest', title: 'Stretch, Walk & Forearm Stand',
    sub: 'Stretching + light walking + forearm-stand training · as long as you like',
    cardio: { icon: '🚶', title: 'Light walk — whatever you want', note: 'no target, no pace' },
    noteBefore: { type: 'gold', text: '🤸 Second rest day. Same freedom: stretch, walk as much as you like, and practise the forearm stand. Two rest days is what makes five strength days possible.' },
    exercises: [
      H('🤍 Stretching', 'The main event on a rest day. Long, slow holds.'),
      REST_STRETCH,
      H('🚶 Light Walking', 'As long as you want, at any pace you want.'),
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
    noteAfter: { type: 'rose', text: '💡 Hold dolphin longer every week — that is how the forearm stand arrives. No meat today: 10 AM smoothie bowl & fats · 2 PM fruit · 5 PM sweet potato & banana.' },
    meals: LIGHT_MEALS,
  },
];
