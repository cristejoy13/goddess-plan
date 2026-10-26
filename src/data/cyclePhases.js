// What each phase of her cycle tends to bring, and what helps (2026-10-26).
// General guidance for a typical cycle: short lines, whole foods only, and
// no dairy (her own rule in Body → Anti-Aging).
export const PHASES = {
  period: {
    name: 'Period',
    full: 'Menstrual phase',
    color: '#e5484d',
    expect: 'Hormones are at their lowest. You may feel tired, crampy and inward.',
    mood: 'Quieter and more inward. Easy to feel low on day 1–2.',
    energy: 'Lowest of the month. It lifts after day 2–3.',
    workout: ['Walking', 'Gentle Pilates or yoga', 'Stretching', 'Light strength if you feel good'],
    foods: [
      ['Beef, liver or sardines', 'iron you are losing'],
      ['Malunggay or spinach + calamansi', 'iron, and vitamin C to absorb it'],
      ['Salmon, bangus', 'omega-3 eases cramps'],
      ['Ginger tea', 'cramps and nausea'],
      ['Dark chocolate 70%+', 'magnesium for mood'],
      ['Mongo beans, lentils', 'iron and steady energy'],
    ],
    skin: 'Sensitive. Gentle care, skip strong acids.',
  },
  follicular: {
    name: 'Follicular',
    full: 'Follicular phase',
    color: '#2fb38a',
    expect: 'Estrogen climbs. Energy, focus and mood rise every day.',
    mood: 'Lighter, curious, social. Good days to start new things.',
    energy: 'Rising day by day.',
    workout: ['Heavy lifting', 'Glutes and legs, add weight', 'HIIT', 'Try a new class'],
    foods: [
      ['Eggs', 'protein and choline'],
      ['Broccoli, cabbage, pechay', 'help clear used estrogen'],
      ['Kimchi, sauerkraut', 'gut health'],
      ['Chicken, tofu', 'lean protein for muscle'],
      ['Oats, kamote', 'fuel for harder workouts'],
      ['Flaxseed', 'hormone balance'],
    ],
    skin: 'Strong and clear. Good time for actives.',
  },
  ovulation: {
    name: 'Ovulation',
    full: 'Ovulatory phase',
    color: '#f0b429',
    expect: 'Estrogen peaks and LH spikes. Your strongest, most confident days.',
    mood: 'Confident, talkative, magnetic. Libido is highest.',
    energy: 'Peak.',
    workout: ['Personal bests', 'Sprints, HIIT', 'Heavy glutes', 'Group classes'],
    foods: [
      ['Kangkong, broccoli, ampalaya', 'fibre to clear extra estrogen'],
      ['Papaya, berries', 'antioxidants'],
      ['Salmon', 'omega-3'],
      ['Brown rice, quinoa', 'steady energy'],
      ['Eggs', 'protein'],
      ['Water, buko juice', 'you sweat more now'],
    ],
    skin: 'Glowy. Keep layers light.',
  },
  luteal: {
    name: 'Luteal',
    full: 'Luteal phase',
    color: '#9b6bff',
    expect: 'Progesterone rises, then both hormones drop before your period. Cravings and bloating are normal.',
    mood: 'Calm at first. Later more sensitive, irritable or anxious.',
    energy: 'Steady, then dropping in the last week.',
    workout: ['Moderate strength', 'Pilates', 'Walking', 'More rest days near the end'],
    foods: [
      ['Kamote, oats', 'slow carbs calm cravings'],
      ['Pumpkin seeds', 'magnesium and zinc'],
      ['Banana', 'B6 and potassium for mood and bloating'],
      ['Dark leafy greens', 'magnesium'],
      ['Chickpeas, salmon', 'steady blood sugar'],
      ['Less salt, sugar, coffee', 'less bloating and fewer mood swings'],
    ],
    skin: 'Oilier, breakouts likely. BHA nights help.',
  },
};

export const PHASE_ORDER = ['period', 'follicular', 'ovulation', 'luteal'];

// Birth control (2026-10-27): which kind she uses changes what Cycle shows.
//   natural: her own phases, as above.
//   pack:    the combined pill, patch or ring: no ovulation; active days,
//            then a break week with a withdrawal bleed.
//   maybe:   the mini-pill or hormone coil: ovulation may or may not
//            happen, so the phases are shown as "maybe".
//   steady:  the implant or injection: ovulation is usually stopped, so
//            there are no monthly phases.
// Copper has no hormones, so her own cycle carries on.
export const METHODS = {
  natural:   { label: 'Natural',                     kind: 'natural' },
  combined:  { label: 'Combined pill, patch or ring', kind: 'pack', pill: true },
  minipill:  { label: 'Mini-pill',                   kind: 'maybe', pill: true,
    note: 'On the mini-pill your cycle may or may not run. Bleeding can be lighter, irregular or stop.' },
  hcoil:     { label: 'Hormone coil',                kind: 'maybe',
    note: 'With a hormone coil you may still ovulate. Periods often get lighter or stop.' },
  implant:   { label: 'Implant',                     kind: 'steady' },
  injection: { label: 'Injection',                   kind: 'steady' },
  copper:    { label: 'Copper coil',                 kind: 'natural',
    note: 'No hormones, so your own cycle runs. Periods can be heavier and longer, so iron foods matter more.' },
};
export const METHOD_ORDER = ['natural', 'combined', 'minipill', 'hcoil', 'implant', 'injection', 'copper'];

const PILL_FOODS = [
  ['Malunggay, spinach, mongo beans', 'folate, which the pill lowers'],
  ['Eggs, sardines, salmon', 'B12 and omega-3'],
  ['Pumpkin seeds, dark chocolate', 'magnesium and zinc, also lowered'],
  ['Banana, kamote', 'B6 for mood'],
  ['Guava, calamansi, papaya', 'vitamin C'],
];

export const METHOD_PHASES = {
  active: {
    name: 'Active pills',
    full: 'Active pill days',
    color: '#d63a7f',
    expect: 'The pill gives a steady dose and switches off ovulation. No big ups and downs this month.',
    mood: 'Usually steady. Some feel flatter or more sensitive in the first 3 months.',
    energy: 'Even through the month.',
    workout: ['Heavy lifting', 'Glutes and legs', 'HIIT', 'Pilates'],
    foods: PILL_FOODS,
    skin: 'Often clearer and steadier.',
  },
  break: {
    name: 'Break week',
    full: 'Break week',
    color: '#e5484d',
    expect: 'No hormones this week, so a light bleed comes. It is a withdrawal bleed, not a true period.',
    mood: 'Some feel low or get a headache for a day or two.',
    energy: 'Can dip a little.',
    workout: ['Walking', 'Pilates', 'Moderate strength', 'Stretching'],
    foods: [
      ['Beef, liver or sardines', 'iron you are losing'],
      ['Malunggay or spinach + calamansi', 'iron, and vitamin C to absorb it'],
      ['Ginger tea', 'cramps and headaches'],
      ['Water, buko juice', 'headaches and bloating'],
    ],
    skin: 'Small breakouts can show. Keep it gentle.',
  },
  steady: {
    name: 'Steady',
    full: 'Steady hormones',
    color: '#5b8def',
    expect: 'Ovulation is usually stopped, so there are no monthly phases. Bleeding can come at any time, get lighter, or stop.',
    mood: 'Usually steady. If low mood lasts for weeks, tell your doctor.',
    energy: 'Even, day to day.',
    workout: ['Heavy lifting', 'Glutes and legs', 'HIIT', 'Pilates'],
    foods: [
      ['Eggs, salmon, chicken', 'protein for muscle'],
      ['Dark leafy greens', 'magnesium and folate'],
      ['Beef, mongo beans + calamansi', 'iron for spotting days'],
      ['Pumpkin seeds', 'zinc and magnesium'],
    ],
    skin: 'Some get more breakouts. BHA nights help.',
  },
};

// The injection can thin bones over time, so calcium is added for it
// (no dairy, her own rule).
export const INJECTION_FOODS = [
  ['Sardines with bones, dilis', 'calcium for bones'],
  ['Tofu, malunggay, pechay', 'calcium without dairy'],
];
