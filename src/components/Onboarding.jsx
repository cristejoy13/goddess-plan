import { useState, useEffect } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';
import { AVATARS } from '../avatars';
import { generatePlan } from '../utils/planGenerator';
import { saveReminders, scheduleReminders, syncRemindersToFirestore } from '../utils/notifications';

// ─── Static data ──────────────────────────────────────────────────────────────

const MOODS = [
  { id: 'exhausted', emoji: '😴', label: 'Exhausted' },
  { id: 'notgreat',  emoji: '😕', label: 'Not great' },
  { id: 'good',      emoji: '😊', label: 'Good' },
  { id: 'great',     emoji: '😄', label: 'Great' },
  { id: 'energetic', emoji: '⚡', label: 'Energetic' },
];

const PRIMARY_GOALS = [
  { id: 'lose_fat',     emoji: '🔥', label: 'Lose fat' },
  { id: 'build_muscle', emoji: '💪', label: 'Build muscle' },
  { id: 'maintain',     emoji: '⚖️', label: 'Maintain' },
];

const GOAL_CHIPS = [
  { id: 'stronger',   label: 'Get stronger' },
  { id: 'loseweight', label: 'Lose weight' },
  { id: 'flexible',   label: 'More flexibility' },
  { id: 'energy',     label: 'More energy' },
  { id: 'sleep',      label: 'Better sleep' },
  { id: 'wellness',   label: 'Overall wellness' },
  { id: 'glow',       label: 'Skin & hair glow' },
  { id: 'confidence', label: 'More confidence' },
];

const CHALLENGES = [
  { id: 'time',       label: 'Finding time' },
  { id: 'energy',     label: 'Low energy' },
  { id: 'eating',     label: 'Eating habits' },
  { id: 'consistent', label: 'Staying consistent' },
  { id: 'stress',     label: 'Stress & recovery' },
  { id: 'unsure',     label: 'Not sure where to start' },
];

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Mostly sitting',     sub: 'Desk job, minimal movement' },
  { id: 'light',     label: 'Lightly active',     sub: '1–3 days/week' },
  { id: 'moderate',  label: 'Moderately active',  sub: '3–5 days/week' },
  { id: 'active',    label: 'Very active',        sub: '6–7 days/week' },
];

const EXPERIENCE_LEVELS = [
  { id: 'beginner',     label: 'Beginner',     sub: 'New to working out' },
  { id: 'intermediate', label: 'Intermediate', sub: '1–2 years' },
  { id: 'advanced',     label: 'Advanced',     sub: '3+ years' },
];

const WORKOUT_DAYS = [
  { id: '1-2', label: '1–2 days' },
  { id: '3-4', label: '3–4 days' },
  { id: '5+',  label: '5+ days' },
];

const WORKOUT_TIMES = [
  { id: 'morning',   label: 'Morning' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'evening',   label: 'Evening' },
  { id: 'anytime',   label: 'No preference' },
];

const EQUIPMENT = [
  { id: 'none',      label: 'None' },
  { id: 'bands',     label: 'Resistance bands' },
  { id: 'dumbbells', label: 'Dumbbells' },
  { id: 'barbell',   label: 'Barbell' },
  { id: 'gym',       label: 'Full gym' },
];

const MEAL_FREQ = [
  { id: '2', label: '2 meals' },
  { id: '3', label: '3 meals' },
  { id: '4', label: '4 meals' },
  { id: '5', label: '5 meals' },
];

const DIET_TYPES = [
  { id: 'balanced',   label: 'Balanced' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan',      label: 'Vegan' },
  { id: 'keto',       label: 'Keto' },
  { id: 'paleo',      label: 'Paleo' },
];

const FASTING = [
  { id: 'none', label: 'No fasting' },
  { id: '16:8', label: '16:8' },
  { id: '18:6', label: '18:6' },
  { id: '20:4', label: '20:4' },
];

const SKIN_TYPES = [
  { id: 'normal',      label: 'Normal' },
  { id: 'dry',         label: 'Dry' },
  { id: 'oily',        label: 'Oily' },
  { id: 'combination', label: 'Combination' },
  { id: 'sensitive',   label: 'Sensitive' },
];

const SKIN_CONCERNS = [
  { id: 'acne',              label: 'Acne / breakouts' },
  { id: 'dryness',           label: 'Dryness / flaking' },
  { id: 'hyperpigmentation', label: 'Dark spots' },
  { id: 'aging',             label: 'Fine lines / aging' },
  { id: 'redness',           label: 'Redness / irritation' },
  { id: 'dullness',          label: 'Dullness' },
];

const HAIR_TEXTURES = [
  { id: 'straight', label: 'Straight' },
  { id: 'wavy',     label: 'Wavy' },
  { id: 'curly',    label: 'Curly' },
  { id: 'coily',    label: 'Coily / kinky' },
];

const HAIR_CONCERNS = [
  { id: 'dryness',  label: 'Dryness' },
  { id: 'breakage', label: 'Breakage' },
  { id: 'frizz',    label: 'Frizz' },
  { id: 'thinning', label: 'Thinning' },
  { id: 'dandruff', label: 'Dandruff' },
  { id: 'growth',   label: 'Slow growth' },
];

const PLAN_SECTIONS = [
  { id: 'nutrition', emoji: '🥗', label: 'Nutrition Plan' },
  { id: 'skincare',  emoji: '✨', label: 'Skincare Routine' },
  { id: 'haircare',  emoji: '💆', label: 'Hair Care' },
];

const STEP_ORDER = ['profile', 'body', 'goals', 'lifestyle', 'fitness', 'nutrition', 'skincare'];

// ─── Shared components ────────────────────────────────────────────────────────

function StepDots({ current }) {
  const idx = STEP_ORDER.indexOf(current);
  return (
    <div className="ob-dots">
      {STEP_ORDER.map((s, i) => (
        <div key={s} className={`ob-dot${i === idx ? ' active' : i < idx ? ' done' : ''}`} />
      ))}
    </div>
  );
}

function ChipBtn({ selected, onClick, emoji, label }) {
  return (
    <button type="button" className={`ob-chip${selected ? ' selected' : ''}`} onClick={onClick}>
      {emoji && <span className="ob-chip-em">{emoji}</span>}
      <span>{label}</span>
    </button>
  );
}

// ─── Step screens ─────────────────────────────────────────────────────────────

function TermsScreen({ onAgree }) {
  return (
    <div className="ob-screen">
      <div className="ob-icon">🌸</div>
      <h2 className="ob-title">Welcome to The Goddess Plan</h2>
      <p className="ob-subtitle">Before we begin, a few things to know</p>

      <div className="ob-terms-scroll">
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">💕</span>
          <div>
            <strong>We're a wellness guide, not doctors.</strong> The workouts, nutrition tips, skincare routines, and challenges in this app are general wellness guidance — not medical prescriptions or professional medical advice.
          </div>
        </div>
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">🌿</span>
          <div>
            <strong>Your body, your choice.</strong> You are in full control of how you use and apply any information in this app. You take full responsibility for your own choices and outcomes.
          </div>
        </div>
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">🩺</span>
          <div>
            <strong>Check with your doctor first.</strong> If you have existing health conditions, injuries, are pregnant, or have any health concerns, please consult a qualified medical professional before starting any new fitness, nutrition, or wellness routine.
          </div>
        </div>
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">👑</span>
          <div>
            <strong>You own your journey.</strong> This plan is a guide, a companion, and a cheerleader — but the goddess doing the work is <em>you</em>.
          </div>
        </div>
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">😂</span>
          <div>
            <strong>About our language.</strong> Any colourful words, phrases, or expressions used in this app — "bullsh*t", "btch", and the like — are purely for personality, humour, and motivation. They carry zero negative intent. This app loves you. We're just not here to sugarcoat things.
          </div>
        </div>
        <p className="ob-terms-note">By continuing, you acknowledge and agree to these terms.</p>
      </div>

      <button className="ob-btn-primary" onClick={onAgree}>I Agree &amp; Continue →</button>
    </div>
  );
}

function ProfileScreen({ form, setForm, onNext }) {
  const avatarList = form.gender ? AVATARS[form.gender] : [];

  useEffect(() => {
    if (form.gender === 'male') {
      document.documentElement.setAttribute('data-theme', 'male');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [form.gender]);

  function canContinue() {
    return form.username.trim().length >= 2 && form.gender && form.avatarId;
  }

  return (
    <div className="ob-screen">
      <StepDots current="profile" />
      <div className="ob-icon">✨</div>
      <h2 className="ob-title">Set up your profile</h2>
      <p className="ob-subtitle">Choose your name and a look that feels like you</p>

      <div className="ob-field">
        <label className="ob-label">Your display name</label>
        <input className="ob-input" type="text" placeholder="e.g. Goddess Joy" maxLength={32}
          value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
      </div>

      <div className="ob-field">
        <label className="ob-label">I am a</label>
        <div className="ob-gender-btns">
          {['female', 'male'].map(g => (
            <button key={g} className={`ob-gender-btn${form.gender === g ? ' selected' : ''}`}
              onClick={() => setForm(f => ({ ...f, gender: g, avatarId: '' }))}>
              {g === 'female' ? '🌸 Female' : '⚡ Male'}
            </button>
          ))}
        </div>
      </div>

      {form.gender && (
        <div className="ob-field">
          <label className="ob-label">Choose your avatar <span className="ob-label-note">(more designs coming soon)</span></label>
          <div className="ob-avatar-grid">
            {avatarList.map(av => (
              <button key={av.id} className={`ob-avatar-item${form.avatarId === av.id ? ' selected' : ''}`}
                style={{ background: av.bg }} onClick={() => setForm(f => ({ ...f, avatarId: av.id }))} aria-label={av.label}>
                <span className="ob-avatar-emoji">{av.emoji}</span>
                <span className="ob-avatar-label">{av.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="ob-btn-primary" onClick={onNext} disabled={!canContinue()}>Continue →</button>
    </div>
  );
}

function BodyScreen({ form, setForm, onNext, onBack }) {
  const [hu, setHu] = useState(form.heightUnit || 'cm');
  const [wu, setWu] = useState(form.weightUnit || 'kg');
  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const showGoalWeight = form.primaryGoal === 'lose_fat' || form.primaryGoal === 'build_muscle';

  return (
    <div className="ob-screen">
      <StepDots current="body" />
      <h2 className="ob-title">Your body</h2>
      <p className="ob-subtitle">We use this to calculate your calorie target.</p>

      <div className="ob-field">
        <label className="ob-label">What's your main goal?</label>
        <div className="ob-primary-goal-grid">
          {PRIMARY_GOALS.map(g => (
            <button key={g.id} type="button"
              className={`ob-primary-goal-btn${form.primaryGoal === g.id ? ' selected' : ''}`}
              onClick={() => update('primaryGoal', g.id)}>
              <span className="ob-pg-emoji">{g.emoji}</span>
              <span className="ob-pg-label">{g.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Age</label>
        <input className="ob-input" type="number" placeholder="e.g. 28" min={13} max={100}
          value={form.age} onChange={e => update('age', e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">Height
          <div className="ob-unit-toggle">
            <button className={hu === 'cm' ? 'active' : ''} onClick={() => { setHu('cm'); update('heightUnit', 'cm'); }}>cm</button>
            <button className={hu === 'ft' ? 'active' : ''} onClick={() => { setHu('ft'); update('heightUnit', 'ft'); }}>ft</button>
          </div>
        </label>
        {hu === 'cm' ? (
          <input className="ob-input" type="number" placeholder="e.g. 163" min={100} max={250}
            value={form.heightCm} onChange={e => update('heightCm', e.target.value)} />
        ) : (
          <div className="ob-two-col">
            <input className="ob-input" type="number" placeholder="ft" min={3} max={8}
              value={form.heightFt} onChange={e => update('heightFt', e.target.value)} />
            <input className="ob-input" type="number" placeholder="in" min={0} max={11}
              value={form.heightIn} onChange={e => update('heightIn', e.target.value)} />
          </div>
        )}
      </div>

      <div className="ob-field">
        <label className="ob-label">Current weight
          <div className="ob-unit-toggle">
            <button className={wu === 'kg' ? 'active' : ''} onClick={() => { setWu('kg'); update('weightUnit', 'kg'); }}>kg</button>
            <button className={wu === 'lbs' ? 'active' : ''} onClick={() => { setWu('lbs'); update('weightUnit', 'lbs'); }}>lbs</button>
          </div>
        </label>
        {wu === 'kg' ? (
          <input className="ob-input" type="number" placeholder="e.g. 58" min={30} max={300}
            value={form.weightKg} onChange={e => update('weightKg', e.target.value)} />
        ) : (
          <input className="ob-input" type="number" placeholder="e.g. 128" min={66} max={660}
            value={form.weightLbs} onChange={e => update('weightLbs', e.target.value)} />
        )}
      </div>

      {showGoalWeight && (
        <div className="ob-field">
          <label className="ob-label">Goal weight <span className="ob-label-note">(optional, {wu})</span></label>
          <input className="ob-input" type="number" placeholder={wu === 'kg' ? 'e.g. 52' : 'e.g. 115'}
            value={form.goalWeight} onChange={e => update('goalWeight', e.target.value)} />
        </div>
      )}

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function GoalsScreen({ form, setForm, onNext, onBack }) {
  function toggleGoal(id) {
    const goals = form.goals || [];
    setForm(f => ({ ...f, goals: goals.includes(id) ? goals.filter(g => g !== id) : [...goals, id] }));
  }
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  const goals = form.goals || [];

  return (
    <div className="ob-screen">
      <StepDots current="goals" />
      <h2 className="ob-title">Goals & challenges</h2>
      <p className="ob-subtitle">Be honest. No judgment here.</p>

      <div className="ob-field">
        <label className="ob-label">What do you want? <span className="ob-label-note">(pick all that apply)</span></label>
        <div className="ob-chip-wrap">
          {GOAL_CHIPS.map(g => (
            <ChipBtn key={g.id} selected={goals.includes(g.id)} onClick={() => toggleGoal(g.id)} label={g.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Biggest challenge right now</label>
        <div className="ob-chip-wrap">
          {CHALLENGES.map(c => (
            <ChipBtn key={c.id} selected={form.biggestChallenge === c.id} onClick={() => set('biggestChallenge', c.id)} label={c.label} />
          ))}
        </div>
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function calcLastMealPreview(sleepTime) {
  if (!sleepTime) return null;
  const [h, m] = sleepTime.split(':').map(Number);
  let total = (h * 60 + m - 270 + 1440) % 1440;
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function LifestyleScreen({ form, setForm, onNext, onBack }) {
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  const lastMeal = calcLastMealPreview(form.sleepTime);
  const isBefore12 = form.sleepTime ? form.sleepTime < '24:00' && form.sleepTime <= '23:59' : true;
  const sleepWarning = form.sleepTime && form.sleepTime >= '00:00' && form.sleepTime <= '04:00';

  return (
    <div className="ob-screen">
      <StepDots current="lifestyle" />
      <h2 className="ob-title">Sleep & lifestyle</h2>
      <p className="ob-subtitle">Your reminders and meal times are built around your sleep.</p>

      <div className="ob-field">
        <label className="ob-label">When do you wake up and sleep?</label>
        <div className="ob-time-row">
          <div className="ob-time-field">
            <span className="ob-time-label">☀️ Wake up</span>
            <input type="time" className="ob-time-input"
              value={form.wakeTime} onChange={e => set('wakeTime', e.target.value)} />
          </div>
          <div className="ob-time-field">
            <span className="ob-time-label">🌙 Bedtime</span>
            <input type="time" className="ob-time-input"
              value={form.sleepTime} onChange={e => set('sleepTime', e.target.value)} />
          </div>
        </div>
        {lastMeal && (
          <div className="ob-last-meal-banner">
            <span className="ob-lm-icon">🍽️</span>
            <div>
              <div className="ob-lm-title">Your last meal: <strong>{lastMeal}</strong></div>
              <div className="ob-lm-sub">No food after this — the Goddess Plan rule 🌿</div>
            </div>
          </div>
        )}
        {sleepWarning && (
          <div className="ob-sleep-warn">⚠️ Try to sleep before midnight for best results</div>
        )}
      </div>

      <div className="ob-field">
        <label className="ob-label">How are you feeling lately?</label>
        <div className="ob-mood-row">
          {MOODS.map(m => (
            <button key={m.id} type="button"
              className={`ob-mood-btn${form.generalFeeling === m.id ? ' selected' : ''}`}
              onClick={() => set('generalFeeling', m.id)}>
              <span className="ob-mood-emoji">{m.emoji}</span>
              <span className="ob-mood-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">How active are you day-to-day? <span className="ob-label-note">(outside workouts)</span></label>
        <div className="ob-exp-grid">
          {ACTIVITY_LEVELS.map(a => (
            <button key={a.id} type="button"
              className={`ob-exp-btn${form.activityLevel === a.id ? ' selected' : ''}`}
              onClick={() => set('activityLevel', a.id)}>
              <span className="ob-exp-label">{a.label}</span>
              <span className="ob-exp-sub">{a.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function FitnessScreen({ form, setForm, onNext, onBack }) {
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function toggleEq(id) {
    const eq = form.equipment || [];
    setForm(f => ({ ...f, equipment: eq.includes(id) ? eq.filter(e => e !== id) : [...eq, id] }));
  }
  const eq = form.equipment || [];

  return (
    <div className="ob-screen">
      <StepDots current="fitness" />
      <h2 className="ob-title">Fitness</h2>
      <p className="ob-subtitle">Tell us where you're at and we'll work with it.</p>

      <div className="ob-field">
        <label className="ob-label">Training experience</label>
        <div className="ob-exp-grid">
          {EXPERIENCE_LEVELS.map(e => (
            <button key={e.id} type="button"
              className={`ob-exp-btn${form.experienceLevel === e.id ? ' selected' : ''}`}
              onClick={() => set('experienceLevel', e.id)}>
              <span className="ob-exp-label">{e.label}</span>
              <span className="ob-exp-sub">{e.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">How many days a week can you work out?</label>
        <div className="ob-chip-wrap">
          {WORKOUT_DAYS.map(d => (
            <ChipBtn key={d.id} selected={form.workoutDays === d.id} onClick={() => set('workoutDays', d.id)} label={d.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Preferred time to work out</label>
        <div className="ob-chip-wrap">
          {WORKOUT_TIMES.map(t => (
            <ChipBtn key={t.id} selected={form.workoutTime === t.id} onClick={() => set('workoutTime', t.id)} label={t.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Equipment you have access to <span className="ob-label-note">(pick all that apply)</span></label>
        <div className="ob-chip-wrap">
          {EQUIPMENT.map(e => (
            <ChipBtn key={e.id} selected={eq.includes(e.id)} onClick={() => toggleEq(e.id)} label={e.label} />
          ))}
        </div>
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function NutritionScreen({ form, setForm, onNext, onBack }) {
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function toggleSection(id) {
    const sections = form.sections || [];
    setForm(f => ({ ...f, sections: sections.includes(id) ? sections.filter(s => s !== id) : [...sections, id] }));
  }
  const sections = form.sections || [];

  return (
    <div className="ob-screen">
      <StepDots current="nutrition" />
      <h2 className="ob-title">Nutrition</h2>
      <p className="ob-subtitle">Protein every meal. Always.</p>

      <div className="ob-field">
        <label className="ob-label">How many meals a day do you prefer?</label>
        <div className="ob-chip-wrap">
          {MEAL_FREQ.map(m => (
            <ChipBtn key={m.id} selected={form.mealFrequency === m.id} onClick={() => set('mealFrequency', m.id)} label={m.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Diet style</label>
        <div className="ob-chip-wrap">
          {DIET_TYPES.map(d => (
            <ChipBtn key={d.id} selected={form.dietType === d.id} onClick={() => set('dietType', d.id)} label={d.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Do you fast? <span className="ob-label-note">(on rest days we fast by default)</span></label>
        <div className="ob-chip-wrap">
          {FASTING.map(f => (
            <ChipBtn key={f.id} selected={form.fastingProtocol === f.id} onClick={() => set('fastingProtocol', f.id)} label={f.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Any food allergies or restrictions? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={2}
          placeholder="e.g. gluten-free, no dairy, nut allergy"
          value={form.allergies} onChange={e => set('allergies', e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">What do you want included in your plan?</label>
        <p className="ob-sections-note">Workouts are always included 💪</p>
        <div className="ob-sections-list">
          {PLAN_SECTIONS.map(s => (
            <button key={s.id} type="button"
              className={`ob-section-item${sections.includes(s.id) ? ' selected' : ''}`}
              onClick={() => toggleSection(s.id)}>
              <span className="ob-section-check">{sections.includes(s.id) ? '✓' : ''}</span>
              <span className="ob-section-emoji">{s.emoji}</span>
              <span className="ob-section-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function SkincareScreen({ form, setForm, onNext, onBack, saving }) {
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function toggleConcern(id) {
    const sc = form.skinConcerns || [];
    setForm(f => ({ ...f, skinConcerns: sc.includes(id) ? sc.filter(x => x !== id) : [...sc, id] }));
  }
  function toggleHairConcern(id) {
    const hc = form.hairConcerns || [];
    setForm(f => ({ ...f, hairConcerns: hc.includes(id) ? hc.filter(x => x !== id) : [...hc, id] }));
  }
  const sc = form.skinConcerns || [];
  const hc = form.hairConcerns || [];

  return (
    <div className="ob-screen">
      <StepDots current="skincare" />
      <h2 className="ob-title">Skin & hair</h2>
      <p className="ob-subtitle">Joy uses this to give you targeted advice.</p>

      <div className="ob-field">
        <label className="ob-label">What's your skin type?</label>
        <div className="ob-chip-wrap">
          {SKIN_TYPES.map(s => (
            <ChipBtn key={s.id} selected={form.skinType === s.id} onClick={() => set('skinType', s.id)} label={s.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Skin concerns <span className="ob-label-note">(pick all that apply)</span></label>
        <div className="ob-chip-wrap">
          {SKIN_CONCERNS.map(s => (
            <ChipBtn key={s.id} selected={sc.includes(s.id)} onClick={() => toggleConcern(s.id)} label={s.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Hair texture</label>
        <div className="ob-chip-wrap">
          {HAIR_TEXTURES.map(h => (
            <ChipBtn key={h.id} selected={form.hairTexture === h.id} onClick={() => set('hairTexture', h.id)} label={h.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Hair concerns <span className="ob-label-note">(pick all that apply)</span></label>
        <div className="ob-chip-wrap">
          {HAIR_CONCERNS.map(h => (
            <ChipBtn key={h.id} selected={hc.includes(h.id)} onClick={() => toggleHairConcern(h.id)} label={h.label} />
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Any health conditions? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={2}
          placeholder="e.g. PCOS, back pain, postpartum — or leave blank"
          value={form.illnesses} onChange={e => set('illnesses', e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">Anything else for Joy? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={2}
          placeholder="Goals, preferences, things you hate — anything goes"
          value={form.joyNote} onChange={e => set('joyNote', e.target.value)} />
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext} disabled={saving}>
          {saving ? 'Building your plan…' : 'Complete Setup →'}
        </button>
      </div>
    </div>
  );
}

function DoneScreen({ username, plan, form }) {
  const goalLabel = PRIMARY_GOALS.find(g => g.id === form.primaryGoal)?.label || '';
  const calTarget = plan?.deficitKcal ?? plan?.tdeeKcal;

  return (
    <div className="ob-screen ob-done-screen">
      <div className="ob-done-crown">👑</div>
      <h2 className="ob-done-title">Welcome, {username || 'Goddess'}!</h2>
      <p className="ob-done-sub">Your personalised Goddess Plan is ready.</p>

      {plan && (
        <div className="ob-plan-summary">
          <div className="ob-plan-card">
            <div className="ob-plan-card-title">🕐 Your daily schedule</div>
            <div className="ob-plan-item"><span>☀️ Wake up</span><strong>{form.wakeTime}</strong></div>
            <div className="ob-plan-item"><span>🍽️ Last meal</span><strong>{plan.lastMealTime}</strong></div>
            <div className="ob-plan-item"><span>🌙 Bedtime</span><strong>{form.sleepTime}</strong></div>
          </div>

          {calTarget && (
            <div className="ob-plan-card">
              <div className="ob-plan-card-title">🔥 Your daily target</div>
              <div className="ob-plan-item"><span>Goal</span><strong>{goalLabel}</strong></div>
              <div className="ob-plan-item"><span>Calories</span><strong>{calTarget} kcal</strong></div>
              {plan.tdeeKcal && plan.deficitKcal !== plan.tdeeKcal && (
                <div className="ob-plan-item"><span>Maintenance</span><strong>{plan.tdeeKcal} kcal</strong></div>
              )}
            </div>
          )}

          <div className="ob-plan-card">
            <div className="ob-plan-card-title">✨ Your plan includes</div>
            <div className="ob-plan-item"><span>💪</span><strong>Workouts (always)</strong></div>
            {form.sections?.includes('nutrition') && <div className="ob-plan-item"><span>🥗</span><strong>Nutrition Plan</strong></div>}
            {form.sections?.includes('skincare') && <div className="ob-plan-item"><span>✨</span><strong>Skincare Routine</strong></div>}
            {form.sections?.includes('haircare') && <div className="ob-plan-item"><span>💆</span><strong>Hair Care</strong></div>}
          </div>
        </div>
      )}

      <div className="ob-pfbs-card" style={{ marginTop: 14, width: '100%' }}>
        <div className="ob-pfbs-title">Your PFBS Daily Code</div>
        <div className="ob-pfbs-row"><span className="ob-pfbs-letter">P</span><div><strong>Protein</strong><span> — every single meal</span></div></div>
        <div className="ob-pfbs-row"><span className="ob-pfbs-letter">F</span><div><strong>Fiber</strong><span> — once a day minimum</span></div></div>
        <div className="ob-pfbs-row"><span className="ob-pfbs-letter">B</span><div><strong>Bland foods</strong><span> — your gut will thank you</span></div></div>
        <div className="ob-pfbs-row"><span className="ob-pfbs-letter">S</span><div><strong>Small portions</strong><span> — 80% full & breathing 💕</span></div></div>
      </div>

      <div className="ob-goddess-rules" style={{ marginTop: 10, width: '100%' }}>
        <div className="ob-goddess-rule"><span>🌙</span><span>No eating after {plan?.lastMealTime || '17:30'}</span></div>
        <div className="ob-goddess-rule"><span>⏳</span><span>3 hrs min gap between meals</span></div>
        <div className="ob-goddess-rule"><span>😴</span><span>7.5–9 hours of sleep every night</span></div>
        <div className="ob-goddess-rule"><span>🚶</span><span>Walk 10 min after every big meal</span></div>
        <div className="ob-goddess-rule"><span>🍽️</span><span>Fast on rest days · Eat on strength days</span></div>
      </div>

      <p className="ob-done-note">Every workout, meal, and skincare step has been curated with you in mind.<br />This is your year. 💕</p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Onboarding({ user, onComplete, isPreview = false }) {
  const [step, setStep] = useState('terms');
  const [saving, setSaving] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [form, setForm] = useState({
    username: user?.displayName || '',
    avatarId: '',
    gender: '',
    age: '',
    heightCm: '', heightFt: '', heightIn: '', heightUnit: 'cm',
    weightKg: '', weightLbs: '', weightUnit: 'kg',
    primaryGoal: '',
    goalWeight: '',
    goals: [],
    biggestChallenge: '',
    wakeTime: '06:30',
    sleepTime: '22:00',
    generalFeeling: '',
    activityLevel: '',
    experienceLevel: '',
    workoutDays: '',
    workoutTime: '',
    equipment: [],
    mealFrequency: '3',
    dietType: '',
    fastingProtocol: '',
    allergies: '',
    sections: ['nutrition', 'skincare', 'haircare'],
    skinType: '',
    skinConcerns: [],
    hairTexture: '',
    hairConcerns: [],
    illnesses: '',
    joyNote: '',
  });

  const [previewDone, setPreviewDone] = useState(false);

  async function handleComplete() {
    if (isPreview) { setPreviewDone(true); return; }
    setSaving(true);
    try {
      // Normalise units
      const heightCm = form.heightUnit === 'cm'
        ? parseFloat(form.heightCm) || 0
        : ((parseFloat(form.heightFt) || 0) * 30.48 + (parseFloat(form.heightIn) || 0) * 2.54);
      const weightKg = form.weightUnit === 'kg'
        ? parseFloat(form.weightKg) || 0
        : (parseFloat(form.weightLbs) || 0) / 2.2046;

      const mealsPerDay = parseInt(form.mealFrequency) || 3;

      // Generate personalised reminders + TDEE
      const plan = generatePlan({
        gender: form.gender,
        age: form.age,
        heightCm,
        weightKg,
        activityLevel: form.activityLevel || 'moderate',
        primaryGoal: form.primaryGoal || 'maintain',
        wakeTime: form.wakeTime,
        sleepTime: form.sleepTime,
        mealsPerDay,
      });
      setGeneratedPlan(plan);

      // Save reminders to localStorage + schedule
      if (plan.remindersV2?.length) {
        saveReminders(plan.remindersV2);
        scheduleReminders(plan.remindersV2);
      }

      const height = form.heightUnit === 'cm'
        ? (form.heightCm ? `${form.heightCm} cm` : '')
        : (form.heightFt ? `${form.heightFt}'${form.heightIn || '0'}"` : '');
      const weight = form.weightUnit === 'kg'
        ? (form.weightKg ? `${form.weightKg} kg` : '')
        : (form.weightLbs ? `${form.weightLbs} lbs` : '');

      const profileData = {
        username: form.username.trim(),
        avatarId: form.avatarId,
        gender: form.gender,
        age: form.age ? Number(form.age) : null,
        height,
        weight,
        heightCm: heightCm || null,
        weightKg: weightKg || null,
        primaryGoal: form.primaryGoal,
        goalWeight: form.goalWeight ? Number(form.goalWeight) : null,
        goals: form.goals,
        biggestChallenge: form.biggestChallenge,
        wakeTime: form.wakeTime,
        sleepTime: form.sleepTime,
        generalFeeling: form.generalFeeling,
        activityLevel: form.activityLevel,
        experienceLevel: form.experienceLevel,
        workoutDays: form.workoutDays,
        workoutTime: form.workoutTime,
        equipment: form.equipment,
        mealFrequency: form.mealFrequency,
        mealsPerDay,
        dietType: form.dietType,
        fastingProtocol: form.fastingProtocol,
        allergies: form.allergies.trim(),
        sections: ['workouts', ...form.sections],
        skinType: form.skinType,
        skinConcerns: form.skinConcerns,
        hairTexture: form.hairTexture,
        hairConcerns: form.hairConcerns,
        illnesses: form.illnesses.trim(),
        joyNote: form.joyNote.trim(),
        bmrKcal: null,
        tdeeKcal: plan.tdeeKcal,
        deficitKcal: plan.deficitKcal,
        lastMealTime: plan.lastMealTime,
        remindersV2: plan.remindersV2 ?? [],
        termsAccepted: true,
        termsAcceptedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        email: user.email || null,
        phone: user.phoneNumber || null,
      };

      await setDoc(doc(db, 'users', user.uid), profileData);

      if (form.username.trim() && form.username.trim() !== user.displayName) {
        await updateProfile(auth.currentUser, { displayName: form.username.trim() });
      }

      // Sync reminders to Firestore too
      if (plan.remindersV2?.length) {
        await syncRemindersToFirestore(user.uid, plan.remindersV2);
      }

      setStep('done');
      setTimeout(() => onComplete(profileData), 2800);
    } catch (e) {
      console.error('Onboarding save failed:', e);
      setSaving(false);
    }
  }

  if (previewDone) {
    return (
      <div className="ob-wrap">
        <div className="ob-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 26, marginBottom: 10 }}>
            Preview Complete!
          </h2>
          <p style={{ color: 'var(--text-soft)', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
            That's the full sign-up flow. Nothing was saved — you're still logged in as yourself. 🌸
          </p>
          <button className="ob-btn-primary" onClick={() => onComplete(null)}>Back to Settings →</button>
        </div>
      </div>
    );
  }

  const nav = {
    terms:     () => setStep('profile'),
    profile:   { next: () => setStep('body'),      back: () => setStep('terms') },
    body:      { next: () => setStep('goals'),     back: () => setStep('profile') },
    goals:     { next: () => setStep('lifestyle'), back: () => setStep('body') },
    lifestyle: { next: () => setStep('fitness'),   back: () => setStep('goals') },
    fitness:   { next: () => setStep('nutrition'), back: () => setStep('lifestyle') },
    nutrition: { next: () => setStep('skincare'),  back: () => setStep('fitness') },
    skincare:  { next: handleComplete,             back: () => setStep('nutrition') },
  };

  return (
    <div className="ob-wrap">
      {isPreview && (
        <div className="ob-preview-banner">
          👀 Preview Mode — nothing will be saved
          <button className="ob-preview-close" onClick={() => onComplete(null)}>✕ Exit</button>
        </div>
      )}
      <div className="ob-card">
        {step === 'terms'     && <TermsScreen     onAgree={nav.terms} />}
        {step === 'profile'   && <ProfileScreen   form={form} setForm={setForm} onNext={nav.profile.next} onBack={nav.profile.back} />}
        {step === 'body'      && <BodyScreen      form={form} setForm={setForm} onNext={nav.body.next}      onBack={nav.body.back} />}
        {step === 'goals'     && <GoalsScreen     form={form} setForm={setForm} onNext={nav.goals.next}    onBack={nav.goals.back} />}
        {step === 'lifestyle' && <LifestyleScreen form={form} setForm={setForm} onNext={nav.lifestyle.next} onBack={nav.lifestyle.back} />}
        {step === 'fitness'   && <FitnessScreen   form={form} setForm={setForm} onNext={nav.fitness.next}  onBack={nav.fitness.back} />}
        {step === 'nutrition' && <NutritionScreen form={form} setForm={setForm} onNext={nav.nutrition.next} onBack={nav.nutrition.back} />}
        {step === 'skincare'  && <SkincareScreen  form={form} setForm={setForm} onNext={nav.skincare.next} onBack={nav.skincare.back} saving={saving} />}
        {step === 'done'      && <DoneScreen      username={form.username} plan={generatedPlan} form={form} />}
      </div>
    </div>
  );
}
