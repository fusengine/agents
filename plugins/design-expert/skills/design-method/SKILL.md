---
name: design-method
description: "Core design method — Register resolution (brand vs product), the Design Read one-liner + the 3 dials (DESIGN_VARIANCE/VISUAL_DENSITY/MOTION_INTENSITY), the Gate 0 brief lock, Absolute bans, the 2-level AI-slop test, and routing to a move (generate/critique/audit/bolder/quieter/distill/harden/polish) and its target skill. Read this first, before design-system, any register/*.md, or any moves/*.md file."
when-to-use: "Start of any design task, before picking a move or writing/editing a single line of HTML/CSS/tokens."
keywords: register, brand, product, dials, gate-0, absolute-bans, anti-slop, routing, moves, method
priority: critical
related: design-system, design-web, design-webapp, design-ios, design-android, design-review, ux-copy
---

<!-- Grounding: grounding-corpus.md §A (impeccable anatomy — thin router, Register, dials, Absolute bans, 2-level slop test), §G (root-cause fix: template reproduction demoted, register-first), §H (kept anchors: Gate 0, Signature Dominance, Focal-Block Floor, Competitor Lift Test, MOTION_INTENSITY). -->

# Design Method — The Core

This is the one place the design pipeline is defined. The agent (`agents/design-expert.md`)
always loads this file before dispatching to a move; every `references/register/*.md` and
`references/moves/*.md` file assumes you've read this first and references it instead of
restating it — if a rule elsewhere contradicts this file, this file wins.

## Setup

How this core gets loaded, every time, no exceptions:

1. Read this file once per task — not once per move, once per task. If a second move runs
   later in the same task and nothing about the Register or the codebase changed, don't
   re-read it.
2. **Read `../design-system/SKILL.md`** — always, unconditionally, before anything else
   below. It's a thin, pointer-only file, cheap to reload; this exact read is also the
   harness's phase-1 trigger, so it happens even on a task that turns out to need no new
   token. Existing `design-system.md` tokens still win over its defaults once resolved.
3. Resolve **Register** (below), then write the **Design Read + 3 dials** one-liner.
4. Pass **Gate 0 — Brief Lock** (below) before touching any HTML/CSS/tokens.
5. Read the ONE matched `references/moves/<move>.md` from the Routing table — not two, not
   a skim of several to "compare." The move file owns the how; this file only owns the gate
   and the pointer.
6. If the move builds or touches code, the Register also gates which
   `references/register/{brand,product}.md` floors apply — read that file too, once.

## Register

Resolve **before anything else downstream** — brand vs product gates every floor
(Signature Dominance, Focal-Block Floor, tone bounds, motion budget, the dial presets
below). Never default silently.

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
each carries the register-specific floors, tone bounds, and motion budget for that lane.
For copy/microcopy tone by register, load `references/register/copy.md` (used by
`ux-copy` and by any move that touches user-facing text, regardless of which move it is).

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

Full preset-by-use-case table, partial-brief fallbacks, and `MOTION_INTENSITY` qualitative
bands (calm <4 / expressive 4–7 / cinematic >7): read
`../design-system/references/design-read-dials.md` — mechanics live there, don't restate
them here. The brief always overrides any default; an unresolvable dial uses the documented
fallback and says so in the Design Read line, never a silent guess.

## Gate 0 — Brief Lock

Before routing to any target skill — before writing or modifying a single line of
HTML/CSS/tokens — four artefacts must exist **in writing**, not just in your head:

0. **Register** — resolved above, stated explicitly (not defaulted).
1. **Tone** committed to ONE extreme — not an adjective that could also describe three
   competitors. Produced by the matched move (`generate` derives it from the brief;
   refinement moves inherit it from the existing surface and state it explicitly).
   **FULL scope + brand register only**: produced by the Exploration Gate — 3 divergent,
   text-only direction sketches judged comparatively by `fuse-ai-pilot:challenger` —
   instead of a single fiat pick; mechanics and fallback in
   `references/moves/generate.md` (before its Step 1). Every other scope/register
   combination (product, or FULL/PAGE/COMPONENT/MOBILE outside brand) keeps the direct
   single-fiat pick — no exploration, no added cost.
2. **Signature element** (brand register) or **primary task** (product register) named in
   one sentence.
3. **At least one concrete reference** (a URL, a screenshot) supplied or found — OR the
   mandatory browse in `design-web/references/design-inspiration.md` actually executed,
   not merely planned.

This is a **present/absent check on four named artefacts** — structural, not a taste
judgment. One missing ⇒ **generation or modification is forbidden** until it exists. The
mechanics of producing artefacts 1–2 (the brief questions, the signature element, the
two-pass critique) live in `references/moves/generate.md`, not here — this section is only
the checkpoint every move respects before it's allowed to touch code.

## Design guidance

Dense and general — the taste rules specific to one move live in that move's file, not
here. These apply regardless of which move is running.

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

### Macrostructure variety

Centered hero + 3-column icon-card grid is forbidden as a default skeleton. Pick a
different one from `references/macrostructure-bank.md` before any plan is finalized and
name it explicitly — the same "vary every time" discipline
`design-web/references/design-inspiration.md` applies to inspiration sourcing, one level
up, applied to the chosen page skeleton.

### Non-negotiable floor

Regardless of tone, register, target, or move, every deliverable must have: responsive
behavior across the target's breakpoints/size classes; visible keyboard focus on every
interactive element (`:focus-visible`, never suppressed); `prefers-reduced-motion`
respected wherever motion is added.

### Generation approach

Generate HTML/CSS directly — the default and primary path, following the same method as
Anthropic's official `frontend-design` skill (commit to a point of view, avoid templated
defaults, verify with tools not vibes). Gemini Design MCP, Magic (21st.dev), and shadcn MCP
are optional tools of convenience — never a requirement, native direct generation is always
the fallback. Mobile targets (`design-ios`, `design-android`) never generate SwiftUI or
Compose — they produce token specs, an HTML device-framed mockup, and a handoff spec for
the platform developer.

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
| Macrostructure skeletons | `skills/design-method/references/macrostructure-bank.md` |
| Premium layout patterns | `skills/design-web/references/premium-patterns/PATTERNS.md` |
| Component composition | `skills/design-web/references/component-composition-ref.md` |
| Inspiration browsing | `skills/design-web/references/design-inspiration.md` (+ `-urls.md`) |

## Routing

1. **Read `../design-system/SKILL.md`** (Setup step 2 above) — this is the first step of
   routing, not optional, not conditional on whether `design-system.md` already exists.

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

Scope (FULL / PAGE / COMPONENT / MOBILE — how much browsing and audit depth a `generate`
run needs) is resolved inside `references/moves/generate.md`, not here.

## Next

Read the matched move file from the Routing table above. Token/contrast mechanics live in
`design-system` (already read at step 1); the final quality gate — deterministic checks +
the challenger gate — lives in `design-review`.
