import { useState, useRef, useEffect, Component } from 'react';
import Hero from './components/Hero';
import InstallBanner from './components/InstallBanner';
import Workout from './components/Workout';
import Challenges from './components/Challenges';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import Settings from './components/Settings';
import { getAvatarByProfile } from './avatars';
import { loadReminders, scheduleReminders, stopReminders } from './utils/notifications';
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

const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: '🌸' },
  { id: 'workout',    label: 'Workouts',   icon: '💪' },
  { id: 'challenges', label: 'Challenges', icon: '🏆' },
  { id: 'skincare',   label: 'Body',       icon: '✨' },
];

const SEARCH_INDEX = [
  { label: 'Monday — Glute A',            hint: 'Workouts · Hip Thrust · RDL · Split Squat', section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Tuesday — Core & Back A',     hint: 'Workouts · Deep Core & Posture',            section: 'workout', scrollTo: 'day-tuesday'   },
  { label: 'Wednesday — Core & Back B',   hint: 'Workouts · Deep Core & Lats',               section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Thursday — Glute B',          hint: 'Workouts · Sumo · Kickback · Abduction',    section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Friday — Core & Back C',      hint: 'Workouts · Deep Core & Alignment',          section: 'workout', scrollTo: 'day-friday'   },
  { label: 'Saturday — Sprint',           hint: 'Workouts · Progressive Intervals',           section: 'workout', scrollTo: 'day-saturday' },
  { label: 'Sunday — Rest',               hint: 'Workouts · Walk & Stretch',                 section: 'workout', scrollTo: 'day-sunday'   },
  { label: 'Barbell Hip Thrust',          hint: 'Workouts → Monday Glute A',     section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Romanian Deadlift',           hint: 'Workouts → Monday Glute A',     section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Bulgarian Split Squat',       hint: 'Workouts → Monday Glute A',     section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Sumo Squat',                  hint: 'Workouts → Thursday Glute B',   section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Cable Kickback',              hint: 'Workouts → Thursday Glute B',   section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Sprint Training',             hint: 'Workouts → Saturday Sprint',    section: 'workout', scrollTo: 'day-saturday'  },
  { label: 'Meals on Strength & Sprint Days', hint: 'Nutrition → Meat Days',    section: 'nutrition', tab: 'meat'      },
  { label: 'Meals on Pilates & Rest Days',    hint: 'Nutrition → Light Days',   section: 'nutrition', tab: 'light'     },
  { label: 'Chicken — Cooking Methods',       hint: 'Nutrition → Strength Days', section: 'nutrition', tab: 'meat'      },
  { label: 'Chia Pudding',                    hint: 'Nutrition → Light Days',   section: 'nutrition', tab: 'light'     },
  { label: 'Egg Preparation Methods',         hint: 'Nutrition → Strength Days',section: 'nutrition', tab: 'meat'      },
  { label: 'Salad Options',                   hint: 'Nutrition → Light Days',   section: 'nutrition', tab: 'light'     },
  { label: 'Snack Ideas',                     hint: 'Nutrition → Snacks',       section: 'nutrition', tab: 'snacks'    },
  { label: 'Glycemic Index Guide',            hint: 'Nutrition → Food Guide',   section: 'nutrition', tab: 'guide'     },
  { label: 'Hydration Guide',                 hint: 'Nutrition → Hydration',    section: 'nutrition', tab: 'hydration' },
  { label: 'Calorie Deficit Plan',            hint: 'Nutrition → Meat Days',    section: 'nutrition', tab: 'meat'      },
  { label: 'Morning Skincare Routine',      hint: 'Skincare → Face → AM Routine',   section: 'skincare', tab: 'am'       },
  { label: 'Night Skincare Routine',        hint: 'Skincare → Face → PM Routine',   section: 'skincare', tab: 'pm'       },
  { label: 'Skincare Products',             hint: 'Skincare → Face → AM Routine',   section: 'skincare', tab: 'am'       },
  { label: 'Retinoid Roadmap',              hint: 'Skincare → Face → Retinoid',     section: 'skincare', tab: 'retinoid' },
  { label: 'Weekly Skincare Treatments',    hint: 'Skincare → Face → Weekly',       section: 'skincare', tab: 'weekly'   },
  { label: 'Body Skincare Routine',         hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Shower Body Care',             hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Body SPF & Moisturiser',       hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Vaseline Heels & Elbows',      hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Camellia Oil Ritual',          hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Rosemary Oil for Hair Growth', hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Argan Oil Shine',              hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Sleep Protocol',               hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Cortisol Management',          hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Hormone-Protective Eating',    hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Skin Longevity Nutrients',     hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Supplement Stack',             hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Monthly Challenges',           hint: 'Challenges', section: 'challenges' },
  { label: 'January Challenge',            hint: 'Challenges', section: 'challenges' },
];

const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌸', '🌷', '💐', '🌸', '🌺'];

const PETALS = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 10 + 12,
  left: Math.random() * 100,
  flower: FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)],
  duration: Math.random() * 20 + 14,
  delay: Math.random() * -28,
}));

// Twinkling star-sparkles scattered across the upper sky (matches the image)
const SPARKLES = Array.from({ length: 38 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 65,       // upper 65% of screen only
  size: Math.random() * 2.5 + 0.8,
  delay: Math.random() * 6,
  duration: Math.random() * 2.5 + 1.5,
}));

function FloatingFlowers() {
  return (
    <>
      {PETALS.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            fontSize: p.size,
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        >
          {p.flower}
        </div>
      ))}
    </>
  );
}

function AtmosphericSparkles() {
  return (
    <div className="sparkle-layer">
      {SPARKLES.map(s => (
        <div
          key={s.id}
          className="sparkle-dot"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const results = query.trim().length > 1
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.hint.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 7)
    : [];

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  function handleSelect(item) {
    onNavigate(item.section, item.tab || null, item.scrollTo || null);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
        ref={inputRef}
        className="search-input"
        type="text"
        placeholder="Search workouts, recipes, skincare..."
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
      />
      <span className="search-icon">🔍</span>
      {open && results.length > 0 && (
        <div className="search-dropdown">
          {results.map((r, i) => (
            <div key={i} className="search-result" onClick={() => handleSelect(r)}>
              <span className="sr-label">{r.label}</span>
              <span className="sr-hint">{r.hint}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile);
  const [active, setActive] = useState('home');
  const [navMeta, setNavMeta] = useState({ tab: null, scrollTo: null, key: 0 });
  const [history, setHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('gp_color_mode') || 'dark');

  useEffect(() => {
    if (Array.isArray(profile?.remindersV2) && profile.remindersV2.length > 0) {
      try { localStorage.setItem('gp_reminders', JSON.stringify(profile.remindersV2)); } catch {}
      scheduleReminders(profile.remindersV2);
    } else {
      scheduleReminders(loadReminders());
    }
    return stopReminders;
  }, []); // eslint-disable-line

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
  const lastTapRef = useRef({ time: 0, x: 0, y: 0 });

  const navigate = (id, tab = null, scrollTo = null) => {
    if (id === 'antiaging') { id = 'skincare'; tab = tab ?? 'antiaging'; }
    clearInnerBack(); // entering a new section clears any inner sub-page history
    const cur = activeRef.current;
    if (id !== cur.section || tab !== cur.tab) {
      setHistory(prev => [...prev.slice(-19), { section: cur.section, tab: cur.tab }]);
    }
    setActive(id);
    setNavMeta(prev => ({ tab, scrollTo, key: prev.key + 1 }));
    setMenuOpen(false);
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
    setMenuOpen(false);
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
      return;
    }

    const target = e.target;
    const isInteractive = target.closest?.(
      'button, input, textarea, select, a, [role="button"], .check-item, .ingr-card, .petal-acc, .month-card'
    );
    if (isInteractive) return;

    const tap = e.changedTouches[0];
    const now = Date.now();
    const last = lastTapRef.current;
    const distance = Math.hypot(tap.clientX - last.x, tap.clientY - last.y);

    if (now - last.time < 320 && distance < 36) {
      lastTapRef.current = { time: 0, x: 0, y: 0 };
      goHome();
      return;
    }

    lastTapRef.current = { time: now, x: tap.clientX, y: tap.clientY };
  }

  const background = (
    <>
      <div className="bg-layer" />
      <div className="bg-aurora" />
      <div className="cloud-layer" />
      <AtmosphericSparkles />
      <FloatingFlowers />
    </>
  );

  const avatar = getAvatarByProfile(profile);

  return (
    <>
      {background}
      <InstallBanner />

      <div className="search-bar-fixed">
        {/* Mobile only: avatar circle + hamburger in the top bar */}
        <div className="mobile-controls">
          {avatar && (
            <button className="mob-avatar-btn" onClick={() => navigate('settings')} aria-label="Profile">
              <div className="mob-avatar-circle" style={{ background: avatar.bg }}>
                <span style={{ fontSize: 16 }}>{avatar.emoji}</span>
              </div>
            </button>
          )}
          <button className="mob-hamburger" onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
          </button>
          <button
            className="mob-mode-btn"
            onClick={() => setColorMode(m => m === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle light/dark mode"
          >
            <div className="mob-mode-circle">{colorMode === 'dark' ? '☀️' : '🌙'}</div>
          </button>
        </div>
        <SearchBar onNavigate={navigate} />
      </div>

      {/* Backdrop — closes the drawer when tapping outside on mobile */}
      {menuOpen && (
        <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />
      )}

      <nav className={`sidebar${menuOpen ? ' open' : ''}`}>
        {/* Desktop: avatar at top of sidebar */}
        {avatar && (
          <button
            className={`sidebar-avatar-btn${active === 'settings' ? ' active' : ''}`}
            onClick={() => navigate('settings')}
            aria-label="Open profile"
          >
            <div className="sidebar-avatar-circle" style={{ background: avatar.bg }}>
              <span className="sidebar-avatar-emoji">{avatar.emoji}</span>
            </div>
            <span className="sidebar-avatar-label">
              {profile?.username || 'Profile'}
            </span>
          </button>
        )}

        {history.length > 0 && (
          <button className="nav-btn nav-back-btn" onClick={goBack} aria-label="Go back">
            ‹ Back
          </button>
        )}
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-btn${active === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
            title={item.label}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
        <button
          className="nav-mode-toggle"
          onClick={() => setColorMode(m => m === 'dark' ? 'light' : 'dark')}
          title={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <span className="nav-icon">{colorMode === 'dark' ? '☀️' : '🌙'}</span>
          <span className="nav-label">{colorMode === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </nav>

      <div
        className="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {active === 'home'       && <Hero onNavigate={navigate} />}
        {active === 'workout'    && <Workout key={navMeta.key} openDayId={navMeta.scrollTo} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} profile={profile} />}
        {active === 'challenges' && <Challenges onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'nutrition'  && <Nutrition key={navMeta.key} initialTab={navMeta.tab} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'skincare'   && <Skincare  key={navMeta.key} initialTab={navMeta.tab} />}
        {active === 'settings'   && <Settings
            onNavigate={navigate}
            profile={profile}
            onProfileUpdate={p => { setProfile(p); saveProfile(p); }}
            colorMode={colorMode}
            setColorMode={setColorMode}
            pushBack={pushBack}
            clearInnerBack={clearInnerBack}
          />}
      </div>

      <button
        className="mode-fab"
        onClick={() => setColorMode(m => m === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle light/dark mode"
        title={colorMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <span className="mode-fab-icon">{colorMode === 'dark' ? '☀️' : '🌙'}</span>
        <span className="mode-fab-label">{colorMode === 'dark' ? 'Light' : 'Dark'}</span>
      </button>

      <div className="motivation">
        <div className="mot-stars">🌸  💕  🌸  💕  🌸</div>
        <h2 className="mot-h">
          Baby steps, baby.
        </h2>
        <p className="mot-p">
          Choose yourself today. Envision your long-term goal. Multiply your "NOW," it compounds and becomes a year.
        </p>
        <p className="mot-p">
          Don't wait for the perfect time. You get to create it.
        </p>
        <div className="mot-q">Start NOW. 🌸</div>
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
