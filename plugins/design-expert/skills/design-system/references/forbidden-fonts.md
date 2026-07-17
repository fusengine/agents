---
name: forbidden-fonts
description: Canonical banned/flagged font tiers and the font self-hosting rule — the single source every other file in this plugin must point to instead of restating its own list.
when-to-use: Choosing or auditing a typography pair, grepping font-family for a design-review pass.
keywords: fonts, forbidden, banned, flag, self-hosting, woff2, font-display, typography
priority: critical
related: typography-pairs.md, contrast-ratios.md
---

# Forbidden Fonts

Canonical list — defined here only. Any other file in this plugin that mentions
forbidden fonts must point here instead of restating its own list.

## Hard-forbidden (auto-fail)

`Inter`, `Roboto`, `Arial`, `Open Sans`, `Lato`, `Poppins`.

## Flag-when-undeclared

`Fraunces`, `Instrument Serif`, `Playfair Display`, `Geist`, `Space Grotesk`. These fonts
are legitimate *when declared as the deliberate signature element* (see `design-method`
Step 2) — they are not banned outright. The tell isn't the font itself, it's the
*reflexive, undeclared* combo: serif-display + italic accent + cream background for the
first three; the "safe modern-technical" grotesk reached for on autopilot, with no stated
rationale, for Geist/Space Grotesk. If one of these fonts shows up without an explicit
signature-element rationale in `design-system.md`, flag it for review rather than
auto-passing it.

## Serif discipline

Completes (does not replace) the two tiers above. The full serif-discipline guidance
(when a serif display is warranted, italic descender clearance, emphasis-stays-in-one-family)
is canonical in `typography-pairs.md` → "Serif Discipline & Emphasis" — not restated here.

## Font Self-Hosting

A named display/premium font MUST be self-hosted: `@font-face` with a `woff2` source,
`font-display: swap`, and a `<link rel="preload">` for the file. If that pipeline isn't
wired up, don't name the font — fall back to a system stack instead. Naming a font in
`design-system.md` without ever loading it is aspirational typography that never ships;
the presence of `@font-face` is the check that the intent is real.
