---
name: liquid-glass
description: "Canonical Liquid Glass facts (iOS 26) — the only source for this material in this plugin. No numeric corner-radius exists officially; do not invent one."
when-to-use: "Deciding whether and how to apply Liquid Glass to navigation, controls, or icons in an iOS mockup."
keywords: ios, liquid-glass, ios26, material, navigation
priority: high
related: ../SKILL.md, semantic-colors.md
---

# Liquid Glass (iOS 26)

Source: developer.apple.com/documentation/technologyoverviews/liquid-glass. Status: verified official.

## What it is
A functional floating material layer for navigation and controls — not a static visual
style. Distinguishing behaviors:

- **Morphing controls** — controls reshape fluidly as context changes (e.g. a tab bar
  compressing on scroll).
- **Concentricity** — nested shapes (a button inside a card inside a sheet) share a
  common corner geometry so the curves read as concentric, not arbitrary.
- **Layered icons** — icons render in light / dark / clear / tinted layers that respond
  to the material beneath them.

## What is NOT verified — do not invent
No official numeric corner-radius value exists for Liquid Glass shapes. If a mockup needs
a radius value, note it as a project-specific choice, never as "the Liquid Glass radius."

## Rule
Use Liquid Glass for the floating navigation/control layer where it fits the tone from
`design-method`; do not apply it as flat decoration. If unsure whether a surface qualifies
for it, prefer a plain semantic-color surface over a guessed glass treatment.
