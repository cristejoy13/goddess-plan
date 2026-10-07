// Two gadgets' memory of scanned meals must join, not overwrite.
// Run with:  node src/utils/__tests__/scanMemory.test.mjs
import { mergeScanMemoryBlobs, MEMORY_MAX } from '../mergeScanMemory.js';
let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const r = total => ({ items: [], total });
const phone = JSON.stringify({ '1 banana': { result: r(105), at: 10 }, 'rice': { result: r(205), at: 5 } });
const ipad = JSON.stringify({ '2 eggs': { result: r(155), at: 8 }, 'rice': { result: r(210), at: 9 } });
const m = JSON.parse(mergeScanMemoryBlobs(phone, ipad));
ok('meals learned on either gadget are kept', Object.keys(m).length === 3);
ok('the newer copy of the same meal wins', m.rice.result.total === 210);
ok('both gadgets get the same answer', mergeScanMemoryBlobs(phone, ipad) === mergeScanMemoryBlobs(ipad, phone));
const many = {}; for (let i = 0; i < MEMORY_MAX + 20; i += 1) many[`meal ${i}`] = { result: r(i), at: i };
const t = JSON.parse(mergeScanMemoryBlobs(JSON.stringify(many), '{}'));
ok('only the newest are kept, so the shared copy stays small', Object.keys(t).length === MEMORY_MAX && !t['meal 0'] && t[`meal ${MEMORY_MAX + 19}`]);
ok('a broken copy cannot wipe a good one', Object.keys(JSON.parse(mergeScanMemoryBlobs(phone, 'garbage'))).length === 2);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
