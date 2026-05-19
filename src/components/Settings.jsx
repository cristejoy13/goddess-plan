import { useState } from 'react';

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

export default function Settings({ onNavigate }) {
  const [cleared, setCleared] = useState(false);

  function handleClearProgress() {
    if (window.confirm('This will reset all your challenge check-ins and monthly progress. Your plan content stays the same. Continue?')) {
      localStorage.removeItem('gp_daily');
      localStorage.removeItem('gp_done');
      localStorage.removeItem('gp_checks');
      setCleared(true);
      setTimeout(() => setCleared(false), 3000);
    }
  }

  function handleLogout() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('home');
  }

  return (
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
        <GuideStep
          num="1"
          title="Go Back — Previous Page"
          desc="Press Cmd + Z on Mac, or Ctrl + Z on Windows / any other computer."
        />
        <GuideStep
          num="2"
          title="Go Home — Anytime"
          desc="Press Cmd + H on Mac, or Ctrl + H on Windows / any other computer. Returns you to the Home dashboard from anywhere."
        />
      </div>

      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">📱 Touch &amp; Phone Gestures</div>
        <GuideStep
          num="3"
          title="Swipe Right to Go Back"
          desc="On any phone or tablet — swipe your finger from left to right across the screen. Works on any page, any section."
        />
        <GuideStep
          num="4"
          title="Double-Tap to Go Home"
          desc="Double-tap anywhere on an empty area of the screen (not on a button or card) to jump straight to the Home dashboard."
        />
      </div>

      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🗂️ Finding Content</div>
        <GuideStep
          num="5"
          title="Search Bar (Top of Screen)"
          desc="Type any keyword — workout name, recipe, oil, skincare step — and tap a result to jump directly to it."
        />
        <GuideStep
          num="6"
          title="Left Sidebar Navigation"
          desc="Tap any section in the left sidebar to switch between Home, Workouts, Challenges, Nutrition, Skincare, Hair Care, and Anti-Aging."
        />
        <GuideStep
          num="7"
          title="Tapping Into Detail Pages"
          desc="In Nutrition and other sections, tap any card to open its full detail page. Use the back button or Cmd+Z / swipe right to return."
        />
      </div>

      {/* ── About ── */}
      <div className="divider splash-item">About This App</div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">🌸 The Goddess Plan</div>
        <p className="settings-about-text">
          Your personal wellness companion for January – December 2026.<br />
          Built around movement, nutrition, skincare, hair care, and anti-aging habits designed specifically for your body and goals.
        </p>
        <div className="settings-badge-row">
          <span className="pill pg">PWA</span>
          <span className="pill py">Works Offline</span>
          <span className="pill pg">Saves to Phone</span>
        </div>
        <p className="settings-about-text" style={{ marginTop: 10, fontSize: 12 }}>
          All your progress is saved on this device only — nothing is sent to any server.
        </p>
      </div>

      {/* ── Data & Logout ── */}
      <div className="divider splash-item">Data &amp; Account</div>
      <div className="g-card splash-item settings-card">
        <div className="settings-section-title">📊 Your Progress Data</div>
        <p className="settings-about-text">
          Your daily challenge check-ins and monthly completions are stored locally on this device. Clearing progress resets all check-ins — your plan content is not affected.
        </p>

        {cleared && (
          <div className="settings-cleared-msg">✓ Progress cleared successfully.</div>
        )}

        <button className="settings-clear-btn" onClick={handleClearProgress}>
          Reset All Progress
        </button>
      </div>

      <button className="settings-logout-btn splash-item" onClick={handleLogout}>
        <span className="settings-logout-icon">🌸</span>
        <span>Return to Home</span>
      </button>
    </div>
  );
}
