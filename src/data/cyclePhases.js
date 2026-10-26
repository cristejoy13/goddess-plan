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
