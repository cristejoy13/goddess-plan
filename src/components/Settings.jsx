import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

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

export default function Settings({ onNavigate, user }) {
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleLogout() {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Sign out failed:', e);
    }
  }

  return (
    <>
      {showConfirm && (
        <SignOutModal
          onConfirm={handleLogout}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <div className="section">
        <div className="s-header">
          <div className="s-tag">App Guide &amp; Preferences</div>
          <h2 className="s-title">Settings <em>&amp; How to Use</em></h2>
          <p className="s-desc">Everything you need to navigate the Goddess Plan smoothly — on any device.</p>
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
            desc="In Nutrition and other sections, tap any card to open its full detail page. Use the back button or Cmd+Z / swipe right to return." />
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

        {/* ── Account ── */}
        <div className="divider splash-item">Account</div>
        <div className="g-card splash-item settings-card">
          <div className="settings-section-title">👤 Your Account</div>
          {user?.displayName && (
            <p className="settings-about-text" style={{ fontWeight: 600, marginBottom: 4 }}>
              {user.displayName}
            </p>
          )}
          {user?.email && (
            <p className="settings-about-text" style={{ opacity: 0.7, marginBottom: 8 }}>
              {user.email}
            </p>
          )}
          {user?.phoneNumber && (
            <p className="settings-about-text" style={{ opacity: 0.7, marginBottom: 8 }}>
              {user.phoneNumber}
            </p>
          )}
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
