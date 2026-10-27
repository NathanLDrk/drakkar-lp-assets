/* Drakkar, pages Ads : nav qui se cache au scroll et suit le fond, avis en défilement continu, prise de RDV Cal.com en popup.
   Éléments natifs Webflow ; ce script ne gère que les états (classes is-*) et injecte leurs styles. */
(() => {
const css = `
.lp-nav{transition:transform .55s cubic-bezier(.32,.72,0,1),background-color .4s ease,box-shadow .4s ease,backdrop-filter .4s ease}
.lp-nav.is-hidden{transform:translateY(-110%)}
.lp-nav.is-scrolled{background-color:rgba(255,255,255,.78);-webkit-backdrop-filter:saturate(1.6) blur(14px);backdrop-filter:saturate(1.6) blur(14px);box-shadow:0 1px 0 rgba(17,17,19,.06)}
.lp-nav.is-dark.is-scrolled{background-color:rgba(17,17,19,.62);box-shadow:0 1px 0 rgba(255,255,255,.06)}
.lp-nav .lp-nav-link,.lp-nav .lp-nav-logo-img{transition:color .35s ease,opacity .35s ease}
.lp-nav.is-dark .lp-nav-link{color:#fff}
.lp-nav.is-dark .lp-nav-link:hover{color:rgba(255,255,255,.7)}
.lp-nav .lp-nav-logo-img.lp-logo-light{display:none}
.lp-nav.is-dark .lp-nav-logo-img.lp-logo-light{display:block}
.lp-nav.is-dark .lp-nav-logo-img.lp-logo-dark{display:none}
.lp-nav.is-dark .lp-nav-cta{background-color:#fff;color:#111113}
.rv-row{overflow:hidden;-webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.rv-track{animation:rvScroll var(--rv-dur,60s) linear infinite;will-change:transform}
.rv-row.is-reverse .rv-track{animation-direction:reverse}
.rv-row:hover .rv-track{animation-play-state:paused}
@keyframes rvScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.rv-track{animation:none}.lp-nav{transition:none}}
`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

/* 1. Nav : cachée en descendant, visible en remontant, ton clair / sombre selon le fond derrière elle */
const nav = document.querySelector('[data-drk=lp-nav]');
if (nav) {
  const toneAt = (x, y) => {
    for (const e of document.elementsFromPoint(x, y)) {
      if (nav.contains(e)) continue;
      if (e !== document.body && e !== document.documentElement && e.getBoundingClientRect().width < innerWidth * .85) continue;
      if (/^(CANVAS|VIDEO|IMG|IFRAME|PICTURE|SVG)$/i.test(e.tagName)) return 0;
      const cs = getComputedStyle(e), c = cs.backgroundColor.match(/[\d.]+/g);
      if (c && (c.length < 4 || +c[3] > .5)) return .2126 * c[0] + .7152 * c[1] + .0722 * c[2] > 150 ? 1 : 0;
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return 0;
    }
    return 1;
  };
  let lastY = scrollY, raf = 0;
  const update = () => {
    raf = 0;
    const y = scrollY, h = nav.offsetHeight;
    nav.classList.toggle('is-scrolled', y > 20);
    if (y > h + 40 && y > lastY + 4) nav.classList.add('is-hidden');
    else if (y < lastY - 4 || y <= h) nav.classList.remove('is-hidden');
    lastY = y;
    const my = Math.min(h, 72) / 2, w = innerWidth;
    nav.classList.toggle('is-dark', toneAt(w * .12, my) + toneAt(w * .5, my) + toneAt(w * .88, my) < 2);
  };
  const q = () => { if (!raf) raf = requestAnimationFrame(update); };
  addEventListener('scroll', q, { passive: true }); addEventListener('resize', q); addEventListener('load', q); update(); setTimeout(q, 400);
  nav.addEventListener('focusin', () => nav.classList.remove('is-hidden'));
}

/* 2. Avis : chaque rangée est dupliquée pour un défilement sans couture */
document.querySelectorAll('.rv-row[data-rv=reverse]').forEach(r => r.classList.add('is-reverse'));
document.querySelectorAll('.rv-track').forEach(t => {
  if (t.dataset.rvReady) return; t.dataset.rvReady = '1';
  [...t.children].forEach(c => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); t.appendChild(k); });
  t.style.setProperty('--rv-dur', Math.max(40, t.children.length * 6) + 's');
});

/* 3. Cal.com : tout élément [data-cal-link] ouvre le calendrier en popup, avec la page et les UTM en métadonnées */
const calEls = document.querySelectorAll('[data-cal-link]'), calInline = document.querySelectorAll('[data-cal-inline]');
if (calEls.length || calInline.length) {
  (function (C, A, L) { const p = (a, ar) => a.q.push(ar); const d = C.document; C.Cal = C.Cal || function () { const cal = C.Cal, ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement('script')).src = A; cal.loaded = true; } if (ar[0] === L) { const api = function () { p(api, arguments); }; const ns = ar[1]; api.q = api.q || []; if (typeof ns === 'string') { cal.ns[ns] = cal.ns[ns] || api; p(cal.ns[ns], ar); p(cal, ['initNamespace', ns]); } else p(cal, ar); return; } p(cal, ar); }; })(window, 'https://app.cal.com/embed/embed.js', 'init');
  const u = new URLSearchParams(location.search), page = location.pathname.split('/').filter(Boolean).pop() || 'home';
  const meta = { layout: 'month_view', 'metadata[landing_page]': page };
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid'].forEach(k => { if (u.get(k)) meta['metadata[' + k + ']'] = u.get(k); });
  const nss = new Set();
  calEls.forEach(el => {
    const ns = el.dataset.calNamespace || 'projet'; el.dataset.calNamespace = ns; nss.add(ns);
    el.dataset.calConfig = JSON.stringify(Object.assign({}, meta, JSON.parse(el.dataset.calConfig || '{}')));
    el.addEventListener('click', e => e.preventDefault());
  });
  nss.add('projet');
  /* conversion : chaque réservation pousse un événement GTM (à brancher sur la conversion Google Ads) */
  const booked = ns => () => { (window.dataLayer = window.dataLayer || []).push({ event: 'cal_booking_success', cal_namespace: ns, landing_page: page }); };
  const track = ns => { ['bookingSuccessful', 'bookingSuccessfulV2'].forEach(a => Cal.ns[ns]('on', { action: a, callback: booked(ns) })); };
  nss.forEach(ns => { Cal('init', ns, { origin: 'https://cal.com' }); Cal.ns[ns]('ui', { hideEventTypeDetails: false, layout: 'month_view' }); track(ns); });
  /* calendrier intégré dans la page : chargé seulement à l'approche de la section */
  calInline.forEach((el, i) => {
    const ns = 'inline' + i;
    new IntersectionObserver((es, io) => {
      if (!es[0].isIntersecting) return; io.disconnect();
      Cal('init', ns, { origin: 'https://cal.com' });
      Cal.ns[ns]('inline', { elementOrSelector: el, calLink: el.dataset.calInline, config: meta });
      Cal.ns[ns]('ui', { hideEventTypeDetails: false, layout: 'month_view' }); track(ns);
    }, { rootMargin: '600px 0px' }).observe(el);
  });
}
})();
