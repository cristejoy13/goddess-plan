// Generates public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png
// Goddess Plan icon: soft paradise sky + feminine goddess silhouette + floral halo.
import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';

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
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function buildPNG(size, raw) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 2;

  const rows = [];
  for (let y = 0; y < size; y++) {
    rows.push(Buffer.from([0]));
    rows.push(raw.subarray(y * size * 3, (y + 1) * size * 3));
  }

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(Buffer.concat(rows))),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const clamp = (v, lo = 0, hi = 255) => Math.max(lo, Math.min(hi, v));
const norm = (v, lo, hi) => clamp((v - lo) / (hi - lo), 0, 1);
const smooth = (v) => v * v * (3 - 2 * v);
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

function setPx(raw, size, x, y, color) {
  if (x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (y * size + x) * 3;
  raw[idx] = Math.round(color[0]);
  raw[idx + 1] = Math.round(color[1]);
  raw[idx + 2] = Math.round(color[2]);
}

function blendPx(raw, size, x, y, color, alpha) {
  if (alpha <= 0 || x < 0 || y < 0 || x >= size || y >= size) return;
  const idx = (y * size + x) * 3;
  const a = clamp(alpha, 0, 1);
  raw[idx] = Math.round(lerp(raw[idx], color[0], a));
  raw[idx + 1] = Math.round(lerp(raw[idx + 1], color[1], a));
  raw[idx + 2] = Math.round(lerp(raw[idx + 2], color[2], a));
}

function drawSoftEllipse(raw, size, cx, cy, rx, ry, color, alpha = 1, edge = 0.22) {
  const x1 = Math.floor(cx - rx * (1 + edge));
  const x2 = Math.ceil(cx + rx * (1 + edge));
  const y1 = Math.floor(cy - ry * (1 + edge));
  const y2 = Math.ceil(cy + ry * (1 + edge));

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const d = Math.hypot((x - cx) / rx, (y - cy) / ry);
      const a = alpha * (1 - smooth(norm(d, 1 - edge, 1 + edge)));
      blendPx(raw, size, x, y, color, a);
    }
  }
}

function drawRing(raw, size, cx, cy, r, w, color, alpha = 1) {
  const pad = w * 3;
  for (let y = Math.floor(cy - r - pad); y <= cy + r + pad; y++) {
    for (let x = Math.floor(cx - r - pad); x <= cx + r + pad; x++) {
      const d = Math.abs(Math.hypot(x - cx, y - cy) - r);
      const a = alpha * Math.pow(1 - norm(d, w * 0.15, w), 1.7);
      blendPx(raw, size, x, y, color, a);
    }
  }
}

function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function ptSegDist(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
  return Math.hypot(x1 + t * dx - px, y1 + t * dy - py);
}

function drawSoftPoly(raw, size, poly, color, alpha = 1, feather = 3) {
  const xs = poly.map(p => p[0]);
  const ys = poly.map(p => p[1]);
  const x1 = Math.floor(Math.min(...xs) - feather * 2);
  const x2 = Math.ceil(Math.max(...xs) + feather * 2);
  const y1 = Math.floor(Math.min(...ys) - feather * 2);
  const y2 = Math.ceil(Math.max(...ys) + feather * 2);

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      let minEdge = Infinity;
      for (let i = 0; i < poly.length; i++) {
        const j = (i + 1) % poly.length;
        minEdge = Math.min(minEdge, ptSegDist(x, y, poly[i][0], poly[i][1], poly[j][0], poly[j][1]));
      }
      const a = inPoly(x, y, poly) ? alpha : alpha * Math.pow(1 - norm(minEdge, 0, feather), 2);
      blendPx(raw, size, x, y, color, a);
    }
  }
}

function qPoint(p0, p1, p2, t) {
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
}

function drawRibbon(raw, size, p0, p1, p2, width0, width1, color, alpha = 1) {
  const steps = 70;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const [x, y] = qPoint(p0, p1, p2, t);
    const w = lerp(width0, width1, t);
    const a = alpha * (1 - t * 0.2);
    drawSoftEllipse(raw, size, x, y, w * 0.58, w * 0.34, color, a, 0.48);
  }
}

function drawPetal(raw, size, cx, cy, angle, scale, color, alpha) {
  const ca = Math.cos(angle);
  const sa = Math.sin(angle);
  const rx = size * 0.018 * scale;
  const ry = size * 0.038 * scale;
  const x1 = Math.floor(cx - ry - rx);
  const x2 = Math.ceil(cx + ry + rx);
  const y1 = Math.floor(cy - ry - rx);
  const y2 = Math.ceil(cy + ry + rx);

  for (let y = y1; y <= y2; y++) {
    for (let x = x1; x <= x2; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const lx = dx * ca + dy * sa;
      const ly = -dx * sa + dy * ca;
      const d = Math.hypot(lx / rx, ly / ry);
      const a = alpha * (1 - smooth(norm(d, 0.72, 1.2)));
      blendPx(raw, size, x, y, color, a);
    }
  }
}

function addBackground(raw, size) {
  const top = [178, 150, 231];
  const mid = [247, 190, 222];
  const glow = [255, 239, 190];
  const bottom = [248, 176, 220];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = x / size;
      const ny = y / size;
      let color = mix(top, mid, smooth(norm(ny, 0, 0.6)));
      color = mix(color, bottom, smooth(norm(ny, 0.54, 1)));

      const sun = Math.pow(Math.max(0, 1 - Math.hypot(nx - 0.77, ny - 0.36) / 0.55), 1.9);
      color = mix(color, glow, sun * 0.82);

      const lavender = Math.pow(Math.max(0, 1 - Math.hypot(nx - 0.17, ny - 0.12) / 0.5), 2);
      color = mix(color, [137, 116, 219], lavender * 0.45);

      const vignette = smooth(norm(Math.hypot(nx - 0.5, ny - 0.5), 0.48, 0.78));
      color = mix(color, [131, 89, 189], vignette * 0.28);

      setPx(raw, size, x, y, color);
    }
  }

  drawSoftEllipse(raw, size, size * 0.22, size * 0.85, size * 0.35, size * 0.13, [255, 244, 248], 0.48, 0.55);
  drawSoftEllipse(raw, size, size * 0.55, size * 0.83, size * 0.42, size * 0.15, [255, 236, 246], 0.42, 0.55);
  drawSoftEllipse(raw, size, size * 0.88, size * 0.82, size * 0.28, size * 0.12, [255, 244, 236], 0.42, 0.6);
  drawSoftEllipse(raw, size, size * 0.48, size * 0.13, size * 0.52, size * 0.1, [255, 255, 246], 0.14, 0.72);
}

function addGoddess(raw, size) {
  const cx = size * 0.5;

  drawSoftEllipse(raw, size, cx, size * 0.42, size * 0.23, size * 0.3, [255, 240, 214], 0.22, 0.72);
  drawRing(raw, size, cx, size * 0.3, size * 0.18, size * 0.016, [255, 224, 133], 0.64);

  const dressBack = [
    [cx, size * 0.44],
    [size * 0.2, size * 1.06],
    [size * 0.5, size * 1.16],
    [size * 0.83, size * 1.05],
  ];
  drawSoftPoly(raw, size, dressBack, [197, 118, 224], 0.82, size * 0.018);

  drawRibbon(raw, size, [cx, size * 0.46], [size * 0.23, size * 0.66], [size * -0.12, size * 0.89], size * 0.095, size * 0.18, [244, 130, 205], 0.72);
  drawRibbon(raw, size, [cx, size * 0.48], [size * 0.78, size * 0.66], [size * 1.13, size * 0.85], size * 0.095, size * 0.2, [255, 195, 138], 0.67);
  drawRibbon(raw, size, [cx, size * 0.48], [size * 0.42, size * 0.73], [size * 0.34, size * 1.12], size * 0.075, size * 0.18, [224, 132, 224], 0.72);
  drawRibbon(raw, size, [cx, size * 0.5], [size * 0.57, size * 0.75], [size * 0.72, size * 1.08], size * 0.07, size * 0.16, [255, 220, 148], 0.66);
  drawRibbon(raw, size, [cx, size * 0.5], [size * 0.49, size * 0.74], [size * 0.49, size * 1.13], size * 0.08, size * 0.18, [255, 158, 205], 0.76);

  drawSoftPoly(raw, size, [
    [size * 0.39, size * 0.42],
    [size * 0.47, size * 0.37],
    [size * 0.54, size * 0.37],
    [size * 0.61, size * 0.42],
    [size * 0.55, size * 0.54],
    [size * 0.45, size * 0.54],
  ], [255, 211, 190], 0.9, size * 0.012);

  drawSoftEllipse(raw, size, cx, size * 0.29, size * 0.055, size * 0.065, [255, 215, 194], 0.92, 0.22);
  drawSoftEllipse(raw, size, cx, size * 0.32, size * 0.05, size * 0.08, [255, 215, 194], 0.55, 0.3);

  drawSoftEllipse(raw, size, cx, size * 0.285, size * 0.068, size * 0.075, [73, 54, 88], 0.78, 0.3);
  drawRibbon(raw, size, [size * 0.46, size * 0.29], [size * 0.37, size * 0.43], [size * 0.33, size * 0.62], size * 0.055, size * 0.06, [87, 63, 99], 0.86);
  drawRibbon(raw, size, [size * 0.54, size * 0.29], [size * 0.63, size * 0.43], [size * 0.67, size * 0.62], size * 0.052, size * 0.058, [101, 69, 106], 0.82);
  drawRibbon(raw, size, [size * 0.49, size * 0.3], [size * 0.47, size * 0.46], [size * 0.45, size * 0.66], size * 0.06, size * 0.072, [75, 56, 91], 0.92);
  drawRibbon(raw, size, [size * 0.51, size * 0.3], [size * 0.53, size * 0.46], [size * 0.55, size * 0.66], size * 0.055, size * 0.07, [89, 60, 100], 0.84);
  drawRibbon(raw, size, [size * 0.47, size * 0.31], [size * 0.41, size * 0.45], [size * 0.38, size * 0.58], size * 0.012, size * 0.014, [205, 141, 135], 0.58);
  drawRibbon(raw, size, [size * 0.53, size * 0.31], [size * 0.58, size * 0.45], [size * 0.61, size * 0.58], size * 0.011, size * 0.014, [226, 167, 143], 0.5);
  drawRibbon(raw, size, [size * 0.5, size * 0.31], [size * 0.49, size * 0.48], [size * 0.49, size * 0.62], size * 0.01, size * 0.012, [196, 128, 161], 0.45);
  drawSoftEllipse(raw, size, cx, size * 0.42, size * 0.035, size * 0.072, [255, 214, 188], 0.26, 0.44);

  drawRing(raw, size, cx, size * 0.31, size * 0.12, size * 0.007, [255, 217, 122], 0.78);
  for (const [px, py, s, col] of [
    [0.42, 0.27, 1, [255, 178, 221]],
    [0.47, 0.25, 0.9, [255, 232, 152]],
    [0.53, 0.25, 0.9, [255, 184, 215]],
    [0.58, 0.27, 1, [255, 229, 142]],
  ]) {
    drawPetal(raw, size, size * px, size * py, -0.25, s, col, 0.95);
    drawPetal(raw, size, size * px, size * py, 0.85, s, col, 0.82);
    drawSoftEllipse(raw, size, size * px, size * py, size * 0.011 * s, size * 0.011 * s, [255, 244, 211], 0.95, 0.35);
  }
}

function addPearlMotes(raw, size) {
  const motes = [
    [0.18, 0.18, 0.008], [0.32, 0.11, 0.005], [0.72, 0.17, 0.007],
    [0.85, 0.34, 0.005], [0.12, 0.55, 0.005], [0.68, 0.64, 0.004],
    [0.29, 0.78, 0.004], [0.82, 0.75, 0.005], [0.43, 0.88, 0.004],
  ];
  for (const [x, y, r] of motes) {
    drawSoftEllipse(raw, size, x * size, y * size, r * size, r * size, [255, 249, 224], 0.8, 0.85);
  }
}

function addGlassBorder(raw, size) {
  drawRing(raw, size, size / 2, size / 2, size * 0.462, size * 0.017, [255, 230, 164], 0.62);
  drawRing(raw, size, size / 2, size / 2, size * 0.435, size * 0.004, [255, 250, 238], 0.28);
}

function generateGoddessIcon(size) {
  const raw = Buffer.alloc(size * size * 3);
  addBackground(raw, size);
  addPearlMotes(raw, size);
  addGoddess(raw, size);
  addGlassBorder(raw, size);
  return raw;
}

for (const size of [512, 192, 180]) {
  const raw = generateGoddessIcon(size);
  const name = size === 180 ? 'public/apple-touch-icon.png' : `public/icon-${size}.png`;
  writeFileSync(name, buildPNG(size, raw));
  console.log(`✓ ${name}`);
}
