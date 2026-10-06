import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { WORKOUT_DAYS } from '../data/workouts';
import { mergeNotebookBlobs } from '../utils/mergeNotebook';
import { GoalsToggle, GoalsPanel } from './Goals';
import { useGoalsData } from '../utils/useGoalsData';
import { useWorkouts, markWorkout, unmarkWorkout } from '../utils/useWorkouts';
import { loadWorkouts, saveWorkouts, logWorkout, dayKey as workoutDayKey } from '../utils/workoutLog';
import { ask } from '../utils/ask';

const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS    = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const jsDay    = new Date().getDay();
const dayIndex = jsDay === 0 ? 6 : jsDay - 1;

function todayLabel() {
  const d = new Date();
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

// The day pills under the title take their picture from the plan itself, so
// changing a day in src/data/workouts.js changes its pill too.
const WEEK_PILLS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((label, i) => ({
  label,
  emoji: WORKOUT_DAYS[i].emoji,
  dayId: ['day-monday', 'day-tuesday', 'day-wednesday', 'day-thursday', 'day-friday', 'day-saturday', 'day-sunday'][i],
}));

const RULE_BOARDS = [
  {
    title: 'No GODSSS',
    icon: '/rules/no-godsss.jpg',
    emoji: '🚫',
    tone: 'no',
    items: [
      ['G', 'Gluten', 'skip bread, pasta, flour'],
      ['O', 'Oils', 'steam, boil, bake, or dry sear'],
      ['D', 'Dairy', 'no milk or cheese — Greek yogurt only'],
      ['S', 'Sweet', 'fruit first, no added sugar'],
      ['S', 'Salty', 'keep seasoning light'],
      ['S', 'Stress', 'walk, breathe, sleep'],
    ],
  },
  {
    title: 'PFBS',
    icon: '/rules/pfbs.jpg',
    emoji: '✨',
    tone: 'yes',
    items: [
      ['P', 'Protein', 'beef, chicken, fish, eggs or tofu — any day'],
      ['F', 'Fruit', 'apple, banana, berries or papaya · 12 PM'],
      ['B', 'Bland', 'simple food, calm gut'],
      ['S', 'Small', 'steady portions'],
    ],
  },
  {
    title: 'SLOW',
    icon: '/rules/slow.jpg',
    emoji: '🐢',
    tone: 'yes',
    items: [
      ['S', 'Small bites', 'put the fork down'],
      ['L', 'Last meal', '5 PM plate. Nothing after'],
      ['O', 'Only 80%', 'light, not stuffed'],
      ['W', 'Walk', 'easy, every evening'],
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
    albumId: seed.albumId || '',
    // Extra side-by-side columns for comparing things. 1 = plain page.
    // `note` is always column one; `notes` holds columns two to four, and is
    // kept even when fewer columns are shown, so nothing written is lost.
    columns: [2, 3, 4].includes(seed.columns) ? seed.columns : 1,
    notes: Array.isArray(seed.notes) ? seed.notes.slice(0, 3).map(n => (typeof n === 'string' ? n : '')) : [],
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

// An album is a named stack of diary pages. Pages point at it by albumId.
function createAlbum(seed = {}) {
  const now = new Date().toISOString();
  return {
    id: seed.id || makeNotebookId('album'),
    title: seed.title ?? '',
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
    albums: [],
    deleted: {},
    updatedAt: '',
  };
}

// A page counts as hers the moment it holds ANYTHING — a line of writing, a
// mood, a photo, or just a name she typed at the top. The title matters as much
// as the rest: a page called "Groceries" with nothing under it yet is a page
// she made on purpose, and it has to survive being closed and reopened.
function pageHasDiaryContent(page) {
  return Boolean(
    (page.note || '').trim() ||
    (Array.isArray(page.notes) && page.notes.some(n => (n || '').trim())) ||
    (page.title || '').trim() ||
    page.mood ||
    (Array.isArray(page.images) && page.images.length > 0)
  );
}

// The only page ever swept away is one the app generated by itself and that
// has stayed completely blank ever since. Older saves predate the userCreated
// flag, so they arrive with it false; the content test above is what stops
// those being mistaken for throwaway pages and deleted. Nothing she has
// written is ever removed here — that is hers to do, and only hers.
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
    albums: Array.isArray(raw.albums) ? raw.albums.map(createAlbum) : [],
    deleted: (raw.deleted && typeof raw.deleted === 'object') ? raw.deleted : {},
    updatedAt: raw.updatedAt || '',
  };
}

function stampNotebookUpdate(patch) {
  return { ...patch, updatedAt: new Date().toISOString() };
}

// Record that something was deleted, so merging with another gadget's copy
// does not resurrect it. See mergeNotebook.js — the tombstones expire on their
// own after two months.
function tombstone(prev, ...ids) {
  const at = new Date().toISOString();
  const deleted = { ...(prev.deleted || {}) };
  ids.filter(Boolean).forEach(id => { deleted[id] = at; });
  return deleted;
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

// Small line icons for the notebook's buttons. They take the button's colour.
function NbIcon({ name }) {
  const paths = {
    trash: <><path d="M4 7h16" /><path d="M9 7V4.5h6V7" /><path d="M6.5 7l1 12.5h9l1-12.5" /><path d="M10 11v5.5M14 11v5.5" /></>,
    album: <><rect x="4" y="8" width="16" height="12" rx="2.5" /><path d="M6.5 5h11M9 2.5h6" /></>,
    select: <><circle cx="12" cy="12" r="8.5" /><path d="M8.3 12.2l2.5 2.5 5-5.2" /></>,
    close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
    ungroup: <><rect x="3.5" y="9" width="10" height="10" rx="2" /><path d="M10.5 5h8a2 2 0 0 1 2 2v8" /></>,
    out: <><path d="M14 4.5h4.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H14" /><path d="M4 12h10M8.5 7.5L4 12l4.5 4.5" /></>,
  };
  return (
    <svg className="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// A box split into n columns, for the 2 / 3 / 4 column buttons.
function ColumnsIcon({ n }) {
  const w = 16 / n;
  return (
    <svg className="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      {Array.from({ length: n - 1 }, (_, i) => (
        <path key={i} d={`M${4 + w * (i + 1)} 5v14`} />
      ))}
    </svg>
  );
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
  // Diary: hold an entry (or tap the select icon) to pick several at once,
  // then delete them or stack them into an album.
  const [selecting, setSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openAlbumId, setOpenAlbumId] = useState('');
  const [albumMenuOpen, setAlbumMenuOpen] = useState(false);

  // While the notebook is open, only the notebook scrolls — not the homepage.
  useEffect(() => {
    if (!open) return undefined;
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = was; };
  }, [open]);

  // Writing on every keystroke meant serializing the whole notebook — every
  // page, every list, every photo — between one letter and the next, which is
  // what made typing feel slow. Waiting until she pauses writes once instead
  // of once per character. The pending write is flushed if the component goes
  // away or the app is backgrounded, so nothing is ever left unsaved.
  const saveTimerRef = useRef(null);
  const pendingRef = useRef(null);

  const flushSave = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (pendingRef.current) {
      const ok = saveNotebook(pendingRef.current);
      pendingRef.current = null;
      setStorageState(ok ? 'saved' : 'error');
    }
  }, []);

  useEffect(() => {
    // Skip the initial mount: `data` was just loaded from storage. Saving it
    // back here would stamp a new timestamp on an unchanged blob and push it
    // for nothing. Only persist once she actually edits something.
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    pendingRef.current = data;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(flushSave, 400);
  }, [data, flushSave]);

  useEffect(() => {
    window.addEventListener('pagehide', flushSave);
    document.addEventListener('visibilitychange', flushSave);
    return () => {
      window.removeEventListener('pagehide', flushSave);
      document.removeEventListener('visibilitychange', flushSave);
      flushSave();
    };
  }, [flushSave]);

  // A note arriving from another gadget used to reset this whole screen: the
  // panel snapped shut, the page she was reading changed, and a half-typed
  // checklist item vanished. Now the incoming copy is merged into what is
  // already on screen, so her notes simply appear alongside her own and
  // nothing she is in the middle of is disturbed.
  useEffect(() => {
    const onRemote = () => {
      const stored = localStorage.getItem('gp_daily_notebook');
      if (!stored) return;
      setData(prev => {
        const merged = mergeNotebookBlobs(JSON.stringify(prev), stored);
        try {
          return normalizeNotebookData(JSON.parse(merged));
        } catch {
          return prev;
        }
      });
    };
    window.addEventListener('gp-remote-sync', onRemote);
    return () => window.removeEventListener('gp-remote-sync', onRemote);
  }, []);

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

  // Column 2, 3 or 4 of a page split for comparing.
  function updateColumnNote(index, text) {
    const notes = [...(currentPage?.notes || [])];
    while (notes.length < index) notes.push('');
    notes[index - 1] = text;
    updateCurrentPage({ notes });
  }

  // Tap 2, 3 or 4 to split the page; tap the lit one again to go back to one.
  function pickColumns(n) {
    updateCurrentPage({ columns: currentPage?.columns === n ? 1 : n });
  }

  function addNotebookPage() {
    const page = createNotebookPage({ userCreated: true, albumId: openAlbumId });
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

  async function deleteCurrentPage() {
    if (!currentPage) return;
    const name = currentPage.title ? `"${currentPage.title}"` : 'this entry';
    if (!(await ask(`Delete ${name}? This cannot be undone.`, { yes: 'Delete', danger: true }))) return;
    setData(prev => {
      const pages = prev.pages.filter(page => page.id !== prev.activePageId);
      return stampNotebookUpdate({
        ...prev,
        pages,
        deleted: tombstone(prev, prev.activePageId),
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
        deleted: tombstone(prev, id),
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

  // ── Selecting diary entries, and albums ──
  function stopSelecting() {
    setSelecting(false);
    setSelectedIds([]);
    setAlbumMenuOpen(false);
  }

  function toggleSelected(id) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  // Hold an entry to start selecting, with that entry already picked.
  function startEntryPress(id) {
    if (selecting) return;
    clearTimeout(longPressRef.current.timer);
    longPressRef.current.fired = false;
    longPressRef.current.timer = setTimeout(() => {
      longPressRef.current.fired = true;
      setSelecting(true);
      setSelectedIds([id]);
      try { navigator.vibrate?.(15); } catch { /* haptics optional */ }
    }, 500);
  }

  function tapEntry(id) {
    if (consumedLongPress()) return;
    if (selecting) toggleSelected(id);
    else selectNotebookPage(id);
  }

  // Move pages in or out of an album. Each moved page is stamped so the move
  // reaches the other gadgets.
  function setPagesAlbum(prev, ids, albumId) {
    const now = new Date().toISOString();
    return prev.pages.map(page => ids.includes(page.id) ? { ...page, albumId, updatedAt: now } : page);
  }

  async function deleteSelected() {
    const n = selectedIds.length;
    if (!n) return;
    const what = n === 1 ? 'this entry' : `these ${n} entries`;
    if (!(await ask(`Delete ${what}? This cannot be undone.`, { yes: 'Delete', danger: true }))) return;
    const ids = selectedIds;
    setData(prev => {
      const pages = prev.pages.filter(page => !ids.includes(page.id));
      return stampNotebookUpdate({
        ...prev,
        pages,
        deleted: tombstone(prev, ...ids),
        activePageId: pages.some(page => page.id === prev.activePageId) ? prev.activePageId : (pages[0]?.id || ''),
      });
    });
    stopSelecting();
  }

  function makeAlbumFromSelected() {
    if (!selectedIds.length) return;
    const album = createAlbum();
    const ids = selectedIds;
    setData(prev => stampNotebookUpdate({
      ...prev,
      albums: [...(prev.albums || []), album],
      pages: setPagesAlbum(prev, ids, album.id),
    }));
    stopSelecting();
    setOpenAlbumId(album.id);
  }

  function addSelectedToAlbum(albumId) {
    if (!selectedIds.length) return;
    const ids = selectedIds;
    const now = new Date().toISOString();
    setData(prev => stampNotebookUpdate({
      ...prev,
      albums: prev.albums.map(album => album.id === albumId ? { ...album, updatedAt: now } : album),
      pages: setPagesAlbum(prev, ids, albumId),
    }));
    stopSelecting();
    setOpenAlbumId(albumId);
  }

  async function takeSelectedOutOfAlbum() {
    const n = selectedIds.length;
    if (!n) return;
    const what = n === 1 ? 'this entry' : `these ${n} entries`;
    if (!(await ask(`Take ${what} out of the album? They stay in your diary.`, { yes: 'Take out' }))) return;
    const ids = selectedIds;
    setData(prev => stampNotebookUpdate({ ...prev, pages: setPagesAlbum(prev, ids, '') }));
    stopSelecting();
  }

  function renameAlbum(id, title) {
    const now = new Date().toISOString();
    setData(prev => stampNotebookUpdate({
      ...prev,
      albums: prev.albums.map(album => album.id === id ? { ...album, title, updatedAt: now } : album),
    }));
  }

  async function ungroupAlbum(id) {
    const album = data.albums.find(a => a.id === id);
    const name = album?.title ? `"${album.title}"` : 'this album';
    if (!(await ask(`Remove ${name}? The entries inside stay in your diary.`, { yes: 'Remove album', danger: true }))) return;
    setData(prev => {
      const inside = prev.pages.filter(page => page.albumId === id).map(page => page.id);
      return stampNotebookUpdate({
        ...prev,
        albums: prev.albums.filter(a => a.id !== id),
        pages: setPagesAlbum(prev, inside, ''),
        deleted: tombstone(prev, id),
      });
    });
    stopSelecting();
    setOpenAlbumId('');
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
    setData(prev => stampNotebookUpdate({ ...prev, deleted: tombstone(prev, id) }));
    updateActiveChecklist(items => items.filter(item => item.id !== id));
  }

  const albums = data.albums || [];
  const openAlbum = albums.find(album => album.id === openAlbumId) || null;
  const albumIds = new Set(albums.map(album => album.id));
  const visibleAlbums = openAlbum ? [] : albums;
  const visiblePages = openAlbum
    ? data.pages.filter(page => page.albumId === openAlbum.id)
    : data.pages.filter(page => !albumIds.has(page.albumId));

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
          stopSelecting();
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
                    ? (diaryEditorOpen ? (currentPage?.title || 'Title') : (openAlbum ? (openAlbum.title || 'Album') : 'Diary'))
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
                  stopSelecting();
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
                  stopSelecting();
                }}
              >
                <span>Checklist</span>
                <small>Make a check-off list</small>
              </button>
            </div>

            {mode === 'notes' ? (
              <div className="daily-note-panel">
                <div className={`daily-note-workspace${diaryEditorOpen ? ' editor-open' : ' pages-only'}`}>
                  <aside className={`daily-pages-board${selecting ? ' is-selecting' : ''}`} aria-label="Diary entries">
                    {openAlbum && !selecting && (
                      <div className="nb-album-head">
                        <button type="button" className="nb-icon-btn" onClick={() => setOpenAlbumId('')} aria-label="Back to all entries">
                          <span aria-hidden="true">‹</span>
                        </button>
                        <input
                          className="nb-album-title"
                          type="text"
                          value={openAlbum.title}
                          onChange={e => renameAlbum(openAlbum.id, e.target.value)}
                          placeholder="Album name"
                          autoFocus={!openAlbum.title}
                          aria-label="Album name"
                        />
                        <button type="button" className="nb-icon-btn danger" onClick={() => ungroupAlbum(openAlbum.id)} aria-label="Remove album, keep its entries" title="Remove album">
                          <NbIcon name="ungroup" />
                        </button>
                      </div>
                    )}
                    <div className="daily-pages-board-top">
                      {selecting ? (
                        <>
                          <span>{selectedIds.length} selected</span>
                          <div className="nb-actions">
                            {openAlbum ? (
                              <button type="button" className="nb-icon-btn" onClick={takeSelectedOutOfAlbum} disabled={!selectedIds.length} aria-label="Take out of album" title="Take out of album">
                                <NbIcon name="out" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                className={`nb-icon-btn${albumMenuOpen ? ' is-on' : ''}`}
                                onClick={() => { if (data.albums.length) setAlbumMenuOpen(o => !o); else makeAlbumFromSelected(); }}
                                disabled={!selectedIds.length}
                                aria-label="Put in an album"
                                aria-expanded={data.albums.length ? albumMenuOpen : undefined}
                                title="Put in an album"
                              >
                                <NbIcon name="album" />
                              </button>
                            )}
                            <button type="button" className="nb-icon-btn danger" onClick={deleteSelected} disabled={!selectedIds.length} aria-label="Delete selected" title="Delete">
                              <NbIcon name="trash" />
                            </button>
                            <button type="button" className="nb-icon-btn" onClick={stopSelecting} aria-label="Stop selecting" title="Done">
                              <NbIcon name="close" />
                            </button>
                          </div>
                          {albumMenuOpen && (
                            <div className="nb-album-menu" role="menu" aria-label="Choose an album">
                              <button type="button" role="menuitem" onClick={makeAlbumFromSelected}>＋ New album</button>
                              {data.albums.map(album => (
                                <button key={album.id} type="button" role="menuitem" onClick={() => addSelectedToAlbum(album.id)}>
                                  {album.title || 'Untitled album'}
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <span>{openAlbum ? `${visiblePages.length} ${visiblePages.length === 1 ? 'entry' : 'entries'}` : 'Entries'}</span>
                          <div className="nb-actions">
                            {visiblePages.length > 0 && (
                              <button type="button" className="nb-icon-btn" onClick={() => { setSelecting(true); setSelectedIds([]); }} aria-label="Select entries" title="Select">
                                <NbIcon name="select" />
                              </button>
                            )}
                            <button type="button" className="daily-page-add" onClick={addNotebookPage} aria-label="Add new entry">
                              +
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="daily-page-list">
                      {visiblePages.length === 0 && visibleAlbums.length === 0 && (
                        <div className="daily-page-empty">
                          {openAlbum ? 'This album is empty — tap ＋ to write in it.' : 'No entries yet — tap ＋ to write one.'}
                        </div>
                      )}
                      {visibleAlbums.map(album => {
                        const count = data.pages.filter(page => page.albumId === album.id).length;
                        return (
                          <button
                            key={album.id}
                            type="button"
                            className="daily-page-card nb-album-card"
                            onClick={() => setOpenAlbumId(album.id)}
                          >
                            <strong>{album.title || 'Untitled album'}</strong>
                            <span><NbIcon name="album" /> {count} {count === 1 ? 'entry' : 'entries'}</span>
                            <small>{formatNotebookSavedAt(album.updatedAt)}</small>
                          </button>
                        );
                      })}
                      {visiblePages.map(page => {
                        const mood = MOOD_CHOICES.find(choice => choice.id === page.mood);
                        const picked = selectedIds.includes(page.id);
                        return (
                          <button
                            key={page.id}
                            type="button"
                            className={`daily-page-card${!selecting && page.id === data.activePageId ? ' active' : ''}${picked ? ' is-picked' : ''}`}
                            onClick={() => tapEntry(page.id)}
                            onPointerDown={() => startEntryPress(page.id)}
                            onPointerUp={cancelLongPress}
                            onPointerLeave={cancelLongPress}
                            onPointerCancel={cancelLongPress}
                            onContextMenu={e => e.preventDefault()}
                            aria-pressed={selecting ? picked : undefined}
                          >
                            {selecting && <span className="nb-tick" aria-hidden="true">{picked ? '✓' : ''}</span>}
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
                    <div className="nb-editor-top">
                      <button type="button" className="daily-note-back" onClick={closeEditor}>
                        ‹ Back
                      </button>
                      <div className="nb-actions">
                        <div className="nb-cols" role="group" aria-label="Columns">
                          {[2, 3, 4].map(n => (
                            <button
                              key={n}
                              type="button"
                              className={`nb-icon-btn${currentPage?.columns === n ? ' is-on' : ''}`}
                              onClick={() => pickColumns(n)}
                              aria-pressed={currentPage?.columns === n}
                              aria-label={`${n} columns`}
                              title={`${n} columns`}
                            >
                              <ColumnsIcon n={n} />
                            </button>
                          ))}
                        </div>
                        <button type="button" className="nb-icon-btn danger" onClick={deleteCurrentPage} aria-label="Delete this entry" title="Delete entry">
                          <NbIcon name="trash" />
                        </button>
                      </div>
                    </div>

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

                    {(currentPage?.columns || 1) > 1 ? (
                      <div className={`nb-columns nb-columns-${currentPage.columns}`}>
                        <textarea
                          className="daily-note-input"
                          value={currentPage.note || ''}
                          onChange={e => updateNote(e.target.value)}
                          placeholder="Column 1"
                          aria-label="Column 1"
                        />
                        {Array.from({ length: currentPage.columns - 1 }, (_, i) => i + 1).map(i => (
                          <textarea
                            key={i}
                            className="daily-note-input"
                            value={currentPage.notes?.[i - 1] || ''}
                            onChange={e => updateColumnNote(i, e.target.value)}
                            placeholder={`Column ${i + 1}`}
                            aria-label={`Column ${i + 1}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="daily-note-input"
                        value={currentPage?.note || ''}
                        onChange={e => updateNote(e.target.value)}
                        placeholder="Write your diary here..."
                      />
                    )}
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
                        <div className="daily-page-empty">No lists yet — tap ＋ to make one.</div>
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
                      placeholder="List name"
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
                    <div className="daily-check-hint">Hold a list or item to delete. Categories sort automatically.</div>

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
                                    {/* Only the circle ticks an item; tapping or scrolling over the words does nothing. */}
                                    <span className="daily-check-text">
                                      {item.pinned && <em className="daily-check-pin-mark">Pinned</em>}
                                      {item.text}
                                    </span>
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

// A workout ticked today before the 1,000-workout record existed is still
// real: carry it over once, quietly, so today is not lost from the count.
function loadChecksCarryingWorkout(today) {
  const checks = loadChecks();
  if (!checks.workout) return checks;
  const log = loadWorkouts();
  const key = workoutDayKey();
  if (!log.days[key]) saveWorkouts(logWorkout(log, key, today.day?.split(' · ')[1] || today.title));
  const next = { ...checks };
  delete next.workout;
  try { localStorage.setItem('gp_today_checks', JSON.stringify({ date: todayKey(), checked: next })); } catch { /* optional */ }
  return next;
}

function TodayDashboard({ today, todayDayId, onNavigate }) {
  const [checked, setChecked] = useState(() => loadChecksCarryingWorkout(today));
  // The workout tick is the 1,000-workout record, not a daily check that is
  // forgotten at midnight. The walk stays an ordinary check: it never counts.
  const { stats: workoutStats } = useWorkouts();


  // Refresh from storage when another gadget ticks something off, instead of
  // relying on the whole screen being rebuilt.
  useEffect(() => {
    const onRemote = () => setChecked(loadChecks());
    window.addEventListener('gp-remote-sync', onRemote);
    return () => window.removeEventListener('gp-remote-sync', onRemote);
  }, []);

  function toggle(id) {
    if (id === 'workout') {
      if (workoutStats.doneToday) unmarkWorkout(); else markWorkout();
      return;
    }
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

  // Two meals a day, the same two every day — but the icons still ride on the
  // row itself rather than a fixed list, so the timeline cannot drift out of
  // step with the plan.
  const mealRows = today.meals.rows.map((row, i) => {
    const [time, name] = row.time.split(' — ');
    return {
      id: `meal-${i}`,
      icon: row.icon || '🍽️',
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
    // Nothing comes before the main workout any more — the warm-up is part of
    // the session itself, and the running moved to the weekend. `cardioBefore`
    // stays supported so a future day can put something ahead of the workout.
    ...(today.cardioBefore
      ? [{ id: 'cardio-pre', icon: today.cardioBefore.icon, title: today.cardioBefore.title, note: today.cardioBefore.note }]
      : []),
    { id: 'workout', icon: today.emoji, title: today.title, note: today.sub, nav: ['workout', null, todayDayId] },
    { id: 'cardio', icon: today.cardio?.icon || '🚶', title: today.cardio?.title || 'Easy evening walk', note: today.cardio?.note },
    { id: 'sec-day', divider: true, label: `🌤️ Meals · ${today.meals.clock}` },
    ...mealRows,
    { id: 'sec-night', divider: true, label: '🌙 Night' },
    { id: 'body', icon: '🫧', title: 'Shower & body care', note: 'Shower · Moisturise · SPF', nav: ['skincare', 'body'] },
    { id: 'hair', icon: '💎', title: 'Hair care', note: 'Oil ritual · Scalp massage', nav: ['skincare', 'hair'] },
    { id: 'pm-skin', icon: '🌙', title: 'Night routine · PM skincare', note: 'Double cleanse · Treatment · Repair', nav: ['skincare', 'pm'] },
  ];

  const isChecked = id => (id === 'workout' ? workoutStats.doneToday : !!checked[id]);
  const taskRows = rows.filter(r => !r.divider);
  const done = taskRows.filter(r => isChecked(r.id)).length;

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
          <div key={r.id} className={`tl-row${isChecked(r.id) ? ' is-done' : ''}`}>
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

// Three big pills, each with her own icon. Clicking one opens its page with
// what every letter stands for.
function RuleBoard() {
  const [open, setOpen] = useState(null);
  const board = RULE_BOARDS.find(b => b.title === open);

  useEffect(() => {
    if (!board) return;
    const onKey = e => { if (e.key === 'Escape') setOpen(null); };
    window.addEventListener('keydown', onKey);
    const was = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = was; };
  }, [board]);

  return (
    <div className="rule-board-wrap splash-item">
      <div className="rule-pills">
        {RULE_BOARDS.map(b => (
          <button key={b.title} type="button" className={`rule-pill rule-pill-${b.tone}`} onClick={() => setOpen(b.title)} aria-label={b.title}>
            <img className="rule-pill-icon" src={b.icon} alt="" />
          </button>
        ))}
      </div>

      {board && createPortal(
        <div className="rule-sheet-backdrop" onClick={() => setOpen(null)}>
          <div className={`rule-sheet rule-column-${board.tone}`} role="dialog" aria-modal="true" aria-label={board.title} onClick={e => e.stopPropagation()}>
            <button type="button" className="rule-sheet-x" onClick={() => setOpen(null)} aria-label="Close">✕</button>
            <img className="rule-sheet-icon" src={board.icon} alt={board.title} />
            <div className="rule-cards">
              {board.items.map(([letter, title, note]) => (
                <div key={`${letter}-${title}`} className="rule-mini-card">
                  <span className="rule-mini-letter">{letter}</span>
                  <span className="rule-mini-copy">
                    <strong>{title}</strong>
                    <small>{note}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default function Hero({ onNavigate }) {
  const goalsData = useGoalsData();
  const [goalsOpen, setGoalsOpen] = useState(false);
  const today = WORKOUT_DAYS[dayIndex];
  const todayDayId = `day-${['monday','tuesday','wednesday','thursday','friday','saturday','sunday'][dayIndex]}`;

  return (
    <div className="hero hero-dashboard">
      <div className="hero-brand">
        {/* Goals on the left, the notebook on the right, the title between —
            the two side columns are equal, so the title sits dead centre. */}
        <div className="hero-title-row">
          <div className="hero-title-side hero-title-left">
            <GoalsToggle achieved={goalsData.achieved} onOpen={() => setGoalsOpen(true)} />
          </div>
          <h1 className="hero-brand-title">The <em>Goddess</em> Plan</h1>
          <div className="hero-title-side hero-title-right">
            <DailyNotebook />
          </div>
        </div>
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

      {goalsOpen && <GoalsPanel data={goalsData} onClose={() => setGoalsOpen(false)} onNavigate={onNavigate} />}


      <TodayDashboard today={today} todayDayId={todayDayId} onNavigate={onNavigate} />

      <RuleBoard />
    </div>
  );
}
