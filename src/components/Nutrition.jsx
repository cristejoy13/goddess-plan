import { useState } from 'react';
import RoutineStep from './RoutineStep';

const TABS = [
  { id: 'strength', label: '🔥 Strength Days' },
  { id: 'pilates',  label: '🧘 Pilates Days' },
  { id: 'sprint',   label: '⚡ Sprint Days' },
  { id: 'guide',    label: '🌿 Food Guide' },
  { id: 'hydration',label: '💧 Hydration' },
];

/* ── Strength Days ── */
function StrengthMeals() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🔥 Strength days need more protein. Three meals with 4-hour gaps: <strong>7–8 AM · 11 AM–12 PM · 3–4 PM.</strong> Carbs only from natural sources — sweet potato, banana, papaya — on these days to refuel muscle glycogen.
      </div>
      <RoutineStep num="1" cat="First Meal — 7 to 8 AM · Before Workout" name="Pre-Training Fuel">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ banana + 2 boiled eggs + green tea</div><div className="prod-why">A just-ripe banana gives slow steady energy without a blood sugar spike. Eggs provide complete protein. Light enough to digest before training begins.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger-lemon-carrot-beet juice</div><div className="prod-why">Papaya is lighter on the stomach. The beet in the juice has natural nitrates shown to improve blood flow to muscles during training — a genuine performance boost.</div></div></div>
        <div className="step-note"><strong>Juice prep:</strong> Blend 1 small carrot, ¼ raw beet, calamansi juice, thin slice fresh ginger, 200ml water. Strain and drink fresh — do not store.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 11 AM to 12 PM · Post Workout" name="Protein & Recovery Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Grilled tanigue or bangus + steamed broccoli + ½ cup sweet potato + collagen water</div><div className="prod-why">Tanigue and bangus are high-protein, rich in omega-3 to reduce post-training inflammation. Sweet potato GL of 11 vs white rice at 43 — refuels without spiking blood sugar. Broccoli provides Vitamin C for collagen repair.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Grilled chicken breast + roasted sweet potato + cucumber and tomato salad + collagen water</div><div className="prod-why">Chicken breast is the leanest complete protein. Tomatoes with olive oil increase lycopene absorption — lycopene protects skin from UV exposure.</div></div></div>
        <div className="step-note"><strong>Grilling fish:</strong> Rub with calamansi, turmeric, ginger, olive oil. Rest 10 min. Grill 3–4 min each side. Pull off when it just flakes — overcooking dries it out.<br /><br /><strong>Sweet potato:</strong> Cube, toss with olive oil + cinnamon, roast 200°C for 20–22 min until golden. Cinnamon lowers the glycemic response further.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Meal — 3 to 4 PM · Last Meal of the Day" name="Light Protein Finish">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 soft-boiled eggs + ½ avocado + cucumber slices + warm bone broth</div><div className="prod-why">Lighter than midday — your body is winding down. Avocado provides Vitamin E for overnight skin repair. Bone broth supports gut lining and collagen synthesis while you sleep.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small portion grilled chicken or fish + steamed pechay or spinach + bone broth</div><div className="prod-why">Pechay and spinach are near-zero glycemic, rich in magnesium which supports sleep quality and overnight muscle recovery.</div></div></div>
        <div className="step-note"><strong>Bone broth (Sunday batch):</strong> Roast bones 200°C / 20 min, transfer to pot, cover with water, add ginger + salt. Simmer 2–4 hrs. Strain, refrigerate. Keeps 5 days.<br /><br /><strong>After 4 PM:</strong> Chamomile, ginger, or spearmint tea only.</div>
      </RoutineStep>
    </>
  );
}

/* ── Pilates Days ── */
function PilatesMeals() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🧘 Pilates days are lighter training days so meals are lighter. Three meals with 4-hour gaps: <strong>8 AM · 12 PM · 4 PM.</strong>
      </div>
      <RoutineStep num="1" cat="First Meal — 8 AM" name="Gentle Morning Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 soft-boiled eggs + cucumber slices + green tea</div><div className="prod-why">Soft-boiled eggs are the most digestively gentle preparation. Cucumber is hydrating and near-zero glycemic. Light meal — pilates doesn't need heavy pre-workout fuel.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger tea</div><div className="prod-why">Papaya contains papain enzyme which actively aids digestion — helpful the day after a heavy strength session.</div></div></div>
        <div className="step-note"><strong>Soft-boiled eggs:</strong> Bring water to full boil. Lower eggs in with a spoon. Boil exactly 6 min. Cold water 2 min. The yolk will be soft in the centre — the most satisfying and digestible preparation.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 12 PM" name="Light Midday Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 scrambled eggs with tomato and squash + collagen water</div><div className="prod-why">Tomatoes GL of 1. Squash GL of 3. Cooking tomatoes briefly in olive oil increases lycopene absorption by 5× — protects skin from UV damage and pore enlargement.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">2 poached eggs + small handful of mixed nuts + sliced tomato + collagen water</div><div className="prod-why">Poached eggs with no added oil are the lightest preparation. Walnuts contain the highest omega-3 of any nut — good for recovery and skin.</div></div></div>
        <div className="step-note"><strong>Perfect scrambled eggs:</strong> Cold pan, tiny olive oil, low heat. Stir constantly with spatula. Remove from heat every 20–30 sec. Done when just barely set and slightly glossy. Add turmeric after — turns golden and anti-inflammatory.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Meal — 4 PM · Last Meal of the Day" name="Very Light Finish">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ avocado + small handful of nuts + cucumber slices + warm bone broth</div><div className="prod-why">No eggs at this meal — four eggs today is enough protein for a pilates day. Avocado and nuts provide slow-burning fat for a stable evening.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya or fresh tomato slices + mixed nuts + ginger tea</div><div className="prod-why">Papaya enzymes continue supporting digestion through the evening. Nuts carry you comfortably to the next morning.</div></div></div>
        <div className="step-note"><strong>After 4 PM:</strong> Spearmint tea before bed. One cup nightly over 6–8 weeks makes a visible difference to skin clarity by reducing androgens that drive sebum overproduction.</div>
      </RoutineStep>
    </>
  );
}

/* ── Sprint Days ── */
function SprintMeals() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        ⚡ Sprint days follow the same structure as strength days. Three meals with 4-hour gaps: <strong>7–8 AM · 11 AM–12 PM · 3–4 PM.</strong>
      </div>
      <RoutineStep num="1" cat="First Meal — 7 to 8 AM · Before Sprints" name="Quick Energy Fuel">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">½ banana + 2 boiled eggs + green tea</div><div className="prod-why">A half banana is exactly the right carbohydrate to fuel sprints — enough for explosive energy but not so much you feel heavy. Eat 45–60 min before starting.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small bowl of papaya + 1 boiled egg + ginger-lemon-carrot-beet juice</div><div className="prod-why">Papaya is lighter and digests faster than banana. Beet juice provides nitrates that improve blood flow to working muscles during sprint intervals.</div></div></div>
        <div className="step-note">Eat 45–60 min before your session — not right before. Ginger in the juice reduces nausea that can come with high-intensity training.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Meal — 11 AM to 12 PM · Post Sprint" name="Recovery & Rebuild">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">Grilled chicken + steamed broccoli + ½ cup sweet potato + collagen water</div><div className="prod-why">Sprint training depletes glycogen fast. Chicken repairs muscle, sweet potato replaces glycogen, collagen water repairs connective tissue from the GH spike sprinting produces. Eat within 30–45 min of finishing.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Grilled bangus or tanigue + roasted sweet potato + cucumber salad + collagen water</div><div className="prod-why">Fish digests faster than chicken — ideal post-sprint. Omega-3 in bangus reduces leg soreness so you recover faster and can train hard again sooner.</div></div></div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Meal — 3 to 4 PM · Last Meal of the Day" name="Light Evening Meal">
        <div className="prod-item"><div className="prod-badge">A</div><div><div className="prod-name">2 boiled eggs + ½ avocado + warm bone broth</div><div className="prod-why">Light and complete. A light last meal means digestion finishes before sleep — your body dedicates full energy to muscle repair and the GH release that happens overnight after sprint training.</div></div></div>
        <div className="prod-item"><div className="prod-badge">B</div><div><div className="prod-name">Small grilled fish portion + steamed spinach or pechay + bone broth</div><div className="prod-why">Spinach is rich in magnesium which reduces muscle cramping and supports the deep sleep your body needs after hard training.</div></div></div>
        <div className="step-note"><strong>After 4 PM:</strong> Chamomile before bed on sprint days meaningfully improves sleep depth — and deeper sleep means more growth hormone, better glute development, and skin repair.</div>
      </RoutineStep>
    </>
  );
}

/* ── Food Guide ── */
function FoodGuide() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🌿 Glycemic load (GL) tells you how much a food actually raises your blood sugar in a normal portion. Low GL = slow steady energy, less fat storage, less inflammation, clearer skin.
      </div>
      <RoutineStep num="🥩" cat="Proteins · GL Zero · Eat at Every Meal" name="Core Proteins">
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Eggs — boiled, poached, or scrambled</div><div className="prod-why">Zero glycemic. Complete protein. Choline for brain health, Vitamin D for skin, biotin for hair. Most affordable and versatile protein in the Philippines.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Bangus, tanigue, tilapia, tuna</div><div className="prod-why">Zero glycemic, high protein, rich in omega-3. Grill, steam, or pan-sear only. No frying.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Chicken breast — grilled or poached</div><div className="prod-why">Zero glycemic, highest protein-to-fat ratio of any meat. Marinate in calamansi, ginger, and olive oil to keep it moist.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Lean beef — small portions</div><div className="prod-why">Zero glycemic, rich in zinc and iron. Both support skin clarity, hormone production, and red blood cell health. Use 2–3 times per week.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🥦" cat="Vegetables · Near-Zero GL · Eat Freely" name="Core Vegetables">
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Broccoli — steam 5–6 min exactly, drizzle olive oil and calamansi</div><div className="prod-why">Sulforaphane reduces systemic inflammation. Vitamin C boosts collagen repair after training. Bright green and slightly firm = nutrients intact.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Cucumber — eat raw with a squeeze of calamansi</div><div className="prod-why">95% water. Silica supports skin elasticity. Near-zero glycemic. Eat as much as you want — this is a free food.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Tomato — raw in salads, or warmed briefly in olive oil</div><div className="prod-why">Cooking in olive oil increases lycopene absorption by 5×. Lycopene protects skin from UV damage and reduces pore size over time.</div></div></div>
        <div className="prod-item"><div className="prod-badge">3</div><div><div className="prod-name">Squash / Kalabasa — steam 10 min or sauté with garlic</div><div className="prod-why">Rich in beta-carotene which converts to Vitamin A — same compound as retinol, but from food.</div></div></div>
        <div className="prod-item"><div className="prod-badge">1</div><div><div className="prod-name">Pechay and spinach — sauté 2–3 min only in garlic and olive oil</div><div className="prod-why">Magnesium for sleep and recovery. Iron for energy and hormone health. Two minutes is genuinely all it needs.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🍠" cat="Natural Carbs · Active Days Only · Low GL" name="Training Day Carbs">
        <div className="prod-item"><div className="prod-badge">11</div><div><div className="prod-name">Sweet potato — steamed, roasted, or boiled</div><div className="prod-why">GL of 11 vs white rice at 43. Provides slow steady energy without a blood sugar spike. A pinch of cinnamon when roasting drops the GL further still.</div></div></div>
        <div className="prod-item"><div className="prod-badge">12</div><div><div className="prod-name">Banana — just-ripe only (yellow, no brown spots)</div><div className="prod-why">A just-ripe banana has significantly more resistant starch. Use only on strength and sprint days, not pilates days.</div></div></div>
        <div className="prod-item"><div className="prod-badge">9</div><div><div className="prod-name">Papaya — fresh, not overripe</div><div className="prod-why">One of the lowest glycemic tropical fruits. GL of 9. Contains papain enzyme which aids digestion and reduces post-meal bloating.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🥑" cat="Healthy Fats · GL Zero · Daily" name="Core Fats">
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Avocado — half per serving, eaten fresh</div><div className="prod-why">Zero glycemic. Monounsaturated fat supports hormone production, skin barrier, and absorption of fat-soluble vitamins. Mash with calamansi and a pinch of salt.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Mixed nuts — almonds, walnuts, cashews (small handful)</div><div className="prod-why">Walnuts contain the highest omega-3 of any nut. A small handful of 15–20 nuts is one serving. Eat raw and unsalted.</div></div></div>
        <div className="prod-item"><div className="prod-badge">0</div><div><div className="prod-name">Extra virgin olive oil — drizzle on everything</div><div className="prod-why">Anti-inflammatory, supports hormone synthesis, makes fat-soluble vitamins in your vegetables absorbable. One teaspoon per meal is enough.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🌿" cat="Anti-Inflammatory Superfoods · Use Daily" name="The Daily Essentials">
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Fresh ginger — in tea, in juice, grated into cooking</div><div className="prod-why">Gingerol is one of the most potent natural anti-inflammatory compounds. Reduces gut inflammation, muscle soreness, skin redness, and nausea during training. Use a thumb-sized piece daily.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Turmeric — pinch in eggs, broth, or marinades</div><div className="prod-why">Curcumin reduces systemic inflammation. Always pair with black pepper — increases curcumin absorption by up to 2000%.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Calamansi — squeeze on everything</div><div className="prod-why">High Vitamin C drives collagen synthesis in both skin and muscle. Alkalises the body after protein-heavy meals, improves iron absorption from leafy greens.</div></div></div>
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
    { time: 'After 4 PM', d: 'Chamomile, ginger, or spearmint tea', n: 'Chamomile lowers cortisol before sleep. Ginger reduces gut gas. Spearmint reduces androgens that drive sebum — one cup nightly makes a visible skin difference over 6–8 weeks' },
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

const PANELS = { strength: StrengthMeals, pilates: PilatesMeals, sprint: SprintMeals, guide: FoodGuide, hydration: Hydration };

export default function Nutrition() {
  const [activeTab, setActiveTab] = useState('strength');
  const Panel = PANELS[activeTab];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Fuel Protocol</div>
        <h2 className="s-title">Nutrition <em>&amp; Meals</em></h2>
        <p className="s-desc">Three meals a day. Four hours between each meal. Last meal by 4 PM. Low glycemic load throughout. Meals change depending on your training day.</p>
      </div>

      <div className="note-box note-gold splash-item" style={{ marginBottom: 20 }}>
        ⏱️ <strong>The 4-hour gap rule:</strong> Waiting 4 hours between meals allows your stomach to fully empty and digestive enzymes to reset. This reduces bloating, improves nutrient absorption, and keeps blood sugar stable all day.
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
