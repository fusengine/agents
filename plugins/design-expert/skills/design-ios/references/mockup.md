---
name: mockup
description: "Device-frame HTML/CSS technique for iOS mockups — exact viewport points, safe-area simulation."
when-to-use: "Building the actual HTML file for an iOS mockup, after picking a device viewport."
keywords: ios, mockup, html, css, safe-area, device-frame
priority: high
related: ../SKILL.md, viewports.md
---

# Device-Framed HTML Mockup

## Structure
- Outer frame `<div>` sized to the exact point viewport from `viewports.md` (1pt = 1px in
  the mockup, no arbitrary scaling).
- `<meta name="viewport" content="width=device-width, viewport-fit=cover">` to allow
  safe-area simulation.
- Safe areas via `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`,
  `env(safe-area-inset-left)`, `env(safe-area-inset-right)` — pad content so nothing sits
  under the Dynamic Island/notch or home indicator.

## Rule
The mockup is a visual reference for the handoff spec, not a functional prototype — no
gesture/scroll simulation is required, but the static frame must be pixel-accurate to the
device viewport so a developer can trust the proportions.
