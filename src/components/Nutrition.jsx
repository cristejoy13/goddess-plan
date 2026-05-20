import { useState, useEffect } from 'react';

const TABS = [
  { id: 'meat',      icon: '🔥', title: 'Strength & Sprint Days',  desc: 'Monday, Wednesday, Thursday — high protein fuel for your heaviest training days.' },
  { id: 'light',     icon: '🌿', title: 'Pilates & Rest Days',      desc: 'Tuesday, Friday, Saturday, Sunday — digestive rest and plant-based meals.' },
  { id: 'snacks',    icon: '🍱', title: 'Snacks',                    desc: 'Your 2 PM bridge meal — always eat protein or fat first.' },
  { id: 'guide',     icon: '📊', title: 'Food Guide',                desc: 'Glycemic load of every food in your plan and why it matters.' },
  { id: 'hydration', icon: '💧', title: 'Hydration',                 desc: 'What to drink, when, and what to avoid completely.' },
];

/* ─── Ingredient Card ─── */
function IngredientCard({ emoji, name, note, protein, methods }) {
  const [open, setOpen] = useState(false);
  const [activeMethod, setActiveMethod] = useState(0);
  return (
    <div className={`ingr-card${open ? ' is-open' : ''}`}>
      <button className="ingr-trigger" onClick={() => setOpen(o => !o)}>
        <span className="ingr-em">{emoji}</span>
        <div className="ingr-info">
          <div className="ingr-name">{name}</div>
          <div className="ingr-note">{note}</div>
        </div>
        {protein && <div className="ingr-macro"><span className="ingr-protein">{protein}</span></div>}
        <span className="ingr-arr">▾</span>
      </button>
      <div className="ingr-body">
        <div className="ingr-inner">
          <div className="ingr-methods">
            {methods.map((m, i) => (
              <button key={i} className={`ingr-method-btn${activeMethod === i ? ' active' : ''}`} onClick={() => setActiveMethod(i)}>
                {m.name}
              </button>
            ))}
          </div>
          <div className="ingr-recipe">
            <div className="ingr-recipe-time">⏱ {methods[activeMethod].time}</div>
            <ol className="ingr-steps">
              {methods[activeMethod].steps.map((step, i) => <li key={i}>{step}</li>)}
            </ol>
            {methods[activeMethod].tip && <div className="ingr-tip">💡 {methods[activeMethod].tip}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MEAT DAYS ─── */
function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔥 <strong>Meat days: Monday, Wednesday, Thursday.</strong> Your body needs heavier fuel on the days it works hardest. Chicken, fish, and lean beef on these 3 days. Always eat protein first. Four meals — last one by 4 PM.
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Should you eat meat every day?</strong> No — and this is intentional. Your digestive system processes meat slowly (2–5 hours). Eating it only on heavy training days means your gut is never overworked, your body fully absorbs the protein it receives, and your lighter days feel genuinely lighter. Fish is the exception — it digests in under 2 hours and can be eaten any day.
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
            <div className="hyd-time">7:00 AM</div>
            <div>
              <div className="hyd-d">Meal 1 — Light pre-workout fuel</div>
              <div className="hyd-n">½ banana + 1 boiled egg + green tea · OR · small bowl oatmeal + green tea · OR · small bowl papaya + 1 boiled egg + ginger tea</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">11:00 AM</div>
            <div>
              <div className="hyd-d">Meal 2 — Main protein meal (post-workout)</div>
              <div className="hyd-n">Eat protein first. Grilled chicken 150g or fish 150g or lean beef 120g + steamed squash or broccoli + ½ cup sweet potato + collagen water</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Snack — Light &amp; low glycemic</div>
              <div className="hyd-n">1 boiled egg + cucumber slices + ginger tea · OR · kiwi + small handful almonds · OR · small bowl papaya + mixed nuts</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">4:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Light protein finish · No food after this</div>
              <div className="hyd-n">Grilled fish 120g + salad · OR · chicken 100g + steamed pechay · OR · 1 boiled egg + avocado + warm chicken broth</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🥩 <strong>Protein target at 48 kg:</strong> 77–96g per day on training days. Chicken 150g = 37g · Fish 150g = 33g · Lean beef 120g = 29g · 1 egg = 6g.
      </div>
    </>
  );
}

/* ─── LIGHT DAYS ─── */
function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌿 <strong>Light days: Tuesday, Friday, Saturday, Sunday.</strong> No heavy meat. Max 2 eggs for the whole day. Your digestive system gets real rest, your gut lining repairs, and you arrive at Monday feeling genuinely fresh.
      </div>
      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">8:00 AM</div>
            <div>
              <div className="hyd-d">Meal 1 — Gentle morning meal</div>
              <div className="hyd-n">Chia pudding + papaya slices + green tea · OR · warm oatmeal + sliced banana + cinnamon · OR · 1 boiled egg + small bowl papaya + ginger tea</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">Meal 2 — Light midday meal</div>
              <div className="hyd-n">1 scrambled egg + large salad + collagen water · OR · chia pudding + kiwi + mixed nuts · OR · oatmeal + pineapple slices + nuts</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Snack — Fruit and fat</div>
              <div className="hyd-n">Kiwi + small handful mixed nuts · OR · small bowl papaya + spearmint tea · OR · half pineapple ring + almonds</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">4:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Very light finish · No food after this</div>
              <div className="hyd-n">Salad + avocado + 1 boiled egg + chamomile tea · OR · chia pudding + kiwi slices · OR · oatmeal (plain) + papaya + chamomile tea</div>
            </div>
          </div>
        </div>
      </div>
      <div className="note-box note-rose">
        🌸 Light days are not cheat days — they are intentional digestive rest. Your gut repairs, inflammation drops, and you absorb nutrients from meat days more effectively.
      </div>
    </>
  );
}

/* ─── RECIPES ─── */
const INGREDIENTS = [
  {
    emoji: '🥚', name: 'Eggs', note: 'Maximum 2 per day total', protein: '6g per egg',
    methods: [
      { name: 'Soft-Boiled', time: '6 min total', steps: ['Bring a small pot of water to a full rolling boil.','Lower eggs in gently with a spoon — do not drop them.','Boil exactly 6 minutes — set a timer.','Transfer immediately to a bowl of cold water for 2 minutes.','Peel from the wide end. The yolk will be soft and creamy in the centre.','Eat immediately — soft-boiled eggs do not keep well.'], tip: 'The most digestible egg preparation. The slightly soft yolk keeps more bioavailable nutrients than fully cooked yolk.' },
      { name: 'Scrambled with Turmeric', time: '8 min total', steps: ['Crack 2 eggs into a bowl. Do not whisk yet — let them sit 1 minute.','Heat a small pan over medium-low heat. Add a tiny drizzle of olive oil.','Whisk eggs lightly and pour into pan.','Use a silicone spatula to stir constantly in figure-8 motions.','Remove pan from heat every 20–30 seconds while stirring — this prevents rubbery texture.','When eggs are just barely set and still slightly glossy, remove from heat.','Add a pinch of turmeric and a crack of black pepper. Stir gently.'], tip: 'Always add turmeric after removing from heat — heat above 100°C degrades some of its anti-inflammatory compounds.' },
      { name: 'Sunny-Side Up', time: '5 min total', steps: ['Heat a small pan over medium-low heat. Add a tiny drop of olive oil.','Crack egg at the edge of the pan, lower in gently to avoid breaking the yolk.','Place a lid over the pan to trap steam — this cooks the white without flipping.','Cook 2–3 minutes until white is fully set but yolk is still completely liquid.','Season with a crack of black pepper and a squeeze of calamansi.','Slide carefully onto your plate and eat immediately.'], tip: 'The runny yolk is the most nutrient-dense state — it keeps choline, Vitamin D, and Vitamin A intact.' },
      { name: 'Egg Muffins (batch cook)', time: '20 min · makes 6', steps: ['Preheat oven to 180°C. Lightly oil a 6-cup muffin tin with olive oil.','Whisk 4 eggs in a bowl with a pinch of salt and turmeric.','Finely chop: 3 tbsp broccoli, 2 cherry tomatoes, handful of spinach.','Divide chopped vegetables evenly between the muffin cups.','Pour whisked egg over the vegetables, filling each cup ¾ full.','Bake 15 minutes until egg is puffed and set.','Cool 2 minutes before removing. Refrigerate up to 4 days.'], tip: 'Grab 2 muffins as a grab-and-go snack. One batch covers 3 days of snacking.' },
    ],
  },
  {
    emoji: '🍗', name: 'Chicken', note: 'Strength & Sprint days only (Mon / Wed / Thu)', protein: '37g per 150g breast',
    methods: [
      { name: 'Chicken Tinola (low-cal)', time: '35 min · serves 2', steps: ['Prepare: 300g skinless chicken breast, 3 slices fresh ginger, 3 garlic cloves (crushed), ½ small onion (sliced), 1 cup green papaya or chayote (cubed), 2 cups malunggay leaves or spinach, 4 cups water, 1 tsp fish sauce.','Add 2 tbsp water to a medium pot. Sauté ginger, garlic, and onion over medium heat — no oil needed.','Add chicken pieces. Seal on all sides for 3–4 minutes.','Pour in 4 cups water. Bring to a boil, then reduce to a simmer.','Add green papaya or chayote. Simmer 12 minutes until tender.','Add fish sauce. Taste and adjust.','Add malunggay or spinach last — cook just 1 minute. Remove from heat immediately.','Serve warm with a squeeze of calamansi.'], tip: 'Drink the broth first — it is the most healing part. Rich in collagen, ginger compounds, and electrolytes.' },
      { name: 'Grilled Calamansi Chicken', time: '25 min (+ 20 min marinate)', steps: ['Butterfly chicken breast: slice horizontally through the middle until almost through, open flat.','Marinate: juice of 4 calamansi, 1 tsp grated ginger, 1 clove garlic (grated), 1 tsp olive oil, pinch of turmeric, pinch of salt. Coat chicken.','Marinate minimum 20 minutes.','Heat a grill pan over medium-high until very hot.','Grill 4 minutes on first side without moving. Flip once. Grill 3–4 minutes more.','Chicken is done when juices run clear when pierced.','Rest 3 minutes before slicing.'], tip: 'Calamansi acts as a natural tenderiser. A butterflied breast cooks in half the time and stays juicy.' },
      { name: 'Ginger-Poached Chicken', time: '22 min · very lean', steps: ['Fill a medium pot with water to submerge the chicken. Add 4 slices ginger and 1 tsp salt.','Bring water to a boil. Add chicken breast.','Reduce heat immediately to the lowest simmer — small bubbles only.','Poach 18 minutes for a 150g breast. Do not lift the lid.','Remove and rest 5 minutes. Shred or slice thin.','Serve with the poaching broth — add calamansi and a few drops of sesame oil.'], tip: 'Poached chicken is the leanest, most digestively gentle preparation. The ginger broth doubles as a warming digestive drink.' },
    ],
  },
  {
    emoji: '🐟', name: 'Fish', note: 'Any day — digests faster than meat', protein: '33g per 150g fillet',
    methods: [
      { name: 'Grilled Turmeric Fish', time: '15 min', steps: ['Pat fish fillet dry with paper towel.','Rub both sides: juice of 2 calamansi, ½ tsp turmeric, 1 tsp grated ginger, pinch of salt, tiny drizzle of olive oil. Let rest 5–10 minutes.','Heat grill pan over high heat until smoking.','For bangus or tanigue fillet: 3–4 minutes first side, 2–3 minutes second side.','Fish is done when it flakes when pressed with a fork.','Do not press down while cooking — this squeezes out the omega-3 oils.'], tip: 'Turmeric turns the fish a beautiful golden colour and adds powerful anti-inflammatory compounds.' },
      { name: 'Ginger-Steamed Fish', time: '12 min', steps: ['Fill a wok or wide pot with 5 cm of water. Bring to a boil. Place a steaming rack inside.','Season fish fillet on both sides with a pinch of salt. Place on a heat-proof plate.','Lay 4–5 thin strips of fresh ginger over the fish.','Place plate on the rack. Cover tightly. Steam 8 minutes for a 150g fillet.','Remove carefully. Discard ginger strips.','Drizzle with a few drops of sesame oil and a squeeze of calamansi.'], tip: 'Steaming keeps all omega-3 fatty acids intact — the cleanest, most nutrient-preserving way to cook fish.' },
      { name: 'Light Fish Broth Soup', time: '18 min', steps: ['Bring 3 cups water to a boil. Add 3 slices ginger, 1 small tomato (quartered), 1 small onion (halved). Simmer 5 minutes.','Add fish fillet and 2 tbsp calamansi juice. Simmer 8 minutes on medium heat.','Add a handful of spinach or pechay in the last 1 minute.','Season with a small pinch of sea salt. Serve with the broth.'], tip: 'The broth provides electrolytes, the fish provides clean protein, and the vegetables complete the nutrients.' },
    ],
  },
  {
    emoji: '🥩', name: 'Lean Beef', note: 'Once per week max — heaviest to digest', protein: '29g per 120g portion',
    methods: [
      { name: 'Ginger Beef Stir-Fry', time: '12 min', steps: ['Slice 120g lean beef very thin against the grain — 3–4mm strips.','Marinate 10 minutes: 1 tbsp coconut aminos, 1 tsp grated ginger, 1 clove garlic (grated), pinch of black pepper.','Heat a pan over very high heat. Add a tiny drizzle of olive oil.','Add beef in a single layer. Cook 60–90 seconds without stirring — let it sear. Toss once, cook 30 more seconds. Remove.','In the same pan, add broccoli and a splash of water. Cook 3 minutes. Return beef, toss, serve immediately.'], tip: 'Thin-sliced, high-heat, very short cook time is the secret to tender lean beef.' },
      { name: 'Grilled Lean Beef', time: '15 min (+ 15 min marinate)', steps: ['Use 120g lean cut: sirloin, tenderloin, or eye of round.','Marinate: juice of 3 calamansi, 1 clove garlic (grated), pinch black pepper, ½ tsp olive oil. 15 minutes minimum.','Heat grill pan over high heat. Grill 3–4 minutes each side for medium.','Rest 4 minutes before slicing — critical. Cutting too soon loses all the juices.','Slice thin against the grain. Serve with a fresh salad.'], tip: 'Eating beef medium (slightly pink) preserves more iron and zinc — both directly support your hormones and skin.' },
    ],
  },
  {
    emoji: '🌾', name: 'Oatmeal', note: 'Pilates & Rest days only · very filling · low GL', protein: '5g per ⅓ cup dry oats',
    methods: [
      { name: 'Classic Warm Oatmeal', time: '8 min', steps: ['Use ⅓ cup rolled oats (not instant).','Add ⅔ cup water to a small pot. Bring to a boil.','Add oats. Reduce heat to medium-low. Stir occasionally for 5 minutes until thick and creamy.','Pour into a bowl. Top with 4–5 thin banana slices and a generous pinch of cinnamon.'], tip: 'Rolled oats have a GL of about 9 — one of the lowest among grain-based foods. Cinnamon lowers the glycemic response further.' },
      { name: 'Overnight Oats', time: '5 min prep · refrigerate overnight', steps: ['In a jar: ⅓ cup rolled oats + ½ cup unsweetened coconut milk + ½ cup water + 1 tbsp chia seeds.','Stir well. Close the lid. Refrigerate overnight (or at least 4 hours).','In the morning, stir well — it will be thick and creamy. Top with papaya or kiwi slices.'], tip: 'The overnight soak converts some starch into resistant starch — lowers glycemic response further and feeds beneficial gut bacteria.' },
    ],
  },
  {
    emoji: '🥣', name: 'Chia Pudding', note: 'Any day · plant omega-3 · extremely filling', protein: '4g per serving + topping protein',
    methods: [
      { name: 'Classic Chia Pudding', time: '5 min prep · 4+ hours rest (overnight ideal)', steps: ['Measure 2 tablespoons of chia seeds into a jar.','Add ½ cup unsweetened coconut milk and ½ cup water. Stir very well for 1 full minute.','After 10 minutes, stir again — this breaks up any clumps.','Cover and refrigerate for at least 4 hours, or overnight.','Before eating, stir again. Top with sliced papaya or kiwi + a small handful of mixed nuts.'], tip: 'Chia seeds expand to 10× their size when soaked, making this one of the most filling light meals possible.' },
      { name: 'Tropical Chia Bowl', time: '5 min prep · 4+ hours rest', steps: ['Make the base: 2 tbsp chia seeds + ½ cup coconut milk + ½ cup water. Stir, rest 10 min, stir again, refrigerate overnight.','Scoop into a wide bowl. Top with: 3 small cubes pineapple, 4 slices kiwi, 1 tbsp unsweetened coconut flakes.'], tip: 'Pineapple bromelain and papaya papain both reduce inflammation. Combining them amplifies the effect.' },
    ],
  },
  {
    emoji: '🥗', name: 'Salad', note: 'Any day · anti-bloat base', protein: 'Depends on toppings',
    methods: [
      { name: 'Anti-Bloat Goddess Salad', time: '8 min', steps: ['Base: 4–5 large lettuce leaves (torn), ½ cucumber (sliced), 1 small tomato (quartered), ¼ bell pepper (thin strips).','Add: ¼ red onion (very thin slices), ½ avocado (cubed), 4–5 thin carrot strips.','Dressing: juice of 2 calamansi + 1 tsp olive oil + pinch salt + crack black pepper. Shake in a small jar.','Drizzle dressing over, toss gently. Eat immediately — dressed salad wilts within 30 minutes.'], tip: 'This combination targets bloating: cucumber and lettuce are diuretic, red onion reduces water retention, avocado provides fat needed to absorb carotenoids.' },
      { name: 'Protein Goddess Salad', time: '10 min', steps: ['Build the Anti-Bloat Goddess Salad base as above.','Add protein: 100g grilled chicken (sliced) OR 100g tuna in water (drained) OR 1 boiled egg (halved, Light Days only).','Add: 1 tbsp sunflower seeds or pumpkin seeds. Use the same calamansi dressing.'], tip: 'Sunflower seeds provide Vitamin E — the fat-soluble vitamin most responsible for skin barrier repair.' },
    ],
  },
  {
    emoji: '🍌', name: 'Fruits', note: 'Banana · Papaya · Kiwi · Pineapple — use strategically', protein: '1–2g per serving',
    methods: [
      { name: 'Fruit Timing Guide', time: 'No prep', steps: ['BANANA (GL 12, just-ripe only): Before strength or sprint training — 45–60 min before workout. Not on rest or pilates days unless in oatmeal.','PAPAYA (GL 9): Best any time, especially morning or 2 PM snack. Papain enzyme actively reduces bloating.','KIWI (GL 5): Lowest glycemic fruit on your list. Best in chia pudding or afternoon snack. Rich in Vitamin C.','PINEAPPLE (GL 6, small serving): Best in chia pudding or post-meal. Keep to 3–4 small cubes.','Rule: Always eat fruit after protein or fat, not alone — this lowers glycemic impact.'], tip: 'These four fruits all contain digestive enzymes (papain, bromelain) that help your gut absorb nutrients from the rest of your meals.' },
      { name: 'Simple Fruit Bowl', time: '5 min', steps: ['Cube: ¼ papaya + 2 kiwi (halved, scooped out) + 2–3 cubes pineapple.','Squeeze a little calamansi over the top. Add a small handful of mixed nuts on the side.','Eat the nuts first, then the fruit — fat before sugar slows glucose absorption.'], tip: 'Calamansi over fruit adds Vitamin C which helps absorb iron from nuts.' },
    ],
  },
];

function Recipes() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🥘 Tap any ingredient to expand it, then choose your preparation method. Each recipe is designed for your body composition goals: low glycemic, high nutrient density, timed to your training schedule.
      </div>
      <div className="ingr-grid">
        {INGREDIENTS.map(ing => <IngredientCard key={ing.name} {...ing} />)}
      </div>
    </>
  );
}

function Snacks() {
  const snackList = [
    { name: '1 Boiled Egg + Cucumber Slices', why: 'Zero glycemic. 6g protein. Eat egg first. Ginger tea alongside reduces afternoon bloating.', timing: 'Any day' },
    { name: 'Kiwi + Small Handful Almonds', why: 'Eat almonds first. Kiwi GL 5 — lowest glycemic fruit. Almonds provide Vitamin E for skin and satiety fat.', timing: 'Any day' },
    { name: 'Small Bowl Papaya + Mixed Nuts', why: 'Eat nuts first. Papaya enzymes support digestion. Fat in nuts lowers glycemic impact. Spearmint tea alongside = hormone support.', timing: 'Any day' },
    { name: 'Tuna (in water) + ½ Avocado + Cucumber', why: 'Eat tuna first. One of the highest protein-to-calorie snacks possible. Avocado fat maintains satiety until 4 PM last meal.', timing: 'Strength & Sprint days' },
    { name: 'Egg Muffins × 2 (batch-cooked Sunday)', why: 'See Recipes for full prep method. Batch-cook 6 on Sunday, eat 2 daily. Pre-portioned, portable, protein-first by design.', timing: 'Any day' },
    { name: 'Chia Pudding (half portion)', why: 'Prep a full batch overnight, eat half at snack time. The chia gel expands in your stomach and keeps you satisfied with very few calories.', timing: 'Pilates & Rest days' },
    { name: 'Pineapple Cubes (small) + Almonds', why: 'Eat almonds first. 3–4 cubes is a serving. Bromelain enzyme reduces afternoon inflammation.', timing: 'Any day' },
    { name: '½ Banana + 5 Walnuts', why: 'Eat walnuts first. Only on days before training. Banana provides pre-workout fuel. Walnuts have the highest omega-3 of any nut.', timing: 'Morning of Strength/Sprint days only' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🍱 Your 2 PM snack bridges lunch and your 4 PM last meal. Always eat the protein or fat component first — this flattens the glycemic response of any carb that follows. Choose one snack per day.
      </div>
      <div className="snack-grid">
        {snackList.map((s, i) => (
          <div key={i} className="snack-card">
            <div className="snack-name">{s.name}</div>
            <div className="snack-why">{s.why}</div>
            <div className="snack-timing">{s.timing}</div>
          </div>
        ))}
      </div>
      <div className="note-box note-rose" style={{ marginTop: 14 }}>
        🚫 Avoid: packaged protein bars, fruit juice, chips, crackers, flavoured yogurt, and any packaged snack with more than 3 ingredients.
      </div>
    </>
  );
}

function FoodGuide() {
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

function Hydration() {
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

const PANELS = { meat: MeatDays, light: LightDays, snacks: Snacks, guide: FoodGuide, hydration: Hydration };

/* ─── Main Component ─── */
export default function Nutrition({ initialTab, onNavigate }) {
  const [detail, setDetail] = useState(initialTab || null);

  // Intercept Cmd+Z / Cmd+H keyboard shortcuts when inside a detail panel
  useEffect(() => {
    if (!detail) return;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        e.stopImmediatePropagation();
        setDetail(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        e.stopImmediatePropagation();
        onNavigate?.('home');
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [detail, onNavigate]);

  if (detail) {
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
