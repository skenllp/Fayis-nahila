'use strict';
(() => {
  const g = document.getElementById('calGrid'), Y = 2026, M = 10, HI = 8;
  const first = new Date(Y, M, 1).getDay(), days = new Date(Y, M + 1, 0).getDate();
  let h = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => `<span class="dow" role="columnheader">${d}</span>`).join('');
  for (let i = 0; i < first; i++) h += '<span></span>';
  for (let d = 1; d <= days; d++) {
    h += d === HI
      ? `<span class="day hi" role="gridcell" aria-label="Sunday, 8 November 2026 — wedding day"><svg viewBox="0 0 60 56" aria-hidden="true"><path pathLength="1" d="M30 52C12 38 4 28 4 18 4 10 10 4 18 4c5 0 9 2 12 7 3-5 7-7 12-7 8 0 14 6 14 14 0 10-8 20-26 34z"/></svg>${d}</span>`
      : `<span class="day" role="gridcell">${d}</span>`;
  }
  g.innerHTML = h;
})();
