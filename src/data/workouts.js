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

// Shared warm-up & cool-down (used on every training day)
const WARMUP = { name: 'Full-Body Stretch Warm-Up', detail: '5–8 min · neck, shoulders, chest, back, hips, hamstrings, calves · loosen every major muscle before you train · dynamic swings then gentle holds' };
const COOLDOWN = { name: 'Jump Rope Cool-Down', detail: '10–20 min · steady, light on the balls of your feet · flush the legs and burn extra fat · then walk 15 min after meals' };

// Deep-core & back days: choose ONE video based on how you feel.
const IZZY_ABS = [
  { name: 'Abs (Izzy) — 20 Min Deep Core Sculpt', detail: 'Pilates by Izzy · deep core + tone, no equipment', url: 'https://www.youtube.com/watch?v=XmbOXzKIjaU' },
  { name: 'Abs (Izzy) — 20 Min Ab Burn',          detail: 'Pilates by Izzy · no-equipment core, abs & waist', url: 'https://www.youtube.com/watch?v=TV1yswlJnIY' },
  { name: 'Abs (Izzy) — 15 Min Snatched Waist',   detail: 'Pilates by Izzy · flat stomach, no repeats, no equipment', url: 'https://www.youtube.com/watch?v=uH0JkK2mcWQ' },
  { name: 'Abs (Izzy) — Booty & Ab Burn',         detail: 'Pilates by Izzy · core + glute combo', url: 'https://www.youtube.com/watch?v=PkoB1jwvOFg' },
  { name: 'Abs (Izzy) — Core Playlist (pick any)', detail: 'Pilates by Izzy · full core playlist, choose by mood', url: 'https://www.youtube.com/playlist?list=PLefYzZnhersYvg6wIbgePfGmFs_nB6yH7' },
];

const NICOLE_FULLBODY = [
  { name: 'Full Body (Nicole) — 45 Min Pilates',      detail: 'Move With Nicole · full body, equipment-free', url: 'https://www.youtube.com/watch?v=dN5fWO9m1AY' },
  { name: 'Full Body (Nicole) — 40 Min Dynamic',      detail: 'Move With Nicole · dynamic intermediate, no equipment', url: 'https://www.youtube.com/watch?v=sqh_EjMteu8' },
  { name: 'Full Body (Nicole) — 40 Min Intermediate', detail: 'Move With Nicole · full body intermediate class', url: 'https://www.youtube.com/watch?v=koTzaUu7Vws' },
  { name: 'Full Body (Nicole) — 40 Min At-Home',      detail: 'Move With Nicole · full body at-home pilates', url: 'https://www.youtube.com/watch?v=0zjiVQ950EE' },
  { name: 'Full Body (Nicole) — 30 Min Morning',      detail: 'Move With Nicole · energising morning full body', url: 'https://www.youtube.com/watch?v=LbG1ovCGp-E' },
];

const THUY_MAI_WORKOUTS = [
  { name: 'Abs (Thuý Mai) — Facebook Reel',         detail: 'Thuý Mai Thuý Mai · abs/core reel from Facebook · choose this for a short core burn on core days', url: 'https://www.facebook.com/share/r/1Cx9ZyJQVC/' },
  { name: 'Abs (Thuý Mai) — Core Video',            detail: 'Thuý Mai Thuý Mai · Facebook core workout video · choose this for abs, waist, and deep-core control', url: 'https://www.facebook.com/share/v/19H7EwvHp9/' },
  { name: 'Abs (Thuý Mai) — Waist Video',           detail: 'Thuý Mai Thuý Mai · Facebook abs/waist workout video · choose this when you want a focused core session', url: 'https://www.facebook.com/share/v/1Du4t1SSUE/' },
  { name: 'Full Body (Thuý Mai) — Sculpt Reel',     detail: 'Thuý Mai Thuý Mai · Facebook full-body reel · choose this for a fast sculpt session on core days', url: 'https://www.facebook.com/share/r/18wkkxgKBy/' },
  { name: 'Full Body (Thuý Mai) — No-Equipment Video', detail: 'Thuý Mai Thuý Mai · Facebook full-body workout video · choose this for a no-equipment sweat without heavy lifting', url: 'https://www.facebook.com/share/v/1DDLPaGusb/' },
];

// Intermediate hand-balancing: learn hand standing + elbow (forearm) standing.
const HANDSTAND_INTERMEDIATE = [
  { name: 'Handstand — Complete Handstand Guide',        detail: 'from beginner to intermediate · wall drills, hollow body, and balance · build to a free handstand', url: 'https://www.youtube.com/watch?v=2-3wv5kLNnw' },
  { name: 'Handstand — Master the Handstand & Press',    detail: 'step-by-step handstand + press handstand · intermediate strength and control', url: 'https://www.youtube.com/watch?v=KknM6GXJJIs' },
  { name: 'Elbow Stand — Forearm Stand (Calisthenics)',  detail: 'School of Calisthenics · elbow/forearm stand · the "brakes", kick-up, and balance', url: 'https://www.youtube.com/watch?v=6abRwGwQ704' },
  { name: 'Elbow Stand — Pincha Mayurasana Tips',        detail: 'forearm-stand tips & tricks · shoulder alignment and a controlled kick-up', url: 'https://www.youtube.com/watch?v=emCch6a0DV4' },
  { name: 'Elbow Stand — Float into Forearm Stand',      detail: 'intermediate follow-along · float up with control instead of kicking', url: 'https://www.youtube.com/watch?v=DtvzGQj5C6I' },
];

const YOGA_BEGINNER = [
  { name: 'Yoga — Complete Beginners (20 min)', detail: 'Yoga With Adriene · gentle intro, build the basics', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
  { name: 'Yoga — Beginners: The Basics',       detail: 'Yoga With Adriene · foundational poses & alignment', url: 'https://www.youtube.com/watch?v=pWobp3phsEU' },
  { name: 'Yoga — Flexible Mind & Body',        detail: 'Yoga With Adriene · flexibility flow toward inversions', url: 'https://www.youtube.com/watch?v=xFEAOzWLx8Y' },
];

const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · do this FIRST before your video' };

// ─── MEAL PLAN ─────────────────────────────────────────────────────────────
// OMAD (one meal a day). On pilates days you eat ONE meal at 5 PM; water, tea,
// and psyllium husk during the day. On glute days you eat whenever you like —
// the only rule is to stop eating by 5 PM. You choose whatever you want to eat;
// tap ＋ to pick a fruit, protein, or veggie, or open the search to add anything.

// Recommended meals — simple, oil-free, low/no salt, low-calorie. Proteins are
// fish, chicken, egg whites, or Greek yogurt; carbs only with fibre; a little
// good fat sometimes (avocado, chia). No sauces, nothing complicated to cook.
// tag drives the filter chips in the meal plan.
export const MEAL_TAGS = ['All', 'Fish', 'Chicken', 'Egg whites', 'Greek yogurt', 'Fruit'];

export const RECOMMENDED_MEALS = [
  // ── Fish ──
  { emoji: '🐟', name: 'Steamed Salmon & Sweet Potato', tag: 'Fish', cal: 350,
    ingredients: 'Salmon fillet · sweet potato · lemon',
    steps: 'Steam the salmon 8–10 min with lemon. Boil or steam the sweet potato until fork-tender. No oil, no salt.' },
  { emoji: '🐟', name: 'Sardines & Tomato Bowl', tag: 'Fish', cal: 250,
    ingredients: 'Sardines (in water) · tomatoes · bell pepper · lemon',
    steps: 'Drain the sardines. Chop tomato and bell pepper, toss together, squeeze lemon. Eat cold — no cooking.' },
  { emoji: '🐟', name: 'Baked Fish & Bell Pepper', tag: 'Fish', cal: 280,
    ingredients: 'Any white fish · bell pepper · tomato · lemon',
    steps: 'Bake fish at 190°C for 12–15 min with sliced peppers and tomato. Finish with lemon. No oil.' },
  { emoji: '🐟', name: 'Salmon & Berry Salad', tag: 'Fish', cal: 320,
    ingredients: 'Cooked salmon · mixed berries · cucumber',
    steps: 'Flake cooked salmon over sliced cucumber and berries. Squeeze lemon. Fresh, no cooking needed.' },
  { emoji: '🐟', name: 'Steamed Fish & Greens', tag: 'Fish', cal: 260,
    ingredients: 'Any fish · spinach or greens · ginger · lemon',
    steps: 'Steam fish 8–10 min with ginger. Steam the greens 1–2 min. Squeeze lemon. No oil, light on salt.' },
  { emoji: '🐟', name: 'Sardine & Sweet Potato Mash', tag: 'Fish', cal: 300,
    ingredients: 'Sardines (in water) · sweet potato · black pepper',
    steps: 'Boil and mash the sweet potato. Flake sardines on top, crack black pepper. Done in minutes.' },
  // ── Chicken ──
  { emoji: '🍗', name: 'Boiled Chicken & Sweet Potato', tag: 'Chicken', cal: 360,
    ingredients: 'Chicken breast · sweet potato · tomato',
    steps: 'Boil the chicken breast 15–18 min. Boil or steam the sweet potato. Slice tomato on the side. No oil.' },
  { emoji: '🍗', name: 'Chicken & Bell Pepper Bowl', tag: 'Chicken', cal: 280,
    ingredients: 'Chicken breast · bell pepper · tomato · lemon',
    steps: 'Steam or dry-pan the chicken. Add sliced bell pepper and tomato, squeeze lemon. No oil, no sauce.' },
  { emoji: '🍗', name: 'Chicken & Berry Bowl', tag: 'Chicken', cal: 300,
    ingredients: 'Shredded chicken breast · mixed berries · cucumber',
    steps: 'Boil and shred the chicken. Toss with berries and cucumber. Fresh and light.' },
  { emoji: '🍗', name: 'Chicken & Pineapple Plate', tag: 'Chicken', cal: 320,
    ingredients: 'Chicken breast · fresh pineapple',
    steps: 'Cook chicken in a dry non-stick pan until done. Serve with fresh pineapple slices. No oil.' },
  // ── Egg whites ──
  { emoji: '🥚', name: 'Egg Whites & Sweet Potato', tag: 'Egg whites', cal: 230,
    ingredients: '3 egg whites · sweet potato · tomato',
    steps: 'Boil or poach the egg whites. Boil the sweet potato. Slice tomato on the side. No oil.' },
  { emoji: '🥚', name: 'Egg White Veggie Scramble', tag: 'Egg whites', cal: 150,
    ingredients: '3 egg whites · bell pepper · tomato',
    steps: 'Scramble the egg whites in a non-stick pan (no oil) with chopped bell pepper and tomato.' },
  { emoji: '🥚', name: 'Egg Whites & Avocado', tag: 'Egg whites', cal: 220,
    ingredients: '3 egg whites · ¼ avocado · tomato',
    steps: 'Boil or poach the egg whites. Add ¼ sliced avocado and tomato. A little good fat.' },
  // ── Greek yogurt ──
  { emoji: '🥣', name: 'Greek Yogurt & Berry Bowl', tag: 'Greek yogurt', cal: 250,
    ingredients: 'Plain Greek yogurt · mixed berries · chia seeds',
    steps: 'Top the yogurt with berries and a spoon of chia seeds. No sugar. No cooking.' },
  { emoji: '🥣', name: 'Greek Yogurt, Banana & Chia', tag: 'Greek yogurt', cal: 280,
    ingredients: 'Plain Greek yogurt · banana · chia seeds',
    steps: 'Slice banana over the yogurt, sprinkle chia seeds. Let sit 5 min so the chia softens.' },
  { emoji: '🥣', name: 'Greek Yogurt & Kiwi Bowl', tag: 'Greek yogurt', cal: 230,
    ingredients: 'Plain Greek yogurt · kiwi · berries',
    steps: 'Top the yogurt with sliced kiwi and berries. Fresh, high-fibre, no sugar.' },
  // ── Fruit / fibre ──
  { emoji: '🥤', name: '3-Fruit Smoothie', tag: 'Fruit', cal: 220,
    ingredients: 'Banana · berries · papaya · water',
    steps: 'Blend the fruit with water (no milk, no sugar). Drink fresh.' },
  { emoji: '🥗', name: 'Fruit Salad Bowl', tag: 'Fruit', cal: 200,
    ingredients: 'Apple · kiwi · dragon fruit · chia seeds',
    steps: 'Chop the fruit, toss with chia seeds. Squeeze lime if you like. No cooking.' },
  { emoji: '🍓', name: 'Papaya & Chia Bowl', tag: 'Fruit', cal: 180,
    ingredients: 'Papaya · chia seeds · lime',
    steps: 'Scoop papaya, top with chia seeds and a squeeze of lime. Gentle on the gut.' },
  { emoji: '🍍', name: 'Pineapple & Berry Chia', tag: 'Fruit', cal: 190,
    ingredients: 'Pineapple · mixed berries · chia seeds',
    steps: 'Chop pineapple, add berries and chia seeds. Fresh and fibre-rich.' },
  { emoji: '🍠', name: 'Sweet Potato & Egg', tag: 'Egg whites', cal: 280,
    ingredients: 'Sweet potato · 1–2 eggs',
    steps: 'Boil or steam the sweet potato. Boil the egg 7–10 min. No oil, no butter.' },
];

const OMAD_MEALS = {
  label: '🍽️ OMAD — one meal at 5 PM · water, tea & psyllium husk during the day',
  rows: [
    { time: 'Daytime — Fasting window', ingredients: [
      { name: 'Psyllium husk (in water)', key: null },
      { name: 'Water, lemon water, or tea', key: null },
    ]},
    { time: '5:00 PM — Your one meal (OMAD)', ingredients: [
      { name: 'Choose a protein', key: null, pick: 'protein', slot: 'dinner' },
      { name: 'Choose veggies', key: null, pick: 'veggie', slot: 'dinner' },
      { name: 'Choose a fruit', key: null, pick: 'fruit', slot: 'dinner' },
    ]},
  ],
};

const GLUTE_MEALS = {
  label: '🍑 Glute day — eat whenever you like, just stop eating by 5 PM',
  rows: [
    { time: 'Anytime — Eat freely (until 5 PM)', ingredients: [
      { name: 'Psyllium husk (in water)', key: null },
      { name: 'Choose a fruit', key: null, pick: 'fruit', slot: 'morning' },
      { name: 'Choose a protein', key: null, pick: 'protein', slot: 'morning' },
      { name: 'Choose veggies', key: null, pick: 'veggie', slot: 'morning' },
    ]},
    { time: '5:00 PM — Kitchen closed', ingredients: [
      { name: 'Stop eating for the day', key: null },
    ]},
  ],
};

export const WORKOUT_DAYS = [
  // MONDAY — Glute A (KEEP existing exercises + notes verbatim)
  {
    emoji: '🍑', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute A', title: 'Glutes — Compound Power',
    sub: '3 main lifts + stretch & jump rope · ~70 min total',
    noteBefore: { type: 'rose', text: '🍑 Heaviest glute day. Go heavy, slow, and full range on all three lifts. Eat whenever you like today — just stop by 5 PM.' },
    exercises: [
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → hip circles × 10 each · wake glutes before loading' },
      { name: 'Barbell Hip Thrust', detail: '4 × 10–12 reps · shoulders on bench, drive hips to parallel, pause 2 sec, lower for 3 sec · main glute builder' },
      { name: 'Romanian Deadlift (RDL)', detail: '4 × 10–12 reps · soft knees, hinge, lower 3 sec to hamstring stretch, drive hips forward · load the full glute stretch' },
      { name: 'Bulgarian Split Squat', detail: '3 × 10 reps each leg · rear foot on bench, torso 10–15° forward, lower front thigh to parallel · build even glutes' },
      { name: 'Glute Bridge Burnout', detail: '2 × 25 reps (finisher) · feet flat, drive hips up, squeeze hard · bodyweight only, fast controlled reps' },
      COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track hip thrust weight every Monday. Add 1–2 kg when all 4 sets feel controlled. Fuel up freely today, stop eating by 5 PM.' },
    meals: GLUTE_MEALS,
  },
  // TUESDAY — Pilates
  {
    emoji: '🪷', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Pilates', title: 'Pilates — Deep Core & Posture',
    sub: 'Stretch + vacuum + your choice of video + jump rope · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Pilates day. Stretch first, do the vacuum, pick ONE video (core, full body, or a handstand/elbow-stand drill), then finish with 10–20 min of jump rope.' },
    exercises: [ WARMUP, VACUUM, ...IZZY_ABS, ...NICOLE_FULLBODY, ...THUY_MAI_WORKOUTS, ...HANDSTAND_INTERMEDIATE, COOLDOWN ],
    noteAfter: { type: 'rose', text: '💡 OMAD: one meal at 5 PM. Water, tea, and psyllium husk during the day. Stop eating by 5 PM.' },
    meals: OMAD_MEALS,
  },
  // WEDNESDAY — Pilates
  {
    emoji: '🌿', emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Wednesday · Pilates', title: 'Pilates — Full Body & Lats',
    sub: 'Stretch + vacuum + your choice of video + jump rope · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Pilates day. Stretch first, do the vacuum, pick ONE video, then finish with 10–20 min of jump rope.' },
    exercises: [ WARMUP, VACUUM, ...IZZY_ABS, ...NICOLE_FULLBODY, ...THUY_MAI_WORKOUTS, ...HANDSTAND_INTERMEDIATE, COOLDOWN ],
    noteAfter: { type: 'rose', text: '💡 OMAD: one meal at 5 PM. Water, tea, and psyllium husk during the day. Stop eating by 5 PM.' },
    meals: OMAD_MEALS,
  },
  // THURSDAY — Glute B (KEEP existing exercises + notes verbatim)
  {
    emoji: '🔥', emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Thursday · Glute B', title: 'Glutes — Shape & Round',
    sub: '3 main lifts + stretch & jump rope · ~65 min total',
    noteBefore: { type: 'rose', text: '🔥 Second glute day. Hit lower glutes, upper glutes, and outer shape. Eat whenever you like — just stop by 5 PM.' },
    exercises: [
      WARMUP,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · wake gluteus medius' },
      { name: 'Sumo Squat', detail: '4 × 12–15 reps · wide stance, toes 45°, sit deep below parallel, pause 1 sec · build lower glute and inner thigh' },
      { name: 'Cable Kickback', detail: '3 × 15 reps each leg · hinge forward, drive heel back and up, hold 2 sec, lower slow · isolate upper glute' },
      { name: 'Hip Abduction (band or machine)', detail: '3 × 20 reps · push knees apart, hold 2 sec at widest point · build round outer glutes' },
      { name: 'Single-Leg Glute Bridge', detail: '2 × 15 reps each leg (finisher) · drive hips through working heel and squeeze · bodyweight, controlled' },
      COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track cable kickback and sumo squat weights each Thursday. Add resistance when reps feel easy. Fuel up freely today, stop eating by 5 PM.' },
    meals: GLUTE_MEALS,
  },
  // FRIDAY — Pilates
  {
    emoji: '✨', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Friday · Pilates', title: 'Pilates — Core & Alignment',
    sub: 'Stretch + vacuum + your choice of video + jump rope · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Pilates day. Stretch first, do the vacuum, pick ONE video, then finish with 10–20 min of jump rope.' },
    exercises: [ WARMUP, VACUUM, ...IZZY_ABS, ...NICOLE_FULLBODY, ...THUY_MAI_WORKOUTS, ...HANDSTAND_INTERMEDIATE, COOLDOWN ],
    noteAfter: { type: 'rose', text: '💡 OMAD: one meal at 5 PM. Water, tea, and psyllium husk during the day. Stop eating by 5 PM.' },
    meals: OMAD_MEALS,
  },
  // SATURDAY — Pilates
  {
    emoji: '🌷', emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Saturday · Pilates', title: 'Pilates — Full Body Flow',
    sub: 'Stretch + vacuum + your choice of video + jump rope · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Pilates day. Stretch first, do the vacuum, pick ONE video, then finish with 10–20 min of jump rope.' },
    exercises: [ WARMUP, VACUUM, ...IZZY_ABS, ...NICOLE_FULLBODY, ...THUY_MAI_WORKOUTS, ...HANDSTAND_INTERMEDIATE, COOLDOWN ],
    noteAfter: { type: 'rose', text: '💡 OMAD: one meal at 5 PM. Water, tea, and psyllium husk during the day. Stop eating by 5 PM.' },
    meals: OMAD_MEALS,
  },
  // SUNDAY — Pilates
  {
    emoji: '🌸', emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Sunday · Pilates', title: 'Pilates — Balance & Inversions',
    sub: 'Stretch + vacuum + your choice of video + jump rope · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Pilates day. Stretch first, do the vacuum, then work a handstand or elbow-stand drill. Finish with 10–20 min of jump rope.' },
    exercises: [ WARMUP, VACUUM, ...IZZY_ABS, ...NICOLE_FULLBODY, ...THUY_MAI_WORKOUTS, ...HANDSTAND_INTERMEDIATE, COOLDOWN ],
    noteAfter: { type: 'rose', text: '💡 OMAD: one meal at 5 PM. Water, tea, and psyllium husk during the day. Stop eating by 5 PM.' },
    meals: OMAD_MEALS,
  },
];
