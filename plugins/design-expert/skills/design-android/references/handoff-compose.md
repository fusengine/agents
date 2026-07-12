---
name: handoff-compose
description: "Format for the Compose-ready handoff spec — theme mappings, spacing, sizing, states, tonal elevation, and RTL-safe start/end direction. This is the deliverable an Android developer implements from."
when-to-use: "Writing the final handoff document after the Android mockup is built."
keywords: android, handoff, compose, spec, material3, rtl
priority: critical
related: ../SKILL.md, color-roles.md, type-scale.md
---

# Compose Handoff Spec Format

## Required sections

1. **Color** — every color mapped to `MaterialTheme.colorScheme.*` via the role names in
   `color-roles.md`. Never a raw hex/RGB value.
2. **Typography** — every text element mapped to `MaterialTheme.typography.*` via the
   role names in `type-scale.md`.
3. **Shape** — every corner radius mapped to `MaterialTheme.shapes.*` via `shape-scale.md`.
4. **Spacing** — a custom spacing scale in dp, aligned to the 4/8dp grid, referencing
   `design-system.md`'s density profile.
5. **Sizing** — explicit per element (fixed dp / wrap-content / fill).
6. **States** — disabled, pressed, focused, and **tonal elevation** changes per state
   (Material 3 uses elevation + tonal overlay together, not shadow alone).
7. **Direction** — always **start/end**, never left/right, so the layout mirrors
   correctly under RTL locales.

## Rule
If an Android developer has to guess a value or a direction, the spec is incomplete — go
back and name it, and use start/end consistently throughout.
