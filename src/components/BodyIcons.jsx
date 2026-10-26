// Drawn line icons for Body (2026-10-26), in place of emoji. Thin rounded
// strokes in the text colour, so they sit quietly in light and dark mode.
const P = {
  face: <><path d="M12 3.5c-3.6 0-6 2.8-6 6.6 0 4.6 2.8 9.4 6 9.4s6-4.8 6-9.4c0-3.8-2.4-6.6-6-6.6z" /><path d="M9.5 10.6h.01M14.5 10.6h.01M10.2 15c1 .8 2.6.8 3.6 0" /></>,
  hair: <><path d="M6 20c-1.5-4-1.3-9 1-12.2C9 5 12.5 4 15.5 5.2 18.6 6.5 19.6 10 18.6 14c-.6 2.4-.2 4.2.8 6" /><path d="M9.5 20c-1-3.4-.8-7 .8-9.4M13 20c-.6-3.2-.2-6.4 1.6-8.6" /></>,
  tooth: <><path d="M7.4 4.5c-2 0-3.4 1.6-3.2 4 .2 2.6 1.4 3.6 1.8 6.4.4 2.6.9 4.6 2.1 4.6 1.6 0 1.4-4.7 3.9-4.7s2.3 4.7 3.9 4.7c1.2 0 1.7-2 2.1-4.6.4-2.8 1.6-3.8 1.8-6.4.2-2.4-1.2-4-3.2-4-1.8 0-2.6 1.1-4.6 1.1s-2.8-1.1-4.6-1.1z" /></>,
  bubbles: <><circle cx="9" cy="14" r="5" /><circle cx="16.5" cy="7.5" r="3" /><circle cx="17.5" cy="16.5" r="1.8" /><path d="M7 12.2a2.4 2.4 0 0 1 2-1.4" /></>,
  dropper: <><path d="M14.5 3.5l6 6M12.6 5.4l6 6M17.5 6.5l-9.8 9.8-1.6 3.4-1.3-1.3 3.4-1.6" /><path d="M11.2 9.8l3 3" /></>,
  hourglass: <><path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5c0 4.4 4.5 5.6 4.5 8.5s-4.5 4.1-4.5 8.5M16.5 3.5c0 4.4-4.5 5.6-4.5 8.5s4.5 4.1 4.5 8.5" /><path d="M9.8 18.4c1.2-.9 3.2-.9 4.4 0" /></>,
  spray: <><rect x="7" y="9.5" width="8" height="11" rx="2" /><path d="M9 9.5V7h4v2.5M13 7.5h2.5M18.5 5.5l1.5-.8M18.5 7.8h1.8M18.5 10l1.5.8" /></>,
  lipstick: <><path d="M8.5 20.5h7v-8h-7z" /><path d="M9.5 12.5V8.5L14.5 5v7.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.8v2.2M12 19v2.2M2.8 12H5M19 12h2.2M5.5 5.5l1.5 1.5M17 17l1.5 1.5M5.5 18.5L7 17M17 7l1.5-1.5" /></>,
  moon: <><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" /></>,
  shaker: <><path d="M8 9.5h8l-1 11H9z" /><path d="M8.5 9.5c0-3.4 1.5-5 3.5-5s3.5 1.6 3.5 5" /><path d="M11 6.6h.01M13 6.6h.01M12 5.4h.01" /></>,
  sparkle: <><path d="M12 3.5c.6 4.2 2.3 6 6.5 6.5-4.2.6-5.9 2.3-6.5 6.5-.6-4.2-2.3-5.9-6.5-6.5 4.2-.5 5.9-2.3 6.5-6.5z" /><path d="M18.5 15.5c.2 1.6.9 2.3 2.5 2.5-1.6.2-2.3.9-2.5 2.5-.2-1.6-.9-2.3-2.5-2.5 1.6-.2 2.3-.9 2.5-2.5z" /></>,
  leaf: <><path d="M5 19c0-8.3 5.4-13.6 14-14-.4 8.6-5.7 14-14 14z" /><path d="M5 19c3-3.6 6-6.4 9.5-9" /></>,
  sprout: <><path d="M12 20.5v-8" /><path d="M12 12.5C12 8.6 9.6 6.5 5.5 6.5c0 4 2.4 6 6.5 6zM12 11c0-3.4 2-5.3 6.5-5.3 0 3.6-2.3 5.3-6.5 5.3z" /></>,
  daisy: <><circle cx="12" cy="12" r="2.3" /><path d="M12 9.7C10.6 6.6 11 4 12 3.5c1 .5 1.4 3.1 0 6.2zM12 14.3c1.4 3.1 1 5.7 0 6.2-1-.5-1.4-3.1 0-6.2zM9.7 12c-3.1 1.4-5.7 1-6.2 0 .5-1 3.1-1.4 6.2 0zM14.3 12c3.1-1.4 5.7-1 6.2 0-.5 1-3.1 1.4-6.2 0z" /></>,
  blossom: <><circle cx="12" cy="12" r="1.6" /><path d="M12 10.4c-2-1.6-2.4-4-1.3-6 .6.6 1 .8 1.3.8s.7-.2 1.3-.8c1.1 2 .7 4.4-1.3 6zM13.5 11.5c1-2.4 3.2-3.4 5.4-3-.2.8-.1 1.2.1 1.5.2.3.6.5 1.4.6-.9 2-3.2 2.9-6.9.9zM13 13.4c2.5.3 4.1 2.1 4.3 4.4-.8-.1-1.2.1-1.5.3-.3.3-.4.6-.4 1.4-2.1-.5-3.2-2.7-2.4-6.1zM11 13.4c.8 3.4-.3 5.6-2.4 6.1 0-.8-.1-1.1-.4-1.4-.3-.2-.7-.4-1.5-.3.2-2.3 1.8-4.1 4.3-4.4zM10.5 11.5c-3.7 2-6 1.1-6.9-.9.8-.1 1.2-.3 1.4-.6.2-.3.3-.7.1-1.5 2.2-.4 4.4.6 5.4 3z" /></>,
  drop: <><path d="M12 3.5c3.2 4 5.5 7.2 5.5 10.2a5.5 5.5 0 0 1-11 0c0-3 2.3-6.2 5.5-10.2z" /><path d="M9.4 14.2a2.7 2.7 0 0 0 2.4 2.6" /></>,
  coconut: <><circle cx="12" cy="13" r="7" /><path d="M8.8 9.6h.01M12 8.6h.01M10.4 11.2h.01" /><path d="M12 6c.4-1.6 1.6-2.4 3.4-2.5" /></>,
  shield: <><path d="M12 3.5l7 2.6v5.2c0 4.4-2.9 8-7 9.2-4.1-1.2-7-4.8-7-9.2V6.1z" /><path d="M9.2 12.2l2 2 3.6-4" /></>,
  pulse: <><path d="M3.5 12.5h4l2-4.5 3.2 9 2.3-5.5h5.5" /></>,
  flask: <><path d="M9.5 3.5h5M10.5 3.5v5.4L5.6 17.4A2 2 0 0 0 7.4 20.5h9.2a2 2 0 0 0 1.8-3.1l-4.9-8.5V3.5" /><path d="M7.8 14.5h8.4" /></>,
  strength: <><path d="M5 14.5v-5M19 14.5v-5M7.5 16.5v-9M16.5 16.5v-9M7.5 12h9" /></>,
  alert: <><path d="M12 4l8.5 15h-17z" /><path d="M12 10v4M12 16.8h.01" /></>,
  no: <><circle cx="12" cy="12" r="8" /><path d="M6.5 6.5l11 11" /></>,
  gem: <><path d="M7 4.5h10l3.5 5L12 20 3.5 9.5z" /><path d="M3.5 9.5h17M9.5 4.5 8 9.5l4 10.5 4-10.5-1.5-5" /></>,
  wave: <><path d="M3 9c3-2.6 5.5-2.6 9 0s6 2.6 9 0M3 15c3-2.6 5.5-2.6 9 0s6 2.6 9 0" /></>,
  balance: <><path d="M12 4v16M7.5 20.5h9M5 7.5h14" /><path d="M5 7.5 2.8 13a2.4 2.4 0 0 0 4.4 0zM19 7.5 16.8 13a2.4 2.4 0 0 0 4.4 0z" /></>,
  snow: <><path d="M12 3.5v17M4.6 7.8l14.8 8.4M4.6 16.2l14.8-8.4" /><path d="M10 5l2 1.6L14 5M10 19l2-1.6 2 1.6" /></>,
  feather: <><path d="M19.5 4.5C12 5 6.5 9.6 6.5 16.5v3" /><path d="M19.5 4.5c-.6 7-4.8 11.4-11 12M11 13h4.8" /></>,
  bag: <><path d="M5.5 8.5h13l-1.1 11.5H6.6z" /><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5" /></>,
  thermo: <><path d="M10 14.2V5.5a2 2 0 0 1 4 0v8.7a3.6 3.6 0 1 1-4 0z" /><path d="M12 9v6.6" /></>,
  bottle: <><path d="M9 3.5h6M10 3.5v3.2c-2 .8-3 2.2-3 4.3v8a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5v-8c0-2.1-1-3.5-3-4.3V3.5" /><path d="M7 12.5h10" /></>,
  calendar: <><rect x="4" y="5.5" width="16" height="14.5" rx="2" /><path d="M4 10h16M8.5 3.5v3.5M15.5 3.5v3.5" /></>,
  bulb: <><path d="M9 17.5h6M10 20.5h4" /><path d="M8.6 14.5C7 13.3 6 11.6 6 9.6a6 6 0 0 1 12 0c0 2-1 3.7-2.6 4.9-.5.4-.8.9-.8 1.5V17h-5.2v-1c0-.6-.3-1.1-.8-1.5z" /></>,
  shower: <><path d="M5 20.5V8a3.5 3.5 0 0 1 7 0" /><path d="M9 8h6" /><path d="M10 11.5l-.5 1.5M12.5 11.5v1.6M15 11.5l.5 1.5M11 15.5l-.5 1.5M14 15.5l.5 1.5" /></>,
  comb: <><path d="M3.5 9.5h17v3h-17z" /><path d="M5.5 12.5v6M8.5 12.5v6M11.5 12.5v6M14.5 12.5v6M17.5 12.5v6" /></>,
  towel: <><path d="M5 5.5h11.5a2.5 2.5 0 0 1 2.5 2.5v12.5H7.5A2.5 2.5 0 0 1 5 18z" /><path d="M5 8a2.5 2.5 0 0 1 5 0v12.5M10 15.5h9" /></>,
  crown: <><path d="M4 8l3.5 4L12 5.5l4.5 6.5L20 8l-1.6 10H5.6z" /><path d="M5.6 18h12.8" /></>,
  bed: <><path d="M3.5 18.5v-11M3.5 14.5h17v4M20.5 14.5V12a2.5 2.5 0 0 0-2.5-2.5h-7.5v5" /><circle cx="7" cy="11.5" r="1.6" /></>,
  eye: <><path d="M2.8 12c2.2-4 5.4-6 9.2-6s7 2 9.2 6c-2.2 4-5.4 6-9.2 6s-7-2-9.2-6z" /><circle cx="12" cy="12" r="2.8" /></>,
  mind: <><path d="M9.5 19.5V17c-2.6-.6-4.5-2.9-4.5-5.7A6.8 6.8 0 0 1 11.8 4.5c3.7 0 6.7 2.8 6.7 6.4 0 .6-.1 1.2-.3 1.8l1.3 2.3-1.8.6V17a2.5 2.5 0 0 1-2.5 2.5" /><path d="M10 9.5c1.2-1.2 3-1.2 4 .2" /></>,
  list: <><path d="M9 7h11M9 12h11M9 17h11" /><path d="M4.5 7h.01M4.5 12h.01M4.5 17h.01" /></>,
  clock: <><circle cx="12" cy="12" r="8" /><path d="M12 7.5V12l3 2" /></>,
  brow: <><path d="M3.5 13c3.6-4.4 9.6-5.6 17-3" /><path d="M6 16.5c2-1 4-1.4 6-1.2" /></>,
  lips: <><path d="M3 12c2.6-3.4 5-4.6 6.6-3.6.9.5 1.6.5 2.4 0s1.5-.5 2.4 0C16 7.4 18.4 8.6 21 12c-2.4 3.4-5.6 5-9 5s-6.6-1.6-9-5z" /><path d="M3 12h18" /></>,
  heart: <><path d="M12 19.5c-4.8-3-8-6.1-8-9.6A4.3 4.3 0 0 1 8.3 5.5c1.6 0 2.9.8 3.7 2.1.8-1.3 2.1-2.1 3.7-2.1A4.3 4.3 0 0 1 20 9.9c0 3.5-3.2 6.6-8 9.6z" /></>,
  bolt: <><path d="M13.5 3 5.5 13.5h6l-1 7.5 8-10.5h-6z" /></>,
  bowl: <><path d="M3.5 11.5h17c-.3 4.6-3.6 8-8.5 8s-8.2-3.4-8.5-8z" /><path d="M8.5 8.5c0-1.6 1-2.6 2.4-3M12.5 8.5c0-2 1.4-3.6 3.5-4" /></>,
  hand: <><path d="M8 12.5V6a1.5 1.5 0 0 1 3 0v5M11 11V4.5a1.5 1.5 0 0 1 3 0V11M14 11V6a1.5 1.5 0 0 1 3 0v7c0 4.1-2.4 7.5-6 7.5-2.4 0-3.8-1.2-5.2-3.4L4 13.8a1.5 1.5 0 0 1 2.4-1.7l1.6 1.9" /></>,
};

// Emoji the routines were written with, and the drawing that replaces each.
const FROM_EMOJI = {
  '🌿': 'leaf', '🍃': 'leaf', '🌱': 'sprout', '🌼': 'daisy', '🌸': 'blossom', '💧': 'drop', '🥥': 'coconut',
  '✨': 'sparkle', '🌟': 'sparkle', '🛡️': 'shield', '🩸': 'pulse', '🔬': 'flask', '🧪': 'flask', '💪': 'strength',
  '⚠️': 'alert', '🚫': 'no', '💎': 'gem', '🌊': 'wave', '⚖️': 'balance', '❄️': 'snow', '🧼': 'bubbles', '🫧': 'bubbles',
  '🪶': 'feather', '👜': 'bag', '🛍': 'bag', '🌡️': 'thermo', '🧴': 'bottle', '📅': 'calendar', '🌙': 'moon', '☀️': 'sun',
  '💡': 'bulb', '🚿': 'shower', '🪵': 'comb', '🧻': 'towel', '👑': 'crown', '🛏️': 'bed', '🛌': 'bed', '👁️': 'eye',
  '🧠': 'mind', '💆': 'hand', '📋': 'list', '⏰': 'clock', '🤎': 'brow', '💋': 'lips', '🦷': 'tooth', '💇': 'hair', '💄': 'lipstick', '🧂': 'shaker',
};

const BY_EMOJI = Object.fromEntries(Object.entries(FROM_EMOJI).map(([k, v]) => [k.replace(/\uFE0F/g, ''), v]));

export function BodyIcon({ name, size = 22, className = '' }) {
  const paths = P[name] || P[BY_EMOJI[String(name || '').replace(/\uFE0F/g, '')]];
  if (!paths) return null;
  return (
    <svg className={`body-icon ${className}`.trim()} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths}
    </svg>
  );
}

// "Good to know", at the bottom of a routine: a thin line, then each tip as a
// small drawing and a few words.
export function Tips({ title = 'Good to know', items }) {
  return (
    <div className="bk-tips splash-item">
      <div className="bk-tips-line"><span>{title}</span></div>
      <ul className="bk-tips-list">
        {items.map(([icon, text]) => (
          <li key={text} className="bk-tip">
            <span className="bk-tip-ico"><BodyIcon name={icon} size={20} /></span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// A week drawn as a grid: one row per habit, a dot on each day it is done.
const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
export function WeekGrid({ title = 'Your week', rows }) {
  const today = (new Date().getDay() + 6) % 7;
  return (
    <div className="bk-tips splash-item">
      <div className="bk-tips-line"><span>{title}</span></div>
      <div className="bk-week" role="table" aria-label={title}>
        <div className="bk-week-row bk-week-head" role="row">
          <span role="columnheader" />
          {WEEK.map((d, i) => <span key={d} role="columnheader" className={i === today ? 'is-today' : undefined}>{d}</span>)}
        </div>
        {rows.map(r => (
          <div key={r.label} className="bk-week-row" role="row">
            <span className="bk-week-name" role="rowheader"><BodyIcon name={r.icon} size={17} />{r.label}</span>
            {WEEK.map((d, i) => (
              <span key={d} role="cell" aria-label={r.days.includes(i) ? `${r.label} on ${d}` : undefined} className={i === today ? 'is-today' : undefined}>
                {r.days.includes(i) && <span className={`bk-dot${r.tone ? ` bk-dot-${r.tone}` : ''}`} />}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
