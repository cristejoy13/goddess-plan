// Generates public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png
// Goddess Plan icon: sunset palette + 5-peak goddess crown with metallic orbs and gems
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
  ihdr[8] = 8; ihdr[9] = 2;
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

function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function ptSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1, dy = y2 - y1;
  const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(x1 + t * dx - px, y1 + t * dy - py);
}

// ── Icon generator ───────────────────────────────────────────────────────────
function generateGoddessIcon(size) {
  const cx = size / 2, cy = size / 2;
  const raw = Buffer.alloc(size * size * 3);

  // ── 1. Background: pink dominant · deep purple accent lower ──
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const d  = Math.min(1, Math.hypot(nx, ny));
      const vy = y / size;

      // Pink-rose base: dark rose top → deeper rose bottom
      let r = lerp(62, 42, vy), g = lerp(8, 4, vy), b = lerp(24, 18, vy);

      // Hot pink dominant bloom — upper area, large and strong
      const pinkDist = Math.hypot((x - cx) / (cx * 1.1), (y - cy * 0.3) / (cy * 0.9));
      const pink = Math.max(0, 1 - pinkDist / 0.95);
      r = clamp(r + pink * pink * 180, 0, 255);
      g = clamp(g + pink * pink * 12,  0, 255);
      b = clamp(b + pink * pink * 90,  0, 255);

      // Secondary pink bloom — right side
      const pink2Dist = Math.hypot((x - cx * 1.7) / cx, (y - cy * 0.5) / cy);
      const pink2 = Math.max(0, 1 - pink2Dist / 0.80);
      r = clamp(r + pink2 * pink2 * 120, 0, 255);
      b = clamp(b + pink2 * pink2 * 55,  0, 255);

      // Deep purple ONLY at bottom — grounding accent
      if (vy > 0.55) {
        const purpStr = (vy - 0.55) / 0.45;
        b = clamp(b + purpStr * purpStr * 85, 0, 255);
        r = clamp(r * (1 - purpStr * 0.30), 0, 255);
      }

      // Diagonal bright-pink ray
      const rayPos = (x + y) / (size * 1.4);
      const ray = Math.max(0, 1 - Math.abs(rayPos - 0.52) / 0.16);
      r = clamp(r + ray * ray * 70, 0, 255);
      b = clamp(b + ray * ray * 30, 0, 255);

      // Vignette — frame edges darker
      const vig = Math.pow(d, 1.8) * 0.55;
      r = clamp(r * (1 - vig * 0.50), 0, 255);
      g = clamp(g * (1 - vig * 0.58), 0, 255);
      b = clamp(b * (1 - vig * 0.35), 0, 255);

      const idx = (y * size + x) * 3;
      raw[idx]   = Math.round(clamp(r, 0, 255));
      raw[idx+1] = Math.round(clamp(g, 0, 255));
      raw[idx+2] = Math.round(clamp(b, 0, 255));
    }
  }

  // ── 2. 5-peak goddess crown ──
  // 5 peaks: outer (shortest) → inner (medium) → center (tallest)
  // Real-crown look: flat band base, peaks with metallic orbs on top
  const crownCY   = cy - size * 0.02;
  const hw        = size * 0.30;
  const bandTop   = crownCY + size * 0.06;
  const bandBot   = crownCY + size * 0.18;
  const outerPkY  = crownCY - size * 0.04;   // outer peaks — shorter
  const innerPkY  = crownCY - size * 0.12;   // inner peaks — medium
  const centerPkY = crownCY - size * 0.21;   // center peak — tallest

  const crown = [
    [cx - hw,          bandBot    ],  // bottom-left
    [cx + hw,          bandBot    ],  // bottom-right
    [cx + hw,          bandTop    ],  // band top-right
    [cx + hw * 0.90,   outerPkY   ],  // outer-right peak
    [cx + hw * 0.70,   bandTop    ],  // valley
    [cx + hw * 0.48,   innerPkY   ],  // inner-right peak
    [cx + hw * 0.25,   bandTop    ],  // valley
    [cx,               centerPkY  ],  // center peak
    [cx - hw * 0.25,   bandTop    ],  // valley
    [cx - hw * 0.48,   innerPkY   ],  // inner-left peak
    [cx - hw * 0.70,   bandTop    ],  // valley
    [cx - hw * 0.90,   outerPkY   ],  // outer-left peak
    [cx - hw,          bandTop    ],  // band top-left
  ];

  const glowW = size * 0.08;
  const cbx1  = Math.floor(cx - hw - glowW);
  const cbx2  = Math.ceil (cx + hw + glowW);
  const cby1  = Math.floor(centerPkY - glowW);
  const cby2  = Math.ceil (bandBot   + glowW);

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
        // Crown fill: bright yellow at peak tips → warm pink at base
        const tY = Math.max(0, Math.min(1, (y - centerPkY) / (bandBot - centerPkY)));
        const rC = 255;
        const gC = Math.round(lerp(225, 92,  tY * 0.72)); // yellow → pink
        const bC = Math.round(lerp(42,  148, tY * 0.78)); // yellow → pink

        // Top-of-band highlight — simulates light catching the metal edge
        const bandHL = Math.max(0, 1 - Math.abs(y - bandTop) / (size * 0.016)) * 0.32;
        // Edge shadow for 3D depth
        const shadow = Math.max(0, 1 - minEdge / (size * 0.042)) * 0.24;

        raw[idx]   = Math.round(clamp(rC - shadow * 22 + bandHL * 10, 0, 255));
        raw[idx+1] = Math.round(clamp(gC - shadow * 28 + bandHL * 20, 0, 255));
        raw[idx+2] = Math.round(clamp(bC - shadow * 12 + bandHL * 28, 0, 255));
      } else if (minEdge < glowW) {
        const g = Math.pow(1 - minEdge / glowW, 2.5) * 0.72;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(g * 218));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(g * 162));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(g * 48));
      }
    }
  }

  // ── 3. Metallic orbs at all 5 peak tips ──
  // Orbs are the round balls on top of a real crown — the defining detail
  const orbR = Math.max(4, size * 0.024);
  const peakOrbs = [
    { x: cx + hw * 0.90, y: outerPkY  },
    { x: cx + hw * 0.48, y: innerPkY  },
    { x: cx,             y: centerPkY },
    { x: cx - hw * 0.48, y: innerPkY  },
    { x: cx - hw * 0.90, y: outerPkY  },
  ];
  for (const orb of peakOrbs) {
    for (let dy = -orbR * 3; dy <= orbR * 3; dy++) {
      for (let dx = -orbR * 3; dx <= orbR * 3; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > orbR * 3) continue;
        const ix = Math.round(orb.x + dx), iy = Math.round(orb.y + dy);
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const idx = (iy * size + ix) * 3;
        if (d <= orbR) {
          // Bright orb: white-yellow center → warm pink edge
          const t = d / orbR;
          const rC = 255;
          const gC = Math.round(lerp(248, 118, t * 0.75));
          const bC = Math.round(lerp(180, 165, t * 0.60));
          raw[idx]   = rC;
          raw[idx+1] = Math.min(255, gC);
          raw[idx+2] = Math.min(255, bC);
        } else if (d < orbR * 3) {
          // Pink-gold glow around orb
          const g = Math.pow(1 - (d - orbR) / (orbR * 2), 2) * 0.52;
          raw[idx]   = Math.min(255, raw[idx]   + Math.round(g * 215));
          raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(g * 95));
          raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(g * 158));
        }
      }
    }
  }

  // ── 4. Jewels set into the crown band ──
  const bandMidY = (bandTop + bandBot) * 0.5;
  const jewR = Math.max(3, size * 0.026);
  const bandJewels = [
    { x: cx,             y: bandMidY, cr: 255, cg: 238, cb: 70  }, // center — yellow
    { x: cx + hw * 0.44, y: bandMidY, cr: 255, cg: 100, cb: 195 }, // right — pink
    { x: cx - hw * 0.44, y: bandMidY, cr: 255, cg: 100, cb: 195 }, // left — pink
  ];
  for (const j of bandJewels) {
    const gr = jewR * 3.2;
    for (let dy = -gr; dy <= gr; dy++) {
      for (let dx = -gr; dx <= gr; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > gr) continue;
        const ix = Math.round(j.x + dx), iy = Math.round(j.y + dy);
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const core = Math.pow(Math.max(0, 1 - d / jewR), 2.5);
        const glow = Math.pow(Math.max(0, 1 - d / gr),   2.0) * 0.50;
        const idx  = (iy * size + ix) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(core * j.cr + glow * j.cr * 0.44));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(core * j.cg + glow * j.cg * 0.44));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(core * j.cb + glow * j.cb * 0.44));
      }
    }
  }

  // ── 5. Sparkle dots ──
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

  // ── 6. Rose-gold ring border ──
  const ringR = size * 0.455, ringW = size * 0.020;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - ringR) < ringW) {
        const t   = 1 - Math.abs(d - ringR) / ringW;
        const idx = (y * size + x) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(t * 85));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(t * 40));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(t * 55));
      }
    }
  }

  return raw;
}

for (const size of [512, 192, 180]) {
  const raw  = generateGoddessIcon(size);
  const name = size === 180 ? 'public/apple-touch-icon.png' : `public/icon-${size}.png`;
  writeFileSync(name, buildPNG(size, raw));
  console.log(`✓ ${name}`);
}
