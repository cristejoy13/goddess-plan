import { getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { db, getAppMessaging } from '../firebase';

const STORAGE_KEY = 'gp_reminders';
const FIRED_KEY   = 'gp_fired_reminders';
const VAPID_KEY   = import.meta.env.VITE_VAPID_KEY;

/* Register this device for FCM push — saves token to Firestore */
export async function registerFCMToken(userId) {
  try {
    const messaging = await getAppMessaging();
    if (!messaging || !VAPID_KEY) return null;
    const swReg = await navigator.serviceWorker.ready;
    const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: swReg });
    if (token) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      await setDoc(doc(db, 'fcm_tokens', userId), { token, timezone, updatedAt: new Date().toISOString() }, { merge: true });
      return token;
    }
  } catch (e) {
    console.error('FCM registration failed:', e);
  }
  return null;
}

/* Sync full reminder data to Firestore (cross-device + Cloud Functions) */
export async function syncRemindersToFirestore(userId, reminders) {
  try {
    await setDoc(doc(db, 'users', userId), {
      remindersV2: reminders.map(({ id, emoji, label, enabled, time, body }) =>
        ({ id, emoji, label, enabled, time, body: body ?? null })),
    }, { merge: true });
  } catch {}
}

export const DEFAULT_REMINDERS = [
  { id: 'sunlight',  emoji: '☀️',  label: 'Morning Sunlight',   time: '06:30', enabled: true,
    body: 'Get 10–20 min of morning sunlight to anchor your circadian rhythm! 🌿' },
  { id: 'am_skin',   emoji: '✨',  label: 'AM Skincare',        time: '07:00', enabled: true,
    body: 'AM routine time — cleanser, toner, vitamin C, sunscreen! 🌸' },
  { id: 'breakfast', emoji: '🥣',  label: 'Breakfast (Meal 1)', time: '07:30', enabled: true,
    body: 'Fuel up with your first meal of the day, goddess! 💕' },
  { id: 'workout',   emoji: '💪',  label: 'Workout Time',       time: '08:00', enabled: true,
    body: null }, // dynamic per day-of-week
  { id: 'lunch',     emoji: '🥗',  label: 'Lunch (Meal 2)',     time: '12:00', enabled: true,
    body: 'Midday nourishment! Stay hydrated too 💧' },
  { id: 'snack',     emoji: '🍌',  label: 'Afternoon Snack',    time: '14:30', enabled: true,
    body: 'Snack time — banana nice cream or chia pudding! 💕' },
  { id: 'last_meal', emoji: '🍽️', label: 'Last Meal (Meal 4)', time: '16:00', enabled: true,
    body: 'Last meal of the day — keep it light and nourishing! 🌿' },
  { id: 'pm_skin',   emoji: '🌙',  label: 'PM Skincare',        time: '20:00', enabled: true,
    body: 'Evening glow-up! Double cleanse, retinoid, moisturizer 🌸' },
  { id: 'wind_down', emoji: '💆', label: 'Wind Down',           time: '21:00', enabled: true,
    body: 'Dim the lights, no screens, gentle stretch 💤' },
  { id: 'sleep',     emoji: '😴',  label: 'Sleep Time',         time: '21:30', enabled: true,
    body: 'Beauty sleep starts now! Aim for 7.5–9 hours 🌙' },
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
    return saved.map(s => {
      const def = DEFAULT_REMINDERS.find(d => d.id === s.id);
      if (def) {
        // Saved label/emoji overrides the default (for renamed reminders)
        return { ...def, enabled: s.enabled, time: s.time, label: s.label ?? def.label, emoji: s.emoji ?? def.emoji };
      }
      // User-added custom reminder — use it as-is
      return { emoji: '⏰', body: null, ...s };
    });
  } catch {
    return DEFAULT_REMINDERS;
  }
}

export function saveReminders(reminders) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(
    reminders.map(({ id, emoji, label, enabled, time, body }) =>
      ({ id, emoji, label, enabled, time, body: body ?? null }))
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

  reminders.filter(r => r.enabled && r.time === hm && !fired[r.id]).forEach(r => {
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
