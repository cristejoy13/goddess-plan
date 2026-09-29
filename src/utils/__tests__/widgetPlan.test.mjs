// The iPhone widget names today's workout from its own copy of the plan.
// This fails the moment that copy falls behind src/data/workouts.js, so a plan
// change can never ship with a stale widget. Run with:
//   node src/utils/__tests__/widgetPlan.test.mjs
// Fix a failure with: node scripts/widget/build-widget.mjs, then update the
// setup page she copies the widget from.
import fs from 'fs';
import { WORKOUT_DAYS } from '../../data/workouts.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };

const src = fs.readFileSync(new URL('../../../scripts/widget/GoddessPlanWidget.js', import.meta.url), 'utf8');
const block = src.match(/\/\/ PLAN-START\n([\s\S]*?)\/\/ PLAN-END/)[1];
const PLAN = new Function(`${block}; return PLAN;`)();

ok('widget has all seven days', PLAN.length === 7);
WORKOUT_DAYS.forEach((d, i) => {
  const [day, name] = d.day.split(' · ');
  const w = PLAN[i] || {};
  ok(`${day} matches the app`, w.day === day && w.name === name && w.title === d.title && w.emoji === d.emoji);
});
ok('widget text is plain characters only', !/[^\x00-\x7f]/.test(src));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) { console.log('\n→ run: node scripts/widget/build-widget.mjs'); process.exit(1); }
