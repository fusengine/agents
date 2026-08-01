---
name: design-read-dials
description: "design-system pre-step — infer a Design Read from the brief, then set 3 numeric dials (DESIGN_VARIANCE, VISUAL_DENSITY, MOTION_INTENSITY) that become contractual inputs for every later step."
when-to-use: Before choosing palette/typography, at the very start of a new identity
keywords: design read, brief inference, dials, variance, density, motion, presets, partial brief
priority: high
related: identity-brief.md, typography-pairs.md, oklch-system.md
---

# Design Read + Direction Dials

> Attribution — The Design Read and the qualitative brief-to-direction logic are
> **adapted from Leonxlnx/taste-skill** (`imagegen-frontend-web` brief-to-direction
> mapping; `image-to-code` baseline dials). The `MOTION_INTENSITY` dial and the
> numeric preset table below are a **Fusengine design decision** — the source ships
> single default dials and a *qualitative* mapping, not per-use-case numeric triples.

## Step 0 — Write the Design Read (before any palette or font choice)

Infer, from the brief, and state them explicitly in one "Design Read" line:

- **Page kind** — landing / product / editorial / dashboard / portfolio / store / institutional.
- **Vibe words** — 2-4 adjectives the result must feel like (e.g. "calm, precise, trustworthy").
- **Audience** — who reads this and in what context.
- **Brand assets** — logo, existing palette, fonts, imagery already provided (reuse, don't reinvent).
- **Quiet constraints** — anything implied but unstated (regulated sector, accessibility floor, dark-only, print parity).

Output format:
```
Design Read: {page kind} for {audience}; vibe = {vibe words}; assets = {assets or "none"}; constraints = {constraints or "none"}.
```

The Design Read anchors every downstream choice. The brief always overrides any default.

## The 3 dials (contractual outputs of this step)

Set each on a 1-10 scale. These become **Inputs** of Phases 1+.

| Dial | 1 | 10 | Adapted / Fusengine |
|------|---|----|----|
| `DESIGN_VARIANCE` | rigid, symmetrical, conventional | highly art-directed, asymmetric | Adapted from taste-skill |
| `VISUAL_DENSITY` | airy, gallery-like, calm | packed, information-dense | Adapted from taste-skill |
| `MOTION_INTENSITY` | static / near-still | cinematic, scroll-driven | Fusengine design decision |

`MOTION_INTENSITY` qualitative bands: **calm** (< 4) subtle fades/hovers only · **expressive** (4-7) scroll reveals + deliberate transitions · **cinematic** (> 7) pinned/scrubbed/parallax storytelling.

## What a notch actually looks like — read this before setting a dial

The 1/10 poles above are the range, not a scale. Fifteen shipped pages carry measured
triples in `../../design-web/references/refs-design/*/design-system.md`, and
`../../design-method/SKILL.md` turns them into an anchored scale — which page sits at
which notch, and what that gives on screen. **That file is canonical; read the scale
there, do not restate it here.** Three things it establishes, which change how the
tables below should be used:

- A **low value is not a low score.** `fora` and `cursor` are at VARIANCE 3 and both
  read specific. A value held and treated beats a value claimed and unmet.
- **No page in the corpus is high on all three axes.** Every one gives something up.
- A **high value obliges.** MOTION 6+ without a documented material/duration/curve
  set, VARIANCE 7+ without a departing macrostructure and a repeated signature
  procedure: lower the dial rather than ship the number.
- **A low DENSITY obliges too, and this is the one the numbers hide.** The anchored
  table in `design-method/SKILL.md` carries a fourth column stating what is physically
  on screen at each notch, because the notch alone does not say. Both corpus pages at
  DENSITY 2 are carrying real matter — `reve` has 51 images and 2 videos, `supercommon`
  three photographs and a looping video under a 30vh scrim. **Density says how much
  scroll a quantity of matter is spread over; it never says how much matter there is.**
  A `2` copied onto a page with no assets does not reproduce `reve`, it reproduces the
  number and drops the page.

**Before setting DENSITY at all, check the screen-holding floor.** `VISUAL_DENSITY` ≤ 3
combined with `DESIGN_VARIANCE` ≥ 6 **and** no visual asset in the brief is not a
direction, it is an empty page: the variance drops the furniture, the density spreads
what is left, and nothing is available to fill what they cleared. The corpus has no such
page. The rule, its countable check and the three ways out (raise the density,
manufacture the matter, lower the variance) are canonical in `design-method/SKILL.md`
§*The screen-holding floor* — read them there, they are not restated here.

## Preset defaults by use-case (Fusengine — override from the Design Read)

Derived from the verified taste-skill brief-to-direction mapping; the numbers are our
coherent defaults, not values quoted from the repo.

**These are a floor for a thin brief, never a target.** The SaaS row reads 4·5·4 where
`harness`, a SaaS landing, ships 4·9·6 — and no row here reaches 9 on any axis, while the
corpus does. Taking a preset as the answer is the mechanism that pulls every output toward
the middle. Start here only when the brief tells you nothing, then argue each dial up or
down from the subject.

Two rows fail the other way: agency 8·4·7 and luxury 5·3·7 sit **above** anything on disk,
since the corpus tops out at variance 7 and motion 6. Those two are not anchored by any
reference; claim them only with the obligations `design-method/SKILL.md` attaches to a high
value, and say in the plan that no page in the corpus demonstrates the number.

**The luxury row carries a second, quieter trap: its `VISUAL_DENSITY 3`.** Luxury and
cinematic briefs are the ones most likely to arrive with no photo library — and a `3` taken
from this row on a brief with no assets walks straight into the screen-holding floor above.
The row assumes a page with *few, large* things on it, not a page with *nothing* on it.
Either the matter exists (photography, an object, a document, a drawn surface), or the
density is not a 3 — count first, per Gate 0 artefact 4, and set the dial after.

| Use-case | DESIGN_VARIANCE | VISUAL_DENSITY | MOTION_INTENSITY |
|----------|:---:|:---:|:---:|
| SaaS / product landing | 4 | 5 | 4 |
| Editorial / magazine | 7 | 4 | 5 |
| Public-sector / institutional | 3 | 6 | 2 |
| E-commerce / store | 5 | 6 | 4 |
| Agency / creative / portfolio | 8 | 4 | 7 |
| Luxury / cinematic | 5 | 3 | 7 |

## Partial brief — documented per-dial defaults

When the brief does not let you infer a dial, do **not** guess silently — use the
documented fallback and note it in the Design Read:

- `DESIGN_VARIANCE` → **5** (balanced; neither templated nor loud).
- `VISUAL_DENSITY` → **5** (standard rhythm).
- `MOTION_INTENSITY` → **3** (restraint by default; motion is added on evidence, not assumed).

Then bias each fallback toward the nearest matching preset row if even a rough
use-case is known.

**Two 5s are a signal, not a resting state.** `design-method/SKILL.md` treats a triple
sitting at the middle on more than one axis as a choice not made — legitimate only when
argued in the plan. No page in the corpus carries a 5 on more than one axis. If you have
landed here by fallback rather than by reading the brief, say so in the Design Read and
go back for the one fact that would move a dial: what the subject is *for*, and what it
would be embarrassing for this page to look like.

## Next
These dials feed `design-web` (composition variety, consistency rules) and
the later generation/motion steps. Do not restate them there — read them as Inputs.
