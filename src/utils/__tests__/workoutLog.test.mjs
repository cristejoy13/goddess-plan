// The 1,000-workout record. Run with:
//   node src/utils/__tests__/workoutLog.test.mjs
import {
  logWorkout, removeWorkout, editWorkout, numbered, numberOf, workoutStats,
  mergeWorkoutBlobs, cumulativeIn,
} from '../workoutLog.js';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log((cond ? '  ok   ' : '  FAIL ') + name); };
const empty = () => ({ days: {}, deleted: {} });
const at = s => `2026-09-${s}T08:00:00.000Z`;

let log = empty();
log = logWorkout(log, '2026-09-20', 'Glute Power', at('20'));
ok('logging the same day twice still counts one', logWorkout(log, '2026-09-20', 'x') === log);
log = logWorkout(log, '2026-09-21', 'Arms', at('21'));
log = logWorkout(log, '2026-09-22', 'Glute Strength', at('22'));
log = logWorkout(log, '2026-09-25', 'Glute Shape', at('25'));
log = logWorkout(log, '2026-09-26', 'Sprints', at('26'));

let s = workoutStats(log, '2026-09-27');
ok('five workouts', s.total === 5);
ok('995 to go', s.remaining === 995);
ok('0.5 percent', s.pct === 0.5);
ok('today not done yet keeps the streak', s.current === 2);
ok('longest run is three', s.longest === 3);
ok('next milestone is 10', s.next === 10);
ok('a missed day breaks the streak', workoutStats(log, '2026-09-28').current === 0);

ok('numbers follow the dates', numbered(log).map(w => w.n).join() === '1,2,3,4,5');
ok('a forgotten day slots in and renumbers', numberOf(logWorkout(log, '2026-09-23', 'x'), '2026-09-25') === 5);
ok('removing renumbers too', numberOf(removeWorkout(log, '2026-09-21', at('27')), '2026-09-26') === 4);

log = editWorkout(log, '2026-09-26', { duration: 35, notes: 'felt strong' }, at('27'));
ok('time and notes are kept', log.days['2026-09-26'].duration === 35 && log.days['2026-09-26'].notes === 'felt strong');

// Sync merge: both gadgets' days survive, deletions stick, re-logging wins.
const blob = l => JSON.stringify(l);
const phone = logWorkout(empty(), '2026-09-20', 'A', at('20'));
const ipad = logWorkout(empty(), '2026-09-21', 'B', at('21'));
const now = Date.parse(at('28'));
const m = JSON.parse(mergeWorkoutBlobs(blob(phone), blob(ipad), now));
ok('merge keeps both gadgets\' days', Object.keys(m.days).length === 2);
ok('merge is the same both ways', mergeWorkoutBlobs(blob(phone), blob(ipad), now) === mergeWorkoutBlobs(blob(ipad), blob(phone), now));
const removed = removeWorkout(phone, '2026-09-20', at('22'));
ok('a removal is not undone by the old copy', !JSON.parse(mergeWorkoutBlobs(blob(removed), blob(phone), now)).days['2026-09-20']);
const again = logWorkout(removed, '2026-09-20', 'A', at('23'));
ok('logging again beats the old removal', !!JSON.parse(mergeWorkoutBlobs(blob(again), blob(removed), now)).days['2026-09-20']);
const merged = mergeWorkoutBlobs(blob(phone), blob(ipad), now);
ok('merging a settled copy changes nothing', mergeWorkoutBlobs(merged, merged, now) === merged);

const c = cumulativeIn(log, '2026-09-22', '2026-09-30');
ok('graph range starts from the total before it', c.before === 2 && c.points[0].total === 3 && c.points.at(-1).total === 5);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
