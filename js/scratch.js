'use strict';
(() => {
  const box = document.getElementById('scratchBox'), cv = document.getElementById('scratchCv'), ctx = cv.getContext('2d', { willReadFrequently: true });
  let last = null, drawing = false, done = false, moves = 0, W = 0, H = 0;
  function paint() {
    const r = box.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.globalCompositeOperation = 'source-over';
    const gr = ctx.createLinearGradient(0, 0, W, H);
    gr.addColorStop(0, '#CDB083'); gr.addColorStop(.35, '#E6D3A8'); gr.addColorStop(.6, '#B99762'); gr.addColorStop(1, '#D9C08F');
    ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1; ctx.strokeRect(10, 10, W - 20, H - 20);
    ctx.fillStyle = 'rgba(68,35,52,.72)'; ctx.textAlign = 'center'; ctx.font = '500 20px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Scratch here', W / 2, H / 2 + 6);
  }
  function pos(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
  function scratch(e) {
    if (!drawing || done) return; const [x, y] = pos(e);
    ctx.globalCompositeOperation = 'destination-out'; ctx.strokeStyle = '#000'; ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(40, W * .1);
    ctx.beginPath(); ctx.moveTo(last ? last[0] : x, last ? last[1] : y); ctx.lineTo(x + .01, y); ctx.stroke(); last = [x, y];
    if (++moves % 8 === 0) check();
  }
  function check() {
    const d = ctx.getImageData(0, 0, cv.width, cv.height).data; let clear = 0, n = 0;
    for (let i = 3; i < d.length; i += 160) { n++; if (d[i] < 20) clear++; }
    if (clear / n > .5) reveal();
  }
  function reveal() {
    if (done) return; done = true; cv.classList.add('fade'); box.classList.add('revealed');
    setTimeout(() => { cv.style.display = 'none'; }, 900); document.getElementById('revealBtn').hidden = true;
  }
  cv.addEventListener('pointerdown', e => { drawing = true; last = null; cv.setPointerCapture(e.pointerId); scratch(e); });
  cv.addEventListener('pointermove', scratch);
  ['pointerup', 'pointercancel'].forEach(t => cv.addEventListener(t, () => { drawing = false; last = null; if (!done) check(); }));
  document.getElementById('revealBtn').addEventListener('click', reveal);
  let rw = 0; addEventListener('resize', () => { if (!done && Math.abs(innerWidth - rw) > 40) { rw = innerWidth; paint(); } });
  rw = innerWidth; paint();
})();
