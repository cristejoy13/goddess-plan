import { useState, useRef, useEffect } from 'react';
import Hero from './components/Hero';
import Workout from './components/Workout';
import Challenges from './components/Challenges';
import Nutrition from './components/Nutrition';
import Skincare from './components/Skincare';
import HairCare from './components/HairCare';
import AntiAging from './components/AntiAging';
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
  { label: 'Glute Workout — Strength A', hint: 'Workouts → Monday', section: 'workout' },
  { label: 'Glute Workout — Strength B', hint: 'Workouts → Thursday', section: 'workout' },
  { label: 'Pilates Workout', hint: 'Workouts → Tuesday & Friday', section: 'workout' },
  { label: 'Sprint Training', hint: 'Workouts → Wednesday', section: 'workout' },
  { label: 'Rest Day Options', hint: 'Workouts → Saturday & Sunday', section: 'workout' },
  { label: 'Meals on Strength & Sprint Days', hint: 'Nutrition → Meat Days', section: 'nutrition', tab: 'meat' },
  { label: 'Meals on Pilates & Rest Days', hint: 'Nutrition → Light Days', section: 'nutrition', tab: 'light' },
  { label: 'Chicken Tinola Recipe', hint: 'Nutrition → Recipes', section: 'nutrition', tab: 'recipes' },
  { label: 'Chia Pudding Recipe', hint: 'Nutrition → Recipes', section: 'nutrition', tab: 'recipes' },
  { label: 'Egg Preparation Methods', hint: 'Nutrition → Recipes', section: 'nutrition', tab: 'recipes' },
  { label: 'Salad Ideas', hint: 'Nutrition → Recipes', section: 'nutrition', tab: 'recipes' },
  { label: 'Snack Ideas', hint: 'Nutrition → Snacks', section: 'nutrition', tab: 'snacks' },
  { label: 'Glycemic Index Guide', hint: 'Nutrition → Food Guide', section: 'nutrition', tab: 'guide' },
  { label: 'Hydration Guide', hint: 'Nutrition → Hydration', section: 'nutrition', tab: 'hydration' },
  { label: 'Calorie Deficit Plan', hint: 'Nutrition → Meat Days', section: 'nutrition', tab: 'meat' },
  { label: 'Morning Skincare Routine', hint: 'Skincare → AM Routine', section: 'skincare', tab: 'am' },
  { label: 'Night Skincare Routine', hint: 'Skincare → PM Routine', section: 'skincare', tab: 'pm' },
  { label: 'Skincare Products', hint: 'Skincare → AM Routine', section: 'skincare', tab: 'am' },
  { label: 'Retinoid Roadmap', hint: 'Skincare → Retinoid', section: 'skincare', tab: 'retinoid' },
  { label: 'Weekly Skincare Treatments', hint: 'Skincare → Weekly', section: 'skincare', tab: 'weekly' },
  { label: 'Body Skincare Routine', hint: 'Skincare → Body Care', section: 'skincare', tab: 'body' },
  { label: 'Shower Body Care', hint: 'Skincare → Body Care', section: 'skincare', tab: 'body' },
  { label: 'Body SPF & Moisturiser', hint: 'Skincare → Body Care', section: 'skincare', tab: 'body' },
  { label: 'Camellia Oil Ritual', hint: 'Hair Care', section: 'haircare' },
  { label: 'Rosemary Oil for Hair Growth', hint: 'Hair Care', section: 'haircare' },
  { label: 'Argan Oil Shine', hint: 'Hair Care', section: 'haircare' },
  { label: 'Sleep Protocol', hint: 'Anti-Aging → Sleep', section: 'antiaging' },
  { label: 'Cortisol Management', hint: 'Anti-Aging → Cortisol', section: 'antiaging' },
  { label: 'Hormone-Protective Eating', hint: 'Anti-Aging → Hormones', section: 'antiaging' },
  { label: 'Skin Longevity Nutrients', hint: 'Anti-Aging → Skin', section: 'antiaging' },
  { label: 'Monthly Challenges', hint: 'Challenges', section: 'challenges' },
  { label: 'January Challenge', hint: 'Challenges', section: 'challenges' },
  { label: 'Supplement Stack', hint: 'Anti-Aging', section: 'antiaging' },
];

const FLOWER_EMOJIS = ['🌸', '🌺', '🌼', '🌸', '🌷', '💐', '🌸', '🌺'];

const PETALS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  size: Math.random() * 10 + 12,
  left: Math.random() * 100,
  flower: FLOWER_EMOJIS[Math.floor(Math.random() * FLOWER_EMOJIS.length)],
  duration: Math.random() * 20 + 14,
  delay: Math.random() * -24,
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

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const inputRef = useRef(null);

  const results = query.trim().length > 1
    ? SEARCH_INDEX.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.hint.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
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
    onNavigate(item.section, item.tab || null);
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
  const [active, setActive] = useState('home');
  const [navMeta, setNavMeta] = useState({ tab: null, key: 0 });
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = (id, tab = null) => {
    setActive(id);
    setNavMeta(prev => ({ tab, key: prev.key + 1 }));
    setSearchOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-layer" />
      <FloatingFlowers />

      <nav className="nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`nav-btn${active === item.id ? ' active' : ''}`}
            onClick={() => navigate(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button
          className="nav-btn nav-search-btn"
          onClick={() => setSearchOpen(s => !s)}
          aria-label="Search"
        >
          🔍
        </button>
      </nav>

      {searchOpen && (
        <div className="search-modal" onClick={() => setSearchOpen(false)}>
          <div className="search-modal-inner" onClick={e => e.stopPropagation()}>
            <button className="search-modal-close" onClick={() => setSearchOpen(false)}>✕</button>
            <SearchBar onNavigate={navigate} />
          </div>
        </div>
      )}

      <div className="main">
        {active === 'home'       && <Hero onNavigate={navigate} />}
        {active === 'workout'    && <Workout />}
        {active === 'challenges' && <Challenges />}
        {active === 'nutrition'  && <Nutrition key={navMeta.key} initialTab={navMeta.tab} />}
        {active === 'skincare'   && <Skincare  key={navMeta.key} initialTab={navMeta.tab} />}
        {active === 'haircare'   && <HairCare />}
        {active === 'antiaging'  && <AntiAging />}
      </div>

      <div className="motivation">
        <div className="mot-stars">🌸  💕  🌸  💕  🌸</div>
        <h2 className="mot-h">
          You are not building a body.<br />
          You are building <em>a way of life.</em>
        </h2>
        <p className="mot-p">
          Every meal, every workout, every oiling ritual, every skincare step, every night you choose rest over chaos — it compounds. Quietly. Powerfully. Irreversibly.
        </p>
        <p className="mot-p">
          Twelve months from now you will not recognise the version of yourself you left behind.
        </p>
        <div className="mot-q">Be consistent. Be patient. Be relentless. 🌸</div>
      </div>
    </>
  );
}
