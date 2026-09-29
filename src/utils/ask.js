// The app's own "are you sure?" box, in place of the browser's grey pop-up.
//
//   if (!(await ask('Delete this goal?', { yes: 'Delete' }))) return;
//
// It resolves true for the yes button and false for Cancel, a tap outside the
// box, or Escape. Only one question shows at a time; a new one answers the
// open one with false first. <AskHost/> in App.jsx draws it.

export const ASK_EVENT = 'gp-ask';

export function ask(text, { yes = 'Yes', no = 'Cancel', danger = false } = {}) {
  return new Promise(resolve => {
    window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: { text, yes, no, danger, resolve } }));
  });
}
