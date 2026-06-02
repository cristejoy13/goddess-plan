import { useState, useCallback, useEffect, useRef } from 'react';
import { MONTHS } from '../data/months';
import IngredientDetailPage from './IngredientDetailPage';
import { MeatDays, LightDays, RecipesPanel, FoodGuide, TABS } from './Nutrition';

const CURRENT_YEAR = new Date().getFullYear();
const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const _t = new Date();
const TODAY_KEY = `${_t.getFullYear()}-${String(_t.getMonth()+1).padStart(2,'0')}-${String(_t.getDate()).padStart(2,'0')}`;

function dayKey(monthIdx, day) {
  return `${CURRENT_YEAR}-${String(monthIdx + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
}

function getMonthWeeks(monthIdx) {
  const daysInMonth = new Date(CURRENT_YEAR, monthIdx + 1, 0).getDate();
  const firstDow = (new Date(CURRENT_YEAR, monthIdx, 1).getDay() + 6) % 7;

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

function clearProgress() {
  localStorage.removeItem('gp_daily');
  localStorage.removeItem('gp_done');
  localStorage.setItem('gp_year', String(CURRENT_YEAR));
}

function loadState() {
  try {
    const storedYear = parseInt(localStorage.getItem('gp_year') || '0', 10);
    if (storedYear === 0) {
      localStorage.setItem('gp_year', String(CURRENT_YEAR));
    }
    if (storedYear !== 0 && storedYear !== CURRENT_YEAR) {
      clearProgress();
      return { daily: {}, done: {}, autoReset: true };
    }
    return {
      daily: JSON.parse(localStorage.getItem('gp_daily') || '{}'),
      done:  JSON.parse(localStorage.getItem('gp_done')  || '{}'),
      autoReset: false,
    };
  } catch {
    return { daily: {}, done: {}, autoReset: false };
  }
}

function saveState(state) {
  try {
    localStorage.setItem('gp_daily', JSON.stringify(state.daily));
    localStorage.setItem('gp_done',  JSON.stringify(state.done));
  } catch {}
}

function MonthCard({ month, monthIdx, daily, done, onToggleDay, onToggleDone, isOpen, onOpen }) {
  const weeks = getMonthWeeks(monthIdx);
  const daysInMonth = new Date(CURRENT_YEAR, monthIdx + 1, 0).getDate();
  const prefix = `${CURRENT_YEAR}-${String(monthIdx + 1).padStart(2, '0')}-`;
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

      <button className={`m-toggle${isOpen ? ' open' : ''}`} onClick={onOpen}>
        <span>View Calendar &amp; Daily Checklist</span>
        <span className="m-toggle-arrow">▾</span>
      </button>

      <div className={`m-detail-body${isOpen ? ' open' : ''}`}>
        <div className="m-detail-inner">
          <div className="cal-grid">
            <div className="cal-header">
              {DAY_LETTERS.map(l => <div key={l} className="cal-dh">{l}</div>)}
            </div>
            {weeks.map((week, wi) => (
              <div key={wi} className="cal-week-wrap">
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

const NUTR_TABS = [
  { id: 'meat',    icon: '🔥', label: 'Strength & Sprint' },
  { id: 'light',   icon: '🌿', label: 'Pilates & Rest' },
  { id: 'recipes', icon: '🥘', label: 'Recipes' },
  { id: 'guide',   icon: '📊', label: 'Food Guide' },
];

export default function Challenges({ onNavigate, pushBack, clearInnerBack }) {
  const [state, setState] = useState(loadState);
  const currentMonth = new Date().getMonth();
  const [openMonthIdx, setOpenMonthIdx] = useState(currentMonth);
  const currentMonthRef = useRef(null);

  // Nutrition state
  const [nutrTab, setNutrTab] = useState(null);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  function toggleMonth(idx) {
    setOpenMonthIdx(prev => prev === idx ? null : idx);
  }

  useEffect(() => {
    if (currentMonthRef.current) {
      setTimeout(() => currentMonthRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleDay = useCallback((key) => {
    setState(prev => {
      const next = { ...prev, daily: { ...prev.daily, [key]: !prev.daily[key] } };
      saveState(next);
      return next;
    });
  }, []);

  const toggleDone = useCallback((monthIdx) => {
    setState(prev => {
      const next = { ...prev, done: { ...prev.done, [monthIdx]: !prev.done[monthIdx] } };
      saveState(next);
      return next;
    });
  }, []);

  function handleReset() {
    if (!window.confirm('Reset all progress? Every checked day and completed month will be cleared. This cannot be undone.')) return;
    clearProgress();
    setState({ daily: {}, done: {}, autoReset: false });
  }

  function openIngredient(item) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedIngredient(item);
    pushBack?.(() => {
      setSelectedIngredient(null);
      clearInnerBack?.();
    });
  }

  function closeIngredient() {
    clearInnerBack?.();
    setSelectedIngredient(null);
  }

  // Full-screen ingredient detail
  if (selectedIngredient) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedIngredient.key}
        ingredientName={selectedIngredient.name}
        backLabel="Nutrition"
        onBack={closeIngredient}
        pushBack={pushBack}
      />
    );
  }

  const completedMonths = Object.values(state.done).filter(Boolean).length;
  const totalChecked = Object.values(state.daily).filter(Boolean).length;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">June {CURRENT_YEAR} — May {CURRENT_YEAR + 1}</div>
        <h2 className="s-title">Monthly <em>Challenges</em></h2>
        <p className="s-desc">Expand each month to see the full calendar. Tap any day to check it off — your consistency is tracked automatically.</p>
      </div>

      {state.autoReset && (
        <div className="challenges-year-banner splash-item">
          🎉 Welcome to {CURRENT_YEAR}! Your {CURRENT_YEAR - 1} progress has been cleared — a fresh start awaits.
        </div>
      )}

      <div className="month-grid">
        {MONTHS.map((m, i) => (
          <div key={i} id={`month-${i}`} ref={i === currentMonth ? currentMonthRef : null}>
            <MonthCard
              month={m}
              monthIdx={i}
              daily={state.daily}
              done={state.done}
              onToggleDay={toggleDay}
              onToggleDone={toggleDone}
              isOpen={openMonthIdx === i}
              onOpen={() => toggleMonth(i)}
            />
          </div>
        ))}
      </div>

      <div className="challenges-reset-section splash-item">
        <div className="challenges-reset-summary">
          {completedMonths} month{completedMonths !== 1 ? 's' : ''} complete · {totalChecked} day{totalChecked !== 1 ? 's' : ''} checked
        </div>
        <button className="challenges-reset-btn" onClick={handleReset}>
          <span>🗑</span>
          <span>Reset All Progress</span>
        </button>
        <p className="challenges-reset-note">
          Progress also resets automatically each new year so you always start fresh.
        </p>
      </div>

      {/* ── Nutrition & Meals ── */}
      <div className="divider splash-item" style={{ marginTop: 36 }}>🍽️ Nutrition &amp; Meals</div>
      <p className="s-desc splash-item" style={{ marginBottom: 16 }}>
        Hard days (Mon/Wed/Fri/Sat): eat 9 AM – 7 PM · Light days (Tue/Thu/Sun): eat 3 PM – 7 PM
      </p>

      <div className="sk-top-tabs splash-item">
        {NUTR_TABS.map(t => (
          <button
            key={t.id}
            className={`sk-top-tab${nutrTab === t.id ? ' active' : ''}`}
            onClick={() => setNutrTab(nutrTab === t.id ? null : t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {nutrTab === 'meat'    && <MeatDays />}
      {nutrTab === 'light'   && <LightDays />}
      {nutrTab === 'recipes' && <RecipesPanel onSelectRecipe={openIngredient} />}
      {nutrTab === 'guide'   && <FoodGuide />}
    </div>
  );
}
