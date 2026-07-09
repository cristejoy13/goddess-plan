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
  'Crest':            '#0055b3',
  'Oral-B':           '#0070c4',
  'Listerine':        '#c8a000',
  'TheraBreath':      '#3a7a5a',
  'Colgate':          '#c83030',
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
        ☀️ Morning goal: cleanse, hydrate, protect. Do NOT over-strip reactive skin. SPF minimises pores and prevents dark spots.
      </div>
      <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser" open={openStep==='1'} onToggle={() => tog('1')}>
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Tea Tree', 'Fragrance-Free']} why="pH 5.0 matches the skin barrier. Cleanses without stripping redness-prone skin." />
        <ProductCard brand="Beauty of Joseon" name="Relief Foam Cleanser (Rice + Probiotics)" badges={['Rice Extract', 'Probiotics', 'Fragrance-Free', 'Ultra-Gentle']} why="Gentle rice foam for reactive redness. Use on sensitive or irritated mornings." />
        <div className="step-note">Use lukewarm water only. Hot water weakens the barrier. Cleanse 30 seconds, then pat dry.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner" open={openStep==='2'} onToggle={() => tog('2')}>
        <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Toner" badges={['Niacinamide 2%', 'Yuja Extract', 'Brightening', 'Pore-Minimising']} why="Niacinamide regulates sebum, reduces redness, and brightens uneven tone. Expect full results in 4–8 weeks." />
        <ProductCard brand="COSRX" name="AHA/BHA Clarifying Treatment Toner" badges={['Willow Bark BHA', 'AHA', 'Pore-Clearing']} why="Willow bark BHA exfoliates inside pores. Use 3–4× per week, alternating with niacinamide." />
        <ProductCard brand="The Ordinary" name="Niacinamide 10% + Zinc 1%" badges={['Niacinamide 10%', 'Zinc', 'Budget-Friendly', 'Pore-Minimising']} why="Budget higher-strength niacinamide. Apply 2–3 drops after cleansing. Shopee and Lazada." />
        <div className="step-note">Pat in gently; never rub. Niacinamide needs 4–8 weeks of daily use.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence" open={openStep==='3'} onToggle={() => tog('3')}>
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Barrier Repair', 'Redness Calming']} why="Repairs barrier, calms redness, speeds texture healing, and hydrates without grease." />
        <ProductCard brand="Missha" name="Time Revolution First Treatment Essence" badges={['Fermented Yeast', 'Niacinamide', 'Skin Luminosity']} why="Fermented niacinamide improves absorption, clarity, and glow over 4–6 weeks." />
        <div className="step-note">Press in with palms. Pat 3–5 times until absorbed.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum" open={openStep==='4'} onToggle={() => tog('4')}>
        <ProductCard brand="Some By Mi" primary name="Galactomyces Pure Vitamin C Glow Serum" badges={['Vitamin C', 'Galactomyces', 'Brightening', 'UV Protection']} why="Vitamin C brightens post-pimple marks, protects against UV damage, and gradually fades uneven pigmentation. Use 4–5× per week in the morning." />
        <ProductCard brand="Beauty of Joseon" name="Glow Serum (Propolis + Niacinamide)" badges={['Propolis 60%', 'Niacinamide 2%', 'Calming', 'Gentle']} why="Gentler Month 1 option. Propolis calms redness while niacinamide works on pores." />
        <div className="step-note">Use the Joseon serum for your first month while your barrier strengthens. Introduce Vitamin C in Month 2 — start 2× per week and build up.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser" open={openStep==='5'} onToggle={() => tog('5')}>
        <ProductCard brand="COSRX" primary name="Oil-Free Ultra Moisturizing Lotion (with Birch Sap)" badges={['Oil-Free', 'Non-Comedogenic', 'Birch Sap', 'Lightweight']} why="Hydrates without clogging or heaviness. Good for oily-prone skin." />
        <ProductCard brand="Etude" name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Redness Repair']} why="Use on reactive days. Panthenol repairs the barrier and calms redness." />
        <div className="step-note">Apply while skin is slightly damp to lock hydration in.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Final Step — Never Skip This ☀️" name="Sunscreen SPF 50+ PA++++" open={openStep==='6'} onToggle={() => tog('6')}>
        <ProductCard brand="Beauty of Joseon" primary name="Relief Sun: Rice + Probiotics SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Probiotics', 'Zero White Cast', 'Sensitive Skin']} why="For reactive skin. Probiotics calm, rice brightens, and it leaves zero white cast." />
        <ProductCard brand="Round Lab" name="Birch Juice Moisturizing Sun Cream SPF 50+" badges={['SPF 50+', 'Birch Juice', 'Hydrating', 'Moisturiser + SPF']} why="Hydrating sunscreen that doubles as moisturiser on minimal-layer days." />
        <div className="step-note">⚠️ UV enlarges pores, worsens redness, and blocks active results. Apply generously. Reapply every 2 hours outdoors.</div>
      </RoutineStep>
      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        📅 <strong>Saturday AM:</strong> Clay mask before shower, then full routine. <strong>Saturday PM:</strong> Retinol (Month 2+) + Gua Sha after moisturiser. <strong>Wednesday PM:</strong> Gua Sha after moisturiser.
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
        🌙 Night goal: cleanse, exfoliate congestion, and repair the barrier while skin regenerates.
      </div>
      <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser" open={openStep==='1'} onToggle={() => tog('1')}>
        <ProductCard brand="Banila Co" primary name="Clean It Zero Cleansing Balm (Purifying)" badges={['BHA', 'Pore-Decongesting', 'SPF Remover', 'Purifying']} why="BHA helps decongest pores while removing SPF and pollution." />
        <ProductCard brand="DHC" name="Deep Cleansing Oil" badges={['Olive Oil Base', 'Deep Pore Cleanse', 'Oil-Based']} why="Olive-based oil cleanser. Pulls oil-based congestion from pores." />
        <div className="step-note">Apply to DRY skin. Massage 60–90 seconds, emulsify with water, then rinse.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser" open={openStep==='2'} onToggle={() => tog('2')}>
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Gentle', 'Double Cleanse']} why="Removes oil-cleanser residue and keeps skin at the right pH." />
        <div className="step-note">Double cleanse nightly to improve congestion and texture in 3–4 weeks.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner" open={openStep==='3'} onToggle={() => tog('3')}>
        <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['BHA', 'AHA', 'PHA', 'Pore Clearing', 'Texture Smoothing']} why="BHA penetrates pores and dissolves congestion. Use 3–4 nights per week." />
        <ProductCard brand="Paula's Choice" name="2% BHA Liquid Exfoliant" badges={['Salicylic Acid 2%', 'Gold Standard BHA', 'Pore-Clearing']} why="Strong BHA for pores and texture. Search Shopee or Lazada." />
        <div className="step-note">Start 2× per week in Month 1. Build to 3–4×. On non-BHA nights, use hydrating toner or essence.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence" open={openStep==='4'} onToggle={() => tog('4')}>
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Post-Exfoliation Repair', 'Redness Calming']} why="Repairs after BHA, calms redness, and supports overnight regeneration." />
        <div className="step-note">Use especially on BHA nights to reduce irritation.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Rotation Schedule" name="Treatment Rotation" open={openStep==='5'} onToggle={() => tog('5')}>
        <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner — Some By Mi AHA BHA PHA or Paula's Choice 2% BHA</div><div className="prod-why">Clear congestion and unclog pores.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum — Some By Mi 10% Niacinamide · Alt: COSRX Niacinamide 15% or The Ordinary Niacinamide 10%+Zinc</div><div className="prod-why">Minimise pores and strengthen barrier.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% — The Inkey List Retinol Serum · Alt: Mediheal Retinol or Rohto Melano CC Retinol</div><div className="prod-why">Start Saturday only once barrier is strong.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest night only</div><div className="prod-why">Zero actives. Let the barrier recover.</div></div></div>
        <div className="step-note">⚠️ Never use BHA and retinol on the same night. Never use retinol and AHA on the same night. One active at a time — always.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Sixth Step" name="Eye Care" open={openStep==='6'} onToggle={() => tog('6')}>
        <ProductCard brand="Some By Mi" primary name="Eye Serum" badges={['Peptides', 'Puffiness Reducing', 'Dark Circles']} why="Peptides reduce puffiness and visible dark circles. Pat — never rub." />
        <ProductCard brand="Innisfree" name="Jeju Cherry Blossom Eye Cream" badges={['Cherry Blossom Extract', 'Brightening', 'Asian Skin']} why="Brightens and moisturises under-eyes. Use ring finger pressure only." />
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
        🫧 Treat body skin consistently. Build soft, smooth skin over 4–8 weeks.
      </div>
      <RoutineStep num="1" cat="In The Shower" name="Cleanse & Exfoliate" open={openStep==='1'} onToggle={() => tog('1')}>
        <div className="note-box note-rose" style={{ marginBottom: 12, marginTop: 0 }}>
          🌡️ Use warm water, never hot. Hot water strips oils and weakens the barrier. Finish with a 30-second cooler rinse.
        </div>
        <ProductCard brand="Human Nature" primary name="Naturals Body Wash — Sunflower" badges={['Sulfate-Free', 'Moisturising', 'Filipino Brand', 'Gentle']} why="Gentle sulfate-free wash with sunflower oil. Cleanses without stripping body skin." />
        <ProductCard brand="Dove" name="Sensitive Skin Body Wash" badges={['Fragrance-Free', 'Hypoallergenic', 'Moisture Seal']} why="Contains ¼ moisturising cream. Good for reactive skin or after sun." />
        <div className="step-note">🪥 Dry brush 2× per week BEFORE shower (Sunday + Wednesday): firm upward circles from feet toward heart.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="St. Ives" name="Oatmeal & Shea Butter Body Scrub" badges={['Physical Exfoliant', '2× per week', 'Texture Smoothing']} why="Buffs dull, rough patches. Use Sunday and Wednesday after body wash." />
        </div>
        <div className="step-note">Exfoliate Sunday and Wednesday only. Over-exfoliating irritates and damages the barrier.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="After Shower — Before Going Out" name="Seal & Protect" open={openStep==='2'} onToggle={() => tog('2')}>
        <div className="step-note" style={{ marginBottom: 12 }}>⏱️ Apply body moisturiser within 2 minutes after showering, while skin is damp.</div>
        <ProductCard brand="CeraVe" primary name="Moisturizing Cream (body)" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free', '24-Hour Hydration']} why="Ceramides repair the barrier. Non-greasy daily body hydration." />
        <ProductCard brand="Human Nature" name="Naturals Intensive Moisturizer" badges={['Sunflower Oil', 'Non-Greasy', 'Lightweight', 'Filipino Brand']} why="Fast-absorbing and non-sticky for humid Philippine weather." />
        <div className="step-note">🦵 Use a thicker layer on elbows, knees, and heels.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Biore" name="UV Aqua Rich Watery Essence SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Lightweight', 'No White Cast']} why="Apply to exposed arms, neck, décolletage, and legs. Absorbs fast with no stickiness." />
        </div>
        <div className="step-note">⚠️ Body SPF is mandatory outdoors. Reapply every 2 hours. Protect neck and arms like your face.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Bio-Oil" name="Bio-Oil Skincare Oil" badges={['Vitamin A & E', 'Stretch Mark Fading', 'Scar Reduction', 'Skin Glow']} why="2–3 drops over moisturiser add glow and help fade marks. Pat, never rub." />
        </div>
        <div className="step-note">Layer order: moisturiser → absorb 1 min → 2–3 drops Bio-Oil.</div>
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
        <div className="step-note" style={{ marginBottom: 12 }}>🌙 Skin repairs most between 10 PM and 2 AM. Use richer products at night.</div>
        <ProductCard brand="Aveeno" primary name="Daily Moisturizing Lotion" badges={['Colloidal Oat', 'Soothing', 'Fragrance-Free', '24-Hour Repair']} why="Colloidal oatmeal soothes and repairs the barrier overnight." />
        <ProductCard brand="CeraVe" name="Moisturizing Cream (heavy layer)" badges={['Ceramides', 'Overnight Repair', 'Barrier Restoration']} why="Use a generous night layer for barrier repair." />
        <div className="step-note">🦶 Apply Vaseline on heels and elbows nightly after moisturiser. Expect smoother skin in 2–3 weeks.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Vaseline" name="Original Petroleum Jelly" badges={['Occlusive', 'Heel Repair', 'Elbow Softening', 'Fragrance-Free']} why="Seals moisture in. Apply on heels and elbows every night after moisturiser." />
        </div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="AmLactin" name="Daily Moisturizing Body Lotion" badges={['Lactic Acid 12%', 'AHA', 'Keratosis Pilaris', '1× per week']} why="Lactic acid smooths keratosis pilaris, texture, and uneven tone. Use Sunday evening only." />
        </div>
        <div className="step-note">AmLactin: Sunday evenings only (after your scrub day). Do not combine with Bio-Oil on the same night — one treatment at a time. Wash hands after applying.</div>
        <div style={{ marginTop: 12 }}>
          <ProductCard brand="Bio-Oil" name="Bio-Oil Evening Massage (2× per week)" badges={['Circulation Boost', 'Lymphatic Drainage', 'Firming', 'Tue + Fri']} why="Massage 5 minutes on Tuesday and Friday. Use long upward strokes on arms, thighs, and abdomen." />
        </div>
        <div className="step-note">Use 4–5 drops per area. Long strokes on limbs, small circles on abdomen. Apply AFTER moisturiser.</div>
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
        ✨ Start retinoids low and slow. Consistency beats intensity and protects your barrier.
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
        ⚠️ Never combine retinol with BHA or AHA. Never use retinoids during pregnancy. Night only. SPF next morning is mandatory.
      </div>
    </>
  );
}

/* ─── Anti-Aging ─── */
const AG_CARDS = [
  {
    ico: '🛌', t: 'Sleep — Master Hormone', group: 'Daily Rhythms',
    b: 'Sleep 7.5–9 hours. Deep sleep releases growth hormone for glutes and skin.',
    how: ['Sleep by 10 PM — key GH window is 10 PM to 2 AM','Keep your room completely dark and cool (18–21°C)','Stop screens at least 30 minutes before bed — blue light suppresses melatonin','Drink chamomile tea 30 minutes before sleep to lower cortisol','No food after 4 PM — digestion during sleep reduces GH secretion','Use a silk pillowcase — reduce face creases and hair breakage'],
    why: 'Deep sleep releases growth hormone for muscle, collagen, and body composition. Poor sleep raises cortisol and slows visible results.',
    when: 'Wind down at 9:30 PM. Lights out by 10 PM.',
  },
  {
    ico: '☀️', t: 'Morning Sunlight', group: 'Daily Rhythms',
    b: 'Get 10–20 min direct morning sunlight before 9 AM to anchor sleep, mood, and cortisol.',
    how: ['Go outside within 30–60 minutes of waking — daily','Look in the direction of the sun (not directly at it) for 10–20 minutes','No sunglasses — the light must reach your retinas to signal your brain','Walk slowly, stretch, or sit during light exposure','If outdoors is not possible, use a 10,000-lux daylight lamp for 20 min'],
    why: 'Morning light sets cortisol timing, supports serotonin, and helps melatonin release at night.',
    when: 'First thing in the morning, ideally before 8 AM.',
  },
  {
    ico: '🧠', t: 'Brain Health', group: 'Hormones & Mind',
    b: 'Eat omega-3 fish, eggs for choline, and ginger to support brain health.',
    how: ['Eat fatty fish (bangus, tuna, tanigue) 3× per week — omega-3 EPA and DHA','Eat eggs daily — yolks provide choline for learning','Add fresh ginger to your tea or cooking daily — gingerol reduces neuroinflammation','Add turmeric with black pepper to eggs or broth — curcumin is neuroprotective','Consider an omega-3 supplement (1–2g EPA+DHA) if fish intake is inconsistent','Protect sleep — 7.5+ hours clears brain waste overnight'],
    why: 'Omega-3 supports brain-cell membranes, while choline supports memory. Ginger and turmeric help reduce neuroinflammation.',
    when: 'Daily through food. Fish 3× weekly, eggs daily, ginger and turmeric in cooking.',
  },
  {
    ico: '🍃', t: 'Cortisol Management', group: 'Hormones & Mind',
    b: 'Lower cortisol to reduce belly fat and support skin, hair, and hormones over 8–12 weeks.',
    how: ['Drink chamomile tea 30 min before bed — clinically shown to reduce cortisol','Limit screens after 8 PM — blue light raises cortisol in the evening','Do pilates 2× per week — clinically proven to reduce cortisol more than any other exercise type','Never train hard on poor sleep — cortisol is already high, training raises it further','Take 10 deep slow breaths before meals — activates the parasympathetic nervous system','Get 10–20 min morning sunlight — correctly times cortisol peak to morning only','Eat regular meals with 4-hour gaps — erratic eating spikes cortisol'],
    why: 'Chronically high cortisol breaks down collagen, increases belly fat, disrupts hormones, and can worsen shedding.',
    when: 'All day. Combine chamomile, morning light, and pilates for 8–12 weeks.',
  },
  {
    ico: '🌸', t: 'Hormone-Protective Eating', group: 'Hormones & Mind',
    b: 'Eat eggs and healthy fats to support estrogen and progesterone production.',
    how: ['Eat eggs daily — yolk cholesterol supports steroid hormones','Use olive oil, avocado, and nuts at every meal — these fats are required for hormone synthesis','Remove processed foods completely — they contain xenoestrogens (synthetic estrogens) from packaging and additives','Remove dairy — A1 casein raises IGF-1 which disrupts the estrogen-progesterone balance','Add pumpkin seeds (zinc) — zinc is required for healthy progesterone levels','Eat fatty fish 3× weekly — omega-3 reduces the inflammatory prostaglandins that worsen PMS and period pain','Spearmint tea nightly — reduces androgenic hormones that cause excess sebum and acne'],
    why: 'Sex hormones are made from cholesterol and dietary fat. Processed foods can disrupt estrogen balance.',
    when: 'Every meal. Prioritize eggs, healthy fats, and whole foods.',
  },
  {
    ico: '✨', t: 'Skin Longevity Nutrients', group: 'Skin Longevity',
    b: 'Take collagen, Vitamin C, and omega-3 to support elastic, hydrated skin.',
    how: ['Take 5–10g collagen peptides (bovine or marine) dissolved in water daily with a Vitamin C source','Squeeze calamansi on everything — Vitamin C is the co-factor for every step of collagen synthesis','Eat papaya regularly — papain enzyme exfoliates from the inside, improving skin texture','Eat fatty fish 3× weekly — omega-3 reduces transepidermal water loss, keeping skin plump','Add a small handful of pumpkin seeds or walnuts — zinc for oil gland regulation and skin healing','Use collagen water at lunch and post-workout as your hydration with every training meal','Protect with SPF 50+ every single morning — UV exposure degrades collagen 3× faster than time alone'],
    why: 'Collagen supports structure and elasticity. Vitamin C helps synthesis, and SPF prevents the most visible aging.',
    when: 'Daily: collagen at meals, calamansi on food, SPF every morning. Fatty fish 3× weekly.',
  },
];
const AG_GROUPS = [
  { ico: '🌙', title: 'Daily Rhythms',   desc: 'Sleep & morning sunlight' },
  { ico: '🌿', title: 'Hormones & Mind', desc: 'Brain health · Cortisol · Hormone-protective eating' },
  { ico: '✨', title: 'Skin Longevity',  desc: 'Nutrients & supplements for visible results' },
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
        <p className="s-desc">Start early. Tap any topic for how, why, and when.</p>
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
        <p><span className="pill pg">Daily</span> Collagen peptides (bovine or marine) — in water with Vitamin C</p>
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
    how: 'Warm 3–5 drops, apply to scalp and mid-lengths, massage 5 minutes. Leave 45–60 min, then shampoo out — shampoo dry hair first.',
    tip: 'Your hero oil. Penetrates the shaft without weighing fine strands down.',
  },
  Rosemary: {
    emoji: '🌿',
    how: 'Use pre-diluted blend only — never apply rosemary neat. Apply to scalp parting lines, massage 5 min, leave 45–60 min, shampoo twice.',
    tip: 'Always diluted. Clinical studies show it matches minoxidil for density over 6 months.',
  },
  Argan: {
    emoji: '✨',
    how: 'Use 1–2 drops on damp hair after washing. Apply mid-length to ends — never scalp. Leave in and scrunch upward.',
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
    science: 'Camellia oil (Tsubaki) is 80–85% oleic acid, which can penetrate the cortex. It adds moisture and strength without weighing fine hair down.',
    benefits: [
      { icon: '💧', title: 'Deep shaft hydration', body: 'Oleic acid reaches the cortex and replenishes moisture.' },
      { icon: '🛡️', title: 'Reduces breakage', body: 'Strengthens strands and reduces mid-shaft splits.' },
      { icon: '✨', title: 'Frizz control without weight', body: 'Smooths cuticle and seals moisture without flattening waves.' },
      { icon: '🌿', title: 'Scalp health', body: 'Soothes dry, itchy scalp and supports follicles.' },
      { icon: '🌸', title: 'Wavy hair-safe', body: 'Does not cause protein overload on fine or wavy hair.' },
    ],
    bestFor: 'Fine, wavy, or colour-treated hair',
    frequency: '2–3× per week (pre-wash treatment)',
  },
  Rosemary: {
    emoji: '🌿',
    tagline: 'Clinically proven to match minoxidil for hair density',
    color: 'rgba(240,204,96,0.10)',
    borderColor: 'rgba(240,204,96,0.28)',
    science: 'A 2023 Skinmed trial found rosemary oil for 6 months matched 2% minoxidil hair count gains. Carnosic acid supports blood flow and helps inhibit DHT.',
    benefits: [
      { icon: '🩸', title: 'Increases scalp blood flow', body: 'Boosts microcirculation around active follicles.' },
      { icon: '🔬', title: 'DHT inhibition', body: 'Carnosic acid helps reduce DHT linked to thinning.' },
      { icon: '💪', title: 'Supports hair density', body: 'Hair-count gains appear after 6 months of consistent use.' },
      { icon: '🛡️', title: 'Antioxidant protection', body: 'Rosmarinic acid protects follicles from oxidative stress.' },
      { icon: '⚠️', title: 'Must always be diluted', body: 'Rosemary essential oil is potent. Never apply neat to skin. Always dilute in a carrier oil (jojoba or camellia) before applying.' },
    ],
    bestFor: 'Hair density support and seasonal shedding',
    frequency: '1–2× per week (always diluted, pre-wash)',
  },
  Argan: {
    emoji: '✨',
    tagline: 'Liquid gold for frizz, shine, and wave definition',
    color: 'rgba(255,232,122,0.10)',
    borderColor: 'rgba(255,232,122,0.3)',
    science: "Argan oil is rich in Vitamin E and unsaturated fatty acids. As a finishing oil, it coats the cuticle to seal moisture and smooth texture.",
    benefits: [
      { icon: '✨', title: 'Frizz elimination', body: 'Seals cuticle scales and blocks humidity frizz.' },
      { icon: '💎', title: 'Mirror-like shine', body: 'Vitamin E helps hair reflect light without silicone.' },
      { icon: '🌊', title: 'Wave definition', body: 'Scrunch into damp hair for soft wave clumps.' },
      { icon: '🛡️', title: 'Heat protection', body: 'Adds light protection, but use heat protectant above 180°C.' },
      { icon: '🌿', title: 'Scalp-free application', body: 'Use only mid-lengths and ends to avoid greasiness.' },
    ],
    bestFor: 'Post-wash finishing on all hair types, especially wavy and frizz-prone',
    frequency: 'After every wash (1–2 drops on damp hair, leave-in)',
  },
  Jojoba: {
    emoji: '🌼',
    tagline: "The oil that mimics your scalp's own sebum",
    color: 'rgba(240,204,96,0.08)',
    borderColor: 'rgba(240,204,96,0.22)',
    science: "Jojoba is a liquid wax close to scalp sebum. It helps balance oil, soothe inflammation, and avoid clogging.",
    benefits: [
      { icon: '🔬', title: 'Sebum mimic', body: 'Absorbs cleanly and helps balance oil production.' },
      { icon: '⚖️', title: 'Scalp balance', body: 'Works for oily and dry scalps.' },
      { icon: '🌿', title: 'Anti-inflammatory', body: 'Myristic acid and zinc soothe irritated scalp skin.' },
      { icon: '🧪', title: 'Best carrier for rosemary', body: 'Dilutes rosemary without clogging follicles.' },
      { icon: '💧', title: 'Lightweight hydration', body: 'Moisturises scalp without heaviness.' },
    ],
    bestFor: 'Scalp treatments, rosemary dilution, all hair types',
    frequency: '1× per week (pre-wash scalp treatment, or as needed)',
  },
  Coconut: {
    emoji: '🥥',
    tagline: 'Powerful ends treatment — use with care',
    color: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.15)',
    science: 'Coconut oil is high in lauric acid and reduces protein loss. On fine or wavy hair, overuse can cause protein overload: stiff, brittle, breakage-prone hair.',
    benefits: [
      { icon: '🛡️', title: 'Protein loss prevention', body: 'Lauric acid binds to keratin and reduces protein loss during washing.' },
      { icon: '💧', title: 'Deep end conditioning', body: 'A small amount softens dry, split ends temporarily.' },
      { icon: '⚠️', title: 'Fine hair caution', body: 'Fine and wavy hair is prone to protein overload. Signs: hair feels straw-like, loses elasticity, snaps instead of stretches. Use 1–2 drops, ends only.' },
      { icon: '⏱️', title: '20-minute maximum', body: 'Long exposure can cause buildup on fine hair. Set a timer and shampoo fully.' },
      { icon: '📅', title: 'Once every 2 weeks maximum', body: 'Use only on the scheduled Week B rotation day.' },
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
        <span className="oil-rot-cal-hint"> · Tap a date for oil guide</span>
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
        <p className="oil-rot-summary-tap-hint">Tap an oil for benefits →</p>
      </div>
    </div>
  );
}

function HairTab({ onSelectOil }) {
  return (
    <>
      <div className="s-header" style={{ paddingTop: 0 }}>
        <div className="s-tag">Wavy · Thin Strands</div>
        <p className="s-desc">Tap any date for oils and application steps.</p>
      </div>
      <div className="divider divider-center splash-item">2-Week Oil Rotation</div>
      <OilRotationCalendar onSelectOil={onSelectOil} />
      <div className="note-box note-rose splash-item">
        🚫 <strong>Avoid for thin strands:</strong> castor oil, sweet almond oil, oiling without a silk cap, dry brushing wavy hair, and coconut oil more than once every 2 weeks. Use a silk pillowcase nightly.
      </div>
    </>
  );
}

/* ─── Underarm Routine ─── */
function UnderarmRoutine() {
  const [sub, setSub] = useState('morning');
  const [openStep, setOpenStep] = useState(null);
  function switchSub(s) { setSub(s); setOpenStep(null); }
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  const UNDERARM_TABS = [
    { id: 'morning', label: '☀️ Morning' },
    { id: 'night',   label: '🌙 Night' },
  ];
  return (
    <>
      <div className="sk-tabs splash-item">
        {UNDERARM_TABS.map(t => (
          <button key={t.id} className={`sk-tab${sub === t.id ? ' active' : ''}`} onClick={() => switchSub(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'morning' && (
        <>
          <div className="note-box note-gold" style={{ marginBottom: 14 }}>
            Morning is simple: shower, dry completely, then apply whitening deo spray. Actives are evening-only.
          </div>
          <RoutineStep num="1" cat="After Shower" name="Pat Dry Completely" open={openStep==='u-m1'} onToggle={() => tog('u-m1')}>
            <ul className="ag-detail-list">
              <li>Shower as usual with gentle body wash</li>
              <li>Pat underarms completely dry with a clean towel — do not rub</li>
              <li>Wait 2–3 minutes if needed</li>
              <li>Damp skin weakens deodorant and brightening actives</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="2" cat="Daily · replaces deodorant" name="Apply Whitening Deo Mist" open={openStep==='u-m2'} onToggle={() => tog('u-m2')}>
            <ul className="ag-detail-list">
              <li>Hold the spray 10–15 cm away from the underarm</li>
              <li>Mist evenly across the entire area — 2–3 short bursts per side</li>
              <li>Wait 30 seconds for it to dry before pulling on clothing</li>
              <li>Replaces regular deodorant — controls odour and brightens</li>
              <li>Use every morning for visible brightening</li>
            </ul>
            <ProductCard brand="Organic Skin Japan" primary name="Intensive Whitening Underarm Deo Mist" badges={['Glutathione', 'Alpha Arbutin', 'Niacinamide', 'Kojic Acid', 'Vitamin C']} why="Five brightening actives in one deo-treatment spray. Search 'OSJ Whitening Deo Mist'." />
            <ProductCard brand="Luxe Organix" name="Belo Intense White Deo Spray" badges={['Whitening', 'Antiperspirant', 'PH Brand']} why="Filipino medical brand. Watsons PH and Mercury Drug — good starting option." />
            <div className="prod-item"><div className="prod-badge">Alt 2</div><div><div className="prod-name">Dove Advanced Care Sensitive Antiperspirant</div><div className="prod-why">Fragrance-free, hypoallergenic — best for very sensitive skin or after waxing. Available everywhere in PH.</div></div></div>
          </RoutineStep>
        </>
      )}

      {sub === 'night' && (
        <>
          <div className="note-box note-gold" style={{ marginBottom: 14 }}>
            Three steps: exfoliate → brighten → repair. Use actives on dry skin only. Results in 4–6 weeks.
          </div>
          <RoutineStep num="1" cat="3–4× per week · dry skin only" name="Exfoliate — AHA / Glycolic Acid" open={openStep==='u-n1'} onToggle={() => tog('u-n1')}>
            <ul className="ag-detail-list">
              <li>Underarms must be completely dry — glycolic on damp skin stings</li>
              <li>Saturate a cotton pad and swipe once across each underarm — do not scrub</li>
              <li>Never within 24 hours of shaving — wait until skin heals</li>
              <li>Week 1: 1× only. Build to 3–4× per week over 4 weeks</li>
            </ul>
            <div className="step-note">Exfoliates the dead skin causing dark spots. Slow build prevents irritation.</div>
            <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['AHA', 'BHA', 'PHA', 'Dark Spot']} why="Triple-acid toner — most-used Korean product for underarm brightening. Shopee PH, Lazada." />
            <ProductCard brand="The Ordinary" name="Glycolic Acid 7% Toning Solution" badges={['Glycolic Acid 7%', 'AHA', 'Budget']} why="Budget cult classic. Apply with cotton pad. Shopee PH, Lazada, BeautyMNL." />
            <ProductCard brand="Medicube" name="Zero Pore Pad 2.0" badges={['AHA', 'BHA', 'Panthenol', 'Dual-Sided']} why="Pre-soaked pads — no cotton needed. YesStyle and Olive Young Global." />
          </RoutineStep>
          <RoutineStep num="2" cat="Daily · 5 min after exfoliant" name="Brighten — Niacinamide Serum" open={openStep==='u-n2'} onToggle={() => tog('u-n2')}>
            <ul className="ag-detail-list">
              <li>Wait 5 minutes after the acid step before applying</li>
              <li>Apply 3–4 drops, pat gently — do not rub</li>
              <li>Niacinamide fades dark spots over 4–8 weeks</li>
              <li>On nights you skip acid, still apply the serum alone</li>
            </ul>
            <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Serum" badges={['Niacinamide 2%', 'Yuja Vitamin C', 'Dark Spot']} why="Niacinamide + yuja Vitamin C for underarm brightening. Shopee PH, Lazada." />
            <ProductCard brand="COSRX" name="Niacinamide 15% Face Serum" badges={['Niacinamide 15%', 'High-Strength']} why="High-concentration niacinamide — 2 drops patted in. Use on nights you skip acid." />
            <ProductCard brand="Beauty of Joseon" name="Glow Serum Propolis + Niacinamide" badges={['Propolis 60%', 'Niacinamide 2%', 'Soothing']} why="Gentler option — best for sensitive skin or first 2 weeks." />
          </RoutineStep>
          <RoutineStep num="3" cat="Every night · seals everything in" name="Repair — Barrier Cream" open={openStep==='u-n3'} onToggle={() => tog('u-n3')}>
            <ul className="ag-detail-list">
              <li>Apply a generous layer after the serum absorbs</li>
              <li>Seals actives and reduces friction inflammation overnight</li>
              <li>Keep the barrier intact so brightening actives work</li>
            </ul>
            <ProductCard brand="Etude" primary name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Barrier Repair']} why="Panthenol heals friction damage, madecassoside calms post-acid inflammation. Makes all other actives work faster." />
            <ProductCard brand="Dr. Jart+" name="Cicapair Tiger Grass Color Correcting Treatment" badges={['Centella', 'Calming', 'Barrier Restore']} why="Centella calms post-shaving and post-acid inflammation overnight." />
            <ProductCard brand="CeraVe" name="Moisturizing Cream" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free']} why="Most accessible — ceramides repair the barrier. Watsons or Mercury Drug PH." />
          </RoutineStep>
          <div className="note-box note-rose" style={{ marginTop: 8 }}>
            ⚠️ <strong>Shaving vs. waxing:</strong> Shaving can trigger darkening through friction and nicks. Waxing causes less damage; laser is best long-term. If shaving: use cream, go with the grain, and wait 24 hours before actives.
          </div>
        </>
      )}
    </>
  );
}

/* ─── Teeth Routine ─── */
function TeethRoutine() {
  const [sub, setSub] = useState('morning');
  const [openStep, setOpenStep] = useState(null);
  function switchSub(s) { setSub(s); setOpenStep(null); }
  function tog(id) { setOpenStep(p => p === id ? null : id); }
  const TEETH_TABS = [
    { id: 'morning',   label: '☀️ Morning' },
    { id: 'night',     label: '🌙 Night' },
    { id: 'saltwater', label: '🧂 Salt Water' },
    { id: 'whitening', label: '✨ Whitening' },
  ];
  return (
    <>
      <div className="sk-tabs splash-item">
        {TEETH_TABS.map(t => (
          <button key={t.id} className={`sk-tab${sub === t.id ? ' active' : ''}`} onClick={() => switchSub(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {sub === 'morning' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          Morning routine: oil pull, brush with HA toothpaste, and protect gums.
        </div>
        <RoutineStep num="1" cat="Before anything else · 3–5× per week" name="Oil Pulling" open={openStep==='t-m1'} onToggle={() => tog('t-m1')}>
          <ul className="ag-detail-list">
            <li>1 tablespoon coconut oil on empty stomach — before brushing or drinking water</li>
            <li>Swish gently for 10–15 minutes while showering or getting dressed</li>
            <li>Spit into the trash — never the sink (oil solidifies in pipes)</li>
            <li>Rinse with warm water, then proceed to brushing</li>
          </ul>
          <div className="step-note">Targets bacteria linked to bad breath, gum inflammation, and stains. 3–5× per week is enough.</div>
        </RoutineStep>
        <RoutineStep num="2" cat="Every morning · 2 min" name="Brush with HA Toothpaste" open={openStep==='t-m2'} onToggle={() => tog('t-m2')}>
          <ul className="ag-detail-list">
            <li>Soft-bristle brush at 45° to the gumline — gentle circular strokes, never hard scrubbing</li>
            <li>All surfaces: outer, inner, chewing, and the tongue</li>
            <li><strong>Do NOT rinse after</strong> — spit only. Leaving the film allows HA to remineralise enamel for 30+ min</li>
          </ul>
          <div className="step-note">💡 HA toothpaste remineralises micro-lesions and smooths surface irregularities for natural whitening.</div>
          <ProductCard brand="Apagard" primary name="Apagard Premio Toothpaste" badges={['Hydroxyapatite', 'Remineralising', 'Whitening', 'Japanese']} why="Clinically studied HA toothpaste. Remineralises, whitens naturally, and reduces sensitivity." />
          <ProductCard brand="Boka" name="Boka Ela Mint Toothpaste" badges={['Nano-Hydroxyapatite', 'Fluoride-Free']} why="Nano-HA for deeper enamel penetration. Popular in dentist communities. iHerb ships to PH." />
          <ProductCard brand="Sensodyne" name="Sensodyne Pronamel Mineral Boost" badges={['Enamel Strengthening', 'Sensitivity', 'Fluoride']} why="Familiar brand. Use for 2 weeks before any whitening course. Watsons and Mercury Drug PH." />
        </RoutineStep>
        <RoutineStep num="3" cat="Every morning" name="Floss or Water Flosser" open={openStep==='t-m3'} onToggle={() => tog('t-m3')}>
          <ul className="ag-detail-list">
            <li>C-shape around each tooth, reach below the gumline</li>
            <li>Or water flosser 60 seconds along the gumline — easier to keep as a daily habit</li>
            <li>Skipping flossing leaves 35% of tooth surfaces uncleaned</li>
          </ul>
        </RoutineStep>
        <RoutineStep num="4" cat="Every morning · 30 seconds" name="Tongue Scraper" open={openStep==='t-m4'} onToggle={() => tog('t-m4')}>
          <ul className="ag-detail-list">
            <li>Metal or plastic scraper — not your toothbrush (it moves bacteria rather than removes it)</li>
            <li>5–7 strokes from back to front, rinse scraper between each</li>
            <li>Tongue bacteria = #1 source of bad breath — biggest payoff per second spent</li>
          </ul>
        </RoutineStep>
      </>}

      {sub === 'night' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          Night routine: floss first, brush with HA paste, and leave it on overnight.
        </div>
        <RoutineStep num="1" cat="Before brushing · every night" name="Floss First" open={openStep==='t-n1'} onToggle={() => tog('t-n1')}>
          <ul className="ag-detail-list">
            <li>Floss between every tooth — C-shape around each, reach below the gumline</li>
            <li>Removes food debris so HA toothpaste can reach all surfaces during brushing</li>
            <li>Flossing at night is more important than in the morning — food has been sitting there all day</li>
          </ul>
        </RoutineStep>
        <RoutineStep num="2" cat="Every night · 2 min" name="Brush with HA Toothpaste" open={openStep==='t-n2'} onToggle={() => tog('t-n2')}>
          <ul className="ag-detail-list">
            <li>Same 45° gentle circular technique as morning</li>
            <li><strong>Do not rinse</strong> — spit only. Overnight is your longest enamel repair window</li>
            <li>No eating or drinking (except water) after brushing</li>
            <li>Optional: salt water rinse before brushing if gums feel sore tonight</li>
          </ul>
          <div className="step-note">HA stays on enamel overnight for your longest remineralisation window.</div>
          <ProductCard brand="Apagard" primary name="Apagard Premio Toothpaste" badges={['Hydroxyapatite', 'Overnight Remineralisation', 'Whitening']} why="Most effective overnight — HA film repairs micro-damage during sleep. Same paste as morning. Shopee PH, Lazada." />
          <ProductCard brand="Boka" name="Boka Ela Mint Toothpaste" badges={['Nano-Hydroxyapatite', 'Fluoride-Free']} why="Nano-HA for deeper overnight penetration. iHerb ships to PH." />
          <ProductCard brand="Oral-B" name="Oral-B iO Series Electric Toothbrush" badges={['Pressure Sensor', 'Round Head', 'Gum Health']} why="Pressure sensor prevents hard brushing. Round head reaches gumline well. Shopee PH." />
        </RoutineStep>
      </>}

      {sub === 'saltwater' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          Salt water rinse is a targeted treatment — not a daily step. Use it for gum irritation, sores, or sensitivity. Always before brushing, never after.
        </div>
        <RoutineStep num="1" cat="When needed" name="Prepare the Rinse" open={openStep==='t-s1'} onToggle={() => tog('t-s1')}>
          <ul className="ag-detail-list">
            <li>½ teaspoon fine salt dissolved in 240 ml warm water</li>
            <li>Stir until fully dissolved — use immediately while warm</li>
            <li>Make fresh every time — do not store leftover rinse</li>
          </ul>
          <div className="prod-item"><div className="prod-badge">★ Best</div><div><div className="prod-name">Fine sea salt or iodized table salt — DIY rinse</div><div className="prod-why">½ tsp in warm water, fresh every use. Any grocery-brand fine salt works. Under ₱50 at any Philippine supermarket. Most effective and most accessible.</div></div></div>
          <ProductCard brand="TheraBreath" name="TheraBreath Oral Rinse (Alcohol-Free)" badges={['Dentist-Developed', 'Alcohol-Free', 'Fluoride-Free']} why="Pre-made rinse for consistent concentration — convenient ready-to-use alternative to DIY. iHerb ships to PH." />
          <ProductCard brand="Listerine" name="Listerine Zero Alcohol Mouthwash" badges={['Alcohol-Free', 'Bacteria-Killing', 'No Burning']} why="Kills bacteria without burning or dryness. Watsons and Mercury Drug PH." />
        </RoutineStep>
        <RoutineStep num="2" cat="Before brushing" name="Rinse Technique" open={openStep==='t-s2'} onToggle={() => tog('t-s2')}>
          <ul className="ag-detail-list">
            <li>Swish gently for 30 seconds, covering all areas of the mouth</li>
            <li>Spit completely — do not swallow</li>
            <li>Rinse once with plain water, then brush as normal</li>
          </ul>
        </RoutineStep>
        <RoutineStep num="3" cat="Reference" name="When to Use" open={openStep==='t-s3'} onToggle={() => tog('t-s3')}>
          <ul className="ag-detail-list">
            <li>Gum soreness or bleeding gums — 2–3× per week until resolved</li>
            <li>After tooth extraction — wait 24 hours first</li>
            <li>Canker sores or mouth ulcers</li>
            <li>Post-whitening sensitivity — soothing rinse before you brush</li>
          </ul>
        </RoutineStep>
      </>}

      {sub === 'whitening' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          One course every 3 months keeps teeth noticeably white without over-whitening. Always prep with Sensodyne for 2 weeks before starting.
        </div>
        <RoutineStep num="1" cat="2 weeks before starting a course" name="Prep — Sensitivity Protection" open={openStep==='t-w1'} onToggle={() => tog('t-w1')}>
          <ul className="ag-detail-list">
            <li>Use Sensodyne for 2 weeks before — builds potassium nitrate in dentinal tubules, significantly reduces sensitivity during whitening</li>
            <li>Do not use strips if you have untreated cavities, active gum disease, or veneers on front teeth — consult a dentist first</li>
          </ul>
          <ProductCard brand="Sensodyne" primary name="Sensodyne Pronamel or Rapid Relief" badges={['Potassium Nitrate', 'Sensitivity Protection', 'Enamel']} why="Use 2 weeks before whitening and throughout treatment to reduce discomfort." />
        </RoutineStep>
        <RoutineStep num="2" cat="Day of use · prep teeth first" name="Before Applying Strips" open={openStep==='t-w2'} onToggle={() => tog('t-w2')}>
          <ul className="ag-detail-list">
            <li>Brush 30 min BEFORE applying strips — fluoride right before temporarily reduces whitening effectiveness</li>
            <li>Dry teeth with a tissue — strips adhere far better to completely dry enamel</li>
          </ul>
        </RoutineStep>
        <RoutineStep num="3" cat="30–60 min" name="Apply Strips" open={openStep==='t-w3'} onToggle={() => tog('t-w3')}>
          <ul className="ag-detail-list">
            <li>Gel side faces teeth — align straight edge with gumline, do not overlap onto gum tissue</li>
            <li>Press firmly, fold any excess behind teeth</li>
            <li>Leave on for directed time (30 min standard, 60 min express strips)</li>
            <li>No eating, drinking, or talking while strips are on</li>
          </ul>
          <ProductCard brand="Crest" primary name="Crest 3D Whitestrips Professional Effects" badges={['HP Whitening', '14-Day Course', 'Most Effective OTC']} why="Strong OTC whitening strips with professional-level HP. Shopee PH, Lazada, or iHerb." />
          <ProductCard brand="Crest" name="Crest 3D Glamorous White Whitestrips" badges={['Gentler Formula', '14-Day Course', 'Less Sensitivity']} why="Lower HP for those prone to sensitivity. Same visible whitening — good starting option." />
          <ProductCard brand="Colgate" name="Colgate Optic White Overnight Whitening Pen" badges={['Maintenance Pen', 'No Strips', 'Overnight']} why="Touch-up pen for maintenance between quarterly courses — paint on before bed, leave overnight. Shopee PH and Lazada." />
        </RoutineStep>
        <RoutineStep num="4" cat="After removing" name="Post-Strip Care" open={openStep==='t-w4'} onToggle={() => tog('t-w4')}>
          <ul className="ag-detail-list">
            <li>Peel off and discard — never reuse</li>
            <li>Rinse with water, then wait 30 min before brushing — enamel is temporarily softened</li>
            <li>Avoid coffee, tea, berries, tomato sauce for 1 hour after</li>
            <li>Sensitivity tip: apply Sensodyne directly to teeth, leave 5 min, then rinse</li>
          </ul>
        </RoutineStep>
        <RoutineStep num="5" cat="Reference" name="Your Whitening Schedule" open={openStep==='t-w5'} onToggle={() => tog('t-w5')}>
          <div className="prod-item" style={{ marginTop: 8 }}><div className="prod-badge">Course</div><div><div className="prod-name">Once daily for 14–20 days (standard) or 7–10 days (express)</div><div className="prod-why">One course per quarter — every 3 months.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Maintenance</div><div><div className="prod-name">1–2 strips per month after a course</div><div className="prod-why">Maintains results without committing to a full treatment.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Sensitivity</div><div><div className="prod-name">Skip a day when sensitive — resume the next. Resolves within 24 hours.</div></div></div>
        </RoutineStep>
      </>}
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
        Non-cakey makeup starts with less product and better prep. Follow the steps, then use Extras for polished details.
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 16 }}>
        <div className="ag-detail-section-title">The Charlotte Tilbury Sandwich Hack — Used by MUAs Globally</div>
        <p className="ag-detail-body">Spritz setting spray on bare skin → skincare + primer + foundation → setting spray → powder T-zone only → final setting spray.</p>
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
          <li><strong>Ice roll for 2 minutes</strong> before moisturiser on important days — reduce pores and puffiness</li>
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
        <div className="step-note">Primer prevents sliding and separation in Philippine heat and humidity.</div>
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
          <li>Apply in an inverted triangle under the eyes</li>
          <li>Blend downward and outward with a damp sponge or ring finger</li>
          <li>Tap — never drag — onto blemishes with a small flat brush</li>
          <li>Set immediately with translucent powder to prevent creasing</li>
        </ul>
        <div className="step-note">The inverted triangle brightens under-eyes and visually lifts the face.</div>
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
          <li>For defined lips: line 1 mm outside the lip line, fill in, then apply lipstick</li>
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
        🌸 <strong>Makeup removal is skincare:</strong> Never sleep in makeup. Use micellar water or balm first, then double cleanse.
      </div>

      {/* ── GODDESS EXTRAS ── */}
      <div className="divider splash-item" style={{ marginTop: 32 }}>👑 Goddess Extras</div>
      <p className="s-desc splash-item" style={{ marginBottom: 16 }}>Low-effort features that keep you looking polished.</p>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">✨ Lash Lift + Tint</div>
        <p className="ag-detail-body">Curl lashes from the root for wider eyes with almost no daily effort. Results last 6–8 weeks.</p>
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
          <li><strong>Gua sha daily (5 min, morning):</strong> lift jaw to ear, neck to chin, brow to hairline — upward and outward strokes</li>
          <li><strong>Ice rolling (2 min before makeup):</strong> roll cheeks, jaw, and brow before moisturiser. Store roller in the freezer</li>
          <li><strong>Mewing:</strong> rest your tongue flat against the roof of your mouth</li>
          <li><strong>Makeup contouring for a lifted look:</strong> highlight only the face centre; keep temples and jaw matte</li>
          <li><strong>Blush placement:</strong> apply high on cheekbones near temples</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🤎 Brow Lamination + Darker Brows</div>
        <p className="ag-detail-body">Brow lamination sets brows upward for 6–8 weeks. Darker brows frame the face with little daily effort.</p>
        <ul className="ag-detail-list" style={{ marginTop: 8 }}>
          <li><strong>Brow lamination:</strong> any brow salon, lasts 6–8 weeks, can be tinted darker at the same appointment</li>
          <li><strong>At-home soap brows (daily):</strong> wet a spoolie, touch clear glycerin soap, brush brows upward</li>
          <li><strong>For darker brows:</strong> e.l.f. Instant Lift Brow Pencil (micro-pen, feathery strokes) + NYX Control Freak clear brow gel = the most natural-looking full brow on a budget</li>
          <li><strong>Microblading:</strong> semi-permanent, lasts 1–2 years — fills sparse areas with hair-stroke tattoo marks. Consult a certified technician</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">💋 Full, Defined Lips</div>
        <ul className="ag-detail-list">
          <li><strong>Sugar scrub 2× per week:</strong> 1 tsp sugar + 1 tsp honey, massage lips in circular motion for 1 min, rinse — makes lips look visibly fuller and smoother</li>
          <li><strong>Overline technique:</strong> line 1 mm outside the natural lip line, focus cupid's bow and lower-lip centre</li>
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
          <li><strong>Skin flooding:</strong> layer hydration in thin coats on light-makeup days (toner → essence → serum → moisturiser)</li>
        </ul>
      </div>
    </>
  );
}

/* ─── Tab config ─── */
function resolveInitial(initialTab) {
  if (initialTab === 'pm')       return { top: 'face',     faceSub: 'evening', bodySub: 'morning' };
  if (initialTab === 'body')     return { top: 'body',     faceSub: 'morning', bodySub: 'morning' };
  if (initialTab === 'retinoid') return { top: 'retinoid', faceSub: 'morning', bodySub: 'morning' };
  if (initialTab === 'hair')     return { top: 'hair',     faceSub: 'morning', bodySub: 'morning' };
  if (initialTab === 'makeup')   return { top: 'makeup',   faceSub: 'morning', bodySub: 'morning' };
  if (initialTab === 'teeth')    return { top: 'teeth',    faceSub: 'morning', bodySub: 'morning' };
  if (initialTab === 'underarm') return { top: 'underarm', faceSub: 'morning', bodySub: 'morning' };
  return { top: 'face', faceSub: 'morning', bodySub: 'morning' };
}

const TOP_TABS = [
  { id: 'face',      label: '💆 Face' },
  { id: 'body',      label: '🫧 Body' },
  { id: 'retinoid',  label: '✨ Retinoid' },
  { id: 'antiaging', label: '🌿 Anti-Aging' },
  { id: 'hair',      label: '💇 Hair' },
  { id: 'underarm',  label: '🌟 Underarm' },
  { id: 'teeth',     label: '🦷 Teeth' },
  { id: 'makeup',    label: '💄 Makeup' },
];

const AM_PM_SUBS = [
  { id: 'morning', label: '☀️ Morning' },
  { id: 'evening', label: '🌙 Evening' },
];

export default function Skincare({ initialTab }) {
  const init = resolveInitial(initialTab);
  const [topTab,    setTopTab]    = useState(init.top);
  const [faceSub,   setFaceSub]   = useState(init.faceSub);
  const [bodySub,   setBodySub]   = useState(init.bodySub);
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
        🛍 <strong>Where to buy:</strong> Products are available in the Philippines on <strong>Shopee</strong>, <strong>Lazada</strong>, and <strong>Watsons</strong>. Search the exact names. Most are under ₱500–₱1,200.
      </div>

      <div className="sk-top-tabs splash-item">
        {TOP_TABS.map(t => (
          <button key={t.id} className={`sk-top-tab${topTab === t.id ? ' active' : ''}`} onClick={() => switchTop(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {topTab === 'face' && (
        <>
          <div className="sk-tabs splash-item">
            {AM_PM_SUBS.map(s => (
              <button key={s.id} className={`sk-tab${faceSub === s.id ? ' active' : ''}`} onClick={() => setFaceSub(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          {faceSub === 'morning' && <AMFace />}
          {faceSub === 'evening' && <PMFace />}
        </>
      )}

      {topTab === 'body' && (
        <>
          <div className="sk-tabs splash-item">
            {AM_PM_SUBS.map(s => (
              <button key={s.id} className={`sk-tab${bodySub === s.id ? ' active' : ''}`} onClick={() => setBodySub(s.id)}>
                {s.label}
              </button>
            ))}
          </div>
          {bodySub === 'morning' && <BodyMorning />}
          {bodySub === 'evening' && <BodyEvening />}
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
