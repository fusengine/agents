---
name: hero-section
description: Above-the-fold hero with badge, headline, dual CTAs, and social proof
when-to-use: Landing pages requiring a compelling value proposition above the fold
keywords: hero, landing, headline, cta, above-the-fold
priority: high
related: feature-grid.md, pricing-cards.md
---

# Hero Section Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Hero section — above the fold, primary conversion zone</component>
    <aesthetics>Editorial bold — large display type anchored left, negative space as a design element, one sharp accent color, no decorative gradients except a single subtle radial behind the headline</aesthetics>
    <typography>
      - Headline: var(--font-display), clamp(2.5rem, 6vw, 5rem), font-weight 800, letter-spacing -0.03em
      - Subtitle: var(--font-body), clamp(1rem, 2vw, 1.25rem), font-weight 400, line-height 1.6, max-w-2xl
      - Badge: var(--font-mono), 0.75rem, font-weight 500, uppercase tracking-widest
    </typography>
    <color_system>
      - Background: oklch(var(--background))
      - Headline accent span: oklch(var(--primary))
      - Badge bg: oklch(var(--primary) / 0.1), border oklch(var(--primary) / 0.3)
      - Primary CTA: bg oklch(var(--primary)), text oklch(var(--primary-foreground))
      - Secondary CTA: transparent bg, border oklch(var(--border)), text oklch(var(--foreground))
    </color_system>
    <spacing>Vertical padding py-24 md:py-40. Headline to subtitle gap: mt-6. Subtitle to CTAs: mt-10. CTAs row gap: gap-4</spacing>
    <layout>Badge → Headline (h1, left on md+, centered on mobile) → Subtitle → dual CTA row → social proof row. Max content width max-w-4xl</layout>
    <states>
      - Default: full content visible, badge animated in
      - Scroll: parallax drift on background element (translateY 30% of scrollY)
      - CTA hover: primary — scale 1.02 + shadow-lg; secondary — bg-foreground/5
      - CTA active: scale 0.98
      - Social proof avatars: overlap -space-x-2, tooltip on hover with name
    </states>
    <animations>Framer Motion staggerChildren 0.08s, delayChildren 0.15s. Each child: opacity 0→1, y 24→0, duration 0.5s easeOut. Background orb: autonomous pulse scale 1→1.15, 5s infinite</animations>
    <forbidden>
      - No Inter, Roboto, or Arial font families
      - No purple-to-pink gradient as main background
      - No centered layout on desktop (headline must be left-aligned on md+)
      - No more than 2 CTAs in the hero
      - No stock-photo hero images as background
      - No border-left accent indicators
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Layout

| Zone | Content | Responsive |
|------|---------|------------|
| Top | Badge pill (icon + label) | Centered mobile, left md+ |
| Headline | h1 clamp fluid, accent span | Left md+, centered mobile |
| Subtitle | paragraph max-w-2xl | Full width mobile |
| Actions | Primary CTA + Secondary CTA | Stack vertical mobile |
| Bottom | Avatars + metric text | Hidden on mobile (optional) |

## Validation Checklist

- [ ] Headline uses clamp fluid size, not fixed font-size
- [ ] Two CTAs with distinct visual hierarchy (filled vs outline)
- [ ] Stagger animation, NOT simultaneous entrance
- [ ] No Inter/Roboto/Arial — uses design-system.md tokens
- [ ] OKLCH CSS variables, no hard-coded hex values
- [ ] Left-aligned on desktop, centered on mobile
