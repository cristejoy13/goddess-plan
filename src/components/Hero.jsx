import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
      ['P', 'Protein', 'fish, chicken, egg whites, yogurt'],
      ['F', 'Fruit', 'fibre & fruits at your 5 PM meal'],
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
      ['L', 'Last meal', 'always stop by 5 PM'],
      ['O', 'Only 80%', 'light, not stuffed'],
      ['W', 'Walk', '15 min after meals'],
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
    // Notes and the checklist persist across days (and sync across devices);
    // we intentionally do NOT reset on a date change. Each diary page keeps its
    // own createdAt date for display.
    if (s) {
      return normalizeNotebookData(s);
    }
  } catch {
    // Local notebook data is optional.
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
    userCreated: Boolean(seed.userCreated),
    createdAt: seed.createdAt || now,
    updatedAt: seed.updatedAt || seed.createdAt || now,
  };
}

function createChecklistItem(seed = {}) {
  return {
    id: seed.id || makeNotebookId('check'),
    text: seed.text || '',
    done: Boolean(seed.done),
    pinned: Boolean(seed.pinned),
    createdAt: seed.createdAt || new Date().toISOString(),
    completedAt: seed.completedAt || '',
  };
}

function createChecklist(seed = {}) {
  const now = new Date().toISOString();
  return {
    id: seed.id || makeNotebookId('list'),
    title: seed.title ?? '',
    items: Array.isArray(seed.items) ? seed.items.map(createChecklistItem) : [],
    createdAt: seed.createdAt || now,
    updatedAt: seed.updatedAt || seed.createdAt || now,
  };
}

function createEmptyNotebook() {
  return {
    pages: [],
    activePageId: '',
    checklists: [],
    activeChecklistId: '',
    updatedAt: '',
  };
}

function pageHasDiaryContent(page) {
  return Boolean(
    (page.note || '').trim() ||
    page.mood ||
    (Array.isArray(page.images) && page.images.length > 0)
  );
}

function isLegacyAutoPage(page) {
  return !page.userCreated && !pageHasDiaryContent(page);
}

function normalizeNotebookData(raw = {}) {
  const legacyPage = raw.note || raw.mood || (Array.isArray(raw.images) && raw.images.length > 0)
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
    ? raw.pages.map(page => createNotebookPage(page)).filter(page => !isLegacyAutoPage(page))
    : (legacyPage ? [legacyPage] : []);
  const activePageId = pages.some(page => page.id === raw.activePageId)
    ? raw.activePageId
    : (pages[0]?.id || '');

  // Checklists support multiple named lists. Migrate the old single `checklist`
  // array (one list per device) into the new `checklists` shape so existing
  // items are never lost when the app updates on any device.
  const checklists = Array.isArray(raw.checklists) && raw.checklists.length > 0
    ? raw.checklists.map(createChecklist)
    : (Array.isArray(raw.checklist) && raw.checklist.length > 0
        ? [createChecklist({ title: '', items: raw.checklist })]
        : []);
  const activeChecklistId = checklists.some(list => list.id === raw.activeChecklistId)
    ? raw.activeChecklistId
    : (checklists[0]?.id || '');

  return {
    pages,
    activePageId,
    checklists,
    activeChecklistId,
    updatedAt: raw.updatedAt || '',
  };
}

function stampNotebookUpdate(patch) {
  return { ...patch, updatedAt: new Date().toISOString() };
}

function formatNotebookSavedAt(value) {
  if (!value) return 'Not saved yet';
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

function formatDiaryDate(value) {
  const d = value ? new Date(value) : new Date();
  if (Number.isNaN(d.getTime())) return 'Today';
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Auto-categorization for checklist items. Each item is matched (case-insensitive,
// whole-word-ish substring) against these keyword sets in order; the first match
// wins, and anything unrecognised falls into "Other". Order here is also the order
// categories appear in the checklist.
const CHECKLIST_CATEGORIES = [
  { id: 'fruits', label: 'Fruits', emoji: '🍎', keywords: ['apple','banana','orange','mango','grape','grapes','berry','berries','strawberry','blueberry','pineapple','papaya','watermelon','melon','kiwi','peach','pear','plum','cherry','lemon','lime','avocado','coconut','dragon fruit','guava','lychee','fruit'] },
  { id: 'veggies', label: 'Vegetables', emoji: '🥦', keywords: ['broccoli','spinach','carrot','carrots','lettuce','cabbage','cauliflower','cucumber','tomato','tomatoes','onion','garlic','potato','sweet potato','squash','eggplant','pepper','peppers','celery','kale','zucchini','mushroom','mushrooms','beans','peas','corn','ginger','veg','veggie','veggies','vegetable','salad','okra','asparagus'] },
  { id: 'protein', label: 'Protein', emoji: '🍗', keywords: ['chicken','beef','pork','fish','salmon','sardine','sardines','tuna','shrimp','prawn','egg','eggs','tofu','tempeh','turkey','bacon','ham','sausage','meat','protein','steak','lamb','crab','squid'] },
  { id: 'dairy', label: 'Dairy', emoji: '🧀', keywords: ['milk','cheese','yogurt','yoghurt','butter','cream','ice cream'] },
  { id: 'grains', label: 'Grains & Carbs', emoji: '🍞', keywords: ['rice','bread','pasta','noodle','noodles','oats','oatmeal','quinoa','flour','cereal','cracker','crackers','tortilla','bun','bagel'] },
  { id: 'beverages', label: 'Beverages', emoji: '🥤', keywords: ['water','coffee','tea','juice','soda','wine','beer','drink','smoothie','coconut water','matcha','kombucha'] },
  { id: 'snacks', label: 'Snacks', emoji: '🍫', keywords: ['chips','chocolate','cookie','cookies','candy','nuts','almond','almonds','walnut','walnuts','popcorn','biscuit','granola','snack','chia'] },
  { id: 'skincare', label: 'Skincare', emoji: '🧴', keywords: ['sunscreen','spf','niacinamide','retinol','serum','moisturizer','moisturiser','cleanser','toner','cream','face wash','vitamin c','hyaluronic','exfoliant','micellar','eye cream','skincare','sheet mask'] },
  { id: 'makeup', label: 'Makeup', emoji: '💄', keywords: ['lipstick','lip tint','foundation','concealer','mascara','eyeliner','eyeshadow','blush','powder','primer','brow','highlighter','setting spray','makeup','lip balm','bb cream','cushion'] },
  { id: 'haircare', label: 'Hair Care', emoji: '💇', keywords: ['shampoo','conditioner','hair oil','hair mask','hairspray','hair serum','scalp','comb','hair tie','hair'] },
  { id: 'personal', label: 'Personal Care', emoji: '🪥', keywords: ['toothpaste','toothbrush','floss','deodorant','soap','body wash','razor','shaving','lotion','perfume','cotton','pads','tampon','wipes','sanitizer','nail'] },
  { id: 'household', label: 'Household', emoji: '🏠', keywords: ['detergent','dish soap','sponge','tissue','tissues','toilet paper','paper towel','trash bag','cleaner','bleach','fabric softener','broom','candle','battery','batteries','light bulb','foil','plastic wrap','ziplock','laundry','cleaning'] },
  { id: 'health', label: 'Health & Pharmacy', emoji: '💊', keywords: ['vitamin','supplement','medicine','paracetamol','ibuprofen','bandage','plaster','collagen','probiotic','magnesium','psyllium','melatonin','painkiller','multivitamin'] },
];
const OTHER_CATEGORY = { id: 'other', label: 'Other', emoji: '📦' };

function categorizeChecklistItem(text) {
  const t = ` ${String(text || '').toLowerCase()} `;
  for (const cat of CHECKLIST_CATEGORIES) {
    if (cat.keywords.some(k => t.includes(k))) return cat;
  }
  return OTHER_CATEGORY;
}

// Group a list of items into ordered category buckets, keeping pinned items first
// inside each category. Only non-empty categories are returned, in CHECKLIST_CATEGORIES
// order with "Other" last.
function groupChecklistByCategory(items) {
  const buckets = new Map();
  items.forEach(item => {
    const cat = categorizeChecklistItem(item.text);
    if (!buckets.has(cat.id)) buckets.set(cat.id, { cat, items: [] });
    buckets.get(cat.id).items.push(item);
  });
  const order = [...CHECKLIST_CATEGORIES, OTHER_CATEGORY];
  return order
    .filter(cat => buckets.has(cat.id))
    .map(cat => ({
      cat,
      items: buckets.get(cat.id).items.sort((a, b) => Number(b.pinned) - Number(a.pinned)),
    }));
}

function DailyNotebook() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('notes');
  const [diaryEditorOpen, setDiaryEditorOpen] = useState(false);
  const [checklistEditorOpen, setChecklistEditorOpen] = useState(false);
  const [moodPickerOpen, setMoodPickerOpen] = useState(false);
  const [data, setData] = useState(loadNotebook);
  const [draftItem, setDraftItem] = useState('');
  const [storageState, setStorageState] = useState('saved');
  const removeTimersRef = useRef({});
  const didMountRef = useRef(false);
  // Long-press (~0.6s) arms a delete option on a checklist card or item.
  const longPressRef = useRef({ timer: null, fired: false });
  const [armedListId, setArmedListId] = useState(null);
  const [armedItemId, setArmedItemId] = useState(null);

  useEffect(() => {
    // Skip the initial mount: `data` was just loaded from storage (or freshly
    // applied by a remote sync, since a sync remounts this component). Saving it
    // back here would stamp a new timestamp and push an empty/stale blob that
    // wins last-write-wins and wipes the other device's notes. Only persist
    // once the user actually edits something.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    setStorageState(saveNotebook(data) ? 'saved' : 'error');
  }, [data]);

  useEffect(() => {
    setData(prev => {
      const pages = prev.pages.filter(page => !isLegacyAutoPage(page));
      if (pages.length === prev.pages.length) return prev;
      return stampNotebookUpdate({
        ...prev,
        pages,
        activePageId: pages.some(page => page.id === prev.activePageId) ? prev.activePageId : (pages[0]?.id || ''),
      });
    });
  }, []);

  useEffect(() => () => {
    Object.values(removeTimersRef.current).forEach(clearTimeout);
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
  const currentChecklist = data.checklists.find(list => list.id === data.activeChecklistId) || data.checklists[0];

  function updateCurrentPage(patch) {
    setData(prev => {
      const activePageId = prev.pages.some(page => page.id === prev.activePageId)
        ? prev.activePageId
        : prev.pages[0]?.id;
      if (!activePageId) return prev;
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
    const page = createNotebookPage({ userCreated: true });
    setData(prev => stampNotebookUpdate({
      ...prev,
      pages: [...prev.pages, page],
      activePageId: page.id,
    }));
    setMoodPickerOpen(false);
    setDiaryEditorOpen(true);
  }

  function selectNotebookPage(id) {
    setData(prev => ({ ...prev, activePageId: id }));
    setMoodPickerOpen(false);
    setDiaryEditorOpen(true);
  }

  function closeEditor() {
    setMoodPickerOpen(false);
    setDiaryEditorOpen(false);
    setChecklistEditorOpen(false);
  }

  function deleteCurrentPage() {
    if (!currentPage) return;
    setData(prev => {
      const pages = prev.pages.filter(page => page.id !== prev.activePageId);
      return stampNotebookUpdate({
        ...prev,
        pages,
        activePageId: pages[0]?.id || '',
      });
    });
    setMoodPickerOpen(false);
    setDiaryEditorOpen(false);
  }

  function updateMood(mood) {
    updateCurrentPage({ mood });
    setMoodPickerOpen(false);
  }

  // Apply a change to the items of the currently-open checklist, stamping it so
  // last-write-wins sync carries the edit to every device.
  function updateActiveChecklist(mapItems) {
    setData(prev => {
      const activeId = prev.checklists.some(list => list.id === prev.activeChecklistId)
        ? prev.activeChecklistId
        : prev.checklists[0]?.id;
      if (!activeId) return prev;
      const now = new Date().toISOString();
      return stampNotebookUpdate({
        ...prev,
        activeChecklistId: activeId,
        checklists: prev.checklists.map(list => list.id === activeId
          ? { ...list, items: mapItems(list.items), updatedAt: now }
          : list),
      });
    });
  }

  function addChecklist() {
    const list = createChecklist();
    setData(prev => stampNotebookUpdate({
      ...prev,
      checklists: [...prev.checklists, list],
      activeChecklistId: list.id,
    }));
    setChecklistEditorOpen(true);
  }

  function selectChecklist(id) {
    setData(prev => ({ ...prev, activeChecklistId: id }));
    setChecklistEditorOpen(true);
  }

  function deleteChecklistById(id) {
    setData(prev => {
      const checklists = prev.checklists.filter(list => list.id !== id);
      return stampNotebookUpdate({
        ...prev,
        checklists,
        activeChecklistId: prev.activeChecklistId === id ? (checklists[0]?.id || '') : prev.activeChecklistId,
      });
    });
    setArmedListId(null);
    if (id === data.activeChecklistId) setChecklistEditorOpen(false);
  }

  // Press-and-hold (~0.6s) to reveal a delete option on a card or item.
  function startLongPress(kind, id) {
    clearTimeout(longPressRef.current.timer);
    longPressRef.current.fired = false;
    longPressRef.current.timer = setTimeout(() => {
      longPressRef.current.fired = true;
      if (kind === 'list') { setArmedListId(id); setArmedItemId(null); }
      else { setArmedItemId(id); setArmedListId(null); }
      try { navigator.vibrate?.(15); } catch { /* haptics optional */ }
    }, 600);
  }
  function cancelLongPress() {
    clearTimeout(longPressRef.current.timer);
    longPressRef.current.timer = null;
  }
  // Returns true if a long-press just fired, so the tap that follows is ignored.
  function consumedLongPress() {
    if (longPressRef.current.fired) {
      longPressRef.current.fired = false;
      return true;
    }
    return false;
  }
  function disarmDelete() {
    setArmedListId(null);
    setArmedItemId(null);
  }

  function updateChecklistTitle(title) {
    setData(prev => {
      const activeId = prev.checklists.some(list => list.id === prev.activeChecklistId)
        ? prev.activeChecklistId
        : prev.checklists[0]?.id;
      if (!activeId) return prev;
      const now = new Date().toISOString();
      return stampNotebookUpdate({
        ...prev,
        activeChecklistId: activeId,
        checklists: prev.checklists.map(list => list.id === activeId
          ? { ...list, title, updatedAt: now }
          : list),
      });
    });
  }

  function addChecklistItem(e) {
    e.preventDefault();
    const text = draftItem.trim();
    if (!text) return;
    updateActiveChecklist(items => [...items, createChecklistItem({ text })]);
    setDraftItem('');
  }

  function toggleChecklistItem(id) {
    const item = currentChecklist?.items.find(entry => entry.id === id);
    if (!item) return;

    if (item.done) {
      if (removeTimersRef.current[id]) {
        clearTimeout(removeTimersRef.current[id]);
        delete removeTimersRef.current[id];
      }
      updateActiveChecklist(items => items.map(entry => entry.id === id ? { ...entry, done: false, completedAt: '' } : entry));
      return;
    }

    updateActiveChecklist(items => items.map(entry => entry.id === id ? { ...entry, done: true, completedAt: new Date().toISOString() } : entry));
    if (removeTimersRef.current[id]) clearTimeout(removeTimersRef.current[id]);
    removeTimersRef.current[id] = setTimeout(() => {
      // Remove from whichever list still holds it, in case the user switched
      // lists during the 3s grace period.
      setData(prev => stampNotebookUpdate({
        ...prev,
        checklists: prev.checklists.map(list => ({ ...list, items: list.items.filter(entry => entry.id !== id) })),
      }));
      delete removeTimersRef.current[id];
    }, 3000);
  }

  function togglePinChecklistItem(id) {
    updateActiveChecklist(items => items.map(item => item.id === id ? { ...item, pinned: !item.pinned } : item));
  }

  function deleteChecklistItem(id) {
    if (removeTimersRef.current[id]) {
      clearTimeout(removeTimersRef.current[id]);
      delete removeTimersRef.current[id];
    }
    updateActiveChecklist(items => items.filter(item => item.id !== id));
  }

  const checklistItems = currentChecklist?.items || [];
  const checkedCount = checklistItems.filter(item => item.done).length;
  const checklistGroups = groupChecklistByCategory(checklistItems);
  const currentMood = MOOD_CHOICES.find(choice => choice.id === currentPage?.mood);
  const offlineSaveText = storageState === 'saved'
    ? 'Saved offline on this device'
    : 'Could not save. Storage may be full.';

  return (
    <>
      <button
        type="button"
        className="daily-notebook-launcher splash-item"
        onClick={() => {
          setOpen(true);
          closeEditor();
        }}
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

      {open && createPortal(
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
                <div className="daily-notebook-title">
                  {mode === 'notes'
                    ? (diaryEditorOpen ? (currentPage?.title || 'Title') : 'Diary')
                    : (checklistEditorOpen ? (currentChecklist?.title || 'Untitled list') : 'Checklists')}
                </div>
              </div>
              <button type="button" className="daily-notebook-close" onClick={() => setOpen(false)} aria-label="Close daily notebook">
                ×
              </button>
            </div>

            <div className="daily-notebook-options" role="tablist" aria-label="Notebook type">
              <button
                type="button"
                className={`daily-notebook-option daily-notebook-option-notes${mode === 'notes' ? ' active' : ''}`}
                onClick={() => {
                  setMode('notes');
                  closeEditor();
                }}
              >
                <span>Diary</span>
                <small>Write in your diary</small>
              </button>
              <button
                type="button"
                className={`daily-notebook-option daily-notebook-option-checklist${mode === 'checklist' ? ' active' : ''}`}
                onClick={() => {
                  setMode('checklist');
                  closeEditor();
                }}
              >
                <span>Checklist</span>
                <small>Make a check-off list</small>
              </button>
            </div>

            {mode === 'notes' ? (
              <div className="daily-note-panel">
                <div className={`daily-note-workspace${diaryEditorOpen ? ' editor-open' : ' pages-only'}`}>
                  <aside className="daily-pages-board" aria-label="Diary entries">
                    <div className="daily-pages-board-top">
                      <span>Entries</span>
                      <button type="button" className="daily-page-add" onClick={addNotebookPage} aria-label="Add new entry">
                        +
                      </button>
                    </div>
                    <div className="daily-page-list">
                      {data.pages.length === 0 && (
                        <div className="daily-page-empty">No entries yet — tap ＋ to write one.</div>
                      )}
                      {data.pages.map(page => {
                        const mood = MOOD_CHOICES.find(choice => choice.id === page.mood);
                        return (
                          <button
                            key={page.id}
                            type="button"
                            className={`daily-page-card${page.id === data.activePageId ? ' active' : ''}`}
                            onClick={() => selectNotebookPage(page.id)}
                          >
                            <strong>{page.title || 'Title'}</strong>
                            <span>{mood ? `${mood.emoji} ${mood.label}` : 'No mood yet'}</span>
                            <small>{formatNotebookSavedAt(page.updatedAt)}</small>
                          </button>
                        );
                      })}
                    </div>
                  </aside>

                  {diaryEditorOpen && currentPage && (
                  <section className="daily-note-editor">
                    <button type="button" className="daily-note-back" onClick={closeEditor}>
                      ‹ Back
                    </button>

                    <div className="daily-note-title-row">
                      <input
                        className="daily-page-title-input"
                        type="text"
                        value={currentPage?.title || ''}
                        onChange={e => updateCurrentPage({ title: e.target.value })}
                        placeholder="Title"
                      />
                      <div className="daily-note-meta">
                        <span className="daily-note-date">{formatDiaryDate(currentPage?.updatedAt)}</span>
                        <button
                          type="button"
                          className={`daily-note-current-mood${currentMood ? ' has-mood' : ''}${moodPickerOpen ? ' is-open' : ''}`}
                          onClick={() => setMoodPickerOpen(open => !open)}
                          aria-expanded={moodPickerOpen}
                          aria-label={currentMood ? `Mood: ${currentMood.label}. Tap to change.` : 'Choose a mood'}
                        >
                          {currentMood ? `${currentMood.emoji} ${currentMood.label}` : '＋ Mood'}
                        </button>
                      </div>
                    </div>

                    {moodPickerOpen && (
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
                    )}

                    {data.pages.length > 0 && (
                      <button type="button" className="daily-note-btn danger daily-delete-page-btn" onClick={deleteCurrentPage}>
                        Delete page
                      </button>
                    )}

                    <textarea
                      className="daily-note-input"
                      value={currentPage?.note || ''}
                      onChange={e => updateNote(e.target.value)}
                      placeholder="Write your diary here..."
                    />
                  </section>
                  )}
                </div>
              </div>
            ) : (
              <div className="daily-check-panel">
                <div className={`daily-note-workspace${checklistEditorOpen ? ' editor-open' : ' pages-only'}`}>
                  <aside className="daily-pages-board" aria-label="Your checklists">
                    <div className="daily-pages-board-top">
                      <span>Lists</span>
                      <button type="button" className="daily-page-add" onClick={addChecklist} aria-label="Add new checklist">
                        +
                      </button>
                    </div>
                    <div className="daily-page-list">
                      {data.checklists.length === 0 && (
                        <div className="daily-page-empty">No lists yet — tap ＋ to make one (groceries, to-do, packing…).</div>
                      )}
                      {data.checklists.map(list => {
                        const done = list.items.filter(item => item.done).length;
                        const armed = armedListId === list.id;
                        return (
                          <div key={list.id} className={`daily-page-card-wrap${armed ? ' armed' : ''}`}>
                            <button
                              type="button"
                              className={`daily-page-card${list.id === data.activeChecklistId ? ' active' : ''}`}
                              onClick={() => { if (consumedLongPress()) return; disarmDelete(); selectChecklist(list.id); }}
                              onPointerDown={() => startLongPress('list', list.id)}
                              onPointerUp={cancelLongPress}
                              onPointerLeave={cancelLongPress}
                              onPointerCancel={cancelLongPress}
                              onContextMenu={e => e.preventDefault()}
                            >
                              <strong>{list.title || 'Untitled list'}</strong>
                              <span>{list.items.length ? `${done}/${list.items.length} done` : 'Empty list'}</span>
                              <small>{formatNotebookSavedAt(list.updatedAt)}</small>
                            </button>
                            {armed && (
                              <div className="daily-delete-pop" role="dialog" aria-label={`Delete ${list.title || 'this list'}?`}>
                                <span>Delete this list?</span>
                                <div className="daily-delete-pop-btns">
                                  <button type="button" className="daily-delete-confirm" onClick={() => deleteChecklistById(list.id)}>Delete</button>
                                  <button type="button" className="daily-delete-cancel" onClick={disarmDelete}>Cancel</button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </aside>

                  {checklistEditorOpen && currentChecklist && (
                  <section className="daily-note-editor daily-check-editor">
                    <button type="button" className="daily-note-back" onClick={closeEditor}>
                      ‹ Back
                    </button>

                    <input
                      className="daily-page-title-input"
                      type="text"
                      value={currentChecklist.title || ''}
                      onChange={e => updateChecklistTitle(e.target.value)}
                      placeholder="List name (e.g. Groceries, To-do, Packing)"
                    />

                    <form className="daily-check-add" onSubmit={addChecklistItem}>
                      <input
                        type="text"
                        value={draftItem}
                        onChange={e => setDraftItem(e.target.value)}
                        placeholder="Add an item..."
                      />
                      <button type="submit">Add</button>
                    </form>
                    <div className="daily-check-count">{checkedCount}/{checklistItems.length} done</div>
                    <div className={`daily-note-save${storageState === 'error' ? ' is-error' : ''}`}>{offlineSaveText}</div>
                    <div className="daily-check-hint">Tip: press and hold a list or item to delete it. Items sort into categories automatically.</div>

                    {checklistItems.length === 0 ? (
                      <div className="daily-check-empty">No items yet.</div>
                    ) : (
                      <div className="daily-check-groups">
                        {checklistGroups.map(group => (
                          <div key={group.cat.id} className="daily-check-group">
                            <div className="daily-check-group-title">{group.cat.emoji} {group.cat.label}</div>
                            <div className="daily-check-group-items">
                              {group.items.map(item => {
                                const armed = armedItemId === item.id;
                                return (
                                  <div
                                    key={item.id}
                                    className={`daily-check-item${item.done ? ' done' : ''}${armed ? ' armed' : ''}`}
                                    onPointerDown={() => startLongPress('item', item.id)}
                                    onPointerUp={cancelLongPress}
                                    onPointerLeave={cancelLongPress}
                                    onPointerCancel={cancelLongPress}
                                    onContextMenu={e => e.preventDefault()}
                                  >
                                    <button type="button" className="daily-check-toggle" onPointerDown={e => e.stopPropagation()} onClick={() => { if (consumedLongPress()) return; toggleChecklistItem(item.id); }} aria-label={`Toggle ${item.text}`}>
                                      <span />
                                    </button>
                                    <button type="button" className="daily-check-text" onClick={() => { if (consumedLongPress()) return; toggleChecklistItem(item.id); }}>
                                      {item.pinned && <em className="daily-check-pin-mark">Pinned</em>}
                                      {item.text}
                                    </button>
                                    <button type="button" className={`daily-check-pin${item.pinned ? ' active' : ''}`} onPointerDown={e => e.stopPropagation()} onClick={() => { if (consumedLongPress()) return; togglePinChecklistItem(item.id); }} aria-label={`${item.pinned ? 'Unpin' : 'Pin'} ${item.text}`}>
                                      Pin
                                    </button>
                                    {armed && (
                                      <div className="daily-item-delete-pop" onPointerDown={e => e.stopPropagation()}>
                                        <button type="button" className="daily-delete-confirm" onClick={() => { deleteChecklistItem(item.id); setArmedItemId(null); }}>Delete</button>
                                        <button type="button" className="daily-delete-cancel" onClick={() => setArmedItemId(null)} aria-label="Cancel">✕</button>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body,
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

  // Ordered morning → night: start with the morning routine, then the workout,
  // then daytime meals + walk, then the evening shower and night routine.
  const rows = [
    { id: 'sec-morning', divider: true, label: '☀️ Morning' },
    { id: 'am-skin', icon: '☀️', title: 'Morning routine · AM skincare', note: 'Cleanse · Vitamin C · SPF', nav: ['skincare', 'am'] },
    { id: 'workout', icon: today.emoji, title: today.title, note: today.sub, nav: ['workout', null, todayDayId] },
    { id: 'sec-day', divider: true, label: '🌤️ Daytime · finish eating by 5 PM' },
    ...mealRows,
    { id: 'walk', icon: '🚶', title: 'Walk 15 min after meals', note: 'beats bloating' },
    { id: 'sec-night', divider: true, label: '🌙 Night' },
    { id: 'body', icon: '🫧', title: 'Shower & body care', note: 'Shower · Moisturise · SPF', nav: ['skincare', 'body'] },
    { id: 'hair', icon: '💎', title: 'Hair care', note: 'Oil ritual · Scalp massage', nav: ['skincare', 'hair'] },
    { id: 'pm-skin', icon: '🌙', title: 'Night routine · PM skincare', note: 'Double cleanse · Treatment · Repair', nav: ['skincare', 'pm'] },
  ];

  const taskRows = rows.filter(r => !r.divider);
  const done = taskRows.filter(r => checked[r.id]).length;

  return (
    <div className="today-dashboard splash-item">
      <div className="today-dashboard-top">
        <div>
          <div className="daily-plan-label">Today's Plan</div>
          <div className="today-dashboard-date">
            {today.day} <span className="today-progress">{done}/{taskRows.length} ✨</span>
          </div>
        </div>
        <button className="today-open-btn" onClick={() => onNavigate('workout', null, todayDayId)}>Open day</button>
      </div>

      <div className="today-timeline">
        {rows.map(r => (
          r.divider ? (
            <div key={r.id} className="tl-section">{r.label}</div>
          ) : (
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
          )
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
        <div className="hero-brand-tag">🌸 OMAD · One Meal at 5 PM · Stop by 5 PM 🌸</div>
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
          <div className="hero-rule"><span>🥭</span><span>OMAD: one meal at 5 PM · water, tea &amp; psyllium husk during the day · never eat after 5 PM</span></div>
          <div className="hero-rule"><span>😴</span><span>Sleep 7.5–9 hours — glutes grow overnight</span></div>
          <div className="hero-rule hero-rule-bored"><span>💧</span><span>Craving? Water first, wait 10 minutes. Still hungry — eat slowly. Bored — walk, stretch, or read a page.</span></div>
        </div>
      </div>
    </div>
  );
}
