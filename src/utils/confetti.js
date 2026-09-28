// Confetti for a goal reached or a workout milestone. Skipped when the
// gadget asks for reduced motion.
export function fireConfetti() {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'goals-confetti';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const W = window.innerWidth, H = window.innerHeight;
  canvas.width = W * dpr; canvas.height = H * dpr;
  ctx.scale(dpr, dpr);
  const colors = ['#ff5c9d', '#f0cc60', '#ffc2dc', '#c4a6ff', '#6ee7c8', '#ffffff'];
  const bits = Array.from({ length: Math.min(220, Math.round(W / 5) + 90) }, (_, i) => {
    const fromLeft = i % 2 === 0;
    return {
      x: fromLeft ? 0 : W, y: H * 0.7,
      vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 9) * (W / 800 + 0.6),
      vy: -(9 + Math.random() * 11),
      w: 6 + Math.random() * 6, h: 4 + Math.random() * 5,
      r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
      c: colors[i % colors.length],
    };
  });
  const t0 = performance.now();
  function frame(t) {
    const age = t - t0;
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = age > 3200 ? Math.max(0, 1 - (age - 3200) / 800) : 1;
    for (const b of bits) {
      b.vy += 0.32; b.vx *= 0.985; b.vy *= 0.985;
      b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r);
      ctx.fillStyle = b.c; ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
      ctx.restore();
    }
    if (age < 4000) requestAnimationFrame(frame); else canvas.remove();
  }
  requestAnimationFrame(frame);
}
