const functions = require('firebase-functions');
const admin     = require('firebase-admin');

admin.initializeApp();

const DEFAULT_REMINDERS = [
  { id: 'sunlight',  emoji: '☀️',  label: 'Morning Sunlight',   time: '06:30', body: 'Get 10–20 min of morning sunlight to anchor your circadian rhythm! 🌿' },
  { id: 'am_skin',   emoji: '✨',  label: 'AM Skincare',         time: '07:00', body: 'AM routine time — cleanser, toner, vitamin C, sunscreen! 🌸' },
  { id: 'breakfast', emoji: '🥣',  label: 'Breakfast (Meal 1)',  time: '07:30', body: 'Fuel up with your first meal of the day, goddess! 💕' },
  { id: 'workout',   emoji: '💪',  label: 'Workout Time',        time: '08:00', body: 'Time to move, goddess! 🔥' },
  { id: 'lunch',     emoji: '🥗',  label: 'Lunch (Meal 2)',      time: '12:00', body: 'Midday nourishment! Stay hydrated too 💧' },
  { id: 'snack',     emoji: '🍌',  label: 'Afternoon Snack',     time: '14:30', body: 'Snack time — banana nice cream or chia pudding! 💕' },
  { id: 'last_meal', emoji: '🍽️', label: 'Last Meal',           time: '16:00', body: 'Last meal of the day — keep it light and nourishing! 🌿' },
  { id: 'pm_skin',   emoji: '🌙',  label: 'PM Skincare',         time: '20:00', body: 'Evening glow-up! Double cleanse, retinoid, moisturizer 🌸' },
  { id: 'wind_down', emoji: '💆', label: 'Wind Down',            time: '21:00', body: 'Dim the lights, no screens, gentle stretch 💤' },
  { id: 'sleep',     emoji: '😴',  label: 'Sleep Time',          time: '21:30', body: 'Beauty sleep starts now! Aim for 7.5–9 hours 🌙' },
];

// Convert current UTC time to HH:MM in the user's timezone
function getLocalHM(timezone) {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const h = parts.find(p => p.type === 'hour')?.value ?? '00';
    const m = parts.find(p => p.type === 'minute')?.value ?? '00';
    return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
  } catch {
    return null;
  }
}

// Runs every minute — checks each user's reminder schedule and sends FCM push
exports.sendScheduledReminders = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async () => {
    const tokensSnap = await admin.firestore().collection('fcm_tokens').get();
    if (tokensSnap.empty) return null;

    await Promise.all(tokensSnap.docs.map(async tokenDoc => {
      const userId = tokenDoc.id;
      const { token, timezone = 'UTC' } = tokenDoc.data();
      if (!token) return;

      const localHM = getLocalHM(timezone);
      if (!localHM) return;

      // Load per-user reminder settings; fall back to defaults
      let reminders = DEFAULT_REMINDERS;
      try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const saved   = userDoc.data()?.reminders;
        if (saved?.length) {
          reminders = DEFAULT_REMINDERS.map(def => {
            const found = saved.find(r => r.id === def.id);
            return found ? { ...def, enabled: found.enabled, time: found.time } : def;
          });
        }
      } catch {}

      const triggered = reminders.filter(r => r.enabled !== false && r.time === localHM);

      for (const reminder of triggered) {
        try {
          await admin.messaging().send({
            token,
            notification: {
              title: `${reminder.emoji} ${reminder.label}`,
              body: reminder.body ?? '',
            },
            webpush: {
              notification: {
                icon: 'https://goddess-plan.vercel.app/icon-192.png',
                badge: 'https://goddess-plan.vercel.app/icon-192.png',
                tag: reminder.id,
              },
              fcmOptions: { link: 'https://goddess-plan.vercel.app/' },
              data: { tag: reminder.id },
            },
          });
        } catch (e) {
          // Remove stale/invalid tokens automatically
          if (e.errorInfo?.code === 'messaging/registration-token-not-registered') {
            await tokenDoc.ref.delete();
          }
        }
      }
    }));

    return null;
  });
