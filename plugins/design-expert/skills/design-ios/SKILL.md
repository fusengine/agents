---
name: design-ios
description: "iOS mockups and handoff specs — Dynamic Type scale, semantic colors, device viewports, Liquid Glass, device-framed HTML mockup, and a SwiftUI-ready handoff spec. Produces tokens + mockup only, never SwiftUI code."
when-to-use: "Designing an iOS screen or flow — the deliverable is a device-framed HTML mockup and a handoff spec for swift-expert or an iOS developer to implement, not working SwiftUI."
keywords: ios, hig, dynamic-type, liquid-glass, swiftui, handoff, mockup
priority: critical
related: design-method, design-system, design-review
---

## Design iOS — Mockup and Handoff, Not Code

### When
After `design-system` tokens exist. This skill never writes SwiftUI — it produces a
static HTML mockup at exact device dimensions plus a spec that `swift-expert` or an iOS
developer implements.

### Input
- `design-system.md` — OKLCH palette, typography direction, motion personality.
- The screen/flow to mock up and the target device class (iPhone / iPad).

### Steps

1. **Map tokens to iOS roles.** Typography → Dynamic Type text styles (never fixed point
   sizes). Colors → semantic color roles (never raw RGB/hex). See references below.
2. **Pick the device viewport(s)** from `references/viewports.md` — mock up in exact
   points at the chosen scale factor.
3. **Build the HTML mockup**: a device-frame `<div>` at the exact viewport dimensions,
   `viewport-fit=cover` meta tag, `env(safe-area-inset-*)` for notch/Dynamic Island/home
   indicator spacing. See `references/mockup.md`.
4. **Apply Liquid Glass where it fits** — floating navigation/controls layer, control
   morphing, concentricity between nested shapes, layered icon treatment. See
   `references/liquid-glass.md` — do not invent numeric corner-radius values for it; none
   are published.
5. **Verify touch targets**: 44×44pt minimum — flagged as HIG-sourced but not re-verified
   against the current HIG page in this pass (see `references/touch-targets.md`).
6. **Write the handoff spec** per `references/handoff-swiftui.md`: named tokens only
   (never raw values), Dynamic Type text styles (never fixed sizes), semantic colors,
   explicit sizing behavior (fixed/hug/fill) per element, all interaction states
   (disabled/pressed/focused), spacing in pt.

### Failure Handling
- Screenshot/preview tooling unavailable → describe the mockup in the handoff spec with
  exact pt values instead of blocking on a visual.
- A fact needed isn't in the references below → mark it "to reconfirm on
  developer.apple.com" in the output; never invent a number.

### Output
- Device-framed HTML mockup at exact viewport points.
- `handoff.md` (or equivalent) with named tokens, Dynamic Type styles, semantic colors,
  sizing, states, spacing — ready for `swift-expert`.

### Next → `design-review` (mockup-scoped: screenshot the mockup, verify contrast, no
full site audit loop).

### References
| File | Purpose |
|------|---------|
| `references/dynamic-type.md` | **Canonical Dynamic Type scale (Large) — verified iosfontsizes.com** |
| `references/semantic-colors.md` | **Canonical semantic color roles — verified WWDC19, still current** |
| `references/viewports.md` | **Canonical device viewports in points — verified ios-resolution.com** |
| `references/liquid-glass.md` | **Canonical Liquid Glass facts — verified developer.apple.com, iOS 26** |
| `references/touch-targets.md` | 44×44pt target — HIG-sourced, flagged for reconfirmation |
| `references/mockup.md` | Device-frame HTML/CSS technique (safe areas, viewport-fit) |
| `references/handoff-swiftui.md` | SwiftUI-ready handoff spec format |
