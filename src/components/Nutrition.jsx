import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'meat',    icon: '🐟', title: 'Glute Days · Fish Days',  desc: 'Monday, Wednesday & Friday — the only days you eat fish. 10 AM fish & fats, 2 PM smoothie bowl, 5 PM egg with sweet potato or banana.' },
  { id: 'light',   icon: '🌱', title: 'Non-Glute Days',          desc: 'Tuesday, Thursday, Saturday & Sunday — tofu or eggs at 10 AM, smoothie bowl at 2 PM, egg with sweet potato or banana at 5 PM.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'Prep every food — steamed, boiled, oil-free. Tap for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',             desc: 'Eat/avoid rules for a flat stomach and calm gut.' },
];

/* ─── RECIPE CATEGORIES shown in the Recipes tab ─── */
const RECIPE_CATEGORIES = [
  {
    title: 'Protein (fish on glute days · tofu & eggs otherwise)',
    items: [
      { key: 'egg',     label: 'Eggs' },
      { key: 'fish',    label: 'Fish' },
      { key: 'tofu',    label: 'Tofu' },
    ],
  },
  {
    title: 'Fruits (Smoothie Bowls)',
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

/* ─── GLUTE DAYS · FISH DAYS (Mon, Wed, Fri) ─── */
export function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🍑 <strong>Glute days: Monday, Wednesday &amp; Friday.</strong> These are your <strong>only fish days</strong> — the days you train glutes are the days you eat fish.
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Why fish today?</strong> Your glutes grow on protein, and training day is when your body uses it best. Same three meal times as every other day.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">10:00 AM</div>
            <div>
              <div className="hyd-d">Protein &amp; fats</div>
              <div className="hyd-n">Salmon, sardines, tuna, tilapia or any white fish — plus a good fat like avocado or chia. Veggies on the side. Oil-free, no salt.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Smoothie bowl</div>
              <div className="hyd-n">Three fruits blended thick with a splash of water. Top with chia. No milk, no sugar.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Last meal · sunset — egg with sweet potato or banana</div>
              <div className="hyd-n">Slow carbs to keep you full all night. Nothing after sunset — spearmint or ginger tea only.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🐟 <strong>Protein for the glutes:</strong> salmon, sardines, tuna, tilapia, any fish. Eat the protein first, then your fats and veggies. No chicken, beef or pork on any day.
      </div>
    </>
  );
}

/* ─── NON-GLUTE DAYS (Tue, Thu, Sat, Sun) ─── */
export function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌱 <strong>Non-glute days: Tuesday, Thursday, Saturday &amp; Sunday.</strong> No fish today — tofu or eggs at 10 AM instead. Same three meal times, same 5 PM sunset finish.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">10:00 AM</div>
            <div>
              <div className="hyd-d">Protein &amp; fats</div>
              <div className="hyd-n">Tofu or eggs — scrambled, boiled, steamed or seared dry — with avocado or chia for the fats. No fish today.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Smoothie bowl</div>
              <div className="hyd-n">Three fruits blended thick with chia on top. Water or green tea alongside.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Last meal · sunset — egg with sweet potato or banana</div>
              <div className="hyd-n">Your fullest meal of the day in slow carbs. Nothing after sunset — spearmint or ginger tea only.</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🌸 This is not starvation — three real meals, just no fish today. Your 20-minute cool-down walk still happens after training, then nothing but tea.
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
    { time: 'On waking',   d: '500ml warm water + fresh lemon or calamansi',   n: 'Wake digestion and add Vitamin C before anything else.' },
    { time: 'Between meals', d: 'Plain water + green tea (unsweetened)',        n: 'Sip between your 10 AM, 2 PM, and 5 PM meals. Water and green tea support fullness, metabolism, and clear skin.' },
    { time: 'Psyllium',    d: '1 tbsp psyllium husk in a full glass of water',  n: 'Take between meals to stay full and support digestion.' },
    { time: '5 PM meal',   d: 'Water — sip, don\'t gulp · collagen optional',   n: 'Sip around your meal; do not drown it. Dairy-free collagen supports skin, hair, joints, and gut.' },
    { time: 'After sunset', d: 'Spearmint or ginger tea',                       n: 'Drink after your last meal. No food after 5 PM.' },
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
        <div className="s-tag">Fuel Protocol · 10 AM · 2 PM · 5 PM</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">10 AM protein &amp; fats · 2 PM smoothie bowl · 5 PM sweet potato &amp; banana at sunset · nothing after. Meat only on glute days (Mon · Wed · Fri).</p>
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
