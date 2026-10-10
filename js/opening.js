'use strict';
(() => {
  const op = document.getElementById('opening'), body = document.body;
  function close(withMusic) {
    if (!op || op.classList.contains('gone')) return;
    op.classList.add('opening');
    body.classList.remove('locked');
    if (withMusic && window.RNMusic) window.RNMusic.start();
    setTimeout(() => op.classList.add('gone'), matchMedia('(prefers-reduced-motion: reduce)').matches ? 50 : 1500);
    window.scrollTo(0, 0);
  }
  document.getElementById('openBtn').addEventListener('click', () => close(true));
  document.getElementById('skipBtn').addEventListener('click', () => close(false));
})();
