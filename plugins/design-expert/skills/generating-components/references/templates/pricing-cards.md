---
name: pricing-cards
description: Complete 3-tier pricing section with annual/monthly toggle
when-to-use: SaaS landing pages with multiple pricing plans and billing toggle
keywords: pricing, tiers, toggle, annual, comparison
priority: high
related: pricing-card.md, hero-section.md
---

# Pricing Cards Section Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Header | Section title + subtitle | Centered, text scales |
| Toggle | Annual/Monthly switch, annual default | Centered below header |
| Cards grid | 3 tiers: Starter / Pro / Enterprise | 1-col mobile -> 3-col desktop |
| Pro card | Middle tier, "Most Popular" badge, elevated | Visual prominence |

## Components (shadcn/ui)

- Button: CTA per card (filled for popular, outline for others)
- Badge: "Most Popular" with icon
- Switch/Toggle: custom animated annual/monthly
- Card: glassmorphism on non-popular, solid primary on popular

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| popular-bg | var(--color-primary) | Solid primary for Pro |
| popular-shadow | shadow-2xl shadow-primary/30 | Depth emphasis |
| glass-bg | bg-white/10 backdrop-blur-xl | Non-popular cards |
| toggle-active | bg-primary | Active toggle state |
| save-badge | text-accent | "Save 20%" label |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Container | staggerChildren: 0.1s | delayChildren: 0.2s |
| Cards | opacity 0->1, y 30->0 | 0.5s |
| Cards hover | whileHover: y -8 | spring |
| Toggle knob | layout animation | 0.2s |
| Price change | AnimatePresence crossfade | 0.3s |

## Gemini Design Prompt

> "Create a 3-tier pricing section with annual/monthly toggle (annual default, 'Save 20%' badge). Starter/Pro/Enterprise layout. Pro tier highlighted with solid primary bg, 'Most Popular' badge, and elevated shadow. Other cards use glassmorphism. Include checkmark features list and full-width CTAs. Use design-system.md OKLCH tokens. No Inter/Roboto. Framer Motion stagger + hover lift."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Card, Button, Switch |
| Laravel Blade | Visual spec -> Livewire Flux pricing grid |
| Swift/SwiftUI | Visual spec -> LazyVGrid with toggle binding |

## Validation Checklist

- [ ] Exactly 3 tiers, middle = popular (research: +38% selection)
- [ ] Annual toggle default ON (+25-35% revenue uplift)
- [ ] Popular card visually elevated (shadow + color + badge)
- [ ] Price animates on toggle change
- [ ] OKLCH colors, no hard-coded hex, no Inter/Roboto
