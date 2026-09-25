// Goddess habit journey — 12 progressive months starting in June.
// Array is in calendar order (index 0 = January) so the calendar maps correctly,
// but the journey builds June → May. Each month layers one habit on top of the last.
export const MONTHS = [
  // January — Journey month 8
  {
    name: 'January',
    ch: 'Eat SLOW & 80% Full',
    why: "Eat slowly and stop at 80%. Stay light, not 100% stuffed.",
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
    why: "Hydrate steadily for clear skin and less puffiness. Add collagen and tea.",
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
    why: "Glutes grow during sleep. Keep stress low to reduce belly bloat.",
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
    why: "Build round glutes with progressive overload. Add weight and track it.",
    tasks: [
      'Week 1 — Log your current weights on hip thrust, RDL, and sumo squat.',
      'Week 2 — Add 1–2 kg to each main lift when all sets feel controlled.',
      'Week 3 — Add one more working set to your heaviest lift on each glute day. Keep the hour walk easy.',
      'Week 4 — Compare lifts + glute measurements to March.',
    ],
  },
  // May — Journey month 12 (final)
  {
    name: 'May',
    ch: 'Goddess Maintenance & Reflection',
    why: "Maintain the habits with flexibility. Reflect on your results.",
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
    why: "Learn your three glute days (Monday, Wednesday, Friday). Feel glutes do the work.",
    tasks: [
      'Week 1 — Do all three glute days. Focus on feeling the squeeze at the top of every rep.',
      'Week 2 — Add glute activation (bridges + clamshells) before every glute session.',
      'Week 3 — Nail form on hip thrust, RDL, and Bulgarian split squat — go lighter if needed.',
      'Week 4 — Finish all three glute days weekly with warm-up, activation, and the hour walk or rope. Journal best glute moves.',
    ],
  },
  // July — Journey month 2
  {
    name: 'July',
    ch: 'Daily Stomach Vacuum',
    why: "Stomach vacuums train deep core. Do 2 minutes daily.",
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
    ch: 'One Clock — The Same Four Meals Every Day',
    why: "Run one eating clock daily. Coffee and banana before training, protein plate after, bowl at 3 PM, apple and yogurt at 5 PM.",
    tasks: [
      'Week 1 — One banana before training, one straight after. Every session.',
      'Week 2 — Make the 3 PM bowl: two or three frozen fruits, granola, chia, fruit on top. Never more than three fruits.',
      'Week 3 — Keep kimchi ready. After training: protein, kimchi, cucumber, banana.',
      'Week 4 — Make 5 PM automatic: apple sticks and yogurt, or sweet potato or boiled saba. Nothing after — tea only.',
    ],
  },
  // September — Journey month 4
  {
    name: 'September',
    ch: 'Walk After Every Meal',
    why: "Walk 15 minutes after eating for digestion and less bloating.",
    tasks: [
      'Week 1 — Walk 15 min after your 5 PM meal, every day.',
      'Week 2 — Weekday finisher: rope or a walk, never both.',
      'Week 3 — Add full-body stretch before weekday sessions, the hour walk after, and stomach vacuum on both core days.',
      'Week 4 — Make post-meal walks automatic. Notice digestion and energy.',
    ],
  },
  // October — Journey month 5
  {
    name: 'October',
    ch: 'Shoulder Healing & Posture',
    why: "Fix shoulder pain with light band pull-aparts and chest stretch. Keep reps high and squeeze held.",
    tasks: [
      'Week 1 — Both core days, full-body stretch first. Band pull-apart every session, 3 × 20.',
      'Week 2 — Add the doorway chest stretch daily, not just training days.',
      'Week 3 — Keep the band light and add reps, not resistance. Note pain before and after.',
      'Week 4 — Compare shoulder pain to Week 1. Add overhead pressing only after 2–3 pain-free weeks.',
    ],
  },
  // November — Journey month 6
  {
    name: 'November',
    ch: 'Forearm Stand — Weekend Skill',
    why: "Use Saturday and Sunday for stretching, light walks, and forearm stand skill.",
    tasks: [
      'Week 1 — Both rest days: long stretch, easy walk, and five forearm-stand drills.',
      'Week 2 — Hold dolphin pose 45 sec × 4 and add dolphin wall walks.',
      'Week 3 — Start dolphin pike hops — hips over shoulders, land soft. Follow one video.',
      'Week 4 — Film your best attempt. Compare shoulder stack to Week 1.',
    ],
  },
  // December — Journey month 7
  {
    name: 'December',
    ch: 'Gut Healing — Meal Rhythm Mastery',
    why: "Tie the rhythm together: same two meals, same weekday training shape.",
    tasks: [
      'Week 1 — Black coffee until noon, Meal A or Meal B at 12, apple & yogurt or smoothie at 5, nothing after.',
      'Week 2 — Steam, boil, bake or dry-sear — no oils, no gluten, and no dairy beyond the Greek yogurt (GODSSSS out).',
      'Week 3 — Notice your trigger foods; drop anything that bloats you even a little.',
      'Week 4 — Gut calm, stomach flat. Journal bloating, skin, and mood vs. June.',
    ],
  },
];
