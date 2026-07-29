---
name: design-method
description: "Use when starting any design task — resolves register, sets the 3 dials, locks Gate 0, and routes to the right move and target skill."
when-to-use: "Start of any design task, before picking a move or writing/editing a single line of HTML/CSS/tokens."
keywords: register, brand, product, dials, gate-0, absolute-bans, anti-slop, routing, moves, method
priority: critical
related: design-system, design-web, design-webapp, design-ios, design-android, design-review, ux-copy
---

<objective>
The core design method and entry point for any design task: resolves the Register (brand vs product), states the Design Read one-liner and sets the 3 numeric dials (DESIGN_VARIANCE, VISUAL_DENSITY, MOTION_INTENSITY) against a scale anchored on the eleven reference pages, enforces the Gate 0 brief lock before any HTML/CSS/tokens are touched, applies the Absolute bans, runs the 2-level AI-slop test, and routes to the matching move (generate, critique, audit, bolder, quieter, distill, harden, polish, redesign) and its target skill.

Read this first — before `design-system`, any `register/*.md` file, or any `moves/*.md` file. This skill owns the gate and the routing table, not the move procedures themselves.
</objective>

<!-- Grounding: grounding-corpus.md §A (impeccable anatomy — thin router, Register, dials, Absolute bans, 2-level slop test), §G (root-cause fix: template reproduction demoted, register-first), §H (kept anchors: Gate 0, Signature Dominance, Focal-Block Floor, Competitor Lift Test, MOTION_INTENSITY). -->

# Design Method — The Core

This is the one place the design pipeline is defined. The agent (`agents/design-expert.md`)
always loads this file before dispatching to a move; every `references/register/*.md` and
`references/moves/*.md` file assumes you've read this first and references it instead of
restating it — if a rule elsewhere contradicts this file, this file wins.

## Setup

How this core gets loaded, every time, no exceptions:

1. Read this file once per task — not once per move. Skip the re-read for a later move in
   the same task if neither the Register nor the codebase changed.
2. **Read `../design-system/SKILL.md`** — always, unconditionally, before anything else
   below. Thin pointer file, cheap to reload, and the harness's phase-1 trigger, so it runs
   even on a task needing no new token. Existing `design-system.md` tokens still win over
   its defaults once resolved.
3. Resolve **Register** (below), then write the **Design Read + 3 dials** one-liner.
4. Pass **Gate 0 — Brief Lock** (below) before touching any HTML/CSS/tokens.
5. Read the ONE matched `references/moves/<move>.md` from the Routing table — not two, not
   a skim of several to "compare." The move file owns the how; this file owns the gate and
   the pointer.
6. If the move builds or touches code, read the matching
   `references/register/{brand,product}.md` floors too, once.

## Register

Resolve **before anything else downstream** — brand vs product gates every floor (Signature
Dominance, Focal-Block Floor, tone bounds, motion budget, dial presets). Never default
silently.

- **brand** — one dominant, expressive message: marketing site, launch page, identity.
- **product** — dense, predictable, motion stays discreet: dashboard, SaaS tool, utility
  screen.

**Priority order (fixed, first match wins):**
1. The owner states it explicitly.
2. An existing `design-system.md`/`PRODUCT.md` already classifies it.
3. Inferable from the concrete surface (dashboard/settings/internal tool → `product`;
   landing/marketing/campaign/identity → `brand`).
4. Still unclear → ask **ONE** question. Never guess past this point.

Once resolved, load `references/register/brand.md` or `references/register/product.md` —
each carries the floors, tone bounds and motion budget for that lane. For copy/microcopy
tone, load `references/register/copy.md` (any move touching user-facing text, plus
`ux-copy`).

## Design Read + the 3 dials

Before any palette/font/layout choice, state one line:

```
Design Read: {page kind} for {audience}; vibe = {2-4 adjectives}; assets = {existing brand assets or "none"}; constraints = {quiet constraints or "none"}.
```

Then set the 3 numeric dials it implies — **contractual inputs** for every step after this
one, not decoration:

| Dial | 1 | 10 |
|------|---|----|
| `DESIGN_VARIANCE` | rigid, symmetrical, conventional | highly art-directed, asymmetric |
| `VISUAL_DENSITY` | airy, gallery-like, calm | packed, information-dense |
| `MOTION_INTENSITY` | static / near-still | cinematic, scroll-driven |

Preset-by-use-case table, partial-brief fallbacks and `MOTION_INTENSITY` bands (calm <4 /
expressive 4–7 / cinematic >7) live in `../design-system/references/design-read-dials.md`
— don't restate them here. The brief always overrides any default; an unresolvable dial
uses the documented fallback and says so in the Design Read line, never a silent guess.

### What each number means — anchored on the corpus

Poles alone are unusable: nobody knows what a 7 looks like, so an unanchored dial drifts
to the middle and the middle is where every generated page already lives. The scales below
are anchored on the eleven reference pages, each value read from that page's own
`design-system.md` under `../design-web/references/refs-design/` (short names below are those
directories). These are not scores. All eleven pages were judged good; the numbers say what
kind of page it is, never how well it was done.

**`DESIGN_VARIANCE` — how far the composition departs from the canonical skeleton.**

| n | Page | What it looks like |
|---|---|---|
| 3 | `fora-recode` | "Bookended Canon" — nav, hero, intro, features, what-you-get, pricing, footer, almost to the letter. Reads specific anyway: one device, a 1px rule at white 10%, is the only line in the system and carries every edge, card outline and divider. |
| 3 | `cursor-recode` | "Ramp and Newsroom" — deliberately unstyled page furniture; the art direction lives entirely in the floating product window, not in the layout. |
| 3 | `endlesstools-recode` | "Showreel Canon" — the canonical order, compressed, with every slot filled by footage instead of a card. |
| 4 | `harness-recode`, `linear-recode`, `xai-recode` | Canon kept, one structural inversion each: the tab row sits *below* the media (harness); numbered `1.0`/`1.1` markers turn five marketing sections into a document index (linear); the feature grid is pulled up *into* the hero, leaving five sections total (xai). |
| 5 | `mainframe-recode`, `umbrel-recode`, `reve-recode` | Skeleton rebuilt but still legible: seven short blocks under a header that scrolls away and never returns (mainframe); solo bands alternating with duet bands, then a store pivot (umbrel); seven capability panels alternating which edge they bleed off (reve). |
| 7 | `supercommon-recode` | "Void-Metered Stack" — six consecutive sections share one `band` class and are told apart only by content; a single lowercase display line is the composition; no local asset anywhere. |
| 9 | `elysian` | "Vitrine Descent" — feature grid, testimonials, pricing, FAQ and CTA band dropped outright; a Greco-Roman arch is the only crop in the system; four chambers, four different image transformations. |

**`VISUAL_DENSITY` — how much is on screen per unit of scroll.**

| n | Page | What it looks like |
|---|---|---|
| 2 | `reve-recode` | One capability per `104svh`; the gutter is a slope, not a container, and text width is never capped by a wrapper. |
| 2 | `supercommon-recode` | Extremely sparse vertically, tight typographically: exactly one padding value in the whole page. |
| 4 | `elysian`, `mainframe-recode` | Editorial: section padding deliberately unequal chamber to chamber so the descent has rhythm (elysian); one repeated gap value so page length comes from what a block contains, six blocks over 5,752px (mainframe). |
| 5 | `cursor-recode`, `fora-recode` | Airy between, dense within: the 24-column grid exists only *inside* large cards, never on the page (cursor); 36px card padding and 20px pricing rows inside airy sections (fora). |
| 6 | `umbrel-recode` | Deliberately tight — a 60px section stack at desktop that *rises* at narrower breakpoints, inverting the usual direction; ten sections in ~5,500px. |
| 7 | `endlesstools-recode`, `linear-recode`, `xai-recode` | Split density, the mark of a high value done well: 8px gutters and 8px type inside the mosaic against 150px of nothing between sections (endlesstools); dense inside the mockups, `padding-block: 128px` around them (linear); dense without noise, five sections, every visual drawn in markup (xai). |
| 9 | `harness-recode` | Counted, not felt: a four-column mega-menu, fifteen tab panels, an eight-field form and a fifteen-link footer column. |

**`MOTION_INTENSITY` — how much of the page moves, and how far.**

| n | Page | What it looks like |
|---|---|---|
| 3 | `reve-recode` | 0 `@keyframes`, 4 transitions, no scroll reveal anywhere; the hero video fades up over 150ms only once frames are proven to be rendering. |
| 3 | `linear-recode` | `translateY(4px)` on entry, `scale(.97)` on press; eighteen curves declared and not one bounces. Nothing moves; everything settles. |
| 3 | `xai-recode` | 182 transition triggers, 73% of which move nothing — they change a colour. Five duration tiers ruled by "the bigger the element, the slower it is". |
| 3 | `cursor-recode` | One reveal keyframe for the whole page, always declared and *paused*; JS only lifts the pause, so a failed script leaves everything visible. Buttons declare no transition at all, on purpose. |
| 4 | `umbrel-recode`, `supercommon-recode` | Three named entrance variants plus two marquees and a `scroll-snap` rail (umbrel); three durations, two curves, one 60ms cascade step and no one-off value anywhere else (supercommon). |
| 6 | `mainframe-recode` | Total coverage, minimal amplitude: 75 transitions, zero keyframes applied, two duration regimes — response at 150/200ms, reveal at 400–1000ms — with a deliberate hole between them. |
| 6 | `harness-recode`, `fora-recode`, `endlesstools-recode` | Entrances differentiated by role, with a 300ms gap so the light arrives after the object (harness); `grid-template-rows: 0fr → 1fr` accordions and `mask-image` hairlines (fora); one curve on eleven of twelve transitions plus twenty running videos (endlesstools). |
| 8 | `elysian` | One rAF loop writing a `--p` progress property per pinned chamber; materials limited to `transform`, `opacity`, `clip-path`, `mask-image`; entrances vary by role, with no blanket `opacity 0 + translateY(20px)` rule anywhere. |

Read the corpus honestly on one point: at 6, motion is **coverage**, not amplitude —
mainframe and harness earn a 6 because every state is covered by a documented system, not
because anything is spectacular. Amplitude only starts above 7.

Notches nobody occupies — 1, 2, 6, 8, 10 on variance; 1, 3, 8, 10 on density; 1, 2, 5, 7, 9,
10 on motion — are not forbidden. Interpolate between the neighbours and say what the
in-between buys you. And note what the corpus does *not* contain:
**no page is high on all three axes.** Every one of the eleven gives something up — elysian
is a 9 and an 8 but a 4 in density; harness is a 9 in density and a 4 in variance. A brief
that arrives at 8/8/8 has not made a choice, it has made a wish.

One more thing the comparison exposes: the preset table in
`../design-system/references/design-read-dials.md` sits systematically *below* the corpus —
its "SaaS / product landing" default is 4 · 5 · 4 where `harness-recode`, a SaaS landing,
is 4 · 9 · 6, and its "luxury / cinematic" default is 5 · 3 · 7 where `elysian` is 9 · 4 · 8.
The presets are a safe starting point for a thin brief, never a target. When the subject
supports more, the anchors above are the reference, not the preset.

### Setting a dial is a decision, not a field

Each dial is argued from the subject in the same breath as the register and the tone,
appended to the Design Read line:

```
Dials: DESIGN_VARIANCE n · VISUAL_DENSITY n · MOTION_INTENSITY n — because {what in the subject demands it}.
```

A law firm at `DESIGN_VARIANCE 8` owes exactly the sentence a fashion label at 3 owes.
Neither number is wrong; an unargued one always is.

**A low value is not a low score.** `fora` at variance 3, `cursor` at 3, `reve` at density
2 — all judged good. What separates a chosen low value from a timid one is that it is
executed to the end: fora commits to a single 1px rule and uses nothing else; reve gives one
capability the whole screen and never crowds it. A low value assumed and carried through
beats a high value claimed and not delivered, every time.

**The middle is suspect.** Three 5s across three axes is the signature of a decision not
made. It is not banned — but it is worth knowing that **no page in the corpus carries a 5 on
more than one axis**. The two pages closest to the middle each buy it with a named device:
`umbrel` (5 · 6 · 4) with its solo/duet alternation, `mainframe` (5 · 4 · 6) with a brand
page that argues in the product register. So: if two or more dials land at 5, the plan says
in one line why the middle is the answer here, or moves one of them. Flag it as such — a
silent 5/5/5 is the failure this rule exists to catch.

**A high value commits you to producing something.** The number is a promise the deliverable
has to keep:

- `DESIGN_VARIANCE` ≥ 7 obliges a macrostructure that visibly departs from the canon **and**
  a signature procedure derived from the subject, applied more than once — elysian's arch as
  the system's only crop, supercommon's display line reappearing split in two. Without both,
  high variance is novelty, not direction.
- `VISUAL_DENSITY` ≥ 7 obliges a counted inventory of what is on screen **and** two spacing
  regimes — dense inside blocks, airy between them. Every high-density page in the corpus
  splits this way. Density without the second regime is noise.
- `MOTION_INTENSITY` ≥ 6 obliges a documented motion system: the material list, the duration
  set, the curve set, and entrances differentiated by role rather than one blanket reveal.
  Above 7, add a named scroll mechanism and its `prefers-reduced-motion` path.

If the deliverable does not carry the obligation, **lower the dial in the plan rather than
ship the number** — a claimed 8 that the page does not hold is the more expensive
mistake, because every downstream move inherits it.

The macrostructure pick and `DESIGN_VARIANCE` must agree. A canonical skeleton is a 3; a
rebuilt-but-legible one a 5; dropped sections and a bespoke order a 9. A plan naming the
canonical skeleton next to `DESIGN_VARIANCE 8` has one of the two wrong — resolve it before
Gate 0, not while coding.

## Gate 0 — Brief Lock

Before routing to any target skill — before writing or modifying a single line of
HTML/CSS/tokens — five artefacts must exist **in writing**, not just in your head:

0. **Register** — resolved above, stated explicitly (not defaulted).
1. **Tone** committed to ONE extreme — not an adjective that could also describe three
   competitors. Where it comes from depends on whether tone is one of the axes the
   Exploration Gate put in play:

   - **Explored** — the gate fans out 3 divergent, text-only direction sketches judged
     blind and comparatively by `fuse-ai-pilot:challenger`, and the winner's tone becomes
     this artefact. The gate runs before Step 1 of `generate` **wherever that move has a
     page body to decide** — it is no longer a single scope/register special case.
   - **Not explored** — either no gate ran, or it ran on a reduced axis list because tone
     was already arbitrated in writing. Tone is then stated directly: `generate` derives it
     from the brief, refinement moves inherit it from the existing surface and name it.
     Inheriting is not skipping — an inherited tone left unstated fails this gate exactly
     like a missing one.

   Which case applies, and which axes each scope × register combination puts in play, is
   defined **once**, in the scope table of `references/moves/generate.md` (§Exploration
   Gate). Read it there. **It is deliberately not restated here** — two copies of one rule
   are two rules that drift apart, and that file also owns the mechanics, the "reduced is
   not lighter" rule, and the fallback.

   The fallback survives unchanged and is the only route back to an unexplored direction
   when the gate was due: `Task`/`Agent` unavailable at nesting depth 5 → the direct single
   pick, and the report marked "direction not explored / single-fiat". Never a silent one.
2. **Signature element** (brand register) or **primary task** (product register) named in
   one sentence.
3. **The corpus actually read** — `design-web/references/refs-design/README.md` plus at
   least two `tokens-*.md` sections, cited by reference and section name. This is the
   evidence artefact, per `design-web/references/design-inspiration.md`; a sector URL or a
   supplied screenshot is an addition to it, never a substitute for it.
4. **Structure named, both halves** — one line in the plan:

   ```
   Macrostructure: {hero treatment from references/macrostructure-bank.md} + {body sequence from references/body-sequence-bank.md}
   ```

   Naming one without the other fails this gate. The two banks are separate on purpose:
   the hero bank owns the **first screen only**, the body-sequence bank owns **everything
   after it**. The body, not the hero, is the documented failure mode
   (`references/register/brand.md` intro) — a plan that names a hero treatment and stops
   has improvised the scroll, and improvised scrolls converge on the same
   feature-grid-then-testimonials default the corpus was assembled to break. So an unnamed
   body sequence is a missing artefact, not a detail to settle while coding.

   Restate the sequence's ordering principle in the brief's own terms, not the bank's
   label: "four chambers, one image transformation each" is a body sequence, "alternating"
   is a word. And the pick has to agree with `DESIGN_VARIANCE` (see the dial section
   above) — a canonical skeleton and a variance of 8 cannot both be true.

   Where the Exploration Gate ran, this pair is **its output, not a fresh pick**: the
   winning sketch's hero treatment + body sequence, carried forward with its principle
   line. Recording it satisfies this artefact; re-deciding it discards the comparison that
   was just paid for. Where no gate ran, pick both from the banks here.

This is a **present/absent check on five named artefacts** — structural, not a taste
judgment. One missing ⇒ **generation or modification is forbidden** until it exists.
Mechanics of artefacts 1–2 (the Exploration Gate and its scope table, brief questions,
signature element, two-pass critique) live in `references/moves/generate.md`; the two banks
own the vocabulary of artefact 4. This section is only the checkpoint every move respects
before it's allowed to touch code — it says *what must exist*, never *how it was produced*.

## Design guidance

Dense and general, applying whichever move is running — taste rules specific to one move
live in that move's file.

### Absolute bans

Match-and-refuse, unconditional across both registers — not a statistical reflex to weigh,
a hard stop. If you're about to write any of these, rewrite the element with a different
structure, never a variation on the same idea.

- **Side-stripe borders** — `border-left`/`border-right` >1px as a colored accent on cards,
  list items, callouts, or alerts. Rewrite with full borders, background tints, leading
  numbers/icons, or nothing.
- **Gradient text** — `background-clip: text` combined with a gradient background.
  Decorative, never meaningful. Single solid color; emphasis via weight or size.
- **Glassmorphism as default** — blurs/glass cards used decoratively rather than rare and
  purposeful, or nothing.
- **The hero-metric template** — big number, small label, supporting stats, gradient
  accent. SaaS cliché; see `register/brand.md` §2 "Ribbon 4-stats" furniture for the fix.
- **Identical card grids** — same-sized cards, icon + heading + text, repeated endlessly.
- **Modal as first thought** — modals are usually laziness. Exhaust inline/progressive
  alternatives first.
- **Em dash in copy** — commas, colons, semicolons, periods, or parentheses instead. Also
  not `--`.
- **The AI-slop signature triad** — defined here and canonical here; every other file in
  the pipeline points back to this bullet instead of restating it. Three tells that each
  pass on their own and together fingerprint the page:
  1. a **Tailwind blue/indigo primary or accent**, hue range 200–290°;
  2. **Inter as the primary typeface**;
  3. **`rounded-2xl` as the default radius**.

  That palette/font/radius combination is shared by **~83% of sampled AI-generated pages**
  (grounding: sailop ai-slop research). The figure belongs to this triad and to nothing
  else — never quote it for another ban, another detector, or a general anti-slop claim.

  Any two legs are survivable; the third is what makes the page identifiable. So if brand
  guidelines already fix 2 of the 3, the third MUST change — another hue, another radius,
  or another typeface (reflex-reject list and alternatives:
  `design-system/references/forbidden-fonts.md`). The corpus carries the counter-example:
  `fora-recode` and `umbrel-recode` both ship Inter and both read specific, because neither
  carries either of the other two legs.

Deterministic grep companions for the structural ones (side-stripe, identical grids,
nested cards, icon-bento): `design-review/references/anti-ai-slop-audit.md`.

### The AI-slop test — 2 levels

If someone could look at this interface and say "AI made that" without doubt, it's failed.
Run at **two altitudes** — the second catches what the first misses. Cross-register
failures are the Absolute bans above; register-specific failures live in each
`register/*.md`.

**First-order — category reflex.** If someone could guess the theme + palette from the
category alone, it's the first training-data reflex:

1. **Cream #F4F1EA + a contrasted serif + terracotta accent** — the default "editorial
   SaaS" look.
2. **Near-black background + one acid accent color** — the default "dark developer tool"
   look.
3. **Broadsheet hairlines, zero border-radius, black/white only** — the default "premium
   minimal" look.
4. **Glassmorphism + `rounded-2xl` used globally** — the default "2026 AI app" look,
   applied everywhere instead of gated (`design-motion` gates it deliberately).
5. **Generic icon-bento** — every cell centered text over a round colored-icon badge, zero
   image/gradient/pattern variation between cells.

Rework the Design Read's vibe words and the color strategy (`design-system` §Color
strategy) until the answer isn't obvious from the category — "observability → dark blue",
"healthcare → white + teal", "finance → navy + gold", "crypto → neon on black" are all this
tier. Purple-on-white gradients are banned outright regardless of tier — the single most
common tell.

**Second-order — category-plus-anti-reference trap.** The first reflex was avoided, but if
someone could still guess the aesthetic *family* from category-plus-anti-references — "AI
workflow tool that's not SaaS-cream → editorial-typographic", "fintech that's not
navy-and-gold → terminal-native dark mode" — it's the trap one tier deeper. Rework until
neither answer is obvious. Register-specific reflex-reject aesthetic lanes:
`register/brand.md` and `register/product.md`.

Deterministic grep detectors cover the first-order clusters plus the Absolute bans; the
second-order trap is judgment, checked at the challenger gate
(`design-review/references/review-procedure.md`), not grep-lintable.

### Macrostructure variety — hero AND body

Centered hero + 3-column icon-card grid is forbidden as a default skeleton. Before any plan
is finalized, name **two** picks: a hero treatment from `references/macrostructure-bank.md`
(first screen only) and a body sequence from `references/body-sequence-bank.md` (everything
after it, with its ordering principle restated in the brief's own terms). A plan carrying
only a hero treatment has improvised the scroll — the body is the documented failure mode.

Following the canon is a legitimate pick. `fora-recode`'s "Bookended Canon" runs the
canonical skeleton almost to the letter and does not read generic, because one device — a
single 1px rule at white 10% — is carried through every edge, card and divider.
`endlesstools-recode` keeps the same order and fills every slot with footage. Departing is
equally legitimate: `elysian`'s "Vitrine Descent" drops the feature grid, testimonials,
pricing, FAQ and CTA band outright. What is never legitimate is **not choosing** — the
skeleton that arrived by default is the one that reads as generated.

Let each pick follow the subject, not habit: a treatment or a sequence reused by reflex
across briefs becomes its own template, whichever one it is. A pick used on two consecutive
briefs has to be argued from the second subject or replaced — the fact that it worked once
is not an argument.

### Non-negotiable floor

Regardless of tone, register, target, or move, every deliverable must have: responsive
behavior across the target's breakpoints/size classes; visible keyboard focus on every
interactive element (`:focus-visible`, never suppressed); `prefers-reduced-motion`
respected wherever motion is added.

### Generation approach

Generate HTML/CSS directly — the default and primary path, following the same method as
Anthropic's official `frontend-design` skill (commit to a point of view, avoid templated
defaults, verify with tools not vibes). Gemini Design MCP, Magic (21st.dev) and shadcn MCP
are optional conveniences, never a requirement; direct generation is always the fallback.
Mobile targets (`design-ios`, `design-android`) never generate SwiftUI or Compose — they
produce token specs, an HTML device-framed mockup, and a platform handoff spec.

### Frozen taste data — canonical home, read from source, never restated

| Concern | Path |
|---|---|
| Token strategy (color/type/spacing) + `design-system.md` format | `skills/design-system/SKILL.md` |
| Sector palettes | `skills/design-system/references/sector-palettes.md` |
| Typography pairs | `skills/design-system/references/typography-pairs.md` |
| OKLCH color mechanics | `skills/design-system/references/oklch-system.md` |
| Forbidden fonts (canonical) | `skills/design-system/references/forbidden-fonts.md` |
| Buttons | `skills/design-web/references/buttons-guide.md` |
| Cards | `skills/design-web/references/cards-guide.md` |
| Spacing / density | `skills/design-system/references/spacing-density.md` |
| Layout hard rules | `skills/design-web/references/layout-discipline.md` |
| Visual design technique | `skills/design-web/references/ui-visual-design.md` |
| Hero treatments (first screen only) | `skills/design-method/references/macrostructure-bank.md` |
| Body sequences (section order after the hero) | `skills/design-method/references/body-sequence-bank.md` |
| Reference corpus (taste source, read FIRST; also the anchor set for the 3 dials) | `skills/design-web/references/refs-design/README.md` + the `tokens-*.md` it indexes |
| Dial presets by use-case, partial-brief fallbacks, `MOTION_INTENSITY` bands | `skills/design-system/references/design-read-dials.md` (the anchored scale itself lives in this file, §Design Read) |
| Premium layout patterns | `skills/design-web/references/premium-patterns/PATTERNS.md` |
| Component composition | `skills/design-web/references/component-composition-ref.md` |
| Taste sourcing order (corpus first, then 1-2 sector sites for register only) + the canonical Lookalike Test | `skills/design-web/references/design-inspiration.md` (+ `-urls.md`) |

## Routing

1. **Read `../design-system/SKILL.md`** (Setup step 2) — first step of routing, not
   optional, not conditional on `design-system.md` already existing.

**Moves** — the one file each dispatches to owns the step-by-step procedure and the report
template; read it, don't reinvent it.

| # | Move | When to use | File |
|---|------|-------------|------|
| 2 | **generate** | Nothing built yet — new page, app screen, component, or mobile mockup | `references/moves/generate.md` |
| 3 | **critique** | UX design review of an existing surface — hierarchy, clarity, emotional resonance | `references/moves/critique.md` |
| 4 | **audit** | Technical quality pass — a11y, contrast, responsive, token adherence | `references/moves/audit.md` |
| 5 | **bolder** | Design reads as timid/generic for its committed tone — commit harder, don't add elements | `references/moves/bolder.md` |
| 6 | **quieter** | Design reads as loud/overloaded — dial back intensity | `references/moves/quieter.md` |
| 7 | **distill** | Design reads as overloaded with elements — strip to essence | `references/moves/distill.md` |
| 8 | **harden** | Error states, i18n, text overflow, edge cases missing | `references/moves/harden.md` |
| 9 | **polish** | Final pass before shipping — design-system alignment, last-mile detail | `references/moves/polish.md` |
| 10 | **redesign** | Total redesign/refonte of an EXISTING surface — rethink structure/layout/typography/composition from scratch, keep the existing color palette, never copy-paste the old design | `references/moves/redesign.md` |

**Target skill chain** — which skill(s) the matched move (typically `generate`) routes
into next, per platform, once `design-system/SKILL.md` has already been read (step 1):

| Platform | Chain |
|---|---|
| Web (marketing/landing) | `design-web` → `design-motion` → `design-review` |
| Web app (dashboard/SaaS) | `design-webapp` → `design-motion` → `design-review` |
| iOS | `design-ios` → `design-review` |
| Android | `design-android` → `design-review` |
| Copy only | `ux-copy` (any point in the pipeline) |

Scope (FULL / PAGE / COMPONENT / MOBILE — how much sourcing and audit depth a `generate`
run needs) is resolved inside `references/moves/generate.md`, not here.

## Next

Read the matched move file from the Routing table above. Token/contrast mechanics live in
`design-system` (already read at step 1); the final quality gate — deterministic checks +
the challenger gate — lives in `design-review`.
