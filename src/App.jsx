import { useState, useRef, useEffect, Component } from 'react';
import AskHost from './components/Ask';
import PullToRefresh from './components/PullToRefresh';
import Hero from './components/Hero';
import InstallBanner from './components/InstallBanner';
import Workout from './components/Workout';
import Meal from './components/Meal';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import Cycle from './components/Cycle';
import Settings from './components/Settings';
import { GoalWatcher } from './components/Goals';
import { WorkoutToast } from './components/WorkoutTracker';
import { SignupGate } from './components/Onboarding';
import { isOwner } from './utils/userPlan';
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

// Four buttons at the top, nothing else (her layout, 2026-10-10; order
// changed 2026-10-11): Home, Meals, Body, Settings (the flower). Workouts live inside Home now, and the
// light/dark switch lives in Settings.
const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'home' },
  { id: 'meal',       label: 'Meals',      icon: 'meal' },
  { id: 'skincare',   label: 'Body',       icon: 'body', ownerOnly: true },
  { id: 'cycle',      label: 'Cycle',      icon: 'cycle', ownerOnly: true },
  // DZ (DareZero) moved to the top-left corner of Home, in place of G
  // (2026-10-14) — see DzLink in Hero.jsx.
];

// Drawn line icons in place of emoji (2026-10-26): thin, rounded strokes
// that take the button's colour, so they sit quietly in both modes.
const NAV_ICON_PATHS = {
  home: <><path d="M3.2 11.3 12 4.2l8.8 7" /><path d="M5.7 9.7v9.8c0 .5.3.8.8.8h11.1c.5 0 .8-.3.8-.8V9.5" /><path d="M10 20.2v-4.6c0-1 .8-1.7 2-1.7s2 .7 2 1.7v4.6" /></>,
  meal: <><path d="M3.4 12.3h17.2c-.3 4.4-3.4 7.2-7.3 7.4h-2.6c-3.9-.2-7-3-7.3-7.4z" /><path d="M9 21.2h6" /><path d="M13.4 10.4 19.6 3.6M15.8 10.6l5-5.6" /><path d="M8.3 9.6c-1-1.3-.2-2.2.5-3s1-1.8.1-2.9" /></>,
  body: <><path d="M12 18.9c-3-2.9-3.1-8.4 0-12.4 3.1 4 3 9.5 0 12.4z" /><path d="M11.2 19.1c-4.3 0-7.3-3-7.8-7.6 2.8.3 5 1.6 6.4 3.8" /><path d="M12.8 19.1c4.3 0 7.3-3 7.8-7.6-2.8.3-5 1.6-6.4 3.8" /><path d="M5 21.3c4.6-1.2 9.4-1.2 14 0" /></>,
  cycle: <><path d="M18.5 15.2A7.5 7.5 0 0 1 8.8 5.5a7.5 7.5 0 1 0 9.7 9.7z" /><path d="M16.5 3.5c1.4 1.8 2.3 3.1 2.3 4.3a2.3 2.3 0 0 1-4.6 0c0-1.2.9-2.5 2.3-4.3z" /></>,
  settings: <><circle cx="12" cy="12" r="2.6" /><circle cx="12" cy="12" r="6.1" /><path d="M12 2.9v2.6M12 18.5v2.6M2.9 12h2.6M18.5 12h2.6M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></>,
};
function NavIcon({ name }) {
  return (
    <svg className="topbar-sec-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {NAV_ICON_PATHS[name]}
    </svg>
  );
}

const VIEW_KEY = 'gp_view';
const KNOWN_SECTIONS = ['home', 'workout', 'meal', 'nutrition', 'skincare', 'cycle', 'settings'];
function readView() {
  try {
    const v = JSON.parse(sessionStorage.getItem(VIEW_KEY) || 'null');
    if (v && KNOWN_SECTIONS.includes(v.section)) return { section: v.section, tab: v.tab ?? null, scrollTo: v.scrollTo ?? null };
  } catch { /* fine */ }
  return { section: 'home', tab: null, scrollTo: null };
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  // A refresh (pull down, or the app reloading for an update) comes back to
  // the same section — and the same workout day — instead of Home
  // (2026-10-15). Kept for this visit only: opening the app fresh starts at Home.
  const [active, setActive] = useState(() => readView().section);
  const [navMeta, setNavMeta] = useState(() => ({ tab: readView().tab, scrollTo: readView().scrollTo, key: 0 }));
  useEffect(() => {
    try { sessionStorage.setItem(VIEW_KEY, JSON.stringify({ section: active, tab: navMeta.tab, scrollTo: navMeta.scrollTo })); } catch { /* fine */ }
  }, [active, navMeta.tab, navMeta.scrollTo]);
  // ...and to the same spot on the page: the scroll position is noted as the
  // page goes away and put back once the section has drawn.
  useEffect(() => {
    const save = () => { try { sessionStorage.setItem('gp_view_y', String(Math.round(window.scrollY))); } catch { /* fine */ } };
    window.addEventListener('pagehide', save);
    window.addEventListener('beforeunload', save);
    let y = 0;
    try { y = Number(sessionStorage.getItem('gp_view_y')) || 0; sessionStorage.removeItem('gp_view_y'); } catch { /* fine */ }
    if (y > 0) {
      let tries = 0;
      const put = () => {
        window.scrollTo({ top: y, behavior: 'instant' });
        if (Math.abs(window.scrollY - y) > 4 && tries++ < 20) setTimeout(put, 100);
      };
      setTimeout(put, 50);
    }
    return () => { window.removeEventListener('pagehide', save); window.removeEventListener('beforeunload', save); };
  }, []);
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
    // border-box: on an installed iPhone app the notch gap (safe-area inset)
    // often arrives a moment after launch. That grows the bar's padding, not
    // its content, so a plain observer never saw it and the title sat under
    // the buttons until a refresh (fixed 2026-10-17).
    const ro = new ResizeObserver(apply);
    ro.observe(el, { box: 'border-box' });
    const later = () => requestAnimationFrame(apply);
    const events = ['orientationchange', 'resize', 'load', 'pageshow'];
    events.forEach(ev => window.addEventListener(ev, later));
    document.addEventListener('visibilitychange', later);
    document.fonts?.ready.then(later);
    const timers = [100, 400, 1200].map(ms => setTimeout(apply, ms));
    return () => {
      ro.disconnect();
      events.forEach(ev => window.removeEventListener(ev, later));
      document.removeEventListener('visibilitychange', later);
      timers.forEach(clearTimeout);
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

  // Swipe-to-go-back was removed (2026-10-16): a sideways swipe inside a
  // section threw her out of it. Double-tap to go home went earlier
  // (2026-10-08) for the same reason. She leaves a section only by tapping.

  const background = (
    <>
      <div className="bg-layer" />
      <div className="bg-aurora" />
    </>
  );


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
          {/* Body (skincare, hair, teeth…) is hers; people who signed up get
              Home and Meals (2026-10-10). */}
          {NAV_ITEMS.filter(item => !item.ownerOnly || isOwner(profile)).map(item => (
            <button
              key={item.id}
              className={`topbar-sec-btn${active === item.id || (item.id === 'home' && active === 'workout') ? ' active' : ''}`}
              onClick={() => (item.href ? window.location.assign(item.href) : navigate(item.id))}
              aria-current={active === item.id ? 'page' : undefined}
            >
              <span className="topbar-sec-icon"><NavIcon name={item.icon} /></span>
              <span className="topbar-sec-label">{item.label}</span>
            </button>
          ))}
          <button
            className={`topbar-sec-btn topbar-settings-btn${active === 'settings' ? ' active' : ''}`}
            onClick={() => navigate('settings')}
            aria-current={active === 'settings' ? 'page' : undefined}
          >
            <span className="topbar-sec-icon"><NavIcon name="settings" /></span>
            <span className="topbar-sec-label">Settings</span>
          </button>
        </nav>
      </div>

      <div
        className="main"
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
        {active === 'meal'       && <Meal key={navMeta.key} initialTab={navMeta.tab} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'nutrition'  && <Nutrition key={navMeta.key} initialTab={navMeta.tab} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'skincare'   && isOwner(profile) && <Skincare  key={navMeta.key} initialTab={navMeta.tab} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'cycle'      && isOwner(profile) && <Cycle />}
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
