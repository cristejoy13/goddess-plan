import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'daily',   icon: '🍽️', title: 'Daily Clock · 12 PM & 5 PM', desc: 'Nothing until noon. Brunch at 12, small meal at 5. Under 1,000 calories, over 50 g of protein.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'Prep every food — steamed, boiled, seared dry. Tap for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',             desc: 'Eat and avoid rules. Keep the gut calm.' },
];

/* ─── RECIPE CATEGORIES shown in the Recipes tab ─── */
const RECIPE_CATEGORIES = [
  {
    title: 'Protein (beef, chicken, fish, eggs & tofu — any of them, any day)',
    items: [
      { key: 'beef',    label: 'Beef' },
      { key: 'chicken', label: 'Chicken' },
      { key: 'egg',     label: 'Eggs' },
      { key: 'fish',    label: 'Fish' },
      { key: 'tofu',    label: 'Tofu' },
    ],
  },
  {
    title: 'The Yogurt Bowl (make it the night before)',
    items: [
      { key: 'yogurtbowl', label: 'Yogurt Bowl' },
    ],
  },
  {
    title: 'Fruits (bowls & plates)',
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

/* ─── THE DAILY CLOCK — brunch at 12, something small at 5, then shut ─── */
export function DailyClock() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🕒 <strong>Two meals: 12 PM and 5 PM.</strong> Brunch at noon, small meal at 5 PM, nothing after. Before noon: water, tea, and black coffee only.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ⚖️ <strong>1,000 calories is the ceiling.</strong> <strong>50 grams of protein is the floor.</strong> Normal days: <strong>845 calories and 66 g</strong> with Meal A, or <strong>780 and 72 g</strong> with Meal B.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🌙 <strong>No morning meal now.</strong> Train on black coffee, eat at noon, and keep the small meal for 5 PM.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">Before 12 PM</div>
            <div>
              <div className="hyd-d">Water, tea &amp; black coffee</div>
              <div className="hyd-n">No food before noon. Train on black coffee.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">BRUNCH — MEAL A or MEAL B, one of the two</div>
              <div className="hyd-n"><strong>A, the egg plate:</strong> 2 whole eggs and 3 egg whites with spinach in a dry pan, kimchi, sweet potato, papaya, chia, pumpkin or sesame seeds, Greek yogurt. About 630 calories and 50 g of protein.<br /><br /><strong>B, the meat plate:</strong> 100 g of lean beef or chicken breast seared in a hot dry pan, with sweet potato, spinach, bell pepper, tomato, cucumber, kimchi, Greek yogurt and a spoon of seeds. About 565 calories and 56 g. Beef for iron; chicken for fewer calories.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">5:00 PM</div>
            <div>
              <div className="hyd-d">Apple slices &amp; yogurt, or a smoothie</div>
              <div className="hyd-n">Apple with yogurt, or a smoothie with two or three fruits, chia seeds, and granola. Around 215–250 calories. Greek yogurt adds more protein.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">After 5 PM</div>
            <div>
              <div className="hyd-d">The window shuts</div>
              <div className="hyd-n">Water and tea. No food. Hungry tonight means bigger brunch tomorrow.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🍽️ <strong>Meal A or Meal B — one of the two, never both.</strong> This is your 12 PM brunch. Eggs give more food; meat gives more protein.
      </div>

      <div className="note-box note-gold">
        ✅ <strong>Beef and chicken are in the plan now.</strong> Pork stays out. <strong>Oil is still out.</strong> Use a hot dry pan for eggs and meat.
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
    { time: 'On waking',   d: '500ml warm water + fresh lemon or calamansi',   n: 'Wake digestion and add Vitamin C.' },
    { time: 'Between meals', d: 'Plain water + green tea (unsweetened)',        n: 'Sip between meals and during the morning fast.' },
    { time: 'Psyllium',    d: '1 tbsp psyllium husk in a full glass of water',  n: 'Take between meals. Already in the yogurt bowl; drink a full glass of water.' },
    { time: '5 PM meal',   d: 'Water — sip, don\'t gulp · collagen optional',   n: 'Sip; do not gulp. Dairy-free collagen is optional.' },
    { time: 'After sunset', d: 'Spearmint or ginger tea',                       n: 'Drink after your last meal. No food after 5 PM.' },
    { time: 'All day',     d: 'Plain water — 2–2.5L total, sipped slowly',      n: 'Sip steadily to reduce bloat and puffiness.' },
  ];
  return (
    <>
      <div className="divider splash-item" style={{ marginTop: 28 }}>💧 Hydration</div>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💧 Drinks matter too. Keep them zero or near-zero sugar.
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
        ✕ Avoid: oils in drinks, milk &amp; dairy, sugary drinks, store-bought juices, soda, flavoured water, and alcohol.
      </div>
    </>
  );
}

/* ─── RECIPES PANEL ─── */
export function RecipesPanel({ onSelectRecipe }) {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🥘 Tap any food for prep options. Steam, boil, bake, or sear in a hot dry pan. <strong>No oil, no dairy beyond the yogurt, no gluten.</strong>
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
    { food: 'Papaya', note: 'Papain helps bloating. Anti-inflammatory. Any day.' },
    { food: 'Pineapple', note: 'Bromelain helps digestion. Good glute-day breakfast.' },
    { food: 'Kiwi', note: 'Actinidin + high Vitamin C. Low-bloat collagen support.' },
    { food: 'Watermelon', note: 'Hydrating, low calorie. Eat alone; it digests fast.' },
    { food: 'Berries', note: 'Low sugar, high fibre and antioxidants. Gentle any day.' },
    { food: 'Banana', note: 'One of your three fruits. Use alone at 5 PM, or to thicken a smoothie.' },
    { food: 'Black coffee', note: 'No milk, no sugar. Morning only: it carries you to noon. Keep it before 12; coffee at five costs sleep.' },
    { food: 'Papaya', note: 'One of your three fruits, also in Meal 1. Gentle and low-calorie.' },
    { food: 'Lean beef', note: 'Meal 2, any day. Iron and zinc. Slice thin across the grain; sear dry.' },
    { food: 'Chicken breast', note: 'Meal 2, any day. Lean protein. Pat it dry before the pan.' },
    { food: 'Fish (tilapia/bangus)', note: 'Any day. High protein, fewer calories. Steam with ginger + calamansi.' },
    { food: 'Eggs & egg whites', note: 'Meal 1, every day. 2 whole eggs and 3 whites. A whole egg is ~6 g protein; a white is ~3.6 g.' },
    { food: 'Spinach', note: 'In both meals. Iron and folate. Wilts small for few calories.' },
    { food: 'Bell pepper & tomato', note: 'Meal 2. They fill the plate for about 50 calories between them.' },
    { food: 'Kimchi', note: 'Both meals. Gut-friendly, salty. Keep it a small bowl.' },
    { food: 'Pumpkin or sesame seeds', note: 'One tablespoon, both meals. Zinc and magnesium. Measure it: a tablespoon is 55 calories and a handful is 200.' },
    { food: 'Chia seeds', note: 'They keep you full through the long gap from 5 PM to noon. Drink water with them.' },
    { food: 'Sweet potato', note: 'Both meals. Your energy for lifting. Baked is sweeter than boiled.' },
    { food: 'Greek yogurt', note: 'Strained and higher protein than plain. Keep it in ONE meal, not both — that is 120 calories saved.' },
    { food: 'Cucumber', note: 'Eat freely, raw. 95% water, naturally anti-bloating.' },
    { food: 'Avocado', note: '½ per serving. Natural fat for hormones (this is a whole food, not an added oil).' },
  ];
  const avoid = [
    { food: 'Gluten — bread, pasta, pandesal, flour', note: 'The G in GODSSSS. Causes bloating and water retention.' },
    { food: 'Oils — fried food, cooking oil', note: 'The O. Steam, boil, bake, or sear in a hot dry pan. Whole-food fats are fine; added oils are not. At 1,000 calories a day, a tablespoon of oil is 120 calories.' },
    { food: 'Dairy — milk, cheese, cream', note: 'The D. Triggers bloating and hormonal breakouts. The one exception is plain Greek yogurt, unsweetened, in your meals.' },
    { food: 'Added sugar & sweets', note: 'The first S. Ages skin and feeds bad gut bacteria. Get sweetness from fruit only.' },
    { food: 'Salty / processed food', note: 'The second S. Salt = water retention = puffiness. Season lightly.' },
    { food: 'White rice', note: 'Spikes blood sugar fast. At 1,000 calories a day, it buys little. Sweet potato is already in both meals.' },
    { food: 'Pork', note: 'The one meat still out. Beef and chicken are in the plan; pork is not.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 Follow <strong>PFBS</strong> (Protein, Fruits, Bland, Small) and avoid <strong>GODSSSS</strong> (Gluten, Oils, Dairy, too Sweet, too Salty, Stress — plus good Sleep). <strong>Beef and chicken are in the plan now.</strong> Oil is not.
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

const PANELS = { daily: DailyClock, guide: FoodGuide };
// The two day-type tabs collapsed into one daily clock. Their ids stay mapped
// so a bookmark or a search entry saved against the old plan still lands
// somewhere sensible instead of rendering nothing.
const TAB_ALIASES = { hydration: 'recipes', snacks: 'recipes', meat: 'daily', light: 'daily' };
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
        <div className="s-tag">Fuel Protocol · two meals, 12 PM &amp; 5 PM</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">Two meals a day. Black coffee until noon, brunch at 12, small meal at 5. Under 1,000 calories, over 50 g of protein.</p>
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
