---
name: generate
description: "Full production pipeline for a page/screen — orders and FORCES consultation of the frozen taste-reference system (register, inspiration, tokens, macrostructure, components, layout-discipline, body, motion) instead of improvising."
when-to-use: "FULL scope (new project, no design-system.md yet) or PAGE scope (design-system.md exists) — see design-method/SKILL.md routing table. Not for COMPONENT or MOBILE scope."
keywords: generate, move, pipeline, register, tokens, macrostructure, layout-discipline, body, motion
priority: critical
related: ../../SKILL.md, ../macrostructure-bank.md, ../register/brand.md, ../register/product.md, ../copy.md, ../../../design-web/references/design-inspiration.md, ../../../design-web/references/layout-discipline.md
---

# Generate — Full/Page Production Move

The generation move turns a locked brief (design-method/SKILL.md Gate 0) into markup. It is
a fixed 8-step order, not a menu: every step names the exact frozen reference file it
pulls from, and skipping a step or substituting "what feels right" for the file is the
defect this move exists to prevent. Nothing here re-derives taste data (palettes, type
pairs, spacing, pattern CSS) — it only sequences which frozen file governs which decision,
and forces the consultation to actually happen (read, not recalled from memory).

### When to use

- **FULL** — new project, no `design-system.md` yet. Step 2 (browse) uses **4 sites**.
- **PAGE** — `design-system.md` already exists. Step 2 (browse) uses **2 sites**; step 3
  (tokens) reads the existing `design-system.md` first and only falls back to
  `sector-palettes.md`/`typography-pairs.md` for gaps.
- **Prerequisite, not re-run here:** Gate 0 in `design-method/SKILL.md` — register, tone,
  signature element, and at least one concrete reference must already be locked **in
  writing**. This move consumes that lock; if it doesn't exist, stop and go run Gate 0
  first, don't improvise a register on the fly.
- **Not for:** COMPONENT scope (single element — skip step 2 browsing, reuse existing
  tokens) or MOBILE scope (iOS/Android — platform HIG/Material references, no web
  browsing). Those are other moves.

### Exploration Gate — FULL scope + brand register only

Runs **before Step 1**, and only when scope is **FULL** and register is **brand**. It is
how the Gate 0 Tone artefact (`design-method/SKILL.md` Gate 0, item 1) gets produced in
that combination — comparative selection instead of a single fiat pick. For every other
scope/register combination (product, or FULL/PAGE/COMPONENT/MOBILE outside brand), skip
this gate entirely and let Gate 0's Tone stay a direct single-fiat pick — go straight to
Step 1.

1. **Fan out 3 divergent sketches.** Via `Task`, spawn 3 parallel sub-agents, each producing
   exactly one lightweight direction sketch — **text-only**: no HTML/CSS, no screenshots, no
   further sub-spawn (a nested sub-spawn here risks exceeding the depth-5 nesting ceiling).
   Each sketch states four things, in prose, and nothing else:
   - a distinct tone/POV (not the same adjective reworded three ways)
   - a palette family direction, not final hex values (e.g. "muted terracotta/ink" vs
     "near-black/acid-lime" vs "warm paper/deep forest")
   - one macrostructure pick from `../macrostructure-bank.md`, distinct across the 3
   - one signature-element idea (per `../register/brand.md` Signature Dominance)
2. **Judge comparatively.** Invoke `fuse-ai-pilot:challenger`, fresh-context and blind (fed
   only the 3 sketches — never which one you'd pick, or why), to select the strongest:
   "which direction is most distinctive/premium for this brief" — a comparative pick across
   3 candidates, not a pass/fail gate on a single one.
3. **Lock the winner.** The winning sketch's tone/POV becomes the Gate 0 Tone artefact; its
   palette family seeds Step 3 (tokens), its macrostructure pick satisfies Step 4, its
   signature-element idea seeds Step 7 and the register's Signature Dominance floor. State
   in the report which of the 3 won and the challenger's stated reason.

**Fallback — `Task`/`Agent` unavailable (already at nesting depth 5):** skip the fan-out,
fall back to the direct single-fiat Tone pick Gate 0 already requires, and mark the report
"direction not explored / single-fiat — Task unavailable at depth 5." Never report a "done"
that implies exploration ran when it didn't.

### Steps

1. **Load the register.** Read `../register/brand.md` or `../register/product.md`
   (whichever Gate 0 picked) in full before any other step. This is the register that
   arbitrates Signature Dominance and the Focal-Block Floor later in step 6 — load it
   first so every downstream choice is already filtered through it, not bolted on after.

2. **Browse fresh inspiration.** Follow `../../../design-web/references/design-inspiration.md`
   (sector table + fuse-browser workflow) — **4 sites for FULL, 2 for PAGE**, from at
   least 2 platforms, and **extract** palette / typography / depth / craft-level across them
   — **reproduce NO single site's structure, spacing rhythm, or section flow** (structure
   comes from the register + `../macrostructure-bank.md`, never a browsed template). **Vary every time**:
   check the last session's sites in `../../../design-web/references/design-inspiration-urls.md`
   usage history if available and do not reuse the same slugs. This step is mandatory
   evidence, not a planning note — it must actually run (screenshots taken), never be
   marked done because it was "considered."

3. **Source tokens.** Pull palette from `sector-palettes.md` or `oklch-system.md`
   (`design-system/references/`) per the register's sector/personality, type pair from
   `typography-pairs.md`, and spacing/density profile from `spacing-density.md`. For PAGE
   scope, `design-system.md` tokens win over these where both exist; these files fill only
   what's missing. Every token in the output must be traceable to one of these files — no
   ad hoc hex/rem value.

4. **Pick a macrostructure.** Read `../macrostructure-bank.md` and name one alternative
   explicitly in the plan (**"Macrostructure: {alternative name}"**). The centered-hero +
   3-column icon-card grid default is **forbidden** unless the brief/sector genuinely
   requires it, and if so that must be stated as a deliberate exception, never reached by
   omission or silence.

5. **Select components.** For each section, pull the component pattern from
   `../../../design-web/references/cards-guide.md`, `buttons-guide.md`,
   `component-composition-ref.md`, and 2-3 matching entries from
   `../../../design-web/references/premium-patterns/PATTERNS.md` (sector table → read the
   2-3 `description.md` files → combine their AI Generation Prompts). No component is
   "furniture" placed because it's common — each one must map to a section's actual
   content need from the brief.

6. **Verify numeric constraints.** Check the output against every rule in
   `../../../design-web/references/layout-discipline.md` (hero hard numbers, eyebrow cap,
   zigzag cap, bento N=N, section-repetition ban, CTA discipline, measure floor,
   focal-block floor register-conditional) — mechanically, against the actual rendered
   markup, not a mental estimate. Log pass/fail per rule in the report (step below).

7. **Write the body.** Every section's copy must conform to `../register/brand.md` or
   `../register/product.md` (whichever was loaded in step 1) and to `../copy.md`. Each
   section needs a one-line justification tying it back to the brief/signature element —
   "why does this section exist" — not generic filler copy dropped into a chosen
   component shell.

8. **Apply motion.** Transitions use `transform`/`opacity` only (never layout-triggering
   properties), with an exponential easing curve (`cubic-bezier` exp-out family, not
   linear/ease default), and respect `prefers-reduced-motion` per the Non-Negotiable Floor
   in `design-method/SKILL.md`. Motion intensity follows the register loaded in step 1
   (`brand` can be expressive, `product` stays discreet).

#### Report template

```markdown
## Generate move — report

**Scope:** FULL | PAGE
**Register loaded:** register/brand.md | register/product.md

### Exploration Gate (FULL scope + brand register only — omit this section for any other scope/register)
- Ran: yes/no (no → fallback used; state why: not FULL+brand | Task/Agent unavailable at depth 5)
- Sketch 1: {tone/POV} / {palette family} / {macrostructure} / {signature idea}
- Sketch 2: {tone/POV} / {palette family} / {macrostructure} / {signature idea}
- Sketch 3: {tone/POV} / {palette family} / {macrostructure} / {signature idea}
- Challenger pick: sketch {N} — reason: {challenger's stated comparative reason}
- Gate 0 Tone locked from: exploration winner | direct single-fiat (fallback)

### Step 2 — Inspiration browsed
- Site 1: {URL} ({platform}) — screenshot: yes/no
- Site 2: {URL} ({platform}) — screenshot: yes/no
- [Site 3/4 if FULL]
- Extracted (palette / typography / depth ONLY — never structure, spacing, or section flow): {traits} from {sites}

### Step 3 — Tokens sourced
- Palette: {values} ← sector-palettes.md #{sector} | design-system.md (PAGE)
- Type pair: {display}/{body} ← typography-pairs.md #{pair}
- Spacing/density: {profile} ← spacing-density.md #{profile}

### Step 4 — Macrostructure
- Chosen: {alternative name} ← macrostructure-bank.md
- Deliberate exception to centered-hero default? yes/no + reason

### Step 5 — Components
- Section {name}: {component pattern} ← cards-guide.md/buttons-guide.md/
  component-composition-ref.md/premium-patterns/{folder}/description.md

### Step 6 — Layout-discipline check (mechanical, per rule)
| Rule | Pass/Fail | Note |
|------|-----------|------|
| Hero hard numbers | | |
| Eyebrow restraint | | |
| Zigzag cap | | |
| Bento N=N | | |
| Section-repetition ban | | |
| CTA discipline | | |
| Measure floor | | |
| Focal-block floor (brand only) | | |

### Step 7 — Body conformance
- Section {name}: justification (brief/signature tie-in) — copy source: copy.md #{ref}

### Step 8 — Motion
- Properties: transform/opacity only? yes/no
- Easing: {cubic-bezier} — exp-out family? yes/no
- prefers-reduced-motion respected: yes/no

### Deviations / gaps
- {anything skipped, exempted, or not yet resolved, with the reason}
```
