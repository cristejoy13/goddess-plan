import { useState, useCallback, useMemo, useRef, useLayoutEffect, useEffect } from 'react';
import { useDictation, joinSpeech, showCursorAtEnd } from '../utils/dictation';
import { loadGarmin, garminBurnOn } from '../utils/garmin';
import { ideasFor, NUTRITION_NOTES, PREP_TIPS, DAY_RANGE } from '../data/mealIdeas';
import { isOwner, readProfile } from '../utils/userPlan';
import { shrinkPhoto, scanMeal, scanScale, describeItems, recall, remember, rememberFoods, rememberOwnNumbers, groqKeyReminder } from '../utils/mealScan';
import { ask } from '../utils/ask';
import Camera from './Camera';
import PhotoView from './PhotoView';
import MealDays from './MealDays';
import { dayTypeOf, chosenPlan, numOf, time24 } from '../data/mealDays';
import {
  dateKey, dateKeyOf, newEntryId, calTotals, byTime, loadLog, saveLog, parseCal,
  parseKg, formatKg, weightOn, setWeight, weekWeightAvg, MIN_KG, MAX_KG,
  parseBurn, burnOn, setBurn, MAX_BURN, MIN_BURN, AVERAGE_BURN,
  parseGoal, setGoal, weekStartKey, goalForWeek, calsLeft, MIN_GOAL, MAX_GOAL,
} from '../utils/mealLog';

// ─── MEAL ──────────────────────────────────────────────────────────────────
// The record of what she actually ate, day by day, as against the plan of what
// she is meant to eat. The plan lives in Workouts; this is the truth, and the
// two are deliberately separate — a record that quietly fills itself in with
// the plan would tell her nothing about whether she is really eating well.
//
// So nothing is ever written here except by her. A day she did not fill in
// reads as empty, not as a guess.
//
// The log is a month calendar because the question she actually asks is a
// month-shaped one: did I eat well THIS month? A list of lines cannot answer
// that; a grid with gaps in it answers it at a glance. The year and month both
// step backwards and forwards, so an old month is always reachable.

const DAY_LETTERS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ─── dates ─────────────────────────────────────────────────────────────────
// dateKey and the rest of the log's shape live in utils/mealLog.js now, shared
// with the meal plan in Workouts, which files a chosen meal straight into this
// record rather than making her type it twice.
const pad = n => String(n).padStart(2, '0');

function todayParts() {
  const n = new Date();
  return { y: n.getFullYear(), m: n.getMonth(), d: n.getDate() };
}

// Monday-first weeks, with the leading and trailing blanks the grid needs.
function monthWeeks(year, monthIdx) {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const firstDow = (new Date(year, monthIdx, 1).getDay() + 6) % 7;
  const weeks = [];
  let week = Array(7).fill(null);
  let day = 1;
  for (let d = firstDow; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
  weeks.push([...week]);
  while (day <= daysInMonth) {
    week = Array(7).fill(null);
    for (let d = 0; d < 7 && day <= daysInMonth; d++, day++) week[d] = day;
    weeks.push([...week]);
  }
  return weeks;
}

// The week's number on the Sunday square, in whichever currency the day
// squares are using.
//
// While a goal is set the day squares count DOWN — so the Sunday number counts
// down too, from seven days of the goal. One badge meaning "left" and the
// badge above it meaning "eaten", both unlabelled in the same square, would be
// two different facts wearing one face. With no goal there is nothing to count
// down from, so it stays the plain weekly total it has always been.
// Sunday's pink pill is always what she ATE that week, goal or no goal — she
// asked for it that way on 2026-09-25. The day pill above it already counts
// down from the goal, so the week pill does not need to as well.
// Sunday's number (her rule, 2026-10-08): for each day of the week ending
// that Sunday, her calorie goal for the week minus what she ate that day —
// the same "left" each day square shows — added up over the seven days. Only
// days with calories written down and a goal set count. Worked out from what
// is stored, so every past week shows it too.
// Changed again 2026-10-08, to her Garmin plan: each day's calorie deficit is
// what she burned — her own number, else her Garmin number, else her average
// (AVERAGE_BURN) — minus what she ate. It shows on every day square; Sunday
// shows the seven days added up. Only days with calories written down, and
// not future days, have one. Every past week is worked out the same way.
// Her average for her; for someone who signed up, the TDEE worked out from
// their answers.
function averageBurn(profile = readProfile()) {
  if (isOwner(profile)) return AVERAGE_BURN;
  return profile?.targets?.tdee || AVERAGE_BURN;
}

// Someone who signed up gets their daily calories from their answers until
// they set a goal for a week themselves.
function planGoal(profile = readProfile()) {
  return isOwner(profile) ? null : (profile?.targets?.calories ?? null);
}

// One short line under Garmin cal burned (2026-10-21), so she can see whether
// the number came from her watch or is her 1,400 average — and, if it is the
// average, when the watch last sent anything at all.
function watchNoteFor(garmin, key) {
  const b = garmin?.burns?.[key];
  const when = iso => { const d = new Date(iso); return Number.isNaN(d.getTime()) ? null : d; };
  if (garminBurnOn(garmin, key) != null) {
    const at = when(b.at);
    return at ? `From your watch · ${at.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}` : 'From your watch';
  }
  const last = Object.entries(garmin?.burns || {})
    .filter(([, v]) => typeof v?.cal === 'number' && v.cal > 0)
    .map(([, v]) => when(v.at)).filter(Boolean)
    .sort((x, y) => y - x)[0];
  if (!last) return 'Your average · nothing from your watch yet';
  return `Your average · watch last sent ${last.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' })}`;
}

function dayDeficit(state, garmin, key, todayKey = dateKeyOf()) {
  const t = calTotals(state.days?.[key] || []);
  if (!t.counted || key > todayKey) return null;
  const burned = burnOn(state, key) ?? garminBurnOn(garmin, key) ?? averageBurn();
  return burned - t.total;
}

// A kilo of body fat is about 7,700 calories. Her week deficits are added up
// in order from her first week with meals written down — a week where she ate
// more than she burned takes away — and each Sunday on which the running total
// reaches 7,700 is a kilo lost: that Sunday turns bright blue (pale red until 2026-10-23), and counting starts
// again, keeping whatever went past 7,700 so no effort is lost (2026-10-09).
const KG_FAT_CAL = 7700;

function kiloSundays(state, garmin, todayKey = dateKeyOf()) {
  const keys = Object.keys(state.days || {}).filter(k => calTotals(state.days[k]).counted).sort();
  const reached = new Set();
  if (!keys.length) return reached;
  const [y, m, d] = keys[0].split('-').map(Number);
  const first = new Date(y, m - 1, d);
  let monday = new Date(y, m - 1, d - ((first.getDay() + 6) % 7));
  let running = 0;
  // Weeks up to and including the one holding today.
  while (dateKeyOf(monday) <= todayKey) {
    for (let i = 0; i < 7; i += 1) {
      const def = dayDeficit(state, garmin, dateKeyOf(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i)), todayKey);
      if (def != null) running += def;
    }
    const sunday = dateKeyOf(new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6));
    while (running >= KG_FAT_CAL) {
      reached.add(sunday);
      running -= KG_FAT_CAL;
    }
    monday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
  }
  return reached;
}

function weekLostEnding(state, garmin, year, monthIdx, day) {
  let sum = 0;
  let counted = 0;
  for (let back = 6; back >= 0; back--) {
    const d = dayDeficit(state, garmin, dateKeyOf(new Date(year, monthIdx, day - back)));
    if (d == null) continue;
    sum += d;
    counted += 1;
  }
  return { value: sum, show: counted > 0, over: sum < 0 };
}

// "14:05" → "2:05 PM". She thinks in 12-hour clock, and the plan is written in
// it, so the record reads back the same way even though it is stored as 24-hour
// (which is what <input type="time"> gives and what sorts correctly).
function prettyTime(hhmm) {
  const [h, m] = String(hhmm || '').split(':');
  const hour = Number(h);
  if (!Number.isFinite(hour)) return '';
  const suffix = hour < 12 ? 'AM' : 'PM';
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m || '00'} ${suffix}`;
}

// "14–20 Sep", or "28 Sep – 4 Oct" when the week straddles two months. The
// goal editor is headed with this so it is never a question which seven days
// are about to change.
function weekLabelOf(mondayKey) {
  const [y, m, d] = mondayKey.split('-').map(Number);
  const mon = new Date(y, m - 1, d);
  const sun = new Date(y, m - 1, d + 6);
  const sm = MONTH_SHORT[mon.getMonth()];
  const em = MONTH_SHORT[sun.getMonth()];
  return sm === em
    ? `${mon.getDate()}–${sun.getDate()} ${em}`
    : `${mon.getDate()} ${sm} – ${sun.getDate()} ${em}`;
}

function nowTime() {
  const n = new Date();
  return `${pad(n.getHours())}:${pad(n.getMinutes())}`;
}

// ─── the add form ──────────────────────────────────────────────────────────
// The time comes filled in with the current time, so on the ordinary path —
// writing down the meal you just ate — she types the food and nothing else.
// It is still a real time box, so a meal written up later can be corrected by
// tapping it and spinning the wheel.
// The time of a new meal sits beside the date at the top of the day
// (2026-10-10), so the day panel holds it and hands it in. Editing a meal
// keeps its own time box inside the form.
// Protein, carbs and fat (2026-10-10). A meal's total for one of them is
// kept only when every food in it has that number — a total missing a food
// would read as complete and be wrong.
const MACROS = ['protein', 'carbs', 'fat', 'fiber', 'iron'];

// The day's nutrition as a small table (2026-10-16): grams eaten, a bar
// toward the day's aim, and the aim. Her own daily aims, set 2026-10-16:
// 70 g protein, 150 g carbs, 50 g fats, 25 g fiber. Iron added 2026-10-22:
// 18 mg a day, the amount for a woman her age.
const NUTRIENTS = [
  { k: 'protein', label: 'Protein', lo: 70,  hi: 70,  unit: 'g' },
  { k: 'carbs',   label: 'Carbs',   lo: 150, hi: 150, unit: 'g' },
  { k: 'fat',     label: 'Fats',    lo: 50,  hi: 50,  unit: 'g' },
  { k: 'fiber',   label: 'Fiber',   lo: 25,  hi: 25,  unit: 'g' },
  { k: 'iron',    label: 'Iron',    lo: 18,  hi: 18,  unit: 'mg' },
];
const r1 = n => Math.round(n * 10) / 10;
function nutrientSums(entries) {
  return Object.fromEntries(NUTRIENTS.map(({ k }) => {
    const has = entries.filter(e => typeof e[k] === 'number');
    return [k, has.length ? r1(has.reduce((s, e) => s + e[k], 0)) : null];
  }));
}
function NutrientCards({ entries }) {
  const sums = nutrientSums(entries);
  return (
    <ul className="nt-cards">
      {NUTRIENTS.map(({ k, label, lo, hi, unit }) => {
        const v = sums[k];
        const pct = v == null ? 0 : Math.min(100, (v / hi) * 100);
        const state = v == null ? '' : v < lo ? ' is-low' : v > hi * 1.15 ? ' is-over' : ' is-in';
        return (
          <li key={k} className={`nt-card nt-${k}${state}`}>
            <span className="nt-card-name"><span className="nt-dot" aria-hidden="true" />{label}</span>
            <b className="nt-card-num">{v == null ? '—' : `${v} ${unit}`}</b>
            <span className="nt-bar" aria-hidden="true"><span style={{ width: `${pct}%` }} /></span>
            <small className="nt-card-aim">of {lo === hi ? `${hi} ${unit}` : `${lo}–${hi} ${unit}`}</small>
          </li>
        );
      })}
    </ul>
  );
}
function macroTotals(items = []) {
  const out = {};
  for (const k of MACROS) {
    if (items.length && items.every(it => typeof it[k] === 'number')) {
      out[k] = Math.round(items.reduce((sum, it) => sum + it[k], 0) * 10) / 10;
    }
  }
  return out;
}

function MealForm({ initial, onSubmit, onCancel, time: dayTime, setTime: setDayTime }) {
  const [ownTime, setOwnTime] = useState(() => initial?.time || nowTime());
  const time = dayTime ?? ownTime;
  const setTime = setDayTime ?? setOwnTime;
  const [text, setText] = useState(initial?.text || '');
  const editing = Boolean(initial);
  // A saved meal's own numbers, to fix by hand (2026-10-25).
  const [own, setOwn] = useState(() => ({
    cal: initial?.cal != null ? String(initial.cal) : '',
    protein: typeof initial?.protein === 'number' ? String(initial.protein) : '',
    iron: typeof initial?.iron === 'number' ? String(initial.iron) : '',
  }));
  // Talk or type. Whatever is said is added after what is already in the box,
  // and shows as it is heard, so she can read it back and fix any word.
  const boxRef = useRef(null);
  const beforeTalkRef = useRef('');
  const [micNote, setMicNote] = useState('');
  // Three seconds of quiet ends the listening, and the calories are then
  // found by themselves (see the effect below). The ✨ Calories pill stays
  // for typed meals.
  const SILENCE_MS = 3000;
  const silenceRef = useRef(null);
  const heardRef = useRef(false);
  const stopMicRef = useRef(() => {});
  const mic = useDictation(heard => {
    setText(joinSpeech(beforeTalkRef.current, heard));
    if (heard) heardRef.current = true;
    clearTimeout(silenceRef.current);
    silenceRef.current = setTimeout(() => stopMicRef.current(), SILENCE_MS);
  });
  stopMicRef.current = mic.stop;
  useEffect(() => () => clearTimeout(silenceRef.current), []);
  function toggleMic() {
    if (mic.listening) { mic.stop(); return; }
    if (!mic.supported) {
      setMicNote('Talking is not offered here. Tap the 🎤 on your keyboard instead.');
      boxRef.current?.focus();
      return;
    }
    setMicNote('');
    beforeTalkRef.current = text.replace(/[ \t]+$/, '');
    heardRef.current = false;
    showCursorAtEnd(boxRef.current, true);
    mic.start();
  }
  // The blinking cursor follows her words while she talks.
  useEffect(() => { showCursorAtEnd(boxRef.current, mic.listening); }, [text, mic.listening]);

  // The box grows with what is in it, so a long meal can be read in full.
  useLayoutEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight + 3}px`;
  }, [text]);

  // ── Scan: her words and/or a photo → each food with its calories. The
  // numbers are shown to her first; nothing is saved until she says so.
  const fileRef = useRef(null);
  const [camOpen, setCamOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [scan, setScan] = useState(null);       // { items, total } waiting for her
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState('');

  async function pickPhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setScanError('');
    let shrunk;
    try { shrunk = await shrinkPhoto(file); } catch { setScanError('Could not open that photo. Try another.'); return; }
    setPhoto(shrunk);
    // The calories start as soon as the photo is in, with any words typed.
    if (!editing) runScan({ image: shrunk });
  }

  async function runScan(override = {}) {
    if (mic.listening) mic.stop();
    const words = text.trim();
    const image = override.image ?? photo;
    if (!words && !image) return;
    setScanning(true);
    setScanError('');
    try {
      const result = await scanMeal({ text: words, image });
      setScan(result);
    } catch (err) {
      setScanError(err.message);
    } finally {
      setScanning(false);
    }
  }

  // A meal worked out before fills in by itself: once she stops typing or
  // talking, if these exact words were scanned before (on any of her
  // gadgets), the card appears with no click and no internet. She still
  // checks it and saves it herself. Cancel means not this time.
  const dismissedRef = useRef('');
  useEffect(() => {
    const words = text.trim();
    if (editing || scan || photo || mic.listening || words.length < 3 || dismissedRef.current === words) return undefined;
    const t = setTimeout(() => {
      const known = recall(words);
      if (known) setScan({ ...known, from: 'memory' });
    }, 900);
    return () => clearTimeout(t);
  }, [text, editing, scan, photo, mic.listening]);

  // When listening ends — three seconds of quiet, her tap on stop, or the
  // phone ending it — and something was heard, find the calories by itself.
  const [autoScan, setAutoScan] = useState(0);
  const wasListeningRef = useRef(false);
  useEffect(() => {
    if (wasListeningRef.current && !mic.listening && heardRef.current) {
      heardRef.current = false;
      clearTimeout(silenceRef.current);
      setAutoScan(n => n + 1);
    }
    wasListeningRef.current = mic.listening;
  }, [mic.listening]);
  useEffect(() => {
    if (autoScan && !editing && !scan && text.trim()) runScan();
    // runScan reads the latest words; only a new end of listening re-runs this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScan]);

  // Typed meals find their calories by themselves too (2026-10-10): three
  // seconds after the last key, the same as after talking. A meal she has
  // had before already filled in from memory above, with no internet.
  useEffect(() => {
    const words = text.trim();
    if (editing || scan || scanning || photo || mic.listening || words.length < 3 || dismissedRef.current === words) return undefined;
    const t = setTimeout(() => { if (!recall(words)) runScan(); }, SILENCE_MS);
    return () => clearTimeout(t);
    // runScan reads the latest words; a change of words restarts the wait.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, editing, scan, photo, mic.listening]);

  // Changing the words after the calories came back means a new meal:
  // the old card goes and the new words are worked out instead.
  function changeText(value) {
    setText(value);
    if (scan && !photo) setScan(null);
  }

  function cancelScan() {
    setRename(null); setExtra(null);
    dismissedRef.current = text.trim();
    setScan(null);
  }

  // Fix a portion the scan got wrong: change how many, or the grams, and that
  // line's calories follow (same calories per gram as the scan found). A line
  // with no grams lets her change its calories directly.
  // Protein, carbs and fat follow the portion the same way the calories do.
  const scaled = (base, ratio) => Object.fromEntries(MACROS
    .filter(k => typeof base[k] === 'number')
    .map(k => [k, Math.round(base[k] * ratio * 10) / 10]));
  function editItem(i, field, raw) {
    setScan(prev => {
      const items = prev.items.map((it, j) => {
        if (j !== i) return it;
        const base = it.base || { grams: it.grams, kcal: it.kcal, amount: it.amount, ...Object.fromEntries(MACROS.filter(k => typeof it[k] === 'number').map(k => [k, it[k]])) };
        const perGram = base.grams > 0 ? base.kcal / base.grams : null;
        const v = Number(String(raw).replace(',', '.'));
        // Her own calorie number (2026-10-25): the AI or USDA can be wrong,
        // so typing a food's calories changes only its calories. Grams changed
        // afterwards follow her number, not the old one.
        if (field === 'kcal') {
          const kcal = Number.isFinite(v) && v >= 0 ? Math.round(v) : 0;
          const ownBase = base.grams > 0 && it.grams > 0 ? { ...base, kcal: (kcal * base.grams) / it.grams } : { ...base, kcal };
          return { ...it, base: ownBase, kcalText: raw, kcal };
        }
        if (field === 'grams') {
          const grams = Number.isFinite(v) && v >= 0 ? v : 0;
          return { ...it, base, gramsText: raw, grams: Math.round(grams), kcal: perGram != null ? Math.round(perGram * grams) : it.kcal, ...(base.grams > 0 && scaled(base, grams / base.grams)) };
        }
        // field === 'count': "3 medium" → "2 medium", grams scaled to match
        const m = String(base.amount || '').match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
        if (!m) return it;
        const count = Number.isFinite(v) && v >= 0 ? v : 0;
        const grams = base.grams > 0 ? (base.grams * count) / Number(m[1]) : null;
        return {
          ...it, base, countText: raw,
          amount: `${raw || 0}${m[2] ? ` ${m[2]}` : ''}`,
          grams: grams != null ? Math.round(grams) : it.grams,
          gramsText: undefined,
          kcal: grams != null && perGram != null ? Math.round(perGram * grams) : it.kcal,
          ...(grams != null && base.grams > 0 && scaled(base, grams / base.grams)),
        };
      });
      return { ...prev, items, total: items.reduce((sum, it) => sum + it.kcal, 0), totals: null };
    });
  }

  // The meal's totals can be typed over too (2026-10-25): calories, protein
  // and iron. A change to any food afterwards adds them up again.
  function editTotal(k, raw) {
    setScan(prev => ({ ...prev, totals: { ...(prev.totals || {}), [k]: raw } }));
  }
  const typedNum = raw => {
    const v = Number(String(raw ?? '').replace(',', '.'));
    return String(raw ?? '').trim() !== '' && Number.isFinite(v) && v >= 0 ? v : null;
  };
  function finalTotals(sc) {
    const sums = macroTotals(sc.items);
    const out = { cal: sc.total, ...sums };
    const t = sc.totals || {};
    if (t.cal != null) out.cal = typedNum(t.cal) != null ? Math.round(typedNum(t.cal)) : sc.total;
    for (const k of ['protein', 'iron']) {
      if (t[k] == null) continue;
      const n = typedNum(t[k]);
      if (n != null) out[k] = r1(n); else delete out[k];
    }
    return out;
  }

  // Fix a food the scan named wrong (2026-10-22): click its name, type the
  // right food, and it is looked up again for the same amount, so the
  // calories, protein, carbs, fats and fiber all follow.
  const [rename, setRename] = useState(null);   // { i, text, busy, error }
  async function saveRename() {
    const r = rename;
    const words = r?.text.trim();
    if (!r || !words || r.busy) return;
    const it = scan.items[r.i];
    if (words === it.name) { setRename(null); return; }
    const amount = it.grams != null ? `${it.grams} g` : (it.amount || '');
    setRename({ ...r, busy: true, error: '' });
    try {
      const found = await scanMeal({ text: `${amount} ${words}`.trim() });
      const fresh = (found?.items || []).map(x => ({ ...x, name: found.items.length === 1 ? words : x.name }));
      if (!fresh.length) throw new Error(`Could not find “${words}”. Say it another way.`);
      setScan(prev => {
        const items = [...prev.items.slice(0, r.i), ...fresh, ...prev.items.slice(r.i + 1)];
        return { ...prev, items, total: items.reduce((sum, x) => sum + x.kcal, 0), totals: null };
      });
      setRename(null);
    } catch (err) {
      setRename(cur => cur && { ...cur, busy: false, error: err.message || 'Could not look it up. Try again.' });
    }
  }

  // Add a food the scan missed (2026-10-22): type it with its amount ("2
  // eggs", "1 cup rice") and it is looked up and added to the list, so the
  // total, protein, carbs, fats and fiber include it.
  const [extra, setExtra] = useState(null);     // { text, busy, error }
  async function saveExtra() {
    const x = extra;
    const words = x?.text.trim();
    if (!x || !words || x.busy) return;
    setExtra({ ...x, busy: true, error: '' });
    try {
      const found = await scanMeal({ text: words });
      const fresh = found?.items || [];
      if (!fresh.length) throw new Error(`Could not find “${words}”. Say it another way.`);
      setScan(prev => {
        const items = [...prev.items, ...fresh];
        return { ...prev, items, total: items.reduce((sum, it) => sum + it.kcal, 0), totals: null };
      });
      setExtra(null);
    } catch (err) {
      setExtra(cur => cur && { ...cur, busy: false, error: err.message || 'Could not look it up. Try again.' });
    }
  }

  function dropItem(i) {
    setRename(null);
    setScan(prev => {
      const items = prev.items.filter((_, j) => j !== i);
      return items.length ? { ...prev, items, total: items.reduce((sum, it) => sum + it.kcal, 0), totals: null } : null;
    });
  }

  function saveScan() {
    if (!scan) return;
    const words = text.trim();
    // Her corrected portions, calories and totals are what is remembered for
    // these words, so the same meal comes back with her numbers next time
    // (with a photo too, as long as she typed or said what it was).
    if (words) {
      const clean = scan.items.map(it => {
        const out = { ...it };
        if (it.kcalText != null) out.own = true;
        delete out.base; delete out.countText; delete out.gramsText; delete out.kcalText;
        return out;
      });
      const totals = scan.totals && Object.fromEntries(Object.entries(scan.totals).filter(([, v]) => String(v ?? '').trim() !== ''));
      remember(words, { items: clean, total: scan.total, ...(totals && Object.keys(totals).length && { totals }), ...(scan.missing && { missing: scan.missing }) });
      rememberFoods(clean);
    }
    const { cal, ...macros } = finalTotals(scan);
    onSubmit({ time: time || nowTime(), text: words || describeItems(scan.items), ...macros, cal });
    setScan(null); setPhoto(null); setText(''); setTime(nowTime());
  }

  function submit(e) {
    e.preventDefault();
    if (mic.listening) mic.stop();
    const t = text.trim();
    if (!t) return;
    // A new meal: Enter finds its calories (saving is from the card).
    if (!editing) { if (!scan) runScan(); return; }
    const protein = typedNum(own.protein);
    const iron = typedNum(own.iron);
    rememberOwnNumbers(t, { cal: parseCal(own.cal), protein, iron });
    onSubmit({
      time: time || nowTime(), text: t, cal: parseCal(own.cal),
      protein: protein != null ? r1(protein) : undefined,
      iron: iron != null ? r1(iron) : undefined,
    });
  }

  return (
    // noValidate for the same reason as the weigh-in below: step="1" on the
    // calorie box made the browser swallow the submit whole if she typed a
    // decimal, so the meal was simply never added and nothing said so.
    <form className={`ml-add ml-add-tidy${editing ? ' ml-add-editing' : ''}`} noValidate onSubmit={submit}>
      {/* Top to bottom, one thing per line: what she ate (type or talk), the
          three actions side by side, then time and calories. */}
      <label className="ml-text-wrap">
        <span className="ml-time-lbl">What did you eat?</span>
        <span className="ml-talk-box">
          <textarea
            ref={boxRef}
            className="ml-text-input"
            rows={1}
            value={text}
            onChange={e => changeText(e.target.value)}
            // Enter still adds the meal, as it did when this was one line.
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
            placeholder={mic.listening ? 'Listening… say what you ate' : 'Type or tap 🎤 to talk'}
            autoFocus={editing}
          />
          <button
            type="button"
            className={`ml-mic-btn${mic.listening ? ' is-on' : ''}`}
            onClick={toggleMic}
            aria-pressed={mic.listening}
            aria-label={mic.listening ? 'Stop listening' : 'Talk instead of typing'}
            title={mic.listening ? 'Stop' : 'Talk'}
          >
            {mic.listening ? <span className="ml-mic-stop" aria-hidden="true" /> : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" />
              </svg>
            )}
          </button>
        </span>
      </label>
      {(mic.error || micNote) && <span className="ml-mic-note" role="status">{mic.error || micNote}</span>}

      <Camera open={camOpen} title="Photo of your meal" onClose={() => setCamOpen(false)} onPhoto={file => pickPhoto({ target: { files: [file] } })} />
      {!editing && !scan && (
        <div className="ml-pills ml-pills-two">
          <input ref={fileRef} type="file" accept="image/*" className="ml-scan-file" onChange={pickPhoto} tabIndex={-1} aria-hidden="true" />
          {photo ? (
            <span className="ml-pill ml-pill-photo-on">
              <img src={photo.preview} alt="Your meal" />
              <button type="button" className="ml-pill-x" onClick={() => { setPhoto(null); setScan(null); }} aria-label="Delete photo" title="Delete photo">🗑</button>
            </span>
          ) : (
            <button type="button" className="ml-pill ml-pill-photo" onClick={() => setCamOpen(true)}>📷 Photo</button>
          )}
          <button
            type="button"
            className="ml-pill ml-pill-scan ml-scan-go"
            onClick={runScan}
            disabled={scanning || (!text.trim() && !photo)}
          >
            {scanning ? 'Working…' : '✨ Calories'}
          </button>
        </div>
      )}
      {scanError && <span className="ml-mic-note ml-scan-error" role="alert">{scanError}</span>}

      {editing && (
        <label className="ml-time-wrap ml-edit-time">
          <span className="ml-time-lbl">Time</span>
          <input
            className="ml-time-input"
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            aria-label="Time you ate"
          />
        </label>
      )}
      {editing && (
        <div className="ml-own-nums">
          {[['cal', 'Calories', 'cal', 'numeric'], ['protein', 'Protein', 'g', 'decimal'], ['iron', 'Iron', 'mg', 'decimal']].map(([k, label, unit, mode]) => (
            <label key={k} className="ml-own-num">
              <span className="ml-time-lbl">{label}</span>
              <span className="ml-scan-field">
                <input
                  type="number" inputMode={mode} min="0" step="any"
                  value={own[k]}
                  onChange={e => setOwn(o => ({ ...o, [k]: e.target.value }))}
                  aria-label={label}
                />
                <span>{unit}</span>
              </span>
            </label>
          ))}
        </div>
      )}
      {scan && (
        <div className="ml-scan-card" role="region" aria-label="Calories found">
          <div className="ml-scan-head">
            {scan.from === 'memory' ? 'You had this before — check, then save'
              : scan.from === 'offline' ? 'Worked out offline — check, then save'
                : 'Check these, then save'}
          </div>
          <ul className="ml-scan-list">
            {scan.items.map((it, i) => (
              <li key={`${it.name}-${i}`} className="ml-scan-item">
                <span className="ml-scan-name">
                  {rename?.i === i ? (
                    <span className="ml-scan-rename">
                      <input
                        value={rename.text}
                        onChange={e => setRename({ ...rename, text: e.target.value, error: '' })}
                        onKeyDown={e => {
                          if (e.key === 'Enter') { e.preventDefault(); saveRename(); }
                          if (e.key === 'Escape') { e.preventDefault(); setRename(null); }
                        }}
                        disabled={rename.busy}
                        autoFocus
                        maxLength={60}
                        aria-label={`The right food instead of ${it.name}`}
                      />
                      <button type="button" className="ml-scan-rename-ok" onClick={saveRename} disabled={rename.busy || !rename.text.trim()} aria-label="Save the food">{rename.busy ? '…' : '✓'}</button>
                      <button type="button" className="ml-scan-rename-x" onClick={() => setRename(null)} disabled={rename.busy} aria-label="Keep it as it was">✕</button>
                    </span>
                  ) : (
                    <button type="button" className="ml-scan-namebtn" onClick={() => setRename({ i, text: it.name, busy: false, error: '' })} aria-label={`Change ${it.name} to the right food`}>
                      <b>{it.name}</b> <span aria-hidden="true">✎</span>
                    </button>
                  )}
                  {rename?.i === i && rename.error && <small className="ml-scan-rename-err" role="alert">{rename.error}</small>}
                  <span className="ml-scan-edit">
                    {/^\d/.test((it.base || it).amount || '') && !/^\d+(?:\.\d+)?\s*(g|grams?|ml|kg)\b/i.test((it.base || it).amount || '') && (
                      <label className="ml-scan-field">
                        <input
                          type="number" inputMode="decimal" min="0" step="any"
                          value={it.countText ?? String((it.amount || '').match(/^\d+(?:\.\d+)?/)?.[0] || '')}
                          onChange={e => editItem(i, 'count', e.target.value)}
                          aria-label={`How many, ${it.name}`}
                        />
                        <span>{(it.amount || '').replace(/^\d+(?:\.\d+)?\s*/, '') || '×'}</span>
                      </label>
                    )}
                    {it.grams != null && (
                      <label className="ml-scan-field">
                        <input
                          type="number" inputMode="decimal" min="0" step="any"
                          value={it.gramsText ?? String(it.grams)}
                          onChange={e => editItem(i, 'grams', e.target.value)}
                          aria-label={`Grams, ${it.name}`}
                        />
                        <span>g</span>
                      </label>
                    )}
                    <em className={it.source === 'ai' && !it.own ? 'is-ai' : 'is-usda'} title={it.usdaName || ''}>
                      {it.own || it.source === 'saved' ? 'Your number' : it.source === 'ai' ? 'AI guess' : 'USDA'}
                    </em>
                  </span>
                  {(typeof it.protein === 'number' || typeof it.iron === 'number') && (
                    <small className="ml-scan-macros">
                      {[typeof it.protein === 'number' && `${r1(it.protein)} g protein`, typeof it.iron === 'number' && `${r1(it.iron)} mg iron`].filter(Boolean).join(' · ')}
                    </small>
                  )}
                </span>
                <label className="ml-scan-field ml-scan-kcal">
                  <input
                    type="number" inputMode="numeric" min="0" step="1"
                    value={it.kcalText ?? String(it.kcal)}
                    onChange={e => editItem(i, 'kcal', e.target.value)}
                    aria-label={`Calories, ${it.name}`}
                  />
                  <span>cal</span>
                </label>
                <button type="button" className="ml-icon-btn ml-del ml-scan-drop" onClick={() => dropItem(i)} aria-label={`Delete ${it.name}`} title="Delete">🗑</button>
              </li>
            ))}
          </ul>
          {extra ? (
            <div className="ml-scan-extra">
              <span className="ml-scan-rename">
                <input
                  value={extra.text}
                  onChange={e => setExtra({ ...extra, text: e.target.value, error: '' })}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { e.preventDefault(); saveExtra(); }
                    if (e.key === 'Escape') { e.preventDefault(); setExtra(null); }
                  }}
                  placeholder="e.g. 2 eggs"
                  disabled={extra.busy}
                  autoFocus
                  maxLength={60}
                  aria-label="Food to add, with how much"
                />
                <button type="button" className="ml-scan-rename-ok" onClick={saveExtra} disabled={extra.busy || !extra.text.trim()} aria-label="Add the food">{extra.busy ? '…' : '✓'}</button>
                <button type="button" className="ml-scan-rename-x" onClick={() => setExtra(null)} disabled={extra.busy} aria-label="Don't add">✕</button>
              </span>
              {extra.error && <small className="ml-scan-rename-err" role="alert">{extra.error}</small>}
            </div>
          ) : (
            <button type="button" className="ml-scan-addfood" onClick={() => { setRename(null); setExtra({ text: '', busy: false, error: '' }); }}>＋ Add a food</button>
          )}
          {scan.missing?.length > 0 && (
            <div className="ml-scan-missing">
              Not found: {scan.missing.join(', ')}. Say it another way, or try again with internet.
            </div>
          )}
          {(() => {
            const sums = macroTotals(scan.items);
            const t = scan.totals || {};
            const rows = [
              ['cal', 'Total calories', 'cal', 'numeric', String(scan.total)],
              ['protein', 'Total protein', 'g', 'decimal', sums.protein != null ? String(sums.protein) : ''],
              ['iron', 'Total iron', 'mg', 'decimal', sums.iron != null ? String(sums.iron) : ''],
            ];
            return (
              <div className="ml-scan-totals">
                {rows.map(([k, label, unit, mode, found]) => (
                  <label key={k} className={`ml-scan-total${k === 'cal' ? ' is-cal' : ''}`}>
                    <span>{label}</span>
                    <span className="ml-scan-field">
                      <input
                        type="number" inputMode={mode} min="0" step="any"
                        value={t[k] ?? found}
                        placeholder="—"
                        onChange={e => editTotal(k, e.target.value)}
                        aria-label={label}
                      />
                      <span>{unit}</span>
                    </span>
                  </label>
                ))}
              </div>
            );
          })()}
          <div className="ml-form-btns">
            <button type="button" className="ml-add-btn" onClick={saveScan}>✓ Save</button>
            <button type="button" className="ml-cancel-btn" onClick={cancelScan}>Cancel</button>
          </div>
        </div>
      )}
      {editing && <div className="ml-form-btns">
        <button type="submit" className="ml-add-btn" disabled={!text.trim()}>✓ Save</button>
        <button type="button" className="ml-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>}
    </form>
  );
}

// ─── the week's calorie goal ───────────────────────────────────────────────
// How many calories she means to eat on each day of ONE week. She sets a
// different number most weeks, so it belongs to the week and not to the month
// and not to the day: type it once and all seven days of that week answer to
// it.
//
// It sits in the open day rather than on the calendar itself, because the
// calendar has no room for a control and because the day panel is already
// where every other number for that day gets typed. It shows on EVERY day of
// the week, not only Monday — she can reach it from whichever day she has
// open, and the heading names the week it will change so there is never a
// question of which seven days are about to move.
function GoalForm({ cal, weekLabel, onSave }) {
  const [draft, setDraft] = useState(() => (cal != null ? String(cal) : ''));
  const [open, setOpen] = useState(false);
  const [warn, setWarn] = useState('');

  // The panel stays mounted as she steps from one day to the next, so the box
  // has to follow the week she is looking at.
  const [seen, setSeen] = useState(cal);
  if (seen !== cal) { setSeen(cal); setDraft(cal != null ? String(cal) : ''); setWarn(''); setOpen(false); }

  const typed = draft.trim();
  const parsed = parseGoal(typed);
  const clearing = typed === '' && cal != null;
  const unchanged = typed === (cal != null ? String(cal) : '');

  async function submit(e) {
    e.preventDefault();
    if (typed === '') {
      if (cal == null) return;
      if (!(await ask(`Remove your goal of ${cal.toLocaleString()} calories a day for ${weekLabel}? The calendar will stop showing calories left for those seven days.`, { yes: 'Remove', danger: true }))) return;
      setWarn(''); onSave(null); setOpen(false);
      return;
    }
    if (parsed == null) {
      setWarn(`Type a goal between ${MIN_GOAL.toLocaleString()} and ${MAX_GOAL.toLocaleString()} calories.`);
      return;
    }
    setWarn(''); onSave(parsed); setOpen(false);
  }

  // Closed, it is one line: the number, and a button to change it. Open, it is
  // the box. A screen she reads on the move should not carry an input she is
  // not using.
  if (!open) {
    return (
      <div className="ml-goal ml-goal-shut">
        <div className="ml-goal-head">
          <span className="ml-goal-lbl">🎯 Goal · {weekLabel}</span>
          <button type="button" className="ml-goal-edit" onClick={() => setOpen(true)}>
            {cal != null ? 'Edit' : '＋ Set'}
          </button>
        </div>
        <div className="ml-goal-val">
          {cal != null
            ? <><span className="ml-goal-num">{cal.toLocaleString()}</span> <span className="ml-goal-unit">calories a day</span></>
            : <span className="ml-goal-none">No goal for this week yet</span>}
        </div>
      </div>
    );
  }

  return (
    <form className="ml-goal ml-goal-open" noValidate onSubmit={submit}>
      <div className="ml-goal-head">
        <span className="ml-goal-lbl">🎯 Goal · {weekLabel}</span>
        <button type="button" className="ml-goal-edit" onClick={() => { setOpen(false); setDraft(cal != null ? String(cal) : ''); setWarn(''); }}>
          Cancel
        </button>
      </div>
      <div className="ml-goal-row">
        <input
          className="ml-goal-input"
          type="number"
          inputMode="numeric"
          min={MIN_GOAL}
          max={MAX_GOAL}
          step="any"
          value={draft}
          onChange={e => { setDraft(e.target.value); setWarn(''); }}
          placeholder="—"
          autoFocus
          aria-label={`Calories a day for ${weekLabel}`}
        />
        <span className="ml-goal-unit">a day</span>
        <button type="submit" className="ml-goal-btn" disabled={unchanged}>
          {clearing ? 'Remove' : 'Save'}
        </button>
      </div>
      <div className="ml-goal-note">All seven days count down from this.</div>
      {warn && <div className="ml-wt-warn">{warn}</div>}
    </form>
  );
}

// ─── the daily weigh-in ────────────────────────────────────────────────────
// One number a day, in kilos, sitting under the meals because it is the other
// half of the same question. It is a section of its own rather than a fourth
// box on the meal form: a weight belongs to the DAY, not to the bowl of rice —
// putting it in the form would ask her for it again with every meal she wrote.
//
// Beside it, the day's sum: the weight, what she ate, minus what she burned,
// and whether that left a deficit or a gain. "Burned" starts at her average
// (AVERAGE_BURN) and she types over it on a day she knows the real number.
// Emptying the box goes back to the average.
//
// Nothing else is ever filled in for her. A day she did not weigh stays empty, and
// an empty day is left out of the week's average rather than counted as zero.
// `part` splits it across the tabs (2026-10-08): 'kg' is the Weight tab — the
// scale reading alone; 'burn' sits under the meals — calories burned, what she
// ate, and her real deficit.
function WeightForm({ kg, burn: typedBurnCal, eaten, average, averageFrom = 'average', watchNote, part = 'both', onSave }) {
  const showKg = part !== 'burn';
  const showBurn = part !== 'kg';
  const fromWatch = averageFrom === 'garmin';
  const burn = typedBurnCal ?? average;
  const kgText = kg != null ? formatKg(kg) : '';
  const burnText = burn != null ? String(burn) : '';
  const [draft, setDraft] = useState(kgText);
  const [burnDraft, setBurnDraft] = useState(burnText);
  const [warn, setWarn] = useState('');

  // She may open Tuesday, then Wednesday, without the panel unmounting in
  // between, so the boxes have to follow the day she is looking at.
  const [seen, setSeen] = useState(`${kgText}|${burnText}`);
  if (seen !== `${kgText}|${burnText}`) {
    setSeen(`${kgText}|${burnText}`); setDraft(kgText); setBurnDraft(burnText); setWarn('');
  }

  // Snap the scale: the number it reads goes into the box for her to check,
  // and is only kept when she clicks Save.
  const scaleRef = useRef(null);
  const [scaleCam, setScaleCam] = useState(false);
  const [reading, setReading] = useState(false);
  const [readNote, setReadNote] = useState('');
  async function readScale(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setWarn('');
    setReadNote('');
    setReading(true);
    try {
      const { kg: seen } = await scanScale(await shrinkPhoto(file));
      if (seen < MIN_KG || seen > MAX_KG) {
        setWarn(`The photo read ${seen} kg, which does not look right. Type it instead.`);
      } else {
        setDraft(formatKg(seen));
        setReadNote(`Read from your photo: ${formatKg(seen)} kg.`);
      }
    } catch (err) {
      setWarn(err.message);
    } finally {
      setReading(false);
    }
  }

  const typed = draft.trim();
  const typedBurn = burnDraft.trim();
  // Compared as TEXT, not as parsed numbers. A refused number parses to null,
  // which is also what an empty box parses to — so comparing the numbers made
  // a typo look like no change at all, greyed the button out, and left her
  // with no way to find out why it would not save.
  const kgChanged = typed !== kgText;
  // An emptied box on a day still at the average is no change at all.
  const burnChanged = typedBurn !== burnText && !(typedBurn === '' && typedBurnCal == null);
  const unchanged = !kgChanged && !burnChanged;
  const clearingKg = kgChanged && typed === '' && kg != null;
  const clearingBurn = burnChanged && typedBurn === '' && typedBurnCal != null;
  const onlyClearing = (clearingKg || !kgChanged) && (clearingBurn || !burnChanged) && !unchanged;

  async function submit(e) {
    e.preventDefault();
    if (unchanged) { setBurnDraft(burnText); return; }
    const patch = {};
    if (kgChanged && typed !== '') {
      const parsed = parseKg(typed);
      if (parsed == null) { setWarn(`Type your weight in kilos, between ${MIN_KG} and ${MAX_KG}.`); return; }
      patch.kg = parsed;
    }
    if (burnChanged && typedBurn !== '') {
      const parsed = parseBurn(typedBurn);
      if (parsed == null) { setWarn(`Type the calories burned as a whole number, up to ${MAX_BURN.toLocaleString()}.`); return; }
      patch.burn = parsed;
    }
    const gone = [
      clearingKg && `your weight of ${formatKg(kg)} kg`,
      clearingBurn && `${burn.toLocaleString()} calories burned`,
    ].filter(Boolean);
    const back = clearingBurn && average != null
      ? ` Burned goes back to ${fromWatch ? 'your Garmin number' : 'your average'}, ${average.toLocaleString()}.`
      : '';
    if (gone.length && !(await ask(`Remove ${gone.join(' and ')} for this day?${back}${clearingKg ? ' This cannot be undone.' : ''}`, { yes: 'Remove', danger: true }))) return;
    if (clearingKg) patch.kg = null;
    if (clearingBurn) patch.burn = null;
    setWarn('');
    setReadNote('');
    onSave(patch);
  }

  // No meals written and no burn typed: no deficit yet, so an empty day does
  // not claim a 1,400 deficit (2026-10-20).
  const net = burn != null && (eaten > 0 || typedBurnCal != null) ? eaten - burn : null;
  const saveLabel = onlyClearing ? 'Remove' : 'Save';

  return (
    // noValidate on purpose. With min/max/step left to the browser, a reading
    // like 62.53 fails the step check, the submit event never fires at all,
    // and the number she typed vanishes with no message. The checking is done
    // in parseKg instead, which can say what is wrong in words she can read.
    <form className={`ml-wt-form ml-wt-part-${part}`} noValidate onSubmit={submit}>
      <div className="ml-wt-split">
        <div className="ml-wt-row">
          {showKg && <label className="ml-wt-wrap">
            <span className="ml-time-lbl">⚖️ kg</span>
            <div className="ml-wt-field">
              <input
                className="ml-wt-input"
                type="number"
                inputMode="decimal"
                min={MIN_KG}
                max={MAX_KG}
                step="any"
                value={draft}
                onChange={e => { setDraft(e.target.value); setWarn(''); setReadNote(''); }}
                placeholder="—"
                aria-label="Your weight today, in kilos"
              />
              <span className="ml-wt-unit">kg</span>
              <input ref={scaleRef} type="file" accept="image/*" className="ml-scan-file" onChange={readScale} tabIndex={-1} aria-hidden="true" />
              <button
                type="button"
                className="ml-icon-btn ml-wt-snap"
                onClick={() => setScaleCam(true)}
                disabled={reading}
                aria-label="Snap your scale"
                title="Snap your scale"
              >{reading ? '…' : '📷'}</button>
            </div>
          </label>}
          {showBurn && <label className="ml-wt-wrap">
            <span className="ml-time-lbl">{typedBurnCal == null && average != null ? (fromWatch ? '⌚ Garmin cal' : '🔥 avg cal') : '🔥 cal'} burned</span>
            <div className="ml-wt-field">
              <input
                className="ml-wt-input ml-burn-input"
                type="number"
                inputMode="numeric"
                min={MIN_BURN}
                max={MAX_BURN}
                step="any"
                value={burnDraft}
                onChange={e => { setBurnDraft(e.target.value); setWarn(''); }}
                placeholder={average != null ? String(average) : '—'}
                aria-label="Calories burned today"
              />
              <span className="ml-wt-unit ml-burn-unit">cal</span>
            </div>
            {watchNote && typedBurnCal == null && <span className="ml-burn-src">{watchNote}</span>}
          </label>}
          <button type="submit" className="ml-wt-btn" disabled={unchanged}>
            {saveLabel}
          </button>
        </div>

        {showBurn && <div className="ml-sum" aria-label="This day in numbers">

          <div className="ml-sum-row">
            <span>Total calories eaten</span>
            <b>{eaten.toLocaleString()}</b>
          </div>
          {burn != null && (
            <div className="ml-sum-row ml-sum-burn">
              <span>− Calories burned</span>
              <b>{burn.toLocaleString()}</b>
            </div>
          )}
          {net != null && <>
            <div className="ml-sum-rule" aria-hidden="true" />
            <div className={`ml-sum-row ml-sum-net${net > 0 ? ' ml-sum-gain' : ' ml-sum-deficit'}`}>
              <span>{net > 0 ? 'Gained' : net < 0 ? 'Real deficit' : 'Even'}</span>
              <b>{Math.abs(net).toLocaleString()} cal</b>
            </div>
          </>}
        </div>}
      </div>
      {readNote && (
        <div className="ml-wt-read" role="status">
          <span>{readNote} Check it, then click {saveLabel.replace('＋ ', '')}.</span>
          <button
            type="button"
            className="ml-icon-btn ml-del"
            onClick={() => { setDraft(kgText); setReadNote(''); }}
            aria-label="Delete the number read from the photo"
            title="Delete"
          >🗑</button>
        </div>
      )}
      {reading && <div className="ml-wt-read" role="status"><span>Reading your scale…</span></div>}
      {warn && <div className="ml-wt-warn">{warn}</div>}
      <Camera open={scaleCam} title="Snap your scale" onClose={() => setScaleCam(false)} onPhoto={file => readScale({ target: { files: [file] } })} />
    </form>
  );
}

// Her Groq key ends on 6 Oct 2027. From two weeks before — or the moment
// Groq refuses it — this tells her to make a new one. Scanning keeps working
// meanwhile on Gemini, only slower.
function GroqReminder() {
  const r = groqKeyReminder();
  if (!r) return null;
  const date = new Date(`${r.ends}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <div className="ml-groq-note" role="status">
      {r.ended ? `🔑 Your Groq key has ended (${date}). ` : `🔑 Your Groq key ends on ${date}. `}
      Make a new one at <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer">console.groq.com/keys</a>,
      then put it in Vercel as GROQ_API_KEY. Scanning still works meanwhile, only slower.
    </div>
  );
}

// One written meal. The two actions are icons only — a pencil and a bin — so
// the row stays the meal rather than the buttons around it.
function EntryRow({ entry, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="ml-entry ml-entry-editing">
        <MealForm
          initial={entry}
          onSubmit={(fields) => { onEdit(fields); setEditing(false); }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="ml-entry">
      <span className="ml-entry-time">{prettyTime(entry.time)}</span>
      <span className="ml-entry-text">
        {entry.text}
        {entry.fromPlan && <span className="ml-from-plan" title="Filed by your meal plan">· from your plan</span>}
      </span>
      <span className={`ml-entry-cal${entry.cal == null ? ' ml-entry-cal-none' : ''}`}>
        {entry.cal == null ? '—' : `${entry.cal.toLocaleString()} cal`}
      </span>
      <span className="ml-entry-acts">
        <button className="ml-icon-btn" onClick={() => setEditing(true)} aria-label={`Edit ${entry.text}`}>✏️</button>
        <button className="ml-icon-btn ml-del" onClick={onDelete} aria-label={`Delete ${entry.text}`}>🗑</button>
      </span>
    </li>
  );
}

// ─── the open day ──────────────────────────────────────────────────────────
function DayPanel({ year, monthIdx, day, entries, kg, burn, averageBurn, burnFrom, watchNote, weekAvg, goal, weekLabel, left,
                    onAdd, onEdit, onDelete, onWeight, onGoal, onClose, saveFailed }) {
  const dow = (new Date(year, monthIdx, day).getDay() + 6) % 7;
  const { total, missing } = calTotals(entries);
  // One box at a time (chosen 2026-10-07): three tabs, Meals open first. A
  // green tick on a tab means that part of the day is filled in — the week's
  // goal set, at least one meal written, the weight saved — so what is still
  // missing shows at a glance.
  const [tab, setTab] = useState('meals');
  const [time, setTime] = useState(nowTime);
  const show = part => tab === part;
  // Two tabs since 2026-10-08: the weight moved in with the week's goal. Its
  // tick needs both — the goal set and today's weight saved.
  const done = { goal: goal != null && kg != null, meals: entries.length > 0 };
  return (
    <>
    <div className="ml-day-panel splash-item ml-day-tabs">
      {/* Date and time on one centred line; the ✕ sits in the corner. */}
      <div className="ml-day-head">
        <div className="ml-day-title">
          <div className="ml-day-when">
            <span className="ml-day-date">
              <span className="ml-date-long">{DAY_NAMES[dow]}, {day} {MONTH_NAMES[monthIdx]} {year}</span>
              <span className="ml-date-short" aria-hidden="true">{DAY_NAMES[dow].slice(0, 3)}, {day} {MONTH_NAMES[monthIdx].slice(0, 3)}</span>
            </span>
            {show('meals') && (
              <input
                className="ml-time-input ml-day-time"
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                aria-label="Time you ate"
              />
            )}
          </div>
          <div className="ml-day-count">
            {entries.length === 0
              ? 'Nothing written down yet'
              : `${entries.length} ${entries.length === 1 ? 'meal' : 'meals'} written down`}
          </div>
        </div>
        <button className="ml-close" onClick={onClose} aria-label="Close this day">✕</button>
      </div>

      {/* Three boxes, one for each part of the day — the week's goal, the
          meals and their calories, the scale — so each reads as its own
          thing without a heading line between them. */}
      <div className="ml-tabs" role="tablist" aria-label="Part of the day">
        {[['goal', '🎯 Goal & Weight'], ['meals', '🍽️ Meals']].map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            aria-label={`${label.slice(label.indexOf(' ') + 1)}${done[id] ? ', filled in' : ', not filled in yet'}`}
            className={`ml-tab${tab === id ? ' on' : ''}${done[id] ? ' is-done' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
            {done[id] && <span className="ml-tab-tick" aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      {show('goal') && <GoalForm cal={goal} weekLabel={weekLabel} onSave={onGoal} />}

      {show('meals') && <section className="ml-box ml-box-meals" aria-label="Meals and calories">
      <GroqReminder />
      <MealForm onSubmit={onAdd} time={time} setTime={setTime} />

      {saveFailed && (
        <div className="ml-save-warn">
          ⚠️ This device could not save. What you typed is not written down yet.
        </div>
      )}

      {/* The day as a receipt: every meal in one box, a line, what she has
          eaten so far; then, on its own and highlighted, what is left. */}
      {entries.length > 0 && <div className="ml-receipt">
        <ul className="ml-entries">
          {entries.map(en => (
            <EntryRow
              key={en.id}
              entry={en}
              onEdit={(fields) => onEdit(en, fields)}
              onDelete={() => onDelete(en)}
            />
          ))}
        </ul>
      </div>}

      {/* Eaten so far in its own highlighted card, each nutrient in a small
          card of its own (2026-10-26), adding up with every meal. */}
      {entries.length > 0 && <div className="ml-eaten-card">
        <div className="ml-receipt-total ml-eaten-total">
          <span>Eaten so far</span>
          <b>{total.toLocaleString()} cal</b>
        </div>
        <NutrientCards entries={entries} />
        {missing > 0 && (
          <div className="ml-receipt-note">
            {missing} {missing === 1 ? 'meal has' : 'meals have'} no calories, so not counted.
          </div>
        )}
      </div>}

      {goal != null && (
        <div className={`ml-left-box${left < 0 ? ' is-over' : ''}`}>
          <span>{left < 0 ? 'Over your goal by' : 'Left to eat today'}</span>
          <b>{Math.abs(left).toLocaleString()} cal</b>
        </div>
      )}

      </section>}

      {show('goal') && <section className="ml-box ml-box-weight" aria-label="Weight">
      <WeightForm kg={kg} burn={burn} eaten={total} average={averageBurn} averageFrom={burnFrom} part="kg" onSave={onWeight} />

      {weekAvg && weekAvg.counted > 0 && (
        <div className="ml-wt-week">
          <span className="ml-wt-week-lbl">Average this week</span>
          <span className="ml-wt-week-num">{formatKg(weekAvg.avg)} kg</span>
          <span className="ml-wt-week-note">
            from {weekAvg.counted} {weekAvg.counted === 1 ? 'day' : 'days'} weighed
          </span>
        </div>
      )}
      </section>}
    </div>

    {/* Outside the day's box, its own section (2026-10-10): calories
        burned (her watch, her own number, or her average), what she ate,
        and the real deficit. */}
    {show('goal') && <section className="ml-box ml-box-burn ml-burn-panel ml-burn-outside splash-item" aria-label="Calories burned">
      <WeightForm kg={kg} burn={burn} eaten={total} average={averageBurn} averageFrom={burnFrom} watchNote={watchNote} part="burn" onSave={onWeight} />
    </section>}
    </>
  );
}

// ─── Breakfast · Lunch · Dinner · Snacks (her layout, 2026-10-10) ─────────
// Small pills under the calendar. Clicking one opens it: the meal she hearted
// for it (a picture), today's nutrition, then meal ideas. She is sending the
// meal ideas with their pictures later, so until then the picture and the
// ideas say so plainly — nothing is made up to fill them.
// Breakfast tab taken away and Lunch renamed Brunch at her request
// (2026-10-23). Brunch keeps the id 'lunch', so her meals and hearted picks
// stay where they are.
const MEAL_TIMES = [
  { id: 'lunch',     label: 'Brunch',    icon: '🥗' },
  { id: 'dinner',    label: 'Dinner',    icon: '🍲' },
  { id: 'snacks',    label: 'Snacks',    icon: '🍓' },
];

function TodayNutrition({ entries, goal }) {
  const { total } = calTotals(entries);
  const sums = Object.fromEntries(MACROS.map(k => [k, entries.reduce((s, e) => s + (typeof e[k] === 'number' ? e[k] : 0), 0)]));
  const withMacros = entries.filter(e => ['protein', 'carbs', 'fat'].every(k => typeof e[k] === 'number')).length;
  const daySums = nutrientSums(entries);
  const kcalFrom = { protein: sums.protein * 4, carbs: sums.carbs * 4, fat: sums.fat * 9 };
  const macroKcal = kcalFrom.protein + kcalFrom.carbs + kcalFrom.fat;
  const pct = k => (macroKcal > 0 ? Math.round((kcalFrom[k] / macroKcal) * 100) : null);
  const ring = goal ? Math.min(1, total / goal) : 0;
  const R = 44, C = 2 * Math.PI * R;
  return (
    <div className="mt-nutri">
      <div className="mt-nutri-title">Today&rsquo;s nutrition</div>
      <div className="mt-nutri-body">
        <div className="mt-ring" role="img" aria-label={`${total.toLocaleString()} calories eaten${goal ? ` of ${goal.toLocaleString()}` : ''}`}>
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r={R} className="mt-ring-track" />
            {goal && <circle cx="50" cy="50" r={R} className="mt-ring-fill" strokeDasharray={`${C * ring} ${C}`} transform="rotate(-90 50 50)" />}
          </svg>
          <span className="mt-ring-text">
            <b>{total.toLocaleString()}</b>
            <small>{goal ? `of ${goal.toLocaleString()} cal` : 'cal'}</small>
          </span>
        </div>
        <ul className="mt-macros">
          {[['protein', 'Protein'], ['carbs', 'Carbs'], ['fat', 'Fats'], ['fiber', 'Fiber'], ['iron', 'Iron']].map(([k, label]) => (
            <li key={k} className={`mt-macro mt-${k}`}>
              <span className="mt-dot" aria-hidden="true" />
              <span className="mt-macro-name">{label}</span>
              <b>{daySums[k] == null ? '—' : k === 'iron' ? `${daySums[k]} mg` : `${Math.round(daySums[k])} g`}</b>
              <em>{!['fiber', 'iron'].includes(k) && withMacros && pct(k) != null ? `${pct(k)}%` : ''}</em>
            </li>
          ))}
        </ul>
      </div>
      {entries.length > 0 && withMacros < entries.length && (
        <p className="mt-note">
          {withMacros === 0
            ? 'Protein, carbs and fats show for meals saved from now on.'
            : `Protein, carbs and fats from ${withMacros} of ${entries.length} meals.`}
        </p>
      )}
    </div>
  );
}

// The meal she hearted for each meal time, synced across her gadgets.
const PICKS_KEY = 'gp_meal_picks';
function loadPicks() {
  try { return JSON.parse(localStorage.getItem(PICKS_KEY) || '{}') || {}; } catch { return {}; }
}

function IdeaDetail({ idea, picked, onPick, onClose }) {
  const nums = [['kcal', 'cal', ''], ['protein', 'Protein', ' g'], ['carbs', 'Carbs', ' g'], ['fat', 'Fats', ' g'], ['fiber', 'Fiber', ' g'], ['iron', 'Iron', ' mg']]
    .filter(([k]) => typeof idea[k] === 'number');
  const [whole, setWhole] = useState(false);
  return (
    <div className="mt-idea-detail">
      {/* Click the picture to see it whole (2026-10-22). */}
      {idea.image && (
        <button type="button" className="mt-idea-bigbtn" onClick={() => setWhole(true)} aria-label={`See the whole picture of ${idea.name}`}>
          <img className="mt-idea-big" src={idea.image} alt={idea.name} />
          <span className="mt-idea-expand" aria-hidden="true">⤢</span>
        </button>
      )}
      <PhotoView src={whole ? idea.image : null} alt={idea.name} onClose={() => setWhole(false)} />
      <div className="mt-idea-top">
        <h3 className="mt-idea-name">{idea.name}</h3>
        <button type="button" className={`mt-heart${picked ? ' on' : ''}`} onClick={onPick} aria-pressed={picked} aria-label={picked ? 'Eaten today — click to take it off today' : 'I ate this — save it to today'}>
          {picked ? '♥' : '♡'}
        </button>
      </div>
      {nums.length > 0 && (
        <div className="mt-idea-nums">
          {nums.map(([k, label, unit]) => <span key={k}><b>{idea[k].toLocaleString()}{unit}</b> {label}</span>)}
        </div>
      )}
      {idea.ingredients?.length > 0 && <>
        <div className="mt-nutri-title">Ingredients</div>
        <ul className="mt-idea-list">{idea.ingredients.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </>}
      {idea.steps?.length > 0 && <>
        <div className="mt-nutri-title">Steps</div>
        <ol className="mt-idea-steps">{idea.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>
      </>}
      {idea.note && <p className="mt-idea-note">{idea.note}</p>}
      {/* Her notes for every meal: getting ahead, and how the numbers were worked out. */}
      {PREP_TIPS.length > 0 && <details className="mt-idea-notes">
        <summary>Prep tips</summary>
        <ul className="mt-idea-list">{PREP_TIPS.map(([what, tip]) => <li key={what}><b>{what}:</b> {tip}</li>)}</ul>
      </details>}
      <details className="mt-idea-notes">
        <summary>Nutrition notes</summary>
        <ul className="mt-idea-list">{NUTRITION_NOTES.map((x, i) => <li key={i}>{x}</li>)}</ul>
      </details>
      <button type="button" className="mt-idea-close" onClick={onClose}>Close</button>
    </div>
  );
}

// ♥ means "I ate this" (her rule, 2026-10-11): the meal is saved to today in
// the calendar — its calories, protein, carbs and fats — and counts toward
// eaten and left. Its picture stays on top of that meal time, today and every
// day after, until she hearts another. A second ♥ on the same meal the same
// day takes it off today again (the picture stays).
const HEART = on => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z" />
  </svg>
);

// Under the My Meals title (2026-10-30): the pictures she has hearted — her
// Brunch, Dinner and Snack, and today's Days plan. A click opens that tab.
// Nothing hearted, nothing shown.
function HeartedPictures({ onOpen }) {
  const picks = loadPicks();
  const items = MEAL_TIMES.map(t => {
    const idea = ideasFor(t.id).find(i => i.id === picks[t.id]);
    return idea?.image ? { key: t.id, img: idea.image, label: t.label, name: idea.name, tab: t.id } : null;
  }).filter(Boolean);
  const type = dayTypeOf((new Date().getDay() + 6) % 7);
  const day = type ? chosenPlan(type.id) : null;
  if (day?.hearted && day.plan) items.push({ key: 'days', img: day.plan.image, label: type.one, name: day.plan.name, tab: 'days' });
  if (!items.length) return null;
  return (
    <div className="ml-hearted">
      {items.map(it => (
        <button key={it.key} type="button" className="ml-hearted-card" onClick={() => onOpen(it.tab)}>
          <img src={it.img} alt="" />
          <span className="ml-hearted-text"><small>♥ {it.label}</small><b>{it.name}</b></span>
        </button>
      ))}
    </div>
  );
}

function MealTimePanel({ time, entries, goal, onEat }) {
  const [picks, setPicks] = useState(loadPicks);
  const [openIdea, setOpenIdea] = useState(null);
  useEffect(() => {
    const refresh = () => setPicks(loadPicks());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  // Her hearted idea comes first; the rest keep their order.
  const ideas = [...ideasFor(time.id)].sort((a, b) => (b.id === picks[time.id]) - (a.id === picks[time.id]));
  const picked = ideas.find(i => i.id === picks[time.id]);
  const shown = ideas.find(i => i.id === openIdea);
  const eatenToday = id => entries.some(e => e.ideaId === id && e.mealTime === time.id);
  function pick(idea) {
    const adding = !eatenToday(idea.id);
    onEat(idea, time.id);
    if (!adding) return;
    const next = { ...picks, [time.id]: idea.id };
    setPicks(next);
    try { localStorage.setItem(PICKS_KEY, JSON.stringify(next)); } catch { /* kept for this visit */ }
  }
  return (
    <div className="mt-panel" role="tabpanel" aria-label={time.label}>
      {picked?.image ? (
        <button type="button" className="mt-hero mt-hero-pic" onClick={() => setOpenIdea(picked.id)}>
          <img src={picked.image} alt="" />
          <span className="mt-hero-name">♥ {picked.name}{eatenToday(picked.id) ? ' · eaten today' : ''}</span>
        </button>
      ) : (
        <div className="mt-hero">
          <span className="mt-hero-icon" aria-hidden="true">{time.icon}</span>
          <span className="mt-hero-text">No {time.label.toLowerCase()} picked yet</span>
          <span className="mt-hero-hint">Heart a meal idea and its picture shows here.</span>
        </div>
      )}
      <TodayNutrition entries={entries} goal={goal} />
      <div className="mt-ideas">
        <div className="mt-nutri-title">Meal ideas</div>
        {ideas.length > 0 && (
          <p className="mt-empty">Any 1 {DAY_RANGE.times.map(t => (t === 'snacks' ? 'snack' : MEAL_TIMES.find(m => m.id === t)?.label.toLowerCase() || t)).join(' + ')} = {DAY_RANGE.kcalLow.toLocaleString()}–{DAY_RANGE.kcalHigh.toLocaleString()} cal.</p>
        )}
        {ideas.length === 0 ? (
          <p className="mt-empty">Your {time.label.toLowerCase()} ideas will show here.</p>
        ) : (
          <div className="mt-idea-grid">
            {ideas.map(i => (
              <div key={i.id} className="mt-idea-wrap">
                <button type="button" className={`mt-idea${openIdea === i.id ? ' on' : ''}${picked?.id === i.id ? ' is-fav' : ''}`} onClick={() => setOpenIdea(o => (o === i.id ? null : i.id))}>
                  {i.image ? <img src={i.image} alt="" loading="lazy" /> : <span className="mt-idea-noimg" aria-hidden="true">{time.icon}</span>}
                  <span className="mt-idea-label">{eatenToday(i.id) || picked?.id === i.id ? '♥ ' : ''}{i.name}</span>
                </button>
                <button type="button" className={`mt-idea-heart${eatenToday(i.id) ? ' on' : ''}`} onClick={() => pick(i)} aria-pressed={eatenToday(i.id)} aria-label={eatenToday(i.id) ? `Take ${i.name} off today` : `I ate ${i.name} today`}>
                  {HEART(eatenToday(i.id))}
                </button>
              </div>
            ))}
          </div>
        )}
        {shown && <IdeaDetail idea={shown} picked={eatenToday(shown.id)} onPick={() => pick(shown)} onClose={() => setOpenIdea(null)} />}
      </div>
    </div>
  );
}

// Days (2026-10-30): her whole-day meal plans, beside Snacks. Same kind of
// icon as Brunch, Dinner, Snacks and Calendar beside it: a full day's meals.
const DAYS_ICON = '🍱';

// Breakfast · Lunch · Dinner · Snacks · Calendar. The calendar is the one
// she has always had — every meal, weight and goal in it stays as it was.
function MealTabs({ tab, setTab }) {
  return (
    <div className="mt splash-item">
      <div className="mt-pills" role="tablist" aria-label="Meals">
        {[...MEAL_TIMES, { id: 'days', label: 'Days', icon: DAYS_ICON }, { id: 'calendar', label: 'Calendar', icon: '📅' }].map(t => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`mt-pill${tab === t.id ? ' on' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span className="mt-pill-icon" aria-hidden="true">{t.icon}</span>
            <span className="mt-pill-label">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Meal({ initialTab = null, pushBack, clearInnerBack }) {
  const [state, setState] = useState(loadLog);
  const [garmin, setGarmin] = useState(loadGarmin);
  // A sync from another gadget (or the Garmin Shortcut) refreshes the numbers
  // in place — the open day, its tab and anything half-typed stay as they are.
  useEffect(() => {
    const refresh = () => { setState(loadLog()); setGarmin(loadGarmin()); };
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  // Sundays on which another kilo was reached (see kiloSundays).
  const kiloDays = useMemo(() => kiloSundays(state, garmin), [state, garmin]);
  // Read once and hold it: "today" must not shift under her while the page is
  // open, or the ring would jump to a different square at midnight mid-edit.
  const today = useMemo(() => todayParts(), []);
  const [year, setYear] = useState(today.y);
  const [monthIdx, setMonthIdx] = useState(today.m);
  const [openDay, setOpenDay] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);
  // Which pill is open: a meal time, or the calendar (first, as always).
  // A tab that no longer exists (Breakfast, taken away 2026-10-23) opens the calendar.
  // Home's meal card opens Days straight on today's kind of day ('days:glute').
  const [dayType] = useState(() => (String(initialTab || '').startsWith('days:') ? initialTab.slice(5) : null));
  const [tab, setTabState] = useState(() => {
    if (dayType) return 'days';
    let saved = null;
    try { saved = sessionStorage.getItem('gp_meal_tab'); } catch { /* fine */ }
    return MEAL_TIMES.some(t => t.id === saved) || saved === 'days' ? saved : 'calendar';
  });
  const setTab = t => { clearInnerBack?.(); setTabState(t); try { sessionStorage.setItem('gp_meal_tab', t); } catch { /* fine */ } };

  const days = state.days || {};

  const commit = useCallback((updater) => {
    setState(prev => {
      const next = { ...updater(prev), updatedAt: new Date().toISOString() };
      setSaveFailed(!saveLog(next));
      return next;
    });
  }, []);

  const addEntry = (dayNum, fields) => {
    const key = dateKey(year, monthIdx, dayNum);
    const now = new Date().toISOString();
    commit(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [key]: [
          ...(prev.days[key] || []),
          { id: newEntryId(), ...fields, createdAt: now, updatedAt: now },
        ].sort(byTime),
      },
    }));
  };

  const editEntry = (dayNum, entry, fields) => {
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => ({
      ...prev,
      days: {
        ...prev.days,
        [key]: (prev.days[key] || [])
          .map(e => (e.id === entry.id
            ? { ...e, ...fields, fromPlan: undefined, updatedAt: new Date().toISOString() }
            : e))
          .sort(byTime),
      },
    }));
  };

  // ♥ on a meal idea: save it to TODAY (whatever month the calendar shows),
  // or, if that meal is already on today for this meal time, take it off.
  const eatIdea = (idea, mealTime) => {
    const key = dateKeyOf();
    const now = new Date().toISOString();
    commit(prev => {
      const list = prev.days[key] || [];
      const had = list.find(e => e.ideaId === idea.id && e.mealTime === mealTime);
      if (had) {
        const left = list.filter(e => e.id !== had.id);
        const nextDays = { ...prev.days };
        if (left.length) nextDays[key] = left; else delete nextDays[key];
        return { ...prev, days: nextDays, deleted: { ...prev.deleted, [had.id]: now } };
      }
      const entry = {
        id: newEntryId(), time: nowTime(), text: idea.name, cal: idea.kcal,
        protein: idea.protein, carbs: idea.carbs, fat: idea.fat, fiber: idea.fiber, ...(typeof idea.iron === 'number' && { iron: idea.iron }),
        ideaId: idea.id, mealTime, createdAt: now, updatedAt: now,
      };
      return { ...prev, days: { ...prev.days, [key]: [...list, entry].sort(byTime) } };
    });
  };

  // ♥ on a Days plan: its meals go on TODAY with their times, calories,
  // protein, fiber and iron. Hearting another plan of the same kind swaps
  // them; un-hearting takes them off.
  const eatPlan = (type, plan) => {
    const key = dateKeyOf();
    const now = new Date().toISOString();
    commit(prev => {
      const list = prev.days[key] || [];
      const gone = list.filter(e => e.dayType === type.id);
      const deleted = { ...prev.deleted };
      gone.forEach(e => { deleted[e.id] = now; });
      const kept = list.filter(e => e.dayType !== type.id);
      const added = plan ? plan.meals.map(m => ({
        id: newEntryId(), time: time24(m.time), text: m.name.includes('·') ? m.name : `${m.name} · ${plan.name}`, cal: numOf(m.kcal), protein: numOf(m.protein),
        ...(m.fiber && { fiber: numOf(m.fiber) }), ...(m.iron && { iron: numOf(m.iron, 1) }),
        mealTime: m.snack ? 'snacks' : /dinner/i.test(m.name) ? 'dinner' : 'lunch',
        dayType: type.id, dayPlanId: plan.id, createdAt: now, updatedAt: now,
      })) : [];
      const next = [...kept, ...added].sort(byTime);
      const nextDays = { ...prev.days };
      if (next.length) nextDays[key] = next; else delete nextDays[key];
      return { ...prev, days: nextDays, deleted };
    });
  };

  // A deleted line leaves a tombstone, or the other gadget's copy would put it
  // straight back on the next sync.
  const deleteEntry = async (dayNum, entry) => {
    if (!(await ask(`Delete “${entry.text}” at ${prettyTime(entry.time)}? This cannot be undone.`, { yes: 'Delete', danger: true }))) return;
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => {
      const left = (prev.days[key] || []).filter(e => e.id !== entry.id);
      const nextDays = { ...prev.days };
      if (left.length) nextDays[key] = left; else delete nextDays[key];
      return {
        ...prev,
        days: nextDays,
        deleted: { ...prev.deleted, [entry.id]: new Date().toISOString() },
      };
    });
  };

  // The scale reading for a day. Writing null clears it; the record keeps the
  // cleared stamp so another gadget cannot put the old number back.
  const saveWeight = (dayNum, patch) => {
    const key = dateKey(year, monthIdx, dayNum);
    commit(prev => {
      let next = prev;
      if ('kg' in patch) next = setWeight(next, key, patch.kg);
      if ('burn' in patch) next = setBurn(next, key, patch.burn);
      return next;
    });
  };

  // The week's goal, filed against that week's Monday so one number answers
  // for all seven days.
  const saveGoal = (dayNum, cal) => {
    commit(prev => setGoal(prev, weekStartKey(year, monthIdx, dayNum), cal));
  };

  // Month and year both step, and each step closes the open day so the panel
  // can never show one month's meals under another month's heading.
  function step(deltaMonths, deltaYears) {
    setOpenDay(null);
    let m = monthIdx + deltaMonths;
    let y = year + deltaYears;
    if (m < 0) { m = 11; y -= 1; }
    if (m > 11) { m = 0; y += 1; }
    setMonthIdx(m);
    setYear(y);
  }

  function goToday() {
    setOpenDay(null);
    setYear(today.y);
    setMonthIdx(today.m);
  }

  const weeks = monthWeeks(year, monthIdx);
  const isThisMonth = year === today.y && monthIdx === today.m;

  // Counted from what is actually stored, so a month she has not filled in
  // honestly reads zero rather than borrowing numbers from the plan.
  const daysWritten = Object.keys(days).filter(k => k.startsWith(`${year}-${pad(monthIdx + 1)}-`)).length;
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

  const openKey = openDay ? dateKey(year, monthIdx, openDay) : null;
  const openIsSunday = openDay ? new Date(year, monthIdx, openDay).getDay() === 0 : false;
  const openMonday = openDay ? weekStartKey(year, monthIdx, openDay) : null;

  return (
    <div className="section">
      <div className="s-header">
        <div className="s-tag">What you actually ate</div>
        <h2 className="s-title">My <em>Meals</em></h2>
        <HeartedPictures onOpen={setTab} />
      </div>

      <MealTabs tab={tab} setTab={setTab} />

      {tab === 'days' && (
        <div className="mt">
          <MealDays initialType={dayType} pushBack={pushBack} clearInnerBack={clearInnerBack} onHeartPlan={eatPlan} />
        </div>
      )}

      {tab !== 'calendar' && tab !== 'days' && (
        <div className="mt">
          <MealTimePanel
            key={tab}
            time={MEAL_TIMES.find(t => t.id === tab)}
            entries={days[dateKeyOf()] || []}
            goal={goalForWeek(state, weekStartKey(today.y, today.m, today.d)) ?? planGoal()}
            onEat={eatIdea}
          />
        </div>
      )}

      {tab === 'calendar' && <>
      <div className="ml-nav splash-item">
        <div className="ml-nav-row">
          <button className="ml-nav-btn" onClick={() => step(-1, 0)} aria-label="Previous month">‹</button>
          <div className="ml-nav-label">{MONTH_NAMES[monthIdx]}</div>
          <button className="ml-nav-btn" onClick={() => step(1, 0)} aria-label="Next month">›</button>
        </div>
        <div className="ml-nav-row ml-nav-year">
          <button className="ml-nav-btn" onClick={() => step(0, -1)} aria-label="Previous year">‹</button>
          <div className="ml-nav-label">{year}</div>
          <button className="ml-nav-btn" onClick={() => step(0, 1)} aria-label="Next year">›</button>
        </div>
        {!isThisMonth && (
          <button className="ml-today-btn" onClick={goToday}>Back to this month</button>
        )}
      </div>

      <div className="ml-cal splash-item">
        <div className="ml-cal-head">
          {DAY_LETTERS.map(d => <div key={d} className="ml-dh">{d}</div>)}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="ml-week">
            {week.map((day, di) => {
              if (!day) return <div key={di} className="ml-day ml-day-empty" />;
              const key = dateKey(year, monthIdx, day);
              const dayEntries = days[key] || [];
              const count = dayEntries.length;
              const { total, counted } = calTotals(dayEntries);
              const isToday = isThisMonth && day === today.d;
              const isOpen = openDay === day;
              // Column 6 is Sunday — the grid runs Mo…Su — and Sunday is where
              // the week closes, so that is where its total belongs.
              const isSunday = di === 6;
              const week = isSunday ? weekLostEnding(state, garmin, year, monthIdx, day) : null;
              const showWeek = Boolean(week && week.show);
              // What she came to the calendar to find out: how much is left of
              // today. Only a week with a goal has an answer; without one the
              // square shows what she ate, as it always did.
              // Each day's square shows its calorie deficit (burned − eaten).
              const deficit = dayDeficit(state, garmin, key);
              const showLeft = deficit != null;
              // The scale sits above the calories with a rule between them,
              // because two bare numbers stacked in one square with nothing
              // between them read as one four-digit number.
              const kg = weightOn(state, key);
              const wk = isSunday ? weekWeightAvg(state, year, monthIdx, day) : null;
              const avg = wk && wk.counted > 0 ? wk.avg : null;
              const showWt = kg != null || avg != null;
              const showRule = showWt && (showLeft || count > 0);
              return (
                <button
                  key={di}
                  className={`ml-day${count ? ' ml-day-has' : ''}${isToday ? ' ml-day-today' : ''}${isOpen ? ' ml-day-open' : ''}${showWeek || showWt ? ' ml-day-sun' : ''}${isSunday && kiloDays.has(key) ? ' ml-day-kilo' : ''}`}
                  onClick={() => setOpenDay(isOpen ? null : day)}
                  aria-label={`${day} ${MONTH_NAMES[monthIdx]} ${year}, ${
                    showLeft
                      ? (deficit < 0
                          ? `${Math.abs(deficit)} calories more eaten than burned`
                          : `${deficit} calorie deficit`)
                      : count === 0
                        ? 'nothing written down'
                        : counted === 0
                          ? `${count} ${count === 1 ? 'meal' : 'meals'} written down, no calories yet`
                          : `${total} calories`
                  }${showWeek
                    ? (week.over
                        ? `, ${Math.abs(week.value)} calories more eaten than burned this week`
                        : `, ${week.value} calorie deficit this week`)
                    : ''}${
                    isSunday && kiloDays.has(key) ? ', another kilo lost' : ''}${kg != null ? `, ${formatKg(kg)} kilos` : ''
                  }${avg != null ? `, ${formatKg(avg)} kilos on average this week` : ''}`}
                >
                  <span className="ml-day-num">{day}</span>
                  {showWt && (
                    <span className="ml-day-wt">
                      <span className="ml-wt-day">{kg != null ? formatKg(kg) : '–'}</span>
                      {avg != null && <>
                        <span className="ml-wt-slash">/</span>
                        <span className="ml-wt-avg">{formatKg(avg)}</span>
                      </>}
                    </span>
                  )}
                  {showRule && <span className="ml-day-rule" aria-hidden="true" />}
                  {showLeft
                    ? <span className={`ml-day-dot ml-day-deficit${deficit < 0 ? ' ml-day-over' : ''}`}>
                        {deficit < 0 ? `+${Math.abs(deficit)}` : deficit}
                      </span>
                    : count > 0 && (
                        <span className={`ml-day-dot${counted === 0 ? ' ml-day-dot-none' : ''}`}>
                          {counted === 0 ? '·' : total}
                        </span>
                      )}
                  {showWeek && (
                    <span className={`ml-day-week ml-day-lost${week.over ? ' ml-day-over' : ''}`}>
                      {week.over ? `+${Math.abs(week.value).toLocaleString('en-US')}` : `🔥${week.value.toLocaleString('en-US')}`}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="ml-summary splash-item">
        🍽️ {daysWritten} of {daysInMonth} days written down in {MONTH_NAMES[monthIdx]}
      </div>
      {/* One line only, as she asked (2026-10-08). */}
      <div className="ml-legend ml-legend-simple splash-item">
        <span className="ml-legend-item ml-legend-fact"><span className="ml-kilo-swatch" aria-hidden="true" />Lose 1 kg = 7,700 cal</span>
      </div>

      {openDay && (
        <DayPanel
          year={year}
          monthIdx={monthIdx}
          day={openDay}
          entries={days[openKey] || []}
          kg={weightOn(state, openKey)}
          burn={burnOn(state, openKey)}
          /* Her Garmin average (1,400) shows on every day, all the time
             (2026-10-20), until the watch sends that day's number. A day with
             no meals still gets no deficit: dayDeficit needs meals. */
          averageBurn={garminBurnOn(garmin, openKey) ?? averageBurn()}
          /* Her watch's number, when the Shortcut has sent one for this day,
             stands in for the average. What she types still wins over both.
             For her, the average is her Garmin average, so it reads Garmin. */
          burnFrom={garminBurnOn(garmin, openKey) != null || isOwner(readProfile()) ? 'garmin' : 'average'}
          watchNote={isOwner(readProfile()) ? watchNoteFor(garmin, openKey) : null}
          /* The average belongs to the week, so it is shown where the week
             closes — on Sunday — and nowhere else, rather than on every day as
             a half-finished figure. */
          weekAvg={openIsSunday ? weekWeightAvg(state, year, monthIdx, openDay) : null}
          goal={openMonday ? (goalForWeek(state, openMonday) ?? planGoal()) : null}
          weekLabel={openMonday ? weekLabelOf(openMonday) : ''}
          left={openKey ? (calsLeft(state, openKey) ?? (planGoal() != null ? planGoal() - calTotals(days[openKey] || []).total : null)) : null}
          onAdd={(fields) => addEntry(openDay, fields)}
          onEdit={(entry, fields) => editEntry(openDay, entry, fields)}
          onDelete={(entry) => deleteEntry(openDay, entry)}
          onWeight={(patch) => saveWeight(openDay, patch)}
          onGoal={(cal) => saveGoal(openDay, cal)}
          onClose={() => setOpenDay(null)}
          saveFailed={saveFailed}
        />
      )}
      </>}
    </div>
  );
}
