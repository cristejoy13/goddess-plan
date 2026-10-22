// Her meal ideas. She sends each one — its picture, ingredients, steps and
// nutrition — and it is added here by hand. Nothing here is made up: every
// number, ingredient and step below is hers, per serving.
//
// Her 10 new meals (sent 2026-10-22) replace the 20 + 4 before them, at her
// request. Calories, protein, fat, carbs and iron are her own approximate
// numbers; she sent no fiber, so none is shown. Lunch, dinner and snacks
// only — the Breakfast tab is empty for now. Which tab each meal sits in was
// left to us.
//
// Pictures: public/meal-ideas/m1–m10.jpg, shrunk from her full-size
// m1–m10.png (her Downloads 1–10.png, kept in the same folder, not deployed).

export const MEAL_IDEAS = [
  {
    id: 'n-l1', time: 'lunch', name: "Chicken + Green Peas", image: '/meal-ideas/m6.jpg',
    kcal: 350, protein: 50, carbs: 11, fat: 10.7, iron: 2.5,
    ingredients: [
      "Chicken breast — 150 g cooked",
      "Green peas — 70 g cooked",
      "Olive oil — 1 tsp (5 g)",
      "Black pepper — optional",
      "Salt — optional",
    ],
    steps: [
      "Cut the chicken into bite-size pieces.",
      "Heat 1 tsp olive oil in a pan.",
      "Cook or reheat the chicken until lightly browned.",
      "Add the green peas.",
      "Stir together for 2–3 minutes.",
      "Add black pepper and a little salt if desired.",
    ],
  },
  {
    id: 'n-l2', time: 'lunch', name: "Ground Beef + Peas + Eggs", image: '/meal-ideas/m2.jpg',
    kcal: 600, protein: 54, carbs: 12, fat: 39, iron: 6.4,
    ingredients: [
      "Cooked ground beef — 150 g",
      "Green peas — 70 g cooked",
      "Medium whole eggs — 2",
      "Olive oil — 1 tsp (5 g)",
      "Black pepper — optional",
      "Cayenne pepper — optional",
      "Pumpkin seeds — optional",
    ],
    steps: [
      "Heat 1 tsp olive oil in a pan.",
      "Add the ground beef and cook until browned.",
      "Add the green peas and stir.",
      "Crack 2 eggs directly into the pan.",
      "Scramble the eggs through the beef and peas.",
      "Cook until the eggs are fully set.",
      "Season with black pepper or a small pinch of cayenne.",
      "Add a few pumpkin seeds on top if desired.",
    ],
    note: "The beef numbers vary the most depending on how lean your ground beef is. Leaner ground beef = fewer calories and less fat.",
  },
  {
    id: 'n-l3', time: 'lunch', name: "Mung Bean + Sprout + Malunggay Soup", image: '/meal-ideas/m10.jpg',
    kcal: 200, protein: 15, carbs: 36, fat: 1.2, iron: 3.8,
    ingredients: [
      "Cooked mung beans — 150 g",
      "Mung bean sprouts — 50 g",
      "Malunggay leaves — 30 g",
      "Fresh ginger — 10 g, sliced",
      "Water — 300–400 ml",
      "Salt — optional",
      "Black pepper — optional",
    ],
    steps: [
      "Put cooked mung beans and water in a pot.",
      "Add sliced ginger.",
      "Simmer for about 5–10 minutes.",
      "Add the mung bean sprouts.",
      "Add malunggay leaves last.",
      "Simmer for another 2–3 minutes.",
      "Season lightly if desired.",
    ],
  },
  {
    id: 'n-l4', time: 'lunch', name: "Scrambled Eggs + Sweet Potato + Carrots", image: '/meal-ideas/m9.jpg',
    kcal: 281, protein: 13, carbs: 26.5, fat: 13.7, iron: 2.5,
    ingredients: [
      "Medium whole eggs — 2",
      "Boiled sweet potato — 100 g",
      "Boiled carrots — 100 g",
      "Olive oil — 1 tsp (5 g)",
      "1 calamansi",
      "Black pepper — optional",
      "Salt — optional",
    ],
    steps: [
      "Boil the sweet potato and carrots until soft.",
      "Beat the 2 eggs.",
      "Scramble the eggs in a non-stick pan.",
      "Put the eggs, sweet potato, and carrots in one bowl.",
      "Drizzle 1 tsp olive oil over the vegetables.",
      "Squeeze calamansi on top.",
      "Add black pepper or salt if desired.",
    ],
  },
  {
    id: 'n-d1', time: 'dinner', name: "Boiled Eggs + Kimchi + Sesame Oil", image: '/meal-ideas/m3.jpg',
    kcal: 240, protein: 17, carbs: 2, fat: 18, iron: 2.8,
    ingredients: [
      "Medium boiled eggs — 3",
      "Kimchi — 50 g",
      "Sesame oil — 1 tsp (5 g)",
      "Sesame seeds — optional",
      "Black pepper — optional",
    ],
    steps: [
      "Boil the eggs and peel them.",
      "Cut each egg in half.",
      "Place kimchi on top of the eggs.",
      "Drizzle 1 tsp sesame oil over everything.",
      "Sprinkle sesame seeds and black pepper if desired.",
    ],
  },
  {
    id: 'n-d2', time: 'dinner', name: "Carrot + Cucumber Noodle Salad", image: '/meal-ideas/m4.jpg',
    kcal: 150, protein: 4, carbs: 25, fat: 5.5, iron: 1.4,
    ingredients: [
      "Carrot — 100 g, spiralized",
      "Cucumber — 150 g, spiralized",
      "Red onion — 30 g, thinly sliced",
      "Sibuyas dahon / spring onion — 10 g",
      "Sesame oil — 1 tsp (5 g)",
      "Soy sauce — 1 tbsp",
      "Vinegar — 1 tbsp",
      "Lemon juice — 1 tbsp",
      "Honey — 1 tsp",
      "Garlic — 1 clove, minced",
      "Chili powder — small pinch",
      "Cayenne pepper — small pinch",
      "Sesame seeds — optional",
      "Pumpkin seeds — optional",
    ],
    steps: [
      "Spiralize the carrot and cucumber.",
      "Thinly slice the red onion and sibuyas dahon.",
      "Mix sesame oil, soy sauce, vinegar, lemon juice, honey, garlic, chili powder, and cayenne.",
      "Pour the dressing over the vegetables.",
      "Toss well.",
      "Top with sibuyas dahon.",
      "Add a small sprinkle of sesame or pumpkin seeds if desired.",
    ],
    note: "Adding seeds will increase calories.",
  },
  {
    id: 'n-d3', time: 'dinner', name: "Sweet Potato + Carrot with Olive Oil", image: '/meal-ideas/m1.jpg',
    kcal: 193, protein: 3, carbs: 35, fat: 5.3, iron: 1.2,
    ingredients: [
      "Boiled sweet potato — 150 g",
      "Boiled carrots — 100 g",
      "Olive oil — 1 tsp (5 g)",
      "1 calamansi",
      "Black pepper — optional",
      "Sesame seeds — optional",
      "Pumpkin seeds — optional",
    ],
    steps: [
      "Boil the sweet potato and carrots until tender.",
      "Cut into bite-size pieces.",
      "Put them into a bowl.",
      "Drizzle 1 tsp olive oil on top.",
      "Squeeze calamansi over everything.",
      "Add black pepper if desired.",
      "Add only a small amount of seeds if you want toppings.",
    ],
  },
  {
    id: 'n-d4', time: 'dinner', name: "Fried Eggs in Olive Oil", image: '/meal-ideas/m8.jpg',
    kcal: 170, protein: 11, carbs: 0.6, fat: 13.4, iron: 1.6,
    ingredients: [
      "Medium whole eggs — 2",
      "Olive oil — 1 tsp (5 g)",
      "Black pepper — optional",
      "Salt — optional",
      "Cayenne pepper — optional",
    ],
    steps: [
      "Heat 1 tsp olive oil in a pan.",
      "Crack in the 2 eggs.",
      "Fry until the whites are cooked and the yolks reach your preferred doneness.",
      "Season lightly with black pepper, salt, or cayenne.",
    ],
  },
  {
    id: 'n-s1', time: 'snacks', name: "Apple + Yogurt", image: '/meal-ideas/m5.jpg',
    kcal: 170, protein: 11.5, carbs: 19.4, fat: 6.2, iron: 0.2,
    ingredients: [
      "Apple — 100 g, sliced",
      "Greek yogurt — 100 g",
    ],
    steps: [
      "Slice the apple.",
      "Put the Greek yogurt in a bowl.",
      "Add the apple on top.",
      "Serve cold.",
    ],
  },
  {
    id: 'n-s2', time: 'snacks', name: "Banana Apple Smoothie", image: '/meal-ideas/m7.jpg',
    kcal: 325, protein: 5.7, carbs: 53, fat: 12.5, iron: 1.7,
    ingredients: [
      "Frozen banana — 100 g",
      "Frozen apple — 100 g",
      "Water — 150–250 ml",
      "Chia seeds — 1 tsp (~5 g)",
      "Toppings: walnuts — 10 g",
      "Toppings: granola — 20 g",
    ],
    steps: [
      "Put frozen banana, frozen apple, chia seeds, and water into a blender.",
      "Blend until thick and creamy.",
      "Add a little more water if needed.",
      "Pour into a bowl or glass.",
      "Top with 10 g walnuts and 20 g granola.",
    ],
  },
];

// Any 1 of each meal time that has ideas, added up: the lowest and highest
// day those mixes make.
const TIMES_WITH_IDEAS = [...new Set(MEAL_IDEAS.map(i => i.time))];
const kcalOf = (time, pick) => pick(...MEAL_IDEAS.filter(i => i.time === time).map(i => i.kcal));
export const DAY_RANGE = {
  times: TIMES_WITH_IDEAS,
  kcalLow: TIMES_WITH_IDEAS.reduce((s, t) => s + kcalOf(t, Math.min), 0),
  kcalHigh: TIMES_WITH_IDEAS.reduce((s, t) => s + kcalOf(t, Math.max), 0),
};

// Her notes for every meal (replaced 2026-10-22 with her new recipes).
export const NUTRITION_NOTES = [
  'All numbers are approximate.',
];

export const PREP_TIPS = [];

export function ideasFor(time) {
  return MEAL_IDEAS.filter(i => i.time === time);
}
