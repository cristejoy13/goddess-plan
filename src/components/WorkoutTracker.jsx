import { useState, useEffect } from 'react';
import { WORKOUT_GOAL } from '../utils/workoutLog';
import { DONE_EVENT, fmt, useWorkouts } from '../utils/useWorkouts';

export function WorkoutToast() {
  const [toast, setToast] = useState(null);
  useEffect(() => {
    const on = e => setToast(e.detail);
    window.addEventListener(DONE_EVENT, on);
    return () => window.removeEventListener(DONE_EVENT, on);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.milestone ? 7000 : 4000);
    return () => clearTimeout(t);
  }, [toast]);
  if (!toast) return null;
  return (
    <button type="button" className="goals-toast wk-toast" onClick={() => setToast(null)}>
      <b>Workout #{fmt(toast.n)} complete! 💪</b>
      {toast.milestone && <em className="wk-toast-ms">🏅 {fmt(toast.milestone)} workouts reached</em>}
    </button>
  );
}

// ── the card ─────────────────────────────────────────────────────────────
// The count, the bar and the streaks, nothing more — she asked for the bar
// alone to be the picture. Every workout is still stored with its date.
export default function WorkoutGoalCard() {
  const { stats } = useWorkouts();
  return (
    <div className="wk-goal">
      <div className="wk-goal-tag">🏆 1,000 Workout Goal</div>
      <div className="wk-goal-count">
        <b>{fmt(stats.total)}</b><span> / 1,000 workouts</span>
      </div>
      <div className="wk-goal-bar" role="progressbar" aria-valuemin={0} aria-valuemax={WORKOUT_GOAL} aria-valuenow={stats.total}>
        <span style={{ width: `${Math.max(stats.total ? 1.5 : 0, stats.pct)}%` }} />
      </div>
      <div className="wk-goal-pct">
        <b>{stats.pct}%</b> complete · {fmt(stats.remaining)} to go
      </div>

      <div className="wk-goal-stats">
        <div><b>🔥 {stats.current}</b><span>Streak</span></div>
        <div><b>⭐ {stats.longest}</b><span>Best streak</span></div>
        <div><b>🏅 {stats.next ? fmt(stats.next) : '✓'}</b><span>Next</span></div>
      </div>

    </div>
  );
}
