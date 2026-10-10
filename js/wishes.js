'use strict';
/* Wishes wall — Firebase Realtime Database via REST (no SDK).
   Config: SITE.firebase { databaseURL, apiKey, collection }
   All wishes are auto-approved and shown instantly. */
(() => {
  const f    = document.getElementById('wishForm');
  const st   = document.getElementById('wishStatus');
  const list = document.getElementById('wishList');
  const btn  = f.querySelector('button');

  const fb    = window.SITE.firebase || {};
  const ready = !!(fb.databaseURL && fb.apiKey);
  const col   = fb.collection || 'wishes';

  const set  = (m, k) => { st.textContent = m; st.className = 'status ' + (k || ''); };
  const esc  = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const note = t => { list.innerHTML = `<p class="empty">${t}</p>`; };

  async function load() {
    if (!ready) return note('Wishes are not connected yet. Messages will appear here once Firebase is set up.');
    note('Loading blessings…');
    try {
      const url = `${fb.databaseURL}/${encodeURIComponent(col)}.json?orderBy="createdAt"&limitToLast=60`;
      const r   = await fetch(url);
      if (!r.ok) throw new Error(r.status);
      const data = await r.json();

      if (!data) return note('No blessings yet — be the first to leave one.');

      const rows = Object.values(data)
        .filter(w => w.message)
        .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));

      if (!rows.length) return note('No blessings yet — be the first to leave one.');

      list.innerHTML = rows
        .map(w => `<article class="wish"><p>${esc(w.message)}</p><b>${esc(w.name || 'A guest')}</b></article>`)
        .join('');
    } catch (x) {
      note('Blessings could not be loaded right now. Please refresh to try again.');
    }
  }

  f.addEventListener('submit', async ev => {
    ev.preventDefault();
    const d = Object.fromEntries(new FormData(f));
    d.name    = (d.name    || '').trim();
    d.message = (d.message || '').trim();
    if (!d.name || !d.message) return set('Please enter your name and a message.', 'err');
    if (!ready) return set('Wishes are not connected yet, so your message was not sent.', 'err');

    btn.disabled = true; set('Sending…');
    try {
      const r = await fetch(
        `${fb.databaseURL}/${encodeURIComponent(col)}.json?auth=${encodeURIComponent(fb.apiKey)}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({
            name:      d.name,
            message:   d.message,
            createdAt: new Date().toISOString()
          })
        }
      );
      if (!r.ok) throw new Error(r.status);
      set('Thank you, ' + d.name + '. Your blessing has been shared!', 'ok');
      f.reset();
      load(); // refresh the list immediately
    } catch (x) {
      set('Your message could not be saved. Please try again in a moment.', 'err');
    }
    btn.disabled = false;
  });

  load();
})();
