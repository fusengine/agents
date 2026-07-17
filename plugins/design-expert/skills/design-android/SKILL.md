---
name: design-android
description: "Android mockups and handoff specs — Material 3 Expressive type scale (baseline + emphasized), full color-role system (45 roles incl. surface-container ramp + dynamic color), elevation tokens, shape scale, window size classes, FAB tiers, motion, device-framed HTML mockup, and a Compose-ready handoff spec. Produces tokens + mockup only, never Compose code."
when-to-use: "Designing an Android screen or flow — the deliverable is a device-framed HTML mockup and a handoff spec for an Android developer to implement, not working Compose."
keywords: android, material3, expressive, compose, handoff, mockup, window-size-classes, elevation, fab, motion
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

1. **Map tokens to Material 3 type roles.** `references/type-scale.md` gives the 15-role
   baseline scale (displayLarge 57/64sp … labelSmall 11/16sp, Roboto). Material 3
   Expressive adds a parallel **15-role Emphasized set** on top (30 roles total) for
   stronger visual rhythm — use baseline by default, reach for Emphasized when the tone
   from `design-method` calls for it. Source: m3.material.io/styles/typography/type-scale-tokens.
2. **Map tokens to Material 3 color roles.** `references/color-roles.md` documents the
   core role families (primary/secondary/tertiary + surface/onSurface) derived from a seed
   color. Material 3's full role system is larger — **45 color roles**, including a
   **surface-container ramp** (lowest → highest: `surfaceContainerLowest`,
   `surfaceContainerLow`, `surfaceContainer`, `surfaceContainerHigh`,
   `surfaceContainerHighest` — 5 levels for layering surfaces without shadow), `error`/
   `onError`/`errorContainer` (kept **static**, never derived from the dynamic seed, so
   error states stay legible regardless of theme), and **dynamic color**: on Android 12+
   all roles can be generated tonally from a user's wallpaper/seed, not just the design
   seed. Source: m3.material.io/styles/color/roles,
   m3.material.io/styles/color/system/how-the-system-works. **Gap**: `color-roles.md`
   documents the core families, not the full 45-role/surface-container enumeration — use
   the fact above until that reference is expanded (out of this pass's exclusive scope).
3. **Map tokens to shapes.** `references/shape-scale.md` (never an arbitrary
   border-radius). Material 3's full shape scale extends to **32dp, 48dp, and Full**
   (pill) beyond what's currently listed — Expressive defaults buttons to **pill (Full)**
   shape unless a product reason calls for a smaller radius. Source:
   m3.material.io/styles/shape/shape-scale-tokens. **Gap**: `shape-scale.md` stops at 28dp
   (Extra Large); reconfirm 32/48/Full on the m3.material.io page above until expanded.
4. **Apply elevation as tokens, not ad-hoc shadow.** 6 levels, **0 → 5**, mapping to
   **0 / 1 / 3 / 6 / 8 / 12dp**. Elevation is expressed via **shadow** at each level —
   the older `surfaceTint`-only approach is **deprecated**; don't rely on tint alone to
   convey elevation. Source: m3.material.io/styles/elevation/overview. **Gap**: no
   `references/elevation.md` exists yet — these token values are grounded but inlined
   here pending a dedicated reference file (out of this pass's exclusive scope).
5. **Pick the window size class** from `references/window-size-classes.md` — mock up at
   the dp width that matches the target device class (phone/foldable/tablet/desktop).
6. **Build the HTML mockup**: a device-frame `<div>` sized in dp-equivalent px, following
   the 4dp base / 8dp grid throughout.
7. **Verify touch targets and spacing**: 48×48dp minimum touch target, ≥ 8dp spacing
   between adjacent targets — see `references/touch-targets.md`.
8. **FAB: pick one of 3 tiers**, sized to the screen's primary-action weight — small FAB
   is **deprecated** in Material 3 Expressive, don't use it. Source:
   m3.material.io/components/floating-action-button/overview. **Gap**: no dedicated FAB
   reference file yet; the 3 surviving tiers and their exact dp sizes should be reconfirmed
   on the page above before finalizing a mockup.
9. **Motion**: Material 3 Expressive uses **spring-physics-based motion** (not fixed
   duration/easing curves) for its signature feel; the legacy duration/easing-curve tokens
   still apply where spring motion isn't specified. Source:
   m3.material.io/styles/motion/overview. **Gap**: no `references/motion.md` exists yet —
   note spring vs legacy-easing choice explicitly in the handoff spec until one exists.
10. **Write the handoff spec** per `references/handoff-compose.md`: colors →
    `MaterialTheme.colorScheme.*`, typography → `MaterialTheme.typography.*`, shapes →
    `MaterialTheme.shapes.*`, custom spacing scale in dp, explicit sizing, states + tonal
    elevation (name the elevation *level*, 0–5, not just "raised"/"flat"), and
    **start/end** (never left/right) for RTL correctness.

### Failure Handling
- Screenshot/preview tooling unavailable → describe the mockup in the handoff spec with
  exact dp values instead of blocking on a visual.
- A fact needed isn't in the references below → mark it "to reconfirm on
  developer.android.com / m3.material.io" in the output; never invent a number. This
  applies especially to the gaps flagged in Steps 2–4, 8, 9 above (full 45-role color
  system, 32/48dp/Full shapes, FAB tier dp sizes, motion spring parameters) — the
  reference files for these are not yet expanded/created; do not backfill invented
  numbers to close that gap silently.

### Output
- Device-framed HTML mockup at the target window size class.
- `handoff.md` (or equivalent) with Compose theme mappings, spacing, sizing, states,
  tonal elevation (level 0–5) — ready for an Android developer.

### Next → `design-review` (mockup-scoped: screenshot the mockup, verify contrast, no
full site audit loop).

### References
| File | Purpose |
|------|---------|
| `references/type-scale.md` | **Canonical Material 3 baseline type scale — verified material-components-android** (Expressive Emphasized set: see Step 1 above, not yet a separate file) |
| `references/shape-scale.md` | **Canonical shape/corner-radius scale — verified m3.material.io** (stops at 28dp — 32/48/Full gap, see Step 3) |
| `references/color-roles.md` | **Canonical Material 3 core color-role families — verified m3.material.io** (45-role/surface-container/dynamic-color gap, see Step 2) |
| `references/window-size-classes.md` | **Canonical window size classes — verified developer.android.com** |
| `references/touch-targets.md` | 48×48dp target + 8dp spacing — verified |
| `references/handoff-compose.md` | Compose-ready handoff spec format |

**Gaps (grounded facts, no reference file yet — inlined in Steps above, flagged for future
`references/elevation.md`, `references/motion.md`, FAB-tier detail; out of this pass's
exclusive scope to create)**: elevation tokens 0–5, FAB tiers, spring motion.
