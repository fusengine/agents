---
name: dynamic-type
description: "Canonical iOS Dynamic Type scale (Large size category, reflecting UIKit) — the only source of iOS type sizes in this plugin."
when-to-use: "Mapping design-system.md typography to iOS text styles for a mockup or handoff spec."
keywords: ios, dynamic-type, typography, sf-pro
priority: critical
related: ../SKILL.md, semantic-colors.md
---

# Dynamic Type Scale (Large, UIKit-reflected)

Source: iosfontsizes.com, Large size category. Status: verified.

| Text style | Size (pt) | Weight |
|---|---|---|
| Large Title | 34 | Regular |
| Title 1 | 28 | Regular |
| Title 2 | 22 | Regular |
| Title 3 | 20 | Regular |
| Headline | 17 | Semibold |
| Body | 17 | Regular |
| Callout | 16 | Regular |
| Subheadline | 15 | Regular |
| Footnote | 13 | Regular |
| Caption 1 | 12 | Regular |
| Caption 2 | 11 | Regular |

## Fonts
SF Pro (default), SF Compact (compact contexts — Watch, small controls), New York (serif,
editorial/expressive contexts).

## Rule
Reference text styles by name in the handoff spec (`Body`, `Headline`, …) — never a fixed
point size. This is what makes the spec Dynamic-Type-compliant when implemented.
