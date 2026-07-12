---
name: design-method
description: "Core design method — brief questions, tone commitment, signature element, 2-pass critique, anti-slop clusters, and routing to the target-specific skill (web/webapp/ios/android). Read this first, before any other design-expert skill."
when-to-use: "Start of any design task, before picking a target skill or writing a single line of HTML/CSS/tokens."
keywords: brief, tone, signature-element, anti-slop, routing, method
priority: critical
related: design-system, design-web, design-webapp, design-ios, design-android, design-review
---

# Design Method — The Core

This is the one place the design pipeline is defined. Every other skill in this plugin
assumes you've read this first and references it instead of restating it.

## Step 1 — Brief (4 questions, before any code)

Answer these from the user's request; ask only what's missing:

1. **Purpose** — what does this screen/page/app need to make someone do or believe?
2. **Tone** — pick ONE extreme and execute it with precision. Not "clean and modern."
   Examples: brutally minimal, maximalist, retro-futurist, organic, luxury, editorial.
   A tone that could describe three different competitors is not a tone.
3. **Constraints** — brand assets, existing design-system.md, platform (web/webapp/iOS/Android),
   accessibility requirements, technical stack.
4. **Differentiation** — what does this need to NOT look like (competitors, the previous
   version, generic AI output)?

## Step 2 — Signature Element

Before generating anything, name the ONE memorable element this design will be
remembered for — a distinctive hero treatment, an unusual grid, a typographic move, a
motion signature. If you can't name it in one sentence, the brief isn't sharp enough yet;
go back to Step 1. Everything else in the design supports this element; nothing competes
with it.

## Step 3 — Two-Pass Process

**Pass 1 — Compact plan.** Before writing markup, write a short plan: palette direction,
typography pair, layout approach, the signature element. A paragraph, not a page.

**Pass 2 — Critical re-read.** Re-read the Pass 1 plan against the Step 1 brief and ask:
"does this read as the generic default for this category, or does it commit to the tone
I chose?" If it's generic, revise the plan — not the first line of CSS. Only after Pass 2
passes do you write the first line of markup.

## Anti-Slop: Name What You're Avoiding

Three clusters read as "AI-generated" by default. Naming them is the fastest way to not
reproduce them:

1. **Cream #F4F1EA + a contrasted serif + terracotta accent** — the default "editorial SaaS" look.
2. **Near-black background + one acid accent color** — the default "dark developer tool" look.
3. **Broadsheet hairlines, zero border-radius, black/white only** — the default "premium minimal" look.

Dominant, committed colors and sharp accents beat a timid, safe palette every time.
Purple-on-white gradients are banned outright — they are the single most common tell.

## Routing — Which Skill Next

| Target | Full pipeline (no design-system.md yet) | Existing design system |
|--------|------------------------------------------|--------------------------|
| Web (marketing/landing) | `design-system` → `design-web` → `design-motion` → `design-review` | `design-web` → `design-motion` → `design-review` |
| Web app (dashboard, SaaS product) | `design-system` → `design-webapp` → `design-motion` → `design-review` | `design-webapp` → `design-motion` → `design-review` |
| iOS | `design-system` → `design-ios` → `design-review` | `design-ios` → `design-review` |
| Android | `design-system` → `design-android` → `design-review` | `design-android` → `design-review` |
| Copy only | `ux-copy` (any point in the pipeline) | `ux-copy` |

Scope also changes what runs:

| Scope | Site/inspiration browsing (design-web/design-webapp) | Full audit loop (design-review) |
|-------|--------------------------------------------------------|----------------------------------|
| FULL (new project) | Yes — 4 sites | Yes |
| PAGE (design-system.md exists) | Yes — 2 sites | Yes |
| COMPONENT (single element) | No — skip browsing, use existing tokens | Lightweight, component-scoped |
| MOBILE (iOS/Android) | No browsing — use platform HIG/Material references | Yes, mockup-scoped |

## Non-Negotiable Floor

Regardless of tone, target, or scope, every deliverable must have:

- **Responsive** behavior across the target's breakpoints/size classes.
- **Visible keyboard focus** on every interactive element (`:focus-visible`, never suppressed).
- **`prefers-reduced-motion`** respected wherever motion is added.

## Generation Approach

Generate HTML/CSS directly — this is the default and primary path, following the same
method as Anthropic's official `frontend-design` skill (commit to a point of view, avoid
templated defaults, verify with tools not vibes). Gemini Design MCP, Magic (21st.dev),
and shadcn MCP are optional tools of convenience for inspiration search or a fast first
draft — never a requirement, and native direct generation is always the fallback if any
of them are unavailable. Mobile targets (`design-ios`, `design-android`) never generate
SwiftUI or Compose — they produce token specs, an HTML device-framed mockup, and a
handoff spec for the platform developer.

## Next
Read the target skill from the routing table above. Token/contrast mechanics live in
`design-system`; the final quality gate lives in `design-review`.
