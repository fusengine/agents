---
name: handoff-swiftui
description: "Format for the SwiftUI-ready handoff spec — named tokens, Dynamic Type styles, semantic colors, sizing, states, spacing in pt. This is the deliverable swift-expert implements from."
when-to-use: "Writing the final handoff document after the mockup is built."
keywords: ios, handoff, swiftui, spec, tokens
priority: critical
related: ../SKILL.md, dynamic-type.md, semantic-colors.md
---

# SwiftUI Handoff Spec Format

Every value in this spec must be a **named token**, never a raw value pasted in isolation
— name it, then give the value once at the top as its definition.

## Required sections

1. **Typography** — every text element mapped to a Dynamic Type style name from
   `dynamic-type.md` (`Body`, `Headline`, …). Never a fixed point size.
2. **Color** — every color mapped to a semantic role from `semantic-colors.md`
   (`label`, `systemBackground`, …), or a project token that wraps one.
3. **Sizing** — explicit per element: `fixed` (exact pt), `hug` (intrinsic content size),
   or `fill` (expands to available space). No ambiguous "responsive" — SwiftUI needs one
   of these three per element.
4. **States** — disabled, pressed, focused (and loading/error where relevant) for every
   interactive element, each with its visual delta from default.
5. **Spacing** — every gap and padding value in pt, referencing the spacing scale from
   `design-system.md`.

## Rule
If `swift-expert` (or a human iOS developer) has to guess a value, the spec is
incomplete — go back and name it.
