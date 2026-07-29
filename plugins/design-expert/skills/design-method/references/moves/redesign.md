---
name: redesign
description: "Total redesign of an EXISTING surface — replays generate's production pipeline to rethink structure/layout/typography/composition from scratch, while locking the existing color palette as a fixed anchor and forbidding any copy-paste of the old design."
when-to-use: "Owner asks to redesign / refonte / rebuild / rework an existing page, screen, or app — a surface already exists and must be reconceived, not incrementally refined (that is critique/polish) and not built from nothing (that is generate FULL)."
keywords: redesign, refonte, rebuild, rework, move, existing-surface, palette-lock, anti-copy, body-sequence, exploration
priority: critical
related: ./generate.md, ../../SKILL.md, ../macrostructure-bank.md, ../body-sequence-bank.md, ../../../design-web/references/design-inspiration.md, ../../../design-web/SKILL.md, ../../../design-system/SKILL.md
---

# Redesign — Total Rethink of an Existing Surface

A redesign is **not** a refinement move (`critique`/`audit`/`bolder`/`quieter`/`distill`/
`polish` all *inherit* the existing surface) and **not** `generate` FULL (which assumes
nothing is built yet). It reconceives an existing surface: everything about *form* —
structure, layout, typography, composition, section flow — is rethought from the register's
POV, while the surface's **color identity is preserved**. The single defect this move exists
to prevent is a "redesign" that is really a copy-paste of the old design lightly reskinned.

### When to use

- The owner asks to **redesign / refonte / rebuild / rework** a surface that **already
  exists** (a live page/screen, existing HTML/CSS, or a running app view).
- **Not for:** a brand-new surface with nothing built (→ `generate` FULL); an incremental
  fix or quality pass on a design you want to keep (→ `critique`/`audit`/`polish`); a tone
  nudge on an otherwise-kept design (→ `bolder`/`quieter`).
- **Prerequisite:** Gate 0 in `design-method/SKILL.md` (register, tone, signature element)
  locked in writing, exactly as `generate` requires — a redesign still commits a register.

### The three deltas over `generate`

This move **runs the full 8-step pipeline in `./generate.md`** — read it and follow it. Do
**not** restate its steps here. Scope follows generate's own rule: **PAGE** when a
`design-system.md` already exists, **FULL** when the existing surface has no formalized tokens
file. Step 2's sourcing follows generate unchanged — the local corpus
(`../../../design-web/references/refs-design/`) first and mandatory in both scopes, then real
sector sites for register only: 2 in FULL, 1 in PAGE, 0 when the register is already locked in
writing. Generate's **Exploration Gate always runs on this move** — a redesign has, by
definition, a page body to decide — and which axes it puts in play is read from generate's own
scope table for the resolved scope and register; do **not** restate or re-parameterise that
table here. It adds exactly three binding deltas on top:

1. **Read the old surface first — to diverge from it, never to seed from it.** Before Step 1,
   capture the current design (screenshot + note its structure/section flow/layout). Its
   ONLY purpose is a *do-not-reproduce* reference: the redesign must not reuse the old
   surface's structure, spacing rhythm, section order, or component skeleton. Treat the old
   design like a browsed inspiration site — a thing to measure distance *from*, never a
   template to lift (same rule as `../../../design-web/references/design-inspiration.md`, now
   applied to the project's own prior version). Make the measurement concrete: write the old
   body's section order out in `../body-sequence-bank.md`'s own terms — its order, and the
   principle (if any) that decided it. That named old sequence is the distance's starting
   point; the new one is **decided at generate's Exploration Gate**, never inherited by
   default and never "the same order, restyled".

   **The old sequence is the fourth silhouette.** Feed it to the three sketches as the one
   shape they are measured against: the gate's three body sequences must be distinct from
   each other *and* from it. A sketch that lands back on the old surface's ordering principle
   is disqualified on the spot — restyling the order you were asked to replace is not a
   direction, it is the thing this move exists to prevent. Re-fan that sketch; do not carry it
   into the judging. The challenger stays blind to all of this: it never sees the old sequence
   and never learns which sketch was re-fanned, so its verdict remains a comparison of three
   live directions, not a referendum on the old page. Where a subject's real order is in none
   of the ten, the off-bank road (generate's Exploration Gate §2) is open here exactly as
   it is there — a redesign is often where the forged sequence comes from, since the old
   surface has already proved which bank-shaped answer the subject was given once.

2. **Palette lock (overrides generate Step 3 "Source tokens").** The existing **color
   palette is a FIXED input, not a regenerated output** — reuse it verbatim; do **not**
   re-source palette from `sector-palettes.md`/`oklch-system.md`. Its source: the
   `### Colors` section of `design-system.md` when one exists; **otherwise extract the
   current colors from the old surface's rendered CSS** — the one do-not-reproduce exception
   to Delta 1 (colors are lifted from the old design; structure is never). The owner may
   lift this lock only by **explicitly** asking to change the colors; absent that, changing a
   brand color is a defect. **Only the palette is locked** — a redesign *supersedes*
   `design-system.md`'s typography and spacing tokens (generate Step 3's "design-system.md
   tokens win" does NOT apply to type/spacing here); those, with layout, structure, and
   composition, are exactly what the redesign rethinks. (One consequence for the Exploration
   Gate: whatever axes generate's scope table puts in play, the **palette-family axis is
   dropped here, in every combination** — the palette is locked by this delta, not chosen. The
   sketches diverge on structure, and on tone and signature where those are in play; asking
   them for a palette direction would put a locked input back on the table.)

3. **The Lookalike Test runs against the OLD version too.** The test itself — how it is run and
   what it is compared against — is defined once, in
   `../../../design-web/references/design-inspiration.md`. Run it from there; do **not**
   restate it or re-parameterise it here. This move adds exactly one comparison on top: the
   shipped redesign's silhouette against the **old surface**. Indistinguishable from what it
   replaces = the redesign didn't happen → go back to the locked pair, **both** halves of it —
   hero treatment (`../macrostructure-bank.md`) and body sequence
   (`../body-sequence-bank.md`) — not cosmetic tweaks. In practice that means re-running the
   Exploration Gate with the failing direction named as a fourth thing to diverge from,
   alongside the old sequence. A redesign that keeps the old silhouette is a fail, exactly like
   structural slop.

### Report template

```markdown
## Redesign move — report

**Register loaded:** register/brand.md | register/product.md
**Existing design-system.md:** yes/no → **scope:** PAGE (yes) | FULL (no)

### Delta 1 — Old surface captured (do-not-reproduce reference / fourth silhouette)
- Old structure/section flow: {summary} — screenshot: yes/no
- Old body sequence, in body-sequence-bank.md terms: {order} — principle: {one line | "none discernible"}
- Exploration Gate: the 3 sketches diverge from each other AND from that old sequence: yes/no
- Sketch disqualified for landing back on the old ordering principle: {none | sketch N, re-fanned as {new sequence}}
- Winning pick (generate Step 4): {hero treatment} + {body sequence} — distance from the old one: {one line}
- Salvaged from a losing sketch: {one idea + where it lands | none, because {reason}}
- Confirmed NOT reused: structure / spacing rhythm / section order / component skeleton

### Delta 2 — Palette lock
- Palette source: design-system.md ### Colors | extracted from old surface (no tokens file)
- Colors reused verbatim: yes/no (no → owner explicitly authorized a color change? yes/no)
- Color tokens: {values} (locked)
- Superseded / rethought freely: typography / spacing / layout / composition

### Generate pipeline (scope per ./generate.md — PAGE if design-system.md exists, else FULL)
- [follow and fill ./generate.md's report template: the Exploration Gate section (axes per its
  scope table, palette-family axis marked "dropped — locked by Delta 2") then steps 1–8, with
  the palette line = "locked, see Delta 2"]

### Delta 3 — Lookalike Test (run per design-inspiration.md — only the OLD-version line is this move's)
- Test run as defined in design-inspiration.md: pass/fail
- vs OLD version silhouette: pass/fail (fail → returned to the Step 4 hero + body-sequence pick)

### Deviations / gaps
- {anything skipped, exempted, or unresolved, with the reason}
```
