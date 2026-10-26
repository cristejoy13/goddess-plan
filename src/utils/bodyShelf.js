// Her shelf (2026-10-26): which Body products she owns, which are running
// low, and whether to hide the ones she doesn't own. Saved in gp_body_shelf
// and synced, so every gadget shows the same shelf.
import { Children, createContext, isValidElement, useCallback, useContext, useEffect, useState } from 'react';

const SHELF_KEY = 'gp_body_shelf';
const NOTEBOOK_KEY = 'gp_daily_notebook';

export const productKey = (brand, name) => `${brand}|${name}`;

function loadShelf() {
  try {
    const v = JSON.parse(localStorage.getItem(SHELF_KEY) || 'null');
    if (v && typeof v === 'object') {
      return { owned: v.owned || {}, low: v.low || {}, onlyMine: Boolean(v.onlyMine) };
    }
  } catch { /* start empty */ }
  return { owned: {}, low: {}, onlyMine: false };
}

function saveShelf(v) {
  try { localStorage.setItem(SHELF_KEY, JSON.stringify(v)); } catch { /* kept for this visit */ }
}

// Adds a line to the checklist called "Shopping list" in her notebook (made
// if there isn't one yet). A line already there and not ticked is not added
// twice. Returns true when the line is on the list.
export function addToShoppingList(text) {
  try {
    const nb = JSON.parse(localStorage.getItem(NOTEBOOK_KEY) || 'null') || { pages: [], checklists: [] };
    const now = new Date().toISOString();
    const lists = Array.isArray(nb.checklists) ? [...nb.checklists] : [];
    let i = lists.findIndex(l => /shopping/i.test(String(l?.title || '')));
    if (i < 0) {
      lists.push({ id: `list-${Date.now()}-${Math.random().toString(36).slice(2)}`, title: 'Shopping list', items: [], createdAt: now, updatedAt: now });
      i = lists.length - 1;
    }
    const list = lists[i];
    const items = Array.isArray(list.items) ? list.items : [];
    const same = s => String(s || '').trim().toLowerCase() === text.trim().toLowerCase();
    if (items.some(it => same(it.text) && !it.done)) return true;
    lists[i] = {
      ...list,
      items: [...items, { id: `check-${Date.now()}-${Math.random().toString(36).slice(2)}`, text, done: false, pinned: false, createdAt: now, completedAt: '' }],
      updatedAt: now,
    };
    localStorage.setItem(NOTEBOOK_KEY, JSON.stringify({ ...nb, checklists: lists, updatedAt: now }));
    return true;
  } catch {
    return false;
  }
}

export function useShelf() {
  const [shelf, setShelf] = useState(loadShelf);
  useEffect(() => {
    const refresh = () => setShelf(loadShelf());
    window.addEventListener('gp-remote-sync', refresh);
    return () => window.removeEventListener('gp-remote-sync', refresh);
  }, []);
  const update = useCallback(fn => {
    const next = fn(loadShelf());
    saveShelf(next);
    setShelf(next);
  }, []);
  return {
    ...shelf,
    toggleOwned: key => update(s => {
      const owned = { ...s.owned };
      const low = { ...s.low };
      if (owned[key]) { delete owned[key]; delete low[key]; } else owned[key] = true;
      return { ...s, owned, low };
    }),
    markLow: (key, text) => {
      const ok = addToShoppingList(text);
      if (ok) update(s => ({ ...s, low: { ...s.low, [key]: true } }));
      return ok;
    },
    clearLow: key => update(s => {
      const low = { ...s.low };
      delete low[key];
      return { ...s, low };
    }),
    setOnlyMine: on => update(s => ({ ...s, onlyMine: on })),
  };
}

export const ShelfContext = createContext(null);
export const useShelfContext = () => useContext(ShelfContext);

// For "Mine": does a step hold products, and is any of them hers? A product
// is a card with a brand and a name, or a plain product line (prod-item),
// which she can't mark, so it never counts as hers.
export function shelfStatus(children, owned) {
  let products = 0, mine = 0;
  const walk = kids => Children.forEach(kids, el => {
    if (!isValidElement(el)) return;
    const p = el.props || {};
    if (typeof p.brand === 'string' && typeof p.name === 'string') {
      products++;
      if (owned[productKey(p.brand, p.name)]) mine++;
      return;
    }
    if (typeof p.className === 'string' && /\bprod-item\b/.test(p.className)) { products++; return; }
    if (p.children) walk(p.children);
  });
  walk(children);
  return { products, mine };
}

// In "Mine", a step full of products she doesn't own is left out.
export function hiddenInMine(children, shelf) {
  if (!shelf?.onlyMine) return false;
  const { products, mine } = shelfStatus(children, shelf.owned);
  return products > 0 && mine === 0;
}
