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
const sprintDetail = `${sp.reps} reps · ${sp.sprint}s all-out sprint → ${sp.rest}s complete rest · push every interval like it's your last — this protocol rebuilds every month, so if it feels easy, it was meant to feel hard last month · track which rep your form breaks first`;
const sprintSub = `${sp.reps} reps · ${sp.sprint}s on / ${sp.rest}s off · ${sp.month} Protocol · ~${Math.round((sp.sprint + sp.rest) * sp.reps / 60 + 15 + 30)} min total`;

// Shared warm-up & cool-down (used on every training day)
const JUMP_ROPE = { name: 'Jump Rope Warm-Up', detail: '10–15 min · start slow, build to a steady rhythm · jump rope is a lean, toning warm-up — it raises your heart rate, wakes up the legs and core, and never bulks you up · light and springy on the balls of your feet' };
const WALK_COOLDOWN = { name: '30-Min Brisk Walk Cool-Down', detail: '30 min at a fast walking pace — quicker than a stroll, not a jog · this is where fat burns and cortisol drops · make it a habit to also walk 10–15 min after every meal to beat bloating and flatten the stomach' };

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
  { name: 'Abs (Thuý Mai) — Core Video Pick',       detail: 'Thuý Mai Thuý Mai · open her Facebook profile and choose an abs-focused workout clip', url: 'https://www.facebook.com/thuy.mai.thuy.mai.433987' },
  { name: 'Abs (Thuý Mai) — Waist Video Pick',      detail: 'Thuý Mai Thuý Mai · open her Facebook profile and choose a waist/deep-core workout clip', url: 'https://www.facebook.com/thuy.mai.thuy.mai.433987/videos' },
  { name: 'Full Body (Thuý Mai) — Sculpt Pick',     detail: 'Thuý Mai Thuý Mai · open her Facebook videos and choose a full-body sculpt workout', url: 'https://www.facebook.com/thuy.mai.thuy.mai.433987/videos' },
  { name: 'Full Body (Thuý Mai) — No-Equipment Pick', detail: 'Thuý Mai Thuý Mai · open her Facebook reels/videos and choose a no-equipment full-body session', url: 'https://www.facebook.com/thuy.mai.thuy.mai.433987/reels' },
];

const YOGA_BEGINNER = [
  { name: 'Yoga — Complete Beginners (20 min)', detail: 'Yoga With Adriene · gentle intro, build the basics', url: 'https://www.youtube.com/watch?v=v7AYKMP6rOE' },
  { name: 'Yoga — Beginners: The Basics',       detail: 'Yoga With Adriene · foundational poses & alignment', url: 'https://www.youtube.com/watch?v=pWobp3phsEU' },
  { name: 'Yoga — Flexible Mind & Body',        detail: 'Yoga With Adriene · flexibility flow toward inversions', url: 'https://www.youtube.com/watch?v=xFEAOzWLx8Y' },
];

const VACUUM = { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale ALL your air out, then pull your belly button in and up under your ribs, hold and breathe shallow · do this FIRST, before your video — it wakes up the deep TVA that flattens your stomach at rest' };

export const WORKOUT_DAYS = [
  // ─── MONDAY: Glute A — Compound Power ──────────────────────────────────────
  {
    emoji: '🍑',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute A',
    title: 'Glutes — Compound Power',
    sub: '3 main lifts + warm-up & walk · ~70 min total',
    noteBefore: { type: 'rose', text: '🍑 Your heaviest glute day. These three compound lifts hit every angle of the glute — go heavy, slow, and full range on every rep. This is where big, round glutes are actually built. Eat your protein soon after (3 PM) so your muscles have what they need to grow.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → hip circles × 10 each · wake the glutes up so they — not your lower back — do the work under load' },
      { name: 'Barbell Hip Thrust', detail: '4 × 10–12 reps · shoulders on a bench, drive hips fully up until your body is parallel to the floor, pause 2 sec at the top with a hard squeeze, lower for 3 sec · the single highest glute-activation exercise there is — this is your money move' },
      { name: 'Romanian Deadlift (RDL)', detail: '4 × 10–12 reps · soft knees, hinge at the hips, lower the bar 3 sec until you feel a deep hamstring stretch, then drive your hips forward to stand · loads the glute through its full stretch — the strongest stimulus for glute size and shape' },
      { name: 'Bulgarian Split Squat', detail: '3 × 10 reps each leg · rear foot on a bench, torso leaning 10–15° forward, lower until the front thigh is parallel · forces each glute to work alone with no help from the other side — builds even, round glutes and fixes imbalance' },
      { name: 'Glute Bridge Burnout', detail: '2 × 25 reps (finisher) · feet flat, drive hips up and squeeze hard at the top of every rep · pump extra blood into the glutes to finish the session · bodyweight only, fast controlled reps' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track your hip thrust weight every Monday — add 1–2 kg when all 4 sets feel controlled. Progressive overload is the ONLY thing that grows glutes long-term. Protein at 3 PM today is non-negotiable for growth.' },
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
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Warm up with the jump rope, do your stomach vacuum FIRST, then pick ONE video below based on how you feel — Pilates by Izzy, Move With Nicole, or Thuý Mai Thuý Mai from Facebook. Finish with your fast-paced walk. Light and toned, never bulky.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day — stay around 1,200 calories. Fruits at 12 and 3, then a filling no-meat vegetable meal at 5. Eat slow, stop at 80% full, and walk after every meal.' },
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
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Warm up with the jump rope, do your stomach vacuum FIRST, then pick ONE video below based on how you feel — Pilates by Izzy, Move With Nicole, or Thuý Mai Thuý Mai from Facebook. Finish with your fast-paced walk. Light and toned, never bulky.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day — stay around 1,200 calories. Fruits earlier, no-meat vegetables at 5 PM, and enough oats, nuts, avocado, or sweet potato to stay full. Walk after each meal.' },
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
    noteBefore: { type: 'rose', text: '🔥 Your second glute day — completely different angles from Monday. Sumo squats build the lower glute and inner thigh, cable kickbacks isolate the upper glute at peak squeeze, and hip abductions target the gluteus medius for that round outer shape. Protein again at 3 PM to feed the growth.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Glute Activation', detail: '5 min · glute bridges × 15 → lateral band walks × 15 each → clamshells × 15 each · fire up the gluteus medius before you load it' },
      { name: 'Sumo Squat', detail: '4 × 12–15 reps · wide stance, toes pointed out 45°, sit deep below parallel, pause 1 sec at the bottom · the wide stance shifts the load to the glutes and inner thighs — builds the lower curve and the hourglass shape from behind' },
      { name: 'Cable Kickback', detail: '3 × 15 reps each leg · ankle cuff on a cable, hinge slightly forward, drive the heel back and up to full hip extension, hold 2 sec at the top, lower slow · the only move that isolates the upper glute at peak contraction — that burn at the top is the growth' },
      { name: 'Hip Abduction (band or machine)', detail: '3 × 20 reps · band above the knees (or the machine), push the knees apart against resistance, hold 2 sec at the widest point · directly targets the gluteus medius — the muscle that creates the round, wide outer glute shape' },
      { name: 'Single-Leg Glute Bridge', detail: '2 × 15 reps each leg (finisher) · one foot flat, other leg extended, drive the hips up through the working heel and squeeze · isolates each glute to finish the week strong and even · bodyweight, controlled' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: '📋 Track your cable kickback and sumo squat weights each Thursday. Add resistance when reps feel easy and the squeeze stays sharp. Protein at 3 PM — your glutes grow on rest days, fed by today\'s protein.' },
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
    noteBefore: { type: 'gold', text: '🪷 Deep-core & back day. Warm up with the jump rope, do your stomach vacuum FIRST, then pick ONE video below based on how you feel — Pilates by Izzy, Move With Nicole, or Thuý Mai Thuý Mai from Facebook. Finish with your fast-paced walk. Light and toned, never bulky.' },
    exercises: [
      JUMP_ROPE,
      VACUUM,
      ...IZZY_ABS,
      ...NICOLE_FULLBODY,
      ...THUY_MAI_WORKOUTS,
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Core fuel day. Tomorrow is sprints — hydrate well tonight. Stay around 1,200 calories with fruits earlier and a filling no-meat vegetable meal at 5. Walk after each meal and sleep well.' },
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
    noteBefore: { type: 'rose', text: `⚡ ${sp.month} Sprint Protocol: ${sp.sprint}s on / ${sp.rest}s off × ${sp.reps} reps. This protocol automatically levels up every month — harder sprints, shorter rest, more reps — so what feels hard now becomes your baseline. Sprints torch fat and sculpt the glutes and legs without adding bulk. Track, road, or treadmill.` },
    exercises: [
      JUMP_ROPE,
      { name: 'Dynamic Warm-Up', detail: '5 min · leg swings × 10 each · hip circles × 10 each · high knees × 20 · butt kicks × 20 · 2 build-up strides at 70% · prime the nervous system for max-effort sprinting so you don\'t pull anything cold' },
      { name: `Sprint Intervals — ${sp.reps} Reps (${sp.month} Protocol)`, detail: sprintDetail },
      { name: 'Fuel Note', detail: 'Sprint days get protein at 3 PM for recovery — your legs and glutes rebuild from today\'s effort · fruits at 12 to fuel the sprint, protein after, light at 5' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'gold', text: `📋 ${sp.month} Protocol: ${sp.sprint}s sprint / ${sp.rest}s rest × ${sp.reps} reps. Log your times and how each rep felt — next month the numbers get harder on purpose. Recovery tonight: protein, water, and 8+ hours of sleep.` },
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
    noteBefore: { type: 'gold', text: '🌸 Rest & restore — walk, swim, do a beginner yoga video, or stretch. Building toward your handstand goal: yoga now grows the wrist, shoulder, and core strength — plus the light, controllable bodyweight — that inversions need later. Stay light, stay consistent.' },
    exercises: [
      { name: 'Choose your movement', detail: 'Sunday is flexible — pick whatever your body wants: a walk, a swim, a yoga video, or a full stretch. The only rule is keep it light and restorative.' },
      { name: 'Light Walk — 30–45 min', detail: 'easy conversational pace, outside if you can · active recovery that keeps blood flowing to repair muscle' },
      { name: 'Swim — optional, 20–30 min', detail: 'if you have pool access · easy laps are the perfect low-impact full-body recovery — gentle on the joints and great for circulation' },
      ...YOGA_BEGINNER,
      { name: 'Full-Body Stretch — 15 min', detail: 'figure-four glute stretch, hip flexor, hamstring, cat-cow, chest opener, world\'s greatest stretch · hold 45 sec each' },
    ],
    noteAfter: { type: 'rose', text: '🌿 Sunday prep: batch-cook your protein for the two glute days (chicken, fish), wash and portion your fruits, set your jump rope by the door. A prepared week eats clean and trains hard. Rest well — you earned it.' },
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
