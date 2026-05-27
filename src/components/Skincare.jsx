import { useState } from 'react';
import RoutineStep from './RoutineStep';

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
  'CeraVe':           '#0060a8',
  'Human Nature':     '#6a8c3e',
  'Dove':             '#6090b8',
  'Biore':            '#d03060',
  'Aveeno':           '#b09040',
  'Bio-Oil':          '#d07030',
  'AmLactin':         '#4888a0',
  'St. Ives':         '#60a850',
  'Vaseline':         '#4878a0',
  'The Ordinary':     '#505050',
  'Medicube':         '#e05070',
  'Neogen':           '#5a8050',
  'Organic Skin Japan': '#c85480',
  'Luxe Organix':     '#c07070',
  'Charlotte Tilbury': '#c89060',
  'e.l.f.':           '#c05080',
  'NARS':             '#303030',
  'Rare Beauty':      '#d05060',
  'Laura Mercier':    '#b09870',
  'Urban Decay':      '#604080',
  'MAC':              '#404040',
  'Apagard':          '#4870b0',
  'Milk Makeup':      '#d07080',
  'Maybelline':       '#c03060',
  'Armani Beauty':    '#806050',
  'Boka':             '#408880',
  'Sensodyne':        '#4060a0',
  'Skintific':        '#7060c0',
  'Dr. Jart+':        '#4090c0',
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

/* ─── Face Treatment Calendar ─── */
const AM_DAYS = [
  { day: 'Mon', am: 'Vit C (M2+)\nNiacin M1',  addOn: null },
  { day: 'Tue', am: 'Niacin + Vit C',           addOn: null },
  { day: 'Wed', am: 'Vit C (M2+)\nNiacin M1',  addOn: null },
  { day: 'Thu', am: 'Niacin + Vit C',           addOn: null },
  { day: 'Fri', am: 'Vit C (M2+)\nNiacin M1',  addOn: null },
  { day: 'Sat', am: 'Niacin + Vit C',           addOn: 'Clay Mask' },
  { day: 'Sun', am: 'Niacin only',              addOn: null },
];
const PM_DAYS = [
  { day: 'Mon', pm: 'BHA Toner',               addOn: null,        warn: 'No Retinol or AHA' },
  { day: 'Tue', pm: 'Niacinamide',             addOn: null,        warn: null },
  { day: 'Wed', pm: 'BHA Toner',               addOn: 'Gua Sha',   warn: 'No Retinol or AHA' },
  { day: 'Thu', pm: 'Niacinamide',             addOn: null,        warn: null },
  { day: 'Fri', pm: 'BHA Toner',               addOn: null,        warn: 'No Retinol or AHA' },
  { day: 'Sat', pm: 'Retinol (M2+)\nNiacin M1', addOn: 'Gua Sha + AHA (M2+)', warn: 'No BHA or Vit C' },
  { day: 'Sun', pm: 'Rest\nSleeping Mask',     addOn: null,        warn: 'Zero actives' },
];

function AMCalendar() {
  const todayIdx = ((new Date().getDay() + 6) % 7);
  return (
    <div className="tx-cal splash-item">
      <div className="tx-cal-title">☀️ Morning Treatment Schedule</div>
      <div className="tx-cal-grid">
        {AM_DAYS.map((d, i) => (
          <div key={d.day} className={`tx-day${i === todayIdx ? ' tx-today' : ''}${d.addOn ? ' tx-addon' : ''}`}>
            <div className="tx-day-label">{d.day}</div>
            <div className="tx-section">
              <div className="tx-badge">AM</div>
              <div className="tx-item">{d.am}</div>
            </div>
            {d.addOn && <div className="tx-addon-badge">+{d.addOn}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PMCalendar() {
  const todayIdx = ((new Date().getDay() + 6) % 7);
  return (
    <div className="tx-cal splash-item">
      <div className="tx-cal-title">🌙 Evening Treatment Schedule</div>
      <div className="tx-cal-grid">
        {PM_DAYS.map((d, i) => (
          <div key={d.day} className={`tx-day${i === todayIdx ? ' tx-today' : ''}${d.addOn ? ' tx-addon' : ''}`}>
            <div className="tx-day-label">{d.day}</div>
            <div className="tx-section">
              <div className="tx-badge pm">PM</div>
              <div className="tx-item">{d.pm}</div>
            </div>
            {d.addOn && <div className="tx-addon-badge">{d.addOn}</div>}
            {d.warn && <div className="tx-warn">⚠ {d.warn}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AM Face Routine ─── */
function AMFace() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <AMCalendar />
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ☀️ Morning goal: gently cleanse, hydrate, protect. Do NOT over-strip your skin in the morning — your barrier is already reactive. SPF is non-negotiable for pore minimising and preventing dark spots.
      </div>
      <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser" open={openStep==='1'} onToggle={() => tog('1')}>
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Tea Tree', 'Fragrance-Free']} why="pH 5.0 — matches your skin's natural acid mantle exactly. Cleanses without stripping the barrier your redness-prone skin needs intact. The tea tree oil controls bacteria without harsh scrubbing." />
        <ProductCard brand="Beauty of Joseon" name="Relief Foam Cleanser (Rice + Probiotics)" badges={['Rice Extract', 'Probiotics', 'Fragrance-Free', 'Ultra-Gentle']} why="Super gentle rice foam. Excellent for reactive skin with redness — calms while it cleanses. Use this on mornings when your skin feels particularly sensitive or irritated." />
        <div className="step-note">Lukewarm water only — never hot. Hot water breaks down the skin barrier and worsens redness. 30 seconds, light pressure, pat dry with a clean towel.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner" open={openStep==='2'} onToggle={() => tog('2')}>
        <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Toner" badges={['Niacinamide 2%', 'Yuja Extract', 'Brightening', 'Pore-Minimising']} why="Niacinamide is the #1 ingredient for visible pore minimising. Regulates sebum, reduces redness, and brightens uneven tone. Your most important daily AM active — takes 4–8 weeks to show full results." />
        <ProductCard brand="COSRX" name="AHA/BHA Clarifying Treatment Toner" badges={['Willow Bark BHA', 'AHA', 'Pore-Clearing']} why="Willow bark BHA gently exfoliates inside the pore. Use 3–4× per week as your AM toner — alternate with the niacinamide toner so skin gets both clearing and brightening." />
        <ProductCard brand="The Ordinary" name="Niacinamide 10% + Zinc 1%" badges={['Niacinamide 10%', 'Zinc', 'Budget-Friendly', 'Pore-Minimising']} why="Budget alternative to the Some By Mi toner. Higher niacinamide concentration at a lower price. Apply 2–3 drops as a serum step after cleansing. Widely available on Shopee and Lazada." />
        <div className="step-note">Pat in gently with clean fingertips — never rub or swipe. Niacinamide takes 4–8 weeks of daily use to visibly shrink pores. Commit to the timeline.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence" open={openStep==='3'} onToggle={() => tog('3')}>
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Barrier Repair', 'Redness Calming']} why="Snail secretion filtrate repairs the skin barrier, addresses reactive redness, speeds up texture healing, and adds hydration without greasiness. One of the most research-backed Korean skincare ingredients." />
        <ProductCard brand="Missha" name="Time Revolution First Treatment Essence" badges={['Fermented Yeast', 'Niacinamide', 'Skin Luminosity']} why="Fermented niacinamide essence — enhances absorption of all subsequent products and visibly improves skin clarity and glow over 4–6 weeks of consistent use." />
        <div className="step-note">Press into skin with both palms warmly cupped over your face. 3–5 gentle pats until absorbed. This is the step that gives Korean skin its signature glass-like glow.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum" open={openStep==='4'} onToggle={() => tog('4')}>
        <ProductCard brand="Some By Mi" primary name="Galactomyces Pure Vitamin C Glow Serum" badges={['Vitamin C', 'Galactomyces', 'Brightening', 'UV Protection']} why="Vitamin C brightens post-pimple marks, protects against UV damage, and gradually fades uneven pigmentation. Use 4–5× per week in the morning." />
        <ProductCard brand="Beauty of Joseon" name="Glow Serum (Propolis + Niacinamide)" badges={['Propolis 60%', 'Niacinamide 2%', 'Calming', 'Gentle']} why="If Vitamin C irritates at first, this is the gentler alternative for Month 1. Propolis calms redness and texture bumps while niacinamide works on pores simultaneously." />
        <div className="step-note">Use the Joseon serum for your first month while your barrier strengthens. Introduce Vitamin C in Month 2 — start 2× per week and build up.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser" open={openStep==='5'} onToggle={() => tog('5')}>
        <ProductCard brand="COSRX" primary name="Oil-Free Ultra Moisturizing Lotion (with Birch Sap)" badges={['Oil-Free', 'Non-Comedogenic', 'Birch Sap', 'Lightweight']} why="Will not clog the pores you are actively clearing. Birch sap hydrates without any heaviness or residue. Perfect for your oily-prone skin type." />
        <ProductCard brand="Etude" name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Redness Repair']} why="For reactive or sensitised days when skin needs barrier repair above everything else. Panthenol actively heals the skin barrier and stops the redness cycle." />
        <div className="step-note">Apply while skin is still slightly damp from essence — locks hydration in far more effectively than applying to completely dry skin.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Final Step — Never Skip This ☀️" name="Sunscreen SPF 50+ PA++++" open={openStep==='6'} onToggle={() => tog('6')}>
        <ProductCard brand="Beauty of Joseon" primary name="Relief Sun: Rice + Probiotics SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Probiotics', 'Zero White Cast', 'Sensitive Skin']} why="Specifically formulated for reactive, sensitive skin. Probiotics calm inflammation. Rice extract brightens. Zero white cast on all skin tones. Legendary in Korean skincare for a reason." />
        <ProductCard brand="Round Lab" name="Birch Juice Moisturizing Sun Cream SPF 50+" badges={['SPF 50+', 'Birch Juice', 'Hydrating', 'Moisturiser + SPF']} why="Deeply hydrating sunscreen that doubles as a moisturiser. Especially good for days when you want minimal layering in your routine." />
        <div className="step-note">⚠️ UV exposure directly enlarges pores, worsens redness, creates texture, and prevents ALL your actives from working. Apply generously. Reapply every 2 hours when outdoors.</div>
      </RoutineStep>
      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        📅 <strong>Saturday AM:</strong> Do your clay mask before your morning shower, then follow your full routine. <strong>Saturday PM:</strong> Retinol (Month 2+) + Gua Sha after moisturiser. <strong>Wednesday PM:</strong> Gua Sha after moisturiser. <strong>Month 2+ Saturdays:</strong> AHA alternative on nights before Retinol is introduced.
      </div>
    </>
  );
}

/* ─── PM Face Routine ─── */
function PMFace() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <PMCalendar />
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌙 Night goal: deeply cleanse the day off, exfoliate congestion, repair the barrier. Night is when skin regenerates — this is when everything that matters actually happens.
      </div>
      <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser" open={openStep==='1'} onToggle={() => tog('1')}>
        <ProductCard brand="Banila Co" primary name="Clean It Zero Cleansing Balm (Purifying)" badges={['BHA', 'Pore-Decongesting', 'SPF Remover', 'Purifying']} why="The Purifying version contains BHA to help decongest pores while removing SPF and pollution. Dissolves the sebum plugs that cause texture and bumps." />
        <ProductCard brand="DHC" name="Deep Cleansing Oil" badges={['Olive Oil Base', 'Deep Pore Cleanse', 'Oil-Based']} why="Olive-based oil cleanser. Excellent at pulling out oil-based congestion from inside pores — oil dissolves oil. Great alternative if the balm feels too heavy." />
        <div className="step-note">Apply to completely DRY skin. Massage 60–90 seconds including around nose and chin. Emulsify with a small amount of water until it turns milky, then rinse. Do not skip this step.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser" open={openStep==='2'} onToggle={() => tog('2')}>
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Gentle', 'Double Cleanse']} why="Removes all remaining oil cleanser residue. Maintains your skin at the correct pH so all subsequent products absorb and work properly overnight." />
        <div className="step-note">Double cleansing every night consistently will visibly improve pore congestion and skin texture within 3–4 weeks. It is the #1 principle in Korean skincare for a reason.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner" open={openStep==='3'} onToggle={() => tog('3')}>
        <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['BHA', 'AHA', 'PHA', 'Pore Clearing', 'Texture Smoothing']} why="BHA (salicylic acid) is oil-soluble — it penetrates inside the pore and dissolves the congestion causing your texture and bumps from within. Use 3–4 nights per week." />
        <ProductCard brand="Paula's Choice" name="2% BHA Liquid Exfoliant" badges={['Salicylic Acid 2%', 'Gold Standard BHA', 'Pore-Clearing']} why="The most effective single BHA product for pores and texture that exists. If you can find it on Shopee/Lazada, it is worth it for long-term use." />
        <div className="step-note">Start 2× per week for your first month to let your barrier adjust. Build to 3–4×. On non-BHA nights, use a plain hydrating toner or just go straight to essence.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence" open={openStep==='4'} onToggle={() => tog('4')}>
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Post-Exfoliation Repair', 'Redness Calming']} why="After BHA exfoliation, the skin needs immediate repair. Snail mucin heals micro-damage, reduces the redness that comes after active use, and accelerates overnight skin cell regeneration." />
        <div className="step-note">This step is especially important on BHA nights. It calms the skin down and ensures you wake up glowing rather than irritated.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Rotation Schedule" name="Treatment Rotation" open={openStep==='5'} onToggle={() => tog('5')}>
        <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner — Some By Mi AHA BHA PHA or Paula's Choice 2% BHA</div><div className="prod-why">Core exfoliation nights — clears congestion and actively unclogs pores.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum — Some By Mi 10% Niacinamide · Alt: COSRX Niacinamide 15% or The Ordinary Niacinamide 10%+Zinc</div><div className="prod-why">Pore-minimising and barrier-strengthening on non-exfoliation nights.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% — The Inkey List Retinol Serum · Alt: Mediheal Retinol or Rohto Melano CC Retinol</div><div className="prod-why">Introduce retinol once barrier is strong. Normalises cell turnover. Start Saturday only, then build very gradually.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest night only</div><div className="prod-why">One night per week with zero actives. Your barrier gets to fully recover. Wake up with visibly plumper skin.</div></div></div>
        <div className="step-note">⚠️ Never use BHA and retinol on the same night. Never use retinol and AHA on the same night. One active at a time — always.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Sixth Step" name="Eye Care" open={openStep==='6'} onToggle={() => tog('6')}>
        <ProductCard brand="Some By Mi" primary name="Eye Serum" badges={['Peptides', 'Puffiness Reducing', 'Dark Circles']} why="Peptide-rich formula reduces puffiness and the dark circles visible under your eyes. Pat — never rub — the delicate under-eye area." />
        <ProductCard brand="Innisfree" name="Jeju Cherry Blossom Eye Cream" badges={['Cherry Blossom Extract', 'Brightening', 'Asian Skin']} why="Brightening and moisturising for the under-eye area. Formulated for Asian skin tones. The ring finger only — lightest pressure of any finger." />
        <div className="step-note">Ring finger only. Tap gently in a semicircle under the eye — never pull or rub. The under-eye skin is the thinnest skin on your face.</div>
      </RoutineStep>
      <RoutineStep num="7" cat="Final Step — Seal Everything" name="Night Moisturiser" open={openStep==='7'} onToggle={() => tog('7')}>
        <ProductCard brand="Laneige" primary name="Water Sleeping Mask" badges={['Overnight Hydration', 'Sleeping Pack', '2–3× per week']} why="Overnight hydration surge. Sleep deprivation and dehydration show on skin first — this fights both. Wake up with visibly plumper, more glowing skin." />
        <ProductCard brand="COSRX" name="Ultimate Nourishing Rice Overnight Spa Mask" badges={['Rice Extract', 'Overnight Nourishing', 'Brightening']} why="Rice extract brightens and nourishes. Excellent on retinol nights as a buffer to reduce potential irritation." />
        <div className="step-note">On BHA nights use a lighter moisturiser. On retinol nights use the richer one. Sunday rest night use the sleeping mask for maximum overnight repair.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Body Morning (Shower + Day) ─── */
function BodyMorning() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🫧 Body skin needs the same consistent attention as your face — just different products. These routines build soft, smooth, glowing skin from head to toe over 4–8 weeks.
      </div>
      <RoutineStep num="1" cat="In The Shower" name="Cleanse & Exfoliate" open={openStep==='1'} onToggle={() => tog('1')}>
        <div className="note-box note-rose" style={{ marginBottom: 12, marginTop: 0 }}>
          🌡️ Temperature: warm — never hot. Hot water strips the body's natural oils and breaks the moisture barrier. Finish with a 30-second cooler rinse to close pores and improve circulation.
        </div>
        <ProductCard brand="Human Nature" primary name="Naturals Body Wash — Sunflower" badges={['Sulfate-Free', 'Moisturising', 'Filipino Brand', 'Gentle']} why="Gentle, sulfate-free body wash made with sunflower oil. Cleanses without stripping moisture — important for maintaining the body skin barrier. Affordable and widely available across the Philippines." />
        <ProductCard brand="Dove" name="Sensitive Skin Body Wash" badges={['Fragrance-Free', 'Hypoallergenic', 'Moisture Seal']} why="Contains ¼ moisturising cream — cleans without the tight, dry feeling. Ideal on days when skin feels reactive or after sun exposure. Clinically tested for sensitive skin." />
        <div className="step-note">🪥 Dry brush 2× per week BEFORE your shower (Sunday + Wednesday): use a natural bristle brush in firm circular upward strokes — start at feet, move toward the heart. Stimulates lymphatic drainage, reduces puffiness, and dramatically smooths skin texture over 4–6 weeks.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="St. Ives" name="Oatmeal & Shea Butter Body Scrub" badges={['Physical Exfoliant', '2× per week', 'Texture Smoothing']} why="Buffs away dead skin cells that cause dullness and rough patches. Use on Sunday and Wednesday in the shower after body wash. Focus on elbows, knees, upper arms, and thighs — then rinse thoroughly." />
        </div>
        <div className="step-note">Exfoliation days: Sunday and Wednesday only. Over-exfoliating causes irritation and barrier damage — 2× per week is the correct frequency for body skin.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="After Shower — Before Going Out" name="Seal & Protect" open={openStep==='2'} onToggle={() => tog('2')}>
        <div className="step-note" style={{ marginBottom: 12 }}>⏱️ The 2-minute rule: apply body moisturiser within 2 minutes of stepping out of the shower, while skin is still slightly damp. This locks moisture in far more effectively than applying to completely dry skin.</div>
        <ProductCard brand="CeraVe" primary name="Moisturizing Cream (body)" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free', '24-Hour Hydration']} why="Ceramides repair and strengthen the skin barrier — the same principle as your face routine. Long-lasting hydration that is non-greasy and absorbs quickly. The gold standard for daily body moisturising." />
        <ProductCard brand="Human Nature" name="Naturals Intensive Moisturizer" badges={['Sunflower Oil', 'Non-Greasy', 'Lightweight', 'Filipino Brand']} why="Absorbs quickly with no stickiness — ideal for humid Philippine weather. Good budget-friendly daily option when you need to get dressed fast." />
        <div className="step-note">🦵 Apply a thicker layer to elbows, knees, and heels — these areas lose moisture fastest and show rough texture most visibly. Give them extra attention every morning.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Biore" name="UV Aqua Rich Watery Essence SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Lightweight', 'No White Cast']} why="Apply SPF to all exposed skin before going out — arms, neck, décolletage, and legs if wearing skirts or shorts. UV damage causes premature skin ageing on body skin just as on the face. This formula absorbs in seconds with zero stickiness." />
        </div>
        <div className="step-note">⚠️ Body SPF is non-negotiable when wearing sleeveless tops, shorts, or skirts outdoors. Reapply every 2 hours. Neck and arms age at the same rate as face skin when exposed without protection.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Bio-Oil" name="Bio-Oil Skincare Oil" badges={['Vitamin A & E', 'Stretch Mark Fading', 'Scar Reduction', 'Skin Glow']} why="2–3 drops layered over moisturiser adds a natural glow and gradually fades stretch marks, scars, and uneven pigmentation. Pat — never rub — into the skin. Applied last so it seals everything underneath." />
        </div>
        <div className="step-note">Layer order: moisturiser first → absorb 1 min → then 2–3 drops of Bio-Oil on top. Apply oil as the final step so it seals in all the hydration below it.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Body Evening ─── */
function BodyEvening() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <RoutineStep num="3" cat="Evening Routine" name="Repair Overnight" open={openStep==='3'} onToggle={() => tog('3')}>
        <div className="step-note" style={{ marginBottom: 12 }}>🌙 Skin regenerates most actively between 10 PM and 2 AM. Evening body care is when richer products do their most effective work — no UV degradation, and the body is in full repair mode.</div>
        <ProductCard brand="Aveeno" primary name="Daily Moisturizing Lotion" badges={['Colloidal Oat', 'Soothing', 'Fragrance-Free', '24-Hour Repair']} why="Colloidal oatmeal is clinically proven to soothe, protect, and repair the skin barrier overnight. Slightly richer than daytime options — perfect for the body's deeper overnight recovery phase." />
        <ProductCard brand="CeraVe" name="Moisturizing Cream (heavy layer)" badges={['Ceramides', 'Overnight Repair', 'Barrier Restoration']} why="Apply a more generous layer at night than in the morning — no sun or layering needed, just pure overnight absorption into the skin." />
        <div className="step-note">🦶 Vaseline on heels and elbows every night: apply a generous amount of Vaseline Original after your regular moisturiser. This is the most effective treatment for cracked heels and rough elbows — clinical-level results within 2–3 weeks of nightly use.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Vaseline" name="Original Petroleum Jelly" badges={['Occlusive', 'Heel Repair', 'Elbow Softening', 'Fragrance-Free']} why="Locks moisture in completely. Nothing evaporates from skin when Vaseline is applied — it traps hydration underneath and allows deep overnight tissue repair. Apply on heels and elbows every single night after moisturiser." />
        </div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="AmLactin" name="Daily Moisturizing Body Lotion" badges={['Lactic Acid 12%', 'AHA', 'Keratosis Pilaris', '1× per week']} why="Lactic acid gently exfoliates body skin chemically — smooths keratosis pilaris (the small rough bumps on upper arms), improves overall skin texture, and brightens uneven tone. Use once a week on Sunday evening, after your dry brushing day." />
        </div>
        <div className="step-note">AmLactin: Sunday evenings only (after your scrub day). Do not combine with Bio-Oil on the same night — one treatment at a time. Wash hands after applying.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Bio-Oil" name="Bio-Oil Evening Massage (2× per week)" badges={['Circulation Boost', 'Lymphatic Drainage', 'Firming', 'Tue + Fri']} why="A 5-minute Bio-Oil massage on Tuesday and Friday evenings boosts circulation, supports lymphatic drainage, reduces water retention, and keeps skin firm and radiant. Use on arms, thighs, and abdomen in long upward circular strokes." />
        </div>
        <div className="step-note">Massage technique: 4–5 drops of Bio-Oil per area. Long upward strokes on limbs, small circular strokes on abdomen. 5 minutes total. Do this AFTER your regular moisturiser — the oil seals everything in and does not need to absorb on its own.</div>
      </RoutineStep>
      <div className="note-box note-rose" style={{ marginTop: 20 }}>
        🌸 <strong>Weekly body skin schedule at a glance</strong><br /><br />
        <strong>Every day:</strong> Warm shower → body wash → moisturise within 2 min → SPF on all exposed skin<br />
        <strong>Sunday + Wednesday:</strong> Dry brush before shower + body scrub in shower<br />
        <strong>Sunday evening:</strong> AmLactin AHA lotion instead of regular moisturiser on rough areas<br />
        <strong>Tuesday + Friday evening:</strong> Bio-Oil massage after regular moisturiser<br />
        <strong>Every night:</strong> Vaseline on heels and elbows — non-negotiable
      </div>
    </>
  );
}

/* ─── Retinoid ─── */
function Retinoid() {
  const rows = [
    { phase: 'Month 2 — Start here', product: 'Retinol 0.025% OTC', brand: 'The Inkey List Retinol Serum', alt: 'Mediheal Collagen Retinol Serum · Rohto Melano CC Retinol', freq: '1× per week (Saturday)', what: 'Normalises cell turnover — smooths texture and prevents dead-cell buildup. Use the sandwich method: moisturiser → retinol → moisturiser over the top.' },
    { phase: 'Month 3–6', product: 'Retinol 0.05% OTC', brand: 'The Inkey List or Mediheal', alt: 'Cos De BAHA Retinol 0.05% · The Ordinary Retinol 0.5%', freq: '2–3× per week', what: 'Deeper resurfacing, visible pore tightening, early collagen stimulation. Upgrade only when 0.025% causes absolutely zero irritation.' },
    { phase: 'Month 6–12', product: 'Retinol 0.1% or Adapalene 0.1%', brand: 'La Roche-Posay Effaclar or Differin', alt: 'A-Derma Dermalibour+ Retinol · APLB Retinol Cream 0.1%', freq: '4–5× per week', what: 'Adapalene is OTC and clinically proven for acne, pore size, and skin texture. Often more effective than retinol for congested skin types like yours.' },
    { phase: 'Age 24–25+', product: 'Tretinoin 0.025% (prescription)', brand: 'Consult a dermatologist', alt: 'Prescription only — no OTC alternative', freq: '3–5× per week', what: 'The most powerful retinoid available. Begin only after being fully adapted to OTC retinoids for at least 6 months. Consult a PH dermatologist.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 16 }}>
        ✨ Starting retinoids at 22 is one of the most powerful long-term skin investments you can make. Patience and consistency beat intensity every time — starting low and slow gives better results than going hard and damaging your barrier.
      </div>
      <table className="fancy-table splash-item">
        <thead>
          <tr><th>Phase</th><th>Product & Brand</th><th>Alternatives (if unavailable)</th><th>Frequency</th><th>What It Does</th></tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td><strong>{r.phase}</strong></td>
              <td><strong>{r.product}</strong><br /><span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{r.brand}</span></td>
              <td><span style={{ fontSize: 11, color: 'var(--text-soft)' }}>{r.alt}</span></td>
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

/* ─── Anti-Aging ─── */
const AG_CARDS = [
  {
    ico: '🛌', t: 'Sleep — Master Hormone', group: 'Daily Rhythms',
    b: '7.5–9 hours is not optional. Growth hormone rebuilds your glutes and skin overnight — secreted primarily in deep sleep.',
    how: ['Sleep by 10 PM — the most valuable GH release window is 10 PM to 2 AM','Keep your room completely dark and cool (18–21°C)','Stop screens at least 30 minutes before bed — blue light suppresses melatonin','Drink chamomile tea 30 minutes before sleep to lower cortisol','No food after 4 PM — digestion during sleep reduces GH secretion','Use a silk pillowcase — reduces facial compression lines and hair breakage overnight'],
    why: 'During deep sleep, your pituitary gland releases growth hormone in pulses. GH rebuilds muscle tissue (including glutes), synthesises collagen for skin, and regulates body fat composition. Poor sleep reduces GH by up to 70% and raises cortisol — cortisol breaks down collagen, deposits fat around the belly, and worsens hormonal acne. Sleep is where the entire Goddess Plan actually works.',
    when: 'Begin your wind-down at 9:30 PM. Lights out by 10 PM. This is the single most important habit in this entire plan — it amplifies every other result.',
  },
  {
    ico: '☀️', t: 'Morning Sunlight', group: 'Daily Rhythms',
    b: '10–20 min of direct morning sunlight before 9 AM anchors your circadian rhythm, supports serotonin-to-melatonin conversion, and regulates cortisol.',
    how: ['Go outside within 30–60 minutes of waking — every single day','Look in the direction of the sun (not directly at it) for 10–20 minutes','No sunglasses — the light must reach your retinas to signal your brain','Walk slowly, stretch, or simply sit while getting your light exposure','If outdoors is not possible, use a 10,000-lux daylight lamp for 20 min'],
    why: 'Morning sunlight activates specialised photoreceptors in your eyes that signal your brain to anchor your circadian clock. This single action sets cortisol timing (high in morning, low at night), triggers serotonin production, and ensures melatonin is released at the right time in the evening. A well-anchored circadian rhythm means better sleep quality, more stable hormones, improved mood, and faster skin healing. All from 15 minutes of morning light.',
    when: 'First thing in the morning, ideally before 8 AM. Make it part of your morning routine before your first meal. This is completely free and takes no extra time if you eat breakfast outside or near a window.',
  },
  {
    ico: '🧠', t: 'Brain Health', group: 'Hormones & Mind',
    b: 'Omega-3 from bangus, tuna, and tanigue are essential for neuroplasticity. Eggs provide choline — critical for memory. Ginger reduces neuroinflammation.',
    how: ['Eat fatty fish (bangus, tuna, tanigue) 3× per week — omega-3 EPA and DHA','Eat eggs daily — the yolk contains choline, the precursor to acetylcholine (your learning neurotransmitter)','Add fresh ginger to your tea or cooking daily — gingerol reduces neuroinflammation','Add turmeric with black pepper to eggs or broth — curcumin is neuroprotective','Consider an omega-3 supplement (1–2g EPA+DHA) if fish intake is inconsistent','Protect your sleep — 7.5+ hours is when your glymphatic system clears brain waste overnight'],
    why: 'Your brain is 60% fat — it requires a constant supply of omega-3 to build and maintain neuronal membranes. DHA specifically is the structural fat in brain cell walls. Low DHA is linked to brain fog, low mood, and accelerated cognitive decline. At 22, building these habits creates a measurably sharper brain at 32, 42, and beyond. Curcumin specifically has been shown in clinical studies to cross the blood-brain barrier and reduce amyloid plaques.',
    when: 'Daily — through food choices. Fatty fish at lunch or dinner 3× weekly. Eggs every day. Ginger and turmeric in cooking. Omega-3 supplement with your biggest meal if needed.',
  },
  {
    ico: '🍃', t: 'Cortisol Management', group: 'Hormones & Mind',
    b: 'Chronic stress → elevated cortisol → belly fat, acne, hair loss, disrupted hormones. Daily habits that measurably lower cortisol create visible physical changes over 8–12 weeks.',
    how: ['Drink chamomile tea 30 min before bed — clinically shown to reduce cortisol','Limit screens after 8 PM — blue light raises cortisol in the evening','Do pilates 2× per week — clinically proven to reduce cortisol more than any other exercise type','Never train hard on poor sleep — cortisol is already high, training raises it further','Take 10 deep slow breaths before meals — activates the parasympathetic nervous system','Get 10–20 min morning sunlight — correctly times cortisol peak to morning only','Eat regular meals with 4-hour gaps — erratic eating spikes cortisol'],
    why: 'Cortisol is your stress hormone — essential in bursts, damaging when chronically elevated. High cortisol breaks down collagen (causing wrinkles and pore enlargement), deposits visceral fat around the belly, disrupts estrogen and progesterone (causing acne, irregular cycles, and mood swings), and causes hair follicles to enter a resting phase (causing hair shedding). Managing cortisol is one of the most powerful anti-aging and body composition levers available.',
    when: 'All day — the habits above are woven into your existing routine. The chamomile tea, morning light, and pilates sessions together create a powerful cortisol-lowering effect over 8–12 weeks.',
  },
  {
    ico: '🌸', t: 'Hormone-Protective Eating', group: 'Hormones & Mind',
    b: 'Eggs provide cholesterol — the raw material for all sex hormones. Healthy fats from avocado, olive oil, and nuts are precursors to estrogen and progesterone.',
    how: ['Eat eggs daily — cholesterol in the yolk is the direct precursor to all steroid hormones including estrogen and progesterone','Use olive oil, avocado, and nuts at every meal — these fats are required for hormone synthesis','Remove processed foods completely — they contain xenoestrogens (synthetic estrogens) from packaging and additives','Remove dairy — A1 casein raises IGF-1 which disrupts the estrogen-progesterone balance','Add pumpkin seeds (zinc) — zinc is required for healthy progesterone levels','Eat fatty fish 3× weekly — omega-3 reduces the inflammatory prostaglandins that worsen PMS and period pain','Spearmint tea nightly — reduces androgenic hormones that cause excess sebum and acne'],
    why: 'All sex hormones — estrogen, progesterone, testosterone — are synthesised from cholesterol. Without adequate dietary fat and cholesterol, your body cannot produce balanced hormones. Conversely, processed foods contain plasticizers and synthetic compounds that mimic estrogen, flooding receptors and causing estrogen dominance — which manifests as bloating, acne, irregular cycles, and mood swings. Your whole food protocol directly addresses hormonal balance from the inside.',
    when: 'Every meal — hormone-protective eating is built into your existing nutrition plan. The most important habit is eating eggs and healthy fats at every meal, and avoiding all processed foods consistently.',
  },
  {
    ico: '✨', t: 'Skin Longevity Nutrients', group: 'Skin Longevity',
    b: 'Daily collagen peptides rebuild the dermal matrix. Vitamin C from calamansi drives collagen synthesis. Omega-3 reduces water loss for plumpness.',
    how: ['Take 5–10g collagen peptides (bovine or marine) dissolved in water daily with a Vitamin C source','Squeeze calamansi on everything — Vitamin C is the co-factor for every step of collagen synthesis','Eat papaya regularly — papain enzyme exfoliates from the inside, improving skin texture','Eat fatty fish 3× weekly — omega-3 reduces transepidermal water loss, keeping skin plump','Add a small handful of pumpkin seeds or walnuts — zinc for oil gland regulation and skin healing','Use collagen water at lunch and post-workout as your hydration with every training meal','Protect with SPF 50+ every single morning — UV exposure degrades collagen 3× faster than time alone'],
    why: 'Collagen is the scaffolding of your skin — it gives it structure, plumpness, and elasticity. By 22 your collagen production is still strong, but it begins declining from around 25 at 1–2% per year. Building the maximum baseline now means the decline starts from a higher point. Oral collagen supplementation with Vitamin C has been shown in clinical trials to improve skin elasticity by up to 20% over 8–12 weeks. The SPF habit alone prevents more visible aging than any cream, serum, or supplement.',
    when: 'Daily: collagen in water at meals, calamansi on food, SPF every morning. Fatty fish 3× weekly. This is your skin longevity baseline — the earlier it starts, the more compounding benefit it builds.',
  },
];
const AG_GROUPS = [
  { ico: '🌙', title: 'Daily Rhythms',   desc: 'Sleep & morning sunlight — the foundation of every result' },
  { ico: '🌿', title: 'Hormones & Mind', desc: 'Brain health · Cortisol · Hormone-protective eating' },
  { ico: '✨', title: 'Skin Longevity',  desc: 'Nutrients & supplements that compound visible results' },
];

function AgCardDetail({ card, onBack }) {
  return (
    <>
      <button className="ag-detail-back" onClick={onBack}>← Back to Anti-Aging</button>
      <div className="ag-detail-header splash-item">
        <div className="ag-detail-ico">{card.ico}</div>
        <div className="ag-detail-group-tag">{card.group}</div>
        <h2 className="ag-detail-title">{card.t}</h2>
        <p className="ag-detail-intro">{card.b}</p>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">📋 How to Do It</div>
        <ul className="ag-detail-list">{card.how.map((item, i) => <li key={i}>{item}</li>)}</ul>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">💡 Why It Works</div>
        <p className="ag-detail-body">{card.why}</p>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">⏰ Best Time</div>
        <p className="ag-detail-body">{card.when}</p>
      </div>
    </>
  );
}

function AntiAgingTab({ selected, onSelect, onBack }) {
  if (selected) return <AgCardDetail card={selected} onBack={onBack} />;
  return (
    <>
      <div className="s-header" style={{ paddingTop: 0 }}>
        <div className="s-tag">Longevity &amp; Hormones</div>
        <p className="s-desc">Starting at 22 is your greatest advantage. Tap any topic below to open the full protocol — how, why, and when.</p>
      </div>
      {AG_GROUPS.map(group => (
        <div key={group.title}>
          <div className="divider splash-item">{group.ico} {group.title}</div>
          <div className="ag-nav-list splash-item">
            {AG_CARDS.filter(c => c.group === group.title).map(card => (
              <button key={card.t} className="ag-nav-item" onClick={() => onSelect(card)}>
                <span className="ag-nav-ico">{card.ico}</span>
                <div className="ag-nav-text">
                  <div className="ag-nav-title">{card.t}</div>
                  <div className="ag-nav-desc">{card.b}</div>
                </div>
                <span className="ag-nav-arr">›</span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="divider divider-center splash-item">Supplement Stack</div>
      <div className="g-card g-card-center splash-item">
        <p><span className="pill pg">Daily</span> Collagen peptides (bovine or marine) — dissolved in water at meals with Vitamin C</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Omega-3 fish oil — or eat fatty fish 3× per week</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Vitamin C from whole food — calamansi, papaya, tomatoes</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Magnesium glycinate — before bed for sleep, recovery, and hormone support</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Zinc picolinate — with food for skin clarity, immune health, and cycle regularity</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Avoid</span> High-dose single vitamins without professional guidance</p>
      </div>
    </>
  );
}

/* ─── Hair Care (integrated) ─── */
const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES   = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

const OIL_SCHEDULE = [
  [ // Week A
    [{ e: '🌸', n: 'Camellia' }, { e: '🌿', n: 'Rosemary' }],
    [{ e: '✨', n: 'Argan' }],
    [{ e: '🌼', n: 'Jojoba' }],
    [],
    [{ e: '🌸', n: 'Camellia' }],
    [{ e: '✨', n: 'Argan' }],
    [],
  ],
  [ // Week B
    [{ e: '🌸', n: 'Camellia' }, { e: '🌿', n: 'Rosemary' }],
    [{ e: '✨', n: 'Argan' }],
    [{ e: '🌼', n: 'Jojoba' }, { e: '🥥', n: 'Coconut' }],
    [],
    [{ e: '🌸', n: 'Camellia' }],
    [{ e: '✨', n: 'Argan' }],
    [],
  ],
];

const OIL_COLORS = {
  Camellia: 'rgba(255,92,157,0.18)',
  Rosemary: 'rgba(240,204,96,0.14)',
  Argan:    'rgba(255,232,122,0.16)',
  Jojoba:   'rgba(240,204,96,0.10)',
  Coconut:  'rgba(255,255,255,0.08)',
};

const OIL_GUIDE = {
  Camellia: {
    emoji: '🌸',
    how: 'Warm 3–5 drops in your palms and apply to scalp and mid-lengths. Massage firmly for 5 minutes. Leave on 45–60 min, then shampoo out — apply shampoo to dry hair first for best removal.',
    tip: 'Your hero oil. Penetrates the shaft without weighing fine strands down.',
  },
  Rosemary: {
    emoji: '🌿',
    how: 'Use your pre-diluted blend only — never apply rosemary neat to skin. Apply to scalp parting lines, massage 5 min. Leave 45–60 min, shampoo twice to fully remove.',
    tip: 'Always diluted. Clinical studies show it matches minoxidil for density over 6 months.',
  },
  Argan: {
    emoji: '✨',
    how: '1–2 drops only on damp hair after washing. Apply mid-length to ends — never the scalp. Leave in, do not rinse. Scrunch upward to enhance your wave pattern.',
    tip: 'Finishing oil only. Controls frizz and adds shine after every wash.',
  },
  Jojoba: {
    emoji: '🌼',
    how: '3–4 drops applied directly to scalp parting lines. Massage 3–5 min. Leave 45 min, then shampoo out.',
    tip: "Closest match to your scalp's own sebum. Best carrier oil for rosemary blend.",
  },
  Coconut: {
    emoji: '🥥',
    how: '1–2 drops on the very ends only — not scalp, not mid-shaft. Set a 20-min timer. Always shampoo out completely.',
    tip: 'Once every 2 weeks maximum. Overuse causes protein overload on fine hair.',
  },
};

const OIL_BENEFITS = {
  Camellia: {
    emoji: '🌸',
    tagline: 'Your hero oil for fine, wavy strands',
    color: 'rgba(255,92,157,0.12)',
    borderColor: 'rgba(255,92,157,0.3)',
    science: 'Camellia oil (Tsubaki) is composed of 80–85% oleic acid — a long-chain fatty acid that can penetrate the hair cortex rather than sitting on top of it like heavier oils. This means it adds moisture and strength from the inside without the greasy feel that weighs down fine hair.',
    benefits: [
      { icon: '💧', title: 'Deep shaft hydration', body: 'Oleic acid is small enough to pass through the cuticle layer into the cortex, replenishing moisture where it matters most.' },
      { icon: '🛡️', title: 'Reduces breakage', body: 'Strengthens the internal structure of each strand, reducing the brittleness that leads to mid-shaft splits and breakage.' },
      { icon: '✨', title: 'Frizz control without weight', body: 'Smooths the cuticle and seals moisture in — eliminating frizz without flattening your natural wave pattern.' },
      { icon: '🌿', title: 'Scalp health', body: 'Anti-inflammatory properties soothe dry, itchy scalp and support a healthy follicle environment for growth.' },
      { icon: '🌸', title: 'Wavy hair-safe', body: 'Unlike coconut oil, camellia does not cause protein overload on fine or wavy hair — safe to use multiple times a week.' },
    ],
    bestFor: 'Fine, wavy, or colour-treated hair',
    frequency: '2–3× per week (pre-wash treatment)',
  },
  Rosemary: {
    emoji: '🌿',
    tagline: 'Clinically proven to match minoxidil for hair density',
    color: 'rgba(240,204,96,0.10)',
    borderColor: 'rgba(240,204,96,0.28)',
    science: 'A 2023 randomised controlled trial published in Skinmed Journal found that rosemary oil applied to the scalp for 6 months produced equivalent hair count increases to 2% minoxidil — without the side effects. The active compound, carnosic acid, stimulates blood flow to hair follicles and inhibits DHT (the hormone responsible for hair miniaturisation).',
    benefits: [
      { icon: '🩸', title: 'Increases scalp blood flow', body: 'Stimulates microcirculation at the follicle level, delivering more oxygen and nutrients to actively growing hairs.' },
      { icon: '🔬', title: 'DHT inhibition', body: 'Carnosic acid partially blocks the enzyme 5-alpha reductase, reducing DHT — the key driver of hair thinning and miniaturisation.' },
      { icon: '💪', title: 'Supports hair density', body: 'Clinical trials show statistically significant increases in hair count after 6 months of consistent scalp application.' },
      { icon: '🛡️', title: 'Antioxidant protection', body: 'Rich in rosmarinic acid — a potent antioxidant that protects follicles from oxidative stress that accelerates shedding.' },
      { icon: '⚠️', title: 'Must always be diluted', body: 'Rosemary essential oil is potent. Never apply neat to skin. Always dilute in a carrier oil (jojoba or camellia) before applying.' },
    ],
    bestFor: 'Anyone wanting to support hair density and reduce seasonal shedding',
    frequency: '1–2× per week (always diluted, pre-wash)',
  },
  Argan: {
    emoji: '✨',
    tagline: 'Liquid gold for frizz, shine, and wave definition',
    color: 'rgba(255,232,122,0.10)',
    borderColor: 'rgba(255,232,122,0.3)',
    science: "Argan oil is cold-pressed from the kernels of the Moroccan argan tree. It is uniquely high in Vitamin E (tocopherols) and unsaturated fatty acids (oleic and linoleic acid), making it an exceptional finishing oil. Unlike penetrating oils, argan is a surface-active oil — it coats the cuticle to seal moisture in and smooth the hair's external texture.",
    benefits: [
      { icon: '✨', title: 'Frizz elimination', body: 'Coats and seals the cuticle layer, preventing humidity from lifting cuticle scales and causing frizz — especially effective on wavy hair.' },
      { icon: '💎', title: 'Mirror-like shine', body: 'High Vitamin E content reflects light off a smooth cuticle surface, creating the glass-hair effect without silicone.' },
      { icon: '🌊', title: 'Wave definition', body: 'Applied to damp hair and scrunched upward, it clumps your natural wave pattern without crunch or stiffness.' },
      { icon: '🛡️', title: 'Heat protection', body: 'Creates a light protective barrier against heat tools — but is not a substitute for a dedicated heat protectant above 180°C.' },
      { icon: '🌿', title: 'Scalp-free application', body: 'Applied only to mid-lengths and ends. Using on the scalp will cause greasiness — it is a finishing oil, not a treatment oil.' },
    ],
    bestFor: 'Post-wash finishing on all hair types, especially wavy and frizz-prone',
    frequency: 'After every wash (1–2 drops on damp hair, leave-in)',
  },
  Jojoba: {
    emoji: '🌼',
    tagline: "The oil that mimics your scalp's own sebum",
    color: 'rgba(240,204,96,0.08)',
    borderColor: 'rgba(240,204,96,0.22)',
    science: "Jojoba is technically a liquid wax, not an oil — and this makes it uniquely compatible with human sebum. Its molecular structure is so similar to the natural wax esters produced by scalp sebaceous glands that the scalp recognises it as its own. This means it regulates oil production, soothes inflammation, and is virtually non-comedogenic.",
    benefits: [
      { icon: '🔬', title: 'Sebum mimic', body: 'Structurally identical to scalp sebum — absorbs completely without residue and signals sebaceous glands to balance oil production.' },
      { icon: '⚖️', title: 'Scalp balance', body: 'Works for both oily and dry scalps — regulates oil glands that overproduce (oily) and replenishes moisture where glands underperform (dry).' },
      { icon: '🌿', title: 'Anti-inflammatory', body: 'Contains myristic acid and zinc — both with documented anti-inflammatory effects that soothe irritated, flaky, or sensitive scalp skin.' },
      { icon: '🧪', title: 'Best carrier for rosemary', body: 'Its neutral, non-comedogenic base makes it the ideal carrier to dilute rosemary essential oil for scalp application without clogging follicles.' },
      { icon: '💧', title: 'Lightweight hydration', body: 'Deeply moisturises without heaviness — safe for fine hair as a scalp treatment, unlike thicker oils that coat strands.' },
    ],
    bestFor: 'Scalp treatments, rosemary dilution, all hair types',
    frequency: '1× per week (pre-wash scalp treatment, or as needed)',
  },
  Coconut: {
    emoji: '🥥',
    tagline: 'Powerful ends treatment — use with care',
    color: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.15)',
    science: 'Coconut oil is high in lauric acid — a medium-chain fatty acid with a small molecular size that can penetrate the hair shaft. Clinical studies show it reduces protein loss from hair better than mineral oil or sunflower oil. However, for fine or wavy hair, overuse causes protein overload — the hair becomes stiff, brittle, and prone to breakage as the shaft becomes over-saturated.',
    benefits: [
      { icon: '🛡️', title: 'Protein loss prevention', body: 'Lauric acid binds to hair protein (keratin) and partially penetrates the cortex, significantly reducing the amount of protein lost during washing.' },
      { icon: '💧', title: 'Deep end conditioning', body: 'A small amount on dry, split ends can dramatically improve their feel and appearance, sealing damaged cuticle edges temporarily.' },
      { icon: '⚠️', title: 'Fine hair caution', body: 'Fine and wavy hair is prone to protein overload. Signs: hair feels straw-like, loses elasticity, snaps instead of stretches. Use 1–2 drops, ends only.' },
      { icon: '⏱️', title: '20-minute maximum', body: 'Unlike penetrating oils, coconut oil can cause protein buildup over long exposures on fine hair. Set a timer and always shampoo out fully.' },
      { icon: '📅', title: 'Once every 2 weeks maximum', body: 'Appears only in Week B of your rotation to enforce the right frequency. Do not use outside your scheduled rotation day.' },
    ],
    bestFor: 'Dry, porous, or thick hair. Use with strict frequency limits on fine/wavy hair.',
    frequency: 'Once every 2 weeks maximum (Week B only, ends only)',
  },
};

function getMonthWeeks(year, monthIdx) {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDow = (new Date(year, monthIdx, 1).getDay() + 6) % 7;
  const weeks = [];
  let week = Array(7).fill(null);
  let day = 1;
  for (let d = firstDow; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
  weeks.push([...week]);
  while (day <= daysInMonth) {
    week = Array(7).fill(null);
    for (let d = 0; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
    weeks.push([...week]);
  }
  return weeks;
}

function OilDayModal({ day, monthIdx, year, oils, dayName, onClose }) {
  const dateLabel = `${DAY_NAMES[dayName]}, ${MONTH_NAMES[monthIdx]} ${day}`;
  const isRest = oils.length === 0;
  return (
    <div className="oil-modal-overlay" onClick={onClose}>
      <div className="oil-modal" onClick={e => e.stopPropagation()}>
        <button className="oil-modal-close" onClick={onClose}>✕</button>
        <div className="oil-modal-date">{dateLabel}</div>
        {isRest ? (
          <div className="oil-modal-rest">
            <div className="oil-modal-rest-icon">🌿</div>
            <p className="oil-modal-rest-text">Rest day — no oils today.</p>
            <p className="oil-modal-rest-sub">Let your scalp breathe and recover. 🌸</p>
          </div>
        ) : (
          <>
            <div className="oil-modal-oils-row">
              {oils.map(o => (
                <span key={o.n} className="oil-modal-chip">{o.e} {o.n}</span>
              ))}
            </div>
            {oils.map(o => {
              const g = OIL_GUIDE[o.n];
              if (!g) return null;
              return (
                <div key={o.n} className="oil-modal-card">
                  <div className="oil-modal-card-title">{g.emoji} {o.n} Oil</div>
                  <p className="oil-modal-card-how">{g.how}</p>
                  <p className="oil-modal-card-tip">💡 {g.tip}</p>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

function OilBenefitsPage({ oilName, onBack }) {
  const b = OIL_BENEFITS[oilName];
  if (!b) return null;
  return (
    <div className="section">
      <button className="ag-detail-back" onClick={onBack}>← Back to Body</button>
      <div className="oil-detail-header splash-item" style={{ borderColor: b.borderColor, background: b.color }}>
        <div className="oil-detail-emoji">{b.emoji}</div>
        <h2 className="oil-detail-title">{oilName} Oil</h2>
        <p className="oil-detail-tagline">{b.tagline}</p>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🔬 The Science</div>
        <p className="ag-detail-body">{b.science}</p>
      </div>
      <div className="divider splash-item">Key Benefits</div>
      {b.benefits.map((benefit, i) => (
        <div key={i} className="oil-benefit-card splash-item">
          <span className="oil-benefit-icon">{benefit.icon}</span>
          <div>
            <div className="oil-benefit-title">{benefit.title}</div>
            <p className="oil-benefit-body">{benefit.body}</p>
          </div>
        </div>
      ))}
      <div className="g-card splash-item" style={{ marginTop: 8 }}>
        <div className="ag-detail-section-title">💆 How to Use</div>
        <p className="ag-detail-body">{OIL_GUIDE[oilName]?.how}</p>
      </div>
      <div className="oil-detail-meta splash-item">
        <div className="oil-detail-meta-row">
          <span className="oil-detail-meta-label">Best for</span>
          <span className="oil-detail-meta-value">{b.bestFor}</span>
        </div>
        <div className="oil-detail-meta-row">
          <span className="oil-detail-meta-label">Frequency</span>
          <span className="oil-detail-meta-value">{b.frequency}</span>
        </div>
        <div className="oil-detail-meta-row">
          <span className="oil-detail-meta-label">Pro tip</span>
          <span className="oil-detail-meta-value">💡 {OIL_GUIDE[oilName]?.tip}</span>
        </div>
      </div>
    </div>
  );
}

function OilRotationCalendar({ onSelectOil }) {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const today = now.getDate();
  const weeks = getMonthWeeks(year, monthIdx);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const [selected, setSelected] = useState(null);

  const counts = { Camellia: 0, Rosemary: 0, Argan: 0, Jojoba: 0, Coconut: 0 };
  weeks.forEach((week, wi) => {
    const wType = wi % 2;
    week.forEach((day, di) => {
      if (!day) return;
      OIL_SCHEDULE[wType][di].forEach(o => { counts[o.n]++; });
    });
  });

  return (
    <div className="oil-rotation splash-item">
      {selected && (
        <OilDayModal
          day={selected.day}
          monthIdx={monthIdx}
          year={year}
          oils={selected.oils}
          dayName={selected.dayName}
          onClose={() => setSelected(null)}
        />
      )}
      <div className="oil-rot-month-label">
        {MONTH_NAMES[monthIdx]} {year}
        <span className="oil-rot-cal-hint"> · Tap any date to see your oil guide</span>
      </div>
      <div className="oil-rot-cal">
        <div className="oil-rot-cal-header">
          {DAY_LETTERS.map(d => <div key={d} className="oil-rot-dh">{d}</div>)}
        </div>
        {weeks.map((week, wi) => {
          const wType = wi % 2;
          return (
            <div key={wi} className="oil-rot-cal-week">
              {week.map((day, di) => {
                if (!day) return <div key={di} className="oil-rot-day oil-rot-day-empty" />;
                const oils = OIL_SCHEDULE[wType][di];
                const isToday = day === today;
                const bg = oils.length > 0 ? OIL_COLORS[oils[0].n] : 'transparent';
                return (
                  <button
                    key={di}
                    className={`oil-rot-day oil-rot-day-btn${oils.length === 0 ? ' oil-rot-day-rest' : ''}${isToday ? ' oil-rot-day-today' : ''}`}
                    style={{ background: isToday ? undefined : bg }}
                    onClick={() => setSelected({ day, oils, dayName: di })}
                    aria-label={`${MONTH_NAMES[monthIdx]} ${day}`}
                  >
                    <span className="oil-rot-day-num">{day}</span>
                    <div className="oil-rot-day-oils">
                      {oils.map(o => (
                        <span key={o.n} className="oil-rot-day-em" title={o.n}>{o.e}</span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      <div className="oil-rot-summary">
        <div className="oil-rot-summary-label">Your {MONTH_NAMES[monthIdx]} sessions — {daysInMonth} days</div>
        <div className="oil-rot-summary-grid">
          {Object.entries(counts).map(([name, n]) => (
            <button key={name} className="oil-rot-summary-item oil-rot-summary-btn" onClick={() => onSelectOil(name)}>
              <span className="oil-rot-summary-em">
                {name === 'Camellia' ? '🌸' : name === 'Rosemary' ? '🌿' : name === 'Argan' ? '✨' : name === 'Jojoba' ? '🌼' : '🥥'}
              </span>
              <span className="oil-rot-summary-name">{name}</span>
              <span className="oil-rot-summary-count">{n}×</span>
            </button>
          ))}
        </div>
        <p className="oil-rot-summary-tap-hint">Tap an oil above to learn its benefits →</p>
      </div>
    </div>
  );
}

function HairTab({ onSelectOil }) {
  return (
    <>
      <div className="s-header" style={{ paddingTop: 0 }}>
        <div className="s-tag">Wavy · Thin Strands</div>
        <p className="s-desc">Your monthly oil rotation calendar — tap any date to see which oils to use and how to apply them.</p>
      </div>
      <div className="divider divider-center splash-item">2-Week Oil Rotation</div>
      <OilRotationCalendar onSelectOil={onSelectOil} />
      <div className="note-box note-rose splash-item">
        🚫 <strong>Avoid for thin strands:</strong> castor oil, sweet almond oil (too heavy), sleeping without a silk cap on oiling nights, brushing dry wavy hair, and coconut oil more than once every 2 weeks. A silk pillowcase alone reduces breakage and frizz noticeably every single night.
      </div>
    </>
  );
}

/* ─── Underarm Routine ─── */
function UnderarmRoutine() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        Korean beauty has cracked the underarm code — the same ingredients that brighten your face work even faster here. Results in 4–6 weeks with consistent use. Key rule: actives on dry skin only, evening only.
      </div>

      <RoutineStep num="1" cat="First Step — Exfoliate (3–4× per week, evening)" name="AHA / Glycolic Acid Pads" open={openStep==='1'} onToggle={() => tog('1')}>
        <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['AHA', 'BHA', 'PHA', 'Dark Spot', 'Pore Clearing']} why="The triple-acid toner that works on underarms. Saturate a cotton pad and swipe over completely dry underarms. AHA exfoliates dead skin causing darkening, BHA penetrates pores, PHA is gentle enough for sensitive skin. One of the most-used Korean products for underarm brightening on Shopee PH." />
        <ProductCard brand="Medicube" name="Zero Pore Pad 2.0" badges={['AHA', 'BHA', 'Panthenol', 'Dual-Sided']} why="Pre-soaked dual-sided pads — textured side to exfoliate, smooth side to soothe. Panthenol repairs the barrier while acids work. Visible results in 10–14 days. Available on YesStyle and Olive Young Global." />
        <ProductCard brand="The Ordinary" name="Glycolic Acid 7% Toning Solution" badges={['Glycolic Acid 7%', 'AHA', 'Budget', 'Dark Spot']} why="Budget cult classic. Apply with a cotton pad on completely dry underarms. Hugely popular on TikTok and Reddit specifically for underarm darkening. Available on Shopee PH, Lazada, and BeautyMNL at a very low price point." />
        <div className="step-note">Apply to completely dry underarms — glycolic acid on damp skin stings. Never within 24 hours of shaving. Start 1× per week and build to 3–4× over 4 weeks.</div>
      </RoutineStep>

      <RoutineStep num="2" cat="Second Step — Brighten (daily, after acid has absorbed)" name="Niacinamide Serum" open={openStep==='2'} onToggle={() => tog('2')}>
        <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Serum" badges={['Niacinamide 2%', 'Yuja Vitamin C', 'Brightening', 'Dark Spot']} why="Niacinamide + yuja fruit (a Korean citrus packed with Vitamin C) = the dual brightening approach. Niacinamide blocks melanin transfer while yuja fades existing dark spots. Apply 3–4 drops after your acid step has absorbed. One of the most-recommended Korean serums specifically for underarm darkening." />
        <ProductCard brand="COSRX" name="Niacinamide 15% Face Serum" badges={['Niacinamide 15%', 'High-Strength', 'Barrier Support']} why="High-strength niacinamide — 2 drops patted into underarms after exfoliation. Regulates melanin, reduces inflammation-related darkening, and strengthens the skin barrier. Use on nights when you skip acid." />
        <ProductCard brand="Beauty of Joseon" name="Glow Serum Propolis + Niacinamide" badges={['Propolis 60%', 'Niacinamide 2%', 'Soothing', 'Gentle']} why="The gentler option — propolis calms post-shaving irritation while niacinamide works on pigmentation. Best for sensitive underarms or your first 2 weeks." />
        <div className="step-note">Wait 5 minutes after your acid step before applying serum. Use one serum — not two at the same time. Store serums in a cool, dark place.</div>
      </RoutineStep>

      <RoutineStep num="3" cat="Third Step — Repair (every night)" name="Barrier Repair Cream" open={openStep==='3'} onToggle={() => tog('3')}>
        <ProductCard brand="Etude" primary name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Barrier Repair', 'Anti-Inflammatory']} why="Panthenol heals the skin barrier and stops the dark-spot cycle caused by friction damage. Madecassoside calms the inflammation that drives underarm pigmentation. Apply a generous layer after serum every night — this is what protects skin between active treatments." />
        <ProductCard brand="Dr. Jart+" name="Cicapair Tiger Grass Color Correcting Treatment" badges={['Centella', 'Calming', 'Barrier Restore']} why="Centella asiatica (tiger grass) calms post-acid and post-shaving inflammation. Restores skin barrier overnight. Apply a pea-sized amount after your brightening serum." />
        <ProductCard brand="CeraVe" name="Moisturizing Cream" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free', 'Barrier Repair']} why="Most accessible option — ceramides repair the moisture barrier stripped by acid exfoliation. Available at any Watsons or Mercury Drug in the Philippines." />
        <div className="step-note">Morning: skip all actives. Apply only a fragrance-free moisturiser, then your whitening deodorant on top.</div>
      </RoutineStep>

      <div className="divider divider-center splash-item">Daytime — Whitening Deodorant</div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Organic Skin Japan (OSJ) — Intensive Whitening Underarm Deo Mist</div>
        <p className="ag-detail-body">The standout Filipino-Korean product for daytime. Contains Glutathione + Alpha Arbutin + Niacinamide + Kojic Acid + Vitamin C — five brightening actives in one deodorant spray. Works as your deodorant AND your daytime treatment so you get consistent active exposure without adding a step. One of the top-ranked underarm products on Shopee PH and Calyxta.</p>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li>Apply to completely dry underarms after showering</li>
          <li>Hold 10–15 cm away and mist evenly — let dry 30 seconds before dressing</li>
          <li>Use every morning, replaces your regular deodorant entirely</li>
          <li>Alternative: <strong>Belo Intense White Deo Spray</strong> — available at any Mercury Drug or Watsons PH</li>
        </ul>
        <div className="pc-find">🛍 <strong>Find it:</strong> Search "Organic Skin Japan Whitening Deo Mist" on Shopee PH, Lazada, or Calyxta.</div>
      </div>

      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        ⚠️ <strong>Shaving vs. waxing:</strong> Shaving creates friction and tiny nicks that trigger inflammation-driven darkening — a main cause of underarm pigmentation. Waxing removes hair from the root with less surface friction and results last 3–4 weeks. If you shave, always use shaving cream, shave in the direction of hair growth, and wait 24 hours before any actives. Long-term, waxing or laser produces noticeably better skin tone.
      </div>
    </>
  );
}

/* ─── Teeth Routine ─── */
function TeethRoutine() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        A complete teeth routine covers four things: daily mechanical cleaning, remineralisation with hydroxyapatite, whitening, and gum health. Do these consistently and you won't need expensive dental whitening treatments.
      </div>

      <div className="divider divider-center splash-item">☀️ Morning Routine</div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Step 1 — Oil Pulling (10–15 min, before anything else)</div>
        <ul className="ag-detail-list">
          <li>Take 1 tablespoon of virgin coconut oil on an empty stomach — before brushing, before drinking water</li>
          <li>Swish gently (not vigorously — your jaw will tire) for 10–15 minutes while you shower or get dressed</li>
          <li>Spit into the trash, never the sink — coconut oil solidifies in pipes and causes clogs</li>
          <li>Rinse mouth with warm water, then proceed to brushing</li>
          <li>Do 3–5× per week — it does not need to be daily</li>
        </ul>
        <p className="ag-detail-body" style={{ marginTop: 8 }}>Oil pulling traps fat-soluble bacteria in the mouth that are linked to bad breath, gum inflammation, and surface staining — pulling them out reduces bacteria at the source. 3–5× per week is enough to see results over 4–8 weeks.</p>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Step 2 — Brush with Hydroxyapatite Toothpaste (2 min)</div>
        <ul className="ag-detail-list">
          <li>Soft-bristle toothbrush at a 45° angle to the gumline — gentle circular strokes, never hard scrubbing</li>
          <li>Brush all surfaces: outer, inner, and chewing surfaces of every tooth, plus the tongue</li>
          <li><strong>Do NOT rinse with water after brushing</strong> — spit only, and leave the toothpaste film on teeth. This lets hydroxyapatite continue remineralising enamel for 30+ minutes</li>
        </ul>
        <div className="note-box note-rose" style={{ margin: '12px 0 0' }}>
          💡 <strong>Why hydroxyapatite?</strong> Your tooth enamel is made of hydroxyapatite (HA) crystals. Fluoride toothpaste creates a protective layer; HA toothpaste directly deposits new crystals into micro-lesions and early cavities — it rebuilds enamel rather than just coating it. It also whitens naturally by filling surface irregularities that scatter light.
        </div>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Step 3 — Floss or Water Flosser</div>
        <ul className="ag-detail-list">
          <li>Floss between every tooth — reach below the gumline with a C-shape around each tooth</li>
          <li>Or use a water flosser (Waterpik or any Shopee brand) for 60 seconds along the gumline — easier to maintain daily</li>
          <li>Flossing removes plaque no toothbrush can reach — skipping it leaves 35% of tooth surfaces uncleaned</li>
        </ul>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Step 4 — Tongue Scraper</div>
        <ul className="ag-detail-list">
          <li>Use a metal or plastic tongue scraper — not your toothbrush (it pushes bacteria around rather than removing it)</li>
          <li>Start at the back of the tongue, pull forward with light pressure — 5–7 strokes, rinsing scraper between each</li>
          <li>Tongue bacteria are the #1 cause of bad breath — this single step makes the biggest difference</li>
        </ul>
      </div>

      <div className="divider divider-center splash-item">🌙 Night Routine</div>
      <div className="g-card splash-item">
        <ul className="ag-detail-list">
          <li><strong>Floss first</strong> — remove food debris before brushing so toothpaste can reach all surfaces</li>
          <li><strong>Brush 2 minutes</strong> with hydroxyapatite toothpaste — same 45° angle technique</li>
          <li><strong>Do not rinse</strong> — spit only. Overnight is your longest remineralisation window</li>
          <li><strong>No eating or drinking</strong> (except plain water) after brushing</li>
        </ul>
      </div>

      <div className="divider divider-center splash-item">🧂 Salt Water Rinse</div>
      <div className="g-card splash-item">
        <p className="ag-detail-body">Salt water rinse is a targeted treatment — not a daily step. Use it for gum irritation, mouth sores, or sensitivity flare-ups.</p>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>How to Make It</div>
        <ul className="ag-detail-list">
          <li>½ teaspoon fine salt dissolved in 240 ml warm water</li>
          <li>Swish gently 30 seconds — spit, do not swallow</li>
          <li>Rinse with plain water after, then brush — use it before brushing, not after</li>
        </ul>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>When to Use</div>
        <ul className="ag-detail-list">
          <li>Gum soreness or bleeding gums</li>
          <li>After tooth extraction — wait 24 hours first</li>
          <li>Canker sores or mouth ulcers</li>
          <li>Use 2–3× per week until the issue resolves</li>
        </ul>
      </div>

      <div className="divider divider-center splash-item">✨ Whitening Strips — Schedule</div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Before You Start</div>
        <ul className="ag-detail-list">
          <li>Use Sensodyne for 2 weeks before starting a course — builds potassium nitrate in dentinal tubules and significantly reduces whitening sensitivity</li>
          <li>Do not use if you have untreated cavities, active gum disease, or dental veneers on front teeth — consult your dentist first</li>
          <li>Brush your teeth 30 minutes BEFORE applying strips — fluoride right before temporarily reduces whitening effectiveness</li>
          <li>Dry teeth with a tissue before applying — strips adhere far better to dry enamel</li>
        </ul>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>Applying</div>
        <ul className="ag-detail-list">
          <li>Peel strip from backing — gel side faces teeth</li>
          <li>Align the straight edge with your gumline — do not overlap onto gum tissue</li>
          <li>Press firmly and fold excess behind teeth</li>
          <li>Leave on for the directed time (usually 30 min for standard, 60 min for express strips)</li>
          <li>Do not eat, drink, or talk with strips on</li>
        </ul>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>After</div>
        <ul className="ag-detail-list">
          <li>Peel off and discard — never reuse</li>
          <li>Rinse with water, then wait 30 minutes before brushing — enamel is softened directly after whitening</li>
          <li>Avoid coffee, tea, berries, and tomato sauce for 1 hour after</li>
          <li>Sensitivity tip: apply a small amount of Sensodyne directly to teeth after strips, leave 5 min, then rinse</li>
        </ul>
      </div>
      <div className="g-card splash-item">
        <div className="ag-detail-section-title">Frequency</div>
        <div className="prod-item"><div className="prod-badge">Course</div><div><div className="prod-name">Once daily for 14–20 days (standard) or 7–10 days (express 1-hour strips)</div><div className="prod-why">One course per quarter — every 3 months — maintains noticeably white teeth without over-whitening or enamel damage.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Maintenance</div><div><div className="prod-name">1–2 strips per month after completing a course</div><div className="prod-why">Maintains your result between courses without committing to a full 2-week treatment.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sensitivity</div><div><div className="prod-name">Skip a day on high-sensitivity days and resume the next</div><div className="prod-why">Sensitivity is temporary and resolves within 24 hours — pushing through will cause more harm than skipping a day.</div></div></div>
      </div>

      <div className="divider divider-center splash-item">🛍 Products</div>
      <div className="g-card splash-item">
        <div className="prod-item"><div className="prod-badge">HA Toothpaste ★</div><div><div className="prod-name">Apagard Premio — Japanese, most clinically studied HA formula</div><div className="prod-why">The original hydroxyapatite toothpaste from Japan. Remineralises micro-cavities, whitens naturally, reduces sensitivity. Search "Apagard Premio" on Shopee PH or Lazada — widely available and affordable.</div></div></div>
        <div className="prod-item"><div className="prod-badge">HA Toothpaste</div><div><div className="prod-name">Boka Ela Mint — US brand, popular on TikTok and Reddit</div><div className="prod-why">Clean-ingredient HA formula loved by dentists and remineralisation communities. Available on iHerb (ships to PH).</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sensitivity</div><div><div className="prod-name">Sensodyne Pronamel or Rapid Relief</div><div className="prod-why">Use for 2 weeks before any whitening course and throughout. Available at Mercury Drug, Watsons, and Shopee PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Oil Pulling</div><div><div className="prod-name">Virgin or refined coconut oil — 1 tablespoon per session</div><div className="prod-why">Refined coconut oil has a neutral taste if virgin is too strong. Any grocery brand works — no special formulation needed.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Whitening ★</div><div><div className="prod-name">Crest 3D Whitestrips Professional Effects</div><div className="prod-why">Most effective OTC whitening strip available. Search on Shopee PH, Lazada, or iHerb. Look for Professional Effects or Glamorous White variants.</div></div></div>
      </div>
    </>
  );
}

/* ─── Makeup Routine ─── */
function MakeupRoutine() {
  const [openStep, setOpenStep] = useState(null);
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        The secret to non-cakey makeup: less product, more prep. Your skincare the night before and morning of matters more than any foundation formula. Below is the full step-by-step with holy-grail products — then Goddess Extras at the bottom for features that make you look effortlessly high-maintenance.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 16 }}>
        <div className="ag-detail-section-title">The Charlotte Tilbury Sandwich Hack — Used by MUAs Globally</div>
        <p className="ag-detail-body">Spritz setting spray on bare skin → skincare + primer + foundation → spritz setting spray → powder T-zone only → final setting spray. Three spray layers melt all products into skin so nothing looks powdery or cakey. Foundation sits inside the skin, not on top of it.</p>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li><strong>Damp beauty sponge always</strong> — bouncing, never dragging. Dry sponge = cakey without exception</li>
          <li>Powder the T-zone only — never powder cheeks or nose if you want a skin-like finish</li>
          <li>Apply foundation in thin layers and build only where needed</li>
          <li>Hydrate skin the night before any important makeup day — plump, hydrated skin holds makeup longer</li>
          <li><strong>Skin flooding:</strong> toner → essence → serum → moisturiser (all absorbed) = the plumpest possible base</li>
        </ul>
      </div>

      <RoutineStep num="1" cat="Base Prep" name="Skincare First" open={openStep==='1'} onToggle={() => tog('1')}>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li>Full AM skincare routine — cleanser, toner, serum, moisturiser</li>
          <li>Wait 5–10 minutes for skincare to fully absorb before touching makeup</li>
          <li>Apply SPF 50+ — non-negotiable even under makeup</li>
          <li>Optional: mix 1–2 drops of facial oil into moisturiser for an extra glow base</li>
          <li><strong>Ice roll for 2 minutes</strong> before moisturiser on important days — minimises pores and reduces puffiness significantly before any base goes on</li>
        </ul>
        <div className="step-note">Never skip the wait time — applying primer over still-wet skincare causes pilling and uneven blending.</div>
      </RoutineStep>

      <RoutineStep num="2" cat="Primer" name="Grip + Blur Primer" open={openStep==='2'} onToggle={() => tog('2')}>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">e.l.f. Power Grip Primer</div><div className="prod-why">Thick, tacky gel with glycerin + hyaluronic acid that grips makeup and holds it in place all day. TikTok-viral as the closest budget match to Milk Hydro Grip at a fraction of the price. Available on Shopee PH and BeautyMNL.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Splurge</div><div><div className="prod-name">Charlotte Tilbury Airbrush Flawless Primer</div><div className="prod-why">Blurs and grips — specifically designed for the CT sandwich hack. Gives a soft-focus, filter-like finish before any base product. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Milk Makeup Hydro Grip Primer</div><div className="prod-why">The original hydration-grip primer with blue agave + niacinamide. Lighter texture than e.l.f. — great for dry skin types.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li>Press — do not rub — with a damp beauty sponge over T-zone and visible pores</li>
          <li>Allow 1–2 minutes to set before applying foundation</li>
          <li>Match formula: silicone primer under silicone-based foundation, water-based under water-based</li>
        </ul>
        <div className="step-note">Primer is critical in Philippine heat and humidity — it prevents foundation from sliding and separating throughout the day.</div>
      </RoutineStep>

      <RoutineStep num="3" cat="Foundation" name="Your Skin But Better" open={openStep==='3'} onToggle={() => tog('3')}>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Charlotte Tilbury Airbrush Flawless Foundation</div><div className="prod-why">Medium coverage, skin-like satin finish. Feels weightless — looks like your skin, not like makeup. Designed for the sandwich hack system and blends like water. Available at Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Armani Beauty Luminous Silk Foundation</div><div className="prod-why">The iconic silk finish. Sheer-to-medium buildable coverage that looks like filtered skin. Serum-like texture, virtually weightless. The gold standard for "your skin but better" worldwide. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">Maybelline Fit Me Matte + Poreless Foundation</div><div className="prod-why">The most accessible non-cakey foundation available in the Philippines. Breathable, buildable — blend with a damp sponge for the most skin-like result. Available at Watsons, SM Beauty, and Shopee PH.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li>Apply in small dots to the centre of the face and blend outward — never start at the edges</li>
          <li>Blend downward on fine facial hair to avoid reverse-brushed texture</li>
          <li>Build coverage only where needed — under-eyes, around the nose, any redness</li>
          <li>On good skin days: skin tint or BB cream instead of full foundation</li>
        </ul>
        <div className="step-note">Start with less — easier to build than to remove. A damp sponge makes any foundation look 10× more seamless.</div>
      </RoutineStep>

      <RoutineStep num="4" cat="Concealer" name="Spot & Under-Eye" open={openStep==='4'} onToggle={() => tog('4')}>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">NARS Radiant Creamy Concealer</div><div className="prod-why">Consistently ranked the world's most popular concealer — radiant, creamy, skin-like finish. Does not crease or look heavy. Used by Alix Earle and featured in virtually every professional MUA tutorial. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Rare Beauty Liquid Touch Brightening Concealer</div><div className="prod-why">Lightweight, natural finish, buildable — loved for not settling into fine lines. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">Maybelline Fit Me Concealer</div><div className="prod-why">Breathable and lightweight — TikTok users consistently rate it as a near-perfect dupe for NARS. Available everywhere in the Philippines.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li>Apply in an inverted triangle under the eyes — not just a small crescent</li>
          <li>Blend downward and outward with a damp sponge or ring finger</li>
          <li>Tap — never drag — onto blemishes with a small flat brush</li>
          <li>Set immediately with translucent powder to prevent creasing</li>
        </ul>
        <div className="step-note">The inverted triangle shape brightens the entire under-eye area and visually lifts the face — not just covers darkness.</div>
      </RoutineStep>

      <RoutineStep num="5" cat="Setting Powder" name="Lock — T-Zone Only" open={openStep==='5'} onToggle={() => tog('5')}>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Laura Mercier Translucent Loose Setting Powder</div><div className="prod-why">Used by professional makeup artists worldwide. Sets without adding coverage or altering finish — invisible on all skin tones. Over-powdering the whole face is the most common cause of cakey makeup. Apply to T-zone and under-eyes only.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Laneige Neo Blurring Powder</div><div className="prod-why">TikTok-trending K-Beauty powder — blurs pores and blends makeup seamlessly without over-mattifying. Soft-focus result. Available on YesStyle and Shopee PH.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li><strong>T-zone only</strong> — forehead, nose bridge, chin. Never powder cheeks or nose for a dewy, skin-like finish</li>
          <li>Use a fluffy brush — tap off all excess before applying</li>
          <li>"Baking" the under-eye: press powder generously under eyes, leave 5 min, then dust off — concealer stays crease-free all day</li>
        </ul>
        <div className="step-note">Powder kills the finish on cheeks. The secret is restraint — less powder = more skin-like.</div>
      </RoutineStep>

      <RoutineStep num="6" cat="Contour & Blush" name="Sculpt & Flush" open={openStep==='6'} onToggle={() => tog('6')}>
        <div className="prod-item"><div className="prod-badge">★ Blush</div><div><div className="prod-name">Rare Beauty Soft Pinch Liquid Blush</div><div className="prod-why">The viral liquid blush. One tiny dot goes incredibly far — highly pigmented but buildable. Melts into skin and looks like you're genuinely flushed, not painted. Available at Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">★ Contour</div><div><div className="prod-name">Charlotte Tilbury Filmstar Bronze & Glow</div><div className="prod-why">Dual-pan bronzer + highlighter. The bronze shade is perfect for natural contouring — cool-toned and buildable. Glow side adds a lit-from-within highlight. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Budget Blush</div><div><div className="prod-name">e.l.f. Halo Glow Blush Beauty Wand</div><div className="prod-why">Liquid blush stick — easy to blend, no tools needed, natural flush. Available on Shopee PH.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li><strong>Contour:</strong> cool-toned matte bronzer in hollows of cheeks, temples, and jawline — blend until no harsh lines remain</li>
          <li><strong>Blush:</strong> apply high on cheekbones, blend upward toward temples for a lifted look</li>
          <li>For sun-kissed: sweep blush lightly across the nose bridge</li>
          <li>Tap off excess before each application — heavy blush is difficult to soften</li>
        </ul>
        <div className="step-note">For a lifted look: apply blush high on the cheekbones close to the temples — not on the round of the cheeks.</div>
      </RoutineStep>

      <RoutineStep num="7" cat="Eyes" name="Eye Makeup" open={openStep==='7'} onToggle={() => tog('7')}>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li><strong>Brows:</strong> fill sparse areas with a micro-pen brow pencil using light feathery strokes — set with clear or tinted brow gel. Budget duo: e.l.f. Instant Lift Brow Pencil + NYX Control Freak</li>
          <li><strong>Eyeshadow:</strong> matte neutral across the lid, slightly darker in the crease, blend with a fluffy brush</li>
          <li><strong>Tightline:</strong> dark liner along the upper waterline for maximum definition without visible liner weight</li>
          <li><strong>Mascara:</strong> if not lash-lifted — 1–2 coats from root to tip with a zigzag motion at the base</li>
          <li><strong>If lash-lifted + tinted:</strong> 1 light coat of clear mascara or skip entirely</li>
        </ul>
        <div className="step-note">Lash lift + tint eliminates most of the eye routine — fill brows and you are camera-ready.</div>
      </RoutineStep>

      <RoutineStep num="8" cat="Lips" name="Lip Look" open={openStep==='8'} onToggle={() => tog('8')}>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li>Exfoliate lips 2× per week with a sugar scrub (1 tsp honey + 1 tsp sugar) for a smooth base</li>
          <li>Apply nourishing lip balm 5 minutes before any lip colour</li>
          <li>For everyday: MLBB tinted balm or lipstick (1–2 shades deeper than your natural lip colour)</li>
          <li>For defined lips: line with a matching lip liner just outside the natural lip line, fill in, then apply lipstick on top</li>
          <li>A dot of peppermint gloss in the centre of the lips adds a natural plump effect</li>
        </ul>
        <div className="step-note">MLBB (my lips but better) = your lips enhanced, not covered. The most flattering everyday lip.</div>
      </RoutineStep>

      <RoutineStep num="9" cat="Set & Finish" name="Setting Spray — Final Lock" open={openStep==='9'} onToggle={() => tog('9')}>
        <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Urban Decay All Nighter Setting Spray</div><div className="prod-why">Holds makeup for up to 16 hours with zero melting or fading — the #1 rated setting spray globally by MUAs and TikTok. Especially effective in heat and humidity. The final lock layer of the CT sandwich hack. Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">MAC Fix+</div><div className="prod-why">Not a traditional setting spray — blends and melts products into skin for a natural, refreshed finish. Also use it to dampen your sponge before blending foundation for an ultra-seamless result. MAC counters, Sephora PH.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">e.l.f. Power Grip Dewy Setting Spray</div><div className="prod-why">Extends the Power Grip primer system — locks and adds a hydrated glow. Available on Shopee PH.</div></div></div>
        <ul className="ag-detail-list" style={{ marginTop: 12 }}>
          <li>Hold 25–30 cm from face, mist in an X then T pattern over finished makeup</li>
          <li>Let dry completely — do not touch face or fan while setting</li>
          <li>For dewy finish: hydrating formula. For long wear in heat: matte or oil-control formula</li>
          <li>Light translucent powder on T-zone first, then setting spray over everything = all-day wear in Manila heat</li>
        </ul>
        <div className="step-note">Setting spray is the single biggest difference between makeup that lasts 2 hours and makeup that lasts all day.</div>
      </RoutineStep>

      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        🌸 <strong>Makeup removal is skincare:</strong> Never sleep in makeup. Micellar water or cleansing balm first, then your full double-cleanse PM routine. One night of sleeping in makeup significantly sets back your skin results.
      </div>

      {/* ── GODDESS EXTRAS ── */}
      <div className="divider splash-item" style={{ marginTop: 32 }}>👑 Goddess Extras</div>
      <p className="s-desc splash-item" style={{ marginBottom: 16 }}>High-maintenance looking features that are actually low-effort to maintain once you set them up. These are the real shortcuts to looking effortlessly done.</p>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">✨ Lash Lift + Tint</div>
        <p className="ag-detail-body">The highest ROI single beauty treatment. Curls your natural lashes from the root — wider, more open eyes with zero daily effort. Paired with a tint it eliminates mascara almost entirely. Results last 6–8 weeks.</p>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>Before Your Appointment</div>
        <ul className="ag-detail-list">
          <li>Come with completely clean, dry lashes — zero mascara, oil, or eye makeup</li>
          <li>No waterproof mascara for 48 hours before</li>
          <li>Do not curl lashes with a heated curler the day before</li>
          <li>Remove contact lenses before the treatment</li>
        </ul>
        <div className="ag-detail-section-title" style={{ marginTop: 12 }}>After — 48-Hour Rule</div>
        <ul className="ag-detail-list">
          <li>Keep lashes completely dry for 48 hours — no water, steam, sweat, or humidity</li>
          <li>No mascara, eye makeup, or eye cream near lashes for 48 hours</li>
          <li>Sleep on your back for the first 2 nights</li>
          <li>After 48 hours: apply a nourishing lash serum nightly to strengthen lashes between treatments</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🫧 Face Lifting — Daily Non-Surgical Methods</div>
        <ul className="ag-detail-list">
          <li><strong>Gua sha daily (5 min, morning):</strong> lift from jaw to ear, neck to chin, brow to hairline — always upward and outward strokes. Reduces puffiness by draining lymph. Visible difference within 2–3 weeks of daily use</li>
          <li><strong>Ice rolling (2 min before makeup):</strong> roll on cheeks, jaw, and brow area immediately before moisturiser — closes pores, tightens skin, reduces morning puffiness dramatically. Store roller in the freezer</li>
          <li><strong>Mewing:</strong> rest your entire tongue flat against the roof of your mouth at all times — correct tongue posture that naturally defines the jaw and cheekbones over months</li>
          <li><strong>Makeup contouring for a lifted look:</strong> highlight only the centre of the face (nose bridge, cupid's bow, inner eye corners, centre of forehead, chin tip) — keep temples and jaw matte. Centre-lit face always reads as more lifted and structured</li>
          <li><strong>Blush placement:</strong> apply high on the cheekbones close to the temples (not on the round of the cheeks) — this visually pulls the face upward</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🤎 Brow Lamination + Darker Brows</div>
        <p className="ag-detail-body">Brow lamination slicks brows upward and sets them in place for 6–8 weeks — the fluffy, full, brushed-up look without daily effort. It is the eyebrow version of a lash lift. Darker brows frame the face and make features look more defined without any other makeup.</p>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li><strong>Brow lamination:</strong> any brow salon, lasts 6–8 weeks, can be tinted darker at the same appointment</li>
          <li><strong>At-home soap brows (daily):</strong> wet a spoolie, drag it across a clear glycerin soap bar, brush brows upward — holds all day with no stiffness or smell. Same result as lamination, for free</li>
          <li><strong>For darker brows:</strong> e.l.f. Instant Lift Brow Pencil (micro-pen, feathery strokes) + NYX Control Freak clear brow gel = the most natural-looking full brow on a budget</li>
          <li><strong>Microblading:</strong> semi-permanent, lasts 1–2 years — fills sparse areas with hair-stroke tattoo marks. Consult a certified technician</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">💋 Full, Defined Lips</div>
        <ul className="ag-detail-list">
          <li><strong>Sugar scrub 2× per week:</strong> 1 tsp sugar + 1 tsp honey, massage lips in circular motion for 1 min, rinse — makes lips look visibly fuller and smoother</li>
          <li><strong>Overline technique:</strong> lip liner 1 mm just outside the natural lip line, concentrate on the cupid's bow and centre of lower lip — blend inward so there is no visible line</li>
          <li><strong>Peppermint gloss:</strong> a dot in the centre of the lower lip creates a temporary plumping effect — adds fullness without filler</li>
          <li><strong>Highlight the cupid's bow:</strong> a tiny swipe of shimmer highlight directly on the cupid's bow makes lips look more defined and lifted</li>
          <li><strong>Overnight hydration:</strong> Laneige Lip Sleeping Mask every night — wakes up with noticeably softer, plumper lips by morning</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🌊 Glass Skin Before Makeup — The Night Before Trick</div>
        <ul className="ag-detail-list">
          <li><strong>Slugging the night before:</strong> full PM skincare → wait to absorb → thin layer of CeraVe Healing Ointment or Vaseline over everything. Creates an occlusive seal — skin wakes up plump, bouncy, and glass-like. Foundation applies effortlessly and lasts longer on this base</li>
          <li><strong>Morning ice water dunk:</strong> fill a bowl with cold water + ice cubes, submerge your face for 10 seconds, repeat 3× — tightens skin, closes pores, reduces puffiness before any makeup</li>
          <li><strong>Skin flooding:</strong> on no-makeup or light-makeup days, layer hydration in thin coats (toner → essence → serum → moisturiser, all absorbed) — skin looks naturally beautiful and dewy with just a skin tint + setting spray</li>
        </ul>
      </div>
    </>
  );
}

/* ─── Tab config ─── */
function resolveInitial(initialTab) {
  if (initialTab === 'pm')       return { top: 'evening',  mSub: 'face', eSub: 'face' };
  if (initialTab === 'body')     return { top: 'morning',  mSub: 'body', eSub: 'face' };
  if (initialTab === 'retinoid') return { top: 'retinoid', mSub: 'face', eSub: 'face' };
  if (initialTab === 'hair')     return { top: 'hair',     mSub: 'face', eSub: 'face' };
  if (initialTab === 'makeup')   return { top: 'makeup',   mSub: 'face', eSub: 'face' };
  if (initialTab === 'teeth')    return { top: 'teeth',    mSub: 'face', eSub: 'face' };
  if (initialTab === 'underarm') return { top: 'underarm', mSub: 'face', eSub: 'face' };
  return { top: 'morning', mSub: 'face', eSub: 'face' };
}

const TOP_TABS = [
  { id: 'morning',   label: '☀️ Morning' },
  { id: 'evening',   label: '🌙 Evening' },
  { id: 'retinoid',  label: '✨ Retinoid' },
  { id: 'antiaging', label: '🌿 Anti-Aging' },
  { id: 'hair',      label: '💆 Hair' },
  { id: 'underarm',  label: '🌟 Underarm' },
  { id: 'teeth',     label: '🦷 Teeth' },
  { id: 'makeup',    label: '💄 Makeup' },
];

const SUB_TABS = [
  { id: 'face', label: '💆 Face' },
  { id: 'body', label: '🫧 Body' },
];

export default function Skincare({ initialTab }) {
  const init = resolveInitial(initialTab);
  const [topTab, setTopTab]     = useState(init.top);
  const [mSub,   setMSub]       = useState(init.mSub);
  const [eSub,   setESub]       = useState(init.eSub);
  const [agSelected, setAgSelected] = useState(null);
  const [selectedOil, setSelectedOil] = useState(null);

  function switchTop(id) {
    setTopTab(id);
    setAgSelected(null);
    setSelectedOil(null);
  }

  if (selectedOil) {
    return <OilBenefitsPage oilName={selectedOil} onBack={() => setSelectedOil(null)} />;
  }

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Your Complete Body Protocol</div>
        <h2 className="s-title">Body <em>Care</em></h2>
        <p className="s-desc">Face · Body · Hair · Makeup · Teeth · Underarm — everything in one place.</p>
      </div>

      <div className="note-box note-gold splash-item" style={{ marginBottom: 20 }}>
        🛍 <strong>Where to buy:</strong> All products are available in the Philippines on <strong>Shopee</strong>, <strong>Lazada</strong>, and <strong>Watsons</strong>. Search the exact product name shown on each card. Most are under ₱500–₱1,200.
      </div>

      <div className="sk-top-tabs splash-item">
        {TOP_TABS.map(t => (
          <button key={t.id} className={`sk-top-tab${topTab === t.id ? ' active' : ''}`} onClick={() => switchTop(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {topTab === 'morning' && (
        <>
          <div className="sk-tabs splash-item">
            {SUB_TABS.map(s => (
              <button key={s.id} className={`sk-tab${mSub === s.id ? ' active' : ''}`} onClick={() => setMSub(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          {mSub === 'face' && <AMFace />}
          {mSub === 'body' && <BodyMorning />}
        </>
      )}

      {topTab === 'evening' && (
        <>
          <div className="sk-tabs splash-item">
            {SUB_TABS.map(s => (
              <button key={s.id} className={`sk-tab${eSub === s.id ? ' active' : ''}`} onClick={() => setESub(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          {eSub === 'face' && <PMFace />}
          {eSub === 'body' && <BodyEvening />}
        </>
      )}

      {topTab === 'retinoid'  && <Retinoid />}

      {topTab === 'antiaging' && (
        <AntiAgingTab
          selected={agSelected}
          onSelect={setAgSelected}
          onBack={() => setAgSelected(null)}
        />
      )}

      {topTab === 'hair'     && <HairTab onSelectOil={setSelectedOil} />}
      {topTab === 'underarm' && <UnderarmRoutine />}
      {topTab === 'teeth'    && <TeethRoutine />}
      {topTab === 'makeup'   && <MakeupRoutine />}
    </div>
  );
}
