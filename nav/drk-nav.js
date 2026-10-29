/* Nav Drakkar (composant New__nav-V2) : masquage au scroll, ton clair / sombre, menus déroulants, menu mobile. */
(() => {
  const nav = document.querySelector('[data-drk=nav]');
  if (!nav || nav.dataset.drkReady) return;
  nav.dataset.drkReady = '1';
  const $ = s => nav.querySelector(s), $$ = s => [...nav.querySelectorAll(s)];
  const coarse = matchMedia('(pointer: coarse)').matches;
  /* Ton : la nav lit le fond qui passe derrière elle et bascule clair / sombre (drk-tone-light / drk-tone-dark) */
  const root = nav.closest('[data-wf--new__nav-v2--variant]') || nav;
  const skip = e => root.contains(e) || e.closest('[data-drakkar-chat]');
  const toneAt = (x, y) => {
    for (const e of document.elementsFromPoint(x, y)) {
      if (skip(e)) continue;
      if (e !== document.body && e !== document.documentElement && e.getBoundingClientRect().width < innerWidth * .85) continue; // cartes, vignettes : on cherche le fond de la section
      if (/^(CANVAS|VIDEO|IMG|IFRAME|PICTURE)$/.test(e.tagName)) return 0;
      const cs = getComputedStyle(e), c = cs.backgroundColor.match(/[\d.]+/g);
      if (c && (c.length < 4 || +c[3] > .5)) return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] > 150 ? 1 : 0;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return 0;
    }
    return 1;
  };
  let toneRaf = 0;
  const tone = () => {
    toneRaf = 0;
    if (nav.classList.contains('is-menu')) return; // menu ouvert : on garde le ton courant
    const y = Math.min(nav.offsetHeight, 64) / 2, w = innerWidth;
    const light = toneAt(w * .12, y) + toneAt(w * .5, y) + toneAt(w * .88, y) >= 2;
    nav.classList.toggle('drk-tone-light', light);
    nav.classList.toggle('drk-tone-dark', !light);
  };
  const queueTone = () => { if (!toneRaf) toneRaf = requestAnimationFrame(tone); };
  /* Masquage : la nav se cache en descendant et revient dès qu'on remonte (jamais quand un menu est ouvert) */
  let lastY = scrollY;
  const hide = () => {
    const y = scrollY, h = nav.offsetHeight;
    if (nav.classList.contains('is-menu') || nav.matches(':focus-within') || y <= h) nav.classList.remove('is-hidden');
    else if (y > lastY + 4) nav.classList.add('is-hidden');
    else if (y < lastY - 4) nav.classList.remove('is-hidden');
    lastY = y;
  };
  const onScroll = () => { nav.classList.toggle('is-scrolled', scrollY > 20); hide(); queueTone(); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  addEventListener('resize', queueTone); addEventListener('load', queueTone); setTimeout(queueTone, 400);

  const triggers = $$('[data-mega]');
  let closeT;
  const closeAll = () => { triggers.forEach(b => { b.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); $('#' + b.dataset.mega).classList.remove('is-open'); }); nav.classList.toggle('is-menu', document.body.classList.contains('drk-menu-open')); queueTone(); };
  const open = b => { clearTimeout(closeT); closeAll(); b.classList.add('is-open'); b.setAttribute('aria-expanded', 'true'); $('#' + b.dataset.mega).classList.add('is-open'); nav.classList.add('is-menu'); };
  triggers.forEach(b => {
    const m = $('#' + b.dataset.mega);
    b.setAttribute('aria-haspopup', 'true'); b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', e => { e.preventDefault(); b.classList.contains('is-open') ? closeAll() : open(b); });
    if (!coarse) {
      b.addEventListener('mouseenter', () => open(b));
      [b, m].forEach(el => el.addEventListener('mouseleave', () => { closeT = setTimeout(closeAll, 220); }));
      m.addEventListener('mouseenter', () => clearTimeout(closeT));
    }
  });
  document.addEventListener('click', e => { if (!nav.contains(e.target)) closeAll(); });

  const burger = $('[data-drk=burger]');
  const setMenu = o => { document.body.classList.toggle('drk-menu-open', o); nav.classList.toggle('is-menu', o); burger && burger.setAttribute('aria-expanded', String(o)); queueTone(); };
  burger && burger.addEventListener('click', e => { e.preventDefault(); closeAll(); setMenu(!document.body.classList.contains('drk-menu-open')); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); setMenu(false); } });
  matchMedia('(min-width: 992px)').addEventListener('change', e => e.matches && setMenu(false));
  $$('.drk-mnav a, .drk-mega a').forEach(a => a.addEventListener('click', () => { setMenu(false); closeAll(); }));
})();
