import { useState, useEffect } from 'react';
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

function WorkoutDay({ day, id, open, onToggle, isToday, onIngredientClick }) {
  return (
    <PetalAccordion
      id={id}
      emoji={day.emoji}
      emojiBg={day.emojiBg}
      day={day.day}
      title={day.title}
      sub={day.sub}
      open={open}
      onToggle={onToggle}
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

export default function Workout({ openDayId, onNavigate, pushBack, clearInnerBack }) {
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const todayDay = WORKOUT_DAYS[todayIndex];
  const todayId  = DAY_IDS[todayIndex];

  // Single-open accordion: only one day open at a time
  const [openId, setOpenId] = useState(openDayId ?? todayId);

  function toggleDay(id) {
    setOpenId(prev => prev === id ? null : id);
  }

  // Scroll directly to the target day when navigating from Home
  useEffect(() => {
    if (!openDayId) return;
    const el = document.getElementById(openDayId);
    if (el) {
      setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function selectIngredient(ingr) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    clearInnerBack?.();
    setSelectedIngredient(ingr);
    pushBack?.(() => {
      setSelectedIngredient(null);
      clearInnerBack?.();
    });
  }

  function closeIngredient() {
    clearInnerBack?.();
    setSelectedIngredient(null);
  }

  if (selectedIngredient) {
    return (
      <IngredientDetailPage
        ingredientKey={selectedIngredient.key}
        ingredientName={selectedIngredient.name}
        backLabel="Meals"
        onBack={closeIngredient}
        pushBack={pushBack}
      />
    );
  }

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">Weekly Structure</div>
        <h2 className="s-title">Movement <em>&amp;</em> Meals</h2>
        <p className="s-desc">Today's workout opens automatically. Tap any day pill to jump directly to that day. Tap any highlighted ingredient to see three ways to prepare it.</p>
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
          open={openId === DAY_IDS[i]}
          onToggle={() => toggleDay(DAY_IDS[i])}
          isToday={i === todayIndex}
          onIngredientClick={selectIngredient}
        />
      ))}

      <div className="divider splash-item">Weekly Blueprint</div>
      <div className="g-card splash-item">
        <p><span className="pill pr">Mon</span> Strength A — Hip Thrust · RDL · Kickback</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Tue</span> Pilates 1 — The Hundred · Single Leg Stretch · Roll-Up</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Wed</span> Sprint Day — Dynamic Warm-Up · Sprints or Intervals · Stretch</p>
        <p style={{ marginTop: 6 }}><span className="pill pr">Thu</span> Strength B — Split Squat · Sumo Squat · Clamshell</p>
        <p style={{ marginTop: 6 }}><span className="pill py">Fri</span> Pilates 2 — Leg Circles · Side Kick Series · Swimming</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sat</span> Bike — Warm-Up Ride · Steady State · Cool-Down</p>
        <p style={{ marginTop: 6 }}><span className="pill pg">Sun</span> Back — Superman Hold · Band Row · Cat-Cow Thread</p>
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
