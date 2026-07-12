---
name: touch-targets
description: "Android minimum touch target size and spacing — verified against Android accessibility guidance and Material 3."
when-to-use: "Sizing any tappable control in an Android mockup."
keywords: android, touch-target, accessibility, material3
priority: high
related: ../SKILL.md
---

# Touch Targets

Source: support.google.com/accessibility/android + m3.material.io. Status: verified.

- **48×48dp minimum** touch target for any tappable control.
- **≥ 8dp spacing** between adjacent touch targets.
- Grid: align to the 4dp/8dp spacing grid throughout.

## Rule
Every tappable control in the mockup meets 48×48dp minimum, even if the visible glyph is
smaller (pad the hit area), with at least 8dp clearance from its neighbors.
