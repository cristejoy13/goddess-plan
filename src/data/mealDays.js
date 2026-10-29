// Her whole-day meal plans (sent 2026-10-30), shown in Meals → Days and on
// Home. Every food, amount, number and step is hers, word for word; nothing
// is filled in. The light day's main meal and dinner came without cooking
// steps, so none are shown for them. Its snack is the same as the glute
// day's, so it shares those steps.
//
// Pictures in public/meal-ideas/: day-<type>-cover.jpg (the Glute Days /
// Light Days covers), day-<type>-plan.jpg (the whole day on one table),
// day-<type>-card.jpg (her full plan card) and day-<type>-<meal>.jpg (each
// meal, cut from her card). Her full-size .png copies sit beside them and
// are not deployed.

// Monday = 0 … Sunday = 6, as on Home.
export const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
export const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DAY_TYPES = [
  {
    id: 'glute', name: 'Glute Days', one: 'Glute day', cover: '/meal-ideas/day-glute-cover.jpg',
    days: [0, 3, 5], kcal: '1,200 kcal',
  },
  {
    id: 'light', name: 'Light Days', one: 'Light day', cover: '/meal-ideas/day-light-cover.jpg',
    days: [1, 2, 4, 6], kcal: '1,000 kcal',
    dayNotes: { 6: 'Light / flexible day' },
  },
];

export const dayTypeOf = weekday => DAY_TYPES.find(t => t.days.includes(weekday));

const SNACK_STEPS = [
  'Wash the apple.',
  'Slice it into small pieces.',
  'Put the Greek yogurt into a bowl.',
  'Add the apple.',
  'Sprinkle chia seeds on top.',
  'Mix everything together or eat the apple separately.',
];

export const DAY_PLANS = [
  {
    id: 'dp-glute-1', type: 'glute', name: 'Glute Day',
    image: '/meal-ideas/day-glute-plan.jpg', card: '/meal-ideas/day-glute-card.jpg',
    totals: { kcal: '≈ 1,200 kcal', protein: '≈ 79 g protein', fiber: '≈ 26 g fiber', carbs: '≈ 105 g carbs' },
    note: 'The carbs are moderate, not extremely low.',
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal', image: '/meal-ideas/day-glute-main.jpg',
        items: [
          ['Chicken breast, cooked', '120 g'],
          ['Green peas', '70 g'],
          ['Broccoli', '100 g'],
          ['Squash', '200 g'],
          ['Pumpkin seeds', '15 g'],
          ['Olive oil', '10 g (about 2 tsp)'],
        ],
        kcal: '≈ 530 kcal', protein: '≈ 50 g protein',
        why: [
          ['Chicken', 'protein'],
          ['Peas', 'fiber + folate'],
          ['Broccoli', 'fiber + vitamin C'],
          ['Squash', 'moderate carbs + beta-carotene'],
          ['Pumpkin seeds', 'magnesium + iron + healthy fat'],
          ['Olive oil', 'satiety + healthy fat'],
        ],
        stepsTitle: 'How to cook',
        steps: [
          'Cut the chicken into bite-size pieces.',
          'Steam or boil the broccoli until tender but still firm.',
          'Boil or steam the squash until soft.',
          'Heat a pan on medium heat.',
          'Add the cooked chicken and green peas.',
          'Add a small splash of water if the pan becomes dry.',
          'Cook for 2–3 minutes until everything is hot.',
          'Put the chicken, peas, broccoli, and squash in one bowl.',
          'Drizzle the olive oil over the meal.',
          'Sprinkle pumpkin seeds on top.',
        ],
        optional: 'Add salt, black pepper, garlic, or calamansi.',
      },
      {
        time: '3:00 PM', name: 'Snack', snack: true, image: '/meal-ideas/day-glute-snack.jpg',
        items: [
          ['1 medium apple', '~180 g'],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '10 g'],
        ],
        kcal: '≈ 225 kcal', protein: '≈ 11 g protein',
        gives: 'protein + fiber + something sweet.',
        stepsTitle: 'How to prepare', steps: SNACK_STEPS, after: 'No cooking needed.',
      },
      {
        time: '7:00 PM', name: 'Dinner', image: '/meal-ideas/day-glute-dinner.jpg',
        items: [
          ['Whole eggs', '2'],
          ['Carrots', '100 g'],
          ['Cucumber', '150 g'],
          ['Papaya', '150 g'],
          ['Walnuts', '20 g'],
          ['Olive oil', '5 g (1 tsp)'],
        ],
        kcal: '≈ 450 kcal', protein: '≈ 18 g protein',
        stepsTitle: 'How to cook',
        steps: [
          'Boil the carrots until tender.',
          'Boil the eggs for about 8–10 minutes.',
          'Cool and peel the eggs.',
          'Slice the cucumber.',
          'Cut the papaya into cubes.',
          'Put the carrots and cucumber in a bowl.',
          'Drizzle 1 tsp olive oil over the vegetables.',
          'Add the boiled eggs.',
          'Eat the papaya on the side.',
          'Finish with the walnuts.',
        ],
        optional: 'Add calamansi, black pepper, or a little salt.',
      },
    ],
  },
  {
    id: 'dp-light-1', type: 'light', name: 'Light Day',
    image: '/meal-ideas/day-light-plan.jpg', card: '/meal-ideas/day-light-card.jpg',
    totals: { kcal: '≈ 990–1,000 kcal', protein: '≈ 74 g protein', fiber: '≈ 25 g fiber' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal', image: '/meal-ideas/day-light-main.jpg',
        items: [
          ['Whole eggs', '2'],
          ['Egg whites', '150 g'],
          ['Green peas', '70 g'],
          ['Broccoli', '100 g'],
          ['Olive oil', '5 g (1 tsp)'],
        ],
        kcal: '≈ 360 kcal', protein: '≈ 35–36 g protein',
        why: [
          ['Eggs', 'protein + choline + fat'],
          ['Egg whites', 'lean protein'],
          ['Peas', 'fiber + folate'],
          ['Broccoli', 'fiber + vitamin C'],
          ['Olive oil', 'healthy fat + satiety'],
        ],
      },
      {
        time: '3:00 PM', name: 'Snack', snack: true, image: '/meal-ideas/day-light-snack.jpg',
        items: [
          ['1 medium apple', '~180 g'],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '10 g'],
        ],
        kcal: '≈ 225 kcal', protein: '≈ 11 g protein',
        stepsTitle: 'How to prepare', steps: SNACK_STEPS, after: 'No cooking needed.',
      },
      {
        time: '7:00 PM', name: 'Dinner', image: '/meal-ideas/day-light-dinner.jpg',
        items: [
          ['Chicken breast, cooked', '70 g'],
          ['Squash', '200 g'],
          ['Carrots', '100 g'],
          ['Cucumber', '150 g'],
          ['Walnuts', '10 g'],
          ['Olive oil', '10 g (about 2 tsp)'],
        ],
        kcal: '≈ 405 kcal', protein: '≈ 27 g protein',
      },
    ],
  },

  // Second plans (sent 2026-10-30), with fiber and iron too. Pictures are
  // cut from her photo of the whole day; there is no plan card for these.
  {
    id: 'dp-glute-2', type: 'glute', name: 'Beef + Greens Day',
    image: '/meal-ideas/day-glute-2-plan.jpg',
    totals: { kcal: '~1,200 kcal', protein: '~75 g protein', fiber: '~32 g fiber', iron: '~18 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Beef + Greens Bowl', image: '/meal-ideas/day-glute-2-main.jpg',
        items: [
          ['Lean ground beef, cooked', '100 g'],
          ['Cooked spinach', '120 g'],
          ['Green peas', '100 g'],
          ['Pumpkin seeds', '25 g'],
          ['Olive oil', '1 tsp (5 g)'],
          ['Black pepper, garlic, salt', ''],
        ],
        kcal: '~545 kcal', protein: '~42 g protein', fiber: '~10 g fiber', iron: '~10.5–11 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Heat a pan over medium heat.',
          'Cook the ground beef until completely browned.',
          'Season with garlic, pepper, and a little salt.',
          'Add the peas.',
          'Cook for another 2–3 minutes.',
          'Steam or boil spinach separately.',
          'Put spinach into your bowl.',
          'Add the beef and peas.',
          'Drizzle with 1 tsp olive oil.',
          'Sprinkle pumpkin seeds on top.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple Yogurt Bowl', snack: true, image: '/meal-ideas/day-glute-2-snack.jpg',
        items: [
          ['Apple', '1 medium (~180 g)'],
          ['High-protein Greek yogurt', '100 g'],
          ['Chia seeds', '15 g'],
          ['Walnuts', '10 g'],
        ],
        kcal: '~290 kcal', protein: '~13 g protein', fiber: '~10 g fiber', iron: '~1.5–2 mg iron',
        stepsTitle: 'How to prepare',
        steps: [
          'Slice the apple.',
          'Put yogurt in a bowl.',
          'Add the apple.',
          'Sprinkle chia seeds.',
          'Add walnuts.',
          'Mix or eat separately.',
        ],
      },
      {
        time: '7:00 PM', name: 'Dinner · Egg + Vegetable Plate', image: '/meal-ideas/day-glute-2-dinner.jpg',
        items: [
          ['Whole eggs', '2'],
          ['Broccoli', '150 g'],
          ['Carrots', '100 g'],
          ['Papaya', '150 g'],
          ['Sesame seeds', '15 g'],
        ],
        kcal: '~365 kcal', protein: '~20 g protein', fiber: '~12 g fiber', iron: '~5.5–6 mg iron',
        whyTitle: 'Why this dinner should satisfy you',
        why: [
          ['Eggs', 'protein + fat'],
          ['Vegetables', 'high food volume'],
          ['Sesame', 'fat + iron'],
          ['Papaya', 'fiber + vitamin C'],
        ],
        stepsTitle: 'How to cook',
        steps: [
          'Boil the eggs for 8–10 minutes.',
          'Steam the broccoli until tender.',
          'Boil or steam the carrots.',
          'Peel and halve the eggs.',
          'Put eggs, broccoli, and carrots on a plate.',
          'Sprinkle sesame seeds over the vegetables.',
          'Eat papaya on the side.',
        ],
      },
    ],
  },
  {
    id: 'dp-light-2', type: 'light', name: 'Chicken + Greens Day',
    image: '/meal-ideas/day-light-2-plan.jpg',
    totals: { kcal: '~1,000 kcal', protein: '~78 g protein', fiber: '~30 g fiber', iron: '~19–20 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Chicken + Greens Bowl', image: '/meal-ideas/day-light-2-main.jpg',
        items: [
          ['Chicken breast, cooked', '110 g'],
          ['Cooked spinach', '150 g'],
          ['Green peas', '100 g'],
          ['Pumpkin seeds', '20 g'],
          ['Olive oil', '1 tsp (5 g)'],
          ['Garlic, black pepper, salt', ''],
        ],
        kcal: '~455 kcal', protein: '~50 g protein', fiber: '~10–11 g fiber', iron: '~9–10 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Cut chicken into bite-size pieces.',
          'Season with garlic and black pepper.',
          'Cook chicken in a non-stick pan.',
          'Add the peas.',
          'Cook together for another 2–3 minutes.',
          'Steam or boil spinach.',
          'Put spinach in a bowl.',
          'Add chicken and peas.',
          'Drizzle with olive oil.',
          'Add pumpkin seeds.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple Yogurt Bowl', snack: true, image: '/meal-ideas/day-light-2-snack.jpg',
        items: [
          ['Apple', '1 medium (~180 g)'],
          ['High-protein Greek yogurt', '100 g'],
          ['Chia seeds', '15 g'],
        ],
        kcal: '~225 kcal', protein: '~12–13 g protein', fiber: '~9–10 g fiber', iron: '~1.5 mg iron',
        stepsTitle: 'How to prepare',
        steps: [
          'Slice the apple.',
          'Add yogurt to a bowl.',
          'Add apple.',
          'Sprinkle chia seeds.',
          'Mix and eat.',
        ],
      },
      {
        time: '7:00 PM', name: 'Dinner · Egg + Spinach + Broccoli Plate', image: '/meal-ideas/day-light-2-dinner.jpg',
        items: [
          ['Whole egg', '1'],
          ['Cooked spinach', '150 g'],
          ['Broccoli', '100 g'],
          ['Papaya', '190 g'],
          ['Sesame seeds', '10 g'],
          ['Olive oil', '1 tsp (5 g)'],
        ],
        kcal: '~320 kcal', protein: '~15 g protein', fiber: '~10 g fiber', iron: '~8–9 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Boil the egg for 8–10 minutes.',
          'Steam the spinach.',
          'Steam the broccoli.',
          'Put them on a plate.',
          'Peel and halve the boiled egg.',
          'Add sesame seeds.',
          'Drizzle with 1 tsp olive oil.',
          'Eat the papaya on the side.',
        ],
      },
    ],
  },
];

export const plansFor = type => DAY_PLANS.filter(p => p.type === type);

// The plan she hearted for a kind of day, else its first plan. Hearts live
// in gp_meal_picks (synced) as day-glute / day-light.
export const DAY_PICK_KEY = type => `day-${type}`;
export function chosenPlan(type) {
  let picks = {};
  try { picks = JSON.parse(localStorage.getItem('gp_meal_picks') || '{}') || {}; } catch { /* none */ }
  const list = plansFor(type);
  return { plan: list.find(p => p.id === picks[DAY_PICK_KEY(type)]) || list[0] || null, hearted: list.some(p => p.id === picks[DAY_PICK_KEY(type)]) };
}
