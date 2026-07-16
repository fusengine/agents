---
name: design-review
description: "The final quality gate — deterministic checks (contrast, forbidden fonts, em-dash, hex/rgb) plus a bounded screenshot review (per-section, light+dark via colorScheme, max 2 fix cycles, then stop and report). This procedure is defined here only; the agent and commands reference it."
when-to-use: "After design-motion (or directly after a mockup for iOS/Android) — the last step before reporting a design deliverable done."
keywords: audit, review, contrast, screenshot, wcag, anti-slop, motion-verdict
priority: critical
related: design-system, design-motion, design-web, design-webapp
---

## Design Review — Deterministic Checks + Bounded Visual Loop

### When
After `design-motion` (web/webapp) or directly after the mockup (`design-ios`/`design-android`).
The last step before reporting the deliverable done.

### Input
- Complete components/mockup with animations (if any) and interactive states.
- `design-system.md` as the audit baseline.
- The 3 elements declared in `design-web`/`design-webapp` ("Je reproduis: {el1}, {el2}, {el3}") and any declared premium pattern(s) — present/absent check in Part 2; the signature element (`design-method` Step 2) instead gets **Signature Dominance** in Part 2.

### Part 1 — Deterministic Checks (run first, mechanical, not vibes)

1. **Contrast** — recompute against `design-system`'s Mechanical Contrast Check
   (4.5:1 text / 3:1 UI) for every foreground/background pair, light AND dark.
2. **Forbidden fonts** — grep for `font-family`; flag any font on the canonical banned
   list (see `design-system` — canonical, not restated here).
3. **Color format** — grep for hex (`#fff`) / `rgb()` / `hsl()`; all colors must be `oklch()`.
4. **Em-dash discipline** — grep for `—`; en-dashes (`–`) for numeric ranges are fine.
   Not a hard-fail on a single occurrence — flags when it reads as a repeated crutch/tic
   (2+ occurrences) across the artifact (shared gate with `ux-copy`).
5. **Token adherence** — if `design-system.md` exists, verify CSS custom properties match
   defined tokens; flag orphaned/undefined variables.
6. **Anti-AI-slop audit** — `references/anti-ai-slop-audit.md`: deterministic co-occurrence
   detectors for the 3 compound-signature clusters named in `design-method`
   (cream/serif/terracotta, near-black/acid, broadsheet), plus the structural grep
   blacklist (gradient hue, shadow alpha, corner-radius, macrostructure, eyebrow density,
   steps pattern). Clusters 4-5 (glassmorphism-everywhere, generic icon-bento) are caught
   indirectly by the corner-radius/macrostructure entries, not a dedicated co-occurrence
   detector. A cluster co-occurrence match is a FLAG-with-justification, not a BLOCK — a
   declared signature (`design-method` Step 2) overrides it.
7. **Mechanical pre-flight** — `references/pre-flight-checklist.md`: uppercase-tracking
   eyebrow count ≤ `ceil(sections/3)`, single theme lock, em-dash crutch check,
   motion-claimed-motion-shown, ≤ 1 marquee, hero ≤ 4 elements, cluster #1 co-occurrence.
   Any fail blocks the verdict, except the cluster #1 check (FLAG-with-justification, same
   override rule as above).
8. **WCAG beyond contrast** — `references/ux-wcag.md`: focus indicators present, touch
   targets ≥ 44×44px (web) / role-appropriate for mobile, keyboard navigation intact.
9. **Consistency** — `references/consistency-checks.md`: cross-component border-radius,
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

### Part 2 — Bounded Visual Review

1. **Serve** the output: `python3 -m http.server 8899`; if the port is busy, retry
   8900→ 8905 in order, then stop and report if all are unavailable.
2. **Screenshot per section** (header/main/footer, not one undifferentiated fullPage
   dump) AND one `fullPage: true` capture, in **both** light and dark via the
   `colorScheme` parameter of `browser_screenshot` — never a manual `.dark` class toggle.
3. **Cross-viewport**: one `browser_screenshot` call with `viewports: ["mobile", "tablet", "desktop"]`.
4. **Compare the declared elements** — the 3 declared elements and any declared premium pattern(s): binary verdict per item, `[present]`/`[absent]`, no partial credit. The signature element instead gets **Signature Dominance** (mechanical focal weight — largest focal element by area OR contrast; brand register only) per `design-method/SKILL.md` Step 2 — canonical there, not restated here.
5. **Localized critique only** — findings must name the exact section/element and the
   exact issue ("the card padding in the pricing grid is 12px, tokens call for 24px"),
   never a general "improve the style" note.
6. **Motion verdict** (if any animation/transition/hover/gesture exists) — run
   `references/motion-verdict.md`: Before/After/Why table, tiered impact, explicit
   Block/Approve decision. Use `design-motion/references/animation-glossary.md` for
   shared vocabulary — don't redefine terms here.
7. **Named eLicit technique(s)** — cite at least **two** techniques from `references/elicitation-visual.md` (Squint/Subtraction/Competitor Line-up/5-Second/Persona) against the captured screenshots; real independence comes from the challenger gate (item 9 below), not from stacking lenses solo.
8. **Fix gaps** — apply fixes for Block verdicts or absent elements. The loop exits PASS only once the register-applicable positive floors (Type-Scale/Measure — both registers; Focal-Block/Signature Dominance — `brand` only, `product` exempt per check 14) are **met**, not merely "0 flags". **Maximum 2 fix cycles** — issues (or an unmet floor) remaining after cycle 2 STOP the loop and get reported, not chased further. A plateau (cycle 2 repeats cycle 1's finding) also stops immediately, even at cycle 1 of 2.
9. **Challenger gate (mandatory, in-loop — not a trailing consultation)** — before any "done" claim, the design-expert invokes `fuse-ai-pilot:challenger` (it holds the `Task` tool) to judge blind (PNG + brief, named elicitation lenses, fresh-context — never this procedure's own reasoning). A Block must be resolved or owner-accepted before "done" (consultative, not a veto — CLAUDE.md Rule 5). **Fallback**: only if `Task`/`Agent` is unavailable (agent at max nesting depth 5) → report "not judged"/escalate to owner, never a silent "done".

### Failure Handling
- All server ports 8899-8905 busy → stop, report the deliverable unreviewed, and say so
  explicitly — never report a validation that wasn't executed.
- Screenshot tool fails → retry once; on a second failure, stop and report the gap rather
  than declaring the visual review passed.

### Output
- Deterministic check results (Part 1), all Critical/Major resolved.
- Light/dark + 3-viewport screenshots (Part 2).
- Binary verdict per declared element/pattern; **Signature Dominance** verdict for the signature element.
- Motion Block/Approve verdict if applicable.
- Challenger verdict: resolved/owner-accepted, or **"not judged"** on tool-unavailable fallback.
- Any remaining Minor issues after the 2-cycle cap, reported, not hidden.

### References
| File | Purpose |
|------|---------|
| `references/audit-checklist.md` | Full deterministic audit procedure |
| `references/pre-flight-checklist.md` | **Mechanical grep/count checks — the last filter** |
| `references/anti-ai-slop-audit.md` | Generic AI design detection, with few-shot examples |
| `references/elicitation-visual.md` | Named visual techniques (Squint/Subtraction/Competitor/5-Second/Persona) for the eLicit phase |
| `references/consistency-checks.md` | Cross-component visual coherence |
| `references/ux-wcag.md` | WCAG accessibility standards beyond contrast |
| `references/ux-nielsen.md` | Nielsen usability heuristics |
| `references/ux-laws.md` | UX laws (Fitts, Hick, Miller) |
| `references/ux-patterns.md` | Common UX patterns |
| `references/motion-audit.md` | 10 motion standards + remediation hierarchy |
| `references/motion-verdict.md` | Block/Approve verdict format |

### Anti-AI-slop few-shot examples
**REJECT** — a generic purple-to-blue gradient hero in a forbidden font with emoji
bullets; identical border-radius/shadow on every card with no hierarchy.
**ACCEPT** — a sector-derived OKLCH palette that's color-committed (chromatic, chroma ≥
0.05, or an intentional near-mono base with one sharp accent — not a timid, uncommitted
gray), an approved typography pair, one deliberate accent used sparingly; an asymmetric
grid with intentional whitespace.
