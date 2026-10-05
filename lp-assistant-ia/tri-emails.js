/* LP Ads Drakkar — config de la page /agent-ia/tri-emails (lue par lp.js, à charger avant lui) */
window.LPA = {
  orb: "lpa-orb-1",
  shareSubject: "À regarder : un assistant IA pour trier nos e-mails",

  // Workflow : analyse d'un e-mail, sans envoi automatique
  workflow: {
    idle: "En attente d'un e-mail…",
    steps: [
      { ids: ["mail"], say: "Nouvel e-mail de Leroy SAS", ms: 900 },
      { ids: ["read"], say: "L'IA lit l'e-mail…", ms: 1400 },
      { ids: ["tarifs", "stock"], say: "Recherche du client et de l'historique…", ms: 1300 },
      { ids: ["devis"], say: "Calcul de la priorité…", ms: 1300 },
      { ids: ["valid"], say: "Mise en favori…", ms: 900 },
      { ids: ["send", "crm"], say: "Résumé et brouillon en préparation…", ms: 1400 },
      { ids: ["relance"], human: true, say: "À vous de décider · rien n'a été envoyé", after: "Brouillon relu par Marc", ms: 2400 }
    ],
    done: "e-mail mis en favori, brouillon prêt"
  },

  // « Comment il décide » : quatre questions, un verdict
  prio: [
    { from: "Leroy SAS", time: "07:12", subject: "Commande CMD-4471 : toujours rien reçu", excerpt: "Bonjour, nous devions être livrés lundi. Pouvez-vous me donner une date ferme aujourd'hui ?",
      crit: [["Qui écrit ?", "Client régulier"], ["Que demande-t-il ?", "Une date de livraison"], ["Pour quand ?", "Aujourd'hui"], ["Ton du message", "Agacé"]],
      kind: "imp", icon: "star", verdict: "Important · à traiter aujourd'hui", then: "Mis en favori, résumé et brouillon de réponse prêts", state: "Classé : important", log: "Client mécontent repéré en 4 secondes" },
    { from: "Bureau Vallée", time: "07:30", subject: "-30 % sur les fournitures ce week-end", excerpt: "Profitez de nos offres exceptionnelles sur plus de 2 000 références…",
      crit: [["Qui écrit ?", "Liste de diffusion"], ["Que demande-t-il ?", "Rien"], ["Pour quand ?", "—"], ["Ton du message", "Publicitaire"]],
      kind: "pub", icon: "tag", verdict: "Pub · rangée hors de votre vue", then: "Dans « Pubs et newsletters », jamais supprimée", state: "Classé : pub", log: "18 pubs et newsletters écartées ce matin" },
    { from: "Cabinet Morel, expert-comptable", time: "08:05", subject: "Liasse fiscale : 2 pièces manquantes", excerpt: "Il nous manque le relevé de septembre et la facture Atelier Duval pour boucler vendredi.",
      crit: [["Qui écrit ?", "Votre expert-comptable"], ["Que demande-t-il ?", "2 documents"], ["Pour quand ?", "Vendredi"], ["Ton du message", "Neutre"]],
      kind: "week", icon: "bell", verdict: "À traiter cette semaine", then: "Rappel programmé jeudi matin", state: "Classé : cette semaine", log: "Échéance notée, rappel programmé" }
  ],

  // Hero : la boîte de réception se trie sous vos yeux
  init: function (api) {
    var d = document, h = api.h, wait = api.wait, icon = api.icon;
    // Grille de fonctionnalités : animations actives seulement à l'écran
    var grid = d.getElementById("fgrid"), mini = d.getElementById("miniInbox");
    if (grid && !api.reduced) {
      var gridOn = false;
      api.onView(grid, function (v) { gridOn = v; grid.classList.toggle("lpa-play", v); }, 0.15);
      (async function () { while (true) { while (!gridOn) await wait(300); await wait(900); mini.classList.add("lpa-sorted"); await wait(4500); mini.classList.remove("lpa-sorted"); await wait(1200); } })();
    } else if (mini) mini.classList.add("lpa-sorted");
    var app = d.getElementById("inboxApp"); if (!app) return;
    var list = d.getElementById("inboxList"), open = d.getElementById("mailOpen"), state = d.getElementById("aiState");
    var F = {}; app.querySelectorAll("[data-f]").forEach(function (b) { F[b.getAttribute("data-f")] = b; });
    var visible = false; api.onView(app, function (v) { visible = v; }, 0.25);
    var cursor = h("div", "lpa-cursor", '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#151515" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>');
    app.appendChild(cursor);

    // kind : imp (favori + brouillon), pub (écarté), later (à lire plus tard)
    var MAILS = [
      ["Leroy SAS", "Commande CMD-4471 : toujours rien reçu", "07:12", "imp"],
      ["Bureau Vallée", "-30 % sur les fournitures ce week-end", "07:30", "pub"],
      ["LinkedIn", "Vous apparaissez dans 12 recherches", "07:41", "pub"],
      ["Garage Martin", "Demande de devis pour 3 véhicules", "07:52", "imp"],
      ["Banque Populaire", "Votre relevé de septembre est disponible", "07:58", "later"],
      ["Salon Pro Ouest", "Dernière chance pour vous inscrire", "08:01", "pub"],
      ["Cabinet Morel", "Liasse fiscale : 2 pièces manquantes", "08:05", "imp"],
      ["Les Échos", "La matinale du lundi", "08:10", "pub"],
      ["Julie Bernard", "Planning de l'équipe cette semaine", "08:14", "later"]
    ];
    function setF(k, v) { var b = F[k]; b.textContent = v; b.classList.remove("lpa-bump"); void b.offsetWidth; b.classList.add("lpa-bump"); }
    function tag(row, cls, html) { row.querySelector(".lpa-tags").appendChild(h("span", "lpa-tag" + (cls ? " " + cls : ""), html)); }
    async function moveCursorTo(target) {
      var a = app.getBoundingClientRect(), r = target.getBoundingClientRect();
      cursor.style.transition = "none";
      cursor.style.transform = "translate(" + (a.width - 60) + "px," + (a.height - 40) + "px)";
      cursor.getBoundingClientRect(); cursor.style.transition = ""; cursor.style.opacity = 1;
      cursor.style.transform = "translate(" + (r.left - a.left + r.width * 0.3) + "px," + (r.top - a.top + r.height * 0.5) + "px)";
      await wait(1100);
    }
    // Remonte les e-mails importants en haut (animation FLIP)
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

      // 1. Les e-mails arrivent
      var rows = MAILS.map(function (m, i) {
        var r = h("div", "lpa-mrow lpa-new",
          '<span class="lpa-star">' + icon("star", 15, 2) + '</span><span class="lpa-mrow-txt"><span class="lpa-mrow-from">' + m[0] + '</span><span class="lpa-mrow-subj">' + m[1] + '</span></span><span class="lpa-tags"></span><span class="lpa-mrow-time">' + m[2] + "</span>");
        r.style.animationDelay = (i * 0.07) + "s"; r.kind = m[3];
        list.appendChild(r); return r;
      });
      setF("inbox", MAILS.length);
      await wait(1300);

      // 2. Analyse ligne par ligne
      state.textContent = "Analyse de " + MAILS.length + " nouveaux e-mails…";
      var n = { imp: 0, pub: 0, later: 0 };
      for (var i = 0; i < rows.length; i++) {
        var r = rows[i];
        r.classList.add("lpa-scan"); await wait(420); r.classList.remove("lpa-scan");
        if (r.kind === "imp") { r.classList.add("lpa-imp"); tag(r, "lpa-tag-imp", "Important"); setF("imp", ++n.imp); }
        else if (r.kind === "pub") { tag(r, "", "Pub"); r.classList.add("lpa-pub"); setF("pub", ++n.pub); }
        else { tag(r, "", "Plus tard"); setF("later", ++n.later); }
        await wait(160);
      }
      await wait(500);

      // 3. Les pubs disparaissent, l'important remonte
      state.textContent = "Rangement de la boîte…";
      rows.forEach(function (r) { if (r.kind === "pub") r.classList.add("lpa-gone"); });
      setF("inbox", MAILS.length - n.pub);
      await wait(550);
      rows.filter(function (r) { return r.kind === "pub"; }).forEach(function (r) { r.remove(); });
      var keep = rows.filter(function (r) { return r.kind !== "pub"; });
      var imp = keep.filter(function (r) { return r.kind === "imp"; }), later = keep.filter(function (r) { return r.kind !== "imp"; });
      flip(keep, imp.concat(later));
      await wait(700);
      list.insertBefore(h("div", "lpa-mgroup", "★ À traiter aujourd'hui · " + imp.length), imp[0]);
      list.insertBefore(h("div", "lpa-mgroup", "Peut attendre"), later[0]);
      await wait(700);

      // 4. Brouillons prêts sur les e-mails importants
      state.textContent = "Préparation des brouillons…";
      for (var k = 0; k < imp.length; k++) {
        tag(imp[k], "lpa-tag-draft", icon("pencil", 11, 2.4) + "Brouillon");
        setF("draft", k + 1); await wait(450);
      }
      state.textContent = imp.length + " e-mails importants · " + n.pub + " pubs écartées";
      await wait(1200);

      // 5. Ouverture d'un e-mail : résumé + brouillon à relire
      await moveCursorTo(imp[0]);
      imp[0].classList.add("lpa-scan"); await wait(250); cursor.style.opacity = 0;
      open.innerHTML = '<div><p class="lpa-mopen-subj">Commande CMD-4471 : toujours rien reçu</p><p class="lpa-mopen-from">M. Leroy · Leroy SAS · 07:12</p></div>';
      open.classList.add("lpa-on");
      await wait(800);
      open.appendChild(h("div", "lpa-summary", '<div class="lpa-summary-h"><span class="lpa-av lpa-av-1 lpa-av-xs"><span class="lpa-av-eyes"><i></i><i></i></span></span>Résumé de l\'assistant</div>M. Leroy n\'a pas reçu sa commande prévue lundi. <b>Il attend une date de livraison aujourd\'hui.</b>'));
      await wait(1300);
      var t = open.appendChild(h("div", "lpa-tool", '<div class="lpa-tool-head">Brouillon de réponse<span class="lpa-st lpa-st-need">À relire</span></div><div class="lpa-tool-body"><div class="lpa-mailv"><p class="lpa-draft"></p></div></div>'));
      var dr = t.querySelector(".lpa-draft"), txt = "Bonjour M. Leroy,\nToutes nos excuses pour ce retard. Votre commande part aujourd'hui, livraison jeudi matin.\nBien à vous, Marc";
      for (var c = 0; c < txt.length; c++) { dr.textContent += txt[c]; await wait(13); }
      await wait(400);
      open.appendChild(h("p", "lpa-mopen-note", icon("shield", 14, 2.2) + "Rien ne part sans votre accord"));
      state.textContent = "À vous de décider";
      await wait(5500);
      open.classList.remove("lpa-on");
      await wait(700);
    }
    if (api.reduced) return;
    (async function loop() { while (true) { await run(); } })();
  }
};
