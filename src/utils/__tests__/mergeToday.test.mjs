// Today's Plan merges across gadgets (2026-10-12).
// Run with:  node src/utils/__tests__/mergeToday.test.mjs
import { mergeTodayChecks, mergePlanItems } from '../mergeToday.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const J = JSON.stringify, P = JSON.parse;

const phone = J({ date: '2026-10-12', checked: { stretch: true }, at: { stretch: 100 } });
const ipad = J({ date: '2026-10-12', checked: { guasha: true }, at: { guasha: 200 } });
const m = P(mergeTodayChecks(phone, ipad));
ok('ticks from two gadgets both survive', m.checked.stretch && m.checked.guasha);
ok('the merge is the same both ways', mergeTodayChecks(phone, ipad) === mergeTodayChecks(ipad, phone));
const untick = J({ date: '2026-10-12', checked: { stretch: false }, at: { stretch: 300 } });
ok('a later untick wins', P(mergeTodayChecks(phone, untick)).checked.stretch === false);
const yesterday = J({ date: '2026-10-11', checked: { stretch: true }, at: { stretch: 999 } });
ok('a new day starts fresh', P(mergeTodayChecks(yesterday, ipad)).date === '2026-10-12' && !P(mergeTodayChecks(yesterday, ipad)).checked.stretch);
ok('old saves without times still count', P(mergeTodayChecks(J({ date: '2026-10-12', checked: { a: true } }), J({ date: '2026-10-12', checked: { b: true } }))).checked.a);

const base = { items: [{ id: 'a', title: 'A', icon: '1', pos: 0 }, { id: 'b', title: 'B', icon: '2', pos: 1 }], deleted: {} };
const added = { ...base, items: [...base.items, { id: 'my-x', title: 'X', icon: '✨', pos: 2 }] };
const removed = { items: [base.items[0]], deleted: { b: 50 } };
const pm = P(mergePlanItems(J(added), J(removed)));
ok('an add on one gadget and a delete on another both stick', pm.items.map(i => i.id).join() === 'a,my-x');
ok('plan merge is the same both ways', mergePlanItems(J(added), J(removed)) === mergePlanItems(J(removed), J(added)));

const moved = { ...base, items: [{ ...base.items[0], pos: 1, at: 500 }, { ...base.items[1], pos: 0, at: 500 }] };
ok('a newer order wins over the old one', P(mergePlanItems(J(base), J(moved))).items.map(i => i.id).join() === 'b,a' && mergePlanItems(J(base), J(moved)) === mergePlanItems(J(moved), J(base)));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
