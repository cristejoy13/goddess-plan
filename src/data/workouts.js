export const WORKOUT_DAYS = [
  // ─── MONDAY: Norwegian 4x4 Sprint ───────────────────────────────────────
  {
    emoji: '🏃',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Sprint',
    title: 'Norwegian 4x4',
    sub: 'Run or Bike · Your choice · ~65 min total',
    noteBefore: { type: 'rose', text: '🏃 Pick run or bike based on how you feel today — the protocol is identical either way. Norwegian 4x4 triggers a bigger growth hormone surge than any other cardio format. Dynamic warm-up is non-negotiable.' },
    exercises: [
      { name: 'Dynamic Warm-Up', detail: '10 min · leg swings × 10 each, hip circles × 10 each, high knees × 20, butt kicks × 20, arm circles × 10 each · raise heart rate gradually to Zone 2 before the first interval' },
      { name: 'Norwegian 4x4 Intervals — 4 Rounds (28 min)', detail: '4 rounds · each round: 4 min at ~90% max effort (sprint or high-resistance bike) → 3 min Zone 2 active recovery (light jog or easy pedal, not rest) · every 4-min block should feel like you cannot hold a full sentence · the 3-min recovery window is not a break — stay moving at easy conversational pace' },
      { name: 'Zone 2 Cool-Down', detail: '20–30 min easy walk or light pedal at fully conversational pace · heart rate 120–140 BPM · this counts toward your 150 min/week Zone 2 target · finish with 5 min standing stretch' },
      { name: 'Stretch — Post Sprint', detail: '5 min · glute stretch 30 sec each side → hamstring stretch 30 sec each side → hip flexor stretch 30 sec each side · do not skip — cooling down without stretching increases injury risk' },
    ],
    noteAfter: { type: 'gold', text: '📋 Track: what you chose (run or bike), how the 4th interval felt, and your pace/resistance. Progress = each 4-min block feeling slightly more manageable over weeks. The adaptation is real.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 2 PM · 5 PM',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: '1–2 eggs', key: 'egg' },
          { name: '½ banana', key: 'banana' },
          { name: 'green tea or ginger tea', key: 'green-tea' },
        ]},
        { time: '2:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'fish 150g or chicken 150g', key: 'fish' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'chicken or fish 100g', key: 'chicken' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },

  // ─── TUESDAY: Pilates 1 ─────────────────────────────────────────────────
  {
    emoji: '🧘',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Pilates 1',
    title: 'Core & TVA',
    sub: '4 exercises + Zone 2 walk · ~80 min total',
    noteBefore: { type: 'gold', text: '🧘 Pilates the day after sprints lengthens the muscles you just loaded, reduces soreness, and reactivates the deep core. The TVA (transversus abdominis) is the corset muscle that creates a flat, toned stomach at rest — it is only trained with Pilates breathing and controlled movement.' },
    exercises: [
      { name: 'The Hundred', detail: '3 sets · arms pumping steadily, deep belly pull-in on every exhale · activates TVA from the very first rep · keep chin to chest and lower back pressed to the mat' },
      { name: 'Single Leg Stretch', detail: '3 × 10 each leg · switch legs with control, navel pulled to spine the entire time · trains hip flexors and obliques simultaneously without straining the lower back' },
      { name: 'Roll-Up', detail: '3 × 8 · peel up one vertebra at a time from lying flat, reach toward toes, resist on the way back down · decompresses the spine and works the full abdominal wall through its full range' },
      { name: 'Criss-Cross (Bicycle)', detail: '3 × 10 each side · rotate elbow to opposite knee, extend the other leg long · the best oblique exercise in Pilates — builds the waist-defining muscles' },
      { name: 'Zone 2 Walk', detail: '30 min after Pilates · easy walking pace, fully conversational · this is your Zone 2 contribution today · listen to music, podcast, or just walk in the sun' },
    ],
    noteAfter: { type: 'rose', text: '💡 Light day — keep food light. First meal at 12pm. Focus on the quality of your Pilates breathing — exhale fully on every effort, feel the belly button draw in.' },
    meals: {
      label: '🍽️ Light Day — Eat 2 PM · 5 PM',
      rows: [
        { time: '2:00 PM — First Meal', ingredients: [
          { name: 'pineapple or papaya', key: 'pineapple' },
          { name: 'apple', key: 'apple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'fish 100g or eggs', key: 'fish' },
          { name: 'steamed vegetables', key: 'broccoli' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },

  // ─── WEDNESDAY: Strength A ───────────────────────────────────────────────
  {
    emoji: '🔥',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Wednesday · Strength A',
    title: 'Glutes — The Power Day',
    sub: '3 exercises + Zone 2 walk · ~65 min total',
    noteBefore: { type: 'rose', text: '🔥 Your heaviest session of the week. Maximum load, slow tempo, full range of motion every rep. Growth hormone peaks after heavy compound lifts — this is where your glutes actually grow.' },
    exercises: [
      { name: 'Warm-Up — Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → hip circles × 10 each · activates the glutes before asking them to carry heavy load' },
      { name: 'Barbell Hip Thrust', detail: '4 × 10 · shoulders on bench, drive hips fully up, pause 2 sec at top with hard squeeze, lower 3 sec · the highest glute activation exercise that exists — foundation of glute growth' },
      { name: 'Romanian Deadlift', detail: '4 × 10 · hinge at hips, lower bar 3 sec until deep hamstring stretch, drive hips forward to stand · loads the glute through full stretch — most powerful stimulus for glute size' },
      { name: 'Cable or Band Kickback', detail: '3 × 15 each side · drive heel back and up, hold 2 sec at top, lower with control · pure glute isolation — finishes with a deep burn' },
      { name: 'Zone 2 Cool-Down Walk', detail: '20 min easy walk after lifting · reduces cortisol from the training session, aids recovery, and contributes to your weekly Zone 2 target' },
    ],
    noteAfter: { type: 'gold', text: '📋 Track your hip thrust weight every Wednesday. Add 1–2 kg when all 4 sets feel manageable. Progressive overload is the only thing that drives long-term glute development.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 2 PM · 5 PM',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: '2 eggs', key: 'egg' },
          { name: '½ banana', key: 'banana' },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '2:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },

  // ─── THURSDAY: Pilates 2 ─────────────────────────────────────────────────
  {
    emoji: '🌿',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Thursday · Pilates 2',
    title: 'Spine & Side Body',
    sub: '4 exercises + Zone 2 walk · ~80 min total',
    noteBefore: { type: 'gold', text: '🌿 Pilates mid-week resets the spine after Wednesday\'s heavy load, keeps the core active, and prepares the body for Friday\'s sprint session. Side body work builds the obliques and serratus — the muscles that define waist shape.' },
    exercises: [
      { name: 'Leg Circles', detail: '3 × 10 each direction · keep hips absolutely still, only the leg moves · strengthens hip flexors and builds hip joint mobility for better squat mechanics' },
      { name: 'Side Kick Series', detail: '3 × 12 each side · kick forward with a flexed foot, kick back with a pointed toe · targets outer glutes and hip abductors — the muscles that create the side curve' },
      { name: 'Swimming', detail: '3 × 10 · opposite arm and leg, flutter from glutes and back, not from neck · works the full posterior chain — glutes, lower back, upper back — in one movement' },
      { name: 'Mermaid Stretch', detail: '2 × 30 sec each side · seated side bend reaching arm up and over · lengthens the lateral line, opens the intercostals, and reduces tightness that shortens the waist' },
      { name: 'Zone 2 Walk', detail: '30 min easy walk after Pilates · fully conversational pace · you should be able to say a full sentence without gasping · this is your Zone 2 session for today' },
    ],
    noteAfter: { type: 'rose', text: '💡 Light day — eat from 12pm only. Your body uses this day to consolidate the strength work from Wednesday. Keep food clean and light — this fasting window supports fat adaptation.' },
    meals: {
      label: '🍽️ Light Day — Eat 2 PM · 5 PM',
      rows: [
        { time: '2:00 PM — First Meal', ingredients: [
          { name: 'papaya or apple', key: 'papaya' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'watermelon or berries', key: 'watermelon' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },

  // ─── FRIDAY: Norwegian 4x4 Sprint ───────────────────────────────────────
  {
    emoji: '⚡',
    emojiBg: 'rgba(252,228,239,0.6)',
    day: 'Friday · Sprint',
    title: 'Norwegian 4x4',
    sub: 'Run or Bike · Your choice · ~65 min total',
    noteBefore: { type: 'rose', text: '⚡ Second sprint session of the week. You should feel stronger than Monday — your body adapted. Choose run or bike based on how you feel. This session earns you the full weekend recovery.' },
    exercises: [
      { name: 'Dynamic Warm-Up', detail: '10 min · leg swings, hip circles, high knees, butt kicks, arm circles · your body is slightly more adapted than Monday — warm-up should feel quicker and easier' },
      { name: 'Norwegian 4x4 Intervals — 4 Rounds (28 min)', detail: '4 rounds · 4 min at ~90% max effort (sprint or high-resistance bike) → 3 min Zone 2 active recovery · same protocol as Monday — compare how each round feels vs your first session · by Round 4 you should feel more adapted than you did on Monday' },
      { name: 'Zone 2 Cool-Down', detail: '20–30 min easy walk or light pedal · bring heart rate fully down before stopping · contributes to weekly Zone 2 total · you can walk home from the gym or park' },
      { name: 'Stretch — Post Sprint', detail: '5 min · glute, hamstring, and hip flexor stretches 30 sec each side · important after a second sprint day this week' },
    ],
    noteAfter: { type: 'gold', text: '📋 After both sprint sessions done for the week — 75+ min of sprint work completed. Note your energy level vs. Monday. Progress shows up here first. Recovery: hydrate, eat your protein, sleep 7.5–9 hrs tonight.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 2 PM · 5 PM',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: '1–2 eggs', key: 'egg' },
          { name: '½ banana', key: 'banana' },
          { name: 'ginger-lemon juice', key: 'ginger-juice' },
        ]},
        { time: '2:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'fish 150g', key: 'fish' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'chicken 100g', key: 'chicken' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },

  // ─── SATURDAY: Strength B ────────────────────────────────────────────────
  {
    emoji: '🍑',
    emojiBg: 'rgba(252,228,239,0.6)',
    day: 'Saturday · Strength B',
    title: 'Glutes — Shape & Medius',
    sub: '3 exercises + Zone 2 walk · ~65 min total',
    noteBefore: { type: 'rose', text: '🍑 The round, wide glute shape comes from the gluteus medius — the upper outer part of the glute. These exercises target it directly and are completely different from Wednesday. Saturday is a great day to train — no rush, no deadline, full focus.' },
    exercises: [
      { name: 'Warm-Up — Glute Activation', detail: '5 min · glute bridges × 15 → banded clamshells × 15 each → lateral band walks × 15 each · wake up the gluteus medius before loading it' },
      { name: 'Bulgarian Split Squat', detail: '4 × 10 each leg · rear foot on bench, lean torso slightly forward, lower until front thigh is parallel · best single-leg glute exercise — forces each glute to work fully on its own without compensation' },
      { name: 'Sumo Squat', detail: '4 × 12 · wide stance, toes out, sit deep below parallel, pause 1 sec at bottom · wide stance shifts load to glutes and inner thighs — builds the lower glute curve and inner thickness' },
      { name: 'Clamshell with Resistance Band', detail: '3 × 20 each side · band above knees, feet stacked, rotate top knee open, hold 2 sec · the only exercise that isolates gluteus medius completely — directly responsible for the round outer shape' },
      { name: 'Zone 2 Cool-Down Walk', detail: '20 min easy walk · lower cortisol, aid recovery, reach your weekly Zone 2 target · enjoy the Saturday pace — no rush today' },
    ],
    noteAfter: { type: 'gold', text: '📋 Sunday is your prep day — batch-cook protein for Mon–Wed, boil eggs, prep your rosemary oil blend. A prepared week trains better and eats better. Add dumbbells to Bulgarian split squats once bodyweight feels easy.' },
    meals: {
      label: '🍽️ Protein Day — Eat 9 AM · 2 PM · 5 PM',
      rows: [
        { time: '9:00 AM — Meal 1', ingredients: [
          { name: '2 eggs', key: 'egg' },
          { name: '½ banana', key: 'banana' },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '2:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'beef 120g or chicken 150g', key: 'beef' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },

  // ─── SUNDAY: Flexibility · Mobility · Balance ───────────────────────────
  {
    emoji: '🌸',
    emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Sunday · Mobility',
    title: 'Flexibility · Mobility · Balance',
    sub: 'Hips · Spine · Ankles · Hamstrings · Adductors · Shoulders · ~45 min',
    noteBefore: { type: 'gold', text: '🌸 This session does more for long-term performance than any workout you will ever do. Mobility is the foundation — without it, your squat gets shallower, your sprint gets stiffer, and small things start to ache. 45 minutes today prevents months of setbacks.' },
    exercises: [
      { name: 'Hip 90/90 — Hip Internal + External Rotation', detail: '2 min each side · sit with both legs at 90° on the floor, shift weight to press each position · eliminates hip tightness that limits squat depth and causes lower back pain · this is your most important hip drill' },
      { name: "World's Greatest Stretch", detail: '3 × 5 each side · lunge forward, plant same-side hand, rotate upper body toward the sky · hits hips, thoracic spine, hamstrings, and adductors simultaneously in one flowing movement — the highest-value mobility drill' },
      { name: 'Cat-Cow → Thoracic Rotation → Thread the Needle', detail: '3 × 10 full sequence · flow between full spinal flexion and extension, then reach one arm under your body to rotate the thoracic spine · decompresses vertebrae and restores shoulder and spine rotation lost from sitting' },
      { name: 'Adductor Rock-Back + Butterfly Hold', detail: '3 × 10 rock-backs + 60 sec butterfly hold · kneeling on all fours, extend one leg to the side and rock your hips back into the inner thigh stretch, then sit in butterfly with soles together · adductor tightness limits hip width and glute activation' },
      { name: 'Wall Ankle Stretch + Ankle Circles', detail: '3 × 30 sec wall stretch each side + 10 controlled circles each · place toes against the wall, bend knee toward the wall as far as possible · ankle dorsiflexion is the most underrated mobility target — it directly controls squat depth and sprint mechanics' },
      { name: 'Shoulder CARs + Wall Slides', detail: '3 × 10 full shoulder circles (controlled articular rotations, very slow) + 3 × 10 wall slides · arms slide up the wall with elbows bent, spine flat against the wall · restores full shoulder overhead range and fixes the forward-head posture' },
      { name: 'Single Leg Balance + Forward Reaches', detail: '3 × 30 sec balance each side + 5 slow forward reaches each · stand on one leg, reach the other leg forward, hold balance · ankle, hip, and core stability drill — the balance foundation for sprinting and split squats' },
    ],
    noteAfter: { type: 'rose', text: '🌿 Meal prep Sunday: batch-cook your protein (chicken, fish, eggs) for Mon–Wed. Set up your rosemary oil blend for the week. A 30-min prep session eliminates every bad food decision before it happens. Week starts tomorrow — you are ready.' },
    meals: {
      label: '🍽️ Light Day — Eat 2 PM · 5 PM',
      rows: [
        { time: '2:00 PM — First Meal', ingredients: [
          { name: 'papaya', key: 'papaya' },
          { name: 'pineapple', key: 'pineapple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: 'Sunset — Last Meal', ingredients: [
          { name: 'apple or berries', key: 'apple' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
];
