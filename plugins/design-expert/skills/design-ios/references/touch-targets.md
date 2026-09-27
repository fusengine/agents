---
name: touch-targets
description: "iOS touch target size — verified against the live HIG Accessibility page (44x44 pt default, 28x28 pt minimum control size)."
when-to-use: "Sizing any tappable control in an iOS mockup."
keywords: ios, touch-target, accessibility, hig
priority: high
related: ../SKILL.md
---

# Touch Targets

**44×44 pt** — the HIG's *default* control size for iOS/iPadOS; the HIG's absolute
*minimum* control size is **28×28 pt**. Source:
developer.apple.com/design/human-interface-guidelines/accessibility (control-size table,
verified 2026-09-27). Design to 44×44 pt; 28×28 pt is a floor, not a target.

## Rule
Every tappable control in the mockup — buttons, list rows, icon-only controls — meets
44×44 pt minimum, even if the visible glyph is smaller (pad the hit area).
