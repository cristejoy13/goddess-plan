import { useState } from 'react';
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

export default function App() {
  const [active, setActive] = useState('home');
  const [navMeta, setNavMeta] = useState({ tab: null, key: 0 });

  const navigate = (id, tab = null) => {
    setActive(id);
    setNavMeta(prev => ({ tab, key: prev.key + 1 }));
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
      </nav>

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
