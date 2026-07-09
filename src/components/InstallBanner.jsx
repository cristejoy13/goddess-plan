import { useState, useEffect } from 'react';

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null);      // Android/Chrome install prompt
  const [showIOS, setShowIOS] = useState(() => {   // iOS manual instruction
    if (window.matchMedia('(display-mode: standalone)').matches) return false;
    if (sessionStorage.getItem('gp_install_dismissed')) return false;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isIOS && isSafari;
  });
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Already installed (standalone mode) — hide the banner
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (sessionStorage.getItem('gp_install_dismissed')) return;
    if (showIOS) return;

    function handlePrompt(e) {
      e.preventDefault();
      setPrompt(e);
    }
    window.addEventListener('beforeinstallprompt', handlePrompt);
    return () => window.removeEventListener('beforeinstallprompt', handlePrompt);
  }, [showIOS]);

  function dismiss() {
    sessionStorage.setItem('gp_install_dismissed', '1');
    setDismissed(true);
    setPrompt(null);
    setShowIOS(false);
  }

  async function install() {
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') dismiss();
  }

  if (dismissed || (!prompt && !showIOS)) return null;

  return (
    <div className="install-banner">
      <div className="install-banner-text">
        {showIOS ? (
          <>
            <span className="install-icon">🌸</span>
            <span>
              Install Goddess Plan: tap <strong>Share</strong> <span style={{ fontSize: 13 }}>⬆</span> then <strong>"Add to Home Screen"</strong>
            </span>
          </>
        ) : (
          <>
            <span className="install-icon">🌸</span>
            <span>Install Goddess Plan for offline access & reminders</span>
          </>
        )}
      </div>
      <div className="install-banner-actions">
        {!showIOS && (
          <button className="install-btn-primary" onClick={install}>Install</button>
        )}
        <button className="install-btn-dismiss" onClick={dismiss}>✕</button>
      </div>
    </div>
  );
}
