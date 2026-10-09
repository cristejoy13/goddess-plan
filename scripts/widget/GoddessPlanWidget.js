// VERSION 7 - Goddess Plan widget, 29 Sep 2026 (tick box, no calories)
// Goddess Plan widget for iPhone. Runs in the free Scriptable app.
// Shows today's workout, a box to tick it done, and the count toward 1,000.
// Put the sync code (GP-...) in the widget's Parameter box.
//
// Ticking the box opens Scriptable for a moment and adds today's workout to
// her record in the cloud, the same record the app uses. The app picks it up
// on its next sync, and the 1,000 count goes up there too. The widget never
// removes a workout; taking one off stays in the app, where it asks first.
//
// Written in the plainest JavaScript on purpose: no arrow functions, no
// template strings, and every symbol spelled as a \u code, so copying cannot
// change a character. Keep it that way.
//
// PLAN is filled in from src/data/workouts.js by build-widget.mjs.
// Do not edit it by hand; run: node scripts/widget/build-widget.mjs

var APP_URL = "https://goddess-plan.vercel.app";
var DOC_URL = "https://firestore.googleapis.com/v1/projects/goddess-plan/databases/(default)/documents/sync/";
var API_KEY = "AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems";
var GOAL = 1000;

// PLAN-START
var PLAN = [
  { day: "Monday", emoji: "\ud83c\udf51", name: "Glutes A", title: "Hip Thrust \u00b7 RDL \u00b7 Bulgarian \u00b7 Abs" },
  { day: "Tuesday", emoji: "\ud83e\uddd8", name: "Pilates or Yoga", title: "One video \u00b7 Rope or Zone 2" },
  { day: "Wednesday", emoji: "\ud83d\udcaa", name: "Upper Body & Core", title: "Pilates by Izzy \u00b7 Rope or Zone 2" },
  { day: "Thursday", emoji: "\u2728", name: "Glutes B", title: "Kickback \u00b7 Abduction \u00b7 Step-Up \u00b7 Abs" },
  { day: "Friday", emoji: "\ud83e\uddd8", name: "Pilates or Yoga", title: "One video \u00b7 Rope or Zone 2" },
  { day: "Saturday", emoji: "\ud83c\udf51", name: "Glutes C", title: "Squat \u00b7 Side Squat \u00b7 Lunge \u00b7 Abs" },
  { day: "Sunday", emoji: "\ud83d\udeb2", name: "Biking & Swim", title: "Bike \u00b7 Swim at 5 PM" }
];
// PLAN-END

var BG = "#07040f";
var CARD = "#1a0f24";
var GOLD = "#f0cc60";
var TEXT = "#f8eed4";
var SOFT = "#c090b8";
var MINT = "#6ee7c8";
var TRACK = "#2a1a33";

function two(n) {
  return n < 10 ? "0" + n : "" + n;
}

// Local date, like the app, never the UTC date.
function dayKey(d) {
  return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
}

function parseJSON(s) {
  try {
    return JSON.parse(s);
  } catch (err) {
    return null;
  }
}

function withCommas(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function todaysPlan(now) {
  var js = now.getDay();
  return PLAN[js === 0 ? 6 : js - 1];
}

// The workout record exactly as the app keeps it:
// { days: { "YYYY-MM-DD": { type, duration, notes, createdAt, updatedAt } },
//   deleted: { "YYYY-MM-DD": iso } }
function readWorkouts(data) {
  var w = parseJSON(data.gp_workouts) || {};
  return { days: w.days || {}, deleted: w.deleted || {} };
}

// Workout number for a day: its place in date order, as in the app.
function numberOf(days, key) {
  var n = 0;
  var keys = Object.keys(days);
  for (var i = 0; i < keys.length; i++) if (keys[i] <= key) n++;
  return n;
}

// ---- cloud ----

function docUrl(code) {
  return DOC_URL + encodeURIComponent(code) + "?key=" + API_KEY;
}

// Firestore wraps each field in its type; the app stores every key as a
// string of JSON.
function unwrap(doc) {
  var out = {};
  var fields = doc && doc.fields && doc.fields.data && doc.fields.data.mapValue && doc.fields.data.mapValue.fields;
  if (!fields) return out;
  var keys = Object.keys(fields);
  for (var i = 0; i < keys.length; i++) {
    var v = fields[keys[i]];
    if (v && typeof v.stringValue === "string") out[keys[i]] = v.stringValue;
  }
  return out;
}

async function load(code) {
  var doc = await new Request(docUrl(code)).loadJSON();
  if (doc && doc.error) {
    var err = new Error(doc.error.message || "Could not read");
    err.notFound = doc.error.code === 404;
    throw err;
  }
  return unwrap(doc);
}

// Add today to the record. Only the workout record and its sync stamp are
// written; everything else in her cloud copy is left exactly as it is. The
// app merges this record day by day, so a tick here and a tick on another
// gadget can never undo each other.
async function tickToday(code, now) {
  var data = await load(code);
  var rec = readWorkouts(data);
  var key = dayKey(now);
  if (rec.days[key]) return { n: numberOf(rec.days, key), already: true };

  var iso = now.toISOString();
  var plan = todaysPlan(now);
  rec.days[key] = { type: plan.name, duration: null, notes: "", createdAt: iso, updatedAt: iso };
  delete rec.deleted[key];

  var body = {
    fields: {
      data: { mapValue: { fields: { gp_workouts: { stringValue: JSON.stringify(rec) } } } },
      meta: { mapValue: { fields: { gp_workouts: { integerValue: String(now.getTime()) } } } }
    }
  };
  var req = new Request(docUrl(code) + "&updateMask.fieldPaths=data.gp_workouts&updateMask.fieldPaths=meta.gp_workouts");
  req.method = "PATCH";
  req.headers = { "Content-Type": "application/json" };
  req.body = JSON.stringify(body);
  var res = await req.loadJSON();
  if (res && res.error) throw new Error(res.error.message || "Could not save");
  return { n: numberOf(rec.days, key), already: false };
}

// ---- drawing ----

function bar(stack, fraction) {
  var W = 260;
  var H = 7;
  var ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  var track = new Path();
  track.addRoundedRect(new Rect(0, 0, W, H), 3.5, 3.5);
  ctx.addPath(track);
  ctx.setFillColor(new Color(TRACK));
  ctx.fillPath();
  var w = Math.min(1, fraction) * W;
  if (fraction > 0 && w < H) w = H;
  if (w > 0) {
    var fill = new Path();
    fill.addRoundedRect(new Rect(0, 0, w, H), 3.5, 3.5);
    ctx.addPath(fill);
    ctx.setFillColor(new Color(GOLD));
    ctx.fillPath();
  }
  var img = stack.addImage(ctx.getImage());
  img.imageSize = new Size(W, H);
}

function text(stack, s, size, color, bold) {
  var t = stack.addText(s);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = new Color(color);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.6;
  return t;
}

function tickUrl(code) {
  return "scriptable:///run/" + encodeURIComponent(Script.name()) + "?tick=1&code=" + encodeURIComponent(code);
}

function build(s, code, family) {
  var w = new ListWidget();
  w.backgroundColor = new Color(BG);
  w.setPadding(14, 16, 14, 16);
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);
  // A small widget can only have one tap target: before the tick it ticks,
  // after it opens the app. A medium one has the box as its own button.
  w.url = family === "small" && !s.done ? tickUrl(code) : APP_URL;

  var top = w.addStack();
  top.centerAlignContent();

  var info = top.addStack();
  info.layoutVertically();
  text(info, s.plan.day.toUpperCase(), 10, GOLD, true);
  text(info, s.plan.emoji + " " + s.plan.name, 16, TEXT, true);
  text(info, s.plan.title, 12, SOFT, false);

  top.addSpacer();

  var box = top.addStack();
  box.layoutVertically();
  box.centerAlignContent();
  box.size = new Size(64, 64);
  box.cornerRadius = 14;
  box.backgroundColor = new Color(s.done ? "#12342d" : CARD);
  box.borderColor = new Color(s.done ? MINT : GOLD);
  box.borderWidth = 2;
  if (family !== "small" && !s.done) box.url = tickUrl(code);
  var mark = box.addText(s.done ? "\u2713" : " ");
  mark.font = Font.boldSystemFont(30);
  mark.textColor = new Color(MINT);
  mark.centerAlignText();
  var label = box.addText(s.done ? "Done" : "Tap");
  label.font = Font.systemFont(10);
  label.textColor = new Color(s.done ? MINT : GOLD);
  label.centerAlignText();

  w.addSpacer();

  text(w, "\ud83c\udfc6 " + withCommas(s.total) + " / 1,000 workouts", 13, GOLD, true);
  w.addSpacer(5);
  bar(w, s.total / GOAL);
  return w;
}

function message(s) {
  var w = new ListWidget();
  w.backgroundColor = new Color(BG);
  w.url = APP_URL;
  text(w, "Goddess Plan", 14, GOLD, true);
  w.addSpacer(6);
  var t = text(w, s, 12, SOFT, false);
  t.lineLimit = 4;
  return w;
}

// What the widget shows, from the cloud copy. For ten minutes after a tick on
// this phone, the local note keeps the box ticked in case the cloud read is
// from just before it. After that the cloud decides, so a workout taken back
// off in the app is shown as not done.
function summarize(data, now) {
  var rec = readWorkouts(data);
  var key = dayKey(now);
  var total = Object.keys(rec.days).length;
  var done = Boolean(rec.days[key]);
  if (!done && localTickDay(now) === key) {
    done = true;
    total += 1;
  }
  return { plan: todaysPlan(now), done: done, total: total };
}

// ---- a note on this phone of the last day ticked here ----

function notePath() {
  var fm = FileManager.local();
  return fm.joinPath(fm.documentsDirectory(), "goddess-plan-ticked.txt");
}

function localTickDay(now) {
  try {
    var fm = FileManager.local();
    if (!fm.fileExists(notePath())) return "";
    var parts = fm.readString(notePath()).split("|");
    var at = Number(parts[1]) || 0;
    return now.getTime() - at < 10 * 60 * 1000 ? parts[0] : "";
  } catch (err) {
    return "";
  }
}

function saveTickDay(key, now) {
  try {
    FileManager.local().writeString(notePath(), key + "|" + now.getTime());
  } catch (err) {
    // The note only speeds up the widget; the cloud already has the tick.
  }
}

// ---- running ----

function codeFrom(s) {
  var code = String(s || "").trim().toUpperCase();
  return /^GP-[A-Z2-9]{9,}$/.test(code) ? code : "";
}

async function say(title, body) {
  var a = new Alert();
  a.title = title;
  a.message = body;
  a.addAction("OK");
  await a.presentAlert();
}

async function runTick(code) {
  var now = new Date();
  try {
    var r = await tickToday(code, now);
    saveTickDay(dayKey(now), now);
    if (r.already) await say("Already counted", "Today is Workout #" + withCommas(r.n) + ". Swipe up to go home.");
    else await say("Workout #" + withCommas(r.n) + " complete! \ud83d\udcaa", "It is in your 1,000 now. Swipe up to go home.");
  } catch (err) {
    await say("Not saved", "Could not reach your plan. Check your internet and tap the box again.");
  }
}

async function main() {
  var q = args.queryParameters || {};
  if (q.tick && codeFrom(q.code)) {
    await runTick(codeFrom(q.code));
    Script.complete();
    return;
  }

  var code = codeFrom(args.widgetParameter);
  var widget;
  if (!code) {
    widget = message("Hold this widget, choose Edit Widget, and put your sync code (GP-...) in Parameter.");
  } else {
    try {
      widget = build(summarize(await load(code), new Date()), code, config.widgetFamily);
    } catch (err) {
      widget = message(err.notFound
        ? "That sync code was not found. Check it in the app under the flower."
        : "Could not reach your plan. It will try again soon.");
    }
  }
  if (config.runsInWidget) Script.setWidget(widget);
  else await widget.presentMedium();
  Script.complete();
}

// If anything unexpected breaks, show the reason on the widget itself.
try {
  await main();
} catch (err) {
  var fail = message("Something went wrong: " + (err && err.message ? err.message : err));
  if (config.runsInWidget) Script.setWidget(fail);
  else await fail.presentMedium();
  Script.complete();
}
