import { useState, useEffect, useCallback } from 'react';
import {
  WORKOUT_GOAL, MILESTONES, dayKey, parseDay,
  loadWorkouts, saveWorkouts, editWorkout,
  numbered, numberOf, cumulativeIn,
} from '../utils/workoutLog';
import {
  DONE_EVENT, fmt, longDate, shortDate, useWorkouts, markWorkout, unmarkWorkout,
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

// ── graph ────────────────────────────────────────────────────────────────
const W = 320, H = 170, PAD_L = 34, PAD_R = 10, PAD_T = 14, PAD_B = 24;
const MONTHS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

function rangeFor(view, offset, log) {
  const now = new Date();
  if (view === 'month') {
    const a = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const b = new Date(a.getFullYear(), a.getMonth() + 1, 0);
    return { from: dayKey(a), to: dayKey(b), label: a.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  }
  if (view === 'year') {
    const y = now.getFullYear() + offset;
    return { from: `${y}-01-01`, to: `${y}-12-31`, label: String(y) };
  }
  const first = Object.keys(log.days).sort()[0] || dayKey(now);
  const end = new Date(parseDay(first)); end.setDate(end.getDate() + 29);
  return { from: first, to: dayKey(end > now ? end : now), label: 'All time' };
}

function ProgressGraph({ log }) {
  const [view, setView] = useState('month');
  const [offset, setOffset] = useState(0);
  const { from, to, label } = rangeFor(view, offset, log);
  const { before, points } = cumulativeIn(log, from, to);
  const endTotal = points.length ? points.at(-1).total : before;
  // Month and year aim at the next milestone, so a good month climbs visibly
  // instead of creeping along the floor of a 1,000-high chart. All time shows
  // the whole mountain.
  const top = view === 'all' ? WORKOUT_GOAL : (MILESTONES.find(m => m > endTotal) || WORKOUT_GOAL);

  const t0 = parseDay(from).getTime(), t1 = parseDay(to).getTime();
  const span = Math.max(1, t1 - t0);
  const x = key => PAD_L + ((parseDay(key).getTime() - t0) / span) * (W - PAD_L - PAD_R);
  const y = v => PAD_T + (1 - v / top) * (H - PAD_T - PAD_B);
  const today = dayKey();
  const lineEnd = today < to ? (today < from ? from : today) : to;

  let d = `M${x(from)},${y(before)}`;
  let prev = before;
  for (const p of points) { d += ` L${x(p.date)},${y(prev)} L${x(p.date)},${y(p.total)}`; prev = p.total; }
  d += ` L${x(lineEnd)},${y(prev)}`;
  const area = `${d} L${x(lineEnd)},${y(0)} L${x(from)},${y(0)} Z`;

  const ticks = view === 'year'
    ? MONTHS.map((m, i) => ({ key: `${from.slice(0, 4)}-${String(i + 1).padStart(2, '0')}-01`, text: m }))
    : view === 'month'
      ? [1, 8, 15, 22, 29].map(n => ({ key: `${from.slice(0, 8)}${String(n).padStart(2, '0')}`, text: String(n) }))
      : [{ key: from, text: shortDate(from) }, { key: to, text: shortDate(to) }];
  const added = endTotal - before;

  return (
    <div className="wk-graph">
      <div className="wk-graph-tabs">
        {[['month', 'Month'], ['year', 'Year'], ['all', 'All time']].map(([v, t]) => (
          <button key={v} className={view === v ? 'active' : ''} onClick={() => { setView(v); setOffset(0); }}>{t}</button>
        ))}
      </div>
      <div className="wk-graph-nav">
        {view !== 'all'
          ? <button aria-label="Earlier" onClick={() => setOffset(o => o - 1)}>‹</button>
          : <span />}
        <span className="wk-graph-label">
          {label} · <b>{view === 'all' ? `${fmt(endTotal)} total` : `+${added}`}</b>
        </span>
        {view !== 'all'
          ? <button aria-label="Later" disabled={offset >= 0} onClick={() => setOffset(o => Math.min(0, o + 1))}>›</button>
          : <span />}
      </div>
      <svg className="wk-graph-svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`${fmt(endTotal)} workouts by the end of ${label}`}>
        <defs>
          <linearGradient id="wkFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--rose)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {(top >= 100 ? [0, top / 2] : [0]).map(v => (
          <g key={v}>
            <line className="wk-grid" x1={PAD_L} x2={W - PAD_R} y1={y(v)} y2={y(v)} />
            <text className="wk-axis" x={PAD_L - 5} y={y(v) + 3} textAnchor="end">{fmt(Math.round(v))}</text>
          </g>
        ))}
        <line className="wk-goal-line" x1={PAD_L} x2={W - PAD_R} y1={y(top)} y2={y(top)} />
        <text className="wk-goal-text" x={W - PAD_R} y={y(top) - 4} textAnchor="end">
          {top === WORKOUT_GOAL ? '🏆 1,000' : `🏅 ${top}`}
        </text>
        <text className="wk-axis" x={PAD_L - 5} y={y(top) + 3} textAnchor="end">{fmt(top)}</text>
        {today >= from && <path d={area} fill="url(#wkFill)" />}
        {today >= from && <path d={d} className="wk-line" />}
        {points.length <= 40 && points.map(p => (
          <circle key={p.date} className="wk-dot" cx={x(p.date)} cy={y(p.total)} r="2.6" />
        ))}
        {ticks.map(t => (
          <text key={t.key} className="wk-axis" x={x(t.key)} y={H - 7}
            textAnchor={view === 'all' ? (t.key === from ? 'start' : 'end') : 'middle'}>{t.text}</text>
        ))}
      </svg>
      {log && Object.keys(log.days).length === 0 && (
        <div className="wk-empty">Your line starts with workout #1.</div>
      )}
    </div>
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
  const todayN = stats.doneToday ? numberOf(log, dayKey()) : null;

  const pills = [
    { id: 'graph', label: '📈 Progress graph' },
    { id: 'ms', label: '🏅 Milestones', count: `${reached}/${MILESTONES.length}` },
    { id: 'hist', label: '📜 History', count: fmt(stats.total) },
  ];

  return (
    <div className="wk-goal splash-item">
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

      <button
        className={`wk-done-btn${stats.doneToday ? ' is-done' : ''}`}
        onClick={() => (stats.doneToday ? unmarkWorkout() : markWorkout())}
      >
        {stats.doneToday ? `✓ Workout #${fmt(todayN)} done today` : '✓ Mark today’s workout done'}
      </button>

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
                {p.id === 'graph' && <ProgressGraph log={log} />}
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
