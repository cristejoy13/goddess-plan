import { useState, useEffect } from 'react';
import { loadLog } from './mealLog';
import { kgPlan, loadGoals, achievedGoals } from './goals';

// Everything the goals need, re-read whenever a weigh-in or a goal changes on
// this device or arrives from another one.
export function useGoalsData() {
  const read = () => {
    const log = loadLog();
    const goals = loadGoals();
    return { log, goals, plan: kgPlan(log), achieved: achievedGoals(log, goals) };
  };
  const [data, setData] = useState(read);
  useEffect(() => {
    const refresh = () => setData(read());
    window.addEventListener('gp-goals-changed', refresh);
    window.addEventListener('gp-remote-sync', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener('gp-goals-changed', refresh);
      window.removeEventListener('gp-remote-sync', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, []);
  return data;
}

