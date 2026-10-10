'use strict';
(() => {
  const f = document.getElementById('rsvpForm'), st = document.getElementById('rsvpStatus'), btn = f.querySelector('button');
  const set = (m, k) => { st.textContent = m; st.className = 'status ' + (k || ''); };
  f.addEventListener('submit', async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)); d.name = (d.name || '').trim(); d.guests = +d.guests || 0;
    if (!d.name) return set('Please enter your name.', 'err');
    if (!d.attending) return set('Please choose attending or not attending.', 'err');
    if (d.attending === 'yes' && (d.guests < 1 || d.guests > 10)) return set('Number of guests must be between 1 and 10.', 'err');
    const url = window.SITE.rsvpEndpoint;
    if (!url) return set('RSVP is not connected yet, so your response was not sent. Please contact the family directly.', 'err');
    btn.disabled = true; set('Sending…');
    try {
      const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ ...d, sentAt: new Date().toISOString() }) });
      if (!r.ok) throw new Error(r.status);
      const j = await r.json().catch(() => null);          // the Apps Script replies {"ok":true} only after the row is written
      if (!j || j.ok !== true) throw new Error('not saved');
      set('Thank you, ' + d.name + '. Your RSVP has been received.', 'ok'); f.reset(); f.guests.value = 1;
    } catch (err) { set('Your RSVP could not be sent. Check your connection and try again.', 'err'); }
    btn.disabled = false;
  });
})();
