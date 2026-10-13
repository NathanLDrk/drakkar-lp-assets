/* Drakkar home v2 : comportements. Le contenu est 100 % natif Webflow ; ce script ne fait qu'animer
   et basculer des classes d'état (is-active, is-open, is-on, is-in). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const page = $('.drk-page') || document.body;
  const prevent = el => el && el.addEventListener('click', e => e.preventDefault());

  /* 1. Fondu entre sections : on lit la couleur native de chaque section, puis le body prend le relais */
  const secs = $$('.drk-sec');
  const colors = new Map(secs.map(s => [s, getComputedStyle(s).backgroundColor]));
  document.body.style.backgroundColor = colors.get(secs[0]) || '#0b0b0b';
  document.body.classList.add('drk-js');
  document.documentElement.classList.add('drk-js');
  const nav = $('[data-drk=nav]');
  const dark = new Map(secs.map(s => [s, s.classList.contains('is-dark')]));
  // Toutes les sections prennent le ton de la section active : texte et fond glissent ensemble (variables animées en CSS)
  const toneIO = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const d = dark.get(e.target);
    document.body.style.backgroundColor = colors.get(e.target);
    secs.forEach(s => s.classList.toggle('is-dark', d));
    nav && nav.classList.toggle('is-dark', d);
  }), { rootMargin: '-50% 0px -50% 0px' });
  secs.forEach(s => toneIO.observe(s));

  /* 2. Halo Braise : fluide WebGL2 (bruit × bruit + sillage de la souris, technique du footer pe.agency) */
  const COLS = ['#0b0b0b', '#a8180a', '#ff8a3a'].map(h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255));
  const VERT = '#version 300 es\nin vec2 p;out vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0.,1.);}';
  const DISP = '#version 300 es\nprecision highp float;uniform sampler2D uGrid;uniform vec2 uMouse,uDelta;uniform float uMove,uAspect;in vec2 uv;out vec4 fc;void main(){vec4 c=texture(uGrid,uv);vec2 d=(uv-uMouse)*vec2(uAspect,1.);float f=1.-smoothstep(0.,.22,length(d));c.rg+=uDelta*f;c.rg*=min(.945,uMove);fc=vec4(c.rgb,1.);}';
  const VIS = '#version 300 es\nprecision highp float;uniform sampler2D uGrid;uniform float uTime,uStr,uAspect,uFadeH,uScale;uniform vec3 uGlow,uMid,uDark;in vec2 uv;out vec4 fc;float rand(vec2 s){return fract(sin(dot(s,vec2(12.9898,78.233)))*43758.5453);}float noise(vec2 s){vec2 i=floor(s),f=fract(s);float a=rand(i),b=rand(i+vec2(1.,0.)),c=rand(i+vec2(0.,1.)),d=rand(i+vec2(1.,1.));vec2 u=f*f*(3.-2.*f);return mix(a,b,u.x)+(c-a)*u.y*(1.-u.x)+(d-b)*u.x*u.y;}void main(){vec4 disp=texture(uGrid,uv);vec2 duv=uv-disp.rg*uStr;vec2 n=vec2(duv.x*uScale*uAspect*.62,duv.y*uScale*1.3);n.y+=.42*sin(n.x*.9+uTime*3.);float n1=smoothstep(.3,.78,noise(n-uTime));float n2=smoothstep(.3,.78,noise(n+vec2(uTime,-uTime*.6)));float v=n1*n2*smoothstep(0.,uFadeH,1.-uv.y);vec3 col=mix(uDark,uMid,smoothstep(0.,.5,v));col=mix(col,uGlow,smoothstep(.5,1.,v));float g=rand(uv*vec2(1731.,977.)+fract(uTime*7.))*.03;fc=vec4(col+g-.015,1.);}';
  function fluid(host, o) {
    if (!host) return;
    const DPR = coarse ? 1.25 : 1.5, G = coarse ? 64 : 128;
    const cv = document.createElement('canvas');
    const gl = cv.getContext('webgl2', { alpha: false, depth: false, stencil: false, antialias: false });
    if (!gl || !(gl.getExtension('EXT_color_buffer_float') || gl.getExtension('EXT_color_buffer_half_float'))) return;
    host.appendChild(cv);
    const sh = (s, t) => { const x = gl.createShader(t); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const prog = fs => { const p = gl.createProgram(); gl.attachShader(p, sh(VERT, gl.VERTEX_SHADER)); gl.attachShader(p, sh(fs, gl.FRAGMENT_SHADER)); gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p); return p; };
    const pD = prog(DISP), pV = prog(VIS);
    const L = (p, n) => Object.fromEntries(n.map(k => [k, gl.getUniformLocation(p, k)]));
    const uD = L(pD, ['uGrid', 'uMouse', 'uDelta', 'uMove', 'uAspect']);
    const uV = L(pV, ['uGrid', 'uTime', 'uStr', 'uAspect', 'uFadeH', 'uScale', 'uGlow', 'uMid', 'uDark']);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const mk = () => { const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, G, G, 0, gl.RGBA, gl.HALF_FLOAT, null);
      [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.LINEAR)); [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach(k => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE));
      const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f); gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0); return { t, f }; };
    const fb = [mk(), mk()]; let cur = 0;
    let mx = .5, my = .5, vx = 0, vy = 0, move = 0, t = Math.random() * 10, last = 0, raf = 0, shown = false;
    document.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); if (e.clientY < r.top - 80 || e.clientY > r.bottom + 80) return;
      const x = (e.clientX - r.left) / r.width, y = 1 - (e.clientY - r.top) / r.height; vx = (x - mx) * 70; vy = (y - my) * 70; mx = x; my = y; move = 1; }, { passive: true });
    const resize = () => { const r = host.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, DPR); cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); };
    new ResizeObserver(resize).observe(host); resize();
    const draw = now => { const k = last ? Math.min(Math.max(now - last, 1), 50) / 16.667 : 1; last = now; t += .00075 * k; move *= .95 ** k; vx *= .965 ** k; vy *= .965 ** k;
      gl.activeTexture(gl.TEXTURE0);
      if (move > .001) { gl.bindFramebuffer(gl.FRAMEBUFFER, fb[1 - cur].f); gl.viewport(0, 0, G, G); gl.useProgram(pD); gl.bindTexture(gl.TEXTURE_2D, fb[cur].t); gl.uniform1i(uD.uGrid, 0); gl.uniform2f(uD.uMouse, mx, my); gl.uniform2f(uD.uDelta, vx * k, vy * k); gl.uniform1f(uD.uMove, move); gl.uniform1f(uD.uAspect, cv.width / cv.height); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); cur = 1 - cur; }
      gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height); gl.useProgram(pV); gl.bindTexture(gl.TEXTURE_2D, fb[cur].t); gl.uniform1i(uV.uGrid, 0); gl.uniform1f(uV.uTime, t);
      gl.uniform1f(uV.uStr, .03); gl.uniform1f(uV.uAspect, cv.width / cv.height); gl.uniform1f(uV.uFadeH, o.fadeH); gl.uniform1f(uV.uScale, o.scale);
      gl.uniform3fv(uV.uDark, COLS[0]); gl.uniform3fv(uV.uMid, COLS[1]); gl.uniform3fv(uV.uGlow, COLS[2]); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!shown) { shown = true; cv.style.visibility = 'visible'; } };
    const loop = n => { raf = requestAnimationFrame(loop); draw(n); };
    if (reduce) { requestAnimationFrame(draw); return; }
    let inView = false;
    new IntersectionObserver(es => { inView = es.at(-1).isIntersecting; if (inView && !document.hidden) { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } } else { cancelAnimationFrame(raf); raf = 0; } }).observe(host);
  }
  fluid($('[data-fluid=hero]'), { fadeH: .95, scale: 2.2 });
  fluid($('[data-fluid=end]'), { fadeH: .8, scale: 2.4 });

  /* 3. Navigation */
  const onScroll = () => nav && nav.classList.toggle('is-scrolled', scrollY > 20);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const triggers = $$('[data-mega]');
  let closeT;
  const closeAll = () => { triggers.forEach(b => { b.classList.remove('is-open'); $('#' + b.dataset.mega).classList.remove('is-open'); }); nav && nav.classList.remove('is-menu'); };
  const open = b => { clearTimeout(closeT); closeAll(); b.classList.add('is-open'); $('#' + b.dataset.mega).classList.add('is-open'); nav.classList.add('is-menu'); };
  triggers.forEach(b => {
    const m = $('#' + b.dataset.mega);
    b.addEventListener('click', e => { e.preventDefault(); b.classList.contains('is-open') ? closeAll() : open(b); });
    if (!coarse) {
      b.addEventListener('mouseenter', () => open(b));
      [b, m].forEach(el => el.addEventListener('mouseleave', () => { closeT = setTimeout(closeAll, 220); }));
      m.addEventListener('mouseenter', () => clearTimeout(closeT));
    }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); document.body.classList.remove('drk-menu-open'); } });
  const burger = $('[data-drk=burger]');
  burger && burger.addEventListener('click', e => { e.preventDefault(); const o = document.body.classList.toggle('drk-menu-open'); nav.classList.toggle('is-menu', o); });
  $$('.drk-mnav a, .drk-mega a').forEach(a => a.addEventListener('click', () => { document.body.classList.remove('drk-menu-open'); closeAll(); }));

  /* 4. Expertises : la scène suit le chapitre qui passe au milieu de l'écran */
  const stage = $('[data-drk=stage]');
  const mobile = matchMedia('(max-width: 991px)').matches;
  if (stage) {
    const scenes = $$('.drk-scene', stage), dots = $$('.drk-stage-dot', stage), chapters = $$('.drk-chapter');
    const COLORS = ['#2c79fe', '#714b67', '#d66f15'];
    if (mobile) chapters.forEach((ch, i) => { const box = document.createElement('div'); box.className = 'drk-stage-m'; const c = scenes[i].cloneNode(true); c.classList.add('is-active'); box.appendChild(c); ch.appendChild(box); });
    const root = i => mobile ? $('.drk-scene', chapters[i]) : scenes[i];
    let active = -1, runId = 0;
    const setScene = i => {
      if (i === active) return; active = i;
      chapters.forEach((c, k) => c.classList.toggle('is-active', k === i));
      scenes.forEach((s, k) => s.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => d.classList.toggle('is-on', k === i));
      stage.style.setProperty('--sc', COLORS[i]);
      if (!mobile) run(i);
    };
    const run = i => { const my = ++runId, alive = () => my === runId || mobile; const r = root(i);
      if (i === 0) iaLoop(r, alive); if (i === 1) flows(r, alive); if (i === 2) vote(r, alive); };
    const cio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setScene(chapters.indexOf(e.target)); }), { rootMargin: '-50% 0px -50% 0px' });
    chapters.forEach(c => cio.observe(c));
    setScene(0);
    if (mobile) [0, 1, 2].forEach(i => run(i));
  }
  async function iaLoop(r, alive) {
    if (!r || reduce) return;
    const convs = $$('.drk-conv', r), tabs = $$('.drk-ia-tab', r);
    convs.forEach(c => [...c.children].forEach(n => n.classList.add('drk-anim')));
    let k = 0;
    while (alive()) {
      const c = convs[k++ % convs.length], kids = [...c.children];
      convs.forEach(x => x.classList.toggle('is-active', x === c));
      tabs.forEach((t, j) => t.classList.toggle('is-on', String(j) === c.dataset.tab));
      kids.forEach(n => n.classList.remove('is-in')); kids[1].style.display = '';
      await wait(300); if (!alive()) return; kids[0].classList.add('is-in');
      await wait(900); if (!alive()) return; kids[1].classList.add('is-in');
      await wait(1500); if (!alive()) return; kids[1].style.display = 'none'; kids[2].classList.add('is-in');
      await wait(400); if (!alive()) return; kids[3].classList.add('is-in');
      await wait(4200);
    }
  }
  async function flows(r, alive) {
    if (!r || reduce) return;
    const f = $$('.drk-flow', r); f.forEach(n => { n.classList.add('drk-anim'); n.classList.remove('is-in'); });
    for (const n of f) { await wait(650); if (!alive()) return; n.classList.add('is-in'); }
  }
  async function vote(r, alive) {
    if (!r || reduce) return;
    const opts = $$('.drk-vote-opt', r), ok = $('.drk-ph-ok', r);
    while (alive()) {
      opts.forEach(o => o.classList.remove('is-on')); ok.classList.remove('is-in');
      await wait(1300); if (!alive()) return; opts[0].classList.add('is-on');
      await wait(450); if (!alive()) return; ok.classList.add('is-in');
      await wait(3400);
    }
  }

  /* 5. Agents IA : les yeux suivent la souris */
  const crew = $('[data-drk=crew]');
  if (crew && !coarse && !reduce) {
    const mz = $$('.drk-mz', crew); let pend = false, px = 0, py = 0;
    addEventListener('pointermove', e => { px = e.clientX; py = e.clientY; if (pend) return; pend = true;
      requestAnimationFrame(() => { pend = false; mz.forEach(m => { const r = m.getBoundingClientRect(), dx = px - (r.left + r.width / 2), dy = py - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 400) * r.width * .09;
        const eyes = $('.drk-mz-eyes', m); eyes.style.setProperty('--ex', (dx / d * k).toFixed(1) + 'px'); eyes.style.setProperty('--ey', (dy / d * k * .7).toFixed(1) + 'px'); }); }); }, { passive: true });
  }

  /* 6. Schéma : fils entre les blocs (décor) */
  const schema = $('[data-drk=schema]'), wires = $('[data-drk=wires]');
  const NS = 'http://www.w3.org/2000/svg';
  function drawWires() {
    if (!schema || getComputedStyle($('.drk-frame-head') || schema).display === 'none') { wires && (wires.innerHTML = ''); return; }
    wires.innerHTML = ''; const svg = document.createElementNS(NS, 'svg'); wires.appendChild(svg);
    const base = schema.getBoundingClientRect();
    const box = n => { const r = $(`[data-n="${n}"]`, schema).getBoundingClientRect(); return { l: r.left - base.left, r: r.right - base.left, t: r.top - base.top, h: r.height, cy: r.top - base.top + r.height / 2 }; };
    const core = box('core');
    const mk = (x1, y1, x2, y2, col, delay) => {
      const p = document.createElementNS(NS, 'path'), dx = (x2 - x1) * .5, d = `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
      p.setAttribute('d', d); p.setAttribute('pathLength', '1'); p.style.transitionDelay = delay + 's'; svg.appendChild(p);
      if (reduce) return;
      const c = document.createElementNS(NS, 'circle'); c.setAttribute('r', '3'); c.setAttribute('fill', col); c.style.opacity = 0;
      const am = document.createElementNS(NS, 'animateMotion'); am.setAttribute('dur', (2.8 + Math.random()).toFixed(2) + 's'); am.setAttribute('repeatCount', 'indefinite');
      am.setAttribute('begin', (delay + 1.4 + Math.random() * 2).toFixed(2) + 's'); am.setAttribute('path', d); am.addEventListener('beginEvent', () => { c.style.opacity = 1; });
      c.appendChild(am); svg.appendChild(c);
    };
    ['in1', 'in2', 'in3', 'in4'].forEach((n, i) => { const b = box(n); mk(b.r, b.cy, core.l, core.t + core.h * (.3 + i * .14), '#2c79fe', i * .12); });
    ['out1', 'out2', 'out3', 'out4'].forEach((n, i) => { const b = box(n); mk(core.r, core.t + core.h * (.3 + i * .14), b.l, b.cy, ['#2c79fe', '#d66f15', '#714b67', '#714b67'][i], .5 + i * .12); });
  }
  if (schema) {
    new IntersectionObserver(es => { if (es[0].isIntersecting) { drawWires(); requestAnimationFrame(() => schema.classList.add('is-in')); } }, { threshold: .25 }).observe(schema);
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => schema.classList.contains('is-in') && drawWires(), 150); });
  }

  /* 7. Par où commencer : onglets */
  const picker = $('[data-drk=picker]');
  if (picker) {
    const pains = $$('.drk-pain', picker), ans = $$('.drk-ans', picker), box = $('.drk-answers', picker);
    const AC = ['#2c79fe', '#714b67', '#2c79fe', '#d66f15', '#714b67', '#2c79fe'];
    pains.forEach((p, i) => p.addEventListener('click', e => { e.preventDefault();
      pains.forEach(x => x.classList.toggle('is-active', x === p)); ans.forEach((a, k) => a.classList.toggle('is-active', k === i)); box.style.setProperty('--ac', AC[i] || AC[0]); }));
  }

  /* 8. Réalisations : rail horizontal */
  const rail = $('[data-drk=rail]'), prev = $('[data-drk=prev]'), next = $('[data-drk=next]');
  if (rail && prev && next) {
    const step = () => $('.drk-case', rail).offsetWidth + 16;
    prev.addEventListener('click', e => { e.preventDefault(); rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', e => { e.preventDefault(); rail.scrollBy({ left: step(), behavior: 'smooth' }); });
    const upd = () => { prev.classList.toggle('is-disabled', rail.scrollLeft < 8); next.classList.toggle('is-disabled', rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8); };
    rail.addEventListener('scroll', upd, { passive: true }); upd();
  }

  /* 9. Citation : les mots s'allument au fil du scroll */
  const qb = $('[data-drk=quote]'), track = $('[data-drk=qtrack]');
  if (qb && track) {
    qb.innerHTML = qb.textContent.trim().split(/\s+/).map(w => `<span>${w} </span>`).join('');
    const words = [...qb.children]; let qt = false;
    const light = () => { qt = false; const r = track.getBoundingClientRect(), prog = Math.min(1, Math.max(0, (-r.top + innerHeight * .4) / (r.height - innerHeight * .5))), lit = Math.round(prog * 1.15 * words.length); words.forEach((s, i) => s.classList.toggle('is-on', i < lit)); };
    if (!reduce) addEventListener('scroll', () => { if (!qt) { qt = true; requestAnimationFrame(light); } }, { passive: true });
  }

  /* 10. Méthode : étapes qui avancent seules */
  const stepsBox = $('[data-drk=steps]'), mvs = $$('[data-drk=mvis] .drk-mv');
  if (stepsBox) {
    const steps = $$('.drk-step', stepsBox);
    const setStep = i => { steps.forEach((s, k) => s.classList.toggle('is-active', k === i)); mvs.forEach((m, k) => m.classList.toggle('is-active', k === i)); };
    steps.forEach((s, i) => { s.addEventListener('click', e => { e.preventDefault(); setStep(i); }); $('.drk-step-fill', s).addEventListener('animationend', () => setStep((i + 1) % steps.length)); });
    stepsBox.addEventListener('mouseenter', () => stepsBox.classList.add('is-paused'));
    stepsBox.addEventListener('mouseleave', () => stepsBox.classList.remove('is-paused'));
    new IntersectionObserver(es => stepsBox.classList.toggle('is-paused', !es[0].isIntersecting)).observe(stepsBox);
  }

  /* 11. Equipe : bandeau de portraits en boucle (on duplique les portraits existants) */
  const faces = $('[data-drk=faces]');
  if (faces && !reduce) [...faces.children].forEach(n => { const c = n.cloneNode(true); c.setAttribute('aria-hidden', 'true'); faces.appendChild(c); });

  /* 12. FAQ */
  $$('[data-drk=faq] .drk-qa-q').forEach(q => q.addEventListener('click', e => { e.preventDefault(); q.parentElement.classList.toggle('is-open'); }));
})();
