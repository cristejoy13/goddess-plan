import { useState } from 'react';

const TABS = [
  { id: 'meat',      label: '🔥 Strength & Sprint Days' },
  { id: 'light',     label: '🌿 Pilates & Rest Days' },
  { id: 'recipes',   label: '🥘 Ingredients & Recipes' },
  { id: 'snacks',    label: '🍱 Snacks' },
  { id: 'guide',     label: '📊 Food Guide' },
  { id: 'hydration', label: '💧 Hydration' },
];

/* ─── Ingredient Card Component ─── */
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
              <button
                key={i}
                className={`ingr-method-btn${activeMethod === i ? ' active' : ''}`}
                onClick={() => setActiveMethod(i)}
              >
                {m.name}
              </button>
            ))}
          </div>
          <div className="ingr-recipe">
            <div className="ingr-recipe-time">⏱ {methods[activeMethod].time}</div>
            <ol className="ingr-steps">
              {methods[activeMethod].steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            {methods[activeMethod].tip && (
              <div className="ingr-tip">💡 {methods[activeMethod].tip}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MEAT DAYS: Strength A (Mon), Sprint (Wed), Strength B (Thu) ─── */
function MeatDays() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔥 <strong>Meat days: Monday, Wednesday, Thursday.</strong> Your body needs heavier fuel on the days it works hardest. Chicken, fish, and lean beef on these 3 days. Always eat protein first. Four meals — last one by 4 PM.
      </div>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        💡 <strong>Should you eat meat every day?</strong> No — and this is intentional. Your digestive system processes meat slowly (2–5 hours). Eating it only on heavy training days means your gut is never overworked, your body fully absorbs the protein it receives, and your lighter days feel genuinely lighter. Fish is the exception — it digests in under 2 hours and can be eaten any day if you prefer.
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
              <div className="hyd-n">½ banana + 1 boiled egg + green tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; small bowl oatmeal + green tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; small bowl papaya + 1 boiled egg + ginger tea</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">11:00 AM</div>
            <div>
              <div className="hyd-d">Meal 2 — Main protein meal (post-workout)</div>
              <div className="hyd-n">Eat protein first. Grilled chicken 150g or fish 150g or lean beef 120g + steamed squash or broccoli + ½ cup sweet potato (strength/sprint days only) + collagen water</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Snack — Light & low glycemic</div>
              <div className="hyd-n">1 boiled egg + cucumber slices + ginger tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; kiwi + small handful almonds &nbsp;·&nbsp; OR &nbsp;·&nbsp; small bowl papaya + mixed nuts</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">4:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Light protein finish · No food after this</div>
              <div className="hyd-n">Grilled fish 120g + salad (lettuce, cucumber, tomato, bell pepper, avocado) &nbsp;·&nbsp; OR &nbsp;·&nbsp; chicken 100g + steamed pechay &nbsp;·&nbsp; OR &nbsp;·&nbsp; 1 boiled egg + avocado + warm chicken broth</div>
            </div>
          </div>
        </div>
      </div>

      <div className="note-box note-rose">
        🥩 <strong>Protein target for body recomposition at 48 kg:</strong> 77–96g protein per day on training days. Chicken breast 150g = 37g · Fish 150g = 33g · Lean beef 120g = 29g · 1 egg = 6g. Two meals with protein easily hits your target.
      </div>
    </>
  );
}

/* ─── LIGHT DAYS: Pilates (Tue/Fri) + Rest (Sat/Sun) ─── */
function LightDays() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌿 <strong>Light days: Tuesday, Friday, Saturday, Sunday.</strong> No heavy meat. Max 2 eggs for the whole day. Your digestive system gets real rest, your gut lining repairs, and you arrive at Monday feeling genuinely fresh rather than already digesting something.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 18 }}>
        <div className="hyd-timeline">
          <div className="hyd-row">
            <div className="hyd-time">8:00 AM</div>
            <div>
              <div className="hyd-d">Meal 1 — Gentle morning meal</div>
              <div className="hyd-n">Chia pudding + papaya slices + green tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; warm oatmeal + sliced banana + cinnamon &nbsp;·&nbsp; OR &nbsp;·&nbsp; 1 boiled egg + small bowl papaya + ginger tea</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">12:00 PM</div>
            <div>
              <div className="hyd-d">Meal 2 — Light midday meal</div>
              <div className="hyd-n">1 scrambled egg + large salad (lettuce, tomato, cucumber, bell pepper, avocado) + collagen water &nbsp;·&nbsp; OR &nbsp;·&nbsp; chia pudding + kiwi + mixed nuts &nbsp;·&nbsp; OR &nbsp;·&nbsp; oatmeal + pineapple slices + nuts</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">2:00 PM</div>
            <div>
              <div className="hyd-d">Snack — Fruit and fat</div>
              <div className="hyd-n">Kiwi + small handful mixed nuts &nbsp;·&nbsp; OR &nbsp;·&nbsp; small bowl papaya + spearmint tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; half pineapple ring + almonds</div>
            </div>
          </div>
          <div className="hyd-row">
            <div className="hyd-time">4:00 PM</div>
            <div>
              <div className="hyd-d">Last Meal — Very light finish · No food after this</div>
              <div className="hyd-n">Salad + avocado + 1 boiled egg + chamomile tea &nbsp;·&nbsp; OR &nbsp;·&nbsp; chia pudding + kiwi slices &nbsp;·&nbsp; OR &nbsp;·&nbsp; oatmeal (plain) + papaya + chamomile tea</div>
            </div>
          </div>
        </div>
      </div>

      <div className="note-box note-rose">
        🌸 Light days are not cheat days or punishment days — they are intentional digestive rest. Your gut processes and repairs, inflammation drops, and you absorb nutrients from meat days more effectively. This cycle is part of the plan, not a compromise.
      </div>
    </>
  );
}

/* ─── RECIPES ─── */
const INGREDIENTS = [
  {
    emoji: '🥚',
    name: 'Eggs',
    note: 'Maximum 2 per day total',
    protein: '6g per egg',
    methods: [
      {
        name: 'Soft-Boiled',
        time: '6 min total',
        steps: [
          'Bring a small pot of water to a full rolling boil.',
          'Lower eggs in gently with a spoon — do not drop them.',
          'Boil exactly 6 minutes — set a timer.',
          'Transfer immediately to a bowl of cold water for 2 minutes.',
          'Peel from the wide end. The yolk will be soft and creamy in the centre.',
          'Eat immediately — soft-boiled eggs do not keep well.',
        ],
        tip: 'The most digestible egg preparation. The slightly soft yolk keeps more bioavailable nutrients than fully cooked yolk.',
      },
      {
        name: 'Scrambled with Turmeric',
        time: '8 min total',
        steps: [
          'Crack 2 eggs into a bowl. Do not whisk yet — let them sit 1 minute.',
          'Heat a small pan over medium-low heat. Add a tiny drizzle of olive oil.',
          'Whisk eggs lightly and pour into pan.',
          'Use a silicone spatula to stir constantly in figure-8 motions.',
          'Remove pan from heat every 20–30 seconds while stirring — this prevents rubbery texture.',
          'When eggs are just barely set and still slightly glossy, remove from heat.',
          'Add a pinch of turmeric and a crack of black pepper. Stir gently. The heat of the eggs blooms the turmeric perfectly.',
        ],
        tip: 'Always add turmeric after removing from heat — heat above 100°C degrades some of its anti-inflammatory compounds.',
      },
      {
        name: 'Sunny-Side Up',
        time: '5 min total',
        steps: [
          'Heat a small pan over medium-low heat. Add a tiny drop of olive oil.',
          'Crack egg at the edge of the pan, lower in gently to avoid breaking the yolk.',
          'Place a lid over the pan to trap steam — this cooks the white without flipping.',
          'Cook 2–3 minutes until white is fully set but yolk is still completely liquid.',
          'Season with a crack of black pepper and a squeeze of calamansi.',
          'Slide carefully onto your plate and eat immediately.',
        ],
        tip: 'The runny yolk is the most nutrient-dense state — it keeps choline, Vitamin D, and Vitamin A intact.',
      },
      {
        name: 'Egg Muffins (batch cook)',
        time: '20 min · makes 6',
        steps: [
          'Preheat oven to 180°C. Lightly oil a 6-cup muffin tin with olive oil.',
          'Whisk 4 eggs in a bowl with a pinch of salt and turmeric.',
          'Finely chop: 3 tbsp broccoli, 2 cherry tomatoes, handful of spinach.',
          'Divide chopped vegetables evenly between the muffin cups.',
          'Pour whisked egg over the vegetables, filling each cup ¾ full.',
          'Bake 15 minutes until egg is puffed and set. Golden edges are perfect.',
          'Cool 2 minutes before removing. Refrigerate up to 4 days.',
        ],
        tip: 'Grab 2 muffins as a grab-and-go snack or meal. One batch covers 3 days of snacking.',
      },
    ],
  },
  {
    emoji: '🍗',
    name: 'Chicken',
    note: 'Strength & Sprint days only (Mon / Wed / Thu)',
    protein: '37g per 150g breast',
    methods: [
      {
        name: 'Chicken Tinola (low-cal)',
        time: '35 min · serves 2',
        steps: [
          'Prepare ingredients: 300g skinless chicken breast (cut into pieces), 3 slices fresh ginger (thumb-sized), 3 garlic cloves (crushed), ½ small onion (sliced), 1 cup green papaya or chayote (peeled, cubed), 2 cups malunggay leaves or spinach, 4 cups water, 1 tsp fish sauce, pinch of salt.',
          'Add 2 tbsp water to a medium pot. Sauté ginger, garlic, and onion in the water over medium heat until fragrant — no oil needed. Add more water by the tablespoon if it dries.',
          'Add chicken pieces. Let them seal on all sides for 3–4 minutes, stirring occasionally.',
          'Pour in 4 cups water. Bring to a boil, then reduce to a simmer.',
          'Add green papaya or chayote. Simmer 12 minutes until tender.',
          'Add fish sauce. Taste and adjust with a pinch of salt if needed.',
          'Add malunggay or spinach last — cook just 1 minute. Remove from heat immediately to keep the leaves bright green.',
          'Serve warm with a squeeze of calamansi into the broth.',
        ],
        tip: 'Drink the broth first — it is the most healing part of this dish. Rich in collagen, ginger compounds, and electrolytes. The malunggay is one of the most nutrient-dense greens available in the Philippines.',
      },
      {
        name: 'Grilled Calamansi Chicken',
        time: '25 min (+ 20 min marinate)',
        steps: [
          'Butterfly chicken breast: place on board, slice horizontally through the middle until almost through, open flat. This ensures even cooking and prevents drying.',
          'Marinate: juice of 4 calamansi, 1 tsp grated fresh ginger, 1 clove garlic (grated), 1 tsp olive oil, pinch of turmeric, pinch of salt. Mix and coat the chicken.',
          'Marinate minimum 20 minutes. Longer is better — up to 2 hours in the fridge.',
          'Heat a grill pan over medium-high until very hot. Do not add oil to the pan.',
          'Grill chicken 4 minutes on the first side without moving it. A good crust only forms if you leave it alone.',
          'Flip once. Grill 3–4 minutes more. Chicken is done when juices run clear when pierced.',
          'Rest 3 minutes before slicing — this keeps all the juices inside.',
        ],
        tip: 'The calamansi acts as a natural tenderiser. A butterflied breast cooks in nearly half the time and stays juicy throughout.',
      },
      {
        name: 'Ginger-Poached Chicken',
        time: '22 min · very lean',
        steps: [
          'Fill a medium pot with enough water to submerge the chicken breast. Add 4 thick slices of fresh ginger and 1 tsp salt.',
          'Bring water to a boil. Add chicken breast.',
          'Reduce heat immediately to the lowest simmer — small bubbles only. Hard boiling makes chicken dry and tough.',
          'Poach 18 minutes for a standard 150g breast. Do not lift the lid.',
          'Remove chicken and rest 5 minutes. The inside should be completely white and moist.',
          'Shred with two forks or slice thin.',
          'Serve with the poaching broth as a light soup — add a squeeze of calamansi and a few drops of sesame oil to the broth.',
        ],
        tip: 'Poached chicken is the leanest, most digestively gentle way to eat chicken. The ginger broth doubles as a warming digestive drink.',
      },
    ],
  },
  {
    emoji: '🐟',
    name: 'Fish',
    note: 'Any day — digests faster than meat',
    protein: '33g per 150g fillet',
    methods: [
      {
        name: 'Grilled Turmeric Fish',
        time: '15 min',
        steps: [
          'Pat fish fillet dry with paper towel. Moisture = steaming, not grilling.',
          'Rub both sides with: juice of 2 calamansi, ½ tsp turmeric, 1 tsp grated ginger, pinch of salt, tiny drizzle of olive oil.',
          'Let rest 5–10 minutes while your pan heats.',
          'Heat grill pan over high heat until smoking. Place fish away from you.',
          'For bangus or tanigue fillet: 3–4 minutes on first side, 2–3 minutes on the second. Fish is done when it flakes when pressed with a fork.',
          'Do not press down on the fish while cooking — this squeezes out the omega-3 oils.',
          'Serve with a fresh calamansi squeeze.',
        ],
        tip: 'Turmeric turns the fish a beautiful golden colour and adds powerful anti-inflammatory compounds. Pair with broccoli and sweet potato for a complete post-workout meal.',
      },
      {
        name: 'Ginger-Steamed Fish',
        time: '12 min',
        steps: [
          'Fill a wok or wide pot with 5 cm of water. Bring to a boil. Place a steaming rack or heat-proof plate holder inside.',
          'Season fish fillet on both sides with a pinch of salt. Place on a heat-proof plate.',
          'Lay 4–5 thin strips of fresh ginger over the fish.',
          'Place plate on the rack inside the wok. Cover tightly with a lid.',
          'Steam over medium-high heat: 8 minutes for a 150g fillet, 10 minutes for thicker cuts.',
          'Remove carefully. Discard the ginger strips.',
          'Drizzle with a few drops of sesame oil and a squeeze of calamansi.',
        ],
        tip: 'Steaming keeps all omega-3 fatty acids intact — no heat degradation like high-heat grilling. The cleanest, most nutrient-preserving way to cook fish.',
      },
      {
        name: 'Light Fish Broth Soup',
        time: '18 min',
        steps: [
          'Bring 3 cups water to a boil in a medium pot. Add: 3 slices ginger, 1 small tomato (quartered), 1 small onion (halved).',
          'Simmer 5 minutes to develop the broth.',
          'Add fish fillet (whole or in large chunks). Add 2 tbsp calamansi juice or fresh tamarind pulp for a light sour note.',
          'Simmer 8 minutes on medium heat. Do not boil hard — it breaks up the fish.',
          'Add a handful of spinach or pechay in the last 1 minute.',
          'Season with a small pinch of sea salt. Taste and adjust.',
          'Serve with the broth — drink it like a soup. It is full of minerals and natural collagen from the fish.',
        ],
        tip: 'This is your lightest complete meal option. The broth provides electrolytes, the fish provides clean protein, and the vegetables complete the nutrients.',
      },
    ],
  },
  {
    emoji: '🥩',
    name: 'Lean Beef',
    note: 'Once per week max — heaviest to digest',
    protein: '29g per 120g portion',
    methods: [
      {
        name: 'Ginger Beef Stir-Fry',
        time: '12 min',
        steps: [
          'Slice 120g lean beef (sirloin or tenderloin) very thin against the grain — 3–4mm strips. Thin slices cook in seconds and stay tender.',
          'Marinate 10 minutes: 1 tbsp coconut aminos (instead of soy sauce — lower sodium, gluten-free), 1 tsp grated ginger, 1 clove garlic (grated), tiny pinch of black pepper.',
          'Heat a pan over very high heat. Add a tiny drizzle of olive oil.',
          'Add beef in a single layer. Cook 60–90 seconds without stirring — let it sear.',
          'Toss once and cook 30 more seconds. Remove beef and set aside.',
          'In the same pan, add broccoli and a splash of water. Cook 3 minutes.',
          'Return beef to pan, toss everything together, serve immediately.',
        ],
        tip: 'Thin-sliced, high-heat, very short cook time is the secret to tender lean beef. Overcooking lean beef even by 1–2 minutes makes it tough.',
      },
      {
        name: 'Beef and Squash Soup',
        time: '40 min',
        steps: [
          'Cut 120g lean beef into small cubes. Cube 1 cup kalabasa (squash).',
          'Sauté ginger, garlic, and onion in a pot with 2 tbsp water until fragrant.',
          'Add beef cubes. Seal on all sides for 3 minutes.',
          'Add 3 cups water. Bring to a boil. Skim any foam that rises.',
          'Reduce to simmer. Add squash, a pinch of salt, and a splash of fish sauce.',
          'Simmer 25–30 minutes until squash is tender and broth is flavourful.',
          'Add spinach in the last 1 minute. Finish with a squeeze of calamansi.',
        ],
        tip: 'Kalabasa (squash) has a GL of only 3 and is rich in beta-carotene. This soup provides collagen from simmering the beef, potassium, and anti-inflammatory compounds in a single bowl.',
      },
      {
        name: 'Grilled Lean Beef',
        time: '15 min (+ 15 min marinate)',
        steps: [
          'Use a 120g lean cut: sirloin, tenderloin, or eye of round — these are the lowest fat options.',
          'Marinate: juice of 3 calamansi, 1 clove garlic (grated), pinch of black pepper, ½ tsp olive oil. Marinate 15 minutes minimum.',
          'Heat grill pan over high heat. Very hot pan = good sear, not stewing.',
          'Grill 3–4 minutes on each side for medium (slightly pink inside).',
          'Rest 4 minutes before slicing — critical step. Cutting too soon loses all the juices.',
          'Slice thin against the grain.',
          'Serve with a fresh salad and warm broth.',
        ],
        tip: 'Eating beef medium (slightly pink) rather than well-done preserves more iron and zinc — the two nutrients in beef that most directly support your hormones and skin.',
      },
    ],
  },
  {
    emoji: '🌾',
    name: 'Oatmeal',
    note: 'Pilates & Rest days only · very filling · low GL',
    protein: '5g per ⅓ cup dry oats',
    methods: [
      {
        name: 'Classic Warm Oatmeal',
        time: '8 min',
        steps: [
          'Use ⅓ cup rolled oats (not instant — they spike blood sugar more).',
          'Add ⅔ cup water to a small pot. Bring to a boil.',
          'Add oats. Reduce heat to medium-low.',
          'Stir occasionally for 5 minutes until thick and creamy.',
          'Pour into a bowl. Top with: 4–5 thin banana slices and a generous pinch of cinnamon.',
          'Eat while warm. The cinnamon lowers the glycemic response of the oats.',
        ],
        tip: 'Rolled oats have a GL of about 9 — one of the lowest among grain-based foods. On Pilates and rest days, this is filling enough to carry you 4 hours without a blood sugar crash.',
      },
      {
        name: 'Overnight Oats',
        time: '5 min prep · refrigerate overnight',
        steps: [
          'In a jar or sealed container: ⅓ cup rolled oats.',
          'Add ½ cup unsweetened coconut milk and ½ cup water.',
          'Add 1 tbsp chia seeds — these thicken the mixture and add plant omega-3.',
          'Stir well. Close the lid.',
          'Refrigerate overnight (or at least 4 hours).',
          'In the morning, stir well — it will be thick and creamy.',
          'Top with papaya or kiwi slices. Eat cold.',
        ],
        tip: 'The overnight soak converts some of the oat starch into resistant starch — this lowers the glycemic response further and feeds beneficial gut bacteria.',
      },
      {
        name: 'Oat Porridge with Papaya',
        time: '10 min',
        steps: [
          'Blend ¼ cup ripe papaya with ¼ cup water until smooth.',
          'In a small pot: ⅓ cup rolled oats + ½ cup water. Bring to a low boil.',
          'Add the blended papaya during the last 2 minutes of cooking. Stir through.',
          'The papain enzyme in papaya slightly pre-digests the oats — making them lighter on your stomach.',
          'Pour into a bowl. Add a pinch of cinnamon.',
          'Optional: top with 2–3 fresh kiwi slices for Vitamin C.',
        ],
        tip: 'This version is gentler on digestion than plain oatmeal thanks to the papain enzyme. Best choice for rest days when your gut needs maximum recovery.',
      },
    ],
  },
  {
    emoji: '🥣',
    name: 'Chia Pudding',
    note: 'Any day · plant omega-3 · extremely filling',
    protein: '4g per serving + topping protein',
    methods: [
      {
        name: 'Classic Chia Pudding',
        time: '5 min prep · 4+ hours rest (overnight ideal)',
        steps: [
          'Measure 2 tablespoons of chia seeds into a jar or glass.',
          'Add ½ cup unsweetened coconut milk and ½ cup water. Stir very well for 1 full minute.',
          'After 10 minutes, stir again — this breaks up any clumps that form as the seeds absorb liquid.',
          'Cover and refrigerate for at least 4 hours, or overnight.',
          'Before eating, stir again. The texture should be thick and gel-like.',
          'Top with: sliced papaya or kiwi + a small handful of mixed nuts.',
          'Eat cold, straight from the jar.',
        ],
        tip: 'Chia seeds expand to 10× their size when soaked, making this one of the most filling light meals possible. The gel they form also slows digestion and glucose absorption — keeping blood sugar very stable for 4 hours.',
      },
      {
        name: 'Tropical Chia Bowl',
        time: '5 min prep · 4+ hours rest',
        steps: [
          'Make the base: 2 tbsp chia seeds + ½ cup coconut milk + ½ cup water. Stir, let rest 10 min, stir again, refrigerate overnight.',
          'The next day, scoop into a wide bowl.',
          'Top with: 3 small cubes of pineapple, 4 slices of kiwi, 1 tbsp unsweetened coconut flakes.',
          'Drizzle a tiny amount of raw honey if you want sweetness (only on maintenance phase, not deficit phase).',
          'Pineapple contains bromelain enzyme which aids digestion similarly to papain.',
        ],
        tip: 'Bromelain in pineapple and papain in papaya both reduce inflammation and support digestion from the inside. Combining them amplifies both effects.',
      },
      {
        name: 'Banana Chia Pudding',
        time: '5 min prep · 4+ hours rest',
        steps: [
          'Mash ½ very ripe banana in a jar with a fork until smooth.',
          'Add 2 tbsp chia seeds. Mix into the banana paste.',
          'Add ½ cup coconut milk. Stir well until banana is fully incorporated.',
          'Let rest 10 min, stir again to break clumps, refrigerate overnight.',
          'The banana thickens and sweetens the pudding naturally — no added sugar needed.',
          'Top with a few fresh kiwi slices for Vitamin C.',
        ],
        tip: 'Best for strength or sprint day mornings — the banana provides a slow-release carb that prepares your body for training. The chia keeps you fuelled for hours.',
      },
    ],
  },
  {
    emoji: '🥗',
    name: 'Salad',
    note: 'Any day · builds on your base of cucumber, tomato, lettuce, bell pepper',
    protein: 'Depends on toppings',
    methods: [
      {
        name: 'Anti-Bloat Goddess Salad',
        time: '8 min',
        steps: [
          'Base: 4–5 large lettuce leaves (torn), ½ cucumber (sliced), 1 small tomato (quartered), ¼ bell pepper (any colour, thin strips).',
          'Add: ¼ red onion (very thin slices) — red onion contains quercetin, a powerful anti-inflammatory.',
          'Add: ½ avocado (cubed) — healthy fat for hormone support.',
          'Add: 4–5 thin carrot strips — beta-carotene for skin.',
          'Dressing: juice of 2 calamansi + 1 tsp olive oil + pinch of salt + crack of black pepper. Shake in a small jar.',
          'Drizzle dressing over, toss gently. Eat immediately — dressed salad wilts within 30 minutes.',
        ],
        tip: 'This exact combination targets bloating specifically: cucumber and lettuce are diuretic, red onion reduces water retention, and avocado provides the fat needed to absorb carotenoids from the carrots and tomatoes.',
      },
      {
        name: 'Protein Goddess Salad (Meat Days)',
        time: '10 min',
        steps: [
          'Build the Anti-Bloat Goddess Salad base as above.',
          'Add protein: 100g grilled chicken (sliced) OR 100g tuna in water (drained) OR 1 boiled egg (halved, Light Days only).',
          'Add: 1 tbsp sunflower seeds or pumpkin seeds — zinc for oil gland regulation and skin clarity.',
          'Add: 4–5 fresh basil leaves if available — fragrant, anti-inflammatory.',
          'Use the same calamansi dressing. Add a tiny pinch of dried chili flakes if you like heat.',
        ],
        tip: 'Sunflower seeds provide Vitamin E — the fat-soluble vitamin most responsible for skin barrier repair. Eating them in salad with olive oil maximises absorption.',
      },
      {
        name: 'Anti-Inflammatory Warm Salad',
        time: '12 min',
        steps: [
          'Steam: 5–6 small broccoli florets and ½ cup cubed squash for 6 minutes.',
          'Combine in a bowl while warm: steamed broccoli + squash + raw cucumber + cherry tomatoes + a handful of spinach leaves.',
          'The warmth from the broccoli and squash slightly wilts the spinach — perfect texture.',
          'Dressing: 1 tsp olive oil + juice of 2 calamansi + ¼ tsp turmeric + pinch of black pepper + pinch of salt.',
          'Toss gently and serve immediately.',
          'Optional: add 1 tbsp grated fresh ginger to the dressing for extra anti-inflammatory power.',
        ],
        tip: 'Warm salads are easier on the stomach than cold ones for some people. The turmeric in the dressing coats all the vegetables, and eating it with olive oil ensures maximum absorption.',
      },
    ],
  },
  {
    emoji: '🍌',
    name: 'Bananas, Papaya, Kiwi & Pineapple',
    note: 'Low glycemic tropical fruits · use strategically',
    protein: '1–2g per serving',
    methods: [
      {
        name: 'Fruit Timing Guide',
        time: 'No prep',
        steps: [
          'BANANA (GL 12, just-ripe only): Best before strength or sprint training — provides slow fuel for high-intensity work. Eat 45–60 min before workout. Not on rest or pilates days unless in oatmeal.',
          'PAPAYA (GL 9): Best any time, especially morning or 2 PM snack. Contains papain enzyme that actively reduces bloating and aids digestion. One of the lowest-glycemic tropical fruits.',
          'KIWI (GL 5): The lowest glycemic fruit on your list. Best in chia pudding or afternoon snack. Rich in Vitamin C (higher than oranges per gram) — directly drives collagen synthesis.',
          'PINEAPPLE (GL 6, small serving): Best in chia pudding or post-meal. Contains bromelain enzyme that reduces inflammation. Keep portions to 3–4 small cubes — a little goes far.',
          'Rule: Always eat fruit after protein or fat, not alone — this further lowers the glycemic impact and prevents blood sugar spikes.',
        ],
        tip: 'These four fruits are strategic choices — they all contain digestive enzymes (papain, bromelain) that actually help your gut absorb nutrients from the rest of your meals.',
      },
      {
        name: 'Simple Fruit Bowl',
        time: '5 min',
        steps: [
          'Cube: ¼ papaya + 2 kiwi (halved, scooped out) + 2–3 cubes pineapple.',
          'Arrange in a bowl. Squeeze a little calamansi over the top.',
          'Add a small handful of mixed nuts on the side.',
          'Eat the nuts first, then the fruit — fat before sugar slows glucose absorption.',
          'Best as your 2 PM snack on light days.',
        ],
        tip: 'Calamansi over fruit adds Vitamin C which helps absorb the iron from nuts. The combination also reduces the glycemic impact of the naturally sweet fruits.',
      },
      {
        name: 'Frozen Banana Treat',
        time: '5 min prep · freeze overnight',
        steps: [
          'Peel a just-ripe banana. Slice into coins.',
          'Lay flat on a plate or small tray lined with baking paper.',
          'Freeze overnight.',
          'Once frozen, transfer to a sealed bag.',
          'Eat 4–5 frozen banana coins as a cold treat — naturally sweet, creamy when half-thawed.',
          'This is your dessert substitute during the deficit phase. Satisfies sweet cravings without added sugar.',
        ],
        tip: 'Freezing banana increases its resistant starch content — the same property as slightly underripe bananas. This makes frozen banana lower glycemic than eating a fresh ripe one. Best eaten on strength training days.',
      },
    ],
  },
];

function Recipes() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 18 }}>
        🥘 Tap any ingredient to expand it, then choose your preparation method. Each recipe is designed for your body composition goals: low glycemic, high nutrient density, and timed to your training schedule.
      </div>
      <div className="ingr-grid">
        {INGREDIENTS.map(ing => (
          <IngredientCard key={ing.name} {...ing} />
        ))}
      </div>
    </>
  );
}

/* ─── SNACKS ─── */
function Snacks() {
  const snackList = [
    { name: '1 Boiled Egg + Cucumber Slices', why: 'Always eat the egg first. Zero glycemic. 6g protein. Ginger tea alongside reduces afternoon bloating.', timing: 'Any day' },
    { name: 'Kiwi + Small Handful Almonds', why: 'Eat almonds first. Kiwi GL of 5 — the lowest glycemic fruit on your list. Almonds provide Vitamin E for skin and satiety fat.', timing: 'Any day' },
    { name: 'Small Bowl Papaya + Mixed Nuts', why: 'Eat nuts first. Papaya enzymes support digestion. The fat in nuts lowers the glycemic impact of the papaya. Spearmint tea alongside = hormone support.', timing: 'Any day' },
    { name: 'Tuna (in water) + ½ Avocado + Cucumber', why: 'Eat the tuna first. One of the highest protein-to-calorie snacks possible. Avocado fat maintains satiety until your last meal at 4 PM. Best on meat days.', timing: 'Strength & Sprint days' },
    { name: 'Egg Muffins × 2 (batch-cooked Sunday)', why: 'See Recipes tab for full prep method. Batch-cook 6 on Sunday, eat 2 as your daily snack. Pre-portioned, portable, protein-first by design.', timing: 'Any day' },
    { name: 'Chia Pudding (half portion)', why: 'Prep a full batch overnight, eat half at a snack time. The chia gel expands in your stomach and keeps you satisfied with very few calories. Best on light days.', timing: 'Pilates & Rest days' },
    { name: 'Pineapple Cubes (small) + Almonds', why: 'Eat almonds first. 3–4 pineapple cubes is a serving. Bromelain enzyme in pineapple reduces afternoon inflammation. Keep portions small — pineapple is naturally sweet.', timing: 'Any day' },
    { name: '½ Banana + 5 Walnuts', why: 'Eat walnuts first. Only on days before training (strength or sprint). Banana provides pre-workout fuel. Walnuts provide the highest omega-3 of any nut.', timing: 'Morning of Strength / Sprint days only' },
  ];

  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🍱 Your 2 PM snack bridges the gap between lunch and your 4 PM last meal. Always eat the protein or fat component first — this flattens the glycemic response of any carb that follows. Choose one snack per day.
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
        🚫 Avoid: packaged protein bars, fruit juice, chips, crackers, flavoured yogurt, and any packaged snack with more than 3 ingredients. These all spike blood sugar, cause bloating, and undo your daily progress.
      </div>
    </>
  );
}

/* ─── FOOD GUIDE ─── */
function FoodGuide() {
  const rows = [
    { food: 'Sweet potato (roasted)', gl: 11, note: 'Best training-day carb. Add cinnamon to lower GL further. One serving = ½ cup cubed.' },
    { food: 'Oatmeal (rolled oats)', gl: 9, note: 'Best rest/pilates day carb. Overnight soaking reduces GL by converting starch to resistant starch.' },
    { food: 'Banana (just-ripe)', gl: 12, note: 'Strength and sprint days only. Just-ripe = more resistant starch than overripe.' },
    { food: 'Papaya', gl: 9, note: 'All days. Contains papain enzyme that reduces bloating. One of the most anti-inflammatory fruits.' },
    { food: 'Kiwi', gl: 5, note: 'All days. Highest Vitamin C of any common fruit per gram — direct collagen synthesis support.' },
    { food: 'Pineapple', gl: 6, note: 'Small portions only. Bromelain enzyme reduces inflammation. 3–4 small cubes is one serving.' },
    { food: 'Broccoli', gl: 1, note: 'Eat freely. Sulforaphane is the most potent vegetable anti-inflammatory. Steam 5–6 min exactly.' },
    { food: 'Cucumber', gl: 1, note: 'Eat freely. 95% water, silica for skin elasticity. Free food — no limit.' },
    { food: 'Squash / kalabasa', gl: 3, note: 'Eat freely on light days. Beta-carotene = food-form Vitamin A for skin and hormones.' },
    { food: 'Tomato', gl: 1, note: 'Eat freely. Cook in olive oil to increase lycopene absorption 5×.' },
    { food: 'Avocado', gl: 0, note: 'Eat daily. Essential for hormone synthesis and fat-soluble vitamin absorption. ½ per serving.' },
    { food: 'Eggs (2 max/day)', gl: 0, note: 'Every day. Complete protein, choline for brain, Vitamin D for skin. Always eat protein first.' },
    { food: 'Chicken breast 150g', gl: 0, note: 'Strength & sprint days. Leanest complete protein. 37g protein per serving.' },
    { food: 'Fish (bangus/tanigue)', gl: 0, note: 'Any day. Digests in under 2 hours. Omega-3 reduces post-training inflammation and skin redness.' },
    { food: 'Lean beef 120g', gl: 0, note: 'Once per week max. Rich in zinc and iron — both directly support hormones and skin clarity.' },
    { food: 'Mixed nuts', gl: 0, note: 'Daily, small handful. Walnuts highest omega-3. Almonds highest Vitamin E. Always eat first.' },
    { food: 'Chia seeds', gl: 1, note: 'Daily in pudding. Expand 10× in stomach. Plant omega-3, fiber, extremely filling for few calories.' },
    { food: 'White rice', gl: 43, note: 'AVOID. Spikes blood sugar immediately. Replaced by sweet potato on training days.' },
    { food: 'Bread / pandesal', gl: 47, note: 'AVOID. Among the highest glycemic foods. Causes immediate water retention and bloating.' },
  ];

  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        📊 Glycemic Load (GL) = how much a food actually raises your blood sugar in a real-world portion. This is more useful than Glycemic Index because it accounts for portion size. Low GL = stable blood sugar, less fat storage, less inflammation, clearer skin.
      </div>
      <div className="g-card splash-item" style={{ overflowX: 'auto' }}>
        <table className="fancy-table" style={{ width: '100%' }}>
          <thead>
            <tr><th>Food</th><th>GL</th><th>Notes</th></tr>
          </thead>
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

/* ─── HYDRATION ─── */
function Hydration() {
  const rows = [
    { time: 'On waking', d: '500ml warm water + fresh calamansi squeeze', n: 'Flushes overnight waste, delivers Vitamin C before your first meal, activates digestion gently. Non-negotiable daily habit.' },
    { time: 'With Meal 1', d: 'Green tea — 1 cup, unsweetened', n: 'EGCG in green tea reduces sebum production — directly addresses oily pores. Also a mild energy boost without cortisol spike.' },
    { time: 'With Meal 2', d: 'Collagen peptides in 300ml water', n: 'Take with Vitamin C source (calamansi on your meal) for maximum absorption. Builds skin, joints, and gut lining simultaneously.' },
    { time: '2 PM snack', d: 'Ginger tea or spearmint tea', n: 'Ginger reduces afternoon gut inflammation. Spearmint lowers androgens that drive sebum — one cup daily over 6–8 weeks creates visible skin improvement.' },
    { time: 'All day', d: 'Plain water — sip continuously, 2–2.5L total', n: 'Sip slowly throughout the day rather than gulping. Gulping swallows air and causes bloating. Consistent hydration reduces facial puffiness significantly.' },
    { time: 'After 4 PM', d: 'Chamomile, ginger, or spearmint tea only', n: 'No food. Chamomile lowers cortisol before sleep. Ginger reduces gut gas. These teas are your evening companions until bed.' },
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
              <div>
                <div className="hyd-d">{r.d}</div>
                <div className="hyd-n">{r.n}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="note-box note-rose" style={{ marginTop: 14 }}>
        ✕ Avoid completely: sugary drinks, milk, carbonated drinks, store-bought juices, flavoured water, and alcohol. All spike blood sugar, worsen skin inflammation, cause bloating, and disrupt hormones.
      </div>
    </>
  );
}

const PANELS = { meat: MeatDays, light: LightDays, recipes: Recipes, snacks: Snacks, guide: FoodGuide, hydration: Hydration };

export default function Nutrition({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'meat');
  const Panel = PANELS[activeTab];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Fuel Protocol · Body Recomposition</div>
        <h2 className="s-title">Nutrition <em>&amp; Recipes</em></h2>
        <p className="s-desc">Four meals a day · last meal by 4 PM · always eat protein first · meat on heavy training days only · your gut deserves rest too.</p>
      </div>

      <div className="sk-tabs splash-item">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`sk-tab${activeTab === t.id ? ' active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Panel />
    </div>
  );
}
