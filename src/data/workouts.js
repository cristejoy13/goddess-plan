export const WORKOUT_DAYS = [
  {
    emoji: '🔥',
    emojiBg: 'rgba(252,228,239,0.5)',
    day: 'Monday · Strength A',
    title: 'The Power Day',
    sub: '3 exercises · Heavy load · Maximum glute activation',
    noteBefore: { type: 'rose', text: '🔥 Your heaviest session of the week. Maximum load, slow tempo, full range of motion every rep.' },
    exercises: [
      { name: 'Barbell Hip Thrust', detail: '4 × 10 · shoulders on bench, drive hips fully up, pause 2 sec at top with a hard squeeze, lower slowly · Why: highest glute activation of any exercise — the foundation of glute growth' },
      { name: 'Romanian Deadlift', detail: '4 × 10 · hinge at hips, lower 3 sec until deep hamstring stretch, drive hips forward to stand · Why: loads the glute through a full lengthened stretch — the most powerful stimulus for muscle size' },
      { name: 'Cable or Band Kickback', detail: '3 × 15 each side · drive heel back and up, hold 2 sec at top · Why: pure glute isolation with no other muscle helping — finishes with a deep burn' },
    ],
    noteAfter: { type: 'gold', text: '📋 Track your hip thrust weight every Monday. Add 1–2 kg when all sets feel manageable.' },
    meals: {
      label: '🍽️ Protein Day — Eat after waking · Last meal 3:00 PM',
      rows: [
        { time: 'Meal 1 — After waking (by 8:00 AM)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },
  {
    emoji: '🧘',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Pilates 1',
    title: 'Deep Core & TVA',
    sub: '3 exercises · Core activation · Spine work',
    noteAfter: { type: 'gold', text: '💡 Pilates the day after strength training lengthens the muscles you just loaded, reduces soreness, and keeps the TVA active. The TVA is the corset muscle that creates a flat stomach at rest over time.' },
    exercises: [
      { name: 'The Hundred', detail: '3 sets · deep belly pull-in on every exhale, arms pumping steadily · activates TVA and core stability from the first rep' },
      { name: 'Single Leg Stretch', detail: '3 × 10 each leg · switch with control, navel pulled to spine the entire time · works hip flexors and obliques simultaneously' },
      { name: 'Roll-Up', detail: '3 × 8 · peel up one vertebra at a time, resist on the way back down · decompresses the spine and works the full abdominal wall' },
    ],
    meals: {
      label: '🍽️ Fruit & Salad Day — Fasting until noon · Last meal 3:00 PM',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'pineapple', key: 'pineapple' },
          { name: 'apple', key: 'apple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'watermelon or papaya', key: 'watermelon' },
          { name: 'berries (any)', key: 'berries' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
  {
    emoji: '⚡',
    emojiBg: 'rgba(253,245,208,0.6)',
    day: 'Wednesday · Sprint Day',
    title: 'Sprints or Cycling Intervals',
    sub: '3 steps · Pick Option A or B · Full hormonal surge',
    noteBefore: { type: 'rose', text: '⚡ Both options trigger a growth hormone surge, activate glutes, and boost metabolic rate for 24+ hours. Choose based on how you feel on the day.' },
    exercises: [
      { name: 'Dynamic Warm-Up', detail: '10 min · leg swings, hip circles, high knees, butt kicks · never skip — cold muscles sprint poorly and injure easily' },
      { name: 'Sprint Session — pick one', detail: 'Option A — Outdoor Sprints: Sprint 20–30 sec full effort, rest 90 sec × 6–8 rounds\nOption B — Indoor Cycling Intervals: High resistance 20–30 sec, easy pedal 90 sec × 6–8 rounds' },
      { name: 'Cool-Down & Stretch', detail: '10 min walk or easy pedal to bring heart rate down → glute stretch 30 sec each side → hamstring stretch 30 sec each side' },
    ],
    noteAfter: { type: 'gold', text: '📋 Start with 6 sprint rounds. Build to 10 rounds over weeks. Consistency matters more than which option you pick.' },
    meals: {
      label: '🍽️ Protein Day — Eat after waking · Last meal 3:00 PM',
      rows: [
        { time: 'Meal 1 — After waking (by 8:00 AM)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'ginger-lemon-beet juice', key: 'ginger-juice' },
        ]},
        { time: '12:00 PM — Meal 2 (post-sprint)', ingredients: [
          { name: 'fish 150g', key: 'fish' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'chicken 100g', key: 'chicken' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },
  {
    emoji: '🍑',
    emojiBg: 'rgba(252,228,239,0.6)',
    day: 'Thursday · Strength B',
    title: 'The Shape Day',
    sub: '3 exercises · Round outer curve · Side glute',
    noteBefore: { type: 'rose', text: '🍑 The round, wide glute shape comes from the gluteus medius — the upper outer part. These three exercises target it directly and are completely different from Monday.' },
    exercises: [
      { name: 'Bulgarian Split Squat', detail: '4 × 10 each leg · rear foot on bench, lean torso slightly forward, lower until front thigh is parallel · Why: best single-leg glute exercise — forces each glute to work fully on its own' },
      { name: 'Sumo Squat', detail: '4 × 12 · wide stance, toes out, sit deep below parallel, pause 1 sec at bottom · Why: wide stance shifts load to glutes and inner thighs — builds the lower curve and thickness' },
      { name: 'Clamshell with Resistance Band', detail: '3 × 20 each side · band above knees, feet stacked, rotate top knee open, hold 2 sec · Why: the only exercise that isolates the gluteus medius completely — directly responsible for the round outer shape' },
    ],
    noteAfter: { type: 'gold', text: '📋 Add dumbbells to the Bulgarian split squat once bodyweight feels easy. The clamshell needs 20 reps minimum to truly fatigue the gluteus medius — do not rush them.' },
    meals: {
      label: '🍽️ Protein Day — Eat after waking · Last meal 3:00 PM',
      rows: [
        { time: 'Meal 1 — After waking (by 8:00 AM)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'green tea', key: 'green-tea' },
        ]},
        { time: '12:00 PM — Meal 2 (post-workout)', ingredients: [
          { name: 'beef 120g', key: 'beef' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'Salad', key: 'salad' },
        ]},
      ],
    },
  },
  {
    emoji: '🌿',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Friday · Pilates 2',
    title: 'Flow, Spine & Side Body',
    sub: '3 exercises · Side body · Spine mobility',
    exercises: [
      { name: 'Leg Circles', detail: '3 × 10 each direction · keep hips perfectly still, only the leg moves · strengthens hip flexors while building hip joint mobility' },
      { name: 'Side Kick Series', detail: '3 × 12 each side · kick front with flexed foot, kick back with pointed toe · targets outer glutes and hip abductors' },
      { name: 'Swimming', detail: '3 × 10 · opposite arm and leg, flutter from back and glute, not from the neck · works the entire posterior chain in one movement' },
    ],
    noteAfter: { type: 'gold', text: '💡 Two pilates sessions per week flanking your sprint day keeps the core active and the body mobile. This is what prevents lower back tightness from building up over weeks of heavy training.' },
    meals: {
      label: '🍽️ Fruit & Salad Day — Fasting until noon · Last meal 3:00 PM',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'papaya', key: 'papaya' },
          { name: 'apple', key: 'apple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'pineapple or watermelon', key: 'pineapple' },
          { name: 'berries (any)', key: 'berries' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
  {
    emoji: '🚴',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Saturday · Bike',
    title: 'Cycling Session',
    sub: '3 steps · Steady pace · Glute endurance',
    noteBefore: { type: 'gold', text: '🚴 Cycling builds aerobic base, strengthens quads and glutes, and supports active recovery after your heavy training week. Maintain a steady pace — today is about endurance, not maximum intensity.' },
    exercises: [
      { name: 'Warm-Up Ride', detail: '10 min easy pace · low resistance · get the legs warm and breathing settled before increasing effort' },
      { name: 'Steady-State Ride', detail: '25–35 min · moderate resistance, maintain a pace where you can speak but feel the effort · builds cardiovascular base and glute endurance' },
      { name: 'Cool-Down + Stretch', detail: '5–10 min easy spin to lower heart rate → hip flexor stretch 30 sec each side → quad stretch 30 sec each side · cycling shortens the hip flexors if left unstretched' },
    ],
    noteAfter: { type: 'rose', text: '💡 Consistent cycling on Saturdays builds the aerobic engine that makes all your other workouts feel lighter and recovery faster.' },
    meals: {
      label: '🍽️ Fruit & Salad Day — Fasting until noon · Last meal 3:00 PM',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'pineapple', key: 'pineapple' },
          { name: 'apple or berries', key: 'apple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'watermelon or berries', key: 'watermelon' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
  {
    emoji: '💪',
    emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Sunday · Back',
    title: 'Back Strength & Posture',
    sub: '3 exercises · Upper + lower back · Posture foundation',
    noteBefore: { type: 'gold', text: '💪 A strong back is the foundation of beautiful posture and protects you from injury across all other workouts. These three movements build the full back chain — lower, mid, and upper.' },
    exercises: [
      { name: 'Superman Hold', detail: '4 × 12 · lie face down, lift arms and legs simultaneously, hold 3 sec at the top, lower slowly · builds erector spinae and lower back without any equipment' },
      { name: 'Resistance Band Row', detail: '4 × 15 · anchor band at chest height, pull elbows back squeezing shoulder blades together, hold 2 sec at peak · targets rhomboids and mid traps — the posture muscles' },
      { name: 'Cat-Cow to Thread the Needle', detail: '3 × 10 each side · alternate between spinal flexion/extension, then reach one arm under to stretch the thoracic spine · combines spinal mobility with posterior chain activation' },
    ],
    noteAfter: { type: 'rose', text: '💡 Sunday back work + Sunday prep: batch-cook chicken or fish for Mon–Wed, boil eggs for the week, and set up your rosemary oil blend. A prepared week trains better and eats better.' },
    meals: {
      label: '🍽️ Fruit & Salad Day — Fasting until noon · Last meal 3:00 PM',
      rows: [
        { time: '12:00 PM — First Meal', ingredients: [
          { name: 'papaya', key: 'papaya' },
          { name: 'pineapple', key: 'pineapple' },
          { name: 'Salad', key: 'salad' },
          { name: 'collagen water', key: 'collagen-water' },
        ]},
        { time: '3:00 PM — Last Meal', ingredients: [
          { name: 'apple or berries', key: 'apple' },
          { name: 'spearmint tea', key: 'spearmint-tea' },
        ]},
      ],
    },
  },
];
