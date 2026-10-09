// Sign-up numbers and the glutes-and-abs week built from them.
// Run with:  node src/utils/__tests__/userPlan.test.mjs
import { bmrOf, tdeeOf, targetsFor, weekFor, isOwner } from '../userPlan.js';
let pass = 0, fail = 0;
const ok = (name, cond, got) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name + (cond ? '' : `  → ${JSON.stringify(got)}`)); };
const her = { sex: 'female', age: 30, heightCm: 165, weightKg: 70, activity: 'light', goal: 'recomp', push: 'steady', days: 3, place: 'home' };
// Mifflin–St Jeor: 10·70 + 6.25·165 − 5·30 − 161 = 1420.25
ok('BMR by Mifflin–St Jeor', bmrOf(her) === 1420, bmrOf(her));
ok('TDEE = BMR × 1.375 (lightly active)', tdeeOf(her) === 1953, tdeeOf(her));
const t = targetsFor(her);
ok('steady: 250 under maintenance, rounded to 10', t.calories === 1700, t);
ok('protein 2 g per kg', t.protein === 140, t);
ok('gentle and all in sit either side', targetsFor({ ...her, push: 'gentle' }).calories === 1800 && targetsFor({ ...her, push: 'allin' }).calories === 1600);
ok('never under the floor (1,200 for women)', targetsFor({ ...her, weightKg: 40, heightCm: 145, age: 60, activity: 'sedentary', push: 'allin' }).calories === 1200);
ok('nothing typed, no numbers', targetsFor({ push: 'steady' }) === null);
const names = w => w.map(d => d.day.split(' · ')[1]);
ok('2 days: two glute days', names(weekFor({ ...her, days: 2 })).filter(n => n.startsWith('Glutes')).length === 2);
ok('3 days: glutes, abs, glutes', JSON.stringify(names(weekFor(her)).filter(n => n !== 'Rest')) === JSON.stringify(['Glutes A', 'Abs & Core', 'Glutes B']), names(weekFor(her)));
ok('5 days adds Glutes C', names(weekFor({ ...her, days: 5 })).includes('Glutes C'));
const gA = weekFor(her)[0];
ok('every glute day ends with an abs finisher', gA.exercises.some(e => /Abs Finisher/.test(e.heading || '')));
ok('home plan uses home moves', gA.exercises.some(e => /Glute Bridge/.test(e.name || '')));
ok('gym plan uses gym moves and tracks lifts', weekFor({ ...her, place: 'gym' })[0].exercises.some(e => /Hip Thrust/.test(e.name || '')) && weekFor({ ...her, place: 'gym' })[0].trackLifts);
ok('every day has the shape the app reads', weekFor(her).every(d => d.emoji && d.day && d.title && Array.isArray(d.exercises) && d.meals && Array.isArray(d.meals.rows)));
ok('her old profile (no sign-up flag) is the owner', isOwner({ username: 'Goddess', weightKg: 46 }));
ok('someone who signed up is not', !isOwner({ onboarded: true, tier: 'free' }));
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
