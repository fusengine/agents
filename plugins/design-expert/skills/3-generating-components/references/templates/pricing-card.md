---
name: pricing-card
description: Single pricing tier card with features list and popular badge
when-to-use: Individual pricing plan cards — use pricing-cards.md for the full 3-tier section
keywords: pricing, card, features, popular, subscription
priority: high
related: pricing-cards.md
---

# Pricing Card Template (Single Tier)

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Single pricing card — isolated tier, popular or standard variant</component>
    <aesthetics>Conversion card — price is the visual anchor. Card has two visual modes: standard (glass/outlined) and popular (solid primary fill). Popular badge is absolute-positioned above the card top edge, never inline. CTA spans full card width at the bottom</aesthetics>
    <typography>
      - Plan name: var(--font-display), 1.25rem, font-weight 700
      - Plan description: var(--font-body), 0.875rem, color oklch(var(--muted-foreground))
      - Price: var(--font-display), 3.5rem, font-weight 800
      - Price suffix (/mo, /yr): var(--font-body), 1rem, font-weight 400, color muted-foreground, aligned bottom
      - Feature item: var(--font-body), 0.875rem, line-height 1.5
      - Popular badge: var(--font-mono), 0.7rem, uppercase, tracking-widest
    </typography>
    <color_system>
      Standard card:
      - bg: oklch(var(--card)), border: oklch(var(--border))
      - checkmark: oklch(var(--primary))
      - CTA: outline variant, border oklch(var(--primary)), text oklch(var(--primary))

      Popular card:
      - bg: oklch(var(--primary)), border: none
      - text: oklch(var(--primary-foreground))
      - shadow: shadow-2xl shadow-primary/30
      - checkmark: oklch(var(--primary-foreground))
      - CTA: bg oklch(var(--primary-foreground)), text oklch(var(--primary))

      Badge: bg oklch(var(--accent)), text oklch(var(--accent-foreground))
    </color_system>
    <spacing>Card padding p-8. Features space-y-3. Price block: mt-6 mb-8. CTA: mt-auto (flex column, card is flex flex-col). Badge: absolute -top-3.5 left-1/2 -translate-x-1/2</spacing>
    <states>
      - Default: card at rest, full content visible
      - Hover: translateY -4px, standard — shadow-lg shadow-primary/10; popular — shadow-2xl shadow-primary/40
      - CTA hover: standard — bg-primary/10; popular — bg-primary-foreground/90
      - CTA active: scale 0.98
      - CTA loading: Loader2 spinner, disabled, no layout shift
      - CTA disabled: opacity-60, cursor-not-allowed
      - Feature not included: line-through + opacity-40 on text, X icon instead of check
    </states>
    <animations>Framer Motion: whileHover y -4, spring stiffness 300 damping 20. Badge: initial scale 0.8 opacity 0, animate scale 1 opacity 1, 0.3s spring. CTA loading: rotate spinner 360deg, 1s linear infinite</animations>
    <forbidden>
      - No inline "Most Popular" badge (must be absolute, above card edge)
      - No equal CTA styling between standard and popular
      - No price without suffix (/mo or /yr)
      - No feature list longer than 7 items
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Card Variants

| Variant | bg | CTA | Shadow |
|---------|----|-----|--------|
| Standard | oklch(var(--card)) | Outline | shadow-sm |
| Popular | oklch(var(--primary)) | Inverted filled | shadow-2xl |

## Validation Checklist

- [ ] Badge: absolute -top-3.5, centered, never inline
- [ ] Price visually dominant (3.5rem+ font size)
- [ ] CTA variant differs: standard outline vs popular filled-inverted
- [ ] All CTA states: default, hover, active, loading, disabled
- [ ] Feature "not included" styling distinct from included
- [ ] OKLCH CSS variables only, no hard-coded hex
