import PetalAccordion from './PetalAccordion';
import { WORKOUT_DAYS } from '../data/workouts';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

const jsDay      = new Date().getDay();         // 0=Sun
const todayIndex = jsDay === 0 ? 6 : jsDay - 1; // 0=Mon … 6=Sun

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

function MealBox({ meals }) {
  return (
    <div className="meal-box">
      <div className="meal-lbl">{meals.label}</div>
      {meals.rows.map((r, i) => (
        <div key={i} className="meal-row">
          <span className="meal-t">{r.time}</span>
          {r.desc}
        </div>
      ))}
    </div>
  );
}

function WorkoutDay({ day, id, defaultOpen, isToday }) {
  return (
    <PetalAccordion
      id={id}
      emoji={day.emoji}
      emojiBg={day.emojiBg}
      day={day.day}
      title={day.title}
      sub={day.sub}
      defaultOpen={defaultOpen}
      isToday={isToday}
    >
      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <ul className="workout-list">
        {day.exercises.map((ex, i) => (
          <li key={i}><strong>{ex.name}</strong> — {ex.detail}</li>
        ))}
      </ul>
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}
      <MealBox meals={day.meals} />
    </PetalAccordion>
  );
}

export default function Workout({ openDayId }) {
  const todayDay = WORKOUT_DAYS[todayIndex];
  const todayId  = DAY_IDS[todayIndex];

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&amp;</em> Meals</h2>
        <p className="s-desc">Today's workout opens automatically. Tap any day to expand the full session and meals.</p>
      </div>

      <div className="today-banner splash-item">
        <span className="today-badge">Today</span>
        <span className="today-banner-text">{todayDay.emoji} {todayDay.day} — {todayDay.title}</span>
      </div>

      {WORKOUT_DAYS.map((day, i) => (
        <WorkoutDay
          key={i}
          day={day}
          id={DAY_IDS[i]}
          defaultOpen={openDayId ? openDayId === DAY_IDS[i] : todayId === DAY_IDS[i]}
          isToday={i === todayIndex}
        />
      ))}

      <div className="divider splash-item">Weekly Blueprint</div>
      <div className="g-card splash-item">
        <p><span className="pill pr">Mon</span> Strength A — Hip Thrust · RDL · Kickback</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Tue</span> Pilates 1 — Deep Core &amp; TVA</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Wed</span> Sprint Day — Sprints or Cycling Intervals</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Thu</span> Strength B — Split Squat · Sumo · Clamshell</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Fri</span> Pilates 2 — Flow · Spine &amp; Side Body</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sat</span> Active Recovery — walk, yoga, swim</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sun</span> Rest — full rest or gentle movement</p>
        <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-mid)' }}>
          <strong>Progressive overload:</strong> Weeks 1–2 learn the movements. Weeks 3–4 add 0.5–2 kg or 1–2 reps. If every set feels easy, increase load. If form breaks, increase reps first.
        </p>
      </div>
    </div>
  );
}
