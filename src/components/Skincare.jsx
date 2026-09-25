import { useState } from 'react';
import RoutineStep from './RoutineStep';
import Sheet from './Sheet';
import StepFlow from './StepFlow';

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
  'Mielle Organics':  '#2e7d5b',
  'Mise en Scene':    '#8a6fb0',
  'Olaplex':          '#c04a7a',
  'TRESemmé':         '#7a2d52',
  'Batiste':          '#c8102e',
  'OGX':              '#6b4f3a',
  'Alpecin':          '#1f6fb2',
  'Grande Cosmetics': '#b0446e',
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
        <div className="pc-find">🛍 <strong>Find it:</strong> Search the full name on Shopee, Lazada, or Watsons PH.</div>
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
  return (
    <>
      <AMCalendar />
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ☀️ Morning goal: cleanse, hydrate, protect. Do NOT over-strip. SPF helps prevent dark spots.
      </div>
      <StepFlow>
        <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser">
          <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Tea Tree', 'Fragrance-Free']} why="pH 5.0 is barrier-friendly. Cleanses without stripping." />
          <ProductCard brand="Beauty of Joseon" name="Relief Foam Cleanser (Rice + Probiotics)" badges={['Rice Extract', 'Probiotics', 'Fragrance-Free', 'Ultra-Gentle']} why="Gentle rice foam for redness. Use on irritated mornings." />
          <div className="step-note">Lukewarm water only. Cleanse 30 seconds, then pat dry.</div>
        </RoutineStep>
        <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner">
          <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Toner" badges={['Niacinamide 2%', 'Yuja Extract', 'Brightening', 'Pore-Minimising']} why="Controls oil, redness, and uneven tone. Expect results in 4–8 weeks." />
          <ProductCard brand="COSRX" name="AHA/BHA Clarifying Treatment Toner" badges={['Willow Bark BHA', 'AHA', 'Pore-Clearing']} why="Clears pores. Use 3–4× per week, alternating with niacinamide." />
          <ProductCard brand="The Ordinary" name="Niacinamide 10% + Zinc 1%" badges={['Niacinamide 10%', 'Zinc', 'Budget-Friendly', 'Pore-Minimising']} why="Budget higher-strength niacinamide. Apply 2–3 drops after cleansing. Shopee and Lazada." />
          <div className="step-note">Pat, never rub. Use daily for 4–8 weeks.</div>
        </RoutineStep>
        <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence">
          <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Barrier Repair', 'Redness Calming']} why="Repairs, calms, and hydrates without grease." />
          <ProductCard brand="Missha" name="Time Revolution First Treatment Essence" badges={['Fermented Yeast', 'Niacinamide', 'Skin Luminosity']} why="Boosts clarity and glow over 4–6 weeks." />
          <div className="step-note">Press in with palms. Pat 3–5 times until absorbed.</div>
        </RoutineStep>
        <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum">
          <ProductCard brand="Some By Mi" primary name="Galactomyces Pure Vitamin C Glow Serum" badges={['Vitamin C', 'Galactomyces', 'Brightening', 'UV Protection']} why="Brightens marks and uneven tone. Use 4–5× per week in the morning." />
          <ProductCard brand="Beauty of Joseon" name="Glow Serum (Propolis + Niacinamide)" badges={['Propolis 60%', 'Niacinamide 2%', 'Calming', 'Gentle']} why="Gentler Month 1 option. Propolis calms redness while niacinamide works on pores." />
          <div className="step-note">Month 1: Joseon serum. Month 2: Vitamin C, start 2× per week.</div>
        </RoutineStep>
        <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser">
          <ProductCard brand="COSRX" primary name="Oil-Free Ultra Moisturizing Lotion (with Birch Sap)" badges={['Oil-Free', 'Non-Comedogenic', 'Birch Sap', 'Lightweight']} why="Hydrates without clogging or heaviness. Good for oily-prone skin." />
          <ProductCard brand="Etude" name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Redness Repair']} why="Use on reactive days. Repairs and calms." />
          <div className="step-note">Apply while skin is slightly damp to lock hydration in.</div>
        </RoutineStep>
        <RoutineStep num="6" cat="Final Step — Never Skip This ☀️" name="Sunscreen SPF 50+ PA++++">
          <ProductCard brand="Beauty of Joseon" primary name="Relief Sun: Rice + Probiotics SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Probiotics', 'Zero White Cast', 'Sensitive Skin']} why="For reactive skin. Calming, brightening, zero white cast." />
          <ProductCard brand="Round Lab" name="Birch Juice Moisturizing Sun Cream SPF 50+" badges={['SPF 50+', 'Birch Juice', 'Hydrating', 'Moisturiser + SPF']} why="Hydrating sunscreen that doubles as moisturiser on minimal-layer days." />
          <div className="step-note">⚠️ Apply generously. Reapply every 2 hours outdoors.</div>
        </RoutineStep>
      </StepFlow>
      <div className="note-box note-rose" style={{ marginTop: 16 }}>
        📅 <strong>Saturday AM:</strong> Clay mask before shower, then full routine. <strong>Saturday PM:</strong> Retinol (Month 2+) + Gua Sha after moisturiser. <strong>Wednesday PM:</strong> Gua Sha after moisturiser.
      </div>
    </>
  );
}

/* ─── PM Face Routine ─── */
function PMFace() {
  return (
    <>
      <PMCalendar />
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌙 Night goal: cleanse, clear congestion, and repair.
      </div>
      <StepFlow>
        <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser">
          <ProductCard brand="Banila Co" primary name="Clean It Zero Cleansing Balm (Purifying)" badges={['BHA', 'Pore-Decongesting', 'SPF Remover', 'Purifying']} why="Removes SPF and helps clear pores." />
          <ProductCard brand="DHC" name="Deep Cleansing Oil" badges={['Olive Oil Base', 'Deep Pore Cleanse', 'Oil-Based']} why="Olive-based oil cleanser for pore buildup." />
          <div className="step-note">Apply to DRY skin. Massage 60–90 seconds, emulsify with water, then rinse.</div>
        </RoutineStep>
        <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser">
          <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Gentle', 'Double Cleanse']} why="Removes oil-cleanser residue and keeps skin at the right pH." />
          <div className="step-note">Double cleanse nightly. Expect smoother texture in 3–4 weeks.</div>
        </RoutineStep>
        <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner">
          <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['BHA', 'AHA', 'PHA', 'Pore Clearing', 'Texture Smoothing']} why="Clears pores and texture. Use 3–4 nights per week." />
          <ProductCard brand="Paula's Choice" name="2% BHA Liquid Exfoliant" badges={['Salicylic Acid 2%', 'Gold Standard BHA', 'Pore-Clearing']} why="Strong BHA for pores and texture. Search Shopee or Lazada." />
          <div className="step-note">Start 2× per week in Month 1. Build to 3–4×. On non-BHA nights, use hydrating toner or essence.</div>
        </RoutineStep>
        <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence">
          <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Post-Exfoliation Repair', 'Redness Calming']} why="Repairs after BHA and calms redness." />
          <div className="step-note">Use especially on BHA nights to reduce irritation.</div>
        </RoutineStep>
        <RoutineStep num="5" cat="Fifth Step — Rotation Schedule" name="Treatment Rotation">
          <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner — Some By Mi AHA BHA PHA or Paula's Choice 2% BHA</div><div className="prod-why">Clear congestion and unclog pores.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum — Some By Mi 10% Niacinamide · Alt: COSRX Niacinamide 15% or The Ordinary Niacinamide 10%+Zinc</div><div className="prod-why">Minimise pores and strengthen barrier.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% — The Inkey List Retinol Serum · Alt: Mediheal Retinol or Rohto Melano CC Retinol</div><div className="prod-why">Start Saturday only once barrier is strong.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest night only</div><div className="prod-why">Zero actives. Let the barrier recover.</div></div></div>
          <div className="step-note">⚠️ Never use BHA or AHA on a retinol night. One active at a time.</div>
        </RoutineStep>
        <RoutineStep num="6" cat="Sixth Step" name="Eye Care">
          <ProductCard brand="Some By Mi" primary name="Eye Serum" badges={['Peptides', 'Puffiness Reducing', 'Dark Circles']} why="Reduces puffiness. Pat, never rub." />
          <ProductCard brand="Innisfree" name="Jeju Cherry Blossom Eye Cream" badges={['Cherry Blossom Extract', 'Brightening', 'Asian Skin']} why="Brightens and moisturises. Ring finger only." />
          <div className="step-note">Ring finger only. Tap gently; never pull or rub.</div>
        </RoutineStep>
        <RoutineStep num="7" cat="Final Step — Seal Everything" name="Night Moisturiser">
          <ProductCard brand="Laneige" primary name="Water Sleeping Mask" badges={['Overnight Hydration', 'Sleeping Pack', '2–3× per week']} why="Overnight hydration. Wake up plumper and glowier." />
          <ProductCard brand="COSRX" name="Ultimate Nourishing Rice Overnight Spa Mask" badges={['Rice Extract', 'Overnight Nourishing', 'Brightening']} why="Brightens and buffers retinol nights." />
          <div className="step-note">BHA: lighter moisturiser. Retinol: richer one. Sunday: sleeping mask.</div>
        </RoutineStep>
      </StepFlow>
    </>
  );
}

/* ─── Body Morning (Shower + Day) ─── */
function BodyMorning() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🫧 Stay consistent. Softer skin in 4–8 weeks.
      </div>
      <StepFlow>
        <RoutineStep num="1" cat="In The Shower" name="Cleanse & Exfoliate">
          <div className="note-box note-rose" style={{ marginBottom: 12, marginTop: 0 }}>
            🌡️ Use warm water, never hot. Finish with a 30-second cooler rinse.
          </div>
          <ProductCard brand="Human Nature" primary name="Naturals Body Wash — Sunflower" badges={['Sulfate-Free', 'Moisturising', 'Filipino Brand', 'Gentle']} why="Gentle sulfate-free wash. Cleanses without stripping." />
          <ProductCard brand="Dove" name="Sensitive Skin Body Wash" badges={['Fragrance-Free', 'Hypoallergenic', 'Moisture Seal']} why="Contains ¼ moisturising cream. Good for reactive skin or after sun." />
          <div className="step-note">🪥 Dry brush 2× per week BEFORE shower (Sunday + Wednesday): firm upward circles from feet toward heart.</div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="St. Ives" name="Oatmeal & Shea Butter Body Scrub" badges={['Physical Exfoliant', '2× per week', 'Texture Smoothing']} why="Buffs dull, rough patches. Use Sunday and Wednesday after body wash." />
          </div>
          <div className="step-note">Exfoliate Sunday and Wednesday only. Overdoing it irritates.</div>
        </RoutineStep>
        <RoutineStep num="2" cat="After Shower — Before Going Out" name="Seal & Protect">
          <div className="step-note" style={{ marginBottom: 12 }}>⏱️ Apply body moisturiser within 2 minutes after showering, while skin is damp.</div>
          <ProductCard brand="CeraVe" primary name="Moisturizing Cream (body)" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free', '24-Hour Hydration']} why="Barrier repair with non-greasy hydration." />
          <ProductCard brand="Human Nature" name="Naturals Intensive Moisturizer" badges={['Sunflower Oil', 'Non-Greasy', 'Lightweight', 'Filipino Brand']} why="Fast-absorbing and non-sticky for humid Philippine weather." />
          <div className="step-note">🦵 Use a thicker layer on elbows, knees, and heels.</div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="Biore" name="UV Aqua Rich Watery Essence SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Lightweight', 'No White Cast']} why="Apply to exposed arms, neck, décolletage, and legs. Absorbs fast with no stickiness." />
          </div>
          <div className="step-note">⚠️ Body SPF outdoors. Reapply every 2 hours.</div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="Bio-Oil" name="Bio-Oil Skincare Oil" badges={['Vitamin A & E', 'Stretch Mark Fading', 'Scar Reduction', 'Skin Glow']} why="2–3 drops over moisturiser add glow and help fade marks. Pat, never rub." />
          </div>
          <div className="step-note">Layer order: moisturiser → absorb 1 min → 2–3 drops Bio-Oil.</div>
        </RoutineStep>
      </StepFlow>
    </>
  );
}

/* ─── Body Evening ─── */
function BodyEvening() {
  return (
    <>
      <StepFlow>
        <RoutineStep num="3" cat="Evening Routine" name="Repair Overnight">
          <div className="step-note" style={{ marginBottom: 12 }}>🌙 Use richer products between 10 PM and 2 AM.</div>
          <ProductCard brand="Aveeno" primary name="Daily Moisturizing Lotion" badges={['Colloidal Oat', 'Soothing', 'Fragrance-Free', '24-Hour Repair']} why="Colloidal oatmeal soothes and repairs the barrier overnight." />
          <ProductCard brand="CeraVe" name="Moisturizing Cream (heavy layer)" badges={['Ceramides', 'Overnight Repair', 'Barrier Restoration']} why="Use a generous night layer for barrier repair." />
          <div className="step-note">🦶 Vaseline on heels and elbows nightly. Smoother in 2–3 weeks.</div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="Vaseline" name="Original Petroleum Jelly" badges={['Occlusive', 'Heel Repair', 'Elbow Softening', 'Fragrance-Free']} why="Seals moisture in. Apply on heels and elbows every night after moisturiser." />
          </div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="AmLactin" name="Daily Moisturizing Body Lotion" badges={['Lactic Acid 12%', 'AHA', 'Keratosis Pilaris', '1× per week']} why="Lactic acid smooths keratosis pilaris, texture, and uneven tone. Use Sunday evening only." />
          </div>
          <div className="step-note">AmLactin: Sunday evenings only. Do not mix with Bio-Oil. Wash hands.</div>
          <div style={{ marginTop: 12 }}>
            <ProductCard brand="Bio-Oil" name="Bio-Oil Evening Massage (2× per week)" badges={['Circulation Boost', 'Lymphatic Drainage', 'Firming', 'Tue + Fri']} why="Massage 5 minutes on Tuesday and Friday. Use long upward strokes on arms, thighs, and abdomen." />
          </div>
          <div className="step-note">Use 4–5 drops per area. Long strokes on limbs, small circles on abdomen. Apply AFTER moisturiser.</div>
        </RoutineStep>
      </StepFlow>
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
    { phase: 'Month 2 — Start here', product: 'Retinol 0.025% OTC', brand: 'The Inkey List Retinol Serum', alt: 'Mediheal Collagen Retinol Serum · Rohto Melano CC Retinol', freq: '1× per week (Saturday)', what: 'Smooths texture and buildup. Use sandwich method: moisturiser → retinol → moisturiser.' },
    { phase: 'Month 3–6', product: 'Retinol 0.05% OTC', brand: 'The Inkey List or Mediheal', alt: 'Cos De BAHA Retinol 0.05% · The Ordinary Retinol 0.5%', freq: '2–3× per week', what: 'More resurfacing and pore tightening. Upgrade only when 0.025% gives zero irritation.' },
    { phase: 'Month 6–12', product: 'Retinol 0.1% or Adapalene 0.1%', brand: 'La Roche-Posay Effaclar or Differin', alt: 'A-Derma Dermalibour+ Retinol · APLB Retinol Cream 0.1%', freq: '4–5× per week', what: 'Stronger for acne, pores, and texture. Often better for congested skin.' },
    { phase: 'Age 24–25+', product: 'Tretinoin 0.025% (prescription)', brand: 'Consult a dermatologist', alt: 'Prescription only — no OTC alternative', freq: '3–5× per week', what: 'Strongest retinoid. Start only after at least 6 months adapted to OTC retinoids. Consult a PH dermatologist.' },
  ];
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 16 }}>
        ✨ Start retinoids low and slow. Protect your barrier.
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
        ⚠️ Never mix retinol with BHA or AHA. No retinoids during pregnancy. Night only. SPF next morning.
      </div>
    </>
  );
}

/* ─── Anti-Aging ─── */
const AG_CARDS = [
  {
    ico: '🛌', t: 'Sleep — Master Hormone', group: 'Daily Rhythms',
    b: 'Sleep 7.5–9 hours. Deep sleep supports glutes and skin.',
    how: ['Sleep by 10 PM — key GH window is 10 PM to 2 AM','Keep your room dark and cool (18–21°C)','Stop screens at least 30 minutes before bed','Drink chamomile tea 30 minutes before sleep','No food after 4 PM','Use a silk pillowcase'],
    why: 'Deep sleep supports muscle, collagen, and body composition. Poor sleep slows results.',
    when: 'Wind down at 9:30 PM. Lights out by 10 PM.',
  },
  {
    ico: '☀️', t: 'Morning Sunlight', group: 'Daily Rhythms',
    b: 'Get 10–20 min direct morning sunlight before 9 AM.',
    how: ['Go outside within 30–60 minutes of waking — daily','Look toward the sun, not directly at it, for 10–20 minutes','No sunglasses during the light exposure','Walk slowly, stretch, or sit','If needed, use a 10,000-lux daylight lamp for 20 min'],
    why: 'Morning light anchors sleep, mood, and cortisol.',
    when: 'First thing in the morning, ideally before 8 AM.',
  },
  {
    ico: '🧠', t: 'Brain Health', group: 'Hormones & Mind',
    b: 'Eat omega-3 fish, eggs, and ginger for brain health.',
    how: ['Eat fatty fish (bangus, tuna, tanigue) 3× per week','Eat eggs daily — yolks provide choline','Add fresh ginger to tea or cooking daily','Add turmeric with black pepper to eggs or broth','Consider an omega-3 supplement (1–2g EPA+DHA) if fish intake is inconsistent','Protect sleep — 7.5+ hours'],
    why: 'Omega-3 supports brain cells. Choline supports memory.',
    when: 'Daily through food. Fish 3× weekly, eggs daily, ginger and turmeric in cooking.',
  },
  {
    ico: '🍃', t: 'Cortisol Management', group: 'Hormones & Mind',
    b: 'Lower cortisol for skin, hair, and hormones over 8–12 weeks.',
    how: ['Drink chamomile tea 30 min before bed','Limit screens after 8 PM','Do pilates 2× per week','Never train hard on poor sleep','Take 10 deep slow breaths before meals','Get 10–20 min morning sunlight','Eat regular meals with 4-hour gaps'],
    why: 'High cortisol can affect collagen, belly fat, hormones, and shedding.',
    when: 'All day. Combine chamomile, morning light, and pilates for 8–12 weeks.',
  },
  {
    ico: '🌸', t: 'Hormone-Protective Eating', group: 'Hormones & Mind',
    b: 'Eat eggs and healthy fats for hormone support.',
    how: ['Eat eggs daily','Use olive oil, avocado, and nuts at every meal','Remove processed foods completely','Remove dairy','Add pumpkin seeds (zinc)','Eat fatty fish 3× weekly','Spearmint tea nightly'],
    why: 'Hormones need cholesterol and dietary fat. Keep food simple.',
    when: 'Every meal. Prioritize eggs, healthy fats, and whole foods.',
  },
  {
    ico: '✨', t: 'Skin Longevity Nutrients', group: 'Skin Longevity',
    b: 'Take collagen, Vitamin C, and omega-3 for hydrated skin.',
    how: ['Take 5–10g collagen peptides (bovine or marine) dissolved in water daily with a Vitamin C source','Squeeze calamansi on everything','Eat papaya regularly','Eat fatty fish 3× weekly','Add a small handful of pumpkin seeds or walnuts','Use collagen water at lunch and post-workout as your hydration with every training meal','Protect with SPF 50+ every single morning'],
    why: 'Collagen supports structure. Vitamin C helps, and SPF protects.',
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

// Mon–Sun. The long soak is Saturday — the day there is time for it.
//
// Two oils, never more. Rosemary is in every one of them because it is the
// only oil here with a human trial behind it; the second oil is the one that
// changes, so each Saturday brings a different partner and nothing sits on the
// scalp week after week. Four pairs, and the loop starts over.
const SAT_PAIRS = [
  [{ e: '🌿', n: 'Rosemary' }, { e: '🌼', n: 'Jojoba' }],
  [{ e: '🌿', n: 'Rosemary' }, { e: '🌸', n: 'Camellia' }],
  [{ e: '🌿', n: 'Rosemary' }, { e: '💧', n: 'Squalane' }],
  [{ e: '🌿', n: 'Rosemary' }, { e: '🥥', n: 'Coconut' }],
];

// Index 5 is Saturday — the week runs Mo, Tu, We, Th, Fr, Sa, Su.
const OIL_SCHEDULE = SAT_PAIRS.map(pair => [[], [], [], [], [], pair, []]);

// Every oil she owns, tappable for its own page. Peppermint is not on the
// calendar — it cannot carry rosemary on its own — but it stays here so the
// page is still reachable when she wants to add a drop.
const ALL_OILS = [
  { e: '🌿', n: 'Rosemary' }, { e: '🌼', n: 'Jojoba' }, { e: '🌸', n: 'Camellia' },
  { e: '💧', n: 'Squalane' }, { e: '🥥', n: 'Coconut' }, { e: '🌱', n: 'Peppermint' },
  { e: '✨', n: 'Argan' },
];

const OIL_COLORS = {
  Camellia:   'rgba(255,92,157,0.18)',
  Rosemary:   'rgba(240,204,96,0.14)',
  Argan:      'rgba(255,232,122,0.16)',
  Jojoba:     'rgba(240,204,96,0.10)',
  Coconut:    'rgba(255,255,255,0.08)',
  Peppermint: 'rgba(120,220,180,0.12)',
  Squalane:   'rgba(180,220,255,0.12)',
};

const OIL_GUIDE = {
  Rosemary: {
    emoji: '🌿',
    how: 'Every Saturday soak, never alone. Mix 3 drops into the partner oil, apply along partings, massage 5 min.',
    tip: 'Always diluted. Once a week is enough.',
  },
  Jojoba: {
    emoji: '🌼',
    how: 'Saturday partner oil. 4 drops in your palm, rosemary mixed in, scalp only.',
    tip: "Light carrier oil for rosemary.",
  },
  Camellia: {
    emoji: '🌸',
    how: 'Saturday partner oil. 4 drops with rosemary, scalp first, then leftovers through lengths.',
    tip: 'Conditions fine hair without much weight.',
  },
  Argan: {
    emoji: '✨',
    how: 'Optional only. Use 1–2 drops on the bottom third, dry hair, never scalp.',
    tip: 'Kept as an option because you own it.',
  },
  Coconut: {
    emoji: '🥥',
    how: 'Saturday partner oil, one week in four. On the ends for the last 20 min only, then shampoo out completely.',
    tip: 'Never nightly on fine hair. Too much can cause protein overload.',
  },
  Squalane: {
    emoji: '💧',
    how: 'Saturday partner oil, one week in four: 4 drops with rosemary. Daytime: half a drop on dry ends.',
    tip: 'Lightest oil here. Ends only.',
  },
  Peppermint: {
    emoji: '🌱',
    how: 'Optional. ONE drop in the Saturday mix with rosemary. Never neat.',
    tip: 'Cold is normal. If it stings or burns, rinse.',
  },
};

const OIL_BENEFITS = {
  Camellia: {
    emoji: '🌸',
    tagline: 'Hero oil for fine, wavy strands',
    color: 'rgba(255,92,157,0.12)',
    borderColor: 'rgba(255,92,157,0.3)',
    science: 'Camellia oil (Tsubaki) is 80–85% oleic acid. It moisturises without weighing fine hair down.',
    benefits: [
      { icon: '💧', title: 'Deep shaft hydration', body: 'Replenishes dry lengths.' },
      { icon: '🛡️', title: 'Reduces breakage', body: 'Helps strands feel stronger.' },
      { icon: '✨', title: 'Frizz control without weight', body: 'Smooths without flattening waves.' },
      { icon: '🌿', title: 'Scalp health', body: 'Soothes dry, itchy scalp and supports follicles.' },
      { icon: '🌸', title: 'Wavy hair-safe', body: 'No protein overload on fine or wavy hair.' },
    ],
    bestFor: 'Fine, wavy, or colour-treated hair',
    frequency: 'One Saturday in four — the partner oil',
  },
  Rosemary: {
    emoji: '🌿',
    tagline: 'Hair density support',
    color: 'rgba(240,204,96,0.10)',
    borderColor: 'rgba(240,204,96,0.28)',
    science: 'A 2023 Skinmed trial found rosemary oil for 6 months matched 2% minoxidil hair count gains.',
    benefits: [
      { icon: '🩸', title: 'Increases scalp blood flow', body: 'Boosts microcirculation around active follicles.' },
      { icon: '🔬', title: 'DHT inhibition', body: 'Carnosic acid helps reduce DHT linked to thinning.' },
      { icon: '💪', title: 'Supports hair density', body: 'Results need 6 months of consistent use.' },
      { icon: '🛡️', title: 'Antioxidant protection', body: 'Helps protect follicles.' },
      { icon: '⚠️', title: 'Must always be diluted', body: 'Never apply neat. Always dilute in jojoba or camellia first.' },
    ],
    bestFor: 'Hair density support and seasonal shedding',
    frequency: 'Every Saturday — always diluted',
  },
  Argan: {
    emoji: '✨',
    tagline: 'For frizz, shine, and wave definition',
    color: 'rgba(255,232,122,0.10)',
    borderColor: 'rgba(255,232,122,0.3)',
    science: "Argan oil is rich in Vitamin E and fatty acids. It seals moisture and smooths texture.",
    benefits: [
      { icon: '✨', title: 'Frizz elimination', body: 'Seals cuticle and blocks humidity.' },
      { icon: '💎', title: 'Mirror-like shine', body: 'Adds shine without silicone.' },
      { icon: '🌊', title: 'Wave definition', body: 'Scrunch into damp hair for soft wave clumps.' },
      { icon: '🛡️', title: 'Heat protection', body: 'Adds light protection, but use heat protectant above 180°C.' },
      { icon: '🌿', title: 'Scalp-free application', body: 'Use only mid-lengths and ends to avoid greasiness.' },
    ],
    bestFor: 'Post-wash finishing on all hair types, especially wavy and frizz-prone',
    frequency: 'Not scheduled — kept as an option',
  },
  Jojoba: {
    emoji: '🌼',
    tagline: "Closest to scalp sebum",
    color: 'rgba(240,204,96,0.08)',
    borderColor: 'rgba(240,204,96,0.22)',
    science: "Jojoba is close to scalp sebum. It carries rosemary without clogging.",
    benefits: [
      { icon: '🔬', title: 'Sebum mimic', body: 'Absorbs cleanly and helps balance oil production.' },
      { icon: '⚖️', title: 'Scalp balance', body: 'Works for oily and dry scalps.' },
      { icon: '🌿', title: 'Anti-inflammatory', body: 'Soothes irritated scalp skin.' },
      { icon: '🧪', title: 'Best carrier for rosemary', body: 'Dilutes rosemary without clogging follicles.' },
      { icon: '💧', title: 'Lightweight hydration', body: 'Moisturises scalp without heaviness.' },
    ],
    bestFor: 'Scalp treatments, rosemary dilution, all hair types',
    frequency: 'One Saturday in four — the partner oil',
  },
  Peppermint: {
    emoji: '🌱',
    tagline: 'Cold tingle for the scalp',
    color: 'rgba(120,220,180,0.10)',
    borderColor: 'rgba(120,220,180,0.28)',
    science: 'Peppermint has menthol. Promising in one animal study; human proof is limited.',
    benefits: [
      { icon: '🩸', title: 'Opens scalp circulation', body: 'Menthol increases blood flow.' },
      { icon: '❄️', title: 'The cold feeling is the point', body: 'A clean cold tingle for 5–10 minutes is normal and expected.' },
      { icon: '🧼', title: 'Helps a flaky scalp', body: 'Mildly antimicrobial, so it also settles itch and flaking.' },
      { icon: '⚠️', title: 'One drop, never neat', body: 'One drop in a full palm of jojoba is the whole dose. Straight on skin burns.' },
      { icon: '🚫', title: 'Keep it away from the eyes', body: 'Wash your hands after applying. Menthol in the eye is extremely painful.' },
    ],
    bestFor: 'A scalp that feels sluggish, flaky, or itchy — one week in four',
    frequency: 'Optional extra — one drop, never on its own',
  },
  Squalane: {
    emoji: '💧',
    tagline: 'Weightless and not greasy',
    color: 'rgba(180,220,255,0.10)',
    borderColor: 'rgba(180,220,255,0.28)',
    science: 'Plant-derived squalane is very light. It absorbs fast and works on dry hair in daylight.',
    benefits: [
      { icon: '🪶', title: 'Lightest oil you can buy', body: 'Sinks in fast.' },
      { icon: '👜', title: 'Safe for daytime', body: 'Use on dry hair before going out.' },
      { icon: '🌡️', title: 'Does not go rancid', body: 'Very stable, so a bottle lasts and never smells off.' },
      { icon: '🧴', title: 'No smell, no residue', body: 'Fragrance-free and colourless — it will not fight your perfume.' },
      { icon: '⚖️', title: 'Ends only, still', body: 'Keep it below the ears.' },
    ],
    bestFor: 'Going out, and anyone who finds every other oil too heavy',
    frequency: 'Daytime ends, and one Saturday in four',
  },
  Coconut: {
    emoji: '🥥',
    tagline: 'Powerful ends treatment',
    color: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.15)',
    science: 'Coconut oil reduces protein loss. On fine or wavy hair, overuse can cause protein overload.',
    benefits: [
      { icon: '🛡️', title: 'Protein loss prevention', body: 'Lauric acid binds to keratin and reduces protein loss during washing.' },
      { icon: '💧', title: 'Deep end conditioning', body: 'Softens dry ends temporarily.' },
      { icon: '⚠️', title: 'Fine hair caution', body: 'Fine and wavy hair can get protein overload. Use 1–2 drops, ends only.' },
      { icon: '⏱️', title: '20-minute maximum', body: 'Long exposure can cause buildup on fine hair. Set a timer and shampoo fully.' },
      { icon: '📅', title: 'One Saturday in four', body: 'Its own week in the rotation. Argan is the nightly ends oil, not this.' },
    ],
    bestFor: 'Dry, porous, or thick hair. Use with strict frequency limits on fine/wavy hair.',
    frequency: 'One Saturday in four — ends only',
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

function OilDayModal({ day, monthIdx, oils, dayName, onClose }) {
  const dateLabel = `${DAY_NAMES[dayName]}, ${MONTH_NAMES[monthIdx]} ${day}`;
  const isRest = oils.length === 0;
  return (
    <div className="oil-modal-overlay" onClick={onClose}>
      <div className="oil-modal" onClick={e => e.stopPropagation()}>
        <button className="oil-modal-close" onClick={onClose}>✕</button>
        <div className="oil-modal-date">{dateLabel}</div>
        {isRest ? (
          <div className="oil-modal-rest">
            <div className="oil-modal-rest-icon">🌙</div>
            <p className="oil-modal-rest-text">No soak today.</p>
            <p className="oil-modal-rest-sub">Saturdays only. Tonight: light oil and massage. 🌸</p>
          </div>
        ) : (
          <>
            <div className="oil-modal-oils-row">
              {oils.map(o => (
                <span key={o.n} className="oil-modal-chip">{o.e} {o.n}</span>
              ))}
            </div>
            <p className="oil-modal-card-tip" style={{ marginBottom: 10 }}>
              💡 Mix in your palm. Scalp first, lengths second. Leave 45 min, shampoo twice.
            </p>
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

        {/* The nightly oils used to be repeated here. They live in the Night
            routine now, which is the only place that needs to state them. */}
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
  const [selected, setSelected] = useState(null);

  return (
    <div className="oil-rotation splash-item">
      {selected && (
        <OilDayModal
          day={selected.day}
          monthIdx={monthIdx}
          oils={selected.oils}
          dayName={selected.dayName}
          onClose={() => setSelected(null)}
        />
      )}
      <div className="oil-rot-month-label">
        {MONTH_NAMES[monthIdx]} {year}
        <span className="oil-rot-cal-hint"> · Saturdays · tap a date</span>
      </div>
      <div className="oil-rot-cal">
        <div className="oil-rot-cal-header">
          {DAY_LETTERS.map(d => <div key={d} className="oil-rot-dh">{d}</div>)}
        </div>
        {weeks.map((week, wi) => {
          const wType = wi % SAT_PAIRS.length;
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
                    aria-label={`${MONTH_NAMES[monthIdx]} ${day}${oils.length ? `, ${oils.map(o => o.n).join(' and ')}` : ''}`}
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
        <div className="oil-rot-summary-label">Tap an oil for details</div>
        <div className="oil-rot-summary-grid">
          {ALL_OILS.map(o => (
            <button key={o.n} className="oil-rot-summary-item oil-rot-summary-btn" onClick={() => onSelectOil(o.n)}>
              <span className="oil-rot-summary-em">{o.e}</span>
              <span className="oil-rot-summary-name">{o.n}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── The hair routines ────────────────────────────────────────────────────
   Six moments, each a pill, each holding its steps in the order they are done.
   The order is the substance: comb, massage, serum, oil, cover. The same steps
   in another order give greasy roots or dry ends.

   Every step that involves an oil NAMES the oil in its own title, and every
   pill states its oils before the first step. "Oil" on its own is not an
   instruction — it is a trip to a shelf of bottles at the moment you are
   trying to get out of the door. */
const HAIR_ROUTINES = [
  {
    id: 'hr-pre',
    emoji: '🚿',
    emojiBg: 'rgba(120,200,220,0.18)',
    when: 'Wash nights',
    title: 'Before shower',
    sub: 'Comb · massage · oil · wash',
    oils: [
      { part: 'Scalp', main: '🌼 Jojoba + 3 drops rosemary', alt: '🌿 Mielle Rosemary Mint' },
      { part: 'Ends', main: '🌸 Camellia', alt: '💧 Squalane' },
    ],
    steps: [
      {
        id: 'pre1', cat: '2 minutes', name: 'Comb it out',
        list: [
          'Wooden wide-tooth comb, dry hair only',
          'Start at the very ends, work upward in short sections',
          'Never drag from roots down',
          'Finish with slow scalp strokes',
        ],
        tools: [
          { icon: '🪵', name: 'Wooden wide-tooth comb', why: 'Wood reduces static. Under ₱200 — search "wooden wide tooth comb sandalwood" on Shopee.' },
        ],
      },
      {
        id: 'pre2', cat: '5 minutes', name: 'Scalp massage',
        list: [
          'Fingertips flat, never nails',
          'Small firm circles — move the skin',
          'Focus longest on hairline and temples',
          'Five minutes. Set a timer',
        ],
        tools: [
          { icon: '🫧', name: 'Silicone scalp massager', why: 'Soft shampoo brush. Easier for five minutes. ₱100–₱250.' },
        ],
      },
      {
        id: 'pre3', cat: 'Scalp only', name: '🌼 Jojoba + rosemary on the scalp',
        list: [
          '4 drops jojoba + 3 drops rosemary, mixed in your palm',
          'Onto the parting lines only — scalp, never the lengths',
          'Massage it in for 2 more minutes',
          'Rosemary is never used neat. Jojoba carries it',
        ],
        products: [
          { brand: 'Mielle Organics', primary: true, name: 'Rosemary Mint Scalp & Hair Strengthening Oil — ready-mixed scalp oil', badges: ['Biotin', 'Rosemary', 'Lightweight'], why: 'Ready-mixed, nothing to measure. ₱500–₱800 on Shopee and Lazada.' },
          { brand: 'The Ordinary', name: '100% Cold-Pressed Virgin Jojoba Oil — the carrier', badges: ['Carrier oil', 'Mix it yourself'], why: 'Use with rosemary drops. Cheaper per use. About ₱600.' },
        ],
      },
      {
        id: 'pre4', cat: 'Ends only', name: '🌸 Camellia on the ends',
        list: [
          '1–2 drops on the bottom third',
          'Protects ends before shampoo',
          'Camellia, not argan',
        ],
        tools: [
          { icon: '🌸', name: '100% Camellia (Tsubaki) oil', why: 'About 80% oleic acid. Search "camellia oil tsubaki 100%" on Shopee. ₱300–₱700.' },
          { icon: '💧', name: 'Squalane — if camellia feels heavy', why: 'Lighter and fast-absorbing. The Ordinary 100% Plant-Derived Squalane, about ₱600.' },
        ],
      },
      {
        id: 'pre5', cat: '20–30 min later', name: 'Wash it out',
        list: [
          '20–30 minutes is enough',
          'Shampoo the SCALP first',
          'Two washes on an oiled night — one lifts, one cleans',
          'Conditioner on the lengths only, never the scalp',
        ],
      },
    ],
  },
  {
    id: 'hr-post',
    emoji: '💧',
    emojiBg: 'rgba(255,232,122,0.18)',
    when: 'Straight out of the shower',
    title: 'After shower',
    sub: 'Growth serum · leave-in · oil · heat guard',
    oils: [
      { part: 'Ends', main: '🌸 Camellia — 1 drop, damp', alt: '💧 Squalane' },
    ],
    steps: [
      {
        id: 'po1', cat: 'First 30 seconds', name: 'Squeeze, never rub',
        list: [
          'Press water out section by section',
          'Use microfibre towel or old cotton shirt',
          'Never wrap tight, never rub',
        ],
        tools: [
          { icon: '🧻', name: 'Microfibre hair towel', why: 'Dries gently. ₱150–₱300, or use a cotton t-shirt.' },
        ],
      },
      {
        id: 'po2', cat: 'Scalp · damp', name: 'Scalp growth serum — caffeine',
        list: [
          'Watery leave-in, NOT oil. Scalp only',
          'Hairline and temples first, then down the partings',
          'Massage 1 minute. Leave it in',
          'Use every wash',
        ],
        products: [
          { brand: 'The Ordinary', primary: true, name: 'Multi-Peptide Serum for Hair Density — scalp growth serum', badges: ['Caffeine', 'Peptides', 'Leave-in'], why: 'Caffeine plus peptides for density and hairline. About ₱900.' },
          { brand: 'Alpecin', name: 'Caffeine Liquid Hair Energizer — scalp tonic', badges: ['Caffeine', 'Leave-in'], why: 'Stronger caffeine, easy at Watsons PH. Smell fades within the hour.' },
        ],
        note: 'Biotin works swallowed, not applied. Let caffeine do the scalp job.',
      },
      {
        id: 'po3', cat: 'Mid-length to ends', name: 'Leave-in hair serum',
        list: [
          'Smoothing cream-serum, not oil',
          'One pump, or half a pump if your hair is short',
          'Start at the mid-length and pull down to the ends',
          'Nothing above the ears',
        ],
        products: [
          { brand: 'Mise en Scene', primary: true, name: 'Perfect Serum Original, gold bottle — leave-in hair serum', badges: ['Lightweight', 'Damp or dry hair'], why: 'Light enough for fine hair. ₱400–₱600 on Shopee.' },
          { brand: 'Olaplex', name: 'No.9 Bond Protector Nourishing Hair Serum — leave-in + heat guard', badges: ['Bond repair', 'Protects to 230°C'], why: 'Leave-in plus heat guard in one bottle.' },
        ],
      },
      {
        id: 'po4', cat: 'Ends · damp', name: '🌸 Camellia on damp ends',
        list: [
          '1 drop, ends only, while the hair is still damp',
          'Scrunch upward if you want the waves to clump',
          'Swap to squalane if camellia feels heavy',
        ],
        tools: [
          { icon: '🌸', name: '100% Camellia (Tsubaki) oil', why: 'Main ends oil. Search "camellia oil tsubaki 100%".' },
        ],
      },
      {
        id: 'po5', cat: 'Only if you use heat', name: 'Heat protectant spray',
        list: [
          'Water-light mist. Mid-lengths and ends, never scalp',
          'Let it dry 30 seconds before the heat touches it',
          'No heat protectant, no heat',
          'Dryer on cool or warm, held 15 cm away',
        ],
        products: [
          { brand: 'TRESemmé', primary: true, name: 'Thermal Creations Heat Tamer Spray — heat protectant', badges: ['Protects to 230°C', 'Light'], why: 'Under ₱400, easy at Watsons, light for fine hair.' },
        ],
      },
      {
        id: 'po6', cat: 'Last', name: 'Comb and air dry',
        list: [
          'Wooden wide-tooth comb only, ends upward',
          'Air dry as far as you can before reaching for the dryer',
          'Never sleep on soaking wet hair',
        ],
      },
    ],
  },
  {
    id: 'hr-night',
    emoji: '🌙',
    emojiBg: 'rgba(255,92,157,0.18)',
    when: 'Every night',
    title: 'Night',
    sub: 'Scalp oil · ends · plait · bonnet',
    oils: [
      { part: 'Scalp', main: '🌿 Mielle Rosemary Mint', alt: '🌼 Jojoba + rosemary' },
      { part: 'Ends', main: '🌸 Camellia', alt: '💧 Squalane' },
    ],
    steps: [
      {
        id: 'n1', cat: '2 minutes', name: 'Comb it out',
        list: [
          'Ends upward, in sections, gently',
          'Remove knots before morning',
        ],
      },
      {
        id: 'n2', cat: '3–5 minutes', name: 'Scalp massage',
        list: [
          'Fingertips, small firm circles, no nails',
          'Hairline and temples get the most',
          'Sitting or lying down both work',
        ],
      },
      {
        id: 'n3', cat: 'Scalp only', name: '🌿 Rosemary mint oil on the scalp',
        list: [
          '3–4 drops on the parting lines, massaged in',
          'Skip on wash nights',
          'If roots feel coated, go every other night',
        ],
        products: [
          { brand: 'Mielle Organics', primary: true, name: 'Rosemary Mint Scalp & Hair Strengthening Oil — nightly scalp oil', badges: ['Biotin', 'Rosemary', 'Lightweight'], why: 'Same bottle as pre-shower. Nothing extra to buy.' },
        ],
      },
      {
        id: 'n4', cat: 'Ends only', name: '🌸 Camellia on the ends',
        list: [
          '1–2 drops warmed between the palms',
          'Bottom third only — never the scalp, never the roots',
          'Dry hair, right before bed',
        ],
      },
      {
        id: 'n5', cat: 'Last thing', name: 'Loose plait, then the bonnet',
        list: [
          'One loose plait, or loose top bun',
          'Never a tight elastic',
          'Satin bonnet over the top, every night',
          'Keeps oil off the pillow',
        ],
        tools: [
          { icon: '👑', name: 'Satin sleep bonnet', why: 'Wide soft band, not tight elastic. ₱150–₱350 on Shopee. Buy two.' },
          { icon: '🛏️', name: 'Silk or satin pillowcase', why: 'Backup when the bonnet slips off.' },
        ],
      },
    ],
  },
  {
    id: 'hr-lash',
    emoji: '👁️',
    emojiBg: 'rgba(120,160,240,0.18)',
    when: 'Every night',
    title: 'Lashes',
    sub: 'Peptide lash serum · 60 seconds',
    steps: [
      {
        id: 'l1', cat: 'First', name: 'Clean, dry lids',
        list: [
          'Face washed and completely dry',
          'No cream, oil, or makeup on lids',
        ],
      },
      {
        id: 'l2', cat: '10 seconds', name: 'One stroke along the lash line',
        list: [
          'Along the UPPER lash line only',
          'One stroke per eye. More is not faster',
          'Nothing on lower lashes or inside the eye',
        ],
        products: [
          { brand: 'Grande Cosmetics', primary: true, name: 'GrandeLASH-MD Lash Enhancing Serum — peptide lash serum', badges: ['Peptides', 'Amino acids', '3-month tube'], why: 'Known peptide lash serum. Around ₱3,500 at Sephora PH and on Shopee. One tube lasts about 3 months.' },
          { brand: 'The Ordinary', name: 'Multi-Peptide Lash and Brow Serum — budget peptide serum', badges: ['Peptides', 'Brows too'], why: 'Budget peptide option. About ₱700. Works on brows too.' },
        ],
        note: 'Finish your blue bottle first. Buy these next.',
      },
      {
        id: 'l3', cat: '2 minutes', name: 'Wait before your face cream',
        list: [
          'Let it dry fully first',
          'Cream too soon spreads it around the eye',
        ],
      },
      {
        id: 'l4', cat: 'Keep going', name: 'Every night, 12 weeks',
        list: [
          'Lashes turn over slowly',
          'First change around week 6. Real result at week 12',
          'Keep using it after week 12',
          'Itchy, red, or darker lid? Stop',
        ],
      },
    ],
  },
  {
    id: 'hr-out',
    emoji: '👜',
    emojiBg: 'rgba(240,204,96,0.18)',
    when: 'Morning',
    title: 'Going out',
    sub: 'Not greasy, not dry',
    oils: [
      { part: 'Ends', main: '💧 Squalane — half a drop', alt: '🌸 Camellia — half a drop' },
    ],
    steps: [
      {
        id: 'o1', cat: 'The rule', name: 'Nothing on the scalp',
        list: [
          'No oil, serum, or cream near roots',
          'More makes roots greasy',
          'Daylight scalp gets dry shampoo only',
        ],
      },
      {
        id: 'o2', cat: '1 minute', name: 'Comb, do not brush from the roots',
        list: [
          'Wooden comb, ends upward as always',
          'Brushing from scalp down drags night oil',
          'This keeps hair shiny, not flat',
        ],
      },
      {
        id: 'o3', cat: 'Day two or three only', name: 'Dry shampoo at the roots',
        list: [
          'Shake hard, hold 25–30 cm away',
          'Short bursts on the roots only, in partings',
          'Wait 2 minutes, massage in with your fingertips, comb through',
          'A rescue, not a routine. Three days running clogs scalp',
        ],
        products: [
          { brand: 'Batiste', primary: true, name: 'Dry Shampoo Original — root oil absorber', badges: ['Absorbs oil', 'Everywhere in PH'], why: 'Under ₱350 in Watsons. Use tinted if white cast shows.' },
        ],
      },
      {
        id: 'o4', cat: 'Mid-length to ends', name: 'Leave-in serum on dry hair',
        list: [
          'Half a pump for fine hair',
          'Rub into both palms first, then smooth downward from the mid-length',
          'Press whatever is left onto the very ends',
          'Nothing above the ears',
        ],
        products: [
          { brand: 'Mise en Scene', primary: true, name: 'Perfect Serum Original, gold bottle — leave-in hair serum', badges: ['Light', 'Dry hair safe'], why: 'Light enough for dry morning hair.' },
        ],
      },
      {
        id: 'o5', cat: 'If it is humid', name: '💧 Squalane on the very ends',
        list: [
          'Half a drop, rubbed until palms barely feel it',
          'Press onto the last two inches only',
          'Squalane, not camellia, for daylight',
          'Fix frizz at the ends, not roots',
        ],
        products: [
          { brand: 'The Ordinary', primary: true, name: '100% Plant-Derived Squalane — weightless ends oil', badges: ['Weightless', 'No smell', 'No residue'], why: 'Absorbs fast and looks clean before going out. About ₱600.' },
        ],
      },
      {
        id: 'o6', cat: 'Only if you style', name: 'Heat protectant first',
        list: [
          'Mist, wait 30 seconds, then the iron or the dryer',
          'Use the lowest heat that works',
          'Never skip heat protectant as a habit',
        ],
      },
    ],
  },
];

// A tool has no brand worth naming — a wooden comb is a wooden comb — so it
// gets a plainer card than ProductCard, with no recommended/alternative star.
function ToolCard({ icon, name, why }) {
  return (
    <div className="tool-card">
      <span className="tool-card-icon">{icon}</span>
      <div>
        <div className="tool-card-name">{name}</div>
        <div className="tool-card-why">{why}</div>
      </div>
    </div>
  );
}

// The two screens that are not step-by-step routines, but still belong in the
// same list: the Saturday soak and the short list of things never to do.
const HAIR_EXTRAS = [
  { id: 'hr-sat',   emoji: '🌸', emojiBg: 'rgba(255,92,157,0.18)', when: 'Once a week', title: 'Saturday',  sub: 'Two oils · 45 minutes' },
  { id: 'hr-never', emoji: '🚫', emojiBg: 'rgba(255,92,157,0.12)', when: 'Thin strands', title: 'Never',    sub: 'The short list' },
];

// A card, not a drawer. Tapping it opens the routine as its own page.
function RoutineCard({ r, onOpen }) {
  return (
    <button className="routine-card splash-item" onClick={onOpen}>
      <span className="rc-emoji" style={{ background: r.emojiBg }}>{r.emoji}</span>
      <span className="rc-text">
        <span className="rc-when">{r.when}</span>
        <span className="rc-title">{r.title}</span>
        <span className="rc-sub">{r.sub}</span>
      </span>
      <span className="rc-go">›</span>
    </button>
  );
}

// The day routines come first — those are the ones that have to become
// automatic. The Saturday soak and the never-list sit below them.
// Written out rather than derived from the two arrays, because the order on
// screen is a decision in its own right: the four everyday routines first, then
// the weekly one, then lashes, and the never-list last because it is a
// reference rather than something you do.
const HAIR_ORDER = ['hr-pre', 'hr-post', 'hr-night', 'hr-out', 'hr-sat', 'hr-lash', 'hr-never'];

function HairTab({ onSelectOil }) {
  const [openId, setOpenId] = useState(null);
  const all = [...HAIR_ROUTINES, ...HAIR_EXTRAS];
  const cards = HAIR_ORDER.map(id => all.find(c => c.id === id)).filter(Boolean);
  const current = cards.find(c => c.id === openId) || null;
  const routine = HAIR_ROUTINES.find(r => r.id === openId) || null;
  const close = () => setOpenId(null);

  return (
    <>
      <div className="s-header" style={{ paddingTop: 0 }}>
        <div className="s-tag">Wavy · Thin strands</div>
        <p className="s-desc">Tap the one you are in.</p>
      </div>

      <div className="routine-cards">
        {cards.map(c => <RoutineCard key={c.id} r={c} onOpen={() => setOpenId(c.id)} />)}
      </div>

      <Sheet
        open={Boolean(current)}
        emoji={current?.emoji}
        emojiBg={current?.emojiBg}
        kicker={current?.when}
        title={current?.title || ''}
        sub={current?.sub}
        onClose={close}
      >
        {routine && (
          <>
            {routine.oils?.map(o => (
              <div key={o.part} className="hair-oil-pick">
                <span className="hop-lbl">{o.part}</span>
                <span className="hop-main">{o.main}</span>
                <span className="hop-alt">or {o.alt}</span>
              </div>
            ))}
            {/* Keyed on the routine so stepping through one and opening
                another does not land you on step 4 of something else. */}
            <StepFlow key={routine.id}>
              {routine.steps.map((st, i) => (
                <RoutineStep key={st.id} num={String(i + 1)} cat={st.cat} name={st.name}>
                  <ul className="ag-detail-list">
                    {st.list.map((line, li) => <li key={li}>{line}</li>)}
                  </ul>
                  {st.note && <div className="note-box note-rose" style={{ marginTop: 10 }}>{st.note}</div>}
                  {st.tools?.map(t => <ToolCard key={t.name} {...t} />)}
                  {st.products?.map(pr => <ProductCard key={pr.name + (pr.primary ? '-p' : '')} {...pr} />)}
                </RoutineStep>
              ))}
            </StepFlow>
          </>
        )}

        {openId === 'hr-sat' && (
          <>
            <div className="hair-oil-pick">
              <span className="hop-lbl">Always</span>
              <span className="hop-main">🌿 Rosemary — 3 drops</span>
              <span className="hop-alt">never neat</span>
            </div>
            <div className="hair-oil-pick">
              <span className="hop-lbl">Partner</span>
              <span className="hop-main">🌼 Jojoba → 🌸 Camellia → 💧 Squalane → 🥥 Coconut</span>
              <span className="hop-alt">one each Saturday, then round again</span>
            </div>
            <OilRotationCalendar onSelectOil={name => { close(); onSelectOil(name); }} />
          </>
        )}

        {openId === 'hr-never' && (
          <ul className="ag-detail-list">
            <li>Castor oil and sweet almond oil</li>
            <li>Tight elastics</li>
            <li>Brushing wet hair</li>
            <li>Oil near the roots in daylight</li>
            <li>Coconut more than once a month</li>
            <li>Heat with no heat guard</li>
            <li>Argan — you did not like it, so nothing asks for it</li>
          </ul>
        )}
      </Sheet>
    </>
  );
}

/* ─── Underarm Routine ─── */
function UnderarmRoutine() {
  const [sub, setSub] = useState('morning');
  function switchSub(s) { setSub(s); }
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
          <StepFlow>
            <RoutineStep num="1" cat="After Shower" name="Pat Dry Completely">
              <ul className="ag-detail-list">
                <li>Shower as usual with gentle body wash</li>
                <li>Pat underarms completely dry with a clean towel — do not rub</li>
                <li>Wait 2–3 minutes if needed</li>
                <li>Damp skin weakens deodorant and brightening actives</li>
              </ul>
            </RoutineStep>
            <RoutineStep num="2" cat="Daily · replaces deodorant" name="Apply Whitening Deo Mist">
              <ul className="ag-detail-list">
                <li>Hold the spray 10–15 cm away from the underarm</li>
                <li>Mist evenly across the entire area — 2–3 short bursts per side</li>
                <li>Wait 30 seconds for it to dry before pulling on clothing</li>
                <li>Replaces regular deodorant — controls odour and brightens</li>
                <li>Use every morning for visible brightening</li>
              </ul>
              <ProductCard brand="Organic Skin Japan" primary name="Intensive Whitening Underarm Deo Mist" badges={['Glutathione', 'Alpha Arbutin', 'Niacinamide', 'Kojic Acid', 'Vitamin C']} why="Five brightening actives in one deo-treatment spray. Search 'OSJ Whitening Deo Mist'." />
              <ProductCard brand="Luxe Organix" name="Belo Intense White Deo Spray" badges={['Whitening', 'Antiperspirant', 'PH Brand']} why="Filipino medical brand. Watsons PH and Mercury Drug — good starting option." />
              <div className="prod-item"><div className="prod-badge">Alt 2</div><div><div className="prod-name">Dove Advanced Care Sensitive Antiperspirant</div><div className="prod-why">Fragrance-free. Best for sensitive skin or after waxing..</div></div></div>
            </RoutineStep>
          </StepFlow>
        </>
      )}

      {sub === 'night' && (
        <>
          <div className="note-box note-gold" style={{ marginBottom: 14 }}>
            Three steps: exfoliate → brighten → repair. Use actives on dry skin only. Results in 4–6 weeks.
          </div>
          <StepFlow>
            <RoutineStep num="1" cat="3–4× per week · dry skin only" name="Exfoliate — AHA / Glycolic Acid">
              <ul className="ag-detail-list">
                <li>Underarms must be completely dry — glycolic on damp skin stings</li>
                <li>Saturate a cotton pad and swipe once across each underarm — do not scrub</li>
                <li>Never within 24 hours of shaving — wait until skin heals</li>
                <li>Week 1: 1× only. Build to 3–4× per week over 4 weeks</li>
              </ul>
              <div className="step-note">Clears dead skin behind dark spots. Build up slowly.</div>
              <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['AHA', 'BHA', 'PHA', 'Dark Spot']} why="Triple-acid toner for underarm brightening. Shopee PH, Lazada." />
              <ProductCard brand="The Ordinary" name="Glycolic Acid 7% Toning Solution" badges={['Glycolic Acid 7%', 'AHA', 'Budget']} why="Budget pick. Apply with a cotton pad." />
              <ProductCard brand="Medicube" name="Zero Pore Pad 2.0" badges={['AHA', 'BHA', 'Panthenol', 'Dual-Sided']} why="Pre-soaked pads. YesStyle, Olive Young Global." />
            </RoutineStep>
            <RoutineStep num="2" cat="Daily · 5 min after exfoliant" name="Brighten — Niacinamide Serum">
              <ul className="ag-detail-list">
                <li>Wait 5 minutes after the acid step before applying</li>
                <li>Apply 3–4 drops, pat gently — do not rub</li>
                <li>Niacinamide fades dark spots over 4–8 weeks</li>
                <li>On nights you skip acid, still apply the serum alone</li>
              </ul>
              <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Serum" badges={['Niacinamide 2%', 'Yuja Vitamin C', 'Dark Spot']} why="Brightens underarms. Shopee PH, Lazada." />
              <ProductCard brand="COSRX" name="Niacinamide 15% Face Serum" badges={['Niacinamide 15%', 'High-Strength']} why="2 drops, patted in. Use on nights you skip acid." />
              <ProductCard brand="Beauty of Joseon" name="Glow Serum Propolis + Niacinamide" badges={['Propolis 60%', 'Niacinamide 2%', 'Soothing']} why="Gentler option — best for sensitive skin or first 2 weeks." />
            </RoutineStep>
            <RoutineStep num="3" cat="Every night · seals everything in" name="Repair — Barrier Cream">
              <ul className="ag-detail-list">
                <li>Apply a generous layer after the serum absorbs</li>
                <li>Seals actives and reduces friction inflammation overnight</li>
                <li>Keep the barrier intact so brightening actives work</li>
              </ul>
              <ProductCard brand="Etude" primary name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Barrier Repair']} why="Heals friction and calms skin after acids." />
              <ProductCard brand="Dr. Jart+" name="Cicapair Tiger Grass Color Correcting Treatment" badges={['Centella', 'Calming', 'Barrier Restore']} why="Calms skin after shaving or acids." />
              <ProductCard brand="CeraVe" name="Moisturizing Cream" badges={['Ceramides', 'Hyaluronic Acid', 'Fragrance-Free']} why="Repairs the barrier. Watsons or Mercury Drug PH." />
            </RoutineStep>
          </StepFlow>
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
  function switchSub(s) { setSub(s); }
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
        <StepFlow>
          <RoutineStep num="1" cat="Before anything else · 3–5× per week" name="Oil Pulling">
            <ul className="ag-detail-list">
              <li>1 tablespoon coconut oil on empty stomach — before brushing or drinking water</li>
              <li>Swish gently for 10–15 minutes while showering or getting dressed</li>
              <li>Spit into the trash — never the sink (oil solidifies in pipes)</li>
              <li>Rinse with warm water, then proceed to brushing</li>
            </ul>
            <div className="step-note">For breath, gums and stains. 3–5× per week is enough.</div>
          </RoutineStep>
          <RoutineStep num="2" cat="Every morning · 2 min" name="Brush with HA Toothpaste">
            <ul className="ag-detail-list">
              <li>Soft brush at 45° to the gumline, gentle circles, never scrub</li>
              <li>All surfaces: outer, inner, chewing, and the tongue</li>
              <li><strong>Do NOT rinse after</strong> — spit only</li>
            </ul>
            <div className="step-note">💡 HA toothpaste repairs enamel and whitens naturally.</div>
            <ProductCard brand="Apagard" primary name="Apagard Premio Toothpaste" badges={['Hydroxyapatite', 'Remineralising', 'Whitening', 'Japanese']} why="Repairs enamel, whitens, eases sensitivity." />
            <ProductCard brand="Boka" name="Boka Ela Mint Toothpaste" badges={['Nano-Hydroxyapatite', 'Fluoride-Free']} why="Nano-HA toothpaste. iHerb ships to PH." />
            <ProductCard brand="Sensodyne" name="Sensodyne Pronamel Mineral Boost" badges={['Enamel Strengthening', 'Sensitivity', 'Fluoride']} why="Use for 2 weeks before whitening. Watsons, Mercury Drug." />
          </RoutineStep>
          <RoutineStep num="3" cat="Every morning" name="Floss or Water Flosser">
            <ul className="ag-detail-list">
              <li>C-shape around each tooth, reach below the gumline</li>
              <li>Or a water flosser, 60 seconds along the gumline</li>
              <li>Skipping flossing leaves 35% of tooth surfaces uncleaned</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="4" cat="Every morning · 30 seconds" name="Tongue Scraper">
            <ul className="ag-detail-list">
              <li>Metal or plastic scraper, not your toothbrush</li>
              <li>5–7 strokes from back to front, rinse scraper between each</li>
              <li>The #1 fix for bad breath</li>
            </ul>
          </RoutineStep>
        </StepFlow>
      </>}

      {sub === 'night' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          Night routine: floss first, brush with HA paste, and leave it on overnight.
        </div>
        <StepFlow>
          <RoutineStep num="1" cat="Before brushing · every night" name="Floss First">
            <ul className="ag-detail-list">
              <li>Floss every tooth in a C-shape, just below the gumline</li>
              <li>Clears food so the toothpaste reaches every surface</li>
              <li>Night flossing matters most</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="2" cat="Every night · 2 min" name="Brush with HA Toothpaste">
            <ul className="ag-detail-list">
              <li>Same 45° gentle circular technique as morning</li>
              <li><strong>Do not rinse</strong> — spit only. Overnight is your longest enamel repair window</li>
              <li>No eating or drinking (except water) after brushing</li>
              <li>Optional: salt water rinse before brushing if gums feel sore tonight</li>
            </ul>
            <div className="step-note">Don't rinse — let it work overnight.</div>
            <ProductCard brand="Apagard" primary name="Apagard Premio Toothpaste" badges={['Hydroxyapatite', 'Overnight Remineralisation', 'Whitening']} why="Same paste as morning. Works best overnight." />
            <ProductCard brand="Boka" name="Boka Ela Mint Toothpaste" badges={['Nano-Hydroxyapatite', 'Fluoride-Free']} why="Nano-HA option. iHerb ships to PH." />
            <ProductCard brand="Oral-B" name="Oral-B iO Series Electric Toothbrush" badges={['Pressure Sensor', 'Round Head', 'Gum Health']} why="Warns you when you brush too hard. Shopee PH." />
          </RoutineStep>
        </StepFlow>
      </>}

      {sub === 'saltwater' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          Salt water rinse is a targeted treatment — not a daily step. Use it for gum irritation, sores, or sensitivity. Always before brushing, never after.
        </div>
        <StepFlow>
          <RoutineStep num="1" cat="When needed" name="Prepare the Rinse">
            <ul className="ag-detail-list">
              <li>½ teaspoon fine salt dissolved in 240 ml warm water</li>
              <li>Stir until fully dissolved — use immediately while warm</li>
              <li>Make fresh every time — do not store leftover rinse</li>
            </ul>
            <div className="prod-item"><div className="prod-badge">★ Best</div><div><div className="prod-name">Fine sea salt or iodized table salt — DIY rinse</div><div className="prod-why">½ tsp in warm water, fresh every use. Any fine salt works. Under ₱50.</div></div></div>
            <ProductCard brand="TheraBreath" name="TheraBreath Oral Rinse (Alcohol-Free)" badges={['Dentist-Developed', 'Alcohol-Free', 'Fluoride-Free']} why="Ready-made rinse. iHerb ships to PH." />
            <ProductCard brand="Listerine" name="Listerine Zero Alcohol Mouthwash" badges={['Alcohol-Free', 'Bacteria-Killing', 'No Burning']} why="No burning, no dryness. Watsons, Mercury Drug." />
          </RoutineStep>
          <RoutineStep num="2" cat="Before brushing" name="Rinse Technique">
            <ul className="ag-detail-list">
              <li>Swish gently for 30 seconds, covering all areas of the mouth</li>
              <li>Spit completely — do not swallow</li>
              <li>Rinse once with plain water, then brush as normal</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="3" cat="Reference" name="When to Use">
            <ul className="ag-detail-list">
              <li>Gum soreness or bleeding gums — 2–3× per week until resolved</li>
              <li>After tooth extraction — wait 24 hours first</li>
              <li>Canker sores or mouth ulcers</li>
              <li>Post-whitening sensitivity — soothing rinse before you brush</li>
            </ul>
          </RoutineStep>
        </StepFlow>
      </>}

      {sub === 'whitening' && <>
        <div className="note-box note-gold" style={{ marginBottom: 14 }}>
          One course every 3 months keeps teeth noticeably white without over-whitening. Always prep with Sensodyne for 2 weeks before starting.
        </div>
        <StepFlow>
          <RoutineStep num="1" cat="2 weeks before starting a course" name="Prep — Sensitivity Protection">
            <ul className="ag-detail-list">
              <li>Use Sensodyne for 2 weeks before, to cut sensitivity</li>
              <li>No strips with untreated cavities, gum disease, or front veneers — see a dentist first</li>
            </ul>
            <ProductCard brand="Sensodyne" primary name="Sensodyne Pronamel or Rapid Relief" badges={['Potassium Nitrate', 'Sensitivity Protection', 'Enamel']} why="Use 2 weeks before and during whitening." />
          </RoutineStep>
          <RoutineStep num="2" cat="Day of use · prep teeth first" name="Before Applying Strips">
            <ul className="ag-detail-list">
              <li>Brush 30 min BEFORE applying strips</li>
              <li>Dry teeth with a tissue first</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="3" cat="30–60 min" name="Apply Strips">
            <ul className="ag-detail-list">
              <li>Gel side on teeth, straight edge at the gumline, not on gums</li>
              <li>Press firmly, fold any excess behind teeth</li>
              <li>Leave on for directed time (30 min standard, 60 min express strips)</li>
              <li>No eating, drinking, or talking while strips are on</li>
            </ul>
            <ProductCard brand="Crest" primary name="Crest 3D Whitestrips Professional Effects" badges={['HP Whitening', '14-Day Course', 'Most Effective OTC']} why="Strongest over-the-counter strips. Shopee PH, Lazada, iHerb." />
            <ProductCard brand="Crest" name="Crest 3D Glamorous White Whitestrips" badges={['Gentler Formula', '14-Day Course', 'Less Sensitivity']} why="Gentler, for sensitive teeth. Good first try." />
            <ProductCard brand="Colgate" name="Colgate Optic White Overnight Whitening Pen" badges={['Maintenance Pen', 'No Strips', 'Overnight']} why="Touch-up pen between courses. Paint on at bedtime." />
          </RoutineStep>
          <RoutineStep num="4" cat="After removing" name="Post-Strip Care">
            <ul className="ag-detail-list">
              <li>Peel off and discard — never reuse</li>
              <li>Rinse with water, then wait 30 min before brushing</li>
              <li>Avoid coffee, tea, berries, tomato sauce for 1 hour after</li>
              <li>Sensitivity tip: apply Sensodyne directly to teeth, leave 5 min, then rinse</li>
            </ul>
          </RoutineStep>
          <RoutineStep num="5" cat="Reference" name="Your Whitening Schedule">
            <div className="prod-item" style={{ marginTop: 8 }}><div className="prod-badge">Course</div><div><div className="prod-name">Once daily for 14–20 days (standard) or 7–10 days (express)</div><div className="prod-why">One course per quarter — every 3 months.</div></div></div>
            <div className="prod-item"><div className="prod-badge">Maintenance</div><div><div className="prod-name">1–2 strips per month after a course</div><div className="prod-why">Maintains results without committing to a full treatment.</div></div></div>
            <div className="prod-item"><div className="prod-badge">Sensitivity</div><div><div className="prod-name">Sensitive? Skip a day, then carry on.</div></div></div>
          </RoutineStep>
        </StepFlow>
      </>}
    </>
  );
}

/* ─── Makeup Routine ─── */
function MakeupRoutine() {
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
          <li>Powder the T-zone only</li>
          <li>Apply foundation in thin layers and build only where needed</li>
          <li>Hydrate well the night before a big makeup day</li>
          <li><strong>Skin flooding:</strong> toner → essence → serum → moisturiser</li>
        </ul>
      </div>

      <StepFlow>
        <RoutineStep num="1" cat="Base Prep" name="Skincare First">
          <ul className="ag-detail-list" style={{ marginTop: 8 }}>
            <li>Full AM skincare routine — cleanser, toner, serum, moisturiser</li>
            <li>Wait 5–10 minutes for skincare to fully absorb before touching makeup</li>
            <li>Apply SPF 50+ — non-negotiable even under makeup</li>
            <li>Optional: mix 1–2 drops of facial oil into moisturiser for an extra glow base</li>
            <li><strong>Ice roll for 2 minutes</strong> before moisturiser on important days — reduce pores and puffiness</li>
          </ul>
          <div className="step-note">Wait for skincare to dry, or primer will pill.</div>
        </RoutineStep>

        <RoutineStep num="2" cat="Primer" name="Grip + Blur Primer">
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">e.l.f. Power Grip Primer</div><div className="prod-why">Tacky gel that holds makeup all day. Budget dupe for Milk Hydro Grip. Shopee PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Splurge</div><div><div className="prod-name">Charlotte Tilbury Airbrush Flawless Primer</div><div className="prod-why">Blurs and grips for a soft-focus base. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Milk Makeup Hydro Grip Primer</div><div className="prod-why">Lighter than e.l.f. Good for dry skin.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li>Press with a damp sponge over the T-zone and pores</li>
            <li>Allow 1–2 minutes to set before applying foundation</li>
            <li>Match formulas: silicone with silicone, water with water</li>
          </ul>
          <div className="step-note">Stops makeup sliding in the heat.</div>
        </RoutineStep>

        <RoutineStep num="3" cat="Foundation" name="Your Skin But Better">
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Charlotte Tilbury Airbrush Flawless Foundation</div><div className="prod-why">Medium coverage, satin finish, looks like skin. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Armani Beauty Luminous Silk Foundation</div><div className="prod-why">The iconic silk finish. Sheer-to-medium buildable coverage that looks like filtered skin. Serum-like texture, virtually weightless. The gold standard for "your skin but better" worldwide. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">Maybelline Fit Me Matte + Poreless Foundation</div><div className="prod-why">Easy to find, not cakey. Blend with a damp sponge. Watsons, SM Beauty.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li>Dot on the centre of the face, blend outward</li>
            <li>Blend downward on fine facial hair to avoid reverse-brushed texture</li>
            <li>Add more only where needed: under-eyes, nose, redness</li>
            <li>On good skin days: skin tint or BB cream instead of full foundation</li>
          </ul>
          <div className="step-note">Start with less. A damp sponge blends best.</div>
        </RoutineStep>

        <RoutineStep num="4" cat="Concealer" name="Spot & Under-Eye">
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">NARS Radiant Creamy Concealer</div><div className="prod-why">Creamy, radiant, doesn't crease. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Rare Beauty Liquid Touch Brightening Concealer</div><div className="prod-why">Light, natural, doesn't settle in lines. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">Maybelline Fit Me Concealer</div><div className="prod-why">Budget dupe for NARS. Everywhere in PH.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li>Apply in an inverted triangle under the eyes</li>
            <li>Blend downward and outward with a damp sponge or ring finger</li>
            <li>Tap — never drag — onto blemishes with a small flat brush</li>
            <li>Set immediately with translucent powder to prevent creasing</li>
          </ul>
          <div className="step-note">An upside-down triangle under the eye lifts the face.</div>
        </RoutineStep>

        <RoutineStep num="5" cat="Setting Powder" name="Lock — T-Zone Only">
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Laura Mercier Translucent Loose Setting Powder</div><div className="prod-why">Sets without adding coverage. T-zone and under-eyes only.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">Laneige Neo Blurring Powder</div><div className="prod-why">Blurs pores without going flat. YesStyle, Shopee PH.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li><strong>T-zone only</strong> — forehead, nose bridge, chin</li>
            <li>Use a fluffy brush — tap off all excess before applying</li>
            <li>Bake under-eyes: press powder on, wait 5 min, dust off</li>
          </ul>
          <div className="step-note">Less powder looks more like skin.</div>
        </RoutineStep>

        <RoutineStep num="6" cat="Contour & Blush" name="Sculpt & Flush">
          <div className="prod-item"><div className="prod-badge">★ Blush</div><div><div className="prod-name">Rare Beauty Soft Pinch Liquid Blush</div><div className="prod-why">One tiny dot is enough. Looks like a natural flush. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">★ Contour</div><div><div className="prod-name">Charlotte Tilbury Filmstar Bronze & Glow</div><div className="prod-why">Bronzer and highlighter in one. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Budget Blush</div><div><div className="prod-name">e.l.f. Halo Glow Blush Beauty Wand</div><div className="prod-why">Easy blush wand, no tools. Shopee PH.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li><strong>Contour:</strong> matte bronzer under cheekbones, temples, jaw — blend well</li>
            <li><strong>Blush:</strong> apply high on cheekbones, blend upward toward temples for a lifted look</li>
            <li>For sun-kissed: sweep blush lightly across the nose bridge</li>
            <li>Tap off extra first</li>
          </ul>
          <div className="step-note">Blush high, near the temples, for a lifted look.</div>
        </RoutineStep>

        <RoutineStep num="7" cat="Eyes" name="Eye Makeup">
          <ul className="ag-detail-list" style={{ marginTop: 8 }}>
            <li><strong>Brows:</strong> light feathery strokes, then brow gel. Budget: e.l.f. Instant Lift + NYX Control Freak</li>
            <li><strong>Eyeshadow:</strong> matte neutral across the lid, slightly darker in the crease, blend with a fluffy brush</li>
            <li><strong>Tightline:</strong> dark liner on the upper waterline</li>
            <li><strong>Mascara:</strong> if not lash-lifted — 1–2 coats from root to tip with a zigzag motion at the base</li>
            <li><strong>If lash-lifted + tinted:</strong> 1 light coat of clear mascara or skip entirely</li>
          </ul>
          <div className="step-note">With a lash lift, just fill brows and go.</div>
        </RoutineStep>

        <RoutineStep num="8" cat="Lips" name="Lip Look">
          <ul className="ag-detail-list" style={{ marginTop: 8 }}>
            <li>Exfoliate lips 2× per week with a sugar scrub (1 tsp honey + 1 tsp sugar) for a smooth base</li>
            <li>Apply nourishing lip balm 5 minutes before any lip colour</li>
            <li>For everyday: MLBB tinted balm or lipstick (1–2 shades deeper than your natural lip colour)</li>
            <li>For defined lips: line 1 mm outside the lip line, fill in, then apply lipstick</li>
            <li>A dot of peppermint gloss in the centre of the lips adds a natural plump effect</li>
          </ul>
          <div className="step-note">MLBB = my lips but better. Best everyday lip.</div>
        </RoutineStep>

        <RoutineStep num="9" cat="Set & Finish" name="Setting Spray — Final Lock">
          <div className="prod-item"><div className="prod-badge">★ Holy Grail</div><div><div className="prod-name">Urban Decay All Nighter Setting Spray</div><div className="prod-why">Up to 16 hours, holds in heat. Sephora PH.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Alt</div><div><div className="prod-name">MAC Fix+</div><div className="prod-why">Melts makeup into skin. Also great for dampening your sponge.</div></div></div>
          <div className="prod-item"><div className="prod-badge">Budget</div><div><div className="prod-name">e.l.f. Power Grip Dewy Setting Spray</div><div className="prod-why">Locks makeup with a dewy glow. Shopee PH.</div></div></div>
          <ul className="ag-detail-list" style={{ marginTop: 12 }}>
            <li>Hold 25–30 cm from face, mist in an X then T pattern over finished makeup</li>
            <li>Let dry completely — do not touch face or fan while setting</li>
            <li>For dewy finish: hydrating formula. For long wear in heat: matte or oil-control formula</li>
            <li>Powder the T-zone, then spray all over for all-day wear</li>
          </ul>
          <div className="step-note">Setting spray makes makeup last all day.</div>
        </RoutineStep>
      </StepFlow>

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
          <li>After 48 hours: lash serum nightly</li>
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
          <li><strong>For darker brows:</strong> e.l.f. Instant Lift pencil + NYX Control Freak gel</li>
          <li><strong>Microblading:</strong> lasts 1–2 years. Use a certified technician</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">💋 Full, Defined Lips</div>
        <ul className="ag-detail-list">
          <li><strong>Sugar scrub 2× per week:</strong> 1 tsp sugar + 1 tsp honey, 1 min, rinse</li>
          <li><strong>Overline technique:</strong> line 1 mm outside the natural lip line, focus cupid's bow and lower-lip centre</li>
          <li><strong>Peppermint gloss:</strong> a dot on the lower lip centre to plump</li>
          <li><strong>Highlight the cupid's bow:</strong> a tiny swipe of shimmer</li>
          <li><strong>Overnight hydration:</strong> Laneige Lip Sleeping Mask every night</li>
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">🌊 Glass Skin Before Makeup — The Night Before Trick</div>
        <ul className="ag-detail-list">
          <li><strong>Slugging the night before:</strong> full PM skincare → wait to absorb → thin layer of CeraVe Healing Ointment or Vaseline over everything. Wake up plump; makeup lasts longer</li>
          <li><strong>Morning ice water dunk:</strong> ice water, face in for 10 seconds, 3× — less puffiness</li>
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

// Two columns, and the split is not alphabetical: the left column is the four
// you open most days, the right column the ones you open when something needs
// doing. Grouping them that way means the common four are always in the same
// place under your thumb.
const TOP_TABS_LEFT = [
  { id: 'face',      label: '💆 Face' },
  { id: 'hair',      label: '💇 Hair' },
  { id: 'teeth',     label: '🦷 Teeth' },
  { id: 'body',      label: '🫧 Body' },
];
const TOP_TABS_RIGHT = [
  { id: 'retinoid',  label: '✨ Retinoid' },
  { id: 'antiaging', label: '🌿 Anti-Aging' },
  { id: 'underarm',  label: '🌟 Underarm' },
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
        {[TOP_TABS_LEFT, TOP_TABS_RIGHT].map((col, ci) => (
          <div key={ci} className="sk-top-col">
            {col.map(t => (
              <button key={t.id} className={`sk-top-tab${topTab === t.id ? ' active' : ''}`} onClick={() => switchTop(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
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
