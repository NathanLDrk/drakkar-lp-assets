/* LP Ads Drakkar — config de la page /agent-ia/planning-tournees (lue par lp.js, à charger avant lui) */
window.LPA = {
  orb: "lpa-orb-6",
  shareSubject: "À regarder : un assistant IA pour préparer nos tournées",
  prioNoun: "la commande",

  // Workflow : les tournées du lendemain, validées par vous
  workflow: {
    idle: "En attente des commandes du jour…",
    steps: [
      { ids: ["mail"], say: "42 commandes à livrer mardi", ms: 900 },
      { ids: ["read"], say: "L'IA analyse les commandes…", ms: 1400 },
      { ids: ["tarifs", "stock"], say: "Consignes clients et camions disponibles…", ms: 1300 },
      { ids: ["devis"], say: "Calcul des tournées…", ms: 1500 },
      { ids: ["valid"], human: true, say: "En attente de votre validation…", after: "Validées par Marc", ms: 2200 },
      { ids: ["send", "crm"], say: "Envoi aux chauffeurs et aux clients…", ms: 1200 },
      { ids: ["relance"], instant: true, say: "Terminé · pointage des livraisons ce soir" }
    ],
    done: "tournées envoyées, clients prévenus"
  },

  // « Il place chaque commande » : quatre critères, une place dans une tournée
  prio: [
    { from: "Boulangerie Petit", time: "Rezé", subject: "Commande de 120 kg pour mardi", excerpt: "",
      crit: [["Secteur", "Sud-Loire"], ["Jour souhaité", "Mardi, avant 9 h"], ["Poids", "120 kg"], ["Consigne", "Porte de derrière"]],
      kind: "route", icon: "truck", verdict: "Camion 2 · premier arrêt à 7 h 20", then: "Livrée avant 9 h, comme demandé", state: "Placée" },
    { from: "Leroy SAS", time: "Carquefou", subject: "Commande de 1,2 t pour mardi", excerpt: "",
      crit: [["Secteur", "Nord-Loire"], ["Jour souhaité", "Mardi"], ["Poids", "1,2 t"], ["Camion 1", "Déjà rempli à 94 %"]],
      kind: "week", icon: "truck", verdict: "Passée sur le camion 4", then: "Même secteur, 11 km de plus seulement", state: "Ajustée" },
    { from: "Restaurant Le Quai", time: "Nantes", subject: "Commande de 80 kg pour mardi", excerpt: "",
      crit: [["Secteur", "Nantes centre"], ["Jour souhaité", "Mardi"], ["Poids", "80 kg"], ["Consigne", "Fermé le mardi"]],
      kind: "late", icon: "calendar", verdict: "À reporter à mercredi matin", then: "Message au client prêt, à valider", state: "À confirmer" }
  ],

  // Hero : les commandes du jour sont réparties dans les camions
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon;
    // Grille de fonctionnalités : animations actives seulement à l'écran
    var grid = d.getElementById("fgrid"), mini = d.getElementById("miniInbox");
    if (grid && !api.reduced) {
      var gridOn = false;
      api.onView(grid, function (v) { gridOn = v; grid.classList.toggle("lpa-play", v); }, 0.15);
      (async function () { while (true) { while (!gridOn) await wait(300); await wait(900); mini.classList.add("lpa-sorted"); await wait(4500); mini.classList.remove("lpa-sorted"); await wait(1200); } })();
    } else if (mini) mini.classList.add("lpa-sorted");

    var app = d.getElementById("routeApp"); if (!app) return;
    var list = d.getElementById("routeList"), open = d.getElementById("routeOpen"), state = d.getElementById("aiState"), main = app.querySelector(".lpa-app-main");
    var F = {}; app.querySelectorAll("[data-f]").forEach(function (b) { F[b.getAttribute("data-f")] = b; });
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);

    // [client, ville · contrainte, poids, camion (0 = reportée)]
    var ORD = [
      ["Boulangerie Petit", "Rezé · avant 9 h", "120 kg", 2],
      ["Leroy SAS", "Carquefou · quai de chargement", "1,2 t", 1],
      ["Garage Martin", "Vertou", "340 kg", 2],
      ["Restaurant Le Quai", "Nantes · fermé le mardi", "80 kg", 0],
      ["Atelier Duval", "Saint-Herblain", "560 kg", 1],
      ["Rénov'Habitat", "Bouguenais", "910 kg", 2],
      ["Cave des Halles", "Nantes centre", "210 kg", 1]
    ];
    // Carte GPS : réseau routier (lignes p, q, r), dépôt q2 et 3 arrêts (A p3, B r4, C r2)
    var N = { p2: [130, 78], p3: [190, 76], p4: [250, 72], q2: [140, 138], q3: [200, 134], q4: [262, 130], r2: [150, 198], r3: [210, 194], r4: [275, 188] };
    var NAIVE = ["q2", "q3", "q4", "r4", "q4", "p4", "p3", "q3", "r3", "r2", "q2"];   // ordre de saisie, par le pont interdit
    var OPT = ["q2", "p2", "p3", "p4", "q4", "r4", "r3", "r2", "q2"];                 // boulangerie d'abord, itinéraire poids lourds
    var STOPS = [["p3", "Boulangerie Petit · 7 h 20", 8, -8, "start"], ["r4", "Garage Martin · 8 h 35", -10, -10, "end"], ["r2", "Rénov'Habitat · 9 h 40", 8, 16, "start"]];
    function path(seq) { return "M" + seq.map(function (k) { return N[k].join(" "); }).join(" L"); }
    function lines(arr, cls) { return arr.map(function (dd) { return '<path class="' + cls + '" d="' + dd + '"/>'; }).join(""); }
    function mapSVG() {
      var majors = ["M0 86 L60 82 L130 78 L190 76 L250 72 L320 68 L400 62", "M66 40 L60 82 L70 142 L80 204 L86 270", "M316 40 L320 68 L330 126 L340 184 L346 270"];
      var roads = ["M0 146 L70 142 L140 138 L200 134 L262 130 L330 126 L400 120", "M0 208 L80 204 L150 198 L210 194 L275 188 L340 184 L400 178", "M126 40 L130 78 L140 138 L150 198 L156 270", "M187 44 L190 76 L200 134 L210 194 L216 270", "M247 40 L250 72 L262 130 L275 188 L282 270"];
      var streets = ["M100 80 L106 140", "M30 84 L36 144", "M165 137 L172 196", "M290 129 L300 186", "M360 124 L372 182", "M110 200 L118 260", "M240 192 L246 260", "M300 70 L306 40", "M160 77 L164 52 L200 50", "M0 240 L80 236 L150 232", "M210 232 L300 228 L400 224", "M360 66 L392 110", "M20 180 L76 176", "M372 150 L400 148"];
      var pins = "", lbls = "";
      STOPS.forEach(function (st, i) {
        var c = N[st[0]];
        pins += '<g class="lpa-pin" style="--d:' + (0.3 + i * 0.12).toFixed(2) + 's"><circle cx="' + c[0] + '" cy="' + c[1] + '" r="6.5"/><text x="' + c[0] + '" y="' + c[1] + '">' + (i + 1) + "</text></g>";
        lbls += '<text class="lpa-pin-lbl" x="' + (c[0] + st[2]) + '" y="' + (c[1] + st[3]) + '" text-anchor="' + st[4] + '">' + st[1] + "</text>";
      });
      return '<svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
        '<rect width="400" height="260" fill="#efeeeb"/>' +
        '<path class="lpa-water" stroke-width="22" d="M0 30 C 100 16, 180 40, 260 26 S 360 10, 400 20"/>' +
        '<path class="lpa-water" stroke-width="7" d="M236 20 C 224 70, 240 110, 228 150 S 236 220, 226 270"/>' +
        '<rect class="lpa-park" x="86" y="96" width="34" height="30" rx="10"/><rect class="lpa-park" x="288" y="140" width="32" height="34" rx="10"/><rect class="lpa-park" x="170" y="210" width="44" height="18" rx="8"/>' +
        lines(majors, "lpa-case") + lines(streets, "lpa-street") + lines(roads, "lpa-road") + lines(majors, "lpa-road lpa-major") +
        '<text class="lpa-water-lbl" x="24" y="26">Loire</text><text class="lpa-water-lbl" x="240" y="250">Sèvre</text>' +
        '<text class="lpa-town" x="162" y="102">Rezé</text><text class="lpa-town" x="300" y="214">Vertou</text><text class="lpa-town" x="88" y="230">Bouguenais</text><text class="lpa-town" x="276" y="104">Saint-Sébastien</text>' +
        '<g class="lpa-shield"><rect x="90" y="75" width="20" height="10" rx="2.5"/><text x="100" y="80">N844</text></g><g class="lpa-shield"><rect x="315" y="92" width="20" height="10" rx="2.5"/><text x="325" y="97">D59</text></g>' +
        '<path class="lpa-route-naive" d="' + path(NAIVE) + '"/><path class="lpa-ban-seg" d="M214 133 L248 131"/><path class="lpa-route-opt" d="' + path(OPT) + '"/>' +
        '<g class="lpa-ban"><circle cx="231" cy="132" r="7.5"/><text x="231" y="132">3,5t</text><text class="lpa-ban-lbl" x="243" y="150">Pont limité à 3,5 t</text></g>' +
        '<g class="lpa-depot"><rect x="' + (N.q2[0] - 7) + '" y="' + (N.q2[1] - 7) + '" width="14" height="14" rx="3.5"/><text x="' + (N.q2[0] + 10) + '" y="' + (N.q2[1] + 4) + '">Dépôt · 6 h 45</text></g>' + pins + lbls + "</svg>";
    }
    function draw(el, ms) {
      var L = el.getTotalLength();
      el.style.transition = "none"; el.style.strokeDasharray = L; el.style.strokeDashoffset = L; el.getBoundingClientRect();
      el.style.transition = "stroke-dashoffset " + ms + "ms cubic-bezier(.45,0,.2,1),opacity .5s"; el.style.strokeDashoffset = 0;
    }
    // Séquence : ordre de saisie (par le pont interdit) puis itinéraire poids lourds optimisé
    async function playMap(root, say) {
      say = say || function () {};
      await wait(900);
      root.classList.add("lpa-naive"); draw(root.querySelector(".lpa-route-naive"), 1200);
      say("Ordre de saisie : 71 km");
      await wait(1900);
      say("Pont interdit aux poids lourds, boulangerie livrée trop tard");
      await wait(1500);
      root.querySelector(".lpa-map-lbl").textContent = "Calcul…"; say("Calcul de l'itinéraire poids lourds…");
      await wait(600);
      root.classList.add("lpa-opt"); draw(root.querySelector(".lpa-route-opt"), 1900);
      var kmEl = root.querySelector(".lpa-map-km"), k0 = performance.now();
      await new Promise(function (res) {
        (function step(now) {
          var q = Math.min(1, (now - k0) / 1900), e = 1 - Math.pow(1 - q, 3);
          kmEl.textContent = Math.round(71 - 17 * e) + " km";
          if (q < 1) requestAnimationFrame(step); else res();
        })(k0);
      });
      root.querySelector(".lpa-map-lbl").textContent = "Itinéraire poids lourds";
      root.classList.add("lpa-done");
      say("Itinéraire poids lourds · 17 km de moins");
    }
    function cardHTML() { return '<div class="lpa-map lpa-geo">' + mapSVG() + '<div class="lpa-map-bar"><span class="lpa-map-lbl">Ordre de saisie</span><b class="lpa-map-km">71 km</b><span class="lpa-rv-warn">Pont interdit</span><span class="lpa-map-gain">−17 km</span></div></div>'; }
    // Carte « meilleur itinéraire » de la grille : rejouée tant qu'elle est à l'écran
    var gps = d.getElementById("gpsCard");
    if (gps) {
      if (api.reduced) { gps.innerHTML = cardHTML(); gps.firstChild.classList.add("lpa-naive", "lpa-opt", "lpa-done"); gps.querySelector(".lpa-map-lbl").textContent = "Itinéraire poids lourds"; gps.querySelector(".lpa-map-km").textContent = "54 km"; }
      else (async function () { var on = false; api.onView(gps, function (v) { on = v; }, 0.3); while (true) { while (!on) await wait(300); gps.innerHTML = cardHTML(); await playMap(gps.firstChild); await wait(4000); } })();
    }
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

      // 1. Les commandes à livrer demain
      var rows = ORD.map(function (m, i) {
        var r = h("div", "lpa-mrow lpa-new",
          '<span class="lpa-star">' + icon("map-pin", 15, 2) + '</span><span class="lpa-mrow-txt"><span class="lpa-mrow-from">' + m[0] + '</span><span class="lpa-mrow-subj">' + m[1] + '</span></span><span class="lpa-tags"></span><span class="lpa-mrow-time">' + m[2] + "</span>");
        r.style.animationDelay = (i * 0.07) + "s"; r.truck = m[3];
        list.appendChild(r); return r;
      });
      setF("req", ORD.length);
      state.textContent = ORD.length + " commandes à livrer mardi";
      await wait(1300);

      // 2. Chaque commande trouve son camion
      state.textContent = "Calcul des tournées…";
      var later = 0;
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        r.classList.add("lpa-scan"); await wait(440); r.classList.remove("lpa-scan");
        if (!r.truck) { r.classList.add("lpa-ask"); tag(r, "lpa-tag-ask", icon("calendar", 11, 2.4) + "Mercredi"); setF("later", ++later); }
        else { r.classList.add("lpa-truck"); tag(r, "lpa-tag-truck", icon("truck", 11, 2.2) + "Camion " + r.truck); }
        await wait(150);
      }
      setF("ready", 2);
      await wait(500);

      // 3. Regroupement par camion
      var t1 = rows.filter(function (r) { return r.truck === 1; }), t2 = rows.filter(function (r) { return r.truck === 2; }), t0 = rows.filter(function (r) { return !r.truck; });
      flip(rows, t2.concat(t1, t0));
      await wait(700);
      list.insertBefore(h("div", "lpa-mgroup", "Camion 2 · Sud-Loire · 3 arrêts"), t2[0]);
      list.insertBefore(h("div", "lpa-mgroup", "Camion 1 · Nord-Loire · 3 arrêts"), t1[0]);
      list.insertBefore(h("div", "lpa-mgroup", "Reportée, client fermé mardi"), t0[0]);
      state.textContent = "2 tournées prêtes · 1 report";
      await wait(1500);

      // 4. Récap de la tournée, puis « Générer l'itinéraire »
      await moveCursorTo(t2[0]);
      t2[0].classList.add("lpa-scan"); await wait(250); cursor.style.opacity = 0;
      open.innerHTML = '<div><p class="lpa-mopen-subj">Tournée Sud-Loire · Camion 2</p><p class="lpa-mopen-from">Porteur 12 t · départ du dépôt à 6 h 45</p></div>';
      open.classList.add("lpa-on");
      await wait(800);
      open.appendChild(h("div", "lpa-summary", '<div class="lpa-summary-h"><span class="lpa-av lpa-av-6 lpa-av-xs"><span class="lpa-av-eyes"><i></i><i></i></span></span>Récapitulatif</div>3 arrêts, 1,4 t à livrer. <b>La boulangerie doit être livrée avant 9 h.</b>'));
      await wait(1000);
      var t = open.appendChild(h("div", "lpa-tool", '<div class="lpa-tool-head">Arrêts de la tournée<span class="lpa-st lpa-st-work">À planifier</span></div><div class="lpa-tool-body lpa-quote"></div>'));
      var qb = t.querySelector(".lpa-quote");
      var S = [["Boulangerie Petit · Rezé", "Avant 9 h · porte de derrière", "120 kg"], ["Garage Martin · Vertou", "Quai de déchargement", "340 kg"], ["Rénov'Habitat · Bouguenais", "Chantier, appeler en arrivant", "910 kg"]];
      for (var k = 0; k < S.length; k++) { qb.appendChild(h("div", "lpa-q-row", "<span>" + S[k][0] + "<small>" + S[k][1] + "</small></span><b>" + S[k][2] + "</b>")); await wait(380); }
      await wait(300);
      var actions = t.appendChild(h("div", "lpa-tool-actions", '<span class="lpa-pill lpa-pill-dark">' + icon("route", 14, 2.2) + ' Générer l\'itinéraire</span><span class="lpa-pill lpa-pill-white">Modifier</span>'));
      state.textContent = "Tournée prête à planifier";
      await wait(900);
      var gen = actions.querySelector(".lpa-pill-dark");
      await moveCursorTo(gen);
      gen.classList.add("lpa-pressed"); await wait(180); gen.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;

      // 5. L'itinéraire s'ouvre en plein écran dans le dashboard
      var view = h("div", "lpa-routeview lpa-geo",
        '<div class="lpa-rv-top">' + icon("route", 16, 2.2) + 'Itinéraire · Camion 2<small>3 arrêts · porteur 12 t</small><span class="lpa-rv-tag">' + icon("truck", 12, 2.2) + 'Poids lourd</span></div>' +
        '<div class="lpa-rv-map">' + mapSVG() + '</div>' +
        '<div class="lpa-rv-bar"><span class="lpa-map-lbl">Ordre de saisie</span><b class="lpa-map-km">71 km</b><span class="lpa-rv-warn">Pont interdit · boulangerie à 9 h 40</span><span class="lpa-map-gain">−17 km · boulangerie à 7 h 20</span><span class="lpa-pill lpa-pill-dark lpa-off">Valider l\'itinéraire</span></div>');
      main.appendChild(view); view.getBoundingClientRect(); view.classList.add("lpa-on");
      await playMap(view, function (txt) { state.textContent = txt; });
      await wait(700);
      var ok = view.querySelector(".lpa-rv-bar .lpa-pill"); ok.classList.remove("lpa-off");
      state.textContent = "À vous de valider";
      await wait(900);
      await moveCursorTo(ok);
      ok.classList.add("lpa-pressed"); await wait(180); ok.classList.remove("lpa-pressed");
      await wait(250); cursor.style.opacity = 0;
      ok.className = "lpa-pill lpa-pill-soft"; ok.innerHTML = icon("check", 13, 2.6) + " Envoyé au chauffeur";
      setF("done", 1); setF("sent", 1);
      state.textContent = "Itinéraire validé · chauffeur prévenu";
      await wait(4500);
      view.classList.remove("lpa-on"); open.classList.remove("lpa-on");
      await wait(600);
      view.remove();
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
