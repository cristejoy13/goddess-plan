// Who is using the app, and the plan built for them (2026-10-10).
//
// The app began as one person's plan — her workouts, her meals, her skincare.
// It now also serves people who sign up: they answer a few questions
// (src/components/Onboarding.jsx) and get a plan built from the answers.
//
//   Owner  — her. Every saved profile from before sign-up existed has no
//            `onboarded` flag, so it is hers; nothing about her app changes.
//   Free   — someone who signed up: Home, Workouts (their own plan), Meal, G
//            and notes. No Body section (hers; a paid extra later).
//
// Nothing here is invented about a person: every number comes from what they
// typed, through the same formula online TDEE calculators use.

import { useEffect, useMemo, useState } from 'react';
import { WORKOUT_DAYS } from '../data/workouts.js';

export const PROFILE_KEY = 'gp_profile';

export function readProfile() {
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || 'null'); } catch { return null; }
}

// True only for a gadget that has never had a profile — a new person.
export function hasNoProfile() {
  try { return !localStorage.getItem(PROFILE_KEY); } catch { return false; }
}

export function isOwner(profile = readProfile()) {
  if (!profile) return true;           // no answers yet: nothing to gate
  if (profile.tier === 'owner') return true;
  return !profile.onboarded;           // older profiles are hers
}

// ── Numbers ────────────────────────────────────────────────────────────────
export const ACTIVITY = {
  sedentary: { label: 'Mostly sitting', note: 'desk job, little walking', mult: 1.2 },
  light:     { label: 'Lightly active', note: 'on my feet a bit, some walking', mult: 1.375 },
  moderate:  { label: 'Active', note: 'on my feet most of the day', mult: 1.55 },
  active:    { label: 'Very active', note: 'physical job or lots of movement', mult: 1.725 },
};

// Mifflin–St Jeor, the formula most TDEE calculators use.
export function bmrOf({ sex, age, heightCm, weightKg }) {
  const a = Number(age), h = Number(heightCm), w = Number(weightKg);
  if (!(a > 0 && h > 0 && w > 0)) return null;
  return Math.round(10 * w + 6.25 * h - 5 * a + (sex === 'male' ? 5 : -161));
}

export function tdeeOf(answers) {
  const bmr = bmrOf(answers);
  if (bmr == null) return null;
  return Math.round(bmr * (ACTIVITY[answers.activity]?.mult || 1.375));
}

// One program (2026-10-10): glutes and abs — body recomposition, toned. A
// small deficit, sized by how hard they want to push, with plenty of protein
// so the glutes grow while fat comes off.
const CHANGE = { gentle: -150, steady: -250, allin: -350 };
const PROTEIN_PER_KG = 2.0;
export const KCAL_PER_KG = 7700;

export function targetsFor(answers) {
  const tdee = tdeeOf(answers);
  if (tdee == null) return null;
  const change = CHANGE[answers.push || 'steady'] ?? CHANGE.steady;
  const floor = answers.sex === 'male' ? 1500 : 1200;
  const calories = Math.max(floor, Math.round((tdee + change) / 10) * 10);
  const protein = Math.round(PROTEIN_PER_KG * Number(answers.weightKg));
  const weeklyKg = Math.round(((calories - tdee) * 7 / KCAL_PER_KG) * 100) / 100;
  return { bmr: bmrOf(answers), tdee, calories, protein, weeklyKg };
}

// ── Their week: glutes and abs ─────────────────────────────────────────────
const H = (heading, hint, tone) => ({ heading, hint, tone });
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const SETS = { gentle: 2, steady: 3, allin: 4 };

// Three glute days, each a different angle, so the week covers the whole
// glute: thrusts and hinges (A), the side glute and step-ups (B), wide-stance
// and single-leg work (C). At a gym or at home.
const GLUTES = {
  gym: {
    A: [['Barbell Hip Thrust', '8–12'], ['Romanian Deadlift', '8–10'], ['Bulgarian Split Squat', '8–10 each leg'], ['Cable Kickback', '12 each leg']],
    B: [['Hip Abduction Machine', '15–20'], ['Dumbbell Step-Up', '10 each leg'], ['Cable Pull-Through', '12'], ['Goblet Squat', '10–12']],
    C: [['B-Stance Hip Thrust', '10 each leg'], ['Sumo Deadlift', '8–10'], ['Reverse Lunge', '10 each leg'], ['Glute Kickback Machine', '12 each leg']],
  },
  home: {
    A: [['Glute Bridge', '15'], ['Single-Leg Romanian Deadlift', '10 each leg'], ['Bulgarian Split Squat (on a chair)', '10 each leg'], ['Donkey Kick', '15 each leg']],
    B: [['Fire Hydrant', '15 each leg'], ['Step-Up (stair or chair)', '12 each leg'], ['Frog Pump', '20'], ['Sumo Squat', '15']],
    C: [['B-Stance Glute Bridge', '12 each leg'], ['Sumo Squat Pulse', '20'], ['Curtsy Lunge', '10 each leg'], ['Clamshell', '20 each side']],
  },
};
const ABS_DAY = [['Dead Bug', '10 each side'], ['Reverse Crunch', '12–15'], ['Bicycle Crunch', '20'], ['Side Plank', '30 sec each side'], ['Plank', '45 sec']];
const ABS_FINISHER = [['Reverse Crunch', '12–15'], ['Plank', '30–45 sec']];

const SESSION_INFO = {
  A:    { emoji: '🍑', name: 'Glutes A', title: 'Thrusts & hinges · abs finisher' },
  B:    { emoji: '✨', name: 'Glutes B', title: 'Side glute & step-ups · abs finisher' },
  C:    { emoji: '🍑', name: 'Glutes C', title: 'Wide stance & single leg · abs finisher' },
  abs:  { emoji: '🔥', name: 'Abs & Core', title: 'Abs + easy cardio' },
  rest: { emoji: '🌿', name: 'Rest', title: 'Rest · easy walk' },
};

// Which session falls on which weekday, by how many days they train.
const SCHEDULE = {
  2: ['A', 'rest', 'rest', 'B', 'rest', 'rest', 'rest'],
  3: ['A', 'rest', 'abs', 'rest', 'B', 'rest', 'rest'],
  4: ['A', 'abs', 'rest', 'B', 'abs', 'rest', 'rest'],
  5: ['A', 'abs', 'B', 'rest', 'C', 'abs', 'rest'],
  6: ['A', 'abs', 'B', 'abs', 'C', 'abs', 'rest'],
};

function sessionDay(kind, i, a) {
  const info = SESSION_INFO[kind];
  const sets = SETS[a.push || 'steady'];
  const walkMin = a.push === 'allin' ? '40–60' : '20–40';
  const day = {
    emoji: info.emoji,
    emojiBg: 'rgba(252,228,239,0.5)',
    day: `${DAY_NAMES[i]} · ${info.name}`,
    title: info.title,
    sub: kind === 'rest' ? `rest day · ${walkMin} min easy walk` : `${kind === 'abs' ? '25–40 min' : '35–50 min'} · evening walk`,
    cardio: { icon: '🚶', title: 'Easy walk', note: `${walkMin} min` },
    meals: { clock: '', rows: [] },
    exercises: [],
  };
  if (kind === 'rest') {
    day.exercises = [
      H('🌿 Rest day', 'Recovery is when the glutes grow.'),
      { name: 'Easy Walk', detail: `${walkMin} min · easy pace` },
      { name: 'Stretching', detail: '5–10 min · hips, glutes, hamstrings' },
    ];
    return day;
  }
  if (kind === 'abs') {
    day.exercises = [
      H('🔥 Main Workout · Abs & Core', `${sets} rounds · rest 30–45 sec.`, 'core'),
      ...ABS_DAY.map(([n, r]) => ({ name: n, detail: `${sets} × ${r}` })),
      H('🏃 After · Easy Cardio', 'Easy enough to talk in short sentences.'),
      { name: 'Zone 2 Cardio', detail: `${a.push === 'allin' ? '30–40' : '20–30'} min · brisk walk, bike or easy jog` },
    ];
    return day;
  }
  const lifts = GLUTES[a.place === 'gym' ? 'gym' : 'home'][kind];
  day.exercises = [
    H(`${info.emoji} Main Workout`, `${lifts.length} moves · in order · rest 60–90 sec.`),
    ...lifts.map(([n, r], k) => ({ name: `${k + 1}. ${n}`, detail: `${sets} × ${r}` })),
    H('🔥 After · Abs Finisher', '2 moves · straight after.', 'core'),
    ...ABS_FINISHER.map(([n, r]) => ({ name: n, detail: `${Math.max(2, sets - 1)} × ${r}` })),
    H('🚶 Evening · Easy Walk', 'Every evening if you can.'),
    { name: 'Easy Walk', detail: `${walkMin} min · easy pace` },
  ];
  day.trackLifts = a.place === 'gym';
  return day;
}

export function weekFor(answers) {
  const n = Math.min(6, Math.max(2, Number(answers.days) || 3));
  return SCHEDULE[n].map((kind, i) => sessionDay(kind, i, answers));
}

// The days the app shows: hers for her, theirs for them.
export function planDays(profile = readProfile()) {
  if (isOwner(profile)) return WORKOUT_DAYS;
  return weekFor(profile.answers || {});
}

// For components: re-reads when the profile changes on this gadget or sync.
export function usePlanDays() {
  const [profileText, setProfileText] = useState(() => { try { return localStorage.getItem(PROFILE_KEY) || ''; } catch { return ''; } });
  useEffect(() => {
    const refresh = () => { try { setProfileText(localStorage.getItem(PROFILE_KEY) || ''); } catch { /* fine */ } };
    window.addEventListener('gp-remote-sync', refresh);
    window.addEventListener('gp-profile-changed', refresh);
    return () => {
      window.removeEventListener('gp-remote-sync', refresh);
      window.removeEventListener('gp-profile-changed', refresh);
    };
  }, []);
  return useMemo(() => {
    let p = null;
    try { p = JSON.parse(profileText || 'null'); } catch { /* fine */ }
    return { days: planDays(p), owner: isOwner(p), profile: p };
  }, [profileText]);
}
