import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'meat',    icon: '🍑', title: 'Glute Days · Eat Freely', desc: 'Monday & Thursday (glute days) — eat whenever you like, just stop eating by 5 PM.' },
  { id: 'light',   icon: '🍓', title: 'Everyday Meals',          desc: 'First meal 3 PM (psyllium husk + fruits) · main meal 5 PM · always stop eating by 5 PM.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'Prep every food — steamed, boiled, oil-free. Tap for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',             desc: 'Eat/avoid rules for a flat stomach and calm gut.' },
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
    title: 'Fruits (3 PM first meal)',
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

/* ─── GLUTE DAYS · EAT FREELY (Mon, Thu) ─── */
export function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🍑 <strong>Glute days: Monday &amp; Thursday.</strong> On your butt-building days, eat whenever you feel hungry — there is only one rule: <strong>stop eating by 5 PM.</strong>
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Why free eating today?</strong> Your glutes grow with enough food and protein. Don't restrict — just keep it clean and finish by 5 PM.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">Anytime</div>
            <div>
              <div className="hyd-d">Eat freely until 5 PM</div>
              <div className="hyd-n">Psyllium husk + fruits, and protein when you want it: salmon, sardines, beef, egg, or tofu, with veggies on the side.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Kitchen closed — no food after this</div>
              <div className="hyd-n">Stop eating for the day. Spearmint or ginger tea after is fine.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🥩 <strong>Protein for the glutes:</strong> salmon, sardines, beef, egg, or tofu. Eat protein first, then your veggies and fruit.
      </div>
    </>
  );
}

/* ─── EVERYDAY MEALS (Tue, Wed, Fri, Sat, Sun) ─── */
export function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🍓 <strong>Two meals a day, finishing by 5 PM.</strong> First meal at 3 PM (psyllium husk + fruits), main meal at 5 PM. <strong>Always stop eating by 5 PM.</strong>
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">3:00 PM</div>
            <div>
              <div className="hyd-d">First Meal — Psyllium husk + fruits</div>
              <div className="hyd-n">1 tbsp psyllium husk in water, then fruits: papaya, banana, berries, apple, kiwi, or pineapple.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Main Meal — finish by 5 PM</div>
              <div className="hyd-n">Fruits and your protein: salmon, sardines, beef, egg, or tofu, with veggies. This is your last food for the day.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🌸 This is not starvation. Eat enough at both meals, then walk 15 min after eating. Nothing after 5 PM — spearmint or ginger tea only.
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
    { time: 'On waking',   d: '500ml warm water + fresh lemon or calamansi',   n: 'Wake digestion and add Vitamin C before your first meal.' },
    { time: 'Before 3 PM', d: 'Plain water + green tea (unsweetened)',          n: 'Fast until your 3 PM first meal. Water and green tea support fullness, metabolism, and clear skin.' },
    { time: '3 PM first meal', d: 'Water — sip, don\'t gulp',                   n: 'Sip around fruit; do not drown it. Psyllium husk in a full glass of water.' },
    { time: '5 PM main meal', d: 'Collagen peptides in water (glute days)',     n: 'Dairy-free collagen supports skin, hair, joints, and gut lining.' },
    { time: 'After 5 PM', d: 'Spearmint or ginger tea',                         n: 'Drink after your last meal. No food after 5 PM.' },
    { time: 'All day',     d: 'Plain water — 2–2.5L total, sipped slowly',      n: 'Sip steadily to reduce bloat and puffiness.' },
  ];
  return (
    <>
      <div className="divider splash-item" style={{ marginTop: 28 }}>💧 Hydration</div>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💧 Drinks matter too. Keep them zero or near-zero sugar for skin, digestion, and hormones.
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
        🥘 Tap any food for prep options. Follow the plan: steamed or boiled, <strong>no oil, no dairy, no gluten</strong>. Eat fruit fresh and alone.
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
    { food: 'Papaya', note: 'Papain helps reduce bloating. Anti-inflammatory. Any day.' },
    { food: 'Pineapple', note: 'Bromelain aids digestion. Great glute-day breakfast.' },
    { food: 'Kiwi', note: 'Actinidin + high Vitamin C for collagen support. Low-bloat.' },
    { food: 'Watermelon', note: 'Hydrating, low calorie. Eat alone; it digests fast.' },
    { food: 'Berries', note: 'Lowest-sugar fruit, high fibre and antioxidants. Gentle on the gut, great any day.' },
    { food: 'Banana', note: 'Potassium reduces water retention. Best on sprint/glute days for quick fuel.' },
    { food: 'Apple', note: 'Pectin fibre feeds good gut bacteria. Eat with the skin. Any day.' },
    { food: 'Chicken breast 150g', note: 'Glute + sprint days. ~46g protein. Steam, boil, or bake — never fry.' },
    { food: 'Fish (tilapia/bangus)', note: 'Glute + sprint days. Omega-3 lowers inflammation. Steam with ginger + lemon.' },
    { food: 'Eggs (boiled/poached)', note: 'Lean protein for glute days. No oil, no butter. ~6g protein each.' },
    { food: 'Zucchini / carrots / spinach', note: 'Low-bloat vegetables. Steam them, no oil.' },
    { food: 'Cucumber', note: 'Eat freely, raw. 95% water, naturally anti-bloating.' },
    { food: 'Avocado', note: '½ per serving. Natural fat for hormones (this is a whole food, not an added oil).' },
  ];
  const avoid = [
    { food: 'Gluten — bread, pasta, pandesal, flour', note: 'The G in GODSSSS. Causes bloating and water retention.' },
    { food: 'Oils — fried food, cooking oil', note: 'The O. Steam and boil instead. Whole-food fats (avocado) are fine; added oils are not.' },
    { food: 'Dairy — milk, cheese, yogurt', note: 'The D. Triggers bloating and hormonal breakouts. Use dairy-free collagen instead.' },
    { food: 'Added sugar & sweets', note: 'The first S. Ages skin (glycation), feeds bad gut bacteria. Get sweetness from fruit only.' },
    { food: 'Salty / processed food', note: 'The second S. Salt = water retention = puffiness. Season lightly.' },
    { food: 'White rice', note: 'Spikes blood sugar fast. Sweet potato in small amounts is the better carb.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 Follow <strong>PFBS</strong> (Protein, Fruits, Bland, Small) and avoid <strong>GODSSSS</strong> (Gluten, Oils, Dairy, too Sweet, too Salty, Stress — plus good Sleep).
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
        <div className="s-tag">Fuel Protocol · First Meal 3 PM · Stop by 5 PM</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">First meal 3 PM (psyllium husk + fruits) · main meal 5 PM · always stop eating by 5 PM · glute days eat freely until 5.</p>
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
