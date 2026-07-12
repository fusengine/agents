---
name: shape-scale
description: "Canonical Material 3 shape/corner-radius scale (dp) — the only source of border-radius values for Android mockups."
when-to-use: "Choosing corner-radius values for any shape in an Android mockup."
keywords: android, material3, shape, corner-radius, dp
priority: critical
related: ../SKILL.md, type-scale.md
---

# Shape Scale (Corner Radius)

Source: m3.material.io/styles/shape/corner-radius-scale. Status: verified.

| Size | Radius (dp) |
|---|---|
| None | 0 |
| Extra Small | 4 |
| Small | 8 |
| Medium | 12 |
| Large | 16 |
| Large Increased | 20 |
| Extra Large | 28 |

## Rule
Pick radius values from this scale only — no arbitrary border-radius. Larger surfaces
(cards, sheets, dialogs) generally use Large/Extra Large; small controls (chips, buttons)
use Small/Medium.
