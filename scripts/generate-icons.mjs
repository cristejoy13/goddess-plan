// Generates public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png
// Goddess Plan icon: sunset palette (gold → pink → purple) + golden goddess crown
import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';

// ── PNG encoder ──────────────────────────────────────────────────────────────
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) {
    c ^= b;
    for (let i = 0; i < 8; i++) c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function chunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}
function buildPNG(size, raw) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB
  const rows = [];
  for (let y = 0; y < size; y++) {
    rows.push(Buffer.from([0]));
    rows.push(raw.subarray(y * size * 3, (y + 1) * size * 3));
  }
  const idat = deflateSync(Buffer.concat(rows));
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ── Math helpers ─────────────────────────────────────────────────────────────
const lerp  = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Ray-casting point-in-polygon
function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

// Distance from point to line segment
function ptSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x1 + t * dx - px, y1 + t * dy - py);
}

// ── Icon generator ───────────────────────────────────────────────────────────
function generateGoddessIcon(size) {
  const cx = size / 2, cy = size / 2;
  const raw = Buffer.alloc(size * size * 3);

  // ── 1. Background: sunset — gold top → vivid pink → deep purple ──
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const d  = Math.min(1, Math.hypot(nx, ny));
      const vy = y / size;  // 0 = top, 1 = bottom

      let r, g, b;
      if (vy < 0.32) {
        const t = vy / 0.32;
        r = lerp(255, 255, t); g = lerp(215, 78,  t); b = lerp(52,  142, t); // gold → hot pink
      } else if (vy < 0.62) {
        const t = (vy - 0.32) / 0.30;
        r = lerp(255, 210, t); g = lerp(78,  35,  t); b = lerp(142, 148, t); // hot pink → deep rose
      } else {
        const t = (vy - 0.62) / 0.38;
        r = lerp(210, 62,  t); g = lerp(35,  8,   t); b = lerp(148, 130, t); // deep rose → dark purple
      }

      // Radial vignette — darken edges for depth + focus on center
      const vig = Math.pow(d, 2.2) * 0.48;
      r = clamp(r - vig * r * 0.5,              0, 255);
      g = clamp(g - vig * g * 0.6,              0, 255);
      b = clamp(b - vig * (b - 60) * 0.3 + vig * 18, 0, 255);

      // Upper-right golden warmth (sunshine)
      if (nx > 0.1 && ny < -0.05) {
        const w = nx * (-ny) * 0.65;
        r = clamp(r + w * 32, 0, 255);
        g = clamp(g + w * 28, 0, 255);
        b = clamp(b - w * 18, 0, 255);
      }

      const idx = (y * size + x) * 3;
      raw[idx]   = Math.round(clamp(r, 0, 255));
      raw[idx+1] = Math.round(clamp(g, 0, 255));
      raw[idx+2] = Math.round(clamp(b, 0, 255));
    }
  }

  // ── 2. Goddess Crown (3-peak tiara shape) ──
  // Vertices traced as a crown polygon: base → right side → 3 peaks → left side → close
  const crownCY = cy - size * 0.02;  // slightly above center
  const hw      = size * 0.30;       // half-width
  const bandTop = crownCY + size * 0.05;
  const bandBot = crownCY + size * 0.18;
  const sideY   = crownCY - size * 0.07;
  const centerY = crownCY - size * 0.20;

  const crown = [
    [cx - hw,          bandBot],   // bottom-left
    [cx + hw,          bandBot],   // bottom-right
    [cx + hw,          bandTop],   // band top-right
    [cx + hw * 0.72,   sideY  ],   // right peak tip
    [cx + hw * 0.42,   bandTop],   // right valley
    [cx,               centerY],   // center peak tip (tallest)
    [cx - hw * 0.42,   bandTop],   // left valley
    [cx - hw * 0.72,   sideY  ],   // left peak tip
    [cx - hw,          bandTop],   // band top-left
  ];

  const glowW = size * 0.08;
  const cbx1 = Math.floor(cx - hw - glowW);
  const cbx2 = Math.ceil(cx + hw + glowW);
  const cby1 = Math.floor(centerY - glowW);
  const cby2 = Math.ceil(bandBot + glowW);

  for (let y = cby1; y <= cby2; y++) {
    for (let x = cbx1; x <= cbx2; x++) {
      if (x < 0 || x >= size || y < 0 || y >= size) continue;

      const inside = inPoly(x, y, crown);
      let minEdge = Infinity;
      for (let i = 0; i < crown.length; i++) {
        const j = (i + 1) % crown.length;
        minEdge = Math.min(minEdge, ptSegDist(x, y, crown[i][0], crown[i][1], crown[j][0], crown[j][1]));
      }

      const idx = (y * size + x) * 3;
      if (inside) {
        // Bright gold at peak tips → warm yellow-orange at base
        const tY = Math.max(0, Math.min(1, (y - centerY) / (bandBot - centerY)));
        const rC = 255;
        const gC = Math.round(lerp(230, 152, tY * 0.62));
        const bC = Math.round(lerp(42,  20,  tY * 0.50));
        // Slight inner-edge darkening for 3D depth
        const depth = Math.max(0, 1 - minEdge / (size * 0.055)) * 0.20;
        raw[idx]   = Math.round(clamp(rC - depth * 25,  0, 255));
        raw[idx+1] = Math.round(clamp(gC - depth * 30,  0, 255));
        raw[idx+2] = Math.round(clamp(bC - depth * 10,  0, 255));
      } else if (minEdge < glowW) {
        // Warm golden glow halo around the crown
        const g = Math.pow(1 - minEdge / glowW, 2.5) * 0.72;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(g * 218));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(g * 162));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(g * 48));
      }
    }
  }

  // ── 3. Gem ornaments at peak tips ──
  const gemR = Math.max(3, size * 0.030);
  const gems = [
    { x: cx,              y: centerY, cr: 255, cg: 238, cb: 75  }, // center — bright yellow
    { x: cx + hw * 0.72,  y: sideY,   cr: 255, cg: 105, cb: 195 }, // right — hot pink
    { x: cx - hw * 0.72,  y: sideY,   cr: 255, cg: 105, cb: 195 }, // left — hot pink
  ];

  for (const gem of gems) {
    const gr = gemR * 3.5;
    for (let dy = -gr; dy <= gr; dy++) {
      for (let dx = -gr; dx <= gr; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > gr) continue;
        const ix = Math.round(gem.x + dx), iy = Math.round(gem.y + dy);
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const core = Math.pow(Math.max(0, 1 - d / gemR), 2.5);
        const glow = Math.pow(Math.max(0, 1 - d / gr),   2.0) * 0.52;
        const idx  = (iy * size + ix) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(core * gem.cr + glow * gem.cr * 0.45));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(core * gem.cg + glow * gem.cg * 0.45));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(core * gem.cb + glow * gem.cb * 0.45));
      }
    }
  }

  // ── 4. Sparkle star-dots ──
  const sparks = [
    [0.16, 0.11], [0.80, 0.14], [0.07, 0.36], [0.90, 0.30],
    [0.50, 0.07], [0.26, 0.82], [0.74, 0.80], [0.93, 0.62],
    [0.04, 0.66], [0.60, 0.92], [0.38, 0.88], [0.84, 0.72],
  ];
  const sparkR = Math.max(2, Math.round(size * 0.016));
  for (const [sx, sy] of sparks) {
    const px = Math.round(sx * size), py = Math.round(sy * size);
    for (let dy = -sparkR * 2; dy <= sparkR * 2; dy++) {
      for (let dx = -sparkR * 2; dx <= sparkR * 2; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > sparkR * 2) continue;
        const ix = px + dx, iy = py + dy;
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const br  = Math.pow(Math.max(0, 1 - d / (sparkR * 2)), 2);
        const idx = (iy * size + ix) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(br * 255));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(br * 242));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(br * 215));
      }
    }
  }

  // ── 5. Rose-gold ring border ──
  const ringR = size * 0.455, ringW = size * 0.020;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - ringR) < ringW) {
        const t   = 1 - Math.abs(d - ringR) / ringW;
        const idx = (y * size + x) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(t * 82));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(t * 38));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(t * 52));
      }
    }
  }

  return raw;
}

// Generate and save all icon sizes
for (const size of [512, 192, 180]) {
  const raw  = generateGoddessIcon(size);
  const name = size === 180 ? 'public/apple-touch-icon.png' : `public/icon-${size}.png`;
  writeFileSync(name, buildPNG(size, raw));
  console.log(`✓ ${name}`);
}
