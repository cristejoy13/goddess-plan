import { useState } from 'react';
import RoutineStep from './RoutineStep';

const TABS = [
  { id: 'am',        label: '☀️ Morning Routine' },
  { id: 'pm',        label: '🌙 Night Routine' },
  { id: 'weekly',    label: '💎 Weekly Treatments' },
  { id: 'lifestyle', label: '🌿 Lifestyle & Food' },
  { id: 'retinoid',  label: '✨ Retinoid Roadmap' },
];

function AM() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ☀️ Morning goal: gently cleanse, hydrate, protect. Do NOT over-strip your skin in the morning — your barrier is already reactive. SPF is non-negotiable for pore minimising and preventing dark spots.
      </div>
      <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Low pH Good Morning Gel Cleanser</div><div className="prod-why">pH 5.0 — matches your skin's natural acid mantle. Cleanses without stripping. Specifically formulated to not disrupt the barrier that your redness-prone skin needs intact.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Beauty of Joseon Relief Foam Cleanser (Rice + Probiotics)</div><div className="prod-why">Super gentle rice foam. Excellent for reactive skin with redness — calms while it cleanses. Great AM option when skin feels sensitive.</div></div></div>
        <div className="step-note">Lukewarm water only — never hot. Hot water breaks down the skin barrier and worsens redness. 30 seconds, light pressure, pat dry.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Some By Mi Yuja Niacin Brightening Toner</div><div className="prod-why">Niacinamide is the #1 ingredient for visible pore minimising. It regulates sebum production, reduces redness, and brightens uneven tone. Your most important AM active.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">COSRX AHA/BHA Clarifying Treatment Toner</div><div className="prod-why">Willow bark BHA gently exfoliates inside the pore. Use 3–4× per week as your AM toner — alternate with the niacinamide toner.</div></div></div>
        <div className="step-note">Pat in gently with clean fingertips. Never rub. Niacinamide takes 4–8 weeks of daily use to visibly shrink pores — commit to it.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Advanced Snail 96 Mucin Power Essence</div><div className="prod-why">Snail secretion filtrate repairs the skin barrier, addresses reactive redness, speeds up texture healing, and adds hydration without greasiness. One of the most researched ingredients in Korean skincare.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Missha Time Revolution First Treatment Essence</div><div className="prod-why">Fermented niacinamide essence — enhances all subsequent products and visibly improves skin clarity and luminosity over time.</div></div></div>
        <div className="step-note">Press into skin with both palms warmly. 3–5 gentle pats. This is the step that gives Korean skin its signature glass-like glow over time.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Some By Mi Galactomyces Pure Vitamin C Glow Serum</div><div className="prod-why">Vitamin C brightens post-pimple marks, protects against UV damage, and gradually fades uneven pigmentation. Use 4–5× per week in the morning.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Beauty of Joseon Glow Serum (Propolis + Niacinamide)</div><div className="prod-why">If Vitamin C irritates at first, this is the gentler alternative. Propolis calms redness and bumps while niacinamide works on pores simultaneously.</div></div></div>
        <div className="step-note">Start with the Joseon serum for Month 1 while your barrier strengthens. Introduce Vitamin C in Month 2.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Oil-Free Ultra Moisturizing Lotion (with Birch Sap)</div><div className="prod-why">Lightweight, non-comedogenic — will not clog the pores you are trying to clear. Birch sap hydrates without heaviness. Perfect for your skin type.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Etude Soon Jung 2x Barrier Intensive Cream</div><div className="prod-why">For reactive or sensitised skin days. Panthenol repairs the barrier and stops the redness cycle.</div></div></div>
        <div className="step-note">Apply while skin is still slightly damp from essence — locks hydration in far better than applying to dry skin.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Final Step — Never Ever Skip ☀️" name="Sunscreen SPF 50+ PA++++">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Beauty of Joseon Relief Sun: Rice + Probiotics SPF 50+</div><div className="prod-why">Specifically formulated for reactive, sensitive skin. Probiotics calm inflammation. Rice brightens. Zero white cast. Legendary in Korean skincare for a reason.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Round Lab Birch Juice Moisturizing Sun Cream SPF 50+</div><div className="prod-why">Deeply hydrating sunscreen that doubles as a moisturiser. Especially good for days when you want minimal layering.</div></div></div>
        <div className="step-note">⚠️ UV exposure directly enlarges pores, worsens redness, creates texture, and prevents all your actives from working. Apply generously. Reapply every 2 hours outdoors.</div>
      </RoutineStep>
    </>
  );
}

function PM() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌙 Night goal: deeply cleanse the day off, exfoliate congestion, repair the barrier. Night is when skin regenerates — this is when everything that matters actually happens.
      </div>
      <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Banila Co Clean It Zero Cleansing Balm (Purifying)</div><div className="prod-why">The Purifying version contains BHA to help decongest pores while removing SPF and pollution. Dissolves sebum plugs that cause texture.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">DHC Deep Cleansing Oil</div><div className="prod-why">Olive-based oil cleanser. Excellent at pulling out oil-based congestion inside pores — oil dissolves oil.</div></div></div>
        <div className="step-note">Apply to completely DRY skin. Massage 60–90 sec including around nose and chin. Emulsify with water until milky, then rinse. Do not skip this step.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Low pH Good Morning Gel Cleanser</div><div className="prod-why">Removes all remaining oil cleanser residue. Keeps skin at the correct pH for all subsequent products to absorb and work properly.</div></div></div>
        <div className="step-note">Double cleansing done consistently every night will visibly improve pore congestion and texture within 3–4 weeks. It is the #1 Korean skincare principle.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Some By Mi AHA BHA PHA 30 Days Miracle Toner</div><div className="prod-why">BHA (salicylic acid) is oil-soluble — it penetrates inside the pore and dissolves the congestion causing your texture and bumps from the inside. Use 3–4 nights per week.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Paula's Choice 2% BHA Liquid Exfoliant</div><div className="prod-why">The gold standard BHA worldwide. If you can access it, this is the most effective single product for pores and texture that exists.</div></div></div>
        <div className="step-note">Start 2× per week for the first month to let your barrier adjust. Build to 3–4×. On other nights, use a hydrating toner only.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Advanced Snail 96 Mucin Power Essence</div><div className="prod-why">After BHA exfoliation, the skin needs repair immediately. Snail mucin heals micro-damage, reduces redness that comes after active use, and accelerates skin cell regeneration overnight.</div></div></div>
        <div className="step-note">Especially important on BHA nights. It calms the skin down and ensures you wake up glowing, not irritated.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Rotate Weekly" name="Treatment Rotation">
        <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner (Some By Mi or Paula's Choice)</div><div className="prod-why">Core exfoliation nights — clears congestion and pores.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum (Some By Mi 10%)</div><div className="prod-why">Pore-minimising and barrier-strengthening on non-exfoliation nights.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% (The Inkey List Retinol Serum)</div><div className="prod-why">Introduce retinol once barrier is strong. Normalises cell turnover, smooths texture. Start Saturday only, then build.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest and hydrate only</div><div className="prod-why">One night per week with zero actives. Let your barrier fully recover.</div></div></div>
        <div className="step-note">⚠️ Never use BHA and retinol on the same night. Never use retinol and AHA on the same night. One active at a time.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Sixth Step" name="Eye Care">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Some By Mi Eye Serum</div><div className="prod-why">Peptide-rich. Reduces puffiness and the dark circles visible in your photo.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Innisfree Jeju Cherry Blossom Eye Cream</div><div className="prod-why">Brightening + moisturising. Great for the under-eye area of Asian skin tones.</div></div></div>
        <div className="step-note">Ring finger only. Tap gently — never rub. The eye area skin is the thinnest on your face.</div>
      </RoutineStep>
      <RoutineStep num="7" cat="Final Step — Seal Everything" name="Night Moisturiser">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">Laneige Water Sleeping Mask (2–3×/week)</div><div className="prod-why">Overnight hydration surge. Wake up with visibly plumper, glowing skin.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">COSRX Ultimate Nourishing Rice Overnight Spa Mask</div><div className="prod-why">Rice extract brightens and nourishes. Excellent on retinol nights as a buffer.</div></div></div>
        <div className="step-note">On BHA nights use a lighter moisturiser. On retinol nights use the richer one. Sunday rest night use the sleeping mask for maximum overnight repair.</div>
      </RoutineStep>
    </>
  );
}

function Weekly() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💎 These are the extra steps done once per week or less that dramatically accelerate your results. Consistency with the daily routine matters more — these are the boost on top.
      </div>
      <RoutineStep num="1×" cat="Once Per Week" name="Clay or Pore Mask">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX Salicylic Acid Daily Gentle Cleanser (as a mask)</div><div className="prod-why">Apply a thin layer to the nose and chin for 5 min before washing off. BHA draws out oil plugs — visible pore improvement after just a few uses.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✦</div><div><div className="prod-name">Innisfree Super Volcanic Pore Clay Mask</div><div className="prod-why">Volcanic ash absorbs excess sebum. Leave 10–15 min. Follow immediately with snail mucin and moisturiser.</div></div></div>
        <div className="step-note">Do this on a Saturday morning. Follow with your full hydration routine immediately after.</div>
      </RoutineStep>
      <RoutineStep num="2×" cat="Twice Per Week" name="Gua Sha or Facial Massage">
        <div className="prod-item"><div className="prod-badge">Tool</div><div><div className="prod-name">Rose Quartz or Jade Gua Sha Tool</div><div className="prod-why">2–3 min facial massage with your evening moisturiser. Stimulates lymphatic drainage which directly reduces the facial puffiness. Improves circulation, reduces fluid retention, firms over time.</div></div></div>
        <div className="step-note">Use upward and outward strokes only. Never drag down. Apply moderate pressure across jawline, cheekbones, and forehead. Before bed 2× per week.</div>
      </RoutineStep>
      <RoutineStep num="1×" cat="Once Per Week (Month 2+)" name="AHA Resurfacing Treatment">
        <div className="prod-item"><div className="prod-badge">★</div><div><div className="prod-name">COSRX AHA 7 Whitehead Power Liquid</div><div className="prod-why">Glycolic acid resurfaces the top layer of skin, dissolves dead skin cells in your pores, and gradually smooths the texture. Only once per week — this is strong.</div></div></div>
        <div className="step-note">Do not use on the same night as BHA or retinol. Saturday is a good AHA night once your skin is used to BHA. Always moisturise heavily after.</div>
      </RoutineStep>
    </>
  );
}

function Lifestyle() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌿 80% of what your skin looks like comes from inside your body and your daily habits — not products. These are the non-negotiable foundations of Korean-level skin clarity.
      </div>
      <RoutineStep num="🥤" cat="What to Drink Daily" name="Skin-Clearing Drinks">
        <div className="prod-item"><div className="prod-badge">AM</div><div><div className="prod-name">500ml warm water + fresh calamansi on waking</div><div className="prod-why">Flushes overnight waste, alkalises the gut, delivers Vitamin C — the direct co-factor for collagen synthesis. Koreans drink warm citrus water every morning without exception.</div></div></div>
        <div className="prod-item"><div className="prod-badge">AM</div><div><div className="prod-name">Green tea (unsweetened, 1–2 cups)</div><div className="prod-why">EGCG in green tea reduces sebum production — directly addresses oily pores. Also a powerful antioxidant that protects against UV-related skin damage.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Daily</div><div><div className="prod-name">Collagen peptides dissolved in water (5–10g at a meal)</div><div className="prod-why">Oral collagen supplementation rebuilds the dermal matrix, improves skin elasticity, and over 8–12 weeks creates visible plumpness and pore-shrinking from within.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Evening</div><div><div className="prod-name">Spearmint tea (1 cup at night)</div><div className="prod-why">Clinically shown to reduce androgenic hormones that drive sebum overproduction and acne. Especially effective for the small bumps and congested pores.</div></div></div>
        <div className="step-note">✕ Avoid: sugary drinks, milk, carbonated drinks, and alcohol. All directly worsen pore congestion, redness, and skin texture.</div>
      </RoutineStep>
      <RoutineStep num="🍽️" cat="What to Eat for Clear Skin" name="Skin-Clearing Foods">
        <div className="prod-item"><div className="prod-badge">✓</div><div><div className="prod-name">Eggs (daily)</div><div className="prod-why">Rich in biotin, selenium, and Vitamin A — all directly involved in skin cell regeneration and oil gland regulation. Yolk contains Vitamin D which reduces skin inflammation.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✓</div><div><div className="prod-name">Fatty fish: bangus, tuna, tanigue (3× per week)</div><div className="prod-why">Omega-3 reduces inflammatory chemicals that cause redness and acne. Strengthens the skin barrier, reducing reactivity and flushing.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✓</div><div><div className="prod-name">Papaya and tomatoes (regularly)</div><div className="prod-why">Papaya contains papain enzyme which exfoliates from the inside. Tomatoes are high in lycopene — protects against UV-triggered pore damage and redness.</div></div></div>
        <div className="prod-item"><div className="prod-badge">✕</div><div><div className="prod-name">Remove: dairy, processed food, added sugar, wheat</div><div className="prod-why">Dairy raises IGF-1 which increases sebum and acne. Sugar drives glycation which degrades skin elasticity. The monthly challenges in your plan handle this elimination systematically.</div></div></div>
      </RoutineStep>
      <RoutineStep num="🌙" cat="Your 3-Month Skin Timeline" name="What to Expect & When">
        <div className="prod-item"><div className="prod-badge">M1</div><div><div className="prod-name">Build the foundation</div><div className="prod-why">Double cleanse every night. BHA 2× per week. Niacinamide daily. SPF every morning. Stop all dairy and processed food. Skin may purge slightly in weeks 2–3 — small bumps coming up and clearing. This is normal and means the BHA is working.</div></div></div>
        <div className="prod-item"><div className="prod-badge">M2</div><div><div className="prod-name">Active results begin</div><div className="prod-why">Increase BHA to 3–4× per week. Introduce Vitamin C in the morning. Add retinol 1× per week on Saturday. Pores will visibly appear smaller. Texture begins smoothing.</div></div></div>
        <div className="prod-item"><div className="prod-badge">M3</div><div><div className="prod-name">Visible transformation</div><div className="prod-why">Increase retinol to 2–3× per week. Skin tone significantly more even. Pores noticeably smaller. Redness reduced. The dietary eliminations will amplify everything.</div></div></div>
        <div className="step-note">Korean-level skin clarity is about consistent layering of the right products, removing dietary triggers, and protecting your barrier. Three months = a face that looks genuinely different. Six months = glass skin.</div>
      </RoutineStep>
    </>
  );
}

function Retinoid() {
  const rows = [
    { phase: 'Now (Month 2)', product: 'Retinol 0.025% OTC — The Inkey List Retinol Serum', freq: '1× per week (Saturday)', what: 'Normalises cell turnover — directly smooths texture and prevents dead-cell buildup. Use the sandwich method: moisturiser → retinol → moisturiser.' },
    { phase: 'Month 3–6', product: 'Retinol 0.05% OTC', freq: '2–3× per week', what: 'Deeper resurfacing, visible pore tightening, early collagen stimulation. Upgrade only when 0.025% causes zero irritation.' },
    { phase: '6–12 months', product: 'Retinol 0.1% or Adapalene 0.1%', freq: '4–5× per week', what: 'Adapalene is OTC and clinically proven for acne, pore size, and skin texture. Often more effective than retinol for congested skin types.' },
    { phase: 'Age 24–25+', product: 'Tretinoin 0.025% (prescription)', freq: '3–5× per week', what: 'The most powerful retinoid available. Consult a dermatologist. Begin only after being fully adapted to OTC retinoids for at least 6 months.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 16 }}>
        ✨ Starting retinoids at 22 is one of the most powerful long-term investments in your skin. Patience and consistency beat intensity every time — starting low and slow gives better results than going hard and damaging your barrier.
      </div>
      <table className="fancy-table splash-item">
        <thead>
          <tr>
            <th>Age / Phase</th>
            <th>Product</th>
            <th>Frequency</th>
            <th>What It Does for Your Skin</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><strong>{r.phase}</strong></td>
              <td>{r.product}</td>
              <td>{r.freq}</td>
              <td>{r.what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note-box note-rose">
        ⚠️ Never combine retinol with BHA or AHA on the same night. Never use retinoids when pregnant. Apply at night only. SPF the next morning is mandatory — retinoids make skin temporarily more UV-sensitive.
      </div>
    </>
  );
}

const PANELS = { am: AM, pm: PM, weekly: Weekly, lifestyle: Lifestyle, retinoid: Retinoid };

export default function Skincare() {
  const [activeTab, setActiveTab] = useState('am');
  const Panel = PANELS[activeTab];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Your Personalised Skin Protocol</div>
        <h2 className="s-title">Glass Skin <em>Plan</em></h2>
        <p className="s-desc">Based on your skin right now: visible pores across nose & cheeks, small texture bumps, some redness and flushing. Goal: clear, smooth, poreless skin — the Korean glass skin look.</p>
      </div>

      <div className="divider splash-item">What Your Skin Actually Needs Right Now</div>
      <div className="g-card splash-item">
        <p style={{ fontSize: 13.5, color: 'var(--text-mid)', lineHeight: 1.8 }}>Looking at your skin, here is what is happening and why:</p>
        <p style={{ marginTop: 10 }}><span className="pill pr">Enlarged Pores</span> Caused by excess sebum, dead skin cell buildup, and lack of consistent exfoliation. Pores stretch when clogged and appear smaller when clean and tight.</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Texture & Small Bumps</span> Mostly congested pores (comedones) and mild closed whiteheads. Not cystic acne — responds very well to the right exfoliation and barrier care.</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Redness & Flushing</span> Your skin barrier is slightly reactive. Build the barrier first before introducing strong actives — barrier-first is the Korean approach.</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Good news</span> Your skin has no deep scarring, good natural moisture, and a smooth underlying structure. With the right 3-month protocol, the improvement will be dramatic.</p>
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
