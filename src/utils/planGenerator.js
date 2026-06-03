import { ALL_DAYS } from './notifications';

const EAT_DAYS  = [1, 3, 5, 6]; // Mon (Sprint), Wed (Strength A), Fri (Sprint), Sat (Strength B)
const FAST_DAYS = [0, 2, 4];    // Sun (Mobility), Tue (Pilates 1), Thu (Pilates 2)

export function addMinutes(timeStr, mins) {
  const [h, m] = (timeStr || '00:00').split(':').map(Number);
  let total = ((h * 60 + m + mins) % 1440 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

export function calcLastMealTime() {
  return '17:00'; // 5pm every day — 9-2-5 method
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

export function generateReminders(profile) {
  const { wakeTime = '06:30', sleepTime = '22:00' } = profile;
  const rem = [];

  rem.push({ id: 'sunlight', emoji: '☀️', label: 'Morning Sunlight',
    time: addMinutes(wakeTime, 5), enabled: true, days: ALL_DAYS,
    body: 'Get 10–20 min of morning sunlight to anchor your circadian rhythm! 🌿' });

  rem.push({ id: 'am_skin', emoji: '✨', label: 'AM Skincare',
    time: addMinutes(wakeTime, 20), enabled: true, days: ALL_DAYS,
    body: 'AM routine time — cleanse, tone, protect! 🌸' });

  // ── HARD DAYS (Mon/Wed/Fri/Sat) — 9 AM · 2 PM · 5 PM ──
  rem.push({ id: 'breakfast', emoji: '🥣', label: 'Meal 1 — 9 AM',
    time: '09:00', enabled: true, days: EAT_DAYS,
    body: 'Hard day fuel! Protein first — PFBS 🥚💪 Walk after eating 🚶' });

  rem.push({ id: 'workout', emoji: '💪', label: 'Workout Time',
    time: addMinutes(wakeTime, 90), enabled: true, days: EAT_DAYS, body: null });

  rem.push({ id: 'lunch', emoji: '🥗', label: 'Meal 2 — 2 PM',
    time: '14:00', enabled: true, days: EAT_DAYS,
    body: 'Meal 2 — protein + fiber + vegetables! 80% full 💕 Walk after 🚶' });

  // ── LIGHT DAYS (Tue/Thu/Sun) — 2 PM · 5 PM ──
  rem.push({ id: 'workout_light', emoji: '🧘', label: 'Workout Time',
    time: addMinutes(wakeTime, 30), enabled: true, days: FAST_DAYS, body: null });

  rem.push({ id: 'fast_break', emoji: '🍽️', label: 'First Meal — 2 PM',
    time: '14:00', enabled: true, days: FAST_DAYS,
    body: 'Eating window open! First meal — keep it light, protein + fruit 🥗 Walk after 🚶' });

  // ── SHARED — last meal 5pm every day — 9-2-5 method ──
  rem.push({ id: 'last_meal', emoji: '🌙', label: 'Last Meal — 5 PM',
    time: '17:00', enabled: true, days: ALL_DAYS,
    body: 'Last meal of the day! Walk 10 min after 🚶 No food after 5 PM — Goddess rule 🌿' });

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
  const lastMealTime = calcLastMealTime();
  const deficitKcal = tdeeKcal
    ? primaryGoal === 'lose_fat'     ? Math.max(1200, tdeeKcal - 400)
    : primaryGoal === 'build_muscle' ? tdeeKcal + 300
    : tdeeKcal
    : null;
  const remindersV2 = generateReminders(profile);
  return { tdeeKcal, deficitKcal, lastMealTime, remindersV2 };
}
