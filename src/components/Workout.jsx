import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKOUT_DAYS } from '../data/workouts';
import IngredientDetailPage from './IngredientDetailPage';
import { FOODS, FOOD_CATS } from '../data/foods';
import { RecipesPanel, FoodGuide } from './Nutrition';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

// Estimated calories for base meal ingredients (keyed by ingredient key from workouts.js)
const CAL_MAP = {
  'egg': 105, 'banana': 50, 'green-tea': 2, 'ginger-juice': 10,
  'fish': 165, 'chicken': 165, 'broccoli': 55, 'sweet potato': 90,
  'collagen-water': 30, 'salad': 35, 'pineapple': 50, 'apple': 80,
  'papaya': 55, 'watermelon': 46, 'spearmint-tea': 2, 'kiwi': 42,
  'avocado': 120, 'oats': 150, 'beef': 220, 'banana-nice-cream': 120,
  'chia-mango-pudding': 140, 'cacao-banana-bites': 110, 'sweet-potato-brownie': 130,
  'coconut-chia-balls': 120, 'avocado-choc-mousse': 140, 'banana-oat-cookies': 115,
};

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];
const DAY_TYPES = ['strength', 'light', 'strength', 'light', 'strength', 'strength', 'light'];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

const GRID_DAYS = [
  { lbl: 'Mon', emoji: '🏃', name: 'Sprint',      focus: 'Norwegian 4x4 · Run or Bike', color: 'pr' },
  { lbl: 'Tue', emoji: '🧘', name: 'Pilates 1',   focus: 'Core · TVA',                  color: 'py' },
  { lbl: 'Wed', emoji: '🔥', name: 'Strength A',  focus: 'Glutes · Hip Thrust · RDL',  color: 'pr' },
  { lbl: 'Thu', emoji: '🌿', name: 'Pilates 2',   focus: 'Spine · Side Body',           color: 'py' },
  { lbl: 'Fri', emoji: '⚡', name: 'Sprint',      focus: 'Norwegian 4x4 · Run or Bike', color: 'pr' },
  { lbl: 'Sat', emoji: '🍑', name: 'Strength B',  focus: 'Glute Med · Split Squat',    color: 'pr' },
  { lbl: 'Sun', emoji: '🌸', name: 'Mobility',    focus: 'Hips · Spine · Shoulders',   color: 'pg' },
];

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

function CalorieBanner({ tdee, deficit }) {
  if (!tdee) return null;
  return (
    <div className="cal-banner">
      <span className="cal-banner-item">🔥 Maintenance <strong>{tdee} kcal</strong></span>
      <span className="cal-banner-sep">·</span>
      <span className="cal-banner-item">🎯 Deficit target <strong>{deficit} kcal</strong></span>
    </div>
  );
}

function useDayMeals(dayId, userId) {
  const key = `gp_meal_${dayId}`;
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  const save = useCallback((next) => {
    setItems(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
    if (userId) {
      setDoc(doc(db, 'users', userId), {
        customMeals: { [dayId]: next },
      }, { merge: true }).catch(() => {});
    }
  }, [key, dayId, userId]);
  return [items, save];
}

function useDayRemovedBase(dayId) {
  const key = `gp_removed_${dayId}`;
  const [removed, setRemoved] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  });
  function removeItem(name) {
    const next = removed.includes(name) ? removed : [...removed, name];
    setRemoved(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  }
  function resetRemoved() {
    setRemoved([]);
    try { localStorage.removeItem(key); } catch {}
  }
  return [removed, removeItem, resetRemoved];
}

function MealBuilder({ dayId, baseMeals, onIngredientClick, userId, tdee, deficit }) {
  const [custom, saveCustom]                    = useDayMeals(dayId, userId);
  const [removedBase, removeBaseItem, resetRemovedBase] = useDayRemovedBase(dayId);
  const [query, setQuery]    = useState('');
  const [browse, setBrowse]  = useState(false);
  const [deletingName, setDeletingName] = useState(null);
  const [pendingFood, setPendingFood]   = useState(null);
  const holdRef = useRef({});

  const filtered = query.trim().length > 0
    ? FOODS.filter(f => f.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  function handleFoodSelect(food) {
    setPendingFood(food);
    setQuery('');
    setBrowse(false);
  }

  function confirmAddFood(mealSlot) {
    if (!pendingFood) return;
    if (!custom.find(c => c.name === pendingFood.name)) {
      saveCustom([...custom, { name: pendingFood.name, emoji: pendingFood.emoji, meal: mealSlot }]);
    }
    setPendingFood(null);
  }

  function startHold(name) {
    holdRef.current[name] = setTimeout(() => setDeletingName(name), 800);
  }
  function cancelHold(name) { clearTimeout(holdRef.current[name]); }

  function resetToOriginal() {
    saveCustom([]);
    resetRemovedBase();
  }

  function confirmDelete(name) {
    const customItem = custom.find(c => c.name === name || `${c.emoji} ${c.name}` === name);
    if (customItem) {
      saveCustom(custom.filter(c => c.name !== customItem.name && `${c.emoji} ${c.name}` !== name));
    } else {
      removeBaseItem(name);
    }
    setDeletingName(null);
  }

  // Build rows filtering out removed base items
  const rows = baseMeals.rows.map(r => ({
    ...r,
    ingredients: r.ingredients.filter(ingr => !removedBase.includes(ingr.name)),
  }));
  const snackItems = custom.filter(c => c.meal === 'snack');
  const hasSnackRow = rows.some(r => r.time.toLowerCase().includes('snack'));
  if (snackItems.length > 0 && !hasSnackRow) {
    rows.splice(1, 0, { time: 'Snack', ingredients: [] });
  }
  custom.forEach(c => {
    const ingr = { name: `${c.emoji} ${c.name}`, key: null, custom: true, rawName: c.name };
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
      <div className="mb-search-wrap">
        <input
          className="mb-search"
          type="text"
          placeholder="🔍 Search foods to add..."
          value={query}
          onChange={e => { setQuery(e.target.value); setBrowse(false); }}
          onFocus={() => { if (!query) setBrowse(true); }}
        />
        <button className="mb-az-btn" onClick={() => { setBrowse(b => !b); setQuery(''); }}>A–Z</button>
      </div>

      {filtered.length > 0 && (
        <div className="mb-results">
          {filtered.map(f => (
            <button key={f.name} className="mb-result-item" onClick={() => handleFoodSelect(f)}>
              <span className="mb-result-em">{f.emoji}</span>
              <span className="mb-result-name">{f.name}</span>
              <span className="mb-result-cat">{f.cat}</span>
            </button>
          ))}
        </div>
      )}

      {browse && query === '' && (
        <div className="mb-browse">
          {FOOD_CATS.map(cat => {
            const catFoods = FOODS.filter(f => f.cat === cat);
            return (
              <div key={cat} className="mb-cat">
                <div className="mb-cat-label">{cat}</div>
                <div className="mb-cat-items">
                  {catFoods.map(f => (
                    <button key={f.name} className="mb-cat-item" onClick={() => handleFoodSelect(f)}>
                      {f.emoji} {f.name}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Meal slot picker */}
      {pendingFood && (
        <div className="mb-meal-picker">
          <div className="mb-meal-picker-title">
            Add {pendingFood.emoji} <strong>{pendingFood.name}</strong> to which meal?
          </div>
          <div className="mb-meal-picker-btns">
            <button className="mb-meal-pick-btn" onClick={() => confirmAddFood('morning')}>🌅 First Meal</button>
            <button className="mb-meal-pick-btn" onClick={() => confirmAddFood('lunch')}>🥗 Lunch</button>
            <button className="mb-meal-pick-btn" onClick={() => confirmAddFood('dinner')}>🌙 Last Meal</button>
          </div>
          <button className="mb-meal-pick-cancel" onClick={() => setPendingFood(null)}>Cancel</button>
        </div>
      )}

      {deletingName && (
        <div className="mb-delete-confirm">
          <span className="mb-delete-msg">Remove <strong>{deletingName}</strong>?</span>
          <button className="mb-delete-yes" onClick={() => confirmDelete(deletingName)}>Remove</button>
          <button className="mb-delete-no" onClick={() => setDeletingName(null)}>Keep</button>
        </div>
      )}

      {/* Meal table — TDEE banner is the very first thing inside the box */}
      {(() => {
        let totalCal = 0;
        const rowData = rows.map(r => {
          const cal = r.ingredients.reduce((sum, ingr) => {
            if (ingr.custom) {
              const food = FOODS.find(f => f.name === ingr.rawName);
              return sum + (food?.cal || 0);
            }
            return sum + (CAL_MAP[ingr.key] || 0);
          }, 0);
          totalCal += cal;
          return { ...r, cal };
        });
        return (
          <div className="meal-table">
            {/* Calorie targets — top of box, before Protein Day label */}
            {tdee ? (
              <div className="meal-tdee-banner">
                <div className="meal-tdee-item">
                  <span className="meal-tdee-ico">🔥</span>
                  <div>
                    <div className="meal-tdee-label">Maintenance</div>
                    <div className="meal-tdee-val">{tdee.toLocaleString()}<span className="meal-tdee-unit"> kcal/day</span></div>
                  </div>
                </div>
                <div className="meal-tdee-divider" />
                <div className="meal-tdee-item">
                  <span className="meal-tdee-ico">🎯</span>
                  <div>
                    <div className="meal-tdee-label">Your Target</div>
                    <div className="meal-tdee-val">{(deficit || tdee).toLocaleString()}<span className="meal-tdee-unit"> kcal/day</span></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="meal-tdee-empty">
                ⚙️ Set your height &amp; weight in <strong>Settings → Account</strong> to see your personal calorie targets.
              </div>
            )}
            <div className="meal-table-top">
              <div className="meal-table-lbl">{baseMeals.label}</div>
              <div className="mb-plan-note" style={{ marginTop: 4, marginBottom: 0 }}>Hold any item 1 sec to remove.</div>
            </div>
            <div className="meal-table-head">
              <div className="mth-time">Meal</div>
              <div className="mth-foods">Foods</div>
              <div className="mth-cal">~kcal</div>
            </div>
            {rowData.map((r, i) => (
              <div key={i} className="meal-table-row">
                <div className="mtr-time">{r.time}</div>
                <div className="mtr-foods">
                  {r.ingredients.map((ingr, j) => {
                    const holdName = ingr.custom ? ingr.rawName : ingr.name;
                    const isDeleting = deletingName === holdName;
                    const holdEvents = {
                      onMouseDown:  () => startHold(holdName),
                      onMouseUp:    () => cancelHold(holdName),
                      onMouseLeave: () => cancelHold(holdName),
                      onTouchStart: () => startHold(holdName),
                      onTouchEnd:   () => cancelHold(holdName),
                      onTouchCancel:() => cancelHold(holdName),
                    };
                    const next = r.ingredients[j + 1];
                    const comma = !ingr.key && !ingr.custom && next && !next.key && !next.custom;
                    if (ingr.key) {
                      return (
                        <button key={j} className={`meal-ingr-chip${isDeleting ? ' mb-deleting' : ''}`}
                          onClick={() => { if (!isDeleting) onIngredientClick(ingr); }} {...holdEvents}>
                          {ingr.name}
                        </button>
                      );
                    }
                    return (
                      <span key={j} className={`meal-ingr-plain${ingr.custom ? ' custom' : ''}${isDeleting ? ' mb-deleting' : ''}`}
                        style={{ cursor: 'pointer' }} {...holdEvents}>
                        {ingr.name}{comma ? ',' : ''}
                      </span>
                    );
                  })}
                </div>
                <div className="mtr-cal">{r.cal > 0 ? `~${r.cal}` : '—'}</div>
              </div>
            ))}
            {totalCal > 0 && (
              <>
                <div className="meal-table-total">
                  <div className="mtt-label">Total</div>
                  <div className={`mtt-verdict ${tdee && totalCal > (deficit || tdee) ? 'over' : 'ok'}`}>
                    {tdee
                      ? totalCal > (deficit || tdee)
                        ? `+${totalCal - (deficit || tdee)} over`
                        : `${(deficit || tdee) - totalCal} left`
                      : ''}
                  </div>
                  <div className="mtt-cal">~{totalCal} kcal</div>
                </div>
                {tdee && (
                  <div className="meal-cal-progress">
                    <div className="meal-cal-bar">
                      <div
                        className={`meal-cal-fill ${totalCal > (deficit || tdee) ? 'over' : ''}`}
                        style={{ width: `${Math.min(100, Math.round((totalCal / (deficit || tdee)) * 100))}%` }}
                      />
                    </div>
                    <div className="meal-cal-pct">
                      {Math.round((totalCal / (deficit || tdee)) * 100)}% of daily target
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })()}

      {(custom.length > 0 || removedBase.length > 0) && (
        <button className="mb-reset-btn" onClick={resetToOriginal}>
          ↩ Back to Original Menu
        </button>
      )}
    </div>
  );
}

function DayDetailPage({ day, id, isToday, onIngredientClick, tdee, deficit, onBack, userId }) {
  const [openEx, setOpenEx] = useState(null);

  // Parse stats from day.sub string
  const durationMatch = day.sub?.match(/~?(\d+)\s*min/);
  const duration = durationMatch ? `${durationMatch[1]} min` : null;
  const isStrength = day.sub?.toLowerCase().includes('strength') || day.title?.toLowerCase().includes('strength') || day.title?.toLowerCase().includes('glute') || day.title?.toLowerCase().includes('pilates');
  const hasSprint  = day.sub?.toLowerCase().includes('sprint') || day.title?.toLowerCase().includes('norwegian') || day.title?.toLowerCase().includes('sprint');
  const hasZone2   = day.sub?.toLowerCase().includes('zone 2');
  const isMobility = day.title?.toLowerCase().includes('mobility') || day.title?.toLowerCase().includes('flexibility');

  return (
    <div className="day-detail-page">
      <button className="day-detail-back" onClick={onBack}>← Back to Week</button>

      {/* Header */}
      <div className="day-detail-header">
        <span className="day-detail-emoji" style={{ background: day.emojiBg }}>{day.emoji}</span>
        <div className="day-detail-meta">
          <div className="day-detail-day">
            {day.day}
            {isToday && <span className="today-badge" style={{ marginLeft: 8 }}>Today</span>}
          </div>
          <div className="day-detail-title">{day.title}</div>
        </div>
      </div>

      {/* Visual stat chips */}
      <div className="dd-stats">
        {duration    && <div className="dd-stat dd-stat-time"><span>⏱</span>{duration}</div>}
        {hasSprint   && <div className="dd-stat dd-stat-sprint"><span>⚡</span>Sprint</div>}
        {isStrength  && <div className="dd-stat dd-stat-strength"><span>💪</span>Strength</div>}
        {hasZone2    && <div className="dd-stat dd-stat-zone"><span>🫀</span>Zone 2</div>}
        {isMobility  && <div className="dd-stat dd-stat-mobility"><span>🌿</span>Mobility</div>}
        <div className="dd-stat dd-stat-count"><span>📋</span>{day.exercises.length} exercises</div>
      </div>

      {/* Intro note */}
      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}

      {/* Exercise cards — collapsible, tap name to watch on YouTube */}
      <div className="ex-hint">▼ Tap a card to see how · Tap the name to watch on YouTube</div>
      <div className="ex-cards">
        {day.exercises.map((ex, i) => {
          const isOpen = openEx === i;
          return (
            <div key={i} className={`ex-card${isOpen ? ' open' : ''}`}>
              <button className="ex-card-trigger" onClick={() => setOpenEx(isOpen ? null : i)}>
                <div className="ex-card-num">{i + 1}</div>
                <div className="ex-card-name-wrap">
                  <a
                    className="ex-card-link"
                    href={`https://www.youtube.com/results?search_query=how+to+do+${encodeURIComponent(ex.name)}+proper+form`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                  >
                    {ex.name} ▶
                  </a>
                </div>
                <div className="ex-card-arr">{isOpen ? '▲' : '▼'}</div>
              </button>
              {isOpen && (
                <div className="ex-card-detail">{ex.detail}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Closing note */}
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}

      {/* Meal plan with calorie table */}
      <MealBuilder dayId={id} baseMeals={day.meals} onIngredientClick={onIngredientClick} userId={userId} tdee={tdee} deficit={deficit} />
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
        <p className="s-desc">How to prepare your food and understand its glycemic impact.</p>
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

export default function Workout({ openDayId, onNavigate, pushBack, clearInnerBack, profile, user }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [selectedDayIdx, setSelectedDayIdx]         = useState(null);
  const [showNutrPanel, setShowNutrPanel]           = useState(false);
  const tdeeByType    = profile?.tdeeKcal    || null;
  const deficitByType = profile?.deficitKcal || null;
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
    const dtype = DAY_TYPES[selectedDayIdx];
    return (
      <div className="section">
        <DayDetailPage
          day={day}
          id={DAY_IDS[selectedDayIdx]}
          isToday={selectedDayIdx === todayIndex}
          onIngredientClick={selectIngredient}
          tdee={tdeeByType}
          deficit={deficitByType}
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
        <strong>Progressive overload:</strong> Weeks 1–2 learn the movements. Weeks 3–4 add 0.5–2 kg or 1–2 reps. If every set feels easy, increase load. If form breaks, increase reps first.
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
