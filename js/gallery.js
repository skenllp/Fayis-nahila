'use strict';
(() => {
  const items = window.SITE.gallery, grid = document.getElementById('galGrid'), lb = document.getElementById('lb');
  const img = document.getElementById('lbImg'), cap = document.getElementById('lbCap');
  const real = items.map((g, i) => ({ ...g, i })).filter(g => g.src);
  let cur = 0, lastFocus = null;
  grid.classList.toggle('single', real.length === 1);
  lb.classList.toggle('solo', real.length < 2);
  grid.innerHTML = items.map((g, i) => g.src
    ? `<button class="g-item reveal" type="button" data-i="${real.findIndex(r => r.i === i)}"><img src="${g.src}" alt="${g.alt.replace(/"/g, '&quot;')}" loading="lazy"></button>`
    : `<div class="g-item slot reveal" aria-label="Replaceable photo slot"><span>Photo coming soon</span></div>`).join('');
  function show(i) { cur = (i + real.length) % real.length; img.classList.remove('in'); img.src = real[cur].src; img.alt = real[cur].alt; cap.textContent = `${cur + 1} / ${real.length}`; requestAnimationFrame(() => img.classList.add('in')); }
  function open(i) { lastFocus = document.activeElement; lb.hidden = false; document.body.classList.add('locked'); show(i); lb.querySelector('.lb-x').focus(); }
  function close() { lb.hidden = true; document.body.classList.remove('locked'); lastFocus && lastFocus.focus(); }
  grid.addEventListener('click', e => { const b = e.target.closest('.g-item[data-i]'); if (b) open(+b.dataset.i); });
  lb.querySelector('.lb-x').onclick = close; lb.querySelector('.lb-p').onclick = () => show(cur - 1); lb.querySelector('.lb-n').onclick = () => show(cur + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => { if (lb.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let sx = 0; lb.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1)); });
})();
