---
name: pricing-card
description: Single pricing tier card with features list and popular badge
when-to-use: Individual pricing plan cards within a pricing section
keywords: pricing, card, features, popular, subscription
priority: high
related: pricing-cards.md
---

# Pricing Card Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Badge (conditional) | "Most Popular" pill, absolute -top-3 | Centered above card |
| Header | Plan name + short description | Left or center aligned |
| Price | Large number + /month or /year suffix | Prominent display |
| Features | Checkmark list of included features | Full width |
| Footer | Full-width CTA button | Sticky bottom of card |

## Components (shadcn/ui)

- Button: default variant for popular, outline for others
- Badge: "Most Popular" indicator (+38% selection rate)
- Card: rounded-2xl container with border

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| card-radius | rounded-2xl | Consistent with design system |
| popular-border | border-primary | Highlight popular tier |
| popular-shadow | shadow-lg shadow-primary/20 | Depth for popular |
| price-size | text-4xl font-bold | Price prominence |
| check-color | text-primary | Feature checkmarks |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Card | whileHover: y -4 | spring stiffness 300 |
| Badge | Scale entrance | 0.3s |

## Gemini Design Prompt

> "Create a single pricing card with plan name, description, large price display, checkmark features list, and full-width CTA button. Popular variant gets border-primary, shadow-lg, and 'Most Popular' badge. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Spring hover animation."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Card, Button, Badge |
| Laravel Blade | Visual spec -> Livewire Flux card component |
| Swift/SwiftUI | Visual spec -> VStack with GroupBox style |

## Validation Checklist

- [ ] Popular badge uses absolute positioning, not inline
- [ ] Price is visually dominant (text-4xl font-bold)
- [ ] CTA variant differs between popular and standard
- [ ] Hover lift animation, not scale-only
- [ ] OKLCH colors, no hard-coded hex values
