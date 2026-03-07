---
name: hero-section
description: Above-the-fold hero with badge, headline, dual CTAs, and social proof
when-to-use: Landing pages requiring a compelling value proposition above the fold
keywords: hero, landing, headline, cta, above-the-fold
priority: high
related: feature-grid.md, pricing-cards.md
---

# Hero Section Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | Badge pill (icon + label) | Centered all breakpoints |
| Center | Headline h1 clamp(2rem, 5vw, 4rem) + accent span | Scale down on mobile |
| Below headline | Subtitle paragraph, max-w-2xl | Full width on mobile |
| Actions | Primary CTA (filled) + Secondary CTA (outline) | Stack vertical on mobile |
| Bottom | Social proof (avatars + metric) | Hidden on mobile (optional) |

## Components (shadcn/ui)

- Button: primary and outline variants for dual CTAs
- Badge: announcement pill with icon
- Avatar/AvatarGroup: social proof row

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| font-display | var(--font-display) | Headline font from design-system.md |
| headline-size | clamp(2rem, 5vw, 4rem) | Fluid typography |
| section-padding | py-20 md:py-32 | Vertical rhythm |
| bg-gradient | from-primary/5 to-transparent | Subtle background |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Container | staggerChildren: 0.1s | delayChildren: 0.2s |
| Each child | opacity 0->1, y 30->0 | 0.5s easeOut |
| Background | Parallax on scroll | Continuous |

## Gemini Design Prompt

> "Create a hero section with a centered badge pill, bold headline using clamp(2rem, 5vw, 4rem), subtitle, two CTA buttons (primary filled + outline), and a social proof row with avatar stack. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Framer Motion stagger entrance. F-pattern eye-tracking optimized."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with shadcn Button, Badge, Avatar |
| Laravel Blade | Visual spec -> Livewire Flux components |
| Swift/SwiftUI | Visual spec -> VStack with stagger animation |

## Validation Checklist

- [ ] Headline uses fluid clamp(), not fixed font-size
- [ ] Two CTAs with distinct visual hierarchy
- [ ] Stagger animation on entrance, not simultaneous
- [ ] No Inter/Roboto fonts, uses design-system.md tokens
- [ ] OKLCH colors from CSS variables, no hard-coded hex
