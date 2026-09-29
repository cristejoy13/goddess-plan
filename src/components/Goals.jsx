import { useState, useEffect, useRef, useCallback } from 'react';
import { ask } from '../utils/ask';
import { createPortal } from 'react-dom';
import { loadLog, formatKg } from '../utils/mealLog';
import { fireConfetti } from '../utils/confetti';
import {
  loadGoals, saveGoals, newGoalId, achievedGoals,
  loadCelebrated, saveCelebrated, TARGET_KG, KG_PER_WEEK,
  KG_GOAL_ID, WORKOUT_GOAL_ID, rewardText, setReward, claimReward,
  goalTarget, goalTotal, addProgress, removeProgress,
} from '../utils/goals';
import { loadWorkouts, goalReachedOn, WORKOUTS_CHANGED } from '../utils/workoutLog';
import WorkoutGoalCard from './WorkoutTracker';

// ─── GOALS ─────────────────────────────────────────────────────────────────
// The button left of the title (the notebook is on the right), the page it
// opens — every goal and its chart lives inside it, nowhere else — and the
// confetti when a goal lands.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function prettyDate(key) {
  const [y, m, d] = key.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
function prettyFinish(date) {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

// A "G" in a flowing script, gold, with blossoms curling round it.
function GoddessG() {
  const blossom = (cx, cy, r, fill) => (
    <g transform={`translate(${cx} ${cy})`}>
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.62} ry={r} fill={fill} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.55} fill="#fff3b0" />
    </g>
  );
  return (
    <svg className="goals-g" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="goals-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff1b8" />
          <stop offset="0.5" stopColor="#f0cc60" />
          <stop offset="1" stopColor="#c98a1c" />
        </linearGradient>
      </defs>
      {/* vine */}
      <path d="M10 50 C 16 58, 30 60, 40 56" fill="none" stroke="#7ccf9a" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M44 10 C 50 8, 56 12, 56 18" fill="none" stroke="#7ccf9a" strokeWidth="1.4" strokeLinecap="round" />
      <ellipse cx="22" cy="57" rx="3.2" ry="1.4" fill="#7ccf9a" transform="rotate(-18 22 57)" />
      <ellipse cx="33" cy="58.5" rx="3" ry="1.3" fill="#7ccf9a" transform="rotate(12 33 58.5)" />
      <ellipse cx="53" cy="10.5" rx="2.8" ry="1.2" fill="#7ccf9a" transform="rotate(35 53 10.5)" />
      <text
        x="31" y="47" textAnchor="middle"
        fontFamily="'Pinyon Script', 'Cormorant Garamond', serif"
        fontSize="52" fill="url(#goals-gold)"
        stroke="#f0cc60" strokeWidth="1.1" paintOrder="stroke"
      >G</text>
      {blossom(10, 50, 4.2, '#ff8fbd')}
      {blossom(42, 56, 3, '#ffc2dc')}
      {blossom(56, 19, 3.8, '#ff8fbd')}
      {blossom(47, 8, 2.4, '#ffc2dc')}
    </svg>
  );
}

export function GoalsToggle({ achieved, onOpen }) {
  const has = achieved.length > 0;
  return (
    <button
      type="button"
      className={`goals-launcher splash-item${has ? ' goals-launcher-won' : ''}`}
      onClick={onOpen}
      aria-label={has ? `Open goals, ${achieved.length} achieved` : 'Open goals'}
    >
      <GoddessG />
      {has && <span className="goals-crown" aria-hidden="true">👑{achieved.length > 1 ? achieved.length : ''}</span>}
    </button>
  );
}

// The 40 kg plan in a few lines, inside the goals page.
export function KgGoalCard({ plan, onOpen, onNavigate }) {
  const body = !plan ? (
    <div className="kg-empty">
      Weigh yourself in Meal to start.
      {onNavigate && (
        <button type="button" className="kg-link" onClick={e => { e.stopPropagation(); onNavigate('meal'); }}>
          Go to Meal ›
        </button>
      )}
    </div>
  ) : plan.reached ? (
    <div className="kg-done">🎉 You reached {TARGET_KG} kg on {prettyDate(plan.reachedOn)}.</div>
  ) : (
    <>
      <div className="kg-stats">
        <div><span>Now</span><b>{formatKg(plan.now.kg)} kg</b></div>
        <div><span>Week {plan.week} aim</span><b>{formatKg(plan.aim)} kg</b></div>
        <div><span>To go</span><b>{formatKg(plan.toGo)} kg</b></div>
      </div>
      <div className="kg-bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(plan.progress * 100)}>
        <span style={{ width: `${Math.max(3, plan.progress * 100)}%` }} />
      </div>
      <div className="kg-note">
        {plan.onTrack ? '✨ On track' : `${formatKg(Math.round((plan.now.kg - plan.aim) * 10) / 10)} kg above this week's aim`}
        {' · '}started {formatKg(plan.start.kg)} kg · done by {prettyFinish(plan.finish)}
      </div>
    </>
  );
  // A div acting as a button, not a <button>: it can hold the "Go to Meal"
  // button inside it, which a real button may not.
  const tap = onOpen ? {
    role: 'button', tabIndex: 0, onClick: onOpen,
    onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(); } },
  } : {};
  return (
    <div className={`kg-card splash-item${onOpen ? ' kg-card-tap' : ''}`} {...tap}>
      <div className="kg-head">
        <span className="kg-title">🎯 {TARGET_KG} kg goal</span>
        <span className="kg-pace">−{KG_PER_WEEK} kg a week</span>
      </div>
      {body}
    </div>
  );
}

// A goal she wrote with a number in it, drawn like the 1,000-workout card: the
// count, the bar, how far to go. A box adds what she did today; the last
// entry can be taken back if it was a mistake.
function NumberGoal({ goals, g, onRemove }) {
  const [amount, setAmount] = useState('');
  const target = goalTarget(g.text);
  const total = goalTotal(g);
  const pct = Math.round(Math.min(100, (total / target) * 100) * 10) / 10;
  const left = Math.max(0, Math.round((target - total) * 100) / 100);
  const last = [...(g.progress || [])].sort((a, b) => (a.at < b.at ? 1 : -1))[0];
  const n = v => v.toLocaleString('en-US');

  function add(e) {
    e.preventDefault();
    const v = Number(String(amount).replace(/,/g, ''));
    if (!(v > 0)) return;
    saveGoals(addProgress(goals, g.id, v));
    setAmount('');
  }
  async function undo() {
    if (!(await ask(`Take +${n(last.amount)} (${prettyDate(last.date)}) off “${g.text}”?`, { yes: 'Take it off' }))) return;
    saveGoals(removeProgress(goals, g.id, last.id));
  }

  return (
    <li className={`wk-goal goal-card${g.done ? ' goal-card-done' : ''}`}>
      <button type="button" className="ml-icon-btn ml-del goal-card-del" onClick={() => onRemove(g)} aria-label={`Delete ${g.text}`}>🗑</button>
      <div className="wk-goal-tag">🎯 {g.text}</div>
      <div className="wk-goal-count"><b>{n(total)}</b><span> / {n(target)}</span></div>
      <div className="wk-goal-bar" role="progressbar" aria-valuemin={0} aria-valuemax={target} aria-valuenow={total}>
        <span style={{ width: `${Math.max(total ? 1.5 : 0, pct)}%` }} />
      </div>
      <div className="wk-goal-pct">
        {g.done ? <b>🎉 Reached!</b> : <><b>{pct}%</b> complete · {n(left)} to go</>}
      </div>
      <form className="goals-num-add" onSubmit={add}>
        <input
          type="number" inputMode="decimal" min="0" step="any"
          value={amount} onChange={e => setAmount(e.target.value)}
          placeholder="How much today?" aria-label={`Add to ${g.text}`}
        />
        <button type="submit" disabled={!(Number(amount) > 0)}>＋ Add</button>
      </form>
      {last && (
        <button type="button" className="goal-card-undo" onClick={undo}>
          Last: +{n(last.amount)} · {prettyDate(last.date)} · ↶ Undo
        </button>
      )}
    </li>
  );
}

export function GoalsPanel({ data, onClose, onNavigate }) {
  const { goals, plan, achieved } = data;
  const [text, setText] = useState('');
  const [reward, setRewardDraft] = useState('');
  // Three tabs instead of one long page — each fits a phone screen, so there
  // is nothing to scroll through to reach the part she wants.
  const [tab, setTab] = useState('goals');
  const inputRef = useRef(null);

  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  function add(e) {
    e.preventDefault();
    const t = text.trim();
    const r = reward.trim();
    if (!t || !r) return;
    // The reward is chosen with the goal and locked in from here — it cannot
    // be edited, only earned (or lost by deleting the goal).
    const now = new Date().toISOString();
    const id = newGoalId();
    saveGoals(setReward({ ...goals, items: [...goals.items, { id, text: t, done: null, createdAt: now, updatedAt: now }] }, id, r));
    setText('');
    setRewardDraft('');
    inputRef.current?.focus();
  }

  async function toggle(g) {
    if (g.done && !(await ask(`Mark “${g.text}” as not achieved yet?`, { yes: 'Not yet' }))) return;
    const now = new Date().toISOString();
    saveGoals({ ...goals, items: goals.items.map(x => (x.id === g.id ? { ...x, done: x.done ? null : now, updatedAt: now } : x)) });
  }

  async function remove(g) {
    const r = rewardText(goals, g.id);
    if (!(await ask(`Delete the goal “${g.text}”${r ? ` and its reward “${r}”` : ''}? This cannot be undone.`, { yes: 'Delete', danger: true }))) return;
    saveGoals(setReward({ ...goals, items: goals.items.filter(x => x.id !== g.id) }, g.id, ''));
  }

  const open = goals.items.filter(g => !g.done);
  const achievedIds = new Set(achieved.map(a => a.id));

  // Taking a goal back out of Achieved. A number goal loses its last entry,
  // which drops it under the target; a plain goal is simply unticked.
  async function notYet(id) {
    const g = goals.items.find(x => x.id === id);
    if (!g) return;
    const last = [...(g.progress || [])].sort((a, b) => (a.at < b.at ? 1 : -1))[0];
    if (goalTarget(g.text) && last) {
      if (!(await ask(`Take +${last.amount} (${prettyDate(last.date)}) off “${g.text}” and move it back to Goals?`, { yes: 'Move it back' }))) return;
      saveGoals(removeProgress(goals, g.id, last.id));
    } else {
      toggle(g);
    }
  }
  // Earned but not yet claimed — the number on the Rewards tab.
  const toClaim = achieved.filter(a => a.reward && !goals.rewards?.[a.id]?.claimed).length;

  return createPortal(
    <div className="daily-notebook-overlay goals-overlay" role="presentation" onClick={onClose}>
      <div className="goals-panel" role="dialog" aria-modal="true" aria-label="My goals" onClick={e => e.stopPropagation()}>
        <div className="goals-top">
          <GoddessG />
          <div className="goals-title">My <em>Goals</em></div>
          <button type="button" className="daily-notebook-close" onClick={onClose} aria-label="Close goals">×</button>
        </div>

        <div className="goals-tabs" role="tablist" aria-label="Goals sections">
          {[
            { id: 'goals', label: '🎯 Goals', count: 0 },
            { id: 'rewards', label: '🎁 Rewards', count: toClaim },
            { id: 'achieved', label: '👑 Achieved', count: achieved.length },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`goals-tab${tab === t.id ? ' on' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.count > 0 && <span className="goals-tab-count">{t.count}</span>}
            </button>
          ))}
        </div>

        {tab === 'goals' && <>
        {/* Only goals still being worked on. A reached goal moves to the
            Achieved tab; its data stays exactly as it was. */}
        {!plan?.reached && <KgGoalCard plan={plan} onNavigate={p => { onClose(); onNavigate(p); }} />}
        {!achievedIds.has(WORKOUT_GOAL_ID) && <WorkoutGoalCard />}

        {open.length === 0 && <div className="goals-empty">Write a goal below. Put a number in it to get a bar.</div>}
        <ul className="goals-list">
          {open.map(g => goalTarget(g.text) ? (
            <NumberGoal key={g.id} goals={goals} g={g} onRemove={remove} />
          ) : (
            <li key={g.id} className={`goals-item${g.done ? ' goals-item-done' : ''}`}>
              <button
                type="button"
                className={`goals-tick${g.done ? ' goals-tick-on' : ''}`}
                onClick={() => toggle(g)}
                aria-label={g.done ? `Mark “${g.text}” not achieved` : `Mark “${g.text}” achieved`}
              >{g.done ? '✓' : null}</button>
              <span className="goals-text">{g.text}</span>
              <button type="button" className="ml-icon-btn ml-del" onClick={() => remove(g)} aria-label={`Delete ${g.text}`}>🗑</button>
            </li>
          ))}
        </ul>
        <form className="goals-add goals-add-2" onSubmit={add}>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="🎯 New goal…"
            maxLength={120}
            aria-label="New goal"
          />
          <input
            value={reward}
            onChange={e => setRewardDraft(e.target.value)}
            placeholder="🎁 Its reward…"
            maxLength={120}
            aria-label="Reward for this goal"
          />
          <button type="submit" disabled={!text.trim() || !reward.trim()}>＋ Add</button>
        </form>
        <div className="goals-lock-note">🔒 The reward locks in. A number in the goal gets a bar.</div>

        </>}

        {tab === 'rewards' && <Rewards goals={goals} achievedIds={new Set(achieved.map(a => a.id))} />}

        {tab === 'achieved' && (
          achieved.length === 0
            ? <div className="goals-empty">Nothing yet. Your first win shows here. 👑</div>
            : <ul className="goals-won-list">
                {achieved.map(a => (
                  <li key={a.id}>
                    <span className="gw-crown" aria-hidden="true">👑</span>
                    <div className="gw-body">
                      <b>{a.text}</b>
                      {a.reward && <span className="gw-reward">🎁 {a.reward}</span>}
                    </div>
                    <div className="gw-side">
                      <small>{prettyDate(a.at)}</small>
                      {goals.items.some(g => g.id === a.id) && (
                        <button type="button" className="gw-undo" onClick={() => notYet(a.id)}>↶ Not yet</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
        )}
      </div>
    </div>,
    document.body,
  );
}

// ─── rewards ───────────────────────────────────────────────────────────────
// One row per goal, the 40 kg goal first. She writes each reward herself.
// Locked until its goal is reached; then it can be claimed.
function RewardRow({ goals, id, goalText, earned }) {
  const reward = rewardText(goals, id);
  const claimed = Boolean(goals.rewards?.[id]?.claimed);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(reward || '');

  async function save(e) {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    if (!(await ask(`Lock in “${t}” as the reward for “${goalText}”? You can’t change it later.`, { yes: 'Lock in' }))) return;
    saveGoals(setReward(goals, id, t));
    setEditing(false);
  }

  return (
    <li className={`rw-item${earned ? ' rw-earned' : ''}${claimed ? ' rw-claimed' : ''}`}>
      <span className="rw-icon" aria-hidden="true">{claimed ? '✅' : earned ? '🎁' : '🔒'}</span>
      <div className="rw-body">
        <div className="rw-goal">{goalText}</div>
        {editing ? (
          <form className="rw-edit" onSubmit={save}>
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Your reward…"
              maxLength={120}
              aria-label={`Reward for ${goalText}`}
            />
            <button type="submit" disabled={!draft.trim()}>Lock in</button>
            <button type="button" className="rw-cancel" onClick={() => { setEditing(false); setDraft(''); }}>Cancel</button>
          </form>
        ) : reward ? (
          // Locked in: shown, never edited.
          <span className="rw-text">{reward}</span>
        ) : (
          <button type="button" className="rw-add" onClick={() => { setDraft(''); setEditing(true); }}>＋ Add a reward</button>
        )}
      </div>
      {earned && reward && !editing && (
        <button
          type="button"
          className={`rw-claim${claimed ? ' on' : ''}`}
          onClick={async () => {
            if (claimed && !(await ask(`Mark “${reward}” as not claimed yet?`, { yes: 'Not claimed' }))) return;
            saveGoals(claimReward(goals, id, !claimed));
          }}
        >
          {claimed ? 'Claimed' : 'Claim'}
        </button>
      )}
    </li>
  );
}

function Rewards({ goals, achievedIds }) {
  const rows = [
    { id: KG_GOAL_ID, text: `Reach ${TARGET_KG} kg` },
    { id: WORKOUT_GOAL_ID, text: 'Complete 1,000 workouts' },
    ...goals.items.map(g => ({ id: g.id, text: g.text })),
  ];
  return (
    <>
      <ul className="rw-list">
        {rows.map(r => (
          <RewardRow key={r.id} goals={goals} id={r.id} goalText={r.text} earned={achievedIds.has(r.id)} />
        ))}
      </ul>
    </>
  );
}


// Lives in App, so the confetti comes wherever she is when a goal lands —
// on the Meal page the moment she saves a weight of 40, or on opening the app
// after another device reached it. Each goal celebrates once per device.
export function GoalWatcher() {
  const [toast, setToast] = useState(null);
  const check = useCallback(() => {
    const achieved = achievedGoals(loadLog(), loadGoals(), goalReachedOn(loadWorkouts()));
    const seen = loadCelebrated();
    const now = new Set(achieved.map(a => a.id));
    // A goal un-ticked (or a weight back above 40) may celebrate again later.
    let changed = false;
    for (const id of Object.keys(seen)) if (!now.has(id)) { delete seen[id]; changed = true; }
    const fresh = achieved.filter(a => !seen[a.id]);
    for (const a of fresh) { seen[a.id] = new Date().toISOString(); changed = true; }
    if (changed) saveCelebrated(seen);
    if (fresh.length) {
      fireConfetti();
      setToast({
        text: fresh.map(a => a.text).join(' · '),
        reward: fresh.map(a => a.reward).filter(Boolean).join(' · '),
      });
    }
  }, []);

  useEffect(() => {
    // A beat after opening, so the confetti lands on a page that has drawn.
    const first = setTimeout(check, 600);
    window.addEventListener('gp-goals-changed', check);
    window.addEventListener(WORKOUTS_CHANGED, check);
    window.addEventListener('gp-remote-sync', check);
    return () => {
      clearTimeout(first);
      window.removeEventListener('gp-goals-changed', check);
      window.removeEventListener(WORKOUTS_CHANGED, check);
      window.removeEventListener('gp-remote-sync', check);
    };
  }, [check]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), toast.reward ? 9000 : 6000);
    return () => clearTimeout(t);
  }, [toast]);

  if (!toast) return null;
  return (
    <button type="button" className="goals-toast" onClick={() => setToast(null)}>
      <span>🎉 Goal achieved</span>
      <b>{toast.text}</b>
      {toast.reward && <em className="goals-toast-reward">🎁 Your reward: {toast.reward}</em>}
    </button>
  );
}
