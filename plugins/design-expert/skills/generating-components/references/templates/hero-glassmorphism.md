---
name: hero-glassmorphism
description: Hero section with glassmorphism card overlay and 3-layer depth background
when-to-use: Modern landing pages requiring visual depth with glass effect cards
keywords: hero, glassmorphism, gradient-orbs, backdrop-blur, depth
priority: high
related: hero-section.md
---

# Hero Glassmorphism Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Background layer 1 | Base gradient (primary/accent) | Full bleed |
| Background layer 2 | 2-3 gradient orbs with blur(80-100px) | Scale down on mobile |
| Background layer 3 | Glass surface overlay | Full bleed |
| Top | Badge pill (glass style) | Centered |
| Center | Headline h1 clamp(2rem, 5vw, 4.5rem) | Scale down |
| Below headline | Subtitle, max-w-2xl | Full width mobile |
| Actions | Primary CTA + Glass outline CTA | Stack on mobile |
| Bottom | Glass card preview with 3-col grid | 1-col on mobile |

## Components (shadcn/ui)

- Button: primary filled + glass outline variant
- Badge: glassmorphism pill with icon

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| glass-bg | bg-white/10 dark:bg-white/5 | Glass surface |
| glass-blur | backdrop-blur-xl | Frosted effect |
| glass-border | border-white/20 | Subtle edge |
| orb-primary | var(--color-primary)/20 | Blur 100px |
| orb-accent | var(--color-accent)/15 | Blur 80px |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Container | staggerChildren: 0.15s | delayChildren: 0.2s |
| Each child | opacity 0->1, y 30->0 | 0.5s easeOut |
| Glass cards | whileHover: y -4, scale 1.02 | 0.2s |
| Orbs | Subtle float/pulse | 4-6s infinite |

## Gemini Design Prompt

> "Create a hero section with 3-layer glassmorphism depth: base gradient, blurred gradient orbs (primary + accent), and glass card overlay (bg-white/10, backdrop-blur-xl, border-white/20). Include badge, bold headline, subtitle, dual CTAs, and a glass preview card. Use design-system.md OKLCH tokens. No Inter/Roboto. Framer Motion stagger entrance."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with glass utility classes |
| Laravel Blade | Visual spec -> Livewire Flux + CSS backdrop-filter |
| Swift/SwiftUI | Visual spec -> .ultraThinMaterial + blur modifiers |

## Validation Checklist

- [ ] 3 distinct depth layers (gradient, orbs, glass surface)
- [ ] backdrop-blur-xl on glass elements, not simple opacity
- [ ] OKLCH colors from design-system.md, no hard-coded hex
- [ ] No Inter/Roboto fonts
- [ ] Hover lift on interactive glass cards
