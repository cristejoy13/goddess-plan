import { useEffect, useMemo, useState } from 'react';
import { BodyIcon } from './BodyIcons';
import { ask } from '../utils/ask';
import { PHASES, PHASE_ORDER, METHODS, METHOD_ORDER, INJECTION_FOODS } from '../data/cyclePhases';
import {
  loadCycle, saveCycle, today as todayOf, dayKey, fromKey, daysBetween, phaseBounds, phaseInfo, methodOf, PACK, ACTIVE,
} from '../utils/cycle';

// ─── CYCLE ────────────────────────────────────────────────────────────────
// Her own section beside Body (2026-10-26): log a period with one click, see
// the day and phase she is in, the hormone "mountains" of the month, and for
// each phase what to expect and what helps — mood, energy, workout, whole
// foods, skin. Starts empty until she enters her last period.

const pretty = k => fromKey(k).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

function useCycle() {
  const [c, setC] = useState(loadCycle);
  useEffect(() => {
    const refresh = () => setC(loadCycle());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  const update = fn => { const next = fn(loadCycle()); saveCycle(next); setC(next); };
  return [c, update];
}

// ── The mountains: a typical month of hormones, drawn over her phases ──
const W = 340, H = 180, X0 = 8, X1 = 332, Y0 = 34, Y1 = 150;
const bump = (x, at, w, h) => h * Math.exp(-((x - at) ** 2) / (2 * w * w));
function curve(fn) {
  let d = '';
  for (let i = 0; i <= 120; i++) {
    const x = i / 120;
    const y = Math.min(1, fn(x));
    d += `${i ? 'L' : 'M'}${(X0 + x * (X1 - X0)).toFixed(1)} ${(Y1 - y * (Y1 - Y0)).toFixed(1)}`;
  }
  return d;
}

// kind: natural (her own mountains), pack (steady pill days, a drop in the
// break week) or steady (one flat line: no monthly change).
function CycleChart({ len, plen, day, kind = 'natural', noBreak = false }) {
  const pack = kind === 'pack';
  const steady = kind === 'steady';
  const bounds = pack
    ? (noBreak ? [{ id: 'active', from: 1, to: PACK }] : [{ id: 'active', from: 1, to: ACTIVE }, { id: 'break', from: ACTIVE + 1, to: PACK }])
    : steady ? [{ id: 'steady', from: 1, to: len }] : phaseBounds(len, plen);
  const o = (len - 14) / len;
  const luteMid = (o + 1) / 2;
  const xOf = d => X0 + ((d - 1) / len) * (X1 - X0);
  const brk = ACTIVE / PACK;
  const lines = useMemo(() => {
    if (pack) return { pill: curve(x => (noBreak || x < brk ? 0.62 : 0.62 * Math.exp(-(x - brk) * 40) + 0.06)) };
    if (steady) return { pill: curve(() => 0.5) };
    return {
      estrogen: curve(x => 0.12 + bump(x, o - 0.03, 0.07, 0.85) + bump(x, luteMid, 0.1, 0.42)),
      progesterone: curve(x => 0.05 + bump(x, luteMid + 0.03, 0.11, 0.82)),
      lh: curve(x => 0.04 + bump(x, o, 0.016, 0.92)),
    };
  }, [pack, steady, noBreak, brk, o, luteMid]);
  const todayX = day ? xOf(Math.min(day, len) + 0.5) : null;
  return (
    <figure className="cy-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="A typical month of hormones, with your phases">
        {bounds.map(b => (
          <g key={b.id}>
            <rect x={xOf(b.from)} y={Y0 - 6} width={xOf(b.to + 1) - xOf(b.from)} height={Y1 - Y0 + 6} fill={phaseInfo(b.id).color} opacity="0.16" />
            <text x={(xOf(b.from) + xOf(b.to + 1)) / 2} y={20} textAnchor="middle" className="cy-chart-phase" fill={phaseInfo(b.id).color}>
              {b.id === 'ovulation' ? 'Ovul.' : b.id === 'steady' ? 'No monthly phases' : phaseInfo(b.id).name}
            </text>
          </g>
        ))}
        {lines.pill ? <path d={lines.pill} className="cy-line cy-line-pill" /> : (
          <>
            <path d={lines.estrogen} className="cy-line cy-line-estrogen" />
            <path d={lines.progesterone} className="cy-line cy-line-progesterone" />
            <path d={lines.lh} className="cy-line cy-line-lh" />
          </>
        )}
        <line x1={X0} x2={X1} y1={Y1} y2={Y1} className="cy-axis" />
        {[1, Math.round(len / 2), len].map(d => (
          <text key={d} x={xOf(d) + (d === len ? -2 : 2)} y={Y1 + 16} textAnchor={d === len ? 'end' : d === 1 ? 'start' : 'middle'} className="cy-chart-day">Day {d}</text>
        ))}
        {todayX != null && (
          <g>
            <line x1={todayX} x2={todayX} y1={Y0 - 6} y2={Y1} className="cy-today-line" />
            <circle cx={todayX} cy={Y0 - 6} r="4" className="cy-today-dot" />
          </g>
        )}
      </svg>
      <figcaption className="cy-legend">
        {lines.pill ? (
          <span><i className="cy-key cy-key-pill" />{pack ? 'Pill hormones' : 'Your hormones: steady'}</span>
        ) : (
          <>
            <span><i className="cy-key cy-key-estrogen" />Estrogen</span>
            <span><i className="cy-key cy-key-progesterone" />Progesterone</span>
            <span><i className="cy-key cy-key-lh" />LH</span>
          </>
        )}
        {day && <span><i className="cy-key cy-key-today" />Today</span>}
      </figcaption>
    </figure>
  );
}

// ── One phase, as a card: what to expect, and what helps ──
function PhaseCard({ id, now, open, onToggle, maybe, extraFoods = [] }) {
  const p = phaseInfo(id);
  const foods = [...p.foods, ...extraFoods];
  return (
    <div className={`cy-phase${open ? ' is-open' : ''}${now ? ' is-now' : ''}`} style={{ '--ph': p.color }}>
      <button type="button" className="cy-phase-head" onClick={onToggle} aria-expanded={open}>
        <span className="cy-phase-dot" aria-hidden="true" />
        <span className="cy-phase-name">{p.full}</span>
        {now && <span className="cy-phase-now">{maybe ? 'Maybe here' : 'You are here'}</span>}
        <span className="cy-phase-arrow" aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="cy-phase-body">
          <p className="cy-expect">{p.expect}</p>
          <div className="cy-rows">
            <div className="cy-row"><BodyIcon name="heart" size={19} /><div><b>Mood</b><span>{p.mood}</span></div></div>
            <div className="cy-row"><BodyIcon name="bolt" size={19} /><div><b>Energy</b><span>{p.energy}</span></div></div>
            <div className="cy-row"><BodyIcon name="strength" size={19} /><div><b>Workout</b><span className="cy-chips">{p.workout.map(w => <em key={w}>{w}</em>)}</span></div></div>
            <div className="cy-row"><BodyIcon name="face" size={19} /><div><b>Skin</b><span>{p.skin}</span></div></div>
          </div>
          <div className="cy-food-title"><BodyIcon name="bowl" size={17} /> Whole foods that help</div>
          <ul className="cy-foods">
            {foods.map(([food, why]) => (
              <li key={food}><b>{food}</b><span>{why}</span></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Setup({ onSave, pack }) {
  const [start, setStart] = useState('');
  const [len, setLen] = useState('');
  const [plen, setPlen] = useState('');
  const max = dayKey();
  return (
    <form className="cy-setup" onSubmit={e => { e.preventDefault(); if (start) onSave({ start, len, plen }); }}>
      <label>
        <span>{pack ? 'First day of this pack' : 'First day of your last period'}</span>
        <input type="date" value={start} max={max} onChange={e => setStart(e.target.value)} required />
      </label>
      {!pack && <div className="cy-setup-two">
        <label>
          <span>Usual cycle (days)</span>
          <input type="number" inputMode="numeric" min="21" max="45" value={len} onChange={e => setLen(e.target.value)} placeholder="Don’t know" />
        </label>
        <label>
          <span>Usual period (days)</span>
          <input type="number" inputMode="numeric" min="2" max="10" value={plen} onChange={e => setPlen(e.target.value)} placeholder="Don’t know" />
        </label>
      </div>}
      <button type="submit" className="cy-btn cy-btn-main" disabled={!start}>Start</button>
    </form>
  );
}

// Birth control: one button per kind. Changing it keeps every date.
function MethodPicker({ c, update }) {
  const m = methodOf(c);
  const set = patch => update(cur => ({ ...cur, ...patch }));
  return (
    <div className="cy-method">
      <div className="cy-method-title">Birth control</div>
      <div className="cy-method-chips" role="radiogroup" aria-label="Birth control">
        {METHOD_ORDER.map(id => (
          <button key={id} type="button" role="radio" aria-checked={c.method === id}
            className={`cy-chip${c.method === id ? ' is-on' : ''}`} onClick={() => set({ method: id })}>
            {METHODS[id].label}
          </button>
        ))}
      </div>
      {(m.kind === 'pack' || m.pill) && (
        <div className="cy-method-opts">
          {m.kind === 'pack' && (
            <label className="cy-switch">
              <input type="checkbox" checked={!c.noBreak} onChange={e => set({ noBreak: !e.target.checked })} />
              <span>Break week (7 days off)</span>
            </label>
          )}
          {m.pill && (
            <label className="cy-switch">
              <input type="checkbox" checked={c.pillTick} onChange={e => set({ pillTick: e.target.checked })} />
              <span>Daily pill tick</span>
            </label>
          )}
        </div>
      )}
    </div>
  );
}

export default function Cycle() {
  const [c, update] = useCycle();
  const now = todayOf(c);
  const [openId, setOpenId] = useState(null);
  const [past, setPast] = useState('');
  const shown = openId ?? now?.phase ?? null;
  const key = dayKey();
  const method = methodOf(c);
  const kind = method.kind;
  const tookPill = Boolean(c.pills[key]);
  const togglePill = () => update(cur => {
    const pills = { ...cur.pills };
    if (pills[key]) delete pills[key]; else pills[key] = true;
    return { ...cur, pills };
  });
  const cardIds = kind === 'pack' ? (c.noBreak ? ['active'] : ['active', 'break'])
    : kind === 'steady' ? ['steady'] : PHASE_ORDER;
  const listName = kind === 'pack' ? 'Your packs' : kind === 'natural' ? 'Your periods' : 'Your bleeds';

  function save({ start, len, plen }) {
    update(cur => ({
      ...cur,
      starts: [...new Set([...cur.starts, start])].sort(),
      cycleLen: Number(len) >= 21 && Number(len) <= 45 ? Math.round(Number(len)) : cur.cycleLen,
      periodLen: Number(plen) >= 2 && Number(plen) <= 10 ? Math.round(Number(plen)) : cur.periodLen,
    }));
  }
  const started = () => update(cur => ({ ...cur, starts: [...new Set([...cur.starts, key])].sort() }));
  const ended = () => update(cur => {
    const last = [...cur.starts].filter(s => s <= key).pop();
    return last ? { ...cur, ends: { ...cur.ends, [last]: key } } : cur;
  });
  async function removeStart(s) {
    if (!(await ask(`Delete the period that started ${pretty(s)}? Your day and phase are worked out again without it.`, { yes: 'Delete', danger: true }))) return;
    update(cur => {
      const ends = { ...cur.ends };
      delete ends[s];
      return { ...cur, starts: cur.starts.filter(x => x !== s), ends };
    });
  }

  return (
    <div className="section cy">
      <div className="s-header">
        <div className="s-tag">Your month</div>
        <h2 className="s-title">Cy<em>cle</em></h2>
      </div>

      <MethodPicker c={c} update={update} />

      {!now ? (
        <Setup onSave={save} pack={kind === 'pack'} />
      ) : (
        <>
          <div className="cy-today" style={{ '--ph': phaseInfo(now.phase).color }}>
            {kind === 'steady' ? (
              <>
                <div className="cy-today-day cy-today-word">Steady</div>
                <div className="cy-today-phase">{method.label} · no monthly phases</div>
                <div className="cy-today-next">
                  {now.last ? `Last bleed: ${pretty(now.last)} · ${now.day - 1 === 0 ? 'today' : `${now.day - 1} ${now.day - 1 === 1 ? 'day' : 'days'} ago`}` : 'Log a bleed when one comes.'}
                </div>
              </>
            ) : kind === 'pack' ? (
              <>
                <div className="cy-today-day">Pill day {now.day}</div>
                <div className="cy-today-phase">{phaseInfo(now.phase).full}</div>
                <div className="cy-today-next">
                  {now.breakIn != null
                    ? `Break week in ${now.breakIn} ${now.breakIn === 1 ? 'day' : 'days'}`
                    : `New pack in ${now.packIn} ${now.packIn === 1 ? 'day' : 'days'}`}
                </div>
              </>
            ) : (
              <>
                <div className="cy-today-day">Day {now.day}</div>
                <div className="cy-today-phase">{PHASES[now.phase].full}{now.maybe ? ' · maybe' : ''}</div>
                <div className="cy-today-next">
                  {now.late
                    ? `${now.maybe ? 'Bleed' : 'Period'} is ${now.day - now.len} ${now.day - now.len === 1 ? 'day' : 'days'} later than usual`
                    : now.inDays === 0 ? 'Next period: about today' : `Next period: about ${pretty(now.next)} · in ${now.inDays} ${now.inDays === 1 ? 'day' : 'days'}`}
                </div>
              </>
            )}
            {method.note && <div className="cy-today-note">{method.note}</div>}
            <div className="cy-today-btns">
              {kind === 'pack'
                ? <button type="button" className="cy-btn" onClick={started}>New pack started today</button>
                : now.bleeding && !now.ended
                  ? <button type="button" className="cy-btn cy-btn-main" onClick={ended}>{kind === 'natural' ? 'Period' : 'Bleeding'} ended today</button>
                  : <button type="button" className="cy-btn cy-btn-main" onClick={started}>{kind === 'natural' ? 'Period' : 'Bleeding'} started today</button>}
              {method.pill && c.pillTick && (
                <button type="button" className={`cy-btn cy-pill${tookPill ? ' is-on' : ''}`} onClick={togglePill} aria-pressed={tookPill}>
                  {tookPill ? '✓ Pill taken' : 'Pill taken today'}
                </button>
              )}
            </div>
          </div>

          <CycleChart
            kind={kind === 'maybe' ? 'natural' : kind}
            noBreak={c.noBreak}
            len={now.len || PACK}
            plen={now.plen || 5}
            day={now.late || !now.day ? null : now.day}
          />
          {kind === 'maybe' && <p className="cy-small cy-chart-note">Shown as if you ovulate. You may not.</p>}

          <div className="cy-phases">
            {cardIds.map(id => (
              <PhaseCard
                key={id} id={id} now={now.phase === id} maybe={now.maybe}
                extraFoods={id === 'steady' && c.method === 'injection' ? INJECTION_FOODS : []}
                open={shown === id} onToggle={() => setOpenId(shown === id ? '' : id)}
              />
            ))}
          </div>

          <div className="bk-tips">
            <div className="bk-tips-line"><span>{listName}</span></div>
            <ul className="cy-history">
              {[...c.starts].reverse().slice(0, 12).map(s => (
                <li key={s}>
                  <span className="cy-hist-dot" aria-hidden="true" />
                  <span className="cy-hist-date">{pretty(s)}{c.ends[s] ? ` – ${pretty(c.ends[s])}` : ''}</span>
                  <span className="cy-hist-len">{c.ends[s] ? `${daysBetween(s, c.ends[s]) + 1} days` : ''}</span>
                  <button type="button" className="cy-hist-del" onClick={() => removeStart(s)} aria-label={`Delete the period that started ${pretty(s)}`}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2h9.2L17.5 7" /></svg>
                  </button>
                </li>
              ))}
            </ul>
            <form className="cy-add-past" onSubmit={e => { e.preventDefault(); if (past) { save({ start: past }); setPast(''); } }}>
              <input type="date" value={past} max={key} onChange={e => setPast(e.target.value)} aria-label="Add an earlier period start" />
              <button type="submit" className="cy-btn" disabled={!past}>{kind === 'pack' ? 'Add a past pack' : kind === 'natural' ? 'Add a past period' : 'Add a past bleed'}</button>
            </form>
            <p className="cy-small">
              {kind === 'pack' ? `${c.noBreak ? '28 pill days in a row' : '21 pill days, then 7 days off'}.`
                : kind === 'steady' ? ''
                : `Cycle ${now.len} days${now.lenFrom === 'yours' ? ', from your periods' : now.lenFrom === 'typed' ? ', as you typed' : ', until it learns yours'} · period ${now.plen} days.`}
              {' '}Dates are estimates, not birth control.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
