import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'meat',    icon: '🍑', title: 'Protein Days (Glute & Sprint)', desc: 'Monday, Thursday, Saturday — protein at 3 PM to grow the glutes. Fruits 12 PM · Protein 3 PM · Light 5 PM.' },
  { id: 'light',   icon: '🍓', title: 'Fruit Days',                    desc: 'Tuesday, Wednesday, Friday, Sunday — 80% fruitarian, gut rest. Fruits 12 PM · Fruits 3 PM · Light 5 PM.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',          desc: 'How to prepare every food in your plan — steamed, boiled, oil-free. Tap any food for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',                    desc: 'What to eat, what to avoid (GODSSSS), and why — for a flat stomach and healthy gut.' },
];

/* ─── RECIPE CATEGORIES shown in the Recipes tab ─── */
const RECIPE_CATEGORIES = [
  {
    title: 'Protein (Glute Days)',
    items: [
      { key: 'egg',     label: 'Eggs' },
      { key: 'chicken', label: 'Chicken' },
      { key: 'fish',    label: 'Fish' },
    ],
  },
  {
    title: 'Fruits (80% of the plate)',
    items: [
      { key: 'papaya',    label: 'Papaya' },
      { key: 'pineapple', label: 'Pineapple' },
      { key: 'watermelon', label: 'Watermelon' },
      { key: 'apple',     label: 'Apple' },
      { key: 'banana',    label: 'Banana' },
      { key: 'berries',   label: 'Berries' },
    ],
  },
  {
    title: 'Veg & Extras',
    items: [
      { key: 'broccoli', label: 'Broccoli' },
      { key: 'salad',    label: 'Salad' },
      { key: 'avocado',  label: 'Avocado' },
      { key: 'chia',     label: 'Chia' },
    ],
  },
];

/* ─── PROTEIN DAYS (Glute & Sprint: Mon, Thu, Sat) ─── */
export function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🍑 <strong>Protein days: Monday, Thursday, Saturday.</strong> These are your glute + sprint days. Fruits at 12, protein at 3 PM (right after training — this is when your glutes rebuild), light finish at 5 PM.
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Why protein only on these 3 days?</strong> The plan is ~80% fruitarian. Protein (the 20%) is timed to your two glute days and your sprint day, when your muscles are primed to absorb it and grow. Every other day your gut rests on fruit. Protein digests slowly, so concentrating it here keeps your stomach flat and your digestion calm.
      </div>
      <div className="calorie-banner splash-item" style={{ marginBottom: 18 }}>
        <div className="cal-block">
          <div className="cal-phase">Fat-Loss Phase · Deficit</div>
          <div className="cal-number">~1,250 cal/day</div>
          <div className="cal-note">For 5'1" / 46 kg · light activity · gentle deficit for lean recomposition</div>
        </div>
        <div className="cal-divider" />
        <div className="cal-block">
          <div className="cal-phase">Maintenance</div>
          <div className="cal-number">~1,550 cal/day</div>
          <div className="cal-note">Full TDEE · sustain composition · fuel glute growth</div>
        </div>
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">Breakfast — Fruits only</div>
              <div className="hyd-n">Papaya + pineapple (both are digestive enzymes) · OR · watermelon + berries · OR · banana + berries on sprint day · eat fruit on its own, always</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">3:00 PM</div>
            <div>
              <div className="hyd-d">Dinner — Protein (post-workout, for the glutes)</div>
              <div className="hyd-n">Chicken 150g or fish 150g + steamed low-bloat veg (zucchini, carrots, broccoli, or spinach). Steamed or boiled only — no oil. Season with lemon + a little salt.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Light · No food after this</div>
              <div className="hyd-n">Berries + spearmint tea · OR · a little steamed veg · OR · papaya · keep it small — you already had your protein at 3</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🥩 <strong>Protein target on these days:</strong> ~70 g. Chicken 150g ≈ 46g · Fish 150g ≈ 33g · 1 egg ≈ 6g · Shrimp 100g ≈ 20g. Eat protein first at your 3 PM meal.
      </div>
    </>
  );
}

/* ─── FRUIT DAYS (Tue, Wed, Fri, Sun) ─── */
export function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🍓 <strong>Fruit days: Tuesday, Wednesday, Friday, Sunday.</strong> Eating window 12 PM – 5 PM. These are the fruitarian 80% — your gut gets a genuine rest, bloating drops, and you arrive at your glute days feeling light and flat.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">Breakfast — Fruits</div>
              <div className="hyd-n">Papaya + kiwi · OR · watermelon + berries · OR · pineapple + apple · low-bloat fruits, eaten on their own</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">3:00 PM</div>
            <div>
              <div className="hyd-d">Snack — Fruits</div>
              <div className="hyd-n">Apple + banana · OR · mango + berries · OR · grapes (one handful) · keep it small and slow</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Light veg · No food after this</div>
              <div className="hyd-n">Steamed zucchini + spinach · OR · cucumber + steamed carrots · OR · a light salad (no oil) · spearmint or green tea</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🌸 Fruit days are intentional gut rest, not cheat days. Eating fruit <strong>on its own</strong> (never mixed with protein) is the key to no fermentation and no gas — that is what keeps the stomach flat at rest. Walk 10–15 min after each meal.
      </div>
    </>
  );
}

/* ─── RECIPE CARD ─── */
export function RecipeCard({ itemKey, label, onSelect }) {
  const data = INGREDIENT_RECIPES[itemKey];
  if (!data) return null;
  return (
    <button className="recipe-item-btn" onClick={() => onSelect({ key: itemKey, name: label })}>
      <span className="recipe-item-emoji">{data.emoji}</span>
      <div className="recipe-item-text">
        <div className="recipe-item-name">{label}</div>
        <div className="recipe-item-tagline">{data.tagline}</div>
      </div>
      <span className="recipe-item-arrow">›</span>
    </button>
  );
}

/* ─── HYDRATION (embedded inside Recipes) ─── */
function HydrationSection() {
  const rows = [
    { time: 'On waking',   d: '500ml warm water + fresh lemon or calamansi',   n: 'Flushes overnight waste, delivers Vitamin C before your first meal, and gently wakes up digestion.' },
    { time: 'Before 12 PM', d: 'Plain water + green tea (unsweetened)',          n: 'You are fasting until noon. Water and green tea keep you full — EGCG in green tea supports metabolism and clearer skin without a cortisol spike.' },
    { time: '12 PM breakfast', d: 'Water — sip, don\'t gulp',                    n: 'Drink around your fruit, not drowning it. Fruit is already hydrating.' },
    { time: '3 PM meal',   d: 'Collagen peptides in water (glute days)',        n: 'Dairy-free collagen with your protein supports skin, hair, joints, and gut lining. Fruit days: a light herbal tea instead.' },
    { time: '5 PM + evening', d: 'Spearmint or ginger tea',                     n: 'After your last meal. Spearmint soothes digestion and helps balance hormones; ginger calms the gut. No food after 5 PM.' },
    { time: 'All day',     d: 'Plain water — 2–2.5L total, sipped slowly',      n: 'Steady hydration is one of the biggest anti-bloat, anti-puffiness levers there is. Sip continuously rather than chugging.' },
  ];
  return (
    <>
      <div className="divider splash-item" style={{ marginTop: 28 }}>💧 Hydration</div>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💧 What you drink matters as much as what you eat. Every drink here is zero or near-zero sugar and actively supports your skin, digestion, and hormones.
      </div>
      <div className="g-card">
        <div className="hyd-timeline">
          {rows.map((r, i) => (
            <div key={i} className="hyd-row">
              <div className="hyd-time">{r.time}</div>
              <div><div className="hyd-d">{r.d}</div><div className="hyd-n">{r.n}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="note-box note-rose" style={{ marginTop: 14 }}>
        ✕ Avoid completely (the O·D·S of GODSSSS): oils in drinks, milk &amp; dairy, sugary drinks, store-bought juices, soda, flavoured water, and alcohol.
      </div>
    </>
  );
}

/* ─── RECIPES PANEL ─── */
export function RecipesPanel({ onSelectRecipe }) {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🥘 Tap any food to open preparation options. Everything follows the plan: steamed or boiled, <strong>no oil, no dairy, no gluten</strong>. Fruits are eaten fresh and on their own.
      </div>
      {RECIPE_CATEGORIES.map(cat => (
        <div key={cat.title}>
          <div className="recipe-section-title">{cat.title}</div>
          <div className="recipe-grid">
            {cat.items.map(item => (
              <RecipeCard key={item.key} itemKey={item.key} label={item.label} onSelect={onSelectRecipe} />
            ))}
          </div>
        </div>
      ))}
      <HydrationSection />
    </>
  );
}

/* ─── FOOD GUIDE ─── */
export function FoodGuide() {
  const eat = [
    { food: 'Papaya', note: 'Star fruit. Papain enzyme reduces bloating — one of the most anti-inflammatory fruits. Any day.' },
    { food: 'Pineapple', note: 'Bromelain enzyme aids digestion and reduces inflammation. Great glute-day breakfast.' },
    { food: 'Kiwi', note: 'Actinidin enzyme + highest Vitamin C of common fruits — direct collagen support. Low-bloat.' },
    { food: 'Watermelon', note: 'Very hydrating, low calorie. Eat on its own — it digests fastest of all fruits.' },
    { food: 'Berries', note: 'Lowest-sugar fruit, high fibre and antioxidants. Gentle on the gut, great any day.' },
    { food: 'Banana', note: 'Potassium reduces water retention. Best on sprint/glute days for quick fuel.' },
    { food: 'Apple', note: 'Pectin fibre feeds good gut bacteria. Eat with the skin. Any day.' },
    { food: 'Chicken breast 150g', note: 'Glute + sprint days. ~46g protein. Steam, boil, or bake — never fry.' },
    { food: 'Fish (tilapia/bangus)', note: 'Glute + sprint days. Omega-3 lowers inflammation. Steam with ginger + lemon.' },
    { food: 'Eggs (boiled/poached)', note: 'Lean protein for glute days. No oil, no butter. ~6g protein each.' },
    { food: 'Zucchini / carrots / spinach', note: 'Lowest-bloat vegetables — steam them, no oil. Won\'t ferment in the gut.' },
    { food: 'Cucumber', note: 'Eat freely, raw. 95% water, naturally anti-bloating.' },
    { food: 'Avocado', note: '½ per serving. Natural fat for hormones (this is a whole food, not an added oil).' },
  ];
  const avoid = [
    { food: 'Gluten — bread, pasta, pandesal, flour', note: 'The G in GODSSSS. Causes bloating and water retention — flattens the stomach the day you drop it.' },
    { food: 'Oils — fried food, cooking oil', note: 'The O. Steam and boil instead. Whole-food fats (avocado) are fine; added oils are not.' },
    { food: 'Dairy — milk, cheese, yogurt', note: 'The D. Triggers bloating and hormonal breakouts. Use dairy-free collagen instead.' },
    { food: 'Added sugar & sweets', note: 'The first S. Ages skin (glycation), feeds bad gut bacteria. Get sweetness from fruit only.' },
    { food: 'Salty / processed food', note: 'The second S. Salt = water retention = puffiness. Season lightly.' },
    { food: 'White rice', note: 'Spikes blood sugar fast. Sweet potato in small amounts is the better carb.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 The rule is simple: <strong>PFBS</strong> (Protein, Fruits, Bland, Small) and say NO to <strong>GODSSSS</strong> (Gluten, Oils, Dairy, too Sweet, too Salty, Stress — plus good Sleep). Below: what to eat freely, and what to avoid.
      </div>
      <div className="divider splash-item">✓ Eat Freely</div>
      <div className="g-card splash-item" style={{ overflowX: 'auto', marginBottom: 18 }}>
        <table className="fancy-table" style={{ width: '100%' }}>
          <thead><tr><th>Food</th><th>Why</th></tr></thead>
          <tbody>
            {eat.map((r, i) => (
              <tr key={i}><td><strong>{r.food}</strong></td><td>{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divider splash-item">✕ Avoid — GODSSSS</div>
      <div className="g-card splash-item" style={{ overflowX: 'auto' }}>
        <table className="fancy-table" style={{ width: '100%' }}>
          <thead><tr><th>Avoid</th><th>Why</th></tr></thead>
          <tbody>
            {avoid.map((r, i) => (
              <tr key={i}><td style={{ color: 'var(--rose)', fontWeight: 600 }}>{r.food}</td><td>{r.note}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const PANELS = { meat: MeatDays, light: LightDays, guide: FoodGuide };
const TAB_ALIASES = { hydration: 'recipes', snacks: 'recipes' };
const resolveTab = (t) => (t ? TAB_ALIASES[t] || t : null);

/* ─── Main Component ─── */
export default function Nutrition({ initialTab, onNavigate, pushBack, clearInnerBack }) {
  const [detail, setDetail]                 = useState(resolveTab(initialTab));
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  function selectRecipe(item) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    clearInnerBack?.();
    setSelectedRecipe(item);
    pushBack?.(() => {
      setSelectedRecipe(null);
      clearInnerBack?.();
    });
  }

  function closeRecipe() {
    clearInnerBack?.();
    setSelectedRecipe(null);
  }

  useEffect(() => {
    if (!detail) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (selectedRecipe) setSelectedRecipe(null);
        else setDetail(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onNavigate?.('home');
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [detail, selectedRecipe, onNavigate]);

  /* Recipe detail page (from Recipes tab) */
  if (detail === 'recipes' && selectedRecipe) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedRecipe.key}
        ingredientName={selectedRecipe.name}
        backLabel="Recipes"
        onBack={closeRecipe}
        pushBack={pushBack}
      />
    );
  }

  /* Standard panel detail pages (meat / light / guide) */
  if (detail && detail !== 'recipes') {
    const Panel = PANELS[detail];
    const tab   = TABS.find(t => t.id === detail);
    return (
      <div className="section">
        <button className="section-back-btn" onClick={() => setDetail(null)}>‹ Nutrition</button>
        <div className="s-header" style={{ paddingTop: 8 }}>
          <h2 className="s-title">{tab.icon} {tab.title}</h2>
          <p className="s-desc">{tab.desc}</p>
        </div>
        <Panel />
      </div>
    );
  }

  /* Recipes panel */
  if (detail === 'recipes') {
    const tab = TABS.find(t => t.id === 'recipes');
    return (
      <div className="section">
        <button className="section-back-btn" onClick={() => setDetail(null)}>‹ Nutrition</button>
        <div className="s-header" style={{ paddingTop: 8 }}>
          <h2 className="s-title">{tab.icon} {tab.title}</h2>
          <p className="s-desc">{tab.desc}</p>
        </div>
        <RecipesPanel onSelectRecipe={selectRecipe} />
      </div>
    );
  }

  /* Landing page */
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Fuel Protocol · 80% Fruitarian · 20% for the Glutes</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">Eat 12 PM &amp; 5 PM (snack at 3) · last meal by 5 PM · fruits are 80%, protein is for the glutes · no gluten, oils, or dairy. Tap a topic for the full guide.</p>
      </div>
      <div className="nutr-landing splash-item">
        {TABS.map(t => (
          <button key={t.id} className="nutr-card" onClick={() => setDetail(t.id)}>
            <div className="nutr-card-icon">{t.icon}</div>
            <div className="nutr-card-body">
              <div className="nutr-card-title">{t.title}</div>
              <div className="nutr-card-desc">{t.desc}</div>
            </div>
            <span className="nutr-card-arrow">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
