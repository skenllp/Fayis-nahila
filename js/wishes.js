'use strict';
/* Wishes wall — Firebase Firestore via REST (no SDK). Config: SITE.firebase {apiKey, projectId, collection}.
   Guests can only CREATE unapproved wishes; you approve by setting approved = true in the Firebase console. */
(() => {
  const f = document.getElementById('wishForm'), st = document.getElementById('wishStatus'), list = document.getElementById('wishList'), btn = f.querySelector('button');
  const fb = window.SITE.firebase || {}, ready = !!(fb.apiKey && fb.projectId), col = fb.collection || 'wishes';
  const base = () => `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(fb.projectId)}/databases/(default)/documents`;
  const key = () => `?key=${encodeURIComponent(fb.apiKey)}`;
  const set = (m, k) => { st.textContent = m; st.className = 'status ' + (k || ''); };
  const e = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const note = t => { list.innerHTML = `<p class="empty">${t}</p>`; };

  async function load() {
    if (!ready) return note('Wishes are not connected yet. Messages will appear here once Firebase is set up.');
    note('Loading blessings…');
    try {
      const r = await fetch(`${base()}:runQuery${key()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        structuredQuery: { from: [{ collectionId: col }], where: { fieldFilter: { field: { fieldPath: 'approved' }, op: 'EQUAL', value: { booleanValue: true } } }, limit: 60 } }) });
      if (!r.ok) throw new Error(r.status);
      const rows = (await r.json()).filter(x => x.document).map(x => x.document.fields || {})
        .map(d => ({ name: d.name?.stringValue || 'A guest', message: d.message?.stringValue || '', at: d.createdAt?.timestampValue || '' }))
        .filter(w => w.message).sort((a, b) => b.at.localeCompare(a.at));
      if (!rows.length) return note('No blessings yet — be the first to leave one.');
      list.innerHTML = rows.map(w => `<article class="wish"><p>${e(w.message)}</p><b>${e(w.name)}</b></article>`).join('');
    } catch (x) { note('Blessings could not be loaded right now. Please refresh to try again.'); }
  }

  f.addEventListener('submit', async ev => {
    ev.preventDefault(); const d = Object.fromEntries(new FormData(f)); d.name = d.name.trim(); d.message = d.message.trim();
    if (!d.name || !d.message) return set('Please enter your name and a message.', 'err');
    if (!ready) return set('Wishes are not connected yet, so your message was not sent.', 'err');
    btn.disabled = true; set('Sending…');
    try {
      const r = await fetch(`${base()}/${encodeURIComponent(col)}${key()}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: {
        name: { stringValue: d.name }, message: { stringValue: d.message }, approved: { booleanValue: false }, createdAt: { timestampValue: new Date().toISOString() } } }) });
      if (!r.ok) throw new Error(r.status);
      set('Thank you. Your blessing was saved and will appear here once approved.', 'ok'); f.reset();
    } catch (x) { set('Your message could not be saved. Please try again in a moment.', 'err'); }
    btn.disabled = false;
  });
  load();
})();
