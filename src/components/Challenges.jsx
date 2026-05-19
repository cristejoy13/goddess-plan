import { useState, useCallback } from 'react';
import { MONTHS } from '../data/months';

const YEAR = 2026;
const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const _t = new Date();
const TODAY_KEY = `${_t.getFullYear()}-${String(_t.getMonth()+1).padStart(2,'0')}-${String(_t.getDate()).padStart(2,'0')}`;

function dayKey(monthIdx, day) {
  return `${YEAR}-${String(monthIdx + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function getMonthWeeks(monthIdx) {
  const daysInMonth = new Date(YEAR, monthIdx + 1, 0).getDate();
  // Convert JS day (0=Sun) to Mon-based (0=Mon … 6=Sun)
  const firstDow = (new Date(YEAR, monthIdx, 1).getDay() + 6) % 7;

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

function loadState() {
  try {
    return {
      daily: JSON.parse(localStorage.getItem('gp_daily') || '{}'),
      done:  JSON.parse(localStorage.getItem('gp_done')  || '{}'),
    };
  } catch {
    return { daily: {}, done: {} };
  }
}

function saveState(state) {
  try {
    localStorage.setItem('gp_daily', JSON.stringify(state.daily));
    localStorage.setItem('gp_done',  JSON.stringify(state.done));
  } catch {}
}

function MonthCard({ month, monthIdx, daily, done, onToggleDay, onToggleDone }) {
  const [open, setOpen] = useState(false);
  const weeks = getMonthWeeks(monthIdx);
  const daysInMonth = new Date(YEAR, monthIdx + 1, 0).getDate();
  const prefix = `${YEAR}-${String(monthIdx + 1).padStart(2, '0')}-`;
  const checkedCount = Object.keys(daily).filter(k => k.startsWith(prefix) && daily[k]).length;
  const pct = Math.round((checkedCount / daysInMonth) * 100);

  return (
    <div className={`month-card${done[monthIdx] ? ' done' : ''}`}>
      <div className="m-top">
        <div>
          <div className="m-name">{month.name}</div>
          <div className="m-challenge">{month.ch}</div>
        </div>
        <span className="m-badge">{done[monthIdx] ? '✓ Complete' : 'In Progress'}</span>
      </div>

      <p className="m-why">{month.why}</p>

      <button className={`m-toggle${open ? ' open' : ''}`} onClick={() => setOpen(o => !o)}>
        <span>View Calendar &amp; Daily Checklist</span>
        <span className="m-toggle-arrow">▾</span>
      </button>

      <div className={`m-detail-body${open ? ' open' : ''}`}>
        <div className="m-detail-inner">
          <div className="cal-grid">
            {/* Day-of-week headers */}
            <div className="cal-header">
              {DAY_LETTERS.map(l => <div key={l} className="cal-dh">{l}</div>)}
            </div>

            {/* Week rows */}
            {weeks.map((week, wi) => (
              <div key={wi} className="cal-week-wrap">
                {/* Weekly challenge label — shown for weeks 0–3 */}
                {month.tasks[wi] && (
                  <div className="cal-challenge-label">
                    {month.tasks[wi]}
                  </div>
                )}
                <div className="cal-week-row">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="cal-day cal-day-empty" />;
                    const k = dayKey(monthIdx, day);
                    const checked = !!daily[k];
                    const isToday = k === TODAY_KEY;
                    return (
                      <button
                        key={di}
                        className={`cal-day${checked ? ' cal-day-checked' : ''}${isToday ? ' cal-day-today' : ''}`}
                        onClick={() => onToggleDay(k)}
                        aria-label={`${month.name} ${day}`}
                      >
                        {checked ? '✓' : day}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Progress */}
          <div className="prog-wrap" style={{ marginTop: 16 }}>
            <div className="prog-bg">
              <div className="prog-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="prog-note">{checkedCount} of {daysInMonth} days checked — {pct}% consistency</div>
          </div>
        </div>
      </div>

      <button className="comp-btn" onClick={() => onToggleDone(monthIdx)}>
        {done[monthIdx] ? '✓ Month Completed!' : 'Mark Month Complete →'}
      </button>
    </div>
  );
}

export default function Challenges() {
  const [state, setState] = useState(loadState);

  const toggleDay = useCallback((key) => {
    setState(prev => {
      const next = { daily: { ...prev.daily, [key]: !prev.daily[key] }, done: prev.done };
      saveState(next);
      return next;
    });
  }, []);

  const toggleDone = useCallback((monthIdx) => {
    setState(prev => {
      const next = { daily: prev.daily, done: { ...prev.done, [monthIdx]: !prev.done[monthIdx] } };
      saveState(next);
      return next;
    });
  }, []);

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">January — December 2026</div>
        <h2 className="s-title">Monthly <em>Challenges</em></h2>
        <p className="s-desc">Expand each month to see the full calendar. Tap any day to check it off — your consistency is tracked automatically.</p>
      </div>

      <div className="month-grid">
        {MONTHS.map((m, i) => (
          <MonthCard
            key={i}
            month={m}
            monthIdx={i}
            daily={state.daily}
            done={state.done}
            onToggleDay={toggleDay}
            onToggleDone={toggleDone}
          />
        ))}
      </div>
    </div>
  );
}
