import { useState, useRef, useEffect } from 'react';
import {
  loadReminders, saveReminders, scheduleReminders,
  syncRemindersToFirestore, clearFiredReminder, ALL_DAYS,
} from '../utils/notifications';

const JOY_INTROS = [
  "Hi gorgeous! 💕 I'm Joy — your personal wellness bestie! Ask me anything about your plan, or tell me what you'd like to change. Try \"change workout to 9am\" or \"add reminder Vitamins at 8am\"! ✨",
];

const JOY_REPLIES = [
  "That's such a great point! 💕 I love your dedication — that's real goddess energy! 🌸",
  "Ooh yes, I'm totally here for that! ✨ Let me note that down for your plan!",
  "You're doing amazing, sweetie! 💪 Small steps = big glow-ups! 🌟",
  "Love that energy! 🔥 Your goals are valid and I'm rooting for you every single day!",
  "Okay, queen! 👑 I hear you. That's going in your plan right now! ✨",
  "You're asking the right questions, gorgeous! 🌸 That's how goddesses get results!",
  "Absolutely! 💫 Consistency is your superpower — and you clearly have it!",
  "I'm so proud of you for even asking! 🥺💕 That's growth right there!",
  "Yes, yes, YES! 🌺 Let's make that part of your routine!",
  "Honestly? You're incredible. 💕 Let's keep building this beautiful plan together!",
];

const SUGGEST_PROMPTS = [
  "Show my reminders 🔔",
  "Change workout to 9am",
  "Go to Workouts 💪",
  "Tell me about my hair care routine 💆",
];

/* ── Time helpers ── */
function to12h(time) {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${period}`;
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
  const patterns = [
    /\b(\d{1,2}:\d{2}\s*(?:am|pm))/i,
    /\b(\d{1,2}\s*(?:am|pm))/i,
    /\b(noon|midnight)\b/i,
  ];
  for (const pat of patterns) {
    const m = msg.match(pat);
    if (m) {
      const t = parseTime(m[1]);
      if (t) return t;
    }
  }
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

function parseReminderCommand(msg, reminders) {
  const lower = msg.toLowerCase();

  // List
  if (/\b(list|show|what are|see)\b.{0,20}\b(reminders?|alarms?)\b/i.test(lower)
    || /\bmy reminders?\b/i.test(lower)) {
    return { action: 'list' };
  }

  // Change time
  if (/\b(change|set|move|update|reschedule|shift|put)\b/i.test(lower)) {
    const time = extractTime(lower);
    if (time) {
      const reminder = findReminder(reminders, lower);
      if (reminder) return { action: 'change_time', reminder, time };
      return { action: 'unknown_reminder', time };
    }
  }

  // Add reminder
  if (/\badd\b/i.test(lower) && /\b(reminder|alarm|notification)\b/i.test(lower)) {
    const time = extractTime(lower);
    // Extract name: text between "add [a] reminder [for/called]" and "at [time]"
    const nameMatch = lower.match(
      /add\s+(?:a\s+)?(?:reminder|alarm|notification)\s+(?:for\s+|called\s+|named\s+)?(.+?)(?:\s+at\s+\d|\s*$)/i
    );
    const name = nameMatch?.[1]?.trim() || '';
    if (name && time) return { action: 'add', name, time };
    if (!time) return { action: 'add_no_time', name };
  }

  // Delete
  if (/\b(delete|remove|cancel)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'delete', reminder };
  }

  // Enable
  if (/\b(enable|turn on|activate)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'enable', reminder };
  }

  // Disable
  if (/\b(disable|turn off|deactivate|pause|mute|stop)\b/i.test(lower)) {
    const reminder = findReminder(reminders, lower);
    if (reminder) return { action: 'disable', reminder };
  }

  return null;
}

function parseNavCommand(msg) {
  const lower = msg.toLowerCase();
  if (!/\b(go to|open|show me|take me to|navigate to)\b/i.test(lower)) return null;
  if (/\bworkout\b/.test(lower)) return 'workout';
  if (/\bnutrition\b/.test(lower) || /\bmeal\b/.test(lower)) return 'nutrition';
  if (/\bskincare\b/.test(lower) || /\bskin\b/.test(lower)) return 'skincare';
  if (/\bhair\b/.test(lower)) return 'haircare';
  if (/\bchallenge\b/.test(lower)) return 'challenges';
  if (/\bsetting\b/.test(lower) || /\bprofile\b/.test(lower)) return 'settings';
  return null;
}

function joyReply(msg) {
  const lower = msg.toLowerCase();
  if (lower.includes('hair') || lower.includes('oil') || lower.includes('camellia') || lower.includes('rosemary'))
    return "Your hair care routine is *chef\'s kiss*! 💆✨ You\'ve got camellia, rosemary, argan, jojoba, and coconut in your rotation. Tap Hair Care in the menu to see your full monthly calendar! 🌸";
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('gym') || lower.includes('train'))
    return "Let\'s get those gains, goddess! 💪🌸 Your plan has strength on Mon & Thu, Pilates on Tue & Fri, sprints on Wed, and rest on weekends. Head to Workouts to see your full week! 🔥";
  if (lower.includes('nutrition') || lower.includes('food') || lower.includes('eat') || lower.includes('meal') || lower.includes('recipe'))
    return "Nourish to flourish, babe! 🥗✨ Protein-rich meals on strength/sprint days (Mon/Wed/Thu), lighter meals on Pilates/rest days. Check Nutrition for all your recipes! 💕";
  if (lower.includes('skin') || lower.includes('skincare') || lower.includes('face') || lower.includes('moistur'))
    return "Glowing skin is always in! ✨🌸 Your skincare routine has a full AM and PM routine, weekly treatments, and a retinoid roadmap. Pop over to Skincare to see everything! 💕";
  if (lower.includes('anti') || lower.includes('aging') || lower.includes('age') || lower.includes('sleep') || lower.includes('cortisol') || lower.includes('hormone'))
    return "Aging backwards is the plan! 🌿👑 Your Anti-Aging section covers sleep protocol, cortisol management, hormone-protective eating, and a full supplement stack. Check it out! ✨";
  if (lower.includes('challenge') || lower.includes('habit') || lower.includes('monthly'))
    return "Monthly challenges are my FAVOURITE! 🔥 They build one powerful habit each month. Go to Challenges to check off your days — every tick counts! 💕";
  if (lower.includes('rest') || lower.includes('recovery') || lower.includes('relax') || lower.includes('tired'))
    return "Rest is sacred in your goddess plan! 💤🌸 Your body repairs and grows stronger on rest days. Honour them! 💕";
  if (lower.includes('motivation') || lower.includes('help') || lower.includes('stuck') || lower.includes('hard'))
    return "Hey — you reached out instead of giving up, and THAT is goddess behaviour! 👑💕 One tiny step forward is still progress. I believe in you! 🌸✨";
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('hii'))
    return "Hiii gorgeous!! 💕🌸 I\'m Joy — your wellness bestie! What can I help you with today? ✨";
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('love') || lower.includes('amazing'))
    return "You\'re so welcome, my love!! 🥺💕 Now go be the goddess you are! 👑🌸✨";
  if (lower.includes('remind') || lower.includes('alarm') || lower.includes('notification'))
    return "I can manage your reminders! Try:\n• \"change workout to 9am\"\n• \"add reminder Vitamins at 8am\"\n• \"delete snack reminder\"\n• \"show my reminders\"\n\nWhat would you like? 🌸";
  return JOY_REPLIES[Math.floor(Math.random() * JOY_REPLIES.length)];
}

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

  useEffect(() => {
    if (pos) try { localStorage.setItem('gp_joy_pos', JSON.stringify(pos)); } catch {}
  }, [pos]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  function closeModal() {
    setOpen(false);
    onClose?.();
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

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
    function onEnd() {
      dragModeRef.current = false;
      setDragMode(false);
    }
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

  function applyReminderUpdate(updated) {
    const sorted = [...updated].sort((a, b) => a.time < b.time ? -1 : a.time > b.time ? 1 : 0);
    saveReminders(sorted);
    scheduleReminders(sorted);
    if (user?.uid) syncRemindersToFirestore(user.uid, sorted);
  }

  function send(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      // Navigation command
      const nav = parseNavCommand(msg);
      if (nav) {
        const labels = { workout: 'Workouts', nutrition: 'Nutrition', skincare: 'Skincare', haircare: 'Hair Care', challenges: 'Challenges', settings: 'Settings' };
        onNavigate?.(nav);
        closeModal();
        setMessages(prev => [...prev, { from: 'joy', text: `Taking you to ${labels[nav] || nav} now! 🌸✨` }]);
        return;
      }

      // Reminder command
      const reminders = loadReminders();
      const cmd = parseReminderCommand(msg, reminders);
      if (cmd) {
        let reply = '';
        switch (cmd.action) {
          case 'list': {
            const active = reminders.filter(r => r.enabled);
            reply = active.length
              ? `Here are your active reminders:\n${active.map(r => `${r.emoji} ${r.label} — ${to12h(r.time)}`).join('\n')}\n\nAsk me to change any of them! 💕`
              : 'You have no active reminders. Head to Settings → Reminders to set some up! 🌸';
            break;
          }
          case 'change_time': {
            const updated = reminders.map(r => r.id === cmd.reminder.id ? { ...r, time: cmd.time } : r);
            applyReminderUpdate(updated);
            try { clearFiredReminder(cmd.reminder.id); } catch {}
            reply = `Done! "${cmd.reminder.label}" moved to ${to12h(cmd.time)} 🌸 The reminder will fire at the new time!`;
            break;
          }
          case 'unknown_reminder': {
            reply = `I couldn\'t find a reminder to match that. Try saying the full name, like "change workout to ${to12h(cmd.time)}" 🌸`;
            break;
          }
          case 'add': {
            const newR = { id: `joy_${Date.now()}`, emoji: '⏰', label: cmd.name, time: cmd.time, enabled: true, body: null, days: ALL_DAYS };
            applyReminderUpdate([...reminders, newR]);
            reply = `Added! "${cmd.name}" reminder set for ${to12h(cmd.time)} 🔔✨`;
            break;
          }
          case 'add_no_time': {
            reply = `I need a time for the reminder! Try: "add reminder ${cmd.name || 'Vitamins'} at 8am" 🌸`;
            break;
          }
          case 'delete': {
            applyReminderUpdate(reminders.filter(r => r.id !== cmd.reminder.id));
            reply = `Done! "${cmd.reminder.label}" reminder has been removed 💫`;
            break;
          }
          case 'enable': {
            applyReminderUpdate(reminders.map(r => r.id === cmd.reminder.id ? { ...r, enabled: true } : r));
            reply = `"${cmd.reminder.label}" is back on! 🔔🌸`;
            break;
          }
          case 'disable': {
            applyReminderUpdate(reminders.map(r => r.id === cmd.reminder.id ? { ...r, enabled: false } : r));
            reply = `"${cmd.reminder.label}" has been paused 🔕 Turn it back on anytime in Settings!`;
            break;
          }
          default:
            reply = joyReply(msg);
        }
        setMessages(prev => [...prev, { from: 'joy', text: reply }]);
        return;
      }

      setMessages(prev => [...prev, { from: 'joy', text: joyReply(msg) }]);
    }, 700 + Math.random() * 800);
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
                placeholder="Ask Joy, or say 'change workout to 9am'…"
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
