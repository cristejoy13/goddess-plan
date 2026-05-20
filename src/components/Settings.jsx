import { useState, useEffect } from 'react';
import {
  signOut, updateProfile,
  updatePassword, reauthenticateWithCredential,
  EmailAuthProvider, linkWithCredential,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AVATARS, getAvatarByProfile } from '../avatars';

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

function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="signout-overlay">
      <div className="signout-modal">
        <div className="signout-modal-icon">🌸</div>
        <h3 className="signout-modal-title">Ready to leave?</h3>
        <p className="signout-modal-body">Your progress and profile are safely saved.<br />See you soon, goddess! 💕</p>
        <div className="signout-modal-btns">
          <button className="signout-stay-btn" onClick={onCancel}>Actually, I'll stay 🌸</button>
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
    if (username.trim().length < 2) { setError('Username must be at least 2 characters.'); return; }
    if (!avatarId) { setError('Please choose an avatar.'); return; }
    setError('');
    setSaving(true);
    try {
      const updated = { ...profile, username: username.trim(), gender, avatarId, updatedAt: serverTimestamp() };
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
      await updateProfile(auth.currentUser, { displayName: username.trim() });
      setSaved(true);
      onSave(updated);
      setTimeout(onBack, 900);
    } catch {
      setError('Could not save changes. Please try again.');
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
      if (e.code === 'auth/wrong-password') setError('Current password is incorrect.');
      else if (e.code === 'auth/weak-password') setError('Password is too weak. Use 8+ characters.');
      else setError('Could not update password. Please try again.');
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
                <input className="ob-input" type="password" placeholder="Enter current password"
                  value={currentPw} onChange={e => setCurrentPw(e.target.value)} style={{ marginBottom: 14 }} />
              </>
            )}
            <div className="settings-section-title">{hasPassword ? 'New Password' : 'Choose a Password'}</div>
            <input className="ob-input" type="password" placeholder="At least 8 characters"
              value={newPw} onChange={e => setNewPw(e.target.value)} style={{ marginBottom: 14 }} />
            <div className="settings-section-title">Confirm Password</div>
            <input className="ob-input" type="password" placeholder="Repeat your new password"
              value={confirmPw} onChange={e => setConfirmPw(e.target.value)} />
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

/* ─── Account Screen ─── */
function AccountScreen({ user, profile, onProfileUpdate, onBack }) {
  const [screen, setScreen] = useState('main'); // 'main' | 'edit' | 'password'
  const avatar = getAvatarByProfile(profile);

  if (screen === 'edit') {
    return <EditProfileScreen user={user} profile={profile}
      onSave={onProfileUpdate} onBack={() => setScreen('main')} />;
  }
  if (screen === 'password') {
    return <PasswordScreen user={user} onBack={() => setScreen('main')} />;
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
          desc="Change your display name and avatar" onClick={() => setScreen('edit')} />
        <SettingsPill icon="🔑" label={user?.providerData?.some(p => p.providerId === 'password') ? 'Change Password' : 'Set a Password'}
          desc={user?.providerData?.some(p => p.providerId === 'password') ? 'Update your sign-in password' : 'Add a password to your account'}
          onClick={() => setScreen('password')} />
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

/* ─── Main Settings ─── */
export default function Settings({ onNavigate, user, profile, onProfileUpdate }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [screen, setScreen] = useState('main'); // 'main' | 'account' | 'navigate' | 'about'

  async function handleLogout() {
    try { await signOut(auth); } catch (e) { console.error('Sign out failed:', e); }
  }

  if (screen === 'account') {
    return <AccountScreen user={user} profile={profile}
      onProfileUpdate={onProfileUpdate} onBack={() => setScreen('main')} />;
  }
  if (screen === 'navigate') {
    return <NavigateScreen onBack={() => setScreen('main')} />;
  }
  if (screen === 'about') {
    return <AboutScreen onBack={() => setScreen('main')} />;
  }

  return (
    <>
      {showConfirm && (
        <SignOutModal onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
      )}
      <div className="section">
        <div className="s-header">
          <div className="s-tag">App Settings</div>
          <h2 className="s-title">Settings</h2>
          <p className="s-desc">Manage your account, learn how to use the app, and more.</p>
        </div>

        <div className="settings-pills-list splash-item">
          <SettingsPill icon="👤" label="Account"
            desc="Edit profile, avatar, password" onClick={() => setScreen('account')} />
          <SettingsPill icon="🗂️" label="Navigate the App"
            desc="Gestures, shortcuts, tips" onClick={() => setScreen('navigate')} />
          <SettingsPill icon="🌸" label="About & Help"
            desc="About the Goddess Plan" onClick={() => setScreen('about')} />
          <SettingsPill icon="🚪" label="Sign Out"
            desc="You can always come back" onClick={() => setShowConfirm(true)} danger />
        </div>
      </div>
    </>
  );
}
