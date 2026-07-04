import { useState } from 'react';
import { AVATARS, getAvatarByProfile } from '../avatars';
import { calcTDEE, generatePlan } from '../utils/planGenerator';
import {
  loadReminders, saveReminders, requestNotificationPermission,
  scheduleReminders, playChime, clearFiredReminder, ALL_DAYS,
} from '../utils/notifications';

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

/* ─── 12-hour time helper ─── */
function to12h(time) {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
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
          desc="Change your display name and avatar" onClick={() => openSubScreen('edit')} />
        <SettingsPill icon="📊" label="Body Stats"
          desc="Update height, weight, age, activity, and goal" onClick={() => openSubScreen('body-stats')} />
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
        <p className="s-desc">Your personal maintenance and deficit calories are calculated from these values and shown in every meal plan.</p>
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
        {saved && <p style={{ color: '#6fda82', fontSize: 13 }}>✓ Saved — your meal plans will now show your targets!</p>}

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
        <GuideStep num="3" title="Swipe Right to Go Back" desc="Swipe your finger from left to right across the screen — works on any page." />
        <GuideStep num="4" title="Double-Tap to Go Home" desc="Double-tap on any empty area of the screen (not on a button or card)." />
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🗂️ Finding Content</div>
        <GuideStep num="5" title="Search Bar" desc="Tap the search bar at the top to find any workout, recipe, oil, or skincare step." />
        <GuideStep num="6" title="Hamburger Menu (☰)" desc="Tap the three lines in the left strip to open the full section navigation." />
        <GuideStep num="7" title="Tapping Into Detail Pages" desc="In Hair Care, Anti-Aging, Workouts — tap any card or ingredient chip to open its detail page." />
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
          Built around movement, nutrition, skincare, hair care, and anti-aging habits designed specifically for your goals.
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

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/* ─── Reminder Row ─── */
function RemRow({ reminder, onToggle, onUpdate, onDelete }) {
  const [open, setOpen]           = useState(false);
  const [labelEdit, setLabelEdit] = useState(reminder.label);
  const [timeEdit, setTimeEdit]   = useState(reminder.time);
  const [daysEdit, setDaysEdit]   = useState(reminder.days ?? ALL_DAYS);

  function toggleDay(d) {
    if (daysEdit.includes(d) && daysEdit.length === 1) return; // must have ≥1 day
    setDaysEdit(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d].sort((a,b)=>a-b));
  }

  function save() {
    const trimmed = labelEdit.trim() || reminder.label;
    if (timeEdit !== reminder.time) clearFiredReminder(reminder.id);
    onUpdate(reminder.id, { label: trimmed, time: timeEdit, days: daysEdit });
    setOpen(false);
  }

  const activeDays = reminder.days ?? ALL_DAYS;

  return (
    <div className="rem-row-wrap">
      <div className="rem-row" onClick={() => setOpen(o => !o)}>
        <span className="rem-emoji">{reminder.emoji}</span>
        <div className="rem-info">
          <div className="rem-label">{reminder.label}</div>
          <div className="rem-day-time">
            <span className="rem-time-display">{to12h(reminder.time)}</span>
            <span className="rem-days-mini">
              {DAY_LABELS.map((l, i) => (
                <span key={i} className={`rem-day-dot${activeDays.includes(i) ? ' on' : ''}`}>{l}</span>
              ))}
            </span>
          </div>
        </div>
        <button
          className={`rem-toggle${reminder.enabled ? ' on' : ''}`}
          onClick={e => { e.stopPropagation(); onToggle(reminder.id); }}
          aria-label={reminder.enabled ? 'Disable' : 'Enable'}
        >
          <div className="rem-toggle-knob" />
        </button>
        <span className="rem-expand-arrow">{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div className="rem-edit-panel">
          <label className="rem-edit-lbl">Name</label>
          <input
            className="rem-label-edit"
            value={labelEdit}
            onChange={e => setLabelEdit(e.target.value)}
            placeholder="Reminder name"
            maxLength={32}
            autoFocus
          />
          <label className="rem-edit-lbl" style={{ marginTop: 10 }}>Time</label>
          <input
            type="time"
            className="rem-time-input"
            value={timeEdit}
            onChange={e => setTimeEdit(e.target.value)}
            style={{ width: '100%' }}
          />
          <label className="rem-edit-lbl" style={{ marginTop: 10 }}>Days</label>
          <div className="rem-day-chips">
            {DAY_LABELS.map((l, i) => (
              <button
                key={i}
                type="button"
                className={`rem-day-chip${daysEdit.includes(i) ? ' on' : ''}`}
                onClick={() => toggleDay(i)}
              >{l}</button>
            ))}
          </div>
          <div className="rem-edit-btns" style={{ marginTop: 14 }}>
            <button className="ob-btn-primary" onClick={save}>Save ✓</button>
            <button className="rem-delete-btn" onClick={() => onDelete(reminder.id)}>Delete 🗑️</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reminders Screen ─── */
function RemindersScreen({ onBack }) {
  const [reminders, setReminders] = useState(loadReminders);
  const [permission, setPermission] = useState(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [testPlayed, setTestPlayed] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmoji, setNewEmoji] = useState('⏰');
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  async function handleEnable() {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      scheduleReminders(reminders);
    }
  }

  function applyUpdate(updated) {
    const sorted = [...updated].sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0);
    setReminders(sorted);
    saveReminders(sorted);
    if (permission === 'granted') scheduleReminders(sorted);
  }

  function toggle(id) { applyUpdate(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)); }
  function updateReminder(id, changes) { applyUpdate(reminders.map(r => r.id === id ? { ...r, ...changes } : r)); }
  function deleteReminder(id) { applyUpdate(reminders.filter(r => r.id !== id)); }

  function addReminder() {
    if (!newLabel.trim()) return;
    const newR = {
      id: `custom_${Date.now()}`,
      emoji: newEmoji.trim() || '⏰',
      label: newLabel.trim(),
      time: newTime,
      enabled: true,
      body: null,
      days: ALL_DAYS,
    };
    applyUpdate([...reminders, newR]);
    setNewLabel(''); setNewEmoji('⏰'); setNewTime('09:00'); setAddOpen(false);
  }

  function handleTest() { playChime(); setTestPlayed(true); setTimeout(() => setTestPlayed(false), 2000); }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Daily Reminders</div>
        <h2 className="s-title">Your <em>Reminders</em></h2>
        <p className="s-desc">Tap any reminder to edit its name, time, or delete it.</p>
      </div>

      {permission !== 'granted' && (
        <div className="g-card splash-item rem-perm-card">
          <div className="rem-perm-icon">🔔</div>
          <div className="rem-perm-title">
            {permission === 'denied' ? 'Notifications Blocked' : 'Enable Notifications'}
          </div>
          <div className="rem-perm-desc">
            {permission === 'denied'
              ? 'Notifications are blocked in your browser. Open browser site settings, allow notifications, then reload.'
              : 'Allow notifications so Goddess Plan can remind you of your routines even when the app is closed.'}
          </div>
          {permission !== 'denied' && (
            <button className="ob-btn-primary" style={{ marginTop: 14 }} onClick={handleEnable}>
              Enable Notifications 🔔
            </button>
          )}
        </div>
      )}

      {permission === 'granted' && (
        <div className="g-card splash-item rem-active-row">
          <div>
            <div className="settings-section-title" style={{ marginBottom: 2 }}>
              🔔 Notifications Active
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
              Reminders fire when the app is open.
            </div>
          </div>
          <button className="rem-test-btn" onClick={handleTest}>{testPlayed ? '✓ Played!' : '🎵 Test'}</button>
        </div>
      )}

      <div className="g-card splash-item">
        <div className="settings-section-title" style={{ marginBottom: 4 }}>⏰ Daily Schedule</div>
        <p style={{ fontSize: 11.5, color: 'var(--text-soft)', marginBottom: 14, lineHeight: 1.5 }}>
          Tap any reminder to edit name, time, and which days it fires. The Workout reminder message changes automatically each day.
        </p>
        {reminders.map(r => (
          <RemRow
            key={r.id}
            reminder={r}
            onToggle={toggle}
            onUpdate={updateReminder}
            onDelete={deleteReminder}
          />
        ))}
      </div>

      {addOpen ? (
        <div className="g-card splash-item rem-add-form">
          <div className="settings-section-title" style={{ marginBottom: 12 }}>New Reminder</div>
          <div className="rem-add-row">
            <input className="rem-add-emoji-input" value={newEmoji}
              onChange={e => setNewEmoji(e.target.value)} maxLength={2} placeholder="⏰" />
            <input className="rem-add-label-input ob-input" value={newLabel}
              onChange={e => setNewLabel(e.target.value)} placeholder="Reminder name..." maxLength={32} />
          </div>
          <input type="time" className="rem-time-input" value={newTime}
            onChange={e => setNewTime(e.target.value)} style={{ marginTop: 10, marginBottom: 14 }} />
          <div className="rem-add-btns">
            <button className="ob-btn-primary" onClick={addReminder} disabled={!newLabel.trim()}>Add →</button>
            <button className="ob-btn-secondary" onClick={() => setAddOpen(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button className="rem-add-btn splash-item" onClick={() => setAddOpen(true)}>+ Add Reminder</button>
      )}

      <div className="g-card splash-item" style={{ marginTop: 10 }}>
        <div className="settings-section-title" style={{ marginBottom: 10 }}>📅 This Week's Workout Schedule</div>
        {[
          { d: 'Mon', emoji: '🔥', name: 'Strength A', type: 'eating' },
          { d: 'Tue', emoji: '🧘', name: 'Pilates 1',  type: 'fasting' },
          { d: 'Wed', emoji: '⚡', name: 'Sprints',    type: 'eating' },
          { d: 'Thu', emoji: '🍑', name: 'Strength B', type: 'eating' },
          { d: 'Fri', emoji: '🌿', name: 'Pilates 2',  type: 'fasting' },
          { d: 'Sat', emoji: '🚴', name: 'Bike',       type: 'fasting' },
          { d: 'Sun', emoji: '💪', name: 'Back',       type: 'fasting' },
        ].map(w => (
          <div key={w.d} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ width: 28, fontSize: 12, fontWeight: 700, color: 'var(--text-soft)' }}>{w.d}</span>
            <span style={{ fontSize: 16 }}>{w.emoji}</span>
            <span style={{ flex: 1, fontSize: 12, color: 'var(--text-main)' }}>{w.name}</span>
            <span style={{ fontSize: 11, color: w.type === 'eating' ? 'var(--rose)' : 'var(--gold)', fontWeight: 600 }}>
              {w.type === 'eating' ? '🍳 Breakfast' : '⏱ Fast till noon'}
            </span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: 'var(--text-soft)', marginTop: 10 }}>
          Breakfast reminder only fires on eating days (Mon/Wed/Thu) by default. You can adjust the days on any reminder.
        </p>
      </div>

      <p className="settings-about-text splash-item" style={{ marginTop: 14, textAlign: 'center', fontSize: 12 }}>
        Install the app on your home screen for background notifications. 💕
      </p>
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
  if (screen === 'reminders') return <RemindersScreen onBack={() => setScreen('main')} />;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">App Settings</div>
        <h2 className="s-title">Settings</h2>
        <p className="s-desc">Manage your local profile, appearance, and reminders.</p>
      </div>

      <div className="settings-pills-list splash-item">
        <SettingsPill icon="👤" label="Profile"
          desc="Edit name, gender, and avatar" onClick={() => openScreen('profile')} />
        <SettingsPill icon="📊" label="Body Stats & Calories"
          desc={profile?.tdeeKcal ? `Maintenance ${profile.tdeeKcal.toLocaleString()} kcal · Target ${profile.deficitKcal?.toLocaleString() || '—'} kcal` : 'Set height, weight & calorie targets'} onClick={() => openScreen('body-stats')} />
        <SettingsPill icon="🔔" label="Reminders"
          desc="Daily notifications with sound" onClick={() => openScreen('reminders')} />
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
