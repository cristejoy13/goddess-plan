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
const sprintDetail = `${sp.reps} reps · ${sp.sprint}s all-out sprint → ${sp.rest}s complete rest · push every interval like it's your last — this protocol rebuilds every month, so if it feels easy, it was supposed to feel hard last month · track which rep your form breaks first`;
const sprintSub = `${sp.reps} reps · ${sp.sprint}s on / ${sp.rest}s off · ${sp.month} Protocol · ~${Math.round((sp.sprint + sp.rest) * sp.reps / 60 + 10 + 30)} min total`;

export const WORKOUT_DAYS = [
  // ─── MONDAY: Glute A — Compound Power ──────────────────────────────────────
  {
    emoji: '🍑',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Glute A',
    title: 'Glutes — Compound Power',
    sub: '3 exercises + warm-up & cool-down · ~70 min total',
    noteBefore: { type: 'rose', text: '🍑 Your heaviest glute session. These three compound movements hit every part of the glute — maximum load, slow tempo, full range every rep. Growth hormone peaks after heavy hip thrusts and RDLs — this is where your glutes actually grow. Warm up with jump rope to prime your heart rate and activate your posterior chain before loading.' },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · start slow for the first 2 min, build pace to moderate intensity · elevates heart rate, warms up calves, hamstrings, glutes, and improves coordination · do not skip — cold muscles under load is how injuries happen' },
      { name: 'Barbell Hip Thrust', detail: '4 × 10–12 reps · shoulders on bench, bar across hips, drive upward until body is fully parallel to the floor · pause 2 sec at the top with a hard glute squeeze · lower 3 sec slow · the highest glute activation exercise that exists — this is your money move' },
      { name: 'Romanian Deadlift (RDL)', detail: '4 × 10–12 reps · hinge at the hips, lower the bar 3 sec with soft knees until deep hamstring stretch, drive hips forward to stand · keep the bar close to your legs the whole way · loads the glute through full stretch — the most powerful stimulus for glute depth and size' },
      { name: 'Bulgarian Split Squat', detail: '3 × 10 reps each leg · rear foot elevated on bench, lean torso 10–15° forward, lower until front thigh is parallel · each glute works fully on its own with no compensation from the other side · best single-leg exercise for glute mass and balance' },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min at a fast walking pace — faster than your normal walk but not jogging · this is active recovery, not a stroll · drops cortisol from the lifting session, improves blood flow to worked muscles, and counts toward your weekly cardio total' },
    ],
    noteAfter: { type: 'gold', text: '📋 Track your hip thrust weight every Monday. Add 1–2 kg when all 4 sets feel fully controlled. Progressive overload is the only mechanism that drives long-term glute growth — the weight must go up over time.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 12 PM · Sunset',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: 'Protein Pancakes', key: null },
          { name: 'Berries', key: null },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: '2 Eggs', key: 'egg' },
          { name: 'Avocado', key: 'avocado' },
          { name: 'lemon water', key: null },
        ]},
      ],
    },
  },

  // ─── TUESDAY: Back & Core A ─────────────────────────────────────────────────
  {
    emoji: '💪',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Back & Core A',
    title: 'Back & Core — Strength A',
    sub: '6 exercises + warm-up & cool-down · ~75 min total',
    noteBefore: { type: 'gold', text: '💪 Back training the day after heavy glutes gives the glutes a full 48-hour recovery window while still training hard. A strong back improves posture, makes your waist look smaller by comparison, and protects the spine that supports every other lift. Core A focuses on upper abs and hip flexors.' },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · moderate pace, focus on rhythm · warms up the lats, traps, and shoulders before pulling work · your back muscles need blood flow before they can fire properly' },
      { name: 'Pull-Ups (or Lat Pulldown)', detail: '3 × 8–10 reps · if no pull-up bar, use lat pulldown cable with full range · pull elbows down and back toward your hips, pause 1 sec at top · the widest-back exercise — directly builds the V-taper silhouette · go slow on the way up if assisted, make gravity work for you on the way down' },
      { name: 'Bent-Over Barbell Row', detail: '3 × 10–12 reps · hinge forward 45–60°, pull bar to lower chest, squeeze shoulder blades at the top for 1 sec · builds mid-back thickness — the muscle behind your shoulder blades that creates definition' },
      { name: 'Face Pulls', detail: '3 × 15 reps · cable at face height, pull rope toward your face with elbows flared, external-rotate at the top · directly targets rear delts and rotator cuff — fixes forward shoulder posture and prevents the rounded-shoulder look' },
      { name: 'Dead Bug', detail: '3 × 10 reps each side · lie on back, arms and legs up, slowly lower opposite arm and leg toward the floor while pressing lower back flat · the single best deep core exercise — teaches the TVA to brace without holding your breath · move slowly and controlled the entire set' },
      { name: 'Bicycle Crunch', detail: '3 × 20 reps · bring elbow to opposite knee, fully extend the other leg, rotate through the core not the neck · best oblique exercise for waist definition — do not rush, slow rotation maximizes the oblique contraction' },
      { name: 'Hanging Leg Raise (or Lying Leg Raise)', detail: '3 × 15 reps · hang from bar and raise legs to 90° with controlled motion, or lie flat and lift legs · lower abs and hip flexors — the hardest part of the abs to train and most visible when lean · keep the movement slow on the way down' },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min at fast walking pace · active recovery after pulling work · your lats and upper back will thank you for the gentle movement instead of sitting down immediately' },
    ],
    noteAfter: { type: 'rose', text: '💡 Protein day — fuel your back recovery. Muscles repair between sessions, not during them. Sleep and protein tonight directly determine how much strength you add before Thursday.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 12 PM · Sunset',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: 'Greek Yogurt', key: null },
          { name: 'Peanut Butter', key: null },
          { name: 'Granola', key: null },
          { name: 'Fruits', key: null },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'Tuna', key: null },
          { name: 'Cucumber', key: null },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'Mixed Veggies', key: 'broccoli' },
          { name: 'Egg', key: 'egg' },
          { name: 'Olive oil drizzle', key: null },
        ]},
      ],
    },
  },

  // ─── WEDNESDAY: Glute B — Shape & Drive ────────────────────────────────────
  {
    emoji: '🔥',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Glute B',
    title: 'Glutes — Shape & Drive',
    sub: '3 exercises + warm-up & cool-down · ~70 min total',
    noteBefore: { type: 'rose', text: '🔥 Your second glute session — completely different angles from Monday. Sumo squats target the lower glute and inner thigh, cable kickbacks isolate the upper glute with a peak contraction no barbell can match, and step-ups force each glute to drive your full body weight through one leg. The round shape comes from training every angle.' },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · moderate to brisk pace · activate glutes and legs before the session · by the end of the jump rope your glutes should feel slightly engaged and your heart rate elevated to Zone 2' },
      { name: 'Sumo Squat', detail: '4 × 12–15 reps · wide stance, toes pointed out 45°, sit below parallel and pause 1 sec at the bottom · the wide stance moves load from the quad to the glute and inner thigh — builds the lower glute curve and inner leg thickness that creates the hourglass from behind' },
      { name: 'Cable Kickback', detail: '3 × 15 reps each leg · ankle cuff on cable, hinge slightly forward, drive your heel back and up until full hip extension, hold 2 sec at top, lower with control · the only exercise that fully isolates the upper glute at peak contraction — the burn at the top is where the growth happens · go heavy enough that the last 3 reps are genuinely hard' },
      { name: 'Step-Up with Knee Drive', detail: '3 × 12 reps each leg · step onto a box or bench, drive the trailing knee up to hip height at the top, lower with control · a unilateral glute and quad driver — forces your glute to control both the ascent and descent through full range · do all reps on one side before switching' },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min at fast walking pace · active recovery — the brisk walk elongates the muscles you just loaded and sends blood flow to speed repair · do not sit down directly after lifting' },
    ],
    noteAfter: { type: 'gold', text: '📋 Track your cable kickback weight each Wednesday. This exercise responds well to progressive overload — add resistance when the 15 reps feel controlled and the squeeze at the top is consistent.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 12 PM · Sunset',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: 'Overnight Oats', key: null },
          { name: 'Berries', key: null },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: '1 Egg', key: 'egg' },
          { name: 'Avocado', key: 'avocado' },
          { name: 'lemon water', key: null },
        ]},
      ],
    },
  },

  // ─── THURSDAY: Back & Core B ─────────────────────────────────────────────────
  {
    emoji: '🧘',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Back & Core B',
    title: 'Back & Core — Strength B',
    sub: '6 exercises + warm-up & cool-down · ~75 min total',
    noteBefore: { type: 'gold', text: '🧘 Wednesday glutes → Thursday back is a perfect split — completely different muscle groups, full recovery for the glutes. Core B shifts to planks, rotation, and anti-extension work. These are the exercises that build the deep corset around your spine and create definition in the obliques and lower abs.' },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · build from easy to moderate · gets blood into the lats and mid-back before pulling work · your back muscles are cold from yesterday\'s lower body focus — give them a full warm-up' },
      { name: 'Seated Cable Row', detail: '3 × 10–12 reps · sit tall, pull handle to your lower chest, squeeze shoulder blades for 2 sec, return slowly · builds mid-back and lower trap thickness — the muscles that pull your shoulders back and give the strong, defined upper back look' },
      { name: 'Single-Arm Dumbbell Row', detail: '3 × 12 reps each side · brace one hand and same-side knee on a bench, pull the dumbbell from a dead hang to your hip with your elbow close to your body · greater range of motion than a barbell — trains each side independently and fixes any strength imbalance' },
      { name: 'Reverse Fly (Dumbbell or Cable)', detail: '3 × 15 reps · slight forward hinge, arms raise out to the sides until parallel, squeeze at the top 1 sec · targets rear deltoid and rhomboids — directly improves posture and builds the back-shoulder definition that shows in photos' },
      { name: 'Plank Hold', detail: '3 × 45–60 sec · forearms on floor, body in a straight line from head to heel, breathe steadily · trains the entire anterior core under sustained tension — the baseline exercise for midline stability · if 60 sec feels easy, elevate your feet or add a plate on your back' },
      { name: 'Russian Twist', detail: '3 × 20 reps · sit at 45°, feet lifted, rotate a weight from hip to hip with full trunk rotation · obliques and transverse abs — the exercises that build the diagonal muscle lines at the side of the core · go heavier over time, not faster' },
      { name: 'Ab Wheel Rollout (or Cable Crunch)', detail: '3 × 10 reps · from knees, roll the wheel forward until your body is nearly parallel, pull back using your abs not your back · the most challenging ab exercise — loads the full anterior core through a long range of motion · if this is too hard, do cable crunches at the same rep count' },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min brisk walk · decompresses the spine after seated cable work and planks · by the end of this walk your soreness should be less than when you started' },
    ],
    noteAfter: { type: 'rose', text: '💡 Protein day — Thursday night sleep and protein are critical. Tomorrow is lighter training (glute isolation), so tonight is when your body consolidates this week\'s back and core gains.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 12 PM · Sunset',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: 'Protein Pancakes', key: null },
          { name: 'Berries', key: null },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'Tuna', key: null },
          { name: 'Cucumber', key: null },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'Mixed Veggies', key: 'broccoli' },
          { name: 'Egg', key: 'egg' },
          { name: 'Olive oil drizzle', key: null },
        ]},
      ],
    },
  },

  // ─── FRIDAY: Glute Isolation & Conditioning ─────────────────────────────────
  {
    emoji: '✨',
    emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Friday · Glute Isolation',
    title: 'Glutes — Isolation & Conditioning',
    sub: '3 exercises + warm-up & cool-down · ~55 min total',
    noteBefore: { type: 'rose', text: '✨ This is your lighter glute day — no heavy barbells. Isolation exercises create the specific, targeted burn that compounds alone cannot produce. These movements finish the glutes after a full week of compound work and improve the mind-muscle connection for better activation on Monday and Wednesday. Feel every rep.' },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · easy to moderate pace · lighter than your heavy days — just enough to elevate heart rate and get blood to the glutes before isolation work' },
      { name: 'Donkey Kicks', detail: '3 × 20 reps each leg · on all fours, drive one heel up toward the ceiling with knee bent 90°, pause 2 sec at the top with a hard squeeze, lower with control · pure upper glute isolation — the peak contraction at the top is the point, not the range of motion · do not let your hips rotate as you kick' },
      { name: 'Hip Abduction — Cable or Band', detail: '3 × 20 reps each leg · cable at ankle height (or resistance band), stand and sweep leg directly out to the side with toes forward · targets the gluteus medius — the muscle responsible for the round outer shape of the glute · the burn should be in the side, not the hip joint' },
      { name: 'Single-Leg Glute Bridge', detail: '3 × 15 reps each leg · lie on back, one foot flat on floor, other leg extended · drive hips up through the working heel until fully extended, pause 2 sec, lower slowly · isolates one glute at a time with no barbell needed — excellent for fixing left-right imbalance and finishing the week with a deep burn' },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min brisk walk · Friday walk sets you up perfectly — you enter the weekend with elevated metabolism and glute muscles primed for the sprint session tomorrow' },
    ],
    noteAfter: { type: 'gold', text: '📋 Light day tonight — first meal at 12pm only. Let your digestive system rest heading into Saturday sprint. Hydrate well this evening for tomorrow\'s performance.' },
    meals: {
      label: '🍽️ Light Day — Eat 12 PM · Sunset',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'Mixed Veggies', key: 'broccoli' },
          { name: 'Egg', key: 'egg' },
          { name: 'Olive oil drizzle', key: null },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'papaya', key: 'papaya' },
          { name: 'kiwi', key: 'kiwi' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
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
    noteBefore: { type: 'rose', text: `⚡ ${sp.month} Sprint Protocol: ${sp.sprint}s on / ${sp.rest}s off × ${sp.reps} reps. This protocol automatically increases every month — harder sprints, shorter rest, more reps. The progression is designed so what feels hard now becomes your new baseline. Every month you level up. Sprint on a track, flat road, or treadmill.` },
    exercises: [
      { name: 'Jump Rope Warm-Up', detail: '10–20 min · start easy, finish at moderate pace · for sprint days, make the last 2 min slightly faster to pre-activate your fast-twitch fibers · do not skip — cold sprints are where hamstring tears happen' },
      { name: 'Dynamic Warm-Up', detail: '5 min · leg swings × 10 each direction · hip circles × 10 each · high knees × 20 · butt kicks × 20 · 2 build-up strides at 70% effort · prepares the nervous system for maximum-effort sprinting after the jump rope' },
      { name: `Sprint Intervals — ${sp.reps} Reps (${sp.month} Protocol)`, detail: sprintDetail },
      { name: '30-Min Brisk Walk Cool-Down', detail: '30 min at fast walking pace · do not sit down immediately after sprinting — walking keeps the blood moving and clears the lactate from your legs much faster · this walk is non-negotiable for sprint days' },
    ],
    noteAfter: { type: 'gold', text: `📋 ${sp.month} Protocol: ${sp.sprint}s sprint / ${sp.rest}s rest × ${sp.reps} reps. Track your split times and how each interval feels. Next month the numbers get harder — that's the point. Recovery tonight: protein, hydration, 8+ hours sleep.` },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 12 PM · Sunset',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: 'Greek Yogurt', key: null },
          { name: 'Peanut Butter', key: null },
          { name: 'Granola', key: null },
          { name: 'Fruits', key: null },
        ]},
        { time: '12:00 PM — Meal 2 (post-sprint)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: '1 Egg', key: 'egg' },
          { name: 'Avocado', key: 'avocado' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
      ],
    },
  },

  // ─── SUNDAY: Active Recovery ─────────────────────────────────────────────────
  {
    emoji: '🌸',
    emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Sunday · Recovery',
    title: 'Active Recovery — Walk & Stretch',
    sub: 'Light walking + full-body stretch · ~60 min total',
    noteBefore: { type: 'gold', text: '🌸 Sunday is where the week\'s gains are locked in. Your muscles don\'t grow during workouts — they grow during recovery. Light walking keeps blood circulating to repair tissue without adding stress. The stretches target exactly what you trained this week: glutes, hip flexors, hamstrings, back, and shoulders.' },
    exercises: [
      { name: 'Light Walk — 30–45 min', detail: 'Easy conversational pace — slower than your cool-down walks · you should be able to hold a full conversation without any effort · morning or evening, outside is best · this counts as active recovery, not exercise · enjoy it' },
      { name: 'Hip Flexor Stretch', detail: '2 × 45 sec each side · low lunge position, back knee on ground, shift hips forward · tight hip flexors pull the pelvis forward and limit glute activation — this stretch undoes the damage from sitting and heavy lifting · hold steady, breathe into the stretch' },
      { name: 'Glute Stretch — Figure Four', detail: '2 × 45 sec each side · lie on back, cross one ankle over the opposite knee, pull the bottom leg toward your chest · directly stretches the piriformis and deep glute — reduces soreness from hip thrusts and split squats · your glutes will be sore today; this stretch is the antidote' },
      { name: 'Hamstring Stretch', detail: '2 × 45 sec each side · lie on back, pull one leg toward you with straight knee · RDLs and step-ups load the hamstrings heavily — stretching them today prevents tightness from limiting your Monday hip thrust depth' },
      { name: 'Cat-Cow + Thoracic Rotation', detail: '2 × 10 full cycles · on hands and knees, arch full spinal extension then full flexion slowly · then drop one hand and rotate elbow toward the ceiling · decompresses the spine after a full week of loaded back work · your spine needs this' },
      { name: 'Shoulder & Lat Stretch', detail: '2 × 30 sec each arm · arm across chest for rear delt, arm overhead reaching to the opposite side for lat · the lat pulldowns and rows shorten the lats — stretching them prevents the rounded-shoulder posture from compounding over weeks' },
      { name: "World's Greatest Stretch", detail: '2 × 5 each side · lunge forward, plant same-side hand, rotate upper body toward the sky · hits hips, thoracic spine, hamstrings, and adductors in one flow · the single highest-value full-body stretch to end your recovery session' },
    ],
    noteAfter: { type: 'rose', text: '🌿 Sunday prep: batch-cook protein for Mon–Thu (chicken, eggs, tuna). Set out your jump rope where you\'ll see it Monday morning. A prepared week trains better, eats better, and recovers better. Week starts tomorrow — you\'re ready.' },
    meals: {
      label: '🍽️ Light Day — Eat 12 PM · Sunset',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'Mixed Veggies', key: 'broccoli' },
          { name: 'Egg', key: 'egg' },
          { name: 'Olive oil drizzle', key: null },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'apple', key: 'apple' },
          { name: 'Berries', key: null },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
];
