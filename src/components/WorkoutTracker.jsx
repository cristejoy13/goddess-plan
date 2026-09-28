import { useState, useEffect, useCallback } from 'react';
import { ProgressChart } from './GoalChart';
import {
  WORKOUT_GOAL, MILESTONES, dayKey,
  loadWorkouts, saveWorkouts, editWorkout, numbered,
} from '../utils/workoutLog';
import {
  DONE_EVENT, fmt, longDate, useWorkouts, markWorkout, unmarkWorkout,
} from '../utils/useWorkouts';

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

// ── milestones ───────────────────────────────────────────────────────────
function Milestones({ total }) {
  const next = MILESTONES.find(m => m > total);
  return (
    <ul className="wk-ms">
      {MILESTONES.map(m => {
        const hit = total >= m;
        return (
          <li key={m} className={hit ? 'hit' : m === next ? 'next' : ''}>
            <span className="wk-ms-mark">{hit ? '✓' : '○'}</span>
            <span className="wk-ms-num">{fmt(m)}</span>
            {m === next && <span className="wk-ms-left">{m - total} to go</span>}
          </li>
        );
      })}
    </ul>
  );
}

// ── history ──────────────────────────────────────────────────────────────
function HistoryRow({ w }) {
  const [editing, setEditing] = useState(false);
  const [mins, setMins] = useState(w.duration ?? '');
  const [notes, setNotes] = useState(w.notes || '');
  const save = () => {
    const n = parseInt(mins, 10);
    saveWorkouts(editWorkout(loadWorkouts(), w.date, { duration: n > 0 ? n : null, notes: notes.trim() }));
    setEditing(false);
  };
  return (
    <li className="wk-hist-row">
      <button className="wk-hist-main" onClick={() => setEditing(v => !v)} aria-expanded={editing}>
        <span className="wk-hist-n">#{fmt(w.n)}</span>
        <span className="wk-hist-body">
          <span className="wk-hist-date">{longDate(w.date)}</span>
          <span className="wk-hist-type">{w.type} · Completed ✓</span>
          {(w.duration || w.notes) ? (
            <span className="wk-hist-extra">
              {w.duration ? `⏱ ${w.duration} min` : ''}{w.duration && w.notes ? ' · ' : ''}{w.notes}
            </span>
          ) : !editing && <span className="wk-hist-add">＋ time &amp; notes</span>}
        </span>
      </button>
      {editing && (
        <div className="wk-hist-edit">
          <label>
            <span>Minutes</span>
            <input type="number" inputMode="numeric" min="1" value={mins}
              onChange={e => setMins(e.target.value)} />
          </label>
          <label className="wk-hist-notes">
            <span>Notes</span>
            <input type="text" value={notes} maxLength={200}
              onChange={e => setNotes(e.target.value)} />
          </label>
          <div className="wk-hist-btns">
            <button className="wk-btn-save" onClick={save}>Save</button>
            <button className="wk-btn-remove" onClick={() => unmarkWorkout(w.date)}>Remove</button>
          </div>
        </div>
      )}
    </li>
  );
}

function History({ log }) {
  const [shown, setShown] = useState(10);
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState('');
  const all = numbered(log).reverse();
  const today = dayKey();
  const addPast = () => {
    if (!date || date > today || log.days[date]) return;
    markWorkout(date);
    setAdding(false); setDate('');
  };
  return (
    <div className="wk-hist">
      {adding ? (
        <div className="wk-hist-past">
          <input type="date" max={today} value={date} onChange={e => setDate(e.target.value)} />
          <button className="wk-btn-save" disabled={!date || date > today || !!log.days[date]} onClick={addPast}>Add</button>
          <button className="wk-btn-plain" onClick={() => { setAdding(false); setDate(''); }}>Cancel</button>
          {date && log.days[date] && <span className="wk-hist-warn">Already counted.</span>}
        </div>
      ) : (
        <button className="wk-btn-plain wk-hist-addpast" onClick={() => setAdding(true)}>＋ Add a missed day</button>
      )}
      {all.length === 0 && <div className="wk-empty">No workouts yet.</div>}
      <ul className="wk-hist-list">
        {all.slice(0, shown).map(w => <HistoryRow key={`${w.date}-${w.updatedAt}`} w={w} />)}
      </ul>
      {all.length > shown && (
        <button className="wk-btn-plain" onClick={() => setShown(s => s + 20)}>Show more ({all.length - shown})</button>
      )}
    </div>
  );
}

// ── the card ─────────────────────────────────────────────────────────────
export default function WorkoutGoalCard() {
  const { log, stats } = useWorkouts();
  const [open, setOpen] = useState(null);
  const toggle = useCallback(id => setOpen(o => (o === id ? null : id)), []);
  const reached = MILESTONES.filter(m => stats.total >= m).length;

  const pills = [
    { id: 'graph', label: '📈 Progress graph' },
    { id: 'ms', label: '🏅 Milestones', count: `${reached}/${MILESTONES.length}` },
    { id: 'hist', label: '📜 History', count: fmt(stats.total) },
  ];

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


      <div className="wk-pills">
        {pills.map(p => (
          <div key={p.id} className={`ex-sec${open === p.id ? ' is-open' : ''}`}>
            <button className="ex-sec-pill" onClick={() => toggle(p.id)} aria-expanded={open === p.id}>
              <span className="ex-sec-name">{p.label}</span>
              {p.count && <span className="ex-sec-count">{p.count}</span>}
              <span className="ex-sec-caret">▾</span>
            </button>
            {open === p.id && (
              <div className="ex-sec-body">
                {p.id === 'graph' && (
                  <ProgressChart
                    entries={Object.keys(log.days).map(date => ({ date, amount: 1 }))}
                    target={WORKOUT_GOAL} milestones={MILESTONES}
                    empty="Your line starts with workout #1."
                  />
                )}
                {p.id === 'ms' && <Milestones total={stats.total} />}
                {p.id === 'hist' && <History log={log} />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
