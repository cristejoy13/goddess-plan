import { useState } from 'react';
import RoutineStep from './RoutineStep';

const TABS = [
  { id: 'am',        label: '☀️ Morning Routine' },
  { id: 'pm',        label: '🌙 Night Routine' },
  { id: 'weekly',    label: '💎 Weekly Treatments' },
  { id: 'lifestyle', label: '🌿 Lifestyle & Food' },
  { id: 'retinoid',  label: '✨ Retinoid Roadmap' },
];

const BRAND_COLOR = {
  'COSRX':            '#5a9a5a',
  'Beauty of Joseon': '#c8a060',
  'Some By Mi':       '#8855c0',
  'Missha':           '#705090',
  'Banila Co':        '#c84060',
  'Innisfree':        '#3c904a',
  'Laneige':          '#4080c8',
  'DHC':              '#c07830',
  "Paula's Choice":   '#b08040',
  'Round Lab':        '#4888c0',
  'The Inkey List':   '#606868',
  'Etude':            '#d04870',
};

function ProductCard({ brand, name, badges = [], why, primary = false }) {
  const color = BRAND_COLOR[brand] || '#888';
  return (
    <div className={`product-card${primary ? ' primary' : ''}`}>
      <div className="pc-band" style={{ background: color }} />
      <div className="pc-body">
        <span className={`pc-star ${primary ? 'primary' : 'alt'}`}>
          {primary ? '★ Recommended' : '✦ Alternative'}
        </span>
        <div className="pc-brand" style={{ color }}>{brand}</div>
        <div className="pc-name">{name}</div>
        {badges.length > 0 && (
          <div className="pc-badges">{badges.map((b, i) => <span key={i} className="pc-badge">{b}</span>)}</div>
        )}
        <div className="pc-why">{why}</div>
        <div className="pc-find">🛍 <strong>Find it:</strong> Search the full product name on Shopee, Lazada, or Watsons PH.</div>
      </div>
    </div>
  );
}

/* ─── AM ─── */
function AM() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ☀️ Morning goal: gently cleanse, hydrate, protect. Do NOT over-strip your skin in the morning — your barrier is already reactive. SPF is non-negotiable for pore minimising and preventing dark spots.
      </div>

      <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser">
        <ProductCard
          brand="COSRX" primary
          name="Low pH Good Morning Gel Cleanser"
          badges={['pH 5.0', 'BHA', 'Tea Tree', 'Fragrance-Free']}
          why="pH 5.0 — matches your skin's natural acid mantle exactly. Cleanses without stripping the barrier your redness-prone skin needs intact. The tea tree oil controls bacteria without harsh scrubbing."
        />
        <ProductCard
          brand="Beauty of Joseon"
          name="Relief Foam Cleanser (Rice + Probiotics)"
          badges={['Rice Extract', 'Probiotics', 'Fragrance-Free', 'Ultra-Gentle']}
          why="Super gentle rice foam. Excellent for reactive skin with redness — calms while it cleanses. Use this on mornings when your skin feels particularly sensitive or irritated."
        />
        <div className="step-note">Lukewarm water only — never hot. Hot water breaks down the skin barrier and worsens redness. 30 seconds, light pressure, pat dry with a clean towel.</div>
      </RoutineStep>

      <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner">
        <ProductCard
          brand="Some By Mi" primary
          name="Yuja Niacin 30 Days Brightening Toner"
          badges={['Niacinamide 2%', 'Yuja Extract', 'Brightening', 'Pore-Minimising']}
          why="Niacinamide is the #1 ingredient for visible pore minimising. Regulates sebum, reduces redness, and brightens uneven tone. Your most important daily AM active — takes 4–8 weeks to show full results."
        />
        <ProductCard
          brand="COSRX"
          name="AHA/BHA Clarifying Treatment Toner"
          badges={['Willow Bark BHA', 'AHA', 'Pore-Clearing']}
          why="Willow bark BHA gently exfoliates inside the pore. Use 3–4× per week as your AM toner — alternate with the niacinamide toner so skin gets both clearing and brightening."
        />
        <div className="step-note">Pat in gently with clean fingertips — never rub or swipe. Niacinamide takes 4–8 weeks of daily use to visibly shrink pores. Commit to the timeline.</div>
      </RoutineStep>

      <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence">
        <ProductCard
          brand="COSRX" primary
          name="Advanced Snail 96 Mucin Power Essence"
          badges={['Snail Secretion 96%', 'Barrier Repair', 'Redness Calming']}
          why="Snail secretion filtrate repairs the skin barrier, addresses reactive redness, speeds up texture healing, and adds hydration without greasiness. One of the most research-backed Korean skincare ingredients."
        />
        <ProductCard
          brand="Missha"
          name="Time Revolution First Treatment Essence"
          badges={['Fermented Yeast', 'Niacinamide', 'Skin Luminosity']}
          why="Fermented niacinamide essence — enhances absorption of all subsequent products and visibly improves skin clarity and glow over 4–6 weeks of consistent use."
        />
        <div className="step-note">Press into skin with both palms warmly cupped over your face. 3–5 gentle pats until absorbed. This is the step that gives Korean skin its signature glass-like glow.</div>
      </RoutineStep>

      <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum">
        <ProductCard
          brand="Some By Mi" primary
          name="Galactomyces Pure Vitamin C Glow Serum"
          badges={['Vitamin C', 'Galactomyces', 'Brightening', 'UV Protection']}
          why="Vitamin C brightens post-pimple marks, protects against UV damage, and gradually fades uneven pigmentation. Use 4–5× per week in the morning."
        />
        <ProductCard
          brand="Beauty of Joseon"
          name="Glow Serum (Propolis + Niacinamide)"
          badges={['Propolis 60%', 'Niacinamide 2%', 'Calming', 'Gentle']}
          why="If Vitamin C irritates at first, this is the gentler alternative for Month 1. Propolis calms redness and texture bumps while niacinamide works on pores simultaneously."
        />
        <div className="step-note">Use the Joseon serum for your first month while your barrier strengthens. Introduce Vitamin C in Month 2 — start 2× per week and build up.</div>
      </RoutineStep>

      <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser">
        <ProductCard
          brand="COSRX" primary
          name="Oil-Free Ultra Moisturizing Lotion (with Birch Sap)"
          badges={['Oil-Free', 'Non-Comedogenic', 'Birch Sap', 'Lightweight']}
          why="Will not clog the pores you are actively clearing. Birch sap hydrates without any heaviness or residue. Perfect for your oily-prone skin type."
        />
        <ProductCard
          brand="Etude"
          name="Soon Jung 2× Barrier Intensive Cream"
          badges={['Panthenol', 'Madecassoside', 'Redness Repair']}
          why="For reactive or sensitised days when skin needs barrier repair above everything else. Panthenol actively heals the skin barrier and stops the redness cycle."
        />
        <div className="step-note">Apply while skin is still slightly damp from essence — locks hydration in far more effectively than applying to completely dry skin.</div>
      </RoutineStep>

      <RoutineStep num="6" cat="Final Step — Never Skip This ☀️" name="Sunscreen SPF 50+ PA++++">
        <ProductCard
          brand="Beauty of Joseon" primary
          name="Relief Sun: Rice + Probiotics SPF 50+ PA++++"
          badges={['SPF 50+', 'PA++++', 'Probiotics', 'Zero White Cast', 'Sensitive Skin']}
          why="Specifically formulated for reactive, sensitive skin. Probiotics calm inflammation. Rice extract brightens. Zero white cast on all skin tones. Legendary in Korean skincare for a reason."
        />
        <ProductCard
          brand="Round Lab"
          name="Birch Juice Moisturizing Sun Cream SPF 50+"
          badges={['SPF 50+', 'Birch Juice', 'Hydrating', 'Moisturiser + SPF']}
          why="Deeply hydrating sunscreen that doubles as a moisturiser. Especially good for days when you want minimal layering in your routine."
        />
        <div className="step-note">⚠️ UV exposure directly enlarges pores, worsens redness, creates texture, and prevents ALL your actives from working. Apply generously. Reapply every 2 hours when outdoors.</div>
      </RoutineStep>
    </>
  );
}

/* ─── PM ─── */
function PM() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌙 Night goal: deeply cleanse the day off, exfoliate congestion, repair the barrier. Night is when skin regenerates — this is when everything that matters actually happens.
      </div>

      <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser">
        <ProductCard
          brand="Banila Co" primary
          name="Clean It Zero Cleansing Balm (Purifying)"
          badges={['BHA', 'Pore-Decongesting', 'SPF Remover', 'Purifying']}
          why="The Purifying version contains BHA to help decongest pores while removing SPF and pollution. Dissolves the sebum plugs that cause texture and bumps."
        />
        <ProductCard
          brand="DHC"
          name="Deep Cleansing Oil"
          badges={['Olive Oil Base', 'Deep Pore Cleanse', 'Oil-Based']}
          why="Olive-based oil cleanser. Excellent at pulling out oil-based congestion from inside pores — oil dissolves oil. Great alternative if the balm feels too heavy."
        />
        <div className="step-note">Apply to completely DRY skin. Massage 60–90 seconds including around nose and chin. Emulsify with a small amount of water until it turns milky, then rinse. Do not skip this step.</div>
      </RoutineStep>

      <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser">
        <ProductCard
          brand="COSRX" primary
          name="Low pH Good Morning Gel Cleanser"
          badges={['pH 5.0', 'BHA', 'Gentle', 'Double Cleanse']}
          why="Removes all remaining oil cleanser residue. Maintains your skin at the correct pH so all subsequent products absorb and work properly overnight."
        />
        <div className="step-note">Double cleansing every night consistently will visibly improve pore congestion and skin texture within 3–4 weeks. It is the #1 principle in Korean skincare for a reason.</div>
      </RoutineStep>

      <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner">
        <ProductCard
          brand="Some By Mi" primary
          name="AHA BHA PHA 30 Days Miracle Toner"
          badges={['BHA', 'AHA', 'PHA', 'Pore Clearing', 'Texture Smoothing']}
          why="BHA (salicylic acid) is oil-soluble — it penetrates inside the pore and dissolves the congestion causing your texture and bumps from within. Use 3–4 nights per week."
        />
        <ProductCard
          brand="Paula's Choice"
          name="2% BHA Liquid Exfoliant"
          badges={['Salicylic Acid 2%', 'Gold Standard BHA', 'Pore-Clearing']}
          why="The most effective single BHA product for pores and texture that exists. If you can find it on Shopee/Lazada, it is worth it for long-term use."
        />
        <div className="step-note">Start 2× per week for your first month to let your barrier adjust. Build to 3–4×. On non-BHA nights, use a plain hydrating toner or just go straight to essence.</div>
      </RoutineStep>

      <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence">
        <ProductCard
          brand="COSRX" primary
          name="Advanced Snail 96 Mucin Power Essence"
          badges={['Snail Secretion 96%', 'Post-Exfoliation Repair', 'Redness Calming']}
          why="After BHA exfoliation, the skin needs immediate repair. Snail mucin heals micro-damage, reduces the redness that comes after active use, and accelerates overnight skin cell regeneration."
        />
        <div className="step-note">This step is especially important on BHA nights. It calms the skin down and ensures you wake up glowing rather than irritated.</div>
      </RoutineStep>

      <RoutineStep num="5" cat="Fifth Step — Rotation Schedule" name="Treatment Rotation">
        <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner (Some By Mi or Paula's Choice)</div><div className="prod-why">Core exfoliation nights — clears congestion and actively unclogs pores.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum (Some By Mi 10%)</div><div className="prod-why">Pore-minimising and barrier-strengthening on non-exfoliation nights.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% — The Inkey List Retinol Serum</div><div className="prod-why">Introduce retinol once barrier is strong. Normalises cell turnover. Start Saturday only, then build very gradually.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest night only</div><div className="prod-why">One night per week with zero actives. Your barrier gets to fully recover. Wake up with visibly plumper skin.</div></div></div>
        <div className="step-note">⚠️ Never use BHA and retinol on the same night. Never use retinol and AHA on the same night. One active at a time — always.</div>
      </RoutineStep>

      <RoutineStep num="6" cat="Sixth Step" name="Eye Care">
        <ProductCard
          brand="Some By Mi" primary
          name="Eye Serum"
          badges={['Peptides', 'Puffiness Reducing', 'Dark Circles']}
          why="Peptide-rich formula reduces puffiness and the dark circles visible under your eyes. Pat — never rub — the delicate under-eye area."
        />
        <ProductCard
          brand="Innisfree"
          name="Jeju Cherry Blossom Eye Cream"
          badges={['Cherry Blossom Extract', 'Brightening', 'Asian Skin']}
          why="Brightening and moisturising for the under-eye area. Formulated for Asian skin tones. The ring finger only — lightest pressure of any finger."
        />
        <div className="step-note">Ring finger only. Tap gently in a semicircle under the eye — never pull or rub. The under-eye skin is the thinnest skin on your face.</div>
      </RoutineStep>

      <RoutineStep num="7" cat="Final Step — Seal Everything" name="Night Moisturiser">
        <ProductCard
          brand="Laneige" primary
          name="Water Sleeping Mask"
          badges={['Overnight Hydration', 'Sleeping Pack', '2–3× per week']}
          why="Overnight hydration surge. Sleep deprivation and dehydration show on skin first — this fights both. Wake up with visibly plumper, more glowing skin."
        />
        <ProductCard
          brand="COSRX"
          name="Ultimate Nourishing Rice Overnight Spa Mask"
          badges={['Rice Extract', 'Overnight Nourishing', 'Brightening']}
          why="Rice extract brightens and nourishes. Excellent on retinol nights as a buffer to reduce potential irritation."
        />
        <div className="step-note">On BHA nights use a lighter moisturiser. On retinol nights use the richer one. Sunday rest night use the sleeping mask for maximum overnight repair.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Weekly ─── */
function Weekly() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        💎 These are the extra steps done once per week or less that dramatically accelerate your results. Consistency with the daily routine matters more — these are the boost on top of an already strong foundation.
      </div>
      <RoutineStep num="1×" cat="Once Per Week" name="Clay or Pore Mask">
        <ProductCard
          brand="COSRX" primary
          name="Salicylic Acid Daily Gentle Cleanser (used as mask)"
          badges={['BHA', 'Pore Mask', '5 min leave-on']}
          why="Apply a thin layer to nose and chin for 5 minutes before washing off. BHA draws out the oil plugs that cause your visible pore congestion — visible improvement after a few uses."
        />
        <ProductCard
          brand="Innisfree"
          name="Super Volcanic Pore Clay Mask"
          badges={['Volcanic Ash', 'Sebum-Absorbing', 'Pore Tightening']}
          why="Volcanic ash absorbs excess sebum deeply. Leave 10–15 minutes. Follow immediately with snail mucin and full moisturiser to prevent over-drying."
        />
        <div className="step-note">Do this on a Saturday morning before your shower. Follow with your complete hydration routine immediately after — never leave skin bare after a clay mask.</div>
      </RoutineStep>
      <RoutineStep num="2×" cat="Twice Per Week" name="Gua Sha or Facial Massage">
        <div className="prod-item"><div className="prod-badge">Tool</div><div><div className="prod-name">Rose Quartz or Jade Gua Sha Stone</div><div className="prod-why">2–3 min facial massage with your evening moisturiser. Stimulates lymphatic drainage which directly reduces the facial puffiness and fluid retention that make features look undefined.</div></div></div>
        <div className="step-note">Upward and outward strokes only — never drag downward. Jawline → cheekbones → forehead. Medium pressure. Before bed, 2× per week consistently. Visible difference in jawline definition within 4–6 weeks.</div>
      </RoutineStep>
      <RoutineStep num="1×" cat="Once Per Week — Month 2 onwards" name="AHA Resurfacing Treatment">
        <ProductCard
          brand="COSRX" primary
          name="AHA 7 Whitehead Power Liquid"
          badges={['Glycolic Acid 7%', 'Surface Resurfacing', 'Texture Smoothing']}
          why="Glycolic acid resurfaces the top layer of skin, dissolves dead skin cells in pores, and smooths texture over time. Use only once per week — this is a strong treatment."
        />
        <div className="step-note">Do not use on the same night as BHA or retinol. Saturday is a good AHA night after Month 1. Always moisturise heavily after and apply SPF the next morning.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Lifestyle ─── */
function Lifestyle() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌿 80% of what your skin looks like comes from inside your body and your daily habits — not products. These are the non-negotiable foundations of Korean-level skin clarity.
      </div>
      <RoutineStep num="🥤" cat="What to Drink Daily" name="Skin-Clearing Drinks">
        <div className="prod-item"><div className="prod-badge">AM</div><div><div className="prod-name">500ml warm water + fresh calamansi on waking</div><div className="prod-why">Flushes overnight waste, alkalises the gut, delivers Vitamin C — the direct co-factor for collagen synthesis. Drink before your first meal, every day.</div></div></div>
        <div className="prod-item"><div className="prod-badge">AM</div><div><div className="prod-name">Green tea (unsweetened, 1–2 cups)</div><div className="prod-why">EGCG in green tea reduces sebum production — directly addresses oily pores. Powerful antioxidant that protects against UV-related skin damage.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Daily</div><div><div className="prod-name">Collagen peptides dissolved in water (5–10g at a meal)</div><div className="prod-why">Oral collagen supplementation rebuilds the dermal matrix, improves skin elasticity, and over 8–12 weeks creates visible plumpness and pore-shrinking from within.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Evening</div><div><div className="prod-name">Spearmint tea (1 cup at night)</div><div className="prod-why">Clinically shown to reduce androgenic hormones that drive sebum overproduction and acne. Especially effective for the small bumps and congested pores. One cup every night.</div></div></div>
        <div className="step-note">✕ Avoid completely: sugary drinks, milk, carbonated drinks, and alcohol. All directly worsen pore congestion, redness, and skin texture within 24 hours.</div>
      </RoutineStep>
      <RoutineStep num="🌙" cat="Your 3-Month Skin Timeline" name="What to Expect & When">
        <div className="prod-item"><div className="prod-badge">M1</div><div><div className="prod-name">Build the foundation</div><div className="prod-why">Double cleanse every night. BHA 2× per week. Niacinamide daily. SPF every morning. Remove all dairy and processed food. Skin may purge slightly in weeks 2–3 — this is normal and means the BHA is working.</div></div></div>
        <div className="prod-item"><div className="prod-badge">M2</div><div><div className="prod-name">Active results begin</div><div className="prod-why">Increase BHA to 3–4× per week. Introduce Vitamin C in the morning. Add retinol 1× per week. Pores will visibly appear smaller. Texture begins smoothing noticeably.</div></div></div>
        <div className="prod-item"><div className="prod-badge">M3</div><div><div className="prod-name">Visible transformation</div><div className="prod-why">Increase retinol to 2–3× per week. Skin tone significantly more even. Pores noticeably smaller. Redness reduced. The dietary eliminations in your challenges will amplify everything.</div></div></div>
        <div className="step-note">Korean-level skin clarity = consistent layering of the right products + removing dietary triggers + protecting your barrier. Three months looks genuinely different. Six months = glass skin.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Retinoid ─── */
function Retinoid() {
  const rows = [
    { phase: 'Month 2 — Start here', product: 'Retinol 0.025% OTC', brand: 'The Inkey List Retinol Serum', freq: '1× per week (Saturday)', what: 'Normalises cell turnover — smooths texture and prevents dead-cell buildup. Use the sandwich method: moisturiser → retinol → moisturiser over the top.' },
    { phase: 'Month 3–6', product: 'Retinol 0.05% OTC', brand: 'The Inkey List or Mediheal', freq: '2–3× per week', what: 'Deeper resurfacing, visible pore tightening, early collagen stimulation. Upgrade only when 0.025% causes absolutely zero irritation.' },
    { phase: 'Month 6–12', product: 'Retinol 0.1% or Adapalene 0.1%', brand: 'La Roche-Posay Effaclar or Differin', freq: '4–5× per week', what: 'Adapalene is OTC and clinically proven for acne, pore size, and skin texture. Often more effective than retinol for congested skin types like yours.' },
    { phase: 'Age 24–25+', product: 'Tretinoin 0.025% (prescription)', brand: 'Consult a dermatologist', freq: '3–5× per week', what: 'The most powerful retinoid available. Begin only after being fully adapted to OTC retinoids for at least 6 months. Consult a PH dermatologist.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 16 }}>
        ✨ Starting retinoids at 22 is one of the most powerful long-term skin investments you can make. Patience and consistency beat intensity every time — starting low and slow gives better results than going hard and damaging your barrier.
      </div>
      <table className="fancy-table splash-item">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Product & Brand</th>
            <th>Frequency</th>
            <th>What It Does</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><strong>{r.phase}</strong></td>
              <td><strong>{r.product}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{r.brand}</span></td>
              <td>{r.freq}</td>
              <td>{r.what}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        ⚠️ Never combine retinol with BHA or AHA on the same night. Never use retinoids during pregnancy. Night only. SPF the next morning is mandatory — retinoids temporarily increase UV sensitivity. Search these products on Shopee or Lazada Philippines.
      </div>
    </>
  );
}

const PANELS = { am: AM, pm: PM, weekly: Weekly, lifestyle: Lifestyle, retinoid: Retinoid };

export default function Skincare({ initialTab }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'am');
  const Panel = PANELS[activeTab];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Your Personalised Skin Protocol</div>
        <h2 className="s-title">Glass Skin <em>Plan</em></h2>
        <p className="s-desc">Based on your skin right now: visible pores across nose & cheeks, small texture bumps, some redness and flushing. Goal: clear, smooth, poreless skin — the Korean glass skin look.</p>
      </div>

      <div className="note-box note-gold splash-item" style={{ marginBottom: 14 }}>
        🛍 <strong>Where to buy:</strong> All products are available in the Philippines on <strong>Shopee</strong>, <strong>Lazada</strong>, and <strong>Watsons</strong>. Search the exact product name shown on each card. Most are under ₱500–₱1,200.
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
