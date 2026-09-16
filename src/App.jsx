import { useState, useRef, useEffect, Component } from 'react';
import Hero from './components/Hero';
import InstallBanner from './components/InstallBanner';
import Workout from './components/Workout';
import Meal from './components/Meal';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import Settings from './components/Settings';
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

const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: '🏠' },
  { id: 'workout',    label: 'Workouts',   icon: '💪' },
  { id: 'meal',       label: 'Meal',       icon: '🍽️' },
  { id: 'skincare',   label: 'Body',       icon: '✨' },
  // Settings is reached via the flower/avatar button, not a separate nav item.
];

const SEARCH_INDEX = [
  // Monday to Sunday. Glute days Mon/Wed/Fri, abs days Tue/Thu, weekend runs.
  { label: 'Monday — Glute Power', hint: 'Workouts · Hip Thrust · RDL · Step-Up · 1-hour walk', section: 'workout', scrollTo: 'day-monday'    },
  { label: 'Tuesday — Abs & Upper Body', hint: 'Workouts · 5 ab moves · Shoulders · Back · 1-hour walk', section: 'workout', scrollTo: 'day-tuesday'   },
  { label: 'Wednesday — Glute Strength', hint: 'Workouts · Squat · Bulgarian · RDL · 1-hour walk', section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Thursday — Abs & Upper Body', hint: 'Workouts · 5 ab moves · Shoulders · Back · 1-hour walk', section: 'workout', scrollTo: 'day-thursday'  },
  { label: 'Friday — Glute Shape', hint: 'Workouts · Abduction · Kickback · Sumo · 1-hour walk', section: 'workout', scrollTo: 'day-friday'    },
  { label: 'Saturday — Run & Jessica Diễm', hint: 'Workouts · Easy Run · one Jessica Diễm video · long stretch', section: 'workout', scrollTo: 'day-saturday'  },
  { label: 'Sunday — Sprints & Jessica Diễm', hint: 'Workouts · Sprint Intervals · one Jessica Diễm video · long stretch', section: 'workout', scrollTo: 'day-sunday'  },

  // The six glute lifts everything is built on.
  { label: 'Barbell Hip Thrust',      hint: 'Workouts → Monday Glute Power · the best glute builder', section: 'workout', scrollTo: 'day-monday' },
  { label: 'Romanian Deadlift (RDL)', hint: 'Workouts → Monday & Wednesday', section: 'workout', scrollTo: 'day-monday' },
  { label: 'Dumbbell Step-Up',        hint: 'Workouts → Monday Glute Power', section: 'workout', scrollTo: 'day-monday' },
  { label: 'Barbell Back Squat',      hint: 'Workouts → Wednesday Glute Strength', section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Bulgarian Split Squat',   hint: 'Workouts → Wednesday Glute Strength · evens out the hips', section: 'workout', scrollTo: 'day-wednesday' },
  { label: 'Hip Abduction',           hint: 'Workouts → Friday Glute Shape · the round upper-side glute', section: 'workout', scrollTo: 'day-friday' },
  { label: 'Cable Kickback',          hint: 'Workouts → Friday Glute Shape', section: 'workout', scrollTo: 'day-friday' },
  { label: 'Sumo Squat',              hint: 'Workouts → Friday Glute Shape', section: 'workout', scrollTo: 'day-friday' },

  // Abs — Tuesday and Thursday only. Never on a glute day.
  { label: 'Abs — the five moves', hint: 'Workouts → Tuesday & Thursday · crunch, reverse crunch, leg raise, dead bug, plank', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Weighted Crunch',         hint: 'Workouts → Tuesday & Thursday · the only ab move that gets heavier', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Reverse Crunch',          hint: 'Workouts → Tuesday & Thursday · lower stomach', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Lying Leg Raise',         hint: 'Workouts → Tuesday & Thursday · lower stomach', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Dead Bug',                hint: 'Workouts → Tuesday & Thursday · deep core', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Plank',                   hint: 'Workouts → Tuesday & Thursday', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Stomach Vacuum',          hint: 'Workouts → Tuesday & Thursday · warm-up · pulls the waist in', section: 'workout', scrollTo: 'day-tuesday' },

  // Upper body — kept light on purpose.
  { label: 'Band Pull-Apart',         hint: 'Workouts → Tuesday & Thursday · posture, not size', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Double-Arm Dumbbell Row', hint: 'Workouts → Tuesday & Thursday · back', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Incline Push-Up',         hint: 'Workouts → Tuesday & Thursday · slim, toned arms', section: 'workout', scrollTo: 'day-tuesday' },

  { label: 'Jessica Diễm — weekend videos', hint: 'Workouts → Saturday & Sunday · one video each day', section: 'workout', scrollTo: 'day-saturday' },
  { label: 'Abs Videos — Pilates by Izzy', hint: 'Workouts → Tuesday & Thursday · optional extra', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Full Body Pilates — Move With Nicole', hint: 'Workouts → Tuesday & Thursday · optional extra', section: 'workout', scrollTo: 'day-tuesday' },
  { label: 'Overnight Yogurt Bowl',   hint: 'Nutrition → Recipes · yogurt, protein, psyllium, blueberries', section: 'nutrition', tab: 'recipes' },
  { label: 'Meal Times — the daily clock',     hint: 'Nutrition → Daily Clock · 12 PM the big brunch, 5 PM apple & yogurt', section: 'nutrition', tab: 'daily' },
  { label: 'One-Hour Walk — how a training day ends', hint: 'Workouts → every weekday, after the main workout · or the rope instead', section: 'workout', scrollTo: 'day-monday' },
  { label: 'Protein — 50 g a day is the floor', hint: 'Nutrition → Daily Clock · the number to stay above', section: 'nutrition', tab: 'daily' },
  { label: 'Calories — 1,000 a day is the ceiling', hint: 'Nutrition → Daily Clock · the number to stay under', section: 'nutrition', tab: 'daily' },
  { label: 'THE BRUNCH — 12 PM', hint: 'Nutrition → Daily Clock · Meal A the egg plate, or Meal B beef or chicken', section: 'nutrition', tab: 'daily' },
  { label: 'Eating window — 12 PM to 5 PM', hint: 'Nutrition → Daily Clock · nothing before noon, nothing after 5 PM', section: 'nutrition', tab: 'daily' },
  { label: 'Apple Sticks & Greek Yogurt',      hint: 'Nutrition → Daily Clock · the 5 PM meal · 16 g protein', section: 'nutrition', tab: 'daily' },
  { label: 'Kimchi — after training',          hint: 'Nutrition → Daily Clock · protein & kimchi', section: 'nutrition', tab: 'daily' },
  { label: 'Protein Smoothie Bowl — 5 PM',    hint: 'Nutrition → the biggest of the evening bowls · 32 g protein', section: 'nutrition', tab: 'daily' },
  { label: 'Tofu — Press, Sear & Scramble',    hint: 'Nutrition → Recipes',      section: 'nutrition', tab: 'recipes' },
  { label: 'Eggs — Boiled, Scrambled & Poached', hint: 'Nutrition → Recipes',   section: 'nutrition', tab: 'recipes' },
  { label: 'Fish — Steamed & Baked',           hint: 'Nutrition → Recipes',      section: 'nutrition', tab: 'recipes' },
  { label: 'Low-Bloat Fruits',                 hint: 'Nutrition → Food Guide',   section: 'nutrition', tab: 'guide'   },
  { label: 'Hydration Guide',                  hint: 'Nutrition → Recipes',      section: 'nutrition', tab: 'recipes' },
  { label: 'Food Guide — Eat / Avoid (GODSSSS)', hint: 'Nutrition → Food Guide', section: 'nutrition', tab: 'guide'  },
  { label: 'Morning Skincare Routine',      hint: 'Skincare → Face → AM Routine',   section: 'skincare', tab: 'am'       },
  { label: 'Night Skincare Routine',        hint: 'Skincare → Face → PM Routine',   section: 'skincare', tab: 'pm'       },
  { label: 'Skincare Products',             hint: 'Skincare → Face → AM Routine',   section: 'skincare', tab: 'am'       },
  { label: 'Retinoid Roadmap',              hint: 'Skincare → Face → Retinoid',     section: 'skincare', tab: 'retinoid' },
  { label: 'Weekly Skincare Treatments',    hint: 'Skincare → Face → Weekly',       section: 'skincare', tab: 'weekly'   },
  { label: 'Body Skincare Routine',         hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Shower Body Care',             hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Body SPF & Moisturiser',       hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Vaseline Heels & Elbows',      hint: 'Skincare → Body Care',           section: 'skincare', tab: 'body'     },
  { label: 'Hair — Before shower',  hint: 'Body → Hair · comb, massage, oil, then wash', section: 'skincare', tab: 'hair' },
  { label: 'Hair — After shower',   hint: 'Body → Hair · growth serum, serum, heat guard', section: 'skincare', tab: 'hair' },
  { label: 'Hair — Night',          hint: 'Body → Hair · scalp oil, ends, plait, bonnet', section: 'skincare', tab: 'hair' },
  { label: 'Hair — Going out',      hint: 'Body → Hair · not greasy, not dry', section: 'skincare', tab: 'hair' },
  { label: 'Lashes — every night',  hint: 'Body → Hair · its own pill · upper lash line only', section: 'skincare', tab: 'hair' },
  { label: 'Heat guard',            hint: 'Body → Hair → After shower · never heat without it', section: 'skincare', tab: 'hair' },
  { label: 'Hair Growth Serum — caffeine & peptides', hint: 'Body → Hair → After shower · for the hairline', section: 'skincare', tab: 'hair' },
  { label: 'Wooden Wide-Tooth Comb & Scalp Massager', hint: 'Body → Hair · the two tools every routine starts with', section: 'skincare', tab: 'hair' },
  { label: 'Satin Bonnet',          hint: 'Body → Hair → Night · keeps the oil in, stops the friction', section: 'skincare', tab: 'hair' },
  { label: 'Saturday oil soak',     hint: 'Body → Hair · two oils · rosemary plus one that changes', section: 'skincare', tab: 'hair' },
  { label: 'Peppermint Oil',        hint: 'Body → Hair · optional · one drop, never on its own', section: 'skincare', tab: 'hair' },
  { label: 'Camellia Oil Ritual',          hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Rosemary Oil for Hair Growth', hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Argan Oil Shine',              hint: 'Body → Hair', section: 'skincare', tab: 'hair' },
  { label: 'Sleep Protocol',               hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Cortisol Management',          hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Hormone-Protective Eating',    hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Skin Longevity Nutrients',     hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Supplement Stack',             hint: 'Skincare → Anti-Aging',    section: 'skincare', tab: 'antiaging' },
  { label: 'Meal — what you actually ate',  hint: 'A calendar you fill in yourself, day by day', section: 'meal' },
  { label: 'Nutrition & Meals',            hint: 'Workouts → Nutrition',      section: 'workout' },
  { label: 'Recipes',                      hint: 'Workouts → Nutrition',      section: 'workout' },
  { label: 'Food Guide',                   hint: 'Workouts → Nutrition',      section: 'workout' },
];



function SearchBar({ onNavigate, onClose }) {
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
    onClose?.();
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
        onKeyDown={e => { if (e.key === 'Escape') onClose?.(); }}
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [colorMode, setColorMode] = useState(() => localStorage.getItem('gp_color_mode') || 'dark');
  const [syncEpoch, setSyncEpoch] = useState(0);

  useEffect(() => {
    const handleRemoteSync = () => {
      setProfile(loadProfile());
      setColorMode(localStorage.getItem('gp_color_mode') || 'dark');
      setSyncEpoch(e => e + 1);
    };
    window.addEventListener('gp-remote-sync', handleRemoteSync);
    return () => window.removeEventListener('gp-remote-sync', handleRemoteSync);
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
    </>
  );

  // Fall back to a default so the Settings entry point always exists (fresh devices have no avatarId)
  const avatar = getAvatarByProfile(profile) || { emoji: '🌸', bg: 'rgba(255,92,157,0.25)' };

  return (
    <>
      {background}
      <InstallBanner />

      <div className={`search-bar-fixed${searchOpen ? ' searching' : ''}`}>
        <div className="topbar-row">
          {/* Menu, then settings — the two big tap targets */}
          <div className="mobile-controls">
            <button className="mob-hamburger" onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}>
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            </button>
            {avatar && (
              <button className="mob-avatar-btn" onClick={() => navigate('settings')} aria-label="Settings">
                <div className="mob-avatar-circle" style={{ background: avatar.bg }}>
                  <span>{avatar.emoji}</span>
                </div>
              </button>
            )}
          </div>

          {/* The two small icons, side by side on the right */}
          <div className="topbar-actions">
            <button
              className="topbar-icon-btn"
              onClick={() => setColorMode(m => m === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle light/dark mode"
            >
              {colorMode === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              className={`topbar-icon-btn${searchOpen ? ' active' : ''}`}
              onClick={() => setSearchOpen(o => !o)}
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
            >
              {searchOpen ? '✕' : '🔍'}
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="topbar-search-row">
            <SearchBar onNavigate={navigate} onClose={() => setSearchOpen(false)} />
          </div>
        )}
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
            <span className="nav-label">
              {item.label}
            </span>
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
        {/* Home is NOT keyed on syncEpoch: remounting it every time a sync
            landed slammed the notes panel shut and threw away whatever was
            half-typed. Its two stateful pieces listen for gp-remote-sync and
            refresh themselves in place instead. */}
        {active === 'home'       && <Hero onNavigate={navigate} />}
        {active === 'workout'    && <Workout key={`${navMeta.key}-${syncEpoch}`} openDayId={navMeta.scrollTo} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} profile={profile} />}
        {active === 'meal'       && <Meal key={syncEpoch} />}
        {active === 'nutrition'  && <Nutrition key={`${navMeta.key}-${syncEpoch}`} initialTab={navMeta.tab} onNavigate={navigate} pushBack={pushBack} clearInnerBack={clearInnerBack} />}
        {active === 'skincare'   && <Skincare  key={`${navMeta.key}-${syncEpoch}`} initialTab={navMeta.tab} />}
        {active === 'settings'   && <Settings
            key={`s${syncEpoch}`}
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
