import { useState } from 'react';

// ─── GOAL CHARTS ───────────────────────────────────────────────────────────
// A goal she writes with a number in it gets a running total climbing toward
// its target, inside G. It starts empty and draws only what she has logged.

const W = 320, H = 170, PAD_L = 38, PAD_R = 10, PAD_T = 16, PAD_B = 24;
const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const pad = n => String(n).padStart(2, '0');
const dayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseDay = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const shortDate = key => parseDay(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const fmt = n => (Math.round(n * 100) / 100).toLocaleString('en-US');

function rangeFor(view, offset, firstKey) {
  const now = new Date();
  if (view === 'month') {
    const a = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const b = new Date(a.getFullYear(), a.getMonth() + 1, 0);
    return { from: dayKey(a), to: dayKey(b), label: a.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) };
  }
  if (view === 'year') {
    const y = now.getFullYear() + offset;
    return { from: `${y}-01-01`, to: `${y}-12-31`, label: String(y) };
  }
  const first = firstKey || dayKey(now);
  const end = parseDay(first); end.setDate(end.getDate() + 29);
  return { from: first, to: dayKey(end > now ? end : now), label: 'All time' };
}

function ticksFor(view, from, to) {
  if (view === 'year') return MONTH_LETTERS.map((m, i) => ({ key: `${from.slice(0, 4)}-${pad(i + 1)}-01`, text: m }));
  if (view === 'month') return [1, 8, 15, 22, 29].map(n => ({ key: `${from.slice(0, 8)}${pad(n)}`, text: String(n) }));
  return [{ key: from, text: shortDate(from), anchor: 'start' }, { key: to, text: shortDate(to), anchor: 'end' }];
}

function ViewTabs({ view, setView, offset, setOffset, label, summary }) {
  return (
    <>
      <div className="wk-graph-tabs">
        {[['month', 'Month'], ['year', 'Year'], ['all', 'All time']].map(([v, t]) => (
          <button key={v} className={view === v ? 'active' : ''} onClick={() => { setView(v); setOffset(0); }}>{t}</button>
        ))}
      </div>
      <div className="wk-graph-nav">
        {view !== 'all' ? <button aria-label="Earlier" onClick={() => setOffset(o => o - 1)}>‹</button> : <span />}
        <span className="wk-graph-label">{label} · <b>{summary}</b></span>
        {view !== 'all'
          ? <button aria-label="Later" disabled={offset >= 0} onClick={() => setOffset(o => Math.min(0, o + 1))}>›</button>
          : <span />}
      </div>
    </>
  );
}

// entries: [{ date: 'YYYY-MM-DD', amount }] in any order.
// milestones (optional): month and year views aim at the next one, so a good
// month climbs visibly instead of creeping along the floor of the full target.
export function ProgressChart({ entries, target, milestones, unit = '', empty = 'Your line starts with the first one you add.' }) {
  const [view, setView] = useState('month');
  const [offset, setOffset] = useState(0);
  const sorted = [...entries].sort((a, b) => (a.date < b.date ? -1 : 1));
  const { from, to, label } = rangeFor(view, offset, sorted[0]?.date);

  let before = 0;
  const byDay = new Map();
  for (const e of sorted) {
    if (e.date < from) before += e.amount;
    else if (e.date <= to) byDay.set(e.date, (byDay.get(e.date) || 0) + e.amount);
  }
  const points = [];
  let run = before;
  for (const [date, amt] of byDay) { run += amt; points.push({ date, total: run }); }
  const endTotal = run;
  const top = view === 'all' || !milestones
    ? Math.max(target, endTotal)
    : Math.max(milestones.find(m => m > endTotal) || target, endTotal);

  const t0 = parseDay(from).getTime(), span = Math.max(1, parseDay(to).getTime() - t0);
  const x = key => PAD_L + ((parseDay(key).getTime() - t0) / span) * (W - PAD_L - PAD_R);
  const y = v => PAD_T + (1 - v / top) * (H - PAD_T - PAD_B);
  const today = dayKey();
  const lineEnd = today < to ? (today < from ? from : today) : to;

  let d = `M${x(from)},${y(before)}`;
  let prev = before;
  for (const p of points) { d += ` L${x(p.date)},${y(prev)} L${x(p.date)},${y(p.total)}`; prev = p.total; }
  d += ` L${x(lineEnd)},${y(prev)}`;
  const area = `${d} L${x(lineEnd)},${y(0)} L${x(from)},${y(0)} Z`;
  const isGoal = top === target;
  const u = unit ? ` ${unit}` : '';

  return (
    <div className="wk-graph">
      <ViewTabs view={view} setView={setView} offset={offset} setOffset={setOffset} label={label}
        summary={view === 'all' ? `${fmt(endTotal)}${u} total` : `+${fmt(endTotal - before)}${u}`} />
      <svg className="wk-graph-svg" viewBox={`0 0 ${W} ${H}`} role="img"
        aria-label={`${fmt(endTotal)}${u} of ${fmt(target)} by the end of ${label}`}>
        <defs>
          <linearGradient id="goalFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--rose)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {(top >= 100 ? [0, top / 2] : [0]).map(v => (
          <g key={v}>
            <line className="wk-grid" x1={PAD_L} x2={W - PAD_R} y1={y(v)} y2={y(v)} />
            <text className="wk-axis" x={PAD_L - 5} y={y(v) + 3} textAnchor="end">{fmt(Math.round(v))}</text>
          </g>
        ))}
        <line className="wk-goal-line" x1={PAD_L} x2={W - PAD_R} y1={y(top)} y2={y(top)} />
        <text className="wk-goal-text" x={W - PAD_R} y={y(top) - 4} textAnchor="end">
          {isGoal ? `🏆 ${fmt(target)}` : `🏅 ${fmt(top)}`}
        </text>
        <text className="wk-axis" x={PAD_L - 5} y={y(top) + 3} textAnchor="end">{fmt(top)}</text>
        {today >= from && <path d={area} fill="url(#goalFill)" />}
        {today >= from && <path d={d} className="wk-line" />}
        {points.length <= 40 && points.map(p => (
          <circle key={p.date} className="wk-dot" cx={x(p.date)} cy={y(p.total)} r="2.6" />
        ))}
        {ticksFor(view, from, to).map(t => (
          <text key={t.key} className="wk-axis" x={x(t.key)} y={H - 7} textAnchor={t.anchor || 'middle'}>{t.text}</text>
        ))}
      </svg>
      {entries.length === 0 && <div className="wk-empty">{empty}</div>}
    </div>
  );
}
