import { useState, useEffect } from 'react';
import {
  signOut, updateProfile,
  updatePassword, reauthenticateWithCredential,
  EmailAuthProvider, linkWithCredential,
  sendPasswordResetEmail, deleteUser,
} from 'firebase/auth';
import { doc, setDoc, deleteDoc, serverTimestamp, getDocs, query, collection, where } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AVATARS, getAvatarByProfile } from '../avatars';
import {
  loadReminders, saveReminders, requestNotificationPermission,
  scheduleReminders, playChime, registerFCMToken, syncRemindersToFirestore,
  clearFiredReminder,
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

function SignOutModal({ onConfirm, onCancel, user }) {
  const [emailSaved, setEmailSaved] = useState(false);

  function handleSaveEmail() {
    if (user?.email) {
      localStorage.setItem('gp_saved_email', user.email);
      setEmailSaved(true);
    }
  }

  return (
    <div className="signout-overlay">
      <div className="signout-modal">
        <div className="signout-modal-icon">🌸</div>
        <h3 className="signout-modal-title">Ready to leave?</h3>
        <p className="signout-modal-body">Your profile is safely saved in the cloud.<br />See you soon! 💕</p>
        {user?.email && (
          <div className="signout-save-row">
            <span className="signout-save-email">{user.email}</span>
            <button
              className={`signout-save-btn${emailSaved ? ' saved' : ''}`}
              onClick={handleSaveEmail}
              disabled={emailSaved}
            >
              {emailSaved ? '✓ Saved' : '💾 Remember email'}
            </button>
          </div>
        )}
        <div className="signout-modal-btns">
          <button className="signout-stay-btn" onClick={onCancel}>Stay 🌸</button>
          <button className="signout-confirm-btn" onClick={onConfirm}>🚪 Sign Out</button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit Profile ─── */
function EditProfileScreen({ user, profile, onSave, onBack }) {
  const [username, setUsername] = useState(profile?.username || profile?.displayName || '');
  const [gender, setGender]     = useState(profile?.gender || 'female');
  const [avatarId, setAvatarId] = useState(profile?.avatarId || '');
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');
  const [saved, setSaved]       = useState(false);
  const avatarList = AVATARS[gender] || [];

  async function handleSave() {
    const trimmed = username.trim();
    if (trimmed.length < 2) { setError('Username must be at least 2 characters.'); return; }
    if (!avatarId) { setError('Please choose an avatar.'); return; }
    setError('');
    setSaving(true);
    try {
      // Check username uniqueness
      const snap = await getDocs(query(collection(db, 'users'), where('username', '==', trimmed)));
      const taken = snap.docs.find(d => d.id !== user.uid);
      if (taken) { setError('That username is already taken — try a different one.'); setSaving(false); return; }

      const updated = { ...profile, username: trimmed, gender, avatarId, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      await updateProfile(auth.currentUser, { displayName: trimmed });
      setSaved(true);
      onSave(updated);
      setTimeout(onBack, 900);
    } catch (e) {
      setError(`Could not save changes. (${e.code || e.message})`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Account</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Your Profile</div>
        <h2 className="s-title">Edit <em>Profile</em></h2>
      </div>
      {saved && <div className="ep-saved-banner splash-item">✓ Profile saved! 🌸</div>}
      <div className="g-card splash-item">
        <div className="settings-section-title">✏️ Display Name</div>
        <input className="ob-input" type="text" maxLength={30}
          placeholder="e.g. Joy, Goddess, Your name…"
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

/* ─── Password Screen ─── */
function PasswordScreen({ user, onBack }) {
  const hasPassword = user?.providerData?.some(p => p.providerId === 'password');
  const [mode, setMode] = useState('idle'); // 'idle' | 'form' | 'sent' | 'error'
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw]         = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const [showPw, setShowPw]       = useState(false);

  async function handleSave() {
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setError('Passwords do not match.'); return; }
    setError('');
    setSaving(true);
    try {
      if (hasPassword) {
        const cred = EmailAuthProvider.credential(user.email, currentPw);
        await reauthenticateWithCredential(auth.currentUser, cred);
        await updatePassword(auth.currentUser, newPw);
      } else {
        const cred = EmailAuthProvider.credential(user.email, newPw);
        await linkWithCredential(auth.currentUser, cred);
      }
      setMode('sent');
    } catch (e) {
      if (e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential')
        setError('Current password is incorrect. Try "Send reset email" below if you forgot it.');
      else if (e.code === 'auth/weak-password')
        setError('Password is too weak — use 8+ characters including a number.');
      else if (e.code === 'auth/requires-recent-login')
        setError('Session expired for security. Sign out, sign back in, then try again.');
      else if (e.code === 'auth/email-already-in-use')
        setError('A password is already set for this account. Sign out and back in, then try Change Password.');
      else if (e.code === 'auth/provider-already-linked')
        setError('Email/password is already linked. Use Change Password to update it.');
      else
        setError(`Error: ${e.code || e.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleResetEmail() {
    try {
      await sendPasswordResetEmail(auth, user.email);
      setMode('sent');
    } catch {
      setError('Could not send email. Please try again.');
    }
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Account</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Security</div>
        <h2 className="s-title">{hasPassword ? 'Change' : 'Set a'} <em>Password</em></h2>
        <p className="s-desc">
          {hasPassword
            ? 'Update your password below. You\'ll need your current password to confirm.'
            : 'Your account currently uses Google Sign-In. You can add a password so you can also sign in with email.'}
        </p>
      </div>

      {mode === 'sent' && (
        <div className="ep-saved-banner splash-item">
          ✓ {hasPassword ? 'Password updated successfully! 🌸' : 'Password set! You can now sign in with email too. 🌸'}
        </div>
      )}
      {mode !== 'sent' && (
        <>
          {error && <p className="ep-error">{error}</p>}
          <div className="g-card splash-item">
            {hasPassword && (
              <>
                <div className="settings-section-title">Current Password</div>
                <div className="pw-field-wrap">
                  <input className="ob-input" type={showPw ? 'text' : 'password'} placeholder="Enter current password"
                    value={currentPw} onChange={e => setCurrentPw(e.target.value)} />
                  <button type="button" className="pw-eye-btn" onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}>
                    {showPw ? '🙈' : '👁️'}
                  </button>
                </div>
              </>
            )}
            <div className="settings-section-title">{hasPassword ? 'New Password' : 'Choose a Password'}</div>
            <div className="pw-field-wrap">
              <input className="ob-input" type={showPw ? 'text' : 'password'} placeholder="At least 8 characters"
                value={newPw} onChange={e => setNewPw(e.target.value)} />
              <button type="button" className="pw-eye-btn" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
            <div className="settings-section-title">Confirm Password</div>
            <div className="pw-field-wrap">
              <input className="ob-input" type={showPw ? 'text' : 'password'} placeholder="Repeat your new password"
                value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
              <button type="button" className="pw-eye-btn" onClick={() => setShowPw(v => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <button className="ob-btn-primary splash-item" onClick={handleSave} disabled={saving} style={{ marginTop: 4 }}>
            {saving ? 'Saving…' : hasPassword ? 'Update Password →' : 'Set Password →'}
          </button>
          {hasPassword && (
            <button className="section-back-btn" onClick={handleResetEmail}
              style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}>
              Forgot current password? Send reset email →
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Delete Account Screen ─── */
function DeleteAccountScreen({ user, onBack }) {
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [error, setError]         = useState('');

  async function handleDelete() {
    setDeleting(true);
    setError('');
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      Object.keys(localStorage).filter(k => k.startsWith('gp_')).forEach(k => localStorage.removeItem(k));
      await deleteUser(auth.currentUser);
      // auth state change triggers app to show login screen
    } catch (e) {
      if (e.code === 'auth/requires-recent-login') {
        setError('For security, sign out and sign back in, then delete your account.');
      } else {
        setError(`Could not delete account. (${e.code || e.message})`);
      }
      setDeleting(false);
    }
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Account</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Danger Zone</div>
        <h2 className="s-title">Delete <em>Account</em></h2>
        <p className="s-desc">This permanently deletes your account, profile, and all progress. You can sign up again any time.</p>
      </div>

      <div className="g-card splash-item" style={{ borderColor: 'rgba(239,68,68,0.35)' }}>
        <p style={{ fontSize: 13, color: 'var(--text-soft)', marginBottom: 16, lineHeight: 1.6 }}>
          ⚠️ <strong>This cannot be undone.</strong> Your profile, workout history, custom meals, and reminder settings will be permanently removed.
        </p>
        {!confirmed ? (
          <button
            style={{ width: '100%', padding: 14, background: 'rgba(239,68,68,0.12)', border: '1.5px solid rgba(239,68,68,0.4)', borderRadius: 14, color: '#f87171', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setConfirmed(true)}
          >
            Delete My Account 🗑️
          </button>
        ) : (
          <>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#f87171', marginBottom: 14 }}>
              Are you sure? This is permanent and cannot be reversed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                style={{ flex: 1, padding: 14, background: 'rgba(239,68,68,0.25)', border: '1.5px solid rgba(239,68,68,0.6)', borderRadius: 14, color: '#f87171', fontFamily: 'Outfit, sans-serif', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete Everything'}
              </button>
              <button className="ob-btn-secondary" onClick={() => setConfirmed(false)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </>
        )}
        {error && <p className="ep-error" style={{ marginTop: 12 }}>{error}</p>}
      </div>
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

/* ─── Account Screen ─── */
function AccountScreen({ user, profile, onProfileUpdate, onBack, pushBack, clearInnerBack }) {
  const [screen, setScreen] = useState('main'); // 'main' | 'edit' | 'password'
  const avatar = getAvatarByProfile(profile);

  function openSubScreen(s) {
    pushBack?.(() => { clearInnerBack?.(); setScreen('main'); });
    setScreen(s);
  }

  if (screen === 'edit') {
    return <EditProfileScreen user={user} profile={profile}
      onSave={onProfileUpdate} onBack={() => setScreen('main')} />;
  }
  if (screen === 'password') {
    return <PasswordScreen user={user} onBack={() => setScreen('main')} />;
  }
  if (screen === 'delete') {
    return <DeleteAccountScreen user={user} onBack={() => setScreen('main')} />;
  }

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Account</div>
        <h2 className="s-title">Your <em>Account</em></h2>
      </div>

      <div className="g-card splash-item" style={{ marginBottom: 14 }}>
        <div className="ep-profile-row">
          {avatar && (
            <div className="ep-avatar-display" style={{ background: avatar.bg }}>
              <span style={{ fontSize: 32 }}>{avatar.emoji}</span>
            </div>
          )}
          <div className="ep-profile-info">
            {(profile?.username || user?.displayName) && (
              <p className="ep-profile-name">{profile?.username || user?.displayName}</p>
            )}
            {user?.email && <p className="ep-profile-email">{user.email}</p>}
          </div>
        </div>
      </div>

      <div className="settings-pills-list">
        <SettingsPill icon="✏️" label="Edit Name & Avatar"
          desc="Change your display name and avatar" onClick={() => openSubScreen('edit')} />
        <SettingsPill icon="🔑" label={user?.providerData?.some(p => p.providerId === 'password') ? 'Change Password' : 'Set a Password'}
          desc={user?.providerData?.some(p => p.providerId === 'password') ? 'Update your sign-in password' : 'Add a password to your account'}
          onClick={() => openSubScreen('password')} />
        <SettingsPill icon="🗑️" label="Delete Account"
          desc="Permanently remove your account and all data" onClick={() => openSubScreen('delete')} danger />
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
        <GuideStep num="5" title="Move Joy (AI assistant)" desc="Hold the Joy button for 3 seconds, then drag it anywhere on your screen." />
      </div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🗂️ Finding Content</div>
        <GuideStep num="6" title="Search Bar" desc="Tap the search bar at the top to find any workout, recipe, oil, or skincare step." />
        <GuideStep num="7" title="Hamburger Menu (☰)" desc="Tap the three lines in the left strip to open the full section navigation." />
        <GuideStep num="8" title="Tapping Into Detail Pages" desc="In Hair Care, Anti-Aging, Workouts — tap any card or ingredient chip to open its detail page." />
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
          <span className="pill pg">Multi-Device</span>
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
          ✦ Joy AI wellness assistant<br />
          ✦ Monthly challenges tracker
        </p>
      </div>
    </div>
  );
}

/* ─── Swipeable Reminder Row ─── */
function RemRow({ reminder, onToggle, onUpdateTime, onRename, onDelete }) {
  const [open, setOpen]           = useState(false);
  const [labelEdit, setLabelEdit] = useState(reminder.label);
  const [timeEdit, setTimeEdit]   = useState(reminder.time);

  function save() {
    const trimmed = labelEdit.trim();
    if (trimmed && trimmed !== reminder.label) onRename(reminder.id, trimmed);
    if (timeEdit !== reminder.time) {
      clearFiredReminder(reminder.id); // allow it to fire at the new time today
      onUpdateTime(reminder.id, timeEdit);
    }
    setOpen(false);
  }

  return (
    <div className="rem-row-wrap">
      <div className="rem-row" onClick={() => setOpen(o => !o)}>
        <span className="rem-emoji">{reminder.emoji}</span>
        <div className="rem-info">
          <div className="rem-label">{reminder.label}</div>
          <div className="rem-time-display">{to12h(reminder.time)}</div>
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
            style={{ width: '100%', marginBottom: 12 }}
          />
          <div className="rem-edit-btns">
            <button className="ob-btn-primary" onClick={save}>Save ✓</button>
            <button className="rem-delete-btn" onClick={() => onDelete(reminder.id)}>Delete 🗑️</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reminders Screen ─── */
function RemindersScreen({ onBack, user }) {
  const [reminders, setReminders] = useState(loadReminders);
  const [permission, setPermission] = useState(() => {
    if (!('Notification' in window)) return 'unsupported';
    return Notification.permission;
  });
  const [testPlayed, setTestPlayed] = useState(false);
  const [fcmRegistered, setFcmRegistered] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [newEmoji, setNewEmoji] = useState('⏰');
  const [newLabel, setNewLabel] = useState('');
  const [newTime, setNewTime] = useState('09:00');

  useEffect(() => {
    if (permission === 'granted' && user?.uid && !fcmRegistered) {
      registerFCMToken(user.uid).then(token => { if (token) setFcmRegistered(true); });
    }
  }, [permission, user?.uid, fcmRegistered]);

  async function handleEnable() {
    const result = await requestNotificationPermission();
    setPermission(result);
    if (result === 'granted') {
      scheduleReminders(reminders);
      if (user?.uid) {
        const token = await registerFCMToken(user.uid);
        if (token) setFcmRegistered(true);
      }
    }
  }

  function applyUpdate(updated) {
    setReminders(updated);
    saveReminders(updated);
    if (permission === 'granted') scheduleReminders(updated);
    if (user?.uid) syncRemindersToFirestore(user.uid, updated);
  }

  function toggle(id) { applyUpdate(reminders.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r)); }
  function updateTime(id, time) { applyUpdate(reminders.map(r => r.id === id ? { ...r, time } : r)); }
  function renameReminder(id, label) { applyUpdate(reminders.map(r => r.id === id ? { ...r, label } : r)); }
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
              🔔 Notifications Active {fcmRegistered && <span style={{ fontSize: 11, color: 'var(--gold)', marginLeft: 6 }}>· Background push on ✓</span>}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-soft)' }}>
              {fcmRegistered ? 'Reminders fire even when the app is fully closed.' : 'Reminders fire when the app is open.'}
            </div>
          </div>
          <button className="rem-test-btn" onClick={handleTest}>{testPlayed ? '✓ Played!' : '🎵 Test'}</button>
        </div>
      )}

      <div className="g-card splash-item">
        <div className="settings-section-title" style={{ marginBottom: 14 }}>⏰ Daily Schedule</div>
        {reminders.map(r => (
          <RemRow
            key={r.id}
            reminder={r}
            onToggle={toggle}
            onUpdateTime={updateTime}
            onRename={renameReminder}
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

      <p className="settings-about-text splash-item" style={{ marginTop: 14, textAlign: 'center', fontSize: 12 }}>
        Tap any reminder row to edit its name or time. 💕<br />
        Install the app on your home screen for background notifications.
      </p>
    </div>
  );
}

/* ─── Appearance Screen ─── */
function AppearanceScreen({ onBack, colorMode, setColorMode }) {
  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Appearance</div>
        <h2 className="s-title">App <em>Appearance</em></h2>
        <p className="s-desc">Choose how the app looks on your device. Your choice is saved automatically.</p>
      </div>
      <div className="g-card splash-item">
        <div className="settings-section-title" style={{ marginBottom: 14 }}>🎨 Color Mode</div>
        <div className="app-mode-grid">
          <div className="app-mode-option">
            <button
              className={`ob-gender-btn app-mode-btn${colorMode === 'dark' ? ' selected' : ''}`}
              onClick={() => setColorMode('dark')}
            >
              🌙 Dark Mode
            </button>
            <p className="app-mode-desc">Deep backgrounds, easy on the eyes at night.</p>
          </div>
          <div className="app-mode-option">
            <button
              className={`ob-gender-btn app-mode-btn${colorMode === 'light' ? ' selected' : ''}`}
              onClick={() => setColorMode('light')}
            >
              ☀️ Light Mode
            </button>
            <p className="app-mode-desc">Bright backgrounds, great for daytime use.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Admin Screen ─── */
const ADMIN_EMAILS = ['joy@remoteimagingconsultants.com'];

function AdminScreen({ onBack, profile, themeOverride, setThemeOverride, onPreviewOnboarding }) {
  const activeTheme = themeOverride !== null ? themeOverride : (profile?.gender || 'female');

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ Settings</button>
      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Admin</div>
        <h2 className="s-title">Admin <em>Panel</em></h2>
        <p className="s-desc">Preview how the app looks for different user types. No data is changed.</p>
      </div>

      <div className="g-card splash-item">
        <div className="settings-section-title" style={{ marginBottom: 6 }}>🎨 Preview Theme</div>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 14 }}>
          Switch between female (pink/gold) and male (sky blue/yellow) themes.
          {themeOverride !== null && (
            <span style={{ color: 'var(--gold)', marginLeft: 6 }}>Override active</span>
          )}
        </p>
        <div className="ob-gender-btns">
          <button
            className={`ob-gender-btn${activeTheme !== 'male' ? ' selected' : ''}`}
            onClick={() => setThemeOverride('female')}
          >
            🌸 Female Theme
          </button>
          <button
            className={`ob-gender-btn${activeTheme === 'male' ? ' selected' : ''}`}
            onClick={() => setThemeOverride('male')}
          >
            ⚡ Male Theme
          </button>
        </div>
        {themeOverride !== null && (
          <button
            className="section-back-btn"
            style={{ marginTop: 12, width: '100%', justifyContent: 'center' }}
            onClick={() => setThemeOverride(null)}
          >
            Reset to My Theme ({profile?.gender || 'female'})
          </button>
        )}
      </div>

      <div className="g-card splash-item">
        <div className="settings-section-title" style={{ marginBottom: 6 }}>🔄 Preview Sign-up Flow</div>
        <p style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 14 }}>
          See the full onboarding experience from start to finish. Your profile won't be affected.
        </p>
        <button className="ob-btn-primary" onClick={onPreviewOnboarding}>
          Preview Onboarding →
        </button>
      </div>
    </div>
  );
}

/* ─── Main Settings ─── */
export default function Settings({
  onNavigate, user, profile, onProfileUpdate,
  colorMode, setColorMode,
  themeOverride, setThemeOverride,
  onPreviewOnboarding,
  pushBack, clearInnerBack,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [screen, setScreen] = useState('main');

  const isAdmin = ADMIN_EMAILS.includes(user?.email) || profile?.isAdmin === true;

  function openScreen(s) {
    pushBack?.(() => { clearInnerBack?.(); setScreen('main'); });
    setScreen(s);
  }

  async function handleLogout() {
    try { await signOut(auth); } catch (e) { console.error('Sign out failed:', e); }
  }

  if (screen === 'account') {
    return <AccountScreen user={user} profile={profile}
      onProfileUpdate={onProfileUpdate} onBack={() => setScreen('main')}
      pushBack={pushBack} clearInnerBack={clearInnerBack} />;
  }
  if (screen === 'navigate') return <NavigateScreen onBack={() => setScreen('main')} />;
  if (screen === 'about')    return <AboutScreen onBack={() => setScreen('main')} />;
  if (screen === 'reminders') return <RemindersScreen onBack={() => setScreen('main')} user={user} />;
  if (screen === 'appearance') {
    return <AppearanceScreen onBack={() => setScreen('main')} colorMode={colorMode} setColorMode={setColorMode} />;
  }
  if (screen === 'admin') {
    return <AdminScreen
      onBack={() => setScreen('main')}
      profile={profile}
      themeOverride={themeOverride}
      setThemeOverride={setThemeOverride}
      onPreviewOnboarding={onPreviewOnboarding}
    />;
  }

  return (
    <>
      {showConfirm && (
        <SignOutModal onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} user={user} />
      )}
      <div className="section">
        <div className="s-header">
          <div className="s-tag">App Settings</div>
          <h2 className="s-title">Settings</h2>
          <p className="s-desc">Manage your account, appearance, and notifications.</p>
        </div>

        <div className="settings-pills-list splash-item">
          <SettingsPill icon="👤" label="Account"
            desc="Edit profile, avatar, password" onClick={() => openScreen('account')} />
          <SettingsPill icon="🔔" label="Reminders"
            desc="Daily notifications with sound" onClick={() => openScreen('reminders')} />
          <SettingsPill icon="🎨" label="Appearance"
            desc={`${colorMode === 'light' ? '☀️ Light' : '🌙 Dark'} mode · color theme`} onClick={() => openScreen('appearance')} />
          <SettingsPill icon="🗂️" label="Navigate the App"
            desc="Gestures, shortcuts, tips" onClick={() => openScreen('navigate')} />
          <SettingsPill icon="🌸" label="About & Help"
            desc="About the Goddess Plan" onClick={() => openScreen('about')} />
          {isAdmin && (
            <SettingsPill icon="🛠️" label="Admin Panel"
              desc="Preview themes and sign-up flow" onClick={() => openScreen('admin')} />
          )}
          <SettingsPill icon="🚪" label="Sign Out"
            desc="You can always come back" onClick={() => setShowConfirm(true)} danger />
        </div>
      </div>
    </>
  );
}
