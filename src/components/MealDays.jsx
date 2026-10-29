import { useEffect, useState } from 'react';
import PhotoView from './PhotoView';
import { DAY_TYPES, DAY_PLANS, DAY_NAMES, DAY_SHORT, DAY_PICK_KEY, plansFor } from '../data/mealDays';

// ─── Meals → Days (2026-10-30) ─────────────────────────────────────────────
// Her whole-day meal plans. First the two covers, Glute Days and Light Days.
// A cover opens its page: which days it is for, big, on top, then its meal
// plans as pictures. A picture opens the plan laid out like her card: daily
// totals, then each meal with its time, foods and amounts, calories and
// protein, and below it why and how to cook. ♥ chooses that plan for those
// days; Home shows it on the day.

const PICKS_KEY = 'gp_meal_picks';
const loadPicks = () => { try { return JSON.parse(localStorage.getItem(PICKS_KEY) || '{}') || {}; } catch { return {}; } };
const todayIdx = () => (new Date().getDay() + 6) % 7;

// Small drawn marks for the totals, as on her card.
const MARK = {
  kcal: <path d="M12 3.5c.5 3-1.6 4.6-3 6.4-1.3 1.6-2 3.1-2 4.8a5 5 0 0 0 10 0c0-2.4-1.3-4.2-2.4-5.4.1 1.6-.5 2.7-1.5 3.2.4-3.4-.4-6.5-1.1-9z" />,
  protein: <><path d="M6.5 13.5c0-3 1.5-5.5 4-6.5l1-3.5 2.5 1-1 3c2.6.6 4.5 2.8 4.5 5.6 0 3.3-2.7 5.4-6 5.4s-5-2-5-5z" /><path d="M10 13.5c1 .8 2.6.8 3.6 0" /></>,
  fiber: <><path d="M12 20.5V10" /><path d="M12 13c-3.6 0-6-2.2-6-6.5 3.8 0 6 2.4 6 6.5zM12 11c0-3.8 2.2-6.3 6-6.3 0 4-2.4 6.3-6 6.3z" /></>,
  carbs: <><path d="M4.5 12.5h15a7.5 7.5 0 0 1-15 0z" /><path d="M8 9.5c.5-1.2 1.6-2 3-2M13 8c.6-.8 1.6-1.4 2.8-1.4" /></>,
};
function Mark({ k }) {
  return (
    <svg className="md-mark" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {MARK[k]}
    </svg>
  );
}

function Totals({ totals }) {
  const parts = ['kcal', 'protein', 'fiber', 'carbs'].filter(k => totals[k]);
  return (
    <div className="md-totals">
      {parts.map(k => (
        <div key={k} className={`md-total md-total-${k}`}>
          <Mark k={k} />
          <span><b>{totals[k]}</b><small>Daily total</small></span>
        </div>
      ))}
    </div>
  );
}

// The days a kind of day is for, big and on top. Today is marked.
function DayRow({ type }) {
  const t = todayIdx();
  return (
    <div className="md-dayrow" aria-label={`${type.name}: ${type.days.map(d => DAY_NAMES[d]).join(', ')}`}>
      {type.days.map(d => (
        <span key={d} className={`md-day${d === t ? ' is-today' : ''}`}>
          {d === t && <em>Today</em>}
          <b>{DAY_SHORT[d]}</b>
          {type.dayNotes?.[d] && <small>{type.dayNotes[d]}</small>}
        </span>
      ))}
    </div>
  );
}

function MealCard({ meal }) {
  return (
    <article className={`md-meal${meal.snack ? ' is-snack' : ''}`}>
      <div className="md-meal-main">
        <header className="md-meal-head">
          <span className="md-time">{meal.time}</span>
          <h4 className="md-meal-name">{meal.name}</h4>
        </header>
        <ul className="md-items">
          {meal.items.map(([food, amount]) => (
            <li key={food}><span>{food}</span><b>{amount}</b></li>
          ))}
        </ul>
        <div className="md-sum">{meal.kcal} · {meal.protein}</div>
      </div>
      {meal.image && <img className="md-meal-pic" src={meal.image} alt={meal.name} loading="lazy" />}
      {(meal.why || meal.gives || meal.steps) && (
        <div className="md-more">
          {meal.why && (
            <details className="md-fold">
              <summary>Why</summary>
              <ul className="md-why">
                {meal.why.map(([food, what]) => <li key={food}><b>{food}</b><span>{what}</span></li>)}
              </ul>
            </details>
          )}
          {meal.gives && <p className="md-gives"><b>This gives you:</b> {meal.gives}</p>}
          {meal.steps && (
            <details className="md-fold">
              <summary>{meal.stepsTitle || 'How to cook'}</summary>
              <ol className="md-steps">{meal.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
              {meal.optional && <p className="md-optional"><b>Optional:</b> {meal.optional}</p>}
              {meal.after && <p className="md-optional">{meal.after}</p>}
            </details>
          )}
        </div>
      )}
    </article>
  );
}

export function PlanPage({ plan, type, hearted, onHeart }) {
  const [card, setCard] = useState(false);
  const dayWords = type.days.map(d => DAY_NAMES[d]);
  const dayList = dayWords.length > 1 ? `${dayWords.slice(0, -1).join(', ')}, and ${dayWords.at(-1)}` : dayWords[0];
  return (
    <div className="md-plan">
      <div className="md-plan-title">
        <h3>{plan.name}</h3>
        <button type="button" className={`md-heart${hearted ? ' on' : ''}`} onClick={onHeart} aria-pressed={hearted}>
          {hearted ? `♥ Chosen for ${type.name.toLowerCase()}` : `♡ Choose for ${type.name.toLowerCase()}`}
        </button>
      </div>
      <DayRow type={type} />
      <Totals totals={plan.totals} />
      {plan.note && <p className="md-note">{plan.note}</p>}
      <div className="md-meals">
        {plan.meals.map(m => <MealCard key={m.time} meal={m} />)}
      </div>
      <div className="md-use">Use this plan on {dayList}.</div>
      {plan.card && (
        <button type="button" className="md-card-btn" onClick={() => setCard(true)}>See your plan card</button>
      )}
      <PhotoView src={card ? plan.card : null} alt={`${plan.name} plan card`} onClose={() => setCard(false)} />
    </div>
  );
}

export default function MealDays({ initialType = null, pushBack, clearInnerBack }) {
  const [typeId, setTypeId] = useState(DAY_TYPES.some(t => t.id === initialType) ? initialType : null);
  const [planId, setPlanId] = useState(null);
  const [picks, setPicks] = useState(loadPicks);
  useEffect(() => {
    const refresh = () => setPicks(loadPicks());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);

  // The phone's Back steps out one page at a time: plan → its days → covers.
  function backTo(t, p) {
    clearInnerBack?.();
    if (t) pushBack?.(() => { setTypeId(null); setPlanId(null); });
    if (p) pushBack?.(() => backTo(t, null));
    setTypeId(t);
    setPlanId(p);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  useEffect(() => {
    if (initialType) backTo(initialType, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function heart(type, plan) {
    const key = DAY_PICK_KEY(type.id);
    const next = { ...loadPicks() };
    if (next[key] === plan.id) delete next[key]; else next[key] = plan.id;
    try { localStorage.setItem(PICKS_KEY, JSON.stringify(next)); } catch { /* kept for this visit */ }
    setPicks(next);
  }

  const type = DAY_TYPES.find(t => t.id === typeId);
  const plan = DAY_PLANS.find(p => p.id === planId);
  const t = todayIdx();

  if (!type) {
    return (
      <div className="md">
        <div className="md-covers">
          {DAY_TYPES.map(dt => (
            <button key={dt.id} type="button" className="md-cover" onClick={() => backTo(dt.id, null)}>
              <img src={dt.cover} alt={dt.name} />
              {dt.days.includes(t) && <span className="md-cover-today">Today</span>}
              <span className="md-cover-days">{dt.days.map(d => DAY_SHORT[d]).join(' · ')}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const list = plansFor(type.id);
  const chosenId = picks[DAY_PICK_KEY(type.id)];

  return (
    <div className="md">
      <div className="md-head">
        <button type="button" className="md-back" onClick={() => backTo(plan ? type.id : null, null)}>
          ‹ {plan ? type.name : 'Days'}
        </button>
        <h3 className="md-head-title">{plan ? plan.name : type.name}</h3>
        <span />
      </div>

      {plan ? (
        <PlanPage plan={plan} type={type} hearted={chosenId === plan.id} onHeart={() => heart(type, plan)} />
      ) : (
        <>
          <DayRow type={type} />
          <div className="md-plans-title">Meal plans</div>
          <div className="md-plans">
            {list.map(p => (
              <button key={p.id} type="button" className={`md-plancard${chosenId === p.id ? ' on' : ''}`} onClick={() => backTo(type.id, p.id)}>
                <img src={p.image} alt="" />
                <span className="md-plancard-text">
                  <b>{chosenId === p.id ? '♥ ' : ''}{p.name}</b>
                  <small>{p.totals.kcal} · {p.totals.protein}</small>
                </span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
