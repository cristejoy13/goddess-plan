import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKOUT_DAYS, MEAL_SLOTS, slotMeals, suggestMeals } from '../data/workouts';
import IngredientDetailPage from './IngredientDetailPage';
import { MeatDays, LightDays, RecipesPanel, FoodGuide } from './Nutrition';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

const GRID_DAYS = [
  { lbl: 'Mon', emoji: '🍑', name: 'Glute A',  focus: 'Hip Thrust · RDL · Walk',          color: 'pr' },
  { lbl: 'Tue', emoji: '💪', name: 'Upper A',  focus: 'Back · Shoulders · Rope · Walk',   color: 'py' },
  { lbl: 'Wed', emoji: '🔥', name: 'Glute B',  focus: 'Sumo · Kickback · Walk',           color: 'pr' },
  { lbl: 'Thu', emoji: '⚡', name: 'Upper B',  focus: 'Back · Shoulders · Rope · Walk',   color: 'py' },
  { lbl: 'Fri', emoji: '✨', name: 'Glute C',  focus: 'Kas Bridge · Step-Up · Walk',      color: 'pr' },
  { lbl: 'Sat', emoji: '🧘', name: 'Rest',     focus: 'Stretch · Walk · Forearm Stand',   color: 'py' },
  { lbl: 'Sun', emoji: '🤸', name: 'Rest',     focus: 'Stretch · Walk · Forearm Stand',   color: 'py' },
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

// The meal plan reads as a clock: three meal times, 10 AM → 2 PM → 5 PM. Each
// time opens with a short list of picks chosen for that day — fish on glute
// days, tofu or eggs otherwise — and "more choices" reveals the rest of the
// slot if none of them appeal. Tap a meal for the ingredients, the
// step-by-step method, and to add it to today.
function MealBuilder({ dayId, dayIndex, baseMeals }) {
  const [chosen, saveChosen] = useDayMeals(dayId);
  const [openSlot, setOpenSlot] = useState(null);
  const [showAll, setShowAll]   = useState({});
  const [detail, setDetail]     = useState(null);
  const mealMode = baseMeals.mealMode || 'light';

  function toggleChosen(name) {
    saveChosen(chosen.includes(name) ? chosen.filter(n => n !== name) : [...chosen, name]);
  }

  function Pill({ m }) {
    const isChosen = chosen.includes(m.name);
    return (
      <button className={`meal-pill${isChosen ? ' chosen' : ''}`} onClick={() => setDetail(m)}>
        <span className="meal-pill-em">{m.emoji}</span>
        <span className="meal-pill-name">{m.name}</span>
        <span className="meal-pill-cal">{m.cal}</span>
        {isChosen && <span className="meal-pill-check">✓</span>}
      </button>
    );
  }

  return (
    <div className="meal-builder">
      <div className="meal-plan-head">
        <div className="meal-plan-label">{baseMeals.label}</div>
        <div className="meal-plan-hint">
          {mealMode === 'glute'
            ? 'Fish day — you only eat fish on glute days (Mon · Wed · Fri). Tap a meal time to see today’s picks.'
            : 'No fish today — tofu or eggs at 10 AM. Tap a meal time to see today’s picks.'}
        </div>
      </div>

      <div className="meal-times">
        {MEAL_SLOTS.map(slot => {
          const all       = slotMeals(slot.id, mealMode);
          const suggested = suggestMeals(slot.id, mealMode, dayIndex);
          const rest      = all.filter(m => !suggested.includes(m));
          const picked    = all.filter(m => chosen.includes(m.name));
          const isOpen    = openSlot === slot.id;
          const expanded  = !!showAll[slot.id];
          return (
            <div key={slot.id} className={`meal-time${isOpen ? ' open' : ''}`}>
              <button
                className="meal-time-head"
                onClick={() => setOpenSlot(isOpen ? null : slot.id)}
                aria-expanded={isOpen}
              >
                <span className="meal-time-em">{slot.emoji}</span>
                <span className="meal-time-meta">
                  <span className="meal-time-clock">{slot.time}</span>
                  <span className="meal-time-label">{slot.label}</span>
                  <span className="meal-time-hint">
                    {picked.length ? `✓ ${picked.map(m => m.name).join(' · ')}` : slot.hint}
                  </span>
                </span>
                <span className="meal-time-count">{all.length}</span>
                <span className="meal-time-caret">{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div className="meal-time-body">
                  <div className="meal-sug-label">
                    {slot.id === 'am' && mealMode === 'glute' ? '🐟 Today’s picks · glute day' : '✨ Today’s picks'}
                  </div>
                  <div className="meal-pills">
                    {suggested.map(m => <Pill key={m.name} m={m} />)}
                  </div>

                  {rest.length > 0 && (expanded ? (
                    <>
                      <div className="meal-sug-label">🍽️ All other choices</div>
                      <div className="meal-pills">
                        {rest.map(m => <Pill key={m.name} m={m} />)}
                      </div>
                      <button
                        className="meal-more-btn"
                        onClick={() => setShowAll(v => ({ ...v, [slot.id]: false }))}
                      >Show fewer</button>
                    </>
                  ) : (
                    <button
                      className="meal-more-btn"
                      onClick={() => setShowAll(v => ({ ...v, [slot.id]: true }))}
                    >Don’t like these? {rest.length} more choices ▾</button>
                  ))}
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

      {detail && (
        <div className="ingr-menu-backdrop" onClick={() => setDetail(null)}>
          <div className="meal-detail-sheet" onClick={e => e.stopPropagation()}>
            <div className="meal-detail-top">
              <span className="meal-detail-em">{detail.emoji}</span>
              <div className="meal-detail-meta">
                <div className="meal-detail-name">{detail.name}</div>
                <div className="meal-detail-cal">
                  ~{detail.cal} cal · {MEAL_SLOTS.find(sl => sl.id === detail.slot)?.time}
                </div>
              </div>
            </div>
            <div className="meal-detail-sec">
              <div className="meal-detail-lbl">🥗 Ingredients</div>
              <div>{detail.ingredients}</div>
            </div>
            <div className="meal-detail-sec">
              <div className="meal-detail-lbl">🍳 How to make it</div>
              <ol className="meal-detail-steps">
                {(Array.isArray(detail.steps) ? detail.steps : [detail.steps]).map((st, i) => (
                  <li key={i}>{st}</li>
                ))}
              </ol>
            </div>
            <button
              className={`meal-detail-add${chosen.includes(detail.name) ? ' added' : ''}`}
              onClick={() => toggleChosen(detail.name)}
            >
              {chosen.includes(detail.name) ? '✓ Added to today — tap to remove' : '＋ Add to today'}
            </button>
            <button className="ingr-menu-cancel" onClick={() => setDetail(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}


function DayDetailPage({ day, id, dayIndex, isToday, onIngredientClick, onBack, userId }) {
  // Parse stats from day.sub string
  const durationMatch = day.sub?.match(/~?(\d+)\s*min/);
  const duration = durationMatch ? `${durationMatch[1]} min` : null;
  const isStrength = day.sub?.toLowerCase().includes('strength') || day.title?.toLowerCase().includes('glute') || day.title?.toLowerCase().includes('back') || day.title?.toLowerCase().includes('core');
  const hasSprint  = day.title?.toLowerCase().includes('sprint') || day.sprintDay;
  const hasZone2   = day.sub?.toLowerCase().includes('zone 2');
  const isRest     = day.day?.toLowerCase().includes('rest');
  const isMobility = isRest || day.title?.toLowerCase().includes('mobility') || day.title?.toLowerCase().includes('flexibility') || day.title?.toLowerCase().includes('recovery') || day.title?.toLowerCase().includes('stretch');

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
        <div className="dd-stat dd-stat-count"><span>📋</span>{day.exercises.filter(e => !e.heading).length} exercises</div>
      </div>

      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <div className="exercise-hint">👆 Tap a video (▶) to open it on YouTube, or tap any exercise for a form demo.</div>
      <ul className="workout-list">
        {day.exercises.map((ex, i) => (
          ex.heading ? (
            <li key={i} className={`ex-group${ex.tone === 'core' ? ' ex-group-core' : ''}`}>
              {ex.heading}
              {ex.hint && <small>{ex.hint}</small>}
            </li>
          ) : (
          <li key={i}>
            <a
              className={ex.url ? 'ex-link ex-video' : 'ex-link'}
              href={ex.url || `https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+proper+form`}
              target="_blank"
              rel="noopener noreferrer"
            >{ex.url ? '▶ ' : ''}{ex.name}</a>
            {ex.detail ? <>{' '}— {ex.detail}</> : null}
          </li>
          )
        ))}
      </ul>
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}
      <MealBuilder dayId={id} dayIndex={dayIndex} baseMeals={day.meals} />
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
        <div className="s-tag">Food, Meals &amp; Recipes</div>
        <h2 className="s-title">Nutrition <em>&amp;</em> Meals</h2>
        <p className="s-desc">How you eat on glute days and non-glute days, how to prep every food, and what each one does for you.</p>
      </div>
      <div className="sk-top-tabs splash-item">
        <button className={`sk-top-tab${tab === 'meat'    ? ' active' : ''}`} onClick={() => setTab('meat')}>🐟 Glute Days</button>
        <button className={`sk-top-tab${tab === 'light'   ? ' active' : ''}`} onClick={() => setTab('light')}>🌱 Non-Glute Days</button>
        <button className={`sk-top-tab${tab === 'recipes' ? ' active' : ''}`} onClick={() => setTab('recipes')}>🥘 Recipes</button>
        <button className={`sk-top-tab${tab === 'guide'   ? ' active' : ''}`} onClick={() => setTab('guide')}>📊 Food Guide</button>
      </div>
      {tab === 'meat'    && <MeatDays />}
      {tab === 'light'   && <LightDays />}
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
          dayIndex={selectedDayIdx}
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
          🥗 Nutrition &amp; Meals →
        </button>
      </div>
    </div>
  );
}
