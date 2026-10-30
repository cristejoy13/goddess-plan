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
    days: [0, 3, 5], kcal: '1,200 kcal', kcalGoal: 1200,
  },
  {
    id: 'light', name: 'Light Days', one: 'Light day', cover: '/meal-ideas/day-light-cover.jpg',
    days: [1, 2, 4, 6], kcal: '1,000 kcal', kcalGoal: 1000,
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

// The apple + yogurt + chia snack in her fourth plans (light day's steps).
const APPLE_YOGURT_STEPS = ['Slice the apple.', 'Add yogurt to a bowl.', 'Add apple.', 'Sprinkle chia seeds.', 'Mix and eat.'];

export const DAY_PLANS = [
  {
    id: 'dp-glute-1', type: 'glute', name: 'Glute Day',
    image: '/meal-ideas/day-glute-plan.jpg', card: '/meal-ideas/day-glute-card.jpg',
    totals: { kcal: '≈ 1,200 kcal', protein: '≈ 79 g protein', fiber: '≈ 26 g fiber', carbs: '≈ 105 g carbs' },
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

  // Third plans (sent 2026-10-30), same layout as the second.
  {
    id: 'dp-glute-3', type: 'glute', name: 'Mussels + Mung Bean Day',
    image: '/meal-ideas/day-glute-3-plan.jpg',
    totals: { kcal: '≈ 1,200 kcal', protein: '≈ 78 g protein', fiber: '≈ 30 g fiber', iron: '≈ 18–20 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Mussels + Mung Bean Bowl', image: '/meal-ideas/day-glute-3-main.jpg',
        items: [
          ['Cooked mussels', '120 g'],
          ['Cooked mung beans', '120 g'],
          ['Malunggay leaves', '50 g'],
          ['Carrots', '100 g'],
          ['Cooked squash', '150 g'],
          ['Olive oil', '10 g'],
          ['Calamansi', '1–2'],
        ],
        kcal: '≈ 520 kcal', protein: '≈ 43 g protein', fiber: '≈ 13 g fiber', iron: '≈ 12–14 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Cook or steam the mussels.',
          'Boil mung beans until soft.',
          'Add sliced carrots and squash.',
          'Add malunggay near the end of cooking.',
          'Add the mussels.',
          'Cook for another 2–3 minutes.',
          'Put everything into a bowl.',
          'Drizzle olive oil on top.',
          'Squeeze calamansi before eating.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple + Yogurt Bowl', snack: true, image: '/meal-ideas/day-glute-3-snack.jpg',
        items: [
          ['1 medium apple', ''],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '10 g'],
          ['Almonds', '15 g'],
        ],
        kcal: '≈ 270 kcal', protein: '≈ 13 g protein', fiber: '≈ 9 g fiber', iron: '≈ 1.5–2 mg iron',
        stepsTitle: 'How to prepare',
        steps: [
          'Slice the apple.',
          'Put yogurt in a bowl.',
          'Add the apple.',
          'Add chia seeds.',
          'Add almonds.',
        ],
      },
      {
        time: '7:00 PM', name: 'Dinner · Egg + Edamame Plate', image: '/meal-ideas/day-glute-3-dinner.jpg',
        items: [
          ['Whole eggs', '2'],
          ['Cooked edamame', '100 g'],
          ['Cabbage', '150 g'],
          ['Cucumber', '150 g'],
          ['Sesame seeds', '10 g'],
          ['Papaya', '150 g'],
        ],
        kcal: '≈ 410 kcal', protein: '≈ 22 g protein', fiber: '≈ 8–9 g fiber', iron: '≈ 5 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Boil the eggs.',
          'Steam or boil edamame.',
          'Lightly steam cabbage or leave it crunchy.',
          'Slice cucumber.',
          'Put everything onto one plate.',
          'Sprinkle sesame seeds.',
          'Eat papaya on the side.',
        ],
      },
    ],
  },
  {
    id: 'dp-light-3', type: 'light', name: 'Shrimp + Mung Bean Day',
    image: '/meal-ideas/day-light-3-plan.jpg',
    totals: { kcal: '≈ 1,000 kcal', protein: '≈ 73–77 g protein', fiber: '≈ 30 g fiber', iron: '≈ 18 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Shrimp + Mung Bean Vegetable Bowl', image: '/meal-ideas/day-light-3-main.jpg',
        items: [
          ['Cooked shrimp', '120 g'],
          ['Cooked mung beans', '130 g'],
          ['Malunggay', '50 g'],
          ['Cabbage', '150 g'],
          ['Carrots', '100 g'],
          ['Sesame seeds', '10 g'],
        ],
        kcal: '≈ 420 kcal', protein: '≈ 40 g protein', fiber: '≈ 13–14 g fiber', iron: '≈ 8–9 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Boil mung beans until soft.',
          'Add carrots and cabbage.',
          'Add shrimp.',
          'Cook until the shrimp are completely cooked.',
          'Add malunggay last.',
          'Simmer for 2 minutes.',
          'Put into a bowl.',
          'Sprinkle sesame seeds on top.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple + Yogurt Bowl', snack: true, image: '/meal-ideas/day-light-3-snack.jpg',
        items: [
          ['1 medium apple', ''],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '15 g'],
        ],
        kcal: '≈ 225 kcal', protein: '≈ 12 g protein', fiber: '≈ 10 g fiber', iron: '≈ 1.5 mg iron',
        stepsTitle: 'How to prepare',
        steps: [
          'Slice the apple.',
          'Add yogurt to a bowl.',
          'Add apple.',
          'Add chia seeds.',
          'Mix and eat.',
        ],
      },
      {
        time: '7:00 PM', name: 'Dinner · Egg + Tofu + Vegetable Plate', image: '/meal-ideas/day-light-3-dinner.jpg',
        items: [
          ['Whole egg', '1'],
          ['Firm tofu', '100 g'],
          ['Cooked spinach', '120 g'],
          ['Broccoli', '100 g'],
          ['Pumpkin seeds', '15 g'],
          ['Calamansi', '1'],
        ],
        kcal: '≈ 355 kcal', protein: '≈ 23–25 g protein', fiber: '≈ 7 g fiber', iron: '≈ 8–9 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Cut tofu into cubes.',
          'Pan-sear tofu in a non-stick pan.',
          'Boil the egg.',
          'Steam spinach and broccoli.',
          'Put everything on one plate.',
          'Sprinkle pumpkin seeds.',
          'Squeeze calamansi over the vegetables.',
        ],
      },
    ],
  },
  // Fourth plans (sent 2026-10-30). The glute day came with two daily totals;
  // this shows the one at the end of her plan. Its snack is the same as the
  // light day's, so it shares those steps; its dinner came without steps.
  {
    id: 'dp-glute-4', type: 'glute', name: 'Beef + Chickpea Quinoa Day',
    image: '/meal-ideas/day-glute-4-plan.jpg',
    totals: { kcal: '≈ 1,195 kcal', protein: '≈ 77–80 g protein', fiber: '≈ 30 g fiber', iron: '≈ 18–20 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Lean Beef + Chickpea Quinoa Bowl', image: '/meal-ideas/day-glute-4-main.jpg',
        items: [
          ['Lean beef, cooked', '90 g'],
          ['Cooked chickpeas', '100 g'],
          ['Cooked quinoa', '100 g'],
          ['Cooked kale', '100 g'],
          ['Sunflower seeds', '15 g'],
          ['Tahini', '15 g'],
          ['Olive oil', '5 g'],
          ['Lemon or calamansi', ''],
        ],
        kcal: '≈ 680 kcal', protein: '≈ 42–44 g protein', fiber: '≈ 13–14 g fiber', iron: '≈ 10–11 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Season the beef with garlic and black pepper.',
          'Cook it in a pan until fully browned.',
          'Cook quinoa separately.',
          'Steam or sauté the kale.',
          'Warm the chickpeas.',
          'Put quinoa in a bowl.',
          'Add beef, chickpeas, and kale.',
          'Sprinkle sunflower seeds.',
          'Add tahini.',
          'Drizzle olive oil.',
          'Squeeze lemon or calamansi on top.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple + Yogurt', snack: true, image: '/meal-ideas/day-glute-4-snack.jpg',
        items: [
          ['1 medium apple', ''],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '15 g'],
        ],
        kcal: '≈ 225 kcal', protein: '≈ 8–11 g protein', fiber: '≈ 9–10 g fiber', iron: '≈ 1.5 mg iron',
        stepsTitle: 'How to prepare', steps: APPLE_YOGURT_STEPS,
      },
      {
        time: '7:00 PM', name: 'Dinner · Sardine + White Bean Vegetable Bowl', image: '/meal-ideas/day-glute-4-dinner.jpg',
        items: [
          ['Sardines', '60 g'],
          ['Cooked white beans', '80 g'],
          ['Bok choy', '150 g'],
          ['Sesame seeds', '10 g'],
          ['Calamansi or lemon', ''],
          ['Black pepper', ''],
        ],
        kcal: '≈ 290 kcal', protein: '≈ 25–27 g protein', fiber: '≈ 7–8 g fiber', iron: '≈ 7–8 mg iron',
      },
    ],
  },
  {
    id: 'dp-light-4', type: 'light', name: 'Tuna + Black Bean Day',
    image: '/meal-ideas/day-light-4-plan.jpg',
    totals: { kcal: '≈ 1,000 kcal', protein: '≈ 72–76 g protein', fiber: '≈ 29–32 g fiber', iron: '≈ 18–20 mg iron' },
    meals: [
      {
        time: '1:00 PM', name: 'Main Meal · Tuna + Black Bean Kangkong Bowl', image: '/meal-ideas/day-light-4-main.jpg',
        items: [
          ['Tuna in water, drained', '100 g'],
          ['Cooked black beans', '120 g'],
          ['Kangkong', '150 g'],
          ['Sesame seeds', '15 g'],
          ['Olive oil', '5 g'],
          ['Garlic', ''],
          ['Calamansi', ''],
        ],
        kcal: '≈ 445–460 kcal', protein: '≈ 45–47 g protein', fiber: '≈ 14–15 g fiber', iron: '≈ 8–9 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Drain the tuna.',
          'Warm the black beans.',
          'Sauté garlic in 1 tsp olive oil.',
          'Add kangkong.',
          'Cook until wilted.',
          'Add the black beans.',
          'Add tuna last.',
          'Mix gently.',
          'Sprinkle sesame seeds.',
          'Squeeze calamansi before eating.',
        ],
      },
      {
        time: '3:00 PM', name: 'Snack · Apple + Yogurt', snack: true, image: '/meal-ideas/day-light-4-snack.jpg',
        items: [
          ['1 medium apple', ''],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', '15 g'],
        ],
        kcal: '≈ 225 kcal', protein: '≈ 8–11 g protein', fiber: '≈ 9–10 g fiber', iron: '≈ 1.5 mg iron',
        stepsTitle: 'How to prepare', steps: APPLE_YOGURT_STEPS,
      },
      {
        time: '7:00 PM', name: 'Dinner · Oyster + Mushroom Cauliflower Plate', image: '/meal-ideas/day-light-4-dinner.jpg',
        items: [
          ['Cooked or canned oysters, drained', '85 g'],
          ['Cauliflower', '200 g'],
          ['Mushrooms', '150 g'],
          ['Olive oil', '10 g'],
          ['Garlic', ''],
          ['Black pepper', ''],
          ['Lemon or calamansi', ''],
        ],
        kcal: '≈ 310–330 kcal', protein: '≈ 19–21 g protein', fiber: '≈ 6–7 g fiber', iron: '≈ 8–9 mg iron',
        whyTitle: 'Why dinner helps satiety',
        why: [
          ['Oysters', 'protein + iron'],
          ['Cauliflower', 'high volume + fiber'],
          ['Mushrooms', 'volume + micronutrients'],
          ['Olive oil', 'fat for longer satiety'],
        ],
        stepsTitle: 'How to cook',
        steps: [
          'Steam the cauliflower.',
          'Slice the mushrooms.',
          'Heat olive oil in a pan.',
          'Add garlic and mushrooms.',
          'Cook until mushrooms become tender.',
          'Add the oysters.',
          'Heat gently until completely warmed.',
          'Serve with cauliflower.',
          'Add black pepper.',
          'Squeeze lemon or calamansi on top.',
        ],
      },
    ],
  },
  // Fifth plans (sent 2026-10-30): built round the workout — before, after,
  // then a 7 PM choice of two. Her numbers came for the glute day only (the
  // 7 PM numbers are for the apple + yogurt); the light day has none, so none
  // are shown. Only the option with numbers goes on the calendar when the
  // plan is hearted; the soup is the other choice.
  {
    id: 'dp-glute-5', type: 'glute', name: 'Coffee + Chicken Day',
    image: '/meal-ideas/day-glute-5-plan.jpg',
    totals: { kcal: '≈ 800–890 kcal', protein: '≈ 66–69 g protein', fiber: '≈ 16–18 g fiber', iron: '≈ 7–8 mg iron' },
    meals: [
      {
        time: 'Before workout', name: 'Coffee + Toast', image: '/meal-ideas/day-glute-5-before.jpg',
        items: [
          ['Kopiko Blanca', '1 sachet'],
          ['Espresso', '1 shot'],
          ['Hot water', ''],
          ['Bread', '1 slice'],
        ],
        kcal: '≈ 180–220 kcal', protein: '~4–6 g protein', carbs: '~32–38 g carbs', fat: '~4–6 g fat', fiber: '~2 g fiber', iron: '~1 mg iron',
        stepsTitle: 'How to make',
        steps: [
          'Prepare 1 shot of espresso.',
          'Put Kopiko Blanca in a cup.',
          'Add hot water.',
          'Add the espresso.',
          'Stir well.',
          'Toast 1 slice of bread.',
          'Eat the toast with your coffee.',
        ],
      },
      {
        time: 'After workout', name: 'Chicken + Spinach + Papaya', image: '/meal-ideas/day-glute-5-after.jpg',
        items: [
          ['Chicken breast, cooked', '150 g'],
          ['Spinach', '100 g'],
          ['Papaya', '150–200 g'],
          ['Olive oil', '1 tsp'],
          ['Garlic', '2 cloves'],
          ['Black pepper', ''],
          ['Salt', 'optional'],
          ['Calamansi', 'optional'],
        ],
        kcal: '≈ 380–420 kcal', protein: '~50 g protein', carbs: '~20–25 g carbs', fat: '~10–12 g fat', fiber: '~6–7 g fiber', iron: '~5–6 mg iron',
        stepsTitle: 'How to cook',
        steps: [
          'Cut chicken into bite-size pieces.',
          'Heat olive oil in a pan.',
          'Add minced garlic.',
          'Add chicken.',
          'Cook or reheat until the chicken is hot.',
          'Add spinach.',
          'Cook until spinach wilts.',
          'Season with black pepper.',
          'Put on a plate.',
          'Eat papaya on the side.',
          'Squeeze calamansi over the chicken if you want.',
        ],
      },
      {
        time: '7:00 PM', option: 1, name: 'Option 1 · Light Vegetable Soup', image: '/meal-ideas/day-glute-5-soup.jpg',
        items: [
          ['Cabbage', '100 g'],
          ['Carrots', '70 g'],
          ['Mushrooms', '100 g'],
          ['Ginger', '5–10 g'],
          ['Garlic', '2 cloves'],
          ['Water', '400 ml'],
          ['Salt', 'small amount'],
          ['Black pepper', ''],
        ],
        stepsTitle: 'How to cook',
        steps: [
          'Boil the water.',
          'Add ginger and garlic.',
          'Add carrots.',
          'Cook for 5 minutes.',
          'Add mushrooms and cabbage.',
          'Simmer for 5–7 minutes.',
          'Add salt and pepper.',
        ],
      },
      {
        time: '7:00 PM', option: 2, name: 'Option 2 · Apple + Yogurt', image: '/meal-ideas/day-glute-5-yogurt.jpg',
        kcal: '≈ 230–250 kcal', protein: '~11–13 g protein', carbs: '~35–40 g carbs', fat: '~5–7 g fat', fiber: '~8–9 g fiber', iron: '~1 mg iron',
        items: [
          ['Apple', '1 medium'],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', 'optional'],
        ],
        stepsTitle: 'How to make',
        steps: [
          'Slice the apple.',
          'Put yogurt in a bowl.',
          'Add apple.',
          'Add chia seeds if desired.',
          'Mix and eat.',
        ],
      },
    ],
  },
  {
    id: 'dp-light-5', type: 'light', name: 'Smoothie + Eggs Day',
    image: '/meal-ideas/day-light-5-plan.jpg',
    totals: {},
    meals: [
      {
        time: 'Before workout', name: 'Smoothie', image: '/meal-ideas/day-light-5-before.jpg',
        items: [
          ['Soy milk', '200 ml'],
          ['Banana', '1 small'],
          ['Apple', '1/2 medium'],
          ['Collagen powder', '10 g'],
          ['Granola', '15 g'],
          ['Mixed nuts', '10 g'],
          ['Ice', 'optional'],
        ],
        stepsTitle: 'How to make',
        steps: [
          'Add soy milk to the blender.',
          'Add banana and apple.',
          'Add collagen powder.',
          'Add ice if you want it colder.',
          'Blend until smooth.',
          'Pour into a glass or bowl.',
          'Add granola and nuts on top.',
        ],
      },
      {
        time: 'After workout', name: 'Boiled Eggs with Sesame + Soy', image: '/meal-ideas/day-light-5-after.jpg',
        items: [
          ['Whole eggs', '2'],
          ['Sesame oil', '1 tsp'],
          ['Soy sauce', '1 tsp'],
          ['Calamansi', '1'],
          ['Black pepper', 'optional'],
          ['Sesame seeds', 'optional'],
        ],
        stepsTitle: 'How to make',
        steps: [
          'Put eggs in a pot.',
          'Cover with water.',
          'Boil for about 8–10 minutes.',
          'Cool and peel.',
          'Cut eggs in half.',
          'Mix sesame oil and soy sauce.',
          'Drizzle over the eggs.',
          'Squeeze calamansi on top.',
          'Add black pepper or sesame seeds if you want.',
        ],
      },
      {
        time: '7:00 PM', option: 1, name: 'Option 1 · Light Vegetable Soup', image: '/meal-ideas/day-light-5-soup.jpg',
        items: [
          ['Cabbage', '100 g'],
          ['Carrots', '70 g'],
          ['Mushrooms', '100 g'],
          ['Ginger', '5–10 g'],
          ['Garlic', '2 cloves'],
          ['Water', '400 ml'],
          ['Salt', 'small amount'],
          ['Black pepper', ''],
        ],
        stepsTitle: 'How to cook',
        steps: [
          'Boil the water.',
          'Add sliced ginger and garlic.',
          'Add carrots.',
          'Cook for 5 minutes.',
          'Add mushrooms and cabbage.',
          'Simmer another 5–7 minutes.',
          'Add salt and pepper.',
        ],
      },
      {
        time: '7:00 PM', option: 2, name: 'Option 2 · Apple + Yogurt', image: '/meal-ideas/day-light-5-yogurt.jpg',
        items: [
          ['Apple', '1 medium'],
          ['Greek yogurt', '100 g'],
          ['Chia seeds', 'optional'],
        ],
        stepsTitle: 'How to make',
        steps: [
          'Slice the apple.',
          'Put yogurt in a bowl.',
          'Add apple.',
          'Add chia seeds if desired.',
          'Mix and eat.',
        ],
      },
    ],
  },
];

export const plansFor = type => DAY_PLANS.filter(p => p.type === type);

// A number from her text, for the calendar: "≈ 545 kcal" → 545. A range
// ("≈ 445–460 kcal") counts as its middle, 453 — the calendar needs one number.
export function numOf(text, decimals = 0) {
  const n = (String(text || '').match(/\d[\d,]*(?:\.\d+)?/g) || []).map(x => Number(x.replace(/,/g, '')));
  if (!n.length) return undefined;
  const v = n.slice(0, 2).reduce((a, b) => a + b, 0) / Math.min(n.length, 2);
  const f = 10 ** decimals;
  return Math.round(v * f) / f;
}
// "1:00 PM" → "13:00", as the calendar writes times; null for "Before workout".
export function time24(text) {
  const m = String(text || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return null;
  let h = Number(m[1]) % 12;
  if (/pm/i.test(m[3])) h += 12;
  return `${String(h).padStart(2, '0')}:${m[2]}`;
}

// Every food in a plan, once. A food in two meals keeps both amounts as she
// wrote them ("5 g + 10 g"); nothing is added up or changed.
export function shopList(plan) {
  const out = [];
  for (const m of plan.meals) {
    for (const [food, amount] of m.items) {
      const hit = out.find(x => x.food.toLowerCase() === food.toLowerCase());
      if (hit) { if (amount) hit.amounts.push(amount); } else out.push({ food, amounts: amount ? [amount] : [] });
    }
  }
  return out;
}

// The plan she hearted for a kind of day, else its first plan. Hearts live
// in gp_meal_picks (synced) as day-glute / day-light.
export const DAY_PICK_KEY = type => `day-${type}`;
export function chosenPlan(type) {
  let picks = {};
  try { picks = JSON.parse(localStorage.getItem('gp_meal_picks') || '{}') || {}; } catch { /* none */ }
  const list = plansFor(type);
  return { plan: list.find(p => p.id === picks[DAY_PICK_KEY(type)]) || list[0] || null, hearted: list.some(p => p.id === picks[DAY_PICK_KEY(type)]) };
}
