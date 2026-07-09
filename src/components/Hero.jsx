import { useState, useRef } from 'react';
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

const RULE_BOARDS = [
  {
    title: 'No GODSSS',
    emoji: '🚫',
    tone: 'no',
    items: [
      ['G', 'Gluten', 'skip bread, pasta, flour'],
      ['O', 'Oils', 'steam, boil, bake'],
      ['D', 'Dairy', 'avoid milk, cheese, yogurt'],
      ['S', 'Sweet', 'fruit first, no added sugar'],
      ['S', 'Salty', 'keep seasoning light'],
      ['S', 'Stress', 'walk, breathe, sleep'],
    ],
  },
  {
    title: 'PFBS',
    emoji: '✨',
    tone: 'yes',
    items: [
      ['P', 'Protein', '3 PM on hard days'],
      ['F', 'Fruit', '12 PM every day'],
      ['B', 'Bland', 'simple food, calm gut'],
      ['S', 'Small', 'steady portions'],
    ],
  },
  {
    title: 'SLOW',
    emoji: '🐢',
    tone: 'yes',
    items: [
      ['S', 'Small bites', 'put the fork down'],
      ['L', 'Last meal', 'finish by 5 PM'],
      ['O', 'Only 80%', 'light, not stuffed'],
      ['W', 'Walk', '10–15 min after meals'],
    ],
  },
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadChecks() {
  try {
    const s = JSON.parse(localStorage.getItem('gp_today_checks'));
    if (s && s.date === todayKey()) return s.checked || {};
  } catch {}
  return {};
}

function TodayDashboard({ today, todayDayId, onNavigate }) {
  const [checked, setChecked] = useState(loadChecks);

  function toggle(id) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try { localStorage.setItem('gp_today_checks', JSON.stringify({ date: todayKey(), checked: next })); } catch {}
      return next;
    });
  }

  const mealRows = today.meals.rows.slice(0, 3).map((row, i) => {
    const [time, name] = row.time.split(' — ');
    return {
      id: `meal-${i}`,
      icon: ['🍓', '🍽️', '🥗'][i],
      time,
      title: name || 'Meal',
      note: row.ingredients.slice(0, 3).map(item => item.name).join(' · '),
    };
  });

  const rows = [
    { id: 'am-skin', icon: '☀️', title: 'AM skincare', note: 'Cleanse · Vitamin C · SPF', nav: ['skincare', 'am'] },
    { id: 'workout', icon: today.emoji, title: today.title, note: today.sub, nav: ['workout', null, todayDayId] },
    ...mealRows,
    { id: 'walk', icon: '🚶', title: 'Walk 10–15 min after meals', note: 'beats bloating' },
    { id: 'body', icon: '🫧', title: 'Body care', note: 'Shower · Moisturise · SPF', nav: ['skincare', 'body'] },
    { id: 'hair', icon: '💎', title: 'Hair care', note: 'Oil ritual · Scalp massage', nav: ['skincare', 'hair'] },
    { id: 'pm-skin', icon: '🌙', title: 'PM skincare', note: 'Double cleanse · Treatment · Repair', nav: ['skincare', 'pm'] },
  ];

  const done = rows.filter(r => checked[r.id]).length;

  return (
    <div className="today-dashboard splash-item">
      <div className="today-dashboard-top">
        <div>
          <div className="daily-plan-label">Today's Plan</div>
          <div className="today-dashboard-date">
            {today.day} <span className="today-progress">{done}/{rows.length} ✨</span>
          </div>
        </div>
        <button className="today-open-btn" onClick={() => onNavigate('workout', null, todayDayId)}>Open day</button>
      </div>

      <div className="today-timeline">
        {rows.map(r => (
          <div key={r.id} className={`tl-row${checked[r.id] ? ' is-done' : ''}`}>
            <button className="tl-check" aria-label={`Mark ${r.title} done`} onClick={() => toggle(r.id)}>
              <span className="tl-ring" />
            </button>
            <button className="tl-body" onClick={r.nav ? () => onNavigate(...r.nav) : () => toggle(r.id)}>
              <span className="tl-icon">{r.icon}</span>
              <span className="tl-copy">
                <span className="tl-title">
                  {r.time && <em className="tl-time">{r.time}</em>}
                  {r.title}
                </span>
                {r.note && <small className="tl-note">{r.note}</small>}
              </span>
              {r.nav && <span className="tl-arrow">›</span>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleBoard() {
  const [activeCol, setActiveCol] = useState(0);
  const scrollRef = useRef(null);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) { setActiveCol(0); return; }
    setActiveCol(Math.round((el.scrollLeft / max) * (RULE_BOARDS.length - 1)));
  }

  return (
    <div className="rule-board-wrap splash-item">
      <div
        className="rule-board"
        ref={scrollRef}
        onScroll={handleScroll}
        /* Swiping the board must not trigger the app's edge-swipe-back gesture on .main */
        onTouchStart={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
      >
        {RULE_BOARDS.map(board => (
          <div key={board.title} className={`rule-column rule-column-${board.tone}`}>
            <div className="rule-column-title">{board.emoji} {board.title}</div>
            <div className="rule-cards">
              {board.items.map(([letter, title, note]) => (
                <div key={`${board.title}-${letter}-${title}`} className="rule-mini-card">
                  <span className="rule-mini-letter">{letter}</span>
                  <span className="rule-mini-copy">
                    <strong>{title}</strong>
                    <small>{note}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rule-dots" aria-hidden="true">
        {RULE_BOARDS.map((b, i) => <span key={b.title} className={`rule-dot${i === activeCol ? ' active' : ''}`} />)}
      </div>
    </div>
  );
}

export default function Hero({ onNavigate }) {
  const today = WORKOUT_DAYS[dayIndex];
  const todayDayId = `day-${['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][dayIndex]}`;

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

      <div className="hero-goal-ribbon splash-item">🎯 Flat tummy · Small waist · Round glutes · Healthy gut · Glow</div>

      <TodayDashboard today={today} todayDayId={todayDayId} onNavigate={onNavigate} />

      <RuleBoard />

      {/* Gentle reminders — only what the boards & timeline don't already say */}
      <div className="hero-pfbs hero-baby-steps splash-item">
        <div className="hero-rules-title">Gentle reminders 🌙</div>
        <div className="hero-rules">
          <div className="hero-rule"><span>🥭</span><span>Fruits earlier in the day, vegetables at 5 PM</span></div>
          <div className="hero-rule"><span>😴</span><span>Sleep 7.5–9 hours — glutes grow overnight</span></div>
          <div className="hero-rule hero-rule-bored"><span>💧</span><span>Craving? Water first, wait 10 minutes. Still hungry — eat slowly. Bored — walk, stretch, or read a page.</span></div>
        </div>
      </div>
    </div>
  );
}
