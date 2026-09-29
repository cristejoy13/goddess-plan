// Goddess Plan widget for iPhone. Runs in the free Scriptable app.
// Shows today's workout, the count toward 1,000 workouts, and calories today.
// Put the sync code (GP-...) in the widget's Parameter box.
//
// Written in the plainest JavaScript on purpose: no arrow functions, no
// template strings, no special symbols in the code. Copying through a phone
// can change characters like those, and one changed character stops the
// whole script. Read only: it never writes to her data.
//
// Today's workout names are copied from src/data/workouts.js. If the weekly
// plan changes, change PLAN below to match.

var APP_URL = "https://goddess-plan.vercel.app";
var FIRESTORE = "https://firestore.googleapis.com/v1/projects/goddess-plan/databases/(default)/documents/sync/";
var API_KEY = "AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems";
var GOAL = 1000;

// Monday first, like the app.
var PLAN = [
  "Glutes A",
  "Pilates or Yoga",
  "Upper Body and Core",
  "Zone 2 Run",
  "Glutes B",
  "Gentle Pilates or Yoga",
  "Swimming"
];

var BG = "#07040f";
var GOLD = "#f0cc60";
var ROSE = "#ff5c9d";
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

// Everything the widget shows, worked out from the synced copy.
function summarize(data, now) {
  var today = dayKey(now);
  var js = now.getDay();
  var name = PLAN[js === 0 ? 6 : js - 1];

  var workouts = parseJSON(data.gp_workouts) || {};
  var days = workouts.days || {};
  var total = Object.keys(days).length;

  var log = parseJSON(data.gp_meal_log) || {};
  var entries = (log.days && log.days[today]) || [];
  var cal = 0;
  for (var i = 0; i < entries.length; i++) {
    var e = entries[i];
    if (e && typeof e.cal === "number" && e.cal > 0) cal += e.cal;
  }

  return { name: name, done: Boolean(days[today]), total: total, cal: cal };
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
  var req = new Request(FIRESTORE + encodeURIComponent(code) + "?key=" + API_KEY);
  var doc = await req.loadJSON();
  if (doc && doc.error) {
    var err = new Error(doc.error.message || "Could not read");
    err.notFound = doc.error.code === 404;
    throw err;
  }
  return unwrap(doc);
}

function bar(widget, fraction, color) {
  var W = 130;
  var H = 6;
  var ctx = new DrawContext();
  ctx.size = new Size(W, H);
  ctx.opaque = false;
  ctx.respectScreenScale = true;
  var track = new Path();
  track.addRoundedRect(new Rect(0, 0, W, H), 3, 3);
  ctx.addPath(track);
  ctx.setFillColor(new Color(TRACK));
  ctx.fillPath();
  var w = Math.min(1, fraction) * W;
  if (fraction > 0 && w < H) w = H;
  if (w > 0) {
    var fill = new Path();
    fill.addRoundedRect(new Rect(0, 0, w, H), 3, 3);
    ctx.addPath(fill);
    ctx.setFillColor(new Color(color));
    ctx.fillPath();
  }
  var img = widget.addImage(ctx.getImage());
  img.imageSize = new Size(W, H);
}

function line(stack, text, size, color, bold) {
  var t = stack.addText(text);
  t.font = bold ? Font.boldSystemFont(size) : Font.systemFont(size);
  t.textColor = new Color(color);
  t.lineLimit = 1;
  t.minimumScaleFactor = 0.7;
  return t;
}

function build(s) {
  var w = new ListWidget();
  w.backgroundColor = new Color(BG);
  w.url = APP_URL;
  w.setPadding(12, 14, 12, 14);
  w.refreshAfterDate = new Date(Date.now() + 15 * 60 * 1000);

  line(w, s.name, 15, TEXT, true);
  line(w, s.done ? "Done today" : "Not done yet", 11, s.done ? MINT : SOFT, false);
  w.addSpacer(8);

  line(w, withCommas(s.total) + " / 1,000 workouts", 13, GOLD, true);
  bar(w, s.total / GOAL, GOLD);
  w.addSpacer(8);

  var over = s.cal > GOAL;
  line(w, withCommas(s.cal) + " / 1,000 cal today", 13, over ? ROSE : TEXT, true);
  bar(w, s.cal / GOAL, over ? ROSE : MINT);
  return w;
}

function message(text) {
  var w = new ListWidget();
  w.backgroundColor = new Color(BG);
  w.url = APP_URL;
  line(w, "Goddess Plan", 14, GOLD, true);
  w.addSpacer(6);
  var t = line(w, text, 12, SOFT, false);
  t.lineLimit = 4;
  return w;
}

async function main() {
  var code = String(args.widgetParameter || "").trim().toUpperCase();
  var widget;
  if (!/^GP-[A-Z2-9]{9,}$/.test(code)) {
    widget = message("Hold this widget, choose Edit Widget, and put your sync code (GP-...) in Parameter.");
  } else {
    try {
      widget = build(summarize(await load(code), new Date()));
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
