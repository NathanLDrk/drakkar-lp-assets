/* Drakkar : bandeau « Entreprise 3.0 », atelier industriel en isométrique animé.
   <section class="drk-fab" data-drk-fab> … contenu texte (.drk-fab-copy) … </section>
   Décor statique dessiné une fois, éléments mobiles redessinés à ~30 i/s seulement quand le bandeau est visible. */
(() => {
const host = document.querySelector('[data-drk-fab]');
if (!host) return;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = Math.cos(Math.PI / 6), S = .5;
const P = (x, y, z = 0) => [(x - y) * C, (x + y) * S - z];
const f1 = n => +n.toFixed(1);
const pts = a => a.map(p => P(...p).map(f1).join(',')).join(' ');
const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;
const ez = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2; };
const seg = (t, a, b) => ez((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const ACC = 'var(--drk-accent, #3d7bff)';

/* teintes : dessus, face gauche (+y), face droite (+x) */
const T = {
  white: ['#fbfbfc', '#e4e4e9', '#d0d0d7'],
  light: ['#ededf0', '#d5d5db', '#c1c1c9'],
  mid:   ['#cfcfd6', '#b4b4bd', '#9d9da7'],
  dark:  ['#4a4a51', '#35353b', '#2a2a2f'],
  ink:   ['#2c2c31', '#1f1f23', '#18181b'],
  acc:   [ACC, ACC, ACC],
  wood:  ['#e6dccb', '#cdbfa8', '#b9aa92'],
  sage:  ['#c9d6c8', '#adbcab', '#97a895'],
};

/* ---------- primitives ---------- */
function box(x, y, z, w, d, h, tone = T.light, o = 1) {
  const [t, l, r] = tone;
  return `<g${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''}>` +
    `<polygon fill="${l}" points="${pts([[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])}"/>` +
    `<polygon fill="${r}" points="${pts([[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])}"/>` +
    `<polygon fill="${t}" points="${pts([[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])}"/></g>`;
}
const top = (x, y, z, w, d, fill, o = 1, extra = '') => `<polygon${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} fill="${fill}" ${extra} points="${pts([[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]])}"/>`;
const faceY = (x, y, z, w, h, fill, o = 1, extra = '') => `<polygon${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} fill="${fill}" ${extra} points="${pts([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]])}"/>`; // plan y constant
const faceX = (x, y, z, d, h, fill, o = 1, extra = '') => `<polygon${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} fill="${fill}" ${extra} points="${pts([[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]])}"/>`; // plan x constant
const shadow = (x, y, w, d, o = .18) => `<polygon filter="url(#fabBlur)" fill="#3a3a48" opacity="${o}" points="${pts([[x, y, 0], [x + w, y, 0], [x + w, y + d, 0], [x, y + d, 0]])}"/>`;
const line3 = (a, b, stroke, sw = 2, o = 1, extra = '') => { const p = P(...a), q = P(...b); return `<line${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra} x1="${f1(p[0])}" y1="${f1(p[1])}" x2="${f1(q[0])}" y2="${f1(q[1])}"/>`; };
const poly3 = (a, stroke, sw = 2, fill = 'none', extra = '') => `<polyline fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra} points="${pts(a)}"/>`;
function label(txt, x, y, z, face, size = 9, fill = '#55555c', o = 1, weight = 600, ls = 0) {
  const [ox, oy] = P(x, y, z);
  const m = face === 'top' ? `${C},${S},${-C},${S}` : face === 'y' ? `${C},${S},0,1` : `${C},${-S},0,1`;
  return `<text${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} transform="matrix(${m},${f1(ox)},${f1(oy)})" font-size="${size}" font-weight="${weight}" letter-spacing="${ls}" fill="${fill}">${txt}</text>`;
}
function cyl(x, y, z, r, h, tone = T.light) {
  const [cx, cy] = P(x, y, z), rx = r * 1.2247, ry = r * .7071;
  return `<path fill="${tone[2]}" d="M${f1(cx - rx)},${f1(cy - h)} L${f1(cx - rx)},${f1(cy)} A${f1(rx)},${f1(ry)} 0 0 0 ${f1(cx + rx)},${f1(cy)} L${f1(cx + rx)},${f1(cy - h)} Z"/>` +
    `<path fill="${tone[1]}" d="M${f1(cx - rx)},${f1(cy - h)} L${f1(cx - rx)},${f1(cy)} A${f1(rx)},${f1(ry)} 0 0 0 ${f1(cx)},${f1(cy + ry)} L${f1(cx)},${f1(cy + ry - h)} A${f1(rx)},${f1(ry)} 0 0 1 ${f1(cx - rx)},${f1(cy - h)} Z"/>` +
    `<ellipse fill="${tone[0]}" cx="${f1(cx)}" cy="${f1(cy - h)}" rx="${f1(rx)}" ry="${f1(ry)}"/>`;
}
const ball = (x, y, z, r, fill, o = 1) => { const [cx, cy] = P(x, y, z); return `<circle${o < 1 ? ` opacity="${o.toFixed(2)}"` : ''} cx="${f1(cx)}" cy="${f1(cy)}" r="${r}" fill="${fill}"/>`; };
/* personnage : corps, tête ; tenue claire ou sombre, gilet d'accent possible */
function person(x, y, z = 0, tone = T.white, bob = 0, vest = false) {
  const head = P(x, y, z + 25 + bob);
  return `<ellipse fill="#3a3a48" opacity=".14" cx="${f1(P(x, y, z)[0])}" cy="${f1(P(x, y, z)[1])}" rx="6" ry="3.2"/>` +
    cyl(x, y, z + bob, 4.6, 19, tone) + (vest ? cyl(x, y, z + 9 + bob, 4.8, 7, T.acc) : '') +
    `<circle cx="${f1(head[0])}" cy="${f1(head[1])}" r="4.6" fill="#e9dfd5"/><path d="M${f1(head[0] - 4.6)},${f1(head[1] - .5)} a4.6,4.6 0 0 1 9.2,0 z" fill="${tone === T.ink || tone === T.dark ? '#d8d8dd' : '#3d3d44'}"/>`;
}
function tree(x, y, r = 16) {
  const [cx, cy] = P(x, y, 0);
  return `<ellipse fill="#000" opacity=".22" cx="${f1(cx + 6)}" cy="${f1(cy + 2)}" rx="${r}" ry="${r * .45}"/>` +
    box(x - 2, y - 2, 0, 4, 4, 14, T.wood) +
    `<circle cx="${f1(cx)}" cy="${f1(cy - 14 - r * .9)}" r="${r}" fill="#a9b9a6"/><circle cx="${f1(cx - r * .3)}" cy="${f1(cy - 14 - r * 1.15)}" r="${r * .62}" fill="#bfcdbb"/>`;
}

/* ---------- plan de l'atelier (unités monde ; sol 0..960 × 0..640) ---------- */
const FW = 960, FD = 640, WH = 66;
const LINE = { x0: 110, x1: 600, y: 112, d: 26, h: 20 };
const ARMS = [[220, 84], [380, 84]];
const SCAN = 500;
const CNC = [120, 230, 340, 450];
const RACKS = [70, 175, 280];
const DOCK = { x: 760, y: 430 };
const OFFICE = { x: 30, y: 410, w: 290, d: 210 };

function staticBack() {
  let s = '';
  // extérieur : voirie, parking, arbres
  s += top(-140, -120, -14.2, 1320, 900, '#1a1a1d');
  s += line3([-140, 700, -14], [1180, 700, -14], '#2a2a30', 26);
  for (let x = -100; x < 1160; x += 70) s += line3([x, 700, -13.9], [x + 30, 700, -13.9], '#3a3a42', 2);
  for (let i = 0; i < 6; i++) s += line3([140 + i * 46, 732, -13.9], [140 + i * 46, 790, -13.9], '#34343a', 1.6);
  [[-70, 60], [-70, 230], [-80, 400], [-60, 560], [1010, 20], [1040, 160], [1010, 300], [1090, 600], [420, 770], [700, 780]].forEach(([x, y], i) => { s += tree(x, y, 13 + (i % 3) * 3); });
  // dalle de l'atelier
  s += box(-16, -16, -14, FW + 32, FD + 32, 14, ['#ececef', '#c9c9cf', '#b8b8bf']);
  // marquages au sol : zones, allées, chemin du robot
  const zone = (x, y, w, d, c = '#cfcfd6', sw = 1.6) => poly3([[x, y, .2], [x + w, y, .2], [x + w, y + d, .2], [x, y + d, .2], [x, y, .2]], c, sw);
  s += zone(90, 60, 540, 120) + zone(100, 205, 470, 115) + zone(680, 40, 250, 330) + zone(DOCK.x - 20, DOCK.y - 20, 200, 190);
  s += top(640, 40, .1, 26, 560, '#e2e2e6');
  s += poly3([[100, 352, .3], [600, 352, .3]], ACC, 2, 'none', 'stroke-dasharray="2 9" opacity=".55"');
  for (let x = DOCK.x; x < DOCK.x + 160; x += 22) s += top(x, DOCK.y + 160, .25, 12, 4, '#d9c25a', .7);
  // murs du fond (y = 0 et x = 0) avec bandeau et vitrages
  s += box(-16, -28, 0, FW + 16, 12, WH, ['#3a3a40', '#f4f4f6', '#dcdce1']);
  s += box(-28, -28, 0, 12, FD + 28, WH, ['#3a3a40', '#e7e7eb', '#dedee3']);
  s += faceY(-16, -16.05, WH - 5, FW + 16, 3, ACC);
  s += faceX(-15.95, -16, WH - 5, FD + 16, 3, ACC);
  for (let x = 40; x < 640; x += 64) s += faceY(x, -15.9, 30, 44, 20, '#d5dbe6');
  for (let y = 40; y < 380; y += 64) s += faceX(-15.9, y, 30, 44, 20, '#cdd3de');
  // enseigne
  s += faceY(660, -15.9, 26, 26, 26, ACC) + label('D', 668, -15.8, 32, 'y', 18, '#fff', 1, 700);
  s += label('ATELIER DE PRODUCTION', 694, -15.8, 34, 'y', 13, '#2c2c31', 1, 700, 1.5);
  s += label('Usine connectée · Ligne A', 694, -15.8, 21, 'y', 7.5, '#8b8b93', 1, 600, .5);
  // grand écran mural de supervision (mur x = 0)
  s += faceX(-15.9, 92, 12, 150, 42, '#1d1d21');
  [.55, .8, .45, .9, .7, .62, .85].forEach((h, i) => { s += faceX(-15.8, 104 + i * 16, 16, 9, 30 * h, i === 3 ? ACC : '#5b5b63'); });
  return s;
}

/* ligne d'assemblage : convoyeur, deux bras robotisés, portique de contrôle */
function lineStatic() {
  let s = shadow(LINE.x0, LINE.y, LINE.x1 - LINE.x0, LINE.d, .22);
  for (let x = LINE.x0 + 10; x < LINE.x1; x += 60) s += box(x, LINE.y + 3, 0, 6, LINE.d - 6, LINE.h - 4, T.dark);
  s += box(LINE.x0, LINE.y, LINE.h - 4, LINE.x1 - LINE.x0, LINE.d, 4, T.mid);
  s += top(LINE.x0 + 2, LINE.y + 3, LINE.h + .05, LINE.x1 - LINE.x0 - 4, LINE.d - 6, '#3a3a40');
  // poste de sortie : palette
  s += box(612, 104, 0, 34, 40, 6, T.wood);
  return s;
}
function lineDyn(t) {
  const out = [];
  // tapis qui défile
  const off = (t * 34) % 14;
  let belt = '';
  for (let x = LINE.x0 + 4 + off; x < LINE.x1 - 4; x += 14) belt += line3([x, LINE.y + 4, LINE.h + .1], [x, LINE.y + LINE.d - 4, LINE.h + .1], '#4c4c54', 1.4);
  out.push([0, belt]);
  // produits : bruts → usinés (bras 1) → assemblés (bras 2) → contrôlés (portique)
  const SP = 34, GAP = 70, span = LINE.x1 - LINE.x0 - 30;
  for (let k = 0; k < 8; k++) {
    let x = LINE.x0 + ((t * SP + k * GAP) % (GAP * 8));
    if (x > LINE.x0 + span) continue;
    const y = LINE.y + 5, z = LINE.h, a = clamp((LINE.x1 - 20 - x) / 30);
    let p = box(x, y, z, 16, 16, 12, x < ARMS[0][0] + 10 ? T.mid : T.white, a);
    if (x > ARMS[1][0] + 8) p += box(x + 4, y + 4, z + 12, 8, 8, 5, T.light, a);
    if (x > SCAN + 6) p += top(x + 3, y + 3, z + 12.1, 10, 4, ACC, a);
    out.push([x + y + 1, p]);
  }
  // bras robotisés : pivot, deux segments, pince ; mouvement en rythme avec la ligne
  ARMS.forEach(([bx, by], i) => {
    const ph = t * 1.6 + i * 1.7, swing = Math.sin(ph), dip = (1 + Math.cos(ph * 2)) / 2;
    const base = [bx, by, 0];
    let a = box(bx - 12, by - 12, 0, 24, 24, 10, T.dark) + cyl(bx, by, 10, 9, 8, T.white);
    const sh = [bx, by, 22];
    const el = [bx + 10 + swing * 6, by + 6 + swing * 4, 54 - dip * 6];
    const wr = [bx + swing * 16, by + 30, 38 - dip * 10];
    a += line3(sh, el, '#d6d6dc', 9) + line3(sh, el, '#f4f4f6', 5);
    a += line3(el, wr, '#d6d6dc', 7) + line3(el, wr, '#f4f4f6', 3.5);
    a += ball(...sh, 6, '#2c2c31') + ball(...el, 5, '#2c2c31') + ball(...wr, 4.2, ACC);
    a += line3(wr, [wr[0] - 3, wr[1] + 2, wr[2] - 8], '#2c2c31', 2.2) + line3(wr, [wr[0] + 3, wr[1] + 2, wr[2] - 8], '#2c2c31', 2.2);
    out.push([bx + by + 4, a]);
  });
  // portique de contrôle qualité : faisceau d'accent qui pulse
  const pulse = .35 + .35 * (1 + Math.sin(t * 5)) / 2;
  let g = box(SCAN, LINE.y - 6, 0, 8, 6, 52, T.white) + box(SCAN, LINE.y + LINE.d, 0, 8, 6, 52, T.white) + box(SCAN, LINE.y - 6, 52, 8, LINE.d + 12, 6, T.white);
  g += faceX(SCAN + 4, LINE.y, LINE.h + 1, LINE.d, 30, ACC, pulse * .45);
  g += line3([SCAN + 4, LINE.y, 50], [SCAN + 4, LINE.y + LINE.d, 50], ACC, 2);
  out.push([SCAN + LINE.y + LINE.d + 5, g]);
  // pile sur la palette de sortie
  const stack = Math.floor((t * SP / GAP) % 6);
  let st = '';
  for (let i = 0; i < stack; i++) { const cx = 616 + (i % 2) * 15, cy = 108 + (Math.floor(i / 2) % 2) * 16, cz = 6 + Math.floor(i / 4) * 12; st += box(cx, cy, cz, 14, 14, 12, T.white) + top(cx + 3, cy + 3, cz + 12.1, 8, 3, ACC); }
  out.push([612 + 104 + 30, st]);
  // opérateurs de la ligne
  out.push([300 + 160, person(300, 160, 0, T.ink, 0, true)]);
  out.push([560 + 165, person(560, 165, 0, T.white, Math.abs(Math.sin(t * 3)) * .8)]);
  return out;
}

/* centres d'usinage : quatre machines, voyant d'état et barre de progression */
function cncStatic() {
  let s = '';
  CNC.forEach((x, i) => {
    const y = 222;
    s += shadow(x, y, 86, 66, .2);
    s += box(x, y, 0, 86, 66, 52, T.white);
    s += box(x + 6, y + 6, 52, 30, 22, 8, T.light);
    s += faceY(x + 10, y + 66.1, 14, 46, 28, '#2a2a2f');
    s += faceY(x + 13, y + 66.15, 17, 40, 22, '#3e3e46');
    s += faceX(x + 86.1, y + 14, 22, 26, 18, '#1d1d21');
    s += label(`CNC-0${i + 1}`, x + 60, y + 66.1, 46, 'y', 7, '#8b8b93', 1, 700, .5);
  });
  return s;
}
function cncDyn(t) {
  const out = [];
  CNC.forEach((x, i) => {
    const y = 222, run = i !== 2 || (t % 16) > 9;
    const blink = run ? .6 + .4 * Math.sin(t * 4 + i) : .9;
    let m = cyl(x + 76, y + 8, 52, 3.2, 14, T.white) + ball(x + 76, y + 8, 68, 4, run ? ACC : '#f0b03a', blink);
    const prog = ((t / (7 + i * 1.3)) + i * .27) % 1;
    m += faceX(x + 86.2, y + 16, 34, 22 * prog, 3, ACC);
    m += faceX(x + 86.2, y + 16, 28, 18, 2, '#5b5b63');
    if (run) { const [sx, sy] = P(x + 35, y + 66.2, 28); m += `<circle cx="${f1(sx + Math.sin(t * 22 + i) * 6)}" cy="${f1(sy)}" r="1.6" fill="#fff" opacity=".8"/>`; }
    out.push([x + y + 92, m]);
  });
  out.push([180 + 312, person(180, 312, 0, T.white)]);
  out.push([395 + 310, person(395, 310, 0, T.ink, 0, true)]);
  return out;
}

/* îlot de montage manuel au centre */
function benchStatic() {
  let s = '';
  [[360, 420], [470, 420], [360, 500], [470, 500]].forEach(([x, y], i) => {
    s += shadow(x, y, 80, 34, .16) + box(x, y, 0, 80, 34, 20, T.white) + box(x, y - 4, 20, 80, 4, 26, T.light);
    s += box(x + 10, y + 6, 20, 18, 14, 8, i % 2 ? T.wood : T.mid) + box(x + 44, y + 8, 20, 22, 4, 12, T.ink) + faceY(x + 45.5, y + 12.05, 22, 19, 8, '#3e4656');
  });
  s += poly3([[340, 400, .2], [570, 400, .2], [570, 560, .2], [340, 560, .2], [340, 400, .2]], '#cfcfd6', 1.6);
  return s;
}
function benchDyn(t) {
  const out = [];
  [[360, 420], [470, 420], [360, 500], [470, 500]].forEach(([x, y], i) => {
    const k = (t * .3 + i * .23) % 1;
    out.push([x + y + 60, faceY(x + 47, y + 12.1, 25, 15 * k, 1.8, i === 2 ? ACC : '#9fb2d6')]);
    out.push([x + 40 + y + 48, person(x + 40, y + 48, 0, i === 1 ? T.ink : T.white, Math.abs(Math.sin(t * 2.5 + i)) * .7, i === 1)]);
  });
  return out;
}

/* stockage : trois racks à palettes */
function rackStatic() {
  const UP = ['#c9c9d0', '#8d8e98', '#7a7b85'];
  let s = '';
  RACKS.forEach((y, r) => {
    const x = 700, w = 220, d = 34;
    s += shadow(x, y, w, d, .18);
    for (let i = 0; i <= 4; i++) s += box(x + i * 54, y, 0, 2.5, 2.5, 82, UP);
    for (let lv = 0; lv < 3; lv++) {
      const z = 4 + lv * 26;
      s += box(x, y, z, w, d, 3, ['#e7e7eb', '#9fa0aa', '#8d8e98']);
      for (let b = 0; b < 6; b++) {
        if ((b * 7 + lv * 3 + r * 5) % 9 === 0) continue;
        const bx = x + 6 + b * 36, h = 14 + ((b + lv + r) % 3) * 4;
        const tone = (b + lv * 2 + r) % 7 === 0 ? [ACC, ACC, ACC] : (b + r) % 3 === 0 ? T.wood : T.white;
        s += box(bx, y + 5, z + 3, 26, 24, h, tone, tone[0] === ACC ? .9 : 1);
      }
    }
    for (let i = 0; i <= 4; i++) s += box(x + i * 54, y + d - 2.5, 0, 2.5, 2.5, 82, UP);
  });
  return s;
}

/* expédition : palettes, quai, camion à l'extérieur */
function dockStatic() {
  let s = '';
  [[0, 0], [44, 0], [0, 50], [88, 50]].forEach(([dx, dy], i) => {
    const x = DOCK.x + dx, y = DOCK.y + dy;
    s += shadow(x, y, 36, 40, .18) + box(x, y, 0, 36, 40, 5, T.wood);
    s += box(x + 3, y + 3, 5, 30, 34, 14 + (i % 2) * 12, i === 2 ? T.light : T.white);
    if (i !== 1) s += faceY(x + 6, y + 37.1, 12, 10, 6, ACC, .9);
  });
  // camion à quai (côté x = 960)
  const tx = 1000, ty = 470;
  s += shadow(tx, ty, 150, 58, .3);
  s += box(tx, ty, 6, 118, 54, 54, T.white) + box(tx + 118, ty + 4, 6, 34, 46, 36, T.dark);
  s += faceX(tx + 152.1, ty + 8, 24, 38, 14, '#5c6878');
  s += faceY(tx + 10, ty + 54.1, 30, 60, 10, ACC) + label('LIVRAISON', tx + 14, ty + 54.15, 33, 'y', 7, '#fff', 1, 700, 1);
  [[tx + 16], [tx + 92], [tx + 132]].forEach(([wx]) => { s += cyl(wx, ty + 56, 0, 6, 4, T.ink); });
  return s;
}
function dockDyn(t) {
  const out = [];
  // chariot élévateur : rack → quai → rack, en boucle
  const L = 14, k = t % L;
  const path = [[660, 150], [660, 470], [740, 470]];
  const segs = [[0, 3.5, 0, 1], [3.5, 5, 1, 2], [5, 6.2, 2, 2], [6.2, 7.7, 2, 1], [7.7, 11.2, 1, 0], [11.2, 14, 0, 0]];
  let fx = 660, fy = 150, along = 'y', loaded = k > 11.2 || k < 5;
  for (const [a, b, i, j] of segs) if (k >= a && k < b) { const q = seg(k, a, b); fx = lerp(path[i][0], path[j][0], q); fy = lerp(path[i][1], path[j][1], q); along = path[i][0] !== path[j][0] ? 'x' : path[i][1] !== path[j][1] ? 'y' : along; if (i === j && i === 2) along = 'x'; }
  let f = '';
  if (along === 'y') {
    f += shadow(fx - 12, fy - 18, 26, 40, .25) + box(fx - 11, fy - 16, 4, 22, 30, 12, T.acc, .95) + box(fx - 11, fy - 16, 16, 22, 12, 14, T.ink);
    f += box(fx - 11, fy + 14, 0, 2, 2, 30, T.ink) + box(fx + 9, fy + 14, 0, 2, 2, 30, T.ink);
    if (loaded) f += box(fx - 12, fy + 16, 6, 24, 22, 4, T.wood) + box(fx - 10, fy + 18, 10, 20, 18, 14, T.white);
    f += cyl(fx - 8, fy + 8, 0, 3.5, 4, T.ink) + cyl(fx + 8, fy + 8, 0, 3.5, 4, T.ink);
  } else {
    f += shadow(fx - 18, fy - 12, 40, 26, .25) + box(fx - 16, fy - 11, 4, 30, 22, 12, T.acc, .95) + box(fx - 16, fy - 11, 16, 12, 22, 14, T.ink);
    f += box(fx + 14, fy - 11, 0, 2, 2, 30, T.ink) + box(fx + 14, fy + 9, 0, 2, 2, 30, T.ink);
    if (loaded) f += box(fx + 16, fy - 12, 6, 22, 24, 4, T.wood) + box(fx + 18, fy - 10, 10, 18, 20, 14, T.white);
    f += cyl(fx + 8, fy + 8, 0, 3.5, 4, T.ink) + cyl(fx + 8, fy - 8, 0, 3.5, 4, T.ink);
  }
  f += person(fx - 2, fy - 6, 18, T.white);
  out.push([fx + fy + 20, f]);
  // préparateur au quai
  const w = Math.sin(t * .5);
  out.push([DOCK.x + 70 + w * 20 + DOCK.y + 120, person(DOCK.x + 70 + w * 20, DOCK.y + 120, 0, T.ink, Math.abs(Math.sin(t * 6)) * 1.2, true)]);
  return out;
}

/* bureau vitré : planification, poste qualité, réunion */
function officeStatic() {
  const { x, y, w, d } = OFFICE;
  let s = top(x, y, .3, w, d, '#e3e6ec');
  // bureaux avec écrans (écrans tournés vers les personnes, côté +y)
  [[60, 450], [140, 450], [60, 520], [140, 520]].forEach(([dx, dy]) => {
    s += box(dx, dy, 0, 50, 26, 18, T.white);
    s += box(dx + 14, dy + 4, 18, 22, 3, 14, T.ink);
    s += faceY(dx + 15.5, dy + 7.05, 20, 19, 11, '#3e4656');
  });
  // table de réunion
  s += shadow(220, 470, 70, 110, .15) + box(222, 470, 0, 62, 110, 18, T.wood);
  return s;
}
function officeDyn(t) {
  const out = [];
  const { x, y, w, d } = OFFICE;
  // écrans des postes : courbes qui avancent
  [[60, 450], [140, 450], [60, 520], [140, 520]].forEach(([dx, dy], i) => {
    const k = ((t * .25 + i * .3) % 1);
    let e = faceY(dx + 17, dy + 7.1, 23, 15 * k, 2, i === 1 ? ACC : '#9fb2d6');
    e += faceY(dx + 17, dy + 7.1, 27, 10, 1.6, '#6b7386');
    out.push([dx + dy + 34, e]);
    out.push([dx + 25 + dy + 42, person(dx + 25, dy + 42, 0, i % 2 ? T.ink : T.white)]);
  });
  // réunion autour de la table
  [[214, 490], [214, 545], [292, 500], [292, 556]].forEach(([px, py], i) => out.push([px + py + 2, person(px, py, 0, i === 2 ? T.ink : T.white, i === 0 ? Math.abs(Math.sin(t * 2.2)) * .8 : 0)]));
  // cloisons vitrées (devant)
  let gl = faceY(x, y, 0, w, 44, '#cfdcf2', .22, 'stroke="#9aa6ba" stroke-width=".8"') + faceX(x + w, y, 0, d, 44, '#cfdcf2', .2, 'stroke="#9aa6ba" stroke-width=".8"');
  for (let i = 0; i <= 6; i++) gl += line3([x + i * w / 6, y, 0], [x + i * w / 6, y, 44], '#8f99ac', 1);
  gl += line3([x, y, 44], [x + w, y, 44], '#6f7789', 1.6) + line3([x + w, y, 44], [x + w, y + d, 44], '#6f7789', 1.6);
  gl += label('Planification', x + 8, y - .1, 50, 'y', 8, '#6a6a72');
  out.push([x + w + y + d + 4, faceX(x + w, y + d * .55, 0, 0, 0, 'none') + gl]);
  return out;
}

/* robot mobile (AGV) qui suit le marquage bleu, et un technicien qui circule */
function moversDyn(t) {
  const out = [];
  const L = 18, k = t % L, q = k < 9 ? seg(k, 0, 9) : 1 - seg(k, 9, 18);
  const ax = lerp(110, 590, q), ay = 352;
  let a = shadow(ax - 14, ay - 10, 28, 20, .22) + box(ax - 13, ay - 9, 1, 26, 18, 7, T.white) + top(ax - 9, ay - 5, 8.1, 18, 10, ACC);
  a += box(ax - 8, ay - 7, 8, 16, 14, 10, T.wood);
  out.push([ax + ay + 9, a]);
  const wq = (t % 22) / 22, wx = lerp(80, 620, (1 - Math.cos(wq * Math.PI * 2)) / 2), wy = 385;
  out.push([wx + wy, person(wx, wy, 0, T.white, Math.abs(Math.sin(t * 6)) * 1.2)]);
  return out;
}

/* étiquettes flottantes, dans le plan de l'écran (au-dessus de tout) */
function tag(wx, wy, wz, title, sub, t, dot = ACC, prog = -1) {
  const [x, y] = P(wx, wy, wz + Math.sin(t * 1.4 + wx) * 2.5);
  const tw = Math.max(title.length * 5.6, sub.length * 4.7) + 30, h = prog >= 0 ? 36 : 30;
  let s = `<g transform="translate(${f1(x)},${f1(y)})"><line x1="0" y1="0" x2="0" y2="14" stroke="#fff" stroke-opacity=".6" stroke-width="1"/><circle cy="15" r="2.2" fill="#fff"/>` +
    `<g transform="translate(${f1(-tw / 2)},${-h})"><rect width="${f1(tw)}" height="${h}" rx="9" fill="#fff" filter="url(#fabTag)"/>` +
    `<circle cx="12" cy="11.5" r="3.2" fill="${dot}"/><text x="21" y="14.5" font-size="9.5" font-weight="700" fill="#1d1d21">${title}</text>` +
    `<text x="12" y="25" font-size="7.6" font-weight="600" fill="#8b8b93">${sub}</text>`;
  if (prog >= 0) s += `<rect x="12" y="29" width="${f1(tw - 24)}" height="2.6" rx="1.3" fill="#ececf0"/><rect x="12" y="29" width="${f1((tw - 24) * prog)}" height="2.6" rx="1.3" fill="${ACC}"/>`;
  return s + '</g></g>';
}
function tagsDyn(t) {
  const of = 118 + Math.floor(t / 9) % 6, p = (t % 9) / 9;
  return [
    tag(330, 110, 78, 'Ligne A · TRS 94 %', `${1240 + Math.floor(t * .9)} pièces aujourd'hui`, t),
    tag(285, 245, 86, `OF 24-${of}`, 'CNC-02 · en cours', t, ACC, p),
    tag(810, 150, 104, 'Stock en temps réel', 'Réappro. proposée par l\'IA', t),
    tag(840, 470, 60, 'Expédition 14:30', 'Quai 2 · 12 palettes', t, '#2fb37a'),
    tag(140, 470, 66, 'Planning recalculé', 'il y a 2 min', t),
  ].join('');
}

const FRONT = () => {
  // bordure basse côté rue (y = 640 et x = 960), ouverte au quai
  let s = '';
  for (let x = 0; x <= FW; x += 32) s += box(x - 1.5, FD + 6, 0, 3, 3, 18, T.mid);
  s += line3([0, FD + 7, 16], [FW, FD + 7, 16], '#b4b4bd', 1.4);
  for (let y = 0; y <= FD; y += 32) { if (y > 420 && y < 560) continue; s += box(FW + 6, y - 1.5, 0, 3, 3, 18, T.mid); }
  s += line3([FW + 7, 0, 16], [FW + 7, 420, 16], '#b4b4bd', 1.4) + line3([FW + 7, 560, 16], [FW + 7, FD, 16], '#b4b4bd', 1.4);
  return s;
};

/* ---------- montage ---------- */
const css = `.w-embed:has(> .drk-fab){width:100%}
.drk-fab{--drk-accent:#3d7bff;position:relative;overflow:hidden;isolation:isolate;width:100%;aspect-ratio:1272/633;min-height:480px;border-radius:28px;background:radial-gradient(120% 120% at 70% 40%,#1e1e22 0%,#111113 70%);color:#fff;font-family:Urbanist,system-ui,sans-serif}
.drk-fab-scene{position:absolute;inset:0;z-index:0}
.drk-fab-scene svg{position:absolute;inset:0;width:100%;height:100%;display:block}
.drk-fab-scene svg text{font-family:Urbanist,system-ui,sans-serif}
.drk-fab-cam{transform-box:view-box;transform-origin:62% 50%;animation:drkFabCam 26s cubic-bezier(.45,0,.55,1) infinite alternate}
@keyframes drkFabCam{from{transform:translate(0,0) scale(1)}to{transform:translate(-2.2%,-1.4%) scale(1.045)}}
.drk-fab::before{content:"";position:absolute;inset:0;z-index:1;pointer-events:none;background:radial-gradient(60% 70% at 50% 50%,rgba(12,12,14,.82) 0%,rgba(12,12,14,.62) 55%,rgba(12,12,14,.5) 100%)}
.drk-fab-copy{position:absolute;z-index:2;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:32px 24px}
.drk-fab h2{margin:0 0 18px;font-family:Urbanist,system-ui,sans-serif;font-size:clamp(34px,4vw,56px);line-height:1.1;font-weight:400;letter-spacing:-.01em;color:#fff}
.drk-fab h2 span{color:rgba(255,255,255,.5)}
.drk-fab p{margin:0 0 30px;max-width:520px;font-size:17px;line-height:1.5;color:rgba(255,255,255,.7)}
.drk-fab-cta{display:inline-flex;align-items:center;gap:14px;padding:8px 8px 8px 22px;border-radius:999px;background:#fff;color:#111113;font-weight:600;font-size:16px;text-decoration:none;transition:transform .5s cubic-bezier(.32,.72,0,1)}
.drk-fab-cta b{display:grid;place-items:center;width:34px;height:34px;border-radius:50%;background:#111113;color:#fff;font-weight:500;transition:transform .5s cubic-bezier(.32,.72,0,1)}
.drk-fab-cta:hover b{transform:translateX(3px)}
.drk-fab-cta:active{transform:scale(.98)}
@media (max-width:767px){.drk-fab{aspect-ratio:auto;min-height:560px;border-radius:20px}.drk-fab::before{background:rgba(12,12,14,.74)}.drk-fab p{font-size:15px}}
@media (prefers-reduced-motion:reduce){.drk-fab-cam{animation:none}}`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const VB = [1272, 633];
const scene = document.createElement('div'); scene.className = 'drk-fab-scene'; scene.setAttribute('aria-hidden', 'true');
scene.innerHTML = `<svg viewBox="0 0 ${VB[0]} ${VB[1]}" preserveAspectRatio="xMidYMid slice"><defs>
<filter id="fabBlur" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="fabTag" x="-20%" y="-30%" width="140%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000" flood-opacity=".25"/></filter>
</defs><g class="drk-fab-cam"><g class="fit"><g class="s"></g><g class="d"></g><g class="f"></g><g class="tg"></g></g></g></svg>`;
host.prepend(scene);
const fitG = scene.querySelector('.fit'), sG = scene.querySelector('.s'), dG = scene.querySelector('.d'), tG = scene.querySelector('.tg');
sG.innerHTML = staticBack() + lineStatic() + cncStatic() + benchStatic() + rackStatic() + dockStatic() + officeStatic();
scene.querySelector('.f').innerHTML = FRONT();
// cadrage : l'atelier remplit la partie droite et déborde légèrement
const fit = () => {
  const mob = host.clientWidth < 768;
  const k = mob ? .62 : .72, cx = 636, cy = mob ? 300 : 316;
  const [mx, my] = P(FW / 2 + 40, FD / 2 + 30, 0);
  fitG.setAttribute('transform', `translate(${f1(cx - mx * k)},${f1(cy - my * k)}) scale(${k})`);
};
fit(); addEventListener('resize', fit);

let t0 = 0, raf = 0, last = 0;
const frame = now => {
  raf = requestAnimationFrame(frame);
  if (now - last < 33) return; last = now;
  const t = reduce ? 4 : (now - t0) / 1000;
  const items = [...lineDyn(t), ...cncDyn(t), ...dockDyn(t), ...officeDyn(t), ...moversDyn(t), ...benchDyn(t)];
  items.sort((a, b) => a[0] - b[0]);
  dG.innerHTML = items.map(i => i[1]).join('');
  tG.innerHTML = tagsDyn(t);
  if (reduce) { cancelAnimationFrame(raf); raf = 0; }
};
new IntersectionObserver(es => {
  const e = es.at(-1);
  if (e.isIntersecting) { if (!t0) t0 = performance.now(); if (!raf) raf = requestAnimationFrame(frame); }
  else { cancelAnimationFrame(raf); raf = 0; }
}, { threshold: .1 }).observe(host);
})();
