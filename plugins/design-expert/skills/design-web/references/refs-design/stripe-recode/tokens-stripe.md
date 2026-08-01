# Tokens — stripe

Survey and rebuild of `https://stripe.com/fr` under the invented brand **Solvo**.
Markers: `[relevé]` measured on the source or on the rebuilt page, `[arbitrage]`
decided here, `[estimé]` computed without direct measurement.

The source's values come from two places, both cited wherever they are used:

1. the five compiled sheets, fetched and grepped:
   `curl -s https://b.stripecdn.com/mkt-ssr-statics/assets/_next/static/css/{9d3a49263f73db6f,35cbae6c6f4a503d,4350a5f4483c2425,81e6dcea22f0c372,4b78f0f4457ea12a}.css`
   that is **465,193 bytes** (`wc -c css_*.css`);
2. the computed styles read in the browser through `mcp__fuse-browser__browser_inspect` on
   elements located with `browser_snapshot`.

This reference is **the densest and the most colourful of the fifteen**. The ten historical
references are dark and achromatic; this one keeps its source's palette.

---

## 1. Motion

### 1.1 What the source declares

```bash
cat css_*.css | grep -oE 'transition[^;}]*' | grep -oE 'cubic-bezier\([^)]*\)' \
  | sort | uniq -c | sort -rn
```

    36  cubic-bezier(.25,1,.5,1)
     8  cubic-bezier(.4,0,.2,1)
     4  cubic-bezier(.3,0,.2,1)
     4  cubic-bezier(.16,1,.3,1)
     3  cubic-bezier(.33,1,.68,1)
     2  cubic-bezier(0.65,0,0.35,1)
     2  cubic-bezier(0,0,.2,1)

`cubic-bezier(.25, 1, .5, 1)` covers 45 % of the declared curves [relevé]. Not one has a
vertical control point above 1: **not a single bounce in 465 KB of CSS**.

```bash
cat css_*.css | grep -oE 'transition:[^;}]*' | grep -oE '[0-9]*\.?[0-9]+m?s' \
  | sort | uniq -c | sort -rn | head -8
```

    39  .3s
    12  .15s
    11  0s
     7  .5s
     6  .2s
     5  .4s
     4  .25s

Three values carry 58 of the 86 durations: **.15s / .3s / .5s** [relevé].

### 1.2 What the rebuild keeps

```css
--courbe:        cubic-bezier(.25, 1, .5, 1);   /* [relevé], the dominant one */
--courbe-sortie: cubic-bezier(.16, 1, .3, 1);   /* [relevé], reveals */
--d-court: .15s;  --d-moyen: .3s;  --d-long: .5s;
```

Two curves only, against seven in the source [arbitrage]: the other five carry components
absent from this page (dropdown menus, video player, drawers).

Counts on the rebuild:

```bash
grep -o 'transition' index.html styles.css | wc -l   # 20
grep -c '@keyframes' styles.css                      # 6
grep -o ':hover' styles.css | wc -l                  # 23
grep -o ':focus-visible' styles.css | wc -l          # 4
grep -c 'prefers-reduced-motion' styles.css          # 1
```

The 20 transitions are all bound to a state, never to an entrance. The 6 `@keyframes`:
`derive-a`, `derive-b`, `derive-c` (the hero's sails), `monte` (scroll reveal),
`apparait` (testimonial switch), `remplit` (tab progress bar).

### 1.3 The hero animation: what the source does

The source does not paint its gradient in CSS. It paints it in a canvas:

```bash
cat css_*.css | grep -oE '\.hero-wave-animation[^{]*\{[^}]*\}' | sort -u
```

    .hero-wave-animation{inset:0;position:absolute;display:flex;align-items:center;justify-content:center}
    .hero-wave-animation__canvas{position:relative;width:100%;height:100%}
    .hero-wave-animation__static{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transition:opacity .25s linear}
    .hero-wave-animation__static{opacity:0}
    .hero-wave-animation__contents{left:250px;width:110%}

A `<canvas>` animates the ribbons; a static image is layered at `opacity: 0` and takes
over if the canvas has not started. The `left: 250px; width: 110%` offset is what pushes
the burst out of the container to the right.

**Reproduction [arbitrage]**: seven `<div class="ruban">`. Each one is a very elongated
**ellipse** (`border-radius: 50%`), pivoted around its top, blurred, and positioned on a
shared anchor point outside the frame:

```css
.ruban {
  position: absolute;
  top: -24%; left: 20%; width: 30%; height: 250%;
  margin-left: -15%;
  border-radius: 50%;
  transform-origin: 50% 0;
}
.ruban--1 { rotate: -46deg; filter: blur(54px); }  /* lavender, the palest */
.ruban--3 { rotate: -72deg; filter: blur(34px); }  /* orange */
.ruban--7 { rotate: -99deg; filter: blur(46px); }  /* mauve of the right edge */
```

Seven angles from -46° to -99° open the fan to the right. **The sign matters**: in CSS a
positive rotation tips the body of the ellipse to the LEFT, since `rotate(θ)` sends the
vector (0, 1) to (-sinθ, cosθ) in a frame whose y axis points down. A first version in
positive angles produced a fan entirely off-frame to the left, invisible under the mask.

Three differences from the first attempt, all of them corrections:

1. **No polygonal `clip-path`.** The source has not a single straight edge; a blurred
   polygon is still a polygon. Only two remain in the whole sheet, and none in the hero:
   ```bash
   grep -o 'clip-path' styles.css | wc -l   # 2, for the two promo card shapes
   ```
2. **The angle lives in the individual `rotate` property, the breath in `scale`.**
   With `transform: rotate()` plus a keyframe that writes `transform`, the keyframe
   overwrites the angle and the fan comes loose. The three `@keyframes souffle-*`
   therefore write nothing but `scale`.
3. **A radial mask confines the fan to the top-right quarter** (§2.6).

No canvas, no JS: the only thing JS touches in the hero is the eyebrow counter.

### 1.4 The eyebrow counter

The source displays "Part du PIB mondial traitée sur Stripe 1,69089628 %", and the number
rolls. The mechanism is in the CSS:

    .hero-section__eyebrow-value{display:inline-block;position:relative;min-width:12ch}
    .hero-section__eyebrow-value{-webkit-mask-image:linear-gradient(180deg,#000,#fff 20%,#fff 80%,#000);mask-image:...}
    .hero-section__eyebrow-value .hero-section__eyebrow-value__content-incoming--higher{top:100%}
    .hero-section__eyebrow-value .hero-section__eyebrow-value__content-incoming--lower{bottom:100%}

A vertical mask fades the top and the bottom, and two layers (`incoming`, `outgoing`)
slide vertically toward each other: an odometer. `min-width: 12ch` reserves the space so
that the `%` does not move.

**Reproduction [arbitrage]**: the mask and the `min-width: 12ch` are taken over as they
are [relevé]; the two-layer vertical roll is replaced by a digit scramble that settles
left to right, every 90ms (`motion.js`). Same reading, a tenth of the code.

### 1.5 Clean shutdown

All the JS machinery on this page is instrumented to stop:

- `observer.unobserve(entree.target)` inside the callback of both `IntersectionObserver`
  (`motion.js`, reveals and burst);
- `observateurs.forEach(function (o) { o.disconnect(); })` on `pagehide`;
- every `setTimeout` goes through `differe()`, which stacks the identifier, and `purge()`
  cancels them on `visibilitychange` (`hidden` state) and on `pagehide`.

Verified on MDN for this project: `unobserve(target)` targets one element, `disconnect()`
stops them all; the second parameter of the callback **is** the observer.

---

## 2. Colours

### 2.1 The source's tokens

```bash
cat css_*.css | grep -oE '\-\-hds-color-core-(brand|neutral)-[0-9]+A?:\s*#[0-9a-fA-F]+' | sort -u
```

Brand, 14 steps [relevé]:

    brand-25  #f5f5ff    brand-50  #e8e9ff    brand-75  #e2e4ff    brand-100 #d6d9fc
    brand-200 #b9b9f9    brand-300 #9a9afe    brand-400 #7f7dfc    brand-500 #665efd
    brand-600 #533afd    brand-700 #4032c8    brand-800 #2e2b8c    brand-900 #1c1e54
    brand-950 #161741    brand-975 #0f1137

Light neutrals, 14 steps [relevé]:

    neutral-0   #ffffff  neutral-25  #f8fafd  neutral-50  #e5edf5  neutral-100 #d4dee9
    neutral-200 #bac8da  neutral-300 #95a4ba  neutral-400 #7d8ba4  neutral-500 #64748d
    neutral-600 #50617a  neutral-700 #3c4f69  neutral-800 #273951  neutral-900 #1a2c44
    neutral-950 #11273e  neutral-990 #061b31

Dark neutrals, for the middle block [relevé]:

    neutralDark-990 #0d1738  neutralDark-975 #101d4e  neutralDark-950 #122054
    neutralDark-900 #182659  neutralDark-800 #23356e  neutralDark-700 #273f73
    neutralDark-500 #6480b2  neutralDark-400 #839bc8  neutralDark-300 #a3b5d6

Notable point: **the neutrals are not grey.** `#64748d`, `#50617a`, `#061b31` all have a
blue component higher than their red one. The page looks cold even where it carries no
colour at all.

### 2.2 The roles, relevés in the browser

```
browser_inspect(ref: "13")   → "Démarrer maintenant" button
  background rgb(83, 58, 253)   = #533afd
  color      rgb(255, 255, 255)
  contrast   6.19:1  (AA true, AAA false)
  padding    15.5px 24px 16.5px   /  box 214 × 48
browser_inspect(ref: "5")    → "Tarifs" nav entry
  color      rgb(6, 27, 49)      = #061b31
  contrast   17.37:1  (AA true, AAA true)
  font       14px / 14px / 400
```

The primary button sits **exactly at 6.19:1**: above the AA floor, below AAA.
It is a brand decision, not an oversight — the indigo is recognisable, and a darker indigo
would not be.

### 2.3 Building multi-hue gradients

This is the reference's main contribution to the corpus. None of the other fifteen uses a
gradient with more than two hues.

```bash
cat css_*.css | grep -oE 'linear-gradient\([^;)]*(\)[^;)]*)*\)' | sort -u
```

Twenty-nine distinct gradients. The eight that carry the identity [relevé]:

```css
/* A. the hero sail, three hues, 68deg angle */
linear-gradient(68deg,
  rgba(83, 58, 253, .08)   0.78%,
  rgba(255, 140, 108, .8)  30.61%,
  rgba(218, 75, 254, .8)   79.02%)

/* B. the secondary sail, two hues, 73.3deg angle */
linear-gradient(73.3deg,
  rgba(218, 75, 254, .8)   9.85%,
  rgba(113, 92, 255, .48)  61.94%)

/* C. the five-stop sail, 74.71deg angle, stops outside the bounds */
linear-gradient(74.71deg,
  rgba(83, 58, 253, .08)  -215.10%,
  rgba(255, 140, 108, .8) -169.26%,
  rgba(218, 75, 254, .8)   -12.80%,
  rgba(113, 92, 255, .8)    18.59%,
  rgba(83, 58, 253, .8)     39.04%)

/* D. the canonical triptych, three position variants only */
linear-gradient(270deg, #ffd601  -20%, #ee30fb 190%, #635bff 365%)
linear-gradient(270deg, #ffd601 -265%, #ee30fb  60%, #635bff 240%)
linear-gradient(270deg, #ffd601 -380%, #ee30fb -60%, #635bff 110%)

/* E. the warm one, 203deg angle */
linear-gradient(203deg, #ffa319 9.93%, #fd6252 82.88%, #fd5b86 131.32%)

/* F. the gradient text, 90deg angle */
linear-gradient(90deg, #7232f1 3.13%, #fb76fa 50%, #ffcf5e)

/* G. the dark block, 288.31deg angle */
linear-gradient(288.31deg, #0d1738 -6.87%, #4032c8 105.95%)

/* H. the card, two hues, angle 0 */
linear-gradient(0deg, #7500fb, #ff39db)
```

**Five rules emerge, and they are what to copy, not the hex values:**

1. **The angles are never round.** 68, 73.3, 74.71, 203, 288.31. Out of 29 gradients,
   only those serving as a white veil use 0/90/180/270. A round angle reads like a tool's
   gradient; an angle with two decimals reads like a print.
2. **The stops go outside the bounds.** `-215.10%`, `131.32%`, `365%`. The gradient is
   computed wider than the box, and the box shows only a slice of it. That is what gives
   the impression of a continuous object seen in part, instead of a background.
3. **Three hues maximum per declaration, five as an absolute maximum.** The richness comes
   from **layering** several three-hue gradients, not from one twelve-stop gradient.
4. **The alpha varies from stop to stop**: `.08` on the indigo, `.8` on the peach and the
   mauve, `.48` on the cornflower. The low-alpha stop is not a hue, it is an exit toward
   the background.
5. **The triptych is fixed, the positions move.** `#ffd601 → #ee30fb → #635bff` returns
   three times with the same hues and three sets of positions. One chromatic family, three
   framings.

Rebuild: gradients A, B, C, D, E, F, G, H are taken over **value for value**
in `styles.css`. Counts:

```bash
grep -o 'linear-gradient' styles.css | wc -l   # 64
grep -o 'radial-gradient' styles.css | wc -l   # 17
grep -o 'clip-path'       styles.css | wc -l   # 2, none in the hero
```

Eleven named gradient hues are enough to compose the 58 `linear-gradient`:

```css
--g-indigo:#533afd  --g-violet:#7500fb  --g-magenta:#ee30fb  --g-rose:#ff39db
--g-peche:#ff8c6c   --g-orange:#ffa319  --g-corail:#fd6252   --g-jaune:#ffd601
--g-mauve:#da4bfe   --g-bleuet:#715cff  --g-cyan:#7fd7ff
```

### 2.4 The promotional band: a seven-stop gradient [arbitrage]

The one place where this page exceeds the three-hue rule, because the source puts a stage
photograph there with coloured ribbons running across it:

```css
.promo__nappe {
  background: linear-gradient(101deg,
    #1b1046 0%, #3a1a86 18%, #6b2fd0 36%,
    #b13ac0 54%, #e2557a 70%, #f5872f 86%, #ffb43a 100%);
}
.promo__nappe::before {         /* the striations, masked into an ellipse */
  background: repeating-linear-gradient(99deg,
    rgba(255,255,255,.16) 0 1px, rgba(255,255,255,0) 1px 7px);
  mask-image: radial-gradient(90% 70% at 62% 46%, #000 10%, transparent 82%);
}
.promo__nappe::after {          /* the dark veil that makes the title legible */
  background: linear-gradient(101deg,
    rgba(16,12,48,.88) 4%, rgba(16,12,48,.12) 46%, rgba(16,12,48,0) 64%);
}
```

Three layers: the sheet, the striations at 1px every 7px under an elliptical mask, the
dark veil on the left. The legibility of the white title does not depend on the sheet but
on the veil — which is what allows the sheet to be changed without re-checking contrast.

### 2.5 What had to be corrected on contrast

The `scripts/layout-check/layout-check.ts` script initially returned 30 contrast
violations. Two causes, two corrections:

- **inactive `.onglet` at `#95a4ba` on white: 2.53:1** for 14px/600. Corrected to
  `#64748d` (neutral-500) → 5.4:1 [estimé]. A real defect, not a false positive.
- **six "white on white" occurrences**: the script cannot resolve a background set in
  `background-image`, so it falls back to the `background-color` layer, which was absent.
  Corrected by placing a solid colour under each gradient: `#1b1046` on
  `.promo__cadre` and `.lame`, `var(--d-990)` on `.infra`. The render does not move by a
  pixel, and the background becomes resolvable.

After correction: `contrast: 0` across the seven widths.

### 2.6 The hero's absolute rule: the text does not touch the gradient

This is the point on which a first version was rejected, and it deserves to be written out
in full because it is not visible in the source's CSS: **the hero's text column stays on
near-white.** On the capture of `stripe.com/fr` at 1365×900, the text runs from x≈170 to
x≈1160; the saturated part of the gradient only starts after that. Only a heavily
desaturated lavender tail passes behind the glyphs.

Three layered devices hold it here:

```css
/* 1. the mask: extinguishes every ribbon outside the top-right quarter */
.heros__fond {
  mask-image: radial-gradient(132% 158% at 102% -10%,
    #000 36%, rgba(0,0,0,.9) 52%, rgba(0,0,0,.42) 66%, rgba(0,0,0,0) 80%);
}
/* 2. the white veil: brings the text column back to near-white */
.heros__blanc {
  background: linear-gradient(100deg,
    #fff 0%, #fff 42%, rgba(255,255,255,.88) 55%,
    rgba(255,255,255,.58) 68%, rgba(255,255,255,.18) 78%, rgba(255,255,255,0) 86%);
}
/* 3. the measure: 36ch, so the 2nd line does not reach the warm band */
.heros__titre { max-width: 36ch; }
```

**Verification, at the pixel on the rendered capture** — background sampled just below the
end of each h1 line, then contrast computed against `#635bff` (L = 0.1735):

```bash
magick hero.png -format "%[pixel:p{990,325}]" info:   # end of line 2
```

| line | end | background measured | luminance | contrast |
|---|---|---|---|---|
| 1 | x≈890 | `rgb(237,231,239)` | 0.797 | **3.79:1** |
| 2 | x≈990 | `rgb(219,213,238)` | 0.688 | **3.30:1** |
| 3 | x≈860 | `rgb(233,233,253)` | 0.811 | **3.85:1** |
| 4 | x≈390 | `rgb(255,255,255)` | 1.000 | **4.50:1** |

The applicable floor is 3:1 (44px text, therefore large in the WCAG sense). Line 2 is the
tightest point, at 3.30:1. The first clause, in `#0a2540` on white, is at 15:1.

Three intermediate measurements are worth keeping, because they say where the traps are:

- rejected version, polygonal ribbons crossing the text: background `rgb(201,193,235)` under
  line 2, **2.81:1**, and in places close to 1:1 on saturated violet;
- mask alone, without the white veil: **2.71:1**;
- measure at 42ch (the widest value the source gives): line 2 reaches
  x≈1140 and lands on the orange band, `rgb(224,184,158)`, **2.56:1**. That is what made
  36ch the choice, and it is also relevé.

---

## 3. Typography

### 3.1 The family

```bash
cat css_*.css | grep -oE '\-\-hds-font-family:[^;}]+' | sort -u
```

    --hds-font-family:"sohne-var","SF Pro Display",sans-serif

`sohne-var` is not freely distributable. This page takes **Inter** [arbitrage],
the free grotesque whose proportions and x-height are the closest. One measurable
consequence is documented in §3.3.

### 3.2 The scale, relevée from the tokens

```bash
cat css_*.css | grep -oE '\-\-hds-font-(heading|text)-[a-z]+-[a-zA-Z]+:[^;}]+' | sort -u
```

Headings, three viewport tiers (mobile / tablet / desktop) [relevé]:

| tier | sizes | line height | tracking | weight |
|---|---|---|---|---|
| xxl | 34 / 48 / 56 px | 1.03 | -0.025 → -0.02em | 300 |
| xl  | 28 / 34 / 48 px | 1.07 / 1.05 / 1.03 | -0.01 → -0.02em | 300 |
| lg  | 22 / 28 / 32 px | 1.2 / 1.1 / 1.07 | -0.01 → -0.02em | 300 |
| md  | 20 / 22 / 26 px | 1.2 / 1.12 / 1.1 | -0.01em | 300 |
| sm  | 18 / 20 / 22 px | 1.25 / 1.12 / 1.1 | 0 → -0.01em | 300 |
| xs  | 16 px | 1.2 | 0 | 400 |
| xxs | 14 px | 1.2 | 0 | 400 |

Text [relevé]: xxl 28/34/48, xl 18/20, lg 16/18, md 16, sm 14, xs 12/14, xxs 12.
Body line heights: 1.4 everywhere, 1.45 on the xs.

Two facts that matter more than the numbers:

- **Headings are weight 300 on desktop and 400 below 1024px.** The source redeclares
  `.hds-heading--xl{font-weight:400}` inside a media query. A thin weight holds at 48px
  and does not hold at 28px.
- **No `clamp()`, no fluid size.** Three discrete tiers, not an interpolation. The one
  exception is the hero title (§3.4).

### 3.3 The line height Inter forced to move

The source sets `line-height: 1.03` on the hero title. Under Inter, whose natural line box
is around 1.21em against a shorter value for sohne, the descenders overflow the box:

    #titre-heros — 4 line(s) of text for the allocated height (4px too many)
    #titre-pilier — 2 line(s) of text for the allocated height (3px too many)

Tested at 1.07 (the other value of the same tier on the source): still 2 to 3px too many.
Kept: **1.15** on those two headings [arbitrage]. It is the only place where the rebuild
departs from a typographic value that was relevée, and the cause is the font substitution,
not a compositional choice.

### 3.4 The hero title: two layers and a blend

The most interesting procedure on the page. Relevé:

    .hero-section__title{font-size:max(min(var(--lang-font-flex),var(--lang-font-max)),var(--lang-font-min));line-height:1.03;max-width:36ch}
    .hero-section__title{color:#ddd600}
    .hero-section__title--background{-webkit-user-select:none;user-select:none}
    .hero-section__title--foreground{position:relative;z-index:2;mix-blend-mode:hard-light;color:rgba(0,14,255,.5)}
    .hero-section__title--foreground .hero-section__title-main{color:#2d2564}
    .hero-section__title-main{color:var(--hds-color-core-neutral-900)}
    --lang-font-flex:6lvh
    --hero-font-lang-large:3rem   --hero-font-lang-medium:2.75rem
    --hero-font-lang-small:2.5rem --hero-font-lang-min:2.125rem

What can be read in it:

1. **The size is fluid, but bounded by the window height**: `6lvh` framed by
   a floor of 2.125rem and a ceiling that depends on the language (French has longer words
   than English, hence three ceilings). It is the page's only fluid size.
2. **The h1 is written twice.** The `--background` layer carries a keying colour,
   the `--foreground` layer carries `mix-blend-mode: hard-light` and a blue colour at
   50 % alpha.
3. **The keying layer passes UNDER the gradient**, which is at `z-index: 1` while the
   layer is at `z-index` auto. The front layer, at `z-index: 2`, therefore blends against
   the gradient where it covers, and against the keying colour elsewhere. That is what
   makes the text's hue shift along the line.
4. **The first words escape the blend**: `.hero-section__title-main` carries an
   opaque colour on both sides (`neutral-900` behind, `#2d2564` in front), which gives an
   almost neutral blue-black after `hard-light`. It is the reading anchor.

**Reproduction: point 1 is taken over, points 2 to 4 are NOT.** It is an owned deviation,
and here is the full reasoning.

The size and the measure are taken over as they are, with the language nuance: French
falls into the `medium` bucket, so **44px** and not 48px, under a `6lvh` ceiling and a
28px floor. Three tiers, as on the source: 44 / 34 / 28px.

The two-layer mechanism, on the other hand, is documented here but not executed:

- **It only produces a hue variation if the gradient passes under the glyphs.**
  But the rule in §2.6 says exactly the opposite: on the source the title rests on
  near-white. The blend therefore renders an almost constant hue there, and an opaque
  colour gives the same result to the eye.
- **It makes contrast unmeasurable.** No tool resolves the composite colour of a
  `mix-blend-mode` above a gradient; the render check reports it as a "background not
  resolvable" warning. With two opaque colours, all four lines are measurable and
  measured (§2.6).
- **It duplicates the h1 in the DOM.** The keying layer is a second copy of the title,
  `aria-hidden`. Removing it takes one text duplication off the page.

Kept: **a single h1, two opaque hues** — `#0a2540` on the first clause,
`#635bff` on the rest, both on near-white. Those are the hues read on the capture of the
source, that is to say the **result** of its mechanism.

For the record, the computation that would have allowed the mechanism to be reproduced,
had it been kept: `hard-light` with a source at 50 % alpha above a background `K` gives

    R = .5 × 0                    + .5 × K_R      (source R = 0)
    G = .5 × (K_G × 2 × 14/255)   + .5 × K_G      (source G = 14, so multiply)
    B = .5 × 255                  + .5 × K_B      (source B = 255, so saturated screen)

and it requires `K ≈ rgb(214, 223, 225)` to obtain the indigo `#6b7cf0` on a white
background. The source's value, `#ddd600`, renders an olive-grey under Inter: the keying
is not transposable from one font to another, which is one more reason not to transpose
the mechanism.

The eyebrow uses the same register with another blend:

    .hero-section__eyebrow{position:relative;z-index:2;mix-blend-mode:multiply}

`multiply` rather than `hard-light`: small text has to stay legible everywhere, and
`multiply` never lightens it.

```bash
grep -o 'mix-blend-mode' styles.css | wc -l   # 3, only one of them in the hero
```

### 3.5 The container's two vertical rules

Relevé on the capture, not in the CSS: two 1px rules run the full height of the hero at
x≈50 and x≈1315 for a 1365 viewport, and **continue under the logo band**. They are the
container's edges, made visible. 1365 - 1264 = 101, that is 50.5 on each side: the rules
fall exactly on the container relevé in §4.1.

```css
.heros::before, .heros::after, .logos::before, .logos::after {
  content: ""; position: absolute; top: 0; bottom: 0; width: 1px;
  background: var(--trait); z-index: 4;
}
.heros::before, .logos::before { left:  max(0px, calc(50% - 632px)); }
.heros::after,  .logos::after  { right: max(0px, calc(50% - 632px)); }
```

The `max(0px, …)` sticks them to the edges when the viewport drops below 1264px; they are
hidden below 1024px, where the source does not show them either. A third rule, this one
horizontal and full width, closes the navigation: `border-top: 1px solid var(--trait)`
on `.heros`.

---

## 4. Structure and rhythm

### 4.1 The container

```bash
cat css_*.css | grep -oE '\-\-hds-space-layout-[a-zA-Z-]+:[^;}]+' | sort -u
cat css_*.css | grep -oE '\-\-navigation-height:[^;}]+' | sort -u
```

    --hds-space-layout-content-maxWidth:1264px
    --hds-space-layout-content-margin:var(--hds-space-core-200)   /* 16px */
    --hds-space-layout-gap:var(--hds-space-core-200)              /* 16px */
    --hds-space-layout-columns:4 | 8 | 12
    --navigation-height:76px

Taken over as they are [relevé]. The side margin goes to 24px beyond 768px
[arbitrage]: the source keeps it at 16px, which sticks the content to the edge on an
intermediate screen.

The header shares the content gutter exactly:

```css
.piste, .entete__piste { max-width: 1264px; margin-inline: auto; padding-inline: var(--marge); }
```

Verified at 1440 and 1920 by `layout-check --widths 360,390,768,1024,1280,1440,1920`:
`document-overflow: 0`, no asymmetry.

### 4.2 The spacing scale

```bash
cat css_*.css | grep -oE '\-\-hds-space-core-[0-9]+:[^;}]+' | sort -u | head -40
```

4px base, 30 steps from 0 to 200px. Kept here: 4 / 8 / 12 / 16 / 20 / 24 / 28 / 32 /
36 / 40 / 48 / 56 / 64 / 72 / 80 / 88 / 96 / 104 / 112 / 120 / 128 / 144 [relevé].

### 4.3 The vertical rhythm

```bash
grep -oE '^\.[a-z-]+ \{ padding-block: [^;]*' styles.css | sort -u | wc -l   # 13
```

Thirteen distinct `padding-block` values across the sections, from `var(--e-10)` (40px) to
`var(--e-36)` (144px). No section shares its exact pair with another.

The rhythm is not regular and must not be: two sections are deliberate breathing spaces
(`tailles`, a single title/subtitle pair; `pilier`, a centred title and
a burst), and they separate the three demonstration blocks.

### 4.4 The bento: one tile dominates

```bash
grep -o 'class="tuile' index.html | wc -l   # 31 occurrences of tuile* classes
```

Six tiles on a six-column grid:

| tile | columns × rows | relative area |
|---|---|---|
| major (payments) | 4 × 2 | 8 |
| billing | 2 × 2 | 4 |
| agentic | 2 × 1 | 2 |
| cards | 2 × 1 | 2 |
| stablecoins | 2 × 1 | 2 |
| wide (platform) | 6 × 1 | 6 |

The major tile is **8 units against 4 for the next one in the same family**: the 2×
ratio required by pre-flight item 12 is satisfied by construction, and no group of three
members ends up within less than 2× of each other, since the three square tiles are
explicitly the base of the hierarchy and not a flat foreground group.

### 4.5 The radii

```bash
cat css_*.css | grep -oE 'border-radius:[0-9.]+px' | sort -u
```

    1px  2px  3px  4px  4.51px  5px  8px  10px  16px  20px  30px  100px  999999px

Kept: 4 / 8 / 10 / 16 / 20 / 30 / pill [relevé]. An implicit rule emerges:
**the radius follows the size of the object**, 4px on a button, 8px on a floating card,
16px on a bento tile, 30px on a full-width panel.

### 4.6 The hairlines

`--hds-color-surface-border-quiet: var(--hds-color-core-neutral-50)` → `#e5edf5`
[relevé]. One single hairline for the whole page: tile border, table separator,
accordion line, figures column, brand band. Never a shadow in place of a hairline, never a
darker hairline to "press the point".

---

## 5. Recreating product screenshots in HTML/CSS

This is the procedure this reference brings to the corpus, and the one that took the most
work. The source exposes seven product screens; on it they are all **images**
(`images.stripeassets.com/...bento-terminal.png?w=308&fm=webp&q=90`). Here, **none**.

```bash
grep -c '<img'  index.html   # 4, customer case photographs only
grep -c '<svg'  index.html   # 0
```

### 5.1 The seven mockups

| mockup | class | what builds it |
|---|---|---|
| mobile terminal | `.tel` | a box at `border-radius: 22px 22px 0 0`, a `box-shadow: 0 0 0 8px #e9e3f5` that makes the chassis, a three-row `<dl>` |
| browser checkout | `.fenetre` | a bar with three 7px dots and a URL pill, two columns separated by a hairline, a field `<label>`, two wallet buttons |
| billing panels | `.carte-flottante` | two stacked cards, a 4px `.jauge`, a `.sparkline` of ten `<i>` in `flex` whose height is written inline |
| agentic thread | `.fil` | two bubbles, two product cards with a gradient thumbnail, a buy button |
| payment card | `.carte-bancaire` | an `aspect-ratio: 1.586` (the ISO/IEC 7810 ID-1 format), the chip and the wave as pseudo-elements, gradient E |
| corridor globe | `.globe` | three rings, each two `radial-gradient` in a dot screen, masked by an ellipse |
| dashboard | `.tableau-bord` | a 13-row `<table>`, four columns of which two are hidden below 768px |

```bash
grep -o '<tr>' index.html | wc -l        # 13
grep -o 'aspect-ratio' styles.css | wc -l # 7
grep -o '<dl' index.html | wc -l          # 8
```

### 5.2 The six rules that make a CSS mockup credible

1. **A real `<table>` for a real table.** The connected-accounts table is a
   `<table>` with `<thead>`, `<th scope="col">` and 13 `<tr>`. A grid of `<div>` does not
   align when a value is longer, and it does not read on a screen reader.
2. **The chassis is made with `box-shadow`, not `border`.** `0 0 0 8px #e9e3f5` on the
   phone: the border does not eat into the box, and the content does not shift.
3. **The mockup overflows its frame.** `.tableau-bord { margin-left: calc(-1 * var(--e-8)) }`
   and `border-radius: 8px 8px 0 0`: the screen exits to the right and to the bottom of the
   tile. A fully contained mockup reads as an illustration; a cropped mockup reads as a
   window.
4. **A gradient background under the mockup, never behind an image.** Each
   `.tuile__scene` carries a "white veil + relevé gradient" stack:

   ```css
   background: linear-gradient(180deg, #fff 41.35%, hsla(0,0%,100%,0)),
               linear-gradient(68deg, rgba(83,58,253,.08) .78%,
                                      rgba(255,140,108,.5) 30.61%,
                                      rgba(218,75,254,.5) 79.02%);
   ```

   The white veil at 41.35 % comes from the source (`linear-gradient(180deg,#fff 41.35%,hsla(0,0%,100%,0))`)
   [relevé]: it extinguishes the gradient under the title text and lets it live under the
   mockup.
5. **The data is plausible and internally consistent.** 7 513,00 € of balance for
   64 406,68 € of volume: a plausible ratio. Three round values in a row kill a mockup's
   credibility faster than a misalignment does.
6. **Everything decorative is `aria-hidden`, everything carrying information is not.**
   Each mockup carries a `role="img"` and an `aria-label` describing it in one sentence.

   ```bash
   grep -o 'aria-hidden' index.html | wc -l   # 147
   ```

### 5.3 The cost, measured

The bento's first six tiles take up **roughly 230 lines of `index.html` and
roughly 300 lines of `styles.css`**, that is about a quarter of each of the two
files, for what the source settles with seven `<img>`. That is the price of a reference
that has to be readable and modifiable, not of a production page.

What is gained: the mockup follows the palette, translates, recomposes at small
viewport (two hidden columns rather than a crushed image), and has no network
dependency.

### 5.4 The dark block's orchestration diagram

Five rows of `<span class="noeud">` on a dot screen:

```css
.schema::before {
  background-image: radial-gradient(circle, rgba(131,155,200,.28) 0 1px, transparent 1.5px);
  background-size: 14px 14px;
  mask-image: radial-gradient(ellipse at 50% 50%, #000 20%, transparent 78%);
}
```

The elliptical mask is what stops the screen from reading as a square: it fades toward the
edges. Procedure relevé on the source's equivalent section, which paints it in an
image; here two CSS properties are enough.

---

## 6. Images

**Unlike the ten historical references, the images are LOCAL**, in
`img/`, and not remote URLs.

| path | dimensions | weight | role |
|---|---|---|---|
| `img/hero.webp` | 1920 × 885 | 147 KB | customer case 1, aerial view of a business district |
| `img/shop.webp` | 1920 × 1280 | 171 KB | customer case 2, shop interior |
| `img/desk.webp` | 1920 × 1280 | 88 KB | customer case 3, work surface |
| `img/city.webp` | 1920 × 1081 | 50 KB | customer case 4, skyline at dusk |

Dimensions relevées with: `magick identify -format "%wx%h %b\n" img/*.webp`.

Rules applied:

- the four `width`/`height` are the real intrinsic dimensions, to reserve the space and
  avoid any layout shift;
- `loading="lazy"` on three of them; the first, the only one visible when the accordion
  opens, does not carry it;
- `object-fit: cover` on a shared `aspect-ratio: 2.02`, which is the format of the
  source's customer-case thumbnails [relevé];
- a descriptive `alt` on each one, never the client's name alone;
- a `background: var(--n-50)` under each `<img>`, so that the frame exists before
  loading.

The four photographs **replace exactly** the source's four customer-case
photographs (Hertz, URBN, Instacart, Le Monde). Every other visual on the source
(the seven product captures, the seven startup cards, the six news
blades, the book cover, the shapes of the promotional cards) is
recreated in CSS.

---

## 7. What is NOT reproduced

Mandatory section of the corpus. Nine owned deviations, from the most to the least visible.

1. **The hero canvas.** The source animates its gradient frame by frame in a
   `<canvas>` with a static image fallback. Here, seven blurred CSS ellipses, masked and
   animated in `scale` (§1.3). The movement is slower and less organic.
1 bis. **The two-layer hero title.** The source's `mix-blend-mode: hard-light`
   mechanism is relevé and documented (§3.4), but rendered with its two opaque
   colours rather than with its blend, for a measurable contrast.
2. **The navigation's dropdown menus.** The four entries "Produits",
   "Solutions", "Développeurs", "Ressources" open wide column panels on the source. Here,
   inert `<button aria-expanded="false">`: this is a reference page, not a site.
3. **The seven product captures as images.** Deliberately replaced with HTML/CSS,
   which is this reference's contribution (§5).
4. **The promotional band's video.** The source puts a stage photograph with a
   speaker there; here, the striped sheet alone.
5. **The burst's `<canvas>`.** The source puts a `DatavizStatic3x.png` image
   768px wide there. Here, 46 rays generated by `motion.js` and deployed in an 18ms cascade.
6. **Real logos.** The seven brand marks in the band and the four in the testimonial
   block are compound words, not existing brands.
7. **The "S'inscrire avec Google" button.** Replaced by "Parler à un expert"
   [arbitrage]: reproducing a third party's brand and logo in a reference page
   adds nothing and raises a question that has no business being raised here.
8. **The country selector, the cookie banner, the region suggestion banner.**
   Three overlays present on the source's capture, absent here.
9. **The footer's 19 product entries** are reduced to 19 invented labels,
   not the real catalogue.

---

## 8. Deviation from the source

What was measured, and by how much the rebuild departs from it.

| quantity | source | rebuild | deviation |
|---|---|---|---|
| page height at 1365px | 15,179px | ~14,000px | -8 % |
| number of sections | 18 | 18 | 0 |
| container | 1264px | 1264px | 0 |
| header height | 76px | 76px (64px below 768px) | 0 |
| family | sohne-var | Inter | substitution |
| h1 size (French) | 44px | 44px | 0 |
| h1 measure | 32 to 42ch depending on tier | 36ch | within the range relevée (§2.6) |
| h1 line height | 1.03 | 1.15 | +0.12, forced by Inter (§3.3) |
| h1 contrast, worst line | not measurable (blend) | 3.30:1 | 3:1 floor held |
| action colour | #533afd | #533afd | 0 |
| primary button contrast | 6.19:1 | 6.19:1 | 0 |
| dominant curve | cubic-bezier(.25,1,.5,1) | same | 0 |
| `<img>` on the page | ~40 | 4 | -36, by choice (§5) |
| `<svg>` on the page | several | 0 | everything is CSS |

The -8 % of height comes from three places: the bento tiles are slightly shorter than the
source's, the dark block does not have the fourth demonstration, and
the footer has four link columns instead of the source's longer lists.

### 8.1 Pre-flight status

`plugins/design-expert/skills/design-review/references/pre-flight-checklist.md`, 17 items.

| item | status | note |
|---|---|---|
| 1. em dash | **passed** | `grep -c '—' index.html styles.css` → 0 and 0 |
| 2. tracked uppercase eyebrows ≤ ceil(16/3)=6 | **passed** | 0 |
| 3. theme lock | **set aside in the name of fidelity** | the source has a mid-page dark block (`hds-mode--dark`), reproduced. Reported, not corrected |
| 4. motion claimed, motion shown | **passed** | dial 6, 20 transitions and 6 `@keyframes` |
| 5. at most one marquee | **passed** | 0 |
| 6. banned premium palette | **passed** | no hex from the family |
| 7. hero ≤ 4 text elements | **passed** | eyebrow, h1, 2 actions |
| 8. cluster #1 co-occurrence | **passed** | no cream, no serif italic, no terracotta |
| 9. bounce easing | **passed** | 0 |
| 10. layout-property animation | **warning** | `flex-grow`/`flex-basis` on the blades, the only way to obtain the source's horizontal accordion |
| 11. render check | **9 remaining violations**, see below |
| 12. hierarchy, one block dominates | **passed** | major tile at 8 units against 4 (§4.4) |
| 13. vertical rhythm | **passed** | 13 distinct `padding-block` values |
| 14. centred container, shared gutter | **passed** | verified at 1440 and 1920 |
| 15. image floor | **passed** | 4 `<img>`, 4 subjects declared in the brief |
| 16. motion floor | **passed** | 20 transitions, 23 `:hover`, 4 `:focus-visible`, 1 `prefers-reduced-motion` |
| 17. legibility at 360px | **passed** | `--micro: 14px` floor below 768px, 12px beyond |

### 8.2 The 9 remaining violations of item 11

```
bun run layout-check.ts .../stripe-recode/index.html --widths 360,390,768,1024,1280,1440,1920
violations : 9
  - cta-wrap: 9
by width: 360px=4  390px=4  768px=1  1024px=0  1280px=0  1440px=0  1920px=0
```

All nine concern `.pli__bouton`, the row label of the customer-case accordion,
for example:

    label "UR Urbane centralise 4 milliards d'euros de chiffre d'affaires..." :
    height 67.17px > 35.84px (22.4px × 1.6), 4 lines of text measured

Analysis: `config.ts:12` defines `ctaSelector` as `"button, [role='button'], …"`,
that is to say **every** `<button>`. An accordion label is not a CTA label:
the rule it mechanizes (`layout-discipline.md` §6) says "Label fits on one line **at
desktop**", and at 1024px and beyond the count is **0**. All nine occurrences are
at 360, 390 and 768px, where an eighty-character sentence necessarily wraps —
which is exactly what the source does.

Two corrections were made rather than declared:

- the six news blades triggered the same violation; their `<button>` was
  turned into an overlaid trigger (`position: absolute; inset: 0`) carrying an
  `aria-label`, with the visible label becoming an `aria-hidden` sibling. The accessible
  name is preserved, and the button is no longer a slab of text. **6 violations lifted,
  with no accessibility compromise.**
- the same transformation was **not** applied to the accordion: the accessible pattern
  for an accordion is `<h4><button aria-expanded aria-controls>Title</button></h4>`, and
  the title has to stay inside the button. Degrading that pattern to satisfy a heuristic
  would be a bad trade.

Nine violations therefore remain, all of them the same false positive, all below 1024px,
none corresponding to a visible defect on the capture at 360px.

### 8.3 The 5 warnings

Five "background not resolvable" contrast warnings remain on the three gradient figures
of the dark block (`.chiffres__valeur--degrade`): the text is painted by
`background-clip: text`, and by construction it has no resolvable colour. Verified by
eye on the capture: `#7232f1 → #fb76fa → #ffcf5e` on `#101d4e`, at 40px, comfortably
above the 3:1 floor for large text.

### 8.4 A capture trap, not a page defect

At 360px the page measures **20,268px**. A Chromium full-page capture turns white
beyond **16,384px** (the texture limit): the last three sections appear to
disappear although they are rendered correctly.

```bash
for y in 16300 16400; do magick capture.png -crop 360x100+0+$y +repage \
  -format "%[fx:mean]" info:; done      # 0.94 then 1 (pure white)
```

Verification done at 768px, where the page measures less than 16,384px: `livre`, `cloture`
and `pied` render normally there. `layout-check` also evaluates them at 360 and 390 with no
violation, on the live DOM rather than on a capture.

---

## 9. Files

| file | lines |
|---|---|
| `index.html` | 820 |
| `styles.css` | 1414 |
| `motion.js` | 136 |
| `motion-carrousel.js` | 135 |
| `design-system.md` | 158 |
| `tokens-stripe.md` | this file |

`motion.js` was split in two: the base (header, menu, counter, reveals,
burst) and the stateful components (accordion, rail, blades, testimonials). Three folders in
the corpus already do this. Both files are IIFEs `(function () { "use strict"; … })()`,
with no ES module, each with its `matchMedia('(prefers-reduced-motion: reduce)')` guard at
the top and its own disarming on `visibilitychange` and `pagehide`.

Browser console on the rendered page: **0 messages**, at every level.
