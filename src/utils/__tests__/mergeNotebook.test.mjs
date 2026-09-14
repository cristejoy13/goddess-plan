// Regression tests for the notes-sync bug of 2026-09-14: two gadgets writing
// at the same moment each kept only its own note and never converged.
// Run with:  node src/utils/__tests__/mergeNotebook.test.mjs
import { mergeNotebookBlobs } from '../mergeNotebook.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const page = (id, note, t) => ({ id, title: id, note, images: [], mood: '', userCreated: true, createdAt: '2026-01-0' + id.slice(-1) + 'T00:00:00.000Z', updatedAt: t });
const nb = o => JSON.stringify({ date: '2026-09-14', pages: [], activePageId: '', checklists: [], activeChecklistId: '', deleted: {}, updatedAt: '', ...o });
const P = s => JSON.parse(s);

// 1. The bug she hit: both gadgets add a page at the same moment.
const A = nb({ pages: [page('p1','shared','2026-09-14T10:00:00.000Z'), page('pa','from phone','2026-09-14T12:00:00.000Z')], updatedAt: '2026-09-14T12:00:00.000Z' });
const B = nb({ pages: [page('p1','shared','2026-09-14T10:00:00.000Z'), page('pb','from ipad','2026-09-14T12:00:00.000Z')], updatedAt: '2026-09-14T12:00:00.000Z' });
const m1 = mergeNotebookBlobs(A, B), m2 = mergeNotebookBlobs(B, A);
ok('both notes survive', P(m1).pages.map(p=>p.id).join()==='p1,pa,pb');
ok('merge is commutative (gadgets converge)', m1 === m2);

// 2. Same page edited on both — newest text wins, nothing duplicated.
const C = nb({ pages: [page('p1','older','2026-09-14T10:00:00.000Z')] });
const D = nb({ pages: [page('p1','NEWER','2026-09-14T18:00:00.000Z')] });
ok('newest edit of the same note wins', P(mergeNotebookBlobs(C,D)).pages[0].note === 'NEWER');
ok('still commutative', mergeNotebookBlobs(C,D) === mergeNotebookBlobs(D,C));

// 3. A deleted page must not come back from the other gadget's copy.
const E = nb({ pages: [page('p1','keep','2026-09-14T10:00:00.000Z')], deleted: { pz: '2026-09-14T11:00:00.000Z' } });
const F = nb({ pages: [page('p1','keep','2026-09-14T10:00:00.000Z'), page('pz','deleted elsewhere','2026-09-14T09:00:00.000Z')] });
ok('a deleted note stays deleted', P(mergeNotebookBlobs(E,F)).pages.map(p=>p.id).join()==='p1');
ok('delete is commutative', mergeNotebookBlobs(E,F) === mergeNotebookBlobs(F,E));

// 4. Checklist items added on each gadget both survive.
const list = items => ({ id:'l1', title:'Shopping', items, createdAt:'2026-01-01T00:00:00.000Z', updatedAt:'2026-09-14T12:00:00.000Z' });
const it = (id,text) => ({ id, text, done:false, pinned:false, createdAt:'2026-01-0'+id.slice(-1)+'T00:00:00.000Z', completedAt:'' });
const G = nb({ checklists: [list([it('i1','eggs'), it('i2','fish')])] });
const H = nb({ checklists: [list([it('i1','eggs'), it('i3','kimchi')])] });
const m3 = mergeNotebookBlobs(G,H);
ok('checklist items from both gadgets survive', P(m3).checklists[0].items.map(i=>i.id).join()==='i1,i2,i3');
ok('checklist merge is commutative', m3 === mergeNotebookBlobs(H,G));

// 5. Merging an already-merged pair changes nothing (no ping-pong).
ok('merge is stable — no endless re-pushing', mergeNotebookBlobs(m1, m1) === m1);
ok('re-merging a merged result is a no-op', mergeNotebookBlobs(m1, A) === m1 && mergeNotebookBlobs(m1, B) === m1);

// 6. Missing or corrupt data must never throw or wipe the good side.
ok('handles a missing remote', mergeNotebookBlobs(A, null) === A);
ok('handles corrupt remote', mergeNotebookBlobs(A, '{oops') === A);
ok('handles a missing local', mergeNotebookBlobs(null, B) === B);

// ── Older saves ── A gadget not opened in a while still holds one of the two
// earlier layouts. Merging must migrate it, not drop it.
const legacyDiary = JSON.stringify({ date: '2026-08-01', note: 'my old diary entry', mood: '🙂', images: [], createdAt: '2026-08-01T09:00:00.000Z', updatedAt: '2026-08-01T09:00:00.000Z' });
const modern = nb({ pages: [page('p9','new note','2026-09-14T10:00:00.000Z')], updatedAt: '2026-09-14T10:00:00.000Z' });
const lm = mergeNotebookBlobs(legacyDiary, modern);
ok('an old diary entry is kept, not dropped', JSON.stringify(P(lm).pages).includes('my old diary entry'));
ok('the new note is kept too', P(lm).pages.some(p => p.note === 'new note'));
ok('old-format merge is commutative', lm === mergeNotebookBlobs(modern, legacyDiary));

const legacyList = JSON.stringify({ date: '2026-08-01', checklist: [{ text: 'buy eggs', done: false }, { text: 'buy fish', done: true }], updatedAt: '2026-08-01T09:00:00.000Z' });
const lm2 = mergeNotebookBlobs(legacyList, modern);
ok('an old checklist is kept', JSON.stringify(P(lm2).checklists).includes('buy eggs'));
ok('every old checklist item is kept', P(lm2).checklists[0].items.length === 2);
ok('old checklist merge is commutative', lm2 === mergeNotebookBlobs(modern, legacyList));

// The same old save seen by two gadgets must produce the SAME ids, or the
// merge would show every old item twice.
ok('old items get identical ids on both gadgets', mergeNotebookBlobs(legacyList, legacyList) === mergeNotebookBlobs(legacyList, JSON.parse(JSON.stringify(legacyList)) && legacyList));
const twice = mergeNotebookBlobs(lm2, legacyList);
ok('re-merging an old save adds no duplicates', P(twice).checklists[0].items.length === 2);

// Nothing at all on one side must never wipe the other.
ok('an empty gadget cannot wipe a full one', P(mergeNotebookBlobs(nb({}), modern)).pages.length === 1);
ok('and the other way round', P(mergeNotebookBlobs(modern, nb({}))).pages.length === 1);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
