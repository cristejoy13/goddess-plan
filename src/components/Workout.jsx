import { useState } from 'react';
import PetalAccordion from './PetalAccordion';
import { WORKOUT_DAYS } from '../data/workouts';
import IngredientDetailPage from './IngredientDetailPage';

const DAY_IDS = [
  'day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday',
  'day-friday', 'day-saturday', 'day-sunday',
];

const jsDay      = new Date().getDay();
const todayIndex = jsDay === 0 ? 6 : jsDay - 1;

function NoteBox({ type, text }) {
  return <div className={`note-box note-${type}`} style={{ marginBottom: 14 }}>{text}</div>;
}

function MealBox({ meals, onIngredientClick }) {
  return (
    <div className="meal-box">
      <div className="meal-lbl">{meals.label}</div>
      {meals.rows.map((r, i) => (
        <div key={i} className="meal-row">
          <span className="meal-t">{r.time}</span>
          <div className="meal-ingr-list">
            {r.ingredients.map((ingr, j) =>
              ingr.key ? (
                <button key={j} className="meal-ingr-chip" onClick={() => onIngredientClick(ingr)}>
                  {ingr.name}
                </button>
              ) : (
                <span key={j} className="meal-ingr-plain">{ingr.name}</span>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function WorkoutDay({ day, id, defaultOpen, isToday, onIngredientClick }) {
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
      <MealBox meals={day.meals} onIngredientClick={onIngredientClick} />
    </PetalAccordion>
  );
}

export default function Workout({ openDayId, onNavigate }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const todayDay = WORKOUT_DAYS[todayIndex];
  const todayId  = DAY_IDS[todayIndex];

  function selectIngredient(ingr) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setSelectedIngredient(ingr);
  }

  if (selectedIngredient) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedIngredient.key}
        ingredientName={selectedIngredient.name}
        backLabel="Meals"
        onBack={() => setSelectedIngredient(null)}
      />
    );
  }

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&amp;</em> Meals</h2>
        <p className="s-desc">Today's workout opens automatically. Tap any highlighted ingredient to see three ways to prepare it.</p>
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
          onIngredientClick={selectIngredient}
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

      {onNavigate && (
        <div className="workout-nutrition-row splash-item">
          <button className="workout-nutrition-pill" onClick={() => onNavigate('nutrition')}>
            🥗 Nutrition &amp; Recipes →
          </button>
        </div>
      )}
    </div>
  );
}
