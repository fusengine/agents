---
name: premium-patterns
description: "Ten section-level visual devices measured on shipped Framer/Webflow sites — one technique each, applied INSIDE one section. Not a page skeleton, not a sector lookup, and not a source of macrostructure or body order."
when-to-use: "During component generation, once the hero treatment AND the body sequence are already picked — to give one already-planned section a measured craft treatment."
keywords: patterns, section-device, craft, surface, substance-floor
priority: high
related: ../layout-discipline.md, ../ui-visual-design.md, ../../../design-method/references/macrostructure-bank.md, ../../../design-method/references/body-sequence-bank.md, ../../../design-method/references/register/brand.md
---

## Premium Patterns — Section Devices, Never Page Structure

**These files give section decoration. They never give a page structure.**
Each of the ten carries exactly one technique living inside a single section:
a numbering treatment, a hover reveal, a letter with a photo clipped into it,
a tab crossfade. None of them describes a page, an order of sections, or a
scroll.

Structure comes from two other files, and only from them:

- **First screen** — `../../../design-method/references/macrostructure-bank.md`,
  eight hero treatments plus the forbidden centered-hero default.
- **Body** — `../../../design-method/references/body-sequence-bank.md`, fifteen
  body sequences read off shipped code, each with the principle that decides
  its order and what it drops from the canon. Its rule 2 is the one that
  matters here: *the canon is not the enemy, uniform treatment of it is* —
  `fora` sets vertical padding section by section
  (160/180/180/160/180/180/180) rather than one value everywhere.

A plan names one of each — `Macrostructure: {hero treatment} + {body sequence}`
— before this file is opened. If you are reading here to decide what sections a
page has, you are in the wrong file.

> **Why the amputation.** Until 2026-07 each of these ten files carried a full
> Nav → … → Footer walkthrough plus an "AI Generation Prompt" that prescribed
> every one of those sections in order, with values. Fusing two of them built a
> macrostructure by collage — the exact failure the rest of this skill bans, and
> worse than a browsed template because the output was executable. The
> walkthroughs and the page prompts are gone. What remains per file: the device,
> its measured CSS, its conditions of use, and — where one exists — the shipped
> feedback that qualifies it.

### Source URLs are provenance, not a destination

Each `description.md` frontmatter keeps its `source:` URL. It records where the
device was measured, which is honest traceability. It is **not** an invitation
to open the site and lift taste from it — `../design-inspiration.md` owns that
ban and it is unchanged. Read the values here; do not go back to the source.

### How to use

1. Confirm the hero treatment and body sequence are already decided
   (`../../../design-method/SKILL.md`, Pass 1). This file supplies neither.
2. Identify the ONE already-planned section that needs a craft treatment.
3. Read ONE `description.md`. Apply its device to that section only.
4. Run the section against the Body Substance Floor below — a device wrapped
   around generic copy is decorated slop, not solved slop.
5. Numeric limits stay with `../layout-discipline.md` (hero caps, eyebrow cap,
   zigzag cap, bento N=N, section-repetition ban, measure floor). Nothing here
   overrides them; where a device could collide with one, its file says so.

**On combining.** Two devices on one page is a ceiling, not a target, and never
a checklist. They must land on two non-adjacent sections of two different
layout families (`../layout-discipline.md` §5). Do not combine prompts: one
device per section, at most.

### Pattern Index — the device each file carries

| # | Path | Device (one per file) |
|---|------|------------------------|
| 01 | `01-numbered-services/description.md` | Bracketed `[01]` index rows + hover image reveal |
| 02 | `02-alternating-sections/description.md` | Hard-cut background change at ONE boundary, inside the locked theme — never a light/dark flip — + sub-5% dot-grid watermark |
| 03 | `03-hero-badge-inline/description.md` | Pill badge and icon set inline in the H1 text flow |
| 04 | `04-bento-grid/description.md` | Asymmetric bento cell mix (2x2 / 2x1 / 1x1) |
| 05 | `05-fullbleed-hero/description.md` | Oversized low-opacity wordmark watermark + hue-tinted image overlay |
| 06 | `06-gradient-steps/description.md` | Oversized ghost numeral as card background texture |
| 07 | `07-cta-giant-typography/description.md` | Photograph clipped inside 1-2 display letters (`background-clip: text`) |
| 08 | `08-radical-alternation/description.md` | One serif-italic connector word inside a sans display heading — gated |
| 09 | `09-tabs-image-swap/description.md` | Pill-in-pill tab bar crossfading a paired image + text |
| 10 | `10-accordion-carousel/description.md` | Single-open accordion; horizontal snap carousel with peeking card |

### Illustrative Examples (NOT a sector lookup — cross-pollinate deliberately)

The "Historically common" column shows what has been reached for by default in
each sector — that is precisely the convergence risk, not a recommendation.
Treat it as a first-draft reference at most; picking from the "Consider instead"
column, or a device outside both, is often the better choice specifically
because it isn't the sector default. State the choice against the POV, same
discipline as `macrostructure-bank.md`'s "deliberate exception, not a default
reached by omission":

| Sector | Historically common | Consider instead |
|--------|---------------------|-------------------|
| SaaS | 02, 04, 06 | 01, 07 (bold typography breaks SaaS sameness) |
| Agency/Creative | 01, 07, 08 | 04, 09 (structured grid breaks agency chaos-default) |
| Fintech | 04, 06, 09 | 05, 08 (dramatic contrast breaks fintech blue-sameness) |
| Healthcare | 02, 05, 09 | 01, 10 (numbered/expandable breaks healthcare-calm sameness) |
| E-commerce | 03, 04, 10 | 07, 08 |
| Luxury | 05, 07, 08 | 09, 10 |
| B2B | 01, 09, 10 | 04, 06 |

The `seen-in:` key in each file's frontmatter records the sector the device was
measured in. Same status as `source:` — provenance, never a filter.

### Body Substance Floor (surface is not substance)

A page that stacks two of these devices but says nothing product/brand-specific
has decorated the slop, not solved it. Before shipping any device, the section
using it must pass:

- **The Competitor Lift Test**
  (`../../../design-method/references/register/brand.md` §3) — could this
  section's copy and claim run unchanged on a competitor's site wearing the same
  device? If yes, the device is polishing filler.
- **A real, sourced claim** — the device's headline/number/step must carry an
  actual fact from the brief (a real metric, a real process step, a real product
  name), never an invented placeholder dressed up in a nice grid.
- **Domain-Specificity**
  (`../../../design-method/references/register/product.md` §2, when register is
  `product`) — would this surface look native dropped unedited into an unrelated
  product?

A beautiful hover reveal over a generic "Fast. Reliable. Scalable." headline
still fails.

### Relief is not inversion — arbitration with pre-flight check 3

This file used to offer "ONE inverted band" as the cure for a flat page, while
`../../../design-review/references/pre-flight-checklist.md` check 3 failed **any**
section that inverted. Two rules, one page, opposite verdicts — and check 3
always won, because only it blocks mechanically. Both were adjusted on a count
taken across the corpus — re-taken at fifteen pages, and the count still settles
it:

- **Theme inversion at section level: 1 of 15.** It was 0 of 10. The one page that
  does it is `stripe-recode`, a light-locked page with a dark block mid-scroll —
  and it is a **reproduction** of a source that ships that block, logged in its own
  `tokens-stripe.md § 8.1` as a check-3 fail *kept for fidelity and reported, not
  corrected*. It licenses nothing here: no original page in the corpus inverts, and
  the cure this file offers must still not be a flip. `cursor` is the only
  light-based page among the first ten; its sole dark surfaces are a phone chassis
  drawn in CSS and its own whole-page dark theme.
- **A section departing from the page base *inside* the theme: 7 of 15** —
  `supercommon` (first band on a metallic gradient rising to `#bfc6c1`), `fora`
  (closing band `#000 → #1b2228` under a 190px horizon image), `harness`
  (`#070707 → #050505` under two sections), `umbrel` (a 160px joint dissolving one
  band into the next), `xai` (an 80px grid drawn in two 1px gradients under an
  elliptical mask), `dispatch` (a `--surface-band` fill on its counter band, the
  page's only bordered one), `parley` (`--pearl` alternating with `--pearl-tint`
  across nine sections).
- **The five most recent folders add a third answer this file did not have:** relief
  from a **full-bleed photograph** rather than from a tint. `stash` gets it from six
  rounded photographic cards, `parley` from four full-width bands, `mosa` from a
  darkened photograph under every media slot. That is now the corpus's most common
  cure for flatness, and it inverts nothing.

So the relief this section demands is real and the corpus supplies it — as a
**surface** change, never a **theme** change. Check 3 stands as written; the word
"inverted" is gone from the table above because nothing on disk does it.

Two things worth copying from `supercommon`, since it is the corpus's clearest
case of this device:

1. **One departure, and the CSS enforces it.** Three later bands carry a
   `.band--opaque` rule whose only job is to stop that metallic gradient bleeding
   under them. The page does not merely happen to have one special band; it is
   built so the others cannot become special.
2. **It lands on the section that earns it** — the title band, the first thing
   read. A departure spent on a mid-page filler section buys nothing.

Pattern `02-alternating-sections/` carries this device. Its own file already
caps it at one boundary and already warns that strict light/dark alternation on
every boundary is itself an AI signature; read it there before applying it.

### Flatness is banned — and so is one mandatory recipe for relief

The list below names failures. It deliberately does **not** prescribe a single
cure, because a cure applied everywhere becomes the next tell: strict
light/dark alternation on every boundary is itself an AI signature (see 02), and
a mandatory 3-level shadow on every card reads as a framework default.

| Failure | Why it fails | Ways out (pick one, deliberately) |
|---------|--------------|-----------------------------------|
| Every section on the same background with no other relief device | The page reads as one undifferentiated column | ONE section whose background departs from the base **without leaving the theme** — a tint, a gradient, a full-bleed image section, a drawn pattern; or per-section vertical padding rhythm (`body-sequence-bank.md` rule 2); or a rule or motif crossing section boundaries. **Never a theme inversion** — see below |
| Display headline sized like body copy (register `brand`) | No focal block — `../layout-discipline.md` §9 fails | Scale the display type, or give the viewport its focal block another way (image, number, full-bleed panel). `../layout-discipline.md` §1 owns the hero numbers, not this file. Register `product` is exempt |
| Cards with no border AND no tint AND no elevation AND no image | The card is invisible; the grid reads as loose text | Any ONE of border, tint, elevation, image. Not all four, and not a mandatory 3-level shadow scale |
| A raw `<ul>` of more than 5 service items | Already a `../layout-discipline.md` §7 fail | Numbered rows (01), accordion (10), tabs (09), 2-col split, scroll-snap pills |
| A closing CTA that restates the hero verbatim | The page ends with nothing new | Give the closing ask its own device (07, 05) or its own content — a form, a real availability, a named next step |
| Any device applied to generic/unsourced copy | See Body Substance Floor | Fix the copy; the device is not the problem |
