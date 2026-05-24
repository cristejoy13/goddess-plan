import { useState, useRef, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import Hero from './components/Hero';
import InstallBanner from './components/InstallBanner';
import Workout from './components/Workout';
import Challenges from './components/Challenges';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import HairCare from './components/HairCare';
import AntiAging from './components/AntiAging';
import Settings from './components/Settings';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import JoyAssistant from './components/JoyAssistant';
import { getAvatarByProfile } from './avatars';
import { loadReminders, scheduleReminders, stopReminders } from './utils/notifications';
import './styles/index.css';

const NAV_ITEMS = [
  { id: 'home',       label: '🌸 Home' },
  { id: 'workout',    label: 'Workouts' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'nutrition',  label: 'Nutrition' },
  { id: 'skincare',   label: 'Skincare' },
  { id: 'haircare',   label: 'Hair Care' },
  { id: 'antiaging',  label: 'Anti-Aging' },
];

const SEARCH_INDEX = [
  { label: 'Monday — Strength A',         hint: 'Workouts · Hip Thrust · RDL · Kickback',    section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Tuesday — Pilates 1',         hint: 'Workouts · Deep Core & TVA',                section: 'workout', scrollTo: 'day-tuesday'   },
  { label: 'Wednesday — Sprint Day',      hint: 'Workouts · Intervals · Meat Meals',          section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Thursday — Strength B',       hint: 'Workouts · Split Squat · Sumo · Clamshell', section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Friday — Pilates 2',          hint: 'Workouts · Flow · Spine & Side Body',        section: 'workout', scrollTo: 'day-friday'   },
  { label: 'Saturday — Rest Day',         hint: 'Workouts · Active Recovery · Light Meals',   section: 'workout', scrollTo: 'day-saturday' },
  { label: 'Sunday — Rest & Prepare',     hint: 'Workouts · Reset · Meal Prep Day',           section: 'workout', scrollTo: 'day-sunday'   },
  { label: 'Barbell Hip Thrust',          hint: 'Workouts → Monday Strength A',  section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Romanian Deadlift',           hint: 'Workouts → Monday Strength A',  section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Bulgarian Split Squat',       hint: 'Workouts → Thursday Strength B',section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Clamshell with Band',         hint: 'Workouts → Thursday Strength B',section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Sprint Training',             hint: 'Workouts → Wednesday',          section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Pilates Exercises',           hint: 'Workouts → Tuesday & Friday',   section: 'workout', scrollTo: 'day-tuesday'   },
  { label: 'Rest Day Options',            hint: 'Workouts → Saturday & Sunday',  section: 'workout', scrollTo: 'day-saturday'  },
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
  { label: 'Camellia Oil Ritual',          hint: 'Hair Care', section: 'haircare' },
  { label: 'Rosemary Oil for Hair Growth', hint: 'Hair Care', section: 'haircare' },
  { label: 'Argan Oil Shine',              hint: 'Hair Care', section: 'haircare' },
  { label: 'Sleep Protocol',               hint: 'Anti-Aging → Sleep',    section: 'antiaging' },
  { label: 'Cortisol Management',          hint: 'Anti-Aging → Cortisol', section: 'antiaging' },
  { label: 'Hormone-Protective Eating',    hint: 'Anti-Aging → Hormones', section: 'antiaging' },
  { label: 'Skin Longevity Nutrients',     hint: 'Anti-Aging → Skin',     section: 'antiaging' },
  { label: 'Supplement Stack',             hint: 'Anti-Aging',            section: 'antiaging' },
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
  const [user, setUser] = useState(undefined);
  const [profile, setProfile] = useState(undefined);
  const [active, setActive] = useState('home');
  const [navMeta, setNavMeta] = useState({ tab: null, scrollTo: null, key: 0 });
  const [history, setHistory] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [joyOpen, setJoyOpen] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u ?? null); });
    return unsub;
  }, []);

  // When user changes, fetch their Firestore profile
  useEffect(() => {
    if (user === undefined) return;
    if (!user) { setProfile(undefined); stopReminders(); return; }
    setProfile(undefined);
    getDoc(doc(db, 'users', user.uid))
      .then(snap => setProfile(snap.exists() ? snap.data() : null))
      .catch(() => setProfile(null));
  }, [user?.uid]); // eslint-disable-line

  // Start reminder scheduler once user is logged in
  useEffect(() => {
    if (!user) return;
    scheduleReminders(loadReminders());
    return stopReminders;
  }, [user?.uid]); // eslint-disable-line

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

  // Checking auth or profile
  if (user === undefined || (user !== null && profile === undefined)) {
    return <>{background}<div className="auth-loading">✨</div></>;
  }

  // Not logged in
  if (user === null) {
    return <>{background}<Login /></>;
  }

  // Logged in but no profile yet — run onboarding
  if (profile === null) {
    return <>{background}<Onboarding user={user} onComplete={(p) => setProfile(p)} /></>;
  }

  // Logged in and has profile — show the full app
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
          <button className="mob-joy-btn" onClick={() => setJoyOpen(true)} aria-label="Open Joy">
            <div className="mob-joy-circle">🥰</div>
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
              {profile?.username || user?.displayName || 'Profile'}
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
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div
        className="main"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {active === 'home'       && <Hero onNavigate={navigate} />}
        {active === 'workout'    && <Workout key={navMeta.key} openDayId={navMeta.scrollTo} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'challenges' && <Challenges />}
        {active === 'nutrition'  && <Nutrition key={navMeta.key} initialTab={navMeta.tab} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'skincare'   && <Skincare  key={navMeta.key} initialTab={navMeta.tab} />}
        {active === 'haircare'   && <HairCare />}
        {active === 'antiaging'  && <AntiAging />}
        {active === 'settings'   && <Settings onNavigate={navigate} user={user} profile={profile} onProfileUpdate={p => setProfile(p)} />}
      </div>

      <JoyAssistant forceOpen={joyOpen} onClose={() => setJoyOpen(false)} />

      <div className="motivation">
        <div className="mot-stars">🌸  💕  🌸  💕  🌸</div>
        <h2 className="mot-h">
          Step-by-Step.
        </h2>
        <p className="mot-p">
          Set a goal today and envision your long-term goal. What matters is today. Multiply your "todays" and it compounds and becomes a year.
        </p>
        <p className="mot-p">
          Don't wait for the right time. It's your choice to make it the right time — which is the <em>NOW.</em>
        </p>
        <div className="mot-q">It's your choice. Make it now. 🌸</div>
      </div>
    </>
  );
}
