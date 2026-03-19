---
name: hero-glassmorphism
description: Hero section with glassmorphism card overlay and 3-layer depth background
when-to-use: Modern landing pages requiring visual depth with glass effect cards
keywords: hero, glassmorphism, gradient-orbs, backdrop-blur, depth
priority: high
related: hero-section.md
---

# Hero Glassmorphism Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Hero section — glassmorphism depth system, 3 distinct z-layers</component>
    <aesthetics>Atmospheric depth — two gradient orbs (primary + accent, blur 80-100px) on dark base, glass card surface floating above, text on glass reads at ≥4.5:1 contrast. Orbs must NOT overlap headline text directly</aesthetics>
    <typography>
      - Headline: var(--font-display), clamp(2.5rem, 6vw, 4.5rem), font-weight 800, color oklch(var(--foreground)), text-shadow: none
      - Subtitle: var(--font-body), 1.125rem, line-height 1.7, color oklch(var(--foreground) / 0.8)
      - Badge: var(--font-mono), 0.7rem, tracking-widest, uppercase
    </typography>
    <color_system>
      - Layer 1 base: oklch(var(--background))
      - Orb primary: oklch(var(--primary) / 0.2), filter blur(100px), w-96 h-96
      - Orb accent: oklch(var(--accent) / 0.15), filter blur(80px), w-72 h-72
      - Glass surface: bg-white/10 dark:bg-white/5, backdrop-blur-xl
      - Glass border: border-white/20 dark:border-white/10
      - Primary CTA: oklch(var(--primary)) bg, solid
      - Glass CTA: bg-white/10, backdrop-blur-sm, border-white/30
    </color_system>
    <spacing>Section min-h-screen. Content vertically centered. Glass preview card: mt-16, max-w-3xl mx-auto. Orb positioning: absolute, pointer-events-none</spacing>
    <states>
      - Default: orbs visible, glass card with shadow-2xl
      - Orb animation: float y -20→20, 6s ease-in-out infinite alternate
      - Glass card hover: translateY -8px, shadow increase, border-white/40
      - Glass CTA hover: bg-white/20, scale 1.02
      - Glass CTA active: scale 0.98, bg-white/15
      - Mobile: orbs scaled to 60%, glass card stacks to single column
    </states>
    <animations>Framer Motion: container staggerChildren 0.12s. Badge: scale 0.8→1 + opacity 0→1, 0.4s spring. Headline/subtitle: y 32→0 + opacity 0→1, 0.5s. Orbs: autonomous motion.div with animate prop, NOT whileHover</animations>
    <forbidden>
      - No solid-color background without orbs (defeats glassmorphism purpose)
      - No glass effect on text (only on card/surface elements)
      - No backdrop-blur without matching bg-white/X (invisible blur)
      - No more than 3 gradient orbs (visual noise)
      - No Inter/Roboto/Arial
      - No hard-coded hex colors
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Layer Architecture

| Layer | CSS | Purpose |
|-------|-----|---------|
| 1 — Base | bg-background | Solid foundation |
| 2 — Orbs | absolute, blur(80-100px) | Atmospheric depth |
| 3 — Glass surface | backdrop-blur-xl, bg-white/10 | Frosted overlay |

## Validation Checklist

- [ ] Exactly 3 distinct depth layers (base, orbs, glass)
- [ ] backdrop-blur-xl paired with bg-white/10 (never blur alone)
- [ ] Orbs do not overlap readable text content
- [ ] OKLCH CSS variables only, no hard-coded hex
- [ ] No Inter/Roboto/Arial fonts
- [ ] Hover lift on interactive glass elements
