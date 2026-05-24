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
const TREATMENT_DAYS = [
  { day: 'Mon', am: 'Vit C (M2+)\nNiacin M1', pm: 'BHA Toner',      warn: 'No Retinol or AHA same night' },
  { day: 'Tue', am: 'Niacin + Vit C', pm: 'Niacinamide', warn: null },
  { day: 'Wed', am: 'Vit C (M2+)\nNiacin M1', pm: 'BHA Toner',      warn: 'No Retinol or AHA same night' },
  { day: 'Thu', am: 'Niacin + Vit C', pm: 'Niacinamide', warn: null },
  { day: 'Fri', am: 'Vit C (M2+)\nNiacin M1', pm: 'BHA Toner',      warn: 'No Retinol or AHA same night' },
  { day: 'Sat', am: 'Niacin + Vit C', pm: 'Retinol (M2+)\nNiacin M1', warn: 'No BHA, AHA, or Vit C same night' },
  { day: 'Sun', am: 'Niacin only',    pm: 'Rest · Sleeping Mask',    warn: 'Zero actives — barrier recovery' },
];

function TreatmentCalendar() {
  const todayIdx = ((new Date().getDay() + 6) % 7); // 0=Mon
  return (
    <div className="tx-cal splash-item">
      <div className="tx-cal-title">Weekly Treatment Schedule</div>
      <div className="tx-cal-grid">
        {TREATMENT_DAYS.map((d, i) => (
          <div key={d.day} className={`tx-day${i === todayIdx ? ' tx-today' : ''}`}>
            <div className="tx-day-label">{d.day}</div>
            <div className="tx-section">
              <div className="tx-badge">AM</div>
              <div className="tx-item">{d.am}</div>
            </div>
            <div className="tx-section">
              <div className="tx-badge pm">PM</div>
              <div className="tx-item">{d.pm}</div>
            </div>
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
      <TreatmentCalendar />
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        ☀️ Morning goal: gently cleanse, hydrate, protect. Do NOT over-strip your skin in the morning — your barrier is already reactive. SPF is non-negotiable for pore minimising and preventing dark spots.
      </div>
      <RoutineStep num="1" cat="First Step — Gentle Cleanse" name="Low pH Cleanser">
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Tea Tree', 'Fragrance-Free']} why="pH 5.0 — matches your skin's natural acid mantle exactly. Cleanses without stripping the barrier your redness-prone skin needs intact. The tea tree oil controls bacteria without harsh scrubbing." />
        <ProductCard brand="Beauty of Joseon" name="Relief Foam Cleanser (Rice + Probiotics)" badges={['Rice Extract', 'Probiotics', 'Fragrance-Free', 'Ultra-Gentle']} why="Super gentle rice foam. Excellent for reactive skin with redness — calms while it cleanses. Use this on mornings when your skin feels particularly sensitive or irritated." />
        <div className="step-note">Lukewarm water only — never hot. Hot water breaks down the skin barrier and worsens redness. 30 seconds, light pressure, pat dry with a clean towel.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Step — Pore Tightening" name="Niacinamide Toner">
        <ProductCard brand="Some By Mi" primary name="Yuja Niacin 30 Days Brightening Toner" badges={['Niacinamide 2%', 'Yuja Extract', 'Brightening', 'Pore-Minimising']} why="Niacinamide is the #1 ingredient for visible pore minimising. Regulates sebum, reduces redness, and brightens uneven tone. Your most important daily AM active — takes 4–8 weeks to show full results." />
        <ProductCard brand="COSRX" name="AHA/BHA Clarifying Treatment Toner" badges={['Willow Bark BHA', 'AHA', 'Pore-Clearing']} why="Willow bark BHA gently exfoliates inside the pore. Use 3–4× per week as your AM toner — alternate with the niacinamide toner so skin gets both clearing and brightening." />
        <ProductCard brand="The Ordinary" name="Niacinamide 10% + Zinc 1%" badges={['Niacinamide 10%', 'Zinc', 'Budget-Friendly', 'Pore-Minimising']} why="Budget alternative to the Some By Mi toner. Higher niacinamide concentration at a lower price. Apply 2–3 drops as a serum step after cleansing. Widely available on Shopee and Lazada." />
        <div className="step-note">Pat in gently with clean fingertips — never rub or swipe. Niacinamide takes 4–8 weeks of daily use to visibly shrink pores. Commit to the timeline.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Barrier Hydration" name="Lightweight Essence">
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Barrier Repair', 'Redness Calming']} why="Snail secretion filtrate repairs the skin barrier, addresses reactive redness, speeds up texture healing, and adds hydration without greasiness. One of the most research-backed Korean skincare ingredients." />
        <ProductCard brand="Missha" name="Time Revolution First Treatment Essence" badges={['Fermented Yeast', 'Niacinamide', 'Skin Luminosity']} why="Fermented niacinamide essence — enhances absorption of all subsequent products and visibly improves skin clarity and glow over 4–6 weeks of consistent use." />
        <div className="step-note">Press into skin with both palms warmly cupped over your face. 3–5 gentle pats until absorbed. This is the step that gives Korean skin its signature glass-like glow.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Targeted Treatment" name="Vitamin C or Niacinamide Serum">
        <ProductCard brand="Some By Mi" primary name="Galactomyces Pure Vitamin C Glow Serum" badges={['Vitamin C', 'Galactomyces', 'Brightening', 'UV Protection']} why="Vitamin C brightens post-pimple marks, protects against UV damage, and gradually fades uneven pigmentation. Use 4–5× per week in the morning." />
        <ProductCard brand="Beauty of Joseon" name="Glow Serum (Propolis + Niacinamide)" badges={['Propolis 60%', 'Niacinamide 2%', 'Calming', 'Gentle']} why="If Vitamin C irritates at first, this is the gentler alternative for Month 1. Propolis calms redness and texture bumps while niacinamide works on pores simultaneously." />
        <div className="step-note">Use the Joseon serum for your first month while your barrier strengthens. Introduce Vitamin C in Month 2 — start 2× per week and build up.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Seal & Protect" name="Non-Comedogenic Moisturiser">
        <ProductCard brand="COSRX" primary name="Oil-Free Ultra Moisturizing Lotion (with Birch Sap)" badges={['Oil-Free', 'Non-Comedogenic', 'Birch Sap', 'Lightweight']} why="Will not clog the pores you are actively clearing. Birch sap hydrates without any heaviness or residue. Perfect for your oily-prone skin type." />
        <ProductCard brand="Etude" name="Soon Jung 2× Barrier Intensive Cream" badges={['Panthenol', 'Madecassoside', 'Redness Repair']} why="For reactive or sensitised days when skin needs barrier repair above everything else. Panthenol actively heals the skin barrier and stops the redness cycle." />
        <div className="step-note">Apply while skin is still slightly damp from essence — locks hydration in far more effectively than applying to completely dry skin.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Final Step — Never Skip This ☀️" name="Sunscreen SPF 50+ PA++++">
        <ProductCard brand="Beauty of Joseon" primary name="Relief Sun: Rice + Probiotics SPF 50+ PA++++" badges={['SPF 50+', 'PA++++', 'Probiotics', 'Zero White Cast', 'Sensitive Skin']} why="Specifically formulated for reactive, sensitive skin. Probiotics calm inflammation. Rice extract brightens. Zero white cast on all skin tones. Legendary in Korean skincare for a reason." />
        <ProductCard brand="Round Lab" name="Birch Juice Moisturizing Sun Cream SPF 50+" badges={['SPF 50+', 'Birch Juice', 'Hydrating', 'Moisturiser + SPF']} why="Deeply hydrating sunscreen that doubles as a moisturiser. Especially good for days when you want minimal layering in your routine." />
        <div className="step-note">⚠️ UV exposure directly enlarges pores, worsens redness, creates texture, and prevents ALL your actives from working. Apply generously. Reapply every 2 hours when outdoors.</div>
      </RoutineStep>

      <div className="divider" style={{ marginTop: 28 }}>Weekly Add-Ons (Face)</div>
      <RoutineStep num="1×" cat="Once Per Week" name="Clay or Pore Mask">
        <ProductCard brand="COSRX" primary name="Salicylic Acid Daily Gentle Cleanser (used as mask)" badges={['BHA', 'Pore Mask', '5 min leave-on']} why="Apply a thin layer to nose and chin for 5 minutes before washing off. BHA draws out the oil plugs that cause your visible pore congestion — visible improvement after a few uses." />
        <ProductCard brand="Innisfree" name="Super Volcanic Pore Clay Mask" badges={['Volcanic Ash', 'Sebum-Absorbing', 'Pore Tightening']} why="Volcanic ash absorbs excess sebum deeply. Leave 10–15 minutes. Follow immediately with snail mucin and full moisturiser to prevent over-drying." />
        <div className="step-note">Do this on a Saturday morning before your shower. Follow with your complete hydration routine immediately after — never leave skin bare after a clay mask.</div>
      </RoutineStep>
      <RoutineStep num="2×" cat="Twice Per Week" name="Gua Sha or Facial Massage">
        <div className="prod-item"><div className="prod-badge">Tool</div><div><div className="prod-name">Rose Quartz or Jade Gua Sha Stone</div><div className="prod-why">2–3 min facial massage with your evening moisturiser. Stimulates lymphatic drainage which directly reduces the facial puffiness and fluid retention that make features look undefined.</div></div></div>
        <div className="step-note">Upward and outward strokes only — never drag downward. Jawline → cheekbones → forehead. Medium pressure. Before bed, 2× per week consistently. Visible difference in jawline definition within 4–6 weeks.</div>
      </RoutineStep>
      <RoutineStep num="1×" cat="Once Per Week — Month 2 onwards" name="AHA Resurfacing Treatment">
        <ProductCard brand="COSRX" primary name="AHA 7 Whitehead Power Liquid" badges={['Glycolic Acid 7%', 'Surface Resurfacing', 'Texture Smoothing']} why="Glycolic acid resurfaces the top layer of skin, dissolves dead skin cells in pores, and smooths texture over time. Use only once per week — this is a strong treatment." />
        <div className="step-note">Do not use on the same night as BHA or retinol. Saturday is a good AHA night after Month 1. Always moisturise heavily after and apply SPF the next morning.</div>
      </RoutineStep>
    </>
  );
}

/* ─── PM Face Routine ─── */
function PMFace() {
  return (
    <>
      <div className="note-box note-rose" style={{ marginBottom: 14 }}>
        🌙 Night goal: deeply cleanse the day off, exfoliate congestion, repair the barrier. Night is when skin regenerates — this is when everything that matters actually happens.
      </div>
      <RoutineStep num="1" cat="First Cleanse — Remove Everything" name="Oil or Balm Cleanser">
        <ProductCard brand="Banila Co" primary name="Clean It Zero Cleansing Balm (Purifying)" badges={['BHA', 'Pore-Decongesting', 'SPF Remover', 'Purifying']} why="The Purifying version contains BHA to help decongest pores while removing SPF and pollution. Dissolves the sebum plugs that cause texture and bumps." />
        <ProductCard brand="DHC" name="Deep Cleansing Oil" badges={['Olive Oil Base', 'Deep Pore Cleanse', 'Oil-Based']} why="Olive-based oil cleanser. Excellent at pulling out oil-based congestion from inside pores — oil dissolves oil. Great alternative if the balm feels too heavy." />
        <div className="step-note">Apply to completely DRY skin. Massage 60–90 seconds including around nose and chin. Emulsify with a small amount of water until it turns milky, then rinse. Do not skip this step.</div>
      </RoutineStep>
      <RoutineStep num="2" cat="Second Cleanse — Water-Based" name="Gel Cleanser">
        <ProductCard brand="COSRX" primary name="Low pH Good Morning Gel Cleanser" badges={['pH 5.0', 'BHA', 'Gentle', 'Double Cleanse']} why="Removes all remaining oil cleanser residue. Maintains your skin at the correct pH so all subsequent products absorb and work properly overnight." />
        <div className="step-note">Double cleansing every night consistently will visibly improve pore congestion and skin texture within 3–4 weeks. It is the #1 principle in Korean skincare for a reason.</div>
      </RoutineStep>
      <RoutineStep num="3" cat="Third Step — Chemical Exfoliation (3–4×/week)" name="BHA Toner">
        <ProductCard brand="Some By Mi" primary name="AHA BHA PHA 30 Days Miracle Toner" badges={['BHA', 'AHA', 'PHA', 'Pore Clearing', 'Texture Smoothing']} why="BHA (salicylic acid) is oil-soluble — it penetrates inside the pore and dissolves the congestion causing your texture and bumps from within. Use 3–4 nights per week." />
        <ProductCard brand="Paula's Choice" name="2% BHA Liquid Exfoliant" badges={['Salicylic Acid 2%', 'Gold Standard BHA', 'Pore-Clearing']} why="The most effective single BHA product for pores and texture that exists. If you can find it on Shopee/Lazada, it is worth it for long-term use." />
        <div className="step-note">Start 2× per week for your first month to let your barrier adjust. Build to 3–4×. On non-BHA nights, use a plain hydrating toner or just go straight to essence.</div>
      </RoutineStep>
      <RoutineStep num="4" cat="Fourth Step — Barrier Repair" name="Snail Mucin Essence">
        <ProductCard brand="COSRX" primary name="Advanced Snail 96 Mucin Power Essence" badges={['Snail Secretion 96%', 'Post-Exfoliation Repair', 'Redness Calming']} why="After BHA exfoliation, the skin needs immediate repair. Snail mucin heals micro-damage, reduces the redness that comes after active use, and accelerates overnight skin cell regeneration." />
        <div className="step-note">This step is especially important on BHA nights. It calms the skin down and ensures you wake up glowing rather than irritated.</div>
      </RoutineStep>
      <RoutineStep num="5" cat="Fifth Step — Rotation Schedule" name="Treatment Rotation">
        <div className="prod-item"><div className="prod-badge">Mon·Wed·Fri</div><div><div className="prod-name">BHA Toner — Some By Mi AHA BHA PHA or Paula's Choice 2% BHA</div><div className="prod-why">Core exfoliation nights — clears congestion and actively unclogs pores.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Tue·Thu</div><div><div className="prod-name">Niacinamide Serum — Some By Mi 10% Niacinamide · Alt: COSRX Niacinamide 15% or The Ordinary Niacinamide 10%+Zinc</div><div className="prod-why">Pore-minimising and barrier-strengthening on non-exfoliation nights.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sat (M2+)</div><div><div className="prod-name">Retinol 0.025% — The Inkey List Retinol Serum · Alt: Mediheal Retinol or Rohto Melano CC Retinol</div><div className="prod-why">Introduce retinol once barrier is strong. Normalises cell turnover. Start Saturday only, then build very gradually.</div></div></div>
        <div className="prod-item"><div className="prod-badge">Sun</div><div><div className="prod-name">Laneige Water Sleeping Mask — rest night only</div><div className="prod-why">One night per week with zero actives. Your barrier gets to fully recover. Wake up with visibly plumper skin.</div></div></div>
        <div className="step-note">⚠️ Never use BHA and retinol on the same night. Never use retinol and AHA on the same night. One active at a time — always.</div>
      </RoutineStep>
      <RoutineStep num="6" cat="Sixth Step" name="Eye Care">
        <ProductCard brand="Some By Mi" primary name="Eye Serum" badges={['Peptides', 'Puffiness Reducing', 'Dark Circles']} why="Peptide-rich formula reduces puffiness and the dark circles visible under your eyes. Pat — never rub — the delicate under-eye area." />
        <ProductCard brand="Innisfree" name="Jeju Cherry Blossom Eye Cream" badges={['Cherry Blossom Extract', 'Brightening', 'Asian Skin']} why="Brightening and moisturising for the under-eye area. Formulated for Asian skin tones. The ring finger only — lightest pressure of any finger." />
        <div className="step-note">Ring finger only. Tap gently in a semicircle under the eye — never pull or rub. The under-eye skin is the thinnest skin on your face.</div>
      </RoutineStep>
      <RoutineStep num="7" cat="Final Step — Seal Everything" name="Night Moisturiser">
        <ProductCard brand="Laneige" primary name="Water Sleeping Mask" badges={['Overnight Hydration', 'Sleeping Pack', '2–3× per week']} why="Overnight hydration surge. Sleep deprivation and dehydration show on skin first — this fights both. Wake up with visibly plumper, more glowing skin." />
        <ProductCard brand="COSRX" name="Ultimate Nourishing Rice Overnight Spa Mask" badges={['Rice Extract', 'Overnight Nourishing', 'Brightening']} why="Rice extract brightens and nourishes. Excellent on retinol nights as a buffer to reduce potential irritation." />
        <div className="step-note">On BHA nights use a lighter moisturiser. On retinol nights use the richer one. Sunday rest night use the sleeping mask for maximum overnight repair.</div>
      </RoutineStep>
    </>
  );
}

/* ─── Body Morning (Shower + Day) ─── */
function BodyMorning() {
  return (
    <>
      <div className="note-box note-gold" style={{ marginBottom: 14 }}>
        🫧 Body skin needs the same consistent attention as your face — just different products. These routines build soft, smooth, glowing skin from head to toe over 4–8 weeks.
      </div>
      <RoutineStep num="1" cat="In The Shower" name="Cleanse & Exfoliate">
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
      <RoutineStep num="2" cat="After Shower — Before Going Out" name="Seal & Protect">
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
  return (
    <>
      <RoutineStep num="3" cat="Evening Routine" name="Repair Overnight">
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

/* ─── Anti-Aging (inlined from AntiAging.jsx) ─── */
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

/* ─── resolve initial tab → top + sub ─── */
function resolveInitial(initialTab) {
  if (initialTab === 'pm')       return { top: 'evening', mSub: 'face', eSub: 'face' };
  if (initialTab === 'body')     return { top: 'morning', mSub: 'body', eSub: 'face' };
  if (initialTab === 'retinoid') return { top: 'retinoid', mSub: 'face', eSub: 'face' };
  return { top: 'morning', mSub: 'face', eSub: 'face' };
}

const TOP_TABS = [
  { id: 'morning',   label: '☀️ Morning' },
  { id: 'evening',   label: '🌙 Evening' },
  { id: 'retinoid',  label: '✨ Retinoid' },
  { id: 'antiaging', label: '🌿 Anti-Aging' },
];
const SUB_TABS = [
  { id: 'face', label: '💆 Face' },
  { id: 'body', label: '🫧 Body' },
];

export default function Skincare({ initialTab }) {
  const init = resolveInitial(initialTab);
  const [topTab, setTopTab]   = useState(init.top);
  const [mSub,   setMSub]     = useState(init.mSub);
  const [eSub,   setESub]     = useState(init.eSub);
  const [agSelected, setAgSelected] = useState(null);

  function switchTop(id) {
    setTopTab(id);
    setAgSelected(null);
  }

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Your Personalised Skin Protocol</div>
        <h2 className="s-title">Glass Skin <em>Plan</em></h2>
        <p className="s-desc">Your complete guide for face and body — tap a routine below to dive in.</p>
      </div>

      <div className="note-box note-gold splash-item" style={{ marginBottom: 20 }}>
        🛍 <strong>Where to buy:</strong> All products are available in the Philippines on <strong>Shopee</strong>, <strong>Lazada</strong>, and <strong>Watsons</strong>. Search the exact product name shown on each card. Most are under ₱500–₱1,200.
      </div>

      {/* Top-level tabs */}
      <div className="sk-top-tabs splash-item">
        {TOP_TABS.map(t => (
          <button key={t.id} className={`sk-top-tab${topTab === t.id ? ' active' : ''}`} onClick={() => switchTop(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Morning */}
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

      {/* Evening */}
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

      {/* Retinoid */}
      {topTab === 'retinoid' && <Retinoid />}

      {/* Anti-Aging */}
      {topTab === 'antiaging' && (
        <AntiAgingTab
          selected={agSelected}
          onSelect={setAgSelected}
          onBack={() => setAgSelected(null)}
        />
      )}
    </div>
  );
}
