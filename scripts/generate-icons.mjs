// Generates public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png
// Goddess Plan icon: dark rose-pink gradient bg + golden crown + sparkle stars
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
  // prepend filter byte (0) to each row
  const rows = [];
  for (let y = 0; y < size; y++) {
    rows.push(Buffer.from([0]));
    rows.push(raw.subarray(y * size * 3, (y + 1) * size * 3));
  }
  const idat = deflateSync(Buffer.concat(rows));
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// ── Math helpers ─────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * Math.max(0, Math.min(1, t));
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// 5-pointed star polygon vertices
function starVerts(cx, cy, outerR, innerR) {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI / 5) - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push([cx + Math.cos(angle) * r, cy + Math.sin(angle) * r]);
  }
  return pts;
}

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

  // ── 1. Background gradient ──
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = (x - cx) / cx;         // -1 → +1
      const ny = (y - cy) / cy;         // -1 → +1
      const d  = Math.min(1, Math.hypot(nx, ny));

      // Radial color stops: gold center → vivid rose mid → deep purple-rose edge
      let r, g, b;
      if (d < 0.28) {
        const t = d / 0.28;
        r = lerp(255, 235, t); g = lerp(210, 55, t); b = lerp(170, 110, t); // warm gold → hot rose
      } else if (d < 0.60) {
        const t = (d - 0.28) / 0.32;
        r = lerp(235, 170, t); g = lerp(55, 18, t);  b = lerp(110, 80, t);  // hot rose → deep rose
      } else if (d < 0.85) {
        const t = (d - 0.60) / 0.25;
        r = lerp(170, 80, t);  g = lerp(18, 8, t);   b = lerp(80, 100, t);  // deep rose → purple-dark
      } else {
        const t = (d - 0.85) / 0.15;
        r = lerp(80, 14, t);   g = lerp(8, 4, t);    b = lerp(100, 20, t);  // purple-dark → near-black
      }

      // Golden divine light — upper-right bloom (matches the image)
      if (nx > 0.15 && ny < 0) {
        const warm = nx * (-ny) * 0.6;
        r = clamp(r + warm * 70, 0, 255);
        g = clamp(g + warm * 55, 0, 255);
        b = clamp(b - warm * 15, 0, 255);
      }
      // Purple haze — upper-left
      if (nx < -0.2 && ny < -0.1) {
        const haze = (-nx) * (-ny) * 0.5;
        r = clamp(r - haze * 18, 0, 255);
        b = clamp(b + haze * 45, 0, 255);
      }

      const idx = (y * size + x) * 3;
      raw[idx]   = Math.round(r);
      raw[idx+1] = Math.round(g);
      raw[idx+2] = Math.round(b);
    }
  }

  // ── 2. Crown shape (5-point star, centred slightly above middle) ──
  const starCY  = cy - size * 0.04;    // slightly above centre
  const outerR  = size * 0.29;
  const innerR  = size * 0.125;
  const star    = starVerts(cx, starCY, outerR, innerR);
  const glowR   = size * 0.012;

  const starBbox = {
    x1: Math.floor(cx - outerR - glowR * 8),
    x2: Math.ceil(cx + outerR + glowR * 8),
    y1: Math.floor(starCY - outerR - glowR * 8),
    y2: Math.ceil(starCY + outerR + glowR * 8),
  };

  for (let y = starBbox.y1; y <= starBbox.y2; y++) {
    for (let x = starBbox.x1; x <= starBbox.x2; x++) {
      if (x < 0 || x >= size || y < 0 || y >= size) continue;
      const inside = inPoly(x, y, star);

      // Nearest edge distance
      let minEdge = Infinity;
      for (let i = 0; i < star.length; i++) {
        const j = (i + 1) % star.length;
        minEdge = Math.min(minEdge, ptSegDist(x, y, star[i][0], star[i][1], star[j][0], star[j][1]));
      }

      const idx = (y * size + x) * 3;
      if (inside) {
        // Gold fill — brighter at centre
        const dc = Math.hypot(x - cx, y - starCY) / outerR;
        raw[idx]   = Math.round(lerp(255, 235, dc * 0.45));
        raw[idx+1] = Math.round(lerp(225, 155, dc * 0.55));
        raw[idx+2] = Math.round(lerp(120, 35, dc * 0.55));
      } else {
        // Soft glow halo around star
        const maxGlow = glowR * 10;
        if (minEdge < maxGlow) {
          const g = Math.pow(1 - minEdge / maxGlow, 2) * 0.75;
          raw[idx]   = Math.min(255, raw[idx]   + Math.round(g * 210));
          raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(g * 145));
          raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(g * 40));
        }
      }
    }
  }

  // ── 3. Sparkle star-dots scattered around (like the image sky) ──
  const sparks = [
    [0.22, 0.15], [0.74, 0.18], [0.12, 0.42], [0.84, 0.36],
    [0.50, 0.10], [0.32, 0.80], [0.70, 0.82], [0.90, 0.58],
    [0.08, 0.68], [0.62, 0.92], [0.44, 0.88], [0.80, 0.72],
  ];
  const sparkR = Math.max(3, Math.round(size * 0.022));

  for (const [sx, sy] of sparks) {
    const px = Math.round(sx * size), py = Math.round(sy * size);
    for (let dy = -sparkR * 2; dy <= sparkR * 2; dy++) {
      for (let dx = -sparkR * 2; dx <= sparkR * 2; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > sparkR * 2) continue;
        const ix = px + dx, iy = py + dy;
        if (ix < 0 || ix >= size || iy < 0 || iy >= size) continue;
        const br = Math.pow(Math.max(0, 1 - d / (sparkR * 2)), 2);
        const idx = (iy * size + ix) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(br * 255));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(br * 235));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(br * 210));
      }
    }
  }

  // ── 4. Thin golden ring border ──
  const ringR = size * 0.455, ringW = size * 0.018;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const d = Math.hypot(x - cx, y - cy);
      const distFromRing = Math.abs(d - ringR);
      if (distFromRing < ringW) {
        const t = 1 - distFromRing / ringW;
        const idx = (y * size + x) * 3;
        raw[idx]   = Math.min(255, raw[idx]   + Math.round(t * 130));
        raw[idx+1] = Math.min(255, raw[idx+1] + Math.round(t * 90));
        raw[idx+2] = Math.min(255, raw[idx+2] + Math.round(t * 20));
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
