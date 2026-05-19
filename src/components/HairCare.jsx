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
    tip: 'Closest match to your scalp\'s own sebum. Best carrier oil for rosemary blend.',
  },
  Coconut: {
    emoji: '🥥',
    how: '1–2 drops on the very ends only — not scalp, not mid-shaft. Set a 20-min timer. Always shampoo out completely.',
    tip: 'Once every 2 weeks maximum. Overuse causes protein overload on fine hair.',
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

function OilRotationCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const monthIdx = now.getMonth();
  const today = now.getDate();
  const weeks = getMonthWeeks(year, monthIdx);
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const [selected, setSelected] = useState(null); // { day, oils, dayName }

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

      <div className="oil-rot-month-label">{MONTH_NAMES[monthIdx]} {year}</div>

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
            <div key={name} className="oil-rot-summary-item">
              <span className="oil-rot-summary-em">
                {name === 'Camellia' ? '🌸' : name === 'Rosemary' ? '🌿' : name === 'Argan' ? '✨' : name === 'Jojoba' ? '🌼' : '🥥'}
              </span>
              <span className="oil-rot-summary-name">{name}</span>
              <span className="oil-rot-summary-count">{n}×</span>
            </div>
          ))}
        </div>
      </div>

      <p className="oil-rot-tap-hint">✨ Tap any date on the calendar above to see your oil guide for that day.</p>
    </div>
  );
}

export default function HairCare() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Wavy · Thin Strands</div>
        <h2 className="s-title">Hair Care <em>&amp; Oils</em></h2>
        <p className="s-desc">Your monthly oil rotation calendar — tap any date to see which oils to use and how to apply them.</p>
      </div>

      <div className="divider splash-item">2-Week Oil Rotation</div>
      <OilRotationCalendar />

      <div className="note-box note-rose splash-item">
        🚫 <strong>Avoid for thin strands:</strong> castor oil, sweet almond oil (too heavy), sleeping without a silk cap on oiling nights, brushing dry wavy hair, and coconut oil more than once every 2 weeks. A silk pillowcase alone reduces breakage and frizz noticeably every single night.
      </div>
    </div>
  );
}
