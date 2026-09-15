import { useState, useCallback, useMemo } from 'react';

// ─── MEAL ──────────────────────────────────────────────────────────────────
// The record of what she actually ate, day by day, as against the plan of what
// she is meant to eat. The plan lives in Workouts; this is the truth, and the
// two are deliberately separate — a record that quietly fills itself in with
// the plan would tell her nothing about whether she is really eating well.
//
// So nothing is ever written here except by her. A day she did not fill in
// reads as empty, not as a guess.
//
// The log is a month calendar because the question she actually asks is a
// month-shaped one: did I eat well THIS month? A list of lines cannot answer
// that; a grid with gaps in it answers it at a glance. The year and month both
// step backwards and forwards, so an old month is always reachable.

const STORE_KEY = 'gp_meal_log';

const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// ─── dates ─────────────────────────────────────────────────────────────────
// Everything is keyed on the LOCAL date, never on a UTC ISO string: toISOString
// would file an 11 PM meal in Cebu under the following day.
const pad = n => String(n).padStart(2, '0');
const dateKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

function todayParts() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
}

// Monday-first weeks, with the leading and trailing blanks the grid needs.
function monthWeeks(year, monthIdx) {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDow = (new Date(year, monthIdx, 1).getDay() + 6) % 7;
  const weeks = [];
  let week = Array(7).fill(null);
  let day = 1;
  for (let d = firstDow; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
  weeks.push([...week]);
  while (day <= daysInMonth) {
    week = Array(7).fill(null);
    for (let d = 0; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
    weeks.push([...week]);
  }
  return weeks;
}

// "14:05" → "2:05 PM". She thinks in 12-hour clock, and the plan is written in
// it, so the record reads back the same way even though it is stored as 24-hour
// (which is what <input type="time"> gives and what sorts correctly).
function prettyTime(hhmm) {
  const [h, m] = String(hhmm || '').split(':');
  const hour = Number(h);
  if (!Number.isFinite(hour)) return '';
  const suffix = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m || '00'} ${suffix}`;
}

function nowTime() {
  const n = new Date();
  return `${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

function newId() {
  return `ml_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

// ─── storage ───────────────────────────────────────────────────────────────
// An unreadable or missing log starts empty. It is NEVER seeded with example
// meals: an invented line here would be indistinguishable from something she
// really ate, which would poison the one thing this page is for.
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    if (raw && typeof raw === 'object' && raw.days && typeof raw.days === 'object') {
      return { days: raw.days, deleted: raw.deleted || {}, updatedAt: raw.updatedAt || '' };
    }
  } catch { /* fall through to an empty log */ }
  return { days: {}, deleted: {}, updatedAt: '' };
}

// Returns whether the write actually landed. A meal she typed and watched
// disappear is the one failure this page cannot afford, so a full or blocked
// storage has to reach her as a visible line rather than being swallowed.
function save(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// ─── the add form ──────────────────────────────────────────────────────────
// The time comes filled in with the current time, so on the ordinary path —
// writing down the meal you just ate — she types the food and nothing else.
// It is still a real time box, so a meal written up later can be corrected by
// tapping it and spinning the wheel.
function MealForm({ initial, onSubmit, onCancel }) {
  const [time, setTime] = useState(() => initial?.time || nowTime());
  const [text, setText] = useState(initial?.text || '');
  const editing = Boolean(initial);

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSubmit({ time: time || nowTime(), text: t });
    if (!editing) { setText(''); setTime(nowTime()); }
  }

  return (
    <form className={`ml-add${editing ? ' ml-add-editing' : ''}`} onSubmit={submit}>
      <div className="ml-add-row">
        <label className="ml-time-wrap">
          <span className="ml-time-lbl">Time</span>
          <input
            className="ml-time-input"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            aria-label="Time you ate"
          />
        </label>
        <label className="ml-text-wrap">
          <span className="ml-time-lbl">What did you eat?</span>
          <input
            className="ml-text-input"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Type it here"
            autoFocus={editing}
          />
        </label>
      </div>
      <div className="ml-form-btns">
        <button type="submit" className="ml-add-btn" disabled={!text.trim()}>
          {editing ? 'Save' : '＋ Add this meal'}
        </button>
        {editing && <button type="button" className="ml-cancel-btn" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

// One written meal. The two actions are icons only — a pencil and a bin — so
// the row stays the meal rather than the buttons around it.
function EntryRow({ entry, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="ml-entry ml-entry-editing">
        <MealForm
          initial={entry}
          onSubmit={(fields) => { onEdit(fields); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="ml-entry">
      <span className="ml-entry-time">{prettyTime(entry.time)}</span>
      <span className="ml-entry-text">{entry.text}</span>
      <span className="ml-entry-acts">
        <button className="ml-icon-btn" onClick={() => setEditing(true)} aria-label={`Edit ${entry.text}`}>✏️</button>
        <button className="ml-icon-btn ml-del" onClick={onDelete} aria-label={`Delete ${entry.text}`}>🗑</button>
      </span>
    </li>
  );
}

// ─── the open day ──────────────────────────────────────────────────────────
function DayPanel({ year, monthIdx, day, entries, onAdd, onEdit, onDelete, onClose, saveFailed }) {
  const dow = (new Date(year, monthIdx, day).getDay() + 6) % 7;
  return (
    <div className="ml-day-panel splash-item">
      <div className="ml-day-head">
        <div>
          <div className="ml-day-date">{DAY_NAMES[dow]}, {day} {MONTH_NAMES[monthIdx]} {year}</div>
          <div className="ml-day-count">
            {entries.length === 0
              ? 'Nothing written down yet'
              : `${entries.length} ${entries.length === 1 ? 'meal' : 'meals'} written down`}
          </div>
        </div>
        <button className="ml-close" onClick={onClose} aria-label="Close this day">✕</button>
      </div>

      <ul className="ml-entries">
        {entries.map(en => (
          <EntryRow
            key={en.id}
            entry={en}
            onEdit={(fields) => onEdit(en, fields)}
            onDelete={() => onDelete(en)}
          />
        ))}
        {entries.length === 0 && (
          <li className="ml-entry-empty">Write the first meal of this day below.</li>
        )}
      </ul>

      {saveFailed && (
        <div className="ml-save-warn">
          ⚠️ This device would not save that. Its storage is full or blocked, so
          what you just typed is not written down yet.
        </div>
      )}

      <MealForm onSubmit={onAdd} />
    </div>
  );
}

export default function Meal() {
  const [state, setState] = useState(load);
  // Read once and hold it: "today" must not shift under her while the page is
  // open, or the ring would jump to a different square at midnight mid-edit.
  const today = useMemo(() => todayParts(), []);
  const [year, setYear] = useState(today.y);
  const [monthIdx, setMonthIdx] = useState(today.m);
  const [openDay, setOpenDay] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const days = state.days || {};

  const commit = useCallback((updater) => {
    setState(prev => {
      const next = { ...updater(prev), updatedAt: new Date().toISOString() };
      setSaveFailed(!save(next));
      return next;
    });
  }, []);

  const addEntry = (dayNum, fields) => {
    const key = dateKey(year, monthIdx, dayNum);
    const now = new Date().toISOString();
    commit(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [key]: [
          ...(prev.days[key] || []),
          { id: newId(), ...fields, createdAt: now, updatedAt: now },
        ].sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0)),
      },
    }));
  };

  const editEntry = (dayNum, entry, fields) => {
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [key]: (prev.days[key] || [])
          .map(e => (e.id === entry.id
            ? { ...e, ...fields, updatedAt: new Date().toISOString() }
            : e))
          .sort((a, b) => (a.time < b.time ? -1 : a.time > b.time ? 1 : 0)),
      },
    }));
  };

  // A deleted line leaves a tombstone, or the other gadget's copy would put it
  // straight back on the next sync.
  const deleteEntry = (dayNum, entry) => {
    if (!window.confirm(`Delete “${entry.text}” at ${prettyTime(entry.time)}? This cannot be undone.`)) return;
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => {
      const left = (prev.days[key] || []).filter(e => e.id !== entry.id);
      const nextDays = { ...prev.days };
      if (left.length) nextDays[key] = left; else delete nextDays[key];
      return {
        ...prev,
        days: nextDays,
        deleted: { ...prev.deleted, [entry.id]: new Date().toISOString() },
      };
    });
  };

  // Month and year both step, and each step closes the open day so the panel
  // can never show one month's meals under another month's heading.
  function step(deltaMonths, deltaYears) {
    setOpenDay(null);
    let m = monthIdx + deltaMonths;
    let y = year + deltaYears;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonthIdx(m);
    setYear(y);
  }

  function goToday() {
    setOpenDay(null);
    setYear(today.y);
    setMonthIdx(today.m);
  }

  const weeks = monthWeeks(year, monthIdx);
  const isThisMonth = year === today.y && monthIdx === today.m;

  // Counted from what is actually stored, so a month she has not filled in
  // honestly reads zero rather than borrowing numbers from the plan.
  const daysWritten = Object.keys(days).filter(k => k.startsWith(`${year}-${pad(monthIdx + 1)}-`)).length;
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const openKey = openDay ? dateKey(year, monthIdx, openDay) : null;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">What you actually ate</div>
        <h2 className="s-title">My <em>Meals</em></h2>
        <p className="s-desc">
          Tap a day and write down what you ate. The time fills itself in — tap it to change it.
          Use ✏️ to change a line and 🗑 to remove one. Everything you write stays for good,
          on every device, until you delete it yourself.
        </p>
      </div>

      <div className="ml-nav splash-item">
        <div className="ml-nav-row">
          <button className="ml-nav-btn" onClick={() => step(-1, 0)} aria-label="Previous month">‹</button>
          <div className="ml-nav-label">{MONTH_NAMES[monthIdx]}</div>
          <button className="ml-nav-btn" onClick={() => step(1, 0)} aria-label="Next month">›</button>
        </div>
        <div className="ml-nav-row ml-nav-year">
          <button className="ml-nav-btn" onClick={() => step(0, -1)} aria-label="Previous year">‹</button>
          <div className="ml-nav-label">{year}</div>
          <button className="ml-nav-btn" onClick={() => step(0, 1)} aria-label="Next year">›</button>
        </div>
        {!isThisMonth && (
          <button className="ml-today-btn" onClick={goToday}>Back to this month</button>
        )}
      </div>

      <div className="ml-cal splash-item">
        <div className="ml-cal-head">
          {DAY_LETTERS.map(d => <div key={d} className="ml-dh">{d}</div>)}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="ml-week">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="ml-day ml-day-empty" />;
              const key = dateKey(year, monthIdx, day);
              const count = (days[key] || []).length;
              const isToday = isThisMonth && day === today.d;
              const isOpen = openDay === day;
              return (
                <button
                  key={di}
                  className={`ml-day${count ? ' ml-day-has' : ''}${isToday ? ' ml-day-today' : ''}${isOpen ? ' ml-day-open' : ''}`}
                  onClick={() => setOpenDay(isOpen ? null : day)}
                  aria-label={`${day} ${MONTH_NAMES[monthIdx]} ${year}, ${count} ${count === 1 ? 'meal' : 'meals'} written down`}
                >
                  <span className="ml-day-num">{day}</span>
                  {count > 0 && <span className="ml-day-dot">{count}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="ml-summary splash-item">
        🍽️ {daysWritten} of {daysInMonth} days written down in {MONTH_NAMES[monthIdx]}
      </div>

      {openDay && (
        <DayPanel
          year={year}
          monthIdx={monthIdx}
          day={openDay}
          entries={days[openKey] || []}
          onAdd={(fields) => addEntry(openDay, fields)}
          onEdit={(entry, fields) => editEntry(openDay, entry, fields)}
          onDelete={(entry) => deleteEntry(openDay, entry)}
          onClose={() => setOpenDay(null)}
          saveFailed={saveFailed}
        />
      )}
    </div>
  );
}
