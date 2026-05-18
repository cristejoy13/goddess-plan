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

export default function Hero({ onNavigate }) {
  return (
    <div className="hero">
      <div className="hero-bg-ring" style={{ width: 800, height: 800, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="hero-bg-ring" style={{ width: 560, height: 560, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '2s' }} />
      <div className="hero-bg-ring" style={{ width: 320, height: 320, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '4s' }} />

      <div className="hero-tag">🌸 January — December 2026 🌸</div>

      <h1>The <em>Goddess</em><br />Plan</h1>

      <div className="hero-shimmer" />

      <p className="hero-sub">Anti-Bloat · Lean · Glow · Strength · Skin · Hair</p>

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
