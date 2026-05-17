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
  { id: 'home',       label: '✦ Home' },
  { id: 'workout',    label: 'Workouts' },
  { id: 'challenges', label: 'Challenges' },
  { id: 'nutrition',  label: 'Nutrition' },
  { id: 'skincare',   label: 'Skincare' },
  { id: 'haircare',   label: 'Hair Care' },
  { id: 'antiaging',  label: 'Anti-Aging' },
];

const PETAL_COLORS = ['#f9c4d8','#fde97a','#fce4ef','#f0cc60','#fcd6e8','#fffde0'];

const PETALS = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  size: Math.random() * 18 + 8,
  left: Math.random() * 100,
  color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  duration: Math.random() * 18 + 12,
  delay: Math.random() * -20,
}));

function FloatingPetals() {
  return (
    <>
      {PETALS.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            background: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </>
  );
}

export default function App() {
  const [active, setActive] = useState('home');

  const navigate = (id) => {
    setActive(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="bg-layer" />
      <FloatingPetals />

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
        {active === 'nutrition'  && <Nutrition />}
        {active === 'skincare'   && <Skincare />}
        {active === 'haircare'   && <HairCare />}
        {active === 'antiaging'  && <AntiAging />}
      </div>

      <div className="motivation">
        <div className="mot-stars">✦  ✦  ✦  ✦  ✦</div>
        <h2 className="mot-h">
          You are not building a body.<br />
          You are building <em>a way of life.</em>
        </h2>
        <p className="mot-p">
          Every meal, every workout, every oiling ritual, every skincare step, every night you choose rest over chaos — it compounds. Quietly. Powerfully. Irreversibly.
        </p>
        <p className="mot-p">
          Eight months from now you will not recognise the version of yourself you left behind.
        </p>
        <div className="mot-q">Be consistent. Be patient. Be relentless. ✦</div>
      </div>
    </>
  );
}
