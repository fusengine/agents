# Design Expert Plugin (`fuse-design`)

UI/UX design director covering four targets: **marketing websites, web apps, iOS, and
Android**. Generates production-ready HTML/CSS directly — Gemini Design MCP, Magic
(21st.dev), and shadcn MCP are optional tools of convenience, never a requirement. Mobile
targets never produce SwiftUI or Compose code: they produce tokens, an HTML
device-framed mockup, and a handoff spec for `swift-expert` or an Android developer.

**Zero tolerance for generic "AI slop" aesthetics** — see the anti-slop clusters in
`skills/design-method/SKILL.md`.

## Agent

- **design-expert** (`agents/design-expert.md`) — the orchestrator. Reads
  `design-method` first, always; routes to the target-specific skill from there.

## Method (read this first)

All design work starts in `skills/design-method/SKILL.md`:

1. **Brief** — 4 questions (purpose, tone, constraints, differentiation) before any code.
2. **Signature element** — name the one memorable thing this design will be remembered for.
3. **Two-pass process** — a compact plan, then a critical re-read against the brief, before the first line of markup.
4. **Anti-slop clusters** — three named default-AI-look clusters to avoid on sight.
5. **Routing** — which skill to run next, based on target (web/webapp/iOS/Android) and scope (FULL/PAGE/COMPONENT/MOBILE).

## Skills

| Skill | Covers |
|---|---|
| `design-method` | The core method above — read first |
| `design-system` | OKLCH tokens, typography, spacing, motion profile, the canonical forbidden-fonts list, the mechanical contrast-check step |
| `design-web` | Marketing sites/landing pages — inspiration browsing (FULL/PAGE scope only), component generation, premium layout patterns, hard layout-discipline rules |
| `design-webapp` | Dashboards, auth, settings, onboarding, data tables, command palettes — density and state coverage over marketing polish |
| `design-ios` | iOS mockup + handoff — Dynamic Type, semantic colors, device viewports, Liquid Glass, SwiftUI-ready spec |
| `design-android` | Android mockup + handoff — Material 3 Expressive type/shape/color scales, window size classes, Compose-ready spec |
| `design-motion` | Motion gated by the `MOTION_INTENSITY` dial — most animation ideas die at the gate; mandatory hover/focus/disabled states and `prefers-reduced-motion` regardless |
| `ux-copy` | Voice/tone, CTAs, error messages, empty states, the copy self-audit (em-dash ban, production-tell catalogue) |
| `design-review` | The final gate — deterministic checks (contrast, fonts, colors, em-dash) then a bounded screenshot loop (max 2 fix cycles) |

## Commands

```
/design                  Full pipeline (web/webapp, no design-system.md yet)
/design:page             New page/screen, reuses existing design-system.md
/design:component        Single component, no browsing
/design:mobile ios|android   Mockup + handoff spec, never app code
/design:audit             Audit only, no generation
```

## Honesty Notes

- **Hooks provide state tracking, not phase gating.** The installed `@fusengine/harness`
  has no design-specific enforcement — it does not block phase skipping, force
  light+dark validation, or gate Gemini usage. The pipeline discipline in
  `design-method` is followed by convention and verified in `design-review`, not
  enforced by a hook. See `hooks/hooks.json`.
- **Gemini Design MCP, Magic, and shadcn MCP are optional.** Direct HTML/CSS generation
  is the default and the fallback if any of them is unavailable.
- **Every fact has one home.** Forbidden fonts and contrast thresholds live in
  `design-system`; the screenshot/review procedure lives in `design-review`; iOS/Android
  numeric facts live in `design-ios`/`design-android` with a verified/to-reconfirm status
  next to each one. Nothing else in this plugin restates them.

## Rules (`rules/`)

Trimmed to what isn't already covered by a skill: reusable component-pattern snippets
(`design-rules.md`), the stack-detection → framework-expert delegation table
(`framework-integration.md`), and the optional Gemini Design MCP quick-reference
(`gemini-design.md`).
