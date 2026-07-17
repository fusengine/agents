---
name: design-web
description: "Marketing sites, landing pages, campaign pages — register `brand` (design IS the product). Structure comes from the register's POV + a macrostructure pick, never from copying an inspiration site's section flow. Hero discipline, deviated section order, asymmetric grids, and a silhouette lookalike-test gate before ship."
when-to-use: "Building or revising a marketing/landing/campaign page after design-method's Gate 0 has locked register `brand`. If the surface is a logged-in dashboard/app screen, use design-webapp instead — design-method's routing table decides which."
keywords: web, marketing, landing, hero, macrostructure, anti-slop, lookalike-test, asymmetric
priority: critical
related: design-method, design-system, design-webapp, design-motion, design-review, ux-copy
---

## Design Web — Marketing & Landing, Register Brand

### When
After `design-system` tokens exist and `design-method`'s Gate 0 has locked register
`brand` (one dominant, expressive message). Read `design-method`'s routing table first —
a dashboard/app/utility surface routes to `design-webapp` instead. Exception: a
marketing-adjacent surface living inside an app shell (e.g. an in-app pricing page) still
routes here for that one page (see `design-webapp`'s reciprocal note).

### Input
- `design-system.md` — OKLCH palette, type pair, spacing density, the 3 dials.
- `design-method/references/register/brand.md` — the page's POV sentence and the
  per-section Competitor Lift Test (loaded once per task, not re-read per step).
- The `generate` move report (`design-method/references/moves/generate.md`) if this task
  started from Gate 0 — steps 1-4 of that report (register, inspiration, tokens,
  macrostructure) are inputs here, not repeated.

### Steps

1. **Structure comes from register + macrostructure, never from template reproduction.**
   `references/design-inspiration.md` browsing extracts palette, typography, and depth
   cues ONLY — section flow, spacing rhythm, and layout are never copied from a reference
   site. The actual skeleton is the macrostructure picked in `design-method`'s `generate`
   move (`references/macrostructure-bank.md`) filtered through the POV in `register/brand.md`.
   Reproducing an inspiration site's structure verbatim is the single biggest source of
   templated output — treat it as a hard boundary, not a style preference.

2. **Deviate the section order.** The canonical skeleton
   (nav → hero → features → testimonials → pricing → faq → cta → footer) is a detectable
   flag when used verbatim end-to-end. Reorder, merge, or drop at least one section against
   the POV — state which one moved and why in the generate-move report's macrostructure
   line. `register/brand.md` §2 (Body ≠ SaaS Furniture) governs which sections are safe to
   cut or fold.

3. **Hero discipline (nngroup visual-hierarchy, lawsofux, refactoringui):**
   headline **< 10 words**, subhead **< 20 words**, **1 primary CTA**, real product/brand
   visual (not a stock abstraction). This word-count floor is tighter than
   `references/layout-discipline.md`'s hero hard numbers (≤ 2 lines, ≤ 4-element stack) —
   both apply; the tighter one wins on conflict. CTAs stay ≤ 3 touchpoints on the whole
   page, secondaries visually subordinate to the one primary. Von Restorff: exactly one
   visually distinct focal element per viewport reads as memorable — see the Focal-Block
   Floor (`layout-discipline.md` rule 9), mandatory in this register.

4. **Break grid and padding sameness.** Prefer asymmetric column splits (2/1, 1/2,
   span-2, bento) over a uniform 3-column grid reused section after section. Vary section
   padding for rhythm — tight groupings inside a section, generous separation between
   sections — instead of one uniform value applied everywhere. `layout-discipline.md`
   still owns the numeric caps (eyebrow restraint, zigzag cap, bento N=N, section-repetition
   ban) once a skeleton is chosen; don't re-derive those here.

5. **Anti-slop mechanical flags** (lintable, check the rendered markup — sources:
   sailop ai-slop research, superdesign):

   | Slop signal | Mechanical flag | Antidote |
   |---|---|---|
   | Canonical section order | The 8-section skeleton above, used verbatim, in that order | Step 2 — deviate |
   | Uniform 3-col grid | Same grid-cols-3 (or equivalent) reused across ≥3 unrelated sections | Step 4 — asymmetric splits |
   | Uniform section padding | Identical `py-20`/`py-24` (or equivalent) on every section | Step 4 — vary per section |
   | Eyebrow over every H1 | See `layout-discipline.md` Eyebrow Restraint (max 1 per 3 sections) | Already governed there — don't restate |
   | Signature entrance motion | `opacity:0 + translateY(20px)` + `ease-in-out` scroll-reveal — found on ~83% of AI-generated pages | Vary offset/easing/stagger — `design-motion/references/entrance-patterns.md` |
   | Reflex palette+font+shape combo | Tailwind blue/indigo (hue 200–290°) + Inter + `rounded-2xl` used together as the default | Banned outright — pull real tokens from `design-system.md`/`sector-palettes.md`/`typography-pairs.md` |

6. **Select components against the brief, not by default.** Pull component patterns from
   `references/cards-guide.md`, `references/buttons-guide.md`,
   `references/component-composition-ref.md`, and 2-3 matching entries from
   `references/premium-patterns/PATTERNS.md` — each pattern's AI Generation Prompt is
   subordinated to the POV from `register/brand.md`, never dropped in unedited. No
   component earns a place because it's common; each maps to a real content need.

7. **Ship HTML/CSS directly** (default path, same method as Anthropic's `frontend-design`
   skill: commit to a point of view, verify with tools not vibes). Gemini Design MCP
   (`references/gemini/`), Magic (21st.dev), and shadcn MCP are optional fallback tools,
   never a requirement.

### Output Gate — Lookalike Test
Before calling this done: shrink the shipped page to a ~200px silhouette (blur or scale
down) and compare it against 5 competitor/sector silhouettes. Indistinguishable from the
set = structural slop — send it back to step 1 (macrostructure choice), not step 4
(cosmetic tweaks). This is a structure-level check; it runs after step 6, before handoff.

### Failure Handling
- Gemini Design MCP (if chosen) unavailable → fall back to direct generation, note it in
  the report.
- No usable inspiration source found after the browse budget in
  `references/design-inspiration.md` → proceed on macrostructure + register alone, flag
  the gap in the generate-move report; never block generation on inspiration browsing.
- Lookalike test fails twice on the same macrostructure choice → escalate to a different
  alternative in `macrostructure-bank.md`, don't re-attempt the same skeleton a 3rd time.

### Output
- HTML/CSS for the page/component, section order deviated from canonical, asymmetric
  grid(s), hero within the word/element caps, anti-slop table above checked, lookalike
  test passed.
- Ready for `design-motion`.

### Next → `design-motion`, then `design-review`.

### References
| File | Purpose |
|------|---------|
| `references/layout-discipline.md` | Hard numeric layout rules (hero, eyebrow, zigzag, bento, CTA, measure, focal-block) |
| `references/ui-visual-design.md` | 2026 visual design principles, hierarchy, trends |
| `references/cards-guide.md` | Card anatomy, layouts, content priority |
| `references/buttons-guide.md` | Button states, sizing, CTA discipline |
| `references/premium-patterns/PATTERNS.md` | 10 premium patterns with CSS specs + AI prompts, sector-mapped |
| `references/design-inspiration.md` | Browsing workflow — palette/typography/depth extraction only (see step 1) |
| `references/component-composition-ref.md` | Component composition rules |
| `references/grids-layout.md`, `forms-guide.md`, `icons-guide.md`, `photos-images.md` | Supporting component guides |
| `references/reference-index.md` | Full index of this skill's references and templates |
| `../design-method/references/register/brand.md` | POV lock, Body ≠ SaaS Furniture, Competitor Lift Test |
| `../design-method/references/macrostructure-bank.md` | Macrostructure alternatives (step 1) |

### Shared with design-webapp (load from there, don't duplicate)
| File | Purpose |
|------|---------|
| `../design-webapp/references/layouts/patterns/empty-state.md` | Empty-state pattern, if this page has a data surface |
| `../design-webapp/references/responsive-dashboard.md` | Only if a marketing page embeds an app-shell preview |
