// Contrast check: every piece of text on every screen, in light AND dark mode.
//
// She asked (2026-09-30) that light text never sits on a light background, or
// dark on dark, anywhere in the app — and that it stays fixed. This walks the
// app like a person (each section, every tab, every fold-out opened, all
// seven days, the goals page, the notebook, settings and the sign-in screen),
// measures each text's colour against the pixels actually behind it, and
// lists anything too faint to read.
//
//   npm run dev            (in another terminal; or pass a URL)
//   node scripts/contrast-check.mjs [http://localhost:5173/]
//
// Needs puppeteer-core and pngjs available (npm i -D puppeteer-core pngjs),
// and Google Chrome installed. Exits 1 when anything fails.
//
// Pass mark: 4.5:1 for normal text, 3:1 for large text (WCAG AA). Anything
// under 3:1 is a hard fail at any size.

import puppeteer from 'puppeteer-core';
import { PNG } from 'pngjs';

const BASE = process.argv[2] || 'http://localhost:5173/';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const wait = ms => new Promise(r => setTimeout(r, ms));

const lum = ([r, g, b]) => {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// Every element that directly holds visible text, with its colour, size and
// place on the page. Colour alpha and ancestor opacity are folded in later.
function collect() {
  const out = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = n.textContent.replace(/\s+/g, ' ').trim();
    if (!text || !/[A-Za-z0-9]/.test(text)) continue;
    const el = n.parentElement;
    if (!el || seen.has(el)) continue;
    if (el.closest('svg')) continue; // drawn shapes (the G logo) take fill, not text colour
    if (el.closest('button:disabled, [aria-disabled="true"]')) continue; // switched-off buttons may look faded (WCAG)
    seen.add(el);
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none') continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    const r = [...range.getClientRects()].find(x => x.width > 2 && x.height > 4);
    if (!r) continue;
    if (r.bottom < 0 || r.right < 0 || r.left > innerWidth) continue;
    // Text hidden under a panel or pop-up is not what she sees; skip it.
    const top = document.elementFromPoint(Math.min(innerWidth - 1, r.left + r.width / 2), Math.min(innerHeight - 1, r.top + r.height / 2));
    if (top && !el.contains(top) && !top.contains(el)) continue;
    let op = 1;
    for (let a = el; a; a = a.parentElement) op *= parseFloat(getComputedStyle(a).opacity || '1');
    if (op < 0.05) continue;
    // Mixed colours come back as color(srgb r g b / a) with 0-1 channels.
    let m = cs.color.match(/[\d.]+/g).map(Number);
    if (/^color\(srgb/.test(cs.color)) m = [m[0] * 255, m[1] * 255, m[2] * 255, m[3] ?? 1];
    // Gradient-filled headings paint their letters with the background image
    // (background-clip: text); their colour property means nothing.
    const clip = cs.webkitBackgroundClip === 'text' || cs.backgroundClip === 'text';
    const path = [];
    for (let a = el; a && a !== document.body && path.length < 3; a = a.parentElement) {
      const cls = [...a.classList].filter(c => !/^(active|on|is-|open|splash-item)/.test(c))[0];
      path.unshift(a.tagName.toLowerCase() + (cls ? '.' + cls : ''));
    }
    out.push({
      text: text.slice(0, 50), where: path.join(' > '),
      rgb: m.slice(0, 3), alpha: (m[3] ?? 1) * op,
      size: parseFloat(cs.fontSize), weight: parseInt(cs.fontWeight, 10) || 400,
      gradientText: clip,
      box: { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height },
    });
  }
  return out;
}

async function measure(page, screen, mode) {
  // Make the window as tall as the page first, so the positions measured and
  // the picture taken describe the same layout (a full-page picture otherwise
  // stretches anything sized to the screen and every reading drifts).
  const vp = page.viewport();
  const fullH = await page.evaluate(() => Math.min(20000, Math.max(document.documentElement.scrollHeight, innerHeight)));
  await page.setViewport({ ...vp, height: fullH });
  await wait(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  const items = await page.evaluate(collect);
  if (!items.length) { await page.setViewport(vp); return []; }
  // The same page with every letter made invisible: what is left is exactly
  // what sits behind the text.
  await page.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}' });
  const png = PNG.sync.read(Buffer.from(await page.screenshot()));
  await page.evaluate(() => document.querySelectorAll('style').forEach(s => { if (s.textContent.startsWith('*{color:transparent')) s.remove(); }));
  const dpr = png.width / vp.width;
  await page.setViewport(vp);
  const px = (x, y) => { const i = (Math.round(y) * png.width + Math.round(x)) * 4; return [png.data[i], png.data[i + 1], png.data[i + 2]]; };
  const fails = [];
  for (const it of items) {
    if (it.gradientText) continue; // gradient-filled headings are drawn by the background itself
    const samples = [];
    for (let fx = 0.1; fx < 1; fx += 0.2) for (let fy = 0.2; fy < 1; fy += 0.3) {
      const x = (it.box.x + it.box.w * fx) * dpr, y = (it.box.y + it.box.h * fy) * dpr;
      if (x >= 0 && y >= 0 && x < png.width && y < png.height) samples.push(px(x, y));
    }
    if (!samples.length) continue;
    samples.sort((a, b) => lum(a) - lum(b));
    const bg = samples[Math.floor(samples.length / 2)];
    const fg = it.rgb.map((c, i) => c * it.alpha + bg[i] * (1 - it.alpha));
    const r = ratio(fg, bg);
    const large = it.size >= 24 || (it.size >= 18.66 && it.weight >= 700);
    const need = large ? 3 : 4.5;
    if (r < need) fails.push({ screen, mode, ratio: Math.round(r * 100) / 100, need, text: it.text, where: it.where, fg: fg.map(Math.round), bg });
  }
  return fails;
}

// Buttons that open another view of the same screen: tabs and fold-outs.
async function tabs(page) {
  return page.evaluate(() => [...document.querySelectorAll('button')]
    .filter(b => b.offsetParent && (/tab|pill|seg/i.test(b.className) || b.getAttribute('role') === 'tab'))
    .filter(b => !b.closest('.si-overlay'))
    .map((b, i) => { b.dataset.ccTab = String(i); return String(i); }));
}
async function openAll(page) {
  await page.evaluate(() => {
    for (const b of document.querySelectorAll('button[aria-expanded="false"]')) if (b.offsetParent) b.click();
    const all = [...document.querySelectorAll('button')].find(b => /^open all$/i.test(b.innerText.trim()));
    if (all) all.click();
  });
  await wait(400);
}
const clickText = (page, re) => page.evaluate(src => {
  const rx = new RegExp(src, 'i');
  const el = [...document.querySelectorAll('button, a')].find(e => e.offsetParent && rx.test(e.innerText.trim()));
  if (el) { el.click(); return true; } return false;
}, re.source);

async function run() {
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
  const all = [];
  const codes = [];
  const visited = [];
  for (const mode of ['light', 'dark']) {
    const ctx = await browser.createBrowserContext();
    const page = await ctx.newPage();
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });
    // Real network, like her phone: the sync box only shows "Synced" once it
    // has reached the cloud. The throwaway code it gets is deleted at the end.
    page.on('dialog', d => d.dismiss());
    await page.goto(BASE, { waitUntil: 'networkidle2' });
    await page.evaluate(m => { localStorage.setItem('gp_color_mode', m); }, mode);
    await page.reload({ waitUntil: 'networkidle2' });
    await wait(5000);
    const check = async screen => { visited.push(`${mode}: ${screen.replace(/\s+/g, ' ')}`); all.push(...await measure(page, screen, mode)); };

    // The sign-in screen shows first on a fresh gadget, a moment after the
    // app loads. Check it on its own, then put it away for good (as "Not now"
    // does) so it cannot sit over the screens checked after it.
    await page.waitForSelector('.si-overlay', { timeout: 10000 }).catch(() => {});
    if (await page.$('.si-overlay')) await check('sign-in');
    await page.evaluate(() => localStorage.setItem('gp_signin_later', '1'));
    await page.reload({ waitUntil: 'networkidle2' });
    await wait(4000);
    const go = async label => {
      const ok = await page.evaluate(label => {
        const b = [...document.querySelectorAll('.topbar-sec-btn')].find(x => x.querySelector('.topbar-sec-label')?.innerText.trim() === label);
        if (b) { b.click(); return true; } return false;
      }, label);
      if (!ok) console.error(`could not open ${label}`);
      await wait(900); await page.evaluate(() => window.scrollTo(0, 0));
    };

    for (const section of ['Home', 'Workouts', 'Meal', 'Body']) {
      await go(section);
      await openAll(page);
      await check(section);
      const ids = await tabs(page);
      for (const id of ids.slice(0, 25)) {
        const label = await page.evaluate(id => { const b = document.querySelector(`[data-cc-tab="${id}"]`); if (!b || !b.offsetParent) return null; b.click(); return b.innerText.trim().slice(0, 30); }, id);
        if (!label) continue;
        await wait(500);
        await openAll(page);
        await check(`${section} › ${label}`);
        // Tabs inside this tab (Morning / Night under Face, and so on).
        const inner = await page.evaluate(() => [...document.querySelectorAll('button')]
          .filter(b => b.offsetParent && !b.dataset.ccTab && (/tab|seg/i.test(b.className) || b.getAttribute('role') === 'tab') && !b.closest('.si-overlay'))
          .map((b, i) => { b.dataset.ccInner = String(i); return String(i); }));
        for (const j of inner.slice(0, 12)) {
          const sub = await page.evaluate(j => { const b = document.querySelector(`[data-cc-inner="${j}"]`); if (!b || !b.offsetParent) return null; b.click(); return b.innerText.trim().slice(0, 24); }, j);
          if (!sub) continue;
          await wait(400);
          await openAll(page);
          await check(`${section} › ${label} › ${sub}`);
        }
      }
    }
    // All seven workout days, fully open.
    for (let i = 0; i < 7; i++) {
      await go('Workouts');
      const ok = await page.evaluate(i => { const d = document.querySelectorAll('.wg-day-btn')[i]; if (d) { d.click(); return true; } return false; }, i);
      if (!ok) continue;
      await wait(600);
      await openAll(page);
      await check(`Workout day ${i + 1}`);
    }
    // Goals (G) and its tabs.
    await go('Home');
    if (await page.$('.goals-launcher')) {
      await page.click('.goals-launcher'); await wait(600);
      for (const t of ['Goals', 'Rewards', 'Achieved']) { await clickText(page, new RegExp(t)); await wait(400); await check(`G › ${t}`); }
      await page.keyboard.press('Escape'); await wait(400);
    }
    // The notebook.
    if (await page.$('.daily-notebook-launcher')) {
      await page.click('.daily-notebook-launcher'); await wait(700);
      await openAll(page);
      await check('Notebook');
      await page.keyboard.press('Escape'); await wait(400);
    }
    // Settings and its screens.
    for (const sub of [null, 'Profile', 'Body Stats', 'Navigate the App', 'About']) {
      await page.evaluate(() => document.querySelector('.mob-avatar-btn')?.click()); await wait(800);
      if (sub) { await clickText(page, new RegExp(sub)); await wait(700); }
      await openAll(page);
      await check(`Settings${sub ? ' › ' + sub : ''}`);
    }
    codes.push(await page.evaluate(() => localStorage.getItem('gp_sync_code')));
    await ctx.close();
  }
  await browser.close();
  const KEY = 'AIzaSyAsWJPYWcwJ5XtnJPOV_PRmL7dyt5eJems';
  for (const c of codes) if (/^GP-[A-Z2-9]{12}$/.test(c || '')) {
    await fetch(`https://firestore.googleapis.com/v1/projects/goddess-plan/databases/(default)/documents/sync/${c}?key=${KEY}`, { method: 'DELETE' }).catch(() => {});
  }

  // One line per distinct problem: the same element failing on several
  // screens is one fix.
  const key = f => `${f.mode} | ${f.where} | ${f.fg}`;
  const groups = new Map();
  for (const f of all) {
    const g = groups.get(key(f)) || { ...f, screens: new Set(), count: 0 };
    g.screens.add(f.screen); g.count++; g.ratio = Math.min(g.ratio, f.ratio);
    groups.set(key(f), g);
  }
  const rows = [...groups.values()].sort((a, b) => a.mode.localeCompare(b.mode) || a.ratio - b.ratio);
  for (const g of rows) {
    console.log(`${g.ratio < 3 ? 'FAIL' : 'weak'} ${g.mode.padEnd(5)} ${String(g.ratio).padEnd(5)} need ${g.need}  ${g.where}  "${g.text}"  text rgb(${g.fg}) on rgb(${g.bg})  [${[...g.screens].slice(0, 3).join('; ')}${g.screens.size > 3 ? '; …' : ''}]`);
  }
  const hard = rows.filter(g => g.ratio < 3).length;
  console.log(`\nScreens checked (${visited.length}): ${visited.join(' | ')}`);
  console.log(`\n${rows.length} problems (${hard} under 3:1) across both modes.`);
  process.exit(rows.length ? 1 : 0);
}

run();
