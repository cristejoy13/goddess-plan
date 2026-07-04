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
      label: '🍑 Glute Fuel — Fruits 12PM · Protein 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Papaya', key: 'papaya' },
          { name: 'Pineapple', key: 'pineapple' },
          { name: 'lemon water', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-workout)', ingredients: [
          { name: 'Chicken 150g', key: 'chicken' },
          { name: 'Steamed Zucchini', key: null },
          { name: 'Steamed Carrots', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Berries', key: null },
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
    sub: '6 exercises + warm-up & walk · ~55 min total',
    noteBefore: { type: 'gold', text: '🪷 Deep-core + back day. We train the TVA (the deep corset muscle) for a flat stomach at REST — draw-in and hold work, never belly-bulging crunches. All back moves stay light-to-moderate with high reps: this sculpts a slim, toned "Korean" arm and a strong upright posture — it will NOT make you bulky.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale ALL your air out, then pull your belly button in and up toward your spine as hard as you can, hold, breathe shallow · THE exercise for a flat stomach at rest — it trains the deep TVA that acts like a natural corset · do this daily if you can' },
      { name: 'Dead Bug', detail: '3 × 10 reps each side · on your back, arms and knees up, slowly lower the opposite arm and leg while pressing your lower back flat to the floor · deep-core control with zero waist thickening — move slow, keep the spine glued down' },
      { name: 'Pilates Hundred', detail: '3 sets · legs at 45°, head and shoulders lifted, pump the arms as you breathe · draws the belly in and lights up the whole deep core · keep your lower back pressed down the entire time' },
      { name: 'Band Pull-Aparts (Posture)', detail: '3 × 20 reps · hold a light band at shoulder height, pull it apart until it touches your chest, squeeze the shoulder blades together · POSTURE FIX — opens the chest, pulls the shoulders back, undoes phone/laptop slump · light band, high reps, no bulk' },
      { name: 'Lat Pulldown (light–moderate)', detail: '3 × 12–15 reps · pull the bar to your upper chest, elbows down and back, control the way up · a wider back makes the waist look smaller by contrast · keep the weight light enough that reps 12–15 are clean — we tone, not bulk' },
      { name: 'Superman Hold', detail: '3 × 20 sec · lie face down, lift chest, arms and legs off the floor, squeeze the lower back and glutes · strengthens the whole back line that holds you upright · gentle, no weight' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Fruit day — stay 80% fruitarian today. Fruits at 12 & 3, light veg at 5. Remember: eat slow, stop at 80% full, and walk after every meal. That combination is what keeps the stomach flat and bloat-free.' },
    meals: {
      label: '🍓 Fruit Day — Fruits 12PM · Fruits 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Watermelon', key: 'watermelon' },
          { name: 'Berries', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Apple', key: 'apple' },
          { name: 'Banana', key: 'banana' },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Steamed Broccoli', key: 'broccoli' },
          { name: 'Steamed Spinach', key: null },
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
    sub: '6 exercises + warm-up & walk · ~55 min total',
    noteBefore: { type: 'gold', text: '🌿 Second deep-core + back day, new angles. Side planks build the obliques ISOMETRICALLY (holds, not weighted twists) — this cinches the waist WITHOUT thickening it. Face pulls are your posture medicine. Everything upper-body stays light and high-rep for lean, defined arms.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Hollow Body Hold', detail: '3 × 20–30 sec · on your back, press your lower back into the floor, lift shoulders and legs into a shallow banana shape · the gymnastics staple for a tight, flat deep core · lower the legs to make it easier, keep the back glued down' },
      { name: 'Bird Dog', detail: '3 × 10 reps each side · on all fours, extend the opposite arm and leg long, hold 2 sec, keep the hips level · trains deep-core stability AND spinal posture in one move · slow and controlled, no wobbling' },
      { name: 'Side Plank', detail: '3 × 20–30 sec each side · forearm down, body in a straight line, lift the hips high · isometric oblique work that defines and cinches the waist without the bulk that weighted twists create · drop the bottom knee if you need to' },
      { name: 'Face Pulls (Posture)', detail: '3 × 15–20 reps · cable/band at face height, pull toward your forehead with elbows high and wide, rotate the shoulders back · POSTURE FIX — the single best move for rounded shoulders and rear-shoulder definition · light weight, feel it in the upper back' },
      { name: 'Seated Cable Row (light–moderate)', detail: '3 × 12–15 reps · sit tall, pull to your lower ribs, squeeze the shoulder blades 1 sec, control the return · builds mid-back detail that improves posture and frames a smaller waist · keep it light-to-moderate, high reps' },
      { name: 'Reverse Fly (Posture)', detail: '3 × 15 reps · light dumbbells, hinge forward slightly, raise the arms out to the sides like wings, squeeze at the top · targets the rear delts and upper back — pulls the shoulders back for elegant posture · very light weight, slow tempo' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Fruit day. Keep it clean and light — no gluten, no oils, no dairy. Papaya and kiwi both carry natural digestive enzymes, so today\'s fruits actively fight bloating. Walk after each meal.' },
    meals: {
      label: '🍓 Fruit Day — Fruits 12PM · Fruits 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Papaya', key: 'papaya' },
          { name: 'Kiwi', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Mango', key: null },
          { name: 'Berries', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Steamed Zucchini', key: null },
          { name: 'Steamed Spinach', key: null },
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
      label: '🍑 Glute Fuel — Fruits 12PM · Protein 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Pineapple', key: 'pineapple' },
          { name: 'Papaya', key: 'papaya' },
          { name: 'lemon water', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-workout)', ingredients: [
          { name: 'Fish 150g', key: 'fish' },
          { name: 'Steamed Broccoli', key: 'broccoli' },
          { name: 'Steamed Carrots', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Berries', key: null },
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
    sub: '6 exercises + warm-up & walk · ~55 min total',
    noteBefore: { type: 'gold', text: '✨ Third deep-core + back day — stability and alignment. Another stomach vacuum (do them often — they flatten the belly at rest faster than anything). Wall angels reset your posture, and the single-arm row evens out both sides. Light weights, high reps, slim toned arms.' },
    exercises: [
      JUMP_ROPE,
      { name: 'Stomach Vacuum', detail: '4 × 20 sec hold · exhale everything out, pull the navel in and up under the ribcage, hold and breathe shallow · the fastest route to a flat stomach at rest — the more often you train the TVA, the flatter your belly sits naturally' },
      { name: 'Pilates Roll-Up', detail: '3 × 8 reps · lie flat, peel up one vertebra at a time reaching for your toes, then lower with the same control · lengthens and strengthens the whole deep abdominal wall through a long range · move slow, no yanking with the neck' },
      { name: 'Forearm Plank', detail: '3 × 30–45 sec · forearms down, body in one straight line head-to-heel, brace the belly in · full anterior-core stability under tension · if it gets easy, add a shoulder tap each side · keep the hips from sagging' },
      { name: 'Wall Angels (Posture)', detail: '3 × 12 reps · stand with your back flat against a wall, arms bent in a goalpost, slide them up and down keeping wrists and elbows touching the wall · POSTURE FIX — restores overhead range and pulls you out of the forward-shoulder slump' },
      { name: 'Single-Arm Dumbbell Row (light–moderate)', detail: '3 × 12 reps each side · one hand and knee braced on a bench, pull the dumbbell from a dead hang to your hip, elbow close · evens out both sides of the back and defines it · light-to-moderate, controlled — never max out' },
      { name: 'Prone Y-T-W Raises (Posture)', detail: '3 × 8 reps each letter · face down, no or tiny weights, lift the arms to form a Y, then a T, then a W, squeezing the upper back each time · POSTURE FIX — hits every small back muscle that holds the shoulders back · bodyweight or 0.5–1 kg only' },
      WALK_COOLDOWN,
    ],
    noteAfter: { type: 'rose', text: '💡 Fruit day. Tomorrow is sprints — hydrate well tonight. Stay light: fruits, then light steamed veg at 5. Walk after each meal, stop at 80% full, and get good sleep — recovery is where the results show up.' },
    meals: {
      label: '🍓 Fruit Day — Fruits 12PM · Fruits 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Watermelon', key: 'watermelon' },
          { name: 'Grapes', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Apple', key: 'apple' },
          { name: 'Banana', key: 'banana' },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Cucumber', key: null },
          { name: 'Steamed Carrots', key: null },
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
      label: '⚡ Sprint Fuel — Fruits 12PM · Protein 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Banana', key: 'banana' },
          { name: 'Berries', key: null },
        ]},
        { time: '3:00 PM — Dinner (Protein · post-sprint)', ingredients: [
          { name: 'Chicken 150g', key: 'chicken' },
          { name: 'Steamed Zucchini', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Papaya', key: 'papaya' },
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
    sub: 'Light walking + full-body stretch · ~50 min total',
    noteBefore: { type: 'gold', text: '🌸 Your one full rest day. Muscles grow on rest days, not in the gym — so this is where the week\'s work pays off. Keep it gentle: an easy walk and a full-body stretch that targets exactly what you trained — glutes, hamstrings, hip flexors, back, and shoulders.' },
    exercises: [
      { name: 'Light Walk — 30–45 min', detail: 'Easy conversational pace, slower than your cool-down walks · morning or evening, outside if you can · this is active recovery, not exercise — it keeps blood flowing to repair tissue with zero stress on the body' },
      { name: 'Figure-Four Glute Stretch', detail: '2 × 45 sec each side · on your back, cross one ankle over the opposite knee, pull the bottom leg toward your chest · releases the deep glute after two heavy glute days · your glutes will be sore — this is the antidote' },
      { name: 'Hip Flexor Stretch', detail: '2 × 45 sec each side · low lunge, back knee down, shift the hips forward · tight hip flexors tilt the pelvis and limit glute activation — this undoes the damage from sitting and lifting' },
      { name: 'Hamstring Stretch', detail: '2 × 45 sec each side · on your back, pull one straight leg toward you · RDLs and sumo squats load the hamstrings hard — stretching keeps them long so your Monday hip thrust hits full depth' },
      { name: 'Cat-Cow + Thoracic Rotation', detail: '2 × 10 cycles · on all fours, flow slowly between full spinal arch and round, then reach one arm to the ceiling to rotate · decompresses the spine after three back days · breathe with the movement' },
      { name: 'Chest & Shoulder Opener', detail: '2 × 30 sec each side · doorway chest stretch + arm across the chest · counters the forward-shoulder posture and opens what the back work tightened · gentle, hold and breathe' },
      { name: "World's Greatest Stretch", detail: '2 × 5 each side · lunge forward, plant the same-side hand, rotate the top arm to the sky · hits hips, spine, hamstrings, and adductors in one flow — the perfect full-body finisher to your week' },
    ],
    noteAfter: { type: 'rose', text: '🌿 Sunday prep: batch-cook your protein for the two glute days (chicken, fish), wash and portion your fruits, set your jump rope by the door. A prepared week eats clean and trains hard. Rest well — you earned it.' },
    meals: {
      label: '🍓 Fruit Day — Fruits 12PM · Fruits 3PM · Light 5PM',
      rows: [
        { time: '12:00 PM — Breakfast (Fruits)', ingredients: [
          { name: 'Papaya', key: 'papaya' },
          { name: 'Berries', key: null },
        ]},
        { time: '3:00 PM — Snack (Fruits)', ingredients: [
          { name: 'Apple', key: 'apple' },
          { name: 'Kiwi', key: null },
        ]},
        { time: '5:00 PM — Last Meal (Light)', ingredients: [
          { name: 'Steamed Spinach', key: null },
          { name: 'Steamed Carrots', key: null },
          { name: 'spearmint tea', key: null },
        ]},
      ],
    },
  },
];
