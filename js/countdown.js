'use strict';
(() => {
  const target = new Date(window.SITE.weddingDate).getTime();
  const el = { d: cdD, h: cdH, m: cdM, s: cdS }, msg = document.getElementById('cdMsg'), box = document.getElementById('cd');
  const p = n => String(n).padStart(2, '0');
  function tick() {
    const t = target - Date.now();
    if (t <= 0) { box.hidden = true; msg.hidden = false; msg.textContent = 'Alhamdulillah — today we celebrate. Thank you for your duas.'; clearInterval(id); return; }
    el.d.textContent = Math.floor(t / 864e5); el.h.textContent = p(Math.floor(t % 864e5 / 36e5));
    el.m.textContent = p(Math.floor(t % 36e5 / 6e4)); el.s.textContent = p(Math.floor(t % 6e4 / 1e3));
  }
  const id = setInterval(tick, 1000); tick();
})();
