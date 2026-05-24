import { useState, useEffect, useRef, useCallback } from 'react';
import PetalAccordion from './PetalAccordion';
import { WORKOUT_DAYS } from '../data/workouts';
import IngredientDetailPage from './IngredientDetailPage';
import { FOODS, FOOD_CATS } from '../data/foods';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];
// Mon(0), Wed(2), Thu(3) = strength; rest = light
const DAY_TYPES = ['strength', 'light', 'strength', 'strength', 'light', 'light', 'light'];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

function MealBox({ meals, onIngredientClick }) {
  return (
    <div className="meal-box">
      <div className="meal-lbl">{meals.label}</div>
      {meals.rows.map((r, i) => (
        <div key={i} className="meal-row">
          <span className="meal-t">{r.time}</span>
          <div className="meal-ingr-list">
            {r.ingredients.map((ingr, j) => {
              const next = r.ingredients[j + 1];
              const comma = !ingr.key && next && !next.key;
              return ingr.key ? (
                <button key={j} className="meal-ingr-chip" onClick={() => onIngredientClick(ingr)}>
                  {ingr.name}
                </button>
              ) : (
                <span key={j} className="meal-ingr-plain">{ingr.name}{comma ? ',' : ''}</span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalorieBanner({ tdee, deficit }) {
  if (!tdee) return null;
  return (
    <div className="cal-banner splash-item">
      <span className="cal-banner-item">🔥 Maintenance <strong>{tdee} kcal</strong></span>
      <span className="cal-banner-sep">·</span>
      <span className="cal-banner-item">🎯 Deficit target <strong>{deficit} kcal</strong></span>
    </div>
  );
}

/* ─── Custom Meal Builder ─── */
function useDayMeals(dayId) {
  const key = `gp_meal_${dayId}`;
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const save = useCallback((next) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }, [key]);
  return [items, save];
}

function MealBuilder({ dayId, baseMeals, onIngredientClick }) {
  const [custom, saveCustom] = useDayMeals(dayId);
  const [query, setQuery]    = useState('');
  const [browse, setBrowse]  = useState(false);
  const holdRef = useRef({});

  const filtered = query.trim().length > 0
    ? FOODS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  function addFood(food) {
    if (custom.find(c => c.name === food.name)) return;
    saveCustom([...custom, { name: food.name, emoji: food.emoji, meal: food.meal }]);
    setQuery('');
    setBrowse(false);
  }

  function startHold(name) {
    holdRef.current[name] = setTimeout(() => {
      if (window.confirm(`Remove "${name}" from this day's meal?`)) {
        saveCustom(custom.filter(c => c.name !== name));
      }
    }, 500);
  }
  function cancelHold(name) { clearTimeout(holdRef.current[name]); }

  // Merge custom into base meal rows
  const mealSlotMap = { morning: 0, snack: null, lunch: 1, dinner: 2 };
  const rows = baseMeals.rows.map(r => ({ ...r, ingredients: [...r.ingredients] }));
  // Add a "snack" row if any custom items belong there
  const snackItems = custom.filter(c => c.meal === 'snack');
  const hasSnackRow = rows.some(r => r.time.toLowerCase().includes('snack'));
  if (snackItems.length > 0 && !hasSnackRow) {
    rows.splice(1, 0, { time: 'Snack', ingredients: [] });
  }
  custom.forEach(c => {
    const ingr = { name: `${c.emoji} ${c.name}`, key: null, custom: true };
    if (c.meal === 'morning' && rows[0]) rows[0].ingredients.push(ingr);
    else if (c.meal === 'snack') {
      const si = rows.findIndex(r => r.time === 'Snack');
      if (si >= 0) rows[si].ingredients.push(ingr);
    } else if (c.meal === 'lunch' && rows[1]) rows[1].ingredients.push(ingr);
    else if (c.meal === 'dinner' && rows[rows.length - 1]) rows[rows.length - 1].ingredients.push(ingr);
    else if (rows[rows.length - 1]) rows[rows.length - 1].ingredients.push(ingr);
  });

  return (
    <div className="meal-builder">
      {/* Custom ingredient chips */}
      {custom.length > 0 && (
        <div className="mb-custom-chips">
          {custom.map(c => (
            <button
              key={c.name}
              className="mb-chip"
              onMouseDown={() => startHold(c.name)}
              onMouseUp={() => cancelHold(c.name)}
              onMouseLeave={() => cancelHold(c.name)}
              onTouchStart={() => startHold(c.name)}
              onTouchEnd={() => cancelHold(c.name)}
              title="Hold to remove"
            >
              {c.emoji} {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Search bar */}
      <div className="mb-search-wrap">
        <input
          className="mb-search"
          type="text"
          placeholder="🔍 Add ingredient to your meal..."
          value={query}
          onChange={e => { setQuery(e.target.value); setBrowse(false); }}
          onFocus={() => { if (!query) setBrowse(true); }}
        />
        <button className="mb-az-btn" onClick={() => { setBrowse(b => !b); setQuery(''); }}>A–Z</button>
      </div>

      {/* Search results */}
      {filtered.length > 0 && (
        <div className="mb-results">
          {filtered.map(f => (
            <button key={f.name} className="mb-result-item" onClick={() => addFood(f)}>
              <span className="mb-result-em">{f.emoji}</span>
              <span className="mb-result-name">{f.name}</span>
              <span className="mb-result-cat">{f.cat}</span>
            </button>
          ))}
        </div>
      )}

      {/* Browse A-Z */}
      {browse && query === '' && (
        <div className="mb-browse">
          {FOOD_CATS.map(cat => {
            const catFoods = FOODS.filter(f => f.cat === cat);
            return (
              <div key={cat} className="mb-cat">
                <div className="mb-cat-label">{cat}</div>
                <div className="mb-cat-items">
                  {catFoods.map(f => (
                    <button key={f.name} className="mb-cat-item" onClick={() => addFood(f)}>
                      {f.emoji} {f.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meal plan with custom ingredients merged in */}
      <div className="meal-box">
        <div className="meal-lbl">{baseMeals.label}</div>
        {custom.length > 0 && (
          <div className="mb-plan-note">✨ Your added ingredients are included below.</div>
        )}
        {rows.map((r, i) => (
          <div key={i} className="meal-row">
            <span className="meal-t">{r.time}</span>
            <div className="meal-ingr-list">
              {r.ingredients.map((ingr, j) => {
                const next = r.ingredients[j + 1];
                const comma = !ingr.key && !ingr.custom && next && !next.key && !next.custom;
                return ingr.key ? (
                  <button key={j} className="meal-ingr-chip" onClick={() => onIngredientClick(ingr)}>
                    {ingr.name}
                  </button>
                ) : (
                  <span key={j} className={`meal-ingr-plain${ingr.custom ? ' custom' : ''}`}>
                    {ingr.name}{comma ? ',' : ''}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkoutDay({ day, id, open, onToggle, isToday, onIngredientClick, tdee, deficit }) {
  return (
    <PetalAccordion
      id={id}
      emoji={day.emoji}
      emojiBg={day.emojiBg}
      day={day.day}
      title={day.title}
      sub={day.sub}
      open={open}
      onToggle={onToggle}
      isToday={isToday}
    >
      <CalorieBanner tdee={tdee} deficit={deficit} />
      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <div className="exercise-hint">👆 Tap any exercise to watch how to do it.</div>
      <ul className="workout-list">
        {day.exercises.map((ex, i) => (
          <li key={i}>
            <a
              className="ex-link"
              href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+proper+form`}
              target="_blank"
              rel="noopener noreferrer"
            >{ex.name}</a>
            {' '}— {ex.detail}
          </li>
        ))}
      </ul>
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}
      <MealBuilder dayId={id} baseMeals={day.meals} onIngredientClick={onIngredientClick} />
    </PetalAccordion>
  );
}

export default function Workout({ openDayId, onNavigate, pushBack, clearInnerBack, profile }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const tdeeByType   = profile?.tdeeKcal   || null;
  const deficitByType = profile?.deficitKcal || null;
  const todayDay = WORKOUT_DAYS[todayIndex];
  const todayId  = DAY_IDS[todayIndex];

  // Single-open accordion: only one day open at a time
  const [openId, setOpenId] = useState(openDayId ?? todayId);

  function toggleDay(id) {
    setOpenId(prev => prev === id ? null : id);
  }

  // Scroll directly to the target day when navigating from Home
  useEffect(() => {
    if (!openDayId) return;
    const el = document.getElementById(openDayId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&amp;</em> Meals</h2>
        <p className="s-desc">Today's workout opens automatically. Tap any day pill to jump directly to that day. Tap any highlighted ingredient to see three ways to prepare it.</p>
      </div>

      <div className="today-banner splash-item">
        <span className="today-badge">Today</span>
        <span className="today-banner-text">{todayDay.emoji} {todayDay.day} — {todayDay.title}</span>
      </div>

      {WORKOUT_DAYS.map((day, i) => {
        const dtype = DAY_TYPES[i];
        return (
          <WorkoutDay
            key={i}
            day={day}
            id={DAY_IDS[i]}
            open={openId === DAY_IDS[i]}
            onToggle={() => toggleDay(DAY_IDS[i])}
            isToday={i === todayIndex}
            onIngredientClick={selectIngredient}
            tdee={tdeeByType?.[dtype]}
            deficit={deficitByType?.[dtype]}
          />
        );
      })}

      <div className="divider splash-item">Weekly Blueprint</div>
      <div className="week-grid splash-item">
        {[
          { lbl: 'Mon', emoji: '🔥', name: 'Strength A', focus: 'Glutes · Hamstrings',   color: 'pr' },
          { lbl: 'Tue', emoji: '🧘', name: 'Pilates 1',   focus: 'Core · TVA',            color: 'py' },
          { lbl: 'Wed', emoji: '⚡', name: 'Sprints',     focus: 'Cardio · Full Body',    color: 'pr' },
          { lbl: 'Thu', emoji: '🍑', name: 'Strength B', focus: 'Glute Med · Shape',      color: 'pr' },
          { lbl: 'Fri', emoji: '🌿', name: 'Pilates 2',  focus: 'Spine · Side Body',      color: 'py' },
          { lbl: 'Sat', emoji: '🚴', name: 'Bike',       focus: 'Cardio · Endurance',     color: 'pg' },
          { lbl: 'Sun', emoji: '💪', name: 'Back',       focus: 'Posture · Upper Body',   color: 'pg' },
        ].map((d, i) => (
          <div key={d.lbl} className={`wg-day${i === todayIndex ? ' wg-today' : ''}`}>
            <div className={`wg-dot wg-dot-${d.color}`} />
            <div className="wg-emoji">{d.emoji}</div>
            <div className="wg-lbl">{d.lbl}</div>
            <div className="wg-name">{d.name}</div>
            <div className="wg-focus">{d.focus}</div>
          </div>
        ))}
      </div>
      <div className="g-card splash-item" style={{ fontSize: 13, color: 'var(--text-mid)', marginTop: 8 }}>
        <strong>Progressive overload:</strong> Weeks 1–2 learn the movements. Weeks 3–4 add 0.5–2 kg or 1–2 reps. If every set feels easy, increase load. If form breaks, increase reps first.
      </div>

      {onNavigate && (
        <div className="workout-nutrition-row splash-item">
          <button className="workout-nutrition-pill" onClick={() => onNavigate('nutrition')}>
            🥗 Nutrition &amp; Recipes →
          </button>
        </div>
      )}
    </div>
  );
}
