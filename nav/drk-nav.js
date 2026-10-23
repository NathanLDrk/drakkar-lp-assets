/* Nav Drakkar (composant New__nav-V2) : fond au scroll, méga-menus, menu mobile. */
(() => {
  const nav = document.querySelector('[data-drk=nav]');
  if (!nav || nav.dataset.drkReady) return;
  nav.dataset.drkReady = '1';
  const $ = s => nav.querySelector(s), $$ = s => [...nav.querySelectorAll(s)];
  const coarse = matchMedia('(pointer: coarse)').matches;
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const triggers = $$('[data-mega]');
  let closeT;
  const closeAll = () => { triggers.forEach(b => { b.classList.remove('is-open'); b.setAttribute('aria-expanded', 'false'); $('#' + b.dataset.mega).classList.remove('is-open'); }); nav.classList.toggle('is-menu', document.body.classList.contains('drk-menu-open')); };
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
  const setMenu = o => { document.body.classList.toggle('drk-menu-open', o); nav.classList.toggle('is-menu', o); burger && burger.setAttribute('aria-expanded', String(o)); };
  burger && burger.addEventListener('click', e => { e.preventDefault(); closeAll(); setMenu(!document.body.classList.contains('drk-menu-open')); });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); setMenu(false); } });
  matchMedia('(min-width: 992px)').addEventListener('change', e => e.matches && setMenu(false));
  $$('.drk-mnav a, .drk-mega a').forEach(a => a.addEventListener('click', () => { setMenu(false); closeAll(); }));
})();
