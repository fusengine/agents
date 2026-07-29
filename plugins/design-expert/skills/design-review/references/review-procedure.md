---
name: review-procedure
description: "The final quality gate — deterministic checks (contrast, forbidden fonts, em-dash, hex/rgb) plus a bounded screenshot review (per-section, light+dark via colorScheme, max 2 fix cycles, then stop and report), including the mandatory in-loop challenger gate (item 9)."
when-to-use: "After design-motion (or directly after a mockup for iOS/Android) — the last step before reporting a design deliverable done. Referenced by the design-method moves critique.md and audit.md."
keywords: audit, review, contrast, screenshot, wcag, anti-slop, motion-verdict, challenger-gate, render-judgment-pass, lookalike-test, body-sequence, je-reproduis
priority: critical
related: anti-ai-slop-audit.md, audit-checklist.md, pre-flight-checklist.md, elicitation-visual.md, consistency-checks.md, ux-wcag.md, motion-verdict.md
---

# Design Review — Deterministic Checks + Bounded Visual Loop

## When
After `design-motion` (web/webapp) or directly after the mockup (`design-ios`/`design-android`).
The last step before reporting the deliverable done.

## Input
- Complete components/mockup with animations (if any) and interactive states.
- `design-system.md` as the audit baseline.
- The `Je reproduis` line — the three declared elements, verbatim in the format
  `design-web/SKILL.md` ("Declared Elements") writes it into the report and
  `design-system.md`: **two tagged `[corpus: {reference}/{tokens section}]`** (a measured
  procedure, the craft) and **one tagged `[sector: {url} — register]`** (a register signal;
  `[sector: none — register from brief]` is a valid value, an empty slot is not).
  Present/absent check in Part 2 item 4. **A missing, truncated or untagged line is a
  blocking Part 1 finding** — Part 2's binary verdict has no input without it, and reporting
  it as passed on an absent declaration is the failure this gate exists to stop.
- **The corpus pages opened**, from Gate 0 artefact 3 and the `2a pages OPENED` line of the
  `generate` report: at least two `{reference}-recode/index.html`, named. The
  `[corpus: …/{tokens section}]` tags above prove the corpus was *read*; they do not prove
  it was *seen*, and a deliverable sourced from markdown alone is the documented cause of a
  page that clears every mechanical check and reads dead
  (`design-web/references/refs-design/README.md` §*Look before you read*). Absent ⇒
  blocking Part 1 finding, same status as an absent `Je reproduis` line.
- **The on-screen inventory**, from Gate 0 artefact 4 / the `Step 4 bis` block of the
  `generate` report: what each section physically carries, and the screen-holding-floor
  verdict. Absent ⇒ blocking Part 1 finding whenever `VISUAL_DENSITY` ≤ 3 or
  `DESIGN_VARIANCE` ≥ 6; a reported finding otherwise.
- Any declared premium pattern(s) — same present/absent check. The signature element
  (`design-method` Step 2) instead gets **Signature Dominance** in Part 2.
- The plan's structural picks: the hero treatment from
  `design-method/references/macrostructure-bank.md` **and** the body sequence from
  `design-method/references/body-sequence-bank.md`. Both must be named; a plan naming
  neither feeds check 6 entry 15 and item 8b below. `brand` register — a `product`
  deliverable carries neither, and is scoped out of both accordingly.
- **The register itself** (`brand` / `product`, from `design-method` Gate 0). It is an
  input, not an inference made mid-review: checks 14, item 8's positive floors and item 8b
  all branch on it, and guessing it wrong either exempts a page that should be gated or
  fails one on a gate it cannot satisfy.

## Part 1 — Deterministic Checks (run first, mechanical, not vibes)

1. **Contrast** — recompute against `design-system`'s Mechanical Contrast Check
   (4.5:1 text / 3:1 UI) for every foreground/background pair, light AND dark.
2. **Forbidden fonts** — grep for `font-family`; flag any font on the canonical banned
   list (see `design-system` — canonical, not restated here).
3. **Color format — judges the produced code, never the source values.** Grep the shipped
   HTML/CSS for hex (`#fff`) / `rgb()` / `rgba()` / `hsl()`; every color **in the
   deliverable** must be `oklch()`. The corpus stores its measurements in whatever format
   its source shipped, and **not one reference is already in OKLCH** (`umbrel`
   `--surface-page: #000`, `fora` `rgba(0,0,0,.85)`, `supercommon` `rgb(24, 25, 28)`,
   `mainframe` `#ffffff14`) — those are inputs.
   **Convert the measured value to OKLCH and keep it**; never drop a corpus value because
   it arrived as hex or rgb, and never paste one through unconverted. A `[relevé]` comment
   citing the source value next to the converted token is expected, not a violation.
4. **Em-dash discipline** — grep for `—`; en-dashes (`–`) for numeric ranges are fine.
   Not a hard-fail on a single occurrence — flags when it reads as a repeated crutch/tic
   (2+ occurrences) across the artifact (shared gate with `ux-copy`).
5. **Token adherence** — if `design-system.md` exists, verify CSS custom properties match
   defined tokens; flag orphaned/undefined variables.
6. **Anti-AI-slop audit** — `anti-ai-slop-audit.md`: deterministic co-occurrence
   detectors for the 3 compound-signature clusters named in `design-method`
   (cream/serif/terracotta, near-black/acid, broadsheet), plus the structural grep
   blacklist (gradient hue, shadow alpha, corner-radius, macrostructure, eyebrow density,
   steps pattern, and **entry 15 — generic body sequence**: canonical section order verbatim
   AND one uniform vertical rhythm, a conjunction because the canon *treated* is legitimate;
   its fix is a different or treated body sequence, never a cosmetic pass). Clusters 4-5 (glassmorphism-everywhere, generic icon-bento) are caught
   indirectly by the corner-radius/macrostructure entries, not a dedicated co-occurrence
   detector. A cluster co-occurrence match is a FLAG-with-justification, not a BLOCK — a
   declared signature (`design-method` Step 2) overrides it.
7. **Mechanical pre-flight** — `pre-flight-checklist.md`: uppercase-tracking
   eyebrow count ≤ `ceil(sections/3)`, single theme lock, em-dash crutch check,
   motion-claimed-motion-shown, ≤ 1 marquee, hero ≤ 4 elements, cluster #1 co-occurrence.
   Any fail blocks the verdict, except the cluster #1 check (FLAG-with-justification, same
   override rule as above).
8. **WCAG beyond contrast** — `ux-wcag.md`: focus indicators present, touch
   targets ≥ 44×44px (web) / role-appropriate for mobile, keyboard navigation intact.
9. **Consistency** — `consistency-checks.md`: cross-component border-radius,
   shadow, spacing rhythm.
10. **Mobile nav functionality** — at the mobile breakpoint, the menu control must
    actually toggle (`aria-expanded` flips, or the panel becomes visible) when triggered.
    A burger icon wired to no handler is a blocking fail.
11. **Doc↔code animation diff** — grep every animation promised in `design-system.md`
    against the shipped CSS for a matching `@keyframes`/`transition` rule. A promise with
    no matching implementation is a blocking fail.
12. **Integrity** — no fabricated or unsourced numbers; no false urgency (a "live"
    badge, a counter, or an "X spots left" line implying real-time state over static
    data). Either is a blocking fail.
13. **No-JS baseline** — content stays visible with JS disabled (inspect with
    `scripting: none`, or the DOM stripped of `<script>`). A blank or broken page without
    JS is a blocking fail.
14. **Type-Scale, Body-Size, Measure & Focal-Block floors** — verify against `design-system/SKILL.md` (Type-Scale Floor, Body-Size Floor — both registers) and `design-web/references/layout-discipline.md` (Measure Floor — both registers; Focal-Block Floor — register-aware, rule 9: `brand` only, `product` exempt) — canonical there, not restated here.
15. **Dark-Elevation Direction** (deterministic, OKLCH `L`) — an `elevated`/`popular`/`featured` card must differ from its base sibling via a lighter `L` OR a border/accent, never identical; rule stated here, dark-surface `L`-scale mechanism at `design-system/references/edge-cases.md:31-42`.

Any Critical/Major finding from Part 1 gets fixed before Part 2 runs.

## Part 2 — Bounded Visual Review

**Read `fuse-ai-pilot:fuse-browser-usage` before the first `mcp__fuse-browser__*` call** —
capture rules, session handling, and where output files land. A review whose screenshots are
taken wrong reviews the wrong pixels.

1. **Serve** the output: `python3 -m http.server 8899`; if the port is busy, retry
   8900→ 8905 in order, then stop and report if all are unavailable.
2. **Screenshot per section** (header/main/footer, not one undifferentiated fullPage
   dump) AND one `fullPage: true` capture, in **both** light and dark via the
   `colorScheme` parameter of `browser_screenshot` — never a manual `.dark` class toggle.
3. **Cross-viewport**: one `browser_screenshot` call with `viewports: ["mobile", "tablet", "desktop"]`.
4. **Compare the declared elements** — the 3 elements of the `Je reproduis` line and any declared premium pattern(s): binary verdict per item, `[present]`/`[absent]`, no partial credit. Verdict each element against its own tag: a `[corpus: …]` element is `[present]` only if the *procedure* it names is visible in the render (not the reference's name in a comment), a `[sector: …]` element only if the register signal reads in the copy/vocabulary. The signature element instead gets **Signature Dominance** (mechanical focal weight — largest focal element by area OR contrast; brand register only) per `design-method/SKILL.md` Step 2 — canonical there, not restated here.
5. **Localized critique only** — findings must name the exact section/element and the
   exact issue ("the card padding in the pricing grid is 12px, tokens call for 24px"),
   never a general "improve the style" note.
6. **Motion verdict** (if any animation/transition/hover/gesture exists) — run
   `motion-verdict.md`: Before/After/Why table, tiered impact, explicit
   Block/Approve decision. Use `design-motion/references/animation-glossary.md` for
   shared vocabulary — don't redefine terms here.
7. **Named eLicit technique(s)** — cite at least **two** techniques from `elicitation-visual.md` (Squint/Subtraction/Competitor Line-up/5-Second/Persona) against the captured screenshots; real independence comes from the challenger gate (item 9 below), not from stacking lenses solo.
8. **Fix gaps** — apply fixes for Block verdicts or absent elements. The loop exits PASS only once the register-applicable positive floors (Type-Scale/Measure — both registers; Focal-Block/Signature Dominance — `brand` only, `product` exempt per check 14) are **met**, not merely "0 flags". **Maximum 2 fix cycles** — issues (or an unmet floor) remaining after cycle 2 STOP the loop and get reported, not chased further. A plateau (cycle 2 repeats cycle 1's finding) also stops immediately, even at cycle 1 of 2.
8a. **Render Judgment Pass (mandatory, look-then-judge — before the challenger gate)** —
   open the actual screenshot files captured in steps 2/3 and look at them; a verdict
   formed from what was planned, from `design-system.md`, or from the code is not a
   verdict — only the pixels in the image count. This pass is complementary to the
   challenger gate below, not a substitute for it (this agent judges its own render
   first; the challenger judges blind, fresh-context, second).
   - Judge what is **not binary** and Part 1 cannot catch: whitespace rhythm and
     regularity between blocks, optical alignment (not just grid alignment), relative
     visual weight between neighboring elements, density, where a line of text breaks,
     spacing consistency from one section to the next.
   - Use the named techniques from `elicitation-visual.md` (Squint / Subtraction /
     Competitor / 5-Second / Persona) to force the look — don't invent new lenses.
   - **Name at least one defect per pass.** A pass that finds nothing did not look —
     this is a rule, not a suggestion: zero findings is not an allowed outcome for this
     item.
   - Fix, recapture, and repeat — this pass does not close on the first screenshot; it
     re-runs after every fix cycle in item 8, up to the same 2-cycle cap.
8b. **Lookalike Test — structural gate, register-scoped: `brand` only, `product` exempt.**
   Runs after 8a, before the challenger gate. Same scoping form as check 14 and item 8's
   positive floors — resolve the register BEFORE running anything: it comes from the brief
   (`design-method` Gate 0), or failing that from which skill produced the deliverable
   (`design-web` → `brand`, `design-webapp` → `product`; for `design-ios`/`design-android`,
   from the brief — a marketing/store screen is `brand`, an in-app screen is `product`).

   **Register `product` — exempt, and not a waiver to be argued.** An app screen is
   *supposed* to share a silhouette with other app screens: a settings page reading as a
   settings page is correct, and Jakob's Law makes silhouette novelty a cost, not a win.
   Declared in `design-webapp/SKILL.md` ("Output Gate — the Lookalike Test does not apply
   here") — canonical there, not re-argued here. **Substitute gate, run in this slot and
   reported in it**: the **Domain-Specificity Floor**
   (`design-method/references/register/product.md` §2) — for every data-bearing surface
   (KPI panel, table, empty state, settings group, nav), would its copy, icons and grouping
   look native if dropped unedited into an unrelated product in the same category? If yes,
   it is furniture, not product design. Record
   `[n/a — product register; Domain-Specificity Floor run instead: {verdict}]`. Never fail a
   `product` deliverable on a `brand` gate it has no means to satisfy, and never record this
   item as "passed" when it did not apply — that is a validation reported but not executed
   (Failure Handling).

   **Register `brand` — mandatory, and this item is the pipeline's only executant.**
   `design-web`'s Output Gate *declares* the test; nothing else runs it. Its definition is
   canonical in `design-web/references/design-inspiration.md` ("Lookalike Test — canonical
   definition") — silhouette method and comparison set live there and are not restated,
   renumbered or re-parameterised here. Read it there, run it against the captures from
   steps 2/3.
   - **Verdict**: binary, `[distinguishable]` / `[indistinguishable]`, recorded in the Output
     next to the hero treatment and the body sequence. "Roughly different" is not a verdict.
   - **On `[indistinguishable]` the fail is structural.** Go back to the **body sequence**
     pick (`design-method/references/body-sequence-bank.md`); go back to the hero treatment
     (`macrostructure-bank.md`) only if a sequence change alone cannot move the silhouette —
     a new first screen over the same body does not address the failure mode
     (`design-method/references/register/brand.md`, preamble: "The proven failure mode is not
     the hero … The failure mode is the **body**"). **Never a cosmetic
     adjustment** — padding, radius, accent hue, font swap. A re-run after a cosmetic-only
     change is not a re-run: report it as not re-run, not as a pass.
   - **Not item 7's Competitor Line-up.** That lens is a subjective read on full-detail
     screenshots and produces a finding; this is the silhouette test and produces a verdict.
     Citing the lens does not satisfy this item, and clearing this item does not excuse the
     lens.
   - **No comparison set available** — run it against the corpus references the plan names
     (`design-web/references/refs-design/`); if the plan names none and no sector site was
     found, record `[not run — no comparison set]` and escalate to the owner. Never a silent
     pass, and never a template-platform silhouette as a substitute (banned in
     `design-inspiration.md`).
   - Counts inside the same 2-cycle cap as item 8. Still `[indistinguishable]` at the cap →
     report it as a P1 finding naming every sequence already tried; do not chase it further.
9. **Challenger gate (mandatory, in-loop — not a trailing consultation)** — before any "done" claim, the design-expert invokes `fuse-ai-pilot:challenger` (it holds the `Task` tool) to judge blind (PNG + brief, named elicitation lenses, fresh-context — never this procedure's own reasoning). A Block must be resolved or owner-accepted before "done" (consultative, not a veto — CLAUDE.md Rule 5). **Fallback**: only if `Task`/`Agent` is unavailable (agent at max nesting depth 5) → report "not judged"/escalate to owner, never a silent "done".

## Failure Handling
- All server ports 8899-8905 busy → stop, report the deliverable unreviewed, and say so
  explicitly — never report a validation that wasn't executed.
- Screenshot tool fails → retry once; on a second failure, stop and report the gap rather
  than declaring the visual review passed.

## Output
- Deterministic check results (Part 1), all Critical/Major resolved.
- Light/dark + 3-viewport screenshots (Part 2).
- Binary verdict per declared element/pattern, each cited with its `[corpus: …]`/`[sector: …]` tag; **Signature Dominance** verdict for the signature element.
- **Lookalike Test verdict** (`brand`) — `[distinguishable]`/`[indistinguishable]`, with the body sequence and hero treatment named; on a fail, which sequence was swapped in. On `product`, the same slot carries `[n/a — product register; Domain-Specificity Floor run instead: {verdict}]` — the slot is never left empty and never marked passed by default.
- Motion Block/Approve verdict if applicable.
- Challenger verdict: resolved/owner-accepted, or **"not judged"** on tool-unavailable fallback.
- Any remaining Minor issues after the 2-cycle cap, reported, not hidden.

## References
| File | Purpose |
|------|---------|
| `audit-checklist.md` | Full deterministic audit procedure |
| `pre-flight-checklist.md` | **Mechanical grep/count checks — the last filter** |
| `anti-ai-slop-audit.md` | Generic AI design detection, with few-shot examples |
| `elicitation-visual.md` | Named visual techniques (Squint/Subtraction/Competitor/5-Second/Persona) for the eLicit phase |
| `consistency-checks.md` | Cross-component visual coherence |
| `ux-wcag.md` | WCAG accessibility standards beyond contrast |
| `ux-nielsen.md` | Nielsen usability heuristics |
| `ux-laws.md` | UX laws (Fitts, Hick, Miller) |
| `ux-patterns.md` | Common UX patterns |
| `motion-audit.md` | 10 motion standards + remediation hierarchy |
| `motion-verdict.md` | Block/Approve verdict format |

## Anti-AI-slop few-shot examples
**REJECT** — a generic purple-to-blue gradient hero in a forbidden font with emoji
bullets; identical border-radius/shadow on every card with no hierarchy.
**ACCEPT** — a sector-derived OKLCH palette that's color-committed (chromatic, chroma ≥
0.05, or an intentional near-mono base with one sharp accent — not a timid, uncommitted
gray), an approved typography pair, one deliberate accent used sparingly; an asymmetric
grid with intentional whitespace.
