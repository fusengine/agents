---
name: design-mobile
description: "iOS or Android mockup + handoff spec. Argument: ios|android. Produces tokens, a device-framed HTML mockup, and a spec for swift-expert or an Android developer — never SwiftUI/Compose code."
argument-hint: "ios|android <screen description>"
---

# /design:mobile — iOS/Android Mockup + Handoff (MOBILE scope)

Design a mobile screen or flow. This command never writes SwiftUI or Compose — the
deliverable is a device-framed HTML mockup plus a handoff spec for the platform developer.

**Complete documentation**: `skills/design-ios/SKILL.md` or `skills/design-android/SKILL.md`.

## Usage

```
/design:mobile ios onboarding flow
/design:mobile android settings screen
/design:mobile ios pricing paywall
```

## Workflow

1. Read `skills/design-method/SKILL.md` — the 4-question brief and signature element still
   apply; no inspiration browsing for mobile (platform HIG/Material references replace it).
2. If no `design-system.md` exists, read `skills/design-system/SKILL.md` first to establish
   tokens; otherwise reuse the existing one.
3. Route by argument:
   - `ios` → `skills/design-ios/SKILL.md` — Dynamic Type, semantic colors, exact device
     viewports, Liquid Glass where it fits, 44×44pt touch targets.
   - `android` → `skills/design-android/SKILL.md` — Material 3 (Expressive) type scale,
     shape scale, color roles, window size classes, 48×48dp touch targets.
4. Build the device-framed HTML mockup at exact viewport/window-size dimensions.
5. Write the handoff spec (SwiftUI-ready or Compose-ready) — named tokens only, explicit
   sizing/states/spacing.
6. Read `skills/design-review/SKILL.md`, mockup-scoped: contrast check on the mockup,
   screenshot it, no full site audit loop.

## Forbidden
Writing SwiftUI or Jetpack Compose code. Inventing a numeric fact not in `design-ios`/`design-android`'s references (mark it "to reconfirm" instead). Inspiration-site browsing.
