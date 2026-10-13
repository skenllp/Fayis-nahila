'use strict';
const C = window.SITE;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const maps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

const ICONS = {
  family: '<path d="M8 22V14l10-7 10 7v8"/><circle cx="14" cy="18" r="1.8"/><circle cx="22" cy="18" r="1.8"/><path d="M11.5 27v-5h5v5M19.5 27v-5h5v5"/>',
  rings: '<circle cx="14" cy="22" r="6.5"/><circle cx="22" cy="22" r="6.5"/><path d="M15 11l3-4 3 4-3 4z"/>',
  book: '<path d="M18 13c-3-2-7-2.500-10-1.500v13c3-1 7-.5 10 1.500 3-2 7-2.500 10-1.500v-13C25 10.500 21 11 18 13z"/><path d="M18 13v13"/>',
  canopy: '<path d="M8 28V12M28 28V12M8 12c4 3 6 0 10 3 4-3 6 0 10-3M8 28h20M18 15v13"/><circle cx="8" cy="10" r="2"/><circle cx="28" cy="10" r="2"/>'
};

function renderContent() {
  $('#coupleCards').innerHTML = [C.groom, C.bride].map(p => `
    <article class="pcard reveal">
      <div class="pcard-photo${p.fullPhoto ? ' pcard-photo--full' : ''}"><img src="${esc(p.photo)}" alt="${esc(p.display)}" loading="lazy"${p.crop ? ` style="--zx:${esc(p.crop.x)};--zy:${esc(p.crop.y)};--zs:${p.crop.scale}"` : ''}></div>
      <p class="role">${esc(p.role)}</p>
      <h3>${esc(p.name)}</h3>
      <dl><dt>Parents</dt><dd>${esc(p.parents)}</dd><dt>Siblings</dt><dd>${esc(p.siblings)}</dd><dt>Address</dt><dd>${esc(p.address)}</dd></dl>
    </article>`).join('');

  $('#storyTrack').innerHTML = C.story.map((s, i) => {
    const no = String(i + 1).padStart(2, '0');
    const media = s.full
      ? `<img class="story-full" src="${esc(s.full)}" alt="${esc([s.title, s.date, ...s.lines].filter(Boolean).join('. '))}" loading="lazy">`
      : `<div class="story-natural"><img src="${esc(s.photo)}" alt="${esc(s.photoAlt || s.title)}" loading="lazy"></div>`;
    const lines = s.full ? '' : s.lines.map(l => `<p>${esc(l)}</p>`).join('');
    return `<article class="slide" role="group" aria-roledescription="slide" aria-label="Chapter ${no}: ${esc(s.title)}">
      <div class="slide-media">${media}</div>
      <div class="slide-text"><p class="chap-no">Chapter ${no}</p><h3>${esc(s.title)}</h3>${s.date ? `<p class="chap-date">${esc(s.date)}</p>` : ''}${lines}</div></article>`;
  }).join('');
  $('#slDots').innerHTML = C.story.map((s, i) => `<button type="button" role="tab" aria-label="Chapter ${i + 1}: ${esc(s.title)}" data-i="${i}"></button>`).join('');

  $('#tl').innerHTML = C.timeline.map(t => `
    <li class="tl-item reveal"><span class="tl-ic"><svg viewBox="0 0 36 36" fill="none" stroke="#B99762" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICONS[t.icon]}</svg></span>
      <div><h3>${esc(t.title)}</h3><p class="tl-date">${esc(t.date)}</p>${t.place ? `<p class="tl-place">${esc(t.place)}</p>` : ''}<p>${esc(t.text)}</p></div></li>`).join('');

  $('#eventCards').innerHTML = C.events.map(e => `
    <article class="ecard reveal"><h3>${esc(e.title)}</h3><div class="orn"><i></i></div>
      <p class="e-day">${esc(e.day)}</p><p class="e-time">${esc(e.time)}</p><p class="e-venue">${esc(e.venue)}</p><p>${esc(e.place)}</p>
      <a class="btn btn-ghost" href="${maps(e.mapQuery)}" target="_blank" rel="noopener">Get directions</a></article>`).join('');

  const f = C.family;
  $('#familyBox').innerHTML = `<h3>${esc(f.hosts)}</h3><p>${f.address.map(esc).join('<br>')}</p>
    <p><a class="tel" href="tel:+91${esc(f.phone)}">Mob: ${esc(f.phone)}</a></p>
    <div class="orn"><i></i></div><p class="spaced">With Best Compliments</p><p class="comp">${esc(f.compliments)}</p>`;
}

function initReveal() {
  const els = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  els.forEach(e => io.observe(e));
}

function initNav() {
  const btn = $('#menuBtn'), nav = $('#nav'), links = $$('#navLinks a');
  btn.addEventListener('click', () => { const o = nav.classList.toggle('open'); btn.setAttribute('aria-expanded', o); });
  links.forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return; e.preventDefault();
    nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
    t.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }));
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { links.forEach(l => l.classList.remove('active')); map.get(e.target.id)?.classList.add('active'); }
  }), { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); s && io.observe(s); });
}

function initParallax() {
  if (reduceMotion) return;
  const bg = $('#home .hero-bg'); let tick = false;
  addEventListener('scroll', () => { if (tick) return; tick = true; requestAnimationFrame(() => {
    if (scrollY < innerHeight * 1.2) bg.style.transform = `translate3d(0,${scrollY * .18}px,0)`; tick = false; }); }, { passive: true });
}

function initSlider() {
  const track = $('#storyTrack'), slides = $$('.slide', track), dots = $$('#slDots button'), prev = $('#slPrev'), next = $('#slNext');
  if (!slides.length) return;
  let idx = 0, tick = false;
  const go = i => { i = Math.max(0, Math.min(slides.length - 1, i)); track.scrollTo({ left: slides[i].offsetLeft - track.offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const update = () => {
    const w = track.clientWidth || 1;
    slides.forEach((sl, i) => { const p = Math.max(-1, Math.min(1, (sl.offsetLeft - track.offsetLeft - track.scrollLeft) / w)); sl.style.setProperty('--p', p.toFixed(3)); });
    idx = Math.round(track.scrollLeft / w);
    dots.forEach((d, i) => { d.classList.toggle('on', i === idx); d.setAttribute('aria-selected', i === idx); });
    prev.disabled = idx === 0; next.disabled = idx === slides.length - 1; tick = false;
  };
  track.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  prev.addEventListener('click', () => go(idx - 1)); next.addEventListener('click', () => go(idx + 1));
  dots.forEach(d => d.addEventListener('click', () => go(+d.dataset.i)));
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1); } });
  addEventListener('resize', () => go(idx));
  update();
}

function initPetals() {
  if (reduceMotion) return; const box = $('#petals'); const n = innerWidth < 600 ? 8 : 14;
  for (let i = 0; i < n; i++) { const p = document.createElement('i');
    p.style.cssText = `left:${Math.random() * 100}%;animation-duration:${11 + Math.random() * 10}s;animation-delay:${-Math.random() * 18}s;--s:${.6 + Math.random() * .7};--dx:${-60 + Math.random() * 120}px`;
    box.appendChild(p); }
}

document.addEventListener('DOMContentLoaded', () => {
  $('#heroPhoto').src = C.heroPhoto;
  renderContent(); initReveal(); initNav(); initParallax(); initSlider(); initPetals();
});
