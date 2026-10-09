// Sign-up for new people (2026-10-10): a few questions, one per screen, then
// a plan built from the answers, a username, and Google to save it.
//
// Shown only on a gadget that has never had a profile. Her own gadgets always
// have one, so they never see it; on a new gadget of hers, "I already have an
// account" signs her in and brings her own app back.
//
// Nothing is made up: every number shown comes from what the person typed,
// through the same formula online TDEE calculators use (src/utils/userPlan.js).
// The answers are kept on the gadget as they go, so a reload loses nothing.

import { useEffect, useMemo, useState } from 'react';
import { ACTIVITY, targetsFor, PROFILE_KEY } from '../utils/userPlan';
import { signInWithGoogle, signInLater, onAccount } from '../utils/account';
import { GoogleMark, SignInGate } from './SignIn';
import { hasNoProfile } from '../utils/userPlan';
import { readDay } from '../utils/mealScan';
import { useDictation, joinSpeech } from '../utils/dictation';

const DRAFT_KEY = 'gp_signup_draft';

const PUSH = [
  { id: 'gentle', emoji: '🌱', label: 'Gentle', note: 'Slow and easy to keep up' },
  { id: 'steady', emoji: '🔥', label: 'Steady', note: 'Clear progress, still livable' },
  { id: 'allin',  emoji: '⚡', label: 'All in', note: 'Fastest results, the most discipline' },
];

const FOODS = [
  { id: 'protein', emoji: '🍗', label: 'Protein', items: ['Chicken', 'Beef', 'Pork', 'Fish', 'Tuna', 'Salmon', 'Shrimp', 'Eggs', 'Tofu', 'Beans & lentils'] },
  { id: 'veg', emoji: '🥦', label: 'Vegetables', items: ['Spinach', 'Broccoli', 'Carrots', 'Cucumber', 'Tomato', 'Bell pepper', 'Lettuce', 'Cabbage', 'Eggplant', 'Okra', 'Squash', 'Green beans', 'Kangkong', 'Pechay'] },
  { id: 'fruit', emoji: '🍓', label: 'Fruits', items: ['Banana', 'Apple', 'Mango', 'Papaya', 'Pineapple', 'Orange', 'Berries', 'Watermelon', 'Grapes', 'Avocado'] },
  { id: 'carbs', emoji: '🍠', label: 'Carbs & grains', items: ['White rice', 'Brown rice', 'Oats', 'Sweet potato', 'Potato', 'Whole-wheat bread', 'Pasta', 'Corn', 'Quinoa'] },
  { id: 'dairy', emoji: '🥛', label: 'Dairy', items: ['Milk', 'Greek yogurt', 'Cheese', 'Cottage cheese'] },
  { id: 'fats', emoji: '🥜', label: 'Nuts, seeds & fats', items: ['Peanut butter', 'Almonds', 'Peanuts', 'Chia seeds', 'Olive oil', 'Coconut oil'] },
];

const AVOID = ['Gluten', 'Dairy', 'Nuts', 'Shellfish', 'Eggs', 'Soy', 'Pork', 'Beef'];

// One program for everyone (2026-10-10): glutes and abs — body recomposition,
// toned — so there is no goal question.
const STEPS = ['welcome', 'you', 'activity', 'train', 'meals', 'push', 'foods', 'avoid', 'numbers', 'name', 'save'];

function loadDraft() {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null') || {}; } catch { return {}; }
}

function cmFromFtIn(ft, inch) {
  const f = Number(ft) || 0, i = Number(inch) || 0;
  return f || i ? Math.round((f * 12 + i) * 2.54) : '';
}

export default function Onboarding({ onDone }) {
  const [a, setA] = useState(() => ({ units: 'metric', days: 3, place: 'home', push: 'steady', foods: {}, avoid: [], ...loadDraft(), goal: 'recomp' }));
  const [step, setStep] = useState(() => Math.max(0, STEPS.indexOf(loadDraft().step || 'welcome')));
  const [openCat, setOpenCat] = useState('protein');
  const [reading, setReading] = useState(false);
  const [readError, setReadError] = useState('');
  const set = patch => setA(prev => ({ ...prev, ...patch }));

  useEffect(() => {
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...a, step: STEPS[step] })); } catch { /* fine */ }
  }, [a, step]);

  const talk = useDictation(heard => set({ mealsNow: joinSpeech(a.mealsBase || '', heard) }));

  const heightCm = a.units === 'imperial' ? cmFromFtIn(a.ft, a.inch) : Number(a.heightCm) || '';
  const weightKg = a.units === 'imperial' ? (Number(a.lb) ? Math.round(Number(a.lb) * 0.45359237 * 10) / 10 : '') : Number(a.weightKg) || '';
  const answers = useMemo(() => ({
    goal: a.goal, sex: a.sex, age: Number(a.age) || '', heightCm, weightKg,
    activity: a.activity, days: a.days, place: a.place, push: a.push,
  }), [a.goal, a.sex, a.age, heightCm, weightKg, a.activity, a.days, a.place, a.push]);
  const t = targetsFor(answers);

  const name = STEPS[step];
  const valid = {
    welcome: true,
    you: a.sex && Number(a.age) >= 13 && Number(a.age) <= 100 && heightCm >= 120 && heightCm <= 230 && weightKg >= 30 && weightKg <= 300,
    activity: Boolean(a.activity),
    train: a.days >= 2 && a.days <= 6 && a.place,
    meals: true,
    push: Boolean(a.push),
    foods: true,
    avoid: true,
    numbers: Boolean(t),
    name: /^[A-Za-z0-9._ ]{2,20}$/.test(String(a.username || '').trim()),
    save: true,
  }[name];

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep(s => Math.max(s - 1, 0));

  function finish() {
    const profile = {
      onboarded: true,
      tier: 'free',
      username: String(a.username).trim(),
      gender: a.sex,
      age: answers.age,
      heightCm,
      weightKg,
      activityLevel: a.activity,
      answers,
      foodsLiked: a.foods,
      avoid: a.avoid,
      avoidOther: a.avoidOther || '',
      mealsNow: a.mealsNow || '',
      mealsNowRead: a.mealsRead || null,
      targets: t,
      tdeeKcal: t?.tdee,
      deficitKcal: t?.calories,
      createdAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      localStorage.removeItem(DRAFT_KEY);
    } catch { /* fine */ }
    window.dispatchEvent(new Event('gp-profile-changed'));
    return profile;
  }

  async function readMeals() {
    setReadError('');
    setReading(true);
    try {
      const r = await readDay(String(a.mealsNow || '').trim());
      set({ mealsRead: r });
    } catch (err) {
      setReadError(err.message);
    } finally {
      setReading(false);
    }
  }

  function toggleFood(cat, item) {
    const cur = a.foods?.[cat] || [];
    set({ foods: { ...a.foods, [cat]: cur.includes(item) ? cur.filter(x => x !== item) : [...cur, item] } });
  }

  const pct = Math.round((step / (STEPS.length - 1)) * 100);

  return (
    <div className="su-overlay" role="dialog" aria-modal="true" aria-label="Make your plan">
      <div className="su-col">
        {step > 0 && (
          <div className="su-top">
            <button type="button" className="su-back" onClick={back} aria-label="Back">‹</button>
            <div className="su-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
          </div>
        )}

        {name === 'welcome' && (
          <div className="su-step su-welcome">
            <img className="su-logo" src="/icon-192.png" alt="" />
            <h1 className="su-title">The Goddess <em>Plan</em></h1>
            <p className="su-sub">Grow your glutes, tone your abs — with your meals and calories in one place. A few questions, then your plan.</p>
            <button type="button" className="su-primary" onClick={next}>Make Goddess Plan</button>
            <button type="button" className="su-link" onClick={() => signInWithGoogle()}>I already have an account · Sign in with Google</button>
          </div>
        )}

        {name === 'you' && (
          <div className="su-step">
            <h2 className="su-q">About you</h2>
            <div className="su-seg" role="group" aria-label="Sex">
              {[['female', 'Female'], ['male', 'Male']].map(([id, label]) => (
                <button key={id} type="button" className={a.sex === id ? 'on' : ''} onClick={() => set({ sex: id })} aria-pressed={a.sex === id}>{label}</button>
              ))}
            </div>
            <div className="su-seg su-seg-small" role="group" aria-label="Units">
              {[['metric', 'kg · cm'], ['imperial', 'lb · ft']].map(([id, label]) => (
                <button key={id} type="button" className={a.units === id ? 'on' : ''} onClick={() => set({ units: id })} aria-pressed={a.units === id}>{label}</button>
              ))}
            </div>
            <div className="su-fields">
              <label className="su-field"><span>Age</span><input id="su-age" type="number" inputMode="numeric" value={a.age || ''} onChange={e => set({ age: e.target.value })} placeholder="—" /></label>
              {a.units === 'metric' ? (
                <>
                  <label className="su-field"><span>Height · cm</span><input id="su-cm" type="number" inputMode="decimal" value={a.heightCm || ''} onChange={e => set({ heightCm: e.target.value })} placeholder="—" /></label>
                  <label className="su-field"><span>Weight · kg</span><input id="su-kg" type="number" inputMode="decimal" value={a.weightKg || ''} onChange={e => set({ weightKg: e.target.value })} placeholder="—" /></label>
                </>
              ) : (
                <>
                  <div className="su-field su-field-pair">
                    <span>Height</span>
                    <div><input id="su-ft" type="number" inputMode="numeric" value={a.ft || ''} onChange={e => set({ ft: e.target.value })} placeholder="ft" aria-label="Feet" />
                      <input id="su-in" type="number" inputMode="numeric" value={a.inch || ''} onChange={e => set({ inch: e.target.value })} placeholder="in" aria-label="Inches" /></div>
                  </div>
                  <label className="su-field"><span>Weight · lb</span><input id="su-lb" type="number" inputMode="decimal" value={a.lb || ''} onChange={e => set({ lb: e.target.value })} placeholder="—" /></label>
                </>
              )}
            </div>
          </div>
        )}

        {name === 'activity' && (
          <div className="su-step">
            <h2 className="su-q">How active is your normal day?</h2>
            <p className="su-sub">Not counting workouts.</p>
            <div className="su-cards">
              {Object.entries(ACTIVITY).map(([id, v]) => (
                <button key={id} type="button" className={`su-card${a.activity === id ? ' on' : ''}`} onClick={() => set({ activity: id })} aria-pressed={a.activity === id}>
                  <span><b>{v.label}</b><small>{v.note}</small></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {name === 'train' && (
          <div className="su-step">
            <h2 className="su-q">How many days a week can you work out?</h2>
            <div className="su-days" role="group" aria-label="Days a week">
              {[2, 3, 4, 5, 6].map(n => (
                <button key={n} type="button" className={a.days === n ? 'on' : ''} onClick={() => set({ days: n })} aria-pressed={a.days === n}>{n}</button>
              ))}
            </div>
            <h2 className="su-q su-q-2">Where?</h2>
            <div className="su-seg" role="group" aria-label="Where">
              {[['home', '🏠 At home'], ['gym', '🏋️ At a gym']].map(([id, label]) => (
                <button key={id} type="button" className={a.place === id ? 'on' : ''} onClick={() => set({ place: id })} aria-pressed={a.place === id}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {name === 'meals' && (
          <div className="su-step">
            <h2 className="su-q">What do you eat on a normal day?</h2>
            <p className="su-sub">Write it like you'd tell a friend, or tap 🎤 and say it.</p>
            <div className="su-talk">
              <textarea
                id="su-meals"
                className="su-textarea"
                value={a.mealsNow || ''}
                onChange={e => set({ mealsNow: e.target.value, mealsRead: null })}
                placeholder="e.g. coffee with sugar in the morning, rice and chicken for lunch, bread at 4, rice and fish for dinner"
                rows={5}
              />
              <button
                type="button"
                className={`su-mic${talk.listening ? ' on' : ''}`}
                onClick={() => { if (talk.listening) talk.stop(); else { set({ mealsBase: a.mealsNow || '', mealsRead: null }); talk.start(); } }}
                aria-label={talk.listening ? 'Stop listening' : 'Talk instead of typing'}
              >{talk.listening ? '■' : '🎤'}</button>
            </div>
            <button type="button" className="su-secondary" onClick={readMeals} disabled={reading || !String(a.mealsNow || '').trim()}>
              {reading ? 'Reading…' : '✨ Read my meals'}
            </button>
            {readError && <p className="su-error">{readError}</p>}
            {a.mealsRead && (
              <div className="su-read">
                <b>≈ {a.mealsRead.calories.toLocaleString()} calories a day{a.mealsRead.protein ? ` · ${a.mealsRead.protein} g protein` : ''}</b>
                {a.mealsRead.summary && <small>{a.mealsRead.summary}</small>}
              </div>
            )}
          </div>
        )}

        {name === 'push' && (
          <div className="su-step">
            <h2 className="su-q">Are you willing to pay the price?</h2>
            <p className="su-sub">How hard do you want to push?</p>
            <div className="su-cards">
              {PUSH.map(p => {
                const pt = targetsFor({ ...answers, push: p.id });
                return (
                  <button key={p.id} type="button" className={`su-card${a.push === p.id ? ' on' : ''}`} onClick={() => set({ push: p.id })} aria-pressed={a.push === p.id}>
                    <span className="su-card-emoji" aria-hidden="true">{p.emoji}</span>
                    <span><b>{p.label}</b><small>{p.note}{pt ? ` · ${pt.calories.toLocaleString()} cal a day` : ''}</small></span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {name === 'foods' && (
          <div className="su-step">
            <h2 className="su-q">Which foods do you like?</h2>
            <p className="su-sub">Tap all you'd happily eat. Open one group at a time.</p>
            <div className="su-cats">
              {FOODS.map(cat => {
                const chosen = a.foods?.[cat.id] || [];
                const open = openCat === cat.id;
                return (
                  <div key={cat.id} className={`su-cat${open ? ' open' : ''}`}>
                    <button type="button" className="su-cat-head" onClick={() => setOpenCat(open ? '' : cat.id)} aria-expanded={open}>
                      <span>{cat.emoji} {cat.label}</span>
                      <span className="su-cat-count">{chosen.length ? `${chosen.length} ✓` : ''} {open ? '▴' : '▾'}</span>
                    </button>
                    {open && (
                      <div className="su-chips">
                        {cat.items.map(item => (
                          <button key={item} type="button" className={`su-chip${chosen.includes(item) ? ' on' : ''}`} onClick={() => toggleFood(cat.id, item)} aria-pressed={chosen.includes(item)}>{item}</button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {name === 'avoid' && (
          <div className="su-step">
            <h2 className="su-q">Anything you can't or won't eat?</h2>
            <p className="su-sub">Allergies, or foods you skip. Leave empty if none.</p>
            <div className="su-chips su-chips-open">
              {AVOID.map(item => {
                const on = a.avoid.includes(item);
                return <button key={item} type="button" className={`su-chip${on ? ' on' : ''}`} onClick={() => set({ avoid: on ? a.avoid.filter(x => x !== item) : [...a.avoid, item] })} aria-pressed={on}>{item}</button>;
              })}
            </div>
            <input id="su-avoid" className="su-input" value={a.avoidOther || ''} onChange={e => set({ avoidOther: e.target.value })} placeholder="Anything else?" />
          </div>
        )}

        {name === 'numbers' && t && (
          <div className="su-step">
            <h2 className="su-q">Your numbers</h2>
            <div className="su-numbers">
              <div><span>Maintenance (TDEE)</span><b>{t.tdee.toLocaleString()}</b><small>calories a day to stay the same</small></div>
              <div className="su-num-main"><span>Your daily calories</span><b>{t.calories.toLocaleString()}</b><small>a little below maintenance</small></div>
              <div><span>Protein</span><b>{t.protein} g</b><small>a day</small></div>
              <div><span>Fat loss per week</span><b>≈ {Math.abs(t.weeklyKg)} kg</b><small>while your glutes grow</small></div>
            </div>
            {a.mealsRead && (
              <p className="su-sub su-compare">
                You eat about {a.mealsRead.calories.toLocaleString()} now — {Math.abs(a.mealsRead.calories - t.calories).toLocaleString()} {a.mealsRead.calories > t.calories ? 'more' : 'less'} than your plan.
              </p>
            )}
          </div>
        )}

        {name === 'name' && (
          <div className="su-step">
            <h2 className="su-q">Pick a username</h2>
            <p className="su-sub">2–20 letters or numbers. This is what the app calls you.</p>
            <input id="su-username" className="su-input" value={a.username || ''} onChange={e => set({ username: e.target.value })} placeholder="e.g. goddess_jen" autoCapitalize="off" autoCorrect="off" maxLength={20} />
          </div>
        )}

        {name === 'save' && (
          <div className="su-step su-welcome">
            <img className="su-logo" src="/icon-192.png" alt="" />
            <h2 className="su-title">Your plan is <em>ready</em>, {String(a.username || '').trim()}</h2>
            <p className="su-sub">Sign in with Google to keep it safe on all your gadgets.</p>
            <button type="button" className="su-google" onClick={() => { finish(); signInWithGoogle(); }}>
              <GoogleMark /> Sign in with Google
            </button>
            <button type="button" className="su-link" onClick={() => { finish(); signInLater(); onDone?.(); }}>Not now</button>
          </div>
        )}

        {step > 0 && name !== 'save' && (
          <div className="su-foot">
            <button type="button" className="su-primary" onClick={next} disabled={!valid}>
              {name === 'meals' && !String(a.mealsNow || '').trim() ? 'Skip' : name === 'foods' || name === 'avoid' ? 'Next' : 'Next'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// What a gadget shows before the app: the sign-up questions for someone new;
// "Loading your plan…" while a returning person's things come down; otherwise
// the usual sign-in reminder.
export function SignupGate() {
  const [noProfile, setNoProfile] = useState(hasNoProfile);
  const [acc, setAcc] = useState({ status: 'loading' });
  useEffect(() => onAccount(setAcc), []);
  useEffect(() => {
    const check = () => setNoProfile(hasNoProfile());
    window.addEventListener('gp-remote-sync', check);
    window.addEventListener('gp-profile-changed', check);
    return () => {
      window.removeEventListener('gp-remote-sync', check);
      window.removeEventListener('gp-profile-changed', check);
    };
  }, []);
  if (!noProfile) return <SignInGate />;
  let adopting = false;
  try { adopting = localStorage.getItem('gp_sync_adopt') === '1'; } catch { /* fine */ }
  if (adopting || acc.status === 'linking') {
    return (
      <div className="si-overlay" role="status">
        <div className="si-card"><img className="si-logo" src="/icon-192.png" alt="" /><p className="si-text">Loading your plan…</p></div>
      </div>
    );
  }
  return <Onboarding onDone={() => setNoProfile(hasNoProfile())} />;
}
