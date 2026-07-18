// Goddess habit journey — 12 progressive months starting in June.
// Array is in calendar order (index 0 = January) so the calendar maps correctly,
// but the journey builds June → May. Each month layers one habit on top of the last.
export const MONTHS = [
  // January — Journey month 8
  {
    name: 'January',
    ch: 'Eat SLOW & 80% Full',
    why: "Eat slowly, chew fully, and stop at 80% — light, never stuffed. This keeps the stomach flatter than rushing to 100% full.",
    tasks: [
      'Week 1 — Put your fork/spoon down between every bite. No screens while eating.',
      'Week 2 — Chew each bite 20–30 times until almost liquid before swallowing.',
      'Week 3 — Stop at 80% full. Pause mid-meal and ask: could I comfortably walk right now?',
      'Week 4 — Eat every meal slow, small, and to 80%. Notice your flatter stomach.',
    ],
  },
  // February — Journey month 9
  {
    name: 'February',
    ch: 'Hydration & Skin',
    why: "Hydrate steadily to support clear skin and reduce puffiness. Add collagen and tea for glow and digestion.",
    tasks: [
      'Week 1 — 500ml warm lemon water on waking, every day, before anything else.',
      'Week 2 — Hit 2–2.5L plain water daily, sipped slowly (not chugged).',
      'Week 3 — Add dairy-free collagen to your 5 PM meal.',
      'Week 4 — Spearmint or green tea daily. Assess skin clarity and morning puffiness.',
    ],
  },
  // March — Journey month 10
  {
    name: 'March',
    ch: 'Sleep & Stress',
    why: "Glutes grow during sleep. Deep sleep releases growth hormone and lowers cortisol, the stress hormone linked to belly fat and bloating.",
    tasks: [
      'Week 1 — Set a fixed bedtime for 7.5–9 hrs of sleep. Non-negotiable.',
      'Week 2 — Screens off + dim lights 60 min before bed; gentle stretch instead.',
      'Week 3 — Add a daily 5-min calm practice (breathing, journaling, or a slow walk).',
      'Week 4 — Keep sleep and stress steady. Notice recovery, mood, and soreness.',
    ],
  },
  // April — Journey month 11
  {
    name: 'April',
    ch: 'Progressive Overload — Glute Peak',
    why: "Round glutes come from progressive overload. Add weight to hip thrust, RDL, and sumo squat, then track it.",
    tasks: [
      'Week 1 — Log your current weights on hip thrust, RDL, and sumo squat.',
      'Week 2 — Add 1–2 kg to each main lift when all sets feel controlled.',
      'Week 3 — Add a second finisher set to each glute day; on glute days eat freely, just stop by 5 PM.',
      'Week 4 — Compare lifts + glute measurements to March.',
    ],
  },
  // May — Journey month 12 (final)
  {
    name: 'May',
    ch: 'Goddess Maintenance & Reflection',
    why: "Maintain the habits with flexibility. Reflect on your flat stomach, round glutes, calm gut, and glow.",
    tasks: [
      'Week 1 — Keep the full plan with relaxed flexibility for celebrations.',
      'Week 2 — Take final progress photos + measurements. Compare to last June.',
      'Week 3 — Write down what worked best for YOUR body — your personal blueprint.',
      'Week 4 — Set next year\'s goals from this new baseline. ✨',
    ],
  },
  // June — Journey month 1 (START HERE)
  {
    name: 'June',
    ch: 'Glute Foundation',
    why: "Learn Monday and Thursday glute days. Build the mind-muscle connection so glutes, not back or quads, do the work.",
    tasks: [
      'Week 1 — Do both glute days. Focus on feeling the squeeze at the top of every rep.',
      'Week 2 — Add glute activation (bridges + clamshells) before every glute session.',
      'Week 3 — Nail your form on hip thrust, RDL, and Bulgarian split squat — go lighter if needed.',
      'Week 4 — Finish both glute days weekly. Journal which moves hit glutes most.',
    ],
  },
  // July — Journey month 2
  {
    name: 'July',
    ch: 'Daily Stomach Vacuum',
    why: "Stomach vacuums train the deep TVA, your internal corset. Do 2 minutes daily for a flatter resting stomach.",
    tasks: [
      'Week 1 — Learn the vacuum: exhale all air, pull navel in and up, hold 15 sec × 3.',
      'Week 2 — Do vacuums every morning before your first drink of water.',
      'Week 3 — Build to 4 × 20-sec holds daily; add them into your core days too.',
      'Week 4 — Lock in daily vacuums. Compare to a June photo.',
    ],
  },
  // August — Journey month 3
  {
    name: 'August',
    ch: 'OMAD — One Meal at 5 PM',
    why: "Anchor the day on OMAD: water, tea, and psyllium husk during the day, then one satisfying meal at 5 PM. Always stop eating by 5 PM to stay light.",
    tasks: [
      'Week 1 — Fast on water, tea, and 1 tbsp psyllium husk in water during the day. Meal at 5 PM.',
      'Week 2 — Build the 5 PM meal: protein (fish, chicken, egg whites, or Greek yogurt) + fruits + fibre.',
      'Week 3 — Choose low-bloat fruits (papaya, pineapple, kiwi, berries, dragon fruit).',
      'Week 4 — Make the OMAD 5 PM rhythm automatic. Never eat after 5 PM.',
    ],
  },
  // September — Journey month 4
  {
    name: 'September',
    ch: 'Walk After Every Meal',
    why: "Walk 15 minutes after eating to move digestion, blunt blood sugar spikes, and reduce bloating.",
    tasks: [
      'Week 1 — Walk 15 min after your 5 PM meal, every day.',
      'Week 2 — Add a short daytime walk too. Even a slow loop counts.',
      'Week 3 — Add the full-body stretch warm-up before, and 10–20 min of jump rope to cool down after, every training session.',
      'Week 4 — Make post-meal walks automatic. Notice digestion and energy.',
    ],
  },
  // October — Journey month 5
  {
    name: 'October',
    ch: 'Deep Core & Posture',
    why: "Deep-core and back days build a flatter waist and upright posture. Use light weights, high reps, and clean form.",
    tasks: [
      'Week 1 — Complete all three core & back days. Keep every upper-body move light + high-rep.',
      'Week 2 — Focus on the posture move each day (band pull-aparts, face pulls, wall angels).',
      'Week 3 — Add 5 sec to your planks and holds; keep the deep core braced, not bulging.',
      'Week 4 — Lock in three core days. Notice posture and waistline.',
    ],
  },
  // November — Journey month 6
  {
    name: 'November',
    ch: 'Pilates & Inversions',
    why: "Pilates days build a strong core and posture. Add handstand and elbow-stand drills to build balance and shoulder strength.",
    tasks: [
      'Week 1 — Do all five pilates days. Warm up, do the vacuum, then pick one video.',
      'Week 2 — Add a handstand or elbow-stand drill to each pilates day.',
      'Week 3 — Add the 10–20 min jump-rope cool-down after every session.',
      'Week 4 — Pilates is a weekly ritual. Note your balance and core progress.',
    ],
  },
  // December — Journey month 7
  {
    name: 'December',
    ch: 'Gut Healing — OMAD Mastery',
    why: "Tie the OMAD rhythm together: water, tea, and psyllium husk during the day, one meal at 5 PM, and always stop eating by 5 PM. Glute days you eat freely until 5.",
    tasks: [
      'Week 1 — Hit the rhythm: fast on water/tea/psyllium by day, one balanced 5 PM meal. Glute days, eat freely until 5.',
      'Week 2 — Steam or boil all veg — no oils, no dairy, no gluten (GODSSSS out).',
      'Week 3 — Notice your trigger foods; drop anything that bloats you even a little.',
      'Week 4 — Gut calm, stomach flat. Journal bloating, skin, and mood vs. June.',
    ],
  },
];
