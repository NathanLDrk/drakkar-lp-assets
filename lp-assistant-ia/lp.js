/* =========================================================
   LP Ads Drakkar — v2 · animations (vanilla JS, sans dépendance)
   ========================================================= */
(function () {
  "use strict";
  var d = document, w = window;
  var reduced = w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Config propre à chaque LP (window.LPA, défini avant ce script) : hero, workflow, cases, orb, shareSubject.
  // Sans config, on joue le scénario du hub « Assistant IA ».
  var CFG = w.LPA || {};

  /* ---------- Icônes (Lucide, MIT) ---------- */
  var ICONS = {
    "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    "arrow-up-right": '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
    "check": '<path d="M20 6 9 17l-5-5"/>',
    "plus": '<path d="M5 12h14"/><path d="M12 5v14"/>',
    "search": '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    "monitor": '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8"/><path d="M12 17v4"/>',
    "mic": '<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><path d="M12 19v3"/>',
    "users": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    "link": '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    "mail": '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "scan-text": '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/>',
    "sheet": '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 9v12"/><path d="M15 9v12"/>',
    "box": '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    "file-text": '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
    "user-check": '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    "send": '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
    "clock": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    "pencil": '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
    "bell": '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    "list-checks": '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/>',
    "database": '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/><path d="M3 12a9 3 0 0 0 18 0"/>',
    "filter": '<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
    "calculator": '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M8 6h8"/><path d="M16 14v4"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
    "phone": '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    "bar-chart": '<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    "inbox": '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    "star": '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    "tag": '<path d="M12.59 2.59A2 2 0 0 0 11.17 2H4a2 2 0 0 0-2 2v7.17a2 2 0 0 0 .59 1.42l8.7 8.7a2.43 2.43 0 0 0 3.42 0l6.58-6.58a2.43 2.43 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1"/>',
    "archive": '<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
    "shield": '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    "refresh": '<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>',
    "alert": '<circle cx="12" cy="12" r="10"/><path d="M12 8v4"/><path d="M12 16h.01"/>',
    "euro": '<path d="M4 10h12"/><path d="M4 14h9"/><path d="M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2"/>',
    "bank": '<path d="M3 22h18"/><path d="M6 18v-7"/><path d="M10 18v-7"/><path d="M14 18v-7"/><path d="M18 18v-7"/><path d="M12 2 20 7H4z"/>',
    "calendar": '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    "repeat": '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>'
  };
  function icon(name, size, sw) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }
  d.querySelectorAll("i[data-icon]").forEach(function (el) {
    var n = el.getAttribute("data-icon"), s = 18;
    if (el.closest(".lpa-announce-ico,.lpa-contact-points")) s = 13;
    if (el.closest(".lpa-app-plus,.lpa-app-search,.lpa-composer-plus,.lpa-app-head-ico")) s = 15;
    if (el.closest(".lpa-composer-mic")) s = 17;
    if (el.closest(".lpa-share-ico")) s = 20;
    if (el.closest(".lpa-pill-sm,.lpa-wf-ico,.lpa-fold,.lpa-hero-trust")) s = 15;
    if (el.closest(".lpa-feat-ico")) s = 17;
    el.innerHTML = icon(n, s, s <= 15 ? 2.2 : 1.9);
  });

  /* ---------- Helpers ---------- */
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function h(tag, cls, html) { var n = d.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; }
  function onView(node, cb, th) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { cb(e.isIntersecting); }); }, { threshold: th || 0.2 });
    io.observe(node);
  }
  function fmt(n, dec) { return n.toLocaleString("fr-FR", { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); }

  /* ---------- Apparitions ---------- */
  d.querySelectorAll("[data-reveal]").forEach(function (n) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { n.classList.add("lpa-in"); io.disconnect(); } });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    io.observe(n);
  });

  /* ---------- Orbe : les yeux suivent la souris ---------- */
  var orbs = d.querySelectorAll(".lpa-orb");
  w.addEventListener("mousemove", function (e) {
    orbs.forEach(function (o) {
      var r = o.getBoundingClientRect(); if (r.bottom < 0 || r.top > w.innerHeight) return;
      var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      var len = Math.hypot(dx, dy) || 1, k = Math.min(1, len / 300);
      var eyes = o.querySelector(".lpa-orb-eyes");
      eyes.style.setProperty("--ex", (dx / len * 0.08 * k).toFixed(3) + "em");
      eyes.style.setProperty("--ey", (dy / len * 0.07 * k).toFixed(3) + "em");
    });
  }, { passive: true });

  /* =========================================================
     HERO : simulation d'un assistant IA qui prépare un devis
     ========================================================= */
  (function heroChat() {
    var app = d.getElementById("app"); if (!app || !d.getElementById("chatIn")) return;
    var chatIn = d.getElementById("chatIn"), last = d.getElementById("agentLast");
    var composer = app.querySelector(".lpa-composer-txt"), composerDefault = composer.textContent;
    function agent(k) { return app.querySelector('[data-agent="' + k + '"] .lpa-agent-last'); }
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);
    var visible = false;
    onView(app, function (v) { visible = v; }, 0.25);

    function add(node) { chatIn.appendChild(node); return node; }
    async function until() { while (!visible) await wait(300); }
    async function typeComposer(text) {
      composer.classList.add("lpa-typing"); composer.textContent = "";
      for (var i = 0; i < text.length; i++) { composer.textContent += text[i]; await wait(text[i] === " " ? 22 : 16); }
      await wait(350);
      composer.textContent = composerDefault; composer.classList.remove("lpa-typing");
    }
    async function think(label, ms) {
      var t = add(h("div", "lpa-m lpa-m-think", "<span><i></i><i></i><i></i></span>" + label));
      await wait(ms); t.remove();
    }
    function status(el, kind, text) { el.className = "lpa-st lpa-st-" + kind; el.textContent = text; }
    async function moveCursorTo(target) {
      var a = app.getBoundingClientRect(), r = target.getBoundingClientRect();
      cursor.style.transition = "none";
      cursor.style.transform = "translate(" + (a.width - 60) + "px," + (a.height - 40) + "px)";
      cursor.getBoundingClientRect();
      cursor.style.transition = "";
      cursor.style.opacity = 1;
      cursor.style.transform = "translate(" + (r.left - a.left + r.width * 0.45) + "px," + (r.top - a.top + r.height * 0.4) + "px)";
      await wait(1100);
    }

    function writing(on, text) { last.textContent = text || "écrit…"; last.classList.toggle("lpa-typing", !!on); }
    function tool(title, st, desc, body) {
      return add(h("div", "lpa-tool", '<div class="lpa-tool-head">' + title + '<span class="lpa-st lpa-st-work">' + st + '</span></div>' +
        (desc ? '<p class="lpa-tool-desc">' + desc + '</p>' : "") + (body != null ? '<div class="lpa-tool-body">' + body + '</div>' : "")));
    }
    async function count(el, to, ms, dec) {
      var t0 = performance.now();
      await new Promise(function (res) {
        (function step(now) {
          var p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(to * e, dec);
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }
    async function type(el, text, ms) { el.textContent = ""; for (var i = 0; i < text.length; i++) { el.textContent += text[i]; await wait(ms || 14); } }
    async function click(btn) {
      await moveCursorTo(btn);
      btn.classList.add("lpa-pressed"); await wait(180); btn.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;
    }
    var api = { app: app, h: h, add: add, wait: wait, think: think, status: status, typeComposer: typeComposer, writing: writing,
      tool: tool, count: count, type: type, click: click, agent: agent, last: last, fmt: fmt, icon: icon };

    // Scénario par défaut (hub) : l'assistant devis
    async function devis() {
      var relAgent = agent("relances");
      relAgent.textContent = "6 factures relancées, 2 réglées";
      add(h("div", "lpa-m lpa-m-time", "Aujourd'hui · 08:42"));
      await wait(700);
      var ask = "Rénov'Habitat nous a envoyé une demande de devis ce matin. Tu peux le préparer avec nos tarifs habituels ?";
      await typeComposer(ask);
      add(h("div", "lpa-m lpa-m-user", ask));
      last.textContent = "écrit…"; last.classList.add("lpa-typing");
      await wait(500);
      await think("Réfléchit", 1300);
      add(h("div", "lpa-m lpa-m-bot", "Je m'en occupe. Je retrouve le mail et votre grille tarifaire 2026."));
      await wait(900);

      // Outil 1 : lecture du mail
      var t1 = add(h("div", "lpa-tool",
        '<div class="lpa-tool-head">Lecture du mail<span class="lpa-st lpa-st-work">En cours</span></div>' +
        '<p class="lpa-tool-desc">Demande de M. Martin, reçue à 07:58</p>' +
        '<div class="lpa-tool-body"><div class="lpa-mailv"><div class="lpa-mailv-from"><span>M. Martin · Rénov\'Habitat</span><span>07:58</span></div>' +
        '<p class="lpa-mailv-subj">Demande de devis – chantier de Rezé</p>' +
        '<p>Bonjour, pouvez-vous nous faire un devis pour <mark>48 m² de carrelage 60×60</mark> anthracite, avec <mark>colle et joints</mark>, <mark>livré sur le chantier</mark> à Rezé <mark>avant le 15 octobre</mark> ? Merci !</p></div>' +
        '<span class="lpa-scanline"></span></div>'));
      var st1 = t1.querySelector(".lpa-st"), marks = t1.querySelectorAll("mark");
      await wait(1300);
      for (var i = 0; i < marks.length; i++) { marks[i].classList.add("lpa-on"); await wait(420); }
      var fields = h("div", "lpa-fields");
      t1.appendChild(fields);
      var F = [["Client", "Rénov'Habitat"], ["Produit", "Carrelage 60×60"], ["Surface", "48 m²"], ["Livraison", "Rezé, avant le 15/10"]];
      for (var j = 0; j < F.length; j++) { fields.appendChild(h("span", "", F[j][0] + " <b>" + F[j][1] + "</b>")); await wait(260); }
      await wait(400);
      status(st1, "done", "Terminé");
      t1.querySelector(".lpa-scanline").remove();
      await wait(800);
      await think("Calcule le devis", 1200);

      // Outil 2 : devis
      var t2 = add(h("div", "lpa-tool",
        '<div class="lpa-tool-head">Devis D-2026-118<span class="lpa-st lpa-st-work">Rédaction</span></div>' +
        '<p class="lpa-tool-desc">Tarifs 2026 appliqués · client fidèle : remise de 5 %</p>' +
        '<div class="lpa-tool-body lpa-quote"><div class="lpa-quote-head"><b>Rénov\'Habitat</b><span>Chantier de Rezé</span></div></div>'));
      var st2 = t2.querySelector(".lpa-st"), qb = t2.querySelector(".lpa-quote");
      var R = [["Carrelage 60×60 anthracite · 48 m²", "1 872,00 €"], ["Colle et joints", "214,00 €"], ["Livraison sur chantier", "90,00 €"], ["Remise fidélité −5 %", "−108,80 €"]];
      await wait(500);
      for (var k = 0; k < R.length; k++) { qb.appendChild(h("div", "lpa-q-row", "<span>" + R[k][0] + "</span><b>" + R[k][1] + "</b>")); await wait(480); }
      var tot = h("div", "lpa-q-total", "<span>Total HT</span><b>0,00 €</b>");
      qb.appendChild(tot);
      var tb = tot.querySelector("b"), t0 = performance.now();
      await new Promise(function (res) {
        (function step(now) {
          var p = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - p, 3);
          tb.textContent = fmt(2067.2 * e, 2) + " €";
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
      await wait(500);
      status(st2, "need", "À valider");
      var actions = h("div", "lpa-tool-actions", '<span class="lpa-pill lpa-pill-dark">Valider et envoyer</span><span class="lpa-pill lpa-pill-white">Modifier</span>');
      t2.appendChild(actions);
      last.textContent = "Devis prêt, en attente de validation"; last.classList.remove("lpa-typing");
      await wait(900);
      var okBtn = actions.querySelector(".lpa-pill-dark");
      await moveCursorTo(okBtn);
      okBtn.classList.add("lpa-pressed"); await wait(180); okBtn.classList.remove("lpa-pressed");
      await wait(250);
      cursor.style.opacity = 0;
      actions.outerHTML = '<p class="lpa-tool-desc" style="margin-top:10px">Validé par Marc · envoyé à 08:44</p>';
      status(st2, "done", "Envoyé");
      await wait(800);

      var chk = add(h("div", "lpa-m lpa-m-check"));
      var C = ["Devis envoyé à M. Martin", "Fiche client mise à jour", "Relance prévue jeudi s'il ne répond pas"];
      for (var c = 0; c < C.length; c++) { chk.appendChild(h("div", "", C[c])); await wait(380); }
      last.textContent = "✓ Devis D-2026-118 envoyé";
      await wait(900);
      add(h("div", "lpa-m lpa-m-sys", '<span class="lpa-av lpa-av-3 lpa-av-sm"><span class="lpa-av-eyes"><i></i><i></i></span></span> Relances clients a pris le relais pour jeudi'));
      relAgent.textContent = "Relance Rénov'Habitat prévue jeudi";
    }

    async function run() {
      chatIn.innerHTML = ""; chatIn.classList.remove("lpa-fade");
      last.textContent = "Nouvelle conversation"; last.classList.remove("lpa-typing");
      await until();
      await (CFG.hero || devis)(api);
      await wait(5200);
      chatIn.classList.add("lpa-fade");
      await wait(700);
    }
    if (reduced) { return; }
    (async function loop() { while (true) { await run(); } })();
  })();

  /* ---------- Bento : animations actives seulement à l'écran ---------- */
  (function bento() {
    var b = d.querySelector(".lpa-bento"); if (!b || reduced) return;
    onView(b, function (v) { b.classList.toggle("lpa-play", v); }, 0.15);
    var typed = b.querySelector(".lpa-va-q [data-text]"), ans = b.querySelector(".lpa-va-a");
    if (!typed) return;
    var text = typed.getAttribute("data-text");
    (async function loop() {
      while (true) {
        if (!b.classList.contains("lpa-play")) { await wait(400); continue; }
        typed.textContent = ""; ans.classList.remove("lpa-on");
        await wait(600);
        for (var i = 0; i < text.length; i++) { typed.textContent += text[i]; await wait(45); }
        await wait(500); ans.classList.add("lpa-on");
        await wait(4200); ans.classList.remove("lpa-on"); await wait(500);
      }
    })();
  })();

  /* ---------- Workflow : exécution animée ---------- */
  (function workflow() {
    var wf = d.getElementById("wf"); if (!wf) return;
    var canvas = wf.querySelector(".lpa-wf-canvas"), svg = wf.querySelector(".lpa-wf-svg");
    var stateEl = d.getElementById("wfState"), countEl = d.getElementById("wfCount"), logEl = d.getElementById("wfLog");
    var SVGNS = "http://www.w3.org/2000/svg";
    var nodes = {}, edges = {}, visible = false, gen = 0;
    wf.querySelectorAll(".lpa-wf-node").forEach(function (n) { nodes[n.dataset.id] = n; });
    function svgEl(tag, attrs) { var n = d.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; }
    function rel(n) { var r = n.getBoundingClientRect(), b = canvas.getBoundingClientRect(); return { l: r.left - b.left, t: r.top - b.top, r: r.right - b.left, b: r.bottom - b.top, cx: r.left - b.left + r.width / 2, cy: r.top - b.top + r.height / 2 }; }
    function layout() {
      svg.innerHTML = ""; edges = {};
      var W = canvas.clientWidth, H = canvas.clientHeight, vertical = w.innerWidth <= 767;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      Object.keys(nodes).forEach(function (id) {
        var to = nodes[id].dataset.to; if (!to) return;
        to.split(",").forEach(function (t) {
          var a = rel(nodes[id]), b = rel(nodes[t]), dd, p1, p2;
          if (!vertical) {
            p1 = [a.r, a.cy]; p2 = [b.l, b.cy]; var mx = (p1[0] + p2[0]) / 2;
            dd = "M" + p1[0] + " " + p1[1] + " C" + mx + " " + p1[1] + " " + mx + " " + p2[1] + " " + p2[0] + " " + p2[1];
          } else {
            p1 = [a.cx, a.b]; p2 = [b.cx, b.t]; var my = (p1[1] + p2[1]) / 2;
            dd = "M" + p1[0] + " " + p1[1] + " C" + p1[0] + " " + my + " " + p2[0] + " " + my + " " + p2[0] + " " + p2[1];
          }
          var line = svgEl("path", { "class": "lpa-wf-line", d: dd });
          svgEl("circle", { "class": "lpa-wf-port", cx: p1[0], cy: p1[1], r: 3.5 });
          svgEl("circle", { "class": "lpa-wf-port", cx: p2[0], cy: p2[1], r: 3.5 });
          edges[id + ">" + t] = line;
        });
      });
    }
    function travel(key, ms) {
      var line = edges[key]; if (!line) return Promise.resolve();
      var my = gen, L = line.getTotalLength();
      var trail = svgEl("path", { "class": "lpa-wf-trail", d: line.getAttribute("d") });
      var dot = svgEl("circle", { "class": "lpa-wf-packet", r: 4 });
      var seg = Math.min(40, L * 0.4);
      trail.style.strokeDasharray = seg + " " + (L + seg);
      return new Promise(function (res) {
        var t0 = performance.now();
        (function step(now) {
          if (my !== gen) { trail.remove(); dot.remove(); return res(); }
          var p = Math.min(1, (now - t0) / ms), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pos = e * L;
          trail.style.strokeDashoffset = -(pos - seg);
          var pt = line.getPointAtLength(pos); dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
          if (p < 1) return requestAnimationFrame(step);
          line.classList.add("lpa-on"); trail.remove(); dot.remove(); res();
        })(t0);
      });
    }
    function set(id, state) { var n = nodes[id]; n.classList.remove("lpa-is-work", "lpa-is-done", "lpa-is-wait"); if (state) n.classList.add("lpa-is-" + state); }
    function say(t) { stateEl.textContent = t; }
    async function work(ids, label, ms) {
      say(label); ids.forEach(function (i) { set(i, "work"); });
      await wait(ms); ids.forEach(function (i) { set(i, "done"); });
    }
    async function until() { while (!visible) await wait(300); }
    // Étapes jouées dans l'ordre ; les liens parcourus sont ceux qui relient l'étape précédente à la suivante (data-to)
    var FLOW = CFG.workflow || {
      idle: "En attente d'un mail…",
      steps: [
        { ids: ["mail"], say: "Nouveau mail reçu de Rénov'Habitat", ms: 900 },
        { ids: ["read"], say: "L'IA lit la demande…", ms: 1500 },
        { ids: ["tarifs", "stock"], say: "Vérification des tarifs et du stock…", ms: 1300 },
        { ids: ["devis"], say: "Rédaction du devis…", ms: 1600 },
        { ids: ["valid"], human: true, say: "En attente de votre validation…", after: "Validé par Marc", ms: 2000 },
        { ids: ["send", "crm"], say: "Envoi du devis et mise à jour du client…", ms: 1200 },
        { ids: ["relance"], instant: true, say: "Terminé · relance programmée jeudi 9 h" }
      ],
      done: "devis envoyé"
    };
    async function run() {
      var my = ++gen;
      Object.keys(nodes).forEach(function (i) { set(i, null); });
      Object.keys(edges).forEach(function (k) { edges[k].classList.remove("lpa-on"); });
      wf.classList.remove("lpa-running"); say(FLOW.idle);
      await until(); await wait(1200); if (my !== gen) return;
      wf.classList.add("lpa-running");
      for (var i = 0; i < FLOW.steps.length; i++) {
        var s = FLOW.steps[i];
        if (i > 0) {
          var keys = [];
          FLOW.steps[i - 1].ids.forEach(function (a) { s.ids.forEach(function (b) { if (edges[a + ">" + b]) keys.push(a + ">" + b); }); });
          await Promise.all(keys.map(function (k) { return travel(k, 800); }));
        }
        if (my !== gen) return;
        if (s.human) {
          s.ids.forEach(function (id) { set(id, "wait"); }); say(s.say);
          await wait(s.ms || 2000); s.ids.forEach(function (id) { set(id, "done"); });
          if (s.after) say(s.after);
          await wait(500);
        } else if (s.instant) {
          s.ids.forEach(function (id) { set(id, "done"); }); say(s.say);
        } else {
          await work(s.ids, s.say, s.ms || 1200);
        }
      }
      if (my !== gen) return;
      countEl.textContent = (+countEl.textContent + 1);
      logEl.textContent = "Dernière exécution : terminée en 1 min " + (5 + Math.floor(Math.random() * 20)) + " s · " + FLOW.done;
      wf.classList.remove("lpa-running");
      await wait(4500);
    }
    layout();
    var rt; w.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { layout(); }, 200); });
    onView(wf, function (v) { visible = v; }, 0.35);
    if (reduced) { Object.keys(nodes).forEach(function (i) { set(i, "done"); }); return; }
    (async function loop() { while (true) { await run(); } })();
  })();

  /* ---------- Cas d'usage : un workflow par cas ---------- */
  (function useCases() {
    var panel = d.getElementById("ucPanel"); if (!panel) return;
    var chips = d.getElementById("ucChips"), desc = d.getElementById("ucDesc");
    var canvas = d.getElementById("ucCanvas"), svg = canvas.querySelector("svg");
    var stateEl = d.getElementById("ucState"), nameEl = d.getElementById("ucName"), logEl = d.getElementById("ucLog");
    var SVGNS = "http://www.w3.org/2000/svg";
    function N(ic, type, title, sub, human) { return { icon: ic, type: type, title: title, sub: sub, human: !!human }; }
    // Chaque cas : niveaux successifs (1 ou 2 blocs par niveau) + texte d'état par niveau
    // Une LP peut fournir ses propres cas (blocs en tableaux : [icône, type, titre, sous-titre, humain?])
    var CASES = (CFG.cases || [
      { name: "Devis", strong: "Des devis prêts en quelques minutes.", text: "L'assistant lit la demande du client, reprend vos tarifs et votre stock, et vous prépare le devis. Vous validez, il l'envoie.",
        levels: [[N("mail", "Déclencheur", "Demande de devis", "Reçue par email")], [N("scan-text", "IA", "Lecture de la demande", "Client, produits, délai")], [N("sheet", "Excel", "Tarifs 2026", "Prix et remises"), N("box", "Stock", "Disponibilité", "48 m² en dépôt")], [N("file-text", "IA", "Devis rédigé", "2 067 € HT")], [N("user-check", "Vous", "Validation", "En 1 clic", true)], [N("send", "Email", "Envoyé au client", "PDF + message")]],
        says: ["Nouvelle demande reçue", "L'IA lit la demande…", "Tarifs et stock vérifiés", "Rédaction du devis…", "En attente de votre validation…", "Devis envoyé"], log: "Devis D-2026-118 envoyé à Rénov'Habitat" },
      { name: "Relances", strong: "Plus aucune facture oubliée.", text: "L'assistant repère les factures échues, vérifie si le paiement est arrivé et relance avec le bon ton, au bon moment.",
        levels: [[N("clock", "Déclencheur", "Facture échue", "F-0932 · 1 240 €")], [N("search", "Banque", "Paiement reçu ?", "Relevé vérifié : non")], [N("pencil", "IA", "Relance rédigée", "Ton cordial, 2e rappel")], [N("send", "Email", "Envoyée au client", "Facture jointe"), N("users", "Fichier clients", "Historique à jour", "Relance notée")], [N("bell", "Planning", "Rappel à J+7", "Appel si toujours impayé")]],
        says: ["Facture F-0932 échue depuis 5 jours", "Vérification du relevé bancaire…", "Rédaction de la relance…", "Relance envoyée", "Suivi programmé"], log: "6 factures relancées ce matin, 2 déjà réglées" },
      { name: "Saisie des commandes", strong: "Fini la ressaisie des bons de commande.", text: "Papier scanné, PDF ou email : l'assistant lit le bon, contrôle les références et le stock, puis saisit la commande dans votre logiciel.",
        levels: [[N("file-text", "Déclencheur", "Bon de commande", "PDF reçu de Leroy")], [N("scan-text", "IA", "Lecture du document", "12 lignes détectées")], [N("list-checks", "Catalogue", "Références", "12/12 reconnues"), N("box", "Stock", "Quantités", "1 rupture signalée")], [N("database", "Logiciel", "Commande saisie", "CMD-4471")], [N("send", "Email", "Confirmation client", "Avec délai de livraison")]],
        says: ["Bon de commande reçu", "Lecture du document…", "Contrôle des références et du stock…", "Saisie dans votre logiciel…", "Client confirmé"], log: "Commande CMD-4471 saisie en 40 s au lieu de 12 min" },
      { name: "Tri des emails", strong: "Une boîte mail enfin lisible.", text: "Chaque matin, l'assistant trie les mails, remonte les urgences, envoie les factures à la compta et prépare les réponses simples.",
        levels: [[N("mail", "Déclencheur", "47 nouveaux mails", "Depuis hier soir")], [N("filter", "IA", "Tri et priorités", "Par client et par sujet")], [N("bell", "Vous", "3 urgences", "Remontées en haut", true), N("calculator", "Compta", "8 factures", "Transmises au cabinet")], [N("pencil", "IA", "Brouillons prêts", "12 réponses à relire")]],
        says: ["47 mails reçus", "Tri en cours…", "Urgences remontées", "Réponses préparées"], log: "Boîte triée à 07:30 · 12 brouillons prêts" },
      { name: "Notes de frais", strong: "Une photo du ticket, et c'est réglé.", text: "Vos équipes photographient leurs tickets. L'assistant lit le montant et la TVA, classe la dépense et prépare l'export pour la compta.",
        levels: [[N("phone", "Téléphone", "Ticket photographié", "Restaurant · 64,50 €")], [N("scan-text", "IA", "Lecture du ticket", "Montant, TVA, date")], [N("list-checks", "IA", "Classement", "Repas client")], [N("user-check", "Manager", "Validation", "Regroupée en fin de mois", true)], [N("calculator", "Compta", "Export comptable", "Envoyé au cabinet")]],
        says: ["Nouveau ticket reçu", "Lecture du ticket…", "Classement de la dépense…", "En attente de validation…", "Export prêt"], log: "18 tickets traités ce mois-ci, 0 oubli" },
      { name: "Service client", strong: "Des réponses rapides, même quand vous êtes sur le terrain.", text: "L'assistant retrouve la commande du client, prépare une réponse précise et vous la soumet avant envoi.",
        levels: [[N("mail", "Déclencheur", "Question client", "« Où en est ma livraison ? »")], [N("search", "Logiciel", "Commande retrouvée", "Expédiée hier")], [N("pencil", "IA", "Réponse préparée", "Avec n° de suivi")], [N("user-check", "Vous", "Relecture", "Ou envoi automatique", true)], [N("send", "Email", "Réponse envoyée", "En 4 minutes")]],
        says: ["Question reçue", "Recherche de la commande…", "Rédaction de la réponse…", "En attente de relecture…", "Réponse envoyée"], log: "Temps de réponse moyen : 4 min" },
      { name: "Planning des tournées", strong: "Des tournées organisées toutes seules.", text: "L'assistant regroupe les livraisons du lendemain, propose les tournées, prévient les clients de leur créneau et envoie le planning aux chauffeurs.",
        levels: [[N("box", "Déclencheur", "Livraisons de demain", "23 commandes")], [N("bar-chart", "IA", "Tournées optimisées", "3 camions, 186 km")], [N("clock", "Agenda", "Planning à jour", "Créneaux bloqués"), N("send", "SMS", "Clients prévenus", "Créneau de 2 h")], [N("users", "Équipe", "Chauffeurs informés", "Feuille de route envoyée")]],
        says: ["Livraisons à planifier", "Calcul des tournées…", "Planning et SMS envoyés", "Équipe informée"], log: "Tournées de jeudi prêtes à 17:00" }
    ]).map(function (c) {
      c.levels = c.levels.map(function (lv) { return lv.map(function (n) { return Array.isArray(n) ? N.apply(null, n) : n; }); });
      return c;
    });
    var cur = 0, gen = 0, visible = false, edges = [];
    CASES.forEach(function (c, i) {
      var b = h("button", "lpa-uc-chip", '<span class="lpa-orb' + (CFG.orb ? " " + CFG.orb : "") + '" aria-hidden="true"><span class="lpa-orb-eyes"><i></i><i></i></span></span>' + c.name);
      b.type = "button"; b.setAttribute("role", "tab");
      b.addEventListener("click", function () { if (i !== cur) select(i); });
      chips.appendChild(b);
    });
    var chipEls = chips.querySelectorAll(".lpa-uc-chip");
    function rel(n) { var r = n.getBoundingClientRect(), b = canvas.getBoundingClientRect(); return { t: r.top - b.top, b: r.bottom - b.top, cx: r.left - b.left + r.width / 2 }; }
    function svgEl(tag, attrs) { var n = d.createElementNS(SVGNS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); svg.appendChild(n); return n; }
    function nodeHtml(n) {
      return '<div class="lpa-wf-n-head"><span class="lpa-wf-ico">' + icon(n.icon, 15, 2.2) + '</span><span class="lpa-wf-type">' + n.type + '</span><span class="lpa-wf-st"></span></div><p class="lpa-wf-n-title">' + n.title + '</p><p class="lpa-wf-n-sub">' + n.sub + "</p>";
    }
    function build(c) {
      canvas.querySelectorAll(".lpa-wf-node").forEach(function (n) { n.remove(); });
      c.els = c.levels.map(function (lv, li) {
        return lv.map(function (n, k) {
          var el = h("div", "lpa-wf-node" + (n.human ? " lpa-wf-human" : ""), nodeHtml(n));
          el.style.gridColumn = lv.length === 1 ? "1 / 3" : String(k + 1);
          if (lv.length === 1) { el.style.width = "64%"; el.style.justifySelf = "center"; }
          el.style.animationDelay = (li * 0.06) + "s";
          canvas.appendChild(el); return el;
        });
      });
    }
    function layout(c) {
      svg.innerHTML = ""; edges = [];
      svg.setAttribute("viewBox", "0 0 " + canvas.clientWidth + " " + canvas.clientHeight);
      for (var i = 1; i < c.els.length; i++) {
        edges[i] = [];
        c.els[i - 1].forEach(function (a) {
          c.els[i].forEach(function (b) {
            var p = rel(a), q = rel(b), my = (p.b + q.t) / 2;
            var dd = "M" + p.cx + " " + p.b + " C" + p.cx + " " + my + " " + q.cx + " " + my + " " + q.cx + " " + q.t;
            edges[i].push(svgEl("path", { "class": "lpa-wf-line", d: dd }));
            svgEl("circle", { "class": "lpa-wf-port", cx: p.cx, cy: p.b, r: 3.5 });
            svgEl("circle", { "class": "lpa-wf-port", cx: q.cx, cy: q.t, r: 3.5 });
          });
        });
      }
    }
    function travel(line, ms, my) {
      var L = line.getTotalLength(), seg = Math.min(30, L * 0.5);
      var trail = svgEl("path", { "class": "lpa-wf-trail", d: line.getAttribute("d") }), dot = svgEl("circle", { "class": "lpa-wf-packet", r: 4 });
      trail.style.strokeDasharray = seg + " " + (L + seg);
      return new Promise(function (res) {
        var t0 = performance.now();
        (function step(now) {
          if (my !== gen) { trail.remove(); dot.remove(); return res(); }
          var p = Math.min(1, (now - t0) / ms), e = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2, pos = e * L;
          trail.style.strokeDashoffset = -(pos - seg);
          var pt = line.getPointAtLength(pos); dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
          if (p < 1) return requestAnimationFrame(step);
          line.classList.add("lpa-on"); trail.remove(); dot.remove(); res();
        })(t0);
      });
    }
    function set(el, s) { el.classList.remove("lpa-is-work", "lpa-is-done", "lpa-is-wait"); if (s) el.classList.add("lpa-is-" + s); }
    async function run(c, my) {
      while (my === gen) {
        while (!visible && my === gen) await wait(300);
        if (my !== gen) return;
        c.els.forEach(function (lv) { lv.forEach(function (e) { set(e, null); }); });
        edges.forEach(function (lv) { if (lv) lv.forEach(function (e) { e.classList.remove("lpa-on"); }); });
        panel.classList.add("lpa-running");
        for (var i = 0; i < c.els.length; i++) {
          if (i > 0) await Promise.all(edges[i].map(function (e) { return travel(e, 650, my); }));
          if (my !== gen) return;
          stateEl.textContent = c.says[i];
          var human = c.levels[i].some(function (n) { return n.human; });
          c.els[i].forEach(function (e, k) { set(e, c.levels[i][k].human ? "wait" : "work"); });
          await wait(human ? 1500 : (i === 0 ? 600 : 1000));
          if (my !== gen) return;
          c.els[i].forEach(function (e) { set(e, "done"); });
        }
        logEl.textContent = c.log;
        panel.classList.remove("lpa-running");
        await wait(3500);
      }
    }
    function select(i) {
      cur = i; var c = CASES[i], my = ++gen;
      chipEls.forEach(function (b, k) { b.classList.toggle("lpa-is-on", k === i); b.setAttribute("aria-selected", k === i); });
      desc.innerHTML = "<b>" + c.strong + "</b> " + c.text;
      desc.style.animation = "none"; void desc.offsetHeight; desc.style.animation = "";
      nameEl.textContent = "Assistant · " + c.name;
      stateEl.textContent = "Prêt"; logEl.textContent = "Workflow « " + c.name + " »";
      panel.classList.remove("lpa-running");
      build(c);
      requestAnimationFrame(function () {
        layout(c);
        if (reduced) c.els.forEach(function (lv) { lv.forEach(function (e) { set(e, "done"); }); });
        else run(c, my);
      });
    }
    onView(panel, function (v) { visible = v; }, 0.3);
    var rt, lastW = w.innerWidth;
    w.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (w.innerWidth !== lastW) { lastW = w.innerWidth; select(cur); } }, 250); });
    select(0);
  })();

  /* ---------- Analyse : l'assistant passe des éléments au crible (CFG.prio) ---------- */
  (function prio() {
    var panel = d.getElementById("prio"); if (!panel || !CFG.prio) return;
    var body = panel.querySelector(".lpa-prio-body"), stateEl = panel.querySelector(".lpa-prio-state"), logEl = panel.querySelector(".lpa-prio-log");
    var ITEMS = CFG.prio, visible = false;
    onView(panel, function (v) { visible = v; }, 0.3);
    async function show(it, n) {
      body.classList.add("lpa-fade"); await wait(300);
      body.innerHTML = ""; body.classList.remove("lpa-fade");
      panel.classList.add("lpa-running");
      stateEl.textContent = "Analyse de " + (CFG.prioNoun || "l'e-mail") + " " + (n + 1) + " sur " + ITEMS.length + "…";
      var mail = body.appendChild(h("div", "lpa-prio-mail",
        '<div class="lpa-prio-from"><b>' + it.from + '</b><span>' + it.time + '</span></div><p class="lpa-prio-subj">' + it.subject + '</p><p class="lpa-prio-ex">' + it.excerpt + '</p><span class="lpa-scanline"></span>'));
      await wait(1400);
      var list = body.appendChild(h("div", "lpa-crit"));
      for (var i = 0; i < it.crit.length; i++) {
        list.appendChild(h("div", "lpa-crit-row", "<span>" + it.crit[i][0] + "</span><b>" + it.crit[i][1] + "</b>"));
        await wait(520);
      }
      var sl = mail.querySelector(".lpa-scanline"); if (sl) sl.remove();
      await wait(350);
      body.appendChild(h("div", "lpa-verdict lpa-verdict-" + it.kind,
        '<span class="lpa-verdict-t">' + icon(it.icon || "star", 16, 2.2) + it.verdict + '</span><span class="lpa-verdict-s">' + it.then + "</span>"));
      stateEl.textContent = it.state || "Classé";
      logEl.textContent = it.log || "";
      panel.classList.remove("lpa-running");
      await wait(4200);
    }
    (async function loop() {
      for (var n = 0; ; n = (n + 1) % ITEMS.length) {
        while (!visible) await wait(300);
        await show(ITEMS[n], n);
      }
    })();
  })();

  /* ---------- Compteurs : data-count="13" data-dec="1" data-suffix=" Md€" ---------- */
  d.querySelectorAll("[data-count]").forEach(function (el) {
    var to = parseFloat(el.getAttribute("data-count")), dec = +(el.getAttribute("data-dec") || 0), suf = (el.getAttribute("data-suffix") || "").trim(), done = false;
    // Webflow supprime l'espace en tête des attributs : on ajoute l'espace insécable ici
    function show(v) { el.textContent = fmt(v, dec) + (suf ? "\u00a0" + suf : ""); }
    if (reduced) return show(to);
    show(0);
    onView(el, function (v) {
      if (!v || done) return; done = true;
      var t0 = performance.now();
      (function step(now) { var p = Math.min(1, (now - t0) / 1400), e = 1 - Math.pow(1 - p, 3); show(to * e); if (p < 1) requestAnimationFrame(step); })(t0);
    }, 0.4);
  });

  /* ---------- Scénario : les étapes s'allument une à une (#scen) ---------- */
  (function scen() {
    var s = d.getElementById("scen"); if (!s) return;
    var steps = s.querySelectorAll(".lpa-scen-step"), fill = s.querySelector(".lpa-scen-fill"), visible = false;
    function setTo(n) {
      steps.forEach(function (st, i) { st.classList.toggle("lpa-on", i < n); });
      fill.style.setProperty("--p", n <= 1 ? "0%" : ((n - 1) / (steps.length - 1) * 100) + "%");
    }
    if (reduced) return setTo(steps.length);
    onView(s, function (v) { visible = v; }, 0.3);
    (async function loop() {
      while (true) {
        while (!visible) await wait(300);
        for (var n = 1; n <= steps.length; n++) { setTo(n); await wait(1100); }
        await wait(3500); setTo(0); await wait(600);
      }
    })();
  })();

  /* ---------- Animations propres à une LP (CFG.init) ---------- */
  if (CFG.init) CFG.init({ h: h, wait: wait, onView: onView, icon: icon, fmt: fmt, reduced: reduced });

  /* ---------- Méthode : la frise se remplit au scroll ---------- */
  (function timeline() {
    var tl = d.getElementById("timeline"); if (!tl) return;
    var fill = d.getElementById("tlFill"), steps = tl.querySelectorAll(".lpa-tl-step");
    function upd() {
      var r = tl.getBoundingClientRect(), line = w.innerHeight * 0.6;
      var p = Math.max(0, Math.min(1, (line - r.top) / r.height));
      fill.style.setProperty("--p", (p * 100) + "%");
      steps.forEach(function (s) { var sr = s.getBoundingClientRect(); s.classList.toggle("lpa-on", sr.top + 30 < line); });
    }
    if (reduced) { steps.forEach(function (s) { s.classList.add("lpa-on"); }); fill.style.setProperty("--p", "100%"); return; }
    w.addEventListener("scroll", upd, { passive: true }); w.addEventListener("resize", upd); upd();
  })();

  /* ---------- Partager la page ---------- */
  (function share() {
    var copy = d.getElementById("copyLink"), mail = d.getElementById("mailLink");
    var url = location.href.split("#")[0];
    if (mail) mail.href = "mailto:?subject=" + encodeURIComponent(CFG.shareSubject || "À regarder : l'IA pour notre entreprise") + "&body=" + encodeURIComponent("Je suis tombé sur ça, je pense que ça peut nous faire gagner pas mal de temps :\n\n" + url);
    if (copy) copy.addEventListener("click", function () {
      var lab = copy.querySelector("span");
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(function () {
        lab.textContent = "Lien copié !";
      }, function () { lab.textContent = url; }).then(function () { setTimeout(function () { lab.textContent = "Copier le lien"; }, 2200); });
    });
  })();

  /* ---------- FAQ ---------- */
  d.querySelectorAll(".lpa-faq-item").forEach(function (it, i) {
    if (i === 0) it.classList.add("lpa-open");
    var q = it.querySelector(".lpa-faq-q");
    q.addEventListener("click", function () { it.classList.toggle("lpa-open"); });
    q.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); it.classList.toggle("lpa-open"); } });
  });

  /* ---------- Formulaire (local : simulation d'envoi) ---------- */
  (function form() {
    var f = d.getElementById("lpForm"); if (!f) return;
    var qs = new URLSearchParams(location.search);
    ["utm_source", "utm_medium", "utm_campaign"].forEach(function (k) { var i = d.getElementById(k); if (i && qs.get(k)) i.value = qs.get(k); });
    // Sur Webflow, l'envoi est géré nativement (message de succès Webflow) : on ne simule qu'en local
    if (!w.Webflow) f.addEventListener("submit", function (e) { e.preventDefault(); f.classList.add("lpa-sent"); });
  })();
})();
