import { useState, useRef, useEffect } from 'react';

const JOY_INTROS = [
  "Hi gorgeous! 💕 I'm Joy — your personal wellness bestie! Ask me anything about your plan, or tell me what you'd like to add or change. I'm here to help you glow! ✨",
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
  "How do I stay consistent?",
  "Add a rest day reminder 💤",
  "I want to focus more on nutrition 🥗",
  "Tell me about my hair care routine 💆",
];

function joyReply(msg) {
  const lower = msg.toLowerCase();

  if (lower.includes('hair') || lower.includes('oil') || lower.includes('camellia') || lower.includes('rosemary')) {
    return "Your hair care routine is *chef's kiss*! 💆✨ You've got camellia, rosemary, argan, jojoba, and coconut in your rotation. Tap Hair Care in the menu to see your full monthly calendar — and tap any date to see exactly which oils to use that day! 🌸";
  }
  if (lower.includes('workout') || lower.includes('exercise') || lower.includes('gym') || lower.includes('train')) {
    return "Let's get those gains, goddess! 💪🌸 Your plan has strength training on Monday & Thursday, Pilates on Tuesday & Friday, sprints on Wednesday, and rest on the weekend. Head to Workouts in the menu to see your full weekly plan! 🔥";
  }
  if (lower.includes('nutrition') || lower.includes('food') || lower.includes('eat') || lower.includes('meal') || lower.includes('recipe')) {
    return "Nourish to flourish, babe! 🥗✨ Your nutrition plan has protein-rich meals on strength/sprint days and lighter meals on Pilates/rest days. Check out the Nutrition section for all your meal ideas, recipes, snacks, and hydration guide! 💕";
  }
  if (lower.includes('skin') || lower.includes('skincare') || lower.includes('face') || lower.includes('moistur')) {
    return "Glowing skin is always in! ✨🌸 Your skincare routine has a full AM and PM routine, weekly treatments, and a retinoid roadmap. Pop over to the Skincare section to see everything! You're going to be radiant! 💕";
  }
  if (lower.includes('anti') || lower.includes('aging') || lower.includes('age') || lower.includes('sleep') || lower.includes('cortisol') || lower.includes('hormone')) {
    return "Aging backwards is the plan! 🌿👑 Your Anti-Aging section covers sleep protocol, cortisol management, hormone-protective eating, and a full supplement stack. Check it out — it's *so* good! ✨";
  }
  if (lower.includes('challenge') || lower.includes('habit') || lower.includes('monthly')) {
    return "Monthly challenges are my FAVOURITE! 🔥 They're designed to build one powerful habit each month. Go to the Challenges section to check off your days — every tick counts! You've got this! 💕";
  }
  if (lower.includes('rest') || lower.includes('recovery') || lower.includes('relax') || lower.includes('tired')) {
    return "Rest is not laziness — it's a sacred part of your goddess plan! 💤🌸 Your body repairs and grows stronger on rest days. Honour them! You're allowed to slow down, beautiful! 💕";
  }
  if (lower.includes('motivation') || lower.includes('help') || lower.includes('stuck') || lower.includes('hard') || lower.includes('struggle')) {
    return "Hey — you reached out instead of giving up, and THAT is goddess behaviour! 👑💕 One tiny step forward is still progress. You don't have to be perfect, you just have to keep going! I believe in you! 🌸✨";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('hii')) {
    return "Hiii gorgeous!! 💕🌸 So happy you're here! I'm Joy — your wellness bestie! What can I help you with today? Ask me anything about your plan! ✨";
  }
  if (lower.includes('thank') || lower.includes('thanks') || lower.includes('love') || lower.includes('amazing')) {
    return "You're so welcome, my love!! 🥺💕 It means everything to me! Now go be the goddess you are! 👑🌸✨";
  }

  const idx = Math.floor(Math.random() * JOY_REPLIES.length);
  return JOY_REPLIES[idx];
}

export default function JoyAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'joy', text: JOY_INTROS[0] },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  function send(text) {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: msg }]);
    setTyping(true);

    const delay = 700 + Math.random() * 800;
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { from: 'joy', text: joyReply(msg) }]);
    }, delay);
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <>
      {!open && (
        <button className="joy-fab" onClick={() => setOpen(true)} aria-label="Open Joy assistant">
          <span className="joy-fab-emoji">🥰</span>
          <span className="joy-fab-name">Joy</span>
        </button>
      )}

      {open && (
        <div className="joy-overlay" onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}>
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
              <button className="joy-header-close" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="joy-messages">
              {messages.map((m, i) => (
                <div key={i} className={`joy-msg joy-msg-${m.from}`}>
                  {m.from === 'joy' && <div className="joy-msg-avatar">🥰</div>}
                  <div className="joy-msg-bubble">{m.text}</div>
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
                  <button
                    key={i}
                    onClick={() => send(p)}
                    style={{
                      padding: '5px 12px',
                      border: '1px solid rgba(255,92,157,0.25)',
                      borderRadius: 16,
                      background: 'rgba(255,92,157,0.07)',
                      fontFamily: 'Outfit, sans-serif',
                      fontSize: 11.5,
                      color: 'var(--rose)',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
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
              <button className="joy-send-btn" onClick={() => send()} disabled={typing || !input.trim()}>
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
