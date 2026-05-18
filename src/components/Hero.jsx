import { useState, useRef, useEffect } from 'react';

const GOALS = [
  { label: '🌸 Flat Stomach at Rest', section: 'nutrition',  tab: 'guide'     },
  { label: '✨ Clear, Bright Skin',    section: 'skincare',   tab: 'am'        },
  { label: '💪 Round Glutes',          section: 'workout',    tab: null        },
  { label: '🌿 Low Inflammation',      section: 'nutrition',  tab: 'guide'     },
  { label: '🌺 Healthy Hormones',      section: 'antiaging',  tab: null        },
  { label: '💎 Shiny Wavy Hair',       section: 'haircare',   tab: null        },
  { label: '🧠 Brain Health',          section: 'antiaging',  tab: null        },
  { label: '💧 Less Puffiness',        section: 'nutrition',  tab: 'hydration' },
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

function SearchBar({ onNavigate }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

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

  function handleSelect(item) {
    onNavigate(item.section, item.tab || null);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className="search-wrap" ref={wrapRef}>
      <input
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

export default function Hero({ onNavigate }) {
  return (
    <div className="hero">
      {/* Concentric glow rings */}
      <div className="hero-bg-ring" style={{ width: 800, height: 800, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="hero-bg-ring" style={{ width: 560, height: 560, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '2s' }} />
      <div className="hero-bg-ring" style={{ width: 320, height: 320, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '4s' }} />

      <div className="hero-tag">🌸 January — December 2026 🌸</div>

      <h1>The <em>Goddess</em><br />Plan</h1>

      {/* Gold shimmer bar */}
      <div className="hero-shimmer" />

      <p className="hero-sub">Anti-Bloat · Lean · Glow · Strength · Skin · Hair</p>

      <SearchBar onNavigate={onNavigate} />

      <div className="hero-goals">
        {GOALS.map(g => (
          <button
            key={g.label}
            className="goal-pill"
            onClick={() => onNavigate(g.section, g.tab)}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="hero-cta">
        <button className="cta-btn cta-primary" onClick={() => onNavigate('workout')}>
          Start Your Plan 🌸
        </button>
        <button className="cta-btn cta-secondary" onClick={() => onNavigate('challenges')}>
          View Challenges
        </button>
      </div>
    </div>
  );
}
