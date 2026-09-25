import { useState, useCallback, useMemo } from 'react';
import {
  dateKey, dateKeyOf, newEntryId, parseCal, calTotals, byTime, loadLog, saveLog,
  parseKg, formatKg, weightOn, setWeight, weekWeightAvg, MIN_KG, MAX_KG,
  parseBurn, burnOn, setBurn, MAX_BURN, MIN_BURN,
  parseGoal, setGoal, weekStartKey, goalForWeek, goalOn, calsLeft, MIN_GOAL, MAX_GOAL,
} from '../utils/mealLog';

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

const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── dates ─────────────────────────────────────────────────────────────────
// dateKey and the rest of the log's shape live in utils/mealLog.js now, shared
// with the meal plan in Workouts, which files a chosen meal straight into this
// record rather than making her type it twice.
const pad = n => String(n).padStart(2, '0');

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

// The seven days ending on a given Sunday, added up.
//
// Real dates, walked backwards with a Date — NOT the row of the grid. A grid
// row can be a stub of three days at the start of a month, and a week total
// that quietly dropped the four days sitting in the previous month would be
// wrong in exactly the way a total must never be. This crosses the month edge
// and, when the log holds those days, counts them.
function weekTotalEnding(days, year, monthIdx, day) {
  let total = 0;
  let counted = 0;
  // new Date(y, m, 0) and below rolls into the previous month on its own, so
  // day - back needs no special case at the start of a month.
  for (let back = 6; back >= 0; back--) {
    const t = calTotals(days[dateKeyOf(new Date(year, monthIdx, day - back))] || []);
    total += t.total;
    counted += t.counted;
  }
  return { total, counted };
}

// The week's number on the Sunday square, in whichever currency the day
// squares are using.
//
// While a goal is set the day squares count DOWN — so the Sunday number counts
// down too, from seven days of the goal. One badge meaning "left" and the
// badge above it meaning "eaten", both unlabelled in the same square, would be
// two different facts wearing one face. With no goal there is nothing to count
// down from, so it stays the plain weekly total it has always been.
function weekNumberEnding(state, year, monthIdx, day) {
  const eaten = weekTotalEnding(state.days || {}, year, monthIdx, day);
  const goal = goalOn(state, dateKeyOf(new Date(year, monthIdx, day)));
  if (goal == null) return { value: eaten.total, show: eaten.counted > 0, over: false };
  const left = goal * 7 - eaten.total;
  // A week under a goal always has something to say, even before she eats.
  return { value: left, show: true, over: left < 0 };
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

// "14–20 Sep", or "28 Sep – 4 Oct" when the week straddles two months. The
// goal editor is headed with this so it is never a question which seven days
// are about to change.
function weekLabelOf(mondayKey) {
  const [y, m, d] = mondayKey.split('-').map(Number);
  const mon = new Date(y, m - 1, d);
  const sun = new Date(y, m - 1, d + 6);
  const sm = MONTH_SHORT[mon.getMonth()];
  const em = MONTH_SHORT[sun.getMonth()];
  return sm === em
    ? `${mon.getDate()}–${sun.getDate()} ${em}`
    : `${mon.getDate()} ${sm} – ${sun.getDate()} ${em}`;
}

function nowTime() {
  const n = new Date();
  return `${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

// ─── the add form ──────────────────────────────────────────────────────────
// The time comes filled in with the current time, so on the ordinary path —
// writing down the meal you just ate — she types the food and nothing else.
// It is still a real time box, so a meal written up later can be corrected by
// tapping it and spinning the wheel.
function MealForm({ initial, onSubmit, onCancel }) {
  const [time, setTime] = useState(() => initial?.time || nowTime());
  const [text, setText] = useState(initial?.text || '');
  const [cal,  setCal]  = useState(() => (initial?.cal != null ? String(initial.cal) : ''));
  const editing = Boolean(initial);

  function submit(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    onSubmit({ time: time || nowTime(), text: t, cal: parseCal(cal) });
    if (!editing) { setText(''); setCal(''); setTime(nowTime()); }
  }

  return (
    // noValidate for the same reason as the weigh-in below: step="1" on the
    // calorie box made the browser swallow the submit whole if she typed a
    // decimal, so the meal was simply never added and nothing said so.
    <form className={`ml-add${editing ? ' ml-add-editing' : ''}`} noValidate onSubmit={submit}>
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
        <label className="ml-cal-wrap">
          <span className="ml-time-lbl">Calories</span>
          <input
            className="ml-cal-input"
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={cal}
            onChange={e => setCal(e.target.value)}
            placeholder="—"
            aria-label="Calories, leave empty if you do not know"
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

// ─── the week's calorie goal ───────────────────────────────────────────────
// How many calories she means to eat on each day of ONE week. She sets a
// different number most weeks, so it belongs to the week and not to the month
// and not to the day: type it once and all seven days of that week answer to
// it.
//
// It sits in the open day rather than on the calendar itself, because the
// calendar has no room for a control and because the day panel is already
// where every other number for that day gets typed. It shows on EVERY day of
// the week, not only Monday — she can reach it from whichever day she has
// open, and the heading names the week it will change so there is never a
// question of which seven days are about to move.
function GoalForm({ cal, weekLabel, onSave }) {
  const [draft, setDraft] = useState(() => (cal != null ? String(cal) : ''));
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState('');

  // The panel stays mounted as she steps from one day to the next, so the box
  // has to follow the week she is looking at.
  const [seen, setSeen] = useState(cal);
  if (seen !== cal) { setSeen(cal); setDraft(cal != null ? String(cal) : ''); setWarn(''); setOpen(false); }

  const typed = draft.trim();
  const parsed = parseGoal(typed);
  const clearing = typed === '' && cal != null;
  const unchanged = typed === (cal != null ? String(cal) : '');

  function submit(e) {
    e.preventDefault();
    if (typed === '') {
      if (cal == null) return;
      if (!window.confirm(`Remove your goal of ${cal.toLocaleString()} calories a day for ${weekLabel}? The calendar will stop showing what you have left for those seven days.`)) return;
      setWarn(''); onSave(null); setOpen(false);
      return;
    }
    if (parsed == null) {
      setWarn(`Type a goal between ${MIN_GOAL.toLocaleString()} and ${MAX_GOAL.toLocaleString()} calories.`);
      return;
    }
    setWarn(''); onSave(parsed); setOpen(false);
  }

  // Closed, it is one line: the number, and a button to change it. Open, it is
  // the box. A screen she reads on the move should not carry an input she is
  // not using.
  if (!open) {
    return (
      <div className="ml-goal ml-goal-shut">
        <div className="ml-goal-head">
          <span className="ml-goal-lbl">🎯 Goal · {weekLabel}</span>
          <button type="button" className="ml-goal-edit" onClick={() => setOpen(true)}>
            {cal != null ? 'Edit' : '＋ Set'}
          </button>
        </div>
        <div className="ml-goal-val">
          {cal != null
            ? <><span className="ml-goal-num">{cal.toLocaleString()}</span> <span className="ml-goal-unit">calories a day</span></>
            : <span className="ml-goal-none">No goal for this week yet</span>}
        </div>
      </div>
    );
  }

  return (
    <form className="ml-goal ml-goal-open" noValidate onSubmit={submit}>
      <div className="ml-goal-head">
        <span className="ml-goal-lbl">🎯 Goal · {weekLabel}</span>
        <button type="button" className="ml-goal-edit" onClick={() => { setOpen(false); setDraft(cal != null ? String(cal) : ''); setWarn(''); }}>
          Cancel
        </button>
      </div>
      <div className="ml-goal-row">
        <input
          className="ml-goal-input"
          type="number"
          inputMode="numeric"
          min={MIN_GOAL}
          max={MAX_GOAL}
          step="any"
          value={draft}
          onChange={e => { setDraft(e.target.value); setWarn(''); }}
          placeholder="—"
          autoFocus
          aria-label={`Calories a day for ${weekLabel}`}
        />
        <span className="ml-goal-unit">a day</span>
        <button type="submit" className="ml-goal-btn" disabled={unchanged}>
          {clearing ? 'Remove' : 'Save'}
        </button>
      </div>
      <div className="ml-goal-note">All seven days of {weekLabel} will count down from this.</div>
      {warn && <div className="ml-wt-warn">{warn}</div>}
    </form>
  );
}

// ─── the daily weigh-in ────────────────────────────────────────────────────
// One number a day, in kilos, sitting under the meals because it is the other
// half of the same question. It is a section of its own rather than a fourth
// box on the meal form: a weight belongs to the DAY, not to the bowl of rice —
// putting it in the form would ask her for it again with every meal she wrote.
//
// Beside it, the day's sum: the weight, what she ate, minus what she burned,
// and whether that left a deficit or a gain. "Burned" is optional and its line
// only appears once she has typed one — without it there is no deficit to
// speak of, and eaten-minus-nothing labelled "gained" would be a false alarm.
//
// Nothing is ever filled in for her. A day she did not weigh stays empty, and
// an empty day is left out of the week's average rather than counted as zero.
function WeightForm({ kg, burn, eaten, onSave }) {
  const kgText = kg != null ? formatKg(kg) : '';
  const burnText = burn != null ? String(burn) : '';
  const [draft, setDraft] = useState(kgText);
  const [burnDraft, setBurnDraft] = useState(burnText);
  const [warn, setWarn] = useState('');

  // She may open Tuesday, then Wednesday, without the panel unmounting in
  // between, so the boxes have to follow the day she is looking at.
  const [seen, setSeen] = useState(`${kgText}|${burnText}`);
  if (seen !== `${kgText}|${burnText}`) {
    setSeen(`${kgText}|${burnText}`); setDraft(kgText); setBurnDraft(burnText); setWarn('');
  }

  const typed = draft.trim();
  const typedBurn = burnDraft.trim();
  // Compared as TEXT, not as parsed numbers. A refused number parses to null,
  // which is also what an empty box parses to — so comparing the numbers made
  // a typo look like no change at all, greyed the button out, and left her
  // with no way to find out why it would not save.
  const kgChanged = typed !== kgText;
  const burnChanged = typedBurn !== burnText;
  const unchanged = !kgChanged && !burnChanged;
  const clearingKg = kgChanged && typed === '' && kg != null;
  const clearingBurn = burnChanged && typedBurn === '' && burn != null;
  const onlyClearing = (clearingKg || !kgChanged) && (clearingBurn || !burnChanged) && !unchanged;

  function submit(e) {
    e.preventDefault();
    if (unchanged) return;
    const patch = {};
    if (kgChanged && typed !== '') {
      const parsed = parseKg(typed);
      if (parsed == null) { setWarn(`Type your weight in kilos, between ${MIN_KG} and ${MAX_KG}.`); return; }
      patch.kg = parsed;
    }
    if (burnChanged && typedBurn !== '') {
      const parsed = parseBurn(typedBurn);
      if (parsed == null) { setWarn(`Type the calories burned as a whole number, up to ${MAX_BURN.toLocaleString()}.`); return; }
      patch.burn = parsed;
    }
    const gone = [
      clearingKg && `your weight of ${formatKg(kg)} kg`,
      clearingBurn && `${burn.toLocaleString()} calories burned`,
    ].filter(Boolean);
    if (gone.length && !window.confirm(`Remove ${gone.join(' and ')} for this day? This cannot be undone.`)) return;
    if (clearingKg) patch.kg = null;
    if (clearingBurn) patch.burn = null;
    setWarn('');
    onSave(patch);
  }

  const net = burn != null ? eaten - burn : null;

  return (
    // noValidate on purpose. With min/max/step left to the browser, a reading
    // like 62.53 fails the step check, the submit event never fires at all,
    // and the number she typed vanishes with no message. The checking is done
    // in parseKg instead, which can say what is wrong in words she can read.
    <form className="ml-wt-form" noValidate onSubmit={submit}>
      <div className="ml-wt-split">
        <div className="ml-wt-row">
          <label className="ml-wt-wrap">
            <span className="ml-time-lbl">⚖️ Weight today</span>
            <div className="ml-wt-field">
              <input
                className="ml-wt-input"
                type="number"
                inputMode="decimal"
                min={MIN_KG}
                max={MAX_KG}
                step="any"
                value={draft}
                onChange={e => { setDraft(e.target.value); setWarn(''); }}
                placeholder="—"
                aria-label="Your weight today, in kilos"
              />
              <span className="ml-wt-unit">kg</span>
            </div>
          </label>
          <label className="ml-wt-wrap">
            <span className="ml-time-lbl">🔥 Burned <span className="ml-wt-opt">(optional)</span></span>
            <div className="ml-wt-field">
              <input
                className="ml-wt-input ml-burn-input"
                type="number"
                inputMode="numeric"
                min={MIN_BURN}
                max={MAX_BURN}
                step="any"
                value={burnDraft}
                onChange={e => { setBurnDraft(e.target.value); setWarn(''); }}
                placeholder="—"
                aria-label="Calories burned today"
              />
              <span className="ml-wt-unit ml-burn-unit">cal</span>
            </div>
          </label>
          <button type="submit" className="ml-wt-btn" disabled={unchanged}>
            {onlyClearing ? 'Remove' : kg != null || burn != null ? 'Save' : '＋ Add'}
          </button>
        </div>

        <div className="ml-sum" aria-label="This day in numbers">
          <div className="ml-sum-kg">{kg != null ? formatKg(kg) : '—'} <span>kg</span></div>
          <div className="ml-sum-rule" aria-hidden="true" />
          <div className="ml-sum-row">
            <span>Total calories eaten</span>
            <b>{eaten.toLocaleString()}</b>
          </div>
          {burn != null && (
            <div className="ml-sum-row ml-sum-burn">
              <span>− Calories burned</span>
              <b>{burn.toLocaleString()}</b>
            </div>
          )}
          {net != null && <>
            <div className="ml-sum-rule" aria-hidden="true" />
            <div className={`ml-sum-row ml-sum-net${net > 0 ? ' ml-sum-gain' : ' ml-sum-deficit'}`}>
              <span>{net > 0 ? 'Gained' : net < 0 ? 'Deficit' : 'Even'}</span>
              <b>{Math.abs(net).toLocaleString()} cal</b>
            </div>
          </>}
        </div>
      </div>
      {warn && <div className="ml-wt-warn">{warn}</div>}
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
      <span className="ml-entry-text">
        {entry.text}
        {entry.fromPlan && <span className="ml-from-plan" title="Filed by your meal plan">· from your plan</span>}
      </span>
      <span className={`ml-entry-cal${entry.cal == null ? ' ml-entry-cal-none' : ''}`}>
        {entry.cal == null ? '—' : `${entry.cal.toLocaleString()} cal`}
      </span>
      <span className="ml-entry-acts">
        <button className="ml-icon-btn" onClick={() => setEditing(true)} aria-label={`Edit ${entry.text}`}>✏️</button>
        <button className="ml-icon-btn ml-del" onClick={onDelete} aria-label={`Delete ${entry.text}`}>🗑</button>
      </span>
    </li>
  );
}

// ─── the open day ──────────────────────────────────────────────────────────
function DayPanel({ year, monthIdx, day, entries, kg, burn, weekAvg, goal, weekLabel, left,
                    onAdd, onEdit, onDelete, onWeight, onGoal, onClose, saveFailed }) {
  const dow = (new Date(year, monthIdx, day).getDay() + 6) % 7;
  const { total, missing } = calTotals(entries);
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

      {(entries.length > 0 || goal != null) && (
        <div className="ml-total">
          {goal != null && (
            <div className={`ml-total-row ml-left-row${left < 0 ? ' ml-left-over' : ''}`}>
              <span className="ml-total-lbl">{left < 0 ? 'Over your goal by' : 'Left to eat today'}</span>
              <span className="ml-left-num">{Math.abs(left).toLocaleString()} cal</span>
            </div>
          )}
          {entries.length > 0 && (
            <div className="ml-total-row">
              <span className="ml-total-lbl">{goal != null ? 'Eaten so far' : 'Total for this day'}</span>
              <span className="ml-total-num">{total.toLocaleString()} cal</span>
            </div>
          )}
          {goal != null && (
            <div className="ml-total-note">Your goal for this week is {goal.toLocaleString()} a day.</div>
          )}
          {missing > 0 && (
            <div className="ml-total-note">
              {missing} {missing === 1 ? 'meal has' : 'meals have'} no calories yet, so {missing === 1 ? 'it is' : 'they are'} not counted.
            </div>
          )}
        </div>
      )}

      {saveFailed && (
        <div className="ml-save-warn">
          ⚠️ This device would not save that. Its storage is full or blocked, so
          what you just typed is not written down yet.
        </div>
      )}

      <MealForm onSubmit={onAdd} />

      <GoalForm cal={goal} weekLabel={weekLabel} onSave={onGoal} />

      <WeightForm kg={kg} burn={burn} eaten={total} onSave={onWeight} />

      {weekAvg && weekAvg.counted > 0 && (
        <div className="ml-wt-week">
          <span className="ml-wt-week-lbl">Average this week</span>
          <span className="ml-wt-week-num">{formatKg(weekAvg.avg)} kg</span>
          <span className="ml-wt-week-note">
            from {weekAvg.counted} {weekAvg.counted === 1 ? 'day' : 'days'} on the scale
          </span>
        </div>
      )}
    </div>
  );
}

export default function Meal() {
  const [state, setState] = useState(loadLog);
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
      setSaveFailed(!saveLog(next));
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
          { id: newEntryId(), ...fields, createdAt: now, updatedAt: now },
        ].sort(byTime),
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
            ? { ...e, ...fields, fromPlan: undefined, updatedAt: new Date().toISOString() }
            : e))
          .sort(byTime),
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

  // The scale reading for a day. Writing null clears it; the record keeps the
  // cleared stamp so another gadget cannot put the old number back.
  const saveWeight = (dayNum, patch) => {
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => {
      let next = prev;
      if ('kg' in patch) next = setWeight(next, key, patch.kg);
      if ('burn' in patch) next = setBurn(next, key, patch.burn);
      return next;
    });
  };

  // The week's goal, filed against that week's Monday so one number answers
  // for all seven days.
  const saveGoal = (dayNum, cal) => {
    commit(prev => setGoal(prev, weekStartKey(year, monthIdx, dayNum), cal));
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

  // Does any week on screen carry a goal? The legend has to name what the
  // squares are showing, and that changes with the month she is looking at.
  const anyGoal = useMemo(
    () => weeks.some(wk => wk.some(d => d && goalOn(state, dateKey(year, monthIdx, d)))),
    [weeks, state, year, monthIdx],
  );

  const openKey = openDay ? dateKey(year, monthIdx, openDay) : null;
  const openIsSunday = openDay ? new Date(year, monthIdx, openDay).getDay() === 0 : false;
  const openMonday = openDay ? weekStartKey(year, monthIdx, openDay) : null;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">What you actually ate</div>
        <h2 className="s-title">My <em>Meals</em></h2>
        <p className="s-desc">
          Tap a day and write down what you ate. The time fills itself in — tap it to change it.
          Meals you choose in your plan land here on their own, with their time and calories.
          Anything else you type yourself. ✏️ changes a line, 🗑 removes one, and everything stays
          for good, on every device, until you delete it yourself.
          Set a goal for the week and every square counts down: the number is what you have
          LEFT to eat that day, not what you ate. Under the meals there is one box for your
          weight in kilos, and on Sunday the square shows that day's weight beside the week's
          average. Type what you burned too, if you know it, and it shows your deficit.
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
              const dayEntries = days[key] || [];
              const count = dayEntries.length;
              const { total, counted } = calTotals(dayEntries);
              const isToday = isThisMonth && day === today.d;
              const isOpen = openDay === day;
              // Column 6 is Sunday — the grid runs Mo…Su — and Sunday is where
              // the week closes, so that is where its total belongs.
              const isSunday = di === 6;
              const week = isSunday ? weekNumberEnding(state, year, monthIdx, day) : null;
              const showWeek = Boolean(week && week.show);
              // What she came to the calendar to find out: how much is left of
              // today. Only a week with a goal has an answer; without one the
              // square shows what she ate, as it always did.
              const left = calsLeft(state, key);
              const showLeft = left != null;
              // The scale sits above the calories with a rule between them,
              // because two bare numbers stacked in one square with nothing
              // between them read as one four-digit number.
              const kg = weightOn(state, key);
              const wk = isSunday ? weekWeightAvg(state, year, monthIdx, day) : null;
              const avg = wk && wk.counted > 0 ? wk.avg : null;
              const showWt = kg != null || avg != null;
              const showRule = showWt && (showLeft || count > 0);
              return (
                <button
                  key={di}
                  className={`ml-day${count ? ' ml-day-has' : ''}${isToday ? ' ml-day-today' : ''}${isOpen ? ' ml-day-open' : ''}${showWeek || showWt ? ' ml-day-sun' : ''}`}
                  onClick={() => setOpenDay(isOpen ? null : day)}
                  aria-label={`${day} ${MONTH_NAMES[monthIdx]} ${year}, ${
                    showLeft
                      ? (left < 0
                          ? `${Math.abs(left)} calories over your goal`
                          : `${left} calories left of your goal`)
                      : count === 0
                        ? 'nothing written down'
                        : counted === 0
                          ? `${count} ${count === 1 ? 'meal' : 'meals'} written down, no calories yet`
                          : `${total} calories`
                  }${showWeek
                    ? (week.over
                        ? `, ${Math.abs(week.value)} calories over for the week`
                        : `, ${week.value} calories ${goalOn(state, key) == null ? 'this week' : 'left this week'}`)
                    : ''}${
                    kg != null ? `, ${formatKg(kg)} kilos` : ''
                  }${avg != null ? `, ${formatKg(avg)} kilos on average this week` : ''}`}
                >
                  <span className="ml-day-num">{day}</span>
                  {showWt && (
                    <span className="ml-day-wt">
                      <span className="ml-wt-day">{kg != null ? formatKg(kg) : '–'}</span>
                      {avg != null && <>
                        <span className="ml-wt-slash">/</span>
                        <span className="ml-wt-avg">{formatKg(avg)}</span>
                      </>}
                    </span>
                  )}
                  {showRule && <span className="ml-day-rule" aria-hidden="true" />}
                  {showLeft
                    ? <span className={`ml-day-dot ml-day-left${left < 0 ? ' ml-day-over' : ''}`}>
                        {left < 0 ? `−${Math.abs(left)}` : left}
                      </span>
                    : count > 0 && (
                        <span className={`ml-day-dot${counted === 0 ? ' ml-day-dot-none' : ''}`}>
                          {counted === 0 ? '·' : total}
                        </span>
                      )}
                  {showWeek && (
                    <span className={`ml-day-week${week.over ? ' ml-day-over' : ''}`}>
                      {week.over ? `−${Math.abs(week.value)}` : week.value}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="ml-summary splash-item">
        🍽️ {daysWritten} of {daysInMonth} days written down in {MONTH_NAMES[monthIdx]}
      </div>
      {/* Two bare numbers stacked in one square would be a guess without this
          one line. It is the only words the grid gets. */}
      <div className="ml-legend splash-item">
        {anyGoal ? (
          <>
            <span className="ml-legend-item"><span className="ml-day-dot ml-day-left">000</span> calories left, the day</span>
            <span className="ml-legend-item"><span className="ml-day-week">000</span> calories left, the week</span>
          </>
        ) : (
          <>
            <span className="ml-legend-item"><span className="ml-day-dot">000</span> calories eaten, the day</span>
            <span className="ml-legend-item"><span className="ml-day-week">000</span> calories eaten, the week</span>
          </>
        )}
        <span className="ml-legend-item"><span className="ml-day-wt"><span className="ml-wt-day">00</span></span> kilos, the day</span>
        <span className="ml-legend-item"><span className="ml-day-wt"><span className="ml-wt-avg">00</span></span> kilos, the week</span>
      </div>

      {openDay && (
        <DayPanel
          year={year}
          monthIdx={monthIdx}
          day={openDay}
          entries={days[openKey] || []}
          kg={weightOn(state, openKey)}
          burn={burnOn(state, openKey)}
          /* The average belongs to the week, so it is shown where the week
             closes — on Sunday — and nowhere else, rather than on every day as
             a half-finished figure. */
          weekAvg={openIsSunday ? weekWeightAvg(state, year, monthIdx, openDay) : null}
          goal={openMonday ? goalForWeek(state, openMonday) : null}
          weekLabel={openMonday ? weekLabelOf(openMonday) : ''}
          left={openKey ? calsLeft(state, openKey) : null}
          onAdd={(fields) => addEntry(openDay, fields)}
          onEdit={(entry, fields) => editEntry(openDay, entry, fields)}
          onDelete={(entry) => deleteEntry(openDay, entry)}
          onWeight={(patch) => saveWeight(openDay, patch)}
          onGoal={(cal) => saveGoal(openDay, cal)}
          onClose={() => setOpenDay(null)}
          saveFailed={saveFailed}
        />
      )}
    </div>
  );
}
