/* Drakkar x IA : bandeau noir animé (logo + pluie de 0/1 formant un portrait). Source : webflow-scripts/lp-ads/offre/agence-ia-v3/drakkar-ia/ */
(() => {
const css = document.createElement('style'); css.textContent = ".w-embed:has(> .drk-ia) { width: 100%; align-self: stretch; } .drk-ia { position: relative; overflow: hidden; isolation: isolate; width: calc(var(--drk-vw, 100vw) - 120px); max-width: none; margin: 0; aspect-ratio: 1272 / 633; min-height: 480px; border-radius: 28px; background: #000; display: grid; place-items: center; } .drk-ia canvas { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; } .drk-ia svg { position: relative; z-index: 1; width: clamp(220px, 31%, 480px); height: auto; overflow: visible; fill: #fff; transition: opacity .9s cubic-bezier(.2,.7,.15,1), filter .9s cubic-bezier(.2,.7,.15,1); } .drk-ia.is-out svg { opacity: 0; filter: blur(8px); } .drk-ia .l { opacity: 0; filter: blur(10px); transform: translateY(14px); transform-box: fill-box; transform-origin: 50% 100%; } .drk-ia.is-play .l { animation: drk-in .9s cubic-bezier(.2, .7, .15, 1) forwards; animation-delay: calc(var(--i) * 70ms); } .drk-ia.is-play .ia { animation-delay: calc(1.45s + var(--i) * 90ms); } .drk-ia .x { transform-box: fill-box; transform-origin: 50% 50%; opacity: 0; transform: rotate(-315deg) scale(.2); } .drk-ia.is-play .x { animation: drk-spin 1.35s cubic-bezier(.16, .84, .24, 1) .55s forwards; } .drk-ia .b { transform-box: view-box; transform: translate(0, 0); } .drk-ia.is-play .b { animation: drk-blade 1.35s cubic-bezier(.16, .84, .24, 1) .55s backwards; } .drk-ia .b1 { --dx: 9px; --dy: 9px; } .drk-ia .b2 { --dx: -9px; --dy: -9px; } .drk-ia .b3 { --dx: -9px; --dy: 9px; } .drk-ia .b4 { --dx: 9px; --dy: -9px; } @keyframes drk-in { to { opacity: 1; filter: blur(0); transform: none; } } @keyframes drk-spin { 0% { opacity: 0; transform: rotate(-315deg) scale(.2); } 25% { opacity: 1; } 100% { opacity: 1; transform: rotate(0) scale(1); } } @keyframes drk-blade { from { transform: translate(calc(var(--dx) * -1), calc(var(--dy) * -1)); } } @media (prefers-reduced-motion: reduce) { .drk-ia .l, .drk-ia .x { opacity: 1; filter: none; transform: none; animation: none !important; } } @media (max-width: 767px) { .drk-ia { width: calc(var(--drk-vw, 100vw) - 32px); border-radius: 20px; aspect-ratio: 8 / 9; min-height: 0; } .drk-ia svg { width: 72%; } }"; document.head.appendChild(css);
document.querySelectorAll('[data-drk-ia]').forEach(el => { if (!el.querySelector('svg')) el.insertAdjacentHTML('beforeend', "<svg viewBox=\"0 0 401 70\" role=\"img\" aria-label=\"Drakkar IA\"><path class=\"l\" style=\"--i:0\" d=\"M3 53V18H14.575C16.9917 18 19.2583 18.4583 21.375 19.375C23.4917 20.275 25.35 21.5333 26.95 23.15C28.55 24.75 29.8 26.6083 30.7 28.725C31.6167 30.825 32.075 33.0833 32.075 35.5C32.075 37.9167 31.6167 40.1833 30.7 42.3C29.8 44.4 28.55 46.2583 26.95 47.875C25.35 49.475 23.4917 50.7333 21.375 51.65C19.2583 52.55 16.9917 53 14.575 53H3ZM7.2 48.8H14.575C16.4083 48.8 18.125 48.4583 19.725 47.775C21.3417 47.075 22.7583 46.1167 23.975 44.9C25.1917 43.6833 26.1417 42.275 26.825 40.675C27.525 39.0583 27.875 37.3333 27.875 35.5C27.875 33.6667 27.525 31.95 26.825 30.35C26.1417 28.7333 25.1833 27.3167 23.95 26.1C22.7333 24.8833 21.325 23.9333 19.725 23.25C18.125 22.55 16.4083 22.2 14.575 22.2H7.2V48.8Z\"/><path class=\"l\" style=\"--i:1\" d=\"M47.0449 53V18H59.3449C61.2116 18 62.8949 18.4583 64.3949 19.375C65.9116 20.2917 67.1116 21.5333 67.9949 23.1C68.8949 24.65 69.3449 26.3833 69.3449 28.3C69.3449 29.9833 69.0116 31.5167 68.3449 32.9C67.6783 34.2833 66.7616 35.4417 65.5949 36.375C64.4449 37.2917 63.1366 37.925 61.6699 38.275L70.1699 53H65.3199L56.9699 38.625H51.2449V53H47.0449ZM51.2449 34.425H58.9199C60.0533 34.425 61.0949 34.15 62.0449 33.6C62.9949 33.0333 63.7449 32.275 64.2949 31.325C64.8616 30.3583 65.1449 29.275 65.1449 28.075C65.1449 26.8583 64.8616 25.775 64.2949 24.825C63.7449 23.8583 62.9949 23.1 62.0449 22.55C61.0949 21.9833 60.0533 21.7 58.9199 21.7H51.2449V34.425Z\"/><path class=\"l\" style=\"--i:2\" d=\"M97.0043 18H102.079L114.804 53H110.354L107.754 45.85H91.3293L88.7543 53H84.2793L97.0043 18ZM92.8793 41.65H106.204L99.5293 23.375L92.8793 41.65Z\"/><path class=\"l\" style=\"--i:3\" d=\"M153.161 53H147.736L136.686 37.825L134.061 40.975V53H129.861V18H134.061V34.45L147.836 18H153.311L139.436 34.525L153.161 53Z\"/><path class=\"l\" style=\"--i:4\" d=\"M191.347 53H185.922L174.872 37.825L172.247 40.975V53H168.047V18H172.247V34.45L186.022 18H191.497L177.622 34.525L191.347 53Z\"/><path class=\"l\" style=\"--i:5\" d=\"M217.323 18H222.398L235.123 53H230.673L228.073 45.85H211.648L209.073 53H204.598L217.323 18ZM213.198 41.65H226.523L219.848 23.375L213.198 41.65Z\"/><path class=\"l\" style=\"--i:6\" d=\"M250.18 53V18H262.48C264.346 18 266.03 18.4583 267.53 19.375C269.046 20.2917 270.246 21.5333 271.13 23.1C272.03 24.65 272.48 26.3833 272.48 28.3C272.48 29.9833 272.146 31.5167 271.48 32.9C270.813 34.2833 269.896 35.4417 268.73 36.375C267.58 37.2917 266.271 37.925 264.805 38.275L273.305 53H268.455L260.105 38.625H254.38V53H250.18ZM254.38 34.425H262.055C263.188 34.425 264.23 34.15 265.18 33.6C266.13 33.0333 266.88 32.275 267.43 31.325C267.996 30.3583 268.28 29.275 268.28 28.075C268.28 26.8583 267.996 25.775 267.43 24.825C266.88 23.8583 266.13 23.1 265.18 22.55C264.23 21.9833 263.188 21.7 262.055 21.7H254.38V34.425Z\"/><g class=\"x\"><g class=\"b b1\"><ellipse cx=\"319.915\" cy=\"44.0655\" rx=\"1.58236\" ry=\"11.4721\" transform=\"rotate(135 319.915 44.0655)\"/></g><g class=\"b b2\"><ellipse cx=\"301.453\" cy=\"25.3096\" rx=\"1.58236\" ry=\"11.4721\" transform=\"rotate(135 301.453 25.3096)\"/></g><g class=\"b b3\"><ellipse cx=\"301.599\" cy=\"43.9175\" rx=\"1.58236\" ry=\"11.4721\" transform=\"rotate(-135 301.599 43.9175)\"/></g><g class=\"b b4\"><ellipse cx=\"319.77\" cy=\"25.4547\" rx=\"1.58236\" ry=\"11.4721\" transform=\"rotate(-135 319.77 25.4547)\"/></g></g><path class=\"l ia\" style=\"--i:0\" d=\"M347.75 53V18H351.95V53H347.75Z\"/><path class=\"l ia\" style=\"--i:1\" d=\"M380.944 18H386.019L398.744 53H394.294L391.694 45.85H375.269L372.694 53H368.219L380.944 18ZM376.819 41.65H390.144L383.469 23.375L376.819 41.65Z\"/></svg>"); });
})();
(() => {
const host = document.querySelector('[data-drk-ia]');
if (!host) return;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* 1. Apparition du logo quand le bloc entre à l'écran */
const play = () => { host.classList.remove('is-play'); void host.offsetWidth; host.classList.add('is-play'); host.dispatchEvent(new Event('drk:play')); };
new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { play(); io.disconnect(); } }, { threshold: .45 }).observe(host);
const vw = () => { const w = document.documentElement.clientWidth, g = w < 768 ? 16 : 60; document.documentElement.style.setProperty('--drk-vw', w + 'px'); host.style.marginLeft = '0px'; host.style.marginLeft = (g - host.getBoundingClientRect().left) + 'px'; }; vw(); addEventListener('resize', vw);
/* 2. Pluie de 0 et de 1 qui se rassemble en portrait de profil, puis se dissout, en boucle */
const cv = document.createElement('canvas');
host.querySelector('svg').before(cv);
const ctx = cv.getContext('2d');
const portrait = new Image();
portrait.src = 'data:image/jpeg;base64,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';
let lum = null, LW = 0, LH = 0; // carte de luminosité du portrait (0..1)
portrait.onload = () => {
LW = portrait.naturalWidth; LH = portrait.naturalHeight;
const c = document.createElement('canvas'); c.width = LW; c.height = LH;
const x = c.getContext('2d'); x.drawImage(portrait, 0, 0);
const d = x.getImageData(0, 0, LW, LH).data;
lum = new Float32Array(LW * LH);
for (let i = 0; i < lum.length; i++) lum[i] = d[i * 4] / 255;
build();
};
const sample = (u, v) => { // bilinéaire, u/v en 0..1
if (u < 0 || v < 0 || u >= 1 || v >= 1) return 0;
const x = u * (LW - 1), y = v * (LH - 1), i = x | 0, j = y | 0, fx = x - i, fy = y - j;
const a = lum[j * LW + i], b = lum[j * LW + Math.min(i + 1, LW - 1)], c = lum[Math.min(j + 1, LH - 1) * LW + i], e = lum[Math.min(j + 1, LH - 1) * LW + Math.min(i + 1, LW - 1)];
return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + e * fx) * fy;
};
let last = 0, raf = 0;
let CELL = 8, W, H, cols, rows, cells = [], drops = [];
function build() {
const r = host.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
W = r.width; H = r.height; CELL = 6;
cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.font = `600 ${CELL}px ui-monospace, Menlo, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
cols = Math.ceil(W / CELL); rows = Math.ceil(H / CELL);
const wide = W / H > 1.6, ph = H * (wide ? 1.06 : 1), pw = ph * LW / LH || 0;
const ox = wide ? W * .8 - pw / 2 : (W - pw) / 2, oy = H - ph, gain = wide ? 1 : .55;
cells = [];
for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
const px = i * CELL + CELL / 2, py = j * CELL + CELL / 2;
const m = lum ? sample((px - ox) / pw, (py - oy) / ph) * gain : 0;
cells.push({ px, py, m, c: Math.random() < .5 ? '0' : '1', th: .75 * Math.random() + .25 * (j / rows) });
}
drops = Array.from({ length: cols }, () => ({ y: Math.random() * rows * 2 - rows, v: .15 + Math.random() * .3 }));
face = []; for (let k = 0; k < cells.length; k++) if (cells[k].m > .03) face.push(k);
A = new Float32Array(cells.length); seen = new Uint32Array(cells.length); stamp = 0;
/* atlas des deux glyphes : drawImage coûte bien moins que fillText sur ~20 000 cellules */
const g = Math.ceil(CELL * dpr) + 2; glyph = document.createElement('canvas'); glyph.width = g * 2; glyph.height = g;
const gx = glyph.getContext('2d'); gx.font = `600 ${CELL * dpr}px ui-monospace, Menlo, monospace`; gx.textAlign = 'center'; gx.textBaseline = 'middle'; gx.fillStyle = '#fff';
gx.fillText('0', g / 2, g / 2); gx.fillText('1', g * 1.5, g / 2); GS = g; GD = g / dpr;
faceCv = document.createElement('canvas'); faceCv.width = cv.width; faceCv.height = cv.height; faceX = faceCv.getContext('2d'); faceX.setTransform(dpr, 0, 0, dpr, 0, 0); faceF = -1;
/* fond : toutes les cellules à 2 %, peint une fois (les inversions à ce niveau sont invisibles) */
base = document.createElement('canvas'); base.width = cv.width; base.height = cv.height;
const bx = base.getContext('2d'); bx.setTransform(dpr, 0, 0, dpr, 0, 0); bx.globalAlpha = .02;
for (const c of cells) bx.drawImage(glyph, c.c === '0' ? 0 : GS, 0, GS, GS, c.px - GD / 2, c.py - GD / 2, GD, GD);
if (!raf) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, cv.width, cv.height); ctx.drawImage(base, 0, 0); }
}
let glyph = null, base = null, GS = 0, GD = 0, face = [], A = new Float32Array(0), seen = new Uint32Array(0), stamp = 0, hit = [], faceCv = null, faceX = null, faceF = -1, faceN = 0;
new ResizeObserver(build).observe(host); build();
let mx = -1e4, my = -1e4;
host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
host.addEventListener('pointerleave', () => { mx = my = -1e4; });
const FORM = 3, HOLD = 7, OUT = 2, REST = 2, CYCLE = FORM + HOLD + OUT + REST;
let t0 = performance.now() + 2000, lastN = 0;
host.addEventListener('drk:play', () => { t0 = performance.now(); lastN = 0; });
/* le logo rejoue au début de chaque cycle du visage, et s'efface pendant la dissolution */
const sync = now => {
const t = (now - t0) / 1000; if (t < 0) return;
const n = Math.floor(t / CYCLE), c = t % CYCLE;
if (n !== lastN) { lastN = n; host.classList.remove('is-out', 'is-play'); void host.offsetWidth; host.classList.add('is-play'); }
else host.classList.toggle('is-out', c >= FORM + HOLD);
};
const ease = x => x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x);
const formAt = now => {
const t = (now - t0) / 1000; if (t < 0) return 0;
const c = t % CYCLE;
return c < FORM ? ease(c / FORM) : c < FORM + HOLD ? 1 : c < FORM + HOLD + OUT ? 1 - ease((c - FORM - HOLD) / OUT) : 0;
};
const flip = c => { c.c = c.c === '0' ? '1' : '0'; };
const frame = now => {
raf = requestAnimationFrame(frame);
if (now - last < (W < 700 ? 42 : 33)) return; // ~30 i/s (24 sur mobile) suffit et ménage le CPU
last = now;
const f = reduce ? 1 : formAt(now);
if (!reduce) sync(now);
drops.forEach(d => { d.y += d.v; if (d.y > rows + 30) { d.y = -Math.random() * rows * .5; d.v = .15 + Math.random() * .3; } });
ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.clearRect(0, 0, cv.width, cv.height); if (base) ctx.drawImage(base, 0, 0);
const dpr = cv.width / W; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
/* on ne parcourt que les cellules visibles au-dessus du fond : traînées, visage, zone du curseur */
stamp++; hit.length = 0;
const touch = (k, a) => { if (seen[k] !== stamp) { seen[k] = stamp; A[k] = a; hit.push(k); } else if (a > A[k]) A[k] = a; };
for (let i = 0; i < cols; i++) {
const y = drops[i].y, j1 = Math.min(rows - 1, Math.floor(y)), j0 = Math.max(0, Math.ceil(y - 22));
for (let j = j0; j <= j1; j++) { const behind = y - j; touch(j * cols + i, .05 * (1 - behind / 22) + (behind < 1 ? .09 : 0)); }
}
/* visage : calque à part, repeint quand il bouge (formation, dissolution) et sinon 2 à 3 fois par seconde pour les inversions */
if (f !== faceF || ++faceN >= 12) {
faceF = f; faceN = 0;
faceX.setTransform(1, 0, 0, 1, 0, 0); faceX.clearRect(0, 0, faceCv.width, faceCv.height); faceX.setTransform(dpr, 0, 0, dpr, 0, 0);
for (let n = 0; n < face.length; n++) {
const c = cells[face[n]]; if (!(f > c.th)) continue;
if (Math.random() < .07) flip(c);
faceX.globalAlpha = Math.min(.85 * c.m ** .95 - .02, .73);
faceX.drawImage(glyph, c.c === '0' ? 0 : GS, 0, GS, GS, c.px - GD / 2, c.py - GD / 2, GD, GD);
}
}
ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.drawImage(faceCv, 0, 0); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
if (mx > -1e3) {
const i0 = Math.max(0, ((mx - 100) / CELL) | 0), i1 = Math.min(cols - 1, ((mx + 100) / CELL) | 0), j0 = Math.max(0, ((my - 100) / CELL) | 0), j1 = Math.min(rows - 1, ((my + 100) / CELL) | 0);
for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) { const k = j * cols + i, c = cells[k], dm = Math.hypot(c.px - mx, c.py - my); if (dm < 100) { const add = .14 * (1 - dm / 100); if (seen[k] === stamp) A[k] += add; else touch(k, add); if (Math.random() < .3) flip(c); } }
}
for (let n = 0; n < hit.length; n++) {
const k = hit[n], c = cells[k], a = A[k];
if (Math.random() < .02) flip(c);
if (a < .004) continue;                                          // le fond à 2 % est déjà peint
ctx.globalAlpha = Math.min(a, .73);
ctx.drawImage(glyph, c.c === '0' ? 0 : GS, 0, GS, GS, c.px - GD / 2, c.py - GD / 2, GD, GD);
}
if (reduce) { cancelAnimationFrame(raf); raf = 0; }
};
/* la pluie démarre une fois la page chargée et posée (ou dès la première interaction) : le chargement initial reste léger */
let ready = false, vis = false;
const go = () => { if (ready) return; ready = true; t0 = performance.now(); lastN = 0; ['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(e => removeEventListener(e, go)); if (vis && !raf) raf = requestAnimationFrame(frame); };
['pointermove', 'scroll', 'keydown', 'touchstart'].forEach(e => addEventListener(e, go, { passive: true }));
const later = () => setTimeout(() => (window.requestIdleCallback || setTimeout)(go, { timeout: 1500 }), 2500);
document.readyState === 'complete' ? later() : addEventListener('load', later, { once: true });
new IntersectionObserver(es => { vis = es.at(-1).isIntersecting; if (vis) { if (ready && !raf) raf = requestAnimationFrame(frame); } else { cancelAnimationFrame(raf); raf = 0; } }).observe(host);
})();
