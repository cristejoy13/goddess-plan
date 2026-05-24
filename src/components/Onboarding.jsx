import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';
import { AVATARS } from '../avatars';

const MOODS = [
  { id: 'exhausted',  emoji: '😴', label: 'Exhausted' },
  { id: 'notgreat',   emoji: '😕', label: 'Not great' },
  { id: 'good',       emoji: '😊', label: 'Good' },
  { id: 'great',      emoji: '😄', label: 'Great' },
  { id: 'energetic',  emoji: '⚡', label: 'Energetic' },
];

const STEPS = ['profile', 'body', 'health', 'questionnaire'];

function StepDots({ current }) {
  return (
    <div className="ob-dots">
      {STEPS.map((s, i) => (
        <div key={s} className={`ob-dot${current === s ? ' active' : STEPS.indexOf(current) > i ? ' done' : ''}`} />
      ))}
    </div>
  );
}

const GOALS = [
  { id: 'stronger',    emoji: '💪', label: 'Get stronger' },
  { id: 'loseweight',  emoji: '🔥', label: 'Lose weight' },
  { id: 'flexible',    emoji: '🧘', label: 'More flexibility' },
  { id: 'energy',      emoji: '⚡', label: 'More energy' },
  { id: 'sleep',       emoji: '😴', label: 'Better sleep' },
  { id: 'wellness',    emoji: '🌿', label: 'Overall wellness' },
];

const ACTIVITY_LEVELS = [
  { id: 'beginner',    emoji: '🌱', label: 'Just starting out' },
  { id: 'light',       emoji: '🚶', label: 'Lightly active' },
  { id: 'moderate',    emoji: '🏃', label: 'Moderately active' },
  { id: 'active',      emoji: '💪', label: 'Very active (4+/week)' },
];

const WORKOUT_DAYS = [
  { id: '1-2', label: '1–2 days' },
  { id: '3-4', label: '3–4 days' },
  { id: '5-6', label: '5–6 days' },
  { id: '7',   label: 'Every day' },
];

const WORKOUT_TIMES = [
  { id: 'morning',   emoji: '🌅', label: 'Morning' },
  { id: 'afternoon', emoji: '☀️', label: 'Afternoon' },
  { id: 'evening',   emoji: '🌙', label: 'Evening' },
  { id: 'anytime',   emoji: '🤷', label: 'No preference' },
];

const CHALLENGES = [
  { id: 'time',       emoji: '⏰', label: 'Finding time' },
  { id: 'energy',     emoji: '😴', label: 'Low energy' },
  { id: 'eating',     emoji: '🍕', label: 'Eating habits' },
  { id: 'consistent', emoji: '🔄', label: 'Staying consistent' },
  { id: 'stress',     emoji: '😣', label: 'Stress & recovery' },
  { id: 'unsure',     emoji: '🙋', label: 'Not sure where to start' },
];

const SECTIONS = [
  { id: 'nutrition', emoji: '🥗', label: 'Nutrition Plan' },
  { id: 'skincare',  emoji: '✨', label: 'Skincare Routine' },
  { id: 'haircare',  emoji: '💆', label: 'Hair Care' },
];

const MEAL_FREQ = [
  { id: '2', label: '2 meals' },
  { id: '3', label: '3 meals' },
  { id: '4', label: '4 meals' },
  { id: '5', label: '5 meals' },
];
const FASTING = [
  { id: 'none',  emoji: '🍽️', label: 'No fasting' },
  { id: '16:8',  emoji: '⏱️', label: '16:8' },
  { id: '18:6',  emoji: '⏱️', label: '18:6' },
  { id: '20:4',  emoji: '⏱️', label: '20:4' },
];

function ChipBtn({ selected, onClick, emoji, label, multi }) {
  return (
    <button
      type="button"
      className={`ob-chip${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {emoji && <span className="ob-chip-em">{emoji}</span>}
      <span>{label}</span>
    </button>
  );
}

function QuestionnaireScreen({ form, setForm, onNext, onBack, saving }) {
  function toggleGoal(id) {
    const goals = form.goals || [];
    setForm(f => ({ ...f, goals: goals.includes(id) ? goals.filter(g => g !== id) : [...goals, id] }));
  }
  function toggleSection(id) {
    const sections = form.sections || [];
    setForm(f => ({ ...f, sections: sections.includes(id) ? sections.filter(s => s !== id) : [...sections, id] }));
  }
  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  const goals    = form.goals    || [];
  const sections = form.sections || [];

  return (
    <div className="ob-screen">
      <StepDots current="questionnaire" />
      <div className="ob-icon">✨</div>
      <h2 className="ob-title">Let's build your plan</h2>
      <p className="ob-subtitle">5 quick questions — Joy will use these to personalise everything for you</p>

      {/* Meals per day */}
      <div className="ob-field">
        <label className="ob-label">1. How many meals per day do you prefer?</label>
        <div className="ob-chip-wrap">
          {MEAL_FREQ.map(m => (
            <ChipBtn key={m.id} selected={form.mealFrequency === m.id} onClick={() => set('mealFrequency', m.id)} label={m.label} />
          ))}
        </div>
      </div>

      {/* Fasting */}
      <div className="ob-field">
        <label className="ob-label">2. Do you want to try intermittent fasting?</label>
        <div className="ob-chip-wrap">
          {FASTING.map(f => (
            <ChipBtn key={f.id} selected={form.fastingProtocol === f.id} onClick={() => set('fastingProtocol', f.id)} emoji={f.emoji} label={f.label} />
          ))}
        </div>
      </div>

      {/* Q1 */}
      <div className="ob-field">
        <label className="ob-label">3. What's your main goal? <span className="ob-label-note">(pick all that apply)</span></label>
        <div className="ob-chip-wrap">
          {GOALS.map(g => (
            <ChipBtn key={g.id} selected={goals.includes(g.id)} onClick={() => toggleGoal(g.id)}
              emoji={g.emoji} label={g.label} />
          ))}
        </div>
      </div>

      {/* Q2 */}
      <div className="ob-field">
        <label className="ob-label">4. How active are you right now?</label>
        <div className="ob-chip-wrap">
          {ACTIVITY_LEVELS.map(a => (
            <ChipBtn key={a.id} selected={form.activityLevel === a.id} onClick={() => set('activityLevel', a.id)}
              emoji={a.emoji} label={a.label} />
          ))}
        </div>
      </div>

      {/* Q3 */}
      <div className="ob-field">
        <label className="ob-label">5. How many days a week can you work out?</label>
        <div className="ob-chip-wrap">
          {WORKOUT_DAYS.map(d => (
            <ChipBtn key={d.id} selected={form.workoutDays === d.id} onClick={() => set('workoutDays', d.id)}
              label={d.label} />
          ))}
        </div>
      </div>

      {/* Q4 */}
      <div className="ob-field">
        <label className="ob-label">6. When do you prefer to work out?</label>
        <div className="ob-chip-wrap">
          {WORKOUT_TIMES.map(t => (
            <ChipBtn key={t.id} selected={form.workoutTime === t.id} onClick={() => set('workoutTime', t.id)}
              emoji={t.emoji} label={t.label} />
          ))}
        </div>
      </div>

      {/* Q5 */}
      <div className="ob-field">
        <label className="ob-label">7. What's your biggest challenge right now?</label>
        <div className="ob-chip-wrap">
          {CHALLENGES.map(c => (
            <ChipBtn key={c.id} selected={form.biggestChallenge === c.id} onClick={() => set('biggestChallenge', c.id)}
              emoji={c.emoji} label={c.label} />
          ))}
        </div>
      </div>

      {/* Section checklist */}
      <div className="ob-field">
        <label className="ob-label">Which sections would you like in your plan?</label>
        <p className="ob-sections-note">Workouts are always included 💪 — choose any extras below:</p>
        <div className="ob-sections-list">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              type="button"
              className={`ob-section-item${sections.includes(s.id) ? ' selected' : ''}`}
              onClick={() => toggleSection(s.id)}
            >
              <span className="ob-section-check">{sections.includes(s.id) ? '✓' : ''}</span>
              <span className="ob-section-emoji">{s.emoji}</span>
              <span className="ob-section-label">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Open text */}
      <div className="ob-field">
        <label className="ob-label">Anything else for Joy to know? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={3}
          placeholder="Your lifestyle, specific goals, things you love or hate about fitness — anything helps!"
          value={form.joyNote || ''} onChange={e => set('joyNote', e.target.value)} />
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext} disabled={saving}>
          {saving ? 'Saving…' : 'Complete Setup →'}
        </button>
      </div>
    </div>
  );
}

function TermsScreen({ onAgree }) {
  return (
    <div className="ob-screen">
      <div className="ob-icon">🌸</div>
      <h2 className="ob-title">Welcome to The Goddess Plan</h2>
      <p className="ob-subtitle">Before we begin, a few things to note</p>

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
          <span className="ob-terms-emoji">💫</span>
          <div>
            <strong>We genuinely care.</strong> Every part of this app was built with love and intention. We want you to thrive — but results will naturally vary based on your individual health, consistency, and dedication.
          </div>
        </div>
        <div className="ob-terms-section">
          <span className="ob-terms-emoji">👑</span>
          <div>
            <strong>You own your journey.</strong> This plan is a guide, a companion, and a cheerleader — but the goddess doing the work is <em>you</em>.
          </div>
        </div>
        <p className="ob-terms-note">By continuing, you acknowledge and agree to these terms.</p>
      </div>

      <button className="ob-btn-primary" onClick={onAgree}>
        I Agree &amp; Continue →
      </button>
    </div>
  );
}

function ProfileScreen({ form, setForm, onNext }) {
  const avatarList = form.gender ? AVATARS[form.gender] : [];

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
        <input
          className="ob-input"
          type="text"
          placeholder="e.g. Goddess Joy"
          value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          maxLength={32}
        />
      </div>

      <div className="ob-field">
        <label className="ob-label">I am a</label>
        <div className="ob-gender-btns">
          {['female', 'male'].map(g => (
            <button
              key={g}
              className={`ob-gender-btn${form.gender === g ? ' selected' : ''}`}
              onClick={() => setForm(f => ({ ...f, gender: g, avatarId: '' }))}
            >
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
              <button
                key={av.id}
                className={`ob-avatar-item${form.avatarId === av.id ? ' selected' : ''}`}
                style={{ background: av.bg }}
                onClick={() => setForm(f => ({ ...f, avatarId: av.id }))}
                aria-label={av.label}
              >
                <span className="ob-avatar-emoji">{av.emoji}</span>
                <span className="ob-avatar-label">{av.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="ob-btn-primary" onClick={onNext} disabled={!canContinue()}>
        Continue →
      </button>
    </div>
  );
}

function BodyScreen({ form, setForm, onNext, onBack }) {
  const [hu, setHu] = useState(form.heightUnit || 'cm');
  const [wu, setWu] = useState(form.weightUnit || 'kg');

  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function canContinue() {
    return form.age && form.age > 0;
  }

  return (
    <div className="ob-screen">
      <StepDots current="body" />
      <div className="ob-icon">💕</div>
      <h2 className="ob-title">Tell us about yourself</h2>
      <p className="ob-subtitle">This helps us tailor your wellness journey</p>

      <div className="ob-field">
        <label className="ob-label">Age</label>
        <input className="ob-input" type="number" placeholder="e.g. 28" min={13} max={100}
          value={form.age} onChange={e => update('age', e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">Height
          <div className="ob-unit-toggle">
            <button className={hu === 'cm' ? 'active' : ''} onClick={() => { setHu('cm'); update('heightUnit','cm'); }}>cm</button>
            <button className={hu === 'ft' ? 'active' : ''} onClick={() => { setHu('ft'); update('heightUnit','ft'); }}>ft</button>
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
        <label className="ob-label">Weight
          <div className="ob-unit-toggle">
            <button className={wu === 'kg' ? 'active' : ''} onClick={() => { setWu('kg'); update('weightUnit','kg'); }}>kg</button>
            <button className={wu === 'lbs' ? 'active' : ''} onClick={() => { setWu('lbs'); update('weightUnit','lbs'); }}>lbs</button>
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

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext} disabled={!canContinue()}>Continue →</button>
      </div>
    </div>
  );
}

function HealthScreen({ form, setForm, onNext, onBack }) {
  function update(key, val) { setForm(f => ({ ...f, [key]: val })); }

  return (
    <div className="ob-screen">
      <StepDots current="health" />
      <div className="ob-icon">🌿</div>
      <h2 className="ob-title">Your wellness picture</h2>
      <p className="ob-subtitle">This is optional — everything here helps us support you better</p>

      <div className="ob-field">
        <label className="ob-label">How are you feeling lately?</label>
        <div className="ob-mood-row">
          {MOODS.map(m => (
            <button
              key={m.id}
              className={`ob-mood-btn${form.generalFeeling === m.id ? ' selected' : ''}`}
              onClick={() => update('generalFeeling', m.id)}
            >
              <span className="ob-mood-emoji">{m.emoji}</span>
              <span className="ob-mood-label">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="ob-field">
        <label className="ob-label">Any existing health conditions or symptoms? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={3}
          placeholder="e.g. PCOS, lower back pain, asthma — or leave blank if none"
          value={form.illnesses} onChange={e => update('illnesses', e.target.value)} />
      </div>

      <div className="ob-field">
        <label className="ob-label">Anything else we should know? <span className="ob-label-note">(optional)</span></label>
        <textarea className="ob-textarea" rows={2}
          placeholder="e.g. postpartum recovery, training for an event, managing stress"
          value={form.otherDetails} onChange={e => update('otherDetails', e.target.value)} />
      </div>

      <div className="ob-nav-row">
        <button className="ob-btn-secondary" onClick={onBack}>← Back</button>
        <button className="ob-btn-primary" onClick={onNext}>Continue →</button>
      </div>
    </div>
  );
}

function DoneScreen({ username }) {
  return (
    <div className="ob-screen ob-done-screen">
      <div className="ob-done-crown">👑</div>
      <h2 className="ob-done-title">Welcome, {username || 'Goddess'}!</h2>
      <p className="ob-done-sub">Your Goddess Plan is ready and waiting for you.</p>
      <p className="ob-done-note">
        Every workout, meal, skincare step, and challenge has been curated with you in mind.<br />
        This is your year. 💕
      </p>
    </div>
  );
}

export default function Onboarding({ user, onComplete }) {
  const [step, setStep] = useState('terms');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    username: user?.displayName || '',
    avatarId: '',
    gender: '',
    age: '',
    heightCm: '', heightFt: '', heightIn: '', heightUnit: 'cm',
    weightKg: '', weightLbs: '', weightUnit: 'kg',
    illnesses: '',
    generalFeeling: '',
    otherDetails: '',
    goals: [],
    activityLevel: '',
    workoutDays: '',
    workoutTime: '',
    biggestChallenge: '',
    mealFrequency: '',
    fastingProtocol: '',
    sections: [],
    joyNote: '',
  });

  async function handleComplete() {
    setSaving(true);
    try {
      // Normalise to cm / kg for BMR calculation
      const heightCm = form.heightUnit === 'cm'
        ? parseFloat(form.heightCm) || 0
        : ((parseFloat(form.heightFt) || 0) * 30.48 + (parseFloat(form.heightIn) || 0) * 2.54);
      const weightKg = form.weightUnit === 'kg'
        ? parseFloat(form.weightKg) || 0
        : (parseFloat(form.weightLbs) || 0) / 2.2046;
      const age = parseInt(form.age) || 0;

      // Mifflin-St Jeor (female)
      const bmr = heightCm && weightKg && age
        ? Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161)
        : null;

      // TDEE per day type (TDEE = BMR × activity multiplier)
      const tdee = bmr ? {
        strength: Math.round(bmr * 1.55),  // Mon/Wed/Thu — heavy lifting
        light:    Math.round(bmr * 1.375), // Tue/Fri/Sat/Sun — pilates, bike, back
      } : null;
      // Deficit target: TDEE - 400 kcal
      const deficit = tdee ? {
        strength: tdee.strength - 400,
        light:    tdee.light - 400,
      } : null;

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
        illnesses: form.illnesses.trim(),
        generalFeeling: form.generalFeeling,
        otherDetails: form.otherDetails.trim(),
        goals: form.goals,
        activityLevel: form.activityLevel,
        workoutDays: form.workoutDays,
        workoutTime: form.workoutTime,
        biggestChallenge: form.biggestChallenge,
        sections: ['workouts', ...form.sections],
        joyNote: form.joyNote.trim(),
        mealFrequency: form.mealFrequency,
        fastingProtocol: form.fastingProtocol,
        bmrKcal: bmr,
        tdeeKcal: tdee,
        deficitKcal: deficit,
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

      setStep('done');
      setTimeout(() => onComplete(profileData), 2400);
    } catch (e) {
      console.error('Onboarding save failed:', e);
      setSaving(false);
    }
  }

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        {step === 'terms'         && <TermsScreen         onAgree={() => setStep('profile')} />}
        {step === 'profile'       && <ProfileScreen       form={form} setForm={setForm} onNext={() => setStep('body')} />}
        {step === 'body'          && <BodyScreen          form={form} setForm={setForm} onNext={() => setStep('health')} onBack={() => setStep('profile')} />}
        {step === 'health'        && <HealthScreen        form={form} setForm={setForm} onNext={() => setStep('questionnaire')} onBack={() => setStep('body')} />}
        {step === 'questionnaire' && <QuestionnaireScreen form={form} setForm={setForm} onNext={handleComplete} onBack={() => setStep('health')} saving={saving} />}
        {step === 'done'          && <DoneScreen          username={form.username} />}
      </div>
    </div>
  );
}
