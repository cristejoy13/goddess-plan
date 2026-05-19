// Generates public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png
// Goddess Plan icon: feminine rose-pink bg + golden moon crown + sparkle gems
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

// ── Icon generator ───────────────────────────────────────────────────────────
function generateGoddessIcon(size) {
  const cx = size / 2, cy = size / 2;
  const raw = Buffer.alloc(size * size * 3);

  // ── 1. Background: feminine deep rose → warm pink → soft purple ──
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx;   // -1 → +1
      const ny = (y - cy) / cy;   // -1 → +1
      const d  = Math.min(1, Math.hypot(nx, ny));

      let r, g, b;
      if (d < 0.28) {
        const t = d / 0.28;
        r = lerp(252, 230, t); g = lerp(148, 68,  t); b = lerp(196, 148, t); // warm pink center
      } else if (d < 0.58) {
        const t = (d - 0.28) / 0.30;
        r = lerp(230, 165, t); g = lerp(68,  26,  t); b = lerp(148, 122, t); // deep rose
      } else if (d < 0.82) {
        const t = (d - 0.58) / 0.24;
        r = lerp(165, 82,  t); g = lerp(26,  14,  t); b = lerp(122, 118, t); // rose → purple-rose
      } else {
        const t = (d - 0.82) / 0.18;
        r = lerp(82,  28,  t); g = lerp(14,  6,   t); b = lerp(118, 52,  t); // dark edge
      }

      // Golden warmth bloom — upper right
      if (nx > 0.1 && ny < -0.05) {
        const w = nx * (-ny) * 0.55;
        r = clamp(r + w * 70, 0, 255);
        g = clamp(g + w * 52, 0, 255);
        b = clamp(b - w * 12, 0, 255);
      }
      // Light lavender shimmer — upper left (soft purple accent)
      if (nx < -0.15 && ny < 0.08) {
        const lav = (-nx - 0.15) * (0.08 - ny) * 1.1;
        r = clamp(r + lav * 12, 0, 255);
        b = clamp(b + lav * 75, 0, 255);
      }

      const idx = (y * size + x) * 3;
      raw[idx]   = Math.round(clamp(r, 0, 255));
      raw[idx+1] = Math.round(clamp(g, 0, 255));
      raw[idx+2] = Math.round(clamp(b, 0, 255));
    }
  }

  // ── 2. Moon Crown crescent (horns pointing upward, like a tiara) ──
  // Outer circle slightly below center; inner circle shifted UP.
  // Crescent = inside outer AND outside inner → bowl shape, tips pointing up.
  const outerCX = cx,  outerCY = cy + size * 0.07,  outerR = size * 0.285;
  const innerCX = cx,  innerCY = cy - size * 0.07,  innerR = size * 0.235;
  const glowW = size * 0.10;

  const bx1 = Math.floor(cx - outerR - glowW);
  const bx2 = Math.ceil (cx + outerR + glowW);
  const by1 = Math.floor(innerCY - innerR - glowW);
  const by2 = Math.ceil (outerCY + outerR + glowW);

  for (let y = by1; y <= by2; y++) {
    for (let x = bx1; x <= bx2; x++) {
      if (x < 0 || x >= size || y < 0 || y >= size) continue;
      const dOut = Math.hypot(x - outerCX, y - outerCY);
      const dIn  = Math.hypot(x - innerCX, y - innerCY);
      const inCrescent = dOut <= outerR && dIn > innerR;
      const idx = (y * size + x) * 3;

      if (inCrescent) {
        // Warm gold at the tips (top) → golden-rose at the bowl bottom
        const tPos = (y - (outerCY - outerR)) / (outerR * 2); // 0 top → 1 bottom
        // Inner rim highlight on the concave edge
        const tRim = Math.max(0, 1 - (dIn - innerR) / (size * 0.055));
        const rC = 255;
        const gC = Math.round(clamp(lerp(238, 175, tPos * 0.55) + tRim * 12, 0, 255));
        const bC = Math.round(clamp(lerp(82,  160, tPos * 0.55) - tRim * 8,  0, 255));
        raw[idx]   = rC;
        raw[idx+1] = gC;
        raw[idx+2] = bC;
      } else {
        // Golden glow halo radiating outward from the crescent edge
        if (dOut > outerR && dOut < outerR + glowW) {
          const g = Math.pow(1 - (dOut - outerR) / glowW, 2.5) * 0.72;
          raw[idx]   = Math.min(255, raw[idx]   + Math.round(g * 212));
          raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(g * 158));
          raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(g * 60));
        }
      }
    }
  }

  // ── 3. Gem ornaments: pink at horn tips, golden at center-bottom ──
  // Compute horn tip positions (intersection of the two circles)
  const tipD = Math.hypot(innerCX - outerCX, innerCY - outerCY);
  const tipA = (tipD * tipD + outerR * outerR - innerR * innerR) / (2 * tipD);
  const tipH = Math.sqrt(Math.max(0, outerR * outerR - tipA * tipA));
  const dirX = (innerCX - outerCX) / tipD;   // 0
  const dirY = (innerCY - outerCY) / tipD;   // -1
  const mX = outerCX + tipA * dirX;
  const mY = outerCY + tipA * dirY;

  const gemR = Math.max(3, size * 0.028);
  const gems = [
    { x: mX - tipH * dirY, y: mY + tipH * dirX, cr: 255, cg: 192, cb: 228 }, // left horn
    { x: mX + tipH * dirY, y: mY - tipH * dirX, cr: 255, cg: 192, cb: 228 }, // right horn
    { x: cx, y: outerCY + outerR * 0.58,         cr: 255, cg: 238, cb: 128 }, // center jewel
  ];

  for (const gem of gems) {
    const gr = gemR * 3;
    for (let dy = -gr; dy <= gr; dy++) {
      for (let dx = -gr; dx <= gr; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > gr) continue;
        const ix = Math.round(gem.x + dx), iy = Math.round(gem.y + dy);
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const core = Math.pow(Math.max(0, 1 - d / gemR), 2.5);
        const glow = Math.pow(Math.max(0, 1 - d / gr), 2) * 0.55;
        const idx  = (iy * size + ix) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(core * gem.cr + glow * gem.cr * 0.5));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(core * gem.cg + glow * gem.cg * 0.5));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(core * gem.cb + glow * gem.cb * 0.5));
      }
    }
  }

  // ── 4. Sparkle star-dots scattered in the background ──
  const sparks = [
    [0.16, 0.11], [0.80, 0.14], [0.07, 0.36], [0.90, 0.30],
    [0.50, 0.07], [0.26, 0.82], [0.74, 0.80], [0.93, 0.62],
    [0.04, 0.66], [0.60, 0.92], [0.38, 0.88], [0.84, 0.72],
  ];
  const sparkR = Math.max(2, Math.round(size * 0.017));

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
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(br * 230));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(br * 218));
      }
    }
  }

  // ── 5. Thin golden ring border ──
  const ringR = size * 0.455, ringW = size * 0.018;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - ringR) < ringW) {
        const t   = 1 - Math.abs(d - ringR) / ringW;
        const idx = (y * size + x) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(t * 135));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(t * 92));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(t * 22));
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
