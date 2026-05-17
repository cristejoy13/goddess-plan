import { useState } from 'react';

const CARDS = [
  {
    ico: '🛌',
    t: 'Sleep — Master Hormone',
    b: '7.5–9 hours is not optional. Growth hormone — which rebuilds your glutes and skin overnight — is secreted primarily in deep sleep. Poor sleep raises cortisol, driving belly fat, puffiness, and hormonal acne.',
    how: [
      'Sleep by 10 PM — the most valuable GH release window is 10 PM to 2 AM',
      'Keep your room completely dark and cool (18–21°C)',
      'Stop screens at least 30 minutes before bed — blue light suppresses melatonin',
      'Drink chamomile tea 30 minutes before sleep to lower cortisol',
      'No food after 4 PM — digestion during sleep reduces GH secretion',
      'Use a silk pillowcase — reduces facial compression lines and hair breakage overnight',
    ],
    why: 'During deep sleep, your pituitary gland releases growth hormone in pulses. GH rebuilds muscle tissue (including glutes), synthesises collagen for skin, and regulates body fat composition. Poor sleep reduces GH by up to 70% and raises cortisol — cortisol breaks down collagen, deposits fat around the belly, and worsens hormonal acne. Sleep is where the entire Goddess Plan actually works.',
    when: 'Begin your wind-down at 9:30 PM. Lights out by 10 PM. This is the single most important habit in this entire plan — it amplifies every other result.',
  },
  {
    ico: '☀️',
    t: 'Morning Sunlight',
    b: '10–20 min of direct morning sunlight before 9 AM anchors your circadian rhythm, supports serotonin-to-melatonin conversion, regulates cortisol, and supports Vitamin D.',
    how: [
      'Go outside within 30–60 minutes of waking — every single day',
      'Look in the direction of the sun (not directly at it) for 10–20 minutes',
      'No sunglasses — the light must reach your retinas to signal your brain',
      'Walk slowly, stretch, or simply sit while getting your light exposure',
      'If outdoors is not possible, use a 10,000-lux daylight lamp for 20 min',
    ],
    why: 'Morning sunlight activates specialised photoreceptors in your eyes that signal your brain to anchor your circadian clock. This single action sets cortisol timing (high in morning, low at night), triggers serotonin production, and ensures melatonin is released at the right time in the evening. A well-anchored circadian rhythm means better sleep quality, more stable hormones, improved mood, and faster skin healing. All from 15 minutes of morning light.',
    when: 'First thing in the morning, ideally before 8 AM. Make it part of your morning routine before your first meal. This is completely free and takes no extra time if you eat breakfast outside or near a window.',
  },
  {
    ico: '🧠',
    t: 'Brain Health',
    b: 'Omega-3 from bangus, tuna, and tanigue are essential for neuroplasticity. Eggs provide choline — critical for memory. Ginger reduces neuroinflammation. Turmeric\'s curcumin crosses the blood-brain barrier and supports cognitive longevity.',
    how: [
      'Eat fatty fish (bangus, tuna, tanigue) 3× per week — omega-3 EPA and DHA',
      'Eat eggs daily — the yolk contains choline, the precursor to acetylcholine (your learning neurotransmitter)',
      'Add fresh ginger to your tea or cooking daily — gingerol reduces neuroinflammation',
      'Add turmeric with black pepper to eggs or broth — curcumin is neuroprotective',
      'Consider an omega-3 supplement (1–2g EPA+DHA) if fish intake is inconsistent',
      'Protect your sleep — 7.5+ hours is when your glymphatic system clears brain waste overnight',
    ],
    why: 'Your brain is 60% fat — it requires a constant supply of omega-3 to build and maintain neuronal membranes. DHA specifically is the structural fat in brain cell walls. Low DHA is linked to brain fog, low mood, and accelerated cognitive decline. At 22, building these habits creates a measurably sharper brain at 32, 42, and beyond. Curcumin specifically has been shown in clinical studies to cross the blood-brain barrier and reduce amyloid plaques.',
    when: 'Daily — through food choices. Fatty fish at lunch or dinner 3× weekly. Eggs every day. Ginger and turmeric in cooking. Omega-3 supplement with your biggest meal if needed.',
  },
  {
    ico: '🍃',
    t: 'Cortisol Management',
    b: 'Chronic stress → elevated cortisol → belly fat, acne, hair loss, disrupted hormones. Daily habits that measurably lower cortisol create visible physical changes over 8–12 weeks.',
    how: [
      'Drink chamomile tea 30 min before bed — clinically shown to reduce cortisol',
      'Limit screens after 8 PM — blue light raises cortisol in the evening',
      'Do pilates 2× per week — clinically proven to reduce cortisol more than any other exercise type',
      'Never train hard on poor sleep — cortisol is already high, training raises it further',
      'Take 10 deep slow breaths before meals — activates the parasympathetic nervous system',
      'Get 10–20 min morning sunlight — correctly times cortisol peak to morning only',
      'Eat regular meals with 4-hour gaps — erratic eating spikes cortisol',
    ],
    why: 'Cortisol is your stress hormone — essential in bursts, damaging when chronically elevated. High cortisol breaks down collagen (causing wrinkles and pore enlargement), deposits visceral fat around the belly (causing the puffiness and roundness you want to reduce), disrupts estrogen and progesterone (causing acne, irregular cycles, and mood swings), and causes hair follicles to enter a resting phase (causing hair shedding). Managing cortisol is one of the most powerful anti-aging and body composition levers available.',
    when: 'All day — the habits above are woven into your existing routine. The chamomile tea, morning light, and pilates sessions together create a powerful cortisol-lowering effect over 8–12 weeks.',
  },
  {
    ico: '🌸',
    t: 'Hormone-Protective Eating',
    b: 'Eggs provide cholesterol — the raw material for all sex hormones. Healthy fats from avocado, olive oil, and nuts are precursors to estrogen and progesterone. Avoiding processed foods removes xenoestrogens that disrupt your hormonal balance.',
    how: [
      'Eat eggs daily — cholesterol in the yolk is the direct precursor to all steroid hormones including estrogen and progesterone',
      'Use olive oil, avocado, and nuts at every meal — these fats are required for hormone synthesis',
      'Remove processed foods completely — they contain xenoestrogens (synthetic estrogens) from packaging and additives',
      'Remove dairy — A1 casein raises IGF-1 which disrupts the estrogen-progesterone balance',
      'Add pumpkin seeds (zinc) — zinc is required for healthy progesterone levels',
      'Eat fatty fish 3× weekly — omega-3 reduces the inflammatory prostaglandins that worsen PMS and period pain',
      'Spearmint tea nightly — reduces androgenic hormones that cause excess sebum and acne',
    ],
    why: 'All sex hormones — estrogen, progesterone, testosterone — are synthesised from cholesterol. Without adequate dietary fat and cholesterol, your body cannot produce balanced hormones. Conversely, processed foods contain plasticizers and synthetic compounds that mimic estrogen, flooding receptors and causing estrogen dominance — which manifests as bloating, acne, irregular cycles, and mood swings. Your whole food protocol directly addresses hormonal balance from the inside.',
    when: 'Every meal — hormone-protective eating is built into your existing nutrition plan. The most important habit is eating eggs and healthy fats at every meal, and avoiding all processed foods consistently.',
  },
  {
    ico: '✨',
    t: 'Skin Longevity Nutrients',
    b: 'Daily collagen peptides rebuild the dermal matrix. Vitamin C from calamansi and papaya drives collagen synthesis. Omega-3 reduces water loss for plumpness. Zinc from nuts and lean beef heals and regulates oil glands.',
    how: [
      'Take 5–10g collagen peptides (bovine or marine) dissolved in water daily with a Vitamin C source',
      'Squeeze calamansi on everything — Vitamin C is the co-factor for every step of collagen synthesis',
      'Eat papaya regularly — papain enzyme exfoliates from the inside, improving skin texture',
      'Eat fatty fish 3× weekly — omega-3 reduces transepidermal water loss, keeping skin plump',
      'Add a small handful of pumpkin seeds or walnuts — zinc for oil gland regulation and skin healing',
      'Use collagen water at lunch and post-workout as your hydration with every training meal',
      'Protect with SPF 50+ every single morning — UV exposure degrades collagen 3× faster than time alone',
    ],
    why: 'Collagen is the scaffolding of your skin — it gives it structure, plumpness, and elasticity. By 22 your collagen production is still strong, but it begins declining from around 25 at 1–2% per year. Building the maximum baseline now means the decline starts from a higher point. Oral collagen supplementation with Vitamin C has been shown in clinical trials to improve skin elasticity by up to 20% over 8–12 weeks. The SPF habit alone prevents more visible aging than any cream, serum, or supplement.',
    when: 'Daily: collagen in water at meals, calamansi on food, SPF every morning. Fatty fish 3× weekly. This is your skin longevity baseline — the earlier it starts, the more compounding benefit it builds.',
  },
];

function AgAccordion({ card }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`ag-accordion${open ? ' is-open' : ''}`}>
      <button className="ag-trigger" onClick={() => setOpen(o => !o)}>
        <div className="ag-ico">{card.ico}</div>
        <div className="ag-trigger-text">
          <div className="ag-t">{card.t}</div>
          <div className="ag-b">{card.b}</div>
        </div>
        <span className="ag-arr">▾</span>
      </button>
      <div className="ag-body">
        <div className="ag-inner">
          <div className="ag-section">
            <div className="ag-section-title">📋 How to Do It</div>
            <ul className="ag-list">
              {card.how.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
          <div className="ag-section">
            <div className="ag-section-title">💡 Why It Works</div>
            <p className="ag-section-body">{card.why}</p>
          </div>
          <div className="ag-section">
            <div className="ag-section-title">⏰ Best Time</div>
            <p className="ag-section-body">{card.when}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AntiAging() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Longevity &amp; Hormones</div>
        <h2 className="s-title">Anti-Aging <em>&amp; Hormones</em></h2>
        <p className="s-desc">Starting at 22 is your greatest advantage. Tap each card to reveal the full protocol — how, why, and when. These habits create the visible difference at 32, 42, and beyond.</p>
      </div>

      <div className="ag-list-section splash-item">
        {CARDS.map(c => <AgAccordion key={c.t} card={c} />)}
      </div>

      <div className="divider splash-item">Supplement Stack</div>
      <div className="g-card splash-item">
        <p><span className="pill pg">Daily</span> Collagen peptides (bovine or marine) — dissolved in water at meals with Vitamin C</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Omega-3 fish oil — or eat fatty fish 3× per week</p>
        <p style={{ marginTop: 8 }}><span className="pill pg">Daily</span> Vitamin C from whole food — calamansi, papaya, tomatoes</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Magnesium glycinate — before bed for sleep, recovery, and hormone support</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Zinc picolinate — with food for skin clarity, immune health, and cycle regularity</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Avoid</span> High-dose single vitamins without professional guidance</p>
      </div>
    </div>
  );
}
