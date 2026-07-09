import { useState } from 'react';

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
    tip: 'Closest match to your scalp\'s own sebum. Best carrier oil for rosemary blend.',
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
    science: 'Argan oil is rich in Vitamin E and unsaturated fatty acids. As a finishing oil, it coats the cuticle to seal moisture and smooth texture.',
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
    science: 'Jojoba is a liquid wax close to scalp sebum. It helps balance oil, soothe inflammation, and avoid clogging.',
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
      <button className="ag-detail-back" onClick={onBack}>← Back to Hair Care</button>

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

export default function HairCare() {
  const [selectedOil, setSelectedOil] = useState(null);

  if (selectedOil) return <OilBenefitsPage oilName={selectedOil} onBack={() => setSelectedOil(null)} />;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Wavy · Thin Strands</div>
        <h2 className="s-title">Hair Care <em>&amp; Oils</em></h2>
        <p className="s-desc">Tap any date for oils and application steps.</p>
      </div>

      <div className="divider divider-center splash-item">2-Week Oil Rotation</div>
      <OilRotationCalendar onSelectOil={setSelectedOil} />

      <div className="note-box note-rose splash-item">
        🚫 <strong>Avoid for thin strands:</strong> castor oil, sweet almond oil, oiling without a silk cap, dry brushing wavy hair, and coconut oil more than once every 2 weeks. Use a silk pillowcase nightly.
      </div>
    </div>
  );
}
