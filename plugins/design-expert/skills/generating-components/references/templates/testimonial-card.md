---
name: testimonial-card
description: Testimonial card with quote, avatar, role, company, and star rating
when-to-use: Social proof sections with customer testimonials and reviews
keywords: testimonial, review, rating, avatar, social-proof
priority: medium
related: stats-section.md, hero-section.md
---

# Testimonial Card Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | Star rating (1-5 filled stars) | Left aligned |
| Middle | Blockquote with quotation marks | Full width |
| Bottom | Avatar (40x40) + Name + Role + Company | Flex row, gap-3 |

**Research: Real photos outperform illustrations. Specific quotes with metrics outperform generic praise. Include company name for B2B credibility.**

## Components (shadcn/ui)

- Card: rounded-2xl with border and padding
- Avatar: 40x40 rounded-full image
- Star icons: filled for active, muted for inactive

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| card-radius | rounded-2xl | Consistent corners |
| star-active | fill-yellow-400 text-yellow-400 | Filled star |
| star-inactive | text-muted-foreground | Empty star |
| quote-color | text-muted-foreground | Quote text |
| avatar-size | 40x40px | Author photo |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Card | opacity 0->1, y 20->0 | 0.4s on scroll |
| Stars | Sequential fill on view | 0.1s stagger |
| Hover | whileHover: y -2 | 0.2s |

## Gemini Design Prompt

> "Create a testimonial card with 5-star rating row, blockquote with quotation styling, and author section with avatar (40x40), name, role, and company. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Subtle hover lift. Real photo placeholder for avatar, not illustration."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Card, Avatar |
| Laravel Blade | Visual spec -> Livewire Flux card |
| Swift/SwiftUI | Visual spec -> VStack with Image + Text |

## Validation Checklist

- [ ] Star rating with filled/unfilled distinction
- [ ] Blockquote semantics (not just styled div)
- [ ] Avatar uses real photo placeholder, not icon
- [ ] Author info includes name + role + company
- [ ] OKLCH colors, no hard-coded hex, no Inter/Roboto
