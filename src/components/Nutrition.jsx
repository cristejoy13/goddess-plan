import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';
import IngredientDetailPage from './IngredientDetailPage';

export const TABS = [
  { id: 'meat',    icon: '🔥', title: 'Strength & Sprint Days', desc: 'Monday, Wednesday, Friday, Saturday — high protein fuel for your hardest training days. Eating window: 9 AM – 7 PM.' },
  { id: 'light',   icon: '🌿', title: 'Pilates & Rest Days',    desc: 'Tuesday, Thursday, Sunday — digestive rest and light meals. Eating window: 3 PM – 7 PM.' },
  { id: 'recipes', icon: '🥘', title: 'Recipes & Hydration',    desc: 'How to prepare every ingredient in your plan. Tap any food to see three preparation methods.' },
  { id: 'guide',   icon: '📊', title: 'Food Guide',              desc: 'Glycemic load of every food in your plan and why it matters.' },
];

/* ─── RECIPE CATEGORIES shown in the Recipes tab ─── */
const RECIPE_CATEGORIES = [
  {
    title: 'Proteins',
    items: [
      { key: 'egg',     label: 'Eggs' },
      { key: 'chicken', label: 'Chicken' },
      { key: 'fish',    label: 'Fish' },
      { key: 'beef',    label: 'Lean Beef' },
    ],
  },
  {
    title: 'Vegetables & Carbs',
    items: [
      { key: 'broccoli',     label: 'Broccoli' },
      { key: 'sweet potato', label: 'Sweet Potato' },
      { key: 'salad',        label: 'Salad' },
      { key: 'avocado',      label: 'Avocado' },
      { key: 'oats',         label: 'Oats' },
      { key: 'chia',         label: 'Chia Pudding' },
      { key: 'banana',       label: 'Banana' },
    ],
  },
  {
    title: 'Sweet Snacks & Desserts',
    items: [
      { key: 'banana-nice-cream',   label: 'Banana Nice Cream' },
      { key: 'chia-mango-pudding',  label: 'Chia Mango Pudding' },
      { key: 'cacao-banana-bites',  label: 'Cacao Banana Bites' },
      { key: 'sweet-potato-brownie', label: 'Sweet Potato Brownies' },
      { key: 'coconut-chia-balls',  label: 'Coconut Chia Balls' },
      { key: 'avocado-choc-mousse', label: 'Avocado Choc Mousse' },
      { key: 'banana-oat-cookies',  label: 'Banana Oat Cookies' },
    ],
  },
];

/* ─── MEAT DAYS ─── */
export function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔥 <strong>Strength & sprint days: Monday, Wednesday, Friday, Saturday.</strong> Eating window 9 AM – 7 PM. Protein-heavy meals to fuel your hardest sessions. Always eat protein first.
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Why protein only on hard days?</strong> Your digestive system processes meat slowly (2–5 hours). Eating it only on hard training days means your gut is never overworked, your body fully absorbs the protein it receives, and your lighter days feel genuinely lighter. Fish is the exception — it digests in under 2 hours and can be eaten any day.
      </div>
      <div className="calorie-banner splash-item" style={{ marginBottom: 18 }}>
        <div className="cal-block">
          <div className="cal-phase">Months 1–3 · Calorie Deficit</div>
          <div className="cal-number">~1,450 cal/day</div>
          <div className="cal-note">BMR 1,178 · TDEE 1,826 · 20% deficit for lean recomposition</div>
        </div>
        <div className="cal-divider" />
        <div className="cal-block">
          <div className="cal-phase">Months 4–12 · Maintenance</div>
          <div className="cal-number">~1,800 cal/day</div>
          <div className="cal-note">Full TDEE · sustain composition · support training output</div>
        </div>
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">9:00 AM</div>
            <div>
              <div className="hyd-d">Meal 1 — Light pre-workout fuel</div>
              <div className="hyd-n">½ banana + 1–2 eggs + green tea · OR · small bowl oatmeal + green tea · OR · papaya + 1 egg + ginger tea</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">Meal 2 — Main protein meal (post-workout)</div>
              <div className="hyd-n">Eat protein first. Chicken 150g or fish 150g or lean beef 120g + steamed broccoli + ½ cup sweet potato + collagen water</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">4:00 PM</div>
            <div>
              <div className="hyd-d">Sweet Snack (optional)</div>
              <div className="hyd-n">See Recipes tab — one dessert snack, naturally sweet, high in fibre or protein</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">7:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Light protein finish · No food after this</div>
              <div className="hyd-n">Fish 120g + salad · OR · chicken 100g + steamed vegetables · OR · 1 egg + avocado + warm broth</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🥩 <strong>Protein target:</strong> 77–96g per day on training days. Chicken 150g = 37g · Fish 150g = 33g · Lean beef 120g = 29g · 1 egg = 6g.
      </div>
    </>
  );
}

/* ─── LIGHT DAYS ─── */
export function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌿 <strong>Light days: Tuesday, Thursday, Sunday.</strong> Eating window 3 PM – 7 PM. Only 2 meals. No heavy protein — your digestive system gets genuine rest, your gut lining repairs, and you arrive at the next hard day feeling genuinely fresh.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">3:00 PM</div>
            <div>
              <div className="hyd-d">First Meal — Main meal of the day</div>
              <div className="hyd-n">1 egg + large salad + collagen water · OR · chia pudding + papaya + mixed nuts · OR · oats + pineapple + kiwi · OR · fish 100g + steamed vegetables</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">7:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Very light finish · No food after this</div>
              <div className="hyd-n">Salad + ½ avocado + 1 egg + chamomile tea · OR · chia pudding + berries · OR · papaya + spearmint tea · OR · oats (plain) + kiwi</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🌸 Light days are not cheat days — they are intentional digestive rest. 20 hours fasting (from 7 PM prior evening to 3 PM today) supports fat adaptation, reduces inflammation, and makes your hard training days significantly more effective.
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
    { time: 'On waking',   d: '500ml warm water + fresh calamansi squeeze',     n: 'Flushes overnight waste, delivers Vitamin C before your first meal, activates digestion gently.' },
    { time: 'With Meal 1', d: 'Green tea — 1 cup, unsweetened',                  n: 'EGCG in green tea reduces sebum production — directly addresses oily pores. Mild energy boost without cortisol spike.' },
    { time: 'With Meal 2', d: 'Collagen peptides in 300ml water',                n: 'Take with Vitamin C source (calamansi on your meal) for maximum absorption. Builds skin, joints, and gut lining.' },
    { time: '2 PM snack',  d: 'Ginger tea or spearmint tea',                     n: 'Ginger reduces afternoon gut inflammation. Spearmint lowers androgens that drive sebum — one cup daily over 6–8 weeks creates visible skin improvement.' },
    { time: 'All day',     d: 'Plain water — sip continuously, 2–2.5L total',    n: 'Sip slowly throughout the day rather than gulping. Consistent hydration reduces facial puffiness significantly.' },
    { time: 'After 4 PM',  d: 'Chamomile, ginger, or spearmint tea only',        n: 'No food. Chamomile lowers cortisol before sleep. These teas are your evening companions until bed.' },
  ];
  return (
    <>
      <div className="divider splash-item" style={{ marginTop: 28 }}>💧 Hydration</div>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💧 What you drink matters as much as what you eat. Every drink here is zero or near-zero glycemic and actively supports your skin, training, and hormones.
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
        ✕ Avoid completely: sugary drinks, milk, carbonated drinks, store-bought juices, flavoured water, and alcohol.
      </div>
    </>
  );
}

/* ─── RECIPES PANEL ─── */
export function RecipesPanel({ onSelectRecipe }) {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🥘 Tap any ingredient to open three preparation options — choose the one that fits your time and mood. Dessert snacks use only whole-food, natural ingredients high in fibre or protein.
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
  const rows = [
    { food: 'Sweet potato (roasted)', gl: 11, note: 'Best training-day carb. Add cinnamon to lower GL further.' },
    { food: 'Oatmeal (rolled oats)', gl: 9, note: 'Best rest/pilates day carb. Overnight soaking reduces GL.' },
    { food: 'Banana (just-ripe)', gl: 12, note: 'Strength and sprint days only — pre-workout fuel.' },
    { food: 'Papaya', gl: 9, note: 'All days. Papain enzyme reduces bloating. One of the most anti-inflammatory fruits.' },
    { food: 'Kiwi', gl: 5, note: 'All days. Highest Vitamin C of any common fruit — direct collagen synthesis support.' },
    { food: 'Pineapple', gl: 6, note: 'Small portions only. Bromelain enzyme reduces inflammation.' },
    { food: 'Broccoli', gl: 1, note: 'Eat freely. Sulforaphane is the most potent vegetable anti-inflammatory.' },
    { food: 'Cucumber', gl: 1, note: 'Eat freely. 95% water, silica for skin elasticity.' },
    { food: 'Squash / kalabasa', gl: 3, note: 'Eat freely. Beta-carotene = food-form Vitamin A.' },
    { food: 'Avocado', gl: 0, note: 'Eat daily. Essential for hormone synthesis. ½ per serving.' },
    { food: 'Eggs (2 max/day)', gl: 0, note: 'Every day. Complete protein, choline, Vitamin D. Always protein first.' },
    { food: 'Chicken breast 150g', gl: 0, note: 'Strength & sprint days. 37g protein per serving.' },
    { food: 'Fish (bangus/tanigue)', gl: 0, note: 'Any day. Omega-3 reduces post-training inflammation and skin redness.' },
    { food: 'Lean beef 120g', gl: 0, note: 'Once per week max. Rich in zinc and iron — support hormones and skin clarity.' },
    { food: 'Mixed nuts', gl: 0, note: 'Daily, small handful. Walnuts highest omega-3. Almonds highest Vitamin E.' },
    { food: 'Chia seeds', gl: 1, note: 'Daily in pudding. Expand 10× in stomach. Extremely filling for few calories.' },
    { food: 'White rice', gl: 43, note: 'AVOID. Spikes blood sugar immediately.' },
    { food: 'Bread / pandesal', gl: 47, note: 'AVOID. Causes immediate water retention and bloating.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 Glycemic Load (GL) = how much a food actually raises your blood sugar in a real portion. Low GL = stable blood sugar, less fat storage, less inflammation, clearer skin.
      </div>
      <div className="g-card splash-item" style={{ overflowX: 'auto' }}>
        <table className="fancy-table" style={{ width: '100%' }}>
          <thead><tr><th>Food</th><th>GL</th><th>Notes</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td><strong>{r.food}</strong></td>
                <td style={{ color: r.gl <= 5 ? 'var(--gold)' : r.gl <= 15 ? 'var(--text-mid)' : 'var(--rose)', fontWeight: 600 }}>{r.gl}</td>
                <td>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const PANELS = { meat: MeatDays, light: LightDays, guide: FoodGuide };
const TAB_ALIASES = { hydration: 'guide' };
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
        <div className="s-tag">Fuel Protocol · Body Recomposition</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">Four meals a day · last meal by 4 PM · always eat protein first · meat on heavy training days only. Tap a topic to open the full guide.</p>
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
