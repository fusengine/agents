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

## Preset defaults by use-case (Fusengine — override from the Design Read)

Derived from the verified taste-skill brief-to-direction mapping; the numbers are our
coherent defaults, not values quoted from the repo.

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

## Next
These dials feed `design-web` (composition variety, consistency rules) and
the later generation/motion steps. Do not restate them there — read them as Inputs.
