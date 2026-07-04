const STORAGE_KEY = 'gp_reminders';
const FIRED_KEY   = 'gp_fired_reminders';

// days: JS getDay() values  0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
// Strength/Sprint days: Mon(1) Wed(3) Thu(4) — 3 meals: 8am, 12pm, 3pm
// Pilates/Rest/Bike days: Tue(2) Fri(5) Sat(6) Sun(0) — 2 meals: 12pm, 3pm (fast until noon)
export const ALL_DAYS  = [0, 1, 2, 3, 4, 5, 6];
const EAT_DAYS  = [1, 3, 4]; // Strength + Sprints: breakfast fires at 8am
const FAST_DAYS = [0, 2, 5, 6]; // Pilates + Rest: first meal at noon

export const DEFAULT_REMINDERS = [
  { id: 'sunlight',      emoji: '☀️',  label: 'Morning Sunlight',    time: '06:30', enabled: true, days: ALL_DAYS,
    body: 'Get 10–20 min of morning sunlight to anchor your circadian rhythm! 🌿' },
  { id: 'am_skin',       emoji: '✨',  label: 'AM Skincare',          time: '07:00', enabled: true, days: ALL_DAYS,
    body: 'AM routine time — cleanser, toner, vitamin C, sunscreen! 🌸' },
  // Strength/Sprint days (Mon/Wed/Thu) — eat anytime, breakfast at 8am
  { id: 'breakfast',     emoji: '🥣',  label: 'Meal 1 — Breakfast',  time: '08:00', enabled: true, days: EAT_DAYS,
    body: 'Strength day fuel! Protein first — PFBS 🥚💪 Walk after eating 🚶' },
  { id: 'workout',       emoji: '💪',  label: 'Workout Time',         time: '08:30', enabled: true, days: EAT_DAYS,
    body: null },
  { id: 'lunch',         emoji: '🥗',  label: 'Meal 2 — 12 PM',      time: '12:00', enabled: true, days: EAT_DAYS,
    body: 'Meal 2 — protein + fiber + veg! 80% full 💕 Walk after 🚶' },
  // Light days (Tue/Thu/Sun) — 12 PM · Sunset
  { id: 'workout_light', emoji: '🧘',  label: 'Workout Time',         time: '07:00', enabled: true, days: FAST_DAYS,
    body: null },
  { id: 'fast_break',    emoji: '🍽️', label: 'First Meal — 12 PM',  time: '12:00', enabled: true, days: FAST_DAYS,
    body: 'Eating window open! First meal — light, fruit + collagen water 🍉 Walk after 🚶' },
  // Shared — last meal 5 PM every day (9-2-5 method)
  { id: 'last_meal',     emoji: '🌙',  label: 'Last Meal — 5 PM',    time: '17:00', enabled: true, days: ALL_DAYS,
    body: 'Last meal of the day! Walk 10 min after 🚶 No food after 5 PM — Goddess rule 🌿' },
  { id: 'pm_skin',       emoji: '✨',  label: 'PM Skincare',          time: '20:00', enabled: true, days: ALL_DAYS,
    body: 'Evening glow-up! Double cleanse, retinoid, moisturizer 🌸' },
  { id: 'wind_down',     emoji: '💆',  label: 'Wind Down',            time: '21:00', enabled: true, days: ALL_DAYS,
    body: 'Dim the lights, no screens, gentle stretch 💤' },
  { id: 'sleep',         emoji: '😴',  label: 'Sleep Time',           time: '22:00', enabled: true, days: ALL_DAYS,
    body: 'Beauty sleep — 7.5 to 9 hours, non-negotiable! 🌙' },
];

const WORKOUT_BODIES = [
  'Rest & reset Sunday 🌸 — gentle walk or yoga today! 💕',
  'Strength Day 💪 — glutes & upper body! Check your workout! 🔥',
  'Pilates Day 🧘‍♀️ — flow, core, and grace! You\'ve got this!',
  'Sprint Intervals 🏃‍♀️ — short, intense, powerful! Let\'s GO! ⚡',
  'Strength Day 💪 — round two! Push harder than Monday! 🔥',
  'Pilates Day 🧘‍♀️ — end the week with flow and strength! 🌸',
  'Rest day 💤 — active recovery, walk, or stretch today!',
];

export function loadReminders() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved || !Array.isArray(saved) || saved.length === 0) return DEFAULT_REMINDERS;
    const list = saved.map(s => {
      const def = DEFAULT_REMINDERS.find(d => d.id === s.id);
      if (def) {
        return {
          ...def,
          enabled: s.enabled,
          time: s.time,
          label: s.label ?? def.label,
          emoji: s.emoji ?? def.emoji,
          days: s.days ?? def.days,
        };
      }
      return { emoji: '⏰', body: null, days: [0,1,2,3,4,5,6], ...s };
    });
    return list.sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0);
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(
    reminders.map(({ id, emoji, label, enabled, time, body, days }) =>
      ({ id, emoji, label, enabled, time, body: body ?? null, days: days ?? [0,1,2,3,4,5,6] }))
  ));
}

export function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const t = ctx.currentTime + i * 0.18;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0);
      osc.start(t);
      osc.stop(t + 1.0);
    });
  } catch { /* AudioContext not available */ }
}

function getReminderBody(reminder) {
  if (reminder.id === 'workout') return WORKOUT_BODIES[new Date().getDay()];
  return reminder.body;
}

function fireReminder(reminder) {
  playChime();
  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(`${reminder.emoji} ${reminder.label}`, {
        body: getReminderBody(reminder),
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: reminder.id,
      });
    } catch { /* unsupported on this browser */ }
  }
}

function nowHM() {
  const n = new Date();
  return `${String(n.getHours()).padStart(2, '0')}:${String(n.getMinutes()).padStart(2, '0')}`;
}

function checkAndFire(reminders) {
  const hm    = nowHM();
  const today = new Date().toDateString();
  let fired;
  try { fired = JSON.parse(localStorage.getItem(FIRED_KEY)) || {}; } catch { fired = {}; }
  if (fired.date !== today) fired = { date: today };

  const todayDow = new Date().getDay();
  reminders.filter(r => r.enabled && r.time === hm && !fired[r.id] && (r.days ?? ALL_DAYS).includes(todayDow)).forEach(r => {
    fired[r.id] = true;
    fireReminder(r);
  });
  localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
}

let intervalId = null;

export function scheduleReminders(reminders) {
  if (intervalId) clearInterval(intervalId);
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  checkAndFire(reminders); // immediate check in case app opened mid-minute
  intervalId = setInterval(() => checkAndFire(reminders), 60_000);
}

export function stopReminders() {
  if (intervalId) { clearInterval(intervalId); intervalId = null; }
}

/* Clear a reminder's "already fired today" flag so it can fire at its new time */
export function clearFiredReminder(id) {
  try {
    const fired = JSON.parse(localStorage.getItem(FIRED_KEY)) || {};
    delete fired[id];
    localStorage.setItem(FIRED_KEY, JSON.stringify(fired));
  } catch {}
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  return Notification.requestPermission();
}
