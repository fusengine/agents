---
name: color-system
description: Color system
---

# Color System

## FORBIDDEN

- Purple gradients (from-purple-* to-pink-*)
- Indigo/blue defaults
- Random hex codes without system
- Timid, evenly-distributed palettes

## CSS VARIABLES (MANDATORY - OKLCH)

```css
:root {
  /* Primary palette - OKLCH for P3 wide gamut */
  --color-primary: oklch(45% 0.2 260);
  --color-primary-foreground: oklch(98% 0.01 260);

  /* Accent - Sharp, distinctive */
  --color-accent: oklch(70% 0.19 145);
  --color-accent-foreground: oklch(20% 0.02 145);

  /* Surfaces */
  --color-background: oklch(99% 0.005 260);
  --color-foreground: oklch(15% 0.02 260);
  --color-surface: oklch(98% 0.008 260);
  --color-surface-elevated: oklch(100% 0 0);

  /* Muted */
  --color-muted: oklch(95% 0.01 260);
  --color-muted-foreground: oklch(45% 0.02 260);

  /* Borders */
  --color-border: oklch(90% 0.01 260);

  /* Semantic */
  --color-destructive: oklch(55% 0.22 25);
  --color-success: oklch(60% 0.18 145);
  --color-warning: oklch(75% 0.15 85);

  /* Charts */
  --color-chart-1: oklch(55% 0.2 260);
  --color-chart-2: oklch(65% 0.18 145);
  --color-chart-3: oklch(70% 0.15 85);
  --color-chart-4: oklch(60% 0.2 25);
  --color-chart-5: oklch(55% 0.15 300);
}

.dark {
  --color-primary: oklch(65% 0.2 260);
  --color-primary-foreground: oklch(15% 0.02 260);
  --color-background: oklch(12% 0.02 260);
  --color-foreground: oklch(95% 0.01 260);
  --color-surface: oklch(18% 0.02 260);
  --color-surface-elevated: oklch(22% 0.02 260);
  --color-muted: oklch(25% 0.02 260);
  --color-muted-foreground: oklch(65% 0.02 260);
  --color-border: oklch(28% 0.02 260);
}
```

## INSPIRATION SOURCES

### IDE Themes

- VSCode One Dark
- Monokai Pro
- Dracula
- Nord

### Cultural Aesthetics

- Solarpunk (greens, golds, earth tones)
- Brutalism (monochrome + neon accent)
- Swiss Design (clean, geometric)

## PALETTE EXAMPLES (OKLCH)

### Cyberpunk

```css
--color-background: oklch(10% 0.02 260);
--color-accent-1: oklch(85% 0.25 145); /* Matrix green */
--color-accent-2: oklch(70% 0.25 330); /* Magenta */
--color-accent-3: oklch(85% 0.15 195); /* Cyan */
```

### Solarpunk

```css
--color-background: oklch(98% 0.03 95);
--color-primary: oklch(45% 0.15 145);
--color-accent: oklch(80% 0.18 85);
--color-earth: oklch(55% 0.02 60);
```

### Luxury

```css
--color-background: oklch(10% 0.01 260);
--color-gold: oklch(75% 0.12 85);
--color-cream: oklch(95% 0.02 95);
--color-charcoal: oklch(35% 0.02 240);
```

## TAILWIND V4 USAGE

```css
/* index.css - Map CSS vars to Tailwind */
@import "tailwindcss";

@theme inline {
  --color-background: var(--color-background);
  --color-foreground: var(--color-foreground);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-primary-foreground);
  --color-accent: var(--color-accent);
  --color-muted: var(--color-muted);
  --color-muted-foreground: var(--color-muted-foreground);
  --color-border: var(--color-border);
  --color-destructive: var(--color-destructive);
  --color-success: var(--color-success);
  --color-chart-1: var(--color-chart-1);
  --color-chart-2: var(--color-chart-2);
  --color-chart-3: var(--color-chart-3);
}
```

```tsx
/* Usage - Semantic tokens */
<div className="bg-background text-foreground">
  <span className="text-primary">Primary</span>
  <span className="text-muted-foreground">Muted</span>
</div>

/* Charts - Use CSS variables */
<Bar fill="var(--color-chart-1)" />
<Cell fill="var(--color-chart-2)" />
```
