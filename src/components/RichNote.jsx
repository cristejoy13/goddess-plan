import { useEffect, useRef, useState } from 'react';
import { noteToHtml, settleColors, TEXT_COLORS, TEXT_COLOR_CLEAR, HIGHLIGHTS, HIGHLIGHT_CLEAR } from '../utils/richNote';

// A writing box that keeps formatting. It is left to the browser while she
// types; it is only rewritten when the note changes from outside (another
// entry opened, words spoken, a note arriving from another device).
export function RichNote({ value, onChange, placeholder, label, editorRef, capsRef }) {
  const elRef = useRef(null);
  const lastRef = useRef(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el || value === lastRef.current) return;
    const html = noteToHtml(value);
    if (el.innerHTML !== html) el.innerHTML = html;
    lastRef.current = value;
  }, [value]);

  // Caps typing: with Caps on and nothing selected, new letters come out big.
  useEffect(() => {
    const el = elRef.current;
    if (!el) return undefined;
    const onBefore = e => {
      if (!capsRef?.current || e.inputType !== 'insertText' || !e.data) return;
      const up = e.data.toUpperCase();
      if (up === e.data) return;
      e.preventDefault();
      document.execCommand('insertText', false, up);
    };
    el.addEventListener('beforeinput', onBefore);
    return () => el.removeEventListener('beforeinput', onBefore);
  }, [capsRef]);

  function emit() {
    const el = elRef.current;
    if (!el) return;
    if (el.innerHTML === '<br>') el.innerHTML = '';
    const html = el.innerHTML;
    if (html === lastRef.current) return;
    lastRef.current = html;
    onChange(html);
  }

  // Pasted or dropped writing comes in as plain words, so nothing odd from a
  // web page or another app sneaks into the diary.
  function insertPlain(e, text) {
    e.preventDefault();
    if (text) document.execCommand('insertText', false, text);
  }

  return (
    <div
      ref={el => { elRef.current = el; if (editorRef) editorRef(el); }}
      className="daily-note-input nb-rich"
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label={label || placeholder}
      data-placeholder={placeholder}
      onInput={emit}
      onBlur={emit}
      onPaste={e => insertPlain(e, e.clipboardData?.getData('text/plain'))}
      onDrop={e => insertPlain(e, e.dataTransfer?.getData('text/plain'))}
    />
  );
}

function ColumnsIcon({ n }) {
  const w = 16 / n;
  return (
    <svg className="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="2" />
      {Array.from({ length: n - 1 }, (_, i) => (
        <path key={i} d={`M${4 + w * (i + 1)} 5v14`} />
      ))}
    </svg>
  );
}

// Tapping a tool must not take the cursor out of the writing.
const keep = e => e.preventDefault();

function ToolBtn({ label, active, onClick, children }) {
  return (
    <button
      type="button"
      className={`nb-tool${active ? ' is-on' : ''}`}
      onMouseDown={keep}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active === undefined ? undefined : Boolean(active)}
      title={label}
    >
      {children}
    </button>
  );
}

function ToolIcon({ name }) {
  const paths = {
    bullets: <><circle cx="5" cy="7" r="1.3" fill="currentColor" stroke="none" /><circle cx="5" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="5" cy="17" r="1.3" fill="currentColor" stroke="none" /><path d="M9.5 7H20M9.5 12H20M9.5 17H20" /></>,
    numbers: <><path d="M9.5 7H20M9.5 12H20M9.5 17H20" /><text x="2.6" y="9" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">1</text><text x="2.6" y="14" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">2</text><text x="2.6" y="19" fontSize="6.5" fill="currentColor" stroke="none" fontWeight="700">3</text></>,
    highlight: <><path d="M14.5 4.5l5 5-8 8H6.5v-5z" /><path d="M4 20.5h16" /></>,
  };
  return (
    <svg className="nb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// The header over the writing: columns, then the document tools. One set of
// tools serves every column; it works on whichever box she last wrote in.
export function NoteToolbar({ columns, onPickColumns, editors, capsRef }) {
  const [panel, setPanel] = useState(null);
  const [on, setOn] = useState({});
  const [caps, setCaps] = useState(false);
  const lastEditorRef = useRef(null);
  const rangeRef = useRef(null);

  useEffect(() => { capsRef.current = caps; }, [caps, capsRef]);

  // Remember where she was writing, so tapping a tool (which can steal the
  // cursor on a phone) still formats the right words. Also lights up the
  // tools already in use where the cursor is.
  useEffect(() => {
    const onSel = () => {
      const sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      const node = sel.anchorNode;
      const editor = (node?.nodeType === 1 ? node : node?.parentElement)?.closest?.('.nb-rich');
      if (!editor) return;
      lastEditorRef.current = editor;
      rangeRef.current = sel.getRangeAt(0).cloneRange();
      const q = cmd => { try { return document.queryCommandState(cmd); } catch { return false; } };
      setOn({ bold: q('bold'), italic: q('italic'), underline: q('underline'), ul: q('insertUnorderedList'), ol: q('insertOrderedList') });
    };
    document.addEventListener('selectionchange', onSel);
    return () => document.removeEventListener('selectionchange', onSel);
  }, []);

  function target() {
    let el = lastEditorRef.current;
    if (!el || !el.isConnected) {
      el = editors().find(Boolean);
      rangeRef.current = null;
    }
    if (!el) return null;
    el.focus({ preventScroll: true });
    const sel = window.getSelection();
    if (rangeRef.current && el.contains(rangeRef.current.startContainer)) {
      sel.removeAllRanges();
      sel.addRange(rangeRef.current);
    } else if (!el.contains(sel.anchorNode)) {
      const r = document.createRange();
      r.selectNodeContents(el);
      r.collapse(false);
      sel.removeAllRanges();
      sel.addRange(r);
    }
    return el;
  }

  function run(fn) {
    const el = target();
    if (!el) return;
    fn(el);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    const sel = window.getSelection();
    if (sel.rangeCount) rangeRef.current = sel.getRangeAt(0).cloneRange();
  }

  const exec = (cmd, val) => run(() => {
    document.execCommand('styleWithCSS', false, false);
    document.execCommand(cmd, false, val);
  });

  function paint(mark) {
    run(el => {
      document.execCommand('styleWithCSS', false, false);
      document.execCommand('foreColor', false, mark);
      settleColors(el);
    });
    setPanel(null);
  }

  function highlight(mark) {
    run(el => {
      document.execCommand('styleWithCSS', false, true);
      if (!document.execCommand('hiliteColor', false, mark)) document.execCommand('backColor', false, mark);
      document.execCommand('styleWithCSS', false, false);
      settleColors(el);
    });
    setPanel(null);
  }

  // Caps: with words selected, they flip to CAPITALS (or back). With nothing
  // selected, it works like Caps Lock for what she types next.
  function toggleCaps() {
    const el = target();
    const sel = window.getSelection();
    const text = el && sel.rangeCount && !sel.isCollapsed ? sel.toString() : '';
    if (!text) { setCaps(c => !c); return; }
    run(() => {
      document.execCommand('insertText', false, text === text.toUpperCase() ? text.toLowerCase() : text.toUpperCase());
    });
  }

  return (
    <div className="nb-toolbar" role="toolbar" aria-label="Writing tools">
      <div className="nb-tools">
        <button
          type="button"
          className={`nb-tool nb-tool-cols${panel === 'cols' ? ' is-open' : ''}`}
          onMouseDown={keep}
          onClick={() => setPanel(p => (p === 'cols' ? null : 'cols'))}
          aria-expanded={panel === 'cols'}
          aria-label={`Columns: ${columns}`}
          title="Columns"
        >
          <ColumnsIcon n={columns} />
        </button>
        <span className="nb-tool-gap" aria-hidden="true" />
        <ToolBtn label="Bold" active={on.bold} onClick={() => exec('bold')}><b>B</b></ToolBtn>
        <ToolBtn label="Italic" active={on.italic} onClick={() => exec('italic')}><i>I</i></ToolBtn>
        <ToolBtn label="Underline" active={on.underline} onClick={() => exec('underline')}><u>U</u></ToolBtn>
        <ToolBtn label={caps ? 'Caps on' : 'Caps'} active={caps} onClick={toggleCaps}><span className="nb-tool-caps">AA</span></ToolBtn>
        <span className="nb-tool-gap" aria-hidden="true" />
        <ToolBtn label="Bullets" active={on.ul} onClick={() => exec('insertUnorderedList')}><ToolIcon name="bullets" /></ToolBtn>
        <ToolBtn label="Numbers" active={on.ol} onClick={() => exec('insertOrderedList')}><ToolIcon name="numbers" /></ToolBtn>
        <span className="nb-tool-gap" aria-hidden="true" />
        <ToolBtn label="Text colour" active={panel === 'color'} onClick={() => setPanel(p => (p === 'color' ? null : 'color'))}><span className="nb-tool-a">A</span></ToolBtn>
        <ToolBtn label="Highlight" active={panel === 'hi'} onClick={() => setPanel(p => (p === 'hi' ? null : 'hi'))}><ToolIcon name="highlight" /></ToolBtn>
      </div>

      {panel === 'cols' && (
        <div className="nb-tool-panel" role="group" aria-label="How many columns">
          {[1, 2, 3, 4].map(n => (
            <button
              key={n}
              type="button"
              className={`nb-col-choice${columns === n ? ' is-on' : ''}`}
              onMouseDown={keep}
              onClick={() => { onPickColumns(n); setPanel(null); }}
              aria-pressed={columns === n}
            >
              <ColumnsIcon n={n} />
              <span>{n}</span>
            </button>
          ))}
        </div>
      )}
      {panel === 'color' && (
        <div className="nb-tool-panel" role="group" aria-label="Text colour">
          {TEXT_COLORS.map(c => (
            <button key={c.id} type="button" className="nb-swatch" onMouseDown={keep} onClick={() => paint(c.mark)} aria-label={c.label} title={c.label}>
              <span className="nb-swatch-a" data-c={c.id}>A</span>
            </button>
          ))}
          <button type="button" className="nb-swatch nb-swatch-clear" onMouseDown={keep} onClick={() => paint(TEXT_COLOR_CLEAR)} aria-label="No colour" title="No colour">
            <span className="nb-swatch-a">A</span>
          </button>
        </div>
      )}
      {panel === 'hi' && (
        <div className="nb-tool-panel" role="group" aria-label="Highlight">
          {HIGHLIGHTS.map(h => (
            <button key={h.id} type="button" className="nb-swatch" onMouseDown={keep} onClick={() => highlight(h.mark)} aria-label={`${h.label} highlight`} title={h.label}>
              <span className="nb-swatch-hi" data-h={h.id}>ab</span>
            </button>
          ))}
          <button type="button" className="nb-swatch nb-swatch-clear" onMouseDown={keep} onClick={() => highlight(HIGHLIGHT_CLEAR)} aria-label="No highlight" title="No highlight">
            <span className="nb-swatch-hi">ab</span>
          </button>
        </div>
      )}
    </div>
  );
}
