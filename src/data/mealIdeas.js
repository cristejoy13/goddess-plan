// Her meal ideas (2026-10-10). She sends each one — its picture, ingredients,
// steps and nutrition — and it is added here by hand, one at a time. Nothing
// here is made up: the list starts empty and holds only what she sends.
//
// Pictures go in public/meal-ideas/ and are named after the idea's id.
//
// One idea looks like this:
//   {
//     id: 'strawberry-oat-bowl',            // short, unique, used for the heart
//     time: 'breakfast',                    // breakfast | lunch | dinner | snacks
//     name: 'Strawberry Oat Bowl',
//     image: '/meal-ideas/strawberry-oat-bowl.jpg',
//     kcal: 0, protein: 0, carbs: 0, fat: 0, // her numbers, per serving
//     ingredients: ['…', '…'],
//     steps: ['…', '…'],
//   }
// Her 20-meal plan (sent 2026-10-11): one breakfast + one lunch + one dinner
// + one snack makes about 1,075–1,186 cal and 56–65 g protein a day. Every
// number below is hers, per serving. Pictures are hers too (public/meal-ideas,
// shrunk copies of her 1–20.png). She sent no per-meal steps; her cooking
// notes, which apply to every meal, are COOKING_NOTES below.
export const MEAL_IDEAS = [
  {
    id: 'b1', time: 'breakfast', name: 'Eggs, Sweet Potato & Apple', image: '/meal-ideas/b1.jpg',
    kcal: 277, protein: 14.7, carbs: 33.1, fat: 9.7,
    ingredients: [
      '2 whole eggs — 100 g',
      'Sweet potato — 120 g',
      'Apple — 60 g',
    ],
  },
  {
    id: 'b2', time: 'breakfast', name: 'Greek Yogurt, Apple & Sweet Potato', image: '/meal-ideas/b2.jpg',
    kcal: 257, protein: 13.8, carbs: 45.2, fat: 3.0,
    ingredients: [
      'Plain Greek yogurt — 130 g',
      'Apple — 130 g',
      'Sweet potato — 110 g',
    ],
  },
  {
    id: 'b3', time: 'breakfast', name: 'Egg, Yogurt & Sweet Potato', image: '/meal-ideas/b3.jpg',
    kcal: 255, protein: 15.8, carbs: 32.7, fat: 6.5,
    ingredients: [
      '1 whole egg — 50 g',
      'Plain Greek yogurt — 80 g',
      'Sweet potato — 145 g',
    ],
  },
  {
    id: 'b4', time: 'breakfast', name: 'Egg & Green Pea Breakfast Hash', image: '/meal-ideas/b4.jpg',
    kcal: 265, protein: 14.9, carbs: 34.8, fat: 7.4,
    ingredients: [
      '1½ whole eggs — 75 g',
      'Green peas — 65 g',
      'Sweet potato — 120 g',
    ],
  },
  {
    id: 'b5', time: 'breakfast', name: 'Yogurt, Egg & Fruit Breakfast Plate', image: '/meal-ideas/b5.jpg',
    kcal: 276, protein: 16.6, carbs: 37.8, fat: 7.0,
    ingredients: [
      'Plain Greek yogurt — 95 g',
      'Apple — 120 g',
      '1 whole egg — 50 g',
      'Sweet potato — 85 g',
    ],
  },
  {
    id: 'l1', time: 'lunch', name: 'Chicken & Sweet Potato Bowl', image: '/meal-ideas/l1.jpg',
    kcal: 367, protein: 20.4, carbs: 45.5, fat: 12.6,
    ingredients: [
      'Cooked chicken breast — 40 g',
      'Sweet potato — 135 g',
      'Green peas — 85 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'l2', time: 'lunch', name: 'Beef & Sweet Potato Plate', image: '/meal-ideas/l2.jpg',
    kcal: 381, protein: 19.0, carbs: 46.3, fat: 14.3,
    ingredients: [
      'Cooked lean beef — 40 g',
      'Sweet potato — 135 g',
      'Green peas — 90 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'l3', time: 'lunch', name: 'Egg & Avocado Power Bowl', image: '/meal-ideas/l3.jpg',
    kcal: 395, protein: 17.7, carbs: 42.3, fat: 18.2,
    ingredients: [
      'Whole eggs — 75 g',
      'Sweet potato — 105 g',
      'Green peas — 100 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'l4', time: 'lunch', name: 'Chicken, Peas & Avocado Bowl', image: '/meal-ideas/l4.jpg',
    kcal: 375, protein: 19.8, carbs: 47.0, fat: 13.2,
    ingredients: [
      'Cooked chicken breast — 35 g',
      'Sweet potato — 125 g',
      'Green peas — 105 g',
      'Avocado — 65 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'l5', time: 'lunch', name: 'Beef, Peas & Avocado Bowl', image: '/meal-ideas/l5.jpg',
    kcal: 381, protein: 19.3, carbs: 44.2, fat: 15.1,
    ingredients: [
      'Cooked lean beef — 40 g',
      'Sweet potato — 115 g',
      'Green peas — 100 g',
      'Avocado — 65 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'd1', time: 'dinner', name: 'Chicken & Roasted Sweet Potato', image: '/meal-ideas/d1.jpg',
    kcal: 333, protein: 18.1, carbs: 39.7, fat: 12.3,
    ingredients: [
      'Cooked chicken breast — 35 g',
      'Sweet potato — 110 g',
      'Green peas — 80 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'd2', time: 'dinner', name: 'Lean Beef & Green Peas Plate', image: '/meal-ideas/d2.jpg',
    kcal: 343, protein: 17.7, carbs: 37.9, fat: 14.3,
    ingredients: [
      'Cooked lean beef — 40 g',
      'Sweet potato — 105 g',
      'Green peas — 75 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'd3', time: 'dinner', name: 'Egg & Avocado Dinner Bowl', image: '/meal-ideas/d3.jpg',
    kcal: 358, protein: 17.4, carbs: 33.2, fat: 18.1,
    ingredients: [
      'Whole egg — 85 g',
      'Sweet potato — 75 g',
      'Green peas — 80 g',
      'Avocado — 60 g',
      'Olive oil — 1 g',
    ],
  },
  {
    id: 'd4', time: 'dinner', name: 'Chicken & Green Pea Skillet', image: '/meal-ideas/d4.jpg',
    kcal: 341, protein: 19.1, carbs: 40.8, fat: 12.4,
    ingredients: [
      'Cooked chicken breast — 35 g',
      'Sweet potato — 100 g',
      'Green peas — 100 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 'd5', time: 'dinner', name: 'Beef & Sweet Potato Dinner', image: '/meal-ideas/d5.jpg',
    kcal: 350, protein: 17.3, carbs: 41.2, fat: 13.9,
    ingredients: [
      'Cooked lean beef — 35 g',
      'Sweet potato — 110 g',
      'Green peas — 90 g',
      'Avocado — 60 g',
      'Olive oil — 2 g',
    ],
  },
  {
    id: 's1', time: 'snacks', name: 'Greek Yogurt & Apple', image: '/meal-ideas/s1.jpg',
    kcal: 152, protein: 7.7, carbs: 28.0, fat: 2.0,
    ingredients: [
      'Plain Greek yogurt — 80 g',
      'Apple — 180 g',
    ],
  },
  {
    id: 's2', time: 'snacks', name: 'Boiled Egg & Apple', image: '/meal-ideas/s2.jpg',
    kcal: 152, protein: 6.8, carbs: 21.7, fat: 5.1,
    ingredients: [
      '1 whole egg — 50 g',
      'Apple — 155 g',
    ],
  },
  {
    id: 's3', time: 'snacks', name: 'Greek Yogurt & Sweet Potato', image: '/meal-ideas/s3.jpg',
    kcal: 153, protein: 9.0, carbs: 25.3, fat: 1.7,
    ingredients: [
      'Plain Greek yogurt — 80 g',
      'Sweet potato — 110 g',
    ],
  },
  {
    id: 's4', time: 'snacks', name: 'Apple, Yogurt & Sweet Potato', image: '/meal-ideas/s4.jpg',
    kcal: 156, protein: 7.1, carbs: 29.8, fat: 1.6,
    ingredients: [
      'Apple — 110 g',
      'Plain Greek yogurt — 65 g',
      'Sweet potato — 60 g',
    ],
  },
  {
    id: 's5', time: 'snacks', name: 'Mini Greek Yogurt Fruit Bowl', image: '/meal-ideas/s5.jpg',
    kcal: 156, protein: 8.6, carbs: 27.3, fat: 2.0,
    ingredients: [
      'Plain Greek yogurt — 85 g',
      'Apple — 115 g',
      'Sweet potato — 40 g',
    ],
  },
];

// Her measurement and cooking notes, the same for all 20 meals.
export const COOKING_NOTES = {
  weights: [
    'Eggs: weight without shells.',
    'Chicken and beef: cooked weight.',
    'Sweet potatoes and green peas: cooked weight.',
    'Apples: edible weight.',
    'Avocado: flesh only.',
    'Greek yogurt: plain, unsweetened.',
    'Olive oil: measured in grams.',
  ],
  methods: ['Boiling', 'Steaming', 'Baking', 'Roasting', 'Nonstick cooking'],
  avoid: 'Avoid adding unmeasured cooking oils, sauces, sugar, or toppings.',
};

export function ideasFor(time) {
  return MEAL_IDEAS.filter(i => i.time === time);
}
