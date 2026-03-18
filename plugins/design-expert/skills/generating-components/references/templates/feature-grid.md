---
name: feature-grid
description: Responsive feature grid with icons, stagger scroll reveal, and hover lift
when-to-use: Displaying product features or benefits in a visual grid layout
keywords: features, grid, icons, stagger, scroll-reveal
priority: high
related: hero-section.md, stats-section.md
---

# Feature Grid Template

## MCP Call

```
Tool: mcp__gemini-design__create_frontend
Parameters:
  request: |
    <component>Feature grid — 6-9 cards, responsive 1→2→3 columns, scroll-triggered stagger</component>
    <aesthetics>Structured clarity — uniform card height, consistent icon treatment, no decorative gradients per card. One focal card allowed (spanning 2 cols) if 6-item grid. Cards use subtle border, not heavy shadow</aesthetics>
    <typography>
      - Section title: var(--font-display), clamp(1.75rem, 4vw, 2.75rem), font-weight 700
      - Card title: var(--font-body), 1rem, font-weight 600, color oklch(var(--foreground))
      - Card description: var(--font-body), 0.875rem, line-height 1.6, color oklch(var(--muted-foreground))
    </typography>
    <color_system>
      - Section bg: oklch(var(--background))
      - Card bg: oklch(var(--card))
      - Card border: oklch(var(--border))
      - Icon container bg: oklch(var(--primary) / 0.1)
      - Icon color: oklch(var(--primary))
      - Card hover border: oklch(var(--primary) / 0.4)
    </color_system>
    <spacing>Section py-20 md:py-32. Grid gap-6 md:gap-8. Card padding p-6. Icon container: w-12 h-12 (48px), rounded-lg, mb-4. Title mt-3. Description mt-2</spacing>
    <states>
      - Default: card border oklch(var(--border)), icon bg oklch(var(--primary)/0.1)
      - Hover: card translateY -4px, border-color oklch(var(--primary)/0.4), shadow-lg shadow-primary/5
      - Focus-visible: outline oklch(var(--ring)) 2px offset 2px (keyboard nav)
      - Loading skeleton: animate-pulse bg-muted on all content areas
      - Empty (0 features): render null — never show empty grid
      - Disabled card (coming soon): opacity 0.5, cursor-not-allowed, no hover effect
    </states>
    <animations>Framer Motion whileInView staggerChildren 0.08s, once: true, margin -100px. Each card: opacity 0→1, y 20→0, 0.4s easeOut. Hover: whileHover y -4, transition spring stiffness 400 damping 25. Icons: no independent animation (visual noise)</animations>
    <forbidden>
      - No gradient backgrounds per card (uniform treatment only)
      - No mixing icon families or stroke widths
      - No more than 9 feature cards
      - No animated icons (spinning, bouncing icons distract)
      - No Inter/Roboto/Arial
      - No hard-coded hex
      - No decorative lines or border-left accents on cards
    </forbidden>
  techStack: "React + Tailwind CSS + shadcn/ui + Framer Motion"
  context: "<inject full design-system.md content here>"
```

## Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| mobile | 1 | gap-6 |
| md (768px) | 2 | gap-8 |
| lg (1024px) | 3 | gap-8 |

## Validation Checklist

- [ ] Grid responsive: 1 → 2 → 3 columns
- [ ] Stagger reveal on scroll intersection, not on page load
- [ ] Icons consistent: same pack, same stroke width
- [ ] Max 6-9 features displayed
- [ ] All states handled: default, hover, focus, loading, empty, disabled
- [ ] OKLCH CSS variables only, no hard-coded hex
