---
name: type-scale
description: "Canonical Material 3 type scale baseline (sp) plus the Expressive Emphasized variants shipped May 2025."
when-to-use: "Mapping design-system.md typography to Material 3 type roles for a mockup or handoff spec."
keywords: android, material3, typography, expressive, sp
priority: critical
related: ../SKILL.md, color-roles.md
---

# Material 3 Type Scale

Source: material-components-android/Typography.md. Status: verified.

## Baseline scale (sp)

| Role | Sizes (sp) |
|---|---|
| Display | 57 / 45 / 36 |
| Headline | 32 / 28 / 24 |
| Title | 22 / 16 / 14 |
| Body | 16 / 14 / 12 |
| Label | 14 / 12 / 11 |

Each row is Large / Medium / Small.

## Expressive variants
Material 3 Expressive (shipped May 2025 — see `color-roles.md` for the shipping source)
adds 30 Emphasized type styles layered on top of the baseline scale above for stronger
visual rhythm. Use the baseline scale by default; reach for Emphasized styles when the
tone from `design-method` calls for a bolder, more expressive type rhythm.

## Rule
Reference roles by name (`Headline Large`, `Body Medium`, …) in the handoff spec — maps
directly to `MaterialTheme.typography.*` in Compose.
