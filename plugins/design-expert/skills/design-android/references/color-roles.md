---
name: color-roles
description: "Canonical Material 3 (Expressive) color roles derived from a seed color — the only source of color-role names for Android mockups."
when-to-use: "Mapping design-system.md OKLCH tokens to Material 3 color roles for a mockup or handoff spec."
keywords: android, material3, expressive, color, roles, dynamic-color
priority: critical
related: ../SKILL.md, type-scale.md
---

# Material 3 Color Roles

Source: blog.google + developer.android.com/develop/ui/compose/designsystems/material3 —
Material 3 Expressive shipped May 2025. Status: verified.

## Roles
`primary` / `onPrimary` / `primaryContainer` / `onPrimaryContainer`, mirrored for
`secondary` and `tertiary`, plus `surface` / `onSurface`. All roles derive from a single
seed color via the Material dynamic-color algorithm.

Algorithm detail is out of scope here — see
m3.material.io/styles/color/system/how-the-system-works for the derivation itself; this
plugin only needs the role names above to map `design-system.md` tokens onto them.

## Rule
Every color in the mockup and handoff spec references one of these roles — never a raw
hex/RGB value. In the handoff spec this maps directly to `MaterialTheme.colorScheme.*`.
