const GOALS = [
  '🌸 Flat Stomach at Rest',
  '✨ Clear, Bright Skin',
  '💪 Round Glutes',
  '🌿 Low Inflammation',
  '🌺 Healthy Hormones',
  '💎 Shiny Wavy Hair',
  '🧠 Brain Health',
  '💧 Less Puffiness',
];

export default function Hero({ onNavigate }) {
  return (
    <div className="hero">
      {/* Concentric glow rings */}
      <div className="hero-bg-ring" style={{ width: 800, height: 800, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      <div className="hero-bg-ring" style={{ width: 560, height: 560, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '2s' }} />
      <div className="hero-bg-ring" style={{ width: 320, height: 320, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', animationDelay: '4s' }} />

      <div className="hero-tag">✦ May — December 2025 ✦</div>

      <h1>The <em>Goddess</em><br />Plan</h1>

      {/* Gold shimmer bar */}
      <div className="hero-shimmer" />

      <p className="hero-sub">Anti-Bloat · Lean · Glow · Strength · Skin · Hair</p>

      <div className="hero-goals">
        {GOALS.map(g => <span key={g} className="goal-pill">{g}</span>)}
      </div>

      <div className="hero-cta">
        <button className="cta-btn cta-primary" onClick={() => onNavigate('workout')}>
          Start Your Plan ✦
        </button>
        <button className="cta-btn cta-secondary" onClick={() => onNavigate('challenges')}>
          View Challenges
        </button>
      </div>
    </div>
  );
}
