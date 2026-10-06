/* LP Ads Drakkar — config de la page /agent-ia/devis (lue par lp.js, à charger avant lui) */
window.LPA = {
  orb: "lpa-orb-2",
  shareSubject: "À regarder : un assistant IA pour préparer nos devis",
  prioNoun: "la demande",

  // Workflow : une demande de devis, validée par vous
  workflow: {
    idle: "En attente d'une demande…",
    steps: [
      { ids: ["mail"], say: "Demande de devis de Rénov'Habitat", ms: 900 },
      { ids: ["read"], say: "L'IA lit la demande…", ms: 1400 },
      { ids: ["tarifs", "stock"], say: "Recherche des tarifs et du stock…", ms: 1300 },
      { ids: ["devis"], say: "Rédaction du devis…", ms: 1500 },
      { ids: ["valid"], human: true, say: "En attente de votre validation…", after: "Validé par Marc", ms: 2200 },
      { ids: ["send", "crm"], say: "Envoi du devis et mise à jour du client…", ms: 1200 },
      { ids: ["relance"], instant: true, say: "Terminé · relance prévue dans 5 jours" }
    ],
    done: "devis envoyé, relance programmée"
  },

  // « Il chiffre comme vous » : quatre critères, une décision
  prio: [
    { from: "Rénov'Habitat", time: "07:58", subject: "Devis carrelage, chantier de Rezé", excerpt: "48 m² de carrelage 60×60 anthracite, livré avant le 15 octobre.",
      crit: [["Produit", "Carrelage 60×60"], ["Quantité", "48 m²"], ["Stock", "62 m² au dépôt"], ["Tarif client", "Fidèle · remise 5 %"]],
      kind: "ready", icon: "file-text", verdict: "Devis prêt · 2 067,20 € HT", then: "En attente de votre validation", state: "Devis prêt" },
    { from: "SCI Les Tilleuls", time: "08:20", subject: "Faïence pour deux salles de bain", excerpt: "Nous refaisons deux salles de bain : pouvez-vous chiffrer la faïence ?",
      crit: [["Produit", "Faïence blanche 30×60"], ["Quantité", "Non précisée"], ["Stock", "Disponible"], ["Tarif client", "Nouveau client"]],
      kind: "week", icon: "mail", verdict: "Il manque les surfaces", then: "Question au client prête, à valider", state: "Question au client" },
    { from: "Atelier Duval", time: "09:05", subject: "30 sacs de colle C2 pour lundi", excerpt: "Il nous faudrait 30 sacs, livrés lundi à l'atelier.",
      crit: [["Produit", "Colle C2"], ["Quantité", "30 sacs"], ["Stock", "8 sacs · réassort jeudi"], ["Tarif client", "Tarif pro"]],
      kind: "late", icon: "refresh", verdict: "Stock insuffisant · 2 options chiffrées", then: "Colle équivalente en stock, ou livraison en deux fois", state: "Alternative proposée" }
  ],

  // Hero : les demandes de devis se chiffrent sous vos yeux
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon, fmt = api.fmt;
    // Grille de fonctionnalités : animations actives seulement à l'écran
    var grid = d.getElementById("fgrid"), mini = d.getElementById("miniInbox");
    if (grid && !api.reduced) {
      var gridOn = false;
      api.onView(grid, function (v) { gridOn = v; grid.classList.toggle("lpa-play", v); }, 0.15);
      (async function () { while (true) { while (!gridOn) await wait(300); await wait(900); mini.classList.add("lpa-sorted"); await wait(4500); mini.classList.remove("lpa-sorted"); await wait(1200); } })();
    } else if (mini) mini.classList.add("lpa-sorted");

    var app = d.getElementById("quoteApp"); if (!app) return;
    var list = d.getElementById("quoteList"), open = d.getElementById("quoteOpen"), state = d.getElementById("aiState");
    var F = {}; app.querySelectorAll("[data-f]").forEach(function (b) { F[b.getAttribute("data-f")] = b; });
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);

    // kind : ready (devis prêt), alt (stock bas, alternative chiffrée), ask (il manque une info)
    var REQ = [
      ["Rénov'Habitat", "Carrelage 60×60 · chantier de Rezé", 2067.2, "ready"],
      ["Garage Martin", "Dalles PVC pour l'atelier · 120 m²", 3480, "ready"],
      ["SCI Les Tilleuls", "Faïence pour deux salles de bain", 0, "ask"],
      ["Atelier Duval", "30 sacs de colle C2 pour lundi", 612, "alt"],
      ["Leroy SAS", "Parquet chêne · 64 m² · pose en option", 4352, "ready"],
      ["Mme Bernard", "Plinthes et seuils · formulaire du site", 186, "ready"]
    ];
    function eur(v) { return fmt(v) + " €"; }
    function setF(k, v) { var b = F[k]; b.textContent = v; b.classList.remove("lpa-bump"); void b.offsetWidth; b.classList.add("lpa-bump"); }
    function tag(row, cls, html) { row.querySelector(".lpa-tags").appendChild(h("span", "lpa-tag" + (cls ? " " + cls : ""), html)); }
    async function moveCursorTo(target) {
      var a = app.getBoundingClientRect(), r = target.getBoundingClientRect();
      cursor.style.transition = "none";
      cursor.style.transform = "translate(" + (a.width - 60) + "px," + (a.height - 40) + "px)";
      cursor.getBoundingClientRect(); cursor.style.transition = ""; cursor.style.opacity = 1;
      cursor.style.transform = "translate(" + (r.left - a.left + r.width * 0.45) + "px," + (r.top - a.top + r.height * 0.5) + "px)";
      await wait(1100);
    }
    async function countTo(el, to, ms, dec) {
      var t0 = performance.now();
      await new Promise(function (res) {
        (function step(now) {
          var p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
          el.textContent = fmt(to * e, dec) + " €";
          if (p < 1) requestAnimationFrame(step); else res();
        })(t0);
      });
    }
    function flip(rows, order) {
      var first = rows.map(function (r) { return r.getBoundingClientRect().top; });
      order.forEach(function (r) { list.appendChild(r); });
      rows.forEach(function (r, i) {
        var dy = first[i] - r.getBoundingClientRect().top; if (!dy) return;
        r.style.transition = "none"; r.style.transform = "translateY(" + dy + "px)";
        r.getBoundingClientRect();
        r.style.transition = "transform .6s cubic-bezier(.22,.72,.2,1),background .3s,opacity .4s,height .45s"; r.style.transform = "";
      });
    }

    async function run() {
      list.innerHTML = ""; open.classList.remove("lpa-on"); open.innerHTML = "";
      Object.keys(F).forEach(function (k) { F[k].textContent = "0"; });
      F.won.textContent = "11";
      state.textContent = "En veille";
      while (!visible) await wait(300);
      await wait(500);

      // 1. Les demandes arrivent (mails, formulaire du site)
      var rows = REQ.map(function (m, i) {
        var r = h("div", "lpa-mrow lpa-new",
          '<span class="lpa-star">' + icon("file-text", 15, 2) + '</span><span class="lpa-mrow-txt"><span class="lpa-mrow-from">' + m[0] + '</span><span class="lpa-mrow-subj">' + m[1] + '</span></span><span class="lpa-tags"></span><span class="lpa-mrow-time">—</span>');
        r.style.animationDelay = (i * 0.07) + "s"; r.kind = m[3]; r.amt = m[2];
        list.appendChild(r); return r;
      });
      setF("req", REQ.length);
      state.textContent = REQ.length + " demandes depuis hier soir";
      await wait(1300);

      // 2. Chiffrage, demande par demande
      state.textContent = "Chiffrage avec vos tarifs 2026…";
      var n = { ready: 0, ask: 0 };
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i], amt = r.querySelector(".lpa-mrow-time");
        r.classList.add("lpa-scan"); await wait(480); r.classList.remove("lpa-scan");
        if (r.kind === "ask") { r.classList.add("lpa-ask"); tag(r, "lpa-tag-ask", icon("mail", 11, 2.4) + "Question au client"); setF("ask", ++n.ask); }
        else if (r.kind === "alt") { r.classList.add("lpa-ready"); tag(r, "lpa-tag-ask", icon("refresh", 11, 2.4) + "Alternative proposée"); amt.textContent = eur(r.amt); setF("ready", ++n.ready); }
        else { r.classList.add("lpa-ready"); tag(r, "lpa-tag-ready", icon("check", 11, 2.6) + "Devis prêt"); amt.textContent = eur(r.amt); setF("ready", ++n.ready); }
        await wait(160);
      }
      await wait(500);

      // 3. Les devis prêts remontent, les questions passent en dessous
      var ready = rows.filter(function (r) { return r.kind !== "ask"; }), ask = rows.filter(function (r) { return r.kind === "ask"; });
      flip(rows, ready.concat(ask));
      await wait(700);
      list.insertBefore(h("div", "lpa-mgroup", "Devis à valider · " + ready.length), ready[0]);
      list.insertBefore(h("div", "lpa-mgroup", "En attente d'une précision"), ask[0]);
      state.textContent = n.ready + " devis prêts · " + n.ask + " question au client";
      await wait(1500);

      // 4. Ouverture d'un devis : contexte + lignes chiffrées, validé par vous
      await moveCursorTo(ready[0]);
      ready[0].classList.add("lpa-scan"); await wait(250); cursor.style.opacity = 0;
      open.innerHTML = '<div><p class="lpa-mopen-subj">Rénov\'Habitat · chantier de Rezé</p><p class="lpa-mopen-from">Demande de M. Martin reçue à 07:58 · chiffrée en 2 min</p></div>';
      open.classList.add("lpa-on");
      await wait(800);
      open.appendChild(h("div", "lpa-summary", '<div class="lpa-summary-h"><span class="lpa-av lpa-av-2 lpa-av-xs"><span class="lpa-av-eyes"><i></i><i></i></span></span>Ce que j\'ai vérifié</div>Stock disponible au dépôt, livraison possible le 9/10. <b>Client fidèle : remise de 5 % appliquée.</b>'));
      await wait(1200);
      var t = open.appendChild(h("div", "lpa-tool", '<div class="lpa-tool-head">Devis D-2026-118<span class="lpa-st lpa-st-work">Rédaction</span></div><div class="lpa-tool-body lpa-quote"></div>'));
      var qb = t.querySelector(".lpa-quote"), st = t.querySelector(".lpa-st");
      var R = [["Carrelage 60×60 anthracite · 48 m²", "1 872,00 €"], ["Colle et joints", "214,00 €"], ["Livraison sur chantier", "90,00 €"], ["Remise fidélité −5 %", "−108,80 €"]];
      for (var k = 0; k < R.length; k++) { qb.appendChild(h("div", "lpa-q-row", "<span>" + R[k][0] + "</span><b>" + R[k][1] + "</b>")); await wait(420); }
      var tot = qb.appendChild(h("div", "lpa-q-total", "<span>Total HT</span><b>0,00 €</b>"));
      await countTo(tot.querySelector("b"), 2067.2, 900, 2);
      await wait(300);
      st.className = "lpa-st lpa-st-need"; st.textContent = "À valider";
      var actions = t.appendChild(h("div", "lpa-tool-actions", '<span class="lpa-pill lpa-pill-dark">Valider et envoyer</span><span class="lpa-pill lpa-pill-white">Modifier</span>'));
      state.textContent = "À vous de valider";
      await wait(900);
      var ok = actions.querySelector(".lpa-pill-dark");
      await moveCursorTo(ok);
      ok.classList.add("lpa-pressed"); await wait(180); ok.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;
      actions.outerHTML = '<p class="lpa-tool-desc" style="margin-top:10px">Validé par Marc · envoyé à 08:44</p>';
      st.className = "lpa-st lpa-st-done"; st.textContent = "Envoyé";
      setF("sent", 1); setF("ready", n.ready - 1);
      await wait(600);
      open.appendChild(h("p", "lpa-mopen-note", icon("calendar", 14, 2.2) + "Relance prévue lundi s'il ne répond pas"));
      state.textContent = "Devis envoyé · relance programmée";
      await wait(5000);
      open.classList.remove("lpa-on");
      await wait(700);
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
