import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKOUT_DAYS, RECOMMENDED_MEALS, MEAL_TAGS } from '../data/workouts';
import IngredientDetailPage from './IngredientDetailPage';
import { RecipesPanel, FoodGuide } from './Nutrition';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

const GRID_DAYS = [
  { lbl: 'Mon', emoji: '🍑', name: 'Glute A', focus: 'Hip Thrust · RDL · Split Squat',  color: 'pr' },
  { lbl: 'Tue', emoji: '🪷', name: 'Pilates', focus: 'Deep Core · Posture · Videos',     color: 'py' },
  { lbl: 'Wed', emoji: '🌿', name: 'Pilates', focus: 'Full Body · Lats · Videos',        color: 'py' },
  { lbl: 'Thu', emoji: '🔥', name: 'Glute B', focus: 'Sumo · Kickback · Abduction',      color: 'pr' },
  { lbl: 'Fri', emoji: '✨', name: 'Pilates', focus: 'Core · Alignment · Videos',        color: 'py' },
  { lbl: 'Sat', emoji: '🌷', name: 'Pilates', focus: 'Full Body Flow · Videos',          color: 'py' },
  { lbl: 'Sun', emoji: '🌸', name: 'Pilates', focus: 'Balance · Inversions · Videos',    color: 'py' },
];

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

// Per-day meal selection — the meals you'll eat today, saved locally per day.
function useDayMeals(dayId) {
  const key = `gp_meal_${dayId}`;
  const [items, setItems] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(key) || '[]');
      // Legacy entries were objects {name,...}; keep only recognisable meal names.
      return Array.isArray(raw)
        ? raw.map(x => (typeof x === 'string' ? x : x?.name)).filter(Boolean)
        : [];
    } catch { return []; }
  });
  const save = useCallback((next) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key]);
  return [items, save];
}

// Simple meal plan: pick from a curated list of easy, oil-free, low-calorie
// meals. Tap a meal to see how to make it; tap ＋/✓ to mark what you'll eat.
function MealBuilder({ dayId, baseMeals }) {
  const [chosen, saveChosen] = useDayMeals(dayId);
  const [filter, setFilter]  = useState('All');
  const [openMeal, setOpenMeal] = useState(null);

  const meals = filter === 'All'
    ? RECOMMENDED_MEALS
    : RECOMMENDED_MEALS.filter(m => m.tag === filter);

  function toggleChosen(name) {
    saveChosen(chosen.includes(name) ? chosen.filter(n => n !== name) : [...chosen, name]);
  }

  return (
    <div className="meal-builder">
      <div className="meal-plan-head">
        <div className="meal-plan-label">{baseMeals.label}</div>
        <div className="meal-plan-hint">Tap a meal to see how to make it. Tap ＋ to mark what you'll eat today.</div>
      </div>

      <div className="meal-filter-row">
        {MEAL_TAGS.map(tag => (
          <button
            key={tag}
            className={`meal-filter-chip${filter === tag ? ' active' : ''}`}
            onClick={() => setFilter(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="meal-cards">
        {meals.map(m => {
          const isChosen = chosen.includes(m.name);
          const isOpen   = openMeal === m.name;
          return (
            <div key={m.name} className={`meal-card${isChosen ? ' chosen' : ''}`}>
              <div className="meal-card-row">
                <button className="meal-card-main" onClick={() => setOpenMeal(isOpen ? null : m.name)}>
                  <span className="meal-card-emoji">{m.emoji}</span>
                  <span className="meal-card-text">
                    <span className="meal-card-name">{m.name}</span>
                    <span className="meal-card-ingr">{m.ingredients}</span>
                  </span>
                  <span className="meal-card-cal">~{m.cal} cal</span>
                </button>
                <button
                  className={`meal-card-pick${isChosen ? ' picked' : ''}`}
                  onClick={() => toggleChosen(m.name)}
                  aria-label={isChosen ? 'Remove from today' : 'Add to today'}
                >
                  {isChosen ? '✓' : '＋'}
                </button>
              </div>
              {isOpen && (
                <div className="meal-card-steps">
                  <div className="meal-card-steps-label">🍳 How to make it</div>
                  <div>{m.steps}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {chosen.length > 0 && (
        <div className="meal-chosen-summary">
          <span className="meal-chosen-text">🍽️ Today: {chosen.join(' · ')}</span>
          <button className="meal-chosen-clear" onClick={() => saveChosen([])}>Clear</button>
        </div>
      )}
    </div>
  );
}


function DayDetailPage({ day, id, isToday, onIngredientClick, onBack, userId }) {
  // Parse stats from day.sub string
  const durationMatch = day.sub?.match(/~?(\d+)\s*min/);
  const duration = durationMatch ? `${durationMatch[1]} min` : null;
  const isStrength = day.sub?.toLowerCase().includes('strength') || day.title?.toLowerCase().includes('glute') || day.title?.toLowerCase().includes('back') || day.title?.toLowerCase().includes('core');
  const hasSprint  = day.title?.toLowerCase().includes('sprint') || day.sprintDay;
  const hasZone2   = day.sub?.toLowerCase().includes('zone 2');
  const isMobility = day.title?.toLowerCase().includes('mobility') || day.title?.toLowerCase().includes('flexibility') || day.title?.toLowerCase().includes('recovery');

  return (
    <div className="day-detail-page">
      <button className="day-detail-back" onClick={onBack}>← Back to Week</button>

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

      {/* Visual stat chips */}
      <div className="dd-stats">
        {duration   && <div className="dd-stat dd-stat-time"><span>⏱</span>{duration}</div>}
        {hasSprint  && <div className="dd-stat dd-stat-sprint"><span>⚡</span>Sprint</div>}
        {isStrength && <div className="dd-stat dd-stat-strength"><span>💪</span>Strength</div>}
        {hasZone2   && <div className="dd-stat dd-stat-zone"><span>🫀</span>Zone 2</div>}
        {isMobility && <div className="dd-stat dd-stat-mobility"><span>🌿</span>Mobility</div>}
        <div className="dd-stat dd-stat-count"><span>📋</span>{day.exercises.length} exercises</div>
      </div>

      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <div className="exercise-hint">👆 Tap a video (▶) to open it on YouTube, or tap any exercise for a form demo.</div>
      <ul className="workout-list">
        {day.exercises.map((ex, i) => (
          <li key={i}>
            <a
              className={ex.url ? 'ex-link ex-video' : 'ex-link'}
              href={ex.url || `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+proper+form`}
              target="_blank"
              rel="noopener noreferrer"
            >{ex.url ? '▶ ' : ''}{ex.name}</a>
            {ex.detail ? <>{' '}— {ex.detail}</> : null}
          </li>
        ))}
      </ul>
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}
      <MealBuilder dayId={id} baseMeals={day.meals} />
    </div>
  );
}

function WorkoutNutritionPage({ onBack, pushBack, clearInnerBack }) {
  const [tab, setTab] = useState('recipes');
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  function openIngredient(item) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedIngredient(item);
    pushBack?.(() => { setSelectedIngredient(null); clearInnerBack?.(); });
  }
  function closeIngredient() { clearInnerBack?.(); setSelectedIngredient(null); }

  if (selectedIngredient) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedIngredient.key}
        ingredientName={selectedIngredient.name}
        backLabel="Nutrition & Recipes"
        onBack={closeIngredient}
        pushBack={pushBack}
      />
    );
  }

  return (
    <div className="section">
      <button className="day-detail-back" onClick={onBack}>← Back to Workouts</button>
      <div className="s-header">
        <div className="s-tag">Food &amp; Recipes</div>
        <h2 className="s-title">Nutrition <em>&amp;</em> Recipes</h2>
        <p className="s-desc">Prep your food and check its impact.</p>
      </div>
      <div className="sk-top-tabs splash-item">
        <button className={`sk-top-tab${tab === 'recipes' ? ' active' : ''}`} onClick={() => setTab('recipes')}>🥘 Recipes</button>
        <button className={`sk-top-tab${tab === 'guide'   ? ' active' : ''}`} onClick={() => setTab('guide')}>📊 Food Guide</button>
      </div>
      {tab === 'recipes' && <RecipesPanel onSelectRecipe={openIngredient} />}
      {tab === 'guide'   && <FoodGuide />}
    </div>
  );
}

export default function Workout({ openDayId, onNavigate, pushBack, clearInnerBack, user }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedDayIdx, setSelectedDayIdx]         = useState(null);
  const [showNutrPanel, setShowNutrPanel]           = useState(false);
  const userId        = user?.uid || null;
  const todayDay = WORKOUT_DAYS[todayIndex];

  useEffect(() => {
    if (openDayId) {
      const idx = DAY_IDS.indexOf(openDayId);
      if (idx >= 0) setSelectedDayIdx(idx);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function openDay(idx) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedDayIdx(idx);
    pushBack?.(() => {
      setSelectedDayIdx(null);
      clearInnerBack?.();
    });
  }

  function closeDay() {
    clearInnerBack?.();
    setSelectedDayIdx(null);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  function selectIngredient(ingr) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    clearInnerBack?.();
    setSelectedIngredient(ingr);
    pushBack?.(() => {
      setSelectedIngredient(null);
      clearInnerBack?.();
    });
  }

  function closeIngredient() {
    clearInnerBack?.();
    setSelectedIngredient(null);
  }

  if (showNutrPanel) {
    return (
      <WorkoutNutritionPage
        onBack={() => { setShowNutrPanel(false); clearInnerBack?.(); }}
        pushBack={pushBack}
        clearInnerBack={clearInnerBack}
      />
    );
  }

  if (selectedIngredient) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedIngredient.key}
        ingredientName={selectedIngredient.name}
        backLabel="Meals"
        onBack={closeIngredient}
        pushBack={pushBack}
      />
    );
  }

  if (selectedDayIdx !== null) {
    const day   = WORKOUT_DAYS[selectedDayIdx];
    return (
      <div className="section">
        <DayDetailPage
          day={day}
          id={DAY_IDS[selectedDayIdx]}
          isToday={selectedDayIdx === todayIndex}
          onIngredientClick={selectIngredient}
          onBack={closeDay}
          userId={userId}
        />
      </div>
    );
  }

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&amp;</em> Meals</h2>
        <p className="s-desc">Tap a day to open its full workout and meal plan.</p>
      </div>

      <div className="today-banner splash-item">
        <span className="today-badge">Today</span>
        <span className="today-banner-text">{todayDay.emoji} {todayDay.day} — {todayDay.title}</span>
      </div>

      <div className="week-grid week-grid-nav splash-item">
        {GRID_DAYS.map((d, i) => (
          <button
            key={d.lbl}
            className={`wg-day wg-day-btn${i === todayIndex ? ' wg-today' : ''}`}
            onClick={() => openDay(i)}
          >
            <div className={`wg-dot wg-dot-${d.color}`} />
            <div className="wg-emoji">{d.emoji}</div>
            <div className="wg-lbl">{d.lbl}</div>
            <div className="wg-name">{d.name}</div>
            <div className="wg-focus">{d.focus}</div>
            <div className="wg-tap-hint">Tap →</div>
          </button>
        ))}
      </div>

      <div className="g-card splash-item" style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 8 }}>
        <strong>Progressive overload:</strong> Weeks 1–2 learn form. Weeks 3–4 add 0.5–2 kg or 1–2 reps. If form breaks, add reps first.
      </div>

      <div className="workout-nutrition-row splash-item">
        <button className="workout-nutrition-pill" onClick={() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
          setShowNutrPanel(true);
          pushBack?.(() => { setShowNutrPanel(false); clearInnerBack?.(); });
        }}>
          🥗 Nutrition &amp; Recipes →
        </button>
      </div>
    </div>
  );
}
