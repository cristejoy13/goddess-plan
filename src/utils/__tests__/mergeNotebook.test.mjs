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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
