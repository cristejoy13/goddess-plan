import { useState } from 'react';
import { AVATARS, getAvatarByProfile } from '../avatars';
import { calcTDEE, generatePlan } from '../utils/planGenerator';

/* ─── Helpers ─── */
function GuideStep({ num, title, desc }) {
  return (
    <div className="guide-step">
      <div className="guide-step-num">{num}</div>
      <div className="guide-step-body">
        <div className="guide-step-title">{title}</div>
        <div className="guide-step-desc">{desc}</div>
      </div>
    </div>
  );
}

function SettingsPill({ icon, label, desc, onClick, danger }) {
  return (
    <button className={`settings-pill${danger ? ' settings-pill-danger' : ''}`} onClick={onClick}>
      <span className="settings-pill-icon">{icon}</span>
      <div className="settings-pill-text">
        <div className="settings-pill-label">{label}</div>
        {desc && <div className="settings-pill-desc">{desc}</div>}
      </div>
      {!danger && <span className="settings-pill-arrow">›</span>}
    </button>
  );
}

/* ─── Edit Profile ─── */
function EditProfileScreen({ profile, onSave, onBack }) {
  const [username, setUsername] = useState(profile?.username || '');
  const [gender, setGender]     = useState(profile?.gender || 'female');
  const [avatarId, setAvatarId] = useState(profile?.avatarId || '');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [saved, setSaved]       = useState(false);
  const avatarList = AVATARS[gender] || [];

  async function handleSave() {
    const trimmed = username.trim();
    if (trimmed.length < 2) { setError('Username must be at least 2 characters.'); return; }
    setError('');
    setSaving(true);
    try {
      const updated = {
        ...profile,
        username: trimmed,
        gender,
        avatarId: avatarId || avatarList[0]?.id || '',
        updatedAt: new Date().toISOString(),
      };
      setSaved(true);
      onSave(updated);
      setTimeout(onBack, 900);
    } catch (e) {
      setError(`Could not save changes. (${e.message})`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Profile</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Your Profile</div>
        <h2 className="s-title">Edit <em>Profile</em></h2>
      </div>
      {saved && <div className="ep-saved-banner splash-item">✓ Profile saved! 🌸</div>}
      <div className="g-card splash-item">
        <div className="settings-section-title">✏️ Display Name</div>
        <input className="ob-input" type="text" maxLength={30}
          placeholder="e.g. Goddess, Your name..."
          value={username} onChange={e => { setUsername(e.target.value); setSaved(false); }} />
      </div>
      <div className="g-card splash-item">
        <div className="settings-section-title">🌸 Avatar Style</div>
        <div className="ob-gender-btns" style={{ marginBottom: 16 }}>
          {['female', 'male'].map(g => (
            <button key={g} type="button"
              className={`ob-gender-btn${gender === g ? ' selected' : ''}`}
              onClick={() => { setGender(g); setAvatarId(''); setSaved(false); }}>
              {g === 'female' ? '🌸 Feminine' : '🌊 Masculine'}
            </button>
          ))}
        </div>
        <div className="ob-avatar-grid">
          {avatarList.map(a => (
            <button key={a.id} type="button"
              className={`ob-avatar-item${avatarId === a.id ? ' selected' : ''}`}
              style={{ background: a.bg }}
              onClick={() => { setAvatarId(a.id); setSaved(false); }}>
              <span className="ob-avatar-emoji">{a.emoji}</span>
              <span className="ob-avatar-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
      {error && <p className="ep-error">{error}</p>}
      <button className="ob-btn-primary splash-item" onClick={handleSave} disabled={saving} style={{ marginTop: 4 }}>
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes →'}
      </button>
    </div>
  );
}

/* ─── Profile Screen ─── */
function ProfileScreen({ profile, onProfileUpdate, onBack, pushBack, clearInnerBack }) {
  const [screen, setScreen] = useState('main');
  const avatar = getAvatarByProfile(profile);

  function openSubScreen(s) {
    pushBack?.(() => { clearInnerBack?.(); setScreen('main'); });
    setScreen(s);
  }

  if (screen === 'edit') {
    return <EditProfileScreen profile={profile}
      onSave={onProfileUpdate} onBack={() => setScreen('main')} />;
  }
  if (screen === 'body-stats') {
    return <BodyStatsScreen profile={profile} onSave={onProfileUpdate} onBack={() => setScreen('main')} />;
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Profile</div>
        <h2 className="s-title">Your <em>Profile</em></h2>
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 14 }}>
        <div className="ep-profile-row">
          {avatar && (
            <div className="ep-avatar-display" style={{ background: avatar.bg }}>
              <span style={{ fontSize: 32 }}>{avatar.emoji}</span>
            </div>
          )}
          <div className="ep-profile-info">
            <p className="ep-profile-name">{profile?.username || 'Goddess'}</p>
            <p className="ep-profile-email">{profile?.gender === 'male' ? 'Masculine theme' : 'Feminine theme'}</p>
          </div>
        </div>
      </div>

      <div className="settings-pills-list">
        <SettingsPill icon="✏️" label="Edit Name & Avatar"
          desc="Change name and avatar" onClick={() => openSubScreen('edit')} />
        <SettingsPill icon="📊" label="Body Stats"
          desc="Update stats and goal" onClick={() => openSubScreen('body-stats')} />
      </div>
    </div>
  );
}

/* ─── Body Stats Screen ─── */
function BodyStatsScreen({ profile, onSave, onBack }) {
  const [heightCm, setHeightCm] = useState(String(profile?.heightCm || ''));
  const [weightKg, setWeightKg] = useState(String(profile?.weightKg || ''));
  const [age,      setAge]      = useState(String(profile?.age      || ''));
  const [activity, setActivity] = useState(profile?.activityLevel || profile?.activity || 'light');
  const [goal,     setGoal]     = useState(profile?.primaryGoal || 'lose_fat');
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState('');

  const ACTIVITIES = [
    { id: 'sedentary', label: 'Sedentary',  desc: 'Desk job, little movement' },
    { id: 'light',     label: 'Light',      desc: '1–3 days/week light exercise' },
    { id: 'moderate',  label: 'Moderate',   desc: '3–5 days/week — our plan' },
    { id: 'active',    label: 'Active',     desc: '6–7 days/week hard training' },
  ];
  const GOALS = [
    { id: 'lose_fat',     label: 'Lose Fat',      desc: '~400 kcal deficit/day' },
    { id: 'maintain',     label: 'Maintain',       desc: 'Eat at maintenance' },
    { id: 'build_muscle', label: 'Build Muscle',   desc: '+300 kcal surplus/day' },
  ];

  const previewTdee = (heightCm && weightKg && age)
    ? calcTDEE(profile?.gender || 'female', Number(age), Number(heightCm), Number(weightKg), activity)
    : null;
  const previewTarget = previewTdee
    ? goal === 'lose_fat'     ? Math.max(1200, previewTdee - 400)
    : goal === 'build_muscle' ? previewTdee + 300
    : previewTdee
    : null;

  async function handleSave() {
    if (!heightCm || !weightKg || !age) { setError('Please fill in height, weight, and age.'); return; }
    setSaving(true); setError('');
    try {
      const { tdeeKcal, deficitKcal } = generatePlan({
        gender: profile?.gender || 'female',
        age: Number(age), heightCm: Number(heightCm), weightKg: Number(weightKg),
        activityLevel: activity, primaryGoal: goal,
      });
      const updated = {
        ...profile,
        heightCm: Number(heightCm), weightKg: Number(weightKg), age: Number(age),
        activity, goal, activityLevel: activity, primaryGoal: goal, tdeeKcal, deficitKcal,
        updatedAt: new Date().toISOString(),
      };
      onSave(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) { setError(`Could not save. (${e.message})`); }
    setSaving(false);
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 16 }}>
        <div className="s-tag">Calorie Targets</div>
        <h2 className="s-title">Body <em>Stats</em></h2>
        <p className="s-desc">These values set your meal-plan calorie targets.</p>
      </div>

      {previewTdee && (
        <div className="bs-preview splash-item">
          <div className="bs-preview-item">
            <div className="bs-preview-ico">🔥</div>
            <div className="bs-preview-label">Maintenance</div>
            <div className="bs-preview-val">{previewTdee.toLocaleString()}<span className="bs-preview-unit"> kcal</span></div>
          </div>
          <div className="bs-preview-divider" />
          <div className="bs-preview-item">
            <div className="bs-preview-ico">🎯</div>
            <div className="bs-preview-label">Your Target</div>
            <div className="bs-preview-val">{previewTarget.toLocaleString()}<span className="bs-preview-unit"> kcal</span></div>
          </div>
        </div>
      )}

      <div className="g-card splash-item" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div className="bs-field">
          <label className="bs-label">Height</label>
          <div className="bs-hint">5'1″ = 155 cm · 5'4″ = 163 cm · 5'7″ = 170 cm</div>
          <div className="bs-input-row">
            <input className="bs-input" type="number" placeholder="e.g. 155" value={heightCm} onChange={e => setHeightCm(e.target.value)} />
            <span className="bs-unit">cm</span>
          </div>
        </div>

        <div className="bs-field">
          <label className="bs-label">Weight</label>
          <div className="bs-input-row">
            <input className="bs-input" type="number" placeholder="e.g. 46" value={weightKg} onChange={e => setWeightKg(e.target.value)} />
            <span className="bs-unit">kg</span>
          </div>
        </div>

        <div className="bs-field">
          <label className="bs-label">Age</label>
          <div className="bs-input-row">
            <input className="bs-input" type="number" placeholder="e.g. 22" value={age} onChange={e => setAge(e.target.value)} />
            <span className="bs-unit">years</span>
          </div>
        </div>

        <div className="bs-field">
          <label className="bs-label">Activity Level</label>
          <div className="bs-options">
            {ACTIVITIES.map(a => (
              <button key={a.id} className={`bs-option${activity === a.id ? ' selected' : ''}`} onClick={() => setActivity(a.id)}>
                <div className="bs-option-label">{a.label}</div>
                <div className="bs-option-desc">{a.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bs-field">
          <label className="bs-label">Primary Goal</label>
          <div className="bs-options">
            {GOALS.map(g => (
              <button key={g.id} className={`bs-option${goal === g.id ? ' selected' : ''}`} onClick={() => setGoal(g.id)}>
                <div className="bs-option-label">{g.label}</div>
                <div className="bs-option-desc">{g.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: 'var(--rose)', fontSize: 13 }}>{error}</p>}
        {saved && <p style={{ color: '#6fda82', fontSize: 13 }}>✓ Saved — meal plans now show your targets.</p>}

        <button className="ob-btn-primary" style={{ width: '100%' }} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : '💾 Save My Stats'}
        </button>
      </div>
    </div>
  );
}

/* ─── Navigate Screen ─── */
function NavigateScreen({ onBack }) {
  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">How To Use</div>
        <h2 className="s-title">Navigate <em>the App</em></h2>
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">⌨️ Keyboard Shortcuts</div>
        <GuideStep num="1" title="Go Back" desc="Cmd + Z on Mac, or Ctrl + Z on Windows." />
        <GuideStep num="2" title="Go Home" desc="Cmd + H on Mac, or Ctrl + H on Windows." />
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">📱 Touch & Phone Gestures</div>
        <GuideStep num="3" title="Swipe Right to Go Back" desc="Swipe left to right across the screen." />
        <GuideStep num="4" title="Double-Tap to Go Home" desc="Double-tap any empty area." />
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🗂️ Finding Content</div>
        <GuideStep num="5" title="Search Bar" desc="Find workouts, recipes, oils, and skincare." />
        <GuideStep num="6" title="Hamburger Menu (☰)" desc="Open full section navigation." />
        <GuideStep num="7" title="Detail Pages" desc="Tap cards or ingredient chips for details." />
      </div>
    </div>
  );
}

/* ─── About Screen ─── */
function AboutScreen({ onBack }) {
  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">About</div>
        <h2 className="s-title">The Goddess <em>Plan</em></h2>
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🌸 About This App</div>
        <p className="settings-about-text">
          Your personal wellness companion for 2026.<br />
          Built around movement, nutrition, skincare, hair care, and anti-aging habits for your goals.
        </p>
        <div className="settings-badge-row">
          <span className="pill pg">PWA</span>
          <span className="pill py">Works Offline</span>
          <span className="pill pg">Device-Only</span>
        </div>
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">💕 Features</div>
        <p className="settings-about-text" style={{ lineHeight: 1.8 }}>
          ✦ 7-day workout plan with exercise detail<br />
          ✦ Interactive meal ingredients with 3 prep options each<br />
          ✦ Daily sweet dessert snacks (high fibre &amp; protein)<br />
          ✦ Full skincare AM + PM + weekly routines<br />
          ✦ Hair oil rotation calendar (31-day)<br />
          ✦ Anti-aging protocol — sleep, cortisol, hormones<br />
          ✦ Monthly challenges tracker
        </p>
      </div>
    </div>
  );
}

/* ─── Main Settings ─── */
export default function Settings({
  profile, onProfileUpdate,
  colorMode, setColorMode,
  pushBack, clearInnerBack,
}) {
  const [screen, setScreen] = useState('main');

  function openScreen(s) {
    pushBack?.(() => { clearInnerBack?.(); setScreen('main'); });
    setScreen(s);
  }

  if (screen === 'profile') {
    return <ProfileScreen profile={profile}
      onProfileUpdate={onProfileUpdate} onBack={() => setScreen('main')}
      pushBack={pushBack} clearInnerBack={clearInnerBack} />;
  }
  if (screen === 'body-stats') {
    return <BodyStatsScreen profile={profile} onSave={onProfileUpdate} onBack={() => setScreen('main')} />;
  }
  if (screen === 'navigate') return <NavigateScreen onBack={() => setScreen('main')} />;
  if (screen === 'about')    return <AboutScreen onBack={() => setScreen('main')} />;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">App Settings</div>
        <h2 className="s-title">Settings</h2>
        <p className="s-desc">Manage your local profile and appearance.</p>
      </div>

      <div className="settings-pills-list splash-item">
        <SettingsPill icon="👤" label="Profile"
          desc="Edit name, gender, and avatar" onClick={() => openScreen('profile')} />
        <SettingsPill icon="📊" label="Body Stats & Calories"
          desc={profile?.tdeeKcal ? `Maintenance ${profile.tdeeKcal.toLocaleString()} kcal · Target ${profile.deficitKcal?.toLocaleString() || '—'} kcal` : 'Set stats and calorie targets'} onClick={() => openScreen('body-stats')} />
        <SettingsPill icon="🌓" label="Appearance"
          desc={colorMode === 'dark' ? 'Currently dark mode' : 'Currently light mode'}
          onClick={() => setColorMode(colorMode === 'dark' ? 'light' : 'dark')} />
        <SettingsPill icon="🗂️" label="Navigate the App"
          desc="Gestures, shortcuts, tips" onClick={() => openScreen('navigate')} />
        <SettingsPill icon="🌸" label="About & Help"
          desc="About the Goddess Plan" onClick={() => openScreen('about')} />
      </div>
    </div>
  );
}
