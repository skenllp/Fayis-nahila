'use strict';
(() => {
  const target = new Date(window.SITE.weddingDate).getTime();
  const el = { d: cdD, h: cdH, m: cdM, s: cdS }, msg = document.getElementById('cdMsg'), box = document.getElementById('cd');
  const p = n => String(n).padStart(2, '0');
  const set = (e, v) => { v = String(v); if (e.textContent !== v) { e.textContent = v; e.classList.remove('tick'); void e.offsetWidth; e.classList.add('tick'); } };
  function tick() {
    const t = target - Date.now();
    if (t <= 0) { box.hidden = true; msg.hidden = false; msg.textContent = 'Alhamdulillah — today we celebrate. Thank you for your duas.'; clearInterval(id); return; }
    set(el.d, Math.floor(t / 864e5)); set(el.h, p(Math.floor(t % 864e5 / 36e5)));
    set(el.m, p(Math.floor(t % 36e5 / 6e4))); set(el.s, p(Math.floor(t % 6e4 / 1e3)));
  }
  const id = setInterval(tick, 1000); tick();
})();
