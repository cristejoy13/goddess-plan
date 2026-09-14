import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'daily',   icon: '🍽️', title: 'Daily Clock · 8 AM to 2 PM', desc: 'Fruit at 8, the egg plate at 11, beef or chicken at 2, nothing after. Under 1,000 calories, over 50 g of protein.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'Prep every food — steamed, boiled, seared dry. Tap for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',             desc: 'Eat/avoid rules for a flat stomach and calm gut.' },
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

/* ─── THE DAILY CLOCK — fruit at 8, two plates at 11 and 2, then shut ─── */
export function DailyClock() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🕒 <strong>One window: 8 AM to 2 PM.</strong> Fruit, then two real meals, the same two every day. After 2 PM, nothing but water, tea and black coffee. The closing is what makes the window work.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ⚖️ <strong>Two numbers, and they pull against each other.</strong> <strong>1,000 calories is the ceiling.</strong> <strong>50 grams of protein is the floor.</strong> Your two plates at full size, with fruit, come to about <strong>1,290</strong> — which is 290 over. Two cuts fix it: <strong>one whole egg instead of two</strong>, and <strong>Greek yogurt in one meal instead of both</strong>. That lands the day at about 980 with 71 g of protein, and nothing else is dropped.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🍌 <strong>8 AM is also your fuel.</strong> You train in the morning, so the fruit goes in before the run, not after it. Take the black coffee with it on glute days.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">8:00 AM</div>
            <div>
              <div className="hyd-d">Fruit &amp; black coffee</div>
              <div className="hyd-n">Banana, berries or papaya — those three, pick one. Papaya is the lightest at about 55 calories, the banana the biggest at 105. Black coffee alongside, especially on a glute day. Eat it 20–30 minutes before you warm up.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">11:00 AM</div>
            <div>
              <div className="hyd-d">Meal 1 · the egg plate</div>
              <div className="hyd-n">1 or 2 whole eggs and 3 egg whites, fried with spinach in <strong>one teaspoon of olive oil</strong>. Kimchi, a sweet potato and papaya on the side. Chia and a spoon of pumpkin or sesame seeds over the top, Greek yogurt alongside. About 670 calories and 50 g of protein at full size — your whole daily protein floor in one meal.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Meal 2 · beef or chicken</div>
              <div className="hyd-n">100 g of lean beef or chicken breast, seared in a hot dry pan. Sweet potato, spinach, bell pepper, tomato, cucumber and kimchi. Greek yogurt and a spoon of seeds. About 565 calories and 56 g of protein. Beef when you want the iron, chicken when you want the calories back.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">After 2 PM</div>
            <div>
              <div className="hyd-d">The window shuts</div>
              <div className="hyd-n">Water, tea and black coffee, as much as you like. No food. If you are hungry at night, the answer is a bigger plate tomorrow — not a snack tonight.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔁 <strong>Swap them round whenever you like.</strong> Both plates are offered at 11 AM and at 2 PM. If you would rather have the meat first and the eggs second, just pick them that way — the numbers come out the same.
      </div>

      <div className="note-box note-gold">
        ✅ <strong>Two rules changed, because you asked.</strong> <strong>Beef and chicken are in the plan now</strong> — the old no-meat rule is gone, and pork is the only one still out. <strong>One teaspoon of olive oil a day</strong> is allowed, for frying the egg plate. That is the whole allowance: measure it rather than pouring, because a teaspoon is 40 calories and a splash is 120.
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
    { time: 'Between meals', d: 'Plain water + green tea (unsweetened)',        n: 'Sip between meals on both day types — and all through the morning fast on core days. Water and green tea support fullness, metabolism, and clear skin.' },
    { time: 'Psyllium',    d: '1 tbsp psyllium husk in a full glass of water',  n: 'Take between meals to stay full and support digestion. Already in the yogurt bowl — always drink a full glass of water with it.' },
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
        🥘 Tap any food for prep options. Steamed, boiled, baked or seared in a hot dry pan — <strong>one teaspoon of olive oil a day</strong>, for the egg plate, and no more. Eat fruit fresh and alone.
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
    { food: 'Banana', note: 'One of your three fruits. The glute-day fuel — eat it at 8 AM before you run. Potassium also reduces water retention.' },
    { food: 'Black coffee', note: 'No milk, no sugar. Take it at 8 AM and especially on a glute day — it is the cheapest lift you will get before a hip thrust.' },
    { food: 'Papaya', note: 'One of your three fruits, and it is also in Meal 1. The gentlest thing on your stomach and the cheapest in calories.' },
    { food: 'Lean beef', note: 'Meal 2, any day. Where your iron and zinc come from — a 1,000-calorie day runs short on both. Slice thin across the grain, sear in a hot dry pan.' },
    { food: 'Chicken breast', note: 'Meal 2, any day. Slightly leaner than beef and almost the same protein. Pat it dry before it hits the pan.' },
    { food: 'Fish (tilapia/bangus)', note: 'Any day. Omega-3 lowers inflammation, and it is the most protein for the fewest calories there is. Steam with ginger + calamansi.' },
    { food: 'Eggs & egg whites', note: 'Meal 1, every day. 2 whole eggs and 3 whites. A whole egg is ~6 g protein, a white is ~3.6 g for almost no calories — which is why the whites are there.' },
    { food: 'Spinach', note: 'In both meals. Iron and folate, and it wilts into almost nothing, so it costs you no calories.' },
    { food: 'Bell pepper & tomato', note: 'Meal 2. They fill the plate for about 50 calories between them.' },
    { food: 'Kimchi', note: 'Both meals. Almost no calories, good for the gut, and it makes plain food taste like a real meal. A small bowl — it is salty.' },
    { food: 'Pumpkin or sesame seeds', note: 'One tablespoon, both meals. Zinc and magnesium. Measure it — a tablespoon is 55 calories and a handful is 200.' },
    { food: 'Chia seeds', note: 'They keep you full through the long gap from 2 PM to morning. Drink water with them.' },
    { food: 'Sweet potato', note: 'Both meals. Your energy for lifting. Baked is sweeter than boiled.' },
    { food: 'Greek yogurt', note: 'Strained, so the same small bowl carries twice the protein of plain. Keep it in ONE meal, not both — that is 120 calories saved.' },
    { food: 'Cucumber', note: 'Eat freely, raw. 95% water, naturally anti-bloating.' },
    { food: 'Avocado', note: '½ per serving. Natural fat for hormones (this is a whole food, not an added oil).' },
  ];
  const avoid = [
    { food: 'Gluten — bread, pasta, pandesal, flour', note: 'The G in GODSSSS. Causes bloating and water retention.' },
    { food: 'Oil beyond 1 teaspoon a day', note: 'The O, relaxed. ONE teaspoon of olive oil a day, for frying the egg plate — that is the whole allowance. Everything else is steamed, boiled, baked or seared in a hot dry pan. Oil is 40 calories a teaspoon, which is why it is measured and not poured.' },
    { food: 'Dairy — milk, cheese, cream', note: 'The D. Triggers bloating and hormonal breakouts. The one exception is plain Greek yogurt, unsweetened, in your meals.' },
    { food: 'Added sugar & sweets', note: 'The first S. Ages skin (glycation), feeds bad gut bacteria. Get sweetness from fruit only.' },
    { food: 'Salty / processed food', note: 'The second S. Salt = water retention = puffiness. Season lightly.' },
    { food: 'White rice', note: 'Spikes blood sugar fast, and at 1,000 calories a day it buys you very little. Sweet potato is the better carb and it is already in both meals.' },
    { food: 'Pork', note: 'The one meat still out. Beef and chicken are in the plan; pork is not.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 Follow <strong>PFBS</strong> (Protein, Fruits, Bland, Small) and avoid <strong>GODSSSS</strong> (Gluten, Oils, Dairy, too Sweet, too Salty, Stress — plus good Sleep). <strong>Beef and chicken are in the plan now</strong>, and so is one teaspoon of olive oil a day.
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
        <div className="s-tag">Fuel Protocol · one window, 8 AM to 2 PM</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">One window, 8 AM to 2 PM. Fruit and black coffee at 8, the egg plate at 11, beef or chicken at 2, nothing after. Under 1,000 calories, over 50 g of protein.</p>
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
