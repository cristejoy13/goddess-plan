import { useState, useEffect } from 'react';
import { usePlanDays } from '../utils/userPlan';
import LiftTracker from './LiftTracker';
import { useWorkouts, markWorkout, unmarkWorkout } from '../utils/useWorkouts';
import { numberOf, dayKey } from '../utils/workoutLog';
import { loadCardio, saveCardio, setMinutes, cardioStats, dateFor, CARDIO_CHANGED } from '../utils/cardioLog';
import { loadLifts, isTrackable } from '../utils/lifts';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

// JavaScript numbers Sunday as 0, so Monday-first is a shift of one.
const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

// A day's exercise array is flat: heading, its exercises, the next heading, and
// so on. The page shows it as a stack of collapsed pills instead, so the whole
// session fits on one screen and nothing has to be scrolled past to reach the
// part she is actually doing. This walks the flat list once and returns the
// groups. Anything before the first heading (there should be nothing) keeps its
// place in an untitled group rather than being dropped.
function groupExercises(exercises = []) {
  const groups = [];
  let current = null;
  for (const ex of exercises) {
    if (ex.heading) {
      current = { heading: ex.heading, hint: ex.hint, tone: ex.tone, items: [] };
      groups.push(current);
    } else {
      if (!current) {
        current = { heading: null, hint: null, tone: null, items: [] };
        groups.push(current);
      }
      current.items.push(ex);
    }
  }
  return groups;
}

// A bold title with a line through it, so each day reads as two parts:
// WORKOUT, then MEALS.
function SectionTitle({ children }) {
  return <h2 className="day-sec-title"><span>{children}</span></h2>;
}

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

// The whole session is one workout, so the day page has one button for it,
// at the top where she sees it first. Only on today.
function TodayDoneButton() {
  const { log, stats } = useWorkouts();
  return (
    <button
      className={`wk-done-btn wk-done-day wk-done-top${stats.doneToday ? ' is-done' : ''}`}
      onClick={() => (stats.doneToday ? unmarkWorkout() : markWorkout())}
    >
      {stats.doneToday
        ? `✓ Workout #${numberOf(log, dayKey()).toLocaleString('en-US')} done today`
        : '✓ Mark today’s workout done'}
    </button>
  );
}

// ── Run and bike minutes ────────────────────────────────────────────────
// Saturday's Zone 2 run and Sunday's bike each keep her minutes. Her goal is
// to hold her time or beat it, so the day shows the last time and the best,
// and the best moves up by itself when she beats it.
const CARDIO_LABEL = { run: { icon: '🏃', name: 'Run' }, bike: { icon: '🚲', name: 'Bike' } };

function useCardio() {
  const [log, setLog] = useState(loadCardio);
  useEffect(() => {
    const refresh = () => setLog(loadCardio());
    window.addEventListener(CARDIO_CHANGED, refresh);
    window.addEventListener('gp-remote-sync', refresh);
    return () => {
      window.removeEventListener(CARDIO_CHANGED, refresh);
      window.removeEventListener('gp-remote-sync', refresh);
    };
  }, []);
  return log;
}

function CardioSummary({ day, dayIndex }) {
  const log = useCardio();
  const kinds = [...new Set(day.exercises.filter(e => e.log).map(e => e.log))];
  return (
    <div className="cardio-summary">
      {kinds.map(kind => {
        const { last, best } = cardioStats(log, kind);
        const L = CARDIO_LABEL[kind];
        return (
          <div key={kind} className="cardio-row">
            <span className="cardio-row-name">{L.icon} {L.name}</span>
            <span className="cardio-row-nums">
              {best ? <>Last <b>{last.min} min</b> · Best <b>{best.min} min</b> 🏅</> : 'No time yet'}
            </span>
            <CardioNote kind={kind} dayIndex={dayIndex} compact />
          </div>
        );
      })}
    </div>
  );
}

function CardioNote({ kind, dayIndex, compact }) {
  const log = useCardio();
  const date = dateFor(dayIndex);
  const saved = log[kind]?.[date]?.min || null;
  const { best } = cardioStats(log, kind);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [msg, setMsg] = useState('');
  function save(e) {
    e.preventDefault();
    const n = Math.round(Number(value));
    const before = best?.min || 0;
    saveCardio(setMinutes(loadCardio(), kind, date, n > 0 ? n : null));
    setOpen(false);
    setMsg(n > before && before > 0 ? `New best: ${n} min! 🏅` : n > 0 && before === 0 ? 'First time logged 🏅' : '');
  }
  return (
    <span className={`cardio-note${compact ? ' compact' : ''}`}>
      {!open && (
        <button
          type="button"
          className="cardio-note-btn"
          onClick={() => { setValue(saved ? String(saved) : ''); setOpen(true); setMsg(''); }}
        >📝 {saved ? `${saved} min` : 'Log min'}</button>
      )}
      {open && (
        <form className="cardio-note-form" onSubmit={save}>
          <input
            type="number" inputMode="numeric" min="0" autoFocus
            value={value} onChange={e => setValue(e.target.value)}
            placeholder="Minutes" aria-label={`${CARDIO_LABEL[kind].name} minutes`}
          />
          <button type="submit">Save</button>
          {best && <span className="cardio-note-goal">Beat {best.min}</span>}
        </form>
      )}
      {msg && <span className="cardio-note-msg">{msg}</span>}
    </span>
  );
}

function DayDetailPage({ day, dayIndex, isToday, onBack }) {
  // The whole lift log for every exercise, held once for the page so each row
  // does not re-read localStorage on every render.
  const [lifts, setLifts] = useState(loadLifts);
  useEffect(() => {
    const refresh = () => setLifts(loadLifts());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  // Every section starts closed so the whole day is one screen — that is the
  // point of the pills. More than one can be open at a time: doing a session
  // means keeping the part you are on open while you look ahead to the next.
  const groups = groupExercises(day.exercises);
  const [openSecs, setOpenSecs] = useState({});
  const allOpen = groups.length > 0 && groups.every((_, i) => openSecs[i]);
  const toggleSec = (i) => setOpenSecs(v => ({ ...v, [i]: !v[i] }));
  const toggleAll = () =>
    setOpenSecs(allOpen ? {} : Object.fromEntries(groups.map((_, i) => [i, true])));
  // Parse stats from day.sub string
  const durationMatch = day.sub?.match(/(\d+(?:–\d+)?)\s*min/);
  const duration = durationMatch ? `${durationMatch[1]} min` : null;
  const isStrength = day.sub?.toLowerCase().includes('strength') || day.title?.toLowerCase().includes('glute') || day.title?.toLowerCase().includes('back') || day.title?.toLowerCase().includes('core');
  const hasWalk    = day.sub?.toLowerCase().includes('walk');
  const isRest     = day.day?.toLowerCase().includes('rest');
  const isMobility = isRest || day.title?.toLowerCase().includes('mobility') || day.title?.toLowerCase().includes('flexibility') || day.title?.toLowerCase().includes('recovery') || day.title?.toLowerCase().includes('stretch');

  return (
    <div className="day-detail-page">
      <button className="day-detail-back" onClick={onBack}>← Home</button>

      <div className="day-detail-header">
        <span className="day-detail-emoji" style={{ background: day.emojiBg }}>{day.emoji}</span>
        <div className="day-detail-meta">
          <div className="day-detail-day">
            {day.day}
            {isToday && <span className="today-badge" style={{ marginLeft: 8 }}>Today</span>}
          </div>
          <div className="day-detail-title">{day.title}</div>
          {day.sub && <div className="day-detail-sub">{day.sub}</div>}
        </div>
      </div>

      {isToday && <TodayDoneButton />}
      {day.exercises.some(e => e.log) && <CardioSummary day={day} dayIndex={dayIndex} />}

      <SectionTitle>Workout</SectionTitle>

      {/* Visual stat chips */}
      <div className="dd-stats">
        {duration   && <div className="dd-stat dd-stat-time"><span>⏱</span>{duration}</div>}
        {isStrength && <div className="dd-stat dd-stat-strength"><span>💪</span>Strength</div>}
        {hasWalk    && <div className="dd-stat dd-stat-zone"><span>🚶</span>Evening walk</div>}
        {isMobility && <div className="dd-stat dd-stat-mobility"><span>🌿</span>Mobility</div>}
        <div className="dd-stat dd-stat-count"><span>📋</span>{day.exercises.filter(e => !e.heading).length} exercises</div>
      </div>

      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <div className="exercise-hint ex-hint-row">
        <span>
          👆 Open a section. Tap ▶ for YouTube or an exercise for form.
          {day.trackLifts && ' Use the grey bar to log sets, reps, and weight.'}
        </span>
        <button className="ex-sec-all" onClick={toggleAll}>
          {allOpen ? 'Close all' : 'Open all'}
        </button>
      </div>
      <div className="ex-secs">
        {groups.map((g, gi) => {
          const open = !!openSecs[gi];
          return (
            <div
              key={gi}
              className={`ex-sec${open ? ' is-open' : ''}${g.tone === 'core' ? ' ex-sec-core' : ''}`}
            >
              <button
                className="ex-sec-pill"
                onClick={() => toggleSec(gi)}
                aria-expanded={open}
              >
                <span className="ex-sec-name">{g.heading || 'Exercises'}</span>
                <span className="ex-sec-count">{g.items.length}</span>
                <span className="ex-sec-caret">▾</span>
              </button>

              {open && (
                <div className="ex-sec-body">
                  {g.hint && <div className="ex-sec-hint">{g.hint}</div>}
                  <ul className="workout-list">
                    {g.items.map((ex, i) => (
                      <li key={i}>
                        <a
                          className={ex.url ? 'ex-link ex-video' : 'ex-link'}
                          href={ex.url || `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+proper+form`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >{ex.url ? '▶ ' : ''}{ex.name}</a>
                        {ex.detail ? <>{' '}— {ex.detail}</> : null}
                        {ex.log && <CardioNote kind={ex.log} dayIndex={dayIndex} />}
                        {day.trackLifts && isTrackable(ex) && (
                          <LiftTracker exercise={ex} lifts={lifts} onChange={setLifts} />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Workouts open from Home (2026-10-10): a day in the week strip or today's
// picture opens that day's full workout straight away. There is no week
// screen any more; back goes Home.
export default function Workout({ openDayId, onNavigate }) {
  const { days: planDays } = usePlanDays();
  const picked = DAY_IDS.indexOf(openDayId);
  const idx = picked >= 0 ? picked : todayIndex;
  const day = planDays[idx];
  return (
    <div className="section">
      <DayDetailPage
        day={day}
        dayIndex={idx}
        isToday={idx === todayIndex}
        onBack={() => onNavigate('home')}
      />
    </div>
  );
}
