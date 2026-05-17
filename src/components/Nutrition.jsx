import { useState } from 'react';
import RoutineStep from './RoutineStep';

const TABS = [
  { id: 'strength',  label: '🔥 Strength Days' },
  { id: 'pilates',   label: '🧘 Pilates Days' },
  { id: 'sprint',    label: '⚡ Sprint Days' },
  { id: 'rest',      label: '🌸 Rest Days' },
  { id: 'snacks',    label: '🍱 Snacks' },
  { id: 'guide',     label: '🌿 Food Guide' },
  { id: 'hydration', label: '💧 Hydration' },
];

/* ── Strength Days ── */
function StrengthMeals() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔥 Strength days need more protein and a pre-workout carb. Four meals: <strong>7 AM · 11 AM · 2 PM · 4 PM.</strong> Always eat your protein first at every meal. Natural carbs only on these days to refuel muscle glycogen.
      </div>
      <RoutineStep num="1" cat="First Meal — 7 AM · Before Workout" name="Pre-Training Fuel">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ banana + 2 boiled eggs + green tea</div><div className="prod-why">Eat eggs first, then the banana. A just-ripe banana gives slow steady energy without a blood sugar spike. Light enough to digest before training begins.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger-lemon-carrot-beet juice</div><div className="prod-why">Papaya is lighter on the stomach. Beet in the juice has natural nitrates shown to improve blood flow to muscles during training — a genuine performance boost.</div></div></div>
        <div className="step-note"><strong>Juice prep:</strong> Blend 1 small carrot, ¼ raw beet, calamansi juice, thin slice fresh ginger, 200ml water. Strain and drink fresh — do not store.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 11 AM · Post-Workout" name="Protein & Recovery Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Grilled tanigue or bangus + steamed broccoli + ½ cup sweet potato + collagen water</div><div className="prod-why">Eat the fish first. Tanigue and bangus are high-protein and rich in omega-3 to reduce post-training inflammation. Sweet potato GL of 11 vs white rice at 43 — refuels without spiking blood sugar.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Grilled chicken breast + roasted sweet potato + cucumber and tomato salad + collagen water</div><div className="prod-why">Eat the chicken first. Tomatoes with olive oil increase lycopene absorption — lycopene protects skin from UV exposure.</div></div></div>
        <div className="step-note"><strong>Grilling fish:</strong> Rub with calamansi, turmeric, ginger, olive oil. Grill 3–4 min each side. Pull off when it just flakes.<br /><br /><strong>Sweet potato:</strong> Cube, toss with olive oil + cinnamon, roast 200°C for 20–22 min. Cinnamon lowers the glycemic response further.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Snack — 2 PM" name="Mid-Afternoon Protein Snack">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 boiled eggs + cucumber slices + ginger tea</div><div className="prod-why">Eat eggs first. Keeps protein high between meals. Ginger tea at 2 PM reduces afternoon bloating and supports digestion before your last meal.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Tuna (in water) + ½ avocado + cucumber</div><div className="prod-why">Eat the tuna first. Tuna is the leanest, highest-protein snack option. Avocado fat keeps you satisfied until 4 PM.</div></div></div>
      </RoutineStep>
      <RoutineStep num="4" cat="Last Meal — 4 PM · Stop eating after this" name="Light Protein Finish">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 soft-boiled eggs + ½ avocado + steamed pechay + warm chicken broth</div><div className="prod-why">Eat eggs first. Lighter than midday — your body is winding down. Avocado provides Vitamin E for overnight skin repair. Chicken broth supports gut lining and collagen synthesis while you sleep.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small portion grilled chicken or fish + steamed pechay or spinach + ginger tea</div><div className="prod-why">Eat the protein first. Pechay and spinach are near-zero glycemic, rich in magnesium which supports sleep quality and overnight muscle recovery.</div></div></div>
        <div className="step-note"><strong>Chicken broth:</strong> Simmer chicken carcass or wings with ginger and salt for 1–2 hrs. Strain and refrigerate. Keeps 4 days.<br /><br /><strong>After 4 PM:</strong> Chamomile, ginger, or spearmint tea only. No food.</div>
      </RoutineStep>
    </>
  );
}

/* ── Pilates Days ── */
function PilatesMeals() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🧘 Pilates days are lighter training days so meals are lighter. Four meals: <strong>8 AM · 12 PM · 2 PM · 4 PM.</strong> Eggs are your primary protein on these days — lighter than meat and perfectly matched to the session intensity.
      </div>
      <RoutineStep num="1" cat="First Meal — 8 AM" name="Gentle Morning Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 soft-boiled eggs + cucumber slices + green tea</div><div className="prod-why">Eat eggs first. Soft-boiled eggs are the most digestively gentle preparation. Cucumber is hydrating and near-zero glycemic. Light meal — pilates doesn't need heavy pre-workout fuel.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger tea</div><div className="prod-why">Eat the egg first. Papaya contains papain enzyme which actively aids digestion — helpful the day after a heavy strength session.</div></div></div>
        <div className="step-note"><strong>Soft-boiled eggs:</strong> Bring water to full boil. Lower eggs in with a spoon. Boil exactly 6 min. Cold water 2 min. The yolk will be soft in the centre.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 12 PM" name="Light Midday Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 scrambled eggs with tomato and squash + collagen water</div><div className="prod-why">Eat eggs first. Tomatoes GL of 1. Squash GL of 3. Cooking tomatoes briefly in olive oil increases lycopene absorption by 5× — protects skin from UV damage.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">2 poached eggs + small handful of mixed nuts + sliced tomato + collagen water</div><div className="prod-why">Eat eggs first. Poached eggs with no added oil are the lightest preparation. Walnuts contain the highest omega-3 of any nut.</div></div></div>
        <div className="step-note"><strong>Perfect scrambled eggs:</strong> Cold pan, tiny olive oil, low heat. Stir constantly. Remove from heat every 20–30 sec. Done when just barely set. Add turmeric after — turns golden and anti-inflammatory.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Snack — 2 PM" name="Light Afternoon Snack">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Small bowl papaya + small handful mixed nuts + spearmint tea</div><div className="prod-why">Papaya at 2 PM supports afternoon digestion. Spearmint tea at 2 PM reduces androgens that drive sebum — one cup daily makes a visible difference to skin over 6–8 weeks.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Chia pudding with coconut milk + sliced papaya</div><div className="prod-why">Chia provides plant omega-3, fiber, and a very low glycemic load. Coconut milk adds healthy fat to keep you satisfied until 4 PM.</div></div></div>
      </RoutineStep>
      <RoutineStep num="4" cat="Last Meal — 4 PM · Stop eating after this" name="Very Light Finish">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ avocado + small handful mixed nuts + cucumber slices + chamomile tea</div><div className="prod-why">No eggs at this meal — four eggs today is enough protein for a pilates day. Avocado and nuts provide slow-burning fat for a stable evening.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl papaya or fresh tomato slices + mixed nuts + spearmint tea</div><div className="prod-why">Papaya enzymes continue supporting digestion through the evening. Nuts carry you comfortably to the next morning.</div></div></div>
        <div className="step-note"><strong>After 4 PM:</strong> Spearmint tea before bed nightly. One cup over 6–8 weeks makes a visible difference to skin clarity by reducing androgens that drive sebum overproduction.</div>
      </RoutineStep>
    </>
  );
}

/* ── Sprint Days ── */
function SprintMeals() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        ⚡ Sprint days follow the same structure as strength days. Four meals: <strong>7 AM · 11 AM · 2 PM · 4 PM.</strong> Always eat your protein first. Your body needs fuel before and repair after high-intensity work.
      </div>
      <RoutineStep num="1" cat="First Meal — 7 AM · Before Sprints" name="Quick Energy Fuel">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ banana + 2 boiled eggs + green tea</div><div className="prod-why">Eat eggs first, then banana. Half a banana is exactly the right carbohydrate to fuel sprints — enough for explosive energy but not so much you feel heavy. Eat 45–60 min before starting.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger-lemon-carrot-beet juice</div><div className="prod-why">Eat egg first. Papaya is lighter and digests faster than banana. Beet juice provides nitrates that improve blood flow to working muscles during sprint intervals.</div></div></div>
        <div className="step-note">Eat 45–60 min before your session — not right before. Ginger in the juice reduces nausea that can come with high-intensity training.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 11 AM · Post-Sprint" name="Recovery & Rebuild">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Grilled chicken + steamed broccoli + ½ cup sweet potato + collagen water</div><div className="prod-why">Eat chicken first. Sprint training depletes glycogen fast. Chicken repairs muscle, sweet potato replaces glycogen, collagen water repairs connective tissue from the GH spike sprinting produces. Eat within 30–45 min.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Grilled bangus or tanigue + roasted sweet potato + cucumber salad + collagen water</div><div className="prod-why">Eat fish first. Fish digests faster than chicken — ideal post-sprint. Omega-3 in bangus reduces leg soreness so you recover faster.</div></div></div>
      </RoutineStep>
      <RoutineStep num="3" cat="Snack — 2 PM" name="Mid-Afternoon Recovery Snack">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 boiled eggs + cucumber slices + ginger tea</div><div className="prod-why">Eat eggs first. Continues muscle protein repair after the sprint session. Ginger tea reduces systemic inflammation from high-intensity training.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Tuna (in water) + ½ avocado + cucumber</div><div className="prod-why">Eat tuna first. Fast-digesting complete protein. Avocado fat reduces post-sprint cortisol and keeps you satisfied.</div></div></div>
      </RoutineStep>
      <RoutineStep num="4" cat="Last Meal — 4 PM · Stop eating after this" name="Light Evening Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 boiled eggs + ½ avocado + warm chicken broth</div><div className="prod-why">Eat eggs first. A light last meal means digestion finishes before sleep — your body dedicates full energy to muscle repair and the GH release that happens overnight after sprint training.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small grilled fish portion + steamed spinach or pechay + ginger tea</div><div className="prod-why">Eat fish first. Spinach is rich in magnesium which reduces muscle cramping and supports the deep sleep your body needs after hard training.</div></div></div>
        <div className="step-note"><strong>After 4 PM:</strong> Chamomile tea before bed on sprint days meaningfully improves sleep depth — and deeper sleep means more growth hormone, better glute development, and skin repair overnight.</div>
      </RoutineStep>
    </>
  );
}

/* ── Rest Days ── */
function RestMeals() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌸 Rest days need less fuel — no training means lower energy demand. Lighter meals, no pre-workout carbs, protein at every meal. Four meals: <strong>8 AM · 12 PM · 2 PM · 4 PM.</strong>
      </div>
      <RoutineStep num="1" cat="First Meal — 8 AM" name="Gentle Morning Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 soft-boiled eggs + small bowl papaya + green tea</div><div className="prod-why">Eat eggs first. Papaya's papain enzyme actively aids digestion and reduces overnight bloating. A gentle start to a recovery day.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">2 boiled eggs + cucumber slices + sliced tomato + green tea</div><div className="prod-why">Eat eggs first. Zero glycemic. Tomato and cucumber add micronutrients without adding any glycemic load on a non-training day.</div></div></div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 12 PM" name="Light Midday Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Grilled chicken or fish + steamed broccoli or pechay + collagen water</div><div className="prod-why">Eat the protein first. No sweet potato or banana today — rest days don't need carb refuelling. Collagen water supports skin and joint repair on recovery days.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">2 scrambled eggs with spinach and tomato + collagen water</div><div className="prod-why">Eat eggs first. Lighter protein source for a lighter day. Spinach magnesium supports ongoing muscle repair from the week's training.</div></div></div>
      </RoutineStep>
      <RoutineStep num="3" cat="Snack — 2 PM" name="Gentle Afternoon Snack">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ avocado + mixed nuts + ginger tea</div><div className="prod-why">Healthy fats and minerals without adding carbs. Ginger tea reduces any residual gut inflammation from the week's training load.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small handful mixed nuts + 2 boiled eggs + spearmint tea</div><div className="prod-why">Eat eggs first. Complete protein snack. Spearmint tea at this time supports hormonal balance and reduces excess androgens over time.</div></div></div>
      </RoutineStep>
      <RoutineStep num="4" cat="Last Meal — 4 PM · Stop eating after this" name="Light Evening Finish">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Small bowl papaya + mixed nuts + chamomile tea</div><div className="prod-why">Lightest last meal of the week. Papaya enzymes continue supporting digestion. Chamomile before bed meaningfully improves sleep depth — essential for full weekly recovery.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">½ avocado + cucumber slices + warm chicken broth</div><div className="prod-why">Chicken broth on rest days supports gut healing, joint recovery, and collagen synthesis overnight without adding significant calories.</div></div></div>
        <div className="step-note"><strong>After 4 PM:</strong> Chamomile or ginger tea only. Rest days are an important time to let your digestive system fully rest and your gut lining repair. No food after 4 PM.</div>
      </RoutineStep>
    </>
  );
}

/* ── Snacks ── */
function Snacks() {
  const snackList = [
    { name: '2 Boiled Eggs + Cucumber', why: 'The most protein-dense, zero-glycemic snack possible. Eat the eggs first. Works on any training day.', timing: 'Strength · Sprint · Rest days' },
    { name: 'Tuna (in water) + ½ Avocado', why: 'Eat tuna first. Extremely high protein-to-calorie ratio. Avocado fat blunts hunger for 2+ hours.', timing: 'Strength · Sprint days' },
    { name: 'Mixed Nuts + Papaya', why: 'Walnuts provide omega-3, papaya provides papain enzyme and Vitamin C. Zero cooking required.', timing: 'Pilates · Rest days' },
    { name: 'Egg Muffins (batch-cook Sunday)', why: '4–6 eggs whisked with chopped broccoli, tomato, and spinach. Pour into muffin tin. Bake 180°C for 15 min. Grab 2–3 as your snack. Refrigerate up to 4 days.', timing: 'Any day' },
    { name: 'Chicken Lettuce Wraps', why: 'Leftover grilled chicken + lettuce leaf + cucumber + calamansi squeeze. All protein, near-zero carbs. Takes 2 minutes with batch-cooked chicken.', timing: 'Strength · Sprint days' },
    { name: 'Sweet Potato Energy Bites', why: 'Mash ¼ cup cooked sweet potato + 1 tbsp almond butter + cinnamon. Roll into balls. High natural carb — only on strength or sprint days when you need extra energy.', timing: 'Strength · Sprint days only' },
    { name: 'Chia Pudding with Coconut Milk + Papaya', why: 'Mix 2 tbsp chia seeds with ½ cup coconut milk. Refrigerate overnight. Top with sliced papaya. Plant omega-3, slow-release energy, excellent gut fiber.', timing: 'Pilates · Rest days' },
    { name: 'Avocado + Cucumber + Calamansi', why: 'Mash ½ avocado with calamansi squeeze and a pinch of sea salt. Eat with sliced cucumber. Healthy fat that supports hormone synthesis and skin barrier.', timing: 'Any day' },
  ];

  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🍱 Your 2 PM snack bridges the gap between lunch (11 AM or 12 PM) and your last meal (4 PM). Always eat protein first even at snack time. These options are all low-glycemic, quick to prepare, and aligned with your specific goals.
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
        🚫 Snacks to avoid: packaged protein bars (added sugar and fillers), fruit juice, chips, crackers, yogurt, flavoured nuts, and anything from a packet with more than 3 ingredients. These spike blood sugar, cause bloating, and undo your progress.
      </div>
    </>
  );
}

/* ── Food Guide ── */
function FoodGuide() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌿 Glycemic load (GL) tells you how much a food actually raises your blood sugar in a normal portion. Low GL = slow steady energy, less fat storage, less inflammation, clearer skin. Always eat protein first to blunt the glycemic response of any carb that follows.
      </div>
      <RoutineStep num="🥩" cat="Proteins · GL Zero · Eat at Every Meal" name="Core Proteins">
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Eggs — boiled, poached, or scrambled</div><div className="prod-why">Zero glycemic. Complete protein. Choline for brain health, Vitamin D for skin, biotin for hair. Most affordable and versatile protein. Always eat first.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Bangus, tanigue, tilapia, tuna</div><div className="prod-why">Zero glycemic, high protein, rich in omega-3. Grill, steam, or pan-sear only. No frying.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Chicken breast — grilled or poached</div><div className="prod-why">Zero glycemic, highest protein-to-fat ratio of any meat. Marinate in calamansi, ginger, and olive oil to keep it moist. Best on strength and sprint days.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Lean beef — small portions</div><div className="prod-why">Zero glycemic, rich in zinc and iron. Supports skin clarity, hormone production, and red blood cell health. Use 2–3 times per week on strength days.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🥦" cat="Vegetables · Near-Zero GL · Eat Freely" name="Core Vegetables">
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Broccoli — steam 5–6 min exactly, drizzle olive oil and calamansi</div><div className="prod-why">Sulforaphane reduces systemic inflammation. Vitamin C boosts collagen repair after training. Bright green and slightly firm = nutrients intact.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Cucumber — eat raw with a squeeze of calamansi</div><div className="prod-why">95% water. Silica supports skin elasticity. Near-zero glycemic. Eat as much as you want — this is a free food.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Tomato — raw in salads, or warmed briefly in olive oil</div><div className="prod-why">Cooking in olive oil increases lycopene absorption by 5×. Lycopene protects skin from UV damage and reduces pore size over time.</div></div></div>
        <div className="prod-item"><div className="prod-badge">3</div><div><div className="prod-name">Squash / Kalabasa — steam 10 min or sauté with garlic</div><div className="prod-why">Rich in beta-carotene which converts to Vitamin A — same compound as retinol, but from food.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Pechay and spinach — sauté 2–3 min only in garlic and olive oil</div><div className="prod-why">Magnesium for sleep and recovery. Iron for energy and hormone health.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🍠" cat="Natural Carbs · Active Days Only · Low GL" name="Training Day Carbs">
        <div className="prod-item"><div className="prod-badge">11</div><div><div className="prod-name">Sweet potato — steamed, roasted, or boiled</div><div className="prod-why">GL of 11 vs white rice at 43. Slow steady energy without a blood sugar spike. A pinch of cinnamon when roasting drops the GL further. Strength and sprint days only.</div></div></div>
        <div className="prod-item"><div className="prod-badge">12</div><div><div className="prod-name">Banana — just-ripe only (yellow, no brown spots)</div><div className="prod-why">A just-ripe banana has more resistant starch. Use only on strength and sprint days, not pilates or rest days.</div></div></div>
        <div className="prod-item"><div className="prod-badge">9</div><div><div className="prod-name">Papaya — fresh, not overripe</div><div className="prod-why">One of the lowest glycemic tropical fruits. GL of 9. Contains papain enzyme which aids digestion and reduces post-meal bloating. Can be used on all days.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🥑" cat="Healthy Fats · GL Zero · Daily" name="Core Fats">
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Avocado — half per serving, eaten fresh</div><div className="prod-why">Zero glycemic. Monounsaturated fat supports hormone production, skin barrier, and absorption of fat-soluble vitamins. Mash with calamansi and a pinch of salt.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Mixed nuts — almonds, walnuts, cashews (small handful)</div><div className="prod-why">Walnuts contain the highest omega-3 of any nut. A small handful of 15–20 nuts is one serving. Eat raw and unsalted.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Extra virgin olive oil — drizzle on everything</div><div className="prod-why">Anti-inflammatory, supports hormone synthesis, makes fat-soluble vitamins in vegetables absorbable. One teaspoon per meal is enough.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🌿" cat="Anti-Inflammatory Superfoods · Use Daily" name="The Daily Essentials">
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Fresh ginger — in tea, in juice, grated into cooking</div><div className="prod-why">Gingerol is one of the most potent natural anti-inflammatory compounds. Reduces gut inflammation, muscle soreness, skin redness, and nausea. Use a thumb-sized piece daily.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Turmeric — pinch in eggs, broth, or marinades</div><div className="prod-why">Curcumin reduces systemic inflammation. Always pair with black pepper — increases curcumin absorption by up to 2000%.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Calamansi — squeeze on everything</div><div className="prod-why">High Vitamin C drives collagen synthesis in skin and muscle. Alkalises the body after protein-heavy meals, improves iron absorption from leafy greens.</div></div></div>
      </RoutineStep>
    </>
  );
}

/* ── Hydration ── */
function Hydration() {
  const rows = [
    { time: 'On waking', d: '500ml warm water + fresh calamansi squeeze', n: 'Flushes overnight waste, delivers Vitamin C before your first meal, activates digestion gently' },
    { time: 'Morning', d: 'Green tea — 1 to 2 cups, unsweetened', n: 'EGCG reduces sebum and pore congestion. On strength/sprint days, add ginger-lemon-carrot-beet juice alongside for training performance' },
    { time: 'With meals', d: 'Collagen peptides dissolved in 300ml water', n: 'Take with a meal containing Vitamin C for maximum absorption. Collagen builds skin, joints, and gut lining simultaneously' },
    { time: 'All day', d: 'Plain water — sip steadily throughout the day', n: 'Sip slowly and consistently rather than gulping large amounts. Gulping swallows air and causes bloating' },
    { time: '2 PM snack time', d: 'Ginger tea or spearmint tea', n: 'Ginger tea reduces afternoon gut inflammation. Spearmint tea at this time lowers androgens that drive sebum — one cup daily for 6–8 weeks makes a visible skin difference' },
    { time: 'After 4 PM', d: 'Chamomile, ginger, or spearmint tea', n: 'Chamomile lowers cortisol before sleep. Ginger reduces gut gas. No food — only these teas until bed' },
  ];

  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💧 What you drink matters as much as what you eat. These drinks are all zero or near-zero glycemic and actively support your skin, training, and hormones.
      </div>
      <div className="g-card" style={{ marginBottom: 14 }}>
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
      <div className="note-box note-rose">
        ✕ Avoid completely: sugary drinks, milk, carbonated drinks, flavoured water, store-bought juices, and alcohol. All spike blood sugar, worsen skin inflammation, cause bloating, and disrupt hormones.
      </div>
    </>
  );
}

const PANELS = { strength: StrengthMeals, pilates: PilatesMeals, sprint: SprintMeals, rest: RestMeals, snacks: Snacks, guide: FoodGuide, hydration: Hydration };

export default function Nutrition({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'strength');
  const Panel = PANELS[activeTab];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Fuel Protocol</div>
        <h2 className="s-title">Nutrition <em>&amp; Meals</em></h2>
        <p className="s-desc">Four meals a day. Always eat protein first. Last meal by 4 PM. Low glycemic load throughout. Meals change depending on your training day.</p>
      </div>

      <div className="note-box note-gold splash-item" style={{ marginBottom: 8 }}>
        ⏱️ <strong>The 4-hour gap rule:</strong> Waiting 4 hours between meals allows your stomach to fully empty and digestive enzymes to reset. This reduces bloating, improves nutrient absorption, and keeps blood sugar stable all day.
      </div>

      <div className="calorie-banner splash-item">
        <div className="cal-block">
          <div className="cal-phase">Months 1–3 · Calorie Deficit</div>
          <div className="cal-number">~1,450 cal/day</div>
          <div className="cal-note">BMR 1,178 · TDEE 1,826 · 20% deficit for lean composition</div>
        </div>
        <div className="cal-divider" />
        <div className="cal-block">
          <div className="cal-phase">Months 4–12 · Maintenance</div>
          <div className="cal-number">~1,800 cal/day</div>
          <div className="cal-note">Full TDEE — sustain body composition, support training performance</div>
        </div>
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
