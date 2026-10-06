/* LP Ads Drakkar — config de la page /agent-ia/saisie-commandes (lue par lp.js, à charger avant lui) */
window.LPA = {
  orb: "lpa-orb-4",
  shareSubject: "À regarder : un assistant IA pour saisir nos commandes",
  prioNoun: "la commande",

  // Workflow : un bon de commande, validé par vous avant la saisie
  workflow: {
    idle: "En attente d'une commande…",
    steps: [
      { ids: ["mail"], say: "Bon de commande de Leroy SAS", ms: 900 },
      { ids: ["read"], say: "L'IA lit le document…", ms: 1400 },
      { ids: ["tarifs", "stock"], say: "Recherche des articles et du stock…", ms: 1300 },
      { ids: ["devis"], say: "Contrôle des prix et des quantités…", ms: 1300 },
      { ids: ["valid"], human: true, say: "En attente de votre validation…", after: "Validée par Marc", ms: 2200 },
      { ids: ["send", "crm"], say: "Saisie dans l'ERP et confirmation client…", ms: 1200 },
      { ids: ["relance"], instant: true, say: "Terminé · bon de préparation à l'entrepôt" }
    ],
    done: "commande saisie, entrepôt prévenu"
  },

  // « Il vérifie chaque commande » : quatre contrôles, une décision
  prio: [
    { from: "Leroy SAS", time: "BC-4471", subject: "Bon de commande en PDF · 12 lignes", excerpt: "",
      crit: [["Articles", "12 sur 12 reconnus"], ["Prix", "1 écart : 64 € au lieu de 68 €"], ["Quantités", "Habituelles"], ["Stock", "Tout disponible"]],
      kind: "week", icon: "alert", verdict: "À vérifier : un écart de prix", then: "Commande prête, l'écart vous est soumis", state: "À vérifier" },
    { from: "Garage Martin", time: "Excel", subject: "Commande mensuelle · 8 lignes", excerpt: "",
      crit: [["Articles", "8 sur 8 reconnus"], ["Prix", "Conformes au tarif"], ["Quantités", "Habituelles"], ["Stock", "Tout disponible"]],
      kind: "paid", icon: "check", verdict: "Conforme · prête à saisir", then: "En attente de votre validation", state: "Prête" },
    { from: "Atelier Duval", time: "E-mail", subject: "« Comme d'hab, mais 300 sacs de colle »", excerpt: "",
      crit: [["Articles", "3 sur 3 reconnus"], ["Prix", "Conformes au tarif"], ["Quantités", "300 sacs, 10 fois l'habitude"], ["Stock", "120 sacs disponibles"]],
      kind: "late", icon: "phone", verdict: "Quantité inhabituelle : à confirmer", then: "Question au client prête, à valider", state: "À confirmer" }
  ],

  // Hero : les commandes reçues sont lues et préparées sous vos yeux
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon, fmt = api.fmt;
    // Grille de fonctionnalités : animations actives seulement à l'écran
    var grid = d.getElementById("fgrid"), mini = d.getElementById("miniInbox");
    if (grid && !api.reduced) {
      var gridOn = false;
      api.onView(grid, function (v) { gridOn = v; grid.classList.toggle("lpa-play", v); }, 0.15);
      (async function () { while (true) { while (!gridOn) await wait(300); await wait(900); mini.classList.add("lpa-sorted"); await wait(4500); mini.classList.remove("lpa-sorted"); await wait(1200); } })();
    } else if (mini) mini.classList.add("lpa-sorted");

    var app = d.getElementById("orderApp"); if (!app) return;
    var list = d.getElementById("orderList"), open = d.getElementById("orderOpen"), state = d.getElementById("aiState");
    var F = {}; app.querySelectorAll("[data-f]").forEach(function (b) { F[b.getAttribute("data-f")] = b; });
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);

    // [client, document, lignes, montant HT, kind] · kind : ok (conforme), check (écart à vérifier)
    var ORD = [
      ["Leroy SAS", "Bon de commande en PDF", 12, 5224, "check"],
      ["Garage Martin", "Fichier Excel joint", 8, 2310, "ok"],
      ["Atelier Duval", "Texte de l'e-mail", 3, 940, "check"],
      ["Rénov'Habitat", "Bon scanné", 5, 1675, "ok"],
      ["Bati Ouest", "Export de leur logiciel", 21, 8120, "ok"],
      ["Menuiserie Roux", "Photo d'un bon manuscrit", 4, 760, "ok"]
    ];
    var NOTE = { "Leroy SAS": "Écart de prix", "Atelier Duval": "Quantité inhabituelle" };
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
      F.lines.textContent = "2 418";
      state.textContent = "En veille";
      while (!visible) await wait(300);
      await wait(500);

      // 1. Les commandes du matin arrivent, dans tous les formats
      var rows = ORD.map(function (m, i) {
        var r = h("div", "lpa-mrow lpa-new",
          '<span class="lpa-star">' + icon("file-text", 15, 2) + '</span><span class="lpa-mrow-txt"><span class="lpa-mrow-from">' + m[0] + '</span><span class="lpa-mrow-subj">' + m[1] + '</span></span><span class="lpa-tags"></span><span class="lpa-mrow-time">' + eur(m[3]) + "</span>");
        r.style.animationDelay = (i * 0.07) + "s"; r.kind = m[4]; r.n = m[2];
        list.appendChild(r); return r;
      });
      setF("req", ORD.length);
      state.textContent = ORD.length + " commandes depuis hier soir";
      await wait(1300);

      // 2. Lecture et contrôle, commande par commande
      state.textContent = "Lecture et contrôle des lignes…";
      var n = { ready: 0, check: 0 };
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        r.classList.add("lpa-scan"); await wait(480); r.classList.remove("lpa-scan");
        if (r.kind === "check") { r.classList.add("lpa-ask"); tag(r, "lpa-tag-ask", icon("alert", 11, 2.4) + NOTE[ORD[i][0]]); setF("check", ++n.check); }
        else { r.classList.add("lpa-okrow"); tag(r, "lpa-tag-paid", icon("check", 11, 2.6) + r.n + " lignes OK"); setF("ready", ++n.ready); }
        await wait(160);
      }
      await wait(500);

      // 3. Ce qui demande votre regard passe en haut
      var chk = rows.filter(function (r) { return r.kind === "check"; }), ok = rows.filter(function (r) { return r.kind !== "check"; });
      flip(rows, chk.concat(ok));
      await wait(700);
      list.insertBefore(h("div", "lpa-mgroup", "À vérifier · " + chk.length), chk[0]);
      list.insertBefore(h("div", "lpa-mgroup", "Conformes, prêtes à saisir · " + ok.length), ok[0]);
      state.textContent = n.ready + " prêtes · " + n.check + " à vérifier";
      await wait(1500);

      // 4. Ouverture d'une commande : l'écart est surligné, vous tranchez
      await moveCursorTo(chk[0]);
      chk[0].classList.add("lpa-scan"); await wait(250); cursor.style.opacity = 0;
      open.innerHTML = '<div><p class="lpa-mopen-subj">Leroy SAS · bon BC-4471</p><p class="lpa-mopen-from">PDF reçu à 07:42 · 12 lignes lues en 20 s</p></div>';
      open.classList.add("lpa-on");
      await wait(800);
      open.appendChild(h("div", "lpa-summary", '<div class="lpa-summary-h"><span class="lpa-av lpa-av-4 lpa-av-xs"><span class="lpa-av-eyes"><i></i><i></i></span></span>Ce que j\'ai vérifié</div>12 articles reconnus, tout est en stock. <b>Un écart : le parquet est commandé à 64 €, votre tarif est à 68 €.</b>'));
      await wait(1200);
      var t = open.appendChild(h("div", "lpa-tool", '<div class="lpa-tool-head">Commande CMD-2026-0412<span class="lpa-st lpa-st-work">Préparation</span></div><div class="lpa-tool-body lpa-quote"></div>'));
      var qb = t.querySelector(".lpa-quote"), st = t.querySelector(".lpa-st");
      var R = [["PAR-CH-140 · Parquet chêne · 64 m² à 64 €", "4 096,00 €", true], ["COL-PAR-5 · Colle parquet · 8 seaux", "496,00 €"], ["SOUS-3 · Sous-couche · 64 m²", "384,00 €"], ["+ 9 autres lignes", "248,00 €"]];
      for (var k = 0; k < R.length; k++) {
        qb.appendChild(h("div", "lpa-q-row" + (R[k][2] ? " lpa-q-flag" : ""), "<span>" + R[k][0] + (R[k][2] ? "<small>Votre tarif : 68 €/m²</small>" : "") + "</span><b>" + R[k][1] + "</b>"));
        await wait(420);
      }
      qb.appendChild(h("div", "lpa-q-total", "<span>Total HT</span><b>5 224,00 €</b>"));
      await wait(300);
      st.className = "lpa-st lpa-st-need"; st.textContent = "À valider";
      var actions = t.appendChild(h("div", "lpa-tool-actions", '<span class="lpa-pill lpa-pill-dark">Accepter le prix et saisir</span><span class="lpa-pill lpa-pill-white">Corriger</span>'));
      state.textContent = "À vous de trancher";
      await wait(1000);
      var go = actions.querySelector(".lpa-pill-dark");
      await moveCursorTo(go);
      go.classList.add("lpa-pressed"); await wait(180); go.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;
      actions.outerHTML = '<p class="lpa-tool-desc" style="margin-top:10px">Validée par Marc · saisie dans l\'ERP à 07:46</p>';
      st.className = "lpa-st lpa-st-done"; st.textContent = "Saisie";
      setF("done", 1); setF("check", n.check - 1);
      await wait(600);
      open.appendChild(h("p", "lpa-mopen-note", icon("send", 14, 2.2) + "Confirmation au client prête à envoyer"));
      state.textContent = "Commande saisie · entrepôt prévenu";
      await wait(5000);
      open.classList.remove("lpa-on");
      await wait(700);
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
