---
name: redesign
description: "Total redesign of an EXISTING surface — replays generate's production pipeline to rethink structure/layout/typography/composition from scratch, while locking the existing color palette as a fixed anchor and forbidding any copy-paste of the old design."
when-to-use: "Owner asks to redesign / refonte / rebuild / rework an existing page, screen, or app — a surface already exists and must be reconceived, not incrementally refined (that is critique/polish) and not built from nothing (that is generate FULL)."
keywords: redesign, refonte, rebuild, rework, move, existing-surface, palette-lock, anti-copy
priority: critical
related: ./generate.md, ../../SKILL.md, ../../../design-web/references/design-inspiration.md, ../../../design-web/SKILL.md, ../../../design-system/SKILL.md
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
`design-system.md` already exists, **FULL** (4-site browse) when the existing surface has no
formalized tokens file. It adds exactly three binding deltas on top:

1. **Read the old surface first — to diverge from it, never to seed from it.** Before Step 1,
   capture the current design (screenshot + note its structure/section flow/layout). Its
   ONLY purpose is a *do-not-reproduce* reference: the redesign must not reuse the old
   surface's structure, spacing rhythm, section order, or component skeleton. Treat the old
   design like a browsed inspiration site — a thing to measure distance *from*, never a
   template to lift (same rule as `design-web/references/design-inspiration.md`, now applied
   to the project's own prior version).

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
   composition, are exactly what the redesign rethinks. (In FULL scope + brand register,
   generate's Exploration-Gate sketches still drive tone/macrostructure/signature, but their
   palette-family dimension is moot here — the palette is locked by this delta, not chosen.)

3. **Lookalike test runs against the OLD version too (extends design-web's Output Gate).**
   In addition to the existing ~200px silhouette test vs competitors
   (`design-web/SKILL.md` Output Gate), compare the shipped redesign's silhouette against
   the **old surface**. Indistinguishable from what it replaces = the redesign didn't happen
   → return to macrostructure choice (`../macrostructure-bank.md`), not cosmetic tweaks. A
   redesign that keeps the old silhouette is a fail, exactly like structural slop.

### Report template

```markdown
## Redesign move — report

**Register loaded:** register/brand.md | register/product.md
**Existing design-system.md:** yes/no → **scope:** PAGE (yes) | FULL (no)

### Delta 1 — Old surface captured (do-not-reproduce reference)
- Old structure/section flow: {summary} — screenshot: yes/no
- Confirmed NOT reused: structure / spacing rhythm / section order / component skeleton

### Delta 2 — Palette lock
- Palette source: design-system.md ### Colors | extracted from old surface (no tokens file)
- Colors reused verbatim: yes/no (no → owner explicitly authorized a color change? yes/no)
- Color tokens: {values} (locked)
- Superseded / rethought freely: typography / spacing / layout / composition

### Generate pipeline (scope per ./generate.md — PAGE if design-system.md exists, else FULL)
- [follow and fill ./generate.md's report template for steps 1–8; palette line = "locked, see Delta 2"]

### Delta 3 — Lookalike test
- vs competitors: pass/fail
- vs OLD version silhouette: pass/fail (fail → returned to macrostructure choice)

### Deviations / gaps
- {anything skipped, exempted, or unresolved, with the reason}
```
