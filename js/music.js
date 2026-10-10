'use strict';
(() => {
  const a = document.getElementById('bgm'), b = document.getElementById('musicBtn');
  let loaded = false;
  function ui() { const p = !a.paused; b.classList.toggle('playing', p); b.setAttribute('aria-pressed', p); b.setAttribute('aria-label', p ? 'Pause music' : 'Play music'); }
  function load() { if (!loaded) { a.src = window.SITE.music; a.volume = .5; loaded = true; } }
  window.RNMusic = { start() { b.hidden = false; load(); a.play().then(ui).catch(ui); } };
  b.addEventListener('click', () => { load(); a.paused ? a.play().catch(() => {}) : a.pause(); });
  a.addEventListener('play', ui); a.addEventListener('pause', ui);
  setTimeout(() => { b.hidden = false; }, 0); // control is available even after "Skip intro"
})();
