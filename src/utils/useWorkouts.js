import { useState, useEffect } from 'react';
import { ask } from './ask';
import { planDays } from './userPlan';
import { fireConfetti } from './confetti';
import {
  MILESTONES, WORKOUTS_CHANGED, dayKey, parseDay,
  loadWorkouts, saveWorkouts, logWorkout, removeWorkout, numberOf, workoutStats,
} from './workoutLog';

export const DONE_EVENT = 'gp-workout-done';
export const fmt = n => n.toLocaleString('en-US');

// The name a day's session goes by in the history: "Glutes A", not the
// whole "Monday · Glutes A" heading. Monday-first, like the plan.
export function typeFor(key) {
  const js = parseDay(key).getDay();
  const day = planDays()[js === 0 ? 6 : js - 1];
  return day?.day?.split(' · ')[1] || day?.title || 'Workout';
}

export const longDate = key => parseDay(key).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
export const shortDate = key => parseDay(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

// Everything the tracker shows, re-read whenever a workout is ticked here,
// on Today's Plan, or on another gadget.
export function useWorkouts() {
  const read = () => { const log = loadWorkouts(); return { log, stats: workoutStats(log) }; };
  const [data, setData] = useState(read);
  useEffect(() => {
    const refresh = () => setData(read());
    window.addEventListener(WORKOUTS_CHANGED, refresh);
    window.addEventListener('gp-remote-sync', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(WORKOUTS_CHANGED, refresh);
      window.removeEventListener('gp-remote-sync', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return data;
}

// Ticking today. Every place that can mark the workout done comes through
// here, so the count, the toast and the confetti are the same wherever she is.
export function markWorkout(key = dayKey()) {
  const log = loadWorkouts();
  if (log.days[key]) return numberOf(log, key);
  const next = logWorkout(log, key, typeFor(key));
  saveWorkouts(next);
  const n = numberOf(next, key);
  const total = Object.keys(next.days).length;
  const milestone = MILESTONES.includes(total) ? total : null;
  if (key === dayKey()) {
    if (milestone) fireConfetti();
    window.dispatchEvent(new CustomEvent(DONE_EVENT, { detail: { n, milestone } }));
  }
  return n;
}

// Taking a day off the record loses its time and notes, so it always asks.
export async function unmarkWorkout(key = dayKey()) {
  const log = loadWorkouts();
  const x = log.days[key];
  if (!x) return true;
  const what = `Workout #${numberOf(log, key)} (${longDate(key)})`;
  const extra = x.notes || x.duration ? ' Its time and notes go too.' : '';
  if (!(await ask(`Take ${what} off your count?${extra}`, { yes: 'Take it off', danger: true }))) return false;
  saveWorkouts(removeWorkout(log, key));
  return true;
}

