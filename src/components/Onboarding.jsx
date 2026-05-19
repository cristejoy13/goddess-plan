import { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../firebase';

const AVATARS = {
  female: [
    { id: 'f1', emoji: '🌸', label: 'Blossom', bg: 'linear-gradient(135deg,#3d1a2e,#5c2040)' },
    { id: 'f2', emoji: '🌺', label: 'Ruby',    bg: 'linear-gradient(135deg,#2e1a1a,#4a1a28)' },
    { id: 'f3', emoji: '💫', label: 'Starlight',bg: 'linear-gradient(135deg,#1e1a3d,#2e2060)' },
    { id: 'f4', emoji: '🌼', label: 'Sunny',   bg: 'linear-gradient(135deg,#3a300a,#5a4810)' },
    { id: 'f5', emoji: '🦋', label: 'Fly Free', bg: 'linear-gradient(135deg,#1a2e3d,#1a3a55)' },
    { id: 'f6', emoji: '👑', label: 'Crown',   bg: 'linear-gradient(135deg,#2e2a0a,#4a4010)' },
  ],
  male: [
    { id: 'm1', emoji: '🌊', label: 'Ocean',   bg: 'linear-gradient(135deg,#0a1a3d,#102050)' },
    { id: 'm2', emoji: '⚡', label: 'Thunder', bg: 'linear-gradient(135deg,#3d2e0a,#503810)' },
    { id: 'm3', emoji: '🌿', label: 'Forest',  bg: 'linear-gradient(135deg,#0a2e1a,#103a22)' },
    { id: 'm4', emoji: '🌙', label: 'Night',   bg: 'linear-gradient(135deg,#1a0a3d,#220a55)' },
    { id: 'm5', emoji: '🔥', label: 'Ember',   bg: 'linear-gradient(135deg,#3d0a0a,#550a10)' },
    { id: 'm6', emoji: '⭐', label: 'Nova',    bg: 'linear-gradient(135deg,#2e2e0a,#3a3a10)' },
  ],
};

const MOODS = [
  { id: 'exhausted',  emoji: '😴', label: 'Exhausted' },
  { id: 'notgreat',   emoji: '😕', label: 'Not great' },
  { id: 'good',       emoji: '😊', label: 'Good' },
  { id: 'great',      emoji: '😄', label: 'Great' },
  { id: 'energetic',  emoji: '⚡', label: 'Energetic' },
];

const STEPS = ['profile', 'body', 'health'];

function StepDots({ current }) {
  return (
    <div className="ob-dots">
      {STEPS.map((s, i) => (
        <div key={s} className={`ob-dot${current === s ? ' active' : STEPS.indexOf(current) > i ? ' done' : ''}`} />
      ))}
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

function HealthScreen({ form, setForm, onComplete, onBack, saving }) {
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
        <button className="ob-btn-primary" onClick={onComplete} disabled={saving}>
          {saving ? 'Saving…' : 'Complete Setup →'}
        </button>
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
  });

  async function handleComplete() {
    setSaving(true);
    try {
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
      setTimeout(() => onComplete(profileData), 2200);
    } catch (e) {
      console.error('Onboarding save failed:', e);
      setSaving(false);
    }
  }

  return (
    <div className="ob-wrap">
      <div className="ob-card">
        {step === 'terms'   && <TermsScreen   onAgree={() => setStep('profile')} />}
        {step === 'profile' && <ProfileScreen form={form} setForm={setForm} onNext={() => setStep('body')} />}
        {step === 'body'    && <BodyScreen    form={form} setForm={setForm} onNext={() => setStep('health')} onBack={() => setStep('profile')} />}
        {step === 'health'  && <HealthScreen  form={form} setForm={setForm} onComplete={handleComplete} onBack={() => setStep('body')} saving={saving} />}
        {step === 'done'    && <DoneScreen    username={form.username} />}
      </div>
    </div>
  );
}
