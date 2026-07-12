---
name: design-android
description: "Android mockups and handoff specs — Material 3 Expressive type scale, shape scale, window size classes, color roles, device-framed HTML mockup, and a Compose-ready handoff spec. Produces tokens + mockup only, never Compose code."
when-to-use: "Designing an Android screen or flow — the deliverable is a device-framed HTML mockup and a handoff spec for an Android developer to implement, not working Compose."
keywords: android, material3, expressive, compose, handoff, mockup, window-size-classes
priority: critical
related: design-method, design-system, design-review
---

## Design Android — Mockup and Handoff, Not Code

### When
After `design-system` tokens exist. This skill never writes Jetpack Compose — it produces
a static HTML mockup at exact device dimensions plus a spec an Android developer implements.

### Input
- `design-system.md` — OKLCH palette, typography direction, motion personality.
- The screen/flow to mock up and the target window size class.

### Steps

1. **Map tokens to Material 3 roles.** Typography → `references/type-scale.md`. Colors →
   `references/color-roles.md` (never raw RGB/hex — roles derived from a seed color).
   Shapes → `references/shape-scale.md` (never an arbitrary border-radius).
2. **Pick the window size class** from `references/window-size-classes.md` — mock up at
   the dp width that matches the target device class (phone/foldable/tablet).
3. **Build the HTML mockup**: a device-frame `<div>` sized in dp-equivalent px, following
   the 4/8dp grid throughout.
4. **Verify touch targets and spacing**: 48×48dp minimum touch target, ≥ 8dp spacing
   between adjacent targets — see `references/touch-targets.md`.
5. **Write the handoff spec** per `references/handoff-compose.md`: colors →
   `MaterialTheme.colorScheme.*`, typography → `MaterialTheme.typography.*`, shapes →
   `MaterialTheme.shapes.*`, custom spacing scale in dp, explicit sizing, states + tonal
   elevation, and **start/end** (never left/right) for RTL correctness.

### Failure Handling
- Screenshot/preview tooling unavailable → describe the mockup in the handoff spec with
  exact dp values instead of blocking on a visual.
- A fact needed isn't in the references below → mark it "to reconfirm on
  developer.android.com / m3.material.io" in the output; never invent a number.

### Output
- Device-framed HTML mockup at the target window size class.
- `handoff.md` (or equivalent) with Compose theme mappings, spacing, sizing, states,
  tonal elevation — ready for an Android developer.

### Next → `design-review` (mockup-scoped: screenshot the mockup, verify contrast, no
full site audit loop).

### References
| File | Purpose |
|------|---------|
| `references/type-scale.md` | **Canonical Material 3 type scale — verified material-components-android** |
| `references/shape-scale.md` | **Canonical shape/corner-radius scale — verified m3.material.io** |
| `references/color-roles.md` | **Canonical Material 3 color roles — verified m3.material.io** |
| `references/window-size-classes.md` | **Canonical window size classes — verified developer.android.com** |
| `references/touch-targets.md` | 48×48dp target + 8dp spacing — verified |
| `references/handoff-compose.md` | Compose-ready handoff spec format |
