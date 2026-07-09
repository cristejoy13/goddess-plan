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

// Build the dynamic sprint exercise detail at load time
const sp = getCurrentSprintProtocol();
const sprintDetail = `${sp.reps} reps · ${sp.sprint}s all-out sprint → ${sp.rest}s complete rest · push every interval · protocol updates monthly · track where form breaks`;
const sprintSub = `${sp.reps} reps · ${sp.sprint}s on / ${sp.rest}s off · ${sp.month} Protocol · ~${Math.round((sp.sprint + sp.rest) * sp.reps / 60 + 15 + 30)} min total`;

// Shared warm-up & cool-down (used on every training day)
const JUMP_ROPE = { name: 'Jump Rope Warm-Up', detail: '10–15 min · start slow, then steady · raise heart rate, wake legs and core · stay light on the balls of your feet' };
const WALK_COOLDOWN = { name: '30-Min Brisk Walk Cool-Down', detail: '30 min fast walking pace — quicker than a stroll, not a jog · burn fat, lower cortisol · walk 10–15 min after meals' };

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

const YOGA_BEGINNER = [
  { name: 'Yoga — Complete Beginners (20 min)', detail: 'Yoga With Adriene · gentle intro, build the basics', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
  { name: 'Yoga — Beginners: The Basics',       detail: 'Yoga With Adriene · foundational poses & alignment', url: 'https://www.youtube.com/watch?v=pWobp3phsEU' },
  { name: 'Yoga — Flexible Mind & Body',        detail: 'Yoga With Adriene · flexibility flow toward inversions', url: 'https://www.youtube.com/watch?v=xFEAOzWLx8Y' },
];

const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale fully, pull belly button in and up, breathe shallow · do this FIRST before your video' };

export const WORKOUT_DAYS = [
  // ─── MONDAY: Glute A — Compound Power ──────────────────────────────────────
  {
    emoji: '🍑',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute A',
    title: 'Glutes — Compound Power',
    sub: '3 main lifts + warm-up & walk · ~70 min total',
    noteBefore: { type: 'rose', text: '🍑 Heaviest glute day. Go heavy, slow, and full range on all three lifts. Eat protein at 3 PM for growth.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → hip circles × 10 each · wake glutes before loading' },
      { name: 'Barbell Hip Thrust', detail: '4 × 10–12 reps · shoulders on bench, drive hips to parallel, pause 2 sec, lower for 3 sec · main glute builder' },
      { name: 'Romanian Deadlift (RDL)', detail: '4 × 10–12 reps · soft knees, hinge, lower 3 sec to hamstring stretch, drive hips forward · load the full glute stretch' },
      { name: 'Bulgarian Split Squat', detail: '3 × 10 reps each leg · rear foot on bench, torso 10–15° forward, lower front thigh to parallel · build even glutes' },
      { name: 'Glute Bridge Burnout', detail: '2 × 25 reps (finisher) · feet flat, drive hips up, squeeze hard · bodyweight only, fast controlled reps' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track hip thrust weight every Monday. Add 1–2 kg when all 4 sets feel controlled. Protein at 3 PM.' },
    meals: {
      label: '🍑 Glute Fuel — ~1,500 kcal · Fruits 12PM · Protein 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Papaya Bowl', key: null },
          { name: 'Pineapple Bowl', key: null },
          { name: 'Banana (2)', key: null },
          { name: 'Chia Seeds (2 tbsp)', key: null },
          { name: 'lemon water', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-workout)', ingredients: [
          { name: 'Fish 200g', key: null },
          { name: 'Brown Rice 1 cup', key: null },
          { name: 'Sweet Potato 250g', key: null },
          { name: 'Steamed Broccoli 2 cups', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Berries (1 cup)', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },

  // ─── TUESDAY: Core & Back A — Posture Foundation ───────────────────────────
  {
    emoji: '🪷',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Core & Back A',
    title: 'Deep Core & Back — Posture',
    sub: 'Warm-up + vacuum + your choice of video + walk · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Jump rope, do the vacuum FIRST, pick ONE video, then finish with a fast walk.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day: ~1,200 calories. Fruits at 12 and 3, vegetables at 5, slow eating, 80% full.' },
    meals: {
      label: '🍓 Core Fuel — ~1,200 kcal · Fruits 12PM · Fruits 3PM · Veg 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Papaya Bowl', key: null },
          { name: 'Kiwi (2)', key: null },
          { name: 'Oats (1/2 cup)', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Banana (2)', key: null },
          { name: 'Apple', key: 'apple' },
          { name: 'Almonds (30g)', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Veg · no meat)', ingredients: [
          { name: 'Sweet Potato 250g', key: null },
          { name: 'Steamed Broccoli 2 cups', key: null },
          { name: 'Steamed Spinach 2 cups', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },

  // ─── WEDNESDAY: Core & Back B — Deep Core & Lats ───────────────────────────
  {
    emoji: '🌿',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Wednesday · Core & Back B',
    title: 'Deep Core & Back — Lats',
    sub: 'Warm-up + vacuum + your choice of video + walk · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Jump rope, do the vacuum FIRST, pick ONE video, then finish with a fast walk.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day: ~1,200 calories. Fruits earlier, no-meat vegetables at 5 PM, and enough carbs/fats to stay full.' },
    meals: {
      label: '🍓 Core Fuel — ~1,200 kcal · Fruits 12PM · Fruits 3PM · Veg 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Pineapple Bowl', key: null },
          { name: 'Apple', key: 'apple' },
          { name: 'Oats (1/2 cup)', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Mango Bowl', key: null },
          { name: 'Berries (1 cup)', key: null },
          { name: 'Walnuts (30g)', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Veg · no meat)', ingredients: [
          { name: 'Squash 2 cups', key: null },
          { name: 'Eggplant 2 cups', key: null },
          { name: 'Steamed Spinach 2 cups', key: null },
          { name: 'Avocado (1/2)', key: null },
          { name: 'Cucumber', key: null },
          { name: 'green tea', key: null },
        ]},
      ],
    },
  },

  // ─── THURSDAY: Glute B — Shape & Round ─────────────────────────────────────
  {
    emoji: '🔥',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Thursday · Glute B',
    title: 'Glutes — Shape & Round',
    sub: '3 main lifts + warm-up & walk · ~65 min total',
    noteBefore: { type: 'rose', text: '🔥 Second glute day. Hit lower glutes, upper glutes, and outer shape. Eat protein at 3 PM.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · wake gluteus medius' },
      { name: 'Sumo Squat', detail: '4 × 12–15 reps · wide stance, toes 45°, sit deep below parallel, pause 1 sec · build lower glute and inner thigh' },
      { name: 'Cable Kickback', detail: '3 × 15 reps each leg · hinge forward, drive heel back and up, hold 2 sec, lower slow · isolate upper glute' },
      { name: 'Hip Abduction (band or machine)', detail: '3 × 20 reps · push knees apart, hold 2 sec at widest point · build round outer glutes' },
      { name: 'Single-Leg Glute Bridge', detail: '2 × 15 reps each leg (finisher) · drive hips through working heel and squeeze · bodyweight, controlled' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track cable kickback and sumo squat weights each Thursday. Add resistance when reps feel easy. Protein at 3 PM.' },
    meals: {
      label: '🍑 Glute Fuel — ~1,500 kcal · Fruits 12PM · Protein 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Kiwi (2)', key: null },
          { name: 'Dragon Fruit', key: null },
          { name: 'Banana (2)', key: null },
          { name: 'Chia Seeds (2 tbsp)', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-workout)', ingredients: [
          { name: 'Eggs (3, boiled)', key: null },
          { name: 'Tofu 200g', key: null },
          { name: 'Quinoa 1 cup', key: null },
          { name: 'Steamed Broccoli 2 cups', key: null },
          { name: 'Carrots 2 cups', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Berries (1 cup)', key: null },
          { name: 'Avocado (1/2)', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },

  // ─── FRIDAY: Core & Back C — Stability & Alignment ─────────────────────────
  {
    emoji: '✨',
    emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Friday · Core & Back C',
    title: 'Deep Core & Back — Alignment',
    sub: 'Warm-up + vacuum + your choice of video + walk · ~60 min',
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Jump rope, do the vacuum FIRST, pick ONE video, then finish with a fast walk.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day. Hydrate for sprints tomorrow. Stay near 1,200 calories, walk after meals, and sleep well.' },
    meals: {
      label: '🍓 Core Fuel — ~1,200 kcal · Fruits 12PM · Fruits 3PM · Veg 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Dragon Fruit', key: null },
          { name: 'Grapes (1 cup)', key: null },
          { name: 'Oats (1/2 cup)', key: null },
          { name: 'Chia Seeds (2 tbsp)', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Apple', key: 'apple' },
          { name: 'Papaya Bowl', key: null },
          { name: 'Almonds (30g)', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Veg · no meat)', ingredients: [
          { name: 'Cucumber', key: null },
          { name: 'Carrots 2 cups', key: null },
          { name: 'Sweet Potato 250g', key: null },
          { name: 'Steamed Spinach 2 cups', key: null },
          { name: 'green tea', key: null },
        ]},
      ],
    },
  },

  // ─── SATURDAY: Sprint ───────────────────────────────────────────────────────
  {
    emoji: '⚡',
    emojiBg: 'rgba(252,228,239,0.6)',
    day: 'Saturday · Sprint',
    title: 'Sprint — Progressive Intervals',
    sub: sprintSub,
    sprintDay: true,
    noteBefore: { type: 'rose', text: `⚡ ${sp.month} Sprint Protocol: ${sp.sprint}s on / ${sp.rest}s off × ${sp.reps} reps. It levels up monthly. Sprint on track, road, or treadmill.` },
    exercises: [
      JUMP_ROPE,
      { name: 'Dynamic Warm-Up', detail: '5 min · leg swings × 10 each · hip circles × 10 each · high knees × 20 · butt kicks × 20 · 2 build-up strides at 70%' },
      { name: `Sprint Intervals — ${sp.reps} Reps (${sp.month} Protocol)`, detail: sprintDetail },
      { name: 'Fuel Note', detail: 'Sprint days get protein at 3 PM for recovery — your legs and glutes rebuild from today\'s effort · fruits at 12 to fuel the sprint, protein after, light at 5' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: `📋 ${sp.month} Protocol: ${sp.sprint}s sprint / ${sp.rest}s rest × ${sp.reps} reps. Log times and effort. Recover with protein, water, and 8+ hours sleep.` },
    meals: {
      label: '⚡ Sprint Fuel — ~1,500 kcal · Fruits 12PM · Meat 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Banana (2)', key: null },
          { name: 'Grapes (1 cup)', key: null },
          { name: 'Oats (1/2 cup)', key: null },
          { name: 'Coconut Water', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-sprint)', ingredients: [
          { name: 'Chicken 180g', key: null },
          { name: 'Brown Rice 1 cup', key: null },
          { name: 'Sweet Potato 250g', key: null },
          { name: 'Steamed Broccoli 2 cups', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Papaya Bowl', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },

  // ─── SUNDAY: Rest — Walk & Stretch ─────────────────────────────────────────
  {
    emoji: '🌸',
    emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Sunday · Rest',
    title: 'Rest — Light Walk & Stretch',
    sub: 'Walk · Swim · Yoga · Stretch — your choice · ~45 min',
    noteBefore: { type: 'gold', text: '🌸 Rest and restore: walk, swim, beginner yoga, or stretch. Build wrist, shoulder, and core strength for handstands.' },
    exercises: [
      { name: 'Choose your movement', detail: 'Pick a walk, swim, yoga video, or full stretch. Keep it light and restorative.' },
      { name: 'Light Walk — 30–45 min', detail: 'easy conversational pace, outside if possible · support muscle repair' },
      { name: 'Swim — optional, 20–30 min', detail: 'easy laps if you have pool access · low-impact full-body recovery' },
      ...YOGA_BEGINNER,
      { name: 'Full-Body Stretch — 15 min', detail: 'figure-four glute stretch, hip flexor, hamstring, cat-cow, chest opener, world\'s greatest stretch · hold 45 sec each' },
    ],
    noteAfter: { type: 'rose', text: '🌿 Sunday prep: batch-cook chicken and fish, portion fruit, and set your jump rope by the door.' },
    meals: {
      label: '🍓 Light Day — ~1,200 kcal · Fruits 12PM · Fruits 3PM · Veg 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Pineapple Bowl', key: null },
          { name: 'Kiwi (2)', key: null },
          { name: 'Watermelon Bowl', key: null },
          { name: 'Oats (1/2 cup)', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Banana (2)', key: null },
          { name: 'Apple', key: 'apple' },
          { name: 'Walnuts (30g)', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Veg · no meat)', ingredients: [
          { name: 'Steamed Spinach 2 cups', key: null },
          { name: 'Carrots 2 cups', key: null },
          { name: 'Squash 2 cups', key: null },
          { name: 'Cucumber', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },
];
