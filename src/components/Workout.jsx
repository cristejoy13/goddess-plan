import PetalAccordion from './PetalAccordion';
import { WORKOUT_DAYS } from '../data/workouts';

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

function WorkoutDay({ day }) {
  return (
    <PetalAccordion emoji={day.emoji} emojiBg={day.emojiBg} day={day.day} title={day.title} sub={day.sub}>
      {day.noteBefore && <NoteBox type={day.noteBefore.type} text={day.noteBefore.text} />}
      <ul className="workout-list">
        {day.exercises.map((ex, i) => (
          <li key={i}>
            <span><strong>{ex.name}</strong> — {ex.detail}</span>
          </li>
        ))}
      </ul>
      {day.noteAfter && <NoteBox type={day.noteAfter.type} text={day.noteAfter.text} />}
      <MealBox meals={day.meals} />
    </PetalAccordion>
  );
}

export default function Workout() {
  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&</em> Meals</h2>
        <p className="s-desc">Strength · Pilates · Sprints Mon–Sun. Tap any day to reveal the full workout and meals.</p>
      </div>

      {WORKOUT_DAYS.map((day, i) => <WorkoutDay key={i} day={day} />)}

      <div className="divider splash-item">Your Weekly Blueprint</div>
      <div className="g-card splash-item">
        <p><span className="pill pr">Mon</span> Strength A — The Power Day (hip thrust, RDL, kickback)</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Tue</span> Pilates 1 — Deep core &amp; TVA</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Wed</span> Sprint Day — Sprints or cycling intervals</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Thu</span> Strength B — The Shape Day (split squat, sumo, clamshell)</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Fri</span> Pilates 2 — Flow, spine &amp; side body</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sat</span> Rest or Active Recovery — walk, yoga, swim, or foam roll</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sun</span> Rest or Active Recovery — full rest or gentle movement</p>
        <p style={{ marginTop: 14, fontSize: 13, color: 'var(--text-mid)' }}>
          <strong>Progressive overload:</strong> Weeks 1–2, learn the movements and feel the muscle. Weeks 3–4, add 0.5–2 kg or 1–2 reps. Each month reassess — if every set feels easy, increase load. If form suffers, increase reps before adding weight.
        </p>
      </div>
    </div>
  );
}
