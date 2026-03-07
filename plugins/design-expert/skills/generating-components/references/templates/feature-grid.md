---
name: feature-grid
description: Responsive feature grid with icons, stagger scroll reveal, and hover lift
when-to-use: Displaying product features or benefits in a visual grid layout
keywords: features, grid, icons, stagger, scroll-reveal
priority: high
related: hero-section.md, stats-section.md
---

# Feature Grid Spec

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Header | Section title + subtitle (optional) | Centered |
| Grid | Feature cards: icon + title + description | 1-col -> 2-col -> 3-col |
| Card | Icon container (48x48) + title + desc | Consistent padding p-6 |

**Best practice: 6-9 features maximum. Icons must be from the same pack with consistent stroke width.**

## Components (shadcn/ui)

- Card: rounded-2xl with border and bg-card
- Icon container: rounded-lg bg-primary/10, 48x48px

## Design Tokens

| Token | Value | Notes |
|-------|-------|-------|
| grid-gap | gap-8 | Consistent spacing |
| card-radius | rounded-2xl | Card corners |
| icon-bg | bg-primary/10 | Icon background |
| icon-color | text-primary | Icon foreground |
| icon-size | h-6 w-6 | Inside 48x48 container |

## Animation (Framer Motion)

| Element | Animation | Duration |
|---------|-----------|----------|
| Container | staggerChildren: 0.1s | On scroll intersection |
| Cards | opacity 0->1, y 20->0 | 0.4s |
| Cards hover | whileHover: y -4, shadow increase | 0.2s |
| Viewport | once: true, margin: "-100px" | Trigger early |

## Gemini Design Prompt

> "Create a responsive feature grid section with section heading, 6 feature cards arranged in 1->2->3 column grid. Each card has an icon in a rounded container (bg-primary/10), title, and description. Stagger scroll reveal with Framer Motion whileInView. Hover lift effect. Use design-system.md tokens. OKLCH colors, no Inter/Roboto. Icons from same family with consistent stroke."

## Multi-Stack Adaptation

| Stack | Implementation |
|-------|---------------|
| React + shadcn | Gemini Design MCP with Card, responsive grid |
| Laravel Blade | Visual spec -> Livewire Flux grid component |
| Swift/SwiftUI | Visual spec -> LazyVGrid with adaptive columns |

## Validation Checklist

- [ ] Grid responsive: 1 -> 2 -> 3 columns
- [ ] Stagger reveal on scroll, not on page load
- [ ] Icons consistent (same pack, same stroke width)
- [ ] Max 6-9 features displayed
- [ ] OKLCH colors, no hard-coded hex, no Inter/Roboto
