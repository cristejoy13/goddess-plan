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
      label: '🍽️ Meat Day Meals — 7 AM · 11 AM · 2 PM · 4 PM',
      rows: [
        { time: '7:00 AM — Meal 1 (before workout)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'green tea', key: null },
        ]},
        { time: '11:00 AM — Meal 2 (post-workout)', ingredients: [
          { name: 'chicken 150g', key: 'chicken' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'banana nice cream', key: 'banana-nice-cream' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'salad', key: 'salad' },
        ]},
      ],
    },
  },
  {
    emoji: '🧘',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Tuesday · Pilates 1',
    title: 'Deep Core & TVA',
    sub: 'Hundred · Roll-Up · Leg Series · Spine Work',
    exercises: [
      { name: 'The Hundred', detail: '3 sets · deep belly pull-in on every exhale, arms pumping steadily' },
      { name: 'Single Leg Stretch', detail: '3 × 10 each leg · switch with control, navel pulled to spine the entire time' },
      { name: 'Roll-Up', detail: '3 × 8 · peel up one vertebra at a time, resist on the way back down' },
      { name: 'Side Leg Series', detail: '3 × 12 each side · up/down, circles, front and back kicks' },
      { name: 'Teaser Prep', detail: '3 × 8 · build toward the full teaser over weeks' },
      { name: 'Swan Dive Prep', detail: '3 × 8 · upper back extension, glutes engaged throughout' },
      { name: 'TVA Breathing', detail: '5 min · exhale fully, pull belly to spine, hold 5 sec, release' },
    ],
    noteAfter: { type: 'gold', text: '💡 Pilates the day after strength training lengthens the muscles you just loaded, reduces soreness, and keeps the TVA active. The TVA is the corset muscle that creates a flat stomach at rest over time.' },
    meals: {
      label: '🍽️ Light Day Meals — 8 AM · 12 PM · 2 PM · 4 PM',
      rows: [
        { time: '8:00 AM — Meal 1', ingredients: [
          { name: 'chia pudding', key: 'chia' },
          { name: 'papaya', key: null },
          { name: 'green tea', key: null },
        ]},
        { time: '12:00 PM — Meal 2', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: 'salad', key: 'salad' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'chia mango pudding', key: 'chia-mango-pudding' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: '½ avocado', key: 'avocado' },
          { name: 'cucumber', key: null },
          { name: 'chamomile tea', key: null },
        ]},
      ],
    },
  },
  {
    emoji: '⚡',
    emojiBg: 'rgba(253,245,208,0.6)',
    day: 'Wednesday · Sprint Day',
    title: 'Sprints or Cycling Intervals',
    sub: 'Pick one · Both give the same hormonal benefit',
    noteBefore: { type: 'rose', text: '⚡ Both options trigger a growth hormone surge, activate glutes, and boost metabolic rate for 24+ hours. Choose based on how you feel on the day.' },
    exercises: [
      { name: 'Option A — Outdoor Sprints', detail: 'Dynamic warm-up 10 min → Sprint 20–30 sec full effort, rest 90 sec × 6–8 rounds → Cool-down walk 10 min, glute & hamstring stretch' },
      { name: 'Option B — Indoor Cycling Intervals', detail: 'Easy warm-up 5 min → High resistance sprint 20–30 sec, easy pedal 90 sec × 6–8 rounds → Cool-down easy ride 5 min, stretch hips and glutes' },
    ],
    noteAfter: { type: 'gold', text: '📋 Start with 6 rounds. Build to 10 rounds over weeks. Consistency matters more than which option you pick.' },
    meals: {
      label: '🍽️ Meat Day Meals — 7 AM · 11 AM · 2 PM · 4 PM',
      rows: [
        { time: '7:00 AM — Meal 1 (45–60 min before)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'ginger-lemon-beet juice', key: null },
        ]},
        { time: '11:00 AM — Meal 2 (post-sprint)', ingredients: [
          { name: 'fish 150g', key: 'fish' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'cacao banana bites', key: 'cacao-banana-bites' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: 'chicken 100g', key: 'chicken' },
          { name: 'malunggay', key: null },
          { name: 'squash', key: null },
          { name: 'ginger broth', key: null },
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
      label: '🍽️ Meat Day Meals — 7 AM · 11 AM · 2 PM · 4 PM',
      rows: [
        { time: '7:00 AM — Meal 1 (before workout)', ingredients: [
          { name: '½ banana', key: 'banana' },
          { name: '1 egg', key: 'egg' },
          { name: 'green tea', key: null },
        ]},
        { time: '11:00 AM — Meal 2 (post-workout)', ingredients: [
          { name: 'beef 120g', key: 'beef' },
          { name: 'broccoli', key: 'broccoli' },
          { name: 'sweet potato (½ cup)', key: 'sweet potato' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'sweet potato brownie bites', key: 'sweet-potato-brownie' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: 'fish 120g', key: 'fish' },
          { name: 'salad', key: 'salad' },
        ]},
      ],
    },
  },
  {
    emoji: '🌿',
    emojiBg: 'rgba(253,245,208,0.5)',
    day: 'Friday · Pilates 2',
    title: 'Flow, Spine & Side Body',
    sub: 'Crisscross · Side Kicks · Swimming · Mermaid',
    exercises: [
      { name: 'Spine Stretch Forward', detail: 'Warm-up, 5 reps · breathe out and reach through fully' },
      { name: 'Leg Circles', detail: '3 × 10 each direction · keep hips perfectly still, only the leg moves' },
      { name: 'Crisscross', detail: '3 × 12 · slow rotation toward the bent knee, hold 1 sec — obliques, not momentum' },
      { name: 'Side Kick Series', detail: '3 × 12 each side · kick front with flexed foot, kick back with pointed toe' },
      { name: 'Swimming', detail: '3 × 10 · opposite arm and leg, flutter from back and glute, not from the neck' },
      { name: 'Mermaid Stretch', detail: '30 sec hold each side · breathe into the side body' },
      { name: 'Cat-Cow with TVA lock', detail: '5 min · fully hollow the belly on every exhale before arching' },
    ],
    noteAfter: { type: 'gold', text: '💡 Two pilates sessions per week flanking your sprint day keeps the core active and the body mobile. This is what prevents lower back tightness from building up over weeks of heavy training.' },
    meals: {
      label: '🍽️ Light Day Meals — 8 AM · 12 PM · 2 PM · 4 PM',
      rows: [
        { time: '8:00 AM — Meal 1', ingredients: [
          { name: 'oats', key: 'oats' },
          { name: '½ banana', key: 'banana' },
          { name: 'chia seeds', key: null },
          { name: 'kiwi', key: null },
          { name: 'green tea', key: null },
        ]},
        { time: '12:00 PM — Meal 2', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: 'salad', key: 'salad' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'coconut chia balls', key: 'coconut-chia-balls' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: '½ avocado', key: 'avocado' },
          { name: 'chamomile tea', key: null },
        ]},
      ],
    },
  },
  {
    emoji: '🌸',
    emojiBg: 'rgba(252,228,239,0.4)',
    day: 'Saturday · Rest Day',
    title: 'Rest or Active Recovery',
    sub: 'Listen to your body · Choose what feels restorative',
    noteBefore: { type: 'gold', text: '🌸 After five days of training your body needs to repair. Recovery is where the results are built — this is not a wasted day. Choose movement that feels restorative, not taxing.' },
    exercises: [
      { name: 'Option A — Walk', detail: '30–45 min gentle walk outdoors. Gets lymphatic drainage moving without loading muscles. Morning sunlight before 9 AM supports your circadian rhythm and Vitamin D.' },
      { name: 'Option B — Yoga or Gentle Stretching', detail: '20–30 min flexibility flow targeting hip flexors and glutes. Prevents tightness that limits your range of motion in training next week.' },
      { name: 'Option C — Swimming', detail: 'Easy swimming laps at low intensity. Full body decompression, especially good for the spine. Zero impact on joints.' },
      { name: 'Option D — Foam Rolling', detail: '10–15 min full body: quads, glutes, IT band, upper back. Reduces DOMS and keeps fascia mobile going into next week.' },
      { name: 'Complete Rest (if fatigued)', detail: 'If your body asks for it, take it. Any lingering soreness or low energy means today is a full rest day — sleep in, walk gently, honor what you need.' },
    ],
    noteAfter: { type: 'rose', text: '🌸 Never train hard on poor sleep or high fatigue. A rested body trains harder next week than a broken one trains today.' },
    meals: {
      label: '🍽️ Light Day Meals — 8 AM · 12 PM · 2 PM · 4 PM',
      rows: [
        { time: '8:00 AM — Meal 1', ingredients: [
          { name: 'chia pudding', key: 'chia' },
          { name: 'kiwi', key: null },
          { name: 'green tea', key: null },
        ]},
        { time: '12:00 PM — Meal 2', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: 'salad', key: 'salad' },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'avocado chocolate mousse', key: 'avocado-choc-mousse' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: '½ avocado', key: 'avocado' },
          { name: 'chamomile tea', key: null },
        ]},
      ],
    },
  },
  {
    emoji: '✨',
    emojiBg: 'rgba(253,245,208,0.4)',
    day: 'Sunday · Rest Day',
    title: 'Rest & Prepare',
    sub: 'Full rest or gentle movement · Reset for the week ahead',
    noteBefore: { type: 'gold', text: '✨ Sunday is your reset day. Use this time to prepare your food, oils, and mindset. A prepared week trains better and eats better than an unprepared one.' },
    exercises: [
      { name: 'Option A — Walk', detail: '20–30 min slow, enjoyable walk. Not a workout — digestion support and gentle circulation. Enjoy it without a pace target.' },
      { name: 'Option B — Gentle Stretching', detail: '15–20 min stretch focusing on hips, glutes, and hamstrings — the muscles most worked this week.' },
      { name: 'Option C — Swimming', detail: 'Easy, leisurely swimming. Focus on breathing and relaxation rather than pace or distance.' },
      { name: 'Complete Rest', detail: 'Full rest is valid and important. Use the time to batch-cook proteins for Monday–Wednesday, boil eggs for the week, and set up your rosemary oil blend.' },
    ],
    noteAfter: { type: 'rose', text: '💡 Sunday prep: batch-cook chicken or fish, boil a week\'s worth of eggs, make your camellia + rosemary oil blend, and lay out Monday\'s workout clothes. Small habits compound into extraordinary results.' },
    meals: {
      label: '🍽️ Light Day Meals — 8 AM · 12 PM · 2 PM · 4 PM',
      rows: [
        { time: '8:00 AM — Meal 1', ingredients: [
          { name: 'oats', key: 'oats' },
          { name: '½ banana', key: 'banana' },
          { name: 'cinnamon', key: null },
          { name: 'green tea', key: null },
        ]},
        { time: '12:00 PM — Meal 2', ingredients: [
          { name: 'chia pudding', key: 'chia' },
          { name: 'papaya', key: null },
          { name: 'kiwi', key: null },
          { name: 'collagen water', key: null },
        ]},
        { time: '2:00 PM — Sweet Snack', ingredients: [
          { name: 'banana oat cookies', key: 'banana-oat-cookies' },
        ]},
        { time: '4:00 PM — Last Meal', ingredients: [
          { name: '1 egg', key: 'egg' },
          { name: '½ avocado', key: 'avocado' },
          { name: 'cucumber', key: null },
          { name: 'chamomile tea', key: null },
        ]},
      ],
    },
  },
];
