---
name: semantic-colors
description: "Canonical iOS semantic color roles (WWDC19, still current) — background, grouped-background, and label hierarchies. Reference by role, never raw RGB/hex."
when-to-use: "Mapping design-system.md OKLCH tokens to iOS semantic color roles for a mockup or handoff spec."
keywords: ios, colors, semantic, hig, dark-mode
priority: critical
related: ../SKILL.md, dynamic-type.md
---

# Semantic Color Roles

Source: WWDC19 (semantic colors introduced), still current. Status: verified.

## Backgrounds
`systemBackground`, `secondarySystemBackground`, `tertiarySystemBackground` —
`systemGroupedBackground` and its secondary/tertiary variants for grouped/table layouts.

## Labels
`label`, `secondaryLabel`, `tertiaryLabel`, `quaternaryLabel` — the standard text
hierarchy, each with automatic light/dark adaptation.

## Rule
Every color in the mockup and handoff spec references one of these roles (or a project
semantic token mapped onto one) — never a hardcoded RGB/hex value. This is what makes
dark mode and increased-contrast accessibility modes work automatically once implemented.
