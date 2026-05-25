import { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { FOODS } from '../data/foods';
import { WORKOUT_DAYS } from '../data/workouts';
import {
  loadReminders, saveReminders, scheduleReminders,
  syncRemindersToFirestore, clearFiredReminder, ALL_DAYS,
} from '../utils/notifications';

/* ─────────── Static Knowledge ─────────── */

const DAY_NAME_MAP = {
  monday: 'day-monday', mon: 'day-monday',
  tuesday: 'day-tuesday', tue: 'day-tuesday', tues: 'day-tuesday',
  wednesday: 'day-wednesday', wed: 'day-wednesday',
  thursday: 'day-thursday', thu: 'day-thursday', thurs: 'day-thursday',
  friday: 'day-friday', fri: 'day-friday',
  saturday: 'day-saturday', sat: 'day-saturday',
  sunday: 'day-sunday', sun: 'day-sunday',
};

const DAY_SHORT = {
  'day-monday': 'Monday', 'day-tuesday': 'Tuesday', 'day-wednesday': 'Wednesday',
  'day-thursday': 'Thursday', 'day-friday': 'Friday', 'day-saturday': 'Saturday',
  'day-sunday': 'Sunday',
};

const MEAL_TYPE_MAP = {
  breakfast: 'morning', morning: 'morning', am: 'morning', 'first meal': 'morning',
  lunch: 'lunch', noon: 'lunch', midday: 'lunch', '12pm': 'lunch', 'meal 2': 'lunch',
  dinner: 'dinner', evening: 'dinner', night: 'dinner',
  snack: 'snack', afternoon: 'snack',
};

const SKINCARE_AM = `✨ Your AM Skincare Routine:
1. Cleanser — COSRX Low pH Gel Cleanser (or Beauty of Joseon Relief Foam on sensitive days)
2. Toner — Some By Mi Yuja Niacin Niacinamide (or COSRX AHA/BHA Toner 3-4×/week)
3. Essence — COSRX Advanced Snail 96 Mucin Power Essence
4. Vitamin C Serum — Some By Mi Galactomyces Glow Serum (start Month 2, use 4-5×/week)
5. Moisturizer — COSRX Oil-Free Ultra Moisturizing Lotion
6. SPF 50+ — Beauty of Joseon Relief Sun (or Round Lab Birch Juice Sun Cream)`;

const SKINCARE_PM = `🌙 Your PM Skincare Routine:
1. Oil Cleanser — Banila Co Clean It Zero Purifying (removes SPF + pollution)
2. Foam Cleanser — COSRX Low pH Gel Cleanser (removes oil cleanser residue)
3. Toner/BHA — Some By Mi AHA BHA PHA 30 Days Miracle Toner (3-4× per week)
4. Essence — COSRX Advanced Snail 96 Mucin Power Essence
5. Eye Serum — Some By Mi Eye Serum (pat, never rub)
6. Moisturizer — COSRX Oil-Free Lotion (lighter nights) or Laneige Water Sleeping Mask (2-3×/week)`;

const SKINCARE_RETINOID = `💊 Your Retinoid Roadmap:
• Month 2: The Inkey List Retinol 0.025% — Saturdays only (sandwich method: moisturiser → retinol → moisturiser)
• Month 3-6: 0.05% (The Inkey List or Mediheal) — 2-3× per week
• Month 6-12: 0.1% Retinol or Adapalene (La Roche-Posay Effaclar or Differin) — 4-5×/week
⚠️ Never use BHA + retinol on the same night!`;

const SKINCARE_BODY = `🛁 Your Body Skincare:
• AM: Warm shower → Body wash (Human Nature Sunflower or Dove Sensitive) → Moisturise within 2 min (CeraVe Moisturizing Cream) → SPF on exposed skin (Biore UV Aqua Rich)
• PM: Regular moisturiser → 2-3 drops Bio-Oil on top
• 2×/week: St. Ives scrub in shower (Sun + Wed)
• Every night: Vaseline on heels and elbows after moisturiser
• Tue + Fri evenings: 5-min Bio-Oil massage on arms, thighs, abdomen`;

const HAIR_OILS_INFO = {
  camellia: `🌸 Camellia Oil — The daily shine oil. 3-4 drops massaged into scalp and lengths before bed or as a pre-wash treatment. Deeply conditions without greasiness, makes hair silky and soft. Great for colour-treated hair.`,
  rosemary: `🌿 Rosemary Oil — The growth oil. Always dilute: 2-3 drops mixed with a carrier oil (jojoba or coconut), massage into scalp. Clinically proven to promote hair growth comparable to minoxidil. Use 3×/week for best results.`,
  argan: `✨ Argan Oil — The shine + frizz serum. 2-3 drops on damp or dry hair ends. Never on the scalp. Rich in Vitamin E and oleic acid — seals the cuticle for glossy, frizz-free hair. Use as a finishing oil.`,
  jojoba: `💧 Jojoba Oil — The scalp balancer. Chemically identical to your scalp's natural sebum. 3-4 drops massaged directly into scalp to regulate oil production. Good for dry scalp or oily roots. Use 2×/week.`,
  coconut: `🥥 Coconut Oil — The deep conditioning mask. 1-2 tbsp applied root to tip, leave for 30 minutes minimum (up to overnight), then wash out with shampoo. Penetrates the hair shaft to prevent protein loss. Use as a pre-wash treatment 1×/week.`,
};

const JOY_INTROS = [
  "Hi gorgeous! 💕 I'm Joy — your personal wellness bestie!\n\nI can help you with:\n• 🏋️ Workout info & meal planning\n• 🔔 Manage your reminders\n• ✨ Skincare & hair care routines\n• 🧭 Navigate any section\n\nTry: \"what's my workout on Monday?\" or \"add chicken to Thursday lunch\" ✨",
];

const JOY_REPLIES = [
  "That's such a great point! 💕 I love your dedication — that's real goddess energy! 🌸",
  "Ooh yes, I'm totally here for that! ✨",
  "You're doing amazing, sweetie! 💪 Small steps = big glow-ups! 🌟",
  "Love that energy! 🔥 Your goals are valid and I'm rooting for you every single day!",
  "Okay, queen! 👑 I hear you. What else can I help you with? ✨",
  "You're asking the right questions, gorgeous! 🌸 That's how goddesses get results!",
  "Absolutely! 💫 Consistency is your superpower — and you clearly have it!",
  "I'm so proud of you for even asking! 🥺💕 That's growth right there!",
  "Yes, yes, YES! 🌺 Let's make that part of your routine!",
  "Honestly? You're incredible. 💕 Let's keep building this beautiful plan together!",
];

const SUGGEST_PROMPTS = [
  "What's my workout today? 💪",
  "Show my reminders 🔔",
  "What's my morning skincare? ✨",
  "Add chicken to Monday lunch",
];

/* ─────────── Utilities ─────────── */

function to12h(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`;
}

function parseTime(raw) {
  const s = raw.toLowerCase().replace(/\s+/g, '').trim();
  if (s === 'noon') return '12:00';
  if (s === 'midnight') return '00:00';
  const m = s.match(/^(\d{1,2})(?::(\d{2}))?(am|pm)$/);
  if (!m) return null;
  let h = parseInt(m[1]);
  const min = parseInt(m[2] || '0');
  if (m[3] === 'pm' && h !== 12) h += 12;
  if (m[3] === 'am' && h === 12) h = 0;
  if (h > 23 || min > 59) return null;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function extractTime(msg) {
  const patterns = [/\b(\d{1,2}:\d{2}\s*(?:am|pm))/i, /\b(\d{1,2}\s*(?:am|pm))/i, /\b(noon|midnight)\b/i];
  for (const pat of patterns) {
    const m = msg.match(pat);
    if (m) { const t = parseTime(m[1]); if (t) return t; }
  }
  return null;
}

function findDay(msg) {
  const lower = msg.toLowerCase();
  // "today" → current day
  if (/\btoday\b/.test(lower)) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return `day-${days[new Date().getDay()]}`;
  }
  if (/\btomorrow\b/.test(lower)) {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return `day-${days[(new Date().getDay() + 1) % 7]}`;
  }
  for (const [name, id] of Object.entries(DAY_NAME_MAP)) {
    if (lower.includes(name)) return id;
  }
  return null;
}

function findMealType(msg) {
  const lower = msg.toLowerCase();
  for (const [keyword, type] of Object.entries(MEAL_TYPE_MAP)) {
    if (lower.includes(keyword)) return type;
  }
  return null;
}

function findFood(nameInput) {
  const lower = nameInput.toLowerCase().trim();
  // Exact match first
  let found = FOODS.find(f => f.name.toLowerCase() === lower);
  if (found) return found;
  // Partial match
  found = FOODS.find(f => f.name.toLowerCase().includes(lower) || lower.includes(f.name.toLowerCase()));
  if (found) return found;
  // Word match (for multi-word inputs)
  const words = lower.split(/\s+/);
  found = FOODS.find(f => words.some(w => w.length > 3 && f.name.toLowerCase().includes(w)));
  if (found) return found;
  return null;
}

function findReminder(reminders, msg) {
  if (!reminders?.length) return null;
  const lower = msg.toLowerCase();
  for (const r of reminders) {
    if (lower.includes(r.label.toLowerCase())) return r;
  }
  for (const r of reminders) {
    const words = r.label.toLowerCase().split(/[\s\-—\/]+/).filter(w => w.length > 3);
    if (words.some(w => lower.includes(w))) return r;
  }
  return null;
}

function getTodayWorkout() {
  const idx = new Date().getDay(); // 0=Sun, 1=Mon ...
  const order = [6, 0, 1, 2, 3, 4, 5]; // Sun=index6 in WORKOUT_DAYS, Mon=0, ...
  return WORKOUT_DAYS[order[idx]];
}

/* ─────────── Command Parsers ─────────── */

function parseNavCommand(msg) {
  const lower = msg.toLowerCase();
  const navTrigger = /\b(go to|open|show me|take me to|navigate to|see|view)\b/i.test(lower);
  if (!navTrigger) return null;

  if (/\bworkout\b/.test(lower) || /\bexercise\b/.test(lower)) {
    const day = findDay(lower);
    return { section: 'workout', scrollTo: day || null };
  }
  if (/\bnutrition\b/.test(lower) || /\brecipes?\b/.test(lower)) {
    const tab = /\blight\b/.test(lower) ? 'light'
      : /\bmeat\b/.test(lower) || /\bprotein\b/.test(lower) ? 'meat'
      : /\brecipe\b/.test(lower) ? 'recipes'
      : /\bguide\b/.test(lower) ? 'guide'
      : /\bhydrat/.test(lower) ? 'hydration'
      : /\bsnack\b/.test(lower) ? 'snacks'
      : null;
    return { section: 'nutrition', tab };
  }
  if (/\bskincare\b/.test(lower) || /\bskin\b/.test(lower)) {
    const tab = /\bmorning\b|\bam\b/.test(lower) ? 'am'
      : /\bevening\b|\bpm\b|\bnight\b/.test(lower) ? 'pm'
      : /\bretinoid\b|\bretinol\b/.test(lower) ? 'retinoid'
      : /\banti.?ag/.test(lower) ? 'antiaging'
      : /\bbody\b/.test(lower) ? 'body'
      : null;
    return { section: 'skincare', tab };
  }
  if (/\bhair\b/.test(lower)) return { section: 'haircare', tab: null };
  if (/\bchallenge\b/.test(lower)) return { section: 'challenges', tab: null };
  if (/\bsetting\b/.test(lower) || /\bprofile\b/.test(lower)) return { section: 'settings', tab: null };
  if (/\bhome\b/.test(lower)) return { section: 'home', tab: null };
  return null;
}

function parseReminderCommand(msg, reminders) {
  const lower = msg.toLowerCase();
  if (/\b(list|show|what are|see)\b.{0,20}\b(reminders?|alarms?)\b/i.test(lower)
    || /\bmy reminders?\b/i.test(lower)) return { action: 'list' };

  if (/\b(change|set|move|update|reschedule|shift)\b/i.test(lower)) {
    const time = extractTime(lower);
    if (time) {
      const reminder = findReminder(reminders, lower);
      if (reminder) return { action: 'change_time', reminder, time };
      return { action: 'unknown_reminder', time };
    }
  }
  if (/\badd\b/i.test(lower) && /\b(reminder|alarm|notification)\b/i.test(lower)) {
    const time = extractTime(lower);
    const m = lower.match(/add\s+(?:a\s+)?(?:reminder|alarm|notification)\s+(?:for\s+|called\s+|named\s+)?(.+?)(?:\s+at\s+\d|\s*$)/i);
    const name = m?.[1]?.trim() || '';
    if (name && time) return { action: 'add', name, time };
    if (!time) return { action: 'add_no_time', name };
  }
  if (/\b(delete|remove|cancel)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'delete', reminder };
  }
  if (/\b(enable|turn on|activate)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'enable', reminder };
  }
  if (/\b(disable|turn off|deactivate|pause|mute|stop)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'disable', reminder };
  }
  return null;
}

function parseMealCommand(msg) {
  const lower = msg.toLowerCase();
  const hasAdd = /\badd\b/i.test(lower);
  const hasRemove = /\b(remove|delete|clear)\b/i.test(lower);
  const hasShow = /\b(show|what|list|see)\b/i.test(lower) && /\b(eat|meal|food|menu)\b/i.test(lower);

  if (!hasAdd && !hasRemove && !hasShow) return null;

  const day = findDay(lower);
  if (!day && !hasShow) return null;

  if (hasAdd) {
    // "add [food] to [day] [meal]" / "add [food] for [day]"
    const m = lower.match(/add\s+(.+?)\s+(?:to|for|on)\s+/i);
    const foodRaw = m?.[1]?.trim() || '';
    if (!foodRaw) return null;
    const food = findFood(foodRaw);
    const mealType = findMealType(lower);
    return { action: 'add_meal', day: day || 'day-monday', foodRaw, food, mealType };
  }
  if (hasRemove) {
    const m = lower.match(/(?:remove|delete|clear)\s+(.+?)\s+(?:from|on)\s+/i);
    const foodRaw = m?.[1]?.trim() || '';
    return { action: 'remove_meal', day, foodRaw };
  }
  if (hasShow) {
    return { action: 'show_meals', day: day || null };
  }
  return null;
}

function parseWorkoutInfoCommand(msg) {
  const lower = msg.toLowerCase();
  const isWorkoutQuery = /\b(workout|exercise|train|what.+do|how|explain|what is|tell me|describe)\b/i.test(lower)
    && (/\b(workout|exercise|exercises|sets|reps|training)\b/i.test(lower));
  if (!isWorkoutQuery) return null;
  const day = findDay(lower);
  const isTodayQuery = /\btoday\b/.test(lower);
  return { action: 'workout_info', day: day || (isTodayQuery ? findDay('today') : null) };
}

function parseSkinHairCommand(msg) {
  const lower = msg.toLowerCase();

  // Hair specific
  if (/\bhair\b/.test(lower)) {
    for (const [oilKey] of Object.entries(HAIR_OILS_INFO)) {
      if (lower.includes(oilKey)) return { section: 'hair', action: 'oil_info', oilKey };
    }
    if (/\btoday\b/.test(lower) || /\bschedule\b/.test(lower) || /\brotation\b/.test(lower) || /\bwhich\b/.test(lower))
      return { section: 'hair', action: 'today_oil' };
    if (/\btell me\b/.test(lower) || /\bwhat\b/.test(lower) || /\broutine\b/.test(lower))
      return { section: 'hair', action: 'overview' };
  }

  // Skincare specific
  if (/\bskin(care)?\b/.test(lower) || /\broutine\b/.test(lower) || /\bproduct\b/.test(lower)
    || /\bcleanser\b/.test(lower) || /\btoner\b/.test(lower) || /\bspf\b/.test(lower)
    || /\bsunscreen\b/.test(lower) || /\bmoisturiz/.test(lower) || /\bserum\b/.test(lower)
    || /\bretinoid\b|\bretinol\b/.test(lower)) {
    const tab = /\bmorning\b|\bam\b/.test(lower) ? 'am'
      : /\bevening\b|\bpm\b|\bnight\b/.test(lower) ? 'pm'
      : /\bretinoid\b|\bretinol\b/.test(lower) ? 'retinoid'
      : /\bbody\b/.test(lower) ? 'body'
      : /\bchange\b|\bswitch\b|\balternative\b/.test(lower) ? 'change'
      : null;
    return { section: 'skincare', action: 'info', tab };
  }
  return null;
}

/* ─────────── Persistence ─────────── */

function applyReminderUpdate(sorted) {
  saveReminders(sorted);
  scheduleReminders(sorted);
}

async function syncMealToFirestore(userId, dayId, items) {
  try {
    const update = {};
    update[`customMeals.${dayId}`] = items;
    await updateDoc(doc(db, 'users', userId), update);
  } catch {}
}

function readCustomMeals(dayId) {
  try { return JSON.parse(localStorage.getItem(`gp_meal_${dayId}`) || '[]'); } catch { return []; }
}

function writeCustomMeals(dayId, items) {
  localStorage.setItem(`gp_meal_${dayId}`, JSON.stringify(items));
}

/* ─────────── Reply builders ─────────── */

function buildWorkoutInfoReply(dayId) {
  const dayOrder = { 'day-monday': 0, 'day-tuesday': 1, 'day-wednesday': 2, 'day-thursday': 3, 'day-friday': 4, 'day-saturday': 5, 'day-sunday': 6 };
  const wd = WORKOUT_DAYS[dayOrder[dayId]];
  if (!wd) return "I couldn\'t find that day\'s workout 🌸 Try: \"what\'s my workout Monday?\"";
  const exList = wd.exercises.map((e, i) => `${i + 1}. ${e.name}`).join('\n');
  const mealLabel = wd.meals?.label || '';
  return `${wd.emoji} ${wd.day} — ${wd.title}\n\nExercises:\n${exList}\n\n🍽️ ${mealLabel}\n\nWant me to open this workout? Just say "go to ${DAY_SHORT[dayId]}" 💪`;
}

function buildSkincareReply(tab) {
  if (!tab || tab === 'am') return SKINCARE_AM + '\n\nWant me to open your AM Skincare section? 🌸';
  if (tab === 'pm') return SKINCARE_PM + '\n\nWant me to open your PM Skincare section? 🌙';
  if (tab === 'retinoid') return SKINCARE_RETINOID + '\n\nWant me to open your Retinoid Roadmap? 💊';
  if (tab === 'body') return SKINCARE_BODY + '\n\nWant me to open your Body Care section? 🛁';
  if (tab === 'change') return "I can\'t swap product recommendations directly since they\'re curated for your skin type! 💕 But your Skincare section lists alternatives for every step. Want me to open it? 🌸";
  return SKINCARE_AM + '\n\nFor PM or Retinoid, just ask "what\'s my PM routine?" 🌙';
}

function buildHairReply(cmd) {
  if (cmd.action === 'oil_info') {
    const info = HAIR_OILS_INFO[cmd.oilKey];
    return info ? `${info}\n\nWant me to open Hair Care for your full rotation calendar? 💆` : "I couldn\'t find that oil 🌸";
  }
  if (cmd.action === 'today_oil') {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = dayNames[new Date().getDay()];
    return `Your hair care uses a 2-week rotating schedule with Camellia, Rosemary, Argan, Jojoba, and Coconut oils! The exact oils for ${today} depend on which week you\'re in. Open Hair Care to see today\'s oils on the calendar! 💆🌸`;
  }
  return "Your hair care plan is a 2-week oil rotation with 5 oils:\n🌸 Camellia — daily shine\n🌿 Rosemary — hair growth (use 3×/week)\n✨ Argan — frizz control on ends\n💧 Jojoba — scalp balancer\n🥥 Coconut — deep conditioning mask\n\nAsk me about any specific oil or say \"go to hair care\" to see your full calendar! 💆";
}

function buildMealShowReply(dayId) {
  if (!dayId) return "Which day? Try: \"what do I eat Monday?\" or \"show Wednesday meals\" 🌸";
  const dayOrder = { 'day-monday': 0, 'day-tuesday': 1, 'day-wednesday': 2, 'day-thursday': 3, 'day-friday': 4, 'day-saturday': 5, 'day-sunday': 6 };
  const wd = WORKOUT_DAYS[dayOrder[dayId]];
  const mealLabel = wd?.meals?.label || '';
  const rows = wd?.meals?.rows?.map(r => `• ${r.time}: ${r.ingredients.map(i => i.name).join(', ')}`).join('\n') || '';

  const custom = readCustomMeals(dayId);
  const customText = custom.length
    ? '\n\n➕ Your additions:\n' + custom.map(c => `• ${c.emoji} ${c.name} (${c.meal})`).join('\n')
    : '';

  return `${DAY_SHORT[dayId]} meals — ${mealLabel}\n\n${rows}${customText}\n\nTo add something: "add chicken to ${DAY_SHORT[dayId]}" 💕`;
}

/* ─────────── Fallback reply ─────────── */

function joyReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('hello') || lower.includes('hi ') || lower.includes('hey') || lower.includes('hii'))
    return "Hiii gorgeous!! 💕🌸 I\'m Joy — your wellness bestie! What can I help you with today? ✨";
  if (lower.includes('thank') || lower.includes('amazing') || lower.includes('love you'))
    return "You\'re so welcome, my love!! 🥺💕 Now go be the goddess you are! 👑🌸✨";
  if (lower.includes('motivat') || lower.includes('stuck') || lower.includes('help') || lower.includes('hard'))
    return "Hey — you reached out instead of giving up, and THAT is goddess behaviour! 👑💕 One tiny step forward is still progress. I believe in you! 🌸✨";
  if (lower.includes('sleep') || lower.includes('rest') || lower.includes('tired'))
    return "Rest is sacred! 💤🌸 Your body repairs and grows stronger during sleep and rest days. Aim for 7.5–9 hours tonight, gorgeous!";
  if (lower.includes('remind') || lower.includes('alarm'))
    return "I can manage your reminders! Try:\n• \"change workout to 9am\"\n• \"add reminder Vitamins at 8am\"\n• \"delete [name] reminder\"\n• \"show my reminders\"\n\nWhat would you like? 🌸";
  if (lower.includes('meal') || lower.includes('eat') || lower.includes('food'))
    return "For meal info, try:\n• \"what do I eat Monday?\"\n• \"add chicken to Thursday lunch\"\n• \"show Wednesday meals\"\n\nI\'m ready! 🥗💕";
  return JOY_REPLIES[Math.floor(Math.random() * JOY_REPLIES.length)];
}

/* ─────────── Context memory ─────────── */

// Detects phrases meaning "take me to what we were just discussing"
function parseTakeMeThere(msg) {
  return /\b(take me there|go there|bring me there|open it|open that|let'?s go there|navigate there|take me|yes open|yes go|yes take|show me that)\b/i.test(msg);
}

/* ─────────── Component ─────────── */

export default function JoyAssistant({ forceOpen, onClose, user, onNavigate }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'joy', text: JOY_INTROS[0] }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [pos, setPos] = useState(() => {
    try { const s = localStorage.getItem('gp_joy_pos'); return s ? JSON.parse(s) : null; } catch { return null; }
  });
  const [dragMode, setDragMode] = useState(false);
  const dragModeRef = useRef(false);
  const pressTimerRef = useRef(null);
  const movedRef = useRef(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  // Remembers the last navigable topic discussed so "take me there" works
  const lastContextRef = useRef(null);

  useEffect(() => {
    if (pos) try { localStorage.setItem('gp_joy_pos', JSON.stringify(pos)); } catch {}
  }, [pos]);
  useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 100); }, [open]);

  useEffect(() => {
    if (!dragMode) return;
    function onMove(e) {
      if (e.cancelable) e.preventDefault();
      const t = e.touches?.[0] ?? e;
      movedRef.current = true;
      setPos({
        x: Math.max(8, Math.min(window.innerWidth - 76, t.clientX - 32)),
        y: Math.max(8, Math.min(window.innerHeight - 84, t.clientY - 40)),
      });
    }
    function onEnd() { dragModeRef.current = false; setDragMode(false); }
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('mousemove', onMove);
    document.addEventListener('touchend', onEnd);
    document.addEventListener('mouseup', onEnd);
    return () => {
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('touchend', onEnd);
      document.removeEventListener('mouseup', onEnd);
    };
  }, [dragMode]);

  function handleFabStart() {
    if (open) return;
    movedRef.current = false;
    pressTimerRef.current = setTimeout(() => {
      dragModeRef.current = true;
      setDragMode(true);
      navigator.vibrate?.(80);
    }, 1000);
  }
  function handleFabEnd() {
    clearTimeout(pressTimerRef.current);
    if (!dragModeRef.current && !movedRef.current) setOpen(true);
  }
  function closeModal() { setOpen(false); onClose?.(); }

  function send(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setTyping(true);

    setTimeout(async () => {
      setTyping(false);
      let reply = '';

      // 0. "Take me there" — use last discussed context
      if (parseTakeMeThere(msg)) {
        const ctx = lastContextRef.current;
        if (ctx) {
          const labels = { home: 'Home', workout: 'Workouts', nutrition: 'Nutrition', skincare: 'Skincare', haircare: 'Hair Care', challenges: 'Challenges', settings: 'Settings' };
          onNavigate?.(ctx.section, ctx.tab || null, ctx.scrollTo || null);
          closeModal();
          setMessages(prev => [...prev, { from: 'joy', text: `Taking you to ${ctx.label || labels[ctx.section] || ctx.section} now! 🌸✨` }]);
          return;
        }
        setMessages(prev => [...prev, { from: 'joy', text: "Hmm, I'm not sure where you'd like to go! Tell me what you'd like to see — workouts, skincare, nutrition, hair care? 🌸" }]);
        return;
      }

      // 1. Navigation
      const nav = parseNavCommand(msg);
      if (nav) {
        const labels = { home: 'Home', workout: 'Workouts', nutrition: 'Nutrition', skincare: 'Skincare', haircare: 'Hair Care', challenges: 'Challenges', settings: 'Settings' };
        onNavigate?.(nav.section, nav.tab, nav.scrollTo);
        closeModal();
        setMessages(prev => [...prev, { from: 'joy', text: `Taking you to ${labels[nav.section] || nav.section}${nav.tab ? ` (${nav.tab})` : ''}${nav.scrollTo ? ` · ${DAY_SHORT[nav.scrollTo] || nav.scrollTo}` : ''} now! 🌸✨` }]);
        return;
      }

      // 2. Reminders
      const reminders = loadReminders();
      const remCmd = parseReminderCommand(msg, reminders);
      if (remCmd) {
        switch (remCmd.action) {
          case 'list': {
            const active = reminders.filter(r => r.enabled);
            reply = active.length
              ? `Your active reminders:\n${active.map(r => `${r.emoji} ${r.label} — ${to12h(r.time)}`).join('\n')}\n\nSay "change [name] to [time]" to update any of them! 💕`
              : 'No active reminders yet. Say "add reminder [name] at [time]" to create one! 🌸';
            break;
          }
          case 'change_time': {
            const updated = reminders.map(r => r.id === remCmd.reminder.id ? { ...r, time: remCmd.time } : r);
            const sorted = [...updated].sort((a, b) => a.time < b.time ? -1 : 1);
            applyReminderUpdate(sorted);
            if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
            try { clearFiredReminder(remCmd.reminder.id); } catch {}
            reply = `Done! "${remCmd.reminder.label}" moved to ${to12h(remCmd.time)} 🌸`;
            break;
          }
          case 'unknown_reminder':
            reply = `I couldn\'t find a matching reminder. Try saying the full name, e.g. "change workout to ${to12h(remCmd.time)}" 🌸`;
            break;
          case 'add': {
            const newR = { id: `joy_${Date.now()}`, emoji: '⏰', label: remCmd.name, time: remCmd.time, enabled: true, body: null, days: ALL_DAYS };
            const sorted = [...reminders, newR].sort((a, b) => a.time < b.time ? -1 : 1);
            applyReminderUpdate(sorted);
            if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
            reply = `Added! "${remCmd.name}" set for ${to12h(remCmd.time)} 🔔✨`;
            break;
          }
          case 'add_no_time':
            reply = `I need a time! Try: "add reminder ${remCmd.name || 'Vitamins'} at 8am" 🌸`;
            break;
          case 'delete': {
            const sorted = reminders.filter(r => r.id !== remCmd.reminder.id).sort((a, b) => a.time < b.time ? -1 : 1);
            applyReminderUpdate(sorted);
            if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
            reply = `"${remCmd.reminder.label}" reminder deleted! 💫`;
            break;
          }
          case 'enable': {
            const sorted = reminders.map(r => r.id === remCmd.reminder.id ? { ...r, enabled: true } : r).sort((a, b) => a.time < b.time ? -1 : 1);
            applyReminderUpdate(sorted);
            if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
            reply = `"${remCmd.reminder.label}" is back on! 🔔🌸`;
            break;
          }
          case 'disable': {
            const sorted = reminders.map(r => r.id === remCmd.reminder.id ? { ...r, enabled: false } : r).sort((a, b) => a.time < b.time ? -1 : 1);
            applyReminderUpdate(sorted);
            if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
            reply = `"${remCmd.reminder.label}" paused 🔕 Turn it back on anytime!`;
            break;
          }
          default: reply = joyReply(msg);
        }
        setMessages(prev => [...prev, { from: 'joy', text: reply }]);
        return;
      }

      // 3. Workout meals (add/remove/show)
      const mealCmd = parseMealCommand(msg);
      if (mealCmd) {
        if (mealCmd.day) lastContextRef.current = { section: 'workout', scrollTo: mealCmd.day, tab: null, label: `${DAY_SHORT[mealCmd.day] || 'that day'}\'s workout` };
        if (mealCmd.action === 'show_meals') {
          reply = buildMealShowReply(mealCmd.day);
        } else if (mealCmd.action === 'add_meal') {
          const { day, foodRaw, food, mealType } = mealCmd;
          const current = readCustomMeals(day);
          const duplicate = current.some(c => c.name.toLowerCase() === (food?.name || foodRaw).toLowerCase());
          if (duplicate) {
            reply = `${food?.emoji || '🍽️'} ${food?.name || foodRaw} is already in ${DAY_SHORT[day]}\'s meals! 💕`;
          } else {
            const item = {
              name: food?.name || foodRaw.charAt(0).toUpperCase() + foodRaw.slice(1),
              emoji: food?.emoji || '🍽️',
              meal: mealType || food?.meal || 'lunch',
            };
            const updated = [...current, item];
            writeCustomMeals(day, updated);
            if (user?.uid) await syncMealToFirestore(user.uid, day, updated);
            reply = `Added ${item.emoji} ${item.name} to ${DAY_SHORT[day]}\'s ${item.meal} meal! 💕\n\nSay "go to ${DAY_SHORT[day]} workout" to see it, or "show ${DAY_SHORT[day]} meals" to list everything!`;
          }
        } else if (mealCmd.action === 'remove_meal') {
          const { day, foodRaw } = mealCmd;
          const current = readCustomMeals(day);
          const match = current.find(c => c.name.toLowerCase().includes(foodRaw.toLowerCase()) || foodRaw.toLowerCase().includes(c.name.toLowerCase()));
          if (!match) {
            reply = `I couldn\'t find "${foodRaw}" in ${DAY_SHORT[day]}\'s custom meals 🌸 Say "show ${DAY_SHORT[day]} meals" to see what\'s there.`;
          } else {
            const updated = current.filter(c => c.name !== match.name);
            writeCustomMeals(day, updated);
            if (user?.uid) await syncMealToFirestore(user.uid, day, updated);
            reply = `Removed ${match.emoji} ${match.name} from ${DAY_SHORT[day]}\'s meals! 💫`;
          }
        }
        setMessages(prev => [...prev, { from: 'joy', text: reply }]);
        return;
      }

      // 4. Workout info (what's my workout on X)
      const wkCmd = parseWorkoutInfoCommand(msg);
      if (wkCmd) {
        const wkDayId = wkCmd.day || (['day-sunday','day-monday','day-tuesday','day-wednesday','day-thursday','day-friday','day-saturday'][new Date().getDay()]);
        reply = buildWorkoutInfoReply(wkDayId);
        lastContextRef.current = { section: 'workout', scrollTo: wkDayId, tab: null, label: `${DAY_SHORT[wkDayId]} workout` };
        setMessages(prev => [...prev, { from: 'joy', text: reply }]);
        return;
      }

      // 5. Skincare / Hair info
      const shCmd = parseSkinHairCommand(msg);
      if (shCmd) {
        if (shCmd.section === 'skincare') {
          reply = buildSkincareReply(shCmd.tab);
          const tabLabel = { am: 'AM Skincare', pm: 'PM Skincare', retinoid: 'Retinoid Roadmap', body: 'Body Care', antiaging: 'Anti-Aging' };
          lastContextRef.current = { section: 'skincare', tab: shCmd.tab, label: tabLabel[shCmd.tab] || 'Skincare' };
        } else {
          reply = buildHairReply(shCmd);
          lastContextRef.current = { section: 'haircare', tab: null, label: 'Hair Care' };
        }
        setMessages(prev => [...prev, { from: 'joy', text: reply }]);
        return;
      }

      // 6. Fallback
      setMessages(prev => [...prev, { from: 'joy', text: joyReply(msg) }]);
    }, 700 + Math.random() * 600);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  const fabStyle = pos ? { left: pos.x, top: pos.y, bottom: 'auto', right: 'auto' } : {};

  return (
    <>
      {!open && (
        <button
          className={`joy-fab${dragMode ? ' joy-drag-ready' : ''}`}
          style={fabStyle}
          onMouseDown={handleFabStart}
          onMouseUp={handleFabEnd}
          onTouchStart={handleFabStart}
          onTouchEnd={handleFabEnd}
          onContextMenu={e => e.preventDefault()}
          aria-label="Open Joy assistant"
        >
          <span className="joy-fab-emoji">🥰</span>
          <span className="joy-fab-name">Joy</span>
        </button>
      )}

      {open && (
        <div className="joy-overlay" onClick={e => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="joy-modal">
            <div className="joy-header">
              <div className="joy-header-avatar">🥰</div>
              <div className="joy-header-info">
                <div className="joy-header-name">Joy ✨</div>
                <div className="joy-header-status">
                  <div className="joy-status-dot" />
                  Your wellness bestie · always here!
                </div>
              </div>
              <button className="joy-header-close" onClick={closeModal}>✕</button>
            </div>

            <div className="joy-messages">
              {messages.map((m, i) => (
                <div key={i} className={`joy-msg joy-msg-${m.from}`}>
                  {m.from === 'joy' && <div className="joy-msg-avatar">🥰</div>}
                  <div className="joy-msg-bubble" style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
                </div>
              ))}
              {typing && (
                <div className="joy-msg joy-msg-joy">
                  <div className="joy-msg-avatar">🌸</div>
                  <div className="joy-msg-bubble">
                    <div className="joy-typing">
                      <div className="joy-typing-dot" />
                      <div className="joy-typing-dot" />
                      <div className="joy-typing-dot" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 2 && !typing && (
              <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {SUGGEST_PROMPTS.map((p, i) => (
                  <button key={i} onClick={() => send(p)} style={{
                    padding: '5px 12px',
                    border: '1px solid rgba(255,92,157,0.25)',
                    borderRadius: 16,
                    background: 'rgba(255,92,157,0.07)',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 11.5,
                    color: 'var(--rose)',
                    cursor: 'pointer',
                  }}>{p}</button>
                ))}
              </div>
            )}

            <div className="joy-input-row">
              <input
                ref={inputRef}
                className="joy-input"
                type="text"
                placeholder="Ask Joy anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                disabled={typing}
              />
              <button className="joy-send-btn" onClick={() => send()} disabled={typing || !input.trim()}>➤</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
