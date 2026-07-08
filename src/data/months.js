// Goddess habit journey — 12 progressive months starting in June.
// Array is in calendar order (index 0 = January) so the calendar maps correctly,
// but the journey builds June → May. Each month layers one habit on top of the last.
export const MONTHS = [
  // January — Journey month 8
  {
    name: 'January',
    ch: 'Eat SLOW & 80% Full',
    why: "Half of a flat stomach is HOW you eat, not just what. Eating fast and to 100% full stretches the stomach and traps gas. This month you slow down: small bites, chew fully, and stop at 80% — comfortably light, never stuffed. This single habit does more for a flat belly than any crunch.",
    tasks: [
      'Week 1 — Put your fork/spoon down between every bite. No screens while eating.',
      'Week 2 — Chew each bite 20–30 times until almost liquid before swallowing.',
      'Week 3 — Stop at 80% full. Pause mid-meal and ask: could I comfortably walk right now?',
      'Week 4 — Every meal slow, small, and to 80%. Notice how much flatter you feel.',
    ],
  },
  // February — Journey month 9
  {
    name: 'February',
    ch: 'Hydration & Skin',
    why: "Water is the most underrated tool for skin clarity and beating puffiness — the body retains water when it doesn't get enough. Paired with collagen and the right teas, this month makes your skin glow and your face de-puff.",
    tasks: [
      'Week 1 — 500ml warm lemon water on waking, every day, before anything else.',
      'Week 2 — Hit 2–2.5L plain water daily, sipped slowly (not chugged).',
      'Week 3 — Add dairy-free collagen at your 3 PM meal on glute days.',
      'Week 4 — Spearmint or green tea daily. Assess skin clarity and morning puffiness.',
    ],
  },
  // March — Journey month 10
  {
    name: 'March',
    ch: 'Sleep & Stress',
    why: "Your glutes don't grow in the gym — they grow while you sleep. Deep sleep releases growth hormone and lowers cortisol (the stress hormone that stores belly fat and drives bloating). This month protects your recovery. The final S of GODSSSS: good Sleep, no Stress.",
    tasks: [
      'Week 1 — Set a fixed bedtime for 7.5–9 hrs of sleep. Non-negotiable.',
      'Week 2 — Screens off + dim lights 60 min before bed; gentle stretch instead.',
      'Week 3 — Add a daily 5-min calm practice (breathing, journaling, or a slow walk).',
      'Week 4 — Consistent sleep + lower stress. Notice recovery, mood, and glute soreness.',
    ],
  },
  // April — Journey month 11
  {
    name: 'April',
    ch: 'Progressive Overload — Glute Peak',
    why: "Round glutes come from ONE thing over time: lifting heavier. This is your push month. You've built the habits — now you add weight to the hip thrust, RDL, and sumo squat, and you track it. What gets measured gets grown.",
    tasks: [
      'Week 1 — Log your current weights on hip thrust, RDL, and sumo squat.',
      'Week 2 — Add 1–2 kg to each main lift when all sets feel controlled.',
      'Week 3 — Add a second finisher set to each glute day; keep protein at 3 PM.',
      'Week 4 — Compare your lifts + glute measurements to March. Celebrate the gains.',
    ],
  },
  // May — Journey month 12 (final)
  {
    name: 'May',
    ch: 'Goddess Maintenance & Reflection',
    why: "Your reward month. Eleven months of layered habits are now simply who you are — flat stomach, round glutes, calm gut, glowing skin. Maintain everything with flexibility for life, and reflect on how far you've come. This is your new normal, not a diet.",
    tasks: [
      'Week 1 — Keep the full plan with relaxed flexibility for celebrations.',
      'Week 2 — Take final progress photos + measurements. Compare to last June.',
      'Week 3 — Write down what worked best for YOUR body — your personal blueprint.',
      'Week 4 — Set next year\'s goals from this strong new baseline. You built a goddess. ✨',
    ],
  },
  // June — Journey month 1 (START HERE)
  {
    name: 'June',
    ch: 'Glute Foundation',
    why: "Everything starts here. This month you learn your two glute days (Monday & Thursday) and build the mind-muscle connection so your glutes — not your back or quads — do the work. Perfect form now means real growth for the next eleven months.",
    tasks: [
      'Week 1 — Do both glute days. Focus on feeling the squeeze at the top of every rep.',
      'Week 2 — Add glute activation (bridges + clamshells) before every glute session.',
      'Week 3 — Nail your form on hip thrust, RDL, and Bulgarian split squat — go lighter if needed.',
      'Week 4 — Both glute days done every week. Journal which exercises you feel most in your glutes.',
    ],
  },
  // July — Journey month 2
  {
    name: 'July',
    ch: 'Daily Stomach Vacuum',
    why: "The flat-stomach-at-rest secret. The stomach vacuum trains the deep TVA muscle — your natural internal corset that holds everything flat when you're just standing around. It's the one exercise that changes how your belly looks at rest, and it takes 2 minutes a day.",
    tasks: [
      'Week 1 — Learn the vacuum: exhale all air, pull navel in and up, hold 15 sec × 3.',
      'Week 2 — Do vacuums every morning before your first drink of water.',
      'Week 3 — Build to 4 × 20-sec holds daily; add them into your core days too.',
      'Week 4 — Daily vacuums locked in. Compare your relaxed stomach to a June photo.',
    ],
  },
  // August — Journey month 3
  {
    name: 'August',
    ch: 'Fruit at Noon & Veg at 5',
    why: "This is the heart of the meal rhythm. Your first food at 12 PM includes fruit every day, then core/light days finish with filling vegetables at 5 PM so you stay full without heavy late meals. Master the 12 PM fruit habit and the 5 PM veggie finish.",
    tasks: [
      'Week 1 — First food at 12 PM, and make fruit the anchor. Water + tea before then.',
      'Week 2 — Build the 5 PM veggie plate: squash, sweet potato, broccoli, spinach, eggplant, carrots, or cucumber.',
      'Week 3 — Choose low-bloat fruits (papaya, pineapple, kiwi, berries, watermelon).',
      'Week 4 — 12 PM fruit breakfast is automatic. Notice the drop in afternoon bloating.',
    ],
  },
  // September — Journey month 4
  {
    name: 'September',
    ch: 'Walk After Every Meal',
    why: "A 10–15 minute walk after eating is the simplest anti-bloat tool there is — it moves food through the gut, blunts the blood-sugar spike, and burns fat with zero extra effort. Pair it with jump-rope warm-ups and your daily movement quietly doubles.",
    tasks: [
      'Week 1 — Walk 10 min after your 12 PM meal, every day.',
      'Week 2 — Walk after all meals (12, 3, and 5). Even a slow loop counts.',
      'Week 3 — Add the 10–15 min jump-rope warm-up before every training session.',
      'Week 4 — Post-meal walks are a reflex now. Notice digestion and energy.',
    ],
  },
  // October — Journey month 5
  {
    name: 'October',
    ch: 'Deep Core & Posture',
    why: "Your three deep-core & back days (Tue/Wed/Fri) build the flat, strong midsection and the upright posture that instantly makes you look leaner and more confident. This month you commit to them fully — light weights, high reps, perfect posture. No bulk, just definition.",
    tasks: [
      'Week 1 — Complete all three core & back days. Keep every upper-body move light + high-rep.',
      'Week 2 — Focus on the posture move each day (band pull-aparts, face pulls, wall angels).',
      'Week 3 — Add 5 sec to your planks and holds; keep the deep core braced, not bulging.',
      'Week 4 — Three core days locked in. Notice your posture and waistline in the mirror.',
    ],
  },
  // November — Journey month 6
  {
    name: 'November',
    ch: 'Sprint & Conditioning',
    why: "Saturday sprints torch fat and sculpt the glutes and legs without adding bulk — and the protocol automatically gets harder every month. This month you commit to the sprint habit and push the progression the app sets for you.",
    tasks: [
      'Week 1 — Do the full Saturday sprint protocol. Warm up with jump rope first.',
      'Week 2 — Hit every interval at true effort — the app\'s numbers are your target.',
      'Week 3 — Add the 30-min brisk walk cool-down after every sprint (non-negotiable).',
      'Week 4 — Sprints are a weekly ritual. Log your times and how each round felt.',
    ],
  },
  // December — Journey month 7
  {
    name: 'December',
    ch: 'Gut Healing — Fuel Rhythm Mastery',
    why: "Now you tie it all together into a calm, healthy gut. Core/light days stay around 1,200 calories with fruit earlier and vegetables at 5 PM. Glute and sprint days rise toward 1,500 calories with protein or meat at 3 PM so training recovery is actually fed.",
    tasks: [
      'Week 1 — Hit the rhythm: fruits at 12, fruit snack at 3 on light days, protein/meat at 3 on hard days, vegetables at 5.',
      'Week 2 — Steam or boil all veg — no oils, no dairy, no gluten (GODSSSS out).',
      'Week 3 — Notice your trigger foods; drop anything that bloats you even a little.',
      'Week 4 — Gut calm, stomach flat. Journal bloating, skin, and mood vs. June.',
    ],
  },
];
