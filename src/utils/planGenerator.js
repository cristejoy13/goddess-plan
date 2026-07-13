export function addMinutes(timeStr, mins) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  let total = ((h * 60 + m + mins) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function calcLastMealTime() {
  return '17:00'; // 5pm every day — always stop eating by 5 PM
}

export function calcTDEE(gender, age, heightCm, weightKg, activityLevel) {
  const a = Number(age), h = Number(heightCm), w = Number(weightKg);
  if (!a || !h || !w || isNaN(a) || isNaN(h) || isNaN(w)) return null;
  const bmr = gender === 'male'
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;
  const mult = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
  return Math.round(bmr * (mult[activityLevel] || 1.55));
}

export function generatePlan(profile) {
  const { gender, age, heightCm, weightKg, activityLevel, primaryGoal } = profile;
  const tdeeKcal = calcTDEE(gender, age, heightCm, weightKg, activityLevel);
  const lastMealTime = calcLastMealTime();
  const deficitKcal = tdeeKcal
    ? primaryGoal === 'lose_fat'     ? Math.max(1200, tdeeKcal - 400)
    : primaryGoal === 'build_muscle' ? tdeeKcal + 300
    : tdeeKcal
    : null;
  return { tdeeKcal, deficitKcal, lastMealTime };
}
