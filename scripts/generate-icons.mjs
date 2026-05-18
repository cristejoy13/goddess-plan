// Generates public/icon-192.png and public/icon-512.png
// Solid rose-pink background (#ff5c9d) — replace with real artwork later.
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
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crcBuf]);
}

function solidPNG(size, r, g, b) {
  const sig = Buffer.from([137,80,78,71,13,10,26,10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

  // Build raw pixel rows (filter byte 0 + RGB per pixel)
  const row = Buffer.alloc(1 + size * 3);
  row[0] = 0;
  for (let x = 0; x < size; x++) {
    row[1 + x*3]   = r;
    row[1 + x*3+1] = g;
    row[1 + x*3+2] = b;
  }
  const raw = Buffer.concat(Array.from({ length: size }, () => row));
  const idat = deflateSync(raw);

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', idat), chunk('IEND', Buffer.alloc(0))]);
}

// Rose-pink background: #e8347a → rgb(232, 52, 122)
writeFileSync('public/icon-192.png', solidPNG(192, 232, 52, 122));
writeFileSync('public/icon-512.png', solidPNG(512, 232, 52, 122));
writeFileSync('public/apple-touch-icon.png', solidPNG(180, 232, 52, 122));
console.log('Icons created: public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png');
