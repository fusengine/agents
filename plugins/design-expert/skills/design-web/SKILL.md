---
name: design-web
description: "Use when building or revising a marketing/landing/campaign page, register `brand` locked at Gate 0 — use design-webapp for app screens instead."
when-to-use: "Building or revising a marketing/landing/campaign page after design-method's Gate 0 has locked register `brand`. If the surface is a logged-in dashboard/app screen, use design-webapp instead — design-method's routing table decides which."
keywords: web, marketing, landing, hero, macrostructure, body-sequence, anti-slop, lookalike-test, asymmetric
priority: critical
related: design-method, design-system, design-webapp, design-motion, design-review, ux-copy
---

<objective>
Builds marketing sites, landing pages, and campaign pages under register `brand` (design IS the product). Structure comes from the register's point of view plus two named picks — a hero treatment for the first screen and a body sequence for everything after it — never from copying an inspiration site's section flow.

Covers hero discipline (headline/subhead word caps, single primary CTA), body-sequence selection against the canonical-order default, asymmetric grids instead of a uniform 3-column layout, and a set of mechanical anti-slop flags (uniform grids, uniform padding, the AI-signature entrance motion, the reflex blue/Inter/rounded-2xl combo).

Declares the three reproduced elements (`Je reproduis`, corpus procedures vs sector register) that `design-review` verdicts, and runs the silhouette Lookalike Test before the page can be called done: a fail is structural and goes back to the hero/body picks, not to a cosmetic tweak.
</objective>

## Design Web — Marketing & Landing, Register Brand

### When
After `design-system` tokens exist and `design-method`'s Gate 0 has locked register
`brand` (one dominant, expressive message). Read `design-method`'s routing table first —
a dashboard/app/utility surface routes to `design-webapp` instead. Exception: a
marketing-adjacent surface living inside an app shell (e.g. an in-app pricing page) still
routes here for that one page (see `design-webapp`'s reciprocal note).

### Input
- `design-system.md` — OKLCH palette, type pair, spacing density, the 3 dials.
- `../design-method/references/register/brand.md` — the page's POV sentence and the
  per-section Competitor Lift Test (loaded once per task, not re-read per step).
- The `generate` move report (`../design-method/references/moves/generate.md`) if this task
  started from Gate 0 — steps 1-4 of that report (register, inspiration, tokens, and step
  4's two picks: hero treatment + body sequence) are inputs here, not repeated.

### Steps

1. **Structure comes from register + two structural picks, never from template
   reproduction.** `references/design-inspiration.md` sources taste in a fixed order: the
   local corpus (`references/refs-design/`, fifteen rebuilt pages whose `tokens-*.md` carry
   measured procedures) supplies palette, typography, depth and craft; 1-2 real production
   sites in the client's own sector supply **register only** — vocabulary, codes, level of
   formality. Section flow, spacing rhythm and layout are never copied from either. The
   actual skeleton is the pair named in `design-method`'s `generate` move: a **hero
   treatment** from `../design-method/references/macrostructure-bank.md` (first screen
   only — it decides nothing past the fold) plus a **body sequence** from
   `../design-method/references/body-sequence-bank.md`, both filtered through the POV in
   `register/brand.md`. Naming one without the other is an incomplete plan. Reproducing an
   inspiration site's structure verbatim is the single biggest source of templated output —
   treat it as a hard boundary, not a style preference.

2. **Pick a body sequence, and state what its principle becomes for this subject.** The
   body, not the hero, is the proven failure mode (`register/brand.md`). Choose one of the
   fifteen sequences read off shipped code in
   `../design-method/references/body-sequence-bank.md` and name it in the plan in that
   file's own format: **"Body sequence: {name} — principle applied here: {one line}."**
   State the principle in the brief's own terms; a plan naming the sequence but not what
   its principle becomes here has copied a composition. Deviating from the chosen sequence
   is expected, not forbidden — report which section moved and why in the generate-move
   report's macrostructure line. The canonical skeleton
   (nav → hero → features → testimonials → pricing → faq → cta → footer) is the detectable
   default **when it is reached by omission**; it is also entry 5 of the bank ("Bookended
   Canon"), legitimately choosable when it is actually *treated* — `fora` follows it almost
   to the letter without reading generic, for the measured reasons in its sheet (bank rule
   2). Sections kept from the canon stay governed by `register/brand.md` §2
   (Body ≠ SaaS Furniture) and its per-section Competitor Lift Test.

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

5. **Anti-slop mechanical flags** — lintable, check the rendered markup. Each row's
   grounding lives where that rule is canonical (`references/design-inspiration.md` for
   the reflex combo, `references/layout-discipline.md` for the eyebrow cap); this table
   sources nothing on its own.

   | Slop signal | Mechanical flag | Antidote |
   |---|---|---|
   | Canonical section order by default | The 8-section skeleton above, used verbatim, with no body sequence named in the plan | Step 2 — name a sequence and its principle |
   | Uniform 3-col grid | Same grid-cols-3 (or equivalent) reused across ≥3 unrelated sections | Step 4 — asymmetric splits |
   | Uniform section padding | Identical `py-20`/`py-24` (or equivalent) on every section | Step 4 — vary per section |
   | Eyebrow over every H1 | See `layout-discipline.md` Eyebrow Restraint (max 1 per 3 sections) | Already governed there — don't restate |
   | Signature entrance motion | `opacity:0 + translateY(20px)` + `ease-in-out` scroll-reveal — the most widespread AI-generated entrance signature | Vary offset/easing/stagger — `../design-motion/references/entrance-patterns.md` |
   | Reflex palette+font+shape combo | Tailwind blue/indigo (hue 200–290°) + Inter + `rounded-2xl` used together as the default | Banned outright — pull real tokens from `design-system.md`/`../design-system/references/sector-palettes.md`/`typography-pairs.md` |

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

### Declared Elements — the `Je reproduis` line
Before handoff, write this line into the deliverable's report and into `design-system.md`,
verbatim in this format. `design-review` reads it as the input to its binary
present/absent verdict (`../design-review/SKILL.md` Input,
`../design-review/references/review-procedure.md` Input + Part 2 item 4):

```
Je reproduis: {el1} [corpus: {reference}/{tokens section}], {el2} [corpus: {reference}/{tokens section}], {el3} [sector: {url} — register]
```

Exactly three elements, each nameable in the rendered page — the verdict is binary, so
"a refined atmosphere" is not an element while "the two vertical rules crossing every
section boundary" is. **Two come from the corpus**: a measured procedure, cited with the
`tokens-*.md` section it was read from — **and taken from a page you opened and scrolled**,
not from a section index. The rendered pages come first, the markdown second
(`references/refs-design/README.md` §*Look before you read*); a procedure cited from a file
whose page was never rendered is a value with no referent, and `design-review` now asks for
the list of pages opened alongside this line. **One comes from the sector**: a register signal
(vocabulary, formality, what this vertical shows), never a craft borrowing — craft is the
corpus's job. If the sector step produced nothing usable, write
`[sector: none — register from brief]` and still declare three elements.

### Output Gate — Lookalike Test
Runs after step 7, before handoff. Its definition is canonical in
`references/design-inspiration.md` (silhouette method and comparison set live there — not
restated or renumbered here). A fail is structural, never cosmetic: send it back to steps
1-2 (hero treatment + body sequence), not to step 4.

### Failure Handling
- Gemini Design MCP (if chosen) unavailable → fall back to direct generation, note it in
  the report.
- No usable sector site found for register → proceed on the corpus + the two structural
  picks + the brief's own register, and flag the missing sector signal in the
  generate-move report and in the `Je reproduis` line. Never block generation on
  inspiration sourcing, and never substitute a template platform (banned in
  `references/design-inspiration.md`).
- Lookalike test fails twice on the same pair of picks → change the **body sequence** in
  `../design-method/references/body-sequence-bank.md` (a different hero treatment alone
  does not address the failure mode), don't re-attempt the same skeleton a 3rd time.

### Output
- HTML/CSS for the page/component, hero treatment + body sequence named with the
  sequence's principle restated for this subject, asymmetric grid(s), hero within the
  word/element caps, anti-slop table above checked, the `Je reproduis` line written,
  lookalike test passed.
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
| `references/design-inspiration.md` | Taste sourcing order (corpus first, then sector for register) + canonical Lookalike Test |
| `references/refs-design/README.md` | The local corpus — fifteen rebuilt pages, procedure index (technique → reference → section), preceded by the verb-first selection rule |
| `references/component-composition-ref.md` | Component composition rules |
| `references/grids-layout.md`, `forms-guide.md`, `icons-guide.md`, `photos-images.md` | Supporting component guides |
| `references/reference-index.md` | Full index of this skill's references and templates |
| `../design-method/references/register/brand.md` | POV lock, Body ≠ SaaS Furniture, Competitor Lift Test |
| `../design-method/references/macrostructure-bank.md` | Eight hero treatments — first screen only (step 1) |
| `../design-method/references/body-sequence-bank.md` | Fifteen body sequences — the order of everything after the first screen (step 2) |

### Shared with design-webapp (load from there, don't duplicate)
| File | Purpose |
|------|---------|
| `../design-webapp/references/layouts/patterns/empty-state.md` | Empty-state pattern, if this page has a data surface |
| `../design-webapp/references/responsive-dashboard.md` | Only if a marketing page embeds an app-shell preview |
