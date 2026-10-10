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
export const MEAL_IDEAS = [];

export function ideasFor(time) {
  return MEAL_IDEAS.filter(i => i.time === time);
}
