window.LPA = {
  orb: "lpa-orb-7",
  shareSubject: "À regarder : une formation IA pour nos équipes",

  // Hero : le projet fil rouge avance module après module, avec sa preuve
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon;
    var grid = d.getElementById("fgrid");
    if (grid && !api.reduced) api.onView(grid, function (v) { grid.classList.toggle("lpa-play", v); }, 0.15);

    var app = d.getElementById("frApp"); if (!app) return;
    var stage = d.getElementById("frStage"), state = d.getElementById("frState");
    var folds = [].slice.call(d.querySelectorAll("#frSteps .lpa-fold"));
    var ICONS = ["list-checks", "monitor", "link", "pencil", "send"];
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);

    function panel(k, t) {
      var p = h("div", "lpa-fr-panel", '<p class="lpa-fr-k">' + k + '</p><p class="lpa-fr-t">' + t + "</p>");
      stage.appendChild(p); p.getBoundingClientRect(); p.classList.add("lpa-on"); return p;
    }
    async function leave(p) { p.classList.remove("lpa-on"); await wait(450); p.remove(); }
    function proof(p, txt) { p.appendChild(h("p", "lpa-fr-proof", icon("check", 14, 2.6) + txt)); }
    function step(i) {
      folds.forEach(function (f, j) { f.classList.toggle("lpa-is-active", j === i); });
    }
    function done(i) {
      var f = folds[i]; f.classList.add("lpa-done");
      f.querySelector("i").innerHTML = icon("check", 16, 2.4);
    }
    function reset() {
      folds.forEach(function (f, j) { f.classList.remove("lpa-done", "lpa-is-active"); f.querySelector("i").innerHTML = icon(ICONS[j], 16, 2); });
      stage.innerHTML = "";
    }
    function line(box, cls, txt) { return box.appendChild(h("p", cls, txt)); }

    async function run() {
      reset(); state.textContent = "Prêt à démarrer";
      while (!visible) await wait(300);
      await wait(600);

      // 1. Cadrer : la fiche projet se remplit
      step(0); state.textContent = "Module 1 · Fiche projet";
      var p = panel("Module 1 · Cadrer", "Fiche projet : assistant demandes client");
      var rows = p.appendChild(h("div", "lpa-fr-rows"));
      var FICHE = [
        ["Tâche", "Traiter les demandes reçues par e-mail", ""],
        ["Données", "Fiches clients, commandes en cours", ""],
        ["Actions autorisées", "Lire, résumer, préparer un ticket", ""],
        ["Actions interdites", "Envoyer un e-mail, supprimer", "lpa-no"],
        ["Validation humaine", "Avant toute création de ticket", "lpa-hum"],
        ["Preuve de réussite", "10 demandes test bien classées", ""]
      ];
      for (var i = 0; i < FICHE.length; i++) {
        rows.appendChild(h("div", "lpa-fr-row " + FICHE[i][2], "<span>" + FICHE[i][0] + "</span><b>" + FICHE[i][1] + "</b>"));
        await wait(480);
      }
      await wait(300); proof(p, "Fiche validée par le formateur"); done(0);
      await wait(2200); await leave(p);

      // 2. Construire : l'agent écrit, teste, corrige
      step(1); state.textContent = "Module 2 · L'agent construit";
      p = panel("Module 2 · Construire", "Première version, avec l'agent IA");
      var term = p.appendChild(h("div", "lpa-term"));
      var T = [
        ["lpa-you", "› Crée l'écran de suivi des demandes"],
        ["lpa-dim", "Lecture du projet de départ · 14 fichiers"],
        ["", "Plan en 3 étapes · validé par Julie"],
        ["", "Modification de demandes.ts"],
        ["lpa-ko", "Tests : 1 échec · statut manquant"],
        ["", "Correction de demandes.ts"],
        ["lpa-ok", "Tests : 8 sur 8 réussis"]
      ];
      for (var t = 0; t < T.length; t++) { line(term, T[t][0], T[t][1]); await wait(t === 4 ? 900 : 520); }
      await wait(300); proof(p, "L'application tourne · code sauvegardé"); done(1);
      await wait(2200); await leave(p);

      // 3. Connecter : outils, Skill, instruction piégée bloquée
      step(2); state.textContent = "Module 3 · Connexion aux données";
      p = panel("Module 3 · Connecter", "Une demande arrive : l'assistant va chercher les infos");
      var C = [
        ["", "lire_fiche_client", "Leroy SAS · client depuis 2019", "lpa-st-done", "Lu"],
        ["", "lire_commandes", "CMD-4471 en retard de 2 jours", "lpa-st-done", "Lu"],
        ["lpa-block", "envoyer_fichier", "Ordre caché dans l'e-mail : ignoré", "lpa-st-block", "Bloqué"],
        ["", "creer_ticket", "Retard de livraison · priorité haute", "lpa-st-need", "À valider"]
      ];
      for (var c = 0; c < C.length; c++) {
        p.appendChild(h("div", "lpa-call " + C[c][0], "<code>" + C[c][1] + '</code><span class="lpa-call-d">' + C[c][2] + '</span><span class="lpa-st ' + C[c][3] + '">' + C[c][4] + "</span>"));
        await wait(c === 2 ? 1100 : 700);
      }
      await wait(300); proof(p, "Skill suivi · instruction piégée bloquée"); done(2);
      await wait(2200); await leave(p);

      // 4. Encadrer : l'écran passe aux couleurs de l'entreprise, test noté
      step(3); state.textContent = "Module 4 · Test à froid";
      p = panel("Module 4 · Encadrer", "L'écran respecte vos règles graphiques");
      var ui = p.appendChild(h("div", "lpa-fr-ui"));
      ui.appendChild(h("div", "lpa-fr-shot lpa-fr-before", "Avant · généré à vide<i></i><i></i><i></i><em></em>"));
      await wait(900);
      ui.appendChild(h("div", "lpa-fr-shot lpa-fr-after", "Après · avec vos règles<i></i><i></i><i></i><em></em>"));
      await wait(600);
      var sc = p.appendChild(h("div", "lpa-fr-score", "<b>0</b>/ 12 au test à froid"));
      var b = sc.querySelector("b");
      for (var s = 1; s <= 11; s++) { b.textContent = s; await wait(90); }
      await wait(300); proof(p, "Test réussi : 11 sur 12"); done(3);
      await wait(2200); await leave(p);

      // 5. Mettre en ligne : contrôle pré-déploiement puis URL
      step(4); state.textContent = "Module 5 · Mise en ligne";
      p = panel("Module 5 · Mettre en ligne", "Contrôle avant publication");
      var ck = p.appendChild(h("div", "lpa-fr-check"));
      var K = ["Aucun mot de passe dans le code", "Accès limités au nécessaire", "Variables de production renseignées", "Sauvegarde et retour arrière prêts"];
      for (var k = 0; k < K.length; k++) { ck.appendChild(h("p", "", icon("check", 15, 2.6) + K[k])); await wait(450); }
      await wait(500);
      p.appendChild(h("div", "lpa-fr-url", icon("link", 15, 2.2) + '<span>demandes.votre-entreprise.fr</span><span class="lpa-st lpa-st-done">En ligne</span>'));
      await wait(500); proof(p, "Assistant en ligne"); done(4);
      step(-1); state.textContent = "Parcours terminé · 5 preuves sur 5";
      await wait(4500); await leave(p);
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
