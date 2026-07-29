# layout-check — contrôle de mise en page déterministe

Charge une page dans Chrome headless, la mesure à plusieurs largeurs, rend un **JSON de
violations** et un **code de sortie**. Aucune appréciation : que des nombres et des booléens.

Il existe pour une raison précise : les instructions « regarde la capture », « le libellé
tient sur une ligne » sont déjà écrites dans les skills, et un agent peut malgré tout
déclarer une section vérifiée alors qu'un libellé passe à la ligne. Ce script tourne
**hors du modèle** — son verdict ne se contourne pas en se déclarant conforme.

## Invocation

```bash
cd ${CLAUDE_PLUGIN_ROOT}/scripts/layout-check
bun run layout-check.ts <url-ou-chemin> [options]
```

La cible est **toujours le premier argument** (chemin local → converti en `file://`, ou URL `http(s)`).

| Code de sortie | Sens |
|---|---|
| `0` | conforme, `violations: []` |
| `1` | au moins une violation |
| `2` | erreur (cible introuvable, Playwright absent, page non chargée) |

Le JSON part sur **stdout**, le résumé lisible sur **stderr** — `--out rapport.json` écrit
aussi le JSON dans un fichier, `--quiet` coupe le résumé.

`summary.contrastPairs` regroupe les violations de contraste par couple de couleurs
**résolues** : un même couple de jetons produit des dizaines de violations, la clé donne
le nombre de corrections réellement distinctes (mesuré : 185 violations = 5 couples).

Les avertissements identiques d'une largeur à l'autre sont fusionnés, les largeurs
concernées reportées dans le motif : un fond en dégradé ne dépend pas de la largeur de
viewport (mesuré : 60 lignes → 15 sur une page réelle). Un avertissement illisible est un
avertissement ignoré, et un cas non mesurable ignoré est le trou qu'on cherche à fermer.

### Options

| Option | Défaut | Effet |
|---|---|---|
| `--widths 360,768` | `360,390,768,1024,1280,1440` | largeurs mesurées |
| `--height 900` | `900` | hauteur de viewport |
| `--exclude "sel,sel"` | — | sélecteurs exclus de tous les contrôles |
| `--checks "overlap,contrast"` | les 5 | familles activées |
| `--cta "<sélecteur>"` | boutons + `a[class*=btn/button/cta]` | ce qui compte comme CTA |
| `--allow-overlays false` | superpositions volontaires ignorées | désactive l'heuristique d'intentionnalité |
| `--warmup` | off | parcourt la page avant de mesurer (révélations JS) |
| `--motion no-preference` | `reduce` émulé | rétablit les animations |
| `--contrast`, `--contrast-large`, `--cta-factor`, `--overlap-ratio`, `--ink` | 4.5 / 3 / 1.6 / 0.1 / 2 | seuils |
| `--config fichier.json` | — | config partielle, écrasée par les drapeaux |

## Les cinq contrôles

| `type` | Prédicat | Mécanise |
|---|---|---|
| `text-overflow` | `scrollWidth > clientWidth + tolérance` **OU** encre du texte hors de la boîte de contenu | texte tronqué / débordant |
| `overlap` | intersection des `getBoundingClientRect()` de deux éléments sans lien ancêtre/descendant | libellé qui chevauche un bouton |
| `cta-wrap` | hauteur > `1.6 × line-height` **ET** ≥ 2 boîtes de ligne de texte | `layout-discipline.md` §6 |
| `contrast` | ratio WCAG sur couleurs résolues, 4.5:1 / 3:1 | `layout-discipline.md` §6, `ux-wcag.md` |
| `document-overflow` | `documentElement.scrollWidth > viewport`, à chaque largeur | défilement horizontal parasite |

## Pages-témoins — vérifier que le gate est vivant

```bash
bun run layout-check.ts fixtures/broken.html --widths 1280   # attendu : 10 violations, 1 avertissement, exit 1
bun run layout-check.ts fixtures/clean.html                  # attendu : 0 violation, 0 avertissement, exit 0
```

`fixtures/broken.html` porte **un cas franc par contrôle** : les six familles doivent lever.
Ses couleurs fautives sont écrites en **OKLCH et `color-mix()`**, jamais en hex — c'est
délibéré : `getComputedStyle().color` renvoie `oklch(...)` tel quel dans Chromium, donc un
parseur qui présume `rgb()` rendrait **0 violation sur une page entièrement fautive**.
Une page-témoin en hex validerait ce parseur cassé.

`fixtures/clean.html` reprend les mêmes composants, corrigés : elle distingue un détecteur
qui marche d'un détecteur qui hurle sur tout. Faire tourner les deux après toute
modification du script — un contrôle silencieux sur `broken.html` est un contrôle mort.

## Ce que le script ne sait pas faire (lire avant de conclure)

1. **Contraste sur dégradé ou image.** Si un `background-image` intervient dans la chaîne
   des ancêtres, le ratio ne porte que sur la couche couleur : le cas sort en
   `warnings`, **jamais** en violation. Idem pour un texte peint par un dégradé
   (`background-clip: text`, couleur transparente). Ces cas se tranchent à l'œil, sur capture.
2. **Superposition volontaire vs accidentelle.** Sont réputés volontaires : un élément
   (ou un de ses 6 premiers ancêtres) en `position: absolute/fixed/sticky`, avec un
   `z-index` explicite non nul, en `pointer-events: none`, ou portant un `transform`.
   Une superposition obtenue par marge négative reste signalée — c'est le motif
   accidentel le plus fréquent. `--allow-overlays false` retire toutes ces excuses.
3. **Bavure de boîte de ligne.** Deux boîtes empilées qui mordent l'une sur l'autre de
   moins d'une demi-ligne sont ignorées (jambages d'un titre à `line-height` serré).
4. **Pourquoi deux prédicats pour un seul contrôle.** `scrollWidth − clientWidth` est la
   région de débordement *défilable*, pas le débordement *visible*. Mesuré dans Chromium :
   il vaut **13** quand l'encre sort de **21px**, et **0** quand elle sort de **40px vers
   le start** (`text-indent` négatif, `direction: rtl`) — ce côté-là n'entre pas dans la
   région défilable. D'où la seconde mesure : l'union des rectangles du texte *propre* de
   l'élément comparée à sa boîte de contenu, des deux côtés (`--ink`, défaut 2px). Elle ne
   regarde que les nœuds texte **enfants directs** — le texte d'un descendant positionné
   sort légitimement de la boîte de son ancêtre. Sur une boîte `display: inline`,
   `scrollWidth`/`clientWidth` valent 0 : seule l'encre tranche alors.
   Non couvert par l'une comme par l'autre : le contenu généré `::before`/`::after`, qui
   est peint mais n'est pas un nœud texte du DOM.
5. **Contenu révélé au défilement.** `prefers-reduced-motion: reduce` est émulé par
   défaut, ce qui suffit sur une page qui l'honore. Sinon, tout ce qui attend un
   IntersectionObserver reste à opacité 0 et **n'est pas mesuré** : le contrôle
   `hidden-text` compte alors ces éléments et le remonte en `warnings`. Un rapport avec
   ce warning se relance avec `--warmup`.
6. **États.** Une seule passe, sans interaction : ni `:hover`, ni `:focus`, ni menu ouvert,
   ni onglet inactif (`display: none` est ignoré, pas signalé).
7. **Plafond.** Le contrôle `overlap` compare au plus 400 éléments deux à deux
   (`--max-elements`) ; au-delà, le reste de la page n'est pas comparé.

## Prérequis

Aucune dépendance ajoutée au dépôt. Le script résout, dans l'ordre : `LAYOUT_CHECK_PLAYWRIGHT`,
`playwright`, `playwright-core`, puis le `playwright-core` embarqué par `@playwright/mcp`
installé globalement. Il lance le **Chrome du système** (`channel: "chrome"`) et retombe sur
le Chromium de Playwright si absent — donc aucun `playwright install` requis.
