import { useEffect, useRef, useState } from 'react';
import { WORKOUT_DAYS } from '../data/workouts';

const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const jsDay    = new Date().getDay();
const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

function todayLabel() {
  const d = new Date();
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const WEEK_PILLS = [
  { label: 'Mon', emoji: '🍑', dayId: 'day-monday'    },
  { label: 'Tue', emoji: '🪷', dayId: 'day-tuesday'   },
  { label: 'Wed', emoji: '🌿', dayId: 'day-wednesday' },
  { label: 'Thu', emoji: '🔥', dayId: 'day-thursday'  },
  { label: 'Fri', emoji: '✨', dayId: 'day-friday'    },
  { label: 'Sat', emoji: '⚡', dayId: 'day-saturday'  },
  { label: 'Sun', emoji: '🌸', dayId: 'day-sunday'    },
];

const RULE_BOARDS = [
  {
    title: 'No GODSSS',
    emoji: '🚫',
    tone: 'no',
    items: [
      ['G', 'Gluten', 'skip bread, pasta, flour'],
      ['O', 'Oils', 'steam, boil, bake'],
      ['D', 'Dairy', 'avoid milk, cheese, yogurt'],
      ['S', 'Sweet', 'fruit first, no added sugar'],
      ['S', 'Salty', 'keep seasoning light'],
      ['S', 'Stress', 'walk, breathe, sleep'],
    ],
  },
  {
    title: 'PFBS',
    emoji: '✨',
    tone: 'yes',
    items: [
      ['P', 'Protein', '3 PM on hard days'],
      ['F', 'Fruit', '12 PM every day'],
      ['B', 'Bland', 'simple food, calm gut'],
      ['S', 'Small', 'steady portions'],
    ],
  },
  {
    title: 'SLOW',
    emoji: '🐢',
    tone: 'yes',
    items: [
      ['S', 'Small bites', 'put the fork down'],
      ['L', 'Last meal', 'finish by 5 PM'],
      ['O', 'Only 80%', 'light, not stuffed'],
      ['W', 'Walk', '10–15 min after meals'],
    ],
  },
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function loadChecks() {
  try {
    const s = JSON.parse(localStorage.getItem('gp_today_checks'));
    if (s && s.date === todayKey()) return s.checked || {};
  } catch {
    // Local daily checks are optional.
  }
  return {};
}

function loadNotebook() {
  try {
    const s = JSON.parse(localStorage.getItem('gp_daily_notebook'));
    if (s && s.date === todayKey()) {
      return {
        note: s.note || '',
        images: Array.isArray(s.images) ? s.images : [],
        checklist: Array.isArray(s.checklist) ? s.checklist : [],
        updatedAt: s.updatedAt || '',
      };
    }
  } catch {
    // Local daily notebook data is optional.
  }
  return { note: '', images: [], checklist: [], updatedAt: '' };
}

function saveNotebook(data) {
  try {
    localStorage.setItem('gp_daily_notebook', JSON.stringify({ date: todayKey(), ...data }));
  } catch {
    // Storage can fail if the browser quota is full.
  }
}

function stampNotebookUpdate(patch) {
  return { ...patch, updatedAt: new Date().toISOString() };
}

function formatNotebookSavedAt(value) {
  if (!value) return 'Not saved yet today';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'Saved today';
  return `Saved ${d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} at ${d.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  })}`;
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read image.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not load image.'));
      img.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve({
          id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          name: file.name || 'Daily photo',
          src: canvas.toDataURL('image/jpeg', 0.82),
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function DailyNotebook() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('notes');
  const [data, setData] = useState(loadNotebook);
  const [draftItem, setDraftItem] = useState('');
  const [imageError, setImageError] = useState('');
  const uploadRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    saveNotebook(data);
  }, [data]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  function updateNote(note) {
    setData(prev => stampNotebookUpdate({ ...prev, note }));
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageError('');
    try {
      const images = await Promise.all(files.map(readImageFile));
      setData(prev => stampNotebookUpdate({ ...prev, images: [...prev.images, ...images].slice(-6) }));
    } catch (err) {
      setImageError(err.message || 'Could not add image.');
    } finally {
      e.target.value = '';
    }
  }

  function removeImage(id) {
    setData(prev => stampNotebookUpdate({ ...prev, images: prev.images.filter(img => img.id !== id) }));
  }

  function addChecklistItem(e) {
    e.preventDefault();
    const text = draftItem.trim();
    if (!text) return;
    setData(prev => stampNotebookUpdate({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, done: false },
      ],
    }));
    setDraftItem('');
  }

  function toggleChecklistItem(id) {
    setData(prev => stampNotebookUpdate({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, done: !item.done } : item),
    }));
  }

  function deleteChecklistItem(id) {
    setData(prev => stampNotebookUpdate({ ...prev, checklist: prev.checklist.filter(item => item.id !== id) }));
  }

  const checkedCount = data.checklist.filter(item => item.done).length;
  const savedAtText = formatNotebookSavedAt(data.updatedAt);

  return (
    <>
      <button
        type="button"
        className="daily-notebook-launcher splash-item"
        onClick={() => setOpen(true)}
        aria-label="Open daily notebook"
      >
        <span className="daily-notebook-launcher-icon" aria-hidden="true">
          <span className="notebook-cover">
            <span className="notebook-sparkle notebook-sparkle-one" />
            <span className="notebook-sparkle notebook-sparkle-two" />
            <span className="notebook-heart" />
          </span>
          <span className="notebook-pages" />
          <span className="notebook-binding" />
        </span>
      </button>

      {open && (
        <div
          className="daily-notebook-overlay"
          role="presentation"
          onClick={() => setOpen(false)}
          onTouchStart={e => e.stopPropagation()}
          onTouchEnd={e => e.stopPropagation()}
        >
          <div
            className="daily-notebook"
            role="dialog"
            aria-modal="true"
            aria-label="Daily notebook"
            onClick={e => e.stopPropagation()}
          >
            <div className="daily-notebook-top">
              <div>
                <div className="daily-plan-label">Daily Notebook</div>
                <div className="daily-notebook-title">Today</div>
              </div>
              <button type="button" className="daily-notebook-close" onClick={() => setOpen(false)} aria-label="Close daily notebook">
                ×
              </button>
            </div>

            <div className="daily-notebook-options" role="tablist" aria-label="Notebook type">
              <button
                type="button"
                className={`daily-notebook-option${mode === 'notes' ? ' active' : ''}`}
                onClick={() => setMode('notes')}
              >
                <span>Notes</span>
                <small>Write notes and add images</small>
              </button>
              <button
                type="button"
                className={`daily-notebook-option${mode === 'checklist' ? ' active' : ''}`}
                onClick={() => setMode('checklist')}
              >
                <span>Checklist</span>
                <small>Make a check-off list</small>
              </button>
            </div>

            {mode === 'notes' ? (
              <div className="daily-note-panel">
                <textarea
                  className="daily-note-input"
                  value={data.note}
                  onChange={e => updateNote(e.target.value)}
                  placeholder="Write anything you want to remember today..."
                />
                <div className="daily-note-actions">
                  <button type="button" className="daily-note-btn" onClick={() => uploadRef.current?.click()}>
                    Upload image
                  </button>
                  <button type="button" className="daily-note-btn" onClick={() => cameraRef.current?.click()}>
                    Use camera
                  </button>
                  {data.note && (
                    <button type="button" className="daily-note-btn danger" onClick={() => updateNote('')}>
                      Clear note
                    </button>
                  )}
                </div>
                <input
                  ref={uploadRef}
                  className="daily-note-file"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <input
                  ref={cameraRef}
                  className="daily-note-file"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                />
                {imageError && <div className="daily-note-error">{imageError}</div>}
                {data.images.length > 0 && (
                  <div className="daily-note-images">
                    {data.images.map(img => (
                      <div key={img.id} className="daily-note-image-wrap">
                        <img className="daily-note-image" src={img.src} alt={img.name} />
                        <button type="button" className="daily-note-delete" onClick={() => removeImage(img.id)} aria-label="Delete image">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="daily-note-save">{savedAtText}</div>
              </div>
            ) : (
              <div className="daily-check-panel">
                <form className="daily-check-add" onSubmit={addChecklistItem}>
                  <input
                    type="text"
                    value={draftItem}
                    onChange={e => setDraftItem(e.target.value)}
                    placeholder="Add a checklist item..."
                  />
                  <button type="submit">Add</button>
                </form>
                <div className="daily-check-count">{checkedCount}/{data.checklist.length} done today</div>
                <div className="daily-check-list">
                  {data.checklist.length === 0 && (
                    <div className="daily-check-empty">No checklist items yet.</div>
                  )}
                  {data.checklist.map(item => (
                    <div key={item.id} className={`daily-check-item${item.done ? ' done' : ''}`}>
                      <button type="button" className="daily-check-toggle" onClick={() => toggleChecklistItem(item.id)} aria-label={`Toggle ${item.text}`}>
                        <span />
                      </button>
                      <button type="button" className="daily-check-text" onClick={() => toggleChecklistItem(item.id)}>
                        {item.text}
                      </button>
                      <button type="button" className="daily-check-delete" onClick={() => deleteChecklistItem(item.id)} aria-label={`Delete ${item.text}`}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function TodayDashboard({ today, todayDayId, onNavigate }) {
  const [checked, setChecked] = useState(loadChecks);

  function toggle(id) {
    setChecked(prev => {
      const next = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('gp_today_checks', JSON.stringify({ date: todayKey(), checked: next }));
      } catch {
        // Daily checks still work in memory if storage is unavailable.
      }
      return next;
    });
  }

  const mealRows = today.meals.rows.slice(0, 3).map((row, i) => {
    const [time, name] = row.time.split(' — ');
    return {
      id: `meal-${i}`,
      icon: ['🍓', '🍽️', '🥗'][i],
      time,
      title: name || 'Meal',
      note: row.ingredients.slice(0, 3).map(item => item.name).join(' · '),
    };
  });

  const rows = [
    { id: 'am-skin', icon: '☀️', title: 'AM skincare', note: 'Cleanse · Vitamin C · SPF', nav: ['skincare', 'am'] },
    { id: 'workout', icon: today.emoji, title: today.title, note: today.sub, nav: ['workout', null, todayDayId] },
    ...mealRows,
    { id: 'walk', icon: '🚶', title: 'Walk 10–15 min after meals', note: 'beats bloating' },
    { id: 'body', icon: '🫧', title: 'Body care', note: 'Shower · Moisturise · SPF', nav: ['skincare', 'body'] },
    { id: 'hair', icon: '💎', title: 'Hair care', note: 'Oil ritual · Scalp massage', nav: ['skincare', 'hair'] },
    { id: 'pm-skin', icon: '🌙', title: 'PM skincare', note: 'Double cleanse · Treatment · Repair', nav: ['skincare', 'pm'] },
  ];

  const done = rows.filter(r => checked[r.id]).length;

  return (
    <div className="today-dashboard splash-item">
      <div className="today-dashboard-top">
        <div>
          <div className="daily-plan-label">Today's Plan</div>
          <div className="today-dashboard-date">
            {today.day} <span className="today-progress">{done}/{rows.length} ✨</span>
          </div>
        </div>
        <button className="today-open-btn" onClick={() => onNavigate('workout', null, todayDayId)}>Open day</button>
      </div>

      <div className="today-timeline">
        {rows.map(r => (
          <div key={r.id} className={`tl-row${checked[r.id] ? ' is-done' : ''}`}>
            <button className="tl-check" aria-label={`Mark ${r.title} done`} onClick={() => toggle(r.id)}>
              <span className="tl-ring" />
            </button>
            <button className="tl-body" onClick={r.nav ? () => onNavigate(...r.nav) : () => toggle(r.id)}>
              <span className="tl-icon">{r.icon}</span>
              <span className="tl-copy">
                <span className="tl-title">
                  {r.time && <em className="tl-time">{r.time}</em>}
                  {r.title}
                </span>
                {r.note && <small className="tl-note">{r.note}</small>}
              </span>
              {r.nav && <span className="tl-arrow">›</span>}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function RuleBoard() {
  const [activeCol, setActiveCol] = useState(0);
  const scrollRef = useRef(null);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max <= 0) { setActiveCol(0); return; }
    setActiveCol(Math.round((el.scrollLeft / max) * (RULE_BOARDS.length - 1)));
  }

  return (
    <div className="rule-board-wrap splash-item">
      <div
        className="rule-board"
        ref={scrollRef}
        onScroll={handleScroll}
        /* Swiping the board must not trigger the app's edge-swipe-back gesture on .main */
        onTouchStart={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
      >
        {RULE_BOARDS.map(board => (
          <div key={board.title} className={`rule-column rule-column-${board.tone}`}>
            <div className="rule-column-title">{board.emoji} {board.title}</div>
            <div className="rule-cards">
              {board.items.map(([letter, title, note]) => (
                <div key={`${board.title}-${letter}-${title}`} className="rule-mini-card">
                  <span className="rule-mini-letter">{letter}</span>
                  <span className="rule-mini-copy">
                    <strong>{title}</strong>
                    <small>{note}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="rule-dots" aria-hidden="true">
        {RULE_BOARDS.map((b, i) => <span key={b.title} className={`rule-dot${i === activeCol ? ' active' : ''}`} />)}
      </div>
    </div>
  );
}

export default function Hero({ onNavigate }) {
  const today = WORKOUT_DAYS[dayIndex];
  const todayDayId = `day-${['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][dayIndex]}`;

  return (
    <div className="hero hero-dashboard">
      <div className="hero-brand">
        <div className="hero-brand-tag">🌸 1,200 Light Days · 1,500 Hard Days 🌸</div>
        <div className="hero-title-row">
          <h1 className="hero-brand-title">The <em>Goddess</em> Plan</h1>
          <DailyNotebook />
        </div>
        <div className="hero-brand-sub">Flat Tummy · Small Waist · Round Glutes · Glow</div>
      </div>

      <div className="hero-date splash-item">{todayLabel()}</div>

      {/* Jump-to-Day pills — tap any day to go directly to that workout */}
      <div className="hero-week-pills splash-item">
        {WEEK_PILLS.map((p, i) => (
          <button
            key={p.dayId}
            className={`hero-week-pill${i === dayIndex ? ' is-today' : ''}`}
            onClick={() => onNavigate('workout', null, p.dayId)}
          >
            <span className="hero-week-pill-emoji">{p.emoji}</span>
            <span className="hero-week-pill-label">{p.label}</span>
          </button>
        ))}
      </div>

      <div className="hero-goal-ribbon splash-item">🎯 Flat tummy · Small waist · Round glutes · Healthy gut · Glow</div>

      <TodayDashboard today={today} todayDayId={todayDayId} onNavigate={onNavigate} />

      <RuleBoard />

      {/* Gentle reminders — only what the boards & timeline don't already say */}
      <div className="hero-pfbs hero-baby-steps splash-item">
        <div className="hero-rules-title">Gentle reminders 🌙</div>
        <div className="hero-rules">
          <div className="hero-rule"><span>🥭</span><span>Fruits earlier in the day, vegetables at 5 PM</span></div>
          <div className="hero-rule"><span>😴</span><span>Sleep 7.5–9 hours — glutes grow overnight</span></div>
          <div className="hero-rule hero-rule-bored"><span>💧</span><span>Craving? Water first, wait 10 minutes. Still hungry — eat slowly. Bored — walk, stretch, or read a page.</span></div>
        </div>
      </div>
    </div>
  );
}
