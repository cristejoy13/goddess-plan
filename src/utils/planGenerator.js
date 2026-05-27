import { ALL_DAYS } from './notifications';

const EAT_DAYS  = [1, 3, 5, 6]; // Mon (Sprint), Wed (Strength A), Fri (Sprint), Sat (Strength B)
const FAST_DAYS = [0, 2, 4];    // Sun (Mobility), Tue (Pilates 1), Thu (Pilates 2)

export function addMinutes(timeStr, mins) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  let total = ((h * 60 + m + mins) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function calcLastMealTime(sleepTime = '22:00') {
  return addMinutes(sleepTime, -270); // 4.5 hours before sleep
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

function toMins(timeStr) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  return h * 60 + m;
}

// Returns the later of two HH:MM strings
function laterOf(t1, t2) {
  return toMins(t1) >= toMins(t2) ? t1 : t2;
}

// Returns the earlier of two HH:MM strings
function earlierOf(t1, t2) {
  return toMins(t1) <= toMins(t2) ? t1 : t2;
}

export function generateReminders(profile) {
  const { wakeTime = '06:30', sleepTime = '22:00', mealsPerDay = 3 } = profile;
  const lastMeal = calcLastMealTime(sleepTime); // 4.5 hours before sleep
  const rem = [];

  rem.push({ id: 'sunlight', emoji: '☀️', label: 'Morning Sunlight',
    time: addMinutes(wakeTime, 5), enabled: true, days: ALL_DAYS,
    body: 'Get 10–20 min of morning sunlight to anchor your circadian rhythm! 🌿' });

  rem.push({ id: 'am_skin', emoji: '✨', label: 'AM Skincare',
    time: addMinutes(wakeTime, 20), enabled: true, days: ALL_DAYS,
    body: 'AM routine time — cleanse, tone, protect! 🌸' });

  // ── STRENGTH / SPRINT DAYS (Mon/Wed/Thu) — eat anytime, no fasting ──
  // Breakfast 60 min after wake, then meals every 3h+
  const breakfastTime = addMinutes(wakeTime, 60);
  rem.push({ id: 'breakfast', emoji: '🥣', label: 'Meal 1 — Breakfast',
    time: breakfastTime, enabled: true, days: EAT_DAYS,
    body: 'Strength day fuel! Protein first — PFBS 🥚💪 Walk after eating 🚶' });

  rem.push({ id: 'workout', emoji: '💪', label: 'Workout Time',
    time: addMinutes(wakeTime, 90), enabled: true, days: EAT_DAYS, body: null });

  // Lunch on EAT_DAYS — at least 3h after breakfast
  const eatLunchTime = laterOf(addMinutes(breakfastTime, 180), '12:00');
  rem.push({ id: 'lunch', emoji: '🥗', label: 'Meal 2 — Lunch',
    time: eatLunchTime, enabled: true, days: EAT_DAYS,
    body: 'Meal 2 — protein + fiber + vegetables! 80% full 💕 Walk after 🚶' });

  // Optional 3rd meal on EAT_DAYS — 3h after lunch, must be before last meal
  if (mealsPerDay >= 4) {
    const meal3Time = addMinutes(eatLunchTime, 180);
    if (toMins(meal3Time) < toMins(lastMeal) - 60) {
      rem.push({ id: 'snack', emoji: '🍌', label: 'Meal 3',
        time: meal3Time, enabled: true, days: EAT_DAYS,
        body: 'Meal 3 — light! Fruit, eggs, or protein 💕' });
    }
  }

  // ── REST / LIGHT DAYS (Sun/Tue/Fri/Sat) — fast minimum 14 hours ──
  // Break fast at: 14h after last meal OR noon, whichever is later
  const fastBreakTime = laterOf('12:00', addMinutes(lastMeal, 14 * 60));

  rem.push({ id: 'workout_light', emoji: '🧘', label: 'Workout Time',
    time: addMinutes(wakeTime, 30), enabled: true, days: FAST_DAYS, body: null });

  rem.push({ id: 'fast_break', emoji: '⏱️', label: 'Break Fast',
    time: fastBreakTime, enabled: true, days: FAST_DAYS,
    body: `14h fast done! First meal — protein + fiber, small portion 🥚🥦 Walk after 🚶` });

  // Second meal on FAST_DAYS — 3h after break fast, if there's room
  const fastLunchTime = addMinutes(fastBreakTime, 180);
  if (mealsPerDay >= 3 && toMins(fastLunchTime) < toMins(lastMeal) - 60) {
    rem.push({ id: 'fast_lunch', emoji: '🍽️', label: 'Meal 2',
      time: fastLunchTime, enabled: true, days: FAST_DAYS,
      body: 'Meal 2 — keep it bland, light, and protein-rich! 80% full 💕' });
  }

  // ── SHARED ──
  rem.push({ id: 'last_meal', emoji: '🌙', label: 'Last Meal',
    time: lastMeal, enabled: true, days: ALL_DAYS,
    body: 'Last meal of the day! Walk 10 min after 🚶 No food after this — Goddess rule 🌿' });

  rem.push({ id: 'pm_skin', emoji: '✨', label: 'PM Skincare',
    time: addMinutes(sleepTime, -120), enabled: true, days: ALL_DAYS,
    body: 'Evening glow-up! Double cleanse, retinoid, moisturizer 🌸' });

  rem.push({ id: 'wind_down', emoji: '💆', label: 'Wind Down',
    time: addMinutes(sleepTime, -90), enabled: true, days: ALL_DAYS,
    body: 'Dim the lights, no screens, gentle stretch 💤' });

  rem.push({ id: 'sleep', emoji: '😴', label: 'Sleep Time',
    time: sleepTime, enabled: true, days: ALL_DAYS,
    body: 'Beauty sleep — 7.5 to 9 hours, non-negotiable! 🌙' });

  return rem.sort((a, b) => a.time < b.time ? -1 : 1);
}

export function generatePlan(profile) {
  const { gender, age, heightCm, weightKg, activityLevel, primaryGoal } = profile;
  const tdeeKcal = calcTDEE(gender, age, heightCm, weightKg, activityLevel);
  const lastMealTime = calcLastMealTime(profile.sleepTime || '22:00');
  const deficitKcal = tdeeKcal
    ? primaryGoal === 'lose_fat'     ? Math.max(1200, tdeeKcal - 400)
    : primaryGoal === 'build_muscle' ? tdeeKcal + 300
    : tdeeKcal
    : null;
  const remindersV2 = generateReminders(profile);
  return { tdeeKcal, deficitKcal, lastMealTime, remindersV2 };
}
