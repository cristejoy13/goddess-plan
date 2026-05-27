import { WORKOUT_DAYS } from '../data/workouts';

const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const jsDay    = new Date().getDay();
const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

function todayLabel() {
  const d = new Date();
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const WEEK_PILLS = [
  { label: 'Mon', emoji: '🏃', dayId: 'day-monday'    },
  { label: 'Tue', emoji: '🧘', dayId: 'day-tuesday'   },
  { label: 'Wed', emoji: '🔥', dayId: 'day-wednesday' },
  { label: 'Thu', emoji: '🌿', dayId: 'day-thursday'  },
  { label: 'Fri', emoji: '⚡', dayId: 'day-friday'    },
  { label: 'Sat', emoji: '🍑', dayId: 'day-saturday'  },
  { label: 'Sun', emoji: '🌸', dayId: 'day-sunday'    },
];


function DayCard({ icon, label, title, sub, onClick }) {
  return (
    <button className="dc-card" onClick={onClick}>
      <span className="dc-icon">{icon}</span>
      <div className="dc-body">
        <div className="dc-label">{label}</div>
        <div className="dc-title">{title}</div>
        {sub && <div className="dc-sub">{sub}</div>}
      </div>
      <span className="dc-arrow">›</span>
    </button>
  );
}

export default function Hero({ onNavigate }) {
  const today = WORKOUT_DAYS[dayIndex];

  return (
    <div className="hero hero-dashboard">
      <div className="hero-brand">
        <div className="hero-brand-tag">🌸 January — December 2026 🌸</div>
        <h1 className="hero-brand-title">The <em>Goddess</em> Plan</h1>
        <div className="hero-brand-sub">Anti-Bloat · Lean · Glow · Strength · Skin · Hair</div>
      </div>

      <div className="hero-date splash-item">{todayLabel()}</div>

      {/* Jump-to-Day pills — tap any day to go directly to that workout */}
      <div className="hero-week-pills splash-item">
        {WEEK_PILLS.map((p, i) => (
          <button
            key={p.dayId}
            className={`hero-week-pill${i === dayIndex ? ' is-today' : ''}`}
            onClick={() => onNavigate('workout', null, p.dayId)}
          >
            <span className="hero-week-pill-emoji">{p.emoji}</span>
            <span className="hero-week-pill-label">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="daily-plan splash-item">
        <div className="daily-plan-label">Today's Plan</div>

        <DayCard
          icon={today.emoji}
          label="Workout"
          title={today.title}
          sub={today.sub}
          onClick={() => onNavigate('workout', null, `day-${['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][dayIndex]}`)}
        />
        <DayCard
          icon="🌿"
          label="AM Skincare"
          title="Morning Routine"
          sub="Cleanse · Vitamin C · SPF 50+"
          onClick={() => onNavigate('skincare', 'am')}
        />
        <DayCard
          icon="🌙"
          label="PM Skincare"
          title="Night Routine"
          sub="Double cleanse · Retinoid · Peptides"
          onClick={() => onNavigate('skincare', 'pm')}
        />
        <DayCard
          icon="💎"
          label="Hair Care"
          title="Hair Ritual"
          sub="Oil treatment · Scalp massage"
          onClick={() => onNavigate('skincare', 'hair')}
        />
      </div>

      {/* PFBS Motto + Rules */}
      <div className="hero-pfbs splash-item">
        <div className="hero-pfbs-quote">"Pffff, bullsh*t"</div>
        <div className="hero-pfbs-heading">— in short, PFBS 👑</div>
        <div className="hero-pfbs-grid">
          <div className="hero-pfbs-item">
            <span className="hero-pfbs-letter">P</span>
            <div><strong>Protein</strong> every meal<br /><span>No insulin spikes</span></div>
          </div>
          <div className="hero-pfbs-item">
            <span className="hero-pfbs-letter">F</span>
            <div><strong>Fiber</strong> at least once a day<br /><span>Happy gut = happy body</span></div>
          </div>
          <div className="hero-pfbs-item">
            <span className="hero-pfbs-letter">B</span>
            <div><strong>Bland</strong> foods<br /><span>Less puffiness & less bloat</span></div>
          </div>
          <div className="hero-pfbs-item">
            <span className="hero-pfbs-letter">S</span>
            <div><strong>Small</strong> portions<br /><span>80% full — still breathing 💕</span></div>
          </div>
        </div>

        <div className="hero-rules">
          <div className="hero-rule"><span>🌙</span><span>No eating 3–5 hrs before sleep</span></div>
          <div className="hero-rule"><span>⏳</span><span>3 hrs minimum gap between meals</span></div>
          <div className="hero-rule"><span>😴</span><span>Sleep 7.5–9 hours — non-negotiable</span></div>
          <div className="hero-rule"><span>🚶</span><span>Walk 10 min after every big meal</span></div>
          <div className="hero-rule"><span>🍽️</span><span>Fast on rest days · Eat on strength days</span></div>
          <div className="hero-rule hero-rule-bored"><span>💧</span><span>Drink water first. Wait 10 min. Still hungry? Eat. Not hungry? Go do something — workout, walk, play, read, write, whatever btch, I'm not your mother.</span></div>
        </div>
      </div>
    </div>
  );
}
