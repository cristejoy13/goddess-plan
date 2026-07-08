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
  { label: 'Mon', emoji: '🍑', dayId: 'day-monday'    },
  { label: 'Tue', emoji: '🪷', dayId: 'day-tuesday'   },
  { label: 'Wed', emoji: '🌿', dayId: 'day-wednesday' },
  { label: 'Thu', emoji: '🔥', dayId: 'day-thursday'  },
  { label: 'Fri', emoji: '✨', dayId: 'day-friday'    },
  { label: 'Sat', emoji: '⚡', dayId: 'day-saturday'  },
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
        <div className="hero-brand-tag">🌸 1,200 Light Days · 1,500 Hard Days 🌸</div>
        <h1 className="hero-brand-title">The <em>Goddess</em> Plan</h1>
        <div className="hero-brand-sub">Flat Tummy · Small Waist · Round Glutes · Glow</div>
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

      {/* The Goal */}
      <div className="hero-goal splash-item">
        <div className="hero-goal-label">The Goal 🎯</div>
        <div className="hero-goal-line">Flat stomach at rest · Small waist · Big round glutes · Healthy gut · Zero bloat</div>
      </div>

      {/* Say NO to GODSSSS */}
      <div className="hero-code splash-item hero-code-no">
        <div className="hero-code-head">Say <span className="cc-no">NO</span> to <span className="cc-word">GODSSSS</span></div>
        <div className="hero-code-grid">
          <div className="cc-row"><span className="cc-letter">G</span><span className="cc-text"><strong>Gluten</strong> — none</span></div>
          <div className="cc-row"><span className="cc-letter">O</span><span className="cc-text"><strong>Oils</strong> — steam &amp; boil, don't fry</span></div>
          <div className="cc-row"><span className="cc-letter">D</span><span className="cc-text"><strong>Dairy</strong> — none</span></div>
          <div className="cc-row"><span className="cc-letter">S</span><span className="cc-text">not too <strong>Sweet</strong></span></div>
          <div className="cc-row"><span className="cc-letter">S</span><span className="cc-text">not too <strong>Salty</strong></span></div>
          <div className="cc-row"><span className="cc-letter">S</span><span className="cc-text">no <strong>Stress</strong></span></div>
          <div className="cc-row cc-yes"><span className="cc-letter">S</span><span className="cc-text">good <strong>Sleep</strong> ✓ <em>the one S you want more of</em></span></div>
        </div>
      </div>

      {/* Eat PFBS */}
      <div className="hero-code splash-item hero-code-yes">
        <div className="hero-code-quote">"Pffff, bullsh*t"</div>
        <div className="hero-code-head">Eat <span className="cc-word">PFBS</span> 👑</div>
        <div className="hero-code-grid">
          <div className="cc-row"><span className="cc-letter">P</span><span className="cc-text"><strong>Protein</strong> — at 3 PM on glute and sprint days</span></div>
          <div className="cc-row"><span className="cc-letter">F</span><span className="cc-text"><strong>Fruits</strong> — at 12 PM every day</span></div>
          <div className="cc-row"><span className="cc-letter">B</span><span className="cc-text"><strong>Bland</strong> — plain food = no bloat</span></div>
          <div className="cc-row"><span className="cc-letter">S</span><span className="cc-text"><strong>Small</strong> — moderate portions</span></div>
        </div>
      </div>

      {/* Eat SLOW */}
      <div className="hero-code splash-item hero-code-yes">
        <div className="hero-code-head">Eat <span className="cc-word">SLOW</span> 🐢</div>
        <div className="hero-code-grid">
          <div className="cc-row"><span className="cc-letter">S</span><span className="cc-text"><strong>Small</strong> bites, chew fully</span></div>
          <div className="cc-row"><span className="cc-letter">L</span><span className="cc-text"><strong>Last</strong> meal by 5 PM</span></div>
          <div className="cc-row"><span className="cc-letter">O</span><span className="cc-text"><strong>Only</strong> to 80% full</span></div>
          <div className="cc-row"><span className="cc-letter">W</span><span className="cc-text"><strong>Walk</strong> after every meal</span></div>
        </div>
      </div>

      {/* Daily rhythm */}
      <div className="hero-pfbs splash-item">
        <div className="hero-rules">
          <div className="hero-rule"><span>🍓</span><span>Breakfast 12 PM (fruits) · Snack 3 PM · Last meal 5 PM</span></div>
          <div className="hero-rule"><span>🍑</span><span>Protein at 3 PM on glute and sprint days — feed the growth</span></div>
          <div className="hero-rule"><span>🚶</span><span>Walk 10–15 min after every meal — beats bloating</span></div>
          <div className="hero-rule"><span>🥭</span><span>Keep fruits earlier, then use 5 PM vegetables to stay full without heavy late meals</span></div>
          <div className="hero-rule"><span>😴</span><span>Sleep 7.5–9 hrs — this is where the glutes grow</span></div>
          <div className="hero-rule hero-rule-bored"><span>💧</span><span>Drink water first. Wait 10 min. Still hungry? Eat slow. Not hungry? Go do something — walk, stretch, read, whatever btch, I'm not your mother.</span></div>
        </div>
      </div>
    </div>
  );
}
