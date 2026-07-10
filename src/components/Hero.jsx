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

const MOOD_CHOICES = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'horny', emoji: '😘', label: 'Horny' },
  { id: 'angry', emoji: '😡', label: 'Angry' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'scared', emoji: '😨', label: 'Scared' },
  { id: 'confused', emoji: '😵‍💫', label: 'Confused' },
  { id: 'calm', emoji: '🌙', label: 'Calm' },
  { id: 'delusional', emoji: '🦄', label: 'Delusional' },
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
      return normalizeNotebookData(s);
    }
  } catch {
    // Local daily notebook data is optional.
  }
  return createEmptyNotebook();
}

function saveNotebook(data) {
  try {
    localStorage.setItem('gp_daily_notebook', JSON.stringify({ date: todayKey(), ...data }));
    return true;
  } catch {
    // Storage can fail if the browser quota is full.
  }
  return false;
}

function makeNotebookId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function createNotebookPage(seed = {}) {
  const now = new Date().toISOString();
  return {
    id: seed.id || makeNotebookId('page'),
    title: seed.title ?? '',
    note: seed.note || '',
    images: Array.isArray(seed.images) ? seed.images : [],
    mood: seed.mood || '',
    createdAt: seed.createdAt || now,
    updatedAt: seed.updatedAt || seed.createdAt || now,
  };
}

function createEmptyNotebook() {
  const page = createNotebookPage();
  return {
    pages: [page],
    activePageId: page.id,
    checklist: [],
    updatedAt: '',
  };
}

function normalizeNotebookData(raw = {}) {
  const legacyPage = raw.note || Array.isArray(raw.images)
    ? createNotebookPage({
        title: 'Today',
        note: raw.note || '',
        images: raw.images || [],
        mood: raw.mood || '',
        createdAt: raw.createdAt || raw.updatedAt,
        updatedAt: raw.updatedAt,
      })
    : null;

  const pages = Array.isArray(raw.pages) && raw.pages.length > 0
    ? raw.pages.map(page => createNotebookPage(page))
    : [legacyPage || createNotebookPage()];
  const activePageId = pages.some(page => page.id === raw.activePageId)
    ? raw.activePageId
    : pages[0].id;

  return {
    pages,
    activePageId,
    checklist: Array.isArray(raw.checklist) ? raw.checklist.map(item => ({
      ...item,
      pinned: Boolean(item.pinned),
      done: Boolean(item.done),
    })) : [],
    updatedAt: raw.updatedAt || '',
  };
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
  const [saveFlash, setSaveFlash] = useState(false);
  const [storageState, setStorageState] = useState('saved');
  const uploadRef = useRef(null);
  const cameraRef = useRef(null);
  const removeTimersRef = useRef({});
  const saveFlashRef = useRef(null);

  useEffect(() => {
    setStorageState(saveNotebook(data) ? 'saved' : 'error');
  }, [data]);

  useEffect(() => () => {
    Object.values(removeTimersRef.current).forEach(clearTimeout);
    if (saveFlashRef.current) clearTimeout(saveFlashRef.current);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const handleKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const currentPage = data.pages.find(page => page.id === data.activePageId) || data.pages[0];

  function updateCurrentPage(patch) {
    setData(prev => {
      const activePageId = prev.pages.some(page => page.id === prev.activePageId)
        ? prev.activePageId
        : prev.pages[0]?.id;
      const now = new Date().toISOString();
      return stampNotebookUpdate({
        ...prev,
        activePageId,
        pages: prev.pages.map(page => page.id === activePageId ? { ...page, ...patch, updatedAt: now } : page),
      });
    });
  }

  function updateNote(note) {
    updateCurrentPage({ note });
  }

  function addNotebookPage() {
    const page = createNotebookPage();
    setData(prev => stampNotebookUpdate({
      ...prev,
      pages: [...prev.pages, page],
      activePageId: page.id,
    }));
  }

  function selectNotebookPage(id) {
    setData(prev => ({ ...prev, activePageId: id }));
  }

  function saveCurrentPage() {
    updateCurrentPage({});
    setSaveFlash(true);
    if (saveFlashRef.current) clearTimeout(saveFlashRef.current);
    saveFlashRef.current = setTimeout(() => setSaveFlash(false), 1600);
  }

  function deleteCurrentPage() {
    if (data.pages.length <= 1 || !currentPage) return;
    setData(prev => {
      const pages = prev.pages.filter(page => page.id !== prev.activePageId);
      return stampNotebookUpdate({
        ...prev,
        pages,
        activePageId: pages[0]?.id || '',
      });
    });
  }

  function updateMood(mood) {
    updateCurrentPage({ mood });
  }

  async function handleImageChange(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setImageError('');
    try {
      const images = await Promise.all(files.map(readImageFile));
      setData(prev => {
        const activePageId = prev.pages.some(page => page.id === prev.activePageId)
          ? prev.activePageId
          : prev.pages[0]?.id;
        const now = new Date().toISOString();
        return stampNotebookUpdate({
          ...prev,
          pages: prev.pages.map(page => page.id === activePageId
            ? { ...page, images: [...(page.images || []), ...images].slice(-6), updatedAt: now }
            : page),
        });
      });
    } catch (err) {
      setImageError(err.message || 'Could not add image.');
    } finally {
      e.target.value = '';
    }
  }

  function removeImage(id) {
    updateCurrentPage({ images: (currentPage?.images || []).filter(img => img.id !== id) });
  }

  function addChecklistItem(e) {
    e.preventDefault();
    const text = draftItem.trim();
    if (!text) return;
    setData(prev => stampNotebookUpdate({
      ...prev,
      checklist: [
        ...prev.checklist,
        { id: makeNotebookId('check'), text, done: false, pinned: false, createdAt: new Date().toISOString() },
      ],
    }));
    setDraftItem('');
  }

  function toggleChecklistItem(id) {
    const item = data.checklist.find(entry => entry.id === id);
    if (!item) return;

    if (item.done) {
      if (removeTimersRef.current[id]) {
        clearTimeout(removeTimersRef.current[id]);
        delete removeTimersRef.current[id];
      }
      setData(prev => stampNotebookUpdate({
        ...prev,
        checklist: prev.checklist.map(entry => entry.id === id ? { ...entry, done: false, completedAt: '' } : entry),
      }));
      return;
    }

    setData(prev => stampNotebookUpdate({
      ...prev,
      checklist: prev.checklist.map(entry => entry.id === id ? { ...entry, done: true, completedAt: new Date().toISOString() } : entry),
    }));
    if (removeTimersRef.current[id]) clearTimeout(removeTimersRef.current[id]);
    removeTimersRef.current[id] = setTimeout(() => {
      setData(prev => stampNotebookUpdate({
        ...prev,
        checklist: prev.checklist.filter(entry => entry.id !== id),
      }));
      delete removeTimersRef.current[id];
    }, 3000);
  }

  function togglePinChecklistItem(id) {
    setData(prev => stampNotebookUpdate({
      ...prev,
      checklist: prev.checklist.map(item => item.id === id ? { ...item, pinned: !item.pinned } : item),
    }));
  }

  function deleteChecklistItem(id) {
    if (removeTimersRef.current[id]) {
      clearTimeout(removeTimersRef.current[id]);
      delete removeTimersRef.current[id];
    }
    setData(prev => stampNotebookUpdate({ ...prev, checklist: prev.checklist.filter(item => item.id !== id) }));
  }

  const checkedCount = data.checklist.filter(item => item.done).length;
  const sortedChecklist = [...data.checklist].sort((a, b) => Number(b.pinned) - Number(a.pinned));
  const savedAtText = formatNotebookSavedAt(currentPage?.updatedAt || data.updatedAt);
  const offlineSaveText = storageState === 'saved'
    ? 'Saved offline on this device'
    : 'Could not save. Storage may be full.';

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
                className={`daily-notebook-option daily-notebook-option-notes${mode === 'notes' ? ' active' : ''}`}
                onClick={() => setMode('notes')}
              >
                <span>Diary</span>
                <small>Write diary pages and add images</small>
              </button>
              <button
                type="button"
                className={`daily-notebook-option daily-notebook-option-checklist${mode === 'checklist' ? ' active' : ''}`}
                onClick={() => setMode('checklist')}
              >
                <span>Checklist</span>
                <small>Make a check-off list</small>
              </button>
            </div>

            {mode === 'notes' ? (
              <div className="daily-note-panel">
                <div className="daily-note-workspace">
                  <aside className="daily-pages-board" aria-label="Diary pages">
                    <div className="daily-pages-board-top">
                      <span>Diary pages</span>
                      <button type="button" className="daily-page-add" onClick={addNotebookPage} aria-label="Add new diary page">
                        +
                      </button>
                    </div>
                    <div className="daily-page-list">
                      {data.pages.map(page => {
                        const mood = MOOD_CHOICES.find(choice => choice.id === page.mood);
                        return (
                          <button
                            key={page.id}
                            type="button"
                            className={`daily-page-card${page.id === data.activePageId ? ' active' : ''}`}
                            onClick={() => selectNotebookPage(page.id)}
                          >
                            <strong>{page.title || 'Untitled diary'}</strong>
                            <span>{mood ? `${mood.emoji} ${mood.label}` : 'No mood yet'}</span>
                            <small>{formatNotebookSavedAt(page.updatedAt)}</small>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  <section className="daily-note-editor">
                    <div className="daily-note-editor-head">
                      <input
                        className="daily-page-title-input"
                        type="text"
                        value={currentPage?.title || ''}
                        onChange={e => updateCurrentPage({ title: e.target.value })}
                        placeholder="What is this diary page about?"
                      />
                      <div className="daily-note-editor-actions">
                        <button type="button" className="daily-note-btn save" onClick={saveCurrentPage}>
                          Save
                        </button>
                        {data.pages.length > 1 && (
                          <button type="button" className="daily-note-btn danger" onClick={deleteCurrentPage}>
                            Delete page
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="daily-mood-row" aria-label="Mood choices">
                      {MOOD_CHOICES.map(mood => (
                        <button
                          key={mood.id}
                          type="button"
                          className={`daily-mood-chip${currentPage?.mood === mood.id ? ' active' : ''}`}
                          onClick={() => updateMood(mood.id)}
                        >
                          <span>{mood.emoji}</span>
                          <small>{mood.label}</small>
                        </button>
                      ))}
                    </div>

                    <textarea
                      className="daily-note-input"
                      value={currentPage?.note || ''}
                      onChange={e => updateNote(e.target.value)}
                      placeholder="Write your diary here..."
                    />
                    <div className="daily-note-actions">
                      <button type="button" className="daily-note-btn" onClick={() => uploadRef.current?.click()}>
                        Upload image
                      </button>
                      <button type="button" className="daily-note-btn" onClick={() => cameraRef.current?.click()}>
                        Use camera
                      </button>
                      {currentPage?.note && (
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
                    {(currentPage?.images || []).length > 0 && (
                      <div className="daily-note-images">
                        {(currentPage?.images || []).map(img => (
                          <div key={img.id} className="daily-note-image-wrap">
                            <img className="daily-note-image" src={img.src} alt={img.name} />
                            <button type="button" className="daily-note-delete" onClick={() => removeImage(img.id)} aria-label="Delete image">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className={`daily-note-save${saveFlash ? ' is-flash' : ''}`}>
                      {saveFlash ? 'Saved just now' : `${savedAtText} · ${offlineSaveText}`}
                    </div>
                  </section>
                </div>
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
                <div className={`daily-note-save${storageState === 'error' ? ' is-error' : ''}`}>{offlineSaveText}</div>
                <div className="daily-check-list">
                  {data.checklist.length === 0 && (
                    <div className="daily-check-empty">No checklist items yet.</div>
                  )}
                  {sortedChecklist.map(item => (
                    <div key={item.id} className={`daily-check-item${item.done ? ' done' : ''}`}>
                      <button type="button" className="daily-check-toggle" onClick={() => toggleChecklistItem(item.id)} aria-label={`Toggle ${item.text}`}>
                        <span />
                      </button>
                      <button type="button" className="daily-check-text" onClick={() => toggleChecklistItem(item.id)}>
                        {item.pinned && <em className="daily-check-pin-mark">Pinned</em>}
                        {item.text}
                      </button>
                      <button type="button" className={`daily-check-pin${item.pinned ? ' active' : ''}`} onClick={() => togglePinChecklistItem(item.id)} aria-label={`${item.pinned ? 'Unpin' : 'Pin'} ${item.text} to today`}>
                        Pin
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
