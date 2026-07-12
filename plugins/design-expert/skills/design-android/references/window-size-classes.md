---
name: window-size-classes
description: "Canonical Android window size classes (dp) for choosing the mockup width and adaptive layout behavior."
when-to-use: "Picking which device class to mock up for, or deciding when a layout must adapt (phone vs foldable vs tablet)."
keywords: android, window-size-classes, adaptive, dp, tablet, foldable
priority: critical
related: ../SKILL.md
---

# Window Size Classes

Source: developer.android.com/develop/adaptive-apps. Status: verified.

| Class | Width (dp) |
|---|---|
| Compact | < 600 |
| Medium | 600–839 |
| Expanded | 840–1199 |
| Large | 1200–1599 |
| Extra Large | ≥ 1600 |

## Rule
Mock up at the dp width matching the target class, not an arbitrary "mobile" breakpoint.
A layout intended to adapt (e.g. list-detail) should be mocked at both Compact and
Expanded to show the adaptive behavior in the handoff spec.
