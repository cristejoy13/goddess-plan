import { useState, useRef, useEffect, Component } from 'react';
import AskHost from './components/Ask';
import PullToRefresh from './components/PullToRefresh';
import Hero from './components/Hero';
import InstallBanner from './components/InstallBanner';
import Workout from './components/Workout';
import Meal from './components/Meal';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import Settings from './components/Settings';
import { GoalWatcher } from './components/Goals';
import { WorkoutToast } from './components/WorkoutTracker';
import { SignupGate } from './components/Onboarding';
import { isOwner } from './utils/userPlan';
import { getAvatarByProfile } from './avatars';
import './styles/index.css';

const DEFAULT_PROFILE = {
  username: 'Goddess',
  gender: 'female',
  heightCm: 155,
  weightKg: 46,
  age: 27,
  activity: 'light',
  goal: 'Round glutes + flat tummy',
  tdeeKcal: 1550,
  deficitKcal: 1250,
};

function loadProfile() {
  try {
    const s = localStorage.getItem('gp_profile');
    if (s) return JSON.parse(s);
  } catch {}
  return DEFAULT_PROFILE;
}

function saveProfile(p) {
  try { localStorage.setItem('gp_profile', JSON.stringify(p)); } catch {}
}

// Four buttons at the top, nothing else (her layout, 2026-10-10): Settings
// (the flower), Home, Meals, Body. Workouts live inside Home now, and the
// light/dark switch lives in Settings.
const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: '🏠' },
  { id: 'meal',       label: 'Meals',      icon: '🍽️' },
  { id: 'skincare',   label: 'Body',       icon: '✨' },
];

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [active, setActive] = useState('home');
  const [navMeta, setNavMeta] = useState({ tab: null, scrollTo: null, key: 0 });
  const [history, setHistory] = useState([]);
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('gp_color_mode') || 'dark');

  useEffect(() => {
    const handleRemoteSync = () => {
      setProfile(loadProfile());
      setColorMode(localStorage.getItem('gp_color_mode') || 'dark');
    };
    window.addEventListener('gp-remote-sync', handleRemoteSync);
    window.addEventListener('gp-profile-changed', handleRemoteSync);
    return () => {
      window.removeEventListener('gp-remote-sync', handleRemoteSync);
      window.removeEventListener('gp-profile-changed', handleRemoteSync);
    };
  }, []);

  // Apply gender-based color theme
  useEffect(() => {
    if (profile?.gender === 'male') {
      document.documentElement.setAttribute('data-theme', 'male');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [profile?.gender]);

  // Apply dark/light mode
  useEffect(() => {
    if (colorMode === 'light') {
      document.documentElement.setAttribute('data-mode', 'light');
    } else {
      document.documentElement.removeAttribute('data-mode');
    }
    localStorage.setItem('gp_color_mode', colorMode);
  }, [colorMode]);

  /* The top bar is fixed, so the page has to be pushed down by exactly its
     height. Two rows on a phone are not the same height as two rows on a
     desktop, and the safe-area inset changes again on a notched screen, so it
     is measured rather than guessed. */
  const topbarRef = useRef(null);
  useEffect(() => {
    const el = topbarRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty('--topbar-h', `${el.offsetHeight}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    window.addEventListener('orientationchange', apply);
    return () => {
      ro.disconnect();
      window.removeEventListener('orientationchange', apply);
    };
  }, []);

  const historyRef = useRef([]);
  useEffect(() => { historyRef.current = history; }, [history]);

  const activeRef = useRef({ section: 'home', tab: null });
  useEffect(() => { activeRef.current = { section: active, tab: navMeta.tab }; }, [active, navMeta.tab]);

  /* Inner back stack — lets sub-pages (ingredient tabs, etc.) register back handlers */
  const innerBackStackRef = useRef([]);
  function pushBack(fn) {
    innerBackStackRef.current = [...innerBackStackRef.current, fn];
  }
  function clearInnerBack() {
    innerBackStackRef.current = [];
  }

  // Touch tracking for swipe-back gesture
  const touchStartRef = useRef({ x: 0, y: 0 });

  const navigate = (id, tab = null, scrollTo = null) => {
    if (id === 'antiaging') { id = 'skincare'; tab = tab ?? 'antiaging'; }
    clearInnerBack(); // entering a new section clears any inner sub-page history
    const cur = activeRef.current;
    if (id !== cur.section || tab !== cur.tab) {
      setHistory(prev => [...prev.slice(-19), { section: cur.section, tab: cur.tab }]);
    }
    setActive(id);
    setNavMeta(prev => ({ tab, scrollTo, key: prev.key + 1 }));
    if (scrollTo) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goBack = () => {
    /* First drain inner back stack (sub-page navigation within a section) */
    if (innerBackStackRef.current.length > 0) {
      const stack = innerBackStackRef.current;
      const fn = stack[stack.length - 1];
      innerBackStackRef.current = stack.slice(0, -1);
      fn();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    /* Then pop section history */
    const h = historyRef.current;
    if (h.length === 0) return;
    const prev = h[h.length - 1];
    setHistory(h.slice(0, -1));
    setActive(prev.section);
    setNavMeta(p => ({ tab: prev.tab, scrollTo: null, key: p.key + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goHome = () => {
    const cur = activeRef.current;
    if (cur.section === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setHistory([]);
    setActive('home');
    setNavMeta(p => ({ tab: null, scrollTo: null, key: p.key + 1 }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keyboard: Cmd+Z / Ctrl+Z to go back, Cmd+H / Ctrl+H to return home
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        goBack();
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        goHome();
      }
      // On a Mac the system takes Cmd+H (it hides the browser) before the page
      // ever sees it, so a plain H does the same — unless she is typing.
      const typing = e.target.closest?.('input, textarea, select, [contenteditable="true"]');
      if (!typing && !e.ctrlKey && !e.metaKey && !e.altKey && e.key.toLowerCase() === 'h') {
        goHome();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []); // goBack/goHome read refs — always fresh, no deps needed

  // Touch: swipe right from left edge to go back (mirrors iOS native gesture)
  function handleTouchStart(e) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function handleTouchEnd(e) {
    const startX = touchStartRef.current.x;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartRef.current.y);
    // Fire when swiping right from the left 220px of screen (covers sidebar + left content edge)
    if (startX < 220 && dx > 80 && dy < 100) {
      goBack();
    }
    // Double-tap to go home was removed (2026-10-08): an accidental double
    // tap threw her out of a meal she was still writing. Home is the Home
    // button in the section row.
  }

  const background = (
    <>
      <div className="bg-layer" />
      <div className="bg-aurora" />
    </>
  );

  // Fall back to a default so the Settings entry point always exists (fresh devices have no avatarId)
  const avatar = getAvatarByProfile(profile) || { emoji: '🌸', bg: 'rgba(255,92,157,0.25)' };

  return (
    <>
      {background}
      <InstallBanner />
      <GoalWatcher />
      <WorkoutToast />
      <SignupGate />
      <AskHost />
      <PullToRefresh />

      <div className="search-bar-fixed" ref={topbarRef}>
        <nav className="topbar-sections" aria-label="Sections">
          <button
            className={`topbar-sec-btn topbar-settings-btn${active === 'settings' ? ' active' : ''}`}
            onClick={() => navigate('settings')}
            aria-current={active === 'settings' ? 'page' : undefined}
          >
            <span className="topbar-sec-icon">{avatar.emoji}</span>
            <span className="topbar-sec-label">Settings</span>
          </button>
          {/* Body (skincare, hair, teeth…) is hers; people who signed up get
              Home and Meals (2026-10-10). */}
          {NAV_ITEMS.filter(item => item.id !== 'skincare' || isOwner(profile)).map(item => (
            <button
              key={item.id}
              className={`topbar-sec-btn${active === item.id || (item.id === 'home' && active === 'workout') ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <span className="topbar-sec-icon">{item.icon}</span>
              <span className="topbar-sec-label">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div
        className="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Home is NOT keyed on syncEpoch: remounting it every time a sync
            landed slammed the notes panel shut and threw away whatever was
            half-typed. Its two stateful pieces listen for gp-remote-sync and
            refresh themselves in place instead. */}
        {active === 'home'       && <Hero onNavigate={navigate} />}
        {/* Workouts is not keyed on syncEpoch either: a sync landing while a
            day was open threw her back to the week (2026-09-30). Its saved
            pieces — lifts, meal picks, workouts, run and bike minutes —
            refresh themselves on gp-remote-sync. */}
        {active === 'workout'    && <Workout key={navMeta.key} openDayId={navMeta.scrollTo} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} profile={profile} />}
        {/* No page is rebuilt when a sync lands (2026-10-10): rebuilding Meal
            closed the open day and lost what she was typing every time any
            gadget — or the Garmin Shortcut — saved something. Meal refreshes
            its numbers in place; Nutrition and Body show nothing synced. */}
        {active === 'meal'       && <Meal />}
        {active === 'nutrition'  && <Nutrition key={navMeta.key} initialTab={navMeta.tab} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'skincare'   && isOwner(profile) && <Skincare  key={navMeta.key} initialTab={navMeta.tab} />}
        {active === 'settings'   && <Settings
            key="settings"
            onNavigate={navigate}
            profile={profile}
            onProfileUpdate={p => { setProfile(p); saveProfile(p); }}
            colorMode={colorMode}
            setColorMode={setColorMode}
            pushBack={pushBack}
            clearInnerBack={clearInnerBack}
          />}
      </div>

      <div className="motivation">
        <div className="mot-stars">🌸  💕  🌸  💕  🌸</div>
        <h2 className="mot-h">
          Baby steps, baby.
        </h2>
        <p className="mot-p">
          Choose yourself today. Tiny daily steps become a whole new year.
        </p>
        <div className="mot-q">Start now. 🌸</div>
      </div>
    </>
  );
}

class ErrorBoundary extends Component {
  state = { crashed: false };
  static getDerivedStateFromError() { return { crashed: true }; }
  render() {
    if (this.state.crashed) {
      return (
        <div style={{ minHeight: '100vh', background: '#07040f', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, color: '#f8eed4', fontFamily: 'Outfit, sans-serif', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🌸</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: '#c090b8', marginBottom: 24 }}>Tap below to reload the app.</div>
          <button onClick={() => window.location.reload()} style={{ background: '#ff5c9d', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 28px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { ErrorBoundary };
