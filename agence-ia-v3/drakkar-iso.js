/* Drakkar IA : illustrations isométriques des cards Agence IA. Source : webflow-scripts/lp-ads/offre/agence-ia-v3/pixel/iso.js */
(() => { const st = document.createElement('style'); st.textContent = '.w-embed:has(> .drk-iso) { width: 100%; } .drk-iso { position: relative; width: 100%; aspect-ratio: 16 / 10; border-radius: 20px; overflow: hidden; background: radial-gradient(120% 90% at 50% 35%, #232327 0%, #141416 70%); --drk-accent: #3d7bff; } .drk-iso svg { position: absolute; inset: 0; width: 100%; height: 100%; display: block; } .w-embed:has(> .drk-iso[data-fill]) { margin-top: 24px; } @media (min-width: 992px) { .w-embed:has(> .drk-iso[data-fill]) { flex: 1 1 auto; display: flex; margin-top: 32px; min-height: 0; } .drk-iso[data-fill] { aspect-ratio: auto; flex: 1 1 auto; min-height: 360px; } }'; document.head.appendChild(st); })();
/* Drakkar IA : illustrations isométriques animées des cards.
   <div class="drk-iso" data-scene="agent|outils|produit|formation"></div>
   SVG redessiné à ~30 i/s uniquement quand le bloc est visible. Couleur d'accent : --drk-accent. */
(() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = Math.cos(Math.PI / 6), S = .5;
const P = (x, y, z = 0) => [(x - y) * C, (x + y) * S - z];
const pts = a => a.map(p => P(...p).map(n => n.toFixed(1)).join(',')).join(' ');
const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;
const ez = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
const seg = (t, a, b) => ez((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;

/* palette : blancs, gris, noir doux + une touche d'accent */
const T = {
  light: ['#f7f7f9', '#e2e2e7', '#c9c9d0'],
  mid:   ['#d6d6dc', '#bdbdc5', '#a3a3ad'],
  dark:  ['#3a3a40', '#2c2c31', '#232327'],
  slab:  ['#2b2b30', '#1f1f23', '#18181b'],
  ink:   ['#26262b', '#1d1d21', '#161619'],
};
const ACC = 'var(--drk-accent, #3d7bff)';

/* primitives (renvoient du SVG en chaîne) */
function box(x, y, z, w, d, h, tone = T.light, o = 1) {
  const [t, l, r] = tone;
  return `<g opacity="${o}">` +
    `<polygon fill="${l}" points="${pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])}"/>` +
    `<polygon fill="${r}" points="${pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])}"/>` +
    `<polygon fill="${t}" points="${pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])}"/></g>`;
}
const top = (x, y, z, w, d, fill, o = 1) => `<polygon opacity="${o}" fill="${fill}" points="${pts([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])}"/>`;
const front = (x, y, z, w, h, fill, o = 1) => `<polygon opacity="${o}" fill="${fill}" points="${pts([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]])}"/>`; // plan y constant
const shadow = (x, y, w, d, o = .35) => `<polygon filter="url(#drkBlur)" fill="#000" opacity="${o}" points="${pts([[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]])}"/>`;
const lineTop = (x1, y1, x2, y2, z, stroke, sw = 2, o = 1) => { const a = P(x1, y1, z), b = P(x2, y2, z); return `<line opacity="${o}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`; };
/* texte posé sur une face : 'top' (sur le dessus), 'y' (face avant gauche), 'x' (face avant droite) */
function label(txt, x, y, z, face, size = 9, fill = '#55555c', o = 1, weight = 500) {
  const [ox, oy] = P(x, y, z);
  const m = face === 'top' ? `${C},${S},${-C},${S}` : face === 'y' ? `${C},${S},0,1` : `${C},${-S},0,1`;
  return `<text opacity="${o}" transform="matrix(${m},${ox.toFixed(1)},${oy.toFixed(1)})" font-family="Urbanist,system-ui,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${txt}</text>`;
}
function cyl(x, y, z, r, h, tone = T.light) { // cylindre vertical (corps de personnage, pastille)
  const [cx, cy] = P(x, y, z), rx = r * 1.2247, ry = r * .7071;
  return `<path fill="${tone[2]}" d="M${cx - rx},${cy - h} L${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} L${cx + rx},${cy - h} Z"/>` +
    `<path fill="${tone[1]}" d="M${cx - rx},${cy - h} L${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx},${cy + ry} L${cx},${cy + ry - h} A${rx},${ry} 0 0 1 ${cx - rx},${cy - h} Z"/>` +
    `<ellipse fill="${tone[0]}" cx="${cx}" cy="${cy - h}" rx="${rx}" ry="${ry}"/>`;
}
const sphere = (x, y, z, r, fill) => { const [cx, cy] = P(x, y, z); return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`; };
const envelopeTop = (x, y, z, w, d, o = 1) => box(x, y, z, w, d, 2.5, T.light, o) +
  lineTop(x + 2, y + 2, x + w * .5, y + d * .55, z + 2.6, '#b5b5bd', 1.4, o) + lineTop(x + w - 2, y + 2, x + w * .5, y + d * .55, z + 2.6, '#b5b5bd', 1.4, o);

/* ---------- 1. Agent IA : un e-mail arrive, l'assistant le lit, propose la réponse, la range dans le CRM ---------- */
function agent(t) {
  const L = 12.5; t = t % L;
  const fade = 1 - seg(t, L - .7, L);
  let s = box(-10, -10, 0, 330, 190, 10, T.slab);
  // bac de réception
  s += box(10, 70, 10, 66, 52, 6, T.mid) + label('Boîte de réception', 12, 122, 13, 'y', 7, '#5a5a62');
  // poste de l'assistant
  s += box(108, 60, 10, 74, 66, 12, T.dark) + top(114, 66, 22.1, 62, 54, '#151518');
  const reading = t > 2.2 && t < 3.8;
  s += top(114, 66, 22.2, 62, 54, ACC, reading ? .12 + .08 * Math.sin(t * 12) : 0);
  // armoire CRM, trois tiroirs
  const cx = 222, cy = 46, cw = 64, cd = 60;
  s += box(cx, cy, 10, cw, cd, 96, T.light);
  const open = seg(t, 6.9, 7.4) * (1 - seg(t, 8.4, 8.9));
  ['Devis', 'Commande', 'Relance'].forEach((n, i) => {
    const z = 76 - i * 30, o = i === 1 ? open * 22 : 0;
    if (o > .5) s += box(cx + 6, cy + cd - 4, z, cw - 12, o + 4, 20, T.mid);
    s += front(cx + 6, cy + cd + o, z, cw - 12, 20, i === 1 && open > 0 ? '#ededf1' : '#e9e9ee');
    s += label(n, cx + 10, cy + cd + o, z + 7, 'y', 7.5, i === 1 && t > 6.5 && t < 9 ? ACC : '#6a6a72', 1, 600);
  });
  s += label('CRM', cx + cw, cy + cd - 6, 92, 'x', 8, '#8a8a92', 1, 600);
  // l'assistant : une pastille d'accent qui flotte au-dessus de son poste
  const bob = Math.sin(t * 2.4) * 3, active = t > 1.9 && t < 6.6;
  { const [ox, oy] = P(145, 93, 50 + bob); s += shadow(132, 82, 26, 22, .25) + `<circle cx="${ox}" cy="${oy}" r="${20 + (active ? 4 * Math.sin(t * 6) : 0)}" fill="${ACC}" opacity="${active ? .18 : .08}"/>` + `<g opacity="${active ? 1 : .8}">` + sphere(145, 93, 50 + bob, 10, ACC) + sphere(142.5, 90.5, 53.5 + bob, 3.6, 'rgba(255,255,255,.6)') + '</g>'; }
  // l'e-mail : tombe dans le bac, glisse vers l'assistant, puis part se ranger
  const drop = seg(t, .2, 1.1), toA = seg(t, 1.5, 2.2), toCRM = seg(t, 7.1, 7.9);
  let ex = lerp(lerp(20, 122, toA), cx + 12, toCRM), ey = lerp(lerp(78, 76, toA), cy + cd + 4, toCRM);
  let ez_ = lerp(lerp(130, 16, drop), 22, toA);
  ez_ = lerp(ez_, 46 + 10, toCRM);
  const eo = t < .2 ? 0 : 1 - seg(t, 8.1, 8.5);
  if (eo > 0) {
    s += shadow(ex, ey, 46, 34, .3 * eo * drop);
    s += envelopeTop(ex, ey, ez_, 46, 34, eo);
    if (t < 1.6) s += sphere(ex + 42, ey + 4, ez_ + 6, 3.2, ACC);
    // lecture : un trait d'accent balaie l'e-mail
    if (reading) { const k = (t - 2.2) / 1.6, yy = ey + 3 + k * 28; s += lineTop(ex + 3, yy, ex + 43, yy, ez_ + 3, ACC, 2); }
  }
  // brouillon de réponse proposé par l'assistant
  const rIn = seg(t, 3.8, 4.4), rSend = seg(t, 6.4, 7.2);
  if (rIn > 0 && rSend < 1) {
    const rx = 104 + rSend * -50, ry = 50 + rSend * -50, rz = 78 + rIn * 6 + rSend * 60, ro = rIn * (1 - rSend);
    s += shadow(rx + 10, ry + 30, 70, 48, .22 * ro);
    s += box(rx, ry, rz, 78, 54, 3, T.light, ro);
    [.78, .9, .6, .7].forEach((w, i) => { const k = seg(t, 4.3 + i * .35, 4.7 + i * .35); if (k > 0) s += lineTop(rx + 8, ry + 9 + i * 8, rx + 8 + 60 * w * k, ry + 9 + i * 8, rz + 3.2, '#b9b9c1', 2.2, ro); });
    const ok = seg(t, 5.7, 6.0);
    s += top(rx + 40, ry + 42, rz + 3.3, 30, 8, ACC, ok * ro) + label('Envoyer', rx + 44, ry + 44.5, rz + 3.4, 'top', 5.5, '#fff', ok * ro, 700);
    s += label('Réponse proposée', rx + 8, ry - 1, rz + 3.3, 'top', 6, '#8b8b93', ro, 600);
  }
  // validation : coche d'accent au-dessus du CRM
  const ck = seg(t, 8.6, 9.0) * (1 - seg(t, 11, 11.6));
  if (ck > 0) { const [kx, ky] = P(cx + cw / 2, cy + cd / 2, 130); s += `<g opacity="${ck}" transform="translate(${kx},${ky}) scale(${.7 + .3 * ck})"><circle r="13" fill="${ACC}"/><path d="M-5.5,0 L-1.5,4 L6,-4.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  return { svg: s, fade, origin: [270, 92], scale: 1 };
}

/* ---------- 2. Outils métier : une application sur mesure, en couches ---------- */
function outils(t) {
  let s = box(-10, -10, 0, 230, 200, 8, T.slab);
  const f = k => Math.sin(t * 1.3 + k) * 2.5;
  const layers = [
    { z: 26 + f(0), draw: z => { // tableau, une ligne active qui descend
      let o = box(10, 10, z, 190, 170, 4, T.light);
      const act = Math.floor(t / 1.1) % 6;
      for (let i = 0; i < 6; i++) { const y = 22 + i * 25; if (i === act) o += top(18, y - 7, z + 4.1, 174, 16, ACC, .14); o += lineTop(24, y, 24 + (i === act ? 120 : 90 + (i * 23) % 50), y, z + 4.2, i === act ? ACC : '#c3c3ca', 2.4); o += lineTop(160, y, 184, y, z + 4.2, '#d4d4da', 2.4); }
      return o; } },
    { z: 66 + f(1.4), draw: z => { // graphique : barres en volume
      let o = box(30, 30, z, 150, 130, 4, T.light, .97);
      for (let i = 0; i < 5; i++) { const h = 14 + 34 * (.5 + .5 * Math.sin(t * 1.1 + i * 1.1)); o += box(46 + i * 24, 70, z + 4, 14, 14, h, i === 3 ? [ACC, ACC, ACC] : T.mid, i === 3 ? .95 : 1); }
      return o; } },
    { z: 104 + f(2.8), draw: z => { // indicateurs
      let o = '';
      for (let i = 0; i < 3; i++) { o += box(48 + i * 42, 48, z, 34, 34, 6, i === 0 ? T.dark : T.light); o += lineTop(54 + i * 42, 58, 72 + i * 42, 58, z + 6.2, i === 0 ? ACC : '#c3c3ca', 2.4); }
      return o; } },
  ];
  layers.forEach((l, i) => { s += shadow(14 + i * 20, 14 + i * 20, 180 - i * 40, 160 - i * 40, .18); });
  layers.forEach(l => { s += l.draw(l.z); });
  return { svg: s, fade: 1, origin: [300, 70], scale: 1 };
}

/* ---------- 3. Produit à commercialiser : il sort de sa boîte et se déploie chez les clients ---------- */
function produit(t) {
  const L = 10; t = t % L;
  const fade = 1 - seg(t, L - .6, L);
  let s = box(-10, -10, 0, 280, 220, 8, T.slab);
  // clients : petits blocs disposés autour
  const spots = [[-6, 40], [190, 20], [210, 110], [20, 170], [190, 175], [100, 190], [-0, 95]];
  const up = seg(t, 1, 2.2);
  // liaisons vers les clients
  spots.forEach(([x, y], i) => { const k = seg(t, 2.6 + i * .35, 3.1 + i * .35); if (k > 0) s += lineTop(120, 105, lerp(120, x + 14, k), lerp(105, y + 14, k), 8.5, ACC, 1.6, .55); });
  spots.forEach(([x, y], i) => { const k = seg(t, 2.9 + i * .35, 3.3 + i * .35); s += box(x, y, 8, 28, 28, 18, T.light); s += top(x + 6, y + 6, 26.1, 16, 16, ACC, k); });
  // boîte ouverte
  s += box(90, 80, 8, 60, 52, 30, T.mid);
  s += top(94, 84, 38.1, 52, 44, '#18181b');
  // le produit : un écran d'application qui s'élève et flotte
  const pz = lerp(26, 64, up) + Math.sin(t * 2) * 2.5 * up;
  s += shadow(98, 90, 50, 40, .25 * up);
  s += box(96, 86, pz, 52, 42, 5, T.dark);
  s += top(100, 90, pz + 5.1, 44, 34, '#141417');
  s += top(104, 94, pz + 5.2, 16, 26, ACC, .85);
  [0, 1, 2].forEach(i => { s += lineTop(125, 97 + i * 8, 140, 97 + i * 8, pz + 5.3, '#5b5b63', 2.2); });
  return { svg: s, fade, origin: [300, 85], scale: 1 };
}

/* ---------- 4. Formation : un écran, une équipe qui valide les ateliers un par un ---------- */
function formation(t) {
  const L = 11; t = t % L;
  const fade = 1 - seg(t, L - .6, L);
  let s = box(-10, -10, 0, 260, 210, 8, T.slab);
  // écran debout au fond
  s += box(30, 6, 8, 170, 8, 92, T.dark);
  s += front(38, 14.1, 18, 154, 74, '#141417');
  [.7, .5, .82, .4].forEach((w, i) => { const k = seg(t, .4 + i * .5, .9 + i * .5); if (k > 0) { const [a, b] = [P(46, 14.2, 78 - i * 15), P(46 + 130 * w * k, 14.2, 78 - i * 15)]; s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="${i === 0 ? ACC : '#5b5b63'}" stroke-width="3" stroke-linecap="round"/>`; } });
  // équipe : 2 rangées de 3
  const seats = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) seats.push([50 + c * 58 + r * 14, 92 + r * 62]);
  seats.forEach(([x, y], i) => {
    // bureau entre la personne et l'écran : tout le monde regarde vers l'écran
    s += box(x + 2, y - 24, 8, 4, 18, 16, T.dark) + box(x + 2, y - 24, 24, 26, 20, 3, T.mid);
    s += box(x + 6, y - 15, 27, 16, 11, 1.5, T.dark); // ordinateur, écran tourné vers la personne
    s += front(x + 6, y - 15, 28.5, 16, 11, '#2c2c31') + front(x + 7.5, y - 14.95, 30, 13, 7.5, ACC, .55 + .35 * seg(t, 3 + i * .55, 3.35 + i * .55));
    s += cyl(x + 12, y, 8, 9, 24, T.light);
    const [hx, hy] = P(x + 12, y, 8 + 24 + 10); s += `<circle cx="${hx}" cy="${hy}" r="8" fill="#f2f2f5"/>`;
    const k = seg(t, 3 + i * .55, 3.35 + i * .55) * (1 - seg(t, 9.6, 10.2));
    if (k > 0) { s += `<g opacity="${k}" transform="translate(${hx + 10},${hy - 12}) scale(${.6 + .4 * k})"><circle r="6.5" fill="${ACC}"/><path d="M-2.8,0 L-.6,2.2 L3,-2.2" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></g>`; }
  });
  return { svg: s, fade, origin: [290, 60], scale: 1 };
}

const SCENES = { agent, outils, produit, formation };
const VB = [600, 375];

function mount(host) {
  const scene = SCENES[host.dataset.scene]; if (!scene) return;
  host.innerHTML = `<svg viewBox="0 0 ${VB[0]} ${VB[1]}" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs><filter id="drkBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs><g class="drk-iso-g"></g></svg>`;
  const svg = host.querySelector('svg'), g = host.querySelector('.drk-iso-g');
  // Boîte englobante de la scène sur toute l'animation, calculée une fois.
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  [.6, 2.5, 4.5, 6.5, 8.5].forEach(tt => { g.innerHTML = scene(tt).svg; const b = g.getBBox(); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.width); y1 = Math.max(y1, b.y + b.height); });
  const bw = x1 - x0, bh = y1 - y0;
  // Le viewBox suit le ratio réel du bloc : si data-fill l'étire en hauteur, la scène grandit
  // (on accepte de rogner un peu les bords du plateau, ZX) au lieu de rester petite au centre.
  let fit = '';
  const refit = () => {
    const r = host.getBoundingClientRect(); if (!r.width || !r.height) return;
    const W = VB[0], H = Math.round(VB[0] * r.height / r.width), PAD = 22;
    const ZX = host.hasAttribute('data-fill') ? 1.38 : 1;
    const k = Math.min((W - 2 * PAD) * ZX / bw, (H - 2 * PAD) / bh);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    fit = `translate(${(W - bw * k) / 2 - x0 * k},${(H - bh * k) / 2 - y0 * k}) scale(${k})`;
    g.setAttribute('transform', fit);
  };
  refit(); new ResizeObserver(refit).observe(host);
  let t0 = 0, raf = 0, last = 0;
  const frame = now => {
    raf = requestAnimationFrame(frame);
    if (now - last < 33) return; last = now;
    const t = reduce ? 6 : (now - t0) / 1000;
    const r = scene(t);
    g.setAttribute('transform', fit);
    g.setAttribute('opacity', r.fade.toFixed(3));
    g.innerHTML = r.svg;
    if (reduce) { cancelAnimationFrame(raf); raf = 0; }
  };
  new IntersectionObserver(es => {
    const e = es.at(-1);
    if (e.isIntersecting) { if (!t0) t0 = performance.now(); if (!raf) raf = requestAnimationFrame(frame); }
    else { cancelAnimationFrame(raf); raf = 0; }
  }, { threshold: .2 }).observe(host);
}
const init = () => document.querySelectorAll('.drk-iso[data-scene]').forEach(mount);
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
