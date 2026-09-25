import { useState } from 'react';

const CARDS = [
  {
    ico: '🛌',
    t: 'Sleep — Master Hormone',
    b: 'Sleep 7.5–9 hours. Deep sleep supports glutes and skin.',
    how: [
      'Sleep by 10 PM — key GH window is 10 PM to 2 AM',
      'Keep your room completely dark and cool (18–21°C)',
      'Stop screens at least 30 minutes before bed — blue light suppresses melatonin',
      'Drink chamomile tea 30 minutes before sleep to lower cortisol',
      'No food after 4 PM — digestion during sleep reduces GH secretion',
      'Use a silk pillowcase — reduce face creases and hair breakage',
    ],
    why: 'Deep sleep supports growth hormone. Poor sleep raises cortisol.',
    when: 'Wind down at 9:30 PM. Lights out by 10 PM.',
    group: 'Daily Rhythms',
  },
  {
    ico: '☀️',
    t: 'Morning Sunlight',
    b: 'Get 10–20 min direct morning sunlight before 9 AM.',
    how: [
      'Go outside within 30–60 minutes of waking — daily',
      'Look toward the sun, not directly at it, for 10–20 minutes',
      'No sunglasses — the light must reach your retinas to signal your brain',
      'Walk slowly, stretch, or sit during light exposure',
      'If outdoors is not possible, use a 10,000-lux daylight lamp for 20 min',
    ],
    why: 'Morning light helps set cortisol, mood, and sleep timing.',
    when: 'First thing in the morning, ideally before 8 AM.',
    group: 'Daily Rhythms',
  },
  {
    ico: '🧠',
    t: 'Brain Health',
    b: 'Eat omega-3 fish, eggs, and ginger for brain health.',
    how: [
      'Eat fatty fish (bangus, tuna, tanigue) 3× per week — omega-3 EPA and DHA',
      'Eat eggs daily — yolks provide choline',
      'Add fresh ginger to tea or cooking daily',
      'Add turmeric with black pepper to eggs or broth',
      'Consider an omega-3 supplement (1–2g EPA+DHA) if fish intake is inconsistent',
      'Protect sleep — 7.5+ hours clears brain waste overnight',
    ],
    why: 'Omega-3 supports brain cells. Choline supports memory.',
    when: 'Daily through food. Fish 3× weekly, eggs daily, ginger and turmeric in cooking.',
    group: 'Hormones & Mind',
  },
  {
    ico: '🍃',
    t: 'Cortisol Management',
    b: 'Lower cortisol to help belly fat, skin, hair, and hormones over 8–12 weeks.',
    how: [
      'Drink chamomile tea 30 min before bed',
      'Limit screens after 8 PM',
      'Do pilates 2× per week',
      'Never train hard on poor sleep — cortisol is already high, training raises it further',
      'Take 10 deep slow breaths before meals',
      'Get 10–20 min morning sunlight',
      'Eat regular meals with 4-hour gaps',
    ],
    why: 'High cortisol can hurt collagen, belly fat, hormones, and shedding.',
    when: 'All day. Combine chamomile, morning light, and pilates for 8–12 weeks.',
    group: 'Hormones & Mind',
  },
  {
    ico: '🌸',
    t: 'Hormone-Protective Eating',
    b: 'Eat eggs and healthy fats to support estrogen and progesterone.',
    how: [
      'Eat eggs daily — yolk cholesterol supports hormones',
      'Use olive oil, avocado, and nuts at every meal',
      'Remove processed foods completely',
      'Remove dairy',
      'Add pumpkin seeds (zinc)',
      'Eat fatty fish 3× weekly',
      'Drink spearmint tea nightly',
    ],
    why: 'Sex hormones need cholesterol and dietary fat. Processed foods can disrupt estrogen.',
    when: 'Every meal. Prioritize eggs, healthy fats, and whole foods.',
    group: 'Hormones & Mind',
  },
  {
    ico: '✨',
    t: 'Skin Longevity Nutrients',
    b: 'Take collagen, Vitamin C, and omega-3 for hydrated skin.',
    how: [
      'Take 5–10g collagen peptides (bovine or marine) in water daily with a Vitamin C source',
      'Squeeze calamansi on food for Vitamin C',
      'Eat papaya regularly',
      'Eat fatty fish 3× weekly',
      'Add a small handful of pumpkin seeds or walnuts',
      'Use collagen water at lunch and post-workout',
      'Protect with SPF 50+ every single morning — UV exposure degrades collagen 3× faster than time alone',
    ],
    why: 'Collagen supports structure. Vitamin C helps synthesis. SPF protects results.',
    when: 'Daily: collagen at meals, calamansi on food, SPF every morning. Fatty fish 3× weekly.',
    group: 'Skin Longevity',
  },
];

const GROUPS = [
  { ico: '🌙', title: 'Daily Rhythms',   desc: 'Sleep & morning sunlight' },
  { ico: '🌿', title: 'Hormones & Mind', desc: 'Brain health · Cortisol · Hormone-protective eating' },
  { ico: '✨', title: 'Skin Longevity',  desc: 'Nutrients & supplements for visible results' },
];

function CardDetailPage({ card, onBack }) {
  return (
    <div className="section">
      <button className="ag-detail-back" onClick={onBack}>← Back to Anti-Aging</button>

      <div className="ag-detail-header splash-item">
        <div className="ag-detail-ico">{card.ico}</div>
        <div className="ag-detail-group-tag">{card.group}</div>
        <h2 className="ag-detail-title">{card.t}</h2>
        <p className="ag-detail-intro">{card.b}</p>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">📋 How to Do It</div>
        <ul className="ag-detail-list">
          {card.how.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">💡 Why It Works</div>
        <p className="ag-detail-body">{card.why}</p>
      </div>

      <div className="g-card splash-item">
        <div className="ag-detail-section-title">⏰ Best Time</div>
        <p className="ag-detail-body">{card.when}</p>
      </div>
    </div>
  );
}

export default function AntiAging() {
  const [selected, setSelected] = useState(null);

  if (selected) return <CardDetailPage card={selected} onBack={() => setSelected(null)} />;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Longevity &amp; Hormones</div>
        <h2 className="s-title">Anti-Aging <em>&amp; Hormones</em></h2>
        <p className="s-desc">Tap any topic for how, why, and when.</p>
      </div>

      {GROUPS.map(group => (
        <div key={group.title}>
          <div className="divider splash-item">{group.ico} {group.title}</div>
          <div className="ag-nav-list splash-item">
            {CARDS.filter(c => c.group === group.title).map(card => (
              <button key={card.t} className="ag-nav-item" onClick={() => setSelected(card)}>
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
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Magnesium glycinate — before bed for sleep and recovery</p>
        <p style={{ marginTop: 8 }}><span className="pill py">Consider</span> Zinc picolinate — with food for skin and cycle support</p>
        <p style={{ marginTop: 8 }}><span className="pill pr">Avoid</span> High-dose single vitamins without professional guidance</p>
      </div>
    </div>
  );
}
