import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'daily',   icon: '🍽️', title: 'Daily Clock · 8 AM to 2 PM', desc: 'Three meals inside one window, the same every day. Fruit at 8, apple & Greek yogurt at 11, the big meal at 2, nothing after. Under 1,000 calories, over 50 g of protein.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'Prep every food — steamed, boiled, oil-free. Tap for methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',             desc: 'Eat/avoid rules for a flat stomach and calm gut.' },
];

/* ─── RECIPE CATEGORIES shown in the Recipes tab ─── */
const RECIPE_CATEGORIES = [
  {
    title: 'Protein (fish, eggs & tofu — any of them, any day)',
    items: [
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

/* ─── THE DAILY CLOCK — the same four meals, every day of the week ─── */
export function DailyClock() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🕒 <strong>One window: 8 AM to 2 PM.</strong> Three meals inside it, the same three every day — glute days, abs days, the weekend, all the same. After 2 PM, nothing but water, tea and black coffee. The closing is what makes the window work.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ⚖️ <strong>Two numbers, and they pull against each other.</strong> <strong>1,000 calories is the ceiling.</strong> <strong>50 grams of protein is the floor.</strong> A thousand calories is a small budget, so nearly all of it has to do real work — which rules out oil, sugar and big piles of rice, and rules in white fish, eggs, Greek yogurt and tofu. Open any day in Movement and both numbers count themselves up as you pick.
      </div>

      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🍌 <strong>8 AM is also your fuel.</strong> You train in the morning, so the fruit goes in before the run, not after it. Never start the run on an empty stomach.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">8:00 AM</div>
            <div>
              <div className="hyd-d">Fruit — and not much of it</div>
              <div className="hyd-n">A banana, a few berries if you want them, black coffee alongside. About 140 calories. Small on purpose: the 2 PM plate needs the room. Eat it 20–30 minutes before you warm up.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">11:00 AM</div>
            <div>
              <div className="hyd-d">Apple sticks &amp; Greek yogurt</div>
              <div className="hyd-n">Apple cut into sticks, skin on, dipped in Greek yogurt. About 215 calories and 16 g of protein. Greek is strained, so the same small bowl carries twice the protein of plain — that swap alone is 7 g for 30 calories, the best trade in the whole plan.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">THE BIG MEAL</div>
              <div className="hyd-n">Your protein — fish, eggs or tofu — with a sweet potato, two boiled eggs, kimchi, cucumber and tomato, and a banana last. About 645 calories and 59 g of protein. This one plate is most of your food and nearly all of your protein, which is exactly how a 1,000-calorie day clears the 50 g floor instead of falling short of it.</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">After 2 PM</div>
            <div>
              <div className="hyd-d">The window shuts</div>
              <div className="hyd-n">Water, tea and black coffee, as much as you like. No food. If you are hungry at night, the answer is a bigger plate at 2 PM tomorrow — not a snack tonight.</div>
            </div>
          </div>
        </div>
      </div>

      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🐟 <strong>Protein:</strong> fish, eggs or tofu — any of them, any day. <strong>No chicken, beef or pork, ever.</strong> Eat the protein first, then the sweet potato, then the fruit. On a day the number looks short, put two proteins on one plate — fish and an egg together is the fastest 15 grams there is.
      </div>

      <div className="note-box note-gold">
        🛒 <strong>What to keep in the house.</strong> <strong>White fish</strong> (tilapia or cream dory) — the most protein for the fewest calories there is, and the single most useful thing on this list. <strong>Eggs</strong> and <strong>Greek yogurt</strong> — your everyday protein. <strong>Sweet potato</strong> and <strong>bananas</strong> — your energy for lifting. <strong>Kimchi</strong> — almost no calories, good for the gut, and it makes plain food taste like a meal. <strong>Cucumber, tomato and spinach</strong> — they fill the plate for nearly nothing. <strong>Chia seeds</strong> — they keep you full through the long gap from 2 PM to morning. <strong>Protein powder</strong> — only if you fall short; one scoop is 24 g for 120 calories.
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
    { food: 'Banana', note: 'The glute-day fuel — one before training and one straight after, every time. Potassium also reduces water retention.' },
    { food: 'Apple', note: 'Pectin fibre feeds good gut bacteria. Eat with the skin. Any day.' },
    { food: 'Yogurt bowl', note: 'Plain yogurt + protein powder + psyllium husk + 10 blueberries, set overnight. Noon on core days, or on waking before a glute session.' },
    { food: 'Fish (tilapia/bangus)', note: 'Glute days only (Mon · Wed · Fri). Omega-3 lowers inflammation. Steam with ginger + lemon.' },
    { food: 'Eggs (boiled/poached)', note: 'Any day — after training on glute days, and the 5 PM meal on core days. No oil, no butter. ~6g protein each.' },
    { food: 'Zucchini / carrots / spinach', note: 'Low-bloat vegetables. Steam them, no oil.' },
    { food: 'Cucumber', note: 'Eat freely, raw. 95% water, naturally anti-bloating.' },
    { food: 'Avocado', note: '½ per serving. Natural fat for hormones (this is a whole food, not an added oil).' },
  ];
  const avoid = [
    { food: 'Gluten — bread, pasta, pandesal, flour', note: 'The G in GODSSSS. Causes bloating and water retention.' },
    { food: 'Oils — fried food, cooking oil', note: 'The O. Steam and boil instead. Whole-food fats (avocado) are fine; added oils are not.' },
    { food: 'Dairy — milk, cheese, cream', note: 'The D. Triggers bloating and hormonal breakouts. Use dairy-free collagen instead. The one exception is the yogurt in your overnight bowl — plain and unsweetened, nothing else.' },
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
        <div className="s-tag">Fuel Protocol · one clock, every day of the week</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">The same four meals every day: coffee &amp; banana before you train, protein &amp; kimchi after, a smoothie &amp; granola bowl at 3 PM, and apple sticks with yogurt at 5 PM. Any protein, any day — never chicken, beef or pork.</p>
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
