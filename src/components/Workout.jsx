import { useState, useEffect, useRef, useCallback } from 'react';
import { WORKOUT_DAYS, getCurrentSprintProtocol } from '../data/workouts';

const _sp = getCurrentSprintProtocol();
import IngredientDetailPage from './IngredientDetailPage';
import { FOODS, FOOD_CATS } from '../data/foods';
import { RecipesPanel, FoodGuide } from './Nutrition';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

const GRID_DAYS = [
  { lbl: 'Mon', emoji: '🍑', name: 'Glute A',      focus: 'Hip Thrust · RDL · Split Squat',  color: 'pr' },
  { lbl: 'Tue', emoji: '🪷', name: 'Core & Back A', focus: 'Vacuum · Dead Bug · Posture',    color: 'py' },
  { lbl: 'Wed', emoji: '🌿', name: 'Core & Back B', focus: 'Hollow · Side Plank · Face Pull', color: 'py' },
  { lbl: 'Thu', emoji: '🔥', name: 'Glute B',      focus: 'Sumo · Kickback · Abduction',     color: 'pr' },
  { lbl: 'Fri', emoji: '✨', name: 'Core & Back C', focus: 'Vacuum · Plank · Wall Angels',   color: 'py' },
  { lbl: 'Sat', emoji: '⚡', name: 'Sprint',       focus: `${_sp.sprint}s on · ${_sp.rest}s off · ${_sp.reps} reps`, color: 'pr' },
  { lbl: 'Sun', emoji: '🌸', name: 'Rest',         focus: 'Walk · Stretch',                   color: 'pg' },
];

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

// Basic info for food items that don't have a dedicated detail page.
// Everything here follows the plan: NO gluten, NO oils, NO dairy — steamed/boiled only.
const FOOD_PREP = {
  'Berries': {
    ingredients: 'Fresh or frozen berries — strawberries, blueberries, raspberries, or mixed',
    howTo: 'Rinse and eat as-is. Thaw frozen berries at room temperature. Eat alone to reduce bloating.',
  },
  'Fruits': {
    ingredients: 'Seasonal fresh fruits — papaya, pineapple, watermelon, apple, banana, berries',
    howTo: 'Wash, peel if needed, slice, and eat fresh. Eat alone for a calmer gut.',
  },
  'Kiwi': {
    ingredients: '1–2 ripe kiwis',
    howTo: 'Slice and scoop, or peel and slice. Actinidin supports digestion and reduces bloating.',
  },
  'Mango': {
    ingredients: '½–1 ripe mango',
    howTo: 'Slice along the pit, score, and scoop. Eat on its own as your sweet fruit fix.',
  },
  'Grapes': {
    ingredients: '1 small handful of grapes',
    howTo: 'Rinse and eat fresh, or freeze for a cold snack. Keep to one handful.',
  },
  'Dragon Fruit': {
    ingredients: '½–1 dragon fruit',
    howTo: 'Halve and scoop, or peel and cube. Low sugar, high prebiotic fibre.',
  },
  'Orange': {
    ingredients: '1 orange',
    howTo: 'Peel and eat in segments. Eat whole between meals to keep the fibre.',
  },
  'Greek Yogurt': {
    ingredients: 'Plain Greek yogurt (or dairy-free coconut/almond yogurt) · optional berries',
    howTo: 'Eat plain or with berries. For no-dairy days, use unsweetened coconut or almond yogurt. No added sugar.',
  },
  'Cucumber': {
    ingredients: '1 fresh cucumber',
    howTo: 'Wash, slice, and eat raw. Add lemon if desired — no oil, no salt.',
  },
  'Steamed Zucchini': {
    ingredients: '1 zucchini · pinch of salt (light) · lemon',
    howTo: '1. Slice into rounds or half-moons.\n2. Steam over boiling water 4–6 min until tender.\n3. Finish with lemon — no oil.\nLow-bloat and gut-calm.',
  },
  'Steamed Carrots': {
    ingredients: '2 carrots · lemon (optional)',
    howTo: '1. Peel and slice into coins or sticks.\n2. Steam 6–8 min until fork-tender.\n3. Season lightly — no oil, minimal salt.',
  },
  'Steamed Spinach': {
    ingredients: '2 big handfuls of fresh spinach · lemon',
    howTo: '1. Rinse well.\n2. Steam or wilt with water for 1–2 min.\n3. Squeeze lemon over top — no oil.',
  },
  'Steamed Green Beans': {
    ingredients: '1 cup green beans · lemon',
    howTo: '1. Trim the ends.\n2. Steam 4–5 min until bright green and crisp-tender.\n3. Finish with lemon — no oil, light salt.\nEasy on the gut and low-bloat.',
  },
  'Egg': {
    ingredients: '1 egg · pinch of salt',
    howTo: 'Boil 7–8 min for jammy or 10 min for firm. Or poach 3 min. No oil or butter.',
  },
  '1 Egg': {
    ingredients: '1 egg · pinch of salt',
    howTo: 'Boil 7–10 min or poach 3 min. No frying, oil, or butter.',
  },
  '2 Eggs': {
    ingredients: '2 eggs · pinch of salt',
    howTo: 'Hard-boil 10 min, or poach 3 min each. Skip oil and butter.',
  },
  'Shrimp': {
    ingredients: 'Shrimp (peeled) · lemon · pinch of salt',
    howTo: 'Boil or steam 2–3 min until pink and curled. Add lemon. No oil.',
  },
  'Tilapia': {
    ingredients: '1 tilapia fillet · lemon · ginger',
    howTo: 'Steam with ginger for 8–10 min, or bake at 190°C for 12–15 min. Finish with lemon.',
  },
  'lemon water': {
    ingredients: '1 glass of water · juice of ½ lemon or calamansi',
    howTo: 'Squeeze half a lemon into warm or room-temp water. Sip before or between meals.',
  },
  'green tea': {
    ingredients: '1 green tea bag · hot water',
    howTo: 'Steep 2–3 min in just-off-boil water. No sugar, no milk.',
  },
  'spearmint tea': {
    ingredients: '1 spearmint tea bag or fresh spearmint · hot water',
    howTo: 'Steep 3–5 min. Drink after meals. No sugar.',
  },
  'collagen water': {
    ingredients: '1 scoop collagen peptides (dairy-free) · water',
    howTo: 'Stir unflavoured marine or bovine collagen into water. Drink with your protein meal.',
  },
};

function useDayMeals(dayId, userId) {
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

// "Choose a…" chips in the meal plan open a picker filtered to these food
// categories, so you can pick the exact fruit / protein / veggie you want.
const PICK_DEFS = {
  fruit:   { label: 'a fruit',   cats: ['Fruit'] },
  veggie:  { label: 'veggies',   cats: ['Vegetable'] },
  protein: { label: 'a protein', cats: ['Protein', 'Seafood', 'Egg & Dairy', 'Legume'] },
};

function MealBuilder({ dayId, baseMeals, onIngredientClick, userId }) {
  const [custom, saveCustom]                    = useDayMeals(dayId, userId);
  const [removedBase, removeBaseItem, resetRemovedBase] = useDayRemovedBase(dayId);
  const [query, setQuery]       = useState('');
  const [browse, setBrowse]     = useState(false);
  const [pendingFood, setPendingFood] = useState(null);
  const [pickSheet, setPickSheet] = useState(null); // { pick, slot }
  const [menuIngr, setMenuIngr]   = useState(null); // { ingr, holdName }
  const [infoSheet, setInfoSheet] = useState(null); // { name, tab: 'ingredients'|'howto' }
  const [confirmRemove, setConfirmRemove] = useState(null); // holdName

  const categoryRefs = useRef({});
  const normalizedQuery = query.trim().toLowerCase();
  // Category search ("fruits", "protein", "seafood") shows that whole category;
  // anything else matches names, starts-with first ("p" → all P foods on top).
  const singularQuery = normalizedQuery.endsWith('s') ? normalizedQuery.slice(0, -1) : normalizedQuery;
  const categoryHit = normalizedQuery.length > 1
    ? FOOD_CATS.find(cat => cat.toLowerCase().split(/[^a-z]+/).some(w => {
        const ws = w.endsWith('s') ? w.slice(0, -1) : w;
        return w === normalizedQuery || ws === singularQuery || (normalizedQuery.length > 2 && w.startsWith(normalizedQuery));
      }))
    : null;
  let filtered = [];
  if (normalizedQuery.length > 0) {
    const starts = [], contains = [];
    FOODS.forEach(f => {
      if (categoryHit && f.cat === categoryHit) return;
      const n = f.name.toLowerCase();
      if (n.startsWith(normalizedQuery)) starts.push(f);
      else if (n.includes(normalizedQuery)) contains.push(f);
    });
    filtered = [
      ...(categoryHit ? FOODS.filter(f => f.cat === categoryHit) : []),
      ...starts,
      ...contains,
    ];
  }

  function handleFoodSelect(food) {
    setPendingFood(food);
    setQuery('');
    setBrowse(false);
  }

  function handleCategoryJump(cat) {
    const categoryNode = categoryRefs.current[cat] || document.getElementById(`mbcat-${cat}`);
    categoryNode?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function confirmAddFood(mealSlot) {
    if (!pendingFood) return;
    if (!custom.find(c => c.name === pendingFood.name)) {
      saveCustom([...custom, { name: pendingFood.name, emoji: pendingFood.emoji, meal: mealSlot }]);
    }
    setPendingFood(null);
  }

  function openMenu(ingr, holdName) {
    setMenuIngr({ ingr, holdName });
  }

  // Add a food chosen from a "Choose a…" picker straight into its meal slot.
  function addPickedFood(food, slot) {
    if (!custom.find(c => c.name === food.name)) {
      saveCustom([...custom, { name: food.name, emoji: food.emoji, meal: slot }]);
    }
    setPickSheet(null);
  }

  function handleMenuIngredients() {
    const { ingr } = menuIngr;
    setMenuIngr(null);
    if (ingr.key) {
      onIngredientClick(ingr);
    } else {
      setInfoSheet({ name: ingr.name, tab: 'ingredients' });
    }
  }

  function handleMenuHowTo() {
    const { ingr } = menuIngr;
    setMenuIngr(null);
    if (ingr.key) {
      onIngredientClick(ingr);
    } else {
      setInfoSheet({ name: ingr.name, tab: 'howto' });
    }
  }

  function handleMenuRemove() {
    const { holdName } = menuIngr;
    setMenuIngr(null);
    setConfirmRemove(holdName);
  }

  function doRemove(name) {
    const customItem = custom.find(c => c.name === name || `${c.emoji} ${c.name}` === name);
    if (customItem) {
      saveCustom(custom.filter(c => c.name !== customItem.name && `${c.emoji} ${c.name}` !== name));
    } else {
      removeBaseItem(name);
    }
    setConfirmRemove(null);
  }

  function resetToOriginal() {
    saveCustom([]);
    resetRemovedBase();
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
              {f.avoid && <span className="mb-avoid-tag">⚠️ {f.avoid}</span>}
            </button>
          ))}
        </div>
      )}

      {browse && query === '' && (
        <div className="mb-browse">
          <div className="mb-cat-chips">
            {FOOD_CATS.map(cat => (
              <button key={cat} className="mb-cat-chip" onClick={() => handleCategoryJump(cat)}>
                {cat}
              </button>
            ))}
          </div>
          {FOOD_CATS.map(cat => {
            const catFoods = FOODS.filter(f => f.cat === cat);
            return (
              <div
                key={cat}
                id={`mbcat-${cat}`}
                ref={node => {
                  if (node) categoryRefs.current[cat] = node;
                  else delete categoryRefs.current[cat];
                }}
                className="mb-cat"
              >
                <div className="mb-cat-label">{cat} · {catFoods.length}</div>
                <div className="mb-cat-items">
                  {catFoods.map(f => (
                    <button key={f.name} className="mb-cat-item" onClick={() => handleFoodSelect(f)}>
                      {f.emoji} {f.name}
                      {f.avoid && <span className="mb-avoid-tag">⚠️ {f.avoid}</span>}
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

      {/* "Choose a…" food picker (fruit / protein / veggie) */}
      {pickSheet && (
        <div className="ingr-menu-backdrop" onClick={() => setPickSheet(null)}>
          <div className="mb-pick-sheet" onClick={e => e.stopPropagation()}>
            <div className="mb-pick-title">Choose {PICK_DEFS[pickSheet.pick].label}</div>
            <div className="mb-pick-grid">
              {FOODS.filter(f => PICK_DEFS[pickSheet.pick].cats.includes(f.cat)).map(f => (
                <button key={f.name} className="mb-pick-item" onClick={() => addPickedFood(f, pickSheet.slot)}>
                  <span className="mb-pick-em">{f.emoji}</span>
                  <span className="mb-pick-name">{f.name}</span>
                  {f.avoid && <span className="mb-pick-avoid">⚠️</span>}
                </button>
              ))}
            </div>
            <button className="ingr-menu-cancel" onClick={() => setPickSheet(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* 3-option ingredient menu overlay */}
      {menuIngr && (
        <div className="ingr-menu-backdrop" onClick={() => setMenuIngr(null)}>
          <div className="ingr-menu-sheet" onClick={e => e.stopPropagation()}>
            <div className="ingr-menu-name">{menuIngr.ingr.name}</div>
            <button className="ingr-menu-btn" onClick={handleMenuIngredients}>
              <span>🥘</span><span>Ingredients</span>
            </button>
            <button className="ingr-menu-btn" onClick={handleMenuHowTo}>
              <span>🍳</span><span>How to Make It</span>
            </button>
            <button className="ingr-menu-btn danger" onClick={handleMenuRemove}>
              <span>🗑️</span><span>Remove from Meal</span>
            </button>
            <button className="ingr-menu-cancel" onClick={() => setMenuIngr(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Info sheet for null-key items */}
      {infoSheet && (
        <div className="ingr-menu-backdrop" onClick={() => setInfoSheet(null)}>
          <div className="ingr-info-sheet" onClick={e => e.stopPropagation()}>
            <div className="ingr-info-name">{infoSheet.name}</div>
            <div className="ingr-info-tabs">
              <button className={`ingr-info-tab${infoSheet.tab === 'ingredients' ? ' active' : ''}`}
                onClick={() => setInfoSheet(s => ({ ...s, tab: 'ingredients' }))}>🥘 Ingredients</button>
              <button className={`ingr-info-tab${infoSheet.tab === 'howto' ? ' active' : ''}`}
                onClick={() => setInfoSheet(s => ({ ...s, tab: 'howto' }))}>🍳 How to Make It</button>
            </div>
            <div className="ingr-info-body">
              {infoSheet.tab === 'ingredients'
                ? (FOOD_PREP[infoSheet.name]?.ingredients || 'Fresh whole food — no extras needed.')
                : (FOOD_PREP[infoSheet.name]?.howTo || 'Prepare fresh and simple. See Recipes for guides.')}
            </div>
            <button className="ingr-menu-cancel" onClick={() => setInfoSheet(null)}>Close</button>
          </div>
        </div>
      )}

      {/* Remove confirmation */}
      {confirmRemove && (
        <div className="mb-delete-confirm">
          <span className="mb-delete-msg">Remove <strong>{confirmRemove}</strong>?</span>
          <button className="mb-delete-yes" onClick={() => doRemove(confirmRemove)}>Remove</button>
          <button className="mb-delete-no" onClick={() => setConfirmRemove(null)}>Keep</button>
        </div>
      )}

      {/* Meal table */}
      <div className="meal-table">
        <div className="meal-table-top">
          <div className="meal-table-lbl">{baseMeals.label}</div>
          <div className="mb-plan-note" style={{ marginTop: 4, marginBottom: 0 }}>Tap ＋ to choose a fruit, protein, or veggie · tap a food for options.</div>
        </div>
        <div className="meal-table-head">
          <div className="mth-time">Meal</div>
          <div className="mth-foods">Foods</div>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="meal-table-row">
            <div className="mtr-time">{r.time}</div>
            <div className="mtr-foods">
              {r.ingredients.map((ingr, j) => {
                if (ingr.pick) {
                  return (
                    <button
                      key={j}
                      className="meal-ingr-chip meal-ingr-pick"
                      onClick={() => setPickSheet({ pick: ingr.pick, slot: ingr.slot })}
                    >
                      ＋ {ingr.name}
                    </button>
                  );
                }
                const holdName = ingr.custom ? ingr.rawName : ingr.name;
                return (
                  <button
                    key={j}
                    className={`meal-ingr-chip meal-ingr-tappable${ingr.custom ? ' custom' : ''}`}
                    onClick={() => openMenu(ingr, holdName)}
                  >
                    {ingr.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {(custom.length > 0 || removedBase.length > 0) && (
        <button className="mb-reset-btn" onClick={resetToOriginal}>
          ↩ Back to Original Menu
        </button>
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
      <MealBuilder dayId={id} baseMeals={day.meals} onIngredientClick={onIngredientClick} userId={userId} />
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
