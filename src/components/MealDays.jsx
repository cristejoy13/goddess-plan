import { useEffect, useState } from 'react';
import PhotoView from './PhotoView';
import Sheet from './Sheet';
import { DAY_TYPES, DAY_PLANS, DAY_NAMES, DAY_SHORT, DAY_PICK_KEY, plansFor, shopList } from '../data/mealDays';

// ─── Meals → Days (2026-10-30) ─────────────────────────────────────────────
// Her whole-day meal plans. First the two covers, Glute Days and Light Days.
// A cover opens its page: which days it is for, big, on top, then its meal
// plans as pictures. A picture opens the plan laid out like her card: daily
// totals, then each meal with its time, foods and amounts, calories and
// protein, and below it why and how to cook. ♥ chooses that plan for those
// days; Home shows it on the day. No repeated words: the plan's name is
// shown once, beside its heart.

const PICKS_KEY = 'gp_meal_picks';
const loadPicks = () => { try { return JSON.parse(localStorage.getItem(PICKS_KEY) || '{}') || {}; } catch { return {}; } };
// Shopping lists: { checklist: true, ticks: { <planId>: { <food>: true } } },
// synced as gp_shop. The checklist switch is one icon in the list.
const SHOP_KEY = 'gp_shop';
const loadShop = () => {
  try {
    const v = JSON.parse(localStorage.getItem(SHOP_KEY) || 'null');
    if (v && typeof v === 'object') return { checklist: v.checklist !== false, ticks: v.ticks && typeof v.ticks === 'object' ? v.ticks : {} };
  } catch { /* start fresh */ }
  return { checklist: true, ticks: {} };
};
const saveShop = v => { try { localStorage.setItem(SHOP_KEY, JSON.stringify(v)); } catch { /* kept for this visit */ } };

const BAG = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5.5 8h13l-1 12h-11z" /><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" />
  </svg>
);

function ShopButton({ plan, onOpen, className = '' }) {
  return (
    <button type="button" className={`md-shop-btn ${className}`} onClick={e => { e.stopPropagation(); onOpen(plan.id); }} aria-label={`Shopping list for ${plan.name}`} title="Shopping list">
      {BAG}
    </button>
  );
}

function ShopSheet({ plan, onClose }) {
  const [shop, setShop] = useState(loadShop);
  useEffect(() => {
    const refresh = () => setShop(loadShop());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  if (!plan) return null;
  const ticks = shop.ticks[plan.id] || {};
  const list = shopList(plan);
  const update = next => { saveShop(next); setShop(next); };
  const tick = food => {
    const mine = { ...ticks };
    if (mine[food]) delete mine[food]; else mine[food] = true;
    update({ ...shop, ticks: { ...shop.ticks, [plan.id]: mine } });
  };
  return (
    <Sheet open kicker="Shopping list" title={plan.name} onClose={onClose}>
      <div className="md-shop">
        <div className="md-shop-tools">
          <button
            type="button"
            className={`md-shop-mode${shop.checklist ? ' on' : ''}`}
            onClick={() => update({ ...shop, checklist: !shop.checklist })}
            aria-pressed={shop.checklist}
            aria-label={shop.checklist ? 'Checklist on' : 'Checklist off'}
            title={shop.checklist ? 'Checklist on' : 'Checklist off'}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="4" width="16" height="16" rx="4" />{shop.checklist && <path d="M8.5 12.2l2.4 2.4 4.8-5" />}
            </svg>
          </button>
        </div>
        <ul className={`md-shop-list${shop.checklist ? ' is-check' : ''}`}>
          {list.map(({ food, amounts }) => {
            const done = shop.checklist && ticks[food];
            const body = <><span className="md-shop-food">{food}</span>{amounts.length > 0 && <b>{amounts.join(' + ')}</b>}</>;
            return (
              <li key={food} className={done ? 'done' : ''}>
                {shop.checklist ? (
                  <button type="button" className="md-shop-row" onClick={() => tick(food)} aria-pressed={Boolean(done)}>
                    <span className="md-shop-box" aria-hidden="true">{done && '✓'}</span>{body}
                  </button>
                ) : <div className="md-shop-row">{body}</div>}
              </li>
            );
          })}
        </ul>
      </div>
    </Sheet>
  );
}

const todayIdx = () => (new Date().getDay() + 6) % 7;

// Small drawn marks for the totals, as on her card.
const MARK = {
  kcal: <path d="M12 3.5c.5 3-1.6 4.6-3 6.4-1.3 1.6-2 3.1-2 4.8a5 5 0 0 0 10 0c0-2.4-1.3-4.2-2.4-5.4.1 1.6-.5 2.7-1.5 3.2.4-3.4-.4-6.5-1.1-9z" />,
  protein: <><path d="M6.5 13.5c0-3 1.5-5.5 4-6.5l1-3.5 2.5 1-1 3c2.6.6 4.5 2.8 4.5 5.6 0 3.3-2.7 5.4-6 5.4s-5-2-5-5z" /><path d="M10 13.5c1 .8 2.6.8 3.6 0" /></>,
  fiber: <><path d="M12 20.5V10" /><path d="M12 13c-3.6 0-6-2.2-6-6.5 3.8 0 6 2.4 6 6.5zM12 11c0-3.8 2.2-6.3 6-6.3 0 4-2.4 6.3-6 6.3z" /></>,
  carbs: <><path d="M4.5 12.5h15a7.5 7.5 0 0 1-15 0z" /><path d="M8 9.5c.5-1.2 1.6-2 3-2M13 8c.6-.8 1.6-1.4 2.8-1.4" /></>,
  iron: <path d="M12 3.5c-2.8 4-5.5 7.3-5.5 10.5a5.5 5.5 0 0 0 11 0c0-3.2-2.7-6.5-5.5-10.5z" />,
};
function Mark({ k }) {
  return (
    <svg className="md-mark" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {MARK[k]}
    </svg>
  );
}

function Totals({ totals }) {
  const parts = ['kcal', 'protein', 'fiber', 'carbs', 'iron'].filter(k => totals[k]);
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
            <li key={food}><span>{food}</span>{amount && <b>{amount}</b>}</li>
          ))}
        </ul>
        <div className="md-sum">{[meal.kcal, meal.protein, meal.fiber, meal.iron].filter(Boolean).join(' · ')}</div>
      </div>
      {meal.image && <img className="md-meal-pic" src={meal.image} alt={meal.name} loading="lazy" />}
      {(meal.why || meal.steps) && (
        <div className="md-more">
          {meal.why && (
            <details className="md-fold">
              <summary>{meal.whyTitle || 'Why'}</summary>
              <ul className="md-why">
                {meal.why.map(([food, what]) => <li key={food}><b>{food}</b><span>{what}</span></li>)}
              </ul>
            </details>
          )}
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

export function PlanPage({ plan, type, hearted, onHeart, onShop }) {
  const [card, setCard] = useState(false);
  return (
    <div className="md-plan">
      <div className="md-plan-title">
        <h3>{plan.name}</h3>
        <button type="button" className={`md-heart${hearted ? ' on' : ''}`} onClick={onHeart} aria-pressed={hearted} aria-label={`Choose for ${type.name.toLowerCase()}`}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill={hearted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" />
          </svg>
        </button>
        {onShop && <ShopButton plan={plan} onOpen={onShop} className="md-shop-btn-plan" />}
      </div>
      <DayRow type={type} />
      <Totals totals={plan.totals} />
      <div className="md-meals">
        {plan.meals.map(m => <MealCard key={m.time} meal={m} />)}
      </div>
      {plan.card && (
        <button type="button" className="md-card-btn" onClick={() => setCard(true)}>See your plan card</button>
      )}
      <PhotoView src={card ? plan.card : null} alt={`${plan.name} plan card`} onClose={() => setCard(false)} />
    </div>
  );
}

export default function MealDays({ initialType = null, pushBack, clearInnerBack, onHeartPlan }) {
  const [typeId, setTypeId] = useState(DAY_TYPES.some(t => t.id === initialType) ? initialType : null);
  const [planId, setPlanId] = useState(null);
  const [picks, setPicks] = useState(loadPicks);
  const [shopFor, setShopFor] = useState(null);
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
    // ♥ also puts the plan's meals on today in the calendar; un-hearting
    // takes them off again.
    onHeartPlan?.(type, next[key] ? plan : null);
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

  const chosenId = picks[DAY_PICK_KEY(type.id)];
  // Her hearted plan comes first; the rest keep their order.
  const list = [...plansFor(type.id)].sort((a, b) => (b.id === chosenId) - (a.id === chosenId));

  return (
    <div className="md">
      <div className="md-head">
        <button type="button" className="md-back" onClick={() => backTo(plan ? type.id : null, null)}>
          ‹ {plan ? type.name : 'Days'}
        </button>
        {plan ? <span /> : <h3 className="md-head-title">{type.name}</h3>}
        <span />
      </div>

      {plan ? (
        <PlanPage plan={plan} type={type} hearted={chosenId === plan.id} onHeart={() => heart(type, plan)} onShop={setShopFor} />
      ) : (
        <>
          <DayRow type={type} />
          <div className="md-plans-title">Meal plans</div>
          <div className="md-plans">
            {list.map(p => (
              <div key={p.id} className="md-plancard-wrap">
                <button type="button" className={`md-plancard${chosenId === p.id ? ' on' : ''}`} onClick={() => backTo(type.id, p.id)}>
                  <img src={p.image} alt="" />
                  <span className="md-plancard-text">
                    <b>{p.name}</b>
                    <small>{p.totals.kcal} · {p.totals.protein}</small>
                  </span>
                </button>
                <ShopButton plan={p} onOpen={setShopFor} className="md-shop-btn-tile" />
                <button type="button" className={`md-heart md-heart-tile${chosenId === p.id ? ' on' : ''}`} onClick={() => heart(type, p)} aria-pressed={chosenId === p.id} aria-label={`Choose ${p.name} for ${type.name.toLowerCase()}`}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill={chosenId === p.id ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" /></svg>
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      {shopFor && <ShopSheet plan={DAY_PLANS.find(p => p.id === shopFor)} onClose={() => setShopFor(null)} />}
    </div>
  );
}
