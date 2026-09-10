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
      'Week 3 — Add one more working set to your heaviest lift on each glute day. Keep the zone 2 run easy on those days so the extra set still has something behind it.',
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
    why: "Learn your three glute days (Monday, Wednesday, Friday). Build the mind-muscle connection so glutes, not back or quads, do the work.",
    tasks: [
      'Week 1 — Do all three glute days. Focus on feeling the squeeze at the top of every rep.',
      'Week 2 — Add glute activation (bridges + clamshells) before every glute session.',
      'Week 3 — Nail your form on hip thrust, RDL, and Bulgarian split squat — go lighter if needed.',
      'Week 4 — Finish all three glute days weekly, each opened with the 20-min zone 2 run and closed with rope or a walk. Journal which moves hit glutes most.',
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
    ch: 'One Clock — The Same Four Meals Every Day',
    why: "Learn the one eating clock and run it every day: coffee and banana before you train, protein with kimchi plus cucumber and banana after, a smoothie and granola bowl at 3 PM, apple sticks with yogurt at 5 PM. Same four meals, every single day — nothing to switch between.",
    tasks: [
      'Week 1 — Get the banana right: one before training, one straight after. Every single session, every day of the week.',
      'Week 2 — Make the 3 PM bowl a habit: two or three frozen fruits blended, granola and chia through it, fruit on top. Never more than three fruits.',
      'Week 3 — Keep kimchi in the fridge so the after-training plate is never a decision. Protein, kimchi, then cucumber and banana.',
      'Week 4 — Make the 5 PM finish automatic: apple sticks and yogurt, or sweet potato or boiled saba if you crave it. Nothing after — tea only.',
    ],
  },
  // September — Journey month 4
  {
    name: 'September',
    ch: 'Walk After Every Meal',
    why: "Walk 15 minutes after eating to move digestion, blunt blood sugar spikes, and reduce bloating.",
    tasks: [
      'Week 1 — Walk 15 min after your 5 PM meal, every day.',
      'Week 2 — Lock in the finisher on every weekday: rope or a walk, one or the other, never both.',
      'Week 3 — Add the full-body stretch and the 20-min zone 2 run before every weekday session, and the stomach vacuum on both core days.',
      'Week 4 — Make post-meal walks automatic. Notice digestion and energy.',
    ],
  },
  // October — Journey month 5
  {
    name: 'October',
    ch: 'Shoulder Healing & Posture',
    why: "Shoulder pain comes from weak stabilisers and a tight chest, not weak arms. The band pull-apart on both core days is the whole prescription — light load, high reps, held squeeze. It makes the joint strong and pain-free without adding size.",
    tasks: [
      'Week 1 — Both core days, full-body stretch first. Band pull-apart every single session, 3 × 20, no exceptions.',
      'Week 2 — Add the doorway chest stretch daily, not just on training days — the tight chest is the root cause.',
      'Week 3 — Keep the band light and add reps instead of resistance. Note pain levels before and after each session.',
      'Week 4 — Compare shoulder pain to Week 1. Only add overhead pressing once you have been pain-free 2–3 weeks.',
    ],
  },
  // November — Journey month 6
  {
    name: 'November',
    ch: 'Forearm Stand — Weekend Skill',
    why: "Saturday and Sunday are for stretching, light walking, and learning the forearm stand. Dolphin holds and hollow-body work build the shoulders and core the balance needs.",
    tasks: [
      'Week 1 — Both rest days: long stretch, a walk you enjoy, and the five forearm-stand drills.',
      'Week 2 — Hold dolphin pose 45 sec × 4 and add dolphin wall walks.',
      'Week 3 — Start dolphin pike hops — hips over shoulders, land soft. Follow one forearm-stand video.',
      'Week 4 — Film your best attempt. Compare shoulder stack to Week 1.',
    ],
  },
  // December — Journey month 7
  {
    name: 'December',
    ch: 'Gut Healing — Meal Rhythm Mastery',
    why: "Tie the rhythm together: the same four meals every day, and the same weekday shape every day — stretch, zone 2 run, main workout, rope or walk.",
    tasks: [
      'Week 1 — Run the clock without thinking about it. Any protein any day; never chicken, beef or pork.',
      'Week 2 — Steam or boil all veg — no oils, no gluten, and no dairy beyond the yogurt bowl (GODSSSS out).',
      'Week 3 — Notice your trigger foods; drop anything that bloats you even a little.',
      'Week 4 — Gut calm, stomach flat. Journal bloating, skin, and mood vs. June.',
    ],
  },
];
