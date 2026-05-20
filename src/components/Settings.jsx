import { useState } from 'react';
import { signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { AVATARS, getAvatarByProfile } from '../avatars';

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function SignOutModal({ onConfirm, onCancel }) {
  return (
    <div className="signout-overlay">
      <div className="signout-modal">
        <div className="signout-modal-icon">🌸</div>
        <h3 className="signout-modal-title">Ready to leave?</h3>
        <p className="signout-modal-body">
          Your progress and profile are safely saved.<br />
          See you soon, goddess! 💕
        </p>
        <div className="signout-modal-btns">
          <button className="signout-stay-btn" onClick={onCancel}>
            Actually, I'll stay 🌸
          </button>
          <button className="signout-confirm-btn" onClick={onConfirm}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Edit Profile Screen ───────────────────────────────────────────────────────

function EditProfileScreen({ user, profile, onSave, onBack }) {
  const [username, setUsername]     = useState(profile?.username || profile?.displayName || '');
  const [gender, setGender]         = useState(profile?.gender || 'female');
  const [avatarId, setAvatarId]     = useState(profile?.avatarId || '');
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');
  const [saved, setSaved]           = useState(false);

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
    } catch (e) {
      setError('Could not save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="section">
      <button className="ag-detail-back" onClick={onBack}>← Back to Settings</button>

      <div className="s-header" style={{ marginBottom: 20 }}>
        <div className="s-tag">Your Profile</div>
        <h2 className="s-title">Edit <em>Profile</em></h2>
        <p className="s-desc">Update your name and avatar any time.</p>
      </div>

      {saved && (
        <div className="ep-saved-banner splash-item">✓ Profile saved! 🌸</div>
      )}

      {/* Username */}
      <div className="g-card splash-item">
        <div className="settings-section-title">✏️ Display Name</div>
        <label className="ob-label" style={{ marginBottom: 8 }}>Your name in the app</label>
        <input
          className="ob-input"
          type="text"
          maxLength={30}
          placeholder="e.g. Joy, Goddess, Your name…"
          value={username}
          onChange={e => { setUsername(e.target.value); setSaved(false); }}
        />
      </div>

      {/* Gender (controls avatar set) */}
      <div className="g-card splash-item">
        <div className="settings-section-title">🌸 Avatar Style</div>
        <label className="ob-label" style={{ marginBottom: 8 }}>Avatar set</label>
        <div className="ob-gender-btns" style={{ marginBottom: 16 }}>
          {['female', 'male'].map(g => (
            <button
              key={g}
              type="button"
              className={`ob-gender-btn${gender === g ? ' selected' : ''}`}
              onClick={() => { setGender(g); setAvatarId(''); setSaved(false); }}
            >
              {g === 'female' ? '🌸 Feminine' : '🌊 Masculine'}
            </button>
          ))}
        </div>

        <label className="ob-label" style={{ marginBottom: 8 }}>Pick your avatar</label>
        <div className="ob-avatar-grid">
          {avatarList.map(a => (
            <button
              key={a.id}
              type="button"
              className={`ob-avatar-item${avatarId === a.id ? ' selected' : ''}`}
              style={{ background: a.bg }}
              onClick={() => { setAvatarId(a.id); setSaved(false); }}
            >
              <span className="ob-avatar-emoji">{a.emoji}</span>
              <span className="ob-avatar-label">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="ep-error">{error}</p>}

      <button
        className="ob-btn-primary splash-item"
        onClick={handleSave}
        disabled={saving}
        style={{ marginTop: 4 }}
      >
        {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Changes →'}
      </button>
    </div>
  );
}

// ─── Main Settings ─────────────────────────────────────────────────────────────

export default function Settings({ onNavigate, user, profile, onProfileUpdate }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [editing, setEditing]         = useState(false);

  async function handleLogout() {
    try { await signOut(auth); } catch (e) { console.error('Sign out failed:', e); }
  }

  if (editing) {
    return (
      <EditProfileScreen
        user={user}
        profile={profile}
        onSave={onProfileUpdate}
        onBack={() => setEditing(false)}
      />
    );
  }

  const avatar = getAvatarByProfile(profile);

  return (
    <>
      {showConfirm && (
        <SignOutModal onConfirm={handleLogout} onCancel={() => setShowConfirm(false)} />
      )}

      <div className="section">
        <div className="s-header">
          <div className="s-tag">App Guide &amp; Preferences</div>
          <h2 className="s-title">Settings <em>&amp; How to Use</em></h2>
          <p className="s-desc">Everything you need to navigate the Goddess Plan smoothly — on any device.</p>
        </div>

        {/* ── Profile Card ── */}
        <div className="divider splash-item">Account</div>
        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">👤 Your Profile</div>

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
              {user?.phoneNumber && <p className="ep-profile-email">{user.phoneNumber}</p>}
            </div>
          </div>

          <button className="ep-edit-btn" onClick={() => setEditing(true)}>
            ✏️ Edit Name &amp; Avatar
          </button>
        </div>

        {/* ── Navigation Guide ── */}
        <div className="divider splash-item">Navigating the App</div>
        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">⌨️ Keyboard Shortcuts</div>
          <GuideStep num="1" title="Go Back — Previous Page"
            desc="Press Cmd + Z on Mac, or Ctrl + Z on Windows / any other computer." />
          <GuideStep num="2" title="Go Home — Anytime"
            desc="Press Cmd + H on Mac, or Ctrl + H on Windows / any other computer. Returns you to the Home dashboard from anywhere." />
        </div>

        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">📱 Touch &amp; Phone Gestures</div>
          <GuideStep num="3" title="Swipe Right to Go Back"
            desc="On any phone or tablet — swipe your finger from left to right across the screen. Works on any page, any section." />
          <GuideStep num="4" title="Double-Tap to Go Home"
            desc="Double-tap anywhere on an empty area of the screen (not on a button or card) to jump straight to the Home dashboard." />
        </div>

        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">🗂️ Finding Content</div>
          <GuideStep num="5" title="Search Bar (Top of Screen)"
            desc="Type any keyword — workout name, recipe, oil, skincare step — and tap a result to jump directly to it." />
          <GuideStep num="6" title="Left Sidebar Navigation"
            desc="Tap any section in the left sidebar to switch between Home, Workouts, Challenges, Nutrition, Skincare, Hair Care, and Anti-Aging." />
          <GuideStep num="7" title="Tapping Into Detail Pages"
            desc="In Hair Care, Anti-Aging, and other sections, tap any card to open its full detail page. Use the back button or Cmd+Z / swipe right to return." />
        </div>

        {/* ── About ── */}
        <div className="divider splash-item">About This App</div>
        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">🌸 The Goddess Plan</div>
          <p className="settings-about-text">
            Your personal wellness companion for January – December 2026.<br />
            Built around movement, nutrition, skincare, hair care, and anti-aging habits designed specifically for your goals.
          </p>
          <div className="settings-badge-row">
            <span className="pill pg">PWA</span>
            <span className="pill py">Works Offline</span>
            <span className="pill pg">Multi-Device</span>
          </div>
        </div>

        {/* ── Sign Out ── */}
        <div className="g-card splash-item settings-card" style={{ marginTop: 8 }}>
          <div className="settings-section-title">🚪 Sign Out</div>
          <p className="settings-about-text">
            Your progress and profile are always saved automatically. Signing out will return you to the login screen.
          </p>
          <button className="settings-logout-btn" onClick={() => setShowConfirm(true)}>
            <span className="settings-logout-icon">🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
}
