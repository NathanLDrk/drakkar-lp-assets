/* LP Ads Drakkar — config de la page /agent-ia/relances (lue par lp.js, à charger avant lui) */
window.LPA = {
  orb: "lpa-orb-3",
  shareSubject: "À regarder : un assistant IA pour relancer nos factures",

  // Workflow : une facture échue, la relance validée par vous
  workflow: {
    idle: "En attente d'une échéance…",
    steps: [
      { ids: ["mail"], say: "Facture F-0932 échue depuis 5 jours", ms: 900 },
      { ids: ["read"], say: "Vérification du relevé bancaire…", ms: 1400 },
      { ids: ["tarifs", "stock"], say: "Historique et derniers échanges…", ms: 1300 },
      { ids: ["devis"], say: "Rédaction de la relance…", ms: 1500 },
      { ids: ["valid"], human: true, say: "En attente de votre validation…", after: "Validé par Marc", ms: 2200 },
      { ids: ["send", "crm"], say: "Envoi de la relance et mise à jour du client…", ms: 1200 },
      { ids: ["relance"], instant: true, say: "Terminé · suivi programmé dans 7 jours" }
    ],
    done: "relance envoyée, suivi programmé"
  },

  // « Il sait qui relancer » : quatre critères, une action
  prio: [
    { from: "Garage Martin", time: "F-0932", subject: "1 240 € · échue depuis 9 jours", excerpt: "",
      crit: [["Retard", "9 jours"], ["Montant", "1 240 €"], ["Habitudes", "Bon payeur, 1er retard"], ["Dernier échange", "Aucun litige"]],
      kind: "late", icon: "send", verdict: "Relance cordiale aujourd'hui", then: "Brouillon prêt, facture jointe", state: "Action : relance cordiale" },
    { from: "Leroy SAS", time: "F-0941", subject: "4 860 € · échue depuis 3 jours", excerpt: "",
      crit: [["Retard", "3 jours"], ["Montant", "4 860 €"], ["Banque", "Virement reçu ce matin"], ["Dernier échange", "—"]],
      kind: "paid", icon: "check", verdict: "Ne pas relancer : c'est payé", then: "Facture passée dans les payées", state: "Action : aucune" },
    { from: "Rénov'Habitat", time: "F-0917", subject: "7 560 € · échue depuis 31 jours", excerpt: "",
      crit: [["Retard", "31 jours"], ["Montant", "7 560 €"], ["Habitudes", "2 relances sans réponse"], ["Dernier échange", "Il y a 12 jours"]],
      kind: "call", icon: "phone", verdict: "Appel conseillé cette semaine", then: "Résumé du dossier prêt pour l'appel", state: "Action : appel" }
  ],

  // Hero : les factures ouvertes passées au crible
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon, fmt = api.fmt;
    // Grille de fonctionnalités : animations actives seulement à l'écran
    var grid = d.getElementById("fgrid"), mini = d.getElementById("miniInbox");
    if (grid && !api.reduced) {
      var gridOn = false;
      api.onView(grid, function (v) { gridOn = v; grid.classList.toggle("lpa-play", v); }, 0.15);
      (async function () { while (true) { while (!gridOn) await wait(300); await wait(900); mini.classList.add("lpa-sorted"); await wait(4500); mini.classList.remove("lpa-sorted"); await wait(1200); } })();
    } else if (mini) mini.classList.add("lpa-sorted");

    var app = d.getElementById("invApp"); if (!app) return;
    var list = d.getElementById("invList"), open = d.getElementById("invOpen"), state = d.getElementById("aiState");
    var F = {}; app.querySelectorAll("[data-f]").forEach(function (b) { F[b.getAttribute("data-f")] = b; });
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);

    // kind : late (relance), paid (payée ce matin), soon (rappel avant échéance), call (appel conseillé)
    var INV = [
      ["Garage Martin", "F-0932 · échue depuis 9 j", 1240, "late"],
      ["Leroy SAS", "F-0941 · échue depuis 3 j", 4860, "paid"],
      ["Atelier Duval", "F-0928 · échue depuis 16 j", 2310, "late"],
      ["SARL Bernard", "F-0950 · échéance dans 3 j", 980, "soon"],
      ["Rénov'Habitat", "F-0917 · échue depuis 31 j", 7560, "call"],
      ["Boulangerie Petit", "F-0946 · échue depuis 2 j", 420, "paid"],
      ["Menuiserie Roux", "F-0939 · échue depuis 6 j", 1650, "late"]
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
      state.textContent = "En veille";
      while (!visible) await wait(300);
      await wait(500);

      // 1. Les factures ouvertes
      var rows = INV.map(function (m, i) {
        var r = h("div", "lpa-mrow lpa-new",
          '<span class="lpa-star">' + icon("file-text", 15, 2) + '</span><span class="lpa-mrow-txt"><span class="lpa-mrow-from">' + m[0] + '</span><span class="lpa-mrow-subj">' + m[1] + '</span></span><span class="lpa-tags"></span><span class="lpa-mrow-time">' + eur(m[2]) + "</span>");
        r.style.animationDelay = (i * 0.07) + "s"; r.kind = m[3]; r.amt = m[2];
        list.appendChild(r); return r;
      });
      var total = INV.reduce(function (s, m) { return s + m[2]; }, 0);
      setF("open", INV.length);
      state.textContent = eur(total) + " à encaisser";
      await wait(1300);

      // 2. Vérification des paiements, puis action par facture
      state.textContent = "Vérification de votre relevé bancaire…";
      var n = { late: 0, paid: 0, draft: 0, call: 0 };
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        r.classList.add("lpa-scan"); await wait(430); r.classList.remove("lpa-scan");
        if (r.kind === "paid") { r.classList.add("lpa-paid"); tag(r, "lpa-tag-paid", icon("check", 11, 2.6) + "Payée ce matin"); setF("paid", ++n.paid); }
        else if (r.kind === "soon") { tag(r, "", "Rappel J-3"); setF("draft", ++n.draft); }
        else if (r.kind === "call") { r.classList.add("lpa-late"); tag(r, "lpa-tag-late", icon("phone", 11, 2.4) + "Appel conseillé"); setF("late", ++n.late); setF("call", ++n.call); }
        else { r.classList.add("lpa-late"); tag(r, "lpa-tag-draft", icon("pencil", 11, 2.4) + "Relance prête"); setF("late", ++n.late); setF("draft", ++n.draft); }
        await wait(160);
      }
      await wait(500);

      // 3. Les factures payées sortent de la liste, les relances remontent
      state.textContent = "Mise à jour de vos encours…";
      rows.forEach(function (r) { if (r.kind === "paid") r.classList.add("lpa-gone"); });
      var left = rows.filter(function (r) { return r.kind !== "paid"; });
      setF("open", left.length);
      await wait(550);
      rows.filter(function (r) { return r.kind === "paid"; }).forEach(function (r) { r.remove(); });
      var act = left.filter(function (r) { return r.kind === "late" || r.kind === "call"; }), rest = left.filter(function (r) { return r.kind === "soon"; });
      flip(left, act.concat(rest));
      await wait(700);
      list.insertBefore(h("div", "lpa-mgroup", "À relancer aujourd'hui · " + act.length), act[0]);
      list.insertBefore(h("div", "lpa-mgroup", "Échéance proche"), rest[0]);
      var due = left.reduce(function (s, r) { return s + r.amt; }, 0);
      state.textContent = eur(due) + " à encaisser · " + n.draft + " relances prêtes";
      await wait(1500);

      // 4. Ouverture d'une relance : contexte + brouillon, validée par vous
      await moveCursorTo(act[0]);
      act[0].classList.add("lpa-scan"); await wait(250); cursor.style.opacity = 0;
      open.innerHTML = '<div><p class="lpa-mopen-subj">Garage Martin · F-0932 · 1 240 €</p><p class="lpa-mopen-from">Échue le 26/09 · 9 jours de retard</p></div>';
      open.classList.add("lpa-on");
      await wait(800);
      open.appendChild(h("div", "lpa-summary", '<div class="lpa-summary-h"><span class="lpa-av lpa-av-3 lpa-av-xs"><span class="lpa-av-eyes"><i></i><i></i></span></span>Contexte</div>Garage Martin paie d\'habitude à 30 jours. <b>C\'est son premier retard : relance cordiale conseillée.</b>'));
      await wait(1300);
      var t = open.appendChild(h("div", "lpa-tool", '<div class="lpa-tool-head">Relance n°1<span class="lpa-st lpa-st-need">À valider</span></div><div class="lpa-tool-body"><div class="lpa-mailv"><p class="lpa-draft"></p></div></div>'));
      var dr = t.querySelector(".lpa-draft"), txt = "Bonjour M. Martin,\nSauf erreur de notre part, la facture F-0932 de 1 240 € reste à régler. Vous la trouverez en pièce jointe.\nBelle journée, Marc";
      for (var c = 0; c < txt.length; c++) { dr.textContent += txt[c]; await wait(13); }
      await wait(300);
      var actions = t.appendChild(h("div", "lpa-tool-actions", '<span class="lpa-pill lpa-pill-dark">Valider et envoyer</span><span class="lpa-pill lpa-pill-white">Modifier</span>'));
      state.textContent = "À vous de valider";
      await wait(900);
      var ok = actions.querySelector(".lpa-pill-dark");
      await moveCursorTo(ok);
      ok.classList.add("lpa-pressed"); await wait(180); ok.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;
      actions.outerHTML = '<p class="lpa-tool-desc" style="margin-top:10px">Validée par Marc · envoyée à 08:47</p>';
      t.querySelector(".lpa-st").className = "lpa-st lpa-st-done"; t.querySelector(".lpa-st").textContent = "Envoyée";
      await wait(600);
      open.appendChild(h("p", "lpa-mopen-note", icon("calendar", 14, 2.2) + "Suivi programmé le 14/10 si rien n'arrive"));
      state.textContent = "Relance envoyée · suivi programmé";
      await wait(5000);
      open.classList.remove("lpa-on");
      await wait(700);
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
