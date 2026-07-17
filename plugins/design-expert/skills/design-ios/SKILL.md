---
name: design-ios
description: "iOS + macOS mockups and handoff specs — Dynamic Type scale, semantic colors, device viewports, Liquid Glass, macOS text/window/pointer conventions, device-framed HTML mockup, and a SwiftUI-ready handoff spec. Produces tokens + mockup only, never SwiftUI code."
when-to-use: "Designing an iOS or macOS screen or flow — the deliverable is a device/window-framed HTML mockup and a handoff spec for swift-expert or an Apple-platform developer to implement, not working SwiftUI."
keywords: ios, macos, hig, dynamic-type, liquid-glass, swiftui, handoff, mockup, desktop-tinting
priority: critical
related: design-method, design-system, design-review
---

## Design iOS/macOS — Mockup and Handoff, Not Code

### When
After `design-system` tokens exist. This skill never writes SwiftUI — it produces a
static HTML mockup at exact device/window dimensions plus a spec that `swift-expert` or
an Apple-platform developer implements.

### Input
- `design-system.md` — OKLCH palette, typography direction, motion personality.
- The screen/flow to mock up and the target platform: iPhone / iPad (iOS) or a resizable
  window (macOS).

### Steps — iOS

1. **Map tokens to iOS roles.** Typography → Dynamic Type text styles, anchored at Body
   17pt down to Caption 2 11pt (never fixed point sizes) — see `references/dynamic-type.md`.
   Colors → semantic color roles (never raw RGB/hex) — see `references/semantic-colors.md`.
2. **Pick the device viewport(s)** from `references/viewports.md` — mock up in exact
   points at the chosen scale factor.
3. **Build the HTML mockup**: a device-frame `<div>` at the exact viewport dimensions,
   `viewport-fit=cover` meta tag, `env(safe-area-inset-*)` for notch/Dynamic Island/home
   indicator spacing. See `references/mockup.md`.
4. **Apply Liquid Glass where it fits** — a floating layer of controls *above* regular
   content, not a content background. Two variants: **regular** (content-aware, the
   default for controls) and **clear** (more transparent — dim the content beneath it
   ~35% when clear sits over light content, so controls stay legible). Plus control
   morphing, concentricity between nested shapes, layered icon treatment. Source:
   developer.apple.com/design/human-interface-guidelines/materials (Liquid Glass, iOS 26).
   See `references/liquid-glass.md` — do not invent numeric corner-radius values; none are
   published.
5. **Verify touch targets and contrast**: 44×44pt minimum touch target (see
   `references/touch-targets.md`); **4.5:1 minimum contrast in Dark Mode** for body text
   (WCAG AA, HIG-endorsed) — check both light and dark against
   `references/semantic-colors.md` roles, not a single-mode check.
6. **Sidebar navigation ≤ 2 levels deep.** If the flow needs a 3rd level, restructure
   (tabs, push navigation, or a secondary sidebar) rather than nesting a 3rd disclosure
   tier — deeper sidebars are a documented HIG anti-pattern for iPadOS/macOS sidebars.
   Source: developer.apple.com/design/human-interface-guidelines/layout.
7. **Write the handoff spec** per `references/handoff-swiftui.md`: named tokens only
   (never raw values), Dynamic Type text styles (never fixed sizes), semantic colors,
   explicit sizing behavior (fixed/hug/fill) per element, all interaction states
   (disabled/pressed/focused), spacing in pt.

### Steps — macOS

1. **Map tokens to macOS text sizes.** macOS uses its own fixed scale, distinct from iOS
   Dynamic Type — confirmed anchors: **Large Title 26pt** down to **body ~13pt**, floor
   **Caption 2 ~10pt**. Source: developer.apple.com/design/human-interface-guidelines/typography.
   **Gap — do not invent**: the full intermediate scale (Title 1–3, Headline, Subhead,
   Footnote point values) is not confirmed in this pass; reconfirm on the HIG typography
   page or Xcode's SF font catalog before using an intermediate size verbatim.
2. **No Dynamic Type on macOS** — the platform ships fixed size *variants per context*
   (e.g. control sizes: regular/small/mini) instead of a user-adjustable type scale. Pick
   the variant that matches the control's context, don't apply an iOS Dynamic Type style.
3. **Never draw a custom window chrome.** Title bar, traffic lights, toolbar, and sidebar
   are system-drawn; the mockup should frame content inside a standard macOS window shape,
   not invent custom chrome. Source: developer.apple.com/design/human-interface-guidelines/windows.
4. **Desktop tinting**: background materials pick up a subtle tint from the desktop
   picture/wallpaper behind the window — reflect this as a soft, low-opacity tint layer in
   the mockup, not a flat opaque background. Source:
   developer.apple.com/design/human-interface-guidelines/materials.
5. **Pointer feedback, not touch feedback**: hover, highlight, and lift states on
   interactive elements (buttons, list rows) — macOS is pointer-driven, so every hoverable
   control needs a hover state in the mockup and handoff spec, unlike iOS/iPadOS touch-only
   flows. Source: developer.apple.com/design/human-interface-guidelines/pointing-devices.
6. **Window sizing is a mockup convenience, not a spec.** Unlike iOS device viewports,
   macOS windows are user-resizable — pick a reasonable default canvas (e.g. common
   productivity-app widths) for the mockup, but do not present it as an official fixed
   dimension; state that explicitly in the handoff spec.
7. **Write the handoff spec** per `references/handoff-swiftui.md`, adapted: macOS text
   sizes instead of Dynamic Type styles, hover/pressed/focused states (pointer, not touch),
   otherwise same named-token discipline.

### Failure Handling
- Screenshot/preview tooling unavailable → describe the mockup in the handoff spec with
  exact pt values instead of blocking on a visual.
- A fact needed isn't in the references below → mark it "to reconfirm on
  developer.apple.com" in the output; never invent a number. This applies in particular to
  **iOS/macOS spacing and corner-radius grids — neither is published as an official numeric
  scale**; do not invent an 8pt-style grid for Apple platforms, point instead to Xcode's
  Design Resources / SF Symbols catalog as the source of truth to reconfirm against.

### Output
- Device-framed (iOS) or window-framed (macOS) HTML mockup at exact viewport
  points/reasonable default canvas.
- `handoff.md` (or equivalent) with named tokens, text styles, semantic colors, sizing,
  states, spacing — ready for `swift-expert`.

### Next → `design-review` (mockup-scoped: screenshot the mockup, verify contrast, no
full site audit loop).

### References
| File | Purpose |
|------|---------|
| `references/dynamic-type.md` | **Canonical iOS Dynamic Type scale (Large) — verified iosfontsizes.com** |
| `references/semantic-colors.md` | **Canonical semantic color roles — verified WWDC19, still current** |
| `references/viewports.md` | **Canonical iOS device viewports in points — verified ios-resolution.com** |
| `references/liquid-glass.md` | **Canonical Liquid Glass facts — verified developer.apple.com, iOS 26** |
| `references/touch-targets.md` | 44×44pt target — HIG-sourced, flagged for reconfirmation |
| `references/mockup.md` | Device-frame HTML/CSS technique (safe areas, viewport-fit) |
| `references/handoff-swiftui.md` | SwiftUI-ready handoff spec format |

**Gap (not covered by any reference file, inlined above from HIG, flagged for a future
`references/macos.md`)**: macOS type-size anchors, no-Dynamic-Type rule, system window
chrome, desktop tinting, pointer states. Out of this pass's exclusive scope to create.
