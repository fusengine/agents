/* Solvo. Mouvement, second fichier : accordeon des cas clients, rail des
   startups, lames des actualites, rotation des temoignages. Scinde de
   motion.js pour rester sous le plafond de lignes du corpus. */
(function () {
  "use strict";

  var reduit = window.matchMedia("(prefers-reduced-motion: reduce)");
  var minuteries = [];

  function differe(fn, ms) {
    var id = window.setTimeout(fn, ms);
    minuteries.push(id);
    return id;
  }
  function purge() {
    minuteries.forEach(window.clearTimeout);
    minuteries.length = 0;
  }

  /* -------------------------------------------------------- accordeon */
  var accordeon = document.querySelector("[data-accordeon]");
  if (accordeon) {
    accordeon.addEventListener("click", function (e) {
      var bouton = e.target.closest(".pli__bouton");
      if (!bouton) return;
      var pli = bouton.closest("[data-pli]");
      var deja = bouton.getAttribute("aria-expanded") === "true";
      accordeon.querySelectorAll("[data-pli]").forEach(function (p) {
        p.classList.remove("pli--ouvert");
        p.querySelector(".pli__bouton").setAttribute("aria-expanded", "false");
        p.querySelector(".pli__corps").hidden = true;
      });
      if (deja) return;
      pli.classList.add("pli--ouvert");
      bouton.setAttribute("aria-expanded", "true");
      pli.querySelector(".pli__corps").hidden = false;
    });
  }

  /* ----------------------------------------------- rail des cas clients */
  var rail = document.querySelector("[data-rail]");
  if (rail) {
    var piste = rail.querySelector("[data-rail-piste]");
    var glisse = function (sens) {
      var carte = piste.querySelector(".cas");
      var largeur = carte ? carte.getBoundingClientRect().width + 16 : 262;
      piste.scrollBy({
        left: sens * largeur * 2,
        behavior: reduit.matches ? "auto" : "smooth"
      });
    };
    rail.querySelector("[data-rail-prec]").addEventListener("click", function () { glisse(-1); });
    rail.querySelector("[data-rail-suiv]").addEventListener("click", function () { glisse(1); });
  }

  /* ------------------------------------------- lames des actualites */
  var resumes = [
    ["Les entreprises utilisant Solvo ont généré 1,4 Bn $US en 2025.",
      "Notre lettre annuelle explore les tendances qui façonnent l'économie d'Internet : une croissance plus marquée pour les entreprises récentes, une expansion internationale plus rapide, les avancées des stablecoins et le commerce agentique."],
    ["130 k+ utilisateurs ont réalisé leur record de vente sur Solvo.",
      "Sur les quatre jours de soldes de fin d'année, Solvo a traité plus de 34 Md $US pour ses clients, avec un taux de disponibilité de 99,9999 %."],
    ["Un rapport de référence sur les SaaS dédiés aux PME.",
      "Découvrez ce qui stimule la croissance des SaaS en 2025 : diversification des produits, et intégration de la fintech et de l'IA au cœur des solutions."],
    ["Deux fondateurs échangent sur l'avenir du commerce.",
      "Les choix qui ont façonné leur réussite, leur lecture des dix prochaines années, et leurs conseils aux créateurs d'entreprise."],
    ["Paiements hors magasins d'applications : la donne change.",
      "Les évolutions réglementaires ouvrent de nouvelles possibilités. Solvo vous permet d'accepter des paiements hors magasins iOS et Android, sans perdre le contrôle de l'expérience client."],
    ["Vos clients peuvent acheter vos produits depuis des plateformes d'IA.",
      "Le protocole de commerce agentique permet à toute entreprise d'accepter des achats depuis une plateforme d'IA, sans transformation technique majeure."]
  ];
  var lames = document.querySelector("[data-lames]");
  if (lames) {
    var toutes = lames.querySelectorAll("[data-lame]");
    var resume = document.querySelector("[data-actu-resume]");
    var index = 0;
    var ouvre = function (n) {
      index = (n + toutes.length) % toutes.length;
      toutes.forEach(function (l, k) {
        l.classList.toggle("est-ouverte", k === index);
        l.querySelector("[data-declencheur]").setAttribute("aria-expanded", String(k === index));
      });
      if (!resume) return;
      resume.querySelector("b").textContent = resumes[index][0];
      resume.querySelector("span").textContent = resumes[index][1];
    };
    toutes.forEach(function (l, k) {
      l.addEventListener("click", function () { ouvre(k); });
    });
    document.querySelector("[data-actu-prec]").addEventListener("click", function () { ouvre(index - 1); });
    document.querySelector("[data-actu-suiv]").addEventListener("click", function () { ouvre(index + 1); });
  }

  /* --------------------------------- rotation des temoignages, 7 s */
  var scene = document.querySelector("[data-temoignage]");
  if (scene) {
    var blocs = scene.querySelectorAll("[data-temoin]");
    var onglets = document.querySelectorAll("[data-onglet]");
    var courant = 0;
    var boucle = null;
    var montre = function (n) {
      courant = (n + blocs.length) % blocs.length;
      blocs.forEach(function (b, k) {
        b.hidden = k !== courant;
        b.classList.toggle("est-visible", k === courant);
      });
      onglets.forEach(function (o, k) {
        o.classList.toggle("est-actif", k === courant);
        o.setAttribute("aria-selected", String(k === courant));
        var barre = o.querySelector("[data-barre]");
        barre.style.animation = "none";
        void barre.offsetWidth;
        barre.style.animation = "";
      });
    };
    var enchaine = function () {
      if (reduit.matches) return;
      boucle = differe(function () { montre(courant + 1); enchaine(); }, 7000);
    };
    onglets.forEach(function (o, k) {
      o.addEventListener("click", function () {
        window.clearTimeout(boucle);
        montre(k);
        enchaine();
      });
    });
    montre(0);
    enchaine();
  }

  /* ------------------ arret propre : onglet masque ou page quittee */
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") purge();
  });
  window.addEventListener("pagehide", purge);
})();
