---
name: pricing-cards
description: Complete 3-tier pricing section with annual/monthly toggle
when-to-use: SaaS landing pages with multiple pricing plans and billing toggle
keywords: pricing, tiers, toggle, annual, comparison
priority: high
related: pricing-card.md, hero-section.md
---

# Pricing Cards Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>3-tier pricing section — Starter / Pro / Enterprise, annual/monthly toggle</component>
    <aesthetics>Hierarchy-first — Pro tier must visually dominate (solid primary bg, elevated). Starter and Enterprise use glass treatment. Toggle is the only interactive control above cards. "Most Popular" badge must not look like an afterthought</aesthetics>
    <typography>
      - Section title: var(--font-display), clamp(1.75rem, 4vw, 2.75rem), font-weight 700
      - Price amount: var(--font-display), 3rem, font-weight 800
      - Price period: var(--font-body), 0.875rem, font-weight 400, color muted-foreground
      - Feature list: var(--font-body), 0.875rem, line-height 1.6
      - Popular badge: var(--font-mono), 0.7rem, uppercase, tracking-widest
    </typography>
    <color_system>
      - Popular card bg: oklch(var(--primary))
      - Popular card text: oklch(var(--primary-foreground))
      - Popular card shadow: shadow-2xl shadow-primary/30
      - Glass card bg: bg-white/10, backdrop-blur-xl, border-white/20
      - Toggle active: oklch(var(--primary))
      - Toggle track inactive: oklch(var(--muted))
      - "Save 20%" badge: oklch(var(--accent)), font-weight 600
      - Checkmark icon: oklch(var(--primary)) on glass cards, oklch(var(--primary-foreground)) on popular
    </color_system>
    <spacing>Cards grid gap-6 lg:gap-8. Popular card: scale-y 1.04 transform or py-2 extra padding to elevate. Card padding p-8. Feature list space-y-3. CTA button: mt-8, w-full</spacing>
    <states>
      - Toggle OFF (monthly): show monthly price, no savings badge
      - Toggle ON (annual): show annual price (÷12), "Save 20%" badge visible
      - Price change transition: AnimatePresence crossfade, 0.25s, key on price string
      - Card hover: translateY -8px, spring stiffness 300
      - CTA hover: popular — bg-primary-foreground/10; others — bg-primary/10
      - CTA loading (after click): spinner replaces text, disabled state
      - CTA disabled: opacity-60, cursor-not-allowed
    </states>
    <animations>Framer Motion: cards staggerChildren 0.1s, y 30→0, opacity 0→1, 0.5s. Toggle knob: layoutId animation 0.2s. Price: AnimatePresence mode="wait" with key prop. Card hover: whileHover spring</animations>
    <forbidden>
      - No more than 3 tiers (4+ kills conversion by paradox of choice)
      - No monthly as default toggle (annual default = +25-35% revenue)
      - No equal visual weight across tiers (hierarchy is the point)
      - No feature list without checkmarks
      - No enterprise pricing shown (show "Contact us" CTA)
      - No Inter/Roboto/Arial
      - No hard-coded hex
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Tier Architecture

| Tier | Visual | CTA | Price |
|------|--------|-----|-------|
| Starter | Glass card | Outline | $9/mo |
| Pro | Solid primary, elevated | Filled inverted | $29/mo |
| Enterprise | Glass card | Outline | Contact |

## Validation Checklist

- [ ] Exactly 3 tiers, middle tier visually elevated
- [ ] Annual toggle default ON
- [ ] Price animates on toggle (AnimatePresence)
- [ ] All CTA states: default, hover, loading, disabled
- [ ] OKLCH CSS variables only, no hard-coded hex
