// Fills the widget's PLAN from the app's own weekly plan, so the widget
// always names today's workout the way the homepage does.
//   node scripts/widget/build-widget.mjs
// Every non-plain character is written as a \u code, so the widget file stays
// plain text that copying cannot change.
import fs from 'fs';
import { WORKOUT_DAYS } from '../../src/data/workouts.js';

const file = new URL('./GoddessPlanWidget.js', import.meta.url);
const ascii = s => JSON.stringify(s).replace(/[\u007f-￿]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
const rows = WORKOUT_DAYS.map(d => {
  const [day, name] = d.day.split(' · ');
  return `  { day: ${ascii(day)}, emoji: ${ascii(d.emoji)}, name: ${ascii(name || d.title)}, title: ${ascii(d.title)} }`;
});
const src = fs.readFileSync(file, 'utf8');
const out = src.replace(/\/\/ PLAN-START\n[\s\S]*?\/\/ PLAN-END/, `// PLAN-START\nvar PLAN = [\n${rows.join(',\n')}\n];\n// PLAN-END`);
fs.writeFileSync(file, out);
console.log(`PLAN filled: ${rows.length} days`);
