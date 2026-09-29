// Goddess Plan — home-screen widget for iPhone, run by the free Scriptable app.
//
// Shows three things: today's workout (and whether it is done), the count
// toward 1,000 workouts, and the calories eaten today against 1,000.
//
// Setup: paste this whole file into a new Scriptable script named
// "Goddess Plan", add a Scriptable widget (medium size works best), choose this
// script, and type the sync code (GP-…) into the widget's Parameter box.
//
// Numbers only: her logo is already on the app icon next to it.
//
// It reads the same cloud copy the app syncs to — read only, it never writes.
// iOS decides when widgets refresh (roughly every 15–30 minutes), so a tick
// made in the app shows up on the next refresh, not instantly.
//
// Today's workout names are copied from src/data/workouts.js. If the weekly
// plan changes, change PLAN below to match.

const APP_URL = 'https://goddess-plan.vercel.app';
const FIRESTORE = 'https://firestore.googleapis.com/v1/projects/goddess-plan/databases/(default)/documents/sync/';
const API_KEY = 'AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems';
const WORKOUT_GOAL = 1000;
const CALORIE_TARGET = 1000;

// Monday first, like the app.
const PLAN = [
  { emoji: '🍑', name: 'Glutes A' },
  { emoji: '🧘', name: 'Pilates or Yoga' },
  { emoji: '💪', name: 'Upper Body & Core' },
  { emoji: '🏃', name: 'Zone 2 Run' },
  { emoji: '✨', name: 'Glutes B' },
  { emoji: '🌿', name: 'Gentle Pilates or Yoga' },
  { emoji: '🏊', name: 'Swimming' },
];

const COLORS = {
  bg: '#07040f', gold: '#f0cc60', rose: '#ff5c9d', text: '#f8eed4', soft: '#c090b8', mint: '#6ee7c8', track: '#2a1a33',
};

const pad = n => String(n).padStart(2, '0');
// Local date, like the app — never the UTC date.
const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

function parseJSON(s) {
  try { return JSON.parse(s); } catch (e) { return null; }
}

// Everything the widget shows, worked out from the synced copy. Kept apart
// from the drawing so it can be checked on its own.
function summarize(data, now) {
  const today = dayKey(now);
  const js = now.getDay();
  const plan = PLAN[js === 0 ? 6 : js - 1];

  const workouts = parseJSON(data.gp_workouts) || {};
  const days = workouts.days || {};
  const total = Object.keys(days).length;

  const log = parseJSON(data.gp_meal_log) || {};
  const entries = (log.days && log.days[today]) || [];
  const cal = entries
    .filter(e => e && typeof e.cal === 'number' && e.cal > 0)
    .reduce((sum, e) => sum + e.cal, 0);

  return {
    plan,
    doneToday: Boolean(days[today]),
    total,
    pct: Math.round((Math.min(total, WORKOUT_GOAL) / WORKOUT_GOAL) * 1000) / 10,
    cal,
  };
}

// Firestore sends each field wrapped in its type; the app stores every key
// as a string of JSON.
function unwrap(doc) {
  const fields = doc && doc.fields && doc.fields.data && doc.fields.data.mapValue && doc.fields.data.mapValue.fields;
  const out = {};
  for (const [k, v] of Object.entries(fields || {})) {
    if (v && typeof v.stringValue === 'string') out[k] = v.stringValue;
  }
  return out;
}

async function load(code) {
  const req = new Request(`${FIRESTORE}${encodeURIComponent(code)}?key=${API_KEY}`);
  const doc = await req.loadJSON();
  if (doc && doc.error) {
    const err = new Error(doc.error.message || 'Could not read');
    err.notFound = doc.error.code === 404;
    throw err;
  }
  return unwrap(doc);
}

function bar(widget, fraction, color) {
  const W = 130, H = 6;
  const ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  const track = new Path();
  track.addRoundedRect(new Rect(0, 0, W, H), 3, 3);
  ctx.addPath(track);
  ctx.setFillColor(new Color(COLORS.track));
  ctx.fillPath();
  const w = Math.max(fraction > 0 ? H : 0, Math.min(1, fraction) * W);
  if (w > 0) {
    const fill = new Path();
    fill.addRoundedRect(new Rect(0, 0, w, H), 3, 3);
    ctx.addPath(fill);
    ctx.setFillColor(new Color(color));
    ctx.fillPath();
  }
  const img = widget.addImage(ctx.getImage());
  img.imageSize = new Size(W, H);
}

function line(stack, text, size, color, bold) {
  const t = stack.addText(text);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = new Color(color);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.7;
  return t;
}

function build(s) {
  const w = new ListWidget();
  w.backgroundColor = new Color(COLORS.bg);
  w.url = APP_URL;
  w.setPadding(12, 14, 12, 14);
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);
  const col = w;

  line(col, `${s.plan.emoji} ${s.plan.name}`, 14, COLORS.text, true);
  line(col, s.doneToday ? '✓ Done today' : 'Not done yet', 11, s.doneToday ? COLORS.mint : COLORS.soft, false);
  col.addSpacer(8);

  line(col, `🏆 ${s.total.toLocaleString('en-US')} / 1,000`, 13, COLORS.gold, true);
  bar(col, s.total / WORKOUT_GOAL, COLORS.gold);
  col.addSpacer(8);

  line(col, `🔥 ${s.cal.toLocaleString('en-US')} / 1,000 cal`, 13, s.cal > CALORIE_TARGET ? COLORS.rose : COLORS.text, true);
  bar(col, s.cal / CALORIE_TARGET, s.cal > CALORIE_TARGET ? COLORS.rose : COLORS.mint);
  return w;
}

function message(text) {
  const w = new ListWidget();
  w.backgroundColor = new Color(COLORS.bg);
  w.url = APP_URL;
  line(w, '🌸 Goddess Plan', 14, COLORS.gold, true);
  w.addSpacer(6);
  const t = line(w, text, 12, COLORS.soft, false);
  t.lineLimit = 4;
  return w;
}

async function main() {
  const code = String(args.widgetParameter || '').trim().toUpperCase();
  let widget;
  if (!/^GP-[A-Z2-9]{9,}$/.test(code)) {
    widget = message('Long-press this widget → Edit Widget → type your sync code (GP-…) in Parameter.');
  } else {
    try {
      widget = build(summarize(await load(code), new Date()));
    } catch (e) {
      widget = message(e.notFound
        ? 'That sync code was not found. Check it in the app under the 🌸 flower.'
        : 'Could not reach your plan. It will try again soon.');
    }
  }
  if (config.runsInWidget) Script.setWidget(widget);
  else await widget.presentMedium();
  Script.complete();
}

// If anything unexpected breaks, say what on the widget itself, so the exact
// words can be read off the home screen.
try {
  await main();
} catch (e) {
  const w = message(`Something went wrong: ${e && e.message ? e.message : e}`);
  if (config.runsInWidget) Script.setWidget(w);
  else await w.presentMedium();
  Script.complete();
}
