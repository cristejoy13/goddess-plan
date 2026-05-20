import { WORKOUT_DAYS } from '../data/workouts';

const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const jsDay    = new Date().getDay();
const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

function todayLabel() {
  const d = new Date();
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const GOALS = [
  { label: '🌸 Flat Stomach at Rest', section: 'nutrition',  tab: 'guide'     },
  { label: '✨ Clear, Bright Skin',    section: 'skincare',   tab: 'am'        },
  { label: '💪 Round Glutes',          section: 'workout',    tab: null        },
  { label: '🌿 Low Inflammation',      section: 'nutrition',  tab: 'guide'     },
  { label: '🌺 Healthy Hormones',      section: 'antiaging',  tab: null        },
  { label: '💎 Shiny Wavy Hair',       section: 'haircare',   tab: null        },
  { label: '🧠 Brain Health',          section: 'antiaging',  tab: null        },
  { label: '💧 Less Puffiness',        section: 'nutrition',  tab: 'hydration' },
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

      <div className="daily-plan splash-item">
        <div className="daily-plan-label">Today's Plan</div>

        <DayCard
          icon={today.emoji}
          label="Workout"
          title={today.title}
          sub={today.sub}
          onClick={() => onNavigate('workout')}
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
          onClick={() => onNavigate('haircare')}
        />
      </div>

      <div className="hero-goals splash-item">
        {GOALS.map(g => (
          <button
            key={g.label}
            className="goal-pill"
            onClick={() => onNavigate(g.section, g.tab)}
          >
            {g.label}
          </button>
        ))}
      </div>
    </div>
  );
}
