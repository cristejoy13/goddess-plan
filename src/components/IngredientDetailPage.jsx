import { useState, useEffect } from 'react';
import { INGREDIENT_RECIPES } from '../data/ingredients';

export default function IngredientDetailPage({ ingredientKey, ingredientName, backLabel = 'Back', onBack }) {
  const data = INGREDIENT_RECIPES[ingredientKey];
  const [active, setActive] = useState(0);

  /* Always open at the top of the page */
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, []);

  if (!data) {
    return (
      <div className="section">
        <button className="section-back-btn" onClick={onBack}>‹ {backLabel}</button>
        <div className="note-box note-gold" style={{ marginTop: 16 }}>
          No recipe found for "{ingredientName}".
        </div>
      </div>
    );
  }

  const opt = data.options[active];

  return (
    <div className="section">
      <button className="section-back-btn" onClick={onBack}>‹ {backLabel}</button>

      <div className="ingr-page-header splash-item" style={{ background: data.color }}>
        <div className="ingr-page-emoji">{data.emoji}</div>
        <div className="ingr-page-name">{ingredientName}</div>
        <div className="ingr-page-tagline">{data.tagline}</div>
      </div>

      <div className="ingr-page-tabs splash-item">
        {data.options.map((o, i) => (
          <button
            key={i}
            className={`ingr-page-tab${active === i ? ' active' : ''}`}
            onClick={() => setActive(i)}
          >
            {o.emoji} {o.name}
          </button>
        ))}
      </div>

      <div className="ingr-page-option splash-item">
        <div className="ingr-page-time">⏱ {opt.time}</div>
        <ol className="ingr-page-steps">
          {opt.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
        {opt.tip && <div className="ingr-page-tip">💡 {opt.tip}</div>}
      </div>
    </div>
  );
}
